import * as THREE from "three";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";

import { GUI } from "../../node_modules/three/examples/jsm/libs/lil-gui.module.min.js";
import { VRButton } from "../../node_modules/three/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "../../node_modules/three/examples/jsm/webxr/XRControllerModelFactory.js";
import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { BoxLineGeometry } from "../../node_modules/three/examples/jsm/geometries/BoxLineGeometry.js";
import { Stats } from "../../node_modules/three/examples/jsm/libs/stats.module.js";
import {
	Constants as MotionControllerConstants,
	fetchProfile,
	MotionController
} from '../../node_modules/three/examples/jsm/libs/motion-controllers.module.js';
import * as TWEEN from '/../node_modules/@tweenjs/tween.js/dist/tween.esm.js';

class App {
  camera;
  scene;
  renderer;
  container;
  cube;
  cube2;
  cube3;
  cube4;
  orbitControls;
  controllers;
  raycaster;
  workingMatrix;
  workingVector;
  candle;
  object;

  

  
  constructor() {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);

    //CREATE CAMERA
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.6, 3);

    //CREATE SCENE
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0088FF);

    // CREATE LIGHT
    //const myLight1 = new THREE.AmbientLight(0x404040, 3);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.target.position.set(0,0,0);
    directionalLight.target.updateMatrixWorld();

    directionalLight.castShadow = true;
    directionalLight.position.set(0, 10, 0);

    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default

    const hemilight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
   



    const lamp = new THREE.PointLight( 0x00ffff, 2, 8, 3 ) // Blau
    const lampbig = new THREE.PointLight( 0xffffff, 0.5, 8, 7 ) // Weiß
    const lamp2 = new THREE.PointLight( 0xffff00, 2, 8, 3 ) // Gelb
    const lampbig2 = new THREE.PointLight( 0xffffff, 0.5, 8, 7 ) //Weiß

    /*
      [0  0]
      [0  0]
      [0  X]
    */
    const lamp3 = new THREE.PointLight(0x00ffff, 2, 8, 3 ) //Blau
    const lampbig3 = new THREE.PointLight(0xffffff, 0.5, 8, 7 ) // Weiß

    /*
      [X  0]
      [0  0]
      [0  0]
    */
    const lamp4 = new THREE.PointLight(0x00ffff,2,8,3 ) // Blau
    const lampbig4 = new THREE.PointLight( 0xffffff, 0.5, 8, 7 ) // Weiß

    /*
      [0  0]
      [X  0]
      [0  0]
    */
 
    const lamp5 = new THREE.PointLight(0xffff00,2,8,3 ) //Gelb
    const lampbig5 = new THREE.PointLight( 0xffffff, 0.5, 8, 7 ) // Weiß

    const lamp6 = new THREE.PointLight(0x00ffff,2,8,3 ) // Blau
    const lampbig6 = new THREE.PointLight( 0xffffff, 0.5, 8, 7 ) //Weiß


    lamp.position.set(4.8, 1, -3.5);
    lampbig.position.set(4.8, 1, -3.5);

    lamp2.position.set(4.8, 1, 0);
    lampbig2.position.set(4.8, 1, 0);

    lamp3.position.set(4.8, 1, 3.5);
    lampbig3.position.set(4.8, 1, 3.5);

    lamp4.position.set(-4.8, 1, -3.5);
    lampbig4.position.set(-4.8, 1, -3.5);

    lamp5.position.set(-4.8, 1, 0);
    lampbig5.position.set(-4.8, 1, 0);
    
    lamp6.position.set(-4.8, 1, 3.5);
    lampbig6.position.set(-4.8, 1, 3.5);
  
    
    const sphereSize1 = 0.4;
    const sphereSize2 = 1;
    const lampHelper = new THREE.PointLightHelper(lamp, sphereSize1)
    const lamp2Helper = new THREE.PointLightHelper(lamp2, sphereSize1)
    const lamp3helper = new THREE.PointLightHelper(lamp3,sphereSize1)
    const lamp4Helper = new THREE.PointLightHelper(lamp4, sphereSize1)
    const lamp5Helper = new THREE.PointLightHelper(lamp5, sphereSize1)
    const lamp6Helper = new THREE.PointLightHelper(lamp6, sphereSize1)    
    const lampbigHelper = new THREE.PointLightHelper(lampbig, sphereSize2)
    const lampbig2Helper = new THREE.PointLightHelper(lampbig2, sphereSize2)
    const lampbig3Helper = new THREE.PointLightHelper(lampbig3, sphereSize2)
    const lampbig4Helper = new THREE.PointLightHelper(lampbig4, sphereSize2)
    const lampbig5Helper = new THREE.PointLightHelper(lampbig5, sphereSize2)
    const lampbig6Helper = new THREE.PointLightHelper(lampbig6, sphereSize2)
    
    this.scene.add(lampHelper, lamp2Helper, lampbigHelper, lampbig2Helper, lamp3helper, lampbig3Helper, lamp4Helper, lampbig4Helper, lamp5Helper, lampbig5Helper, lamp6Helper, lampbig6Helper);
    this.scene.add( lamp, lamp2, lamp3, lampbig, lampbig2, lampbig3, lamp4, lampbig4, lamp5, lampbig5, lamp6, lampbig6);


    this.scene.add(hemilight, directionalLight);




    


    const uplight = new THREE.SpotLight( 0xffffff, 15, 2, 0.8,0.5,2);
    uplight.castShadow = true;
    uplight.target.position.set(4.5,1,0);
    uplight.target.updateMatrixWorld();
    uplight.position.set(3, 0.2, 0 );
  
    const uplight2 = new THREE.SpotLight( 0xffffff, 15, 2, 0.8,0.5,2);
    uplight2.castShadow = true;
    uplight2.target.position.set(4.5, 1, 3.5 )
    uplight2.target.updateMatrixWorld();
    uplight2.position.set(3, 0.2, 3.5)

    const uplight3 = new THREE.SpotLight( 0xffffff, 15, 2, 0.8,0.5,2);
    uplight3.castShadow = true;
    uplight3.target.position.set(4.5, 1, -3.5 )
    uplight3.target.updateMatrixWorld();
    uplight3.position.set(3, 0.2, -3.5)

    const light = new THREE.AmbientLight( 0x404040 ); // soft white light


    this.scene.add(uplight.target, uplight2.target, uplight3.target);
    this.scene.add( uplight, uplight2, uplight3, light );

