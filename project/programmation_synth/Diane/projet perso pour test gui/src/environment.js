//Contient toutes les informations nécessaires pour la scène
import { Scene, Mesh, Vector3 } from "@babylonjs/core";

export class Environment {
    #_scene;

    constructor(scene) {
        this.#_scene = scene;
    }

    async load() {
        var ground = Mesh.CreateBox("ground", 24, this.#_scene);
        ground.scaling = new Vector3(1,.02,1);
    }
}