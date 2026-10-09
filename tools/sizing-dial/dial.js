// Sizing dial (prototype tool, not part of the site). Loads on top of a built
// copy of the site, reads its settings from window.DIAL_CONFIG (config.js),
// and adds a panel with one slider per control. Each slider overrides one CSS
// property for the breakpoint the window is in now. Drafts stay in this tab;
// "Lock this breakpoint" saves the values to the artifact's shared store
// (db doc `dial/<config id>`) so Claude can read them back.
// See tools/sizing-dial/README.md.
(() => {
  const C = window.DIAL_CONFIG;
  if (!C) return;
  const BPS = C.breakpoints;
  const CTRLS = C.controls;
  const KEY = 'sizing-dial-' + C.id;
  const DOC = 'dial/' + C.id;
  let drafts = {}; let locked = {};
  try { drafts = JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch (e) {}
  const saveDrafts = () => { try { sessionStorage.setItem(KEY, JSON.stringify(drafts)); } catch (e) {} };

  const override = document.createElement('style');
  document.head.appendChild(override);
  const unit = (c) => c.unit || 'px';
  const valueFor = (bp, id) => (drafts[bp] && drafts[bp][id] != null ? drafts[bp][id]
    : locked[bp] && locked[bp].values && locked[bp].values[id] != null ? locked[bp].values[id] : null);
  function applyCss() {
    let css = '';
    BPS.forEach((b) => {
      let rules = '';
      CTRLS.forEach((c) => { const v = valueFor(b.id, c.id); if (v != null) rules += `${c.sel}{${c.prop}:${v}${unit(c)}!important}`; });
      if (rules) css += `@media (min-width:${b.min}px) and (max-width:${b.max}px){${rules}}`;
    });
    override.textContent = css;
  }

  const panelCss = `
  .sdial{position:fixed;top:80px;right:16px;z-index:100;width:min(320px,calc(100vw - 32px));max-height:calc(100vh - 96px);overflow:auto;background:#fff;border:1px solid rgba(72,65,73,.15);border-radius:12px;padding:8px 12px 12px;font:13px/1.5 Geist,system-ui,sans-serif;color:#484149;box-shadow:0 12px 32px -12px rgba(72,65,73,.25)}
  .sdial.left{right:auto;left:16px}
  .sdial summary{cursor:pointer;font-weight:600;color:#5b5f8d;padding:4px 0}
  .sdial .now{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin:4px 0 8px;padding:8px 10px;border-radius:8px;background:#f1dcba}
  .sdial .now b{font-size:18px;font-variant-numeric:tabular-nums}
  .sdial .now span{font-weight:500}
  .sdial h4{margin:12px 0 0;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a65646}
  .sdial label{display:grid;grid-template-columns:1fr auto;gap:2px 8px;margin-top:8px}
  .sdial input{grid-column:1/-1;width:100%;accent-color:#5b5f8d}
  .sdial output{font-variant-numeric:tabular-nums;font-weight:500}
  .sdial output.moved{color:#5b5f8d}
  .sdial .hint{color:#6f6770;font-size:12px;margin:6px 0 0}
  .sdial .row{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
  .sdial button{flex:1;font:500 13px Geist,system-ui,sans-serif;border:0;border-radius:8px;padding:7px 8px;cursor:pointer;background:#5b5f8d;color:#fff;white-space:nowrap}
  .sdial button.ghost{background:#f6eee1;color:#484149}
  .sdial button:focus-visible,.sdial input:focus-visible{outline:2px solid #5b5f8d;outline-offset:2px}
  .sdial table{width:100%;border-collapse:collapse;margin-top:8px;font-variant-numeric:tabular-nums;font-size:12px}
  .sdial th,.sdial td{text-align:left;padding:3px 4px}
  .sdial th{color:#6f6770;font-weight:500}
  .sdial tr.on td{background:#f6eee1}
  .sdial .lk{color:#557a5c;font-weight:600}
  .sdial .status{font-size:12px;color:#6f6770;margin:6px 0 0;min-height:18px}
  .sdial .measure{font-size:12px;color:#6f6770;font-variant-numeric:tabular-nums;margin:6px 0 0}`;

  function build() {
    const st = document.createElement('style'); st.textContent = panelCss; document.head.appendChild(st);
    const d = document.createElement('details');
    d.className = 'sdial'; d.open = true;
    let groups = ''; let last = '';
    CTRLS.forEach((c) => {
      if (c.group && c.group !== last) { groups += `<h4>${c.group}</h4>`; last = c.group; }
      groups += `<label for="sd-${c.id}">${c.label} <output id="sd-${c.id}-out"></output><input id="sd-${c.id}" type="range" min="${c.min}" max="${c.max}" step="${c.step || 1}"></label>`;
    });
    const cols = C.tableColumns || CTRLS.slice(0, 2).map((c) => c.id);
    const colHead = cols.map((id) => `<th>${CTRLS.find((c) => c.id === id).short || CTRLS.find((c) => c.id === id).label}</th>`).join('');
    d.innerHTML = `<summary>${C.title}</summary>
      <div class="now"><span id="sdBp"></span><b id="sdW"></b></div>
      <p class="hint">Sliders change the breakpoint you're in now. Resize the window to move to another one.</p>
      ${groups}
      <p class="measure" id="sdMeasure"></p>
      <div class="row"><button type="button" id="sdLock">Lock this breakpoint</button><button type="button" class="ghost" id="sdReset">Reset</button></div>
      <p class="status" id="sdStatus" aria-live="polite"></p>
      <h4>Breakpoints</h4>
      <table><thead><tr><th>Screen</th>${colHead}<th></th></tr></thead><tbody id="sdRows"></tbody></table>
      <div class="row">${C.jumpTo ? '<button type="button" class="ghost" id="sdJump">Show the section</button>' : ''}<button type="button" class="ghost" id="sdSide">Move panel</button></div>`;
    document.body.appendChild(d);
    const $ = (id) => document.getElementById(id);
    const active = () => BPS.find((b) => innerWidth >= b.min && innerWidth <= b.max) || BPS[BPS.length - 1];
    const live = (c) => { const el = document.querySelector(c.sel); if (!el) return null; const v = parseFloat(getComputedStyle(el).getPropertyValue(c.prop)); return isNaN(v) ? null : Math.round(v * 10) / 10; };
    let db = null;

    function render() {
      const b = active();
      $('sdBp').textContent = `${b.label} · ${b.range}`;
      $('sdW').textContent = innerWidth + 'px';
      CTRLS.forEach((c) => {
        const v = live(c);
        const input = $('sd-' + c.id), out = $('sd-' + c.id + '-out');
        if (v != null && document.activeElement !== input) input.value = v;
        out.textContent = v != null ? v + unit(c) : '–';
        out.classList.toggle('moved', !!(drafts[b.id] && drafts[b.id][c.id] != null));
      });
      $('sdMeasure').textContent = (C.measure || []).map((m) => {
        const el = document.querySelector(m.sel); if (!el) return `${m.label} –`;
        const r = el.getBoundingClientRect(); return `${m.label} ${Math.round(r.width)} × ${Math.round(r.height)}`;
      }).join(' · ');
      $('sdRows').innerHTML = BPS.map((x) => {
        const lk = locked[x.id] && locked[x.id].values;
        const cells = cols.map((id) => { const v = valueFor(x.id, id); return `<td>${v != null ? v + unit(CTRLS.find((c) => c.id === id)) : '–'}</td>`; }).join('');
        return `<tr class="${x === b ? 'on' : ''}"><td>${x.range}</td>${cells}<td class="lk">${lk ? 'Locked' : ''}</td></tr>`;
      }).join('');
    }

    CTRLS.forEach((c) => {
      $('sd-' + c.id).addEventListener('input', (e) => {
        const b = active();
        drafts[b.id] = drafts[b.id] || {};
        drafts[b.id][c.id] = +e.target.value;
        applyCss(); saveDrafts(); requestAnimationFrame(render);
      });
    });

    $('sdLock').addEventListener('click', async () => {
      const b = active();
      const values = {};
      CTRLS.forEach((c) => { values[c.id] = live(c); });
      if (!db) { $('sdStatus').textContent = "Couldn't reach the shared store, so this lock is only in this tab. Tell Claude the values instead."; return; }
      const next = { ...locked, [b.id]: { values, width: innerWidth, at: new Date().toISOString() } };
      $('sdStatus').textContent = 'Saving…';
      try {
        const [col, docId] = DOC.split('/');
        await db.collection(col).doc(docId).set({ breakpoints: next });
        locked = next;
        delete drafts[b.id]; saveDrafts(); applyCss();
        $('sdStatus').textContent = `Locked ${b.label} (${b.range}). Claude can read these values now.`;
      } catch (err) {
        $('sdStatus').textContent = `Couldn't save: ${err && err.message ? err.message : 'unknown error'}.`;
      }
      render();
    });
    $('sdReset').addEventListener('click', () => {
      const b = active(); delete drafts[b.id]; saveDrafts(); applyCss();
      $('sdStatus').textContent = `${b.label} back to ${locked[b.id] ? 'its locked values' : 'the live site'}.`;
      requestAnimationFrame(render);
    });
    if (C.jumpTo) $('sdJump').addEventListener('click', jump);
    $('sdSide').addEventListener('click', () => d.classList.toggle('left'));
    addEventListener('resize', render);
    render(); setInterval(render, 1000);

    (async () => {
      try { db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch (e) { db = null; }
      if (!db) { $('sdStatus').textContent = 'Locking needs you signed in to claude.ai. Drafts still work in this tab.'; return; }
      const [col, docId] = DOC.split('/');
      db.collection(col).doc(docId).onSnapshot((snap) => {
        locked = (snap.exists && snap.data().breakpoints) || {};
        applyCss(); render();
      }, () => { $('sdStatus').textContent = "Couldn't load locked values."; });
    })();
  }

  function jump() {
    const w = C.jumpTo && document.querySelector(C.jumpTo);
    if (w) window.scrollTo(0, w.getBoundingClientRect().top + scrollY);
  }
  applyCss();
  const start = () => { build(); if (C.jumpTo) setTimeout(jump, 1200); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
