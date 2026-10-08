import type { APIRoute } from 'astro';

/** Open to every crawler, AI assistants included: the site exists to be found. */
export const GET: APIRoute = ({ site }) => {
  const agents = ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];
  const body = [
    ...agents.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${new URL('/sitemap-index.xml', site).href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
