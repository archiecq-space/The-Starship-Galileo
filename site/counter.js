// VISIT ODOMETER v4 — seated 11 September 2026 (his order: "the counter type
// changed, it simply doesnt work"). TYPE CHANGE: the dwyl badge service is
// abandoned (ad-blockers eat its pings; the number kept dying). The global
// count now rides the busuanzi page-PV service — account-free, keyed by the
// site domain, battle-tested. The reset-proof layering is unchanged:
//   floor  = BASE + max(local odometer, global high-water mark)
//   global = busuanzi page_pv for this page; the high-water mark rides in
//            storage so any service reset can never drag the number down.
//   Service dead or storage blocked: the local floor stands.
(function(){
  var el = document.getElementById('visitCount');
  if(!el) return;
  var BASE = parseInt(el.getAttribute('data-base') || '0', 10);
  var NAME = el.getAttribute('data-key') || 'main';
  var KEY  = 'gp_visit_' + NAME;
  var HWM  = KEY + '_hwm';
  function show(n){ el.textContent = (BASE + n).toLocaleString('en-US'); }
  var local = 0, hwm = 0, store = true, fresh = false;
  try {
    local = parseInt(localStorage.getItem(KEY) || '0', 10); if (isNaN(local)||local<0) local=0;
    hwm   = parseInt(localStorage.getItem(HWM) || '0', 10); if (isNaN(hwm)||hwm<0) hwm=0;
    if (!sessionStorage.getItem(KEY+'_s')) {
      fresh = true;
      local++;
      sessionStorage.setItem(KEY+'_s','1');
      localStorage.setItem(KEY, String(local));
    }
  } catch(e){ store=false; }
  show(Math.max(local, hwm));
  // hidden sink the busuanzi mini script fills with this page's global PV
  var sink = document.createElement('span');
  sink.id = 'busuanzi_container_page_pv';
  sink.style.display = 'none';
  sink.innerHTML = '<span id="busuanzi_value_page_pv"></span>';
  document.body.appendChild(sink);
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  document.body.appendChild(s);
  var tries = 0;
  var t = setInterval(function(){
    tries++;
    var v = document.getElementById('busuanzi_value_page_pv');
    var n = v ? parseInt(v.textContent, 10) : NaN;
    if (!isNaN(n) && n >= 0) {
      clearInterval(t);
      if (store && n > hwm){ hwm = n; try{ localStorage.setItem(HWM, String(hwm)); }catch(e){} }
      show(Math.max(local, hwm));
    } else if (tries >= 20) { // ~10 s, then the floor stands alone
      clearInterval(t);
    }
  }, 500);
})();
