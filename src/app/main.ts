import { createTicker, SABTree } from '@hydraengine/core'
import { transfer, wrap } from 'comlink'
import Stats from 'stats.js'
import './main.css'

const BACKGROUND_FPS = 6

const capacity = 1_000_000
const sab = new SABTree(new SharedArrayBuffer(SABTree.bytesRequired(capacity)), capacity)
console.log(sab)

const canvas = document.createElement('canvas')
const offscreenCanvas = canvas.transferControlToOffscreen()
document.body.appendChild(canvas)

const stats = new Stats()
stats.dom.style.position = 'absolute'
stats.showPanel(0)
document.body.appendChild(stats.dom)

const ticker = createTicker({
  onTick: (deltaTime) => {
    stats.update()
  }
})

const logicWorker = new Worker(new URL('../logic/main', import.meta.url), { type: 'module' })
const logicApi = wrap<import('../logic/main').WorkerAPI>(logicWorker)

const physicsWorker = new Worker(new URL('../physics/main', import.meta.url), { type: 'module' })
const physicsApi = wrap<import('../physics/main').WorkerAPI>(physicsWorker)

const renderingWorker = new Worker(new URL('../rendering/main', import.meta.url), { type: 'module' })
const renderingApi = wrap<import('../rendering/main').WorkerAPI>(renderingWorker)
renderingApi.createRenderer(transfer(offscreenCanvas, [offscreenCanvas]))

function setTickerFixedFps(fps: number | undefined) {
  ticker.setFixedFps(fps)
  logicApi.setTickerFixedFps(fps)
  physicsApi.setTickerFixedFps(fps)
  renderingApi.setTickerFixedFps(fps)
}

if (!document.hasFocus()) setTickerFixedFps(BACKGROUND_FPS)
window.addEventListener('blur', () => setTickerFixedFps(BACKGROUND_FPS))
window.addEventListener('focus', () => setTickerFixedFps(undefined))
window.addEventListener('pageshow', (event) => { if (event.persisted) setTickerFixedFps(undefined) })
