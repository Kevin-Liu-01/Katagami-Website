/* Set any page in Katagami, entirely in the browser.
 *
 * One fixed rule set, so the same page always gets the same families:
 *   a stack whose family is monospace         -> Katagami Mono
 *   a stack whose family is serif             -> Katagami Text
 *   an icon font                              -> left alone, so icons keep working
 *   inherit, initial, unset                   -> left alone
 *   a stack led by var(--x)                   -> left alone; --x is converted where it is defined
 *   anything else                             -> the chosen sans member
 * The original stack stays behind Katagami as its fallback. Custom properties
 * count as font stacks when a font-family or font declaration uses them.
 *
 *   KatagamiConvert.apply({ sans: "sans" | "round" | "text" })  converts the live page
 *   KatagamiConvert.revert()                                     puts it back
 *   KatagamiConvert.rewriteCSS(css, opts), rewriteHTML(html, opts) convert code
 */
(function (root) {
  "use strict";
  const FONT_BASE = "https://katagami.kevinliu.studio/fonts/";
  // [family, file, weights, unicode-range]: each member's core and one face per
  // script, written by tools/build_site.py, so a page loads only what it shows
  /* generated faces: start */
  const FACES = [["Katagami Sans","KatagamiSans.woff2?v=cc91d4110d","100 900","U+0-52F,U+1D00-27FA,U+2913,U+2A38-2B24,U+2C7C-2C7F,U+2DFF-2E18,U+A69F,U+A7FF,U+A92E,U+E000-E2DC,U+EE01-EEE1,U+F6C3,U+1F12F-1F16B,U+1F850-1F852"],["Katagami Sans","KatagamiSans-devanagari.woff2?v=620cc1f479","100 900","U+900-97F,U+1CD0-1CF9,U+A8E0-A8FF"],["Katagami Sans","KatagamiSans-arabic.woff2?v=c34eaa2251","100 900","U+600-8FF,U+FB50-FEFF"],["Katagami Sans","KatagamiSans-bengali.woff2?v=152ca20610","100 900","U+980-9FE"],["Katagami Sans","KatagamiSans-gurmukhi.woff2?v=43bddd215d","100 900","U+A01-A76"],["Katagami Sans","KatagamiSans-gujarati.woff2?v=a23f1ec1fa","100 900","U+A81-AFF"],["Katagami Sans","KatagamiSans-oriya.woff2?v=e9f8466a7d","100 900","U+B01-B77"],["Katagami Sans","KatagamiSans-tamil.woff2?v=f388aba4f5","100 900","U+B82-BFA"],["Katagami Sans","KatagamiSans-telugu.woff2?v=995d0bee67","100 900","U+C00-C7F"],["Katagami Sans","KatagamiSans-kannada.woff2?v=5c8f13aee5","100 900","U+C80-CF3"],["Katagami Sans","KatagamiSans-malayalam.woff2?v=cc8e36aaf9","100 900","U+D00-D7F"],["Katagami Sans","KatagamiSans-sinhala.woff2?v=c48cdf218f","100 900","U+D81-DF4,U+111E1-111F4"],["Katagami Sans","KatagamiSans-thai.woff2?v=10ecbd161d","100 900","U+E01-E5B"],["Katagami Sans","KatagamiSans-lao.woff2?v=9be2a3a161","100 900","U+E81-EDF"],["Katagami Sans","KatagamiSans-myanmar.woff2?v=7e6d5a20b9","100 900","U+1000-109F,U+A9E0-AA7F"],["Katagami Sans","KatagamiSans-ethiopic.woff2?v=bb1da55309","100 900","U+1200-1399,U+2D80-2DDE,U+AB01-AB2E,U+1E7E0-1E7FE"],["Katagami Sans","KatagamiSans-hebrew.woff2?v=f591395c82","100 900","U+591-5F4,U+FB1D-FB4F"],["Katagami Sans","KatagamiSans-armenian.woff2?v=52af76fb93","100 900","U+531-58F,U+FB13-FB17"],["Katagami Sans","KatagamiSans-georgian.woff2?v=1bd5edc844","100 900","U+10A0-10FF,U+1C90-1CBF,U+2D00-2D2D"],["Katagami Sans","KatagamiSans-khmer.woff2?v=316abd5b88","100 900","U+1780-17F9,U+19E0-19FF"],["Katagami Round","KatagamiRound.woff2?v=c77d0b5f4a","100 900","U+0-52F,U+1D00-27FA,U+2913,U+2A38-2B24,U+2C7C-2C7F,U+2DFF-2E18,U+A69F,U+A7FF,U+A92E,U+E000-E2DC,U+EE01-EEE1,U+F6C3,U+1F12F-1F16B,U+1F850-1F852"],["Katagami Round","KatagamiRound-devanagari.woff2?v=bef7501cdf","100 900","U+900-97F,U+1CD0-1CF9,U+A8E0-A8FF"],["Katagami Round","KatagamiRound-arabic.woff2?v=a06aa7975a","100 900","U+600-8FF,U+FB50-FEFF"],["Katagami Round","KatagamiRound-bengali.woff2?v=63f545f38b","100 900","U+980-9FE"],["Katagami Round","KatagamiRound-gurmukhi.woff2?v=202bb66101","100 900","U+A01-A76"],["Katagami Round","KatagamiRound-gujarati.woff2?v=5ae0c61aeb","100 900","U+A81-AFF"],["Katagami Round","KatagamiRound-oriya.woff2?v=61771de56b","100 900","U+B01-B77"],["Katagami Round","KatagamiRound-tamil.woff2?v=fbe390a040","100 900","U+B82-BFA"],["Katagami Round","KatagamiRound-telugu.woff2?v=51b8fc1d38","100 900","U+C00-C7F"],["Katagami Round","KatagamiRound-kannada.woff2?v=339cc45d7e","100 900","U+C80-CF3"],["Katagami Round","KatagamiRound-malayalam.woff2?v=6491b229c9","100 900","U+D00-D7F"],["Katagami Round","KatagamiRound-sinhala.woff2?v=926b034ef8","100 900","U+D81-DF4,U+111E1-111F4"],["Katagami Round","KatagamiRound-thai.woff2?v=4c842c00b3","100 900","U+E01-E5B"],["Katagami Round","KatagamiRound-lao.woff2?v=9bf2147dc9","100 900","U+E81-EDF"],["Katagami Round","KatagamiRound-myanmar.woff2?v=1d47f0e1e0","100 900","U+1000-109F,U+A9E0-AA7F"],["Katagami Round","KatagamiRound-ethiopic.woff2?v=1ee27835d4","100 900","U+1200-1399,U+2D80-2DDE,U+AB01-AB2E,U+1E7E0-1E7FE"],["Katagami Round","KatagamiRound-hebrew.woff2?v=a519a5b5b8","100 900","U+591-5F4,U+FB1D-FB4F"],["Katagami Round","KatagamiRound-armenian.woff2?v=0fdbb06874","100 900","U+531-58F,U+FB13-FB17"],["Katagami Round","KatagamiRound-georgian.woff2?v=c36da33d6c","100 900","U+10A0-10FF,U+1C90-1CBF,U+2D00-2D2D"],["Katagami Round","KatagamiRound-khmer.woff2?v=143f95cdd4","100 900","U+1780-17F9,U+19E0-19FF"],["Katagami Text","KatagamiText.woff2?v=287142f2f5","100 900","U+0-52F,U+1D00-27FA,U+2913,U+2A38-2B24,U+2C7C-2C7F,U+2DFF-2E18,U+A69F,U+A7FF,U+A92E,U+E000-E2DC,U+EE01-EEE1,U+F6C3,U+1F12F-1F16B,U+1F850-1F852"],["Katagami Text","KatagamiText-devanagari.woff2?v=748c2d5f3b","100 900","U+900-97F,U+1CD0-1CF9,U+A8E0-A8FF"],["Katagami Text","KatagamiText-arabic.woff2?v=8a48961177","100 900","U+600-8FF,U+FB50-FEFF"],["Katagami Text","KatagamiText-bengali.woff2?v=ba7e144a06","100 900","U+980-9FE"],["Katagami Text","KatagamiText-gurmukhi.woff2?v=e31da5b742","100 900","U+A01-A76"],["Katagami Text","KatagamiText-gujarati.woff2?v=41f9e9f8ef","100 900","U+A81-AFF"],["Katagami Text","KatagamiText-oriya.woff2?v=998ed8b675","100 900","U+B01-B77"],["Katagami Text","KatagamiText-tamil.woff2?v=20406b07b6","100 900","U+B82-BFA"],["Katagami Text","KatagamiText-telugu.woff2?v=a53be3c5ee","100 900","U+C00-C7F"],["Katagami Text","KatagamiText-kannada.woff2?v=cd7c562f6b","100 900","U+C80-CF3"],["Katagami Text","KatagamiText-malayalam.woff2?v=c3f17614a9","100 900","U+D00-D7F"],["Katagami Text","KatagamiText-sinhala.woff2?v=4493f7cb47","100 900","U+D81-DF4,U+111E1-111F4"],["Katagami Text","KatagamiText-thai.woff2?v=328c7fa3e0","100 900","U+E01-E5B"],["Katagami Text","KatagamiText-lao.woff2?v=e635cd6a76","100 900","U+E81-EDF"],["Katagami Text","KatagamiText-myanmar.woff2?v=432947118f","100 900","U+1000-109F,U+A9E0-AA7F"],["Katagami Text","KatagamiText-ethiopic.woff2?v=00e21fac6a","100 900","U+1200-1399,U+2D80-2DDE,U+AB01-AB2E,U+1E7E0-1E7FE"],["Katagami Text","KatagamiText-hebrew.woff2?v=ba333851ca","100 900","U+591-5F4,U+FB1D-FB4F"],["Katagami Text","KatagamiText-armenian.woff2?v=b560c2163f","100 900","U+531-58F,U+FB13-FB17"],["Katagami Text","KatagamiText-georgian.woff2?v=dbd249fdd7","100 900","U+10A0-10FF,U+1C90-1CBF,U+2D00-2D2D"],["Katagami Text","KatagamiText-khmer.woff2?v=de19ae2d52","100 900","U+1780-17F9,U+19E0-19FF"],["Katagami Mono","KatagamiMono.woff2?v=1cc4140394","100 700","U+0-52F,U+1D00-27FA,U+2913,U+2A38-2B24,U+2C7C-2C7F,U+2DFF-2E18,U+A69F,U+A7FF,U+A92E,U+E000-E2DC,U+EE01-EEE1,U+F6C3,U+1F12F-1F16B,U+1F850-1F852"],["Katagami Mono","KatagamiMono-arabic.woff2?v=6ba081c51e","100 700","U+FEFF"],["Katagami Mono","KatagamiMono-thai.woff2?v=c838088f03","100 700","U+E3F"],["Katagami Sans","KatagamiCJKTC.woff2?v=a81630f1ee","100 900","U+2E80-2FDF,U+3000-303F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FF60,U+FFE0-FFEF,U+3100-312F,U+31A0-31BF"],["Katagami Round","KatagamiCJKTC.woff2?v=a81630f1ee","100 900","U+2E80-2FDF,U+3000-303F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FF60,U+FFE0-FFEF,U+3100-312F,U+31A0-31BF"],["Katagami Text","KatagamiCJKTC.woff2?v=a81630f1ee","100 900","U+2E80-2FDF,U+3000-303F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FF60,U+FFE0-FFEF,U+3100-312F,U+31A0-31BF"],["Katagami Sans","KatagamiCJKSC.woff2?v=90c5b91163","100 900","U+2E80-2FDF,U+3000-303F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FF60,U+FFE0-FFEF"],["Katagami Round","KatagamiCJKSC.woff2?v=90c5b91163","100 900","U+2E80-2FDF,U+3000-303F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FF60,U+FFE0-FFEF"],["Katagami Text","KatagamiCJKSC.woff2?v=90c5b91163","100 900","U+2E80-2FDF,U+3000-303F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FF60,U+FFE0-FFEF"],["Katagami Sans","KatagamiCJKJP.woff2?v=4db5dfb860","100 900","U+3040-30FF,U+31F0-31FF,U+FF61-FF9F"],["Katagami Round","KatagamiCJKJP.woff2?v=4db5dfb860","100 900","U+3040-30FF,U+31F0-31FF,U+FF61-FF9F"],["Katagami Text","KatagamiCJKJP.woff2?v=4db5dfb860","100 900","U+3040-30FF,U+31F0-31FF,U+FF61-FF9F"],["Katagami Sans","KatagamiCJKKR.woff2?v=f3f176cb59","100 900","U+1100-11FF,U+3130-318F,U+A960-A97F,U+AC00-D7FF,U+FFA0-FFDC"],["Katagami Round","KatagamiCJKKR.woff2?v=f3f176cb59","100 900","U+1100-11FF,U+3130-318F,U+A960-A97F,U+AC00-D7FF,U+FFA0-FFDC"],["Katagami Text","KatagamiCJKKR.woff2?v=f3f176cb59","100 900","U+1100-11FF,U+3130-318F,U+A960-A97F,U+AC00-D7FF,U+FFA0-FFDC"]];
  /* generated faces: end */
  const MEMBERS = { sans: "Katagami Sans", round: "Katagami Round", text: "Katagami Text" };
  const KERF = /katagami (sans|round|text|mono)/i;
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
    const kerf = kind === "mono" ? "Katagami Mono" : kind === "serif" ? "Katagami Text" : MEMBERS[opts.sans] || "Katagami Sans";
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

  function emptyStats() { return { "Katagami Sans": 0, "Katagami Round": 0, "Katagami Text": 0, "Katagami Mono": 0, icon: 0 }; }

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
   * Katagami's @font-face rules. With opts.base (the page's address), linked
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
      faces.setAttribute("data-katagami", "");
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
    faces.setAttribute("data-katagami", "");
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

  root.KatagamiConvert = { classify, fontVars, declarations, rewriteCSS, rewriteHTML, absolutize, apply, revert, faceCSS, MEMBERS };
})(typeof window !== "undefined" ? window : globalThis);
