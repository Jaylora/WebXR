import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import *as dat from 'dat.gui';

//Create Scene
const scene = new THREE.Scene();
//Create Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Create Light

const myLight1 = new THREE.AmbientLight(0x404040, 3);
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );


//Create Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );



//Das Controllpanel
const gui = new dat.GUI();
const auswahlOptionen = {
    cubeColor: '#005578'
}

gui.addColor(options, 'cubeColor').onChange(function(e){
    cube.material.color.set(e);
});

//GEOMETRY


const planegeometry = new THREE.PlaneGeometry( 10, 10,5,5 );
const planematerial = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( planegeometry, planematerial );
plane.position.x = 0;
plane.position.y = -1;
plane.rotation.x = 90;


//Create Geometry
const cubegeometry = new THREE.BoxGeometry( 1, 1, 1 );
const cubematerial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( cubegeometry, cubematerial );
scene.add( cube );
scene.add( plane );
scene.add(myLight1);


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

camera.position.z = 5;
controls.update();


//Create Animation
function animate() {
	requestAnimationFrame( animate );
    cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();