/*
    const viscospot = new THREE.SpotLight(0xffffff, 15,8,0.6,0.5,2);
    viscospot.castShadow = true;
    viscospot.target.position.set(-3, 2, 0);
    viscospot.target.updateMatrixWorld();
    viscospot.position.set(0,0,0);

    this.scene.add(viscospot.target)
    this.scene.add(viscospot);

**/

    //HILFE
    const dirLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      5
    );
    this.scene.add(dirLightHelper);

   

const spotLightHelper = new THREE.SpotLightHelper( uplight );
const spotLightHelper2 = new THREE.SpotLightHelper(uplight2);
const spotLightHelper3 = new THREE.SpotLightHelper(uplight3);

this.scene.add( spotLightHelper, spotLightHelper2, spotLightHelper3);

    //Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;


    this.container.appendChild(this.renderer.domElement);

    //Orbit Controlls

    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControls.target.set(0, 1.6, 0);
    this.orbitControls.update();

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    //Raycaster
    this.raycaster = new THREE.Raycaster();
    this.workingMatrix = new THREE.Matrix4();
    this.workingVector = new THREE.Vector3();

    this.initScene();
    this.loadMyFiles();
    this.setupXR();
    this.myGui();
    this.mytextures();
    
    
    

    window.addEventListener("resize", this.onWindowResize);

    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  initScene() {
    
    this.room = new THREE.LineSegments(
       );
   
    this.scene.add( this.room );

//CREATE CUBE TO INTERACT
    const boxgeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const boxgeometry2 = new THREE.BoxGeometry(0.5,0.5,0.5);
    const boxgeometry3 = new  THREE.BoxGeometry(0.5,0.5,0.5);
    const boxgeometry4 = new THREE.BoxGeometry(0.5,0.5,0.5);
    

// CREATE CUBE TO INTERACT MATERIAL
    const cubematerial = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(186, 102, 13)"),
    specular: new THREE.Color("rgb(186, 13, 13)"),
    shininess: 10,
    shading: THREE.FlatShading,
    transparent: 1,
    opacity: 1
    });
    
    const cubematerial2 = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(20, 102, 13)"),
    specular: new THREE.Color("rgb(186, 13, 13)"),
    shininess: 10,
    shading: THREE.FlatShading,
    transparent: 1,
    opacity: 1
    });

    const cubematerial3 = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(3, 90, 252)"),
    specular: new THREE.Color("rgb(186, 13, 13)"),
    shininess: 10,
    shading: THREE.FlatShading,
    transparent: 1,
    opacity: 1
    });
    
    const cubematerial4 = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(169, 3, 252)"),
    specular: new THREE.Color("rgb(186, 13, 13)"),
    shininess: 10,
    shading: THREE.FlatShading,
    transparent: 1,
    opacity: 1
    });

