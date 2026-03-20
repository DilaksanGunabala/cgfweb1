import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════ CONSTANTS ═══════════════════ */
const C = {
  bg: "#050810", bgCard: "rgba(10,16,32,0.75)", bgGlass: "rgba(12,18,30,0.72)",
  border: "rgba(255,255,255,0.06)", borderHi: "rgba(0,234,255,0.25)",
  cyan: "#00EAFF", cyanG: "rgba(0,234,255,0.3)", violet: "#A855F7", violetG: "rgba(168,85,247,0.25)",
  lime: "#4ADE80", limeG: "rgba(74,222,128,0.25)", amber: "#FBBF24", pink: "#F472B6",
  red: "#F87171", txt: "#E8EDF5", txtM: "#8896B0", txtD: "#455068",
};
const SERVICES = [
  { id: "web", icon: "\u{1F310}", title: "Web Application Development", short: "Custom SaaS, dashboards & portals built with modern frameworks.", tech: ["React","Next.js","Node.js","PostgreSQL","AWS"], benefits: ["Scalable architecture","Real-time features","API-first design","99.9% uptime SLA"] },
  { id: "mobile", icon: "\u{1F4F1}", title: "Mobile App Development", short: "Native & cross-platform apps for iOS and Android.", tech: ["React Native","Flutter","Swift","Kotlin","Firebase"], benefits: ["Cross-platform","Native performance","Offline-first","Push notifications"] },
  { id: "uiux", icon: "\u{1F3A8}", title: "UI/UX Design", short: "Research-driven design systems & user experiences.", tech: ["Figma","Adobe XD","Framer","Principle"], benefits: ["User research backed","Accessible design","Design systems","Rapid prototyping"] },
  { id: "redesign", icon: "\u{1F504}", title: "Website Redesign", short: "Modernize your digital presence with performance-first redesigns.", tech: ["Next.js","Tailwind","Vercel","Core Web Vitals"], benefits: ["Speed optimization","SEO improvement","Modern stack","A/B tested"] },
  { id: "appredesign", icon: "\u2728", title: "Mobile App Redesign", short: "Revamp mobile experience with modern UX patterns.", tech: ["Flutter","React Native","Material 3","iOS HIG"], benefits: ["UX overhaul","Accessibility","Platform updates","Retention boost"] },
  { id: "ai", icon: "\u{1F916}", title: "AI Agent Development", short: "Custom AI agents, automation workflows & intelligent chatbots.", tech: ["OpenAI","LangChain","Python","n8n","TensorFlow"], benefits: ["Task automation","24/7 availability","Cost reduction","Smart routing"] },
];
const PORTFOLIO = [
  { id:1, title:"StyleVault E-Commerce", cat:"Web", client:"StyleVault Inc.", desc:"Full-stack e-commerce platform with AI-powered recommendations and real-time inventory.", tech:["Next.js","Stripe","PostgreSQL","Redis"], result:"340% increase in online sales" },
  { id:2, title:"MediBook Health App", cat:"Mobile", client:"MediBook Health", desc:"Healthcare appointment booking with telemedicine integration and health records.", tech:["React Native","Firebase","WebRTC","HL7"], result:"50K+ downloads in 3 months" },
  { id:3, title:"FinTrack Dashboard", cat:"Web", client:"FinTrack Capital", desc:"Real-time fintech analytics dashboard with portfolio tracking and risk assessment.", tech:["React","D3.js","Node.js","MongoDB"], result:"60% faster decision making" },
  { id:4, title:"CustomerAI Chatbot", cat:"AI", client:"RetailMax Corp", desc:"AI-powered customer service chatbot handling 80% of support queries.", tech:["GPT-4","LangChain","Python","Redis"], result:"80% query resolution rate" },
  { id:5, title:"PropFinder Platform", cat:"Web", client:"PropFinder Realty", desc:"Real estate platform with virtual tours and neighborhood analytics.", tech:["Next.js","Mapbox","Three.js","Prisma"], result:"2x lead conversion rate" },
  { id:6, title:"MetricFlow Analytics", cat:"AI", client:"MetricFlow SaaS", desc:"AI-driven SaaS analytics with predictive insights and anomaly detection.", tech:["Python","TensorFlow","FastAPI","React"], result:"45% churn reduction" },
];
const TESTIMONIALS = [
  { name:"Sarah Chen", role:"CTO, StyleVault", text:"CodeGloFix transformed our entire e-commerce infrastructure. Technical depth exceeded expectations.", av:"SC" },
  { name:"Marcus Rivera", role:"Founder, MediBook", text:"They understood our healthcare domain deeply. The result was a product patients actually love.", av:"MR" },
  { name:"James Worthington", role:"VP Eng, FinTrack", text:"The dashboard processes millions of data points in real-time. Analysts decide 60% faster.", av:"JW" },
  { name:"Priya Sharma", role:"CEO, RetailMax", text:"The AI chatbot handles 80% of queries automatically. ROI was visible within month one.", av:"PS" },
];
const BLOGS = [
  { id:1, title:"Why AI Agents Are the Future of Business Automation", ex:"How autonomous AI agents reshape workflows across industries.", date:"Mar 15, 2026", rt:"8 min", cat:"AI" },
  { id:2, title:"Next.js 15: What's New for Enterprise", ex:"Latest features and their impact on large-scale architecture.", date:"Mar 10, 2026", rt:"6 min", cat:"Web Dev" },
  { id:3, title:"Designing Mobile-First: Lessons from 50+ Projects", ex:"Key principles from building apps across healthcare, fintech, e-commerce.", date:"Mar 5, 2026", rt:"10 min", cat:"Design" },
  { id:4, title:"The ROI of Website Redesign", ex:"Measuring and maximizing return on modernizing your web presence.", date:"Feb 28, 2026", rt:"7 min", cat:"Strategy" },
];
const NAV = ["Home","About","Services","Portfolio","AI Solutions","Blog","Contact"];

const SNIPPETS = [
  "const deploy = async (app) => {\n  await build(app);\n  const tests = await runSuite();\n  if (tests.pass) {\n    await push(app, 'prod');\n    notify('deployed', app);\n  }\n}",
  "class NeuralNet {\n  forward(x) {\n    for (const layer of this.layers) {\n      x = layer.activate(\n        matmul(x, layer.weights)\n      );\n    }\n    return softmax(x);\n  }\n}",
  "app.post('/api/users', async (req, res) => {\n  const user = await db.users.create({\n    data: req.body,\n    include: { profile: true }\n  });\n  redis.del('users:list');\n  return res.json(user);\n});",
  "export default function Dashboard() {\n  const { data, isLoading } = useSWR(\n    '/api/metrics',\n    fetcher,\n    { refreshInterval: 5000 }\n  );\n  return <Chart data={data} />;\n}",
  "class Pipeline:\n  def transform(self, raw):\n    clean = self.preprocess(raw)\n    feats = self.extract(clean)\n    pred = self.model.predict(feats)\n    return self.postprocess(pred)",
  "SELECT\n  u.name,\n  COUNT(o.id) as orders,\n  SUM(o.total) as revenue\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.created > NOW() - '30d'\nGROUP BY u.name\nORDER BY revenue DESC;",
];

const TERM_LINES = [
  { t:"$ git pull origin main", c:C.txt, d:0 },
  { t:"\u2713 Already up to date.", c:C.lime, d:600 },
  { t:"$ npm run build", c:C.txt, d:1200 },
  { t:"\u2713 Compiled 1,247 modules in 3.1s", c:C.lime, d:2200 },
  { t:"$ npm test -- --coverage", c:C.txt, d:3000 },
  { t:"  PASS src/auth.test.ts        (24 tests)", c:C.lime, d:3800 },
  { t:"  PASS src/api.test.ts         (67 tests)", c:C.lime, d:4200 },
  { t:"  PASS src/ai-engine.test.ts   (43 tests)", c:C.lime, d:4600 },
  { t:"\u2713 134 tests passed \u00B7 Coverage: 94.2%", c:C.lime, d:5200 },
  { t:"$ docker build -t app:v2.4.1 .", c:C.cyan, d:6000 },
  { t:"\u2713 Image built (247MB) \u2192 pushed to registry", c:C.cyan, d:7200 },
  { t:"$ kubectl rollout restart deploy/app", c:C.violet, d:8000 },
  { t:"\u2713 Rollout complete \u2192 https://app.client.com", c:C.violet, d:9200 },
];

const GIT_COMMITS = [
  { hash:"a3f7c2e", msg:"feat: add real-time collaboration engine", author:"dev-lead", time:"2m ago", files:"+847 -213" },
  { hash:"9b1d4f8", msg:"fix: resolve WebSocket reconnection leak", author:"backend", time:"14m ago", files:"+23 -8" },
  { hash:"e5c8a01", msg:"perf: optimize DB query N+1 in dashboard", author:"backend", time:"28m ago", files:"+12 -45" },
  { hash:"7f2b3d9", msg:"feat: implement AI-powered search suggestions", author:"ai-team", time:"1h ago", files:"+342 -67" },
  { hash:"1a9e6c4", msg:"style: redesign settings page with new DS", author:"frontend", time:"2h ago", files:"+156 -89" },
  { hash:"d4f1b7a", msg:"test: add e2e tests for checkout flow", author:"qa", time:"3h ago", files:"+234 -0" },
  { hash:"8c3e5f2", msg:"chore: upgrade dependencies, fix audit", author:"devops", time:"4h ago", files:"+1,203 -987" },
  { hash:"b6a2d8c", msg:"feat: add webhook retry with exp backoff", author:"backend", time:"5h ago", files:"+89 -12" },
];

