# Authorship and distribution boundary

Kenjatime Core's parser, expression compiler/interpreter, fixed-tick combat, command scheduler, interaction rules, sprite renderer and library integration are independently authored Kenjatime implementation. Earlier independently authored JavaScript modules are reused; the previous external engine implementation is not translated or relabeled as original work.

The compiler emits standard numeric WebAssembly directly. Its imports are this runtime's typed trigger API and ECMAScript math functions. It uses neither an external engine VM nor a Go/WASI runtime. Unsupported compilation paths use Kenjatime's own interpreter.

The renderer uses Three.js's public scene API. Indexed sprites and palette textures remain on the GPU. Three.js itself is third-party code. Archive decoding, tracker decoding, platform integration and the included character are also third-party components/data and keep their notices. “Independent engine” does not mean those libraries were authored here.

The match-script adapter is independently authored around the third-party Lua 5.4 VM provided by wasmoon. Lua and wasmoon retain their MIT notices. This adapter exposes match hooks and a bounded subset of public scripting APIs; it does not load a reference engine or its interface scripts.

The source repository retains the historical adapters, notices, fixtures and capture provenance for recovery and regression work. They are not part of the independent runtime distribution. `npm run build` disables public-directory copying, checks each main/worker module graph against `source-policy.json`, hashes project source inputs into build evidence, and rejects forbidden payloads. This is a dependency boundary check, not a legal certification of authorship or a declaration of universal compatibility.

Native captures are read-only observations used by authored QA recipes. The comparison tool never loads a reference engine implementation and never rewrites an expected capture to accept a mismatch. Complete moveset, extended scripting and advanced stage parity remain open work.
