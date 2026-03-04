import * as THREE from "three";

import App from '../App.js';

import { appStateStore } from '../Utils/Store.js';

export default class Physics{ 
	constructor() {
		this.app = new App();
		const { scene } = this.app;
		this.scene = scene;

		this.appStateStore = appStateStore;

		this.meshMap = new Map();

		import('@dimforge/rapier3d').then(RAPIER => {
			const gravity = { x: 0.0, y: -9.81, z: 0.0 };
			this.world = new RAPIER.World(gravity);
			this.rapier = RAPIER;

			this.rapierLoaded = true;
			appStateStore.setState({physicsReady: true});
		})
	}

	add(mesh, type, collider) {
		// Rapier

		// defining the rigid body type
		let rigidBodyType;
		switch (type) {
			case 'dynamic':
				rigidBodyType = this.rapier.RigidBodyDesc.dynamic();
				break;
			case 'fixed':
				rigidBodyType = this.rapier.RigidBodyDesc.fixed();
				break;
			case 'k-p':
				rigidBodyType = this.rapier.RigidBodyDesc.kinematicPositionBased();
				break;
			case 'k-v':
				rigidBodyType = this.rapier.RigidBodyDesc.kinematicVelocityBased();
				break;
		}
		// equivalent to this.scene.add()
		this.rigidBody = this.world.createRigidBody(rigidBodyType);

		let colliderType;
		switch(collider) {
			case 'cuboid':
				// autoCompute collider dimensions
				const dimensions = this.computeCuboidDimensions(mesh);

				// create collider
				colliderType = this.rapier.ColliderDesc.cuboid(
					dimensions.x / 2,
					dimensions.y / 2,
					dimensions.z / 2
				);
				break;
			case 'ball':
				const radius = this.computeBallDimensions(mesh);
				colliderType = this.rapier.ColliderDesc.ball(radius);
				break;
			case 'trimesh':
				const { scaledVertices, indices } = this.computeTrimeshDimensions(mesh);
				colliderType = this.rapier.ColliderDesc.trimesh(
					scaledVertices,
					indices,
				);
				break;
		}
		this.world.createCollider(colliderType, this.rigidBody);

		// setting the rigid body position and rotation depending on the actual mesh
		const worldPosition = mesh.getWorldPosition(new THREE.Vector3());
		const worldRotation = mesh.getWorldQuaternion(new THREE.Quaternion());
		this.rigidBody.setTranslation(worldPosition);
		this.rigidBody.setRotation(worldRotation);

		this.meshMap.set(mesh, this.rigidBody);
		return this.rigidBody;
	}

	computeCuboidDimensions(mesh) {
		mesh.geometry.computeBoundingBox();
		const size = mesh.geometry.boundingBox.getSize(new THREE.Vector3());
		const worldScale = mesh.getWorldScale(new THREE.Vector3());
		// console.log(size, worldScale);
		size.multiply(worldScale);
		return size;
	}

	computeBallDimensions(mesh) {
		mesh.geometry.computeBoundingSphere();
		const radius = mesh.geometry.boundingSphere.radius;
		const worldScale = mesh.getWorldScale(new THREE.Vector3());
		const maxScale = Math.max(worldScale.x, worldScale.y, worldScale.z);
		return radius * maxScale;
	}

	computeTrimeshDimensions(mesh) {
		const vertices = mesh.geometry.attributes.position.array;
		const indices = mesh.geometry.index.array;
		const worldScale = mesh.getWorldScale(new THREE.Vector3());

		// const scaledVertices = []
		// for (let i = 0; i < vertices.length; i+=3) {
		// 	scaledVertices.push(vertices[i] * worldScale.x);
		// 	scaledVertices.push(vertices[i + 1] * worldScale.y);
		// 	scaledVertices.push(vertices[i + 2] * worldScale.z);
		// }

		const scaledVertices = vertices.map((vertex, index) => {
			return vertex * worldScale.getComponent(index % 3);
		});

		return { scaledVertices, indices };
	}


	loop() {
		if (!this.rapierLoaded) return;
		this.world.step();

		this.meshMap.forEach((rigidBody, mesh) => {
			// rapier or our actual physics representation of this world is our actual source of truth.
			const position = new THREE.Vector3().copy(rigidBody.translation());
			const rotation = new THREE.Quaternion().copy(rigidBody.rotation());

			mesh.parent.worldToLocal(position);
			// Convoluted way of doing mesh.parent.worldToLocal(position)
			// position.applyMatrix4(
			// 	new THREE.Matrix4().copy(mesh.parent.matrixWorld).invert()
			// );
			const inverseParentMatrix = new THREE.Matrix4()
			.extractRotation(mesh.parent.matrixWorld)
			.invert();
			// matrixWorld is a culmination of all the transformations that are applied onto the child,
			// so if you invert that, that inverts all the transformations of all the parents combined
			// together

			const inverseParentRotation = 
			new THREE.Quaternion().setFromRotationMatrix(inverseParentMatrix)
			rotation.premultiply(inverseParentRotation);
			
			// this.cubeMesh.position.set(position.x, position.y, position.z);
			mesh.position.copy(position);
			mesh.quaternion.copy(rotation);
		})
	}
}