/* ═══════════════════ THREE.JS 3D SCENE ═══════════════════ */
function ThreeScene() {
  const mountRef = useRef(null);
  const scRef = useRef({});
  useEffect(() => {
    const el = mountRef.current; if (!el) return;
    const sc = document.createElement("script");
    sc.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    sc.onload = () => init(window.THREE);
    document.head.appendChild(sc);
    function init(T) {
      const w = el.clientWidth, h = el.clientHeight;
      const R = new T.WebGLRenderer({ alpha:true, antialias:true });
      R.setSize(w,h); R.setPixelRatio(Math.min(devicePixelRatio,2));
      R.shadowMap.enabled = true; R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.5;
      el.appendChild(R.domElement);
      const S = new T.Scene(); S.fog = new T.FogExp2(0x050810, 0.055);
      const cam = new T.PerspectiveCamera(42, w/h, 0.1, 100); cam.position.set(0, 0.5, 7.5);
      S.add(new T.AmbientLight(0x0a1628, 0.4));
      S.add(new T.HemisphereLight(0x00EAFF, 0xA855F7, 0.2));
      const kl = new T.DirectionalLight(0x00EAFF, 2.2); kl.position.set(6,10,6); kl.castShadow=true; kl.shadow.mapSize.set(1024,1024); S.add(kl);
      const fl = new T.DirectionalLight(0xA855F7, 1.2); fl.position.set(-5,4,-4); S.add(fl);
      const rl = new T.DirectionalLight(0x4ADE80, 0.6); rl.position.set(0,-3,-6); S.add(rl);
      const p1 = new T.PointLight(0x00EAFF, 4, 20);
      const p2 = new T.PointLight(0xA855F7, 3, 16);
      const p3 = new T.PointLight(0x4ADE80, 2, 14);
      S.add(p1,p2,p3);
      // Materials
      const mCyan = new T.MeshPhysicalMaterial({color:0x00EAFF, metalness:0.95, roughness:0.08, clearcoat:1, clearcoatRoughness:0.02});
      const mViolet = new T.MeshPhysicalMaterial({color:0xA855F7, metalness:0.9, roughness:0.12, clearcoat:0.8});
      const mGlass = new T.MeshPhysicalMaterial({color:0x00EAFF, metalness:0.05, roughness:0.01, transmission:0.94, thickness:0.5, transparent:true, opacity:0.55});
      const mChrome = new T.MeshPhysicalMaterial({color:0xE2E8F0, metalness:1, roughness:0.02, clearcoat:1, reflectivity:1});
      const eCyan = new T.MeshPhysicalMaterial({color:0x00EAFF, emissive:0x00EAFF, emissiveIntensity:0.8, metalness:0.3, roughness:0.2, transparent:true, opacity:0.85});
      const eViolet = new T.MeshPhysicalMaterial({color:0xA855F7, emissive:0xA855F7, emissiveIntensity:0.7, metalness:0.3, roughness:0.2, transparent:true, opacity:0.85});
      const eLime = new T.MeshPhysicalMaterial({color:0x4ADE80, emissive:0x4ADE80, emissiveIntensity:0.9, metalness:0.2, roughness:0.3, transparent:true, opacity:0.8});
      const mDark = new T.MeshPhysicalMaterial({color:0x0a1020, metalness:0.7, roughness:0.25, clearcoat:0.5});
      const obs = [];
      // Central bracket symbol { }
      const bg = new T.Group();
      const bx = (geo,mat,x,y,z) => { const m = new T.Mesh(geo,mat); m.position.set(x,y,z); bg.add(m); return m; };
      const vBar = new T.BoxGeometry(0.1,1.8,0.1);
      const hBar = new T.BoxGeometry(0.45,0.1,0.1);
      const mBar = new T.BoxGeometry(0.3,0.1,0.1);
      bx(vBar,mCyan,-0.42,0,0); bx(hBar,mCyan,-0.2,0.9,0); bx(hBar,mCyan,-0.2,-0.9,0); bx(mBar,eCyan,-0.57,0,0);
      bx(vBar,mViolet,0.42,0,0); bx(hBar,mViolet,0.2,0.9,0); bx(hBar,mViolet,0.2,-0.9,0); bx(mBar,eViolet,0.57,0,0);
      const diam = new T.Mesh(new T.OctahedronGeometry(0.28,0), eLime);
      bg.add(diam); bg.position.set(0,0.1,0); S.add(bg);
      obs.push({m:bg, by:0.1, fs:0.6, fa:0.14, rx:0, ry:0.007, rz:0});
      // Wireframe shell
      const shell = new T.Mesh(new T.IcosahedronGeometry(1.6,2), new T.MeshBasicMaterial({color:0x00EAFF, wireframe:true, transparent:true, opacity:0.05}));
      S.add(shell); obs.push({m:shell, by:0, fs:0, fa:0, rx:0.001, ry:0.002, rz:0.0005});
      // Second shell - larger, slower
      const shell2 = new T.Mesh(new T.IcosahedronGeometry(2.8,1), new T.MeshBasicMaterial({color:0xA855F7, wireframe:true, transparent:true, opacity:0.025}));
      S.add(shell2); obs.push({m:shell2, by:0, fs:0, fa:0, rx:-0.0005, ry:0.001, rz:0.0003});
      // Floating monitor panels (3)
      function mkMon(px,py,pz,ry,col) {
        const g = new T.Group();
        const sg = new T.BoxGeometry(1.3,0.85,0.04);
        g.add(new T.Mesh(sg, mDark));
        g.add(new T.LineSegments(new T.EdgesGeometry(sg), new T.LineBasicMaterial({color:col, transparent:true, opacity:0.45})));
        const gl = new T.Mesh(new T.PlaneGeometry(1.2,0.75), new T.MeshBasicMaterial({color:col, transparent:true, opacity:0.06}));
        gl.position.z = 0.025; g.add(gl);
        // "scan line" bars on screen
        for(let i=0;i<5;i++){
          const ln = new T.Mesh(new T.PlaneGeometry(1.1,0.015), new T.MeshBasicMaterial({color:col, transparent:true, opacity:0.1}));
          ln.position.set(0, 0.3 - i*0.15, 0.026); g.add(ln);
        }
        g.position.set(px,py,pz); g.rotation.y=ry; S.add(g); return g;
      }
      obs.push({m:mkMon(-3,0.9,-1.5,0.5,0x00EAFF), by:0.9, fs:0.7, fa:0.16, rx:0, ry:0.003, rz:0});
      obs.push({m:mkMon(3.1,-0.4,-1.3,-0.4,0xA855F7), by:-0.4, fs:0.9, fa:0.13, rx:0, ry:-0.002, rz:0});
      obs.push({m:mkMon(0.6,2,-2.5,-0.1,0x4ADE80), by:2, fs:0.5, fa:0.2, rx:0, ry:0.004, rz:0});
      // Geometric shapes
      const tk = new T.Mesh(new T.TorusKnotGeometry(0.35,0.09,100,16,2,3), mGlass);
      tk.position.set(-2.2,-1.3,0.8); tk.castShadow=true; S.add(tk);
      obs.push({m:tk, by:-1.3, fs:1, fa:0.22, rx:0.008, ry:0.012, rz:0.003});
      const tor = new T.Mesh(new T.TorusGeometry(0.4,0.12,16,48), mViolet);
      tor.position.set(2.4,1.4,-0.5); tor.rotation.x=Math.PI/3; tor.castShadow=true; S.add(tor);
      obs.push({m:tor, by:1.4, fs:1.3, fa:0.18, rx:0.01, ry:0.015, rz:0.005});
      const dod = new T.Mesh(new T.DodecahedronGeometry(0.32,0), mChrome);
      dod.position.set(1.6,-1.6,1.9); dod.castShadow=true; S.add(dod);
      obs.push({m:dod, by:-1.6, fs:1.1, fa:0.24, rx:0.012, ry:0.008, rz:0.006});
      // Icosahedron
      const ico = new T.Mesh(new T.IcosahedronGeometry(0.22,0), eCyan);
      ico.position.set(-1.8,1.6,-0.8); S.add(ico);
      obs.push({m:ico, by:1.6, fs:1.5, fa:0.2, rx:-0.015, ry:0.01, rz:0.008});
      // Data spheres (30)
      for(let i=0;i<30;i++){
        const r=0.02+Math.random()*0.06;
        const cols=[0x00EAFF,0xA855F7,0x4ADE80,0xFBBF24,0xF472B6];
        const c=cols[i%5];
        const s=new T.Mesh(new T.SphereGeometry(r,10,10), new T.MeshPhysicalMaterial({color:c, emissive:c, emissiveIntensity:1.5, transparent:true, opacity:0.6}));
        const a=(i/30)*Math.PI*2, rad=2.2+Math.random()*2.8, yp=(Math.random()-0.5)*4;
        s.position.set(Math.cos(a)*rad, yp, Math.sin(a)*rad-1.5); S.add(s);
        obs.push({m:s, by:yp, fs:0.3+Math.random()*2, fa:0.06+Math.random()*0.18, rx:0, ry:0, rz:0});
      }
      // Orbit rings (4)
      for(let i=0;i<4;i++){
        const ring=new T.Mesh(new T.TorusGeometry(1.6+i*0.7, 0.006, 8, 140), new T.MeshBasicMaterial({color:[0x00EAFF,0xA855F7,0x4ADE80,0xFBBF24][i], transparent:true, opacity:0.06+i*0.015}));
        ring.rotation.x=Math.PI/(2+i*0.4); ring.rotation.z=i*0.35; S.add(ring);
        obs.push({m:ring, by:0, fs:0, fa:0, rx:0, ry:0, rz:0.015*(i%2===0?1:-1)});
      }
      // Mouse tracking
      const ms={x:0,y:0}, tms={x:0,y:0};
      const hm=e=>{tms.x=(e.clientX/innerWidth-0.5)*2; tms.y=-(e.clientY/innerHeight-0.5)*2;};
      addEventListener("mousemove",hm);
      let af=0; const clk=new T.Clock();
      const anim=()=>{
        af=requestAnimationFrame(anim); const t=clk.getElapsedTime();
        ms.x+=(tms.x-ms.x)*0.02; ms.y+=(tms.y-ms.y)*0.02;
        cam.position.x=ms.x*0.8; cam.position.y=0.5+ms.y*0.5; cam.lookAt(0,0,0);
        obs.forEach(o=>{if(o.fa)o.m.position.y=o.by+Math.sin(t*o.fs)*o.fa; o.m.rotation.x+=o.rx; o.m.rotation.y+=o.ry; o.m.rotation.z+=o.rz;});
        diam.scale.setScalar(1+Math.sin(t*2.5)*0.18);
        p1.position.set(Math.cos(t*0.4)*5.5, Math.sin(t*0.25)*2.5+1, Math.sin(t*0.4)*5.5);
        p2.position.set(Math.cos(t*0.3+2)*4.5, Math.sin(t*0.35+1)*2, Math.sin(t*0.3+2)*4.5);
        p3.position.set(Math.cos(t*0.5+4)*3.5, Math.sin(t*0.45+2)*2.5-1, Math.sin(t*0.5+4)*3.5);
        R.render(S,cam);
      };
      anim();
      const hr=()=>{cam.aspect=el.clientWidth/el.clientHeight; cam.updateProjectionMatrix(); R.setSize(el.clientWidth,el.clientHeight);};
      addEventListener("resize",hr);
      scRef.current={R,af,hm,hr};
    }
    return()=>{const{R,af,hm,hr}=scRef.current; if(af)cancelAnimationFrame(af); removeEventListener("mousemove",hm); removeEventListener("resize",hr); if(R){R.dispose(); if(el.contains(R.domElement))el.removeChild(R.domElement);}};
  },[]);
  return <div ref={mountRef} style={{position:"absolute",inset:0,zIndex:0}}/>;
}

