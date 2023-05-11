import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';




//Creating a scene
const scene = new THREE.scene();
//Creating a Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0,1, 1000);
//Creating Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Cube
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial ({
    color: 0x005578
});

const cube = new THREE.Mesh (geometry.material);
scene.add(cube);
camera.position.z = 5;

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene.camera);
}
animate();


//const controls = new OrbitControls( camera, renderer.domElement );
//const loader = new GLTFLoader();