//Würfel erstellen und zum Raumm hinzufügen
//COMBINE CUBE TO INTERACT WITH MATERIAL
    this.cube = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.cube);
    this.cube.castShadow = true;
    this.cube.name ="cube1"

    this.cube2 = new THREE.Mesh(boxgeometry2, cubematerial2);
    this.room.add(this.cube2);
    this.cube2.castShadow = true;
    this.cube2.name ="cube2"

    this.cube3 = new THREE.Mesh(boxgeometry3, cubematerial3);
    this.room.add(this.cube3);
    this.cube3.castShadow = true;
    this.cube3.name ="cube3"

    this.cube4 = new THREE.Mesh(boxgeometry4, cubematerial4);
    this.room.add(this.cube4);
    this.cube4.castShadow = true;
    this.cube4.name ="cube4"


    //Highlight für Würfel
    this.highlight = new THREE.Mesh(boxgeometry,
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide }));
    this.highlight.scale.set(1.2, 1.2, 1.2);



    this.highlight2 = new THREE.Mesh(boxgeometry2,
    new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.BackSide }));
    this.highlight2.scale.set(1.2, 1.2, 1.2);

   

this.cube.position.set(1.75,0.2,-2);
this.cube2.position.set(1.75,0.2,-1.5);
this.cube3.position.set(-1.75,0.2,0.5);
this.cube4.position.set(-1.75,0.2,1);

    

         //HILFE 
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );


        
  
   
    

    
  }

  mytextures(){
//Lampenschirm



/*
const schirmTextureLoader = new THREE.TextureLoader();

const SchirmBaseColor = schirmTextureLoader.load(
  "textures/metal/Metal032_2K-JPG_Color.jpg"
);
SchirmBaseColor.wrapS = THREE.RepeatWrapping;
SchirmBaseColor.wrapT = THREE.RepeatWrapping;
SchirmBaseColor.repeat.set(1,1);

const SchirmNormalMap = schirmTextureLoader.load(
  "textures/metal/Metal032_2K-JPG_NormalGL.jpg"
);
SchirmNormalMap.wrapS = THREE.RepeatWrapping;
SchirmNormalMap.wrapT = THREE.RepeatWrapping;
SchirmNormalMap.repeat.set(1,1);

const SchirmHeightMap = schirmTextureLoader.load(
  "textures/metal/Metal032_2K-JPG_Displacement.jpg"
);
SchirmHeightMap.wrapS = THREE.RepeatWrapping;
SchirmHeightMap.wrapT = THREE.RepeatWrapping;
SchirmHeightMap.repeat.set(1,1);

const SchirmRoughnessMap = schirmTextureLoader.load(
  "textures/metal/Metal032_2K-JPG_Roughness.jpg"
);
SchirmRoughnessMap.wrapS = THREE.RepeatWrapping;
SchirmRoughnessMap.wrapT = THREE.RepeatWrapping;
SchirmRoughnessMap.repeat.set(1,1);

const SchirmMetalic = schirmTextureLoader.load(
  "textures/metal/Metal032_2K-JPG_Metalness.jpg"
);
SchirmRoughnessMap.wrapS = THREE.RepeatWrapping;
SchirmRoughnessMap.wrapT = THREE.RepeatWrapping;
SchirmRoughnessMap.repeat.set(1, 1);

//irgendwas mit metall
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
  format: THREE.RGBAFormat,
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter,
  encoding: THREE.SRGBColorSpace,
});

const cubeCamera = new THREE.CubeCamera(1, 10000, cubeRenderTarget);

const lampenschirm = new THREE.Mesh(
  new THREE.CylinderGeometry(0.6 , 0.3 , 0.7 , 5 ,1 ,true, 9, 4),
  new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    side: THREE.DoubleSide,
    map: SchirmBaseColor,
    normalMap: SchirmNormalMap,
    displacementMap: SchirmHeightMap,
    displacementScale: 0.1,
    roughnessMap: SchirmRoughnessMap,
    roughness: 1,
    metalnessMap: SchirmMetalic,
    metalness: 1,
    envMap: cubeRenderTarget.texture,})
);

lampenschirm.position.set(4.8,1,0);
lampenschirm.rotation.set(0,0,0.2);
this.scene.add(lampenschirm);
lampenschirm.add(cubeCamera);

*/
//Boden Texture
const myBodenTextureLoader = new THREE.TextureLoader();
const BodenBaseColor = myBodenTextureLoader.load(
  "textures/betonboden/Concrete034_4K-JPG_Color.jpg"
);
BodenBaseColor.wrapS = THREE.RepeatWrapping;
BodenBaseColor.wrapT = THREE.RepeatWrapping;
BodenBaseColor.repeat.set(1,1);

const BodenNormalMap = myBodenTextureLoader.load(
  "textures/betonboden/Concrete034_4K-JPG_NormalGL.jpg"
);
BodenNormalMap.wrapS = THREE.RepeatWrapping;
BodenNormalMap.wrapT = THREE.RepeatWrapping;
BodenNormalMap.repeat.set(1,1);

const BodenHeightMap = myBodenTextureLoader.load(
  "textures/betonboden/Concrete034_4K-JPG_Displacement.jpg"
);
BodenHeightMap.wrapS = THREE.RepeatWrapping;
BodenHeightMap.wrapT = THREE.RepeatWrapping;
BodenHeightMap.repeat.set(1,1);

const BodenRoughnessMap = myBodenTextureLoader.load(
  "textures/betonboden/Concrete034_4K-JPG_Roughness.jpg"
);
BodenRoughnessMap.wrapS = THREE.RepeatWrapping;
BodenRoughnessMap.wrapT = THREE.RepeatWrapping;
BodenRoughnessMap.repeat.set(1,1);
//...

//CREATE PLANE

//Der Boden ist keine Lava
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(11, 10, 10, 10),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: BodenBaseColor,
    normalMap: BodenNormalMap,
    displacementMap: BodenHeightMap,
    displacementScale: 0.1,
    roughnessMap: BodenRoughnessMap,
    roughness: 1,
    //envMap: cubeRenderTarget.texture,
  })
);
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;
plane.rotation.set(1.56, 0, 0);
plane.receiveShadow = true;
this.scene.add(plane);
//plane.add(cubeCamera);
//plane.add(cubeCamera2);