/* ═══════════════════ CODE RAIN CANVAS ═══════════════════ */
function CodeRain() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); let w, h;
    const rs = () => { w = cv.width = innerWidth; h = cv.height = innerHeight; };
    rs(); addEventListener("resize", rs);
    const ch = "{}[]<>()=>01;:=+-./*&|!~async await const let fn return import export class new this".split("");
    const fs = 13, cols = Math.floor(w / fs);
    const dr = Array(cols).fill(0).map(() => Math.random() * -80);
    const sp = Array(cols).fill(0).map(() => 0.25 + Math.random() * 0.6);
    const cl = ["rgba(0,234,255,","rgba(168,85,247,","rgba(74,222,128,"];
    let af;
    const draw = () => {
      ctx.fillStyle = "rgba(5,8,16,0.055)"; ctx.fillRect(0, 0, w, h);
      ctx.font = fs + "px 'JetBrains Mono','Fira Code',monospace";
      for (let i = 0; i < dr.length; i++) {
        const c = ch[~~(Math.random() * ch.length)];
        ctx.fillStyle = cl[i % 3] + (0.06 + Math.random() * 0.1) + ")";
        ctx.fillText(c, i * fs, dr[i] * fs);
        if (dr[i] * fs > h && Math.random() > 0.98) dr[i] = 0;
        dr[i] += sp[i];
      }
      af = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(af); removeEventListener("resize", rs); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", opacity: 0.45 }} />;
}

/* ═══════════════════ PARTICLE BG ═══════════════════ */
function ParticleBG() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); let w, h;
    const rs = () => { w = cv.width = innerWidth; h = cv.height = innerHeight; };
    rs(); addEventListener("resize", rs);
    const mx = { x: -999, y: -999 };
    const om = e => { mx.x = e.clientX; mx.y = e.clientY; };
    addEventListener("mousemove", om);
    const N = Math.min(80, ~~(w / 16));
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      r: 0.5 + Math.random() * 1.8, p: Math.random() * 6.28,
      c: ["0,234,255", "168,85,247", "74,222,128"][~~(Math.random() * 3)],
    }));
    let af;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.vx; p.y += p.vy; p.p += 0.012;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const d = Math.hypot(p.x - mx.x, p.y - mx.y);
        if (d < 180) { const a = Math.atan2(p.y - mx.y, p.x - mx.x); p.x += Math.cos(a) * 1.5; p.y += Math.sin(a) * 1.5; }
        const o = 0.18 + Math.sin(p.p) * 0.08;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        g.addColorStop(0, "rgba(" + p.c + "," + (o * 0.35) + ")"); g.addColorStop(1, "rgba(" + p.c + ",0)");
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, 6.28); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fillStyle = "rgba(" + p.c + "," + o + ")"; ctx.fill();
        for (let j = i + 1; j < ps.length; j++) {
          const q = ps[j], dd = Math.hypot(p.x - q.x, p.y - q.y);
          if (dd < 130) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = "rgba(0,234,255," + (0.05 * (1 - dd / 130)) + ")"; ctx.lineWidth = 0.4; ctx.stroke(); }
        }
      }
      af = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(af); removeEventListener("resize", rs); removeEventListener("mousemove", om); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

/* ═══════════════════ LIVE TERMINAL ═══════════════════ */
function LiveTerminal({ style = {} }) {
  const [lines, setLines] = useState([]);
  const [cy, setCy] = useState(0);
  useEffect(() => {
    const ts = []; setLines([]);
    TERM_LINES.forEach((l, i) => ts.push(setTimeout(() => setLines(p => [...p, l]), l.d)));
    ts.push(setTimeout(() => setCy(c => c + 1), 11000));
    return () => ts.forEach(clearTimeout);
  }, [cy]);
  return (
    <div style={{ background: "rgba(5,8,16,0.92)", border: "1px solid " + C.border, borderRadius: 14, fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 11.5, lineHeight: 1.75, overflow: "hidden", backdropFilter: "blur(20px)", ...style }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid " + C.border, display: "flex", gap: 7, alignItems: "center" }}>
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#EF4444" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FBBF24" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#4ADE80" }} />
        <span style={{ color: C.txtD, fontSize: 10.5, marginLeft: 8 }}>terminal \u2014 zsh \u2014 ci/cd pipeline</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}><Dot c={C.lime} /><span style={{ color: C.txtD, fontSize: 9.5 }}>LIVE</span></div>
      </div>
      <div style={{ padding: "12px 16px", minHeight: 220, maxHeight: 260, overflow: "hidden" }}>
        {lines.map((l, i) => (<div key={cy + "-" + i} style={{ color: l.c, opacity: 0, animation: "termIn .3s ease forwards", whiteSpace: "pre", fontSize: 11.5 }}>{l.t}</div>))}
        <span style={{ color: C.cyan, animation: "blink 1s step-end infinite" }}>{"\u2588"}</span>
      </div>
    </div>
  );
}

/* ═══════════════════ LIVE CODE EDITOR ═══════════════════ */
function LiveCodeEditor({ idx = 0, style = {} }) {
  const code = SNIPPETS[idx % SNIPPETS.length];
  const [disp, setDisp] = useState("");
  const [cy, setCy] = useState(0);
  const [charCount, setCharCount] = useState(0);
  useEffect(() => {
    let i = 0; setDisp(""); setCharCount(0);
    const iv = setInterval(() => {
      if (i <= code.length) { setDisp(code.substring(0, i)); setCharCount(i); i++; }
      else { clearInterval(iv); setTimeout(() => setCy(c => c + 1), 3500); }
    }, 30);
    return () => clearInterval(iv);
  }, [cy, code]);
  const colorize = (txt) => txt.split("\n").map((line, li) => {
    let h = line.replace(/(const|let|var|function|async|await|return|export|default|class|new|this|import|from|def|self|for|if|SELECT|FROM|WHERE|JOIN|ON|GROUP BY|ORDER BY|COUNT|SUM|AS)/g, '<kw>$1</kw>').replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<st>$1</st>').replace(/(\/\/.*|#.*|--.*)/g, '<cm>$1</cm>').replace(/\b(\d+\.?\d*)\b/g, '<nm>$1</nm>');
    h = h.replace(/<kw>/g, '<span style="color:'+C.violet+'">').replace(/<\/kw>/g, '</span>').replace(/<st>/g, '<span style="color:'+C.lime+'">').replace(/<\/st>/g, '</span>').replace(/<cm>/g, '<span style="color:'+C.txtD+'">').replace(/<\/cm>/g, '</span>').replace(/<nm>/g, '<span style="color:'+C.amber+'">').replace(/<\/nm>/g, '</span>');
    return (<div key={cy+"-"+li} style={{display:"flex"}}><span style={{color:C.txtD,width:24,textAlign:"right",marginRight:14,userSelect:"none",fontSize:10.5,opacity:0.5}}>{li+1}</span><span dangerouslySetInnerHTML={{__html:h}}/></div>);
  });
  return (
    <div style={{ background: "rgba(5,8,16,0.94)", border: "1px solid " + C.border, borderRadius: 14, fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 12, lineHeight: 1.85, overflow: "hidden", backdropFilter: "blur(20px)", ...style }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid " + C.border, display: "flex", gap: 7, alignItems: "center" }}>
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#EF4444" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FBBF24" }} />
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#4ADE80" }} />
        <span style={{ color: C.txtD, fontSize: 10.5, marginLeft: 8 }}>app.ts \u2014 CodeGloFix IDE</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: C.txtD, fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }}>Ln {disp.split("\n").length} Col {(disp.split("\n").pop()||"").length}</span>
          <span style={{ color: C.cyan, fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }}>{charCount} chars</span>
        </div>
      </div>
      <div style={{ padding: "12px 10px", whiteSpace: "pre", minHeight: 180 }}>
        {colorize(disp)}
        <span style={{ color: C.cyan, animation: "blink 1s step-end infinite" }}>{"\u2588"}</span>
      </div>
    </div>
  );
}

