import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, ChevronDown, Github, Linkedin, Mail, Pause, Play } from 'lucide-react'
import { experience, projects } from './data'

function useCanvas(draw: (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => void) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let frame = 0
    const render = (time: number) => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const rect = canvas.getBoundingClientRect()
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr; canvas.height = rect.height * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, rect.width, rect.height, time)
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)
    return () => cancelAnimationFrame(frame)
  }, [draw])
  return ref
}

function HeroOrganism() {
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    ctx.clearRect(0, 0, w, h); const cx = w * .52; const cy = h * .5; const t = time / 1000
    for (let i = 0; i < 90; i++) {
      const a = i * 2.399 + Math.sin(t * .2 + i) * .13
      const r = Math.min(w, h) * (.08 + (i % 13) / 19) * (1 + Math.sin(t * .7 + i) * .06)
      const x = cx + Math.cos(a + t * .04) * r * 1.08; const y = cy + Math.sin(a + t * .04) * r * .66
      const nx = cx + Math.cos(a + .45 + t * .04) * r * 1.08; const ny = cy + Math.sin(a + .45 + t * .04) * r * .66
      ctx.strokeStyle = `rgba(97,228,222,${.08 + (i % 7) / 36})`; ctx.lineWidth = i % 9 === 0 ? 1 : .45
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke()
      ctx.fillStyle = i % 5 === 0 ? '#f3f8fc' : '#58bfff'; ctx.globalAlpha = .4 + (i % 4) / 8
      ctx.beginPath(); ctx.arc(x, y, i % 5 === 0 ? 2.2 : 1, 0, Math.PI * 2); ctx.fill()
    }
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * .42)
    glow.addColorStop(0, 'rgba(88,191,255,.12)'); glow.addColorStop(1, 'rgba(8,13,18,0)')
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h)
  }
  const ref = useCanvas(draw)
  return <canvas ref={ref} className="organism" aria-label="Procedurally generated network illustration" />
}

function PopulationCanvas({ paused, density, motion, interaction }: { paused: boolean; density: number; motion: number; interaction: number }) {
  const grid = useRef<{ a: number[]; b: number[]; historyA: number[]; historyB: number[] } | null>(null)
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    const cols = 56; const rows = 34; const size = cols * rows
    if (!grid.current) {
      const a = Array.from({ length: size }, (_, i) => .24 + (i % cols < cols / 2 ? .18 : 0) + Math.random() * .05)
      const b = Array.from({ length: size }, (_, i) => .2 + (i % cols >= cols / 2 ? .2 : 0) + Math.random() * .05)
      grid.current = { a, b, historyA: [], historyB: [] }
    }
    const state = grid.current
    if (!paused) {
      const nextA = [...state.a]; const nextB = [...state.b]
      const growthA = .9 + density / 180; const growthB = 1.05
      const diffusion = .04 + motion * .025; const competition = .7 + interaction / 70
      for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
        const i = y * cols + x
        const lapA = state.a[i - 1] + state.a[i + 1] + state.a[i - cols] + state.a[i + cols] - 4 * state.a[i]
        const lapB = state.b[i - 1] + state.b[i + 1] + state.b[i - cols] + state.b[i + cols] - 4 * state.b[i]
        nextA[i] = Math.max(0, Math.min(1, state.a[i] + .035 * (growthA * state.a[i] * (1 - state.a[i]) - competition * state.a[i] * state.b[i] + diffusion * lapA)))
        nextB[i] = Math.max(0, Math.min(1, state.b[i] + .035 * (growthB * state.b[i] * (1 - state.b[i]) - competition * .9 * state.a[i] * state.b[i] + diffusion * lapB)))
      }
      state.a = nextA; state.b = nextB
      state.historyA.push(state.a.reduce((sum, value) => sum + value, 0) / size)
      state.historyB.push(state.b.reduce((sum, value) => sum + value, 0) / size)
      if (state.historyA.length > 180) { state.historyA.shift(); state.historyB.shift() }
    }
    ctx.fillStyle = '#0d161e'; ctx.fillRect(0, 0, w, h)
    const cellW = w / cols; const cellH = h / rows
    const noise = (seed: number) => {
      const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
      return value - Math.floor(value)
    }
    const glow = (x: number, y: number, radius: number, color: string) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.8)
      gradient.addColorStop(0, color.replace('1)', '.22)')); gradient.addColorStop(1, color.replace('1)', '0)'))
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, radius * 2.8, 0, Math.PI * 2); ctx.fill()
    }
    for (let y = 1; y < rows - 1; y++) for (let x = 1; x < cols - 1; x++) {
      const i = y * cols + x; const a = state.a[i]; const b = state.b[i]
      if (a > .08) {
          const px = (x + noise(i + 1)) * cellW; const py = (y + noise(i + 2)) * cellH; const radius = .8 + a * (2.5 + noise(i + 3) * 2)
        glow(px, py, radius, 'rgba(88,191,255,1)')
        ctx.fillStyle = `rgba(88,191,255,${.35 + a * .65})`; ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2); ctx.fill()
      }
      if (b > .08) {
          const px = (x + noise(i + 4)) * cellW; const py = (y + noise(i + 5)) * cellH; const radius = .8 + b * (2.5 + noise(i + 6) * 2)
        glow(px, py, radius, 'rgba(111,245,132,1)')
        ctx.fillStyle = `rgba(111,245,132,${.35 + b * .65})`; ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2); ctx.fill()
      }
    }
    ctx.strokeStyle = 'rgba(243,248,252,.5)'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(14, 18); ctx.lineTo(14, 10); ctx.lineTo(22, 10); ctx.stroke()
    ctx.fillStyle = '#f3f8fc'; ctx.font = "10px 'DM Mono'"; ctx.fillText('A / BLUE', 27, 14)
    ctx.fillStyle = '#6ff584'; ctx.fillText('B / GREEN', 88, 14)
    ctx.fillStyle = 'rgba(8,13,18,.72)'; ctx.fillRect(w - 132, h - 54, 122, 44)
    ctx.strokeStyle = '#58bfff'; ctx.beginPath()
    state.historyA.forEach((value, i) => { const x = w - 125 + i * 110 / 180; const y = h - 12 - value * 32; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }); ctx.stroke()
    ctx.strokeStyle = '#6ff584'; ctx.beginPath()
    state.historyB.forEach((value, i) => { const x = w - 125 + i * 110 / 180; const y = h - 12 - value * 32; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }); ctx.stroke()
  }
  return <canvas ref={useCanvas(draw)} className="lab-canvas" aria-label="Reaction-diffusion simulation of two competing cell populations" />
}

