// Markdown content negotiation for AI agents.
// When a client sends `Accept: text/markdown`, serve the pre-generated Markdown
// representation of the page (built by scripts/build-md.js) instead of HTML.
// Self-syncing: derives the slug from the request path and probes for a sibling
// .md asset. Any non-markdown request, unknown path, missing .md, or error falls
// through to normal HTML serving — so there is no page list to keep in sync.

export async function onRequest(context) {
  const { request, env, next } = context;
  try {
    const accept = request.headers.get("Accept") || "";
    if (request.method !== "GET" || !/text\/markdown/i.test(accept) || !env.ASSETS) {
      return next();
    }

    const url = new URL(request.url);
    let p = url.pathname;
    let slug;
    if (p === "/") {
      slug = "index";
    } else {
      p = p.replace(/^\/+/, "");
      slug = p.endsWith("/") ? p + "index" : p.replace(/\.html$/, "");
    }
    // Defensive: simple path segments only — no dots (blocks traversal + non-.html assets).
    if (!/^[A-Za-z0-9/_-]+$/.test(slug)) return next();

    const asset = await env.ASSETS.fetch(new Request(new URL(`/${slug}.md`, url.origin)));
    if (!asset.ok) return next();

    const body = await asset.text();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Markdown-Tokens": String(Math.ceil(body.length / 4)),
        "Content-Signal": "search=yes, ai-input=yes, ai-train=no",
        "Cache-Control": "public, max-age=3600",
        "Vary": "Accept",
      },
    });
  } catch {
    return next();
  }
}
