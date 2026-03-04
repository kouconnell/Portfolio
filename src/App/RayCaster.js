import * as THREE from 'three';
import gsap from 'gsap';

import App from './App.js';
import { appStateStore } from './Utils/Store.js';

export default class RayCaster {
	constructor() {
		this.app = new App()
		this.canvas = this.app.canvas;
        this.camera = this.app.camera;
        this.scene = this.app.scene;
    	this.pane = this.app.gui.pane;
        
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		// Only test against these
		this.objectsToTest = [];

		this.startListening();
	}

	startListening() {
		window.addEventListener('pointerdown', (event) => this.onPointerDown(event));
	}

	// For testing
	getRandomColor() {
		return new THREE.Color(
			Math.random(),
			Math.random(),
			Math.random(),
		);
	}

	zoomToObject(object) {
		const targetPosition = new THREE.Vector3();
		object.getWorldPosition(targetPosition);

		// Disable controls during transition
		this.camera.controls.enabled = false;

		// Animate camera position to in front of the object
		gsap.to(this.camera.instance.position, {
		    x: targetPosition.x,
		    y: targetPosition.y,
		    z: targetPosition.z + 15, // offset so camera doesn't sit inside the object
		    duration: 1.5,
		    ease: 'power1.inOut',
		    onUpdate: () => {
		        // Keep controls target updated during animation
		        this.camera.controls.target.copy(targetPosition);
		        this.camera.controls.update();
		    },
		    onComplete: () => {
		        // Lock camera in place after transition
		        this.camera.controls.enabled = true;
		        this.camera.controls.enableRotate = false;
		        this.camera.controls.enableZoom = false;
		        this.camera.controls.enablePan = false;
		    }
		});
	}

	onPointerDown(event) {
		this.mouse.x = 
			(event.clientX / this.canvas.clientWidth) * 2 - 1;

		this.mouse.y = 
			-(event.clientY / this.canvas.clientHeight) * 2 + 1;
		this.raycaster.setFromCamera(this.mouse, this.camera.instance);

		const intersections = this.raycaster.intersectObjects(
			this.scene.children, 
			true
		);

		if (intersections.length) {
			const mesh = intersections[0].object;
			if (mesh.isMesh && mesh.name.toLowerCase().includes('screen')) {
				mesh.material = mesh.material.clone();
				mesh.material.color.copy(this.getRandomColor());
				this.zoomToObject(mesh);
			}
		}
	}
}