/* ═══════════════════ LIVE GIT LOG ═══════════════════ */
function LiveGitLog({ style = {} }) {
  const [visible, setVisible] = useState(3);
  const [cy, setCy] = useState(0);
  useEffect(() => {
    setVisible(0);
    let i = 0;
    const iv = setInterval(() => {
      i++; setVisible(i);
      if (i >= GIT_COMMITS.length) { clearInterval(iv); setTimeout(() => setCy(c => c + 1), 4000); }
    }, 1200);
    return () => clearInterval(iv);
  }, [cy]);
  return (
    <div style={{ background: "rgba(5,8,16,0.9)", border: "1px solid " + C.border, borderRadius: 14, fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 11, overflow: "hidden", backdropFilter: "blur(20px)", ...style }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid " + C.border, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: C.amber, fontSize: 14 }}>{"\u{1F4CB}"}</span>
        <span style={{ color: C.txtM, fontSize: 11 }}>git log \u2014 recent commits</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}><Dot c={C.amber} /><span style={{ color: C.txtD, fontSize: 9.5 }}>LIVE</span></div>
      </div>
      <div style={{ padding: "8px 0", maxHeight: 240, overflow: "hidden" }}>
        {GIT_COMMITS.slice(0, visible).map((g, i) => (
          <div key={cy + "-" + i} style={{ padding: "6px 16px", opacity: 0, animation: "termIn 0.4s ease forwards", display: "flex", gap: 10, alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <span style={{ color: C.amber, fontSize: 10, flexShrink: 0, fontWeight: 600 }}>{g.hash}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.txt, fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.msg}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                <span style={{ color: C.violet, fontSize: 9.5 }}>{g.author}</span>
                <span style={{ color: C.txtD, fontSize: 9.5 }}>{g.time}</span>
                <span style={{ color: C.lime, fontSize: 9.5 }}>{g.files}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ DEPLOY PIPELINE ═══════════════════ */
function DeployPipeline({ style = {} }) {
  const stages = ["Build","Test","Scan","Stage","Deploy"];
  const [active, setActive] = useState(-1);
  const [cy, setCy] = useState(0);
  useEffect(() => {
    setActive(-1);
    let i = -1;
    const iv = setInterval(() => { i++; setActive(i); if (i >= stages.length) { clearInterval(iv); setTimeout(() => setCy(c => c + 1), 3000); } }, 1400);
    return () => clearInterval(iv);
  }, [cy]);
  return (
    <div style={{ background: "rgba(5,8,16,0.9)", border: "1px solid " + C.border, borderRadius: 14, padding: "16px 20px", fontFamily: "'JetBrains Mono','Fira Code',monospace", backdropFilter: "blur(20px)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 13 }}>{"\u{1F680}"}</span>
        <span style={{ color: C.txtM, fontSize: 11 }}>CI/CD Pipeline</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}><Dot c={active >= stages.length ? C.lime : C.cyan} /><span style={{ color: C.txtD, fontSize: 9.5 }}>{active >= stages.length ? "DONE" : "RUNNING"}</span></div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {stages.map((s, i) => {
          const done = i < active, curr = i === active, pend = i > active;
          return (
            <div key={s} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: "100%", height: 6, borderRadius: 3, background: done ? C.lime : curr ? C.cyan : "rgba(255,255,255,0.06)", transition: "background 0.5s", position: "relative", overflow: "hidden" }}>
                {curr && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(0,234,255,0.6), transparent)", animation: "pipeSlide 1.2s ease-in-out infinite" }} />}
              </div>
              <span style={{ fontSize: 9, color: done ? C.lime : curr ? C.cyan : C.txtD, fontWeight: curr ? 700 : 400, transition: "color 0.3s" }}>{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════ SYSTEM METRICS ═══════════════════ */
function SystemMetrics({ style = {} }) {
  const [cpu, setCpu] = useState(34);
  const [mem, setMem] = useState(62);
  const [net, setNet] = useState(128);
  const [req, setReq] = useState(2847);
  useEffect(() => {
    const iv = setInterval(() => {
      setCpu(p => Math.max(15, Math.min(85, p + (Math.random() - 0.48) * 8)));
      setMem(p => Math.max(40, Math.min(88, p + (Math.random() - 0.5) * 4)));
      setNet(p => Math.max(50, Math.min(500, p + (Math.random() - 0.5) * 60)));
      setReq(p => p + ~~(Math.random() * 15));
    }, 1500);
    return () => clearInterval(iv);
  }, []);
  const Gauge = ({ label, val, max, unit, color }) => {
    const pct = (val / max) * 100;
    return (
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ color: C.txtD, fontSize: 9.5, textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
          <span style={{ color, fontSize: 10.5, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }}>{typeof val === 'number' ? val.toFixed(val < 100 ? 1 : 0) : val}{unit}</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", borderRadius: 3, background: color, transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)", boxShadow: "0 0 8px " + color + "55" }} />
        </div>
      </div>
    );
  };
  return (
    <div style={{ background: "rgba(5,8,16,0.9)", border: "1px solid " + C.border, borderRadius: 14, padding: "16px 20px", fontFamily: "'JetBrains Mono','Fira Code',monospace", backdropFilter: "blur(20px)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 13 }}>{"\u{1F4CA}"}</span>
        <span style={{ color: C.txtM, fontSize: 11 }}>System Metrics</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}><Dot c={C.lime} /><span style={{ color: C.txtD, fontSize: 9.5 }}>LIVE</span></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Gauge label="CPU" val={cpu} max={100} unit="%" color={cpu > 70 ? C.amber : C.cyan} />
        <Gauge label="Memory" val={mem} max={100} unit="%" color={mem > 80 ? C.red : C.violet} />
        <Gauge label="Network" val={net} max={500} unit=" Mbps" color={C.lime} />
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4, borderTop: "1px solid " + C.border }}>
          <span style={{ color: C.txtD, fontSize: 9.5 }}>REQUESTS</span>
          <span style={{ color: C.cyan, fontSize: 11, fontWeight: 600 }}>{req.toLocaleString()}/min</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ LIVE WIDGETS ═══════════════════ */
function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const iv = setInterval(() => setT(new Date()), 1000); return () => clearInterval(iv); }, []);
  return <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.cyan, fontSize: 12.5, letterSpacing: 0.5 }}>{t.toLocaleTimeString("en-US", { hour12: false })}</span>;
}
function LiveUptime() {
  const [s, setS] = useState(0);
  useEffect(() => { const iv = setInterval(() => setS(x => x + 1), 1000); return () => clearInterval(iv); }, []);
  const pad = n => String(n).padStart(2, "0");
  return <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.lime, fontSize: 12.5, letterSpacing: 0.8 }}>{pad(~~(s/86400))}d:{pad(~~(s%86400/3600))}h:{pad(~~(s%3600/60))}m:{pad(s%60)}s</span>;
}
function LiveVisitors() {
  const [v, setV] = useState(142);
  useEffect(() => { const iv = setInterval(() => setV(p => p + (Math.random() > 0.6 ? 1 : 0)), 3000); return () => clearInterval(iv); }, []);
  return <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.violet, fontSize: 12.5 }}>{v}</span>;
}
function Dot({ c }) {
  return <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: c || C.lime, boxShadow: "0 0 6px " + (c || C.lime) + ",0 0 14px " + (c || C.lime) + "44", animation: "pulse 2s ease-in-out infinite", flexShrink: 0 }} />;
}

/* ═══════════════════ 3D TILT CARD ═══════════════════ */
function Card3D({ children, style = {}, hover = true, onClick, intensity = 14 }) {
  const ref = useRef(null);
  const [tf, setTf] = useState("perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)");
  const [gl, setGl] = useState({ x: 50, y: 50, o: 0 });
  const raf = useRef(null);
  const onM = useCallback(e => {
    if (!hover || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      setTf("perspective(900px) rotateX(" + ((0.5 - y) * intensity) + "deg) rotateY(" + ((x - 0.5) * intensity) + "deg) scale3d(1.03,1.03,1.03)");
      setGl({ x: x * 100, y: y * 100, o: 0.2 });
    });
  }, [hover, intensity]);
  const onL = useCallback(() => { if (raf.current) cancelAnimationFrame(raf.current); setTf("perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)"); setGl({ x: 50, y: 50, o: 0 }); }, []);
  return (
    <div ref={ref} onClick={onClick} onMouseMove={onM} onMouseLeave={onL} style={{
      background: C.bgGlass, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      border: "1px solid " + C.border, borderRadius: 16, padding: 24,
      transition: "transform .12s ease-out, box-shadow .3s, border-color .3s",
      transform: tf, transformStyle: "preserve-3d",
      cursor: onClick ? "pointer" : "default", position: "relative", overflow: "hidden", willChange: "transform",
      boxShadow: gl.o > 0 ? "0 24px 60px rgba(0,234,255,0.06), inset 0 1px 0 rgba(255,255,255,0.04)" : "none",
      borderColor: gl.o > 0 ? C.borderHi : C.border, ...style,
    }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "radial-gradient(circle at " + gl.x + "% " + gl.y + "%, rgba(255,255,255," + gl.o + "), transparent 60%)", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", inset: -1, borderRadius: 17, background: "radial-gradient(circle at " + gl.x + "% " + gl.y + "%, rgba(0,234,255," + (gl.o * 0.4) + "), transparent 50%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

/* ═══════════════════ UTILITY COMPONENTS ═══════════════════ */
function FadeIn({ children, delay = 0, dir = "up", style = {} }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold: 0.05 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, []);
  const map = { up: "translateY(50px)", down: "translateY(-50px)", left: "translateX(50px)", right: "translateX(-50px)", scale: "scale(0.88)" };
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : map[dir], transition: "opacity .9s cubic-bezier(.16,1,.3,1) " + delay + "s, transform .9s cubic-bezier(.16,1,.3,1) " + delay + "s", willChange: "opacity,transform", ...style }}>{children}</div>;
}

