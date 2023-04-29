import { Vector2 } from "three";

export default interface Engine {
    updateForce(pos: Vector2, forceDelta: Vector2) : void;
    startSimulation() : Promise<void>;
    bindOutput(callback: (data: Float32Array) => void) : void;
}
