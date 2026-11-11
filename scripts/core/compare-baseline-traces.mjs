/** Compare actual full per-frame Core traces with an unmodified baseline.
 * Native mismatches may already exist. This script checks for new regressions,
 * never calls native parity successful unless the native comparator does.
 */
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {isDeepStrictEqual} from 'node:util';
const [baselinePath,candidatePath,baselineDir,candidateDir]=process.argv.slice(2);
if(!baselinePath||!candidatePath||!baselineDir||!candidateDir)
  throw Error('Usage: node compare-baseline-traces.mjs baseline-report candidate-report baseline-traces-dir candidate-traces-dir');
const baseline=JSON.parse(readFileSync(baselinePath,'utf8'));
const candidate=JSON.parse(readFileSync(candidatePath,'utf8'));
if(baseline.group!==candidate.group||baseline.nativeCaptureSha256!==candidate.nativeCaptureSha256)
  throw Error('Native capture identity differs');
if(!Array.isArray(baseline.cases)||!Array.isArray(candidate.cases)||
 baseline.cases.length!==candidate.cases.length)throw Error('Case list length mismatch');
let matched=0,firstDifference=null;
for(let i=0;i<baseline.cases.length;i++){
  const a=baseline.cases[i],b=candidate.cases[i];
  if(a.id!==b.id)throw Error('Case names differ at '+i);
  const baseTrace=join(baselineDir,a.id+'-trace.json');
  const branchTrace=join(candidateDir,a.id+'-trace.json');
  if(!existsSync(baseTrace)||!existsSync(branchTrace))throw Error('Missing full trace for '+a.id);
  const before=JSON.parse(readFileSync(baseTrace,'utf8'));
  const after=JSON.parse(readFileSync(branchTrace,'utf8'));
  if(isDeepStrictEqual(before,after))matched++;
  else if(firstDifference===null)firstDifference=a.id;
}
const equal=matched===baseline.cases.length;
console.log(JSON.stringify({scope:'Full per-tick candidate-vs-baseline comparison; not native parity',
  group:baseline.group,caseCount:baseline.cases.length,
  baselineNativeDifferences:baseline.differentFields,
  candidateNativeDifferences:candidate.differentFields,
  identicalCaseTraces:matched,firstDifferentCase:firstDifference,identicalToBaseline:equal,
  note:'Native compatibility can fail for both versions even when full Core traces match.'},null,2));
if(!equal)process.exitCode=1;