function Counter({ end, suf = "", dur = 2200 }) {
  const [v, setV] = useState(0);
  const ref = useRef(null), go = useRef(false);
  useEffect(() => { const o = new IntersectionObserver(([e]) => { if (e.isIntersecting && !go.current) { go.current = true; const st = performance.now(); const step = now => { const p = Math.min((now - st) / dur, 1); setV(Math.round((1 - Math.pow(1 - p, 4)) * end)); if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); } }, { threshold: 0.5 }); if (ref.current) o.observe(ref.current); return () => o.disconnect(); }, [end, dur]);
  return <span ref={ref}>{v}{suf}</span>;
}

function SH({ tag, title, sub }) {
  return (<div style={{ textAlign: "center", marginBottom: 48 }}>
    {tag && <span style={{ color: C.cyan, fontSize: 12.5, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}><Dot c={C.cyan} />{tag}</span>}
    <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 700, color: C.txt, margin: "0 0 14px", lineHeight: 1.12, display: "block" }}>{title}</h2>
    {sub && <p style={{ color: C.txtM, fontSize: 16, maxWidth: 600, margin: "0 auto", lineHeight: 1.65 }}>{sub}</p>}
  </div>);
}

function Btn({ children, primary, onClick, style = {} }) {
  const [h, setH] = useState(false);
  return <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
    padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer",
    transition: "all .3s cubic-bezier(.16,1,.3,1)",
    border: primary ? "none" : "1px solid " + C.border,
    background: primary ? (h ? "#00C4D6" : C.cyan) : (h ? "rgba(255,255,255,0.06)" : "transparent"),
    color: primary ? "#020408" : C.txt,
    transform: h ? "translateY(-3px)" : "none",
    boxShadow: primary && h ? "0 14px 50px " + C.cyanG + ",0 0 80px rgba(0,234,255,0.08)" : "none", ...style,
  }}>{children}</button>;
}

function Badge({ children, color }) {
  const c = color || C.cyan;
  return <span style={{ display: "inline-block", padding: "3px 11px", borderRadius: 20, background: c + "14", color: c, fontSize: 11, fontWeight: 500 }}>{children}</span>;
}

/* ═══════════════════ GLITCH TEXT ═══════════════════ */
function GlitchText({ text, style = {} }) {
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ position: "absolute", left: -2, top: 0, color: C.cyan, clipPath: "inset(0 0 65% 0)", animation: "glitch1 3s infinite linear alternate-reverse", opacity: 0.7 }}>{text}</span>
      <span style={{ position: "absolute", left: 2, top: 0, color: C.violet, clipPath: "inset(65% 0 0 0)", animation: "glitch2 2.5s infinite linear alternate-reverse", opacity: 0.7 }}>{text}</span>
      {text}
    </span>
  );
}

/* ═══════════════════ NAVBAR ═══════════════════ */
function Navbar({ page, setPage }) {
  const [sc, setSc] = useState(false);
  const [mo, setMo] = useState(false);
  useEffect(() => { const h = () => setSc(scrollY > 50); addEventListener("scroll", h); return () => removeEventListener("scroll", h); }, []);
  const go = p => { setPage(p); setMo(false); scrollTo(0, 0); };
  return (<>
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: "0 24px", background: sc ? "rgba(5,8,16,0.9)" : "transparent", backdropFilter: sc ? "blur(28px) saturate(180%)" : "none", borderBottom: sc ? "1px solid " + C.border : "none", transition: "all .4s cubic-bezier(.16,1,.3,1)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div onClick={() => go("Home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg," + C.cyan + "," + C.violet + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: "#fff", boxShadow: "0 4px 24px " + C.cyanG }}>C</div>
          <span style={{ fontSize: 19, fontWeight: 700, color: C.txt }}>CodeGlo<span style={{ color: C.cyan }}>Fix</span></span>
          <div style={{ marginLeft: 6, display: "flex", alignItems: "center", gap: 5 }}><Dot /><span style={{ color: C.txtD, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>v3.0</span></div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }} className="navD">
          {NAV.map(i => <button key={i} onClick={() => go(i)} style={{ background: page === i ? "rgba(0,234,255,0.08)" : "none", border: "none", color: page === i ? C.cyan : C.txtM, fontSize: 13.5, fontWeight: 500, cursor: "pointer", padding: "7px 13px", borderRadius: 8, transition: "all .2s" }}>{i}</button>)}
          <Btn primary onClick={() => go("Contact")} style={{ padding: "9px 22px", fontSize: 13.5, marginLeft: 6 }}>Get Started</Btn>
        </div>
        <button onClick={() => setMo(!mo)} className="navM" style={{ background: "none", border: "none", color: C.txt, fontSize: 24, cursor: "pointer", display: "none" }}>{mo ? "\u2715" : "\u2630"}</button>
      </div>
    </nav>
    {mo && <div style={{ position: "fixed", top: 72, inset: 0, zIndex: 999, background: "rgba(5,8,16,0.98)", backdropFilter: "blur(24px)", display: "flex", flexDirection: "column", padding: "32px 24px", gap: 6 }}>
      {NAV.map(i => <button key={i} onClick={() => go(i)} style={{ background: page === i ? "rgba(0,234,255,0.1)" : "none", border: "none", color: page === i ? C.cyan : C.txt, fontSize: 17, fontWeight: 500, padding: "15px 20px", borderRadius: 12, textAlign: "left", cursor: "pointer" }}>{i}</button>)}
    </div>}
  </>);
}

