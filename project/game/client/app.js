import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import { Engine, Scene, SceneLoader, Vector3, Mesh, MeshBuilder, FreeCamera, ArcRotateCamera, Color4, StandardMaterial, Color3, PointLight, HemisphericLight, ShadowGenerator, Quaternion, Matrix, VideoTexture, VideoDome, SceneLoader } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button, Control } from '@babylonjs/gui';
import { Player } from './characterController';
import { PlayerInput } from './inputController';
import { Hud } from './ui';

const START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3, VIDEOSCENE = 4;

class App {
	// General Entire Application
	#scene = null;
	#canvas = null;
	#engine = null;

	getScene(){
		return this.#uiScene;
	}

	//Game State Related
	assets = null;
	#input = null;
	#environment = null;
	#player = null; // Si on met #player problème, on doit le laisser en public
	#ui;

	//Scene - related
	#state = null;
	#gameScene = null;
	#cutScene = null;
	#videoScene = null;
	#video360Scene = null;
	#uiScene = null;
	test = 0;

	constructor() {
		this.#canvas = App.createCanvas();

		// initialize babylon scene and engine
		this.#engine = new Engine(this.#canvas, true);
		this.#scene = new Scene(this.#engine);
		this.#uiScene = new Scene(this.#engine);
		this.#uiScene.autoClear = false; // does the scene must clear the render buffer before rendering a frame
		let uiCamera = new ArcRotateCamera('cameraUI', new Vector3(0, 0, 0), this.#uiScene);

		// hide/show the Inspector
		window.addEventListener('keydown', (ev) => {
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
		//create the canvas html element and attach it to the webpage
		let canvas = document.createElement('canvas');
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.id = 'gameCanvas';
		document.body.appendChild(canvas);
		return canvas;
	}

	async main(){
		await this.goToStart();

		// Register a render loop to repeatedly render the scene
		this.#engine.runRenderLoop(() => {
			switch (this.#state) {
			case START:
			case LOSE:
			case CUTSCENE:
				this.#scene.render();
				break;
			case GAME:
				this.#scene.render();
				this.#uiScene.render();
				break;
			case VIDEOSCENE:
				this.#scene.render();
				this.#videoScene.render();
				this.#uiScene.render();
				break;
			case 5:
				this.#scene.render();
				this.#video360Scene.render();
				this.#uiScene.render();
				break;
			default:
				break;
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
		let camera = new FreeCamera('camera1', new Vector3(0, 0, 0), scene);
		camera.setTarget(Vector3.Zero());

		//create a fullscreen ui for all of our GUI elements
		const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('UI');
		
		guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

		//create a simple button
		const startBtn = Button.CreateSimpleButton('start', 'PLAY');
		startBtn.width = 0.2;
		startBtn.height = '40px';
		startBtn.color = 'white';
		startBtn.top = '-100px';
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
		console.log("SCENE LOADED");

		this.#engine.hideLoadingUI();
		//lastly set the current state to the start state and set the scene to the start scene
		this.#scene.dispose();
		this.#scene = scene;
		this.#state = START;
	}

	async goToCutScene(){
		this.#engine.displayLoadingUI();
		//--SETUP SCENE--
		//dont detect any inputs from this ui while the game is loading
		this.#scene.detachControl();
		this.#cutScene = new Scene(this.#engine);
		let camera = new FreeCamera('camera1', new Vector3(0, 0, 0), this.#cutScene);
		camera.setTarget(Vector3.Zero());
		this.#cutScene.clearColor = new Color4(0, 0, 0, 1);

		//--GUI--
		const cutScene = AdvancedDynamicTexture.CreateFullscreenUI('cutscene');
		let loadedCutGui = await cutScene.parseFromSnippetAsync('9HWE6N#11'); //MGGNCX#9
		let bioPlus = cutScene.getControlByName('Plus bio');
		let qtéFarine = cutScene.getControlByName('kg');
		let PrixTot = cutScene.getControlByName('prixtot');
		let BioFarine = 0;
		let prix = 0;
		const BioQté = cutScene.getControlByName('Poids bio text');
		bioPlus.onPointerDownObservable.add(() => {
			BioFarine += 1;
			prix += 20;
			PrixTot.text = prix;
			qtéFarine.text = GMFarine + BioFarine;
			BioQté.text = BioFarine;
		});

		let GMPlus = cutScene.getControlByName('Plus grand meunier');
		let GMFarine = 0;
		const GMQté = cutScene.getControlByName('Poids GM');
		GMPlus.onPointerDownObservable.add(() => {
			GMFarine += 1;
			prix += 20;
			PrixTot.text = prix;
			qtéFarine.text = GMFarine + BioFarine;
			GMQté.text = GMFarine;
		});

		let bioMoins = cutScene.getControlByName('Moins bio');
		bioMoins.onPointerDownObservable.add(() => {
			BioFarine += -1;
			prix += -20;
			PrixTot.text = prix;
			qtéFarine.text = GMFarine + BioFarine;
			BioQté.text = BioFarine;
		});

		let GMMoins = cutScene.getControlByName('Moins grand meunier');
		GMMoins.onPointerDownObservable.add(() => {
			GMFarine += -1;
			prix += -20;
			PrixTot.text = prix;
			qtéFarine.text = GMFarine + BioFarine;
			GMQté.text = GMFarine;
		}); 

		let QtéDemandée = cutScene.getControlByName('qté text');
		let BudgetDmd = cutScene.getControlByName('budget text');
		

		
		const next = cutScene.getControlByName('NextButton');
		next.onPointerUpObservable.add(() => {
			if(PrixTot.text == BudgetDmd.text & qtéFarine.text == QtéDemandée.text){
				this.goToGame();
				cutScene.dispose(); }
		});

		//--WHEN SCENE IS FINISHED LOADING--
		await this.#cutScene.whenReadyAsync();
		this.#engine.hideLoadingUI();
		this.#scene.dispose();
		this.#state = 3;
		this.#scene = this.#cutScene;

		//--START LOADING AND SETTING UP THE GAME DURING THIS SCENE--
		//let finishedLoading = false;
		await this.setUpGame();
	}

	async setUpGame() {
		// CREATE SCENE
		let scene = new Scene(this.#engine);
	
		SceneLoader.Append('/scenes essais/', 'atelier.glb', scene);
		this.#gameScene = scene;
		await this.loadCharacterAssets(scene);
	}

	async loadCharacterAssets(scene){

		async function loadCharacter(){
			//collision mesh
			const outer = MeshBuilder.CreateBox('outer', { width: 2, depth: 1, height: 3 }, scene);
			outer.isVisible = false;
			outer.isPickable = false;
			outer.checkCollisions = true;

			//move origin of box collider to the bottom of the mesh (to match player mesh)
			outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

			//for collisions
			outer.ellipsoid = new Vector3(1, 1.5, 1);
			outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

			outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player

			let box = MeshBuilder.CreateBox('Small1', {
				width: 0.5,
				depth: 0.5,
				height: 0.25,
				faceColors: new Array(6).fill(Color3.Black().toColor4())
			}, scene);
			box.position.y = 1.5;
			box.position.z = 1;

			let body = Mesh.CreateCylinder('body', 3, 2, 2, 0, 0, scene);

			//let body = SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", scene, function (newMeshes) {
				//let body = newMeshes[0];
			//});
        	//Scale the model down        
        	//hero.scaling.scaleInPlace(0.1);
			//}
			
			//SceneLoader.ImportMesh('__root__', 'scenes essais/Character.glb');
			//let character = scene.getMeshByName('__root__');
			//console.log(character);
			let bodymtl = new StandardMaterial('red',scene);
			bodymtl.diffuseColor = new Color3(.8 ,.5, .5);
			body.material = bodymtl;
			body.isPickable = false;
			body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin

			//parent the meshes
			box.parent = body;
			body.parent = outer;

			return {
				mesh: outer
			};
		}
		return loadCharacter().then(assets=> {
			this.assets = assets;
		});

	}

	async initializeGameAsync(scene){
		//temporary light to light the entire scene
		const light0 = new HemisphericLight('HemiLight', new Vector3(0, 1, 0), scene);

		const light = new PointLight('sparklight', new Vector3(0, 10, 0), scene);
		light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
		light.intensity = 35;
		light.radius = 1;

		const shadowGenerator = new ShadowGenerator(1024, light);
		shadowGenerator.darkness = 0.4;

		//Create the player
		this.#player = new Player(this.assets, scene, shadowGenerator, this.#input, this);
		this.#player.activatePlayerCamera();

		let camera = new ArcRotateCamera('arc', -Math.PI/2, Math.PI/3, 40, new Vector3(0,3,-20),scene);
		scene.activeCamera = camera;
	}

	async goToGame(){
		//--SETUP SCENE--
		this.#scene.detachControl();
		let scene = this.#gameScene;
		scene.clearColor = new Color4(0.01568627450980392, 0.01568627450980392, 0.20392156862745098); // a color that fit the overall color scheme better

		//GUI
		
		const ui = new Hud(this.#scene);
		this.#ui = ui;
		//--GUI--
		const playerUI = AdvancedDynamicTexture.CreateFullscreenUI('UI');


		//create a simple button
		const loseBtn = Button.CreateSimpleButton('lose', 'LOSE');
		loseBtn.width = 0.2;
		loseBtn.height = '40px';
		loseBtn.color = 'white';
		loseBtn.top = '-14px';
		loseBtn.thickness = 0;
		loseBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
		playerUI.addControl(loseBtn);

		//this handles interactions with the start button attached to the scene
		loseBtn.onPointerDownObservable.add(() => {
			this.goToVideo360();
			scene.detachControl(); //observables disabled
		});

		//INPUT
		this.#input = new PlayerInput(scene,this.#ui); //détecte clavier et mobiles inputs

		//primitive character and setting
		await this.initializeGameAsync(scene);

		//--WHEN SCENE FINISHED LOADING--
		await scene.whenReadyAsync();
		scene.getMeshByName('outer').position = new Vector3(0,3,0);
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
		let camera = new FreeCamera('camera1', new Vector3(0, 0, 0), scene);
		camera.setTarget(Vector3.Zero());

		//--GUI--
		const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('UI');
		const mainBtn = Button.CreateSimpleButton('mainmenu', 'MAIN MENU');
		mainBtn.width = 0.2;
		mainBtn.height = '40px';
		mainBtn.color = 'white';
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

	//Probleme de blocage si on met this.#scene.detachControl();
	async goToVideo(){
		this.#engine.displayLoadingUI();

		//--SCENE SETUP--
		//this.#scene.detachControl();

		let scene = new Scene(this.#engine);
		let camera = new ArcRotateCamera('arcR', -Math.PI/2, Math.PI/2, 1200, new Vector3(0,0,0),scene);
		//camera.attachControl(this.#canvas, true);
		let planeOpts = {
			height: 1080, 
			width: 1920, 
			sideOrientation: Mesh.DOUBLESIDE
		};
		let ANote0Video = MeshBuilder.CreatePlane('plane', planeOpts, scene);
		ANote0Video.isPickable = true;
		let vidPos = (new Vector3(0,0,0.1));
		ANote0Video.position = vidPos;
		let ANote0VideoMat = new StandardMaterial('m', scene);
		let ANote0VideoVidTex = new VideoTexture('boulangerie',this.#player.getVideoName(), scene);
		ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
		ANote0VideoMat.roughness = 1;
		ANote0VideoMat.emissiveColor = new Color3.White();
		ANote0Video.material = ANote0VideoMat;
		/*
        scene.onPointerObservable.add(function(evt){
            if((evt.pickInfo.pickedMesh === ANote0Video)){
                if(ANote0VideoVidTex.video.paused)
                    ANote0VideoVidTex.video.play();
                else
                    ANote0VideoVidTex.video.pause();
            }
        }, PointerEventTypes.POINTERPICK); */

		//--GUI--
		const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('UI');
		const mainBtn = Button.CreateSimpleButton('returngame', 'RETURN GAME');
		mainBtn.width = 0.2;
		mainBtn.height = '40px';
		mainBtn.color = 'white';
		guiMenu.addControl(mainBtn);

		const lectureBtn = Button.CreateSimpleButton('lecturebutton', 'LECTURE / PAUSE');
		lectureBtn.width = 0.2;
		lectureBtn.height = '40px';
		lectureBtn.color = 'orange';
		lectureBtn.horizontalAlignment = Button.HORIZONTAL_ALIGNMENT_LEFT;
		lectureBtn.verticalAlignment = Button.VERTICAL_ALIGNMENT_BOTTOM;
		guiMenu.addControl(lectureBtn);

		//Lire / Arreter video
		lectureBtn.onPointerUpObservable.add(() => {
			if(ANote0VideoVidTex.video.paused)
				ANote0VideoVidTex.video.play();
			else
				ANote0VideoVidTex.video.pause();
		});

		//this handles interactions with the start button attached to the scene
		mainBtn.onPointerUpObservable.add(() => {
			this.#videoScene.detachControl();
			ANote0VideoVidTex.video.pause();
			//ANote0Video.dispose();
			ANote0VideoVidTex.dispose();
			mainBtn.dispose();
			lectureBtn.dispose();
			ANote0Video.isPickable = false;
			this.#videoScene.dispose();
			this.#state = 1;
			setTimeout(this.#player.launchGuiFromVideo(),20000);
			//this.goToGame();
		});

		//--SCENE FINISHED LOADING--
		await scene.whenReadyAsync();
		this.#engine.hideLoadingUI(); //when the scene is ready, hide loading
		//lastly set the current state to the lose state and set the scene to the lose scene
		this.#videoScene = scene;
		this.#state = 4;
	}

	async goToVideo360(){
		this.#engine.displayLoadingUI();

		//--SCENE SETUP--
		//this.#scene.detachControl();

		let scene = new Scene(this.#engine);
		let camera = new ArcRotateCamera('arcR', -Math.PI/2, Math.PI/2, 1200, new Vector3(0,0,0),scene);
		//camera.attachControl(this.#canvas, true);
		let dome = new VideoDome(
			"boulangerie",
			["boulangerie360.mp4"],
			{
				resolution: 16,
				autoPlay : true,
				clickToPlay: true,
				useDirectMapping: false
			},
			scene
		);

		//--GUI--
		const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('UI');
		const mainBtn = Button.CreateSimpleButton('returngame', 'RETURN GAME');
		mainBtn.width = 0.2;
		mainBtn.height = '40px';
		mainBtn.color = 'white';
		guiMenu.addControl(mainBtn);

		//this handles interactions with the start button attached to the scene
		mainBtn.onPointerUpObservable.add(() => {
			this.#videoScene.detachControl();
			dome.dispose();
			mainBtn.dispose();
			this.#videoScene.dispose();
			this.#state = 1;
			//setTimeout(this.#player.launchGuiFromVideo(),20000);
			//this.goToGame();
		});

		//--SCENE FINISHED LOADING--
		await scene.whenReadyAsync();
		this.#engine.hideLoadingUI(); //when the scene is ready, hide loading
		//lastly set the current state to the lose state and set the scene to the lose scene
		this.#videoScene = scene;
		this.#state = 4;
	}

}


new App();

