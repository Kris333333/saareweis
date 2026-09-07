// ===== ÜLEANDMISEL MUUDA AINULT SEDA: Kris'i Apps Scripti veebirakenduse aadress (/exec) =====
var SW_WEBHOOK = 'https://script.google.com/macros/s/AKfycbyFy9oZZhnCeAJs4wqWJEnjvFaTFekjClu6aMFoTiaSH_vUpNbQzz4tkBEAn8ECoHZW8g/exec';

// Header: läbipaistev hero peal, muutub kerides tumedaks
(function () {
  var header = document.getElementById('siteHeader');
  if (!header) return;
  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 60);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Mobiilimenüü: hamburgeri lüliti
(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.querySelector('.header__nav');
  if (!toggle || !nav) return;
  function close() {
    nav.classList.remove('open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') close();
  });
})();

// Tellimisvorm: kohandatud vorm -> Google Form (või testina e-postile)
(function () {
  var form = document.getElementById('orderForm');
  if (!form) return;
  var statusEl = document.getElementById('ofStatus');

  // ---- SEADISTUS -------------------------------------------------------
  // Tellimus läheb Apps Scripti (Google) kaudu: logib "SaareWeis tellimused"
  // tabelisse, vähendab laoseisu ja saadab teavituse. Muud backendi pole.
  var STOCK_WEBHOOK = SW_WEBHOOK;
  // ----------------------------------------------------------------------

  function val(n) { var el = form.elements[n]; return el ? String(el.value).trim() : ''; }
  function num(n) { return parseInt(val(n), 10) || 0; }
  function boxCount() { return num('hakklihakast') + num('perekast') + num('grillkast') + num('hakkliha500'); }
  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.classList.remove('is-error', 'is-warn', 'is-ok');
    if (kind) statusEl.classList.add('is-' + kind);
  }

  // Carry the chosen box into the form: "Telli kast" buttons pre-select that product
  function pickBox(name) {
    var fld = form.elements[name];
    if (!fld) return;
    if ((parseInt(fld.value, 10) || 0) < 1) fld.value = 1;
    var row = fld.closest('.qty');
    if (row) { row.classList.add('qty--picked'); setTimeout(function () { row.classList.remove('qty--picked'); }, 1400); }
  }
  document.querySelectorAll('.box__cta[data-box]').forEach(function (btn) {
    btn.addEventListener('click', function () { pickBox(btn.getAttribute('data-box')); });
  });
  var qbox = new URLSearchParams(location.search).get('box');
  if (qbox) pickBox(qbox);

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (val('website')) { return; } // spämmilõks: bot täitis peidetud välja -> katkesta vaikselt
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (boxCount() === 0) { setStatus('Vali vähemalt üks toode (kogus üle 0).', 'warn'); return; }

    var btn = form.querySelector('.orderform__submit');
    btn.disabled = true;
    setStatus('Saadan…');
    submitOrder(btn);
  });

  function onOk(btn) {
    form.reset();
    btn.disabled = false;
    setStatus('Aitäh! Tellimus on saadetud. Võtame sinuga peagi ühendust.', 'ok');
  }
  function onFail(btn) {
    btn.disabled = false;
    setStatus('Midagi läks valesti. Proovi uuesti või kirjuta saareweis@gmail.com.', 'error');
  }

  // Saada tellimus Apps Scriptile (logib + vähendab ladu + teavitab e-postiga)
  function submitOrder(btn) {
    var order = {
      token: 'sw7Qx2Lp9mVt4Kd',
      nimi: val('nimi'), epost: val('epost'), tel: val('tel'),
      kattesaamine: val('kattesaamine'), aadress: val('aadress'),
      hakklihakast: num('hakklihakast'), perekast: num('perekast'),
      grillkast: num('grillkast'), hakkliha500: num('hakkliha500'),
      markused: val('markused')
    };
    var settled = false;
    function finish(ok) { if (settled) return; settled = true; ok ? onOk(btn) : onFail(btn); }
    // no-cors: vastust ei saa lugeda, aga päring jõuab kohale; kinnitame lõpetamisel
    fetch(STOCK_WEBHOOK, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(order)
    }).then(function () { finish(true); }).catch(function () { finish(false); });
    // varuvariant, kui vastust ei tule
    setTimeout(function () { finish(true); }, 4500);
  }
})();

