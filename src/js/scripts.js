import * as THREE from "three";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js";

import { GUI } from "../../node_modules/three/examples/jsm/libs/lil-gui.module.min.js";
import { VRButton } from "../../node_modules/three/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "../../node_modules/three/examples/jsm/webxr/XRControllerModelFactory.js";
import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "../../node_modules/three/examples/jsm/loaders/RGBELoader.js";
import { BoxLineGeometry } from "../../node_modules/three/examples/jsm/geometries/BoxLineGeometry.js";
import { Stats } from "../../node_modules/three/examples/jsm/libs/stats.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';


class App {
  camera;
  scene;
  renderer;
  container;
  cube;
  // cube2;
  cube3;
  cube4;

  orbitControls;
  controllers;
  raycaster;
  workingMatrix;
  workingVector;
  candle;
  object;
  tank;
  INTERSECTION;
  water;
  alarm;

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
    const boxgeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 24, 3);
    const tankgeometry = new THREE.CylinderGeometry(
      1,
      1,
      4.1,
      10,
      4,
      false,
      0,
      3
    );
    const watergeo = new THREE.CylinderGeometry(
      0.9,
      0.9,
      2,
      10,
      4,
      false,
      0,
      3.15
    );
    const waterplane = new THREE.PlaneGeometry(1.8, 2, 1, 2);

    const alarmgeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 8, 1);

    // CREATE CUBE TO INTERACT MATERIAL
    const cubematerial = new THREE.MeshPhongMaterial({
      color: new THREE.Color("rgb(0, 174, 255)"),
      specular: new THREE.Color("rgb(255, 255, 255)"),
      shininess: 40,
    });

    const tankmaterial = new THREE.MeshLambertMaterial({
      color: new THREE.Color("rgb(140,140,140)"),
      side: THREE.DoubleSide,
    });

    const watermaterial = new THREE.MeshBasicMaterial({
      color: 0x004080,
      side: THREE.DoubleSide,
    });

    const alarmmaterial = new THREE.MeshStandardMaterial({
      color: 0xffcccc,
      emmissive: 0xff0000,
    });

    //Würfel erstellen und zum Raumm hinzufügen
    //COMBINE CUBE TO INTERACT WITH MATERIAL

    this.cube = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.cube);
    this.cube.castShadow = true;
    this.cube.name = "cube1";



    this.cube3 = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.cube3);
    this.cube3.castShadow = true;
    this.cube3.name = "cube3";

    this.cube4 = new THREE.Mesh(boxgeometry, cubematerial);
    this.room.add(this.cube4);
    this.cube4.castShadow = true;
    this.cube4.name = "cube4";

    this.tank = new THREE.Mesh(tankgeometry, tankmaterial);
    this.scene.add(this.tank);
    this.tank.castShadow = true;
    this.tank.name = "MainTank";

    this.water = new THREE.Mesh(watergeo, watermaterial);
    this.watersurf = new THREE.Mesh(waterplane, watermaterial);
    this.room.add(this.water, this.watersurf);
    this.water.castShadow = true;
    this.watersurf.castShadow = true;
    this.water.name = "water";
    this.watersurf.name = "watersurf";

    this.alarm = new THREE.Mesh(alarmgeo, alarmmaterial);
    this.room.add(this.alarm);
    this.alarm.name = "thealarm";



    this.cube.position.set(1.75, 0.7, -0.9);

    this.cube3.position.set(-1.75, 0.7, 0.5);
    this.cube4.position.set(-1.75, 0.7, 1);

    this.tank.position.set(2.5, 0, -2.1);
    this.water.position.set(2.5, -1, -2.1);
    this.watersurf.position.set(2.5, -1, -2.1);
    this.watersurf.rotateY((Math.PI / 180) * 90);
    this.alarm.position.set(2.8, 2.31, -2.4);

    //HILFE
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    //Vitrinen

    const standmat = new THREE.MeshPhongMaterial({
      color: 0xb8cce0,
      emmissive: 0x9eccfa,
      specular: 0xffff50,
      shininess: 40,
    });

    //Buttonstand
    const standgeo = new THREE.CylinderGeometry(0.25, 0.1, 0.8, 24, 6);

    const buttonstand = new THREE.Mesh(standgeo, standmat);

    const buttonstand3 = new THREE.Mesh(standgeo, standmat);
    const buttonstand4 = new THREE.Mesh(standgeo, standmat);

    this.scene.add(buttonstand, buttonstand3, buttonstand4);
    buttonstand.position.set(1.75, 0.2, -0.9);

    buttonstand3.position.set(-1.75, 0.2, 0.5);
    buttonstand4.position.set(-1.75, 0.2, 1);
  }

  mylight() {
    // CREATE LIGHT

    const hemilight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);

    const alarmlamp = new THREE.PointLight(0xff0000, 0, 8, 3);

    alarmlamp.position.set(2.8, 2.31, -2.4);
    alarmlamp.name = "alarmlamp";

    const sphereSize1 = 0.4;

    // const alarmlamphelper = new THREE.PointLightHelper(alarmlamp, sphereSize1);

    // this.scene.add(alarmlamphelper);
    this.scene.add(alarmlamp);
    this.room.add(alarmlamp);

    
    // const sphereSizeL = 0.4;
    // const sphereSizeXL = 1;
    // const lampHelper = new THREE.PointLightHelper(lamp, sphereSizeX)
    // const lampbigHelper = new THREE.PointLightHelper(lampbig, sphereSizeXL)
            
    // this.scene.add(lampHelper, lampbigHelper);
    const light = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(hemilight, light);

    //HILFE
  }
  mytextures() {


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

// Texturierung des Models
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(11, 10, 10, 10),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: BodenBaseColor,
        normalMap: BodenNormalMap,
        displacementMap: BodenHeightMap,
        displacementScale: 1,
        roughnessMap: BodenRoughnessMap,
        roughness: 10
      })
    );
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.rotation.set(1.56, 0, 0);
    plane.receiveShadow = true;
    this.scene.add(plane);


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
    new RGBELoader()
      .setPath("./textures/hdr/")
      .load("industrial_sunset_puresky_2k.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        me.scene.background = texture;
        me.scene.environment = texture;
      });

    var myModels = ["kabel-sonde.glb", "viscosity.glb"];
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
          gltf.scene; // THREE.Group
          gltf.cameras; // Array<THREE.Camera>
          gltf.asset; // Object

          me.room.add(gltf.scene);
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

     
*/
      this.userData.selectPressed = false;

      // TELEPORT
      /* if ( INTERSECTION ) {

        const offsetPosition = { x: - INTERSECTION.x, y: - INTERSECTION.y, z: - INTERSECTION.z, w: 1 };
        const offsetRotation = new THREE.Quaternion();
        const transform = new XRRigidTransform( offsetPosition, offsetRotation );
        const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace( transform );

        renderer.xr.setReferenceSpace( teleportSpaceOffset );

      } */
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

      controller.children[0].scale.z = 10;

      this.workingMatrix.identity().extractRotation(controller.matrixWorld);

      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      this.raycaster.ray.direction
        .set(0, 0, -1)
        .applyMatrix4(this.workingMatrix);

      const intersects = this.raycaster.intersectObjects(this.room.children); //cube2

      // TELEPORT
      /* const teleport = raycaster.intersectObjects( [ plane ] );

					if ( intersects.length > 0 ) {

						INTERSECTION = teleport[ 0 ].point;

					} */


      const zylinderLinksText = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Zylinder_links_text");

    const kugelText = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Kugel_text");
    const variventtext = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Varivent-text");
    const npttext = myscene
      .getObjectByName("viscosity")
      .getObjectByName("NPT-text");
    const flanschtext = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Prozessverbindung_text");

    const flanschzylinder = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Flansch-Zylinder");
    const flanschanschluss = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Flansch-Anschluss");
    const flansch = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Flansch");
    const flanschbody = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Flansch-Körper");

    const flanschkugel = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Flansch-Kugel");
    const standard = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Standard");
    const standardanschluss = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Anschluss_Standard");
    const standardbody = myscene
      .getObjectByName("viscosity")
      .getObjectByName("Standard_Körper");

    const nptanschluss = myscene
      .getObjectByName("viscosity")
      .getObjectByName("NPT-Anschluss");
    const nptzylinder = myscene
      .getObjectByName("viscosity")
      .getObjectByName("NPT-Zylinder");
    const nptbody = myscene
      .getObjectByName("viscosity")
      .getObjectByName("NPT-Körper");
    const npt = myscene.getObjectByName("viscosity").getObjectByName("NPT");

    const water = myscene.getObjectByName("water");
    const watersurf = myscene.getObjectByName("watersurf");
    const thealarm = this.room.getObjectByName("thealarm");
    const alarmlamp = this.room.getObjectByName("alarmlamp");

      if (intersects.length > 0) {


        
        zylinderLinksText.visible = false;

        zylinderLinksText.material.opacity = 0;

        npttext.visible = false;
        variventtext.visible = false;
        kugelText.visible = false;
        flanschtext.visible = false;


        controller.children[0].scale.z = intersects[0].distance;
        //Buttons werden gedrückt
        // Button für Füllstand explode
        if (intersects[0].object.name === "cube1") {
          const stats = Stats();
          document.body.appendChild(stats.dom);


         var tween1 = new TWEEN.Tween(this.cube.position)
              .to(
                {
                  y: 0.6,
                },
                500
              )
               .easing(TWEEN.Easing.Cubic.Out)




         var tween2 =   new TWEEN.Tween(water.position)
              .to(
                {
                  y: 0,
                },
                3000
              )
              
              .easing(TWEEN.Easing.Cubic.Out)
              

          var tween4 =  new TWEEN.Tween(thealarm.material.color)
          
            .to(
              {
                r: 1,
                g: 0,
                b: 0,
              },
              3000
            )
            
            .easing(TWEEN.Easing.Cubic.Out)
            

       var tween5 =   new TWEEN.Tween(alarmlamp)
       
            .to(
              {
                decay: 0,
                intensity: 10,
              },
              3000
            )
            
            .easing(TWEEN.Easing.Cubic.Out)

        var tween6 =    new TWEEN.Tween(water.position)
              .to(
                {
                  y: -1,
                },
                3000
              )
              
              .easing(TWEEN.Easing.Cubic.Out)


         var tween7 =   new TWEEN.Tween(thealarm.material.color)
              .to(
                {
                  r: 1,
                  g: 0.5,
                  b: 0.5,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)


         var tween8 =   new TWEEN.Tween(alarmlamp)
              .to(
                {
                  decay: 5,
                  intensity: 0,
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)


         


          var tween10 =  new TWEEN.Tween(this.cube.position)
            .to(
              {
                y: 0.7,
              },
              500
            )
            .easing(TWEEN.Easing.Cubic.Out)



          tween1.chain(tween2);
          tween2.chain(tween4, tween5)

          tween5.chain(tween6, tween7, tween8);

          tween8.chain(tween10);
          
          
          tween1.start();
          

          var animate = function () {
            requestAnimationFrame(animate);

            TWEEN.update();
            stats.update();
          };
          animate()


          

        }
      
      


        if (watersurf.position == (2.5,0,-2.1)) {
          
        }
        

        if (intersects[0].object.name ==="cube3"
        ) {
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
              shininess: 40,
            });
          };

          const explosivevisco = () => {
            new TWEEN.Tween(flanschzylinder.position)
              .to(
                {
                  y: 1.2, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flanschanschluss.position)
              .to(
                {
                  y: 1.8, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flansch.position)
              .to(
                {
                  y: 1.4, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flanschkugel.position)
              .to(
                {
                  y: 1.2, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(standardanschluss.position)
              .to(
                {
                  y: 1.8, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(standard.position)
              .to(
                {
                  y: 1.4, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(nptanschluss.position)
              .to(
                {
                  y: 1.8, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(nptzylinder.position)
              .to(
                {
                  y: 1.2, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(npt.position)
              .to(
                {
                  y: 1.4, 
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
        if (intersects[0].object.name ==="cube4") {
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
              shininess: 40,
            });
          };

          const shrinkvisco = () => {
            new TWEEN.Tween(flanschzylinder.position)
              .to(
                {
                  y: 1.6163, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flanschanschluss.position)
              .to(
                {
                  y: 1.6163, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flansch.position)
              .to(
                {
                  y: 1.6163, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(flanschkugel.position)
              .to(
                {
                  y: 1.616, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(standardanschluss.position)
              .to(
                {
                  y: 1.616, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(standard.position)
              .to(
                {
                  y: 1.616, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(nptanschluss.position)
              .to(
                {
                  y: 1.616, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(nptzylinder.position)
              .to(
                {
                  y: 1.616, 
                },
                500
              )
              .easing(TWEEN.Easing.Cubic.Out)
              .start();

            new TWEEN.Tween(npt.position)
              .to(
                {
                  y: 1.616, 
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

        // Mit der Auswahl des Bestandteils, öffnet sich auch ein Info fenster

        if (intersects[0].object.name === "Flansch") {
          const stats = Stats();
          document.body.appendChild(stats.dom);
          console.log("FLANSCH AUSGEWÄHLT");
          const showflanschinfo = () => {
            flanschtext.visible = true;
            new TWEEN.Tween(flanschtext.material)
              .to(
                {
                  opacity: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Linear.None)
              .start();
          };
          var animate = function () {
            requestAnimationFrame(animate);

            TWEEN.update();
            stats.update();
          };
          animate();
          showflanschinfo();
        }
        if (intersects[0].object.name === "Flansch-Kugel") {
          const stats = Stats();
          document.body.appendChild(stats.dom);
          console.log("KUGEL AUSGEWÄHLT");
          const showkugelinfo = () => {
            kugelText.visible = true;
            new TWEEN.Tween(kugelText.material)
              .to(
                {
                  opacity: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Linear.None)
              .start();
          };
          var animate = function () {
            requestAnimationFrame(animate);

            TWEEN.update();
            stats.update();
          };
          animate();
          showkugelinfo();
        }
        if (intersects[0].object.name === "Flansch-Zylinder") {
          const stats = Stats();
          document.body.appendChild(stats.dom);
          console.log("FLANSCH ZYLINDER AUSGEWÄHLT");
          const showflanschzylinderinfo = () => {
            flanschtext.visible = true;
            new TWEEN.Tween(flanschtext.material)
              .to(
                {
                  opacity: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Linear.None)
              .start();
          };
          var animate = function () {
            requestAnimationFrame(animate);

            TWEEN.update();
            stats.update();
          };
          animate();
          showflanschzylinderinfo();
        }
        if (intersects[0].object.name === "NPT") {
          const stats = Stats();
          document.body.appendChild(stats.dom);
          console.log("NPT AUSGEWÄHLT");
          const shownptinfo = () => {
            npttext.visible = true;
            new TWEEN.Tween(npttext.material)
              .to(
                {
                  opacity: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Linear.None)
              .start();
          };
          var animate = function () {
            requestAnimationFrame(animate);

            TWEEN.update();
            stats.update();
          };
          animate();
          shownptinfo();
        }

        if (intersects[0].object.name === "Standard") {
          const stats = Stats();
          document.body.appendChild(stats.dom);
          console.log("VARIVENT AUSGEWÄHLT");
          const showvariventinfo = () => {
            variventtext.visible = true;
            new TWEEN.Tween(variventtext.material)
              .to(
                {
                  opacity: 1,
                },
                500
              )
              .easing(TWEEN.Easing.Linear.None)
              .start();
          };
          var animate = function () {
            requestAnimationFrame(animate);

            TWEEN.update();
            stats.update();
          };
          animate();
          showvariventinfo();
        }

        // Button für Informationen Visco
      }

      
    }
  }

  // TELEPORT
  /*   if ( INTERSECTION ) marker.position.copy( INTERSECTION );

				marker.visible = INTERSECTION !== undefined;
        */

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    // TELEPORT
    // this.INTERSECTION = undefined;

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
