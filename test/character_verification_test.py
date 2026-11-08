"""No browser, native executable or third-party Python packages required."""
from pathlib import Path
from zipfile import ZipFile
import copy, importlib.util, sys, unittest

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'scripts'))
from character_verification import RELEASE_SHA, inventory, kfm_cases, inject_driver, motion, compare_reports, normalize_trace
spec=importlib.util.spec_from_file_location('verify_characters',ROOT/'scripts/verify-characters.py')
runner=importlib.util.module_from_spec(spec);spec.loader.exec_module(runner)

def reports():
    player={'state':200,'time':1,'life':1000,'power':1500,'x':-16.0,'y':0,'facing':1,'ctrl':True,'stateOwner':1,'animationOwner':1,'helperCount':0,'projectileCount':0,'variables':[0]*6}
    opponent={**player,'state':0,'life':977,'x':16,'facing':-1,'stateOwner':2,'animationOwner':2}
    native={'character':'fixture','resourcesSha256':'1'*64,'planSha256':'2'*64,'provenance':{'kind':'native-ikemen','releaseSha256':RELEASE_SHA},'cases':[{'id':'punch','timedOut':False,'samples':[{'tick':1,'player':player,'opponent':opponent,'pause':0}]}]}
    web=copy.deepcopy(native);web['provenance']={'kind':'web-go-wasm'}
    return native,web

