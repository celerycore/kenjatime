"""Compare saved CPU measurements, complete behavior hashes and rendered PNGs."""
from pathlib import Path
from PIL import Image, ImageChops, ImageStat
import argparse, json
parser=argparse.ArgumentParser()
parser.add_argument('before',type=Path);parser.add_argument('after',type=Path)
parser.add_argument('--output',type=Path,default=Path('work/performance-comparison.json'))
args=parser.parse_args();before=json.loads(args.before.read_text());after=json.loads(args.after.read_text())
results={}
for name,old in before['scenes'].items():
    new=after['scenes'][name]
    assert old['behaviorSha256']==new['behaviorSha256'],name+' changed simulation/entity/effect results'
    a=Image.open(args.before.with_suffix('')/(name+'.png')).convert('RGBA')
    b=Image.open(args.after.with_suffix('')/(name+'.png')).convert('RGBA')
    assert a.size==b.size,(name,a.size,b.size)
    diff=ImageChops.difference(a,b);maximum=max(channel[1] for channel in diff.getextrema())
    assert maximum<=3,(name,'visual tolerance exceeded',maximum)
    assert new['readbacks']==0,(name,'routine pixel readbacks remain')
    results[name]={'beforeP50Ms':old['renderP50Ms'],'afterP50Ms':new['renderP50Ms'],'beforeP95Ms':old['renderP95Ms'],'afterP95Ms':new['renderP95Ms'],
                   'p95ReductionPercent':100*(1-new['renderP95Ms']/old['renderP95Ms']),
                   'beforeSlowFrames':old['renderOver16_7Ms'],'afterSlowFrames':new['renderOver16_7Ms'],
                   'beforeReadbacks':old['readbacks'],'afterReadbacks':new['readbacks'],
                   'behaviorEqual':True,'maxChannelDifference':maximum,'meanChannelDifference':ImageStat.Stat(diff).mean}
result={'beforeEnvironment':before['environment'],'afterEnvironment':after['environment'],'visualTolerance':3,'scenes':results}
args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(results,indent=2))