//Wand Texture
const myTextureLoader = new THREE.TextureLoader();
const tilesBaseColor = myTextureLoader.load(
  "textures/wand/Wallpaper001A_4K-JPG_Color.jpg"
);
tilesBaseColor.wrapS = THREE.RepeatWrapping;
tilesBaseColor.wrapT = THREE.RepeatWrapping;
tilesBaseColor.repeat.set(5,1);

const tilesNormalMap = myTextureLoader.load(
  "textures/wand/Wallpaper001A_4K-JPG_NormalGL.jpg"
);
tilesNormalMap.wrapS = THREE.RepeatWrapping;
tilesNormalMap.wrapT = THREE.RepeatWrapping;
tilesNormalMap.repeat.set(5,1);

const tilesHeightMap = myTextureLoader.load(
  "textures/wand/Wallpaper001A_4K-JPG_Displacement.jpg"
);
tilesHeightMap.wrapS = THREE.RepeatWrapping;
tilesHeightMap.wrapT = THREE.RepeatWrapping;
tilesHeightMap.repeat.set(5,1);

const tilesRoughnessMap = myTextureLoader.load(
  "textures/wand/Wallpaper001A_4K-JPG_Roughness.jpg"
);
tilesRoughnessMap.wrapS = THREE.RepeatWrapping;
tilesRoughnessMap.wrapT = THREE.RepeatWrapping;
tilesRoughnessMap.repeat.set(5, 1);

