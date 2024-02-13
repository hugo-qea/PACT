import { AdvancedDynamicTexture, Button, Control } from '@babylonjs/gui';
import { AdvancedTimer } from '@babylonjs/core';
import { Scene, Engine, ArcRotateCamera, SceneLoader, Vector3, SpotLight, Mesh, MeshBuilder, StandardMaterial, VideoTexture, Color3, PointerEventTypes} from '@babylonjs/core';
import {App} from './app.js';

export class Action{
    
	name;
	xMin;
	xMax;
	zMin;
	zMax;
	hud;
	video;
	actionUI;

	constructor(name, xMin, xMax, zMin, zMax, hud, video){
		this.name = name;
		this.xMin = xMin,
		this.xMax = xMax;
		this.zMin = zMin;
		this.zMax = zMax;
		this.hud = hud;
		this.video = video;
	}

	getHud(){
		return this.hud;
	}

	clearGUI(){
		this.actionUI.dispose();
	}

	async loadGui(scene){
		this.actionUI = AdvancedDynamicTexture.CreateFullscreenUI('ActionUI',true,scene);
		let loadedCutGui =  await this.actionUI.parseFromSnippetAsync(this.hud);
		
	}



	async loadAction(indAction, scene){
		switch(indAction){
		case 1 : this.cuireMethod(scene);
			break;
		case 2 : this.ChercherFarine(scene);
			break;
		case 4 : this.ChercherLevure(scene);
			break;
		case 6 : this.Peser(scene);
			break;
		case 15 : this.cuireMethod(scene);
			break;
            
		default : break;
		}
	}

	async cuireMethod(scene){
		const cuireGui = AdvancedDynamicTexture.CreateFullscreenUI('CuireUI',true,scene);
		let loaded = await cuireGui.parseFromSnippetAsync('ARNCID#4');  //ARNCID
		let slider = cuireGui.getControlByName('Slider');
		let count = 5;
		let rep1 = cuireGui.getControlByName('Rep1');
		let rep2 = cuireGui.getControlByName('Rep2');
		let rep3 = cuireGui.getControlByName('Rep3');
        
		rep2.onPointerDownObservable.add(() => {
			rep2.background = 'green';
			let interval = setInterval(() => {
				count--;
				slider.value += 1;
				console.log(count); 
				if (count == 0){
					const textBlock = cuireGui.getControlByName('Textblock');
					textBlock.text = 'Cuisson terminée';
				}
				if (count == -3){
					cuireGui.dispose(); 
					clearInterval(interval);
                            
				}
			}, 1000);
		});

		rep1.onPointerDownObservable.add(() => {
			this.rep1method(cuireGui, scene);
		});

		rep3.onPointerDownObservable.add(() => {
			this.rep3method(cuireGui, scene);
		});
	}

	async rep1method(Gui, scene){
		Gui.dispose();
		const NewGui = AdvancedDynamicTexture.CreateFullscreenUI('NewGui', true, scene);
		let loaded2 = await NewGui.parseFromSnippetAsync('GMRXFP#14');
		let tryAgain = NewGui.getControlByName('TryAgain');
		tryAgain.onPointerDownObservable.add(() => {
			NewGui.dispose();
			this.cuireMethod(scene);
		});
	}

	async rep3method(Gui, scene){
		Gui.dispose();
		const NewGui = AdvancedDynamicTexture.CreateFullscreenUI('NewGui', true, scene);
		let loaded2 = await NewGui.parseFromSnippetAsync('GMRXFP#16');
		let tryAgain = NewGui.getControlByName('TryAgain');
		tryAgain.onPointerDownObservable.add(() => {
			NewGui.dispose();
			this.cuireMethod(scene);
		});
	}

	async ChercherFarine(scene){
		const FarineGui = AdvancedDynamicTexture.CreateFullscreenUI('FarineGui', true, scene);
		let loaded = await FarineGui.parseFromSnippetAsync('LI88CY#8');
		let repA = FarineGui.getControlByName('RepA');
		let repB = FarineGui.getControlByName('RepB');
		let repC = FarineGui.getControlByName('RepC');
		let next = FarineGui.getControlByName('Button');
		repC.onPointerDownObservable.add(() => {
			repC.background = 'green';
			next.onPointerDownObservable.add(() => {
				FarineGui.dispose();
			});
            
		});
		repB.onPointerDownObservable.add(() => {
			repB.background = 'red';
			this.repBmethod2(FarineGui, scene);
            
		});
		repA.onPointerDownObservable.add(() => {
			repA.background = 'red';
			this.repAmethod2(FarineGui, scene);
		});

	}
    
	async repBmethod2(Gui, scene){

		Gui.dispose();
		const NewGui = AdvancedDynamicTexture.CreateFullscreenUI('NewGui', true, scene);
		let loaded2 = await NewGui.parseFromSnippetAsync('GMRXFP#17');
		let tryAgain = NewGui.getControlByName('TryAgain');
		tryAgain.onPointerDownObservable.add(() => {
			NewGui.dispose();
			this.ChercherFarine(scene);
		});
	}

