## three-three-obj-exporter-t

threejs offical apply OBJExporter.js with npm

## install

`npm i --save three-obj-exporter-t`

## usage

```js

import * as THREE from 'three'
import {OBJExporter} from 'three-obj-exporter-t'

let exporter = new OBJExporter();
exporter.parse(mesh)

```