/*const tilesAmbientOcclusionMap = myTextureLoader.load(
  "textures/Stone_Floor_006_ambientOcclusion.jpg"
);
tilesAmbientOcclusionMap.wrapS = THREE.RepeatWrapping;
tilesAmbientOcclusionMap.wrapT = THREE.RepeatWrapping;
tilesAmbientOcclusionMap.repeat.set(25, 1);
*/
//Wand
const wand2 = new THREE.Mesh(
  new THREE.PlaneGeometry(10.5, 5, 400, 400),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: tilesBaseColor,
    normalMap: tilesNormalMap,
    displacementMap: tilesHeightMap,
    displacementScale: 0.05,
    roughnessMap: tilesRoughnessMap,
    roughness: 1,
    //aoMap: tilesAmbientOcclusionMap,
  })
);
wand2.geometry.attributes.uv2 = wand2.geometry.attributes.uv;
wand2.position.x = 5;
wand2.position.z = 0;
wand2.position.y = 1.4;
wand2.rotation.set(0,- Math.PI / 2,0);
this.scene.add(wand2);
wand2.castShadow = true;
wand2.receiveShadow = true;

const wand3 = new THREE.Mesh(
  new THREE.PlaneGeometry(10.5, 5, 400, 400),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: tilesBaseColor,
    normalMap: tilesNormalMap,
    displacementMap: tilesHeightMap,
    displacementScale: 0.05,
    roughnessMap: tilesRoughnessMap,
    roughness: 1,
   // aoMap: tilesAmbientOcclusionMap,
  })
);
wand3.geometry.attributes.uv2 = wand2.geometry.attributes.uv;
wand3.position.x = -5;
wand3.position.z = 0;
wand3.position.y = 1.4;
wand3.rotation.set(0,Math.PI / 2,0);
this.scene.add(wand3);
wand3.castShadow = true;
wand3.receiveShadow = true;
    
const wand4 = new THREE.Mesh(
  new THREE.PlaneGeometry(10.5, 5, 400, 400),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: tilesBaseColor,
    normalMap: tilesNormalMap,
    displacementMap: tilesHeightMap,
    displacementScale: 0.05,
    roughnessMap: tilesRoughnessMap,
    roughness: 1,
   // aoMap: tilesAmbientOcclusionMap,
  })
);

wand4.geometry.attributes.uv2 = wand2.geometry.attributes.uv;
wand4.position.y = 1.4;
wand4.position.z = 5;
wand4.rotation.set(0,Math.PI/2*180, 0)
this.scene.add(wand4);
wand4.castShadow = true;
wand4.receiveShadow = true;

const wand5 = new THREE.Mesh(
  new THREE.PlaneGeometry(10.5, 5, 400, 400),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: tilesBaseColor,
    normalMap: tilesNormalMap,
    displacementMap: tilesHeightMap,
    displacementScale: 0.05,
    roughnessMap: tilesRoughnessMap,
    roughness: 1,
   // aoMap: tilesAmbientOcclusionMap,
  })
);

wand5.geometry.attributes.uv2 = wand2.geometry.attributes.uv;
wand5.position.y = 1.4;
wand5.position.z = -5;
this.scene.add(wand5);

