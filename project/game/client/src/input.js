import {ActionManager, ExecuteCodeAction, Scalar } from '@babylonjs/core';
//import { gui } from './ui';

export class PlayerInput {
	inputMap;
	#_scene;


	//simple movement
	horizontal = 0;
	vertical = 0;
	//tracks whether or not there is movement in that axis
	horizontalAxis = 0;
	verticalAxis = 0;

	//Actions
	actionKeyDown = false;

	//Mobile
	#ui;
	mobileLeft = false;
	mobileUp = false;
	mobileDown = false;
	mobileRight = false;
	mobileAction = false;

	
	constructor(scene, ui) {

		this.#_scene = scene; 
		this.#ui = ui;
		
		scene.actionManager = new ActionManager(scene);

		this.inputMap = {};
		scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
			this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
		}));
		scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
			this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == 'keydown';
		}));

		scene.onBeforeRenderObservable.add(() => {
			this.#_updateFromKeyboard();
		});

		if(this.#ui.isMobile){
			this.#setUpMobile();
		}
	}

	#_updateFromKeyboard(){
		//Mouvements
		if (this.inputMap['ArrowUp'] || this.mobileUp ) {
			this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
			this.verticalAxis = 1;
	
		} else if (this.inputMap['ArrowDown'] ||this.mobileDown) {
			this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
			this.verticalAxis = -1;
		} else {
			this.vertical = 0;
			this.verticalAxis = 0;
		}
	
		if (this.inputMap['ArrowLeft'] || this.mobileLeft) {
			this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
			this.horizontalAxis = -1;
	
		} else if (this.inputMap['ArrowRight'] || this.mobileRight) {
			this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
			this.horizontalAxis = 1;
		}
		else {
			this.horizontal = 0;
			this.horizontalAxis = 0;
		}

		//Action
		if(this.inputMap[' '] || this.mobileAction){
			this.actionKeyDown = true;
		}
		else{
			this.actionKeyDown = false;
		}
	}

	// Mobile controls
	#setUpMobile(){
		//Jump Button
		this.#ui.actionBtn.onPointerDownObservable.add(() => {
			this.mobileAction = true;
		});
		this.#ui.actionBtn.onPointerUpObservable.add(() => {
			this.mobileAction = false;
		});

		//Arrow Keys
		this.#ui.leftBtn.onPointerDownObservable.add(() => {
			this.mobileLeft = true;
		});
		this.#ui.leftBtn.onPointerUpObservable.add(() => {
			this.mobileLeft = false;
		});

		this.#ui.rightBtn.onPointerDownObservable.add(() => {
			this.mobileRight = true;
		});
		this.#ui.rightBtn.onPointerUpObservable.add(() => {
			this.mobileRight = false;
		});

		this.#ui.upBtn.onPointerDownObservable.add(() => {
			this.mobileUp = true;
		});
		this.#ui.upBtn.onPointerUpObservable.add(() => {
			this.mobileUp = false;
		});

		this.#ui.downBtn.onPointerDownObservable.add(() => {
			this.mobileDown = true;
		});
		this.#ui.downBtn.onPointerUpObservable.add(() => {
			this.mobileDown = false;
		});
	}

}
