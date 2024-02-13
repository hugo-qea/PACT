//Contient toutes les informations sur le joueur et ses mouvements

import { TransformNode, ArcRotateCamera, Vector3, SpotLight, Quaternion, Ray, Engine, ApplyPostProcess, Mesh, MeshBuilder, Color3, Matrix, StandardMaterial } from '@babylonjs/core'; //ShadowGenerator, Scene, Mesh, UniversalCamera, 
import {Action} from './action';
import { AdvancedDynamicTexture, Button, Control } from '@babylonjs/gui';

export class Player extends TransformNode {
	camera;
	scene;
	app;
	#_input;
	goToVideo = 0;
	collider;

	setGoToVideo(value){
		this.goToVideo = value;
	}

	videoName;

	getVideoName(){
		return this.videoName;
	}

	launchGuiFromVideo(){
		this.indAction++;
		this.actions[this.indAction].loadGui(this.app.getScene());
		this.actions[this.indAction].loadAction(this.indAction, this.app.getScene());
	}

	//Player
	mesh; //outer collisionbox of player

	//const values
	PLAYER_SPEED = 0.45;
	static JUMP_FORCE = 0.80;
	static GRAVITY = -2.8;
	ORIGINAL_TILT= new Vector3(0.5934119456780721, 0, 0);
	
	//player movement vars
	#_deltaTime = 0.02;
	#_h;
	#_v;

	#_moveDirection= new Vector3();
	#_inputAmt;
	
	//gravity, ground detection, jumping
	#_gravity = new Vector3(0,-0.01,0);
	#_lastGroundPos= Vector3.Zero(); // keep track of the last grounded position
	#_grounded;


	//Actions
	actions = [new Action('cuire 1', -17, -11, -35, -24, '6KB7ZG#59', null),
				new Action('chercher farine', -8, -4, 3, 8, '6KB7ZG#60', null),
				new Action('deposer farine', 14, 25, 13, 24.5, '6KB7ZG#61', null),
				new Action('chercher levure', 17, 25, 2, 10, '6KB7ZG#62', null),
				new Action('deposer levure', 14, 25, 13, 24.5, '6KB7ZG#63', null),
				new Action('peser', 17, 25, 2, 10, '6KB7ZG#64', '/1pesee.mp4'),
				new Action('lancer petrie', 14, 25, 13, 24.5, '6KB7ZG#65', '/2petrie.mp4'),
				new Action('defourner 1', -17, -11, -35, -24, '6KB7ZG#66', null),
				new Action('sortir la pâte du petrin', 14, 25, 13, 24.5, '6KB7ZG#67', '/3sortirpetrin.mp4'),
				new Action('amener la pâte sur une echelle', 5, 10, 12, 18, '6KB7ZG#68', null),
				new Action('mettre la pâte dans la chambre froide', -11, -7, -8, 1, '6KB7ZG#69', null),
				new Action('diviser', -3, 3, 12, 18, '6KB7ZG#70', '/4diviser.mp4'),
				new Action('façonner', -3, 3, 12, 18, '6KB7ZG#71', '/5faconner.mp4'),
				new Action('mettre pâtons dans panem', 20, 25, -12, -6, '6KB7ZG#72', null),
				new Action('cuire 2', -17, -11, -35, -24, '6KB7ZG#73', '/6enfourner.mp4'),
				new Action('nettoyage balais', 14, 20, 13, 24.5, '6KB7ZG#74', null),
				new Action('defourner 2', -17, -11, -35, -24, '/7defourner.mp4', null),
				new Action('nettoyage aspirateur', 14, 20, 13, 24.5, '6KB7ZG#76', null),
				new Action('nulle',60,65,60,65,'IJ83YL#2',null)];
	indAction = 0;

	constructor(assets, scene, shadowGenerator, input, app) {
		super('player', scene);
		this.scene = scene;
		this.app = app;
		this.#_setupPlayerCamera();

		this.mesh = assets.mesh;
		console.log(this.mesh);
		this.mesh.parent = this;
		this.mesh.position = new Vector3(0,0,0);

		shadowGenerator.addShadowCaster(assets.mesh); //the player mesh will cast shadows

		this.#_input = input; //inputs we will get from inputController.js

		this.actions[this.indAction].loadGui(this.app.getScene());
	}

