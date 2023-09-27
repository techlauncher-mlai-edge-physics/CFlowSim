import TfjsService from "../../../src/services/model/TfjsService"

let service: TfjsService
let initCond: number[][][][]

export async function init(): Promise<void> {
    service = await TfjsService.createService("https://github.com/techlauncher-mlai-edge-physics/CFlowSim/raw/main/public/model/bno_small_new_web/model.json")
    const resp = await fetch("https://github.com/techlauncher-mlai-edge-physics/CFlowSim/raw/main/public/initData/pvf_incomp_44_nonneg/pvf_incomp_44_nonneg_0.json")
    initCond = await resp.json()
    restore()
}

export function dispose(): void {
    service.dispose()
}

export function restore(): void {
    service.loadDataArray(initCond)
}
