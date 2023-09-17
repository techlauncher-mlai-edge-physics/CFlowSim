import {
    modelSerialize as ser,
    modelDeserialize as des,
    type ModelService
} from "../../../src/services/model/modelService"

import { type Vector2 } from 'three';
import { expect, test } from "@jest/globals"

// define a mock model
class MockModelService implements ModelService
{
    inputTensor: Float32Array
    mass: number;
    shape: [number,number,number,number]

    constructor (it: Float32Array = new Float32Array(), m: number = 5, shape: [number,number,number,number] = [0,0,0,0]) {
        this.inputTensor = it
        this.mass = m
        this.shape = shape;
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

    loadDataArray(input: number[][][][]): void {
        this.inputTensor = new Float32Array(input.flat(3))
    }
    
    getMass(): number {
        return this.mass
    }

    getInputShape(): [number, number, number, number] {
        return this.shape
    }

    setMass(_: number): void {
    }

    getType(): string { return "mock" }
}

function buildRandomTensor(shape: [number,number,number,number]): number[][][][]{
    const [d1,d2,d3,d4] = shape
    const shapedTensor: number[][][][] = []

    for (let i = 0; i < d1; i++) {
        const arr3d: number[][][] = []
        for (let j = 0; j < d2; j++) {
            const arr2d: number[][] = []
            for (let k = 0; k < d3; k++) {
                const arr1d: number[] = []
                for (let l = 0; l < d4; l++) {
                    arr1d.push(Math.random())
                }
                arr2d.push(arr1d)
            }
            arr3d.push(arr2d)
        }
        shapedTensor.push(arr3d)
    }
    return shapedTensor;
}

function assertTensorsCloseTo(
    actual:number[][][][],
    expected:number[][][][],
    shape:[number,number,number,number]
): void {
    for (let x = 0; x < shape[0]; x++) {
        for (let y = 0; y < shape[1]; y++) {
            for (let z = 0; z < shape[2]; z++) {
                for (let w = 0; w < shape[3]; w++) {
                    expect(actual[x][y][z][w])
                        .toBeCloseTo(expected[x][y][z][w])
                }
            }
        }
    }
}


// serialise tests

test("serialise valid model", async() => {
    const shape = [5,3,4,2] as [number,number,number,number]
    const shapedTensor: number[][][][] = buildRandomTensor(shape)
    const tensor = shapedTensor.flat(3)
    const mass = 4;
    const url = "mockurl";

    const model = new MockModelService(new Float32Array(tensor), mass, shape);
    const output = ser(url, model)

    expect(output).toBeTruthy()
    expect(output!.modelType).toBe("mock")
    expect(output!.modelUrl).toBe(url)
    expect(output!.mass).toBe(mass)
    assertTensorsCloseTo(output!.inputTensor, shapedTensor, shape)
})

// deserialise tests

async function mockModelFactory(
  _a: string,
  _b: [number, number] = [64, 64],
  _c: number,
  _d: number,
  _e: number,
  _f: number,
): Promise<ModelService> {
    return Promise.resolve(new MockModelService()) // eslint-disable-line
}

test("deserialise valid model", async() => {
    const shape = [5,3,4,2] as [number,number,number,number]
    const shapedTensor: number[][][][] = buildRandomTensor(shape)

    const save = {
        inputTensor: shapedTensor,
        mass: 8,
        modelType: "onnx",
        modelUrl: "/model/bno_small_001.onnx",
        time: new Date().toISOString()
    }

    const ms = await des(save, mockModelFactory)

    const actual = ms.getInputTensor()
    const expected = shapedTensor.flat(3)
    expect(actual.length).toBe(expected.length)
    for (let i = 0; i < actual.length; i++)
        expect(actual[i]).toBeCloseTo(expected[i])
})
