import * as THREE from "three";

import App from "../App.js";
import assetStore from '../Utils/AssetStore.js';

import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib';
RectAreaLightUniformsLib.init();

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    this.pane = this.app.gui.pane;

    this.assetStore = assetStore.getState();
    this.environment = this.assetStore.loadedAssets.environment;

    this.loadEnvironment();
    this.addLights();
    // this.addGround();
  }

  loadEnvironment() {
    // load environment here
    const environmentScene = this.environment.scene;
    this.scene.add(environmentScene);

	  environmentScene.position.set(0, 0.6, 32.8);

    // this.pane.addBinding(
    // 	environmentScene,
    // 	'position',
    // 	{
    // 		min: -100,
    // 		max: 100,
    // 		step: 0.1,
    // 	}
    // );

    // this.pane.addBinding(
    // 	environmentScene,
    // 	'rotation',
    // 	{
    // 		min: -Math.PI,
    // 		max: Math.PI,
    // 		step: 0.01,
    // 	}
    // );

    // this.pane.addBinding(
    // 	environmentScene,
    // 	'scale',
    // 	{
    // 		min: 0,
    // 		max: 3,
    // 		step: 0.01,
    // 	}
    // );

    // const scale = { value: 1 };

    // this.pane.addBinding(
    // 	scale,
    // 	'value',
    // 	{
    // 		min: 0,
    // 		max: 3,
    // 		step: 0.01,
    // 	}).on('change', () => {
    // 		environmentScene.scale.setScalar(scale.value);
    // 	})

    // environmentScene.rotation.set(0, 0, 0);
    // environmentScene.scale.setScalar(0);

    // --
    environmentScene.traverse((obj) => {
    	if (obj.isMesh) {
    		this.physics.add(obj, 'fixed', 'cuboid');
    	}
    })
    // const physicalObjects = [];
    

    const shadowCasters = [
      'Text',
      'PaperLantern',
      'VendingMachine',
      'LedSign',
      'Pipe',
      'Vent',
      'DiamondGridFence',
      'Cloth',
      'Wire',
      'FireEscape',
      'Dumpster',
      'Trash',
      'Can',
      'RamenBowl',
      'Chopstick',
      'TrashCan',
      'GlassCup',
      'Coaster',
      'Cigarette',
      'Pot',
      'Chair',
      'Building',
      'Door',
      'NapkinHolder',
      'RamenStall',
      'Table',
      'MiscellaneousMetal',
      'Box',
      'SauceTray',
      'VentFan',
      'Sign'
    ];

    const shadowReceivers = [
      'Building',
      'Floor'
    ];

    // loop through the top level of the environment scene (all of the named objects in blender)
    for (const child of environmentScene.children) {
      // check if the name of the object includes any of the strings in the physicalObject array
      // const isPhysicalObject = physicalObjects.some((keyword) => child.name.includes(keyword));
      // // if it does, traverse the object and add all meshes to the physical world.
      // if (isPhysicalObject) {
      //   child.traverse((obj) => {
      //     if (obj.isMesh) {
      //       this.physics.add(obj, 'fixed', 'cuboid');
      //     }
      //   })
      const isShadowCaster = shadowCasters.some((keyword) => child.name.includes(keyword));
      if (isShadowCaster) {
        child.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
          }
        })
      }

      const isShadowReceiver = shadowReceivers.some((keyword) => child.name.includes(keyword));
      if (isShadowReceiver) {
        child.traverse((obj) => {
          if (obj.isMesh) {
            obj.receiveShadow = true;
          }
        })
      }

    }


  }

  addLights() {

    const createPointLight = (color, intensity, distance, position, shadow = false) => {
      const light = new THREE.PointLight(color, intensity, distance);
      light.position.set(...position);

      if (shadow) {
        light.castShadow = true;
        light.shadow.mapSize.set(1024, 1024);
      }

      this.scene.add(light);
      return light;
    } 

    const createRectLight = (color, intensity, width, height, position, lookAt) => {
      const light = new THREE.RectAreaLight(color, intensity, width, height);
      light.position.set(...position);
      light.lookAt(...lookAt);

      this.scene.add(light);
      return light;
    }

    // Global lighting
    this.scene.add(new THREE.AmbientLight(0x111122, 9));
    this.scene.add(new THREE.HemisphereLight(0x223344, 0x1a3a2a, 6));
    
    // Ramen icon light
    createPointLight(0xff00ff, 6, 8, [9, 17, 27], true);

    // Yakitori light
    createPointLight(0xE7D400, 3, 8, [-3, 6.5, 25]);
    
    // Paper lanterns 
    const lanternPositions = [
      [-2.6, 10.3, 19.1],
      [2, 12, 25],
      [7.6, 12, 25],
      [13, 12.2, 25]
    ];

    lanternPositions.forEach(pos => {
      createPointLight(0xE36012, 3, 8, pos);
    });

    // OPEN sign
    createRectLight(0xDC0DE4, 4, 4, 2, [0.8, 13.2, 26.3], [0.8, 12.2, 31.3]);

    // TV lights
    const tvPositions = [
      [-11.5, 25.1, 25.3],
      [11.0, 25.1, 25.3],
      [-3.0, 25.1, 25.3],  
      [2.3, 25.1, 25.3]
    ]

    tvPositions.forEach(([x, y, z, w]) => {
      createRectLight(
        0xFFFFFF,
        4,
        w,
        5,
        [x, y, z],
        [x, y - 1, z + 5]
      );
    });
    
    // Akane
    createRectLight(0xFFFFFF, 4, 4.5, 30, [24.7, 35.9, 18.2], [24.7, 34.9, 68.2]);

    createRectLight(0xFFFFFF, 4, 4.5, 30, [24.7, 35.9, 16], [24.7, 34.9, -34]);

    // KOU sign 
    const kouPositions = [
      [-22.2, 41.5, 29.2],
      [-22.2, 37.7, 29.2],
      [-22.2, 33.9, 29.2],
      [-24.4, 41.5, 26.9],
      [-24.4, 37.7, 26.9],
      [-24.4, 33.9, 26.9]
    ];

    kouPositions.forEach(pos => {
      createPointLight(0xE10FE3, 5, 8, pos);
    });

    // Asahi light
    createRectLight(0xE70027, 4, 4, 2, [11.5, 12.1, 20], [11.5, 11.1, 25]);

    // Ramen sign 
    createRectLight(0x6C00FF, 4, 3.5, 5, [14.3, 8.3, 21.4], [21.8, 7.3, 21.4]);

    createRectLight(0x6C00FF, 4, 3.5, 5, [13.4, 8.3, 21.4], [5.9, 7.3, 21.4]);

    // Ramen arrow
    createRectLight(0xff00ff, 4, 3.5, 7, [15.5, 15, 14.4], [23, 14, 14.4]);
  }

  // addGround() {
  //   const groundGeometry = new THREE.BoxGeometry(100, 1, 100);
  //   const groundMaterial = new THREE.MeshStandardMaterial({
  //     color: "turquoise",
  //   });
  //   this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  //   this.scene.add(this.groundMesh);
  //   this.physics.add(this.groundMesh, "fixed", "cuboid");
  // }
}