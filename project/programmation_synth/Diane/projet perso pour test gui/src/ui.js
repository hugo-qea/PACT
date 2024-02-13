import { TextBlock, StackPanel, AdvancedDynamicTexture, Image, Button, Rectangle, Control, Grid } from "@babylonjs/gui";
import { Scene, Sound, ParticleSystem, PostProcess, Effect, SceneSerializer, TransformNode } from "@babylonjs/core";

export class ui extends TransformNode{
    _scene;


     //UI Elements
    videoBtn;
    _playerUI;
    _videoMenu;
    _gameVideo;
    
    constructor(scene) {

        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        //dont detect any inputs from this ui while the game is loading
        scene.detachControl();
        this._scene = scene;

        
        this._playerUI = playerUI;
        this._playerUI.idealHeight = 720; 

        //VideoButton
        const videoBtn = Button.CreateSimpleButton("play", "PLAY VIDEO");
        videoBtn.width = 0.2;
        videoBtn.height = "900px";
        videoBtn.thickness = 0;
        videoBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        videoBtn.top = "-14px";
        playerUI.addControl(videoBtn);
        this.videoBtn = videoBtn;

     //when the button is down, make video menu visable and add control to it
        videoBtn.onPointerDownObservable.add(() => {
            this.#_createvideoMenu();
            playerUI.detachControl();
        }) ;

        
    }
    

     //---- Video Menu Popup ----
     async #_createvideoMenu() {
        
       // this.#_engine.displayLoadingUI();

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
    }
} 

