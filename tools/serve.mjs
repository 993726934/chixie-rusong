import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 if(name==='/')name='/index.html';
 const file=path.resolve(root,'.'+name);
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
 const size=fs.statSync(file).size,mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.wav':'audio/wav'}[path.extname(file)]||'application/octet-stream';
 const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
 if(range){let start=+range[1],end=Math.min(range[2]?+range[2]:size-1,size-1);if(start>end){res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}res.writeHead(206,{'Content-Type':mime,'Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1,'Accept-Ranges':'bytes'});fs.createReadStream(file,{start,end}).pipe(res);}else{res.writeHead(200,{'Content-Type':mime,'Content-Length':size,'Accept-Ranges':'bytes'});fs.createReadStream(file).pipe(res);}
}).listen(4173,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4173'));
