/* The converter's fetch relay.
 *
 * A page cannot read another site's HTML, CSS or fonts unless that site
 * allows it (CORS), so /convert asks this function for the bytes. It only
 * fetches; every rewrite happens in the visitor's browser. It refuses
 * private addresses, non-default ports, other content types and bodies
 * over 8 MB, and it never serves HTML as HTML from this origin.
 *
 *   GET /api/fetch?url=https://example.com
 */
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_HOPS = 5;
const TIMEOUT_MS = 10_000;
const PAGE = /^(text\/html|application\/xhtml\+xml)/i;
const STYLE = /^text\/css/i;
const FONT = /^(font\/|application\/(font-|x-font-|vnd\.ms-fontobject))/i;
const UNTYPED = /^((application|binary)\/octet-stream)?$/i;
const FONT_FILE = /\.(woff2?|ttf|otf|eot)$/i;
const UA = "Mozilla/5.0 (compatible; KerfConvert/1.0; +https://kerf.kevinliu.studio/convert)";
const BASE_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-expose-headers": "x-final-url, x-source-type",
  "content-security-policy": "default-src 'none'; sandbox",
  "x-content-type-options": "nosniff",
};

function privateIP(ip) {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b < 128) ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b < 32) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19));
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return privateIP(v6.slice(7));
  return v6 === "::" || v6 === "::1" || /^(fc|fd|fe[89ab])/.test(v6);
}

async function publicURL(raw) {
  let url;
  try { url = new URL(raw); } catch { return null; }
  if (!/^https?:$/.test(url.protocol) || url.username || url.password) return null;
  if (url.port && url.port !== "80" && url.port !== "443") return null;
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || /\.(localhost|local|internal)$/i.test(host)) return null;
  const addresses = isIP(host) ? [{ address: host }] : await lookup(host, { all: true }).catch(() => []);
  if (!addresses.length || addresses.some((a) => privateIP(a.address))) return null;
  return url;
}

const fail = (status, message) => new Response(message, {
  status, headers: { ...BASE_HEADERS, "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
});

export async function GET(request) {
  let target = new URL(request.url).searchParams.get("url") || "";
  let response;
  for (let hop = 0; ; hop++) {
    const url = await publicURL(target);
    if (!url) return fail(400, "That is not a public http or https address.");
    try {
      response = await fetch(url, {
        redirect: "manual",
        headers: { "user-agent": UA, accept: "text/html,text/css,font/woff2,*/*;q=0.8" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      return fail(502, `Could not reach ${url.host}.`);
    }
    const location = response.status >= 300 && response.status < 400 && response.headers.get("location");
    if (!location) { target = url.href; break; }
    if (hop === MAX_HOPS) return fail(508, "That address redirects too many times.");
    target = new URL(location, url).href;
  }
  const host = new URL(target).host;
  if (!response.ok) return fail(502, `${host} answered ${response.status}.`);

  const type = response.headers.get("content-type") || "";
  const font = FONT.test(type) || (UNTYPED.test(type.split(";")[0].trim()) && FONT_FILE.test(new URL(target).pathname));
  const text = PAGE.test(type) || STYLE.test(type);
  if (!text && !font) return fail(415, `Katagami converts pages, stylesheets and fonts; ${host} sent ${type || "an untyped file"}.`);
  if (Number(response.headers.get("content-length")) > MAX_BYTES) return fail(413, "That file is over 8 MB.");

  const chunks = [];
  let size = 0;
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) { await reader.cancel(); return fail(413, "That file is over 8 MB."); }
    chunks.push(value);
  }
  // pages and stylesheets go back as text/plain so this origin never renders them
  const charset = /charset=[^;]+/i.exec(type)?.[0];
  return new Response(new Blob(chunks), {
    headers: {
      ...BASE_HEADERS,
      "content-type": text ? `text/plain${charset ? `; ${charset}` : ""}` : type || "font/woff2",
      "x-source-type": type.split(";")[0].trim(),
      "x-final-url": target,
      "cache-control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
