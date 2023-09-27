import ONNXService from "../../../src/services/model/ONNXService"
import { test, expect, beforeAll, beforeEach } from "@jest/globals"

let service: ONNXService
let initCond: number[][][][]

beforeAll(async () => {
    // TODO
}, 100000)

beforeEach(() => {
    service.loadDataArray(initCond)
})

test("Tfjs should be instantiable", async() => {
    expect(service).not.toBeUndefined()
    expect(service).not.toBeNull();
})

test("model should run callback", async() => {
    service.bindOutput((data) => {
        expect(data)
    })
    service.startSimulation()
    service.pauseSimulation()
})

test("model should conserve mass", async() => {
    const m1 = service.getMass()
    service.startSimulation()
    service.pauseSimulation()
    const m2 = service.getMass()
    expect(m1).toBeCloseTo(m2, 1)
})
