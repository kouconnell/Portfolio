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
    // this.lightingFolder = this.pane.addFolder({ title: 'Lighting' });
    // this.paperLantern = this.lightingFolder.addFolder({ title: 'Paper Lantern' });
    
    // this.ambientLightFolder = this.lightingFolder.addFolder({ title: 'Ambient Light' });
    const ambientLight = new THREE.AmbientLight(0x111122, 9);
    // this.ambientLightFolder.addBinding(ambientLight, 'intensity', {
    //   min: 0, 
    //   max: 100, 
    //   step: 1,
    // });
    this.scene.add(ambientLight);

    // this.hemisphereLightFolder = this.lightingFolder.addFolder({ title: 'Hemisphere Light' });
    const hemisphereLight = new THREE.HemisphereLight(0x223344, 0x1a3a2a, 6);
    // this.hemisphereLightFolder.addBinding(hemisphereLight, 'intensity', {
    //   min: 0, 
    //   max: 100, 
    //   step: 1,
    // });
    this.scene.add(hemisphereLight);

    // this.ramenLightFolder = this.lightingFolder.addFolder({ title: 'RamenICON Light' });
    const ramenLight = new THREE.PointLight(0xff00ff, 6, 8);
    ramenLight.position.set(9, 17, 27);
    ramenLight.castShadow = true;
    ramenLight.shadow.mapSize.width = 1024;
    ramenLight.shadow.mapSize.height = 1024;
    this.scene.add(ramenLight);

    // const sphereSize = 5; 
    // const pointLightHelper = new THREE.PointLightHelper( ramenLight, sphereSize );
    // this.scene.add(pointLightHelper);

    // this.ramenLightFolder.addBinding(ramenLight, 'intensity', {
    //   min: 0, 
    //   max: 100, 
    //   step: 1,
    // });

    // this.yakitoriLightFolder = this.lightingFolder.addFolder({ title: 'Yakitori Light' });
    const yakitoriLight = new THREE.PointLight(0xE7D400, 3, 8);
    yakitoriLight.position.set(-3, 6.5, 25);
    this.scene.add(yakitoriLight);

    // const yakitoriLightHelper = new THREE.PointLightHelper( yakitoriLight, 2 );
    // this.scene.add(yakitoriLightHelper);

    // this.yakitoriLightFolder.addBinding(yakitoriLight, 'intensity', {
    //   min: 0, 
    //   max: 100, 
    //   step: 1,
    // });

    const paperLanternLight1 = new THREE.PointLight(0xE36012, 3, 8);
    paperLanternLight1.position.set(-2.6, 10.3, 19.1);
    this.scene.add(paperLanternLight1);

    // const paperLanternLightHelper = new THREE.PointLightHelper( paperLanternLight1, 3 );
    // this.scene.add(paperLanternLightHelper);

    // this.paperLantern.addBinding(paperLanternLight1, 'intensity', {
    //   min: 0, 
    //   max: 100, 
    //   step: 0.1,
    // });

    const paperLanternLight2 = new THREE.PointLight(0xE36012, 3, 8);
    paperLanternLight2.position.set(2, 12, 25);
    this.scene.add(paperLanternLight2);

    // const paperLanternLightHelper2 = new THREE.PointLightHelper( paperLanternLight2, 3 );
    // this.scene.add(paperLanternLightHelper2);

    // this.paperLantern.addBinding(paperLanternLight2, 'intensity', {
    //   min: 0, 
    //   max: 100, 
    //   step: 1,
    // });

    const paperLanternLight3 = new THREE.PointLight(0xE36012, 3, 8);
    paperLanternLight3.position.set(7.6, 12, 25);
    this.scene.add(paperLanternLight3);

    // const paperLanternLightHelper3 = new THREE.PointLightHelper( paperLanternLight3, 3 );
    // this.scene.add(paperLanternLightHelper3);

    // this.paperLantern.addBinding(paperLanternLight3, 'intensity', {
    //   min: 0, 
    //   max: 100, 
    //   step: 0.1,
    // });

    const paperLanternLight4 = new THREE.PointLight(0xE36012, 3, 8);
    paperLanternLight4.position.set(13, 12.2, 25);
    this.scene.add(paperLanternLight4);

    // const paperLanternLightHelper4 = new THREE.PointLightHelper( paperLanternLight4, 3 );
    // this.scene.add(paperLanternLightHelper4);

    // this.paperLantern.addBinding(paperLanternLight4, 'intensity', {
    //   min: 0, 
    //   max: 100, 
    //   step: 0.1,
    // });

    // this.openSignLightFolder = this.lightingFolder.addFolder({ title: 'Open Sign Light' });

    const openSignLight = new THREE.RectAreaLight(0xDC0DE4, 4, 4, 2);
    const x = 0.8, y = 13.2, z = 26.3;
    openSignLight.position.set(x, y, z);
    openSignLight.lookAt(x, y - 1, z + 5);

    // this.pane.addBinding(openSignLight, 'position', {
    //   min: -100,
    //   max: 100,
    //   step: 0.1
    // }).on('change', () => openSignLight.position.needsUpdate = true);

    // const lookAtTarget = { x: 0, y: 0, z: 100 };
    // this.pane.addBinding(lookAtTarget, 'x', {
    //   min: -100, 
    //   max: 100,
    //   step: 0.1
    // }).on('change', () => openSignLight.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z));
    // this.pane.addBinding(lookAtTarget, 'y', {
    //   min: -100, 
    //   max: 100,
    //   step: 0.1
    // }).on('change', () => openSignLight.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z));
    // this.pane.addBinding(lookAtTarget, 'z', {
    //   min: -100, 
    //   max: 100,
    //   step: 0.1
    // }).on('change', () => openSignLight.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z));

    // this.openSignLightFolder.addBinding(openSignLight, 'intensity', {
    //   min: 0, 
    //   max: 100, 
    //   step: 0.1,
    // })

    this.scene.add(openSignLight);
    // const openSignLightHelper = new RectAreaLightHelper( openSignLight );
    // openSignLight.add(openSignLightHelper);

    // TV
    // this.tvLightIntensity = this.lightingFolder.addFolder({ title: 'TV' });

    const tvLight = new THREE.RectAreaLight(0xFFFFFF, 4, 8, 5);
    tvLight.position.set(-11.5, 25.1, 25.3);
    tvLight.lookAt(-11.5, 25.1 - 1, 25.3 + 5);
    this.scene.add(tvLight);
    // this.pane.addBinding(tvLight, 'position', {
    //   min: -100, 
    //   max: 100, 
    //   step: 0.1,
    // }).on('change', () => tvLight.position.needsUpdate = true);
    // this.tvLightIntensity.addBinding(tvLight, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })
    // const tvSignLightHelper = new RectAreaLightHelper( tvLight );
    // tvLight.add( tvSignLightHelper ); 

    const tvLight2 = new THREE.RectAreaLight(0xFFFFFF, 4, 8, 5);
    tvLight2.position.set(11.0, 25.1, 25.3);
    tvLight2.lookAt(11.0, 25.1 - 1, 25.3 + 5);
    this.scene.add(tvLight2);
    // this.tvLightIntensity.addBinding(tvLight2, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })
    // const tvSignLightHelper2 = new RectAreaLightHelper( tvLight2 );
    // tvLight2.add( tvSignLightHelper2 ); 

    const tvLight3 = new THREE.RectAreaLight(0xFFFFFF, 4, 3.5, 5);
    tvLight3.position.set(-3.0, 25.1, 25.3);
    tvLight3.lookAt(-3.0, 25.1 - 1, 25.3 + 5);
    this.scene.add(tvLight3);
    // this.tvLightIntensity.addBinding(tvLight3, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })
    // const tvSignLightHelper3 = new RectAreaLightHelper( tvLight3 );
    // tvLight3.add( tvSignLightHelper3 ); 

    const tvLight4 = new THREE.RectAreaLight(0xFFFFFF, 4, 3.5, 5);
    tvLight4.position.set(2.3, 25.1, 25.3);
    tvLight4.lookAt(2.3, 25.1 - 1, 25.3 + 5);
    this.scene.add(tvLight4);
    // this.tvLightIntensity.addBinding(tvLight4, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })
    // const tvSignLightHelper4 = new RectAreaLightHelper( tvLight4 );
    // tvLight4.add( tvSignLightHelper4 ); 

    // Akane

    const akaneLight = new THREE.RectAreaLight(0xFFFFFF, 4, 4.5, 30);
    akaneLight.position.set(24.7, 35.9, 18.2);
    akaneLight.lookAt(24.7, 35.9 - 1, 18.2 + 50);
    this.scene.add(akaneLight);

    // this.akaneAkitsu = this.lightingFolder.addFolder({ title: 'AkaneAkitsu' });
    // this.akaneAkitsu.addBinding(akaneLight, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })
    // const akaneLightHelper = new RectAreaLightHelper( akaneLight );
    // akaneLight.add( akaneLightHelper ); 

    const akaneLight2 = new THREE.RectAreaLight(0xFFFFFF, 4, 4.5, 30);
    akaneLight2.position.set(24.7, 35.9, 16);
    akaneLight2.lookAt(24.7, 35.9 - 1, 16 - 50);
    this.scene.add(akaneLight2);

    // this.akaneAkitsu.addBinding(akaneLight2, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })
    // const akaneLightHelper2 = new RectAreaLightHelper( akaneLight2 );
    // akaneLight2.add( akaneLightHelper2 ); 

    // KOU Sign 
    // this.KouSign = this.lightingFolder.addFolder({ title: 'KOU' });

    const KfrontLight = new THREE.PointLight(0xE10FE3, 5, 8);
    KfrontLight.position.set(-22.2, 41.5, 29.2);
    this.scene.add(KfrontLight);

    // this.KouSign.addBinding(KfrontLight, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })

    // const KfrontLightHelper = new THREE.PointLightHelper( KfrontLight, 3 );
    // this.scene.add(KfrontLightHelper);

    const OfrontLight = new THREE.PointLight(0xE10FE3, 5, 8);
    OfrontLight.position.set(-22.2, 37.7, 29.2);
    this.scene.add(OfrontLight);

    // this.KouSign.addBinding(OfrontLight, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })

    // const OfrontLightHelper = new THREE.PointLightHelper( OfrontLight, 3 );
    // this.scene.add(OfrontLightHelper);

    const UfrontLight = new THREE.PointLight(0xE10FE3, 5, 8);
    UfrontLight.position.set(-22.2, 33.9, 29.2);
    this.scene.add(UfrontLight);

    // this.KouSign.addBinding(UfrontLight, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })

    // const UfrontLightHelper = new THREE.PointLightHelper( UfrontLight, 3 );
    // this.scene.add(UfrontLightHelper);

    // KOU Sign 

    const KBackLight = new THREE.PointLight(0xE10FE3, 5, 8);
    KBackLight.position.set(-24.4, 41.5, 26.9);
    this.scene.add(KBackLight);

    // this.KouSign.addBinding(KBackLight, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })

    // const KBackLightHelper = new THREE.PointLightHelper( KBackLight, 3 );
    // this.scene.add(KBackLightHelper);

    const OBackLight = new THREE.PointLight(0xE10FE3, 5, 8);
    OBackLight.position.set(-24.4, 37.7, 26.9);
    this.scene.add(OBackLight);

    // this.KouSign.addBinding(OBackLight, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })

    // const OBackLightHelper = new THREE.PointLightHelper( OBackLight, 3 );
    // this.scene.add(OBackLightHelper);

    const UBackLight = new THREE.PointLight(0xE10FE3, 5, 8);
    UBackLight.position.set(-24.4, 33.9, 26.9);
    this.scene.add(UBackLight);

    // this.KouSign.addBinding(UBackLight, 'intensity', {
    //   min: 0,
    //   max: 100, 
    //   step: 0.1, 
    // })

    // const UBackLightHelper = new THREE.PointLightHelper( UBackLight, 3 );
    // this.scene.add(UBackLightHelper);

    const asahiLight = new THREE.RectAreaLight(0xE70027, 4, 4, 2);
    asahiLight.position.set(11.5, 12.1, 20);
    asahiLight.lookAt(11.5, 12.1 - 1, 20 + 5);
    this.scene.add(asahiLight);
    // this.pane.addBinding(asahiLight, 'position', {
    //   min: -100, 
    //   max: 100, 
    //   step: 0.1,
    // }).on('change', () => asahiLight.position.needsUpdate = true);
  
    // const asahiLightHelper = new RectAreaLightHelper( asahiLight );
    // asahiLight.add( asahiLightHelper ); 

    const ramenRectLight = new THREE.RectAreaLight(0x6C00FF, 4, 3.5, 5);
    ramenRectLight.position.set(14.3, 8.3, 21.4);
    ramenRectLight.lookAt(14.3 + 7.5, 8.3 - 1, 21.4);
    this.scene.add(ramenRectLight);
  
    // const ramenRectLightHelper = new RectAreaLightHelper( ramenRectLight );
    // ramenRectLight.add( ramenRectLightHelper ); 

    const ramenRectLight2 = new THREE.RectAreaLight(0x6C00FF, 4, 3.5, 5);
    ramenRectLight2.position.set(13.4, 8.3, 21.4);
    ramenRectLight2.lookAt(13.4 - 7.5, 8.3 - 1, 21.4);
    this.scene.add(ramenRectLight2);
  
    // const ramenRectLightHelper2 = new RectAreaLightHelper( ramenRectLight2 );
    // ramenRectLight2.add( ramenRectLightHelper2 ); 

    const ramenArrowLight = new THREE.RectAreaLight(0xff00ff, 4, 3.5, 7);
    ramenArrowLight.position.set(15.5, 15, 14.4);
    ramenArrowLight.lookAt(15.5 + 7.5, 15 - 1, 14.4);
    this.scene.add(ramenArrowLight);
  
    // const ramenArrowLightHelper2 = new RectAreaLightHelper( ramenArrowLight );
    // ramenArrowLight.add( ramenArrowLightHelper2 ); 
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