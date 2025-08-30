import { createTicker } from '@hydraengine/core'
import { createWebWorkerRenderer } from '@hydraengine/rendering'
import { expose } from 'comlink'

const ticker = createTicker({
  onTick: (deltaTime) => { }
})

export function setTickerFixedFps(fps: number | undefined) {
  ticker.setFixedFps(fps)
}

export async function createRenderer(offscreenCanvas: OffscreenCanvas) {
  const pixiRenderer = await createWebWorkerRenderer({
    canvas: offscreenCanvas,
  })
}

export type WorkerAPI = typeof import('./main')
expose({ setTickerFixedFps, createRenderer })
