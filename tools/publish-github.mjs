import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
const repo='993726934/chixie-rusong';
function api(endpoint,method='GET',body){return new Promise((resolve,reject)=>{const p=spawn('gh',['api',`repos/${repo}/${endpoint}`,'--method',method,...(body?['--input','-']:[])],{stdio:['pipe','pipe','pipe']});let out='',err='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);p.on('error',reject);p.on('close',code=>{if(code)reject(Error(err.slice(0,500)));else{try{resolve(out?JSON.parse(out):{});}catch{reject(Error('Invalid API response'));}}});p.stdin.end(body?JSON.stringify(body):undefined);});}
const head=(await api('git/ref/heads/main')).object.sha;
const base=(await api(`git/commits/${head}`)).tree.sha;
const existing=(await api(`git/trees/${base}?recursive=1`)).tree;
const files=process.argv.length>2?process.argv.slice(2):['index.html','style.css','app.js','story.js','library.js','interactions.js','README.md','制作与发布规范.md','.gitignore','.github/workflows/pages.yml','tools/serve.mjs','tools/prepare.mjs','tools/narrate.ps1','tools/validate.mjs','tools/publish-github.mjs'];
for(const file of files){if(file.includes('..')||file.startsWith('/')||file.includes(':')||file.endsWith('.txt')||file.endsWith('narration.json')||file.startsWith('.git/'))throw Error(`Not a publishable site artifact: ${file}`);}
const changed=files.filter(file=>{const bytes=fs.readFileSync(file);const sha=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');return existing.find(e=>e.path===file)?.sha!==sha;});
console.log(`Base commit ${head}; ${changed.length} changed files. Existing audio and chapters are preserved.`);
if(!changed.length){console.log('No changes to publish.');process.exit(0);}
const tree=[];
for(let i=0;i<changed.length;i+=3){await Promise.all(changed.slice(i,i+3).map(async file=>{const blob=await api('git/blobs','POST',{content:fs.readFileSync(file).toString('base64'),encoding:'base64'});tree.push({path:file,mode:'100644',type:'blob',sha:blob.sha});console.log('Uploaded '+file);}));}
const t=await api('git/trees','POST',{base_tree:base,tree});const commit=await api('git/commits','POST',{message:'Improve inline interactions, reading controls and chapter navigation; document production standards',tree:t.sha,parents:[head]});await api('git/refs/heads/main','PATCH',{sha:commit.sha,force:false});console.log('Published commit '+commit.sha);
