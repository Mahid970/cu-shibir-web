/**
 * The "living campus" 3D scene (plan §5.1), in plain three.js so the chunk stays small.
 *
 * Everything is generated in code — no model files: hills from layered noise around a valley,
 * the shuttle line winding in from the city side to the university station, a cluster of campus
 * buildings, a road through a cut hill (কাটা পাহাড়), forest on the slopes, lamps and stars at night.
 * It is an illustration of the campus, not a map.
 */
import {
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'

import type { Palette } from '@/lib/skyPalettes'

export type Tier = 1 | 2
export type LabelId = 'train' | 'station' | 'cut' | 'halls'
export type SceneHandle = {
  setPalette: (p: Palette) => void
  setRunning: (on: boolean) => void
  setPointer: (x: number, y: number) => void
  resize: () => void
  dispose: () => void
}

// ---------------------------------------------------------------------------
// Deterministic noise
// ---------------------------------------------------------------------------

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
function valueNoise(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
function fbm(x: number, y: number) {
  let sum = 0
  let amp = 0.5
  let f = 1
  for (let o = 0; o < 5; o++) {
    sum += amp * valueNoise(x * f, y * f)
    f *= 2.03
    amp *= 0.5
  }
  return sum
}
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// ---------------------------------------------------------------------------
// Layout: the rail comes in from the south-west (city side) and ends at the station.
// ---------------------------------------------------------------------------

const RAIL_POINTS: [number, number][] = [
  [-118, 70],
  [-92, 52],
  [-70, 44],
  [-52, 30],
  [-40, 12],
  [-22, 4],
  [-4, 8],
  [10, 4],
]
const STATION = new Vector3(10, 0, 4)
const CAMPUS = { x: 26, z: -6 } // centre of the building cluster
const ROAD: [number, number][] = [
  [10, 4],
  [22, -2],
  [34, -14],
  [44, -30],
  [52, -52],
]
const CUT = { x: 44, z: -30 } // the road slices through this hill

function distToPolyline(x: number, z: number, pts: [number, number][]) {
  let best = Infinity
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i]
    const [bx, bz] = pts[i + 1]
    const dx = bx - ax
    const dz = bz - az
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)))
    const px = ax + t * dx - x
    const pz = az + t * dz - z
    best = Math.min(best, Math.hypot(px, pz))
  }
  return best
}

/** Terrain height: forested hills everywhere except the rail corridor and the campus valley. */
function heightAt(x: number, z: number) {
  const dRail = distToPolyline(x, z, RAIL_POINTS)
  const dCampus = Math.hypot((x - CAMPUS.x) * 0.8, z - CAMPUS.z)
  const dRoad = distToPolyline(x, z, ROAD)
  const open = Math.min(smooth(5, 26, dRail), smooth(14, 38, dCampus))
  const hills = 26 * open * (0.35 + fbm(x * 0.022 + 3.1, z * 0.022 - 1.7))
  const ripple = 1.2 * fbm(x * 0.09, z * 0.09)
  // Keep a flat bed under the road, but let the hills rise steeply on both sides: the cut.
  const roadBed = smooth(2.5, 9, dRoad)
  const cutHill = 9 * Math.exp(-((x - CUT.x) ** 2 + (z - CUT.z) ** 2) / 140)
  return (hills + ripple + cutHill) * roadBed + ripple * 0.3 * (1 - roadBed)
}

// ---------------------------------------------------------------------------

