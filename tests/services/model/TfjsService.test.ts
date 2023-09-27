import TfjsService from "../../../src/services/model/TfjsService"
import { test, expect, beforeAll, beforeEach } from "@jest/globals"

let service: TfjsService
let initCond: number[][][][]

beforeAll(async () => {
    service = await TfjsService.createService("https://github.com/techlauncher-mlai-edge-physics/CFlowSim/raw/main/public/model/bno_small_new_web/model.json")
    const resp = await fetch("https://github.com/techlauncher-mlai-edge-physics/CFlowSim/raw/main/public/initData/pvf_incomp_44_nonneg/pvf_incomp_44_nonneg_0.json")
    initCond = await resp.json()
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
