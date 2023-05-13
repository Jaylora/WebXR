import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

let container;
let camera, scene, renderer;
let controllers;
var clicked;

init();
animate();
setupXR();

function init(){
    container = document.createElement( 'div' );
	document.body.appendChild( container );


    //CREATE SCENE
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x444444 );
    //CREATE CAMERA
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0,1.6,8);

    //Boden Texture
    const myBodenTextureLoader = new THREE.TextureLoader();
    const BodenBaseColor = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_basecolor.jpg');
    BodenBaseColor.wrapS = THREE.RepeatWrapping;
    BodenBaseColor.wrapT = THREE.RepeatWrapping;
    BodenBaseColor.repeat.set( 2, 25 )

    const BodenNormalMap = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_normal.jpg');
    BodenNormalMap.wrapS = THREE.RepeatWrapping;
    BodenNormalMap.wrapT = THREE.RepeatWrapping;
    BodenNormalMap.repeat.set( 2, 25 )

    const BodenHeightMap = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_height.png');
    BodenHeightMap.wrapS = THREE.RepeatWrapping;
    BodenHeightMap.wrapT = THREE.RepeatWrapping;
    BodenHeightMap.repeat.set( 2, 25 )

    const BodenRoughnessMap = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_roughness.jpg');
    BodenRoughnessMap.wrapS = THREE.RepeatWrapping;
    BodenRoughnessMap.wrapT = THREE.RepeatWrapping;
    BodenRoughnessMap.repeat.set( 25, 1 )

    const BodenAmbientOcclusionMap = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_ambientOcclusion.jpg');
    BodenAmbientOcclusionMap.wrapS = THREE.RepeatWrapping;
    BodenAmbientOcclusionMap.wrapT = THREE.RepeatWrapping;
    BodenAmbientOcclusionMap.repeat.set( 25, 1 )

    const BodenMetalic = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_metallic.jpg');
    BodenMetalic.wrapS = THREE.RepeatWrapping;
    BodenMetalic.wrapT = THREE.RepeatWrapping;
    BodenMetalic.repeat.set( 25, 1 )


    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128,{
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.SRGBColorSpace
    })

    const cubeCamera = new THREE.CubeCamera(1,10000, cubeRenderTarget);
    //CREATE PLANE

    const plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 100,100,100 ), new THREE.MeshStandardMaterial( {
        side: THREE.DoubleSide,
        map: BodenBaseColor, 
        normalMap: BodenNormalMap, 
        displacementMap: BodenHeightMap, 
        displacementScale: 0.7,
        roughnessMap: BodenRoughnessMap,
        roughness: 1,
        aoMap: BodenAmbientOcclusionMap,
        metalnessMap: BodenMetalic,
        metalness: 1,
        envMap: cubeRenderTarget.texture
    } ) );
    plane.position.x = 0;
    plane.position.y = -1;
    plane.position.z = -50;
    plane.rotation.set(Math.PI/2,0,0);
    plane.receiveShadow = true;
    //CREATE CUBE

    const cubegeometry = new THREE.BoxGeometry( 1, 1, 1 );
    const cubematerial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( cubegeometry, cubematerial );
    scene.add( cube );
    plane.add(cubeCamera);
    scene.add( plane );
    cube.castShadow = true;
    

    //Wand Texture
    const myTextureLoader = new THREE.TextureLoader();
    const tilesBaseColor = myTextureLoader.load('textures/Stone_Floor_006_basecolor.jpg');
    tilesBaseColor.wrapS = THREE.RepeatWrapping;
    tilesBaseColor.wrapT = THREE.RepeatWrapping;
    tilesBaseColor.repeat.set( 25, 1 )

    const tilesNormalMap = myTextureLoader.load('textures/Stone_Floor_006_normal.jpg');
    tilesNormalMap.wrapS = THREE.RepeatWrapping;
    tilesNormalMap.wrapT = THREE.RepeatWrapping;
    tilesNormalMap.repeat.set( 25, 1 )

    const tilesHeightMap = myTextureLoader.load('textures/Stone_Floor_006_height.png');
    tilesHeightMap.wrapS = THREE.RepeatWrapping;
    tilesHeightMap.wrapT = THREE.RepeatWrapping;
    tilesHeightMap.repeat.set( 25, 1 )

    const tilesRoughnessMap = myTextureLoader.load('textures/Stone_Floor_006_roughness.jpg');
    tilesRoughnessMap.wrapS = THREE.RepeatWrapping;
    tilesRoughnessMap.wrapT = THREE.RepeatWrapping;
    tilesRoughnessMap.repeat.set( 25, 1 )

    const tilesAmbientOcclusionMap = myTextureLoader.load('textures/Stone_Floor_006_ambientOcclusion.jpg');
    tilesAmbientOcclusionMap.wrapS = THREE.RepeatWrapping;
    tilesAmbientOcclusionMap.wrapT = THREE.RepeatWrapping;
    tilesAmbientOcclusionMap.repeat.set( 25, 1 )
   
    //Wand
    const wand2 = new THREE.Mesh( new THREE.PlaneGeometry(100,5,400,400), new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: tilesBaseColor, 
        normalMap: tilesNormalMap, 
        displacementMap: tilesHeightMap, 
        displacementScale: 0.7,
        roughnessMap: tilesRoughnessMap,
        roughness: 1,
        aoMap: tilesAmbientOcclusionMap,

     }))
     wand2.geometry.attributes.uv2 = wand2.geometry.attributes.uv;
     wand2.position.x = 5.5;
     wand2.position.z = -50;
     wand2.position.y = 1;
     wand2.rotation.set(Math.PI/1,4.72,0.005);
    scene.add(wand2);
    wand2.castShadow =true;

    





    //CREATE LIGHT
    const myLight1 = new THREE.AmbientLight(0x404040, 3);
    scene.add(myLight1);
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );
    directionalLight.castShadow = true;
   
    //GUI
    const gui = new GUI()
    const cubeFolder = gui.addFolder('Cube');
    const cameraFolder = gui.addFolder('Camera');
    const colorFolder = gui.addFolder('Color');
    cubeFolder.add(cube.position, 'x', -10, 10)
    cubeFolder.add(cube.position, 'y', -10, 10)
    cubeFolder.add(cube.position, 'z', -10, 10)
    cubeFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
    cubeFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
    cubeFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
    cubeFolder.open()


    cameraFolder.add(camera.position, 'z', 0, 10)
    cameraFolder.open()

    const options ={
            cubeColor: '#ffea00'
        }
        colorFolder.addColor(options, 'cubeColor').onChange(function(e){
            cube.material.color.set(e);
        })
    colorFolder.open()

    //Renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    

    container.appendChild( renderer.domElement );