/* ═══════════════════ HOME PAGE ═══════════════════ */
function HomePage({ setPage }) {
  return (<>
    {/* HERO */}
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "110px 24px 60px" }}>
      <ThreeScene />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 38%, transparent 18%, rgba(5,8,16,0.72) 62%)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1240, width: "100%", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center" }}>
        <div>
          <FadeIn dir="right">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 20, background: "rgba(0,234,255,0.07)", border: "1px solid rgba(0,234,255,0.12)", marginBottom: 18 }}><Dot /><span style={{ color: C.cyan, fontSize: 12.5, fontWeight: 500 }}>Software Development Company</span></div>
            <h1 style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 800, color: C.txt, margin: "0 0 18px", lineHeight: 1.06, letterSpacing: -0.5 }}>
              Building <GlitchText text="Smart" style={{ background: "linear-gradient(135deg," + C.cyan + "," + C.violet + ")", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }} /> Digital Solutions with Code & AI
            </h1>
          </FadeIn>
          <FadeIn delay={0.15} dir="right"><p style={{ fontSize: 17, color: C.txtM, lineHeight: 1.7, margin: "0 0 30px", maxWidth: 480 }}>We craft high-performance web apps, mobile experiences, and AI-powered solutions that help businesses scale globally.</p></FadeIn>
          <FadeIn delay={0.3} dir="right">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
              <Btn primary onClick={() => { setPage("Contact"); scrollTo(0, 0); }}>Get Started {"\u2192"}</Btn>
              <Btn onClick={() => { setPage("Services"); scrollTo(0, 0); }}>Our Services</Btn>
            </div>
          </FadeIn>
          <FadeIn delay={0.45} dir="right">
            <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
              {[{ v: "50+", l: "Projects" }, { v: "98%", l: "Satisfaction" }, { v: "24/7", l: "Support" }].map(s => <div key={s.l}><div style={{ fontSize: 22, fontWeight: 800, color: C.cyan, fontFamily: "'JetBrains Mono',monospace" }}>{s.v}</div><div style={{ fontSize: 11, color: C.txtD, marginTop: 2 }}>{s.l}</div></div>)}
            </div>
          </FadeIn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FadeIn delay={0.2} dir="left"><LiveCodeEditor idx={0} style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }} /></FadeIn>
          <FadeIn delay={0.4} dir="left"><LiveTerminal style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }} /></FadeIn>
        </div>
      </div>
    </section>

    {/* STATUS BAR */}
    <section style={{ padding: "16px 24px", borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border, position: "relative", zIndex: 2, background: "rgba(5,8,16,0.6)", backdropFilter: "blur(16px)" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 11 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Dot /><span style={{ color: C.txtD }}>all systems operational</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <span style={{ color: C.txtD }}>UPTIME <LiveUptime /></span>
          <span style={{ color: C.txtD }}>LOCAL <LiveClock /></span>
          <span style={{ color: C.txtD }}>VISITORS <LiveVisitors /></span>
        </div>
        <div style={{ display: "flex", gap: 36, opacity: 0.3 }}>{["StyleVault", "MediBook", "FinTrack", "RetailMax"].map(c => <span key={c} style={{ fontSize: 12.5, fontWeight: 700, color: C.txt, letterSpacing: 1 }}>{c}</span>)}</div>
      </div>
    </section>

    {/* LIVE DASHBOARD ROW */}
    <section style={{ padding: "48px 24px", maxWidth: 1240, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <FadeIn delay={0.05}><LiveGitLog /></FadeIn>
        <FadeIn delay={0.15}><SystemMetrics /></FadeIn>
        <FadeIn delay={0.25}><div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <DeployPipeline />
          <LiveCodeEditor idx={3} style={{ flex: 1 }} />
        </div></FadeIn>
      </div>
    </section>

    {/* SERVICES */}
    <section style={{ padding: "80px 24px", maxWidth: 1240, margin: "0 auto" }}>
      <FadeIn><SH tag="What We Build" title="Our Core Services" sub="End-to-end software development and AI solutions tailored to your business goals." /></FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 18 }}>
        {SERVICES.map((s, i) => <FadeIn key={s.id} delay={i * 0.06}>
          <Card3D onClick={() => { setPage("Services"); scrollTo(0, 0); }} style={{ height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <span style={{ fontSize: 34, animation: "float " + (3 + i * 0.3) + "s ease-in-out " + (i * 0.2) + "s infinite" }}>{s.icon}</span>
              <span style={{ color: C.txtD, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>v{i + 1}.0</span>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: C.txt, margin: "0 0 7px" }}>{s.title}</h3>
            <p style={{ color: C.txtM, fontSize: 13.5, lineHeight: 1.6, margin: "0 0 12px" }}>{s.short}</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{s.tech.slice(0, 3).map(t => <Badge key={t}>{t}</Badge>)}</div>
          </Card3D>
        </FadeIn>)}
      </div>
    </section>

    {/* STATS */}
    <section style={{ padding: "60px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18, textAlign: "center" }}>
        {[{ n: 50, s: "+", l: "Projects Deployed", ic: "\u{1F680}" }, { n: 15, s: "+", l: "AI Agents Live", ic: "\u{1F916}" }, { n: 98, s: "%", l: "Client Satisfaction", ic: "\u2B50" }, { n: 5, s: "+", l: "Countries Served", ic: "\u{1F30D}" }].map((st, i) => <FadeIn key={i} delay={i * 0.08} dir="scale">
          <Card3D intensity={10}>
            <span style={{ fontSize: 22, display: "block", marginBottom: 6, animation: "float " + (3 + i * 0.3) + "s ease-in-out infinite" }}>{st.ic}</span>
            <div style={{ fontSize: 36, fontWeight: 800, color: C.cyan, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace", textShadow: "0 0 30px " + C.cyanG }}><Counter end={st.n} suf={st.s} /></div>
            <p style={{ color: C.txtM, fontSize: 12.5, margin: 0 }}>{st.l}</p>
          </Card3D>
        </FadeIn>)}
      </div>
    </section>

    {/* PORTFOLIO */}
    <section style={{ padding: "60px 24px", maxWidth: 1240, margin: "0 auto" }}>
      <FadeIn><SH tag="Our Work" title="Featured Projects" /></FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 18 }}>
        {PORTFOLIO.slice(0, 3).map((p, i) => <FadeIn key={p.id} delay={i * 0.1} dir={["left", "up", "right"][i]}>
          <Card3D onClick={() => { setPage("Portfolio"); scrollTo(0, 0); }}>
            <div style={{ height: 160, borderRadius: 10, background: "rgba(5,8,16,0.92)", border: "1px solid " + C.border, marginBottom: 14, overflow: "hidden", position: "relative" }}>
              <div style={{ padding: "7px 11px", borderBottom: "1px solid " + C.border, display: "flex", gap: 5, alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FBBF24" }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80" }} />
                <span style={{ color: C.txtD, fontSize: 9.5, fontFamily: "'JetBrains Mono',monospace", marginLeft: 6 }}>{p.title.toLowerCase().replace(/\s/g, "-")}.tsx</span>
              </div>
              <div style={{ padding: "8px 11px", fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, lineHeight: 1.55, color: C.txtD, whiteSpace: "pre", overflow: "hidden" }}>
                {SNIPPETS[(i + 1) % SNIPPETS.length].split("\n").map((ln, li) => <div key={li}><span style={{ opacity: 0.3, marginRight: 10 }}>{li + 1}</span><span style={{ color: li === 0 ? C.violet : li % 2 === 0 ? C.lime : C.cyan }}>{ln}</span></div>)}
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 36, background: "linear-gradient(transparent,rgba(5,8,16,0.96))" }} />
            </div>
            <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}><Badge>{p.cat}</Badge>{p.tech.slice(0, 2).map(t => <Badge key={t}>{t}</Badge>)}</div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: C.txt, margin: "0 0 6px" }}>{p.title}</h3>
            <p style={{ color: C.txtM, fontSize: 13.5, lineHeight: 1.6, margin: "0 0 10px" }}>{p.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Dot c={C.lime} /><p style={{ color: C.lime, fontSize: 12.5, fontWeight: 600, margin: 0 }}>{p.result}</p></div>
          </Card3D>
        </FadeIn>)}
      </div>
    </section>

    {/* TESTIMONIALS */}
    <section style={{ padding: "60px 24px", maxWidth: 1240, margin: "0 auto" }}>
      <FadeIn><SH tag="Testimonials" title="What Our Clients Say" /></FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 18 }}>
        {TESTIMONIALS.map((t, i) => <FadeIn key={i} delay={i * 0.07}>
          <Card3D intensity={10} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: "#FBBF24", fontSize: 13 }}>{"\u2605"}</span>)}</div>
            <p style={{ color: C.txtM, fontSize: 14, lineHeight: 1.7, flex: 1, margin: "0 0 18px", fontStyle: "italic" }}>"{t.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg," + C.cyan + "," + C.violet + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>{t.av}</div>
              <div><p style={{ color: C.txt, fontSize: 13, fontWeight: 600, margin: 0 }}>{t.name}</p><p style={{ color: C.txtD, fontSize: 11, margin: 0 }}>{t.role}</p></div>
            </div>
          </Card3D>
        </FadeIn>)}
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "60px 24px", textAlign: "center" }}>
      <FadeIn dir="scale">
        <Card3D intensity={8} style={{ maxWidth: 700, margin: "0 auto", padding: 44, background: "linear-gradient(135deg,rgba(0,234,255,0.05),rgba(168,85,247,0.05))" }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 700, color: C.txt, margin: "0 0 12px" }}>Ready to Build Something Amazing?</h2>
          <p style={{ color: C.txtM, fontSize: 15, marginBottom: 26 }}>Let's discuss your project and turn your vision into reality.</p>
          <Btn primary onClick={() => { setPage("Contact"); scrollTo(0, 0); }}>Start Your Project {"\u2192"}</Btn>
        </Card3D>
      </FadeIn>
    </section>
  </>);
}

/* ═══════════════════ ABOUT PAGE ═══════════════════ */
function AboutPage() {
  const vals = [
    { ic: "\u26A1", t: "Innovation First", d: "We stay ahead of technology trends to deliver cutting-edge solutions." },
    { ic: "\u{1F3AF}", t: "Client-Centric", d: "Every decision is driven by what creates the most value for our clients." },
    { ic: "\u{1F512}", t: "Quality & Security", d: "Production-grade code with security best practices built in from day one." },
    { ic: "\u{1F91D}", t: "Transparency", d: "Open communication, honest timelines, and no hidden surprises." },
    { ic: "\u{1F680}", t: "Scalability", d: "Architecture designed to grow seamlessly with your business." },
    { ic: "\u{1F9E0}", t: "AI-Native Thinking", d: "We integrate AI capabilities wherever they amplify human productivity." },
  ];
  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <FadeIn dir="scale">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 20, background: "rgba(0,234,255,0.07)", border: "1px solid rgba(0,234,255,0.12)", marginBottom: 18 }}><Dot /><span style={{ color: C.cyan, fontSize: 12.5 }}>About Us</span></div>
        <h1 style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 800, color: C.txt, margin: "0 0 22px" }}>The Team Behind CodeGloFix</h1>
        <p style={{ color: C.txtM, fontSize: 16, lineHeight: 1.8, marginBottom: 44 }}>Founded with a singular mission \u2014 to bridge complex technology and real business impact. CodeGloFix Pvt Ltd partners with startups, SMBs, and international businesses to build digital products that move the needle.</p>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginBottom: 56 }}>
        <FadeIn delay={0.1} dir="left"><Card3D style={{ borderLeft: "3px solid " + C.cyan }}><h3 style={{ color: C.cyan, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" }}>Our Mission</h3><p style={{ color: C.txtM, fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>To empower businesses worldwide with intelligent, scalable software solutions that drive measurable growth.</p></Card3D></FadeIn>
        <FadeIn delay={0.2} dir="right"><Card3D style={{ borderLeft: "3px solid " + C.violet }}><h3 style={{ color: C.violet, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" }}>Our Vision</h3><p style={{ color: C.txtM, fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>To become the go-to technology partner for businesses harnessing modern software and artificial intelligence.</p></Card3D></FadeIn>
      </div>
      <FadeIn><SH tag="Core Values" title="What Drives Us" /></FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
        {vals.map((v, i) => <FadeIn key={i} delay={i * 0.06}><Card3D><span style={{ fontSize: 26, display: "block", marginBottom: 10, animation: "float " + (3 + i * 0.3) + "s ease-in-out infinite" }}>{v.ic}</span><h3 style={{ fontSize: 15, fontWeight: 600, color: C.txt, margin: "0 0 6px" }}>{v.t}</h3><p style={{ color: C.txtM, fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{v.d}</p></Card3D></FadeIn>)}
      </div>
      <FadeIn><div style={{ marginTop: 56 }}><SH tag="Why Us" title="Why Choose CodeGloFix?" />
        {["Full-stack expertise across web, mobile, and AI \u2014 one team, complete solutions", "Proven track record with 50+ projects across 5+ countries", "Agile development with transparent sprint-based delivery", "Post-launch support and maintenance included in every engagement", "AI-native approach \u2014 smart automation wherever it adds value"].map((item, i) => <FadeIn key={i} delay={i * 0.05} dir="left"><div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}><Dot c={C.lime} /><p style={{ color: C.txtM, fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{item}</p></div></FadeIn>)}
      </div></FadeIn>
    </section>
  );
}

/* ═══════════════════ SERVICES PAGE ═══════════════════ */
function ServicesPage() {
  const [act, setAct] = useState(null);
  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeIn dir="scale"><SH tag="Services" title="What We Build" sub="Comprehensive software development and AI services tailored to your business needs." /></FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 18 }}>
        {SERVICES.map((s, i) => <FadeIn key={s.id} delay={i * 0.06}>
          <Card3D onClick={() => setAct(act === s.id ? null : s.id)} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 34, animation: "float " + (3 + i * 0.3) + "s ease-in-out infinite" }}>{s.icon}</span>
              <span style={{ color: C.txtD, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>module.{s.id}</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: C.txt, margin: "0 0 8px" }}>{s.title}</h3>
            <p style={{ color: C.txtM, fontSize: 13.5, lineHeight: 1.6, margin: "0 0 14px" }}>{s.short}</p>
            <div style={{ maxHeight: act === s.id ? 300 : 0, overflow: "hidden", transition: "max-height .5s cubic-bezier(.16,1,.3,1), opacity .4s", opacity: act === s.id ? 1 : 0 }}>
              <div style={{ borderTop: "1px solid " + C.border, paddingTop: 14, marginTop: 6 }}>
                <h4 style={{ color: C.cyan, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" }}>Benefits</h4>
                {s.benefits.map((b, j) => <div key={j} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 4 }}><Dot c={C.cyan} /><span style={{ color: C.txtM, fontSize: 12.5 }}>{b}</span></div>)}
                <h4 style={{ color: C.violet, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "12px 0 8px" }}>Technologies</h4>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{s.tech.map(t => <Badge key={t}>{t}</Badge>)}</div>
              </div>
            </div>
            <span style={{ color: C.cyan, fontSize: 12, fontWeight: 500, display: "block", marginTop: 10 }}>{act === s.id ? "\u2190 collapse" : "expand \u2192"}</span>
          </Card3D>
        </FadeIn>)}
      </div>
    </section>
  );
}

