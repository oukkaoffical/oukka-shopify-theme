// Preserve the original dependency-free multi-page architecture.
// Emit the Sites-compatible Worker entry and client asset directory.
import {readFile, writeFile, mkdir, cp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(root, 'dist');
await mkdir(path.join(out, 'server'), {recursive:true});
await mkdir(path.join(out, 'client'), {recursive:true});
await mkdir(path.join(out, '.openai'), {recursive:true});
const routeFiles = ['index.html','product.html','record.html','styles.css','script.js'];
const routes = {};
for (const file of routeFiles) {
  routes['/' + file] = await readFile(path.join(root, file), 'utf8');
  await cp(path.join(root, file), path.join(out, 'client', file));
}
await cp(path.join(root, 'assets'), path.join(out, 'client', 'assets'), {recursive:true});
await cp(path.join(root, '.openai', 'hosting.json'), path.join(out, '.openai', 'hosting.json'));
const worker = `const pages = ${JSON.stringify(routes)};
export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405});
  const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
  const content = pages[pathname];
  if (content !== undefined) {
    const type = pathname.endsWith('.css') ? 'text/css' : pathname.endsWith('.js') ? 'text/javascript' : 'text/html';
    const rendered = type === 'text/html' ? content.replaceAll('http://127.0.0.1:4173', url.origin) : content;
    return new Response(request.method === 'HEAD' ? null : rendered, {headers:{'content-type':type+'; charset=utf-8','cache-control':'no-cache','x-content-type-options':'nosniff'}});
  }
  if (env.ASSETS) return env.ASSETS.fetch(request);
  return new Response('Not found', {status:404});
}};`;
await writeFile(path.join(out, 'server', 'index.js'), worker);
console.log('Built 3 routes, shared CSS/JS, Worker entry and client media assets.');
