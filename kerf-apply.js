/* Set any page in Kerf, entirely in the browser.
 *
 * One fixed rule set, so the same page always gets the same families:
 *   a stack whose family is monospace         -> Kerf Mono
 *   a stack whose family is serif             -> Kerf Text
 *   an icon font                              -> left alone, so icons keep working
 *   inherit, initial, unset                   -> left alone
 *   a stack led by var(--x)                   -> left alone; --x is converted where it is defined
 *   anything else                             -> the chosen sans member
 * The original stack stays behind Kerf as its fallback. Custom properties
 * count as font stacks when a font-family or font declaration uses them.
 *
 *   KerfConvert.apply({ sans: "sans" | "round" | "text" })  converts the live page
 *   KerfConvert.revert()                                     puts it back
 *   KerfConvert.rewriteCSS(css, opts), rewriteHTML(html, opts) convert code
 */
(function (root) {
  "use strict";
  const FONT_BASE = "https://kerf.kevinliu.studio/fonts/";
  // [family, file, weights, unicode-range]: each member's core and one face per
  // script, written by tools/build_site.py, so a page loads only what it shows
  /* generated faces: start */
  const FACES = [["Kerf Sans","KerfSans.woff2?v=30804a8791","100 900","U+0-52F,U+1D00-27FA,U+2913,U+2A38-2B24,U+2C7C-2C7F,U+2DFF-2E18,U+A69F,U+A7FF,U+A92E,U+E000-E2DC,U+EE01-EEE1,U+F6C3,U+1F12F-1F16B,U+1F850-1F852"],["Kerf Sans","KerfSans-devanagari.woff2?v=220bf1a5f5","100 900","U+900-97F,U+1CD0-1CF9,U+A8E0-A8FF"],["Kerf Sans","KerfSans-arabic.woff2?v=663b2bdf7e","100 900","U+600-8FF,U+FB50-FEFF"],["Kerf Sans","KerfSans-bengali.woff2?v=d9824ffa0c","100 900","U+980-9FE"],["Kerf Sans","KerfSans-gurmukhi.woff2?v=ecd1f8ba24","100 900","U+A01-A76"],["Kerf Sans","KerfSans-gujarati.woff2?v=7f44ce1938","100 900","U+A81-AFF"],["Kerf Sans","KerfSans-oriya.woff2?v=5611ddfb9f","100 900","U+B01-B77"],["Kerf Sans","KerfSans-tamil.woff2?v=69dceeaafd","100 900","U+B82-BFA"],["Kerf Sans","KerfSans-telugu.woff2?v=c5568e317a","100 900","U+C00-C7F"],["Kerf Sans","KerfSans-kannada.woff2?v=716ab2e3be","100 900","U+C80-CF3"],["Kerf Sans","KerfSans-malayalam.woff2?v=72641beef0","100 900","U+D00-D7F"],["Kerf Sans","KerfSans-sinhala.woff2?v=9bce798e7a","100 900","U+D81-DF4,U+111E1-111F4"],["Kerf Sans","KerfSans-thai.woff2?v=a38ecfea7d","100 900","U+E01-E5B"],["Kerf Sans","KerfSans-lao.woff2?v=4e75d62354","100 900","U+E81-EDF"],["Kerf Sans","KerfSans-myanmar.woff2?v=fb3f823918","100 900","U+1000-109F,U+A9E0-AA7F"],["Kerf Sans","KerfSans-ethiopic.woff2?v=1c281566f0","100 900","U+1200-1399,U+2D80-2DDE,U+AB01-AB2E,U+1E7E0-1E7FE"],["Kerf Sans","KerfSans-hebrew.woff2?v=5ccadb4df5","100 900","U+591-5F4,U+FB1D-FB4F"],["Kerf Sans","KerfSans-armenian.woff2?v=9aaef2235a","100 900","U+531-58F,U+FB13-FB17"],["Kerf Sans","KerfSans-georgian.woff2?v=d8bbfff1dc","100 900","U+10A0-10FF,U+1C90-1CBF,U+2D00-2D2D"],["Kerf Sans","KerfSans-khmer.woff2?v=dd82e286c9","100 900","U+1780-17F9,U+19E0-19FF"],["Kerf Round","KerfRound.woff2?v=089dbe6eae","100 900","U+0-52F,U+1D00-27FA,U+2913,U+2A38-2B24,U+2C7C-2C7F,U+2DFF-2E18,U+A69F,U+A7FF,U+A92E,U+E000-E2DC,U+EE01-EEE1,U+F6C3,U+1F12F-1F16B,U+1F850-1F852"],["Kerf Round","KerfRound-devanagari.woff2?v=44d7844c03","100 900","U+900-97F,U+1CD0-1CF9,U+A8E0-A8FF"],["Kerf Round","KerfRound-arabic.woff2?v=7edf366ca0","100 900","U+600-8FF,U+FB50-FEFF"],["Kerf Round","KerfRound-bengali.woff2?v=9971320732","100 900","U+980-9FE"],["Kerf Round","KerfRound-gurmukhi.woff2?v=c3d4180a33","100 900","U+A01-A76"],["Kerf Round","KerfRound-gujarati.woff2?v=c21ab2cbf2","100 900","U+A81-AFF"],["Kerf Round","KerfRound-oriya.woff2?v=e2de78b3d0","100 900","U+B01-B77"],["Kerf Round","KerfRound-tamil.woff2?v=95d361e9a2","100 900","U+B82-BFA"],["Kerf Round","KerfRound-telugu.woff2?v=bfbeb1a6ec","100 900","U+C00-C7F"],["Kerf Round","KerfRound-kannada.woff2?v=e85cdf9835","100 900","U+C80-CF3"],["Kerf Round","KerfRound-malayalam.woff2?v=dcbeee34b5","100 900","U+D00-D7F"],["Kerf Round","KerfRound-sinhala.woff2?v=7c1fd9375a","100 900","U+D81-DF4,U+111E1-111F4"],["Kerf Round","KerfRound-thai.woff2?v=d621dc7a05","100 900","U+E01-E5B"],["Kerf Round","KerfRound-lao.woff2?v=330e1e4960","100 900","U+E81-EDF"],["Kerf Round","KerfRound-myanmar.woff2?v=d516278e4a","100 900","U+1000-109F,U+A9E0-AA7F"],["Kerf Round","KerfRound-ethiopic.woff2?v=ac8820715a","100 900","U+1200-1399,U+2D80-2DDE,U+AB01-AB2E,U+1E7E0-1E7FE"],["Kerf Round","KerfRound-hebrew.woff2?v=7f20f79e5b","100 900","U+591-5F4,U+FB1D-FB4F"],["Kerf Round","KerfRound-armenian.woff2?v=b37a8b5a3c","100 900","U+531-58F,U+FB13-FB17"],["Kerf Round","KerfRound-georgian.woff2?v=56c28e87b6","100 900","U+10A0-10FF,U+1C90-1CBF,U+2D00-2D2D"],["Kerf Round","KerfRound-khmer.woff2?v=36b025888c","100 900","U+1780-17F9,U+19E0-19FF"],["Kerf Text","KerfText.woff2?v=6da74e6a50","100 900","U+0-52F,U+1D00-27FA,U+2913,U+2A38-2B24,U+2C7C-2C7F,U+2DFF-2E18,U+A69F,U+A7FF,U+A92E,U+E000-E2DC,U+EE01-EEE1,U+F6C3,U+1F12F-1F16B,U+1F850-1F852"],["Kerf Text","KerfText-devanagari.woff2?v=59f7f46fb1","100 900","U+900-97F,U+1CD0-1CF9,U+A8E0-A8FF"],["Kerf Text","KerfText-arabic.woff2?v=6d81b3a176","100 900","U+600-8FF,U+FB50-FEFF"],["Kerf Text","KerfText-bengali.woff2?v=1abaa68a60","100 900","U+980-9FE"],["Kerf Text","KerfText-gurmukhi.woff2?v=8c1ecae242","100 900","U+A01-A76"],["Kerf Text","KerfText-gujarati.woff2?v=31d03a157c","100 900","U+A81-AFF"],["Kerf Text","KerfText-oriya.woff2?v=71b468de1d","100 900","U+B01-B77"],["Kerf Text","KerfText-tamil.woff2?v=0d89ccd9c2","100 900","U+B82-BFA"],["Kerf Text","KerfText-telugu.woff2?v=0ad2c1384c","100 900","U+C00-C7F"],["Kerf Text","KerfText-kannada.woff2?v=317cb9d2d1","100 900","U+C80-CF3"],["Kerf Text","KerfText-malayalam.woff2?v=0d815e5eeb","100 900","U+D00-D7F"],["Kerf Text","KerfText-sinhala.woff2?v=56770ffa85","100 900","U+D81-DF4,U+111E1-111F4"],["Kerf Text","KerfText-thai.woff2?v=211052bcb8","100 900","U+E01-E5B"],["Kerf Text","KerfText-lao.woff2?v=0e9e431e37","100 900","U+E81-EDF"],["Kerf Text","KerfText-myanmar.woff2?v=d9b0dbc9ef","100 900","U+1000-109F,U+A9E0-AA7F"],["Kerf Text","KerfText-ethiopic.woff2?v=5c385a113e","100 900","U+1200-1399,U+2D80-2DDE,U+AB01-AB2E,U+1E7E0-1E7FE"],["Kerf Text","KerfText-hebrew.woff2?v=f88328dcf3","100 900","U+591-5F4,U+FB1D-FB4F"],["Kerf Text","KerfText-armenian.woff2?v=b102c2dca7","100 900","U+531-58F,U+FB13-FB17"],["Kerf Text","KerfText-georgian.woff2?v=4facc851b1","100 900","U+10A0-10FF,U+1C90-1CBF,U+2D00-2D2D"],["Kerf Text","KerfText-khmer.woff2?v=2dcda24f58","100 900","U+1780-17F9,U+19E0-19FF"],["Kerf Mono","KerfMono.woff2?v=e1419b3d03","100 700","U+0-52F,U+1D00-27FA,U+2913,U+2A38-2B24,U+2C7C-2C7F,U+2DFF-2E18,U+A69F,U+A7FF,U+A92E,U+E000-E2DC,U+EE01-EEE1,U+F6C3,U+1F12F-1F16B,U+1F850-1F852"],["Kerf Mono","KerfMono-arabic.woff2?v=000d68769d","100 700","U+FEFF"],["Kerf Mono","KerfMono-thai.woff2?v=7db7004cfc","100 700","U+E3F"],["Kerf Sans","KerfCJKSC.woff2?v=de25a05e26","100 900","U+2E80-2FDF,U+3000-303F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FF60,U+FFE0-FFEF"],["Kerf Round","KerfCJKSC.woff2?v=de25a05e26","100 900","U+2E80-2FDF,U+3000-303F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FF60,U+FFE0-FFEF"],["Kerf Text","KerfCJKSC.woff2?v=de25a05e26","100 900","U+2E80-2FDF,U+3000-303F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FF60,U+FFE0-FFEF"],["Kerf Sans","KerfCJKJP.woff2?v=679bb88df3","100 900","U+3040-30FF,U+31F0-31FF,U+FF61-FF9F"],["Kerf Round","KerfCJKJP.woff2?v=679bb88df3","100 900","U+3040-30FF,U+31F0-31FF,U+FF61-FF9F"],["Kerf Text","KerfCJKJP.woff2?v=679bb88df3","100 900","U+3040-30FF,U+31F0-31FF,U+FF61-FF9F"],["Kerf Sans","KerfCJKKR.woff2?v=756b6e66bd","100 900","U+1100-11FF,U+3130-318F,U+A960-A97F,U+AC00-D7FF,U+FFA0-FFDC"],["Kerf Round","KerfCJKKR.woff2?v=756b6e66bd","100 900","U+1100-11FF,U+3130-318F,U+A960-A97F,U+AC00-D7FF,U+FFA0-FFDC"],["Kerf Text","KerfCJKKR.woff2?v=756b6e66bd","100 900","U+1100-11FF,U+3130-318F,U+A960-A97F,U+AC00-D7FF,U+FFA0-FFDC"]];
  /* generated faces: end */
  const MEMBERS = { sans: "Kerf Sans", round: "Kerf Round", text: "Kerf Text" };
  const KERF = /kerf (sans|round|text|mono)/i;
  const KEYWORDS = /^(inherit|initial|unset|revert|revert-layer)$/i;
  const MONO = /mono|courier|consolas|menlo|monaco|\bcode\b|\bterminal\b|^hack$|iosevka|inconsolata|\bocr/i;
  const ICON = /icon|awesome|glyphicons|material symbols|icomoon|feather|lucide|ionicons|dashicons|codicon|fontello|emoji/i;
  const SERIF = /^(georgia|times|times new roman|garamond|.* garamond|baskerville|.* baskerville|palatino|.*palatino.*|cambria|merriweather|playfair.*|lora|tiempos.*|charter|source serif.*|noto serif.*|crimson.*|literata|fraunces|newsreader|iowan old style|book antiqua|didot|bodoni.*|caslon.*|minion.*|spectral|libre caslon.*|dm serif.*|pt serif)$/i;
  const GENERIC = /^(monospace|serif|sans-serif|system-ui|ui-monospace|ui-serif|ui-sans-serif)$/i;
  // the family list inside a `font:` shorthand comes after the size (and line height)
  const SHORTHAND = /^(.*?(?:\d*\.?\d+(?:px|em|rem|%|pt|pc|vw|vh|vmin|vmax|ch|ex|cap|ic|lh|rlh|cqi)|xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large|smaller|larger|calc\([^)]*\)|var\([^)]*\))(?:\s*\/\s*[^\s,]+)?\s+)(.+)$/i;
  const DECL = /(^|[;{\s])(--[\w-]+|font-family|font)(\s*:\s*)([^;{}]*[^;{}\s])/gi;
  const VAR_REF = /var\(\s*(--[\w-]+)/g;

  /** Splits a stack at top-level commas, so var(--a, b) stays one entry. */
  function families(stack) {
    const out = [];
    let depth = 0, cur = "";
    for (const ch of stack) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      if (ch === "," && depth === 0) { out.push(cur); cur = ""; } else cur += ch;
    }
    out.push(cur);
    return out.map((f) => f.trim().replace(/^['"]|['"]$/g, "").trim()).filter(Boolean);
  }

  /** "mono" | "serif" | "icon" | "sans" | null (leave it). Decided by the first family, then the generic fallback. */
  function classify(stack) {
    if (!stack || KERF.test(stack)) return null;
    const list = families(stack.replace(/!important/i, ""));
    const first = list[0];
    if (!first || KEYWORDS.test(first) || /^var\(/i.test(first)) return null;
    if (ICON.test(first)) return "icon";
    if (/^(ui-)?monospace$/i.test(first) || MONO.test(first)) return "mono";
    if (/^(ui-)?serif$/i.test(first) || SERIF.test(first)) return "serif";
    if (/^(sans-serif|system-ui|ui-sans-serif|-apple-system|blinkmacsystemfont)$/i.test(first)) return "sans";
    const generic = list.slice().reverse().find((f) => GENERIC.test(f)) || "";
    if (/monospace$/i.test(generic)) return "mono";
    if (/^(ui-)?serif$/i.test(generic)) return "serif";
    return "sans";
  }

  function kerfStack(stack, opts) {
    const kind = classify(stack);
    if (kind === null || kind === "icon") return null;
    const kerf = kind === "mono" ? "Kerf Mono" : kind === "serif" ? "Kerf Text" : MEMBERS[opts.sans] || "Kerf Sans";
    const important = /!important/i.test(stack);
    return `"${kerf}", ${stack.replace(/\s*!important/i, "").trim()}${important ? " !important" : ""}`;
  }

  /** [property, value] pairs for font-family, font and custom properties in CSS text. */
  const declarations = (css) => [...css.matchAll(DECL)].map((m) => [m[2], m[4]]);

  /**
   * The custom properties that hold a font stack ("family") or a whole font
   * shorthand ("font"), found from the declarations that use them and then
   * along var() chains: --a: var(--b) makes --b a font variable too.
   */
  function fontVars(decls) {
    const kinds = new Map(), defs = new Map();
    const mark = (text, kind) => { for (const [, name] of text.matchAll(VAR_REF)) if (!kinds.has(name)) kinds.set(name, kind); };
    for (const [prop, value] of decls) {
      if (prop.startsWith("--")) { if (!defs.has(prop)) defs.set(prop, []); defs.get(prop).push(value); }
      else if (/^font-family$/i.test(prop)) mark(value, "family");
      else { const m = value.match(SHORTHAND); if (m) mark(m[2], "family"); else mark(value, "font"); }
    }
    for (const [name, kind] of kinds) { // a Map visits keys added during the loop
      for (const value of defs.get(name) || []) {
        const m = kind === "font" ? value.match(SHORTHAND) : null;
        mark(m ? m[2] : value, m ? "family" : kind);
      }
    }
    return kinds;
  }

  function emptyStats() { return { "Kerf Sans": 0, "Kerf Round": 0, "Kerf Text": 0, "Kerf Mono": 0, icon: 0 }; }

  /** The new value for one declaration, or null to leave it. */
  function rewriteValue(prop, value, opts, vars, stats) {
    const kind = prop.startsWith("--") ? vars.get(prop) : /^font-family$/i.test(prop) ? "family" : "font";
    if (!kind) return null;
    const m = kind === "font" ? value.match(SHORTHAND) : null;
    if (kind === "font" && !m) return null;
    const stack = m ? m[2] : value;
    const next = kerfStack(stack, opts);
    if (stats) {
      if (next) stats[next.match(/^"([^"]+)"/)[1]]++;
      else if (classify(stack) === "icon") stats.icon++;
    }
    return next && (m ? m[1] + next : next);
  }

  /** Rewrites font-family, font shorthand and font-stack custom properties in CSS text. */
  function rewriteCSS(css, opts = {}, stats = null, vars = fontVars(declarations(css))) {
    return css.replace(DECL, (all, pre, prop, colon, value) => {
      const next = rewriteValue(prop, value, opts, vars, stats);
      return next ? pre + prop + colon + next : all;
    });
  }

  function faceCSS(base = FONT_BASE) {
    return FACES.map(([name, file, weight, range]) =>
      `@font-face{font-family:"${name}";src:url("${base}${file}") format("woff2");font-weight:${weight};font-display:swap;unicode-range:${range}}`).join("\n");
  }

  const URL_REF = /url\(\s*(['"]?)([^'")]*)\1\s*\)/gi;
  const IMPORT = /@import\s+(['"])([^'"]+)\1/gi;
  const FONT_FILE = /\.(woff2?|ttf|otf|eot)(?:[?#]|$)/i;

  /** Makes a stylesheet's url()s absolute so it can move into the page; fontURL can route font files elsewhere. */
  function absolutize(css, base, fontURL) {
    const fix = (u) => {
      if (!u || /^(data:|#|about:|blob:)/i.test(u)) return null;
      let abs;
      try { abs = new URL(u, base).href; } catch { return null; }
      return fontURL && FONT_FILE.test(abs) ? fontURL(abs) : abs;
    };
    return css
      .replace(URL_REF, (m, q, u) => { const a = fix(u.trim()); return a ? `url("${a}")` : m; })
      .replace(IMPORT, (m, q, u) => { const a = fix(u); return a ? `@import "${a}"` : m; });
  }

  /**
   * Rewrites an HTML document's <style> blocks and style attributes and adds
   * Kerf's @font-face rules. With opts.base (the page's address), linked
   * stylesheets whose text is in opts.sheets (absolute URL -> CSS) move into
   * the page as <style> blocks and a <base> keeps relative links working.
   * opts.convert === false does all of that except the font rewrite, for a
   * fair "before". Returns { html, doc, stats }.
   */
  function rewriteHTML(html, opts = {}) {
    const stats = emptyStats();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const own = doc.querySelector("base[href]");
    let base = null;
    try { base = opts.base ? new URL(own ? own.getAttribute("href") : "", opts.base).href : null; } catch { /* no base */ }
    if (base) {
      // a stylesheet's url()s are relative to the sheet, an inline block's to the page
      for (const style of doc.querySelectorAll("style")) style.textContent = absolutize(style.textContent, base, opts.fontURL);
      for (const link of doc.querySelectorAll('link[rel~="stylesheet" i][href]')) {
        let href;
        try { href = new URL(link.getAttribute("href"), base).href; } catch { continue; }
        const css = opts.sheets && opts.sheets.get(href);
        if (css == null) continue;
        const style = doc.createElement("style");
        if (link.media) style.media = link.media;
        style.textContent = absolutize(css, href, opts.fontURL);
        link.replaceWith(style);
      }
      if (!own) {
        const b = doc.createElement("base");
        b.href = base;
        doc.head.prepend(b);
      }
    }
    if (opts.convert !== false) {
      const styles = [...doc.querySelectorAll("style")];
      const attrs = [...doc.querySelectorAll("[style]")];
      const vars = fontVars([...styles.map((s) => s.textContent), ...attrs.map((e) => e.getAttribute("style"))].flatMap(declarations));
      for (const s of styles) s.textContent = rewriteCSS(s.textContent, opts, stats, vars);
      for (const el of attrs) el.setAttribute("style", rewriteCSS(el.getAttribute("style"), opts, stats, vars));
      const faces = doc.createElement("style");
      faces.setAttribute("data-kerf", "");
      faces.textContent = faceCSS(opts.fontBase);
      const after = doc.querySelector("head > base");
      if (after) after.after(faces);
      else doc.head.prepend(faces);
    }
    const doctype = /^\s*<!doctype[^>]*>/i.exec(html);
    return { html: (doctype ? doctype[0] + "\n" : "") + doc.documentElement.outerHTML, doc, stats };
  }

  /* ---------- the live page ---------- */
  let state = null;

  function styleBlocks(list, out) {
    for (const rule of list) {
      if (rule.style && rule.constructor.name !== "CSSFontFaceRule" && rule.constructor.name !== "CSSKeyframeRule") out.push(rule.style);
      if (rule.cssRules) styleBlocks(rule.cssRules, out);
      if (rule.styleSheet) try { styleBlocks(rule.styleSheet.cssRules, out); } catch { /* cross-origin import */ }
    }
  }

  // Read every element's family first, then write: one restyle per sweep.
  function sweep(roots, opts, saved) {
    const plan = [];
    for (const rootEl of roots) {
      for (const el of [rootEl, ...rootEl.querySelectorAll("*")]) {
        const family = getComputedStyle(el).fontFamily;
        if (KERF.test(family)) continue;
        const next = kerfStack(family, opts);
        if (next) plan.push([el, next]);
      }
    }
    for (const [el, next] of plan) {
      saved.push([el.style, "font-family", el.style.getPropertyValue("font-family"), el.style.getPropertyPriority("font-family")]);
      el.style.setProperty("font-family", next, "important");
    }
    return plan.length;
  }

  function apply(opts = {}) {
    if (state) revert();
    const doc = opts.document || document;
    const saved = [];
    const faces = doc.createElement("style");
    faces.setAttribute("data-kerf", "");
    faces.textContent = faceCSS(opts.fontBase);
    doc.head.append(faces);

    // the rules this page can read: its own sheets, same-origin links, adopted sheets
    const blocks = [];
    let unreadable = 0;
    for (const sheet of [...doc.styleSheets, ...(doc.adoptedStyleSheets || [])]) {
      if (sheet.ownerNode === faces) continue;
      try { styleBlocks(sheet.cssRules, blocks); } catch { unreadable++; }
    }
    const props = (s) => {
      const out = [];
      for (let i = 0; i < s.length; i++) { const p = s.item(i); if (p && (p.startsWith("--") || p === "font-family")) out.push(p); }
      return out;
    };
    const decls = [];
    for (const s of blocks) {
      for (const p of props(s)) decls.push([p, s.getPropertyValue(p).trim()]);
      const font = s.getPropertyValue("font") || "";
      if (font.includes("var(")) decls.push(["font", font]);
    }
    const vars = fontVars(decls);
    let rules = 0;
    for (const s of blocks) {
      for (const prop of props(s)) {
        const next = rewriteValue(prop, s.getPropertyValue(prop).trim(), opts, vars, null);
        if (!next) continue;
        const priority = s.getPropertyPriority(prop);
        saved.push([s, prop, s.getPropertyValue(prop), priority]);
        s.setProperty(prop, next.replace(/\s*!important$/, ""), priority);
        rules++;
      }
    }
    const body = doc.body || doc.documentElement;
    const inline = sweep([body], opts, saved);

    // content added later (single-page apps) is swept once per frame, new subtrees only
    const added = new Set();
    const observer = new MutationObserver((records) => {
      const first = added.size === 0;
      for (const r of records) for (const n of r.addedNodes) if (n.nodeType === 1) added.add(n);
      if (first && added.size) requestAnimationFrame(() => {
        const roots = [...added].filter((n) => n.isConnected);
        added.clear();
        sweep(roots, opts, saved);
      });
    });
    observer.observe(body, { childList: true, subtree: true });
    state = { saved, faces, observer };
    return { rules, unreadable, inline };
  }

  function revert() {
    if (!state) return;
    state.observer.disconnect();
    for (const [style, prop, value, priority] of state.saved.reverse()) {
      if (value) style.setProperty(prop, value, priority);
      else style.removeProperty(prop);
    }
    state.faces.remove();
    state = null;
  }

  root.KerfConvert = { classify, fontVars, declarations, rewriteCSS, rewriteHTML, absolutize, apply, revert, faceCSS, MEMBERS };
})(typeof window !== "undefined" ? window : globalThis);