function SignalCanvas({ frequency }: { frequency: number }) {
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    ctx.fillStyle = '#0d161e'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = 'rgba(133,152,168,.14)'; ctx.lineWidth = 1
    for (let x = 0; x < w; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
    for (let y = 24; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
    ctx.strokeStyle = '#61e4de'; ctx.lineWidth = 2; ctx.beginPath()
    for (let x = 0; x <= w; x++) { const y = h / 2 + Math.sin(x * frequency / 18 + time / 700) * h * .18 + Math.sin(x * .08 + time / 500) * h * .07; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y) } ctx.stroke()
  }
  return <canvas ref={useCanvas(draw)} className="lab-canvas" aria-label="Illustrative neural signal visualization" />
}

function App() {
  const [openProject, setOpenProject] = useState<string | null>(null)
  const [openExperience, setOpenExperience] = useState<string | null>(null)
  const [density, setDensity] = useState(55); const [motion, setMotion] = useState(1); const [interaction, setInteraction] = useState(28)
  const [frequency, setFrequency] = useState(8); const [paused, setPaused] = useState(false)
  return <div className="site-shell">
    <header className="topbar"><a className="logo" href="#top">Calvin (Xiang) Chen</a><nav>{['INDEX', 'PROJECTS', 'EXPERIENCE', 'LAB', 'CONTACT'].map((item) => <a key={item} href={item === 'INDEX' ? '#top' : `#${item.toLowerCase()}`}>{item}</a>)}</nav><span className="status" aria-label="Available for selected work"><a href="https://linkedin.com/in/chencx" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn"><Linkedin size={15} /></a><a href="https://github.com/CalvinOK" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub"><Github size={15} /></a><a href="mailto:calvinchenxc@gmail.com" aria-label="Email" title="Email"><Mail size={15} /></a></span></header>
    <main id="top">
      <section className="hero section-pad"><div className="hero-copy"><p className="eyebrow">ARCHIVE OF EXPERIMENTS <span>↗ 42° 16′ N / 83° 44′ W</span></p><h1>CALVIN<br /><em>CHEN</em></h1><p className="tagline">Exploring systems,<br />from molecules to markets.</p><div className="hero-meta"><span>UMICH / CS + MATH</span><span>RESEARCH / ENGINEERING / COMPUTATION</span><span>PORTFOLIO — 2026</span></div></div><div className="hero-visual"><HeroOrganism /><span className="annotation a1">COMPUTER SCIENTIST AND MATHEMATICIAN<br />BUILDING SYSTEMS ACROSS SCIENCE, MARKETS</span><span className="annotation a2">[ x: 0.42 / y: 0.78 ]</span><span className="annotation a3">NETWORK DENSITY: VARIABLE</span></div><a className="scroll-cue" href="#projects">SCROLL TO EXPLORE <ArrowDownRight size={16} /></a></section>
      <section id="projects" className="archive section-pad"><div className="section-head"><div><p className="eyebrow">01 / SELECTED WORK</p><h2><span>Projects</span></h2></div></div><div className="project-list">{projects.map((project) => <article className="project-row" key={project.id}><button onClick={() => setOpenProject(openProject === project.id ? null : project.id)} aria-expanded={openProject === project.id}><span className="project-id">{project.id}</span><span className="project-title">{project.title}<small>{project.category} · {project.date}</small></span><span className="project-tools">{project.tools}</span><ChevronDown className={openProject === project.id ? 'rotate' : ''} size={19} /></button>{openProject === project.id && <div className="project-detail"><p>{project.detail}</p><span className="detail-label">METHOD / OUTCOME</span></div>}</article>)}</div></section>
      <section id="experience" className="timeline section-pad"><div className="section-head"><div><p className="eyebrow">02 / EXPERIENCE</p><h2><span>Experience</span></h2></div></div><div className="timeline-list">{experience.map(([number, org, role, date, detail]) => <div className="timeline-item" key={org}><span className="timeline-num">{number}</span><button onClick={() => setOpenExperience(openExperience === org ? null : org)}><span><strong>{org}</strong><small>{role}</small></span><span className="date">{date}</span><ChevronDown className={openExperience === org ? 'rotate' : ''} size={18} /></button>{openExperience === org && <p>{detail}</p>}</div>)}</div></section>
      <section id="lab" className="lab section-pad"><div className="section-head"><div><p className="eyebrow">03 / CLASS PROJECT</p><h2>Math 463 Cell Project</h2></div></div><div className="lab-grid"><div className="experiment"><div className="experiment-head"><span>LAB—A / COMPETING CELL POPULATIONS</span><button onClick={() => setPaused(!paused)} aria-label={paused ? 'Play simulation' : 'Pause simulation'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button></div><div className="equation-panel"><span className="detail-label">EDIT THE MODEL / TWO SPECIES</span><div className="equation-name blue-cell">CELL A</div><div className="equation">∂A/∂t = <input aria-label="Population A growth rate" type="number" min="0" max="2" step=".05" value={(density / 100).toFixed(2)} onChange={(e) => setDensity(Math.max(0, Math.min(100, Number(e.target.value) * 100)))} />A(1 − A) − <input aria-label="Competition strength" type="number" min="0" max="2" step=".05" value={(interaction / 35).toFixed(2)} onChange={(e) => setInteraction(Math.max(10, Math.min(50, Number(e.target.value) * 35)))} />AB + <input aria-label="Diffusion rate" type="number" min="0" max="2" step=".05" value={motion.toFixed(2)} onChange={(e) => setMotion(Math.max(0, Math.min(2, Number(e.target.value))))} />∇²A</div><div className="equation-name green-cell">CELL B</div><div className="equation">∂B/∂t = 1.05B(1 − B) − 0.9αAB + D∇²B</div></div><PopulationCanvas paused={paused} density={density} motion={motion} interaction={interaction} /><div className="controls"><label>Growth A <input type="range" min="20" max="100" value={density} onChange={(e) => setDensity(+e.target.value)} /><output>{(density / 100).toFixed(2)}</output></label><label>Diffusion <input type="range" min="0" max="2" step=".1" value={motion} onChange={(e) => setMotion(+e.target.value)} /><output>{motion.toFixed(1)}</output></label><label>Competition <input type="range" min="10" max="50" value={interaction} onChange={(e) => setInteraction(+e.target.value)} /><output>{(interaction / 35).toFixed(2)}</output></label></div></div></div></section>
      <section id="contact" className="contact section-pad"><p className="eyebrow">05 / CONNECTIONS</p><a className="email" href="mailto:calvinchenxc@gmail.com">calvinchenxc@gmail.com <ArrowUpRight /></a><div className="contact-links"><a href="https://github.com/CalvinOK" target="_blank" rel="noreferrer"><Github size={16} /> GITHUB</a><a href="https://linkedin.com/in/chencx" target="_blank" rel="noreferrer"><Linkedin size={16} /> LINKEDIN</a><a href="mailto:calvinchenxc@gmail.com"><Mail size={16} /> EMAIL</a></div><div className="contact-foot"><span>CALVIN (XIANG) CHEN</span><span>ANN ARBOR / MI</span><span>© 2026</span></div></section>
    </main>
    <footer><span>AN ARCHIVE OF EXPERIMENTS</span><span>BUILT WITH CURIOSITY / <a href="#top">BACK TO TOP ↑</a></span></footer>
  </div>
}

export default App
