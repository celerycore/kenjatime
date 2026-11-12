import test from "node:test";
import assert from "node:assert/strict";
import { archivePickerConfig, archiveDocumentAccept, pickArchiveDocuments } from "../../src/archive-file-picker.js";

function fakeDocument() {
  let input;
  let clicked = 0;
  const doc = {
    createElement(tag) {
      assert.equal(tag, "input");
      input = {
        style: {}, files: [], removed: false, attrs: {},
        setAttribute(k,v) { this.attrs[k] = v; },
        remove() { this.removed = true; },
        click() { clicked++; },
      };
      return input;
    },
    body: {append(x) { assert.equal(x, input); }},
  };
  return {doc, current:()=>input, clicks:()=>clicked};
}

test("normal Android archive chooser is a single document request, not a media or multi picker", async () => {
  const config = archivePickerConfig();
  assert.equal(config.multiple, false);
  assert.notEqual(config.accept, "*/*");
  for (const ext of [".zip",".rar",".7z",".tar",".001"]) assert.ok(archiveDocumentAccept.includes(ext));
  assert.ok(archiveDocumentAccept.includes("application/octet-stream"));
  const doc = fakeDocument();
  const result = pickArchiveDocuments({},doc.doc);
  assert.equal(doc.clicks(), 1, "must click in the same user activation");
  assert.equal(doc.current().multiple, false);
  assert.equal(doc.current().accept,archiveDocumentAccept);
  assert.equal(doc.current().hidden, undefined, "avoid hidden input on OEM WebView");
  const file = {name:"fighter.rar"};
  doc.current().files = [file];
  doc.current().onchange();
  assert.deepEqual(await result,[file]);
  assert.equal(doc.current().removed,true);
});
test("split archive picker is explicitly multiple and accepts every part", async()=>{
  const doc=fakeDocument();
  const result=pickArchiveDocuments({multiple:true},doc.doc);
  assert.equal(doc.current().multiple,true);
  doc.current().files=[{name:"fighter.part01.rar"},{name:"fighter.part02.rar"}];
  doc.current().onchange();
  assert.equal((await result).length,2);
});
test("unrestricted browse remains a user-requested fallback, not default", async()=>{
  assert.equal(archivePickerConfig({allFiles:true}).accept,"*/*");
  const doc=fakeDocument(),result=pickArchiveDocuments({allFiles:true},doc.doc);
  assert.equal(doc.current().accept,"*/*");
  doc.current().oncancel();
  assert.equal(await result,null);
  assert.equal(doc.current().removed,true);
});
