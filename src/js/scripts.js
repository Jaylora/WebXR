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


class App {
  camera;
  scene;
  renderer;
  container;
  cube;
  orbitControls;
  controllers;
  raycaster;
  workingMatrix;
  workingVector;
  candle;

  
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
    this.camera.position.set(0, 1.6, 8);

    //CREATE SCENE
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x444444);

    // CREATE LIGHT
    //const myLight1 = new THREE.AmbientLight(0x404040, 3);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const hemilight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
   

    const candle = new THREE.PointLight( 0xff2000, 7, 8, 7 )
    const candlebig = new THREE.PointLight( 0xffff00, 2, 8, 7 )
    const candle2 = new THREE.PointLight( 0xff2000, 7, 8, 7 )
    const candle2big = new THREE.PointLight( 0xffff00, 2, 8, 7 )


   /* for (let i = 0; i<=3; i++){
      this.candle = new THREE.PointLight( 0xff5000, i, 10,5 )
      this.candlebig = new THREE.PointLight( 0xff8000, i, 5,2 )
      console.log(i);
    }
this.candle.position.set( 4.5, 2.2, -4.1 );
this.candlebig.position.set( 4.5, 2.2, -4.1 );

for (let i = 0; i<=3; i++){
  this.candle2 = new THREE.PointLight( 0xff5000, i, 10,5 )
  console.log(i);
}*/
candle2.position.set( 4.5, 2.2, -1.8 );
candle.position.set( 4.5, 2.2, -4.1 );
candlebig.position.set( 4.5, 2.2, -4.1 );
candle2big.position.set( 4.5, 2.2, -1.8 );
  
    
    const sphereSize1 = 0.4;
    const sphereSize2 = 1;
    const candleHelper = new THREE.PointLightHelper(candle, sphereSize1)
    const candleHelper2 = new THREE.PointLightHelper(candle2, sphereSize1)
    const candlebigHelper = new THREE.PointLightHelper(candlebig, sphereSize2)
    const candlebig2Helper = new THREE.PointLightHelper(candle2big, sphereSize2)
    this.scene.add(candleHelper, candleHelper2, candlebigHelper, candlebig2Helper);
    this.scene.add( candle, candle2, candlebig, candle2big );


    this.scene.add(hemilight, directionalLight );

    

    directionalLight.castShadow = true;
    directionalLight.position.set(5, 10, 0);
    directionalLight.target.position.set(4, 3, -7.5);

    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default

    const dirLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      5
    );
    this.scene.add(dirLightHelper);

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

    window.addEventListener("resize", this.onWindowResize);

    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  initScene() {
    //CREATE CUBE
    this.room = new THREE.LineSegments(
       );
   
    this.scene.add( this.room );


    const boxgeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubematerial = new THREE.MeshLambertMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 1,
      visible: true,
    });
 
    this.cube = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.cube);
       this.cube.castShadow = true;

    this.highlight = new THREE.Mesh(boxgeometry,
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide }));
    this.highlight.scale.set(1.2, 1.2, 1.2);
    

   
    //Boden Texture
    const myBodenTextureLoader = new THREE.TextureLoader();
    const BodenBaseColor = myBodenTextureLoader.load(
      "textures/boden/Metal_ArtDeco_Tiles_001_basecolor.jpg"
    );
    BodenBaseColor.wrapS = THREE.RepeatWrapping;
    BodenBaseColor.wrapT = THREE.RepeatWrapping;
    BodenBaseColor.repeat.set(2, 25);

    const BodenNormalMap = myBodenTextureLoader.load(
      "textures/boden/Metal_ArtDeco_Tiles_001_normal.jpg"
    );
    BodenNormalMap.wrapS = THREE.RepeatWrapping;
    BodenNormalMap.wrapT = THREE.RepeatWrapping;
    BodenNormalMap.repeat.set(2, 25);

    const BodenHeightMap = myBodenTextureLoader.load(
      "textures/boden/Metal_ArtDeco_Tiles_001_height.png"
    );
    BodenHeightMap.wrapS = THREE.RepeatWrapping;
    BodenHeightMap.wrapT = THREE.RepeatWrapping;
    BodenHeightMap.repeat.set(2, 25);

    const BodenRoughnessMap = myBodenTextureLoader.load(
      "textures/boden/Metal_ArtDeco_Tiles_001_roughness.jpg"
    );
    BodenRoughnessMap.wrapS = THREE.RepeatWrapping;
    BodenRoughnessMap.wrapT = THREE.RepeatWrapping;
    BodenRoughnessMap.repeat.set(2, 25);

    const BodenAmbientOcclusionMap = myBodenTextureLoader.load(
      "textures/boden/Metal_ArtDeco_Tiles_001_ambientOcclusion.jpg"
    );
    BodenAmbientOcclusionMap.wrapS = THREE.RepeatWrapping;
    BodenAmbientOcclusionMap.wrapT = THREE.RepeatWrapping;
    BodenAmbientOcclusionMap.repeat.set(2, 25);

    const BodenMetalic = myBodenTextureLoader.load(
      "textures/boden/Metal_ArtDeco_Tiles_001_metallic.jpg"
    );
    BodenMetalic.wrapS = THREE.RepeatWrapping;
    BodenMetalic.wrapT = THREE.RepeatWrapping;
    BodenMetalic.repeat.set(2, 25);

    //irgendwas mit metall
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
      encoding: THREE.SRGBColorSpace,
    });

    const cubeCamera = new THREE.CubeCamera(1, 10000, cubeRenderTarget);
    //CREATE PLANE

    //Der Boden ist keine Lava
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 100, 400, 400),
      new THREE.MeshStandardMaterial({
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
        envMap: cubeRenderTarget.texture,
      })
    );
    plane.position.x = 0;
    plane.position.y = -1;
    plane.position.z = -50;
    plane.rotation.set(Math.PI / 2, 0, 0);
    plane.receiveShadow = true;
    this.scene.add(plane);
    plane.add(cubeCamera);

   


    //Wand Texture
    const myTextureLoader = new THREE.TextureLoader();
    const tilesBaseColor = myTextureLoader.load(
      "textures/Stone_Floor_006_basecolor.jpg"
    );
    tilesBaseColor.wrapS = THREE.RepeatWrapping;
    tilesBaseColor.wrapT = THREE.RepeatWrapping;
    tilesBaseColor.repeat.set(25, 1);

    const tilesNormalMap = myTextureLoader.load(
      "textures/Stone_Floor_006_normal.jpg"
    );
    tilesNormalMap.wrapS = THREE.RepeatWrapping;
    tilesNormalMap.wrapT = THREE.RepeatWrapping;
    tilesNormalMap.repeat.set(25, 1);

    const tilesHeightMap = myTextureLoader.load(
      "textures/Stone_Floor_006_height.png"
    );
    tilesHeightMap.wrapS = THREE.RepeatWrapping;
    tilesHeightMap.wrapT = THREE.RepeatWrapping;
    tilesHeightMap.repeat.set(25, 1);

    const tilesRoughnessMap = myTextureLoader.load(
      "textures/Stone_Floor_006_roughness.jpg"
    );
    tilesRoughnessMap.wrapS = THREE.RepeatWrapping;
    tilesRoughnessMap.wrapT = THREE.RepeatWrapping;
    tilesRoughnessMap.repeat.set(25, 1);

    const tilesAmbientOcclusionMap = myTextureLoader.load(
      "textures/Stone_Floor_006_ambientOcclusion.jpg"
    );
    tilesAmbientOcclusionMap.wrapS = THREE.RepeatWrapping;
    tilesAmbientOcclusionMap.wrapT = THREE.RepeatWrapping;
    tilesAmbientOcclusionMap.repeat.set(25, 1);

    //Wand
    const wand2 = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 5, 400, 400),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: tilesBaseColor,
        normalMap: tilesNormalMap,
        displacementMap: tilesHeightMap,
        displacementScale: 0.7,
        roughnessMap: tilesRoughnessMap,
        roughness: 1,
        aoMap: tilesAmbientOcclusionMap,
      })
    );
    wand2.geometry.attributes.uv2 = wand2.geometry.attributes.uv;
    wand2.position.x = 5.5;
    wand2.position.z = -50;
    wand2.position.y = 1;
    wand2.rotation.set(Math.PI / 1, 4.72, 0.005);
    this.scene.add(wand2);
    wand2.castShadow = true;
    wand2.receiveShadow = true;
    
    
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
    var gui = new GUI();

    var cubeFolder = gui.addFolder("Change the Cube");
    cubeFolder.add(this.cube.position, "z", -10, 10).listen();
    cubeFolder.add(this.cube.material, "visible").listen();
    cubeFolder.open();

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
    var myModels = ["wand-door.glb", "Fackel.glb", "Fackel2.glb"];

    let me = this;
    const myGLTFloader = new GLTFLoader();
   
    const meinpfad = "./textures/";

    for (let i = 0; i <= myModels.length - 1; i++) {
      var dateipfad = meinpfad + myModels[i];

      myGLTFloader.load(
        dateipfad,

        function (gltf) {
          
          me.scene.add(gltf.scene);

          gltf.scene; // THREE.Group
          gltf.cameras; // Array<THREE.Camera>
          gltf.asset; // Object
          const mygltf = gltf.scene;
          var saythename = mygltf.getObjectsByProperty(myModels[i]);
          console.log(saythename);
          
         /* const fackel = mygltf.getObjectByName('dieFackel');

          const copie = Object.assign({}, fackel);
          console.log(copie);
          copie.position.set(2,2,2);

          
          fackel.position.set(0,0,0);
         */

        },
        function (xhr) {
          console.log(
            ((xhr.loaded / xhr.total) * 100).toFixed() +
              "% loaded" 
          );
        },
        function (error) {
          console.log("An error happened");
        }
      );
      //myModels[2].position.set(0,0,0);
    }
   

  }

  test(){



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
      self.highlight.visible = false;
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

 

  handleController(controller) {
   if (controller.userData.selectPressed ){
   
            controller.children[0].scale.z = 10;
            this.scene.add(this.highlight);
            this.workingMatrix.identity().extractRotation( controller.matrixWorld );

            this.raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
            this.raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( this.workingMatrix );

            const intersects = this.raycaster.intersectObjects( this.room.children );
            console.log('push');
      
           


            if (intersects.length>0){
                intersects[0].object.add(this.highlight);
                this.highlight.visible = true;
                console.log('visible = true')
                controller.children[0].scale.z = intersects[0].distance;
                
            }else{
                this.highlight.visible = false;
                console.log('visible = false')
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
          self.handleController( controller ) 
      });
  }

    this.renderer.render(this.scene, this.camera);
  }
 }


export { App };
