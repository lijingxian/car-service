<template>
  <div class="sign-in-wall">
    <div id="container"></div>
    <div id="menu">
      <button id="table">TABLE</button>
      <button id="sphere">SPHERE</button>
      <button id="helix">HELIX</button>
      <button id="grid">GRID</button>
    </div>
  </div>
</template>

<script>
import * as THREE from '@/libs/three/three.js';
import TWEEN from '@/libs/three/tween.min.js';
require('@/libs/three/TrackballControls.js');
require('@/libs/three/CSS3DRenderer.js');

let camera, scene, renderer;
let controls;

let objects = [];
let targets = { table: [], sphere: [], helix: [], grid: [] };

let containerWidth = window.innerWidth - 280;
let containerHeight = window.innerHeight - 70;

let init = function(table) {
  camera = new THREE.PerspectiveCamera(40, containerWidth / containerHeight, 1, 10000);
  camera.position.z = 3000;

  scene = new THREE.Scene();

  // table

  for (let i = 0; i < table.length; i++) {
    let element = document.createElement('div');
    element.className = 'element';
    // element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

    let img = document.createElement('img');
    img.className = 'w-image';
    img.src = table[i].head;
    element.appendChild(img);

    let symbol = document.createElement('div');
    symbol.className = 'symbol';
    symbol.textContent = table[i].name;
    element.appendChild(symbol);

    let object = new THREE.CSS3DObject(element);
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    scene.add(object);

    objects.push(object);

    let objectNew = new THREE.Object3D();
    objectNew.position.x = table[i].p_x * 140 - 1330;
    objectNew.position.y = -(table[i].p_y * 180) + 990;

    targets.table.push(objectNew);
  }

  // sphere

  let vector = new THREE.Vector3();

  for (let i = 0, l = objects.length; i < l; i++) {
    let phi = Math.acos(-1 + (2 * i) / l);
    let theta = Math.sqrt(l * Math.PI) * phi;

    let object = new THREE.Object3D();

    object.position.setFromSphericalCoords(800, phi, theta);

    vector.copy(object.position).multiplyScalar(2);

    object.lookAt(vector);

    targets.sphere.push(object);
  }

  // helix

  let vectorHelix = new THREE.Vector3();

  for (let i = 0, l = objects.length; i < l; i++) {
    let theta = i * 0.175 + Math.PI;
    let y = -(i * 8) + 450;

    let object = new THREE.Object3D();

    object.position.setFromCylindricalCoords(900, theta, y);

    vectorHelix.x = object.position.x * 2;
    vectorHelix.y = object.position.y;
    vectorHelix.z = object.position.z * 2;

    object.lookAt(vectorHelix);

    targets.helix.push(object);
  }

  // grid

  for (let i = 0; i < objects.length; i++) {
    let object = new THREE.Object3D();

    object.position.x = (i % 5) * 400 - 800;
    object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
    object.position.z = Math.floor(i / 25) * 1000 - 2000;

    targets.grid.push(object);
  }

  //

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(containerWidth, containerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  //

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener('change', render);

  document.getElementById('table').addEventListener(
    'click',
    function() {
      transform(targets.table, 2000);
    },
    false
  );

  document.getElementById('sphere').addEventListener(
    'click',
    function() {
      transform(targets.sphere, 2000);
    },
    false
  );

  document.getElementById('helix').addEventListener(
    'click',
    function() {
      transform(targets.helix, 2000);
    },
    false
  );

  document.getElementById('grid').addEventListener(
    'click',
    function() {
      transform(targets.grid, 2000);
    },
    false
  );

  transform(targets.table, 2000);

  //

  window.addEventListener('resize', onWindowResize, false);
};

let transform = function(targets, duration) {
  TWEEN.removeAll();

  for (let i = 0; i < objects.length; i++) {
    let object = objects[i];
    let target = targets[i];

    new TWEEN.Tween(object.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
};

let onWindowResize = function() {
  camera.aspect = containerWidth / containerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(containerWidth, containerHeight);

  render();
};

let animate = function() {
  requestAnimationFrame(animate);

  TWEEN.update();

  controls.update();
};

let render = function() {
  renderer.render(scene, camera);
};

export default {
  name: 'SignInWall',
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      let table = [];
      for (let i = 0; i < 100; i++) {
        let item = {};
        item.name = i.toString();
        item.head = '/upload/image/201903/83b2d83a-d65d-4e9e-9116-938d5135d970.jpeg';
        item.p_x = (i % 18) + 1;
        item.p_y = Math.floor(i / 18) + 1;
        table.push(item);
      }
      init(table);
      animate();
    }
  }
};
</script>

<style lang="scss">
.sign-in-wall {
  #container {
    height: 700px;
  }
  #menu {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
  }
  .element {
    width: 120px;
    height: 120px;
    text-align: center;
    cursor: default;
  }

  .element .number {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    color: rgba(127, 255, 255, 0.75);
  }

  .element .symbol {
    position: absolute;
    top: 120px;
    left: 0px;
    right: 0px;
    font-size: 40px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.4);
  }

  .element .w-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .element .details {
    position: absolute;
    bottom: 15px;
    left: 0px;
    right: 0px;
    font-size: 12px;
    color: rgba(127, 255, 255, 0.75);
  }

  button {
    color: rgba(127, 255, 255, 0.75);
    background: transparent;
    outline: 1px solid rgba(127, 255, 255, 0.75);
    border: 0px;
    padding: 5px 10px;
    cursor: pointer;
  }
  button:hover {
    background-color: rgba(0, 255, 255, 0.5);
  }
  button:active {
    color: #000000;
    background-color: rgba(0, 255, 255, 0.75);
  }
}
</style>
