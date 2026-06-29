/* WontOS editable content + admin config.
   Single source of truth for the Admin panel and every app.
   DEFAULTS hold the real content; user edits are stored as overrides in
   localStorage[KEY] and deep-merged over DEFAULTS via WONT.effective(). */
(function () {
  var KEY = 'wontos_cfg';

  var DEFAULTS = {
    terminal: {
      name: 'Wontfallo',
      tagline: 'Engineer · Embedded · Security · Maker',
      bio: [
        "I'm a software & hardware hacker and a",
        "lifelong learner. I work across embedded",
        "systems, full-stack web, and cyber security —",
        "anything I can take apart and rebuild better."
      ],
      focus: [
        'Embedded firmware & ESP32 hardware',
        'Full-stack web (this OS runs in your browser)',
        'Cyber security & tooling',
        'Electronics, PCBs & cryogenics'
      ],
      skills: [
        'languages   [ C/C++, JavaScript, Python, Bash ]',
        'embedded    [ ESP-IDF, PlatformIO, ESP32-S3/C5 ]',
        'security    [ pentesting, hardening, tooling ]',
        'hardware    [ electronics, PCB, cryogenics ]'
      ],
      projects: [
        '01  WontOS — browser desktop OS w/ ESP32 web flasher',
        '02  Wonthound — ESP32-S3 / C5 / CYD firmware',
        '03  ESP Web Flasher — flash from the browser (esptool-js)'
      ],
      contact: {
        web: 'https://wontfallo.github.io/',
        email: 'budtron10@gmail.com',
        github: '@Wontfallo'
      }
    },

    aboutme: {
      name: 'Wontfallo',
      title: 'ENGINEER // EMBEDDED · FULL-STACK · CYBERSEC · ELECTRONICS · CRYOGENICS',
      location: '[DATA ENCRYPTED]',
      status: 'ONLINE // MAKING HARDWARE AND SOFTWARE TALK',
      skills: [
        { name: 'C / C++ (EMBEDDED)', pct: 90 },
        { name: 'ESP-IDF / PLATFORMIO', pct: 90 },
        { name: 'ELECTRONICS / PCB', pct: 88 },
        { name: 'JAVASCRIPT / WEB', pct: 85 },
        { name: 'CYBERSECURITY', pct: 82 },
        { name: 'CRYOGENICS', pct: 75 }
      ],
      projects: [
        'WontOS — browser desktop OS with a built-in ESP32 web flasher',
        'Wonthound — ESP32-S3 / ESP32-C5 / CYD firmware builds',
        'ESP Web Flasher — flash firmware from the browser (esptool-js)'
      ],
      contact: {
        email: 'budtron10@gmail.com',
        github: 'github.com/Wontfallo',
        site: 'wontfallo.github.io'
      }
    },

    notepad: {
      text: 'Welcome to Notepad.\n\nThis is a real text editor — type anything and it auto-saves.\nTip: open the Terminal and run  /about --me\n'
    },

    browser: {
      homepage: 'https://wontfallo.github.io/'
    }
  };

  function isObj(x) { return x && typeof x === 'object' && !Array.isArray(x); }

  // deep-merge: objects merge recursively; arrays/scalars in override replace.
  function merge(base, over) {
    if (!isObj(base)) return over === undefined ? base : over;
    var out = {};
    for (var k in base) out[k] = base[k];
    if (isObj(over)) {
      for (var j in over) {
        out[j] = (isObj(base[j]) && isObj(over[j])) ? merge(base[j], over[j]) : over[j];
      }
    }
    return out;
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(cfg) {
    try { localStorage.setItem(KEY, JSON.stringify(cfg || {})); return true; } catch (e) { return false; }
  }

  // Published layer: content.json committed at the repo root (global for all
  // visitors). Resolved relative to this script so it works from / and /apps/.
  // Loaded once, synchronously, before the apps render.
  var _published = null;
  function publishedUrl() {
    try {
      var s = (document.currentScript && document.currentScript.src) ||
              (function () { var a = document.getElementsByTagName('script'); for (var i = a.length - 1; i >= 0; i--) if (/config\.js/.test(a[i].src)) return a[i].src; return ''; })();
      return s.replace(/[^/]*js\/config\.js.*$/, '') + 'content.json';
    } catch (e) { return 'content.json'; }
  }
  function published() {
    if (_published !== null) return _published;
    _published = {};
    try {
      var x = new XMLHttpRequest();
      x.open('GET', publishedUrl(), false);
      x.send(null);
      if (x.status >= 200 && x.status < 300 && x.responseText) _published = JSON.parse(x.responseText) || {};
    } catch (e) { _published = {}; }
    return _published;
  }

  function effective() { return merge(merge(DEFAULTS, published()), load()); }

  // tiny non-secure hash for the soft admin lock (NOT real security)
  function hash(s) {
    var h = 5381, i = s.length;
    while (i) h = (h * 33) ^ s.charCodeAt(--i);
    return (h >>> 0).toString(16);
  }
  var AKEY = 'wontos_admin_pw';
  function getPwHash() { try { return localStorage.getItem(AKEY) || hash('admin'); } catch (e) { return hash('admin'); } }
  function setPw(pw) { try { localStorage.setItem(AKEY, hash(pw)); return true; } catch (e) { return false; } }
  function checkPw(pw) { return hash(pw) === getPwHash(); }
  function isDefaultPw() { return getPwHash() === hash('admin'); }

  window.WONT = {
    KEY: KEY,
    DEFAULTS: DEFAULTS,
    load: load,
    save: save,
    effective: effective,
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} },
    setPw: setPw,
    checkPw: checkPw,
    isDefaultPw: isDefaultPw
  };
})();
