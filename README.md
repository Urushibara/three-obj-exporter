## three-three-obj-exporter

threejs offical apply OBJExporter.js with npm

## install

`npm i --save three-obj-exporter`

## usage

```js

import * as THREE from 'three'
import {OBJExporter} from 'three-obj-exporter'

let exporter = new OBJExporter();
exporter.parse(mesh)

```