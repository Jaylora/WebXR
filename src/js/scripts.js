import * as THREE from "three";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";

import { GUI } from "../../node_modules/three/examples/jsm/libs/lil-gui.module.min.js";
import { VRButton } from "../../node_modules/three/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "../../node_modules/three/examples/jsm/webxr/XRControllerModelFactory.js";
import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "../../node_modules/three/examples/jsm/loaders/RGBELoader.js";
import { BoxLineGeometry } from "../../node_modules/three/examples/jsm/geometries/BoxLineGeometry.js";
import { Stats } from "../../node_modules/three/examples/jsm/libs/stats.module.js";
import {
  Constants as MotionControllerConstants,
  fetchProfile,
  MotionController,
} from "../../node_modules/three/examples/jsm/libs/motion-controllers.module.js";
import * as TWEEN from "/../node_modules/@tweenjs/tween.js/dist/tween.esm.js";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

class App {
  camera;
  scene;
  renderer;
  container;
  cube;
  cube2;
  cube3;
  cube4;
  viscobutton3;
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
    this.scene.background = new THREE.Color(0x0088ff);

    //Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
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
    
    
    this.mylight();
    this.mytextures();
    
    this.setupXR();

    window.addEventListener("resize", this.onWindowResize);

    window.addEventListener("resize", this.onWindowResize.bind(this));

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  initScene() {
    this.room = new THREE.LineSegments();

    this.scene.add(this.room);

    //CREATE CUBE TO INTERACT
    const boxgeometry = new THREE.CylinderGeometry(0.2,0.2,0.2,24,3);

     
      
    
    // CREATE CUBE TO INTERACT MATERIAL
    const cubematerial = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(0, 174, 255)"),
      specular: new THREE.Color("rgb(255, 255, 255)"),
      shininess: 40
    });

    //Würfel erstellen und zum Raumm hinzufügen
    //COMBINE CUBE TO INTERACT WITH MATERIAL

    
    this.cube = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.cube);
    this.cube.castShadow = true;
    this.cube.name = "cube1";
   

    this.cube2 = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.cube2);
    this.cube2.castShadow = true;
    this.cube2.name = "cube2";

    this.cube3 = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.cube3);
    this.cube3.castShadow = true;
    this.cube3.name = "cube3";

    this.cube4 = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.cube4);
    this.cube4.castShadow = true;
    this.cube4.name = "cube4";

    this.viscobutton3 = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.viscobutton3);
    this.viscobutton3.castShadow = true;
    this.viscobutton3.name = "viscobutton3";

    //Highlight für Würfel
    this.highlight = new THREE.Mesh(
      boxgeometry,
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide, transparent: true, opacity: 0.5 })
    );
    this.highlight.scale.set(1.1, 1.1, 1.1);

    this.cube.position.set(1.75, 1, -2);
    this.cube2.position.set(1.75, 1, -1.5);
    this.cube3.position.set(-1.75, 1, 0.5);
    this.cube4.position.set(-1.75, 1, 1);
    this.viscobutton3.position.set(-1.75, 1, 0);

    //HILFE
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

   



    //Vitrinen
      const vitrinegeo = new THREE.BoxGeometry (1, 0.3, 3);
      const standmat = new THREE.MeshPhongMaterial({color: 0x000000, emmissive: 0xffffff, specular: 0xffff50, shininess: 40, transparent: true, opacity:0.4
      });

      //Buttonstand
      const standgeo = new THREE.CylinderGeometry(0.25,0.1,1.5,24,6);
      
      const buttonstand = new THREE.Mesh(standgeo, standmat);
      const buttonstand2 = new THREE.Mesh(standgeo, standmat);
      const buttonstand3 = new THREE.Mesh(standgeo, standmat);
      const buttonstand4 = new THREE.Mesh(standgeo, standmat);
      const buttonstand5 = new THREE.Mesh(standgeo, standmat);
      this.scene.add(buttonstand, buttonstand2, buttonstand3, buttonstand4, buttonstand5);
      buttonstand.position.set(1.75, 0.2, -2);
      buttonstand2.position.set(1.75, 0.2, -1.5);
      buttonstand3.position.set(-1.75, 0.2, 0.5);
      buttonstand4.position.set(-1.75, 0.2, 1);
      buttonstand5.position.set(-1.75, 0.2, 0);
      




     

  }

  mylight() {
    // CREATE LIGHT
   
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.target.updateMatrixWorld();

    directionalLight.castShadow = true;
    directionalLight.position.set(0, 10, 0);

    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default

    const hemilight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);

    const lamp = new THREE.PointLight(0x008888, 5, 8, 3); // Blau
    const lampbig = new THREE.PointLight(0xffffff, 0.5, 8, 7); // Weiß
    const lamp2 = new THREE.PointLight(0x008888, 5, 8, 3); // Gelb
    const lampbig2 = new THREE.PointLight(0xffffff, 0.5, 8, 7); //Weiß

    /*
      [0  0]
      [0  0]
      [0  X]
    */
    const lamp3 = new THREE.PointLight(0x008888, 10, 8, 3); //Blau
    const lampbig3 = new THREE.PointLight(0xffffff, 0.5, 8, 7); // Weiß

    /*
      [X  0]
      [0  0]
      [0  0]
    */
    const lamp4 = new THREE.PointLight(0x008888, 5, 8, 3); // Blau
    const lampbig4 = new THREE.PointLight(0xffffff, 0.5, 8, 7); // Weiß

    /*
      [0  0]
      [X  0]
      [0  0]
    */

    const lamp5 = new THREE.PointLight(0x008888, 5, 8, 3); //Gelb
    const lampbig5 = new THREE.PointLight(0xffffff, 0.5, 8, 7); // Weiß

    const lamp6 = new THREE.PointLight(0x008888, 5, 8, 3); // Blau
    const lampbig6 = new THREE.PointLight(0xffffff, 0.5, 8, 7); //Weiß

    lamp.position.set(4.8, 1, -3.5);
    //lampbig.position.set(4.8, 1, -3.5);

    lamp2.position.set(4.8, 1, 0);
   // lampbig2.position.set(4.8, 1, 0);

    lamp3.position.set(4.8, 1, 3.5);
   // lampbig3.position.set(4.8, 1, 3.5);

    lamp4.position.set(-4.8, 1, -3.5);
   // lampbig4.position.set(-4.8, 1, -3.5);

    lamp5.position.set(-4.8, 1, 0);
   // lampbig5.position.set(-4.8, 1, 0);

    lamp6.position.set(-4.8, 1, 3.5);
   // lampbig6.position.set(-4.8, 1, 3.5);

    const sphereSize1 = 0.4;
    const sphereSize2 = 1;
    const lampHelper = new THREE.PointLightHelper(lamp, sphereSize1);
    const lamp2Helper = new THREE.PointLightHelper(lamp2, sphereSize1);
    const lamp3helper = new THREE.PointLightHelper(lamp3, sphereSize1);
    const lamp4Helper = new THREE.PointLightHelper(lamp4, sphereSize1);
    const lamp5Helper = new THREE.PointLightHelper(lamp5, sphereSize1);
    const lamp6Helper = new THREE.PointLightHelper(lamp6, sphereSize1);
   /* const lampbigHelper = new THREE.PointLightHelper(lampbig, sphereSize2);
    const lampbig2Helper = new THREE.PointLightHelper(lampbig2, sphereSize2);
    const lampbig3Helper = new THREE.PointLightHelper(lampbig3, sphereSize2);
    const lampbig4Helper = new THREE.PointLightHelper(lampbig4, sphereSize2);
    const lampbig5Helper = new THREE.PointLightHelper(lampbig5, sphereSize2);
    const lampbig6Helper = new THREE.PointLightHelper(lampbig6, sphereSize2);*/

    this.scene.add(
      lampHelper,
      lamp2Helper,
    //  lampbigHelper,
    //  lampbig2Helper,
      lamp3helper,
    //  lampbig3Helper,
      lamp4Helper,
   //   lampbig4Helper,
      lamp5Helper,
   //   lampbig5Helper,
      lamp6Helper,
   //   lampbig6Helper
    );
    this.scene.add(
      lamp,
      lamp2,
      lamp3,
      lamp6,
      lamp4,
      lamp5,
     /* lampbig5,
      lampbig6, lampbig4, lampbig,
      lampbig2,
      lampbig3,*/
    );

    this.scene.add(hemilight, directionalLight );

    const uplight = new THREE.SpotLight(0xffffff, 5, 2, 0.8, 0.5, 2);
    uplight.castShadow = true;
    uplight.target.position.set(4.5, 1, 0);
    uplight.target.updateMatrixWorld();
    uplight.position.set(3, 0.2, 0);

    const uplight2 = new THREE.SpotLight(0xffffff, 5, 2, 0.8, 0.5, 2);
    uplight2.castShadow = true;
    uplight2.target.position.set(4.5, 1, 3.5);
    uplight2.target.updateMatrixWorld();
    uplight2.position.set(3, 0.2, 3.5);

    const uplight3 = new THREE.SpotLight(0xffffff, 5, 2, 0.8, 0.5, 2);
    uplight3.castShadow = true;
    uplight3.target.position.set(4.5, 1, -3.5);
    uplight3.target.updateMatrixWorld();
    uplight3.position.set(3, 0.2, -3.5);

    const light = new THREE.AmbientLight(0x404040); // soft white light

    this.scene.add(uplight.target, uplight2.target, uplight3.target);
    this.scene.add(uplight, uplight2, uplight3, light);

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

    const spotLightHelper = new THREE.SpotLightHelper(uplight);
    const spotLightHelper2 = new THREE.SpotLightHelper(uplight2);
    const spotLightHelper3 = new THREE.SpotLightHelper(uplight3);

    this.scene.add(spotLightHelper, spotLightHelper2, spotLightHelper3);
  }
  mytextures() {
    //Lampenschirm

    //Boden Texture
    const myBodenTextureLoader = new THREE.TextureLoader();
    const BodenBaseColor = myBodenTextureLoader.load(
      "textures/boden/laminate_floor_02_diff_4k.jpg"
    );
    BodenBaseColor.wrapS = THREE.RepeatWrapping;
    BodenBaseColor.wrapT = THREE.RepeatWrapping;
    BodenBaseColor.repeat.set(5, 5);

    const BodenNormalMap = myBodenTextureLoader.load(
      "textures/boden/laminate_floor_02_nor_gl_4k.jpg"
    );
    BodenNormalMap.wrapS = THREE.RepeatWrapping;
    BodenNormalMap.wrapT = THREE.RepeatWrapping;
    BodenNormalMap.repeat.set(5, 5);

    const BodenHeightMap = myBodenTextureLoader.load(
      "textures/boden/laminate_floor_02_disp_4k.png"
    );
    BodenHeightMap.wrapS = THREE.RepeatWrapping;
    BodenHeightMap.wrapT = THREE.RepeatWrapping;
    BodenHeightMap.repeat.set(5, 5);

    const BodenRoughnessMap = myBodenTextureLoader.load(
      "textures/boden/laminate_floor_02_rough_4k.jpg"
    );
    BodenRoughnessMap.wrapS = THREE.RepeatWrapping;
    BodenRoughnessMap.wrapT = THREE.RepeatWrapping;
    BodenRoughnessMap.repeat.set(5, 5);
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
        displacementScale: 1,
        roughnessMap: BodenRoughnessMap,
        roughness: 10,
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
      "textures/wand/beige_wall_001_diff_4k.jpg"
    );
    tilesBaseColor.wrapS = THREE.RepeatWrapping;
    tilesBaseColor.wrapT = THREE.RepeatWrapping;
    tilesBaseColor.repeat.set(1, 1);

    const tilesNormalMap = myTextureLoader.load(
      "textures/wand/beige_wall_001_nor_gl_4k.exr"
    );
    tilesNormalMap.wrapS = THREE.RepeatWrapping;
    tilesNormalMap.wrapT = THREE.RepeatWrapping;
    tilesNormalMap.repeat.set(1, 1);

    const tilesHeightMap = myTextureLoader.load(
      "textures/wand/beige_wall_001_disp_4k.png"
    );
    tilesHeightMap.wrapS = THREE.RepeatWrapping;
    tilesHeightMap.wrapT = THREE.RepeatWrapping;
    tilesHeightMap.repeat.set(1, 1);

    const tilesRoughnessMap = myTextureLoader.load(
      "textures/wand/beige_wall_001_rough_4k.jpg"
    );
    tilesRoughnessMap.wrapS = THREE.RepeatWrapping;
    tilesRoughnessMap.wrapT = THREE.RepeatWrapping;
    tilesRoughnessMap.repeat.set(1, 1);

    //const tilesAmbientOcclusionMap = myTextureLoader.load(
    //  "textures/Stone_Floor_006_ambientOcclusion.jpg"
    //);
    //tilesAmbientOcclusionMap.wrapS = THREE.RepeatWrapping;
    //tilesAmbientOcclusionMap.wrapT = THREE.RepeatWrapping;
    //tilesAmbientOcclusionMap.repeat.set(25, 1);

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
    wand2.rotation.set(0, -Math.PI / 2, 0);
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
    wand3.rotation.set(0, Math.PI / 2, 0);
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
    wand4.rotation.set(0, (Math.PI / 2) * 180, 0);
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

  createButtonStates(components) {
    const buttonStates = {};
    this.gamepadIndices = components;

    Object.keys(components).forEach((key) => {
      if (key.indexOf("touchpad") != -1 || key.indexOf("thumbstick") != -1) {
        buttonStates[key] = { button: 0, xAxis: 0, yAxis: 0 };
      } else {
        buttonStates[key] = 0;
      }
    });

    this.buttonStates = buttonStates;
  }

  loadMyFiles() {
    var myModels = ["lampe.glb", /*"kabel-sonde.glb",*/ "viscosity.glb"];
    let me = this;

        
    new RGBELoader()
      .setPath("./textures/hdr/")
      .load("industrial_sunset_puresky_2k.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        me.scene.background = texture;
        me.scene.environment = texture;
      });

    const myGLTFloader = new GLTFLoader();

    const meinpfad = "./textures/";

    for (let i = 0; i <= myModels.length - 1; i++) {
      var dateipfad = meinpfad + myModels[i];

      myGLTFloader.load(
        dateipfad, 

        function (gltf) {
          //me.renderer.outputColorSpace = THREE.SRGBColorSpace;

          me.scene.add(gltf.scene);
          var mygltf = gltf.scene;

          // mygltf.children[i].material.metalness = 0.2;
          gltf.scene; // THREE.Group
          gltf.cameras; // Array<THREE.Camera>
          gltf.asset; // Object

          var saythename = mygltf.getObjectsByProperty(myModels[i]);
          console.log("SAY THE NAME");
          console.log(saythename);
          console.log("SAY THE NAME");

          
          
        },
        function (xhr) {
          console.log(((xhr.loaded / xhr.total) * 100).toFixed() + "% loaded");

          
        },
        function (error) {
          console.log("An error happened");
        }

       
      );
      
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
    
    

    if (controller.userData.selectPressed) {
      // VR-Buttons
      controller.children[0].scale.z = 10;
      this.scene.add(this.highlight);
      /* this.scene.add(this.highlight2); */
      this.workingMatrix.identity().extractRotation(controller.matrixWorld);

      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      this.raycaster.ray.direction
        .set(0, 0, -1)
        .applyMatrix4(this.workingMatrix);

      //const intersects2 = this.raycaster.intersectObject(this.room.children[0]); //cube
      const intersects = this.raycaster.intersectObjects(this.room.children); //cube2

      // console.log(this.room.children[0]);
      // console.log(intersects);

      if (intersects.length > 0) {
        /*  console.log("DIE SZENE");
              
              console.log(myscene.children[47]);            
              console.log("DIE SZENE");
              console.log(this.room.children);
            */
      //  console.log(myscene);
        const kabel = myscene.getObjectByName("Kabelsonde").getObjectByName("KF25-kabel-kabel");
        const kopf = myscene.getObjectByName("Kabelsonde").getObjectByName("KF25-Kopf");
        const extention = myscene.getObjectByName("Kabelsonde").getObjectByName("KF25-Verlängerung");
        const sonde = myscene.getObjectByName("Kabelsonde").getObjectByName("KF25-Sonde");

        const zylinderLinksCurve = myscene.getObjectByName("viscosity").getObjectByName("Zylinder_links_curve");
        const zylinderLinksText = myscene.getObjectByName("viscosity").getObjectByName("Zylinder_links_text");
        const zylinderLinksPlane = myscene.getObjectByName("viscosity").getObjectByName("Zylinder_links_plane");
        const kugelText = myscene.getObjectByName("viscosity").getObjectByName("Kugel_text");
        const kugelCurve = myscene.getObjectByName("viscosity").getObjectByName("Kugel_text");
        const kugelPlane = myscene.getObjectByName("viscosity").getObjectByName("Kugel_Plane");

        const flanschzylinder = myscene.getObjectByName("viscosity").getObjectByName("Flansch-Zylinder");
        const flanschanschluss = myscene.getObjectByName("viscosity").getObjectByName("Flansch-Anschluss");
        const flansch = myscene.getObjectByName("viscosity").getObjectByName("Flansch");
        const flanschbody = myscene.getObjectByName("viscosity").getObjectByName("Flansch-Körper");

        const flanschkugel = myscene.getObjectByName("viscosity").getObjectByName("Flansch-Kugel");
        const standard = myscene.getObjectByName("viscosity").getObjectByName("Standard");
        const standardanschluss = myscene.getObjectByName("viscosity").getObjectByName("Anschluss_Standard");
        const standardbody = myscene.getObjectByName("viscosity").getObjectByName("Standard_Körper");

        const nptanschluss = myscene.getObjectByName("viscosity").getObjectByName("NPT-Anschluss");
        const nptzylinder = myscene.getObjectByName("viscosity").getObjectByName("NPT-Zylinder");
        const nptbody = myscene.getObjectByName("viscosity").getObjectByName("NPT-Körper");
        const npt = myscene.getObjectByName("viscosity").getObjectByName("NPT");


        zylinderLinksCurve.visible=false;
        zylinderLinksCurve.material.transparent = true;
       zylinderLinksCurve.material.opacity = 0;
        zylinderLinksText.visible = false;
        zylinderLinksText.material.transparent = true;
        zylinderLinksText.material.opacity = 0;

        zylinderLinksPlane.visible = false;
        zylinderLinksPlane.material.transparent = true;
        zylinderLinksPlane.material.opacity = 0;

        kugelCurve.visible = false;
        kugelCurve.material.transparent = true;
        kugelCurve.material.opacity = 0;

        kugelPlane.visible = false;
        kugelPlane.material.transparent = true;
        kugelPlane.material.opacity = 0;

        kugelText.visible = false;
        kugelText.material.transparent = true;
        kugelText.material.opacity = 0;

        intersects[0].object.add(this.highlight);
        this.highlight.visible = true;

         console.log(intersects[0]);
        controller.children[0].scale.z = intersects[0].distance;
        //Buttons werden gedrückt
        // Button für Füllstand explode
        if ( this.highlight.visible == true && intersects[0].object.name == "cube1"){
          const stats = Stats();
          document.body.appendChild(stats.dom);

          const downcubeleft = () => { new TWEEN.Tween(intersects[0].object.position)
              .to(
                {
                  y: 0.9,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

              intersects[0].object.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(10, 63, 71)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 10,
                shading: THREE.FlatShading,
                transparent: 1,
                opacity: 1,
              });
            new TWEEN.Tween(this.cube2.position)
              .to(
                {
                  y: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

              this.cube2.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(0, 174, 255)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 40
              });
            //console.log('controller links');
          };

          const explosive = () => {new TWEEN.Tween(kopf.position)
              .to(
                {
                  y: 2.5,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(sonde.position)
              .to(
                {
                  y: 1.9,
                },
                500
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

        // Button 2 für Füllstand shrink
        if ( this.highlight.visible == true && intersects[0].object.name == "cube2") {
          const stats = Stats();
          document.body.appendChild(stats.dom);

          const downcuberight = () => { new TWEEN.Tween(intersects[0].object.position)
              .to(
                {
                  y: 0.9,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();
              intersects[0].object.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(10, 63, 71)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 10,
                shading: THREE.FlatShading,
                transparent: 1,
                opacity: 1,
              });

            new TWEEN.Tween(this.cube.position)
              .to(
                {
                  y: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();
              this.cube.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(0, 174, 255)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 40
              });
          };
          const shrink = () => { new TWEEN.Tween(kopf.position)
              .to(
                {
                  y: 2.1661229133605957,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(sonde.position)
              .to(
                {
                  y: 2.1661229133605957,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();
          };

          var animate = function () { requestAnimationFrame(animate);
            TWEEN.update();
            stats.update();
          };

          animate();
          downcuberight();
          shrink();

          //intersects[0].object.position.setY(-0.2);

          // this.cube.position.setY(0);
        }
        // Button für Viscosität explode
        if ( this.highlight.visible == true && intersects[0].object.name == "cube3") {
          const stats = Stats();
          document.body.appendChild(stats.dom);

          const downcuberightvisco = () => {
            new TWEEN.Tween(intersects[0].object.position)
              .to(
                {
                  y: 0.9,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();
              intersects[0].object.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(10, 63, 71)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 10,
                shading: THREE.FlatShading,
                transparent: 1,
                opacity: 1,
              });

            new TWEEN.Tween(this.cube4.position)
              .to(
                {
                  y: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

              this.cube4.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(0, 174, 255)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 40
              });
              new TWEEN.Tween(this.viscobutton3.position)
              .to(
                {
                  y: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

              this.viscobutton3.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(0, 174, 255)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 40
              });
          };


          const explosivevisco = () => { new TWEEN.Tween(flanschzylinder.position)
              .to(
                {
                  y: 1.2, //1.6163400411605835
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flanschanschluss.position)
              .to(
                {
                  y: 1.8, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flansch.position)
              .to(
                {
                  y: 1.4, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flanschkugel.position)
              .to(
                {
                  y: 1.2, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(standardanschluss.position)
              .to(
                {
                  y: 1.8, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(standard.position)
              .to(
                {
                  y: 1.4, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(nptanschluss.position)
              .to(
                {
                  y: 1.8, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(nptzylinder.position)
              .to(
                {
                  y: 1.2, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(npt.position)
              .to(
                {
                  y: 1.4, //1.6163431406021118
                },
                500
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
      
        // Button für Viscosität shrink
        if ( this.highlight.visible == true && intersects[0].object.name == "cube4") {
          const stats = Stats();
          document.body.appendChild(stats.dom);

          const downcubeleftvisco = () => {
            new TWEEN.Tween(intersects[0].object.position)
              .to(
                {
                  y: 0.9,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();
              intersects[0].object.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(10, 63, 71)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 10,
                shading: THREE.FlatShading,
                transparent: 1,
                opacity: 1,
              });
            new TWEEN.Tween(this.cube3.position)
              .to(
                {
                  y: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();
              this.cube3.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(0, 174, 255)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 40
              });
              new TWEEN.Tween(this.viscobutton3.position)
              .to(
                {
                  y: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

              
              this.viscobutton3.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color("rgb(0, 174, 255)"),
                specular: new THREE.Color("rgb(255, 255, 255)"),
                shininess: 40
              });
          };
          

          const shrinkvisco = () => {
            new TWEEN.Tween(flanschzylinder.position)
              .to(
                {
                  y: 1.6163, //1.6163400411605835
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flanschanschluss.position)
              .to(
                {
                  y: 1.6163, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flansch.position)
              .to(
                {
                  y: 1.6163, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flanschkugel.position)
              .to(
                {
                  y: 1.616, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(standardanschluss.position)
              .to(
                {
                  y: 1.616, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(standard.position)
              .to(
                {
                  y: 1.616, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(nptanschluss.position)
              .to(
                {
                  y: 1.616, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(nptzylinder.position)
              .to(
                {
                  y: 1.616, //1.6163431406021118
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(npt.position)
              .to(
                {
                  y: 1.616, //1.6163431406021118
                },
                500
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
        // Button für Informationen Visco
        if( this.highlight.visible == true && intersects[0].object.name == "viscobutton3"){
            const stats = Stats();
            document.body.appendChild(stats.dom);
            console.log("Der BUTTON IST GEDRÜCKT!");

            const showinfobutton = () => {
              new TWEEN.Tween(intersects[0].object.position)
                .to(
                  {
                    y: 0.9,
                  },
                  500
                )
                .easing(TWEEN.Easing.Cubic.Out)
                .start();
                intersects[0].object.material = new THREE.MeshPhongMaterial({
                  color: new THREE.Color("rgb(10, 63, 71)"),
                  specular: new THREE.Color("rgb(255, 255, 255)"),
                  shininess: 10,
                  shading: THREE.FlatShading,
                  transparent: 1,
                  opacity: 1,
                });
                zylinderLinksText.visible = true;
                zylinderLinksPlane.visible = true;
                zylinderLinksCurve.visible=true;
                kugelCurve.visible = true;
                kugelPlane.visible = true;
                kugelText.visible = true;

                new TWEEN.Tween(zylinderLinksText.material && zylinderLinksCurve.material && zylinderLinksPlane.material)
                .to({
                  
                  opacity: 1

                },500)
                .easing(TWEEN.Easing.Linear.None)
                .start();

                new TWEEN.Tween(kugelCurve.material && kugelPlane.material && kugelText.material)
                .to({
                  opacity: 1
                }, 500)
                .easing(TWEEN.Easing.Linear.None)
                .start();

                
        
       
        
          };
          var animate = function () {
            requestAnimationFrame(animate);

            TWEEN.update();
            stats.update();
          };
          animate();
          showinfobutton();
        }
          
      } else {
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
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.stats.update();

    
    


    if (this.controllers) {
      const self = this;
      this.controllers.forEach((controller) => {
        self.handleController(controller, this.scene);
      });
    }
    
    this.renderer.render(this.scene, this.camera);
  }
}

export { App };
