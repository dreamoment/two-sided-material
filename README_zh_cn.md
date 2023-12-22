<h1 align="center">two-sided-material</h1>

![](/docs/preview.gif)

语言: [English](README.md) | 中文简体

## two-sided-material 是什么 ?

实现物体X光透视效果，就像存在平行世界一样。

## 特性

- 轻量易用

- 依赖于`three.js`，不强制要求`three.js`版本

- 支持`typescript`

## 安装

```agsl
npm i @dreamoment/two-sided-material
```

## 示例

```
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ParaWorld from '../package/index'


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )
const ambientLight = new THREE.AmbientLight(0xffffff)
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(1, 1, 1)
scene.add(ambientLight, directionalLight)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

camera.position.y += 10


// edit scene
const createWall = () => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshPhysicalMaterial({ color: 0x00ff00 }))
  return mesh
}
const _player = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhysicalMaterial({ color: 0xff0000 }))
const _wall1 = createWall()
const _wall2 = createWall()
const _wall3 = createWall()
_wall1.position.set(0, 0, 3)
_wall2.position.set(3, 0, 3)
_wall3.position.set(6, 0, 3)
scene.add(_player, _wall1, _wall2, _wall3)

// enter para world
ParaWorld.createTargetByMaterial(_player, new THREE.MeshPhysicalMaterial({ color: 0x0000ff }))
ParaWorld.createCover(_wall1)
ParaWorld.createCover(_wall2)

const animate = () => {
  controls.update()
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', onWindowResize)
```

## API

### `static`renderOrder

渲染顺序，用作计算基准。

### `static`createTargetByMaterial

传递统一材质，创建可变换物体，例如: 玩家。（适用于单一材质的简单模型）

```
ParaWorld.createTargetByMaterial(target: THREE.Object3D, material: THREE.Material): THREE.Group
```

### `static`createTargetByObject3D

传递自定义物体，创建可变换物体，例如: 玩家。（适用于多材质的复杂模型）
该自定义物体，是基于源物体的、不同新材质的克隆体。

```
ParaWorld.createTargetByMaterial(target: THREE.Object3D, clone: THREE.Object3D): THREE.Group
```

### `static`createCover

创建遮挡物体，例如: 墙。

```
ParaWorld.createCover(target: THREE.Object3D): THREE.Group
```