wand5.castShadow = true;
wand5.receiveShadow = true;
  }
  
  
  createButtonStates(components){

    const buttonStates = {};
    this.gamepadIndices = components;
    
    Object.keys( components ).forEach( (key) => {
        if ( key.indexOf('touchpad')!=-1 || key.indexOf('thumbstick')!=-1){
            buttonStates[key] = { button: 0, xAxis: 0, yAxis: 0 };
        }else{
            buttonStates[key] = 0; 
        }
    })
    
    this.buttonStates = buttonStates;
}

  myGui() {
    /*
    var gui = new GUI();

    var cubeFolder = gui.addFolder("Change the Cube");
    cubeFolder.add(this.cube.position, "z", -10, 10).listen();
    cubeFolder.add(this.cube.material, "visible").listen();
    cubeFolder.open();
*/
    /*GUI
    const gui = new GUI();
    const cubeFolder = gui.addFolder("Cube");
    const cameraFolder = gui.addFolder("Camera");
    const colorFolder = gui.addFolder("Color");
    const fackelFolder = gui.addFolder("FackelFarbe");

    cubeFolder.add(this.cube.position, "x", -10, 10);
    cubeFolder.add(this.cube.position, "y", -10, 10);
    cubeFolder.add(this.cube.position, "z", -10, 10);
    cubeFolder.add(this.cube.rotation, "x", 0, Math.PI * 2);
    cubeFolder.add(this.cube.rotation, "y", 0, Math.PI * 2);
    cubeFolder.add(this.cube.rotation, "z", 0, Math.PI * 2);
 
    cubeFolder.open();

    cameraFolder.add(this.camera.position, "z", 0, 10);
    cameraFolder.open();

    const options = {
      cubeColor: "#ffea00",
    };
    colorFolder.addColor(options, "cubeColor").onChange(function (e) {
      this.cube.material.color.set(e);
    });
    colorFolder.open();
   */
  }
  loadMyFiles() {

    

      var myModels = [ "lampe.glb", "kabel-sonde.glb", "viscosity.glb"];

      let me = this;
      const myGLTFloader = new GLTFLoader();
     
      const meinpfad = "./textures/";
      
      for (let i = 0; i <= myModels.length - 1; i++) {
        var dateipfad = meinpfad + myModels[i];
  
        myGLTFloader.load(
          dateipfad,
  
          function (gltf) {
            
            me.scene.add(gltf.scene);
             var mygltf = gltf.scene;
  
             mygltf.children[i].material.metalness =0.4;
            gltf.scene; // THREE.Group
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
           
            

            var saythename = mygltf.getObjectsByProperty(myModels[i]);
            console.log("SAY THE NAME")
            console.log(saythename);
            console.log("SAY THE NAME")
            
           
          //this.mydoor = mygltf.getObjectByName("door");
           
           //me.mydoor.position.set(0,1,-8);
          // console.log(mydoor);
                    
          gibName(saythename);
  
          },
           function (xhr) {
            console.log(
              ((xhr.loaded / xhr.total) * 100).toFixed() +
                "% loaded" 
            );
          },
          function (error) {
            console.log("An error happened");
          },
                    
          
          
        );   
        
        
      }
      function gibName (mymodels) {
        //me.mydoor.position.set(0,1,-8);
        console.log("TESTDOOR")
        console.log(mymodels);
        console.log("TESTDOOR")

      
        //mymodels[3].name = "kerze";
       // mymodels[1].position.set(0,0,0);
        
      

        
            }
  }

  
   

  setupXR() {
    this.renderer.xr.enabled = true;
    document.body.appendChild(VRButton.createButton(this.renderer));

    this.controllers = this.buildControllers();
    const self = this;
        
   function onSelectStart() {
      this.children[0].scale.z = 10;
      this.userData.selectPressed = true;
    }

    function onSelectEnd() {
      this.children[0].scale.z = 0;
        //BAUSTELLE
      self.highlight.visible = false;
/*
      self.highlight2.visible = false;
     
*/
this.userData.selectPressed = false;
    }

    this.controllers.forEach((controller) => {
      controller.addEventListener("selectstart", onSelectStart);
      controller.addEventListener("selectend", onSelectEnd);
    });
  }

  buildControllers() {
    
    const controllerModelFactory = new XRControllerModelFactory();

    const mygeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]);

    const line = new THREE.Line(mygeometry);
    line.name = "line";
    line.scale.z = 0;

    const controllers = [];

    for (let i = 0; i <= 1; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.add(line.clone());
      controller.userData.selectPressed = false;
      this.scene.add(controller);

      controllers.push(controller);

      const grip = this.renderer.xr.getControllerGrip(i);
      grip.add(controllerModelFactory.createControllerModel(grip));
      this.scene.add(grip);
    }

    return controllers;
  }

 

  handleController(controller, myscene) {


   if (controller.userData.selectPressed ){
   // VR-Buttons
            controller.children[0].scale.z = 10;
            this.scene.add(this.highlight);
          /* this.scene.add(this.highlight2); */
            this.workingMatrix.identity().extractRotation( controller.matrixWorld );

            this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
            this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.workingMatrix );

            //const intersects2 = this.raycaster.intersectObject(this.room.children[0]); //cube
            const intersects = this.raycaster.intersectObjects( this.room.children); //cube2


           // console.log(this.room.children[0]);
            // console.log(intersects);
      
           

  


            if ( intersects.length>0 ){
            /*  console.log("DIE SZENE");
              
              console.log(myscene.children[47]);            
              console.log("DIE SZENE");
              console.log(this.room.children);
            */
              console.log(myscene);
              const kabel = myscene.children[47].children[0];
              const kopf = myscene.children[47].children[1];
              const extention = myscene.children[47].children[2];
              const sonde = myscene.children[47].children[3];

              const flanschzylinder = myscene.children[48].children[1];
              const flanschanschluss = myscene.children[48].children[2];
              const flansch = myscene.children[48].children[3];
              const flanschbody = myscene.children[48].children[4];
              
              const flanschkugel = myscene.children[48].children[7];
              const standard = myscene.children[48].children[5];
              const standardanschluss = myscene.children[48].children[6];
              const standardbody = myscene.children[48].children[8];
              
              const nptanschluss = myscene.children[48].children[9];
              const nptzylinder = myscene.children[48].children[10];
              const nptbody = myscene.children[48].children[11];
              const npt = myscene.children[48].children[12]; 
              

                intersects[0].object.add(this.highlight);
                this.highlight.visible = true;
                
               // console.log(intersects[0]);
                controller.children[0].scale.z = intersects[0].distance;
               //Buttons werden gedrückt      
              // Button für Füllstand
                if(this.highlight.visible == true && intersects[0].object.name =="cube1"){

                const stats = Stats();
                document.body.appendChild(stats.dom);

                const downcubeleft = () => {
                  new TWEEN.Tween(intersects[0].object.position)
                    .to(
                      {
                        y: 0.1,
                      },
                      500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                  new TWEEN.Tween(this.cube2.position)
                    .to(
                      {
                        y: 0.2,
                      },
                      500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
                    //console.log('controller links');
                };

                
               
               
                const explosive = () => {
                  new TWEEN.Tween(kopf.position)
                  .to(
                    {
                      y: 2.5,
                    }, 500
                  )
                  .easing(TWEEN.Easing.Cubic.Out)
                  .start();

                  new TWEEN.Tween(sonde.position)
                  .to(
                    {
                      y: 1.9,
                    }, 500
                  )
                  .easing(TWEEN.Easing.Cubic.Out)
                  .start();
                };

                var animate = function () {
                  requestAnimationFrame(animate);

                  TWEEN.update();
                  stats.update();
                };

                animate();
                downcubeleft();
                explosive();

                 // intersects[0].object.position.setY(-0.2);
                 
                 
                 
                
                }


                // Button 2 für Füllstand
                if(this.highlight.visible == true && intersects[0].object.name == "cube2"){
                  
                  const stats = Stats();
                  document.body.appendChild(stats.dom);
                  
                  
                  const downcuberight = () => {
                  new TWEEN.Tween(intersects[0].object.position)
                  .to({
                    y: 0.1
                  },500)
                  .easing(TWEEN.Easing.Cubic.Out)
                  .start()
                  
                  new TWEEN.Tween(this.cube.position)
                  .to({
                    y: 0.2
                  },500)
                  .easing(TWEEN.Easing.Cubic.Out)
                  .start()
                  }
                  const shrink = () => {
                    new TWEEN.Tween(kopf.position)
                    .to(
                      {
                        y: 2.1661229133605957,
                      }, 500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
  
                    new TWEEN.Tween(sonde.position)
                    .to(
                      {
                        y: 2.1661229133605957,
                      }, 500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
                  };
                  
                                  
                  var animate = function () {
                    requestAnimationFrame(animate);
                    
                    TWEEN.update();
                    stats.update();
                  };
                  
                  animate();
                  downcuberight();
                  shrink();

                  //intersects[0].object.position.setY(-0.2); 
                 
                 // this.cube.position.setY(0);
                }
                // Button für Viscosität
                if(this.highlight.visible == true && intersects[0].object.name == "cube3"){
                  const stats = Stats();
                  document.body.appendChild(stats.dom);

                  const downcuberightvisco = () =>{
                    new TWEEN.Tween(intersects[0].object.position)
                    .to({
                      y:0.1
                    },500)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(this.cube4.position)
                  .to({
                    y: 0.2
                  },500)
                  .easing(TWEEN.Easing.Cubic.Out)
                  .start()
                  }

                  const explosivevisco = () => {
                    new TWEEN.Tween(flanschzylinder.position)
                    .to(
                      {
                        y: 1, //1.4597450494766235
                      }, 500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
  
                    new TWEEN.Tween(flanschanschluss.position)
                    .to(
                      {
                        y: 1.8, //1.6163431406021118
                      }, 500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(flansch.position)
                    .to(
                      {
                        y: 1.4, //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(flanschkugel.position)
                    .to(
                      {
                        y: 1.2 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(standardanschluss.position)
                    .to(
                      {
                        y: 1.8 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(standard.position)
                    .to(
                      {
                        y: 1.4 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(nptanschluss.position)
                    .to(
                      {
                        y: 1.8 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(nptzylinder.position)
                    .to(
                      {
                        y: 1.2//1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(npt.position)
                    .to(
                      {
                        y: 1.4 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
                  };



                  var animate = function () {
                    requestAnimationFrame(animate);
                    
                    TWEEN.update();
                    stats.update();
                  };

                  animate();
                  downcuberightvisco();
                  explosivevisco();
                  


                }
                
                if(this.highlight.visible == true && intersects[0].object.name == "cube4"){
                  const stats = Stats();
                  document.body.appendChild(stats.dom);

                  const downcubeleftvisco = () =>{
                    new TWEEN.Tween(intersects[0].object.position)
                    .to({
                      y: 0.1
                  },500)
                  .easing(TWEEN.Easing.Cubic.Out)
                  .start()

                  new TWEEN.Tween(this.cube3.position)
                  .to({
                    y: 0.2
                  },500)
                  .easing(TWEEN.Easing.Cubic.Out)
                  .start()
                  }

                  const shrinkvisco = () => {
                    new TWEEN.Tween(flanschzylinder.position)
                    .to(
                      {
                        y: 1.459, //1.4597450494766235
                      }, 500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
  
                    new TWEEN.Tween(flanschanschluss.position)
                    .to(
                      {
                        y: 1.6163, //1.6163431406021118
                      }, 500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(flansch.position)
                    .to(
                      {
                        y: 1.616, //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(flanschkugel.position)
                    .to(
                      {
                        y: 1.616 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(standardanschluss.position)
                    .to(
                      {
                        y: 1.616 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(standard.position)
                    .to(
                      {
                        y: 1.616 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(nptanschluss.position)
                    .to(
                      {
                        y: 1.616 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(nptzylinder.position)
                    .to(
                      {
                        y: 1.616 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                    new TWEEN.Tween(npt.position)
                    .to(
                      {
                        y: 1.616 //1.6163431406021118
                    },500
                    )
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();
                  };

                  var animate = function () {
                    requestAnimationFrame(animate);

                    TWEEN.update();
                    stats.update();
                  };
                  animate();
                  downcubeleftvisco();
                  shrinkvisco();

                }
            } 
            else{
                this.highlight.visible = false;
                /*if(this.highlight.visible == false && intersects[0].object.name =="cube1"){
                 this.cube.position.setY(0);
                // this.cube2.position.setY(0);
               
                }*/
                //console.log('controller geht nicht')

             /*   this.highlight2.visible = false;
                console.log('highlight 2 geht nicht')*/

            } 

            
          }

        
  };

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.stats.update();

    if (this.controllers ){
      const self = this;
      this.controllers.forEach( ( controller) => { 
          self.handleController( controller, this.scene ) 
      });
  }

    this.renderer.render(this.scene, this.camera);
  }
 }


export { App };
