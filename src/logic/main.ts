import { createTicker } from '@hydraengine/core'
import { expose } from 'comlink'

const ticker = createTicker({
  onTick: (deltaTime) => { }
})

export function setTickerFixedFps(fps: number | undefined) {
  ticker.setFixedFps(fps)
}

export type WorkerAPI = typeof import('./main')
expose({ setTickerFixedFps })