	async repAmethod2(Gui, scene){

		Gui.dispose();
		const NewGui = AdvancedDynamicTexture.CreateFullscreenUI('NewGui', true, scene);
		let loaded2 = await NewGui.parseFromSnippetAsync('GMRXFP#17');
		let tryAgain = NewGui.getControlByName('TryAgain');
		tryAgain.onPointerDownObservable.add(() => {
			NewGui.dispose();
			this.ChercherFarine(scene);
		});
	}



        
	async ChercherLevure(scene){
		const LevureGui = AdvancedDynamicTexture.CreateFullscreenUI('LevureGui',true, scene);
		let loaded = await LevureGui.parseFromSnippetAsync('LI88CY#9');
		let repA = LevureGui.getControlByName('RepA');
		let repB = LevureGui.getControlByName('RepB');
		let repC = LevureGui.getControlByName('RepC');
		let next = LevureGui.getControlByName('Button');
		repA.onPointerDownObservable.add(() => {
			repA.background = 'green';
			next.onPointerDownObservable.add(() => {
				LevureGui.dispose();
			});
            
		});
		repB.onPointerDownObservable.add(() => {
			repB.background = 'red';
			this.repBmethod(LevureGui,scene);
            
		});
		repC.onPointerDownObservable.add(() => {
			repC.background = 'red';
			this.repCmethod(LevureGui,scene);
		});

	}

	async repBmethod(Gui, scene){

		Gui.dispose();
		const NewGui = AdvancedDynamicTexture.CreateFullscreenUI('NewGui', true , scene);
		let loaded2 = await NewGui.parseFromSnippetAsync('GMRXFP#18');
		let tryAgain = NewGui.getControlByName('TryAgain');
		tryAgain.onPointerDownObservable.add(() => {
			NewGui.dispose();
			this.ChercherLevure(scene);
		});
	}

	async repCmethod(Gui, scene){

		Gui.dispose();
		const NewGui = AdvancedDynamicTexture.CreateFullscreenUI('NewGui', true, scene);
		let loaded2 = await NewGui.parseFromSnippetAsync('GMRXFP#19');
		let tryAgain = NewGui.getControlByName('TryAgain');
		tryAgain.onPointerDownObservable.add(() => {
			NewGui.dispose();
			this.ChercherLevure(scene);
		});
	}

	async Peser(scene){
		const PetrieGui = AdvancedDynamicTexture.CreateFullscreenUI('PetrieGui', true, scene);
		let loaded = await PetrieGui.parseFromSnippetAsync('CWT9XQ#14');
		let plusFarine = PetrieGui.getControlByName('Plus farine');
		let moinsFarine = PetrieGui.getControlByName('Moins farine');
		let Farine = PetrieGui.getControlByName('Farine text');
		let farine = 0;
		let plusSel = PetrieGui.getControlByName('Plus sel');
		let moinsSel = PetrieGui.getControlByName('Moins sel');
		let Sel = PetrieGui.getControlByName('Sel text');
		let sel = 0;
		let plusLevure = PetrieGui.getControlByName('Plus levure');
		let moinsLevure = PetrieGui.getControlByName('Moins levure');
		let Levure = PetrieGui.getControlByName('Levure text');
		let levure = 0;
		let plusEau = PetrieGui.getControlByName('Plus eau');
		let moinsEau = PetrieGui.getControlByName('Moins eau');
		let Eau = PetrieGui.getControlByName('Eau text');
		let eau = 0;
		let NextButton = PetrieGui.getControlByName('NextButton');

		plusFarine.onPointerDownObservable.add(() => {
			farine += 1;
			Farine.text = farine;
		});
		moinsFarine.onPointerDownObservable.add(() => {
			farine += -1;
			Farine.text = farine;
		});
		plusSel.onPointerDownObservable.add(() => {
			sel += 10;
			Sel.text = sel;
		});
		moinsSel.onPointerDownObservable.add(() => {
			sel += -10;
			Sel.text = sel;
		});
		plusLevure.onPointerDownObservable.add(() => {
			levure += 10;
			Levure.text = levure;
		});
		moinsLevure.onPointerDownObservable.add(() => {
			levure += -10;
			Levure.text = levure;
		});
		plusEau.onPointerDownObservable.add(() => {
			eau += 0.5;
			Eau.text = eau;
		});
		moinsEau.onPointerDownObservable.add(() => {
			eau += -0.5;
			Eau.text = eau;
		});
		NextButton.onPointerDownObservable.add(() => {
            
			if(farine == 6 & levure == 60 & sel == 180 & eau == 3){
				PetrieGui.dispose();
			}
            
		});

	}

   
}
