import { modelSerialize as ser, modelDeserialize as des } from "../../src/workers/modelWorker"
import Model from "../../src/services/model"
import { type Vector2 } from 'three';
import {expect, test} from "@jest/globals"

// define a mock model
class MockModel implements Model
{
    private inputTensor: Float32Array;

    constructor (inputTensor: Float32Array) {
        this.inputTensor = inputTensor;
    }

    updateForce(pos: Vector2, forceDelta: Vector2): void {
    }

    startSimulation (): void {
    }

    bindOutput (callback: (data: Float32Array) => void): void {
    }

    getInputTensor(): Float32Array {
        return this.inputTensor;
    }
}

// serialise tests

test("serialise empty input tensor", async() => {
    expect(ser(new MockModel(new Float32Array())))
        .toBe(JSON.stringify(`

        `))
})

test("serialise valid model", async() => {
    let model = new MockModel(new Float32Array([1,2,3,4,5.5,6.6]));
    expect(ser(model))
        .toBe(JSON.stringify(`

        `))
})

// deserialise tests

test("deserialise empty string", async() => {
    expect(des("")).toBeNull();
})

test("deserialise non existent title", async() => {
    expect(des("")).toBeNull();
})

test("deserialise empty input tensor", async() => {
    expect(des(JSON.stringify(`
        {
            title: mock,
            inputTensor: [],
        }
    `))).toBe(new MockModel(new Float32Array()));
})

test("deserialise malformed input tensor", async() => {
    expect(des(JSON.stringify(`
        {
            title: mock,
            inputTensor: [1,2,abc,3],
        }
    `))).toThrowError()
})