/* ═══════════════════ PORTFOLIO PAGE ═══════════════════ */
function PortfolioPage() {
  const [f, setF] = useState("All");
  const cats = ["All", "Web", "Mobile", "AI"];
  const fl = f === "All" ? PORTFOLIO : PORTFOLIO.filter(p => p.cat === f);
  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 1240, margin: "0 auto" }}>
      <FadeIn><SH tag="Portfolio" title="Our Work Speaks" sub="Case studies from real projects." /></FadeIn>
      <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
        {cats.map(c => <button key={c} onClick={() => setF(c)} style={{ padding: "7px 18px", borderRadius: 20, border: "1px solid " + (f === c ? C.cyan : C.border), background: f === c ? "rgba(0,234,255,0.08)" : "transparent", color: f === c ? C.cyan : C.txtM, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .3s" }}>{c}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 18 }}>
        {fl.map((p, i) => <FadeIn key={p.id} delay={i * 0.07}>
          <Card3D>
            <div style={{ height: 140, borderRadius: 10, background: "rgba(5,8,16,0.92)", border: "1px solid " + C.border, marginBottom: 14, overflow: "hidden", position: "relative" }}>
              <div style={{ padding: "5px 9px", borderBottom: "1px solid " + C.border, display: "flex", gap: 4, alignItems: "center" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444" }} /><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FBBF24" }} /><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
                <span style={{ color: C.txtD, fontSize: 8.5, fontFamily: "'JetBrains Mono',monospace", marginLeft: 5 }}>{p.title.toLowerCase().replace(/\s/g, "-")}.tsx</span>
              </div>
              <div style={{ padding: "6px 9px", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, lineHeight: 1.5, color: C.txtD, whiteSpace: "pre", overflow: "hidden" }}>
                {SNIPPETS[(i + 2) % SNIPPETS.length].split("\n").map((ln, li) => <div key={li}><span style={{ opacity: 0.3, marginRight: 8 }}>{li + 1}</span><span style={{ color: li === 0 ? C.violet : C.cyan }}>{ln}</span></div>)}
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 28, background: "linear-gradient(transparent,rgba(5,8,16,0.96))" }} />
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 7, flexWrap: "wrap" }}><Badge>{p.cat}</Badge>{p.tech.map(t => <Badge key={t}>{t}</Badge>)}</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.txt, margin: "0 0 3px" }}>{p.title}</h3>
            <p style={{ color: C.txtD, fontSize: 11, margin: "0 0 6px", fontFamily: "'JetBrains Mono',monospace" }}>client: {p.client}</p>
            <p style={{ color: C.txtM, fontSize: 13.5, lineHeight: 1.6, margin: "0 0 10px" }}>{p.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}><Dot c={C.lime} /><p style={{ color: C.lime, fontSize: 12, fontWeight: 600, margin: 0 }}>{p.result}</p></div>
          </Card3D>
        </FadeIn>)}
      </div>
    </section>
  );
}

/* ═══════════════════ AI SOLUTIONS PAGE ═══════════════════ */
function AIPage({ setPage }) {
  const sols = [
    { ic: "\u{1F916}", t: "Custom AI Agents", d: "Autonomous agents handling complex multi-step tasks.", u: "Lead qualification reduced manual work by 75%." },
    { ic: "\u26A1", t: "Workflow Automation", d: "End-to-end automation pipelines.", u: "Invoice processing: 4 hours to 15 minutes." },
    { ic: "\u{1F4AC}", t: "Intelligent Chatbots", d: "Context-aware natural language chatbots.", u: "80% support resolution rate improvement." },
    { ic: "\u{1F4CA}", t: "AI Analytics", d: "Predictive models and anomaly detection.", u: "92% early churn prediction accuracy." },
    { ic: "\u{1F4C4}", t: "Document Processing", d: "Extract and classify documents at scale.", u: "Contract review: 2 days to 30 minutes." },
    { ic: "\u{1F517}", t: "AI Integration", d: "Embed AI into your existing stack.", u: "Legacy CRM enhanced with AI lead scoring." },
  ];
  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <FadeIn dir="scale">
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 20, background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.12)", marginBottom: 14 }}><Dot c={C.violet} /><span style={{ color: C.violet, fontSize: 12.5 }}>AI Solutions</span></div>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 800, color: C.txt, margin: "0 0 14px", lineHeight: 1.1 }}>AI-Powered Solutions for <span style={{ color: C.cyan }}>Modern Business</span></h1>
          <p style={{ color: C.txtM, fontSize: 16, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>From intelligent chatbots to autonomous agents, we build AI solutions that automate and scale.</p>
        </div>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 18, marginBottom: 60 }}>
        {sols.map((s, i) => <FadeIn key={i} delay={i * 0.06}><Card3D style={{ height: "100%" }}>
          <span style={{ fontSize: 30, display: "block", marginBottom: 12, animation: "float " + (3 + i * 0.3) + "s ease-in-out infinite" }}>{s.ic}</span>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: C.txt, margin: "0 0 7px" }}>{s.t}</h3>
          <p style={{ color: C.txtM, fontSize: 13.5, lineHeight: 1.6, margin: "0 0 14px" }}>{s.d}</p>
          <div style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(74,222,128,0.05)", borderLeft: "3px solid " + C.lime }}><div style={{ display: "flex", alignItems: "center", gap: 5 }}><Dot c={C.lime} /><p style={{ color: C.lime, fontSize: 12, fontWeight: 500, margin: 0 }}>{s.u}</p></div></div>
        </Card3D></FadeIn>)}
      </div>
      <FadeIn><div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 48 }}>{["OpenAI","LangChain","Python","TensorFlow","n8n","Hugging Face","FastAPI","Pinecone","Redis","Docker"].map(t => <Badge key={t}>{t}</Badge>)}</div></FadeIn>
      <FadeIn dir="scale"><Card3D intensity={8} style={{ textAlign: "center", padding: 44, background: "linear-gradient(135deg,rgba(0,234,255,0.04),rgba(168,85,247,0.04))" }}><h2 style={{ fontSize: 26, fontWeight: 700, color: C.txt, margin: "0 0 14px" }}>Let's Build Your AI Solution</h2><p style={{ color: C.txtM, fontSize: 15, marginBottom: 24 }}>Tell us about your automation challenges.</p><Btn primary onClick={() => { setPage("Contact"); scrollTo(0, 0); }}>Start a Conversation {"\u2192"}</Btn></Card3D></FadeIn>
    </section>
  );
}

/* ═══════════════════ BLOG PAGE ═══════════════════ */
function BlogPage() {
  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
      <FadeIn><SH tag="Blog" title="Insights & Perspectives" sub="Technical articles and practical guides." /></FadeIn>
      <div style={{ display: "grid", gap: 18 }}>
        {BLOGS.map((p, i) => <FadeIn key={p.id} delay={i * 0.07} dir={i % 2 === 0 ? "left" : "right"}>
          <Card3D style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ width: 110, height: 80, borderRadius: 10, background: "rgba(5,8,16,0.92)", border: "1px solid " + C.border, flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "3px 7px", borderBottom: "1px solid " + C.border, display: "flex", gap: 2.5 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: "#EF4444" }} /><div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FBBF24" }} /><div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80" }} /></div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 22, opacity: 0.35 }}>{"\u{1F4DD}"}</span></div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}><Badge>{p.cat}</Badge><span style={{ color: C.txtD, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>{p.date}</span><span style={{ color: C.txtD, fontSize: 10 }}>{p.rt} read</span></div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: C.txt, margin: "0 0 6px", lineHeight: 1.3 }}>{p.title}</h3>
              <p style={{ color: C.txtM, fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{p.ex}</p>
            </div>
          </Card3D>
        </FadeIn>)}
      </div>
    </section>
  );
}

