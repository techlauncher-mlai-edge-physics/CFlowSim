import { modelSerialize as ser, modelDeserialize as des } from "../../../src/workers/modelWorker"
import { ModelService } from "../../../src/services/model/modelService"
import { type Vector2 } from 'three';
import { expect, test } from "@jest/globals"

// define a mock model
class MockModelService implements ModelService
{
    private inputTensor: Float32Array;

    constructor (inputTensor: Float32Array) {
        this.inputTensor = inputTensor;
    }

    updateForce(_: Vector2, __: Vector2): void {
    }

    startSimulation (): void {
    }

    pauseSimulation(): void {

    }

    bindOutput (_: (data: Float32Array) => void): void {
    }

    getInputTensor(): Float32Array {
        return this.inputTensor;
    }

    loadDataArray(_: number[][][][])
    {}
}

// serialise tests

test("serialise empty input tensor", async() => {
    expect(ser(new MockModelService(new Float32Array())))
        .toBe(JSON.stringify(`

        `))
})

test("serialise valid model", async() => {
    let model = new MockModelService(new Float32Array([1,2,3,4,5.5,6.6]));
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
    `))).toBe(new MockModelService(new Float32Array()));
})

test("deserialise malformed input tensor", async() => {
    expect(des(JSON.stringify(`
        {
            title: mock,
            inputTensor: [1,2,abc,3],
        }
    `))).toThrowError()
})
