//Contient toutes les informations sur le joueur et ses mouvements

import { TransformNode, ShadowGenerator, Scene, Mesh, UniversalCamera, ArcRotateCamera, Vector3, Quaternion, Ray } from "@babylonjs/core";

export class Player extends TransformNode {
    camera;
    scene;
    #_input;

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

    constructor(assets, scene, shadowGenerator, input) {
        super("player", scene);
        this.scene = scene;
        this.#_setupPlayerCamera();

        this.mesh = assets.mesh;
        this.mesh.parent = this;
        this.mesh.position = new Vector3(0,0,0);

        shadowGenerator.addShadowCaster(assets.mesh); //the player mesh will cast shadows

        this.#_input = input; //inputs we will get from inputController.js
    }

    #_updateFromControls(){
        let norme = (this.#_input.horizontal**2 + this.#_input.vertical**2)**(0.5);
        if(norme != 0){
        this.#_h = (this.#_input.horizontal/norme) * this.PLAYER_SPEED;
        this.#_v = (this.#_input.vertical/norme) * this.PLAYER_SPEED;
        this.#_moveDirection = new Vector3 (this.#_h,0,this.#_v);
        this.mesh.position.addInPlace(this.#_moveDirection);
        //this.mesh.position.x += this.#_h;
        //this.mesh.position.z += this.#_v;
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
        }
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

    activatePlayerCamera(){
        this.scene.registerBeforeRender(() => {
    
            this.#_beforeRenderUpdate();
        })
        return this.camera;
    }

    
    #_beforeRenderUpdate() {
        this.#_updateFromControls();
        //this.#_updateGroundDetection(); Voir question de la gravité plus tard
    }

    #_setupPlayerCamera() {
        let camera4 = new ArcRotateCamera("arc", -Math.PI/2, Math.PI/3, 40, new Vector3(0,3,0), this.scene);
        this.camera = camera4;
        this.scene.activeCamera = this.camera;
        return this.camera;
    }
}