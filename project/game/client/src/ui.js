import { TextBlock, StackPanel, AdvancedDynamicTexture, Image, Button, Rectangle, Control, Grid } from '@babylonjs/gui';
import { Scene, Sound, ParticleSystem, PostProcess, Effect, SceneSerializer } from '@babylonjs/core';

export class Hud{
	#scene;
	//UI Elements
	pauseBtn;
	#playerUI;
	#_pauseMenu;

	//Mobile
	isMobile;
	//jumpBtn;
	actionBtn;
	leftBtn;
	rightBtn;
	upBtn;
	downBtn;
    
	constructor(scene){

		this.#scene= scene;
		const playerUI = AdvancedDynamicTexture.CreateFullscreenUI('UI');
		this.#playerUI = playerUI ;
		this.#playerUI.idealHeight = 720;
		/*
        const stackPanel = new StackPanel();
        stackPanel.height = '100%';
        stackPanel.width = '100%';
        stackPanel.top = '14px';
        stackPanel.verticalAlignment = 0;
        playerUI.addControl(stackPanel);

        //pause button
        const pauseBtn = Button.CreateSimpleButton('pauseBtn');
        pauseBtn.width = '48px';
        pauseBtn.height = '86px';
        pauseBtn.thickness = 0;
        pauseBtn.verticalAlignment = 0;
        pauseBtn.horizontalAlignment = 1;
        pauseBtn.top = '-16px';
        //playerUI.addControl(pauseBtn);
        pauseBtn.zIndex = 10;
        this.pauseBtn = pauseBtn;
        
        //when the button is down, make pause menu visable and add control to it
        pauseBtn.onPointerDownObservable.add(() => {
            this.#_pauseMenu.isVisible = true;
            playerUI.addControl(this.#_pauseMenu);
            this.pauseBtn.isHitTestVisible = false;
        });
        this.#_createPauseMenu();
        */
		//Check if Mobile, add button controls
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			this.isMobile = true; // tells inputController to track mobile inputs
        
			//tutorial image
			/*movementPC.isVisible = false;
                    let movementMobile = new Image("pause", "sprites/tutorialMobile.jpeg");
                    tutorial.addControl(movementMobile);*/
			//--ACTION BUTTONS--
			// container for action buttons (right side of screen)
			const actionContainer = new Rectangle();
			actionContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
			actionContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
			actionContainer.height = 0.4;
			actionContainer.width = 0.2;
			actionContainer.left = '-2%';
			actionContainer.top = '-2%';
			actionContainer.thickness = 0;
			playerUI.addControl(actionContainer);
        
			//grid for action button placement
			const actionGrid = new Grid();
			actionGrid.addColumnDefinition(.5);
			actionGrid.addColumnDefinition(.5);
			actionGrid.addRowDefinition(.5);
			actionGrid.addRowDefinition(.5);
			actionContainer.addControl(actionGrid);
        
			const actionBtn = Button.CreateImageOnlyButton('action', 'actionBtn.webp');
			//const actionBtn = Button.CreateSimpleButton("action", "Action")
			actionBtn.thickness = 0;
			actionBtn.alpha = 0.8;
			actionBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
			this.actionBtn = actionBtn;
        
			/*const jumpBtn = Button.CreateImageOnlyButton("jump", "./sprites/bBtn.png");
                    jumpBtn.thickness = 0;
                    jumpBtn.alpha = 0.8;
                    jumpBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                    this.jumpBtn = jumpBtn;*/
        
			actionGrid.addControl(actionBtn, 0, 1);
			//actionGrid.addControl(jumpBtn, 1, 0);
        
			//--MOVEMENT BUTTONS--
			// container for movement buttons (section left side of screen)
			const moveContainer = new Rectangle();
			moveContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
			moveContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
			moveContainer.height = 0.4;
			moveContainer.width = 0.4;
			moveContainer.left = '2%';
			moveContainer.top = '-2%';
			moveContainer.thickness = 0;
			playerUI.addControl(moveContainer);
        
			//grid for placement of arrow keys
			const grid = new Grid();
			grid.addColumnDefinition(.4);
			grid.addColumnDefinition(.4);
			grid.addColumnDefinition(.4);
			grid.addRowDefinition(.5);
			grid.addRowDefinition(.5);
			moveContainer.addControl(grid);
        
			const leftBtn = Button.CreateImageOnlyButton('left', 'arrowBtn2.png');
			leftBtn.thickness = 0;
			leftBtn.rotation = -Math.PI / 2;
			leftBtn.color = 'white';
			leftBtn.alpha = 0.8;
			leftBtn.width = 0.8;
			leftBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
			this.leftBtn = leftBtn;
        
			const rightBtn = Button.CreateImageOnlyButton('right', 'arrowBtn2.png');
			rightBtn.rotation = Math.PI / 2;
			rightBtn.thickness = 0;
			rightBtn.color = 'white';
			rightBtn.alpha = 0.8;
			rightBtn.width = 0.8;
			rightBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
			this.rightBtn = rightBtn;
        
			const upBtn = Button.CreateImageOnlyButton('up', 'arrowBtn2.png');
			upBtn.thickness = 0;
			upBtn.alpha = 0.8;
			upBtn.color = 'white';
			this.upBtn = upBtn;
        
			const downBtn = Button.CreateImageOnlyButton('down', 'arrowBtn2.png');
			downBtn.thickness = 0;
			downBtn.rotation = Math.PI;
			downBtn.color = 'white';
			downBtn.alpha = 0.8;
			this.downBtn = downBtn;
        
			//arrange the buttons in the grid
			grid.addControl(leftBtn, 1, 0);
			grid.addControl(rightBtn, 1, 2);
			grid.addControl(upBtn, 0, 1);
			grid.addControl(downBtn, 1, 1);
        
		}
	}

	//---- Pause Menu Popup ----
	#_createPauseMenu() {
		const pauseMenu = new Rectangle();
		pauseMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
		pauseMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
		pauseMenu.height = 0.8;
		pauseMenu.width = 0.5;
		pauseMenu.thickness = 0;
		pauseMenu.isVisible = false;
	}


}