	#_updateFromControls(){
		let norme = (this.#_input.horizontal**2 + this.#_input.vertical**2)**(0.5);
		if(norme != 0){
			this.#_h = (this.#_input.horizontal/norme) * this.PLAYER_SPEED;
			this.#_v = (this.#_input.vertical/norme) * this.PLAYER_SPEED;
			this.#_moveDirection = new Vector3 (this.#_h,0,this.#_v);
			this.mesh.moveWithCollisions(this.#_moveDirection);
			console.log(this.mesh.position);
			console.log(this.allowedMovements());
		}
		

		//Action
		if(this.#_input.actionKeyDown){
			console.log(this.indAction);
			//console.log(this.actions[this.indAction].xMin)
		}
		
		if(this.indAction == 18){
			this.loadVideo360();
			this.indAction++;
		}

		if(this.indAction < this.actions.length){
			if(this.#_input.actionKeyDown && (this.actions[this.indAction].xMin <= this.mesh.position.x)
			&& (this.mesh.position.x <= this.actions[this.indAction].xMax) && (this.actions[this.indAction].zMin <= this.mesh.position.z) &&
			(this.mesh.position.z <= this.actions[this.indAction].zMax)){
				this.actions[this.indAction].clearGUI();
				if(this.actions[this.indAction].video != null){
					//this.actions[this.indAction].loadGui(this.indAction+1,this.app.getScene());
					this.videoName = this.actions[this.indAction].video;
					this.app.goToVideo();
				}
				//this.indAction++;
				//this.actions[this.indAction].loadGui(this.indAction);
				else{
					this.indAction++;
					this.actions[this.indAction].loadGui(this.app.getScene());
					this.actions[this.indAction].loadAction(this.indAction, this.app.getScene());
				}
				/*
				if (this.indAction == 1){
					this.actions[this.indAction].cuireMethod();
				}
				if (this.indAction == 2){
					this.actions[this.indAction].ChercherLevure();
				}
				if (this.indAction == 3){
					this.actions[this.indAction].premierePetrie();
				}*/
				
			}
		}


		//------ROTATION------
		//check if there is movement to determine if rotation is needed
		let input = new Vector3(this.#_input.horizontalAxis, 0, this.#_input.verticalAxis); //along which axis is the direction
		if (input.length() == 0) {//if there's no input detected, prevent rotation and keep player in same rotation
			return;
		}

		//rotation based on input
		let angle = Math.atan2(this.#_input.horizontalAxis, this.#_input.verticalAxis);
		let targ = Quaternion.FromEulerAngles(0, angle, 0);
		this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh.rotationQuaternion, targ, 10 * this.#_deltaTime);
	}

	//lance un rayon et vérifie que l'on touche un objet ou non
	#_floorRaycast(offsetx, offsetz, raycastlen) {
		let raycastFloorPos = new Vector3(this.mesh.position.x + offsetx, this.mesh.position.y + 0.5, this.mesh.position.z + offsetz);
		let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);

		let predicate = function (mesh) {
			return mesh.isPickable && mesh.isEnabled();
		};

		let pick = this.scene.pickWithRay(ray, predicate);

		if (pick.hit) { 
			return pick.pickedPoint;
		} else { 
			return Vector3.Zero();
		}
	}

	//si le rayon a touché un objet, i.e le sol renvoie true
	#_isGrounded(){
		if (this.#_floorRaycast(0, 0, 0.6).equals(Vector3.Zero())) {
			return false;
		} else {
			return true;
		}
	}

	//gère tout ce qui a un rapport avec la gravité
	#_updateGroundDetection(){
		if(!this.#_isGrounded()){
			this.#_gravity = this.#_gravity.addInPlace(Vector3.Up().scale(this.#_deltaTime * Player.GRAVITY));
			this.#_grounded = false;
		}

		//limite la vitesse de gravité
		if(this.#_gravity.y < -Player.JUMP_FORCE){
			this.#_gravity.y = -Player.JUMP_FORCE;
		}

		this.mesh.moveWithCollisions(this.#_moveDirection); //erreur vient du addInPlace
		//console.log(this.#_gravity);

		if(this.#_isGrounded()){
			this.#_gravity.y = 0;
			this.#_grounded = true;
			this.#_lastGroundPos.copyFrom(this.mesh.position);
		}
	}

	async loadVideo360(){
		let UI = AdvancedDynamicTexture.CreateFullscreenUI('ActionUI',true, this.app.getScene());
		let loadedCutGui =  await UI.parseFromSnippetAsync('IJ83YL#1');
		let button = UI.getControlByName('video360');
		button.onPointerDownObservable.add(() => {
			UI.dispose();
			this.app.goToVideo360();
			
		});		

	}

	activatePlayerCamera(){
		this.scene.registerBeforeRender(() => {
			this.#_beforeRenderUpdate();
		});
		
		//return this.camera;
	}

	
	#_beforeRenderUpdate() {
		this.#_updateFromControls();
		//this.#_updateGroundDetection(); Voir question de la gravité plus tard
	}

	#_setupPlayerCamera() {
		let camera4 = new ArcRotateCamera('arc', -Math.PI/2, Math.PI/3, 40, new Vector3(0,3,0), this.scene);
		this.camera = camera4;
		this.scene.activeCamera = this.camera;
		return this.camera;
	}
	
	allowedMovements(){
		let x = this.mesh.position.x;
		let z = this.mesh.position.z;
		return ((((z >-35) && (z <= -23))  && ((x > -16) && (x<=27))) || (((z> -23) && (z<=-7)) && ((x> -12) && (x<=27))) || (((z> -7) && (z<=10)) && ((x> -12) && (x<=24))) ||
		(((z>10) && (z<= 18)) && ((x> -7) && (x<=25))) || (((z>18) && (z<=28)) && ((x>6) && (x<=33))) || (((z>28) && (z<=35)) && ((x>14) && (x<=24))));
	}
}
