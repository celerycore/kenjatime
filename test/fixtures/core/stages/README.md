# Original stage observation fixtures

The sprite pixels, palette and stage definitions were authored for this engine's QA. `cases.json` pins each native PNG and the SFF with SHA-256. The unchanged official v1.0.0 Linux executable recorded the images; its hash and the capture scope are in that manifest. No reference-engine implementation is included or read by the browser verifier.

The 320×180 captures use fixed cameras and a static 64×48 pattern. Native QA uses the bundled KFM data, the existing authored character driver, and `AssertSpecial` to hide fighters; the region of interest excludes the interface. It covers width-based perspective, tiling, inclusive windows, centered masks and a preprocessed floor at camera zero. These images do not verify moving-camera or mixed-coordinate semantics.

`npm run verify:core:stages` compiles the production Core/Three modules, renders them in software WebGL and compares every colored pixel in that region. A bidirectional one-pixel neighborhood permits OpenGL/WebGL raster-edge differences; interior differences, missing images and zero compared pixels fail. The report retains the edge count, draw counts, warm uploads and actual browser output. Expected native images are never generated from Core output.
