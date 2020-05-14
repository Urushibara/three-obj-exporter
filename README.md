## usage

```js

let exporter = new OBJExporter();

// Single mesh
let result = exporter.parse(mesh);

```

```js

// All meshes
let result = exporter.parse(scene);

```

```js

let exporter = new OBJExporter();

exporter.parse(mesh);

// MTL export ( must be after 'parse()' )
let mtl = exporter.generate_mtl();

```
