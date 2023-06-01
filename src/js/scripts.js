import * as THREE from 'three';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from '../../node_modules/three/examples/jsm/libs/lil-gui.module.min.js';
import { VRButton } from '../../node_modules/three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from '../../node_modules/three/examples/jsm/webxr/XRControllerModelFactory.js';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { BoxLineGeometry } from '../../node_modules/three/examples/jsm/geometries/BoxLineGeometry.js';

let camera,scene, renderer;
let controls;
let controllers;
let container;
let highlight;


class App{
    constructor(){
        container = document.createElement( 'div' );
	    document.body.appendChild( container );


        //CREATE CAMERA
        camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set(0,1.6,8);

        //CREATE SCENE
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x444444 );

       // CREATE LIGHT
        const myLight1 = new THREE.AmbientLight(0x404040, 3);
        scene.add(myLight1);
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        scene.add( directionalLight );
        const hemilight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        scene.add( hemilight );

        directionalLight.castShadow = true;
        directionalLight.position.set(5,10,0);
        directionalLight.target.position.set(4,3,-7.5);
    
        
        directionalLight.shadow.mapSize.width = 512; // default
        directionalLight.shadow.mapSize.height = 512; // default
        directionalLight.shadow.camera.near = 0.5; // default
        directionalLight.shadow.camera.far = 500; // default
 

        const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight,5);
        scene.add(dirLightHelper);

        //Renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;

        container.appendChild( renderer.domElement );

        //Orbit Controlls

        controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 1.6,0 );
        controls.update();

       
        
        //Raycaster
        this.raycaster = new THREE.Raycaster();
        this.workingMatrix = new THREE.Matrix4;
        this.workingVector = new THREE.Vector3;

        this.initScene();
        this.setupXR();

        window.addEventListener( 'resize', this.onWindowResize );

        window.addEventListener('resize', this.onWindowResize.bind(this) ); 
        
        renderer.setAnimationLoop( this.render.bind(this) );

    }
    initScene(){
        this.room = new THREE.LineSegments(
            new BoxLineGeometry( 100, 100, 100, 10, 10, 10 ),
            new THREE.LineBasicMaterial( { color: 0x808080 } )
        );
this.room.geometry.translate( 0, 3, 0 );
scene.add( this.room );

const geometry = new THREE.IcosahedronBufferGeometry( this.radius, 2 );

        //Boden Texture
    const myBodenTextureLoader = new THREE.TextureLoader();
    const BodenBaseColor = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_basecolor.jpg');
    BodenBaseColor.wrapS = THREE.RepeatWrapping;
    BodenBaseColor.wrapT = THREE.RepeatWrapping;
    BodenBaseColor.repeat.set( 2, 25 );

    const BodenNormalMap = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_normal.jpg');
    BodenNormalMap.wrapS = THREE.RepeatWrapping;
    BodenNormalMap.wrapT = THREE.RepeatWrapping;
    BodenNormalMap.repeat.set( 2, 25 );

    const BodenHeightMap = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_height.png');
    BodenHeightMap.wrapS = THREE.RepeatWrapping;
    BodenHeightMap.wrapT = THREE.RepeatWrapping;
    BodenHeightMap.repeat.set( 2, 25 );

    const BodenRoughnessMap = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_roughness.jpg');
    BodenRoughnessMap.wrapS = THREE.RepeatWrapping;
    BodenRoughnessMap.wrapT = THREE.RepeatWrapping;
    BodenRoughnessMap.repeat.set( 2, 25 );

    const BodenAmbientOcclusionMap = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_ambientOcclusion.jpg');
    BodenAmbientOcclusionMap.wrapS = THREE.RepeatWrapping;
    BodenAmbientOcclusionMap.wrapT = THREE.RepeatWrapping;
    BodenAmbientOcclusionMap.repeat.set( 2, 25 );

    const BodenMetalic = myBodenTextureLoader.load('textures/boden/Metal_ArtDeco_Tiles_001_metallic.jpg');
    BodenMetalic.wrapS = THREE.RepeatWrapping;
    BodenMetalic.wrapT = THREE.RepeatWrapping;
    BodenMetalic.repeat.set( 2,25 );

    //irgendwas mit metall
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128,{
        format: THREE.RGBAFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.SRGBColorSpace
    })


    const cubeCamera = new THREE.CubeCamera(1,10000, cubeRenderTarget);
    //CREATE PLANE
    


    //Der Boden ist keine Lava
    const plane = new THREE.Mesh( new THREE.PlaneGeometry( 10, 100,400,400 ), new THREE.MeshStandardMaterial( {
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
    

var capsgeo = new THREE.CapsuleGeometry(0.2,0.2,2,6);
var capsmat = new THREE.MeshLambertMaterial({color: 0x579547})
   const grabcaps = new THREE.Mesh(  capsgeo, capsmat);
   scene.add(grabcaps);
   grabcaps.position.set(-1,1,-5);

    //Wand Texture
    const myTextureLoader = new THREE.TextureLoader();
    const tilesBaseColor = myTextureLoader.load('textures/Stone_Floor_006_basecolor.jpg');
    tilesBaseColor.wrapS = THREE.RepeatWrapping;
    tilesBaseColor.wrapT = THREE.RepeatWrapping;
    tilesBaseColor.repeat.set( 25, 1 );

    const tilesNormalMap = myTextureLoader.load('textures/Stone_Floor_006_normal.jpg');
    tilesNormalMap.wrapS = THREE.RepeatWrapping;
    tilesNormalMap.wrapT = THREE.RepeatWrapping;
    tilesNormalMap.repeat.set( 25, 1 );

    const tilesHeightMap = myTextureLoader.load('textures/Stone_Floor_006_height.png');
    tilesHeightMap.wrapS = THREE.RepeatWrapping;
    tilesHeightMap.wrapT = THREE.RepeatWrapping;
    tilesHeightMap.repeat.set( 25, 1 );

    const tilesRoughnessMap = myTextureLoader.load('textures/Stone_Floor_006_roughness.jpg');
    tilesRoughnessMap.wrapS = THREE.RepeatWrapping;
    tilesRoughnessMap.wrapT = THREE.RepeatWrapping;
    tilesRoughnessMap.repeat.set( 25, 1 );

    const tilesAmbientOcclusionMap = myTextureLoader.load('textures/Stone_Floor_006_ambientOcclusion.jpg');
    tilesAmbientOcclusionMap.wrapS = THREE.RepeatWrapping;
    tilesAmbientOcclusionMap.wrapT = THREE.RepeatWrapping;
    tilesAmbientOcclusionMap.repeat.set( 25, 1 );
   
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

     }));
     wand2.geometry.attributes.uv2 = wand2.geometry.attributes.uv;
     wand2.position.x = 5.5;
     wand2.position.z = -50;
     wand2.position.y = 1;
     wand2.rotation.set(Math.PI/1,4.72,0.005);
    scene.add(wand2);
    wand2.castShadow =true;
    wand2.receiveShadow = true;


      // Instantiate a loader