//Orbit Controlls

    const controls = new OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 1.6,0 );
	controls.update();

/*Raycaster
    const raycaster = new THREE.Raycaster();
    const workingMatrix = new THREE.Matrix4;
    const workingVector = new THREE.Vector3;*/
  

    window.addEventListener( 'resize', onWindowResize );


    
}

function setupXR(){
    renderer.xr.enabled = true;
    document.body.appendChild( VRButton.createButton( renderer ) );


   
    const controllerModelFactory =new XRControllerModelFactory();
    
    const mygeometry = new THREE.BufferGeometry().setFromPoints([ 
        new THREE.Vector3(0,0,0),
        new THREE.Vector3(0,0,-1)
    ]);
    const line = new THREE.Line(mygeometry);
    line.name = 'line'
    line.scale.z = 0;
    
    const controllers = [];
    
    for(let i=0; i<1; i++){
    
        const controller = renderer.xr.getController (i);
    
        controller.add( line.clone());
        controller.userData.selectPressed = false;
        scene.add(controller);
         

        controllers.push (controller);
    
        const grip = renderer.xr.getControllerGrip(i);
        grip.add(controllerModelFactory.createControllerModel(grip));
        scene.add(grip);
    
    }
    
    return controllers;

}
   


function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(){
    renderer.setAnimationLoop( render );

    cubeCamera.update(renderer, scene);

}

function render() {

    renderer.render( scene, camera );
    if( controllers){
        const self = this;
       controllers.forEach((controller) => {
            self.handleControllers(controller)
        });
    } 

}


function loadMTexture(){

    

    

}