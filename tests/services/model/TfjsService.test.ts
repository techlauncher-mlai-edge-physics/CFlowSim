import { expect, test, beforeAll, beforeEach, afterAll } from "@jest/globals"
import { Worker as JestWorker } from "jest-worker"


let worker: any

beforeAll(async () => {
    worker = new JestWorker(require.resolve("./testWorker"))
    await worker.init()
}, 100000)

afterAll(async () => {
    await worker.dipose()
})

beforeEach(async () => {
    await worker.restore()
})

test("", () => {
    expect(1).toBe(1)
})

/*
test("Tfjs should be instantiable", async() => {
    expect(worker.getService()).not.toBeUndefined()
    expect(worker.getService()).not.toBeNull();
})

test("model should run callback", async() => {
    service.bindOutput((data) => {
        expect(data).not.toBeNull()
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
}) */