// Ladu: loeb "kaste jäänud" numbrid Google Sheetist ja näitab neid kastidel
(function () {
  var stockEls = document.querySelectorAll('.box__stock[data-stock]');
  if (!stockEls.length) return;

  // ---- SEADISTUS -------------------------------------------------------
  var SHEET_ID = '1tbl8BMe-Qi98wvZ1bHsxZ4cqwEH4ubQhPpJHx-AT1kQ'; // "SaareWeis ladu", veerg "jaanud"
  // Kuidas silt käitub, kui laos > 0 (FOMO). Kui laos <= 0 -> "Otsas sel ringil".
  //  {cap:N} -> näita ALATI min(tegelik, N) (FOMO ka siis, kui laos on rohkem)
  //  {low:N} -> näita AINULT siis, kui tegelik <= N (ei mingit võlts-FOMO-t)
  var STOCK = {
    hakklihakast: { low: 5 },
    perekast:     { cap: 5 },
    grillkast:    { cap: 3 }
  };
  // ----------------------------------------------------------------------

  var url = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?tqx=out:json&gid=0';
  fetch(url)
    .then(function (r) { return r.text(); })
    .then(function (t) {
      var json = JSON.parse(t.substring(t.indexOf('(') + 1, t.lastIndexOf(')')));
      var cols = json.table.cols.map(function (c) { return (c.label || '').toString().toLowerCase(); });
      var ki = cols.indexOf('key'), ri = cols.indexOf('jaanud');
      if (ki < 0 || ri < 0) return;
      var map = {};
      json.table.rows.forEach(function (row) {
        var k = row.c[ki] && row.c[ki].v;
        var v = row.c[ri] && row.c[ri].v;
        if (k != null) map[String(k)] = Number(v);
      });
      applyStock(map);
    })
    .catch(function () { /* sheet pole veel jagatud vöi kättesaamatu: jäta vahele */ });

  function applyStock(map) {
    // Aus mudel: broneering = koht sel ringil, kinnitad maksega. Kui selle ringi
    // kastid on otsas (jaanud<=0), siis seda kasti sel ringil tellida ei saa ->
    // näita "Otsas sel ringil" + suuna "Teata mulle" (järgmise ringi list).
    var isHome = document.body.classList.contains('home');
    stockEls.forEach(function (el) {
      var k = el.getAttribute('data-stock');
      if (!(k in map)) return;
      var n = map[k];
      var cfg = STOCK[k];
      var card = el.closest('.box');
      var cta = card && card.querySelector('.box__cta');
      el.classList.remove('is-low', 'is-out');
      if (n <= 0) {
        el.textContent = 'Otsas sel ringil'; el.classList.add('is-out');
        if (card) card.classList.add('box--out');
        if (cta) {
          cta.textContent = 'Teata mulle →';
          cta.setAttribute('href', isHome ? 'tellimine.html#teata' : '#teata');
          cta.removeAttribute('data-box');
          cta.classList.add('box__cta--out');
        }
        var row = document.querySelector('.qty[data-box="' + k + '"]');
        if (row) { var inp = row.querySelector('input'); if (inp) { inp.value = 0; inp.disabled = true; } row.classList.add('qty--out'); }
      } else if (cfg && cfg.cap != null) {
        el.textContent = 'Viimased ' + Math.min(n, cfg.cap) + ' kasti'; el.classList.add('is-low');
      } else if (cfg && cfg.low != null && n <= cfg.low) {
        el.textContent = 'Viimased ' + n + ' kasti'; el.classList.add('is-low');
      } else {
        el.textContent = '';
      }
    });
  }
})();

// "Teata mulle" — järgmise ringi ootelist (0-kastiline broneering samasse tabelisse)
(function () {
  var nf = document.getElementById('notifyForm');
  if (!nf) return;
  var st = document.getElementById('notifyStatus');
  var WEBHOOK = SW_WEBHOOK;

  nf.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!nf.checkValidity()) { nf.reportValidity(); return; }
    var btn = nf.querySelector('button');
    btn.disabled = true;
    st.textContent = 'Saadan…'; st.className = 'notify__status';
    var payload = {
      token: 'sw7Qx2Lp9mVt4Kd',
      nimi: '', epost: nf.elements['epost'].value.trim(), tel: '',
      kattesaamine: '', aadress: '',
      hakklihakast: 0, perekast: 0, grillkast: 0, hakkliha500: 0,
      markused: 'OOTELIST - soovib teadet jargmisest ringist'
    };
    var settled = false;
    function done(ok) {
      if (settled) return; settled = true; btn.disabled = false;
      if (ok) { nf.reset(); st.textContent = 'Aitäh! Anname teada, kui järgmine ring avaneb.'; st.classList.add('is-ok'); }
      else { st.textContent = 'Midagi läks valesti. Proovi uuesti.'; st.classList.add('is-error'); }
    }
    fetch(WEBHOOK, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      .then(function () { done(true); }).catch(function () { done(false); });
    setTimeout(function () { done(true); }, 4500);
  });
})();
