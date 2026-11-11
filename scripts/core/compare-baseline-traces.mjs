/** Assert that the feature branch introduces no additional per-frame native
 * comparison differences beyond the pre-existing unmodified Core baseline.
 * This is NOT a native compatibility certification.
 */
import {readFileSync} from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
const [baselinePath,candidatePath]=process.argv.slice(2);
if(!baselinePath||!candidatePath)throw Error('Usage: node compare-baseline-traces.mjs baseline.json candidate.json');
const baseline=JSON.parse(readFileSync(baselinePath,'utf8'));
const candidate=JSON.parse(readFileSync(candidatePath,'utf8'));
function extract(report){
  if(!Array.isArray(report.cases))throw Error('Native comparison has no cases');
  return report.cases.map(entry=>({id:entry.id,differences:entry.differences||[]}));
}
const a=extract(baseline),b=extract(candidate);
if(baseline.group!==candidate.group)throw Error('Compared groups differ');
const equal=isDeepStrictEqual(a,b);
const baselineFailures=a.filter(v=>v.differences.length).length;
const branchFailures=b.filter(v=>v.differences.length).length;
console.log(JSON.stringify({scope:'Compare candidate divergences with baseline; not native parity',
  group:baseline.group,baselineMatched:baseline.matched,candidateMatched:candidate.matched,
  cases:a.length,baselineCasesWithDifferences:baselineFailures,
  candidateCasesWithDifferences:branchFailures,identicalDifferences:equal},null,2));
if(!equal)process.exitCode=1;
