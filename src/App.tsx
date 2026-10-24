import { useEffect, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, ChevronDown, Github, Linkedin, Mail, Pause, Play } from 'lucide-react'
import { experience, projects, type Category } from './data'

const categories: Array<'All' | Category> = ['All', 'Computational Biology', 'Software Engineering', 'Mathematics & Algorithms', 'Quantitative Research', 'Ventures & Strategy', 'Creative Work']

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

function LabCanvas({ paused, density, motion, interaction }: { paused: boolean; density: number; motion: number; interaction: number }) {
  const seed = useRef(Array.from({ length: 90 }, (_, i) => ({ x: (i * 73) % 100, y: (i * 47) % 100, p: i * 1.7 })))
  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    ctx.fillStyle = '#0d161e'; ctx.fillRect(0, 0, w, h)
    const t = paused ? 0 : time / 1000 * motion
    const count = Math.round(20 + density * .7)
    const points = seed.current.slice(0, count).map((p) => ({ x: ((p.x + Math.sin(t + p.p) * 2) / 100) * w, y: ((p.y + Math.cos(t * .8 + p.p) * 2) / 100) * h }))
    points.forEach((p, i) => points.slice(i + 1).forEach((q) => {
      const d = Math.hypot(p.x - q.x, p.y - q.y)
      if (d < interaction * 1.6) { ctx.strokeStyle = `rgba(97,228,222,${.16 * (1 - d / (interaction * 1.6))})`; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() }
    }))
    points.forEach((p, i) => { ctx.fillStyle = i % 3 ? '#58bfff' : '#61e4de'; ctx.globalAlpha = .45 + (i % 4) / 8; ctx.beginPath(); ctx.arc(p.x, p.y, i % 5 === 0 ? 3 : 1.5, 0, Math.PI * 2); ctx.fill() })
    ctx.globalAlpha = 1
  }
  return <canvas ref={useCanvas(draw)} className="lab-canvas" aria-label="Interactive cellular system simulation" />
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
  const [filter, setFilter] = useState<'All' | Category>('All')
  const [openProject, setOpenProject] = useState<string | null>(null)
  const [openExperience, setOpenExperience] = useState<string | null>(null)
  const [density, setDensity] = useState(55); const [motion, setMotion] = useState(1); const [interaction, setInteraction] = useState(28)
  const [frequency, setFrequency] = useState(8); const [paused, setPaused] = useState(false)
  const visibleProjects = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  return <div>
    <header className="topbar"><a className="logo" href="#top">CALVIN<span> / 026</span></a><nav>{['INDEX', 'PROJECTS', 'EXPERIENCE', 'LAB', 'ABOUT', 'CONTACT'].map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav><span className="status"><i /> AVAILABLE FOR SELECTED WORK</span></header>
    <main id="top">
      <section className="hero section-pad"><div className="hero-copy"><p className="eyebrow">ARCHIVE OF EXPERIMENTS <span>↗ 42° 16′ N / 83° 44′ W</span></p><h1>CALVIN<br /><em>CHEN</em></h1><p className="tagline">Exploring systems,<br />from molecules to markets.</p><div className="hero-meta"><span>UMICH / CS + MATH</span><span>RESEARCH / ENGINEERING / COMPUTATION</span><span>PORTFOLIO — 2026</span></div></div><div className="hero-visual"><HeroOrganism /><span className="annotation a1">SPECIMEN / 001<br />LIVE SYSTEM</span><span className="annotation a2">[ x: 0.42 / y: 0.78 ]</span><span className="annotation a3">NETWORK DENSITY: VARIABLE</span></div><a className="scroll-cue" href="#projects">SCROLL TO EXPLORE <ArrowDownRight size={16} /></a></section>
      <section className="statement section-pad"><p className="eyebrow">00 / ORIENTATION</p><h2>A practice built around <span>curiosity</span>,<br />precision, and useful questions.</h2><div className="statement-foot"><p>I work across disciplines that are usually kept apart—using computation to look closer at biological signals, environmental infrastructure, algorithms, and emerging businesses.</p><a href="#about">READ THE FIELD NOTES <ArrowUpRight size={15} /></a></div></section>
      <section id="projects" className="archive section-pad"><div className="section-head"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Field <span>reports</span></h2></div><p className="section-note">A catalog of questions pursued<br />through code, models, and making.</p></div><div className="project-list">{visibleProjects.map((project) => <article className="project-row" key={project.id}><button onClick={() => setOpenProject(openProject === project.id ? null : project.id)} aria-expanded={openProject === project.id}><span className="project-id">{project.id}</span><span className="project-title">{project.title}<small>{project.category} · {project.date}</small></span><span className="project-tools">{project.tools}</span><ChevronDown className={openProject === project.id ? 'rotate' : ''} size={19} /></button>{openProject === project.id && <div className="project-detail"><p>{project.detail}</p><span className="detail-label">METHOD / OUTCOME</span></div>}</article>)}</div><div className="filters">{categories.map((item) => <button className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div></section>
      <section id="experience" className="timeline section-pad"><div className="section-head"><div><p className="eyebrow">02 / RESEARCH TIMELINE</p><h2>In the <span>field</span></h2></div><p className="section-note">Places, teams, and problems<br />that changed the question.</p></div><div className="timeline-list">{experience.map(([number, org, role, date, detail]) => <div className="timeline-item" key={org}><span className="timeline-num">{number}</span><button onClick={() => setOpenExperience(openExperience === org ? null : org)}><span><strong>{org}</strong><small>{role}</small></span><span className="date">{date}</span><ChevronDown className={openExperience === org ? 'rotate' : ''} size={18} /></button>{openExperience === org && <p>{detail}</p>}</div>)}</div></section>
      <section id="lab" className="lab section-pad"><div className="section-head"><div><p className="eyebrow">03 / THE LABORATORY</p><h2>An environment for<br /><span>computational curiosity.</span></h2></div><p className="section-note">Illustrative simulations.<br />Not patient data or real-time feeds.</p></div><div className="lab-grid"><div className="experiment"><div className="experiment-head"><span>LAB—A / CELLULAR SYSTEM</span><button onClick={() => setPaused(!paused)} aria-label={paused ? 'Play simulation' : 'Pause simulation'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button></div><LabCanvas paused={paused} density={density} motion={motion} interaction={interaction} /><div className="controls"><label>Density <input type="range" min="20" max="100" value={density} onChange={(e) => setDensity(+e.target.value)} /><output>{density}</output></label><label>Motion <input type="range" min="0" max="2" step=".1" value={motion} onChange={(e) => setMotion(+e.target.value)} /><output>{motion.toFixed(1)}</output></label><label>Radius <input type="range" min="10" max="50" value={interaction} onChange={(e) => setInteraction(+e.target.value)} /><output>{interaction}</output></label></div><p className="experiment-note">Particles drift, connect, and form temporary systems according to adjustable parameters.</p></div><div className="experiment"><div className="experiment-head"><span>LAB—B / NEURAL SIGNALS</span><span className="live-dot">● SIMULATION</span></div><SignalCanvas frequency={frequency} /><div className="controls"><label>Frequency <input type="range" min="2" max="18" value={frequency} onChange={(e) => setFrequency(+e.target.value)} /><output>{frequency} Hz</output></label></div><p className="experiment-note">A synthetic waveform demonstrating how frequency changes signal shape. No authentic EEG recordings.</p></div></div></section>
      <section id="about" className="about section-pad"><p className="eyebrow">04 / BEYOND THE LABORATORY</p><div className="about-grid"><h2>Ideas become<br /><span>useful</span> when<br />they connect.</h2><div><p className="about-lead">I'm Calvin, a computer science and mathematics student at the University of Michigan. I'm interested in how computational thinking can help us understand, model, and build complex systems—from biological signals and environmental infrastructure to algorithms and emerging businesses.</p><div className="credentials"><p><b>EDUCATION</b><br />BSE, Computer Science · Mathematics<br />Minor, Business Administration<br />University of Michigan · GPA 3.88 / 4.00</p><p><b>SELECTED RECOGNITION</b><br />Michigan Investment Challenge — 1st Place<br />Venture Capital Investment Competition — 3rd Place<br />College of Engineering Scholarship of Honor</p></div></div></div><div className="personal"><span>PERSONAL INDEX / 05</span><p>When not tracing a signal or modeling a market, I play and teach violin, build community initiatives, and stay curious about the people behind a problem.</p></div></section>
      <section id="contact" className="contact section-pad"><p className="eyebrow">05 / OPEN CHANNEL</p><h2>Let’s follow<br />the <span>signal.</span></h2><a className="email" href="mailto:chencx@umich.edu">chencx@umich.edu <ArrowUpRight /></a><div className="contact-links"><a href="https://github.com/CalvinOK" target="_blank" rel="noreferrer"><Github size={16} /> GITHUB</a><a href="https://linkedin.com/in/chencx" target="_blank" rel="noreferrer"><Linkedin size={16} /> LINKEDIN</a><a href="mailto:chencx@umich.edu"><Mail size={16} /> EMAIL</a></div><div className="contact-foot"><span>CALVIN (XIANG) CHEN</span><span>ANN ARBOR / MI</span><span>© 2026</span></div></section>
    </main>
    <footer><span>AN ARCHIVE OF EXPERIMENTS</span><span>BUILT WITH CURIOSITY / <a href="#top">BACK TO TOP ↑</a></span></footer>
  </div>
}

export default App