export function createCampusScene(
  canvas: HTMLCanvasElement,
  opts: { tier: Tier; palette: Palette; labels: Partial<Record<LabelId, HTMLElement>> },
): SceneHandle {
  const { tier } = opts
  const renderer = new WebGLRenderer({ canvas, antialias: tier === 2, alpha: false, powerPreference: tier === 2 ? 'high-performance' : 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier === 2 ? 1.75 : 1.25))

  const scene = new Scene()
  const camera = new PerspectiveCamera(34, 1, 1, 1200)
  const lookAt = new Vector3(10, 0, -34)

  // Sky dome with a vertical gradient
  const skyUniforms = { top: { value: new Color() }, bottom: { value: new Color() } }
  const sky = new Mesh(
    new SphereGeometry(500, 24, 12),
    new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      uniforms: skyUniforms,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader:
        'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h = pow(clamp(vP.y*1.6+0.05,0.0,1.0),0.7); gl_FragColor = vec4(mix(bottom, top, h), 1.0); }',
    }),
  )
  scene.add(sky)
  scene.fog = new Fog(0xffffff, 150, 420)

  // Stars
  const starCount = tier === 2 ? 900 : 450
  const starPos = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    const u = hash(i, 1.3) * Math.PI * 2
    const v = 0.08 + hash(i, 7.7) * 0.9
    starPos.set([Math.cos(u) * Math.cos(v) * 420, Math.sin(v) * 420, Math.sin(u) * Math.cos(v) * 420], i * 3)
  }
  const starGeo = new BufferGeometry()
  starGeo.setAttribute('position', new BufferAttribute(starPos, 3))
  const starMat = new PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, fog: false })
  scene.add(new Points(starGeo, starMat))

  // Lights
  const hemi = new HemisphereLight(0xffffff, 0x224422, 0.6)
  const sun = new DirectionalLight(0xffffff, 1)
  scene.add(hemi, sun)

  // Terrain
  const seg = tier === 2 ? [200, 150] : [128, 96]
  const terrainGeo = new PlaneGeometry(460, 340, seg[0], seg[1])
  terrainGeo.rotateX(-Math.PI / 2)
  const pos = terrainGeo.attributes.position as BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const low = new Color('#8fc27a')
  const mid = new Color('#3f8f4f')
  const high = new Color('#1f5f38')
  const bare = new Color('#b9a27a')
  const tmp = new Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const h = heightAt(x, z)
    pos.setY(i, h)
    const t = Math.min(1, h / 24)
    tmp.copy(low).lerp(mid, smooth(0.05, 0.45, t)).lerp(high, smooth(0.45, 1, t))
    if (distToPolyline(x, z, ROAD) < 3.2 || distToPolyline(x, z, RAIL_POINTS) < 2.6) tmp.lerp(bare, 0.75)
    tmp.offsetHSL(0, 0, (hash(x, z) - 0.5) * 0.05)
    colors.set([tmp.r, tmp.g, tmp.b], i * 3)
  }
  terrainGeo.setAttribute('color', new BufferAttribute(colors, 3))
  terrainGeo.computeVertexNormals()
  const terrain = new Mesh(terrainGeo, new MeshLambertMaterial({ vertexColors: true, flatShading: true }))
  scene.add(terrain)

  // Forest
  const treeCount = tier === 2 ? 2600 : 1100
  const trees = new InstancedMesh(new ConeGeometry(0.7, 2.4, 5), new MeshLambertMaterial({ flatShading: true }), treeCount)
  const m = new Matrix4()
  const q = new Quaternion()
  const s = new Vector3()
  const p = new Vector3()
  const treeColor = new Color()
  let placed = 0
  for (let k = 0; placed < treeCount && k < treeCount * 8; k++) {
    const x = (hash(k, 3.3) - 0.5) * 300
    const z = (hash(k, 9.1) - 0.5) * 220
    const h = heightAt(x, z)
    if (h < 2.5 || distToPolyline(x, z, ROAD) < 5 || distToPolyline(x, z, RAIL_POINTS) < 6 || Math.hypot(x - CAMPUS.x, z - CAMPUS.z) < 22) continue
    const size = 0.55 + hash(k, 5.5) * 0.7
    p.set(x, h + size * 1.2, z)
    s.set(size, size * (1 + hash(k, 2.2) * 0.6), size)
    m.compose(p, q, s)
    trees.setMatrixAt(placed, m)
    trees.setColorAt(placed, treeColor.setHSL(0.3 + hash(k, 4.4) * 0.07, 0.45, 0.2 + hash(k, 6.6) * 0.12))
    placed++
  }
  trees.count = placed
  scene.add(trees)

  // Campus buildings (halls are long blocks, the library a wide one)
  const buildingMat = new MeshLambertMaterial({ color: '#f1ece2', emissive: new Color('#ffb85c'), emissiveIntensity: 0 })
  const roofMat = new MeshLambertMaterial({ color: '#b64b3b' })
  const buildings = new Group()
  const blocks: [number, number, number, number, number, number][] = [
    // x, z, w, d, h, rotation
    [18, -4, 9, 5, 4, 0.2],
    [30, -2, 12, 4, 5, -0.1],
    [26, -12, 6, 6, 7, 0],
    [36, -10, 10, 4, 4, 0.5],
    [14, -14, 8, 4, 4, -0.3],
    [40, 2, 7, 4, 3.5, 0.1],
    [22, 6, 5, 3, 3, 0.4],
    [32, 8, 9, 3.5, 4, -0.2],
    [8, -6, 6, 3, 3, 0.6],
  ]
  for (const [x, z, w, d, h, r] of blocks) {
    const y = heightAt(x, z)
    const body = new Mesh(new BoxGeometry(w, h, d), buildingMat)
    body.position.set(x, y + h / 2, z)
    body.rotation.y = r
    const roof = new Mesh(new BoxGeometry(w + 0.6, 0.5, d + 0.6), roofMat)
    roof.position.set(x, y + h + 0.25, z)
    roof.rotation.y = r
    buildings.add(body, roof)
  }
  scene.add(buildings)

  // Rail line
  const railCurve = new CatmullRomCurve3(RAIL_POINTS.map(([x, z]) => new Vector3(x, heightAt(x, z) + 0.35, z)))
  const railLen = railCurve.getLength()
  const sleeperCount = Math.floor(railLen / 1.2)
  const sleepers = new InstancedMesh(new BoxGeometry(2.4, 0.15, 0.45), new MeshLambertMaterial({ color: '#5b4636' }), sleeperCount)
  const up = new Vector3(0, 1, 0)
  const tangent = new Vector3()
  const dummy = new Object3D()
  for (let i = 0; i < sleeperCount; i++) {
    const u = i / sleeperCount
    railCurve.getPointAt(u, dummy.position)
    railCurve.getTangentAt(u, tangent)
    dummy.lookAt(dummy.position.clone().add(tangent))
    dummy.updateMatrix()
    sleepers.setMatrixAt(i, dummy.matrix)
  }
  scene.add(sleepers)
  const railMat = new LineBasicMaterial({ color: '#9aa5b1' })
  for (const off of [-0.7, 0.7]) {
    const pts: Vector3[] = []
    for (let i = 0; i <= 200; i++) {
      const u = i / 200
      const pt = railCurve.getPointAt(u)
      railCurve.getTangentAt(u, tangent)
      const side = new Vector3().crossVectors(tangent, up).normalize().multiplyScalar(off)
      pts.push(pt.add(side).setY(pt.y + 0.12))
    }
    scene.add(new Line(new BufferGeometry().setFromPoints(pts), railMat))
  }
  STATION.y = heightAt(STATION.x, STATION.z)
  const platform = new Mesh(new BoxGeometry(12, 0.6, 3), new MeshLambertMaterial({ color: '#cbd5e1' }))
  platform.position.set(STATION.x - 4, STATION.y + 0.3, STATION.z + 3)
  platform.rotation.y = -0.25
  scene.add(platform)

  // The shuttle: engine + four carriages
  const train = new Group()
  const carMat = new MeshLambertMaterial({ color: '#1e3a8a' })
  const engineMat = new MeshLambertMaterial({ color: '#b91c1c' })
  const stripeMat = new MeshLambertMaterial({ color: '#fbc900' })
  const windowMat = new MeshBasicMaterial({ color: '#1f2937' })
  const cars: Group[] = []
  for (let i = 0; i < 5; i++) {
    const car = new Group()
    const body = new Mesh(new BoxGeometry(1.5, 1.3, 3.4), i === 0 ? engineMat : carMat)
    body.position.y = 0.95
    const stripe = new Mesh(new BoxGeometry(1.52, 0.18, 3.42), stripeMat)
    stripe.position.y = 0.55
    const windows = new Mesh(new BoxGeometry(1.54, 0.35, 2.6), windowMat)
    windows.position.y = 1.15
    car.add(body, stripe, windows)
    cars.push(car)
    train.add(car)
  }
  scene.add(train)
  const headlight = new Mesh(new SphereGeometry(0.28, 8, 6), new MeshBasicMaterial({ color: '#fff4c2', transparent: true, opacity: 0 }))
  scene.add(headlight)

  // Lamps: along the campus roads, the platform and the station approach
  const lampPts: number[] = []
  for (let i = 0; i < 70; i++) {
    const a = hash(i, 11) * Math.PI * 2
    const r = 4 + hash(i, 12) * 20
    const x = CAMPUS.x + Math.cos(a) * r
    const z = CAMPUS.z + Math.sin(a) * r * 0.8
    lampPts.push(x, heightAt(x, z) + 1.6, z)
  }
  for (let i = 0; i <= 12; i++) {
    const t = i / 12
    const x = ROAD[0][0] + (ROAD[3][0] - ROAD[0][0]) * t + 3
    const z = ROAD[0][1] + (ROAD[3][1] - ROAD[0][1]) * t
    lampPts.push(x, heightAt(x, z) + 1.8, z)
  }
  const lampGeo = new BufferGeometry()
  lampGeo.setAttribute('position', new BufferAttribute(new Float32Array(lampPts), 3))
  const lampMat = new PointsMaterial({ color: '#ffd27a', size: tier === 2 ? 5 : 4, sizeAttenuation: false, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false })
  scene.add(new Points(lampGeo, lampMat))

  // ---------------------------------------------------------------------------
  // Palette
  // ---------------------------------------------------------------------------
  let lamps = 0
  const setPalette = (pal: Palette) => {
    skyUniforms.top.value.set(pal.top)
    skyUniforms.bottom.value.set(pal.bottom)
    ;(scene.fog as Fog).color.set(pal.bottom)
    hemi.color.set(pal.top).lerp(new Color('#ffffff'), 0.5)
    hemi.groundColor.set(pal.hillNear)
    hemi.intensity = 0.5 + pal.light * 0.5
    sun.color.set(pal.sun)
    sun.intensity = 0.25 + pal.light * 1.3
    const elev = (Math.max(pal.sunHeight, -0.2) * 55 + 12) * (Math.PI / 180)
    sun.position.set(-Math.cos(elev) * 120, Math.sin(elev) * 120 + 10, -60)
    starMat.opacity = pal.stars * 0.9
    lampMat.opacity = pal.lamps
    buildingMat.emissiveIntensity = pal.lamps * 0.35
    windowMat.color.set(pal.lamps > 0.3 ? '#fde68a' : '#1f2937')
    headlight.material.opacity = Math.max(0.25, pal.lamps)
    lamps = pal.lamps
  }
  setPalette(opts.palette)

  // ---------------------------------------------------------------------------
  // Loop
  // ---------------------------------------------------------------------------
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  let running = false
  let raf = 0
  let last = 0
  const start = performance.now()
  const frameGap = tier === 2 ? 0 : 1000 / 30
  const labelPos = {
    station: STATION.clone().setY(STATION.y + 5),
    cut: new Vector3(CUT.x, heightAt(CUT.x, CUT.z) + 8, CUT.z),
    halls: new Vector3(CAMPUS.x + 8, heightAt(CAMPUS.x, CAMPUS.z) + 9, CAMPUS.z + 6),
    train: new Vector3(),
  }
  const projected = new Vector3()

  const placeLabels = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    for (const id of Object.keys(opts.labels) as LabelId[]) {
      const el = opts.labels[id]
      if (!el) continue
      projected.copy(labelPos[id]).project(camera)
      const visible = projected.z < 1 && Math.abs(projected.x) < 1.05 && Math.abs(projected.y) < 1.05
      el.style.opacity = visible ? '1' : '0'
      el.style.transform = `translate(${((projected.x + 1) / 2) * w}px, ${((1 - projected.y) / 2) * h}px) translate(-50%, -100%)`
    }
  }

  // Train timing: 36 s in from the city, 8 s at the station, 36 s back out, 6 s off-screen.
  const trainT = (sec: number) => {
    const cycle = sec % 86
    if (cycle < 36) return smooth(0, 1, cycle / 36) * 0.98
    if (cycle < 44) return 0.98
    if (cycle < 80) return (1 - smooth(0, 1, (cycle - 44) / 36)) * 0.98
    return 0
  }

  const place = new Vector3()
  const ahead = new Vector3()
  const draw = (now: number) => {
    const sec = (now - start) / 1000

    // Camera: a slow drift plus a little parallax from the pointer
    pointer.sx += (pointer.x - pointer.sx) * 0.05
    pointer.sy += (pointer.y - pointer.sy) * 0.05
    const angle = -0.3 + Math.sin(sec * 0.05) * 0.12 + pointer.sx * 0.08
    const radius = camera.aspect < 1 ? 150 : 118
    camera.position.set(8 + Math.sin(angle) * radius, (camera.aspect < 1 ? 150 : 108) + pointer.sy * 8, Math.cos(angle) * radius)
    camera.lookAt(lookAt)

    // Train along the rail, cars following the engine
    const head = trainT(sec)
    const spacing = 3.7 / railLen
    cars.forEach((car, i) => {
      const u = Math.max(0.0001, head - i * spacing)
      railCurve.getPointAt(u, place)
      railCurve.getPointAt(Math.min(0.9999, u + 0.002), ahead)
      car.position.copy(place)
      car.lookAt(ahead)
    })
    headlight.position.copy(cars[0].position).add(ahead.sub(cars[0].position).normalize().multiplyScalar(1.8)).setY(cars[0].position.y + 1)
    labelPos.train.copy(cars[1].position).setY(cars[1].position.y + 4)
    ;(lampMat as PointsMaterial).opacity = lamps * (0.85 + Math.sin(sec * 3) * 0.05)

    renderer.render(scene, camera)
    placeLabels()
  }

  const loop = (now: number) => {
    if (!running) return
    raf = requestAnimationFrame(loop)
    if (frameGap && now - last < frameGap) return
    last = now
    draw(now)
  }

  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // Paused: redraw once so the resized canvas is never blank.
    if (!running) draw(performance.now())
  }
  resize()

  return {
    setPalette,
    setPointer: (x, y) => {
      pointer.x = x
      pointer.y = y
    },
    setRunning: (on) => {
      if (on === running) return
      running = on
      if (on) raf = requestAnimationFrame(loop)
      else cancelAnimationFrame(raf)
    },
    resize,
    dispose: () => {
      running = false
      cancelAnimationFrame(raf)
      scene.traverse((o) => {
        const mesh = o as Mesh
        mesh.geometry?.dispose()
        const mat = mesh.material
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose()
      })
      renderer.dispose()
    },
  }
}
