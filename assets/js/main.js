/* 7ohax Drive: scroll-driven 3D portfolio. Content lives in content.js. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  var PAL = ['#c6ff3d', '#35e8ff', '#ff3d9a', '#ffb21f', '#9a6bff'];
  function $(id) { return document.getElementById(id); }
  function h(tag, attrs) {
    var e = document.createElement(tag);
    for (var k in (attrs || {})) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    for (var i = 2; i < arguments.length; i++) { if (arguments[i] != null) e.append(arguments[i]); }
    return e;
  }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

  /* ---------- Content ---------- */
  var heroName = $('heroName'); heroName.setAttribute('aria-label', PROFILE.name + '.');
  (PROFILE.name.toUpperCase() + '.').split('').forEach(function (ch, i) {
    heroName.append(h('span', { class: 'l', 'aria-hidden': 'true', style: '--i:' + i }, ch));
  });
  $('heroSub').append(PROFILE.role + ' · ', h('em', {}, '@' + PROFILE.handle), ' · ' + PROFILE.tagline);
  $('nextTitle').textContent = PROJECTS[0].title;
  $('msgName').textContent = PROFILE.name;
  $('msgBy').textContent = '@' + PROFILE.handle;
  $('mail').textContent = PROFILE.email;
  $('yr').textContent = new Date().getFullYear();

  var stageEls = [];
  PROJECTS.forEach(function (p, i) {
    var tags = h('ul', { class: 'tags' });
    p.stack.forEach(function (s) { tags.append(h('li', {}, s)); });
    var sec = h('section', { class: 'stage pad ' + (i % 2 === 0 ? 'left' : 'right'), id: 'p' + (i + 1), style: '--acc:' + PAL[i % PAL.length] },
      h('div', { class: 'panel rv' },
        h('p', { class: 'num' }, '0' + (i + 1)),
        h('h2', {}, p.title), h('p', { class: 'text' }, p.text), tags,
        h('a', { class: 'btn', href: p.href, target: '_blank', rel: 'noopener' }, 'View project ↗')
      )
    );
    $('stages').append(sec); stageEls.push(sec);
  });
  var words = [];
  PROFILE.message.split(' ').forEach(function (w, i, arr) {
    var sp = h('span', { class: 'w' }, w); words.push(sp); $('msgText').append(sp); if (i < arr.length - 1) $('msgText').append(' ');
  });
  PROFILE.onTrack.forEach(function (t) { $('onTrack').append(h('li', {}, t)); });
  PROFILE.offTrack.forEach(function (t) { $('offTrack').append(h('li', {}, t)); });
  PROFILE.tools.forEach(function (t, i) { $('toolsGrid').append(h('div', { style: '--acc:' + PAL[i % PAL.length] }, t)); });
  PROFILE.links.forEach(function (l, i) {
    $('linksGrid').append(h('a', { href: l.href, target: '_blank', rel: 'noopener', class: 'rv', style: '--acc:' + PAL[(i + 1) % PAL.length] }, h('span', {}, 'Open ↗'), h('strong', {}, l.label)));
  });
  HALL.forEach(function (c, i) {
    var col = PAL[i % PAL.length], from = (i * 70) % 360;
    var emb = 'conic-gradient(from ' + from + 'deg, ' + col + ', #0b0914 38%, #f2f3fb 58%, #0b0914 78%, ' + col + ')';
    var card = h('button', { class: 'hcard', type: 'button', 'aria-label': c.year + ' ' + c.title, style: '--acc:' + col },
      h('div', { class: 'face front' }, h('div', { class: 'yr' }, c.year), h('div', { class: 'emblem', style: 'background:' + emb }), h('h3', {}, c.title)),
      h('div', { class: 'face back' }, h('div', {}, h('h3', {}, c.title), h('p', {}, c.text)), h('div', { class: 'hint' }, c.year + ' · Hall of fame'))
    );
    card.addEventListener('click', function () { card.classList.toggle('on'); });
    $('hallRow').append(card);
  });
  [$('tickRow1'), $('tickRow2')].forEach(function (row, r) {
    var words2 = [PROFILE.handle.toUpperCase(), 'Always shipping', 'Hackathon mode', 'Web + App', 'Idea to prototype'];
    for (var c = 0; c < 4; c++) words2.forEach(function (t, i) {
      row.append(h('span', { class: 't' + (i % 3) , style: '--acc:' + PAL[(i + r) % PAL.length] }, t), h('i', { style: '--acc:' + PAL[(i + r + 2) % PAL.length] }));
    });
  });
  var copyBtn = $('copyBtn');
  copyBtn.addEventListener('click', function () {
    var done = function () { copyBtn.textContent = 'Copied'; setTimeout(function () { copyBtn.textContent = 'Copy email'; }, 1500); };
    var fallback = function () {
      var r = document.createRange(); r.selectNodeContents($('mail'));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      copyBtn.textContent = 'Press copy';
    };
    try { navigator.clipboard.writeText(PROFILE.email).then(done, fallback); } catch (e) { fallback(); }
  });
  var rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.1 });
    for (var ri = 0; ri < rvs.length; ri++) io.observe(rvs[ri]);
  } else { for (var rj = 0; rj < rvs.length; rj++) rvs[rj].classList.add('in'); }

  var cglow = $('cglow');
  window.addEventListener('pointermove', function (e) { cglow.style.setProperty('--cx', e.clientX + 'px'); cglow.style.setProperty('--cy', e.clientY + 'px'); }, { passive: true });

  var ledsEl = $('leds'), ledEls = [];
  for (var li0 = 0; li0 < 14; li0++) { var le = h('i'); ledsEl.append(le); ledEls.push(le); }

  /* ---------- Audio: gearbox engine, turbo, wind, pass-by whoosh, exhaust pops ---------- */
  var soundOn = false, audio = { ctx: null };
  function initAudio() {
    if (audio.ctx) return true;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      var c = new AC();
      var master = c.createGain(); master.gain.value = 0;
      var comp = c.createDynamicsCompressor(); master.connect(comp); comp.connect(c.destination);
      var len = c.sampleRate * 2, nb = c.createBuffer(1, len, c.sampleRate), d = nb.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      var e1 = c.createOscillator(); e1.type = 'sawtooth'; e1.frequency.value = 40;
      var e2 = c.createOscillator(); e2.type = 'square'; e2.frequency.value = 40.3;
      var e3 = c.createOscillator(); e3.type = 'triangle'; e3.frequency.value = 80;
      var ef = c.createBiquadFilter(); ef.type = 'lowpass'; ef.frequency.value = 220; ef.Q.value = 3;
      var eg = c.createGain(); eg.gain.value = 0.04;
      e1.connect(ef); e2.connect(ef); e3.connect(ef); ef.connect(eg); eg.connect(master); e1.start(); e2.start(); e3.start();
      var tb = c.createOscillator(); tb.type = 'sine'; tb.frequency.value = 1200;
      var tg = c.createGain(); tg.gain.value = 0; tb.connect(tg); tg.connect(master); tb.start();
      var ws = c.createBufferSource(); ws.buffer = nb; ws.loop = true;
      var wb = c.createBiquadFilter(); wb.type = 'bandpass'; wb.frequency.value = 500; wb.Q.value = 0.6;
      var wg = c.createGain(); wg.gain.value = 0; ws.connect(wb); wb.connect(wg); wg.connect(master); ws.start();
      audio = { ctx: c, master: master, nb: nb, e1: e1, e2: e2, e3: e3, ef: ef, eg: eg, tb: tb, tg: tg, wb: wb, wg: wg };
      return true;
    } catch (e) { audio = { ctx: null }; return false; }
  }
  function audioUpdate(rpm, sn, thr) {
    if (!audio.ctx || !soundOn) return;
    try {
      var t = audio.ctx.currentTime, f = 34 + rpm * 200;
      audio.e1.frequency.setTargetAtTime(f, t, 0.05); audio.e2.frequency.setTargetAtTime(f * 1.006, t, 0.05); audio.e3.frequency.setTargetAtTime(f * 2.01, t, 0.05);
      audio.ef.frequency.setTargetAtTime(180 + rpm * 1500, t, 0.08);
      audio.eg.gain.setTargetAtTime(0.04 + rpm * 0.08 + thr * 0.05, t, 0.08);
      audio.tb.frequency.setTargetAtTime(900 + rpm * 2400, t, 0.08); audio.tg.gain.setTargetAtTime(thr * 0.012, t, 0.1);
      audio.wg.gain.setTargetAtTime(sn * 0.16, t, 0.15); audio.wb.frequency.setTargetAtTime(400 + sn * 1400, t, 0.15);
    } catch (e) {}
  }
  function audioWhoosh(sn) {
    if (!audio.ctx || !soundOn) return;
    try {
      var c = audio.ctx, t0 = c.currentTime, s = c.createBufferSource(); s.buffer = audio.nb;
      var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(500, t0); bp.frequency.exponentialRampToValueAtTime(2200, t0 + 0.28); bp.frequency.exponentialRampToValueAtTime(300, t0 + 0.7);
      var g = c.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(0.18 + sn * 0.35, t0 + 0.22); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.75);
      s.connect(bp); bp.connect(g); g.connect(audio.master); s.start(t0); s.stop(t0 + 0.8);
    } catch (e) {}
  }
  function audioPop() {
    if (!audio.ctx || !soundOn) return;
    try {
      var c = audio.ctx, t0 = c.currentTime, s = c.createBufferSource(); s.buffer = audio.nb;
      var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 260 + Math.random() * 200; bp.Q.value = 0.9;
      var g = c.createGain(); g.gain.setValueAtTime(0.5, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14);
      s.connect(bp); bp.connect(g); g.connect(audio.master); s.start(t0, Math.random()); s.stop(t0 + 0.16);
    } catch (e) {}
  }
  var snd = $('snd');
  function setSound(on) {
    if (on) { if (!initAudio()) on = false; else { try { if (audio.ctx.state === 'suspended') audio.ctx.resume(); } catch (e) {} } }
    soundOn = on;
    snd.classList.toggle('on', on); snd.setAttribute('aria-pressed', on ? 'true' : 'false');
    snd.setAttribute('aria-label', on ? 'Sound is on. Turn sound off' : 'Sound is off. Turn sound on');
    if (audio.ctx) { try { audio.master.gain.setTargetAtTime(on ? 0.85 : 0, audio.ctx.currentTime, 0.15); } catch (e) {} }
  }
  var gate = $('gate');
  document.documentElement.classList.add('locked');
  function choose(on) {
    setSound(on);
    document.documentElement.classList.remove('locked');
    gate.classList.add('out');
    heroName.classList.add('go');
    setTimeout(function () { gate.hidden = true; }, 950);
  }
  $('withSound').addEventListener('click', function () { choose(true); });
  $('noSound').addEventListener('click', function () { choose(false); });
  snd.addEventListener('click', function () { setSound(!soundOn); });
  try { $('withSound').focus({ preventScroll: true }); } catch (e) {}

  /* ---------- Sound wave toggle: colourful and moving when on, dim white and still when off ---------- */
  var wA = $('wA'), wB = $('wB'), wGrad = $('wg'), wAmp = 0.32, wSpd = 0, wPh = 0, wLast = 0;
  function waveTick(now, sn) {
    var dt = Math.min(0.05, Math.max(0, (now - wLast) / 1000)); wLast = now;
    var tAmp = soundOn ? 0.55 + sn * 0.45 : 0.32, tSpd = (soundOn && !reduce) ? 5 + sn * 8 : 0;
    wAmp += (tAmp - wAmp) * Math.min(1, dt * 6); wSpd += (tSpd - wSpd) * Math.min(1, dt * 5); wPh += dt * wSpd;
    var A = 10 * wAmp, d1 = '', d2 = '';
    for (var x = 0; x <= 64; x += 2) {
      var env = Math.pow(Math.sin(Math.PI * x / 64), 0.8);
      d1 += (x ? 'L' : 'M') + x + ',' + (14 + A * env * Math.sin(x * 0.3 - wPh)).toFixed(2) + ' ';
      d2 += (x ? 'L' : 'M') + x + ',' + (14 + A * 0.75 * env * Math.sin(x * 0.46 + wPh * 1.3 + 1.6)).toFixed(2) + ' ';
    }
    wA.setAttribute('d', d1); wB.setAttribute('d', d2);
    if (soundOn && !reduce) wGrad.setAttribute('gradientTransform', 'translate(' + ((now / 1000 * 26) % 64).toFixed(1) + ' 0)');
  }
  waveTick(performance.now(), 0);

  /* ---------- WebGL ---------- */
  var canvas = $('gl'), renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    document.documentElement.classList.add('flat'); canvas.style.display = 'none';
    $('hud').style.display = 'none';
    window.addEventListener('scroll', updateMsg, { passive: true }); updateMsg();
    (function wl(now) { waveTick(now, 0); requestAnimationFrame(wl); })(performance.now());
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x0a0612, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  var narrow = window.innerWidth < 720;
  var K = 0.02;            /* world units per scrolled pixel */
  var LANE = -1.8;         /* drive on the left */
  var FOG_NEAR = 18, FOG_FAR = 120;
  var FOG_COL = [0.2, 0.08, 0.2];

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog(new THREE.Color(FOG_COL[0], FOG_COL[1], FOG_COL[2]), FOG_NEAR, FOG_FAR);
  var camera = new THREE.PerspectiveCamera(62, 1, 0.1, 900);
  scene.add(new THREE.HemisphereLight(0xc9a8ff, 0x4a2a46, 0.95));
  var sun = new THREE.DirectionalLight(0xffd9bd, 0.8); sun.position.set(-4, 8, 10); scene.add(sun);
  var fillL = new THREE.DirectionalLight(0x7fb0ff, 0.5); fillL.position.set(6, 3, 8); scene.add(fillL);

  /* Dusk sky with mountains, shared by the backdrop and the reflection map */
  var SKY_FRAG = [
    'varying vec3 vD;',
    'const vec3 FOGC = vec3(' + FOG_COL[0] + ', ' + FOG_COL[1] + ', ' + FOG_COL[2] + ');',
    'float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }',
    'float h1(float x) { return fract(sin(x * 127.1) * 43758.5453); }',
    'float vn1(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }',
    'void main() {',
    '  vec3 d = normalize(vD); float y = d.y;',
    '  vec3 top = vec3(0.02, 0.025, 0.09), mid = vec3(0.2, 0.07, 0.3), low = vec3(0.95, 0.3, 0.4), hot = vec3(1.0, 0.6, 0.2);',
    '  vec3 col = mix(low, mid, smoothstep(0.02, 0.26, y));',
    '  col = mix(col, top, smoothstep(0.14, 0.7, y));',
    '  col += hot * exp(-pow(y * 8.0 - 0.3, 2.0)) * 0.5;',
    '  vec3 sd = normalize(vec3(0.28, 0.07, -1.0)); float sdot = max(dot(d, sd), 0.0);',
    '  col += vec3(1.0, 0.5, 0.25) * (pow(sdot, 60.0) * 0.9 + pow(sdot, 7.0) * 0.22);',
    '  col += vec3(1.0, 0.92, 0.78) * smoothstep(0.9993, 0.9997, sdot) * 1.6;',
    '  vec3 sc = d * 480.0; vec3 sp = floor(sc); vec3 fc = fract(sc) - 0.5;',
    '  col += vec3(0.9, 0.95, 1.0) * step(0.9985, hash(sp)) * (1.0 - smoothstep(0.0, 0.28, length(fc))) * smoothstep(0.14, 0.5, y) * 0.8;',
    '  col = mix(FOGC, col, smoothstep(0.0, 0.06, y));',
    '  float az = atan(d.x, -d.z);',
    '  float m1 = 0.03 + 0.06 * vn1(az * 5.0) + 0.02 * vn1(az * 19.0);',
    '  float m2 = 0.012 + 0.04 * vn1(az * 7.0 + 9.0) + 0.012 * vn1(az * 31.0);',
    '  col = mix(col, mix(vec3(0.13, 0.05, 0.2), FOGC, 0.4), 1.0 - smoothstep(m1 - 0.004, m1 + 0.004, y));',
    '  col = mix(col, mix(vec3(0.06, 0.03, 0.1), FOGC, 0.2), 1.0 - smoothstep(m2 - 0.003, m2 + 0.003, y));',
    '  col = mix(col, FOGC, 1.0 - smoothstep(-0.02, 0.0, y));',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');
  function skyMat() {
    return new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: 'varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: SKY_FRAG
    });
  }
  var sky = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 18), skyMat());
  sky.frustumCulled = false; scene.add(sky);

  /* Reflection cube drawn on canvases (dusk sky, neon strips, soft box) so the glossy paint has something to mirror */
  function makeEnvCube() {
    var N = 256;
    function face(draw) { var c = document.createElement('canvas'); c.width = c.height = N; draw(c.getContext('2d')); return c; }
    function side(strip) {
      return face(function (x) {
        var g = x.createLinearGradient(0, 0, 0, N);
        g.addColorStop(0, '#07061a'); g.addColorStop(0.28, '#2a0f45'); g.addColorStop(0.46, '#c84a64'); g.addColorStop(0.5, '#ffb070'); g.addColorStop(0.52, '#3a1236'); g.addColorStop(1, '#120a1a');
        x.fillStyle = g; x.fillRect(0, 0, N, N);
        if (strip) { x.fillStyle = strip; x.fillRect(N * 0.42, N * 0.05, N * 0.16, N * 0.9); x.globalAlpha = 0.5; x.fillRect(N * 0.36, N * 0.05, N * 0.28, N * 0.9); x.globalAlpha = 1; }
      });
    }
    var up = face(function (x) {
      var g = x.createRadialGradient(N / 2, N / 2, 4, N / 2, N / 2, N * 0.7); g.addColorStop(0, '#2b2250'); g.addColorStop(1, '#07061a'); x.fillStyle = g; x.fillRect(0, 0, N, N);
      x.fillStyle = '#ffffff'; x.fillRect(N * 0.22, N * 0.3, N * 0.56, N * 0.4);
    });
    var down = face(function (x) { x.fillStyle = '#14101c'; x.fillRect(0, 0, N, N); x.fillStyle = '#c6ff3d'; x.globalAlpha = 0.5; x.fillRect(N * 0.46, 0, N * 0.08, N); });
    var back = face(function (x) {
      var g = x.createLinearGradient(0, 0, 0, N); g.addColorStop(0, '#0a0820'); g.addColorStop(0.5, '#5b2a5e'); g.addColorStop(1, '#150c1c'); x.fillStyle = g; x.fillRect(0, 0, N, N);
      x.fillStyle = '#ffd9a0'; x.fillRect(N * 0.15, N * 0.38, N * 0.7, N * 0.06);
    });
    var front = side(null);
    var t = new THREE.CubeTexture([side('#35e8ff'), side('#ff3d9a'), up, down, back, front]); t.needsUpdate = true; return t;
  }
  var envCube = makeEnvCube();

  /* Road, kerbs, runoff and verge in one shader: wet sheen, lamp reflections, headlight pool, underglow and brake glow */
  var roadU = {
    uCam: { value: new THREE.Vector3() }, uCar: { value: new THREE.Vector3() }, uAcc: { value: new THREE.Vector3(0.78, 1, 0.24) },
    uNear: { value: FOG_NEAR }, uFar: { value: FOG_FAR }, uBrake: { value: 0 },
    uFogCol: { value: new THREE.Vector3(FOG_COL[0], FOG_COL[1], FOG_COL[2]) }
  };
  var road = new THREE.Mesh(new THREE.PlaneGeometry(600, 1400, 1, 1), new THREE.ShaderMaterial({
    uniforms: roadU,
    vertexShader: 'varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: [
      'uniform vec3 uCam, uFogCol, uAcc, uCar; uniform float uNear, uFar, uBrake; varying vec3 vW;',
      'float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
      'float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }',
      'void main() {',
      '  float ax = abs(vW.x), z = vW.z;',
      '  float n = vn(vW.xz * 2.5) * 0.6 + vn(vW.xz * 11.0) * 0.4;',
      '  float n2 = vn(vec2(vW.x * 1.3, z * 0.2));',
      '  vec3 asphalt = vec3(0.05, 0.048, 0.06) + vec3(0.022) * n;',
      '  asphalt += vec3(0.012) * exp(-pow((ax - 1.8) / 0.6, 2.0)) * n2;',
      '  float edge = 1.0 - smoothstep(0.04, 0.09, abs(ax - 3.95));',
      '  float dash = step(fract(z / 7.0), 0.45) * (1.0 - smoothstep(0.06, 0.1, ax));',
      '  vec3 road = asphalt + vec3(0.85) * edge * 0.8 + uAcc * dash * 0.95;',
      '  vec3 V = normalize(uCam - vW);',
      '  float fres = pow(1.0 - clamp(V.y, 0.0, 1.0), 4.0);',
      '  vec3 horizon = mix(uFogCol, vec3(0.95, 0.4, 0.35), 0.45);',
      '  road += horizon * fres * (0.25 + 0.5 * n) * 0.75;',
      '  float zl = vW.x > 0.0 ? 40.0 : 32.5;',
      '  float dl = mod(z - zl + 7.5, 15.0) - 7.5;',
      '  road += vec3(1.0, 0.82, 0.55) * 0.3 * exp(-dl * dl * 0.1) * exp(-pow((ax - 3.7) / 1.6, 2.0)) * (0.25 + fres);',
      '  float ahead = uCar.y - z; float lat = abs(vW.x - uCar.x);',
      '  float cone = smoothstep(0.0, 2.0, ahead) * exp(-ahead * 0.05) * exp(-pow(lat / (1.4 + ahead * 0.12), 2.0));',
      '  road += vec3(1.0, 0.92, 0.75) * cone * 0.5 * (0.5 + 0.8 * n);',
      '  float dcar = length(vec2(vW.x - uCar.x, (z - uCar.y) * 0.6));',
      '  road += uAcc * exp(-dcar * dcar * 0.35) * 0.45;',
      '  float behind = z - uCar.y - 2.3;',
      '  road += vec3(1.0, 0.1, 0.06) * uBrake * smoothstep(0.0, 1.0, behind) * exp(-behind * 0.22) * exp(-pow((vW.x - uCar.x) / 1.7, 2.0)) * 0.55;',
      '  vec3 kerb = mix(vec3(0.75, 0.05, 0.08), vec3(0.85), step(0.5, fract(z / 1.8))) * 0.7;',
      '  vec3 verge = vec3(0.075, 0.06, 0.09) + vec3(0.05) * n; verge += vec3(0.5, 0.3, 0.2) * 0.08 * exp(-dl * dl * 0.05) * exp(-pow((ax - 6.5) / 3.0, 2.0)); verge *= 1.0 - 0.3 * step(8.5, ax);',
      '  vec3 col = ax < 4.3 ? road : (ax < 5.0 ? kerb : verge);',
      '  float d = distance(vW, uCam);',
      '  col = mix(col, uFogCol, smoothstep(uNear, uFar, d));',
      '  gl_FragColor = vec4(col, 1.0);',
      '}'
    ].join('\n')
  }));
  road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -520); scene.add(road);

  /* Soft glow sprites */
  function glowMaterial(gain) {
    return new THREE.ShaderMaterial({
      uniforms: { uPix: { value: 1.5 }, uGain: gain || { value: 1 }, uNear: { value: FOG_NEAR }, uFar: { value: FOG_FAR } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'attribute vec3 aCol; attribute float aSize; uniform float uPix, uNear, uFar; varying vec3 vC; varying float vA; void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; float d = -mv.z; gl_PointSize = min(aSize * uPix * (40.0 / d), 220.0); vC = aCol; vA = 1.0 - smoothstep(uNear, uFar, d); }',
      fragmentShader: 'uniform float uGain; varying vec3 vC; varying float vA; void main() { float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; float a = pow(1.0 - d * 2.0, 2.2); gl_FragColor = vec4(vC * a * uGain, a * vA * min(uGain, 1.0)); }'
    });
  }
  var glowMats = [];
  function glowPoints(list, gain) {
    var n = list.length, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), sz = new Float32Array(n);
    list.forEach(function (p, i) { pos[i * 3] = p[0]; pos[i * 3 + 1] = p[1]; pos[i * 3 + 2] = p[2]; col[i * 3] = p[3]; col[i * 3 + 1] = p[4]; col[i * 3 + 2] = p[5]; sz[i] = p[6]; });
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aCol', new THREE.BufferAttribute(col, 3)); g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
    var m = glowMaterial(gain); glowMats.push(m);
    var pts = new THREE.Points(g, m); pts.frustumCulled = false; return pts;
  }
  function rgb(hex) { var c = new THREE.Color(hex); return [c.r, c.g, c.b]; }

  /* Street lights, concrete barriers with colour panels, bead lights */
  var LAMPS = 52, SPACING = 15, lampList = [], poolList = [];
  var postMat = new THREE.MeshStandardMaterial({ color: 0x3c394a, roughness: 0.5, metalness: 0.3 });
  var postMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.14, 5.4, 0.14), postMat, LAMPS * 2);
  var armMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1.5, 0.1, 0.1), postMat, LAMPS * 2);
  var mtx = new THREE.Matrix4(), li = 0;
  for (var i = 0; i < LAMPS; i++) {
    [1, -1].forEach(function (s) {
      var z = 40 - i * SPACING - (s > 0 ? 0 : SPACING / 2), warm = (i % 2 === 0);
      mtx.makeTranslation(s * 5.7, 2.7, z); postMesh.setMatrixAt(li, mtx);
      mtx.makeTranslation(s * 4.95, 5.4, z); armMesh.setMatrixAt(li, mtx); li++;
      var c = warm ? [1.0, 0.82, 0.55] : [0.7, 0.85, 1.0];
      lampList.push([s * 4.2, 5.3, z, c[0], c[1], c[2], 22]);
      poolList.push([s * 2.7, 0.05, z, c[0] * 0.4, c[1] * 0.4, c[2] * 0.4, 46]);
    });
  }
  scene.add(postMesh); scene.add(armMesh); scene.add(glowPoints(lampList)); scene.add(glowPoints(poolList));
  var BN = 135, bars = new THREE.InstancedMesh(new THREE.BoxGeometry(0.36, 0.95, 3.0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0.05 }), BN * 2);
  var tmpC = new THREE.Color(), bi = 0, beads = [];
  for (var b = 0; b < BN; b++) {
    [1, -1].forEach(function (s) {
      var bz = 50 - b * 3.1 - (s > 0 ? 0 : 1.55);
      mtx.makeTranslation(s * 5.15, 0.475, bz); bars.setMatrixAt(bi, mtx);
      var pc = (b % 6 === 0) ? PAL[(b / 6 | 0) % PAL.length] : (b % 2 ? '#37353f' : '#2e2c38'); tmpC.set(pc); bars.setColorAt(bi, tmpC); bi++;
      if (b % 2 === 0) { var rc = rgb(PAL[(b / 2 | 0) % PAL.length]); beads.push([s * 4.93, 0.55, bz, rc[0] * 0.8, rc[1] * 0.8, rc[2] * 0.8, 7]); }
    });
  }
  scene.add(bars); scene.add(glowPoints(beads));

  /* Speed streaks that follow the camera */
  var SK = narrow ? 260 : 520, skPos = new Float32Array(SK * 6), skEnd = new Float32Array(SK * 2);
  for (var s = 0; s < SK; s++) {
    var sx = (Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 16), sy = 0.3 + Math.random() * 7, sz = Math.random() * 110;
    skPos.set([sx, sy, sz, sx, sy, sz], s * 6); skEnd[s * 2] = 0; skEnd[s * 2 + 1] = 1;
  }
  var skG = new THREE.BufferGeometry();
  skG.setAttribute('position', new THREE.BufferAttribute(skPos, 3)); skG.setAttribute('aEnd', new THREE.BufferAttribute(skEnd, 1));
  var skU = { uCamZ: { value: 0 }, uLen: { value: 1 }, uAlpha: { value: 0 }, uCol: { value: new THREE.Vector3(0.82, 1, 0.55) } };
  var streaks = new THREE.LineSegments(skG, new THREE.ShaderMaterial({
    uniforms: skU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'attribute float aEnd; uniform float uCamZ, uLen, uAlpha; varying float vA; void main() { vec3 p = position; float base = uCamZ - 100.0; p.z = base + mod(p.z - base, 110.0) - aEnd * uLen; vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; float d = -mv.z; vA = uAlpha * (1.0 - aEnd) * (1.0 - smoothstep(20.0, 90.0, d)) * smoothstep(1.0, 6.0, d); }',
    fragmentShader: 'uniform vec3 uCol; varying float vA; void main() { gl_FragColor = vec4(uCol * vA, vA); }'
  }));
  streaks.frustumCulled = false; scene.add(streaks);

  /* ---------- The car: a GT-style racer seen from behind (it faces -z), lofted body with clearcoat paint ---------- */
  var car = new THREE.Group(); scene.add(car);
  var accCur = new THREE.Color(PAL[0]), accTarget = new THREE.Color(PAL[0]);
  function sgn(v) { return v < 0 ? -1 : 1; }
  function curve(keys) {
    return function (t) {
      var n = keys.length; if (t <= keys[0][0]) return keys[0][1]; if (t >= keys[n - 1][0]) return keys[n - 1][1];
      var i = 0; while (t > keys[i + 1][0]) i++;
      var k0 = keys[Math.max(i - 1, 0)], k1 = keys[i], k2 = keys[i + 1], k3 = keys[Math.min(i + 2, n - 1)];
      var dx = k2[0] - k1[0], u = (t - k1[0]) / dx;
      var m1 = (k2[1] - k0[1]) / (k2[0] - k0[0]) * dx, m2 = (k3[1] - k1[1]) / (k3[0] - k1[0]) * dx;
      var u2 = u * u, u3 = u2 * u;
      return (2 * u3 - 3 * u2 + 1) * k1[1] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * k2[1] + (u3 - u2) * m2;
    };
  }
  function ringPts(M, hw, yb, yt, nT, nB, taper) {
    var pts = [], yc = (yt + yb) / 2, yh = (yt - yb) / 2;
    for (var j = 0; j < M; j++) {
      var a = j / M * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), e = 2 / (s >= 0 ? nT : nB);
      var yn = sgn(s) * Math.pow(Math.abs(s), e), xn = sgn(c) * Math.pow(Math.abs(c), e);
      pts.push([hw * xn * (1 - taper * (0.5 + 0.5 * yn)), yc + yh * yn]);
    }
    return pts;
  }
  /* Loft rings (each with M points, running around the cross-section) into a smooth shell with uv, normals and end caps. glassFn marks quads that take the second material. */
  function loft(st, M, glassFn) {
    var S = st.length, W = M + 1, pos = [], nor = [], uv = [], idxP = [], idxG = [];
    var cen = st.map(function (r) { var cx = 0, cy = 0; r.pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); return [cx / M, cy / M]; });
    for (var s = 0; s < S; s++) {
      for (var j = 0; j < W; j++) {
        var jm = j % M, P = st[s].pts[jm], ja = (jm + 1) % M, jb = (jm + M - 1) % M;
        var rx = st[s].pts[ja][0] - st[s].pts[jb][0], ry = st[s].pts[ja][1] - st[s].pts[jb][1];
        var s0 = Math.max(s - 1, 0), s1 = Math.min(s + 1, S - 1);
        var lx = st[s1].pts[jm][0] - st[s0].pts[jm][0], ly = st[s1].pts[jm][1] - st[s0].pts[jm][1], lz = st[s1].z - st[s0].z;
        var nx = -lz * ry, ny = lz * rx, nz = lx * ry - ly * rx;
        if (nx * (P[0] - cen[s][0]) + ny * (P[1] - cen[s][1]) < 0) { nx = -nx; ny = -ny; nz = -nz; }
        var nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        pos.push(P[0], P[1], st[s].z); nor.push(nx / nl, ny / nl, nz / nl); uv.push(j / M, 1 - st[s].t);
      }
    }
    for (var s2 = 0; s2 < S - 1; s2++) for (var j2 = 0; j2 < M; j2++) {
      var a = s2 * W + j2, b2 = a + 1, c = a + W, d = c + 1, tgt = (glassFn && glassFn(s2, j2)) ? idxG : idxP;
      tgt.push(a, c, b2, b2, c, d);
    }
    [0, S - 1].forEach(function (s) {
      var base = pos.length / 3, nzv = s === 0 ? -1 : 1;
      pos.push(cen[s][0], cen[s][1], st[s].z); nor.push(0, 0, nzv); uv.push(0.25, 1 - st[s].t);
      for (var j = 0; j < M; j++) { pos.push(st[s].pts[j][0], st[s].pts[j][1], st[s].z); nor.push(0, 0, nzv); uv.push(j / M, 1 - st[s].t); }
      for (var k = 0; k < M; k++) idxP.push(base, base + 1 + k, base + 1 + (k + 1) % M);
    });
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idxP.concat(idxG)); geo.addGroup(0, idxP.length, 0); if (idxG.length) geo.addGroup(idxP.length, idxG.length, 1);
    return geo;
  }
  function canvasTex(w, hh, draw) { var c = document.createElement('canvas'); c.width = w; c.height = hh; draw(c.getContext('2d'), w, hh); var t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t; }

  /* Livery: gradient racing stripe down the middle and thin sill lines */
  var liveryTex = canvasTex(512, 512, function (x, w, hh) {
    x.fillStyle = '#171b24'; x.fillRect(0, 0, w, hh);
    var gg = x.createLinearGradient(0, 0, 0, hh);
    gg.addColorStop(0, '#c6ff3d'); gg.addColorStop(0.33, '#35e8ff'); gg.addColorStop(0.66, '#ff3d9a'); gg.addColorStop(1, '#ffb21f');
    x.fillStyle = gg; x.fillRect(w * 0.25 - 12, 0, 14, hh);
    x.fillStyle = '#f2f3fb'; x.fillRect(w * 0.25 + 5, 0, 4, hh);
    x.fillStyle = gg; x.fillRect(w * 0.25 + 12, 0, 3, hh);
    x.fillRect(w * 0.555 - 2, 0, 4, hh); x.fillRect(w * 0.945 - 2, 0, 4, hh);
  });
  var mPaint = new THREE.MeshPhongMaterial({ map: liveryTex, specular: 0xffffff, shininess: 160, envMap: envCube, reflectivity: 0.42, side: THREE.DoubleSide });
  var mGlass = new THREE.MeshPhongMaterial({ color: 0x020308, specular: 0xffffff, shininess: 220, envMap: envCube, reflectivity: 0.75, side: THREE.DoubleSide });
  var mCarb = new THREE.MeshPhongMaterial({ color: 0x15171c, specular: 0x666a78, shininess: 50, envMap: envCube, reflectivity: 0.22 });
  var mMetal = new THREE.MeshPhongMaterial({ color: 0x70737e, specular: 0xffffff, shininess: 120, envMap: envCube, reflectivity: 0.8, side: THREE.DoubleSide });
  var mAcc = new THREE.MeshStandardMaterial({ color: PAL[0], emissive: PAL[0], emissiveIntensity: 0.4, roughness: 0.4, metalness: 0.1 });
  var mTyre = new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
  var tailMat = new THREE.MeshBasicMaterial({ color: 0xff2a1a, toneMapped: false });

  var Z0 = -2.3, LEN = 4.6;
  function zOf(t) { return Z0 + t * LEN; }
  var kHW = curve([[0, 0.6], [0.05, 0.8], [0.16, 0.92], [0.34, 0.96], [0.55, 0.94], [0.72, 1.0], [0.9, 0.97], [1, 0.86]]);
  var kYB = curve([[0, 0.2], [0.08, 0.14], [0.85, 0.14], [0.95, 0.2], [1, 0.25]]);
  var kYT = curve([[0, 0.34], [0.07, 0.46], [0.24, 0.58], [0.42, 0.7], [0.6, 0.74], [0.78, 0.8], [0.92, 0.78], [1, 0.7]]);
  var kYR = curve([[0.28, 0.6], [0.38, 0.9], [0.47, 1.07], [0.62, 1.09], [0.72, 0.95], [0.82, 0.78]]);
  var kCW = curve([[0.28, 0.72], [0.45, 0.74], [0.62, 0.74], [0.82, 0.78]]);
  var M = 32, bodySt = [], cabSt = [], si;
  for (si = 0; si <= 34; si++) { var tb = si / 34; bodySt.push({ t: tb, z: zOf(tb), pts: ringPts(M, kHW(tb), kYB(tb), kYT(tb), 3.4, 7, 0) }); }
  for (si = 0; si <= 24; si++) { var tc = 0.28 + 0.54 * si / 24; cabSt.push({ t: tc, z: zOf(tc), pts: ringPts(M, kCW(tc), kYT(tc) - 0.16, kYR(tc), 2.6, 6, 0.34) }); }
  car.add(new THREE.Mesh(loft(bodySt, M, null), mPaint));
  car.add(new THREE.Mesh(loft(cabSt, M, function (s, j) { var tm = 0.28 + 0.54 * (s + 0.5) / 24; return !(tm > 0.45 && tm < 0.66 && j >= 4 && j < 12); }), [mPaint, mGlass]));

  function add(geo, mat, x, y, z) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); car.add(m); return m; }
  var ZR = zOf(1);
  /* Rear fascia: lower valance, LED tail bar, light pods, plate, twin exhausts, diffuser fins */
  add(new THREE.BoxGeometry(1.5, 0.15, 0.05), mCarb, 0, 0.3, ZR + 0.01);
  add(new THREE.BoxGeometry(1.56, 0.06, 0.05), tailMat, 0, 0.6, ZR + 0.02);
  [1, -1].forEach(function (s) {
    add(new THREE.BoxGeometry(0.34, 0.15, 0.06), mCarb, s * 0.62, 0.6, ZR + 0.015);
    add(new THREE.BoxGeometry(0.28, 0.05, 0.07), tailMat, s * 0.62, 0.64, ZR + 0.025);
    add(new THREE.BoxGeometry(0.28, 0.03, 0.07), tailMat, s * 0.62, 0.575, ZR + 0.025);
    var ex = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.24, 20, 1, true), mMetal); ex.rotation.x = Math.PI / 2; ex.position.set(s * 0.3, 0.37, ZR + 0.1); car.add(ex);
    var exIn = new THREE.Mesh(new THREE.CircleGeometry(0.068, 20), new THREE.MeshBasicMaterial({ color: 0x050405 })); exIn.position.set(s * 0.3, 0.37, ZR - 0.02); car.add(exIn);
    for (var f = 0; f < 3; f++) add(new THREE.BoxGeometry(0.02, 0.1, 0.4), mCarb, s * (0.5 + f * 0.17), 0.2, ZR - 0.15);
  });
  add(new THREE.BoxGeometry(0.03, 0.1, 0.4), mCarb, 0, 0.2, ZR - 0.15);
  var plateTex = canvasTex(256, 64, function (x, w, hh) {
    x.fillStyle = '#f2f3fb'; x.fillRect(0, 0, w, hh); x.strokeStyle = '#111'; x.lineWidth = 4; x.strokeRect(3, 3, w - 6, hh - 6);
    x.fillStyle = '#111'; x.font = '700 40px Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('7OHAX', w / 2, hh / 2 + 2);
  });
  var plate = add(new THREE.PlaneGeometry(0.5, 0.125), new THREE.MeshBasicMaterial({ map: plateTex, toneMapped: false }), 0, 0.485, ZR + 0.04);
  /* Engine cover louvres on the deck */
  for (var lv = 0; lv < 5; lv++) { var lt = 0.8 + lv * 0.028; add(new THREE.BoxGeometry(0.72, 0.012, 0.06), mCarb, 0, kYT(lt) + 0.004, zOf(lt)); }
  /* Roof roundel with the number 7 */
  var roundel = new THREE.Mesh(new THREE.CircleGeometry(0.17, 28), new THREE.MeshBasicMaterial({ map: canvasTex(128, 128, function (x, w) {
    x.fillStyle = '#f2f3fb'; x.beginPath(); x.arc(w / 2, w / 2, w / 2, 0, 7); x.fill();
    x.fillStyle = '#0b0a12'; x.font = '900 86px Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('7', w / 2, w / 2 + 6);
  }), toneMapped: false }));
  roundel.rotation.x = -Math.PI / 2; roundel.position.set(0, kYR(0.54) + 0.007, zOf(0.54)); car.add(roundel);
  /* Wing: airfoil on two uprights with accent endplates and a third brake light */
  var af = new THREE.Shape(); af.moveTo(0, 0); af.quadraticCurveTo(0.1, 0.1, 0.5, 0.02); af.lineTo(0.5, 0.0); af.quadraticCurveTo(0.16, -0.02, 0, 0);
  var wingGeo = new THREE.ExtrudeGeometry(af, { depth: 1.9, bevelEnabled: false, curveSegments: 10 });
  wingGeo.translate(0, 0, -0.95); wingGeo.rotateY(-Math.PI / 2);
  var wing = add(wingGeo, mCarb, 0, 1.13, 1.88); wing.rotation.x = -0.14;
  [1, -1].forEach(function (s) {
    add(new THREE.BoxGeometry(0.05, 0.36, 0.16), mCarb, s * 0.45, 0.96, 2.05);
    add(new THREE.BoxGeometry(0.03, 0.3, 0.6), mAcc, s * 0.96, 1.16, 2.07);
    add(new THREE.BoxGeometry(0.22, 0.1, 0.12), mPaint, s * 0.86, 0.84, -0.6);
  });
  add(new THREE.BoxGeometry(0.5, 0.025, 0.04), tailMat, 0, 1.1, 2.32);

  /* Wheels with real-looking tyres, spokes, brake discs and accent calipers */
  var wheels = [];
  function makeWheel(R, Wd, side, x, z, rear) {
    var g = new THREE.Group(), spin = new THREE.Group(), hw = Wd / 2;
    var prof = [[0.62, -0.95], [0.72, -1], [0.9, -0.9], [1, -0.55], [1, 0.55], [0.9, 0.9], [0.72, 1], [0.62, 0.95]].map(function (p) { return new THREE.Vector2(p[0] * R, p[1] * hw); });
    var tg = new THREE.LatheGeometry(prof, 36); tg.rotateZ(Math.PI / 2); g.add(new THREE.Mesh(tg, mTyre));
    var barrel = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.64, R * 0.64, Wd * 0.9, 28), mCarb); barrel.rotation.z = Math.PI / 2; g.add(barrel);
    var disc = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.52, R * 0.52, 0.03, 28), mMetal); disc.rotation.z = Math.PI / 2; disc.position.x = side * hw * 0.5; g.add(disc);
    var cal = new THREE.Mesh(new THREE.BoxGeometry(0.1, R * 0.26, R * 0.34), mAcc); cal.position.set(side * hw * 0.58, R * 0.4, 0); g.add(cal);
    var spokeMat = new THREE.MeshPhongMaterial({ color: 0x4a4d58, specular: 0xffffff, shininess: 90, envMap: envCube, reflectivity: 0.6, transparent: true });
    for (var k = 0; k < 10; k++) {
      var pv = new THREE.Group(); pv.rotation.x = k / 10 * Math.PI * 2;
      var sp = new THREE.Mesh(new THREE.BoxGeometry(0.035, R * 0.5, R * 0.075), spokeMat); sp.position.set(side * hw * 0.88, R * 0.34, 0); pv.add(sp); spin.add(pv);
    }
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(R * 0.11, R * 0.11, 0.06, 16), mAcc); hub.rotation.z = Math.PI / 2; hub.position.x = side * hw * 0.92; spin.add(hub);
    var blurMat = new THREE.MeshBasicMaterial({ color: 0x2d303a, transparent: true, opacity: 0, side: THREE.DoubleSide });
    var blur = new THREE.Mesh(new THREE.CircleGeometry(R * 0.62, 28), blurMat); blur.rotation.y = side * Math.PI / 2; blur.position.x = side * hw * 0.95; g.add(blur);
    g.add(spin); g.position.set(x, R, z); car.add(g);
    wheels.push({ spin: spin, R: R, spokeMat: spokeMat, blurMat: blurMat });
  }
  [1, -1].forEach(function (s) { makeWheel(0.42, 0.38, s, s * 0.98, 1.42, true); makeWheel(0.38, 0.3, s, s * 0.95, -1.35, false); });
  /* Rear arch flares in body paint */
  [1, -1].forEach(function (s) {
    var fl = new THREE.Mesh(new THREE.CylinderGeometry(0.47, 0.47, 0.46, 28, 1, true, 0, Math.PI), mPaint);
    fl.rotation.z = Math.PI / 2; fl.position.set(s * 0.96, 0.42, 1.42); car.add(fl);
  });

  /* Underglow, tail glow, accent lights that wash the barriers as you pass */
  var tailGain = { value: 0.5 };
  var tailGlow = glowPoints([[0, 0.6, ZR + 0.12, 1.0, 0.12, 0.06, 30], [0.62, 0.6, ZR + 0.12, 0.8, 0.08, 0.04, 22], [-0.62, 0.6, ZR + 0.12, 0.8, 0.08, 0.04, 22]], tailGain);
  car.add(tailGlow);
  var uglow = glowPoints([[0, 0.06, 0.2, 0.78, 1, 0.24, 140], [0, 0.06, 1.7, 0.78, 1, 0.24, 90], [0, 0.06, -1.4, 0.78, 1, 0.24, 90]], { value: 0.55 });
  car.add(uglow);
  var pLeft = new THREE.PointLight(0xff3d9a, 3, 11, 2); pLeft.position.set(-2.4, 1.3, 0.6); car.add(pLeft);
  var pRight = new THREE.PointLight(0x35e8ff, 3, 11, 2); pRight.position.set(2.4, 1.3, 0.6); car.add(pRight);
  var pAcc = new THREE.PointLight(0xc6ff3d, 1.2, 6, 2); pAcc.position.set(0, 0.3, 1.2); car.add(pAcc);

  /* ---------- Smoke: exhaust wisps and tyre smoke, normal-blended soft puffs ---------- */
  var SM = narrow ? 220 : 420, smHead = 0;
  var smP = new Float32Array(SM * 3), smV = new Float32Array(SM * 3), smSz = new Float32Array(SM), smAl = new Float32Array(SM), smSd = new Float32Array(SM), smHt = new Float32Array(SM), smTn = new Float32Array(SM);
  var smAge = new Float32Array(SM), smLife = new Float32Array(SM), smS0 = new Float32Array(SM), smGr = new Float32Array(SM), smA0 = new Float32Array(SM), smDr = new Float32Array(SM), smLf = new Float32Array(SM);
  for (var q = 0; q < SM; q++) { smAge[q] = 2; smLife[q] = 1; smSd[q] = Math.random(); smP[q * 3 + 1] = -50; }
  var smGeo = new THREE.BufferGeometry();
  function dyn(arr, n) { var a = new THREE.BufferAttribute(arr, n); a.setUsage(THREE.DynamicDrawUsage); return a; }
  smGeo.setAttribute('position', dyn(smP, 3)); smGeo.setAttribute('aSize', dyn(smSz, 1)); smGeo.setAttribute('aAlpha', dyn(smAl, 1)); smGeo.setAttribute('aSeed', dyn(smSd, 1)); smGeo.setAttribute('aHeat', dyn(smHt, 1)); smGeo.setAttribute('aTint', dyn(smTn, 1));
  var smU = { uScale: { value: 600 }, uAcc: { value: new THREE.Vector3(0.78, 1, 0.24) }, uBrake: { value: 0 } };
  var smoke = new THREE.Points(smGeo, new THREE.ShaderMaterial({
    uniforms: smU, transparent: true, depthWrite: false,
    vertexShader: 'attribute float aSize, aAlpha, aSeed, aHeat, aTint; uniform float uScale; varying float vA, vS, vH, vT; void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(aSize * uScale / max(-mv.z, 0.5), 0.0, 256.0); vA = aAlpha; vS = aSeed; vH = aHeat; vT = aTint; }',
    fragmentShader: [
      'uniform vec3 uAcc; uniform float uBrake; varying float vA, vS, vH, vT;',
      'float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
      'float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }',
      'void main() {',
      '  vec2 p = gl_PointCoord - 0.5; float r = length(p) * 2.0; if (r > 1.0) discard;',
      '  float ang = vS * 6.2831; vec2 q = vec2(cos(ang) * p.x - sin(ang) * p.y, sin(ang) * p.x + cos(ang) * p.y) * 4.0 + vS * 13.0;',
      '  float n = vn(q) * 0.6 + vn(q * 2.3) * 0.3;',
      '  float a = (1.0 - smoothstep(0.1, 1.0, r)) * (0.35 + n * 1.2);',
      '  vec3 col = mix(vec3(0.58, 0.6, 0.68), vec3(0.95, 0.95, 1.0), n);',
      '  col = mix(col, uAcc, 0.22 * vT);',
      '  col += vec3(1.0, 0.12, 0.06) * uBrake * vH * vH * 0.9;',
      '  gl_FragColor = vec4(col, clamp(a, 0.0, 1.0) * vA);',
      '}'
    ].join('\n')
  }));
  smoke.frustumCulled = false; smoke.renderOrder = 5; scene.add(smoke);
  function spawnSmoke(x, y, z, vx, vy, vz, s0, gr, life, a0, drag, lift, tint) {
    var i = smHead; smHead = (smHead + 1) % SM; var k = i * 3;
    smP[k] = x; smP[k + 1] = y; smP[k + 2] = z; smV[k] = vx; smV[k + 1] = vy; smV[k + 2] = vz;
    smAge[i] = 0; smLife[i] = life; smS0[i] = s0; smGr[i] = gr; smA0[i] = a0; smDr[i] = drag; smLf[i] = lift; smTn[i] = tint; smSd[i] = Math.random();
  }
  function updateSmoke(dt) {
    for (var i = 0; i < SM; i++) {
      if (smAge[i] >= 1) { smAl[i] = 0; smSz[i] = 0; continue; }
      var a = (smAge[i] += dt / smLife[i]);
      if (a >= 1) { smAl[i] = 0; smSz[i] = 0; continue; }
      var k = i * 3, dr = Math.exp(-smDr[i] * dt);
      smV[k] *= dr; smV[k + 1] = smV[k + 1] * dr + smLf[i] * dt; smV[k + 2] *= dr;
      smP[k] += smV[k] * dt; smP[k + 1] += smV[k + 1] * dt; smP[k + 2] += smV[k + 2] * dt;
      smSz[i] = smS0[i] + smGr[i] * a; smAl[i] = smA0[i] * Math.pow(1 - a, 1.5) * Math.min(1, a / 0.07); smHt[i] = 1 - a;
    }
    var at = smGeo.attributes; at.position.needsUpdate = at.aSize.needsUpdate = at.aAlpha.needsUpdate = at.aHeat.needsUpdate = at.aTint.needsUpdate = at.aSeed.needsUpdate = true;
  }

  /* Sparks and exhaust flames: additive glow pool */
  var FXN = narrow ? 90 : 180, fxHead = 0;
  var fxP = new Float32Array(FXN * 3), fxC = new Float32Array(FXN * 3), fxS = new Float32Array(FXN), fxV = new Float32Array(FXN * 3);
  var fxAge = new Float32Array(FXN).fill(2), fxLife = new Float32Array(FXN).fill(1), fxC0 = new Float32Array(FXN * 3), fxS0 = new Float32Array(FXN), fxG = new Float32Array(FXN);
  var fxGeo = new THREE.BufferGeometry();
  fxGeo.setAttribute('position', dyn(fxP, 3)); fxGeo.setAttribute('aCol', dyn(fxC, 3)); fxGeo.setAttribute('aSize', dyn(fxS, 1));
  var fxMat = glowMaterial(); glowMats.push(fxMat);
  var fxPts = new THREE.Points(fxGeo, fxMat); fxPts.frustumCulled = false; fxPts.renderOrder = 6; scene.add(fxPts);
  function spawnFx(x, y, z, vx, vy, vz, life, size, r, g, b, grav) {
    var i = fxHead; fxHead = (fxHead + 1) % FXN; var k = i * 3;
    fxP[k] = x; fxP[k + 1] = y; fxP[k + 2] = z; fxV[k] = vx; fxV[k + 1] = vy; fxV[k + 2] = vz;
    fxAge[i] = 0; fxLife[i] = life; fxS0[i] = size; fxC0[k] = r; fxC0[k + 1] = g; fxC0[k + 2] = b; fxG[i] = grav;
  }
  function updateFx(dt) {
    for (var i = 0; i < FXN; i++) {
      var k = i * 3;
      if (fxAge[i] >= 1) { fxS[i] = 0; fxC[k] = fxC[k + 1] = fxC[k + 2] = 0; continue; }
      var a = (fxAge[i] += dt / fxLife[i]);
      if (a >= 1) { fxS[i] = 0; fxC[k] = fxC[k + 1] = fxC[k + 2] = 0; continue; }
      fxV[k + 1] -= fxG[i] * dt; fxP[k] += fxV[k] * dt; fxP[k + 1] += fxV[k + 1] * dt; fxP[k + 2] += fxV[k + 2] * dt;
      if (fxP[k + 1] < 0.02 && fxV[k + 1] < 0) { fxP[k + 1] = 0.02; fxV[k + 1] *= -0.35; }
      var f = 1 - a; fxC[k] = fxC0[k] * f; fxC[k + 1] = fxC0[k + 1] * f; fxC[k + 2] = fxC0[k + 2] * f; fxS[i] = fxS0[i] * (1 - a * 0.4);
    }
    var at = fxGeo.attributes; at.position.needsUpdate = at.aCol.needsUpdate = at.aSize.needsUpdate = true;
  }
  var accE = { ex: 0, tire: 0, spark: 0 }, popCool = 0;
  function emitEffects(dt, zA, zB, x, sn, kmh, accelK, latV, now) {
    var thr = clamp(accelK / 220, 0, 1), i, u, zz, sd;
    accE.ex += (8 + sn * 55 + thr * 45) * dt;
    while (accE.ex >= 1) {
      accE.ex -= 1; u = Math.random(); zz = lerp(zA, zB, u); sd = Math.random() < 0.5 ? -1 : 1;
      spawnSmoke(x + sd * 0.3, 0.38, zz + ZR + 0.14, (Math.random() - 0.5) * 0.5 + sd * 0.2, 0.2 + Math.random() * 0.4, 1 + Math.random() * 2, 0.1, 1.1 + sn * 0.7, 1.4 + (1 - sn) * 1.4, 0.3 + thr * 0.16, 0.9, 0.3, 1);
    }
    var trate = clamp((accelK - 70) / 220, 0, 1) * 110 + clamp((-accelK - 90) / 260, 0, 1) * 80 + clamp((Math.abs(latV) - 1.4) / 3, 0, 1) * clamp(kmh / 80, 0, 1) * 70;
    accE.tire += trate * dt;
    while (accE.tire >= 1) {
      accE.tire -= 1; u = Math.random(); zz = lerp(zA, zB, u); sd = Math.random() < 0.5 ? -1 : 1;
      spawnSmoke(x + sd * (0.9 + Math.random() * 0.12), 0.14, zz + 1.5, sd * (0.3 + Math.random() * 1.1), 0.2 + Math.random() * 0.6, 0.5 + Math.random() * 2, 0.32, 2.4, 1.1 + Math.random() * 0.9, 0.42, 1.1, 0.2, 0);
    }
    if (sn > 0.45) {
      accE.spark += (sn - 0.45) * 130 * dt;
      while (accE.spark >= 1) {
        accE.spark -= 1; u = Math.random(); zz = lerp(zA, zB, u);
        spawnFx(x + (Math.random() - 0.5) * 1.1, 0.09, zz + 1.9, (Math.random() - 0.5) * 2, 0.6 + Math.random() * 2.2, 2 + Math.random() * 6, 0.35 + Math.random() * 0.45, 4 + Math.random() * 3, 1, 0.62, 0.22, 12);
      }
    }
    popCool -= dt;
    if (accelK < -140 && kmh > 30 && popCool <= 0) {
      popCool = 0.3 + Math.random() * 0.3; audioPop();
      [-1, 1].forEach(function (s) {
        for (var n = 0; n < 3; n++) spawnFx(x + s * 0.3, 0.37, zB + ZR + 0.15 + n * 0.12, (Math.random() - 0.5) * 0.8, 0.2 + Math.random() * 0.4, 5 + Math.random() * 4, 0.1 + Math.random() * 0.06, 44 - n * 10, 1, 0.55 - n * 0.08, 0.14, 0);
        spawnFx(x + s * 0.3, 0.37, zB + ZR + 0.12, 0, 0.1, 3, 0.09, 24, 0.5, 0.7, 1, 0);
      });
    }
  }

  /* ---------- Billboards: one per project, with its own accent colour ---------- */
  var boards = [];
  var DISP = '900 %spx "Unbounded", "Arial Black", Impact, sans-serif';
  function drawBoard(p, i) {
    var col = PAL[i % PAL.length], rc = rgb(col);
    return canvasTex(1024, 576, function (x) {
      var g = x.createLinearGradient(0, 0, 1024, 576); g.addColorStop(0, '#150d22'); g.addColorStop(1, '#07060d');
      x.fillStyle = g; x.fillRect(0, 0, 1024, 576);
      var rg = x.createRadialGradient(860, 120, 10, 860, 120, 520); rg.addColorStop(0, col + '55'); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.fillRect(0, 0, 1024, 576);
      x.fillStyle = col + '22'; for (var k = 0; k < 10; k++) x.fillRect(0, 40 + k * 56, 1024, 1);
      x.strokeStyle = col; x.lineWidth = 12; x.strokeRect(14, 14, 996, 548);
      x.lineWidth = 3; x.strokeStyle = col + '88'; x.strokeRect(34, 34, 956, 508);
      x.font = DISP.replace('%s', '210'); x.lineWidth = 3; x.strokeStyle = col; x.strokeText('0' + (i + 1), 56, 230);
      var title = p.title.toUpperCase(), size = 110, lines = [title];
      do { x.font = DISP.replace('%s', String(size)); size -= 6; } while (x.measureText(title).width > 900 && size > 70);
      if (x.measureText(title).width > 900) {
        var wd = title.split(' '), mid = Math.ceil(wd.length / 2); lines = [wd.slice(0, mid).join(' '), wd.slice(mid).join(' ')]; size = 84;
        do { x.font = DISP.replace('%s', String(size)); size -= 4; } while ((x.measureText(lines[0]).width > 900 || x.measureText(lines[1]).width > 900) && size > 34);
      }
      x.fillStyle = '#f2f3fb';
      if (lines.length === 1) x.fillText(lines[0], 56, 380); else { x.fillText(lines[0], 56, 340); x.fillText(lines[1], 56, 340 + size + 10); }
      x.font = '500 30px "JetBrains Mono", ui-monospace, monospace'; x.fillStyle = 'rgba(242,243,251,0.78)';
      x.fillText(p.stack.join('  /  ').toUpperCase(), 56, 470);
      x.fillStyle = col; x.fillRect(56, 492, 280, 4);
      x.font = '500 24px "JetBrains Mono", ui-monospace, monospace'; x.fillText('STAGE 0' + (i + 1) + ' / 0' + PROJECTS.length, 56, 534);
    });
  }
  function makeBoards() {
    boards.forEach(function (b) { scene.remove(b.group); });
    boards = [];
    PROJECTS.forEach(function (p, i) {
      var side = i % 2 === 0 ? 1 : -1, grp = new THREE.Group(), col = PAL[i % PAL.length], rc = rgb(col);
      var face = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.6), new THREE.MeshBasicMaterial({ map: drawBoard(p, i), toneMapped: false }));
      face.position.y = 4.6; grp.add(face);
      var post = new THREE.MeshStandardMaterial({ color: 0x3c394a, roughness: 0.6, metalness: 0.5 });
      [-2.6, 2.6].forEach(function (dx) { var pm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.2, 0.16), post); pm.position.set(dx, 1.6, -0.1); grp.add(pm); });
      var bar = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.1, 0.12), new THREE.MeshBasicMaterial({ color: col, toneMapped: false })); bar.position.set(0, 6.45, 0.05); grp.add(bar);
      grp.add(glowPoints([[0, 4.6, -0.6, rc[0] * 0.7, rc[1] * 0.7, rc[2] * 0.7, 100], [0, 6.45, 0.2, rc[0], rc[1], rc[2], 34]]));
      grp.position.set(side * (narrow ? 7.4 : 8.9), 0, 0); grp.rotation.y = -side * 0.42;
      scene.add(grp); boards.push({ group: grp, z: 0, passed: false });
    });
    layoutBoards();
  }
  /* Light gantries across the road, each with a lit sector sign */
  var gantries = [];
  function makeGantries() {
    var legMat = new THREE.MeshStandardMaterial({ color: 0x35323f, roughness: 0.55, metalness: 0.6 });
    for (var k = 0; k < 8; k++) {
      var g = new THREE.Group(), col = PAL[k % PAL.length], rc = rgb(col);
      [1, -1].forEach(function (s) { var leg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7.2, 0.5), legMat); leg.position.set(s * 6.1, 3.6, 0); g.add(leg); });
      var beam = new THREE.Mesh(new THREE.BoxGeometry(12.8, 0.9, 0.7), legMat); beam.position.set(0, 7.3, 0); g.add(beam);
      var strip = new THREE.Mesh(new THREE.BoxGeometry(11.8, 0.08, 0.2), new THREE.MeshBasicMaterial({ color: col, toneMapped: false })); strip.position.set(0, 6.8, 0); g.add(strip);
      var sign = new THREE.Mesh(new THREE.PlaneGeometry(9, 0.72), new THREE.MeshBasicMaterial({ toneMapped: false, map: (function (kk, cc) {
        return canvasTex(1024, 82, function (x, w, hh) {
          x.fillStyle = '#0b0912'; x.fillRect(0, 0, w, hh); x.fillStyle = cc; x.fillRect(0, hh - 6, w, 6);
          x.font = '900 46px "Unbounded", "Arial Black", Impact, sans-serif'; x.textBaseline = 'middle'; x.fillStyle = cc; x.fillText('SECTOR 0' + (kk + 1), 28, hh / 2 - 2);
          x.fillStyle = '#f2f3fb'; x.textAlign = 'right'; x.fillText(PROFILE.handle.toUpperCase() + ' DRIVE', w - 28, hh / 2 - 2);
        });
      })(k, col) })); sign.position.set(0, 7.3, 0.36); g.add(sign);
      var gl = []; for (var gx = -5; gx <= 5; gx += 2.5) gl.push([gx, 6.7, 0.2, rc[0], rc[1], rc[2], 46]);
      g.add(glowPoints(gl)); g.position.z = -30 - k * 40; scene.add(g); gantries.push(g);
    }
  }
  var stageCenters = [];
  function layoutBoards() {
    var vh = window.innerHeight; stageCenters = [];
    stageEls.forEach(function (el, i) {
      var r = el.getBoundingClientRect(), center = r.top + window.scrollY + r.height / 2; stageCenters.push(center);
      if (boards[i]) boards[i].group.position.z = -(center - vh / 2) * K - 3;
    });
  }
  function whenFonts(cb) {
    var done = false; function go() { if (!done) { done = true; cb(); } }
    try {
      Promise.race([Promise.all([document.fonts.load('900 100px "Unbounded"'), document.fonts.load('500 30px "JetBrains Mono"')]), new Promise(function (r) { setTimeout(r, 2000); })]).then(go, go);
    } catch (e) { go(); }
  }
  whenFonts(function () { makeBoards(); makeGantries(); });

  function layout() {
    var w = window.innerWidth, hgt = window.innerHeight;
    narrow = w < 720;
    renderer.setSize(w, hgt, false);
    camera.aspect = w / hgt; camera.updateProjectionMatrix();
    var pix = renderer.getPixelRatio() * Math.max(0.8, Math.min(1.3, hgt / 800));
    glowMats.forEach(function (m) { m.uniforms.uPix.value = pix; });
    layoutBoards(); updateMsg();
  }
  window.addEventListener('resize', layout);
  window.addEventListener('load', function () { setTimeout(layoutBoards, 100); });

  function updateMsg() {
    var r = $('msgWrap').getBoundingClientRect(), total = r.height - window.innerHeight;
    var prog = reduce ? 1 : clamp(-r.top / Math.max(1, total), 0, 1), n = words.length;
    for (var i = 0; i < n; i++) words[i].style.opacity = String(0.2 + 0.8 * clamp(prog * 1.25 * n - i, 0, 1));
  }

  var mx = 0, mxT = 0;
  window.addEventListener('pointermove', function (e) { mxT = (e.clientX / window.innerWidth) * 2 - 1; }, { passive: true });

  /* ---------- Loop ---------- */
  var cur = window.scrollY, prevCur = cur, spdSm = 0, brake = 0, shake = 0, rpm = 0.18, prevZ = 0, prevCx = LANE, litN = -1, lastGear = '';
  var lastNow = performance.now(), lastSpdTxt = '', lastDistTxt = '', lastStage = '', navSolid = false, accIdx = -1;
  var spdEl = $('spd'), distEl = $('dist'), stageLbl = $('stageLbl'), nav = $('nav'), gearEl = $('gear');
  var UP = [55, 100, 148, 200, 255, 305];

  function frame(now) {
    var dt = Math.min(0.05, Math.max(0.001, (now - lastNow) / 1000)); lastNow = now;
    var target = window.scrollY;
    cur += (target - cur) * (1 - Math.exp(-dt * 7));
    var v = (cur - prevCur) / dt; prevCur = cur;
    var kmh = clamp(Math.abs(v) * 0.075, 0, 330), prevS = spdSm;
    spdSm += (kmh - spdSm) * (1 - Math.exp(-dt * 6));
    var sn = clamp(spdSm / 260, 0, 1), accelK = (spdSm - prevS) / dt;
    var wantBrake = clamp(clamp(-accelK * 0.02, 0, 1) * 1.5 + (v < -20 ? 1 : 0), 0, 1);
    brake += (wantBrake - brake) * (1 - Math.exp(-dt * 10));

    var gear = 1; for (var gi = 0; gi < UP.length; gi++) if (spdSm > UP[gi]) gear = gi + 2;
    var lo = gear === 1 ? 0 : UP[gear - 2], hi = gear === 7 ? 340 : UP[gear - 1];
    var rpmT = spdSm < 1.5 ? 0.18 + Math.sin(now / 90) * 0.01 : 0.28 + 0.72 * clamp((spdSm - lo) / (hi - lo), 0, 1);
    rpm += (rpmT - rpm) * (1 - Math.exp(-dt * (spdSm < 1.5 ? 4 : 9)));
    var thr = clamp(accelK / 180, 0, 1);

    var z = -cur * K, fwd = prevZ - z;
    mx += (mxT - mx) * 0.05;
    var steerTarget = LANE + (reduce ? 0 : mx * 0.5);
    var cx = car.position.x + (steerTarget - car.position.x) * 0.08, latV = (cx - prevCx) / dt; prevCx = cx;
    var idle = 1 - sn;
    car.position.set(cx, (reduce ? 0 : Math.sin(now / 37) * 0.0035 * idle) + Math.sin(now / 60) * 0.004 * sn, z);
    car.rotation.y = -(steerTarget - cx) * 0.5 + (reduce ? 0 : Math.sin(now / 900) * 0.01);
    car.rotation.z = (reduce ? 0 : -mx * 0.02 - latV * 0.004) + Math.sin(now / 70) * 0.002 * sn;
    car.rotation.x = (reduce ? 0 : clamp(accelK * 0.00022, -0.04, 0.04));

    for (var wi = 0; wi < wheels.length; wi++) {
      var w = wheels[wi], rate = Math.abs(fwd) / dt / w.R;
      w.spin.rotation.x -= fwd / w.R;
      var bl = clamp(rate / 28, 0, 1); w.spokeMat.opacity = 1 - 0.9 * bl; w.blurMat.opacity = 0.85 * bl;
    }

    var fov = 62 + (reduce ? 0 : sn * 15);
    if (Math.abs(camera.fov - fov) > 0.02) { camera.fov = fov; camera.updateProjectionMatrix(); }
    shake = reduce ? 0 : sn * 0.012;
    camera.position.set(cx * 0.6 + (reduce ? 0 : mx * 0.5) + (Math.random() - 0.5) * shake, (narrow ? 2.5 : 2.05) + (Math.random() - 0.5) * shake, z + (narrow ? 8.8 : 7.0));
    camera.lookAt(cx * 0.8 + (reduce ? 0 : mx * 0.6), narrow ? 0.0 : 0.9, z - 10);

    /* Stage and accent colour */
    var stage = 'Pit lane', vc = cur + window.innerHeight / 2, idx = 0;
    if (stageCenters.length) {
      var first = stageCenters[0] - window.innerHeight * 0.6, last = stageCenters[stageCenters.length - 1] + window.innerHeight * 0.6;
      if (vc >= first && vc <= last) {
        var bi2 = 0, bd = 1e9; stageCenters.forEach(function (c, k) { var dd = Math.abs(c - vc); if (dd < bd) { bd = dd; bi2 = k; } });
        stage = 'Stage 0' + (bi2 + 1) + ' / 0' + stageCenters.length; idx = bi2 % PAL.length;
      } else if (vc > last) { stage = 'Free roam'; idx = 4; }
    }
    if (idx !== accIdx) { accIdx = idx; accTarget.set(PAL[idx]); document.documentElement.style.setProperty('--acc', PAL[idx]); }
    accCur.lerp(accTarget, 1 - Math.exp(-dt * 3));
    mAcc.color.copy(accCur).multiplyScalar(0.5); mAcc.emissive.copy(accCur);
    roadU.uAcc.value.set(accCur.r, accCur.g, accCur.b); smU.uAcc.value.set(accCur.r, accCur.g, accCur.b); skU.uCol.value.set(lerp(accCur.r, 1, 0.45), lerp(accCur.g, 1, 0.45), lerp(accCur.b, 1, 0.45));
    var ug = uglow.geometry.attributes.aCol.array; for (var ui = 0; ui < 3; ui++) { ug[ui * 3] = accCur.r; ug[ui * 3 + 1] = accCur.g; ug[ui * 3 + 2] = accCur.b; } uglow.geometry.attributes.aCol.needsUpdate = true;
    pAcc.color.copy(accCur);

    sky.position.copy(camera.position);
    roadU.uCam.value.copy(camera.position); roadU.uCar.value.set(cx, z, 0); roadU.uBrake.value = brake; smU.uBrake.value = brake;
    skU.uCamZ.value = z; skU.uLen.value = 0.5 + sn * 14; skU.uAlpha.value = reduce ? 0 : 0.08 + sn * 0.7;
    tailGain.value = 0.45 + brake * 2.2;
    tailMat.color.setRGB(1, 0.1 + brake * 0.25, 0.06 + brake * 0.2).multiplyScalar(0.55 + brake * 0.9);

    smU.uScale.value = renderer.domElement.height / (2 * Math.tan(camera.fov * Math.PI / 360));
    if (!reduce) { emitEffects(dt, prevZ, z, cx, sn, spdSm, accelK, latV, now); updateSmoke(dt); updateFx(dt); }
    prevZ = z;

    for (var i = 0; i < boards.length; i++) {
      var b = boards[i], dz = b.group.position.z - z;
      if (!b.passed && dz > -2 && dz < 6 && v > 40) { b.passed = true; audioWhoosh(sn); }
      if (dz > 12 || dz < -40) b.passed = false;
    }

    if (target > 40 !== navSolid) { navSolid = target > 40; nav.classList.toggle('solid', navSolid); }
    var sTxt = String(Math.round(spdSm)); if (sTxt !== lastSpdTxt) { spdEl.textContent = sTxt; lastSpdTxt = sTxt; }
    var dTxt = String(Math.round(cur * K * 2.5)); if (dTxt !== lastDistTxt) { distEl.textContent = dTxt; lastDistTxt = dTxt; }
    if (stage !== lastStage) { stageLbl.textContent = stage; lastStage = stage; }
    var gTxt = spdSm < 2 ? 'N' : String(gear); if (gTxt !== lastGear) { gearEl.textContent = gTxt; lastGear = gTxt; }
    var ln = Math.round(clamp((rpm - 0.3) / 0.7, 0, 1) * 14);
    if (ln !== litN) { litN = ln; for (var le2 = 0; le2 < 14; le2++) ledEls[le2].classList.toggle('on', le2 < ln); }
    audioUpdate(rpm, sn, thr);
    waveTick(now, sn);
    updateMsg();

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  layout();
  requestAnimationFrame(frame);
})();