const myWandloader = new GLTFLoader();
const myFackelloader = new GLTFLoader();

// Load a glTF resource
myWandloader.load(
	// resource URL
	'./textures/wand-door.glb',
    
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.scene; // THREE.Group
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
       
        
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

// Load a glTF resource
myFackelloader.load(
	// resource URL
	'./textures/Fackel.glb',
    
	// called when the resource is loaded
	function( gltf ) {

       scene.add( gltf.scene );

		gltf.scene; // THREE.Group
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
       

         // loop through all children and create a property 
      // for every child based on it's name
      gltf.scene.children.forEach((item) => {
        // console.log(item);
         });
 
         var model = gltf.scene.getObjectByName('dieFackel');
         console.log(model);
     
         model.position.set(5,5,5);
        

         /*GUI CHANGE
         const meineFackel = gui.addFolder('Fackel');
         meineFackel.add(model.position, 'z', -10, 10);
         meineFackel.open();
         */

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded Fackel' );

	},
	// called when loading has errors
	function ( Fackelerror ) {

		console.log( 'An error happened Fackel' );

	}
    );

   console.log(myFackelloader);

   const highlight = new THREE.Mesh(capsgeo, new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.BackSide}));
   highlight.scale.set(1.2,1.2,1.2);
   scene.add(highlight);
    }

    myGUI(){
        //GUI
    const gui = new GUI()
    const cubeFolder = gui.addFolder('Cube');
    const cameraFolder = gui.addFolder('Camera');
    const colorFolder = gui.addFolder('Color');
   

    cubeFolder.add(this.cube.position, 'x', -10, 10)
    cubeFolder.add(this.cube.position, 'y', -10, 10)
    cubeFolder.add(this.cube.position, 'z', -10, 10)
    cubeFolder.add(this.cube.rotation, 'x', 0, Math.PI * 2)
    cubeFolder.add(this.cube.rotation, 'y', 0, Math.PI * 2)
    cubeFolder.add(this.cube.rotation, 'z', 0, Math.PI * 2)
    cubeFolder.open()


    cameraFolder.add(this.camera.position, 'z', 0, 10)
    cameraFolder.open()

    const options ={
            cubeColor: '#ffea00'
        }
        colorFolder.addColor(options, 'cubeColor').onChange(function(e){
            this.cube.material.color.set(e);
        })
        colorFolder.open()
    }


    setupXR(){
        renderer.xr.enabled = true;
        document.body.appendChild( VRButton.createButton( renderer ) );
        
        const self = this;

        controllers = this.buildControllers();
       
        
        function onSelectStart(){
            this.children[0].scale.z = 10;
            this.userData.selectPressed = true;
        }

        function onSelectEnd(){
            this.children[0].scale.z = 0;
            self.highlight.visible = false;
            this.userData.selectPressed = false;
        }

      


        controllers.forEach((controller) => {
            controller.addEventListener('selectstart', onSelectStart);
            controller.addEventListener('selectend', onSelectEnd);
        })
    }


    buildControllers(){
    
        const controllerModelFactory = new XRControllerModelFactory();

        const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

        const line = new THREE.Line( geometry );
        line.name = 'line';
		line.scale.z = 0;
        
        const controllers = [];
        
        for(let i=0; i<=1; i++){
            const controller = renderer.xr.getController( i );
            controller.add( line.clone() );
            controller.userData.selectPressed = false;
            scene.add( controller );
            
            controllers.push( controller );
            
            const grip = renderer.xr.getControllerGrip( i );
            grip.add( controllerModelFactory.createControllerModel( grip ) );
            scene.add( grip );
        }
        
        return controllers;
    


    }

    handleControllers(controller){
        if (controller.userData.selectPressed ){
            controller.children[0].scale.z = 10;

            this.workingMatrix.identity().extractRotation( controller.matrixWorld );

            this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
            this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.workingMatrix );

            const intersects = this.raycaster.intersectObjects( this.room.children );

            if (intersects.length>0){
                intersects[0].object.add(this.highlight);
                this.highlight.visible = true;
                controller.children[0].scale.z = intersects[0].distance;
            }else{
                this.highlight.visible = false;
            }
        }


    }


    onWindowResize(){

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize( window.innerWidth, window.innerHeight );
    
    }

    render() {
       
        
    
        if(this.controllers){
            const self = this;
           this.controllers.forEach((controller) => {
                self.handleControllers(controller)
            });
        } 
    
        renderer.render( scene, camera );
    }


}

export { App };




