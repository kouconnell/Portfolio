import * as THREE from 'three'
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { sizesStore } from './Utils/Store.js';


import App from './App.js'

export default class Camera{
    constructor() {
        this.app = new App()
        this.canvas = this.app.canvas

        this.sizesStore = sizesStore

        this.sizes = this.sizesStore.getState()

        this.pane = this.app.gui.pane;

        this.setInstance()
        this.setControls()
        this.setResizeLister()

        // this.cameraFolder = this.pane.addFolder({ title: 'camera' });
        // this.position = this.cameraFolder.addFolder({ title: 'cameraPosition' });
        // this.position.addBinding(this.instance.position, 'x', {
        //     min: -40,
        //     max: 20,
        //     step: 0.1,
        // });
        // this.position.addBinding(this.instance.position, 'y', {
        //     min: -20,
        //     max: 20,
        //     step: 0.1,
        // });
        // this.position.addBinding(this.instance.position, 'z', {
        //     min: -20,
        //     max: 100,
        //     step: 0.1,
        // });
        // this.target = this.cameraFolder.addFolder({ title: 'cameraTarget' });
        // this.target.addBinding(this.controls.target, 'x', {
        //     min: -20,
        //     max: 20,
        //     step: 0.1,
        // });
        this.controls.target.y = 20;
        // this.target.addBinding(this.controls.target, 'y', {
        //     min: -20,
        //     max: 20,
        //     step: 0.1,
        // });
        // this.target.addBinding(this.controls.target, 'z', {
        //     min: -20,
        //     max: 20,
        //     step: 0.1,
        // });
        // this.cameraFolder.addBinding(this.controls, 'enablePan');
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            1,
            600
        );
        this.instance.position.x = -31.5;
        this.instance.position.y = 5;
        this.instance.position.z = 100
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;

        this.controls.maxDistance = 150;
        this.controls.minDistance = 50;
        this.controls.minPolarAngle = Math.PI * 0.25;
        this.controls.maxPolarAngle = Math.PI * 0.525;
        this.controls.enablePan = false;
    }

    setResizeLister() {
        this.sizesStore.subscribe((sizes)=>{
            this.instance.aspect = sizes.width / sizes.height
            this.instance.updateProjectionMatrix()
        })
    }

    loop() {
        this.controls.update()
        this.characterController = this.app.world.characterController?.rigidBody
        if(this.characterController) {


            const characterPosition = this.characterController.translation()
            const characterRotation = this.characterController.rotation()

            const cameraOffset = new THREE.Vector3(0, 28, 35)
            cameraOffset.applyQuaternion(characterRotation)
            cameraOffset.add(characterPosition)

            const targetOffset = new THREE.Vector3(0, 8, 0)
            targetOffset.applyQuaternion(characterRotation)
            targetOffset.add(characterPosition)

            this.instance.position.lerp(cameraOffset, 0.1)
            this.controls.target.lerp(targetOffset, 0.1)
        }
    }
}