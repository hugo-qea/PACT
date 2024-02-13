import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, FreeCamera, Color4, StandardMaterial, Color3, PointLight, ShadowGenerator, Quaternion, Matrix } from "@babylonjs/core";

import { Environment } from "./environment";
import { Player } from "./characterController";
import { PlayerInput } from "./inputController";
import { AdvancedDynamicTexture, StackPanel, Button, TextBlock, Rectangle, Control, Image } from "@babylonjs/gui";
//import { UI } from "./uiTest";

//enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }

class App {
    // General Entire Application
    #_scene;
    #_canvas;
    #_engine;

    //Game State Related
    assets;
    #_input;
    #_environment;
    _player; // Si on met #_player problème, on doit le laisser en public
    _ui;

    //Scene - related
    #_state = 0;
    #_gamescene;
    #_cutScene;


    constructor() {
        this.#_canvas = this.#_createCanvas();

        // initialize babylon scene and engine
        this.#_engine = new Engine(this.#_canvas, true);
        this.#_scene = new Scene(this.#_engine);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this.#_scene.debugLayer.isVisible()) {
                    this.#_scene.debugLayer.hide();
                } else {
                    this.#_scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        this.#_main();
    }

    #_createCanvas(){

        //Commented out for development
        document.documentElement.style["overflow"] = "hidden";
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
        this.#_canvas = document.createElement("canvas");
        this.#_canvas.style.width = "100%";
        this.#_canvas.style.height = "100%";
        this.#_canvas.id = "gameCanvas";
        document.body.appendChild(this.#_canvas);
        //document.getElementById("gameCanvas").focus(); Lorsque je la rentre dans la console du navigateur, les keys sont focus sur le canvas mais directement dans le script non
        return this.#_canvas;
    }

    async #_main(){
        await this.#_goToStart();

