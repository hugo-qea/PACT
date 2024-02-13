
import { TextBlock, StackPanel, AdvancedDynamicTexture, Image, Button, Rectangle, Control, Grid } from "@babylonjs/gui";
import { Scene, Sound, ParticleSystem, PostProcess, Effect, SceneSerializer } from "@babylonjs/core";
export class UI{
    _scene;
    videoBtn;
    _playerUI;
    _videoMenu;

    constructor(scene){
        
        this._scene = scene ;
        
        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._playerUI = playerUI;
        this._playerUI.idealHeight = 720 ;

        const videoBtn = Button.CreateSimpleButton("play ", "PLAY VIDEO")
        videoBtn.width = 0.2;
        videoBtn.height = "900px";
        videoBtn.thickness = 0;
        videoBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        videoBtn.top = "-14px";
        playerUI.addControl(videoBtn);
        this.videoBtn = videoBtn;
        videoBtn.onPointerDownObservable.add(() => {
            this._videoMenu.isVisible = true;
            playerUI.addControl(this._videoMenu);
            this.videoBtn.isHitTestVisible = false;
        }) ;

        this.#_createVideoMenu() ;

    }

    #_createVideoMenu(){
        const videoMenu = new Rectangle();
        videoMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        videoMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        videoMenu.height = 0.8;
        videoMenu.width = 0.5;
        videoMenu.thickness = 0;
        videoMenu.isVisible = false;

        const stackPanel = new StackPanel();
        stackPanel.width = .83;
        videoMenu.addControl(stackPanel);

        this._videoMenu = videoMenu ;
    }
}