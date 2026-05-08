export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // এটি Cloudflare Pages-এর সরাসরি D1 বাইন্ডিং ব্যবহার করবে
  // এর জন্য Cloudflare Pages সেটিংসে গিয়ে 'DB' বাইন্ডিং সেট করতে হবে
  
  if (path.startsWith("/api/products")) {
    const { results } = await env.DB.prepare("SELECT * FROM products").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // অন্যান্য API-এর জন্য...
  return new Response("API Route Not Found", { status: 404 });
}
