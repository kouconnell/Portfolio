import * as THREE from "three";

import App from "../App.js";
import assetStore from '../Utils/AssetStore.js';

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(77.8, 48.5, 81.2);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.top = 30;
    this.directionalLight.shadow.camera.right = 30;
    this.directionalLight.shadow.camera.left = -30;
    this.directionalLight.shadow.camera.bottom = -30;


    this.pane.addBinding(
      this.directionalLight,
      'position',
      {
        min: -100,
        max: 100,
        step: 0.1,
      }
    )

    this.pane.addBinding(
      this.directionalLight.shadow,
      'bias',
      {
        min: -0.1,
        max: 0.1,
        step: 0.001,
      }
    )

    this.pane.addBinding(
      this.directionalLight.shadow,
      'normalBias',
      {
        min: -0.1,
        max: 0.1,
        step: 0.001,
      }
    )

    const directionalLightShadowHelper = new THREE.CameraHelper(
      this.directionalLight.shadow.camera
    )
    this.scene.add(directionalLightShadowHelper);
    this.scene.add(this.directionalLight);
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