class CharacterVerificationTest(unittest.TestCase):
    def test_matching_native_and_go_wasm_samples(self):
        native,web=reports();self.assertTrue(compare_reports(native,web)['matched'])

    def test_legacy_or_web_data_cannot_be_a_native_reference(self):
        native,web=reports();native['provenance']['kind']='web-runtime'
        with self.assertRaises(ValueError):compare_reports(native,web)

    def test_an_unpinned_native_release_is_rejected(self):
        native,web=reports();native['provenance']['releaseSha256']='unverified'
        with self.assertRaises(ValueError):compare_reports(native,web)

    def test_candidate_must_be_the_shipping_go_vm(self):
        native,web=reports();web['provenance']['kind']='legacy-javascript'
        with self.assertRaises(ValueError):compare_reports(native,web)

    def test_different_resources_or_inputs_cannot_be_compared(self):
        for key in ['resourcesSha256','planSha256','character']:
            native,web=reports();web[key]='different'
            with self.assertRaises(ValueError):compare_reports(native,web)

    def test_integer_damage_and_pause_differences_are_never_tolerated(self):
        for field,delta in [('life',1e-6),('power',1),('time',1)]:
            native,web=reports();web['cases'][0]['samples'][0]['player'][field]+=delta
            self.assertFalse(compare_reports(native,web)['matched'])

    def test_small_coordinate_rounding_has_a_bounded_tolerance(self):
        native,web=reports();web['cases'][0]['samples'][0]['player']['x']+=1e-6
        self.assertTrue(compare_reports(native,web)['matched'])
        web['cases'][0]['samples'][0]['player']['x']+=.01
        self.assertFalse(compare_reports(native,web)['matched'])
        for tolerance in [float('nan'),1,-1]:
            with self.assertRaises(ValueError):compare_reports(native,web,tolerance)

    def test_state_owner_and_palette_mismatches_remain_visible(self):
        for field in ['stateOwner','animationOwner']:
            native,web=reports();web['cases'][0]['samples'][0]['player'][field]=2
            self.assertFalse(compare_reports(native,web)['matched'])

    def test_a_missing_null_field_is_still_a_difference(self):
        native,web=reports();native['cases'][0]['samples'][0]['player']['optional']=None
        d=compare_reports(native,web);self.assertFalse(d['matched']);self.assertIn('optional',d['differences'][0]['path'])

    def test_missing_scenarios_and_truncated_samples_are_not_matches(self):
        native,web=reports();extra=copy.deepcopy(native['cases'][0]);extra['id']='second';native['cases'].append(extra)
        result=compare_reports(native,web);self.assertFalse(result['matched']);self.assertEqual(result['differences'][0]['path'],'cases.length')
        native,web=reports();sample=copy.deepcopy(native['cases'][0]['samples'][0]);sample['tick']=2;native['cases'][0]['samples'].append(sample)
        self.assertFalse(compare_reports(native,web)['matched'])

    def test_duplicate_shifted_boolean_and_missing_frames_are_rejected(self):
        for ticks in [[1,1],[2],[True],[1,3]]:
            native,web=reports();sample=web['cases'][0]['samples'][0];web['cases'][0]['samples']=[{**copy.deepcopy(sample),'tick':t} for t in ticks]
            with self.assertRaises(ValueError):compare_reports(native,web)

    def test_empty_fighter_or_scenario_data_is_rejected(self):
        native,web=reports();web['cases']=[]
        with self.assertRaises(ValueError):compare_reports(native,web)
        native,web=reports();del web['cases'][0]['samples'][0]['opponent']
        with self.assertRaises(ValueError):compare_reports(native,web)

    def test_matching_idle_traces_do_not_verify_an_unexecuted_move(self):
        native,web=reports();native['cases'][0]['samples'][0]['player']['state']=0
        plan={'cases':[{'id':'punch','expected':[200]}]}
        self.assertFalse(runner.coverage(native,plan)['passed'])

    def test_inventory_preserves_duplicate_bindings_and_source_lines(self):
        source=b'[Command]\nname="a;name" ;comment\ncommand=x\n[Command]\nname="a;name"\ncommand=y\n[State -1, Attack]\ntype=ChangeState\nvalue=200\ntrigger1=command="a;name"\n'
        inv=inventory(source);self.assertEqual(inv['commands']['a;name'],['x','y']);self.assertEqual(inv['entries'][0]['line'],7);self.assertEqual(inv['entries'][0]['commands'],['a;name'])

    def test_matching_attack_states_without_fixture_contact_damage_do_not_pass(self):
        native,_=reports();native['cases'][0]['id']='direct-hit'
        plan={'cases':[{'id':'direct-hit','expected':[200]}]}
        self.assertFalse(runner.coverage(native,plan)['passed'])
        native['cases'][0]['samples'][0]['opponent']['life']=940
        self.assertTrue(runner.coverage(native,plan)['passed'])

    def test_every_kfm_command_entry_has_an_explicit_case(self):
        with ZipFile(ROOT/'public/kfm.zip') as z:cmd=z.read('kfm/kfm.cmd')
        cases,inv=kfm_cases(cmd,'full');covered={c.get('entry') for c in cases}
        self.assertTrue(all(e['line'] in covered for e in inv['entries']))
        self.assertEqual({c['facing'] for c in cases if c.get('entry')},{1,-1})
        self.assertEqual(len(inv['entries']),36)

    def test_inputs_for_all_cases_remain_inside_the_global_state(self):
        original=b'[Statedef -3]\n[State Original]\ntype=Null\ntrigger1=1\n'
        files={'c/f.def':b'[Info]\nlocalcoord=320,240\n[Files]\ncmd=f.cmd\ncns=f.cns\nst=f.cns\n','c/f.cmd':b'','c/f.cns':original}
        cases=[{'id':'one','input':motion('x')},{'id':'two','input':motion('y')}]
        changed,driver=inject_driver(files,'c/f.def',cases)
        negative=changed['c/qa-driver.cns'].split(b'[Statedef 9000001]')[0]
        self.assertEqual(negative.count(b'type=AssertInput'),2)
        self.assertEqual(changed['c/f.cns'],original)
        self.assertNotEqual(driver['originVar'],driver['caseVar'])

    def test_existing_global_code_is_rejected_instead_of_overwritten(self):
        files={'c/f.def':b'[Files]\ncns=f.cns\nst=f.cns\n','c/f.cns':b'[Statedef -2]\n'}
        with self.assertRaisesRegex(ValueError,'preserve'):inject_driver(files,'c/f.def',[{'id':'one','input':[]}])

    def test_crouch_and_double_tap_inputs_include_the_required_holds_and_release(self):
        crouch=motion('x','crouch');self.assertTrue(all('D' in s['keys'] for s in crouch))
        taps=motion('F,F');self.assertTrue(any(s['keys']==[] for s in taps))

    def test_charged_motions_require_a_curated_hold_instead_of_silent_conversion(self):
        with self.assertRaisesRegex(ValueError,'explicit timed recipe'):motion('~60B,F,x')

    def test_empty_lua_arrays_are_normalized_without_losing_nulls(self):
        self.assertEqual(normalize_trace({'helpers':{},'other':None}),{'helpers':[],'other':None})

if __name__=='__main__':unittest.main()