/* ═══════════════════ CONTACT PAGE ═══════════════════ */
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
  const [status, setStatus] = useState(null);
  const [errs, setErrs] = useState({});
  const validate = () => { const e = {}; if (!form.name.trim()) e.name = "Required"; if (!form.email.trim()) e.email = "Required"; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid"; if (!form.message.trim()) e.message = "Required"; setErrs(e); return !Object.keys(e).length; };
  const sub = ev => { ev.preventDefault(); if (!validate()) return; setStatus("sending"); setTimeout(() => setStatus("success"), 1500); };
  const iS = { width: "100%", padding: "13px 15px", borderRadius: 12, fontSize: 14.5, border: "1px solid " + C.border, background: "rgba(255,255,255,0.025)", color: C.txt, outline: "none", transition: "border .3s, box-shadow .3s", boxSizing: "border-box", fontFamily: "inherit" };
  if (status === "success") return <section style={{ padding: "120px 24px 80px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}><FadeIn dir="scale"><div style={{ fontSize: 56, marginBottom: 18, textShadow: "0 0 40px " + C.limeG }}>{"\u2713"}</div><h2 style={{ fontSize: 30, fontWeight: 700, color: C.txt, marginBottom: 14 }}>Message Sent!</h2><p style={{ color: C.txtM, fontSize: 16, lineHeight: 1.7 }}>We'll get back to you within 24 hours.</p></FadeIn></section>;
  return (
    <section style={{ padding: "120px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <FadeIn><SH tag="Contact" title="Let's Build Together" sub="Tell us about your project." /></FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 28 }}>
        <FadeIn delay={0.1}><Card3D hover={false} intensity={4}><form onSubmit={sub}><div style={{ display: "grid", gap: 12 }}>
          {[{ k: "name", l: "Name *", t: "text", p: "Your name" }, { k: "email", l: "Email *", t: "email", p: "you@company.com" }, { k: "phone", l: "Phone", t: "text", p: "+1 (555) 000-0000" }].map(f => <div key={f.k}><label style={{ display: "block", color: C.txtM, fontSize: 11, fontWeight: 500, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace" }}>{f.l}</label><input type={f.t} style={{ ...iS, borderColor: errs[f.k] ? C.red : C.border }} value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} placeholder={f.p} />{errs[f.k] && <span style={{ color: C.red, fontSize: 10, marginTop: 2, display: "block" }}>{errs[f.k]}</span>}</div>)}
          <div><label style={{ display: "block", color: C.txtM, fontSize: 11, fontWeight: 500, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace" }}>Service</label><select style={{ ...iS, appearance: "none" }} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}><option value="">Select a service</option>{SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></div>
          <div><label style={{ display: "block", color: C.txtM, fontSize: 11, fontWeight: 500, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace" }}>Budget</label><select style={{ ...iS, appearance: "none" }} value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}><option value="">Select range</option><option>$5K - $15K</option><option>$15K - $50K</option><option>$50K - $100K</option><option>$100K+</option></select></div>
          <div><label style={{ display: "block", color: C.txtM, fontSize: 11, fontWeight: 500, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace" }}>Message *</label><textarea rows={4} style={{ ...iS, resize: "vertical", borderColor: errs.message ? C.red : C.border }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your project..." />{errs.message && <span style={{ color: C.red, fontSize: 10, marginTop: 2, display: "block" }}>{errs.message}</span>}</div>
          <Btn primary style={{ width: "100%", opacity: status === "sending" ? 0.7 : 1 }}>{status === "sending" ? "Deploying..." : "Send Message \u2192"}</Btn>
        </div></form></Card3D></FadeIn>
        <FadeIn delay={0.2}><div style={{ display: "grid", gap: 14 }}>
          <Card3D><h3 style={{ fontSize: 14, fontWeight: 600, color: C.txt, margin: "0 0 12px" }}>Get in Touch</h3>{[{ l: "EMAIL", v: "hello@codeglofix.com" }, { l: "PHONE", v: "+94 11 234 5678" }, { l: "LOCATION", v: "Colombo, Sri Lanka" }, { l: "HOURS", v: "Mon\u2013Fri, 9 AM \u2013 6 PM IST" }].map(it => <div key={it.l} style={{ marginBottom: 10 }}><p style={{ color: C.txtD, fontSize: 9.5, fontWeight: 600, letterSpacing: 2, fontFamily: "'JetBrains Mono',monospace", margin: "0 0 2px" }}>{it.l}</p><p style={{ color: C.txt, fontSize: 13.5, margin: 0 }}>{it.v}</p></div>)}</Card3D>
          <Card3D><h3 style={{ fontSize: 14, fontWeight: 600, color: C.txt, margin: "0 0 12px" }}>Follow Us</h3><div style={{ display: "flex", gap: 8 }}>{["LinkedIn","Twitter","GitHub","Dribbble"].map(s => <span key={s} style={{ padding: "6px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid " + C.border, color: C.txtM, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>{s}</span>)}</div></Card3D>
          <SystemMetrics />
        </div></FadeIn>
      </div>
    </section>
  );
}

/* ═══════════════════ FOOTER ═══════════════════ */
function Footer({ setPage }) {
  const go = p => { setPage(p); scrollTo(0, 0); };
  return (
    <footer style={{ borderTop: "1px solid " + C.border, padding: "56px 24px 28px", marginTop: 32, position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 36, marginBottom: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg," + C.cyan + "," + C.violet + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff" }}>C</div>
              <span style={{ fontSize: 17, fontWeight: 700, color: C.txt }}>CodeGlo<span style={{ color: C.cyan }}>Fix</span></span>
            </div>
            <p style={{ color: C.txtM, fontSize: 13.5, lineHeight: 1.7, maxWidth: 260 }}>Building smart digital solutions with code and AI. Your trusted software partner.</p>
          </div>
          <div>
            <h4 style={{ color: C.txt, fontSize: 12, fontWeight: 600, marginBottom: 14, letterSpacing: 1 }}>COMPANY</h4>
            {["About","Services","Portfolio","Blog","Contact"].map(l => <p key={l} onClick={() => go(l)} style={{ color: C.txtM, fontSize: 13, margin: "0 0 8px", cursor: "pointer" }}>{l}</p>)}
          </div>
          <div>
            <h4 style={{ color: C.txt, fontSize: 12, fontWeight: 600, marginBottom: 14, letterSpacing: 1 }}>SERVICES</h4>
            {SERVICES.slice(0, 4).map(s => <p key={s.id} style={{ color: C.txtM, fontSize: 13, margin: "0 0 8px" }}>{s.title}</p>)}
          </div>
          <div>
            <h4 style={{ color: C.txt, fontSize: 12, fontWeight: 600, marginBottom: 14, letterSpacing: 1 }}>CONNECT</h4>
            <p style={{ color: C.txtM, fontSize: 13, margin: "0 0 8px" }}>hello@codeglofix.com</p>
            <p style={{ color: C.txtM, fontSize: 13, margin: "0 0 8px" }}>+94 11 234 5678</p>
            <p style={{ color: C.txtM, fontSize: 13, margin: "0 0 8px" }}>Colombo, Sri Lanka</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 14 }}><Dot /><span style={{ color: C.txtD, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>systems operational</span></div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid " + C.border, paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: C.txtD, fontSize: 12, margin: 0 }}>{"\u00A9"} 2026 CodeGloFix Pvt Ltd. All rights reserved.</p>
          <div style={{ display: "flex", gap: 18 }}><span style={{ color: C.txtD, fontSize: 12 }}>Privacy Policy</span><span style={{ color: C.txtD, fontSize: 12 }}>Terms of Service</span></div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════ APP ═══════════════════ */
export default function App() {
  const [page, setPage] = useState("Home");
  const rp = () => {
    switch (page) {
      case "Home": return <HomePage setPage={setPage} />;
      case "About": return <AboutPage />;
      case "Services": return <ServicesPage />;
      case "Portfolio": return <PortfolioPage />;
      case "AI Solutions": return <AIPage setPage={setPage} />;
      case "Blog": return <BlogPage />;
      case "Contact": return <ContactPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };
  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.txt, fontFamily: "'Outfit',-apple-system,BlinkMacSystemFont,sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg};overflow-x:hidden}
        ::selection{background:rgba(0,234,255,0.25)}
        input,select,textarea,button{font-family:inherit}
        select option{background:#0a1020;color:#fff}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:rgba(0,234,255,0.15);border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(0,234,255,0.3)}
        input:focus,select:focus,textarea:focus{border-color:${C.cyan}!important;box-shadow:0 0 0 3px rgba(0,234,255,0.1),0 0 24px rgba(0,234,255,0.04)!important}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{opacity:.55;box-shadow:0 0 4px currentColor}50%{opacity:1;box-shadow:0 0 14px currentColor}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes termIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pipeSlide{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        @keyframes glitch1{0%{clip-path:inset(0 0 85% 0)}20%{clip-path:inset(15% 0 65% 0)}40%{clip-path:inset(40% 0 45% 0)}60%{clip-path:inset(60% 0 20% 0)}80%{clip-path:inset(80% 0 5% 0)}100%{clip-path:inset(0 0 85% 0)}}
        @keyframes glitch2{0%{clip-path:inset(85% 0 0 0)}25%{clip-path:inset(65% 0 15% 0)}50%{clip-path:inset(45% 0 40% 0)}75%{clip-path:inset(20% 0 60% 0)}100%{clip-path:inset(85% 0 0 0)}}
        @keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
        @media(max-width:768px){.navD{display:none!important}.navM{display:block!important}}
        @media(max-width:900px){section>div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}section>div[style*="gridTemplateColumns:\"1fr 1fr\""]{grid-template-columns:1fr!important}}
      `}</style>
      <CodeRain />
      <ParticleBG />
      {/* Scan line overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", opacity: 0.03 }}>
        <div style={{ width: "100%", height: 2, background: "rgba(0,234,255,0.8)", animation: "scanline 8s linear infinite" }} />
      </div>
      <Navbar page={page} setPage={setPage} />
      <main style={{ position: "relative", zIndex: 1 }}>{rp()}</main>
      <Footer setPage={setPage} />
    </div>
  );
}
