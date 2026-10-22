const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
// Pin the audited main snapshot; pass a newer verified main SHA as argv[2] when needed.
const main=cp.execFileSync('git',['rev-parse',process.argv[2]||'89810cac995013e36ae0dd1b012d8ff32971ac4a'],{encoding:'utf8'}).trim();
const result={main,rootSHA256:null,preserved:[],pages:[],links:0,retainedAssets:0};
for(const file of cp.execFileSync('git',['ls-tree','-r','--name-only',main],{encoding:'utf8'}).trim().split('\n')){
 const actual=fs.readFileSync(file),original=cp.execFileSync('git',['show',main+':'+file]);
 assert(actual.equals(original),'Main-owned file changed: '+file);result.preserved.push(file);
 if(file==='index.html')result.rootSHA256=crypto.createHash('sha256').update(actual).digest('hex');
}
const routes=['','apps/goshuin/','apps/kusabana/','apps/sotogohan/','apps/pet/','bundle/','story/','site-privacy/'];
for(const file of cp.execFileSync('git',['ls-tree','-r','--name-only','cb825ff1a8cb883951ac3cda90979d8589284e62','assets/images','assets/fonts'],{encoding:'utf8'}).trim().split('\n')){
 assert(fs.readFileSync('site/'+file).equals(cp.execFileSync('git',['show','cb825ff1a8cb883951ac3cda90979d8589284e62:'+file])),'Adopted asset changed: '+file);result.retainedAssets++;
}
function local(url){const u=new URL(url,'https://watatsudu.github.io/site/');if(u.origin!=='https://watatsudu.github.io')return;let f=decodeURIComponent(u.pathname).slice(1);if(!f||f.endsWith('/'))f+='index.html';assert(fs.existsSync(f),'Missing target: '+url);if(u.hash){const s=fs.readFileSync(f,'utf8');assert(s.includes('id="'+u.hash.slice(1)+'"'),'Missing anchor '+url);}result.links++;}
for(const route of routes){const file='site/'+route+'index.html',s=fs.readFileSync(file,'utf8');
 assert(s.includes('noindex,follow'),file+' must stay noindex');
 const expected='https://watatsudu.github.io/site/'+route;
 assert(s.includes('rel="canonical" href="'+expected+'"'),'canonical '+file);
 assert(s.includes('property="og:url" content="'+expected+'"'),'OG URL '+file);
 assert(!s.includes('/support/'),'duplicate support '+file);
 assert(/href="\/"[^>]*>アプリのサポート/.test(s),'root support '+file);
 for(const m of s.matchAll(/(?:href|src)="([^"]+)"/g))local(m[1]);
 for(const m of s.matchAll(/srcset="([^"]+)"/g))for(const item of m[1].split(','))local(item.trim().split(/\s/)[0]);
 for(const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){const j=JSON.parse(m[1]);assert.equal(j.url,expected);assert.equal(j.isPartOf.url,'https://watatsudu.github.io/site/');}
 result.pages.push(expected);
}
assert(fs.readFileSync('site/assets/analytics-config.js','utf8').includes('enabled: false'));
assert(!fs.readFileSync('site/assets/site.js','utf8').includes("allowedPages = ['/'"));
fs.mkdirSync('docs/audit',{recursive:true});fs.writeFileSync('docs/audit/verification.json',JSON.stringify(result,null,2));
console.log('PASS: main bytes, root hash, all local links/anchors/images, 8 canonical/OG/JSON-LD pages, noindex, root support, analytics disabled');console.log(JSON.stringify(result,null,2));
