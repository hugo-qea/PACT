import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, SceneLoader, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, FreeCamera, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, Quaternion, Matrix } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import { Environment } from "./environment";
import { Player } from "./characterController";
import { PlayerInput } from "./inputController";

const START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3;

class App {
    // General Entire Application
    #scene = null;
    #canvas = null;
    #engine = null;

    //Game State Related
    assets = null;
    #input = null;
    #environment = null;
    #player = null; // Si on met #player problème, on doit le laisser en public

    //Scene - related
    #state = null;
    #gameScene = null;
    #cutScene = null;

    constructor() {
        this.#canvas = App.createCanvas();

        // initialize babylon scene and engine
        this.#engine = new Engine(this.#canvas, true);
        this.#scene = new Scene(this.#engine);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this.#scene.debugLayer.isVisible()) {
                    this.#scene.debugLayer.hide();
                } else {
                    this.#scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        this.main();
    }

    static createCanvas(){

        //Commented out for development
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        //create the canvas html element and attach it to the webpage
        let canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);
        return canvas;
    }

    async main(){
        await this.goToStart();

        // Register a render loop to repeatedly render the scene
        this.#engine.runRenderLoop(() => {
            switch (this.#state) {
                case 0:
                    this.#scene.render();
                    break;
                case 3:
                    this.#scene.render();
                    break;
                case 1:
                    this.#scene.render();
                    break;
                case 2:
                    this.#scene.render();
                    break;
                default: break;
            }
        });

        //resize if the screen is resized/rotated
        window.addEventListener('resize', () => {
            this.#engine.resize();
        });
    }
    
    async goToStart(){
        this.#engine.displayLoadingUI();

        this.#scene.detachControl();
        let scene = new Scene(this.#engine);
        scene.clearColor = new Color4(0,0,0,1);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        //create a fullscreen ui for all of our GUI elements
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

        //create a simple button
        const startBtn = Button.CreateSimpleButton("start", "PLAY");
        startBtn.width = 0.2
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "-14px";
        startBtn.thickness = 0;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        guiMenu.addControl(startBtn);

        //this handles interactions with the start button attached to the scene
        startBtn.onPointerDownObservable.add(() => {
            this.goToCutScene();
            scene.detachControl(); //observables disabled
        });

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.#engine.hideLoadingUI();
        //lastly set the current state to the start state and set the scene to the start scene
        this.#scene.dispose();
        this.#scene = scene;
        this.#state = 0;
    }

    async goToCutScene(){
        this.#engine.displayLoadingUI();
        //--SETUP SCENE--
        //dont detect any inputs from this ui while the game is loading
        this.#scene.detachControl();
        this.#cutScene = new Scene(this.#engine);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), this.#cutScene);
        camera.setTarget(Vector3.Zero());
        this.#cutScene.clearColor = new Color4(0, 0, 0, 1);

         //--GUI--
         const cutScene = AdvancedDynamicTexture.CreateFullscreenUI("cutscene");

        //--PROGRESS DIALOGUE--
        const next = Button.CreateSimpleButton("next", "NEXT");
        next.color = "white";
        next.thickness = 0;
        next.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        next.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        next.width = "64px";
        next.height = "64px";
        next.top = "-3%";
        next.left = "-12%";
        cutScene.addControl(next);

        next.onPointerUpObservable.add(() => {
            this.goToGame();
        })

        //--WHEN SCENE IS FINISHED LOADING--
        await this.#cutScene.whenReadyAsync();
        this.#engine.hideLoadingUI();
        this.#scene.dispose();
        this.#state = 3;
        this.#scene = this.#cutScene;

        //--START LOADING AND SETTING UP THE GAME DURING THIS SCENE--
        let finishedLoading = false;
        await this.setUpGame().then(res =>{
            finishedLoading = true;
        });
    }

    async setUpGame() {
        // CREATE SCENE
        let scene = new Scene(this.#engine);
	
	SceneLoader.Append("./", "scenes essais/essai_scene.glb", scene);

        this.#gameScene = scene;
    
        // CREATE ENVIRONMENT
        this.#environment = new Environment(scene);
        await this.#environment.load(); //environment
        await this.loadCharacterAssets(scene);
    }

    async loadCharacterAssets(scene){

        async function loadCharacter(){
           //collision mesh
           const outer = MeshBuilder.CreateBox("outer", { width: 2, depth: 1, height: 3 }, scene);
           outer.isVisible = false;
           outer.isPickable = false;
           outer.checkCollisions = true;

           //move origin of box collider to the bottom of the mesh (to match player mesh)
           outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))

           //for collisions
           outer.ellipsoid = new Vector3(1, 1.5, 1);
           outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

           outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player

           let box = MeshBuilder.CreateBox("Small1", {
		   width: 0.5,
		   depth: 0.5,
		   height: 0.25,
		   faceColors: new Array(6).fill(Color3.Black().toColor4())
	   }, scene);
           box.position.y = 1.5;
           box.position.z = 1;

           let body = Mesh.CreateCylinder("body", 3, 2,2,0,0,scene);
           let bodymtl = new StandardMaterial("red",scene);
           bodymtl.diffuseColor = new Color3(.8,.5,.5);
           body.material = bodymtl;
           body.isPickable = false;
           body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin

           //parent the meshes
           box.parent = body;
           body.parent = outer;

           return {
               mesh: outer
           }
       }
       return loadCharacter().then(assets=> {
           this.assets = assets;
       })

   }

   async initializeGameAsync(scene){
    //temporary light to light the entire scene
    let light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);

    const light = new PointLight("sparklight", new Vector3(0, 0, 0), scene);
    light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
    light.intensity = 35;
    light.radius = 1;

    const shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.darkness = 0.4;

    //Create the player
    this.player = new Player(this.assets, scene, shadowGenerator, this.#input);
    const camera = this.player.activatePlayerCamera();
}

    async goToGame(){
        //--SETUP SCENE--
        this.#scene.detachControl();
        let scene = this.#gameScene;
        scene.clearColor = new Color4(0.01568627450980392, 0.01568627450980392, 0.20392156862745098); // a color that fit the overall color scheme better

        //--GUI--
        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        //dont detect any inputs from this ui while the game is loading
        // scene.detachControl();

        //create a simple button
        const loseBtn = Button.CreateSimpleButton("lose", "LOSE");
        loseBtn.width = 0.2
        loseBtn.height = "40px";
        loseBtn.color = "white";
        loseBtn.top = "-14px";
        loseBtn.thickness = 0;
        loseBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        playerUI.addControl(loseBtn);

        //this handles interactions with the start button attached to the scene
        loseBtn.onPointerDownObservable.add(() => {
            this.goToLose();
            scene.detachControl(); //observables disabled
        });

        //INPUT
        this.#input = new PlayerInput(scene); //détecte clavier et mobiles inputs

        //primitive character and setting
        await this.initializeGameAsync(scene);

        //--WHEN SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        scene.getMeshByName("outer").position = new Vector3(0,3,0);
        //get rid of start scene, switch to gameScene and change states
        this.#scene.dispose();
        this.#state = 1;
        this.#scene = scene;
        this.#engine.hideLoadingUI();
        //the game is ready, attach control back
        // this.#scene.attachControl();
    }

    async goToLose(){
        this.#engine.displayLoadingUI();

        //--SCENE SETUP--
        this.#scene.detachControl();
        let scene = new Scene(this.#engine);
        scene.clearColor = new Color4(0, 0, 0, 1);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        //--GUI--
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const mainBtn = Button.CreateSimpleButton("mainmenu", "MAIN MENU");
        mainBtn.width = 0.2;
        mainBtn.height = "40px";
        mainBtn.color = "white";
        guiMenu.addControl(mainBtn);
        //this handles interactions with the start button attached to the scene
        mainBtn.onPointerUpObservable.add(() => {
            this.goToStart();
        });

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.#engine.hideLoadingUI(); //when the scene is ready, hide loading
        //lastly set the current state to the lose state and set the scene to the lose scene
        this.#scene.dispose();
        this.#scene = scene;
        this.#state = 2;
    }
}
new App();