        // Register a render loop to repeatedly render the scene
        this.#_engine.runRenderLoop(() => {
            switch (this.#_state) {
                case 0:
                    this.#_scene.render();
                    break;
                case 3:
                    this.#_scene.render();
                    break;
                case 1:
                    this.#_scene.render();
                    break;
                case 2:
                    this.#_scene.render();
                    break;
                default: break;
            }
        });

        //resize if the screen is resized/rotated
        window.addEventListener('resize', () => {
            this.#_engine.resize();
        });
    }
    async #_goToStart(){
        this.#_engine.displayLoadingUI();

        this.#_scene.detachControl();
        let scene = new Scene(this.#_engine);
        scene.clearColor = new Color4(0,0,0,1);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        //create a fullscreen ui for all of our GUI elements
        let guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        let loadedUI = guiMenu.parseFromURLAsync("https://doc.babylonjs.com/examples/ColorPickerGui.json")
          
        
        //background image
        const imageRect = new Rectangle("titleContainer");
        imageRect.width = 0.8;
        imageRect.thickness = 0;
        guiMenu.addControl(imageRect);

        const startbg = new Image("imgstart4", "https://dl.dropbox.com/s/8x1ty4kp5w4a56l/imgstart4.jpg");
        imageRect.addControl(startbg);

        const title = new TextBlock("title", "JOB DISCOVERY");
        title.resizeToFit = true;
        title.fontFamily = "Ceviche One";
        title.fontSize = "64px";
        title.color = "black";
        title.resizeToFit = true;
        title.top = "14px";
        title.width = 0.8;
        title.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        imageRect.addControl(title);

        
        //create a simple button
        const startBtn = Button.CreateSimpleButton("start", "PLAY");
        startBtn.width = 0.2
        startBtn.height = "40px";
        startBtn.color = "black";
        startBtn.top = "-14px";
        startBtn.thickness = 0;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        guiMenu.addControl(startBtn);

        //this handles interactions with the start button attached to the scene
        startBtn.onPointerDownObservable.add(() => {
            this.#_goToCutScene();
            scene.detachControl(); //observables disabled
        });

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.#_engine.hideLoadingUI();
        //lastly set the current state to the start state and set the scene to the start scene
        this.#_scene.dispose();
        this.#_scene = scene;
        this.#_state = 0;
    }

    async #_goToCutScene(){
        this.#_engine.displayLoadingUI();
        //--SETUP SCENE--
        //dont detect any inputs from this ui while the game is loading
        this.#_scene.detachControl();
        this.#_cutScene = new Scene(this.#_engine);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), this.#_cutScene);
        camera.setTarget(Vector3.Zero());
        this.#_cutScene.clearColor = new Color4(0, 0, 0, 1);

        //--GUI--
        const cutScene = AdvancedDynamicTexture.CreateFullscreenUI("cutscene");
        const loadedGUI = cutScene.parseFromURLAsync("https://doc.babylonjs.com/examples/ColorPickerGui.json");

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

        next.onPointerDownObservable.add(() => {
            this.#_goToGame();
        })

        //--WHEN SCENE IS FINISHED LOADING--
        await this.#_cutScene.whenReadyAsync();
        this.#_engine.hideLoadingUI();
        this.#_scene.dispose();
        this.#_state = 3;
        this.#_scene = this.#_cutScene;

        //--START LOADING AND SETTING UP THE GAME DURING THIS SCENE--
        var finishedLoading = false;
        await this.#_setUpGame().then(res =>{
            finishedLoading = true;
        });
    }

    async #_setUpGame() {
        // CREATE SCENE
        let scene = new Scene(this.#_engine);
        this.#_gamescene = scene;
    
        // CREATE ENVIRONMENT
        const environment = new Environment(scene);
        this.#_environment = environment; //class variable for App
        await this.#_environment.load(); //environment
        await this.#_loadCharacterAssets(scene);
    }

    async #_loadCharacterAssets(scene){

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

           var box = MeshBuilder.CreateBox("Small1", { width: 0.5, depth: 0.5, height: 0.25, faceColors: [new Color4(0,0,0,1), new Color4(0,0,0,1), new Color4(0,0,0,1), new Color4(0,0,0,1),new Color4(0,0,0,1), new Color4(0,0,0,1)] }, scene);
           box.position.y = 1.5;
           box.position.z = 1;

           var body = Mesh.CreateCylinder("body", 3, 2,2,0,0,scene);
           var bodymtl = new StandardMaterial("red",scene);
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

   async #_initializeGameAsync(scene){
    //temporary light to light the entire scene
    var light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);

    const light = new PointLight("sparklight", new Vector3(0, 0, 0), scene);
    light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
    light.intensity = 35;
    light.radius = 1;

    const shadowGenerator = new ShadowGenerator(1024, light);
    shadowGenerator.darkness = 0.4;

    //Create the player
    this._player = new Player(this.assets, scene, shadowGenerator, this.#_input);
    const camera = this._player.activatePlayerCamera();
}

    async #_goToGame(){
        //--SETUP SCENE--
        this.#_scene.detachControl();
        let scene = this.#_gamescene;
        scene.clearColor = new Color4(0.01568627450980392, 0.01568627450980392, 0.20392156862745098); // a color that fit the overall color scheme better

       /* const ui = new uiTest(scene);
        this._ui = ui ;
        scene.detachControl(); */

    

        //--GUI--
        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        //dont detect any inputs from this ui while the game is loading
        scene.detachControl(); 

        //button for video
        /* videoBtn = Button.CreateSimpleButton("play", "PLAY VIDEO");
        videoBtn.width = 0.2;
        videoBtn.height = "900px";
        videoBtn.color = "white"
        videoBtn.thickness = 0;
        videoBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        videoBtn.top = "-12px";
        playerUI.addControl(videoBtn);

        videoBtn.onPointerDownObservable.add(() => {
            this.#_createvideoMenu();
            playerUI.detachControl();
        }); */
        

        
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
            this.#_goToLose();
            scene.detachControl(); //observables disabled
        });

        //INPUT
        this.#_input = new PlayerInput(scene); //détecte clavier et mobiles inputs

        //primitive character and setting
        await this.#_initializeGameAsync(scene);

        //--WHEN SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        scene.getMeshByName("outer").position = new Vector3(0,3,0);
        //get rid of start scene, switch to gamescene and change states
        this.#_scene.dispose();
        this.#_state = 1;
        this.#_scene = scene;
        this.#_engine.hideLoadingUI();
        //the game is ready, attach control back
        this.#_scene.attachControl();
    } ;

    /*async #_createvideoMenu() {
        
        this.#_engine.displayLoadingUI();

        //--SCENE SETUP--
        this.#_scene.detachControl();
        let scene = new Scene(this.#_engine);
        scene.clearColor = new Color4(0, 0, 0, 1);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());
    
        //--GUI--
        const videoUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const videoMenu = new Rectangle("menu video");
        videoMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        videoMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        videoMenu.height = 0.8;
        videoMenu.width = 0.5;
        videoMenu.thickness = 0;

        //background image
        const image = new Image("boulangerie.jpg", "https://dl.dropbox.com/s/56hwa1hug8soqlk/boulangerie.jpg");
        videoMenu.addControl(image);
            
        videoUI.addControl(videoMenu);
        const stackPanel = new StackPanel();
        stackPanel.width = .83;
        videoMenu.addControl(stackPanel);

        const resumeBtn = Button.CreateSimpleButton("resume", "return to simulation");
        resumeBtn.width = 0.60 ;
        resumeBtn.height = "80px";
        resumeBtn.color = "black";
        resumeBtn.cornerRadius = 14;
        resumeBtn.fontSize = "35px";
        resumeBtn.top = "-14px";
        resumeBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        stackPanel.addControl(resumeBtn);
        
        resumeBtn.onPointerDownObservable.add(() => {
            this.#_goToGame() ;
            videoMenu.isVisible = false;
            this._playerUI.removeControl(videoMenu);
            scene.detachControl();
                
                
         }) ; 
    
        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.#_engine.hideLoadingUI(); //when the scene is ready, hide loading
        //lastly set the current state to the lose state and set the scene to the lose scene
        this.#_scene.dispose();
        this.#_scene = scene;
        this.#_state = 2;
    } */
        
   
    

    async #_goToLose(){
        this.#_engine.displayLoadingUI();

        //--SCENE SETUP--
        this.#_scene.detachControl();
        let scene = new Scene(this.#_engine);
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
            this.#_goToStart();
        });

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.#_engine.hideLoadingUI(); //when the scene is ready, hide loading
        //lastly set the current state to the lose state and set the scene to the lose scene
        this.#_scene.dispose();
        this.#_scene = scene;
        this.#_state = 2;
    }
}
new App();