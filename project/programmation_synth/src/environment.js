//Contient toutes les informations nécessaires pour la scène
import { Scene, Mesh, Vector3 } from "@babylonjs/core";

export class Environment {
    #scene;

    constructor(scene) {
        this.#scene = scene;
    }

    async load() {
        ground = Mesh.CreateBox("ground", 24, this.#scene);
        ground.scaling = new Vector3(1,.02,1);
    }
}
