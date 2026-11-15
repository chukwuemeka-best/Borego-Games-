/* Borego Football 3D — realistic edition. Assets: Quaternius (CC0) characters/animations, three.js (MIT). Everything else is generated in code. */
(()=>{'use strict';
const T=THREE,$=id=>document.getElementById(id),cl=(n,a,b)=>Math.max(a,Math.min(b,n)),lerp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a),V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const PX=35,PZ=23,GW=3.9,GH=2.5,BOXD=11,BOXW=13,SIXD=4.5,SIXW=6.5,PEN=8,BR=.3,NETD=2.2,HALF_REAL=150,GAME_HALF=2700,NP=7;
const TOUCH=matchMedia('(pointer:coarse)').matches;
let Q=TOUCH?1:2;
/* ---------- SOUND (all generated, no files) ---------- */
let AC=null,master,noiseBuf,crowd=null,sndOn=true,exc=0,chantT=8;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.85;const c=AC.createDynamicsCompressor();master.connect(c);c.connect(AC.destination);mkNoise()}catch(e){AC=null}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function mkNoise(){const n=AC.sampleRate*4,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);let a0=0,a1=0,a2=0,a3=0,a4=0,a5=0,a6=0;for(let i=0;i<n;i++){const w=Math.random()*2-1;a0=.99886*a0+w*.0555179;a1=.99332*a1+w*.0750759;a2=.969*a2+w*.153852;a3=.8665*a3+w*.3104856;a4=.55*a4+w*.5329522;a5=-.7616*a5-w*.016898;d[i]=(a0+a1+a2+a3+a4+a5+a6+w*.5362)*.11;a6=w*.115926}noiseBuf=b}
function nsrc(loop){const s=AC.createBufferSource();s.buffer=noiseBuf;s.loop=!!loop;if(loop)s.loopStart=Math.random()*2;return s}
function env(g,t,a,pk,d){g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(pk,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
function nz(dur,pk,type,f0,f1,q,delay){const a=ac();if(!a||!sndOn)return;const t=a.currentTime+(delay||0),s=nsrc(),f=a.createBiquadFilter(),g=a.createGain();f.type=type;f.frequency.setValueAtTime(f0,t);if(f1)f.frequency.exponentialRampToValueAtTime(f1,t+dur);f.Q.value=q||1;env(g,t,Math.min(.05,dur*.25),pk,dur);s.connect(f);f.connect(g);g.connect(master);s.start(t,Math.random()*2,dur+.1)}
function tn(type,f0,f1,dur,pk,delay){const a=ac();if(!a||!sndOn)return;const t=a.currentTime+(delay||0),o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);env(g,t,.005,pk,dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.05)}
function startCrowd(){const a=ac();if(!a||!sndOn||crowd)return;const s=nsrc(true),bp=a.createBiquadFilter(),lp=a.createBiquadFilter(),g=a.createGain(),s2=nsrc(true),g2=a.createGain(),l2=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=650;bp.Q.value=.45;g.gain.value=.0001;s.connect(bp);bp.connect(g);g.connect(master);l2.type='lowpass';l2.frequency.value=260;s2.connect(l2);l2.connect(g2);g2.gain.value=.0001;g2.connect(master);s.start();s2.start();g.gain.linearRampToValueAtTime(.2,a.currentTime+2.5);g2.gain.linearRampToValueAtTime(.16,a.currentTime+2.5);crowd={s,s2,g,g2,bp}}
function stopCrowd(){if(!crowd)return;try{crowd.s.stop();crowd.s2.stop()}catch(e){}crowd=null}
function crowdTick(dt){exc=Math.max(0,exc-dt*.16);if(crowd&&AC){const t=AC.currentTime,lv=.17+.42*exc+.03*Math.sin(t*.7)+.02*Math.sin(t*1.9);crowd.g.gain.setTargetAtTime(lv,t,.25);crowd.g2.gain.setTargetAtTime(.14+.12*exc,t,.3);crowd.bp.frequency.setTargetAtTime(520+exc*700,t,.3)}chantT-=dt*(.4+exc);if(chantT<=0){chantT=rnd(22,40);if(playing&&sndOn)chant()}}
function chant(kind){const a=ac();if(!a||!sndOn)return;const t0=a.currentTime+.05;const sy=kind==='goal'?[[0,.32,0],[.38,.32,0],[.76,.32,0],[1.14,.6,5],[1.9,.32,3],[2.26,.32,3],[2.62,.7,0]]:[[0,.34,0],[.42,.34,0],[.84,.34,0],[1.26,.6,3],[2.0,.34,0],[2.42,.34,0],[2.84,.34,0],[3.26,.6,-2]];
 const fa=a.createBiquadFilter(),fb=a.createBiquadFilter(),out=a.createGain();fa.type=fb.type='bandpass';fa.frequency.value=620;fb.frequency.value=1150;fa.Q.value=3;fb.Q.value=4;out.gain.value=kind==='goal'?.12:.075;fa.connect(out);fb.connect(out);out.connect(master);
 sy.forEach(([dt,du,semi])=>{const g=a.createGain();env(g,t0+dt,.06,1,du*1.1);g.connect(fa);g.connect(fb);for(let k=0;k<9;k++){const o=a.createOscillator();o.type='sawtooth';o.frequency.value=(k%3?196:98)*Math.pow(2,semi/12)*rnd(.985,1.015);const vg=a.createGain();vg.gain.value=rnd(.4,1)/9;o.connect(vg);vg.connect(g);o.start(t0+dt);o.stop(t0+dt+du*1.2+.1)}
  nz(.07,.08,'bandpass',1800,1800,1,t0+dt-a.currentTime)});setTimeout(()=>{try{out.disconnect()}catch(e){}},sy[sy.length-1][0]*1000+2500)}
function whistle(long){const a=ac();if(!a||!sndOn)return;const t=a.currentTime+.02,d=long?1.0:.45,o=a.createOscillator(),o2=a.createOscillator(),g=a.createGain(),lf=a.createOscillator(),lg=a.createGain(),m=a.createGain();o.type='sine';o2.type='sine';o.frequency.value=2850;o2.frequency.value=3150;lf.frequency.value=31;lg.gain.value=.5;m.gain.value=.5;lf.connect(lg);lg.connect(m.gain);o.connect(m);o2.connect(m);m.connect(g);g.connect(master);env(g,t,.015,.16,d);o.start(t);o2.start(t);lf.start(t);o.stop(t+d+.1);o2.stop(t+d+.1);lf.stop(t+d+.1);nz(d,.05,'highpass',3500,3500,1,0)}
function sfx(n,a){if(!sndOn)return;
 if(n==='kick'){const p=a==null?.6:a;tn('sine',190,55,.1,.5*p+.2);nz(.05,.22*p+.05,'highpass',1800,1800,1)}
 else if(n==='post'){tn('triangle',560,420,.3,.4);nz(.12,.2,'bandpass',2600,2600,3)}
 else if(n==='net'){nz(.6,.22,'lowpass',2200,500,.7)}
 else if(n==='tackle'){tn('sine',110,40,.16,.5);nz(.12,.2,'lowpass',900,300,1)}
 else if(n==='save'){nz(.12,.3,'bandpass',1400,900,2);tn('sine',160,70,.1,.3)}
 else if(n==='ooh'){nz(1.1,.28,'bandpass',500,900,1.2);exc=Math.min(1,exc+.35)}
 else if(n==='goal'){nz(3.8,.55,'bandpass',520,1500,.8);nz(3.2,.32,'lowpass',500,300,.5);exc=1;setTimeout(()=>chant('goal'),900);chantT=rnd(30,40)}
 else if(n==='whistle')whistle(false);else if(n==='long')whistle(true);
 else if(n==='foul'){exc=Math.min(1,exc+.25);nz(1.2,.2,'bandpass',600,400,1)}
}
/* ---------- RENDER + STADIUM ---------- */
T.ColorManagement.legacyMode=false;
let scene,camera,renderer,key,hemi,ball,ballMat,crowdMats=[],crowdUni={uT:{value:0},uE:{value:0}},stadium=new T.Group(),sky,fx=[];
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function tex(c,rep,aniso){const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.anisotropy=aniso||8;if(rep){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
function rr(x,w,h,r){x.beginPath();x.moveTo(r,0);x.arcTo(w,0,w,h,r);x.arcTo(w,h,0,h,r);x.arcTo(0,h,0,0,r);x.arcTo(0,0,w,0,r);x.closePath()}
function pitchTexture(){const PPM=Q>1?24:16,W=80*PPM,H=56*PPM,c=canvas(W,H),x=c.getContext('2d');
 const stripes=12,sw=W/stripes;for(let i=0;i<stripes;i++){x.fillStyle=i%2?'#2c7a33':'#348a3a';x.fillRect(i*sw,0,sw+1,H)}
 // soft patches
 for(let i=0;i<260;i++){const px=Math.random()*W,py=Math.random()*H,r=rnd(40,160)*PPM/24,g=x.createRadialGradient(px,py,0,px,py,r);const v=Math.random()<.5;g.addColorStop(0,v?'rgba(255,255,170,.05)':'rgba(0,40,0,.07)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(px-r,py-r,2*r,2*r)}
 // blades
 x.lineWidth=1;for(let i=0;i<Math.floor(W*H/38);i++){const px=Math.random()*W,py=Math.random()*H,l=rnd(3,8)*PPM/24,s=Math.random();x.strokeStyle=s<.5?'rgba(150,230,110,'+rnd(.05,.17).toFixed(2)+')':'rgba(10,50,15,'+rnd(.07,.2).toFixed(2)+')';x.beginPath();x.moveTo(px,py);x.lineTo(px+rnd(-1.5,1.5),py-l);x.stroke()}
 // worn goal mouths & centre spot
 [[-PX,0],[PX,0],[0,0],[-PX+PEN,0],[PX-PEN,0]].forEach(([wx,wz])=>{const px=(wx+40)*PPM,py=(wz+28)*PPM,r=(wx===0?1.8:4)*PPM,g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(120,95,50,.28)');g.addColorStop(1,'rgba(120,95,50,0)');x.fillStyle=g;x.fillRect(px-r,py-r,2*r,2*r)});
 // lines
 const P=(wx,wz)=>[(wx+40)*PPM,(wz+28)*PPM];x.strokeStyle='rgba(250,250,245,.94)';x.fillStyle=x.strokeStyle;x.lineWidth=.2*PPM;x.lineCap='square';
 const ln=(a,b,c,d)=>{const p=P(a,b),q=P(c,d);x.beginPath();x.moveTo(p[0],p[1]);x.lineTo(q[0],q[1]);x.stroke()};
 ln(-PX,-PZ,PX,-PZ);ln(-PX,PZ,PX,PZ);ln(-PX,-PZ,-PX,PZ);ln(PX,-PZ,PX,PZ);ln(0,-PZ,0,PZ);
 const arc=(cx,cz,r,a0,a1)=>{const p=P(cx,cz);x.beginPath();x.arc(p[0],p[1],r*PPM,a0,a1);x.stroke()};arc(0,0,6.5,0,7);const sp=(wx,wz,r)=>{const p=P(wx,wz);x.beginPath();x.arc(p[0],p[1],r*PPM,0,7);x.fill()};sp(0,0,.28);
 for(const s of[-1,1]){const gx=s*PX,bx=s*(PX-BOXD),sx=s*(PX-SIXD);ln(gx,-BOXW,bx,-BOXW);ln(bx,-BOXW,bx,BOXW);ln(bx,BOXW,gx,BOXW);ln(gx,-SIXW,sx,-SIXW);ln(sx,-SIXW,sx,SIXW);ln(sx,SIXW,gx,SIXW);sp(s*(PX-PEN),0,.28);
  const p=P(s*(PX-PEN),0);x.beginPath();const a=Math.acos((BOXD-PEN)/6.5);x.arc(p[0],p[1],6.5*PPM,s>0?Math.PI-a:-a,s>0?Math.PI+a:a);x.stroke();
  for(const z of[-1,1]){const q=P(gx,z*PZ);x.beginPath();x.arc(q[0],q[1],1*PPM,0,7);x.stroke()}}
 // erase corner arcs overflow is fine
 // grain
 const id=x.getImageData(0,0,W,H),d=id.data;for(let i=0;i<d.length;i+=4){const n=(Math.random()-.5)*14;d[i]+=n;d[i+1]+=n*1.1;d[i+2]+=n*.6}x.putImageData(id,0,0);
 const t=tex(c,null,renderer?Math.min(16,renderer.capabilities.getMaxAnisotropy()):8);return t}
function surroundTexture(){const c=canvas(256,256),x=c.getContext('2d');x.fillStyle='#235c2a';x.fillRect(0,0,256,256);for(let i=0;i<5000;i++){x.fillStyle=Math.random()<.5?'rgba(140,210,100,.12)':'rgba(5,35,10,.16)';x.fillRect(Math.random()*256,Math.random()*256,1,rnd(1,3))}return tex(c,[60,50],4)}
function glowTex(){const c=canvas(128,128),x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,'rgba(255,250,230,.75)');g.addColorStop(.5,'rgba(255,240,200,.18)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return tex(c)}
function adTexture(){const c=canvas(2048,128),x=c.getContext('2d');const items=[['BOREGO','#0a1a3a','#ffd24a'],['FOOTBALL LIVE','#b3121f','#fff'],['PLAY TOGETHER','#0d6b3a','#fff'],['BOREGO','#ffd24a','#10141f'],['CHAT · PLAY · WIN','#1450a3','#fff'],['FAIR PLAY','#111','#7af0b1']];const w=2048/items.length;items.forEach((it,i)=>{x.fillStyle=it[1];x.fillRect(i*w,0,w,128);x.fillStyle=it[2];x.font='900 64px Arial Black,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(it[0],i*w+w/2,68);x.fillStyle='rgba(255,255,255,.12)';x.fillRect(i*w,0,w,6)});const t=tex(c);return t}
function netTexture(){const c=canvas(128,128),x=c.getContext('2d');x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=3;for(let i=0;i<=128;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i,128);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(128,i);x.stroke()}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t}
function addGoal(s){const g=new T.Group(),gx=s*PX,wm=new T.MeshStandardMaterial({color:0xffffff,roughness:.35,metalness:.2});
 const post=(z)=>{const m=new T.Mesh(new T.CylinderGeometry(.07,.07,GH,10),wm);m.position.set(gx,GH/2,z);m.castShadow=Q>1;g.add(m)};post(-GW);post(GW);
 const bar=new T.Mesh(new T.CylinderGeometry(.07,.07,GW*2+.14,10),wm);bar.rotation.x=Math.PI/2;bar.position.set(gx,GH,0);g.add(bar);
 const nt=netTexture(),nm=(rx,ry)=>{const t=nt.clone();t.needsUpdate=true;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx,ry);return new T.MeshBasicMaterial({map:t,transparent:true,alphaTest:.25,side:T.DoubleSide,opacity:.85,depthWrite:false})};
 const back=new T.Mesh(new T.PlaneGeometry(GW*2,GH-.2),nm(GW*2/.35,(GH-.2)/.35));back.rotation.y=Math.PI/2;back.position.set(gx+s*NETD,(GH-.2)/2,0);g.add(back);
 const top=new T.Mesh(new T.PlaneGeometry(NETD,GW*2),nm(NETD/.35,GW*2/.35));top.rotation.x=-Math.PI/2;top.position.set(gx+s*NETD/2,GH-.1,0);top.rotation.z=0;g.add(top);
 for(const z of[-1,1]){const sd=new T.Mesh(new T.PlaneGeometry(NETD,GH-.1),nm(NETD/.35,GH/.35));sd.position.set(gx+s*NETD/2,(GH-.1)/2,z*GW);g.add(sd)}
 // back frame bars
 for(const z of[-1,1]){const b=new T.Mesh(new T.CylinderGeometry(.03,.03,GH,6),wm);b.position.set(gx+s*NETD,GH/2,z*GW);g.add(b)}
 const tb=new T.Mesh(new T.CylinderGeometry(.03,.03,GW*2,6),wm);tb.rotation.x=Math.PI/2;tb.position.set(gx+s*NETD,GH-.1,0);g.add(tb);
 stadium.add(g)}
function standGeom(len,rows,d,h){const sh=new T.Shape();sh.moveTo(0,0);for(let i=0;i<rows;i++){sh.lineTo(i*d,(i+1)*h);sh.lineTo((i+1)*d,(i+1)*h)}sh.lineTo(rows*d,0);sh.lineTo(0,0);const g=new T.ExtrudeGeometry(sh,{depth:len,bevelEnabled:false});g.translate(0,0,-len/2);return g}
const SIDES=[{n:'z+',th:-Math.PI/2,o:[0,0,PZ+4.2],len:100},{n:'z-',th:Math.PI/2,o:[0,0,-PZ-4.2],len:100},{n:'x+',th:0,o:[PX+6,0,0],len:60},{n:'x-',th:Math.PI,o:[-PX-6,0,0],len:60}];
const ROWS=13,RD=.85,RH=.52;
function buildStadium(){
 const sk=canvas(16,512),sx=sk.getContext('2d'),sg=sx.createLinearGradient(0,0,0,512);sg.addColorStop(0,'#02040b');sg.addColorStop(.55,'#0a1630');sg.addColorStop(.85,'#1a2f58');sg.addColorStop(1,'#2a3d66');sx.fillStyle=sg;sx.fillRect(0,0,16,512);
 sky=new T.Mesh(new T.SphereGeometry(300,24,16),new T.MeshBasicMaterial({map:tex(sk),side:T.BackSide,fog:false,depthWrite:false}));scene.add(sky);
 const sp=new Float32Array(900);for(let i=0;i<300;i++){const a=Math.random()*6.283,e=rnd(.12,1.3),r=290;sp[i*3]=Math.cos(a)*Math.cos(e)*r;sp[i*3+1]=Math.sin(e)*r;sp[i*3+2]=Math.sin(a)*Math.cos(e)*r}const sg2=new T.BufferGeometry();sg2.setAttribute('position',new T.BufferAttribute(sp,3));scene.add(new T.Points(sg2,new T.PointsMaterial({color:0xffffff,size:1.6,sizeAttenuation:false,fog:false,transparent:true,opacity:.8})));
 // ground
 const sur=new T.Mesh(new T.PlaneGeometry(400,400),new T.MeshStandardMaterial({map:surroundTexture(),roughness:1}));sur.rotation.x=-Math.PI/2;sur.position.y=-.02;sur.receiveShadow=false;stadium.add(sur);
 const pm=new T.Mesh(new T.PlaneGeometry(80,56),new T.MeshStandardMaterial({map:pitchTexture(),roughness:.95,metalness:0}));pm.rotation.x=-Math.PI/2;pm.receiveShadow=true;pm.name='pitch';stadium.add(pm);
 // concrete concourse
 const concMat=new T.MeshStandardMaterial({color:0x5b6472,roughness:.9});
 // boards
 const at=adTexture(),adM=(r)=>{const t=at.clone();t.needsUpdate=true;t.wrapS=T.RepeatWrapping;t.repeat.set(r,1);return new T.MeshBasicMaterial({map:t,toneMapped:false,color:0xdddddd})};
 [[0,PZ+3.2,100,0],[0,-PZ-3.2,100,Math.PI],[PX+4.4,0,56,-Math.PI/2],[-PX-4.4,0,56,Math.PI/2]].forEach(([x,z,l,ry])=>{const b=new T.Mesh(new T.BoxGeometry(l,.9,.12),adM(l/16));b.position.set(x,.45,z);b.rotation.y=ry;stadium.add(b);const cap=new T.Mesh(new T.BoxGeometry(l,.05,.2),new T.MeshStandardMaterial({color:0x111111}));cap.position.set(x,.92,z);cap.rotation.y=ry;stadium.add(cap)});
 // stands
 const persons=[];
 SIDES.forEach(S=>{const m=new T.Mesh(standGeom(S.len,ROWS,RD,RH),concMat);m.position.set(...S.o);m.rotation.y=S.th;m.receiveShadow=Q>1;stadium.add(m);
  const c=Math.cos(S.th),s=Math.sin(S.th);
  for(let r=0;r<ROWS;r++)for(let k=-S.len/2+.6;k<S.len/2-.4;k+=.62){if(Math.random()<.07)continue;const u=r*RD+RD*.55,v=(r+1)*RH,lx=u,lz=k;const wx=S.o[0]+lx*c+lz*s,wz=S.o[2]-lx*s+lz*c;persons.push([wx,v,wz,S.th])}
  // back wall + roof on long sides
  const back=new T.Mesh(new T.BoxGeometry(.5,ROWS*RH+4,S.len),new T.MeshStandardMaterial({color:0x2a313d,roughness:.9}));back.position.set(ROWS*RD+.25,(ROWS*RH+4)/2,0);const bg=new T.Group();bg.add(back);bg.position.set(...S.o);bg.rotation.y=S.th;stadium.add(bg);
  if(S.len>90){const roof=new T.Mesh(new T.BoxGeometry(ROWS*RD+5,.35,S.len+4),new T.MeshStandardMaterial({color:0x1b212b,roughness:.6,metalness:.4}));roof.position.set((ROWS*RD+5)/2-1.5,ROWS*RH+3.6,0);const rg=new T.Group();rg.add(roof);rg.position.set(...S.o);rg.rotation.y=S.th;stadium.add(rg);
   const strip=new T.Mesh(new T.BoxGeometry(.5,.12,S.len),new T.MeshBasicMaterial({color:0xfff1c8,toneMapped:false}));strip.position.set(ROWS*RD*.55,ROWS*RH+3.4,0);const sgp=new T.Group();sgp.add(strip);sgp.position.set(...S.o);sgp.rotation.y=S.th;stadium.add(sgp);
   for(let z=-S.len/2+8;z<=S.len/2-6;z+=16){const pl=new T.Mesh(new T.CylinderGeometry(.25,.3,ROWS*RH+3.6,8),new T.MeshStandardMaterial({color:0x1b212b,metalness:.5,roughness:.5}));pl.position.set(ROWS*RD+2.8,(ROWS*RH+3.6)/2,z);const pg=new T.Group();pg.add(pl);pg.position.set(...S.o);pg.rotation.y=S.th;stadium.add(pg)}}});
 // crowd instances
 const nAll=persons.length,bodyG=new T.CylinderGeometry(.2,.24,.6,6);bodyG.translate(0,.3,0);const headG=new T.SphereGeometry(.14,6,5);headG.translate(0,.78,0);
 const mk=(geo,cols)=>{const mat=new T.MeshLambertMaterial({color:0xffffff});mat.onBeforeCompile=sh=>{sh.uniforms.uT=crowdUni.uT;sh.uniforms.uE=crowdUni.uE;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uT,uE;').replace('#include <begin_vertex>',`#include <begin_vertex>
    float ph=instanceMatrix[3].x*.9+instanceMatrix[3].z*1.7;float sp=1.6+fract(ph*3.7)*1.2+uE*2.5;float am=.03+uE*(.18+.12*fract(ph*7.3));transformed.y+=max(0.,sin(uT*sp*3.+ph))*am*(.4+uE);transformed.y+=uE*max(0.,sin(uT*7.+ph*2.))*.18;`)};const im=new T.InstancedMesh(geo,mat,nAll);const col=new T.Color(),m4=new T.Matrix4();
  for(let i=0;i<nAll;i++){const p=persons[i];m4.makeRotationY(p[3]+Math.PI/2*0);m4.setPosition(p[0],p[1],p[2]);im.setMatrixAt(i,m4);col.setHex(cols[Math.floor(Math.random()*cols.length)]);im.setColorAt(i,col)}im.instanceMatrix.needsUpdate=true;im.instanceColor.needsUpdate=true;im.frustumCulled=false;stadium.add(im);return im};
 const shirts=[0x1678e8,0x1678e8,0xe03232,0xe03232,0xffffff,0xf5d000,0x222831,0x2d9d5f,0xcfd6e4,0x7a3fb2,0xff8a3d];const skins=[0xf1c19b,0xd99c70,0xb8794f,0x8d5a3b,0x5a3825,0xe7b48e];
 crowdMats=[mk(bodyG,shirts),mk(headG,skins)];
 // floodlight towers
 const gl=glowTex();[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{const tx=a*58,tz=b*40,tw=new T.Group();const mast=new T.Mesh(new T.CylinderGeometry(.45,.8,34,8),new T.MeshStandardMaterial({color:0x2a2f38,metalness:.6,roughness:.5}));mast.position.y=17;tw.add(mast);
  const hc=canvas(128,96),hx=hc.getContext('2d');hx.fillStyle='#222';hx.fillRect(0,0,128,96);for(let i=0;i<4;i++)for(let j=0;j<6;j++){hx.fillStyle='#fffbe6';hx.beginPath();hx.arc(14+j*20,14+i*22,8,0,7);hx.fill()}
  const head=new T.Mesh(new T.BoxGeometry(9,6.5,.8),new T.MeshBasicMaterial({map:tex(hc),toneMapped:false}));head.position.y=35;tw.add(head);
  const sp=new T.Sprite(new T.SpriteMaterial({map:gl,color:0xfff4d8,blending:T.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.95}));sp.scale.set(36,36,1);sp.position.y=35;tw.add(sp);
  tw.position.set(tx,0,tz);head.rotation.order='YXZ';head.rotation.y=Math.atan2(-tx,-tz);head.rotation.x=.45;stadium.add(tw);
  const beam=new T.Mesh(new T.ConeGeometry(14,66,18,1,true),new T.MeshBasicMaterial({color:0xfff2d0,transparent:true,opacity:.028,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide,fog:false}));const dir=V(-tx,-35,-tz).normalize();beam.quaternion.setFromUnitVectors(V(0,-1,0),dir);const L=Math.hypot(tx,35,tz);beam.scale.set(1,L/66,1);beam.position.set(tx,35,tz).addScaledVector(dir,L/2);stadium.add(beam)});
 // corner flags
 [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{const p=new T.Mesh(new T.CylinderGeometry(.03,.03,1.5,6),new T.MeshStandardMaterial({color:0xffffff}));p.position.set(a*PX,.75,b*PZ);stadium.add(p);const f=new T.Mesh(new T.PlaneGeometry(.5,.35),new T.MeshBasicMaterial({color:0xffd24a,side:T.DoubleSide}));f.position.set(a*PX+.25,1.3,b*PZ);stadium.add(f)});
 addGoal(1);addGoal(-1);scene.add(stadium)}
function ballTexture(){const c=canvas(512,256),x=c.getContext('2d');x.fillStyle='#f4f3ee';x.fillRect(0,0,512,256);x.fillStyle='#1a1a1a';const pts=[[64,60],[192,60],[320,60],[448,60],[128,128],[256,128],[384,128],[0,128],[64,196],[192,196],[320,196],[448,196],[256,20],[256,236]];pts.forEach(([px,py])=>{x.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;x.lineTo(px+Math.cos(a)*22,py+Math.sin(a)*22)}x.closePath();x.fill()});return tex(c)}
function initRender(){
 scene=new T.Scene();scene.fog=new T.FogExp2(0x0a1226,.0042);
 camera=new T.PerspectiveCamera(42,innerWidth/innerHeight,.3,700);
 renderer=new T.WebGLRenderer({antialias:Q>0,powerPreference:'high-performance'});renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.setPixelRatio(Math.min(devicePixelRatio,Q>1?1.75:1.25));renderer.setSize(innerWidth,innerHeight);
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;$('game').insertBefore(renderer.domElement,$('hud'));
 hemi=new T.HemisphereLight(0xb9cdf5,0x2a4a2c,1.0);scene.add(hemi);
 key=new T.DirectionalLight(0xfff0d8,2.6);key.position.set(-20,46,26);key.castShadow=true;const sz=Q>1?2048:1024;key.shadow.mapSize.set(sz,sz);const sc=key.shadow.camera;sc.left=-30;sc.right=30;sc.top=30;sc.bottom=-30;sc.near=10;sc.far=120;key.shadow.bias=-.0004;key.shadow.normalBias=.03;scene.add(key,key.target);
 const fill=new T.DirectionalLight(0xc8dcff,.7);fill.position.set(25,30,-20);scene.add(fill);
 buildStadium();
 ballMat=new T.MeshStandardMaterial({map:ballTexture(),roughness:.45,metalness:0});ball=new T.Mesh(new T.SphereGeometry(BR,24,16),ballMat);ball.castShadow=true;scene.add(ball);
 addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.fov=camera.aspect<1?58:42;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});camera.aspect=innerWidth/innerHeight;camera.fov=camera.aspect<1?58:42;camera.updateProjectionMatrix()}
/* ---------- PLAYERS ---------- */
const KITS=[{shirt:0x1678e8,trim:0xffffff,shorts:0x0c2350,sock:0x1678e8},{shirt:0xe03232,trim:0xffffff,shorts:0x2e0a0a,sock:0xe03232}],GKK=[{shirt:0x19b45a,trim:0x0b2a14,shorts:0x0b2a14,sock:0x19b45a},{shirt:0xf5a31a,trim:0x2a1800,shorts:0x2a1800,sock:0xf5a31a}],REFK={shirt:0xf2d600,trim:0x111111,shorts:0x111111,sock:0x111111};
const SKINS=[0xf1c19b,0xd99c70,0xb8794f,0x8d5a3b,0x5a3825,0xe7b48e,0xc68a5e],HAIR=[[['Hair_Buzzed'],0x1a120c],[['Hair_SimpleParted'],0x2a1a10],[['Hair_Buzzed','Hair_Beard'],0x111111],[[],0],[['Hair_SimpleParted'],0x4a3018],[['Hair_Buzzed'],0x0e0e0e],[['Hair_SimpleParted','Hair_Beard'],0x1a1a1a]];
const NUMS=[1,4,5,8,6,10,9],HOMES=[[-32,0],[-21,-8],[-21,8],[-9,-11],[-9,11],[4,-6],[4,6]];
let GL=null,players=[],ref=null,blueP=[],redP=[];
function loadGLB(u){return new Promise((res,rej)=>new T.GLTFLoader().load(u,res,undefined,rej))}
async function loadAssets(){try{const[P,A,H]=await Promise.all([loadGLB('assets/player.glb'),loadGLB('assets/anims.glb'),loadGLB('assets/hair.glb')]);GL={P,A,H,clips:{}};A.animations.forEach(c=>GL.clips[c.name]=c)}catch(e){console.warn('assets failed',e);GL=null}}
function labelTex(kind,text,team){const c=canvas(256,96),x=c.getContext('2d');
 if(kind==='name'){x.fillStyle='rgba(6,10,20,.72)';rr(x,248,64,26);x.save();x.translate(4,10);x.fill();x.lineWidth=5;x.strokeStyle=team===0?'#4db3ff':'#ff6b6b';x.stroke();x.restore();x.fillStyle='#fff';x.font='bold 34px system-ui,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(text).slice(0,13),128,43)}
 else{x.fillStyle=team===0?'#1678e8':'#e03232';x.beginPath();x.arc(128,48,34,0,7);x.fill();x.lineWidth=5;x.strokeStyle='#fff';x.stroke();x.fillStyle='#fff';x.font='900 40px system-ui,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(text),128,51)}
 const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t}
function setLabel(p,kind,text){const key=kind+text;if(p.lblKey===key)return;p.lblKey=key;if(p.lbl){p.root.remove(p.lbl);p.lbl.material.map.dispose();p.lbl.material.dispose();p.lbl=null}if(!kind)return;const sp=new T.Sprite(new T.SpriteMaterial({map:labelTex(kind,text,p.team),transparent:true,depthTest:false,depthWrite:false,fog:false}));if(kind==='name')sp.scale.set(2.5,.94,1);else sp.scale.set(1.5,.56,1);sp.position.y=kind==="name"?2.5:2.4;sp.renderOrder=20;p.root.add(sp);p.lbl=sp}
function blobTex(){const c=canvas(64,64),x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(0,0,0,.55)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)}
let BLOB=null;
function mkPlayer(team,slot,isRef){const idx=isRef?14:team*NP+slot,p={idx,team,slot,isRef:!!isRef,gk:!isRef&&slot===0,num:isRef?0:NUMS[slot],pos:V(),vel:V(),face:team?-Math.PI/2:Math.PI/2,st:100,cd:0,stun:0,slideT:0,kickT:0,diveT:0,diveDir:0,celT:0,ov:0,home:V(),fouls:0,ctl:-1,anim:'',acts:{},root:new T.Group(),body:new T.Group(),lblKey:''};
 const fw=team?-1:1;if(!isRef){p.home.set(HOMES[slot][0]*fw,0,HOMES[slot][1]*fw);p.pos.copy(p.home)}
 const kit=isRef?REFK:(p.gk?GKK[team]:KITS[team]),sk=SKINS[(idx*3+1)%SKINS.length],hr=HAIR[(idx*5+2)%HAIR.length];
 if(GL){const g=T.SkeletonUtils.clone(GL.P.scene);g.traverse(o=>{if(o.isSkinnedMesh){o.frustumCulled=false;o.castShadow=Q>1;if(o.name==='SuperHero_Male')o.material=makeKitMaterial(o.material,Object.assign({skin:sk},kit))}});attachHair(g,GL.H,hr[0],hr[1],GL.P.scene);
  g.traverse(o=>{if(o.isMesh&&o.parent&&o.parent.isBone)o.castShadow=Q>1});
  p.body.add(g);p.mixer=new T.AnimationMixer(g);p.bones={};['thigh_r','calf_r','thigh_l','upperarm_l','upperarm_r','spine_02','Head'].forEach(n=>{p.bones[n]=g.getObjectByName(n)});
  for(const n in GL.clips){p.acts[n]=p.mixer.clipAction(GL.clips[n]);p.acts[n].enabled=true}
  anim(p,'Idle_Loop',0)}
 else{const m=(c)=>new T.MeshStandardMaterial({color:c,roughness:.8}),b=new T.Mesh(new T.CapsuleGeometry(.3,.8,4,8),m(kit.shirt));b.position.y=1.25;const h=new T.Mesh(new T.SphereGeometry(.2,10,8),m(sk));h.position.y=1.9;const l=new T.Mesh(new T.CylinderGeometry(.14,.12,.8,8),m(kit.shorts));l.position.y=.45;p.body.add(b,h,l)}
 p.root.add(p.body);
 if(!BLOB)BLOB=blobTex();const bl=new T.Mesh(new T.PlaneGeometry(1.7,1.7),new T.MeshBasicMaterial({map:BLOB,transparent:true,depthWrite:false,opacity:.8}));bl.rotation.x=-Math.PI/2;bl.position.y=.03;bl.renderOrder=1;p.root.add(bl);p.blob=bl;
 const ring=new T.Mesh(new T.RingGeometry(.62,.78,32),new T.MeshBasicMaterial({color:0xffe14a,transparent:true,opacity:.95,depthWrite:false,side:T.DoubleSide,toneMapped:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;ring.visible=false;p.root.add(ring);p.ring=ring;
 scene.add(p.root);return p}
function anim(p,name,fade,ts){if(!p.mixer||!p.acts[name])return;if(p.anim!==name){const n=p.acts[name],o=p.acts[p.anim];n.reset();n.setLoop(T.LoopRepeat,Infinity);n.clampWhenFinished=false;n.play();if(o&&fade>0){n.crossFadeFrom(o,fade,false)}else if(o)o.stop();p.anim=name}if(ts!=null)p.acts[name].timeScale=ts}
function animOnce(p,name,fade,ts){if(!p.mixer||!p.acts[name])return;const n=p.acts[name],o=p.acts[p.anim];n.reset();n.setLoop(T.LoopOnce,1);n.clampWhenFinished=true;n.timeScale=ts||1;n.play();if(o&&o!==n)n.crossFadeFrom(o,fade||.15,false);p.anim=name}
function animate(p,dt){const sp=Math.hypot(p.vel.x,p.vel.z);let ov=p.ov;
 if(p.mixer){
  if(ov===2){if(p.anim!=='Roll'||p.ovPrev!==2)animOnce(p,'Roll',.1,1.25)}
  else if(ov===6){if(p.ovPrev!==6)animOnce(p,'Hit_Chest',.1,.9)}
  else if(ov===3){anim(p,'Dance_Loop',.2,1.1)}
  else if(ov===4||ov===5){anim(p,'Jump_Loop',.12,1)}
  else{const nm=sp<.35?'Idle_Loop':sp<2.3?'Walk_Loop':sp<5.9?'Jog_Fwd_Loop':'Sprint_Loop',ts=nm==='Walk_Loop'?sp/1.5:nm==='Jog_Fwd_Loop'?Math.max(.7,sp/4):nm==='Sprint_Loop'?sp/6.6:1;
   if(p.ovPrev>=2&&p.ovPrev!==1){const o=p.acts[p.anim];if(o&&o.loop===T.LoopOnce){o.stop();p.anim=''}}anim(p,nm,.18,ts)}
  p.mixer.update(dt)}
 // procedural overlays (after mixer)
 const b=p.bones||{};
 if(ov===1||p.kickA>0){p.kickA=ov===1?(p.kickA||0):0}
 const kt=p.kickT>0?p.kickT:0;if(kt>0&&p.mixer&&b.thigh_r){const ph=1-kt/.3,sw=ph<.4?-ph/.4*.9:-.9+(ph-.4)/.6*1.5;b.thigh_r.rotation.x+=KSIGN*sw*(1-Math.max(0,ph-.7)/.3*0);if(b.calf_r)b.calf_r.rotation.x+=KSIGN*(ph<.4?.9*ph/.4:.9-(ph-.4)/.6*.9)*-1}
 p.ovPrev=ov;
 // lean / dive
 let lean=0,yo=0;if(ov===4||ov===5){lean=(ov===4?1:-1)*1.25;yo=.55}else if(ov===2){lean=0}
 p.body.rotation.z+= (lean-p.body.rotation.z)*Math.min(1,dt*14);p.body.position.y+= (yo-p.body.position.y)*Math.min(1,dt*14);
 if(!p.mixer){p.body.position.y=.05+Math.abs(Math.sin(performance.now()*.01*sp*.3))*.08*Math.min(1,sp)}
 p.root.position.set(p.pos.x,0,p.pos.z);p.root.rotation.y=p.face}
let KSIGN=1;
/* ---------- MATCH SIMULATION (host) ---------- */
let playing=false,side='host',solo=false,online=false,mine=null,myTeam=0,H=[],ASSIGN=[],S={mode:'lobby',t:0,hold:false,holdT:0,rk:null,gt:0,scorer:null,expect:null},time=0,half=1,score=[0,0],owner=null,lastTouch=null,evq=[],evId=0;
const bv=V(),opp=t=>t?blueP:redP,mate=t=>t?redP:blueP,fwd=t=>t?-1:1,d2=(a,b)=>(a.x-b.x)*(a.x-b.x)+(a.z-b.z)*(a.z-b.z),dist=(a,b)=>Math.sqrt(d2(a,b));
const AIC=.93;
function say(t,ms){const n=$('notice');n.textContent=t;n.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>n.classList.remove('show'),ms||1800)}
function emit(ev,a,b){evId++;evq.push([evId,ev,a==null?0:a,b==null?0:b]);if(evq.length>10)evq.shift();handle(ev,a,b)}
function handle(ev,a,b){
 if(ev==='wh')sfx(a?'long':'whistle');else if(ev==='k')sfx('kick',a);else if(ev==='po')sfx('post');else if(ev==='sv'){sfx('save');if(a)say('SAVE!',1100)}else if(ev==='tk')sfx('tackle');
 else if(ev==='fl'){sfx('foul')}else if(ev==='n')say(NOTE[a]||'',1700);
 else if(ev==='g'){sfx('net');sfx('goal');say('GOOOAL!',3200);exc=1}else if(ev==='oh')sfx('ooh')}
const NOTE=['','KICK-OFF','THROW-IN','CORNER','GOAL KICK','FREE KICK','PENALTY','HALF TIME','FULL TIME','SECOND HALF','FOUL · FREE KICK','FOUL · PENALTY!','YELLOW CARD · FREE KICK','YELLOW CARD · PENALTY!'];
const RKN={kickoff:1,throwin:2,corner:3,goalkick:4,freekick:5,penalty:6};
function gx(team){return fwd(team)*PX} // the goal this team attacks
function isHuman(p){return H.some(c=>!c.ai&&c.p===p)}
/* movement */
function drive(p,dx,dz,sprint,dt,cap){let l=Math.hypot(dx,dz);if(l>1){dx/=l;dz/=l;l=1}let sp=(sprint&&p.st>4?7.3:5.0)*(cap||1);if(owner===p)sp*=.95;const k=(l>.05?25:32)*dt;p.vel.x+=cl(dx*sp-p.vel.x,-k,k);p.vel.z+=cl(dz*sp-p.vel.z,-k,k);
 if(sprint&&l>.3&&p.st>0)p.st=Math.max(0,p.st-24*dt);else p.st=Math.min(100,p.st+11*dt);
 if(Math.hypot(p.vel.x,p.vel.z)>.7){const a=Math.atan2(p.vel.x,p.vel.z);let d=a-p.face;d=Math.atan2(Math.sin(d),Math.cos(d));p.face+=cl(d,-10*dt,10*dt)}}
function goTo(p,x,z,dt,sprint,cap,stop){const dx=x-p.pos.x,dz=z-p.pos.z,d=Math.hypot(dx,dz)||.001,m=cl((d-(stop||.15))/1.6,0,1);drive(p,dx/d*m,dz/d*m,sprint&&d>3,dt,cap);return d}
function faceTo(p,x,z,dt){const a=Math.atan2(x-p.pos.x,z-p.pos.z);let d=a-p.face;d=Math.atan2(Math.sin(d),Math.cos(d));p.face+=cl(d,-9*dt,9*dt)}
/* kicks */
function placeBall(p){if(S.mode==='dead'&&S.rk){ball.position.set(S.rk.x,BR+.05,S.rk.z);return}if(owner===p||dist(p.pos,ball.position)<2){const fx=Math.sin(p.face),fz=Math.cos(p.face);ball.position.set(p.pos.x+fx*.5,p.gk&&owner===p?1:BR+.05,p.pos.z+fz*.5)}}
function kickVec(p,dx,dz,spd,vy,pw){const l=Math.hypot(dx,dz)||1;placeBall(p);bv.set(dx/l*spd,vy,dz/l*spd);if(S.mode==='dead'){S.mode='play';S.rk=null;S.hold=false}owner=null;S.hold=false;p.cd=.45;p.kickT=.3;lastTouch=p;p.face=Math.atan2(dx,dz);emit('k',pw==null?.6:pw)}
function kickPass(p,t,lob,spdMul){const dx=t.pos.x+t.vel.x*.35-p.pos.x,dz=t.pos.z+t.vel.z*.35-p.pos.z,d=Math.hypot(dx,dz);let spd,vy;
 if(lob||d>27){spd=cl(d*.85+4,11,22);const T2=d/spd;vy=cl(4.9*T2,3,9)}else{spd=cl(d*1.25+5.5,9,22)*(spdMul||1);vy=.4}
 S.expect={p:t,t:2.2};kickVec(p,dx,dz,spd,vy,Math.min(1,spd/24))}
function kickShot(p,aimZ,pw,dirx,dirz){const g=gx(p.team),dz0=aimZ-p.pos.z,dx0=g-p.pos.x;let dx=dx0,dz=dz0;if(dirx!=null){const l0=Math.hypot(dx0,dz0)||1,a=(dx0*dirx+dz0*dirz)/l0/(Math.hypot(dirx,dirz)||1);if(a<.7){dx=dirx;dz=dirz}else{dx=dx0*.7+dirx*.3;dz=dz0*.7+dirz*.3}}
 const l=Math.hypot(dx,dz)||1;let ang=Math.atan2(dz,dx);ang+=rnd(-1,1)*(.025+(pw>.92?.05:0)+(isHuman(p)?0:.03));const spd=12+pw*17,vy=pw>.55?rnd(.6,1.2)+pw*pw*3.4:rnd(.2,.7);const L=Math.hypot(dx,dz);kickVec(p,Math.cos(ang)*L,Math.sin(ang)*L,spd,vy,pw)}
function bestPass(p,aim){const O=opp(p.team),fw=fwd(p.team);let best=null,bs=-9;for(const t of mate(p.team)){if(t===p||t.stun>0)continue;const dx=t.pos.x-p.pos.x,dz=t.pos.z-p.pos.z,d=Math.hypot(dx,dz);if(d<3.5||d>40)continue;if(t.gk&&!(p.pos.x*fw<-PX*.45))continue;
  let open=9,tOpen=9;for(const o of O){const ex=o.pos.x-p.pos.x,ez=o.pos.z-p.pos.z,pr=(ex*dx+ez*dz)/(d*d);if(pr>0&&pr<1){const px=p.pos.x+dx*pr-o.pos.x,pz=p.pos.z+dz*pr-o.pos.z;open=Math.min(open,Math.hypot(px,pz))}tOpen=Math.min(tOpen,dist(o.pos,t.pos))}
  let s=(dx*fw)/14+Math.min(open,5)/4+Math.min(tOpen,7)/5-d/42-(open<1.4?1.6:0)-(t.gk?1:0);if(aim){const c=(dx*aim.x+dz*aim.z)/(d*Math.hypot(aim.x,aim.z)||1);if(c<.45)continue;s=c*3+Math.min(open,5)/5-d/60+(tOpen>2.5?.4:0)}
  if(s>bs){bs=s;best={t,lob:open<1.4&&d>12||d>26}}}return best&&{t:best.t,lob:best.lob,s:bs}}
/* tackles & fouls */
let foulCard=-1;function foul(p,v){v.stun=1.3;v.vel.set(0,0,0);p.fouls++;owner=owner===v?null:owner;emit('wh',0);emit('fl');foulCard=p.fouls===3?1:0;const sx=cl(v.pos.x,-PX+1,PX-1),sz=cl(v.pos.z,-PZ+1,PZ-1),inb=Math.abs(sz)<BOXW&&sx*fwd(p.team)<-(PX-BOXD);setDead(inb?'penalty':'freekick',v.team,inb?-fwd(p.team)*0+gx(v.team)-fwd(v.team)*PEN:sx,inb?0:sz)}
function doTackle(p,slide){if(p.tcd>0||p.stun>0||S.mode!=='play')return;p.tcd=slide?1.4:.8;const O=opp(p.team),fx=Math.sin(p.face),fz=Math.cos(p.face);if(slide){p.slideT=.62;p.vel.x=fx*8.8;p.vel.z=fz*8.8}
 const reach=slide?2.5:1.6;let tg=null,bd=9;for(const q of O){const dx=q.pos.x-p.pos.x,dz=q.pos.z-p.pos.z,d=Math.hypot(dx,dz);if(d<reach&&(dx*fx+dz*fz)/(d||1)>.3&&d<bd){bd=d;tg=q}}
 if(!tg)return;const has=owner===tg;if(!has){if(slide&&dist(tg.pos,ball.position)>2&&Math.random()<.5)foul(p,tg);return}
 const tfx=Math.sin(tg.face),tfz=Math.cos(tg.face),behind=((p.pos.x-tg.pos.x)*tfx+(p.pos.z-tg.pos.z)*tfz)/(bd||1)<-.2,pf=behind?(slide?.7:.5):(slide?.28:.1);
 if(Math.random()<pf)return foul(p,tg);
 if(Math.random()<(slide?.75:.62)){owner=null;S.hold=false;bv.set(fx*4.2+rnd(-1.5,1.5),.9,fz*4.2+rnd(-1.5,1.5));tg.stun=.4;tg.cd=.45;p.cd=.05;lastTouch=p;emit('tk')}}
/* restarts */
function resetFormation(kickTeam){for(const p of players){if(p.isRef)continue;const fw=fwd(p.team);p.pos.set(p.team?Math.max(2,p.home.x):Math.min(-2,p.home.x),0,p.home.z);p.vel.set(0,0,0);p.face=fw>0?Math.PI/2:-Math.PI/2;p.stun=0;p.slideT=0;p.diveT=0;p.ov=0;p.celT=0}}
function setDead(kind,team,x,z,tele){S.mode='dead';S.rk={kind,team,x,z,t:0,taker:null};owner=null;S.hold=false;S.expect=null;if(tele)resetFormation(team);ball.position.set(x,BR,z);bv.set(0,0,0);
 const M=mate(team);let tk=null;if(kind==='goalkick')tk=M[0];else if(kind==='penalty')tk=M.filter(q=>!q.gk).sort((a,b)=>b.slot-a.slot)[0];else if(kind==='kickoff')tk=M.filter(q=>!q.gk).sort((a,b)=>d2(a.pos,{x,z})-d2(b.pos,{x,z}))[0];else{const pool=M.filter(q=>!q.gk&&q.stun<=0);tk=pool.sort((a,b)=>d2(a.pos,{x,z})-d2(b.pos,{x,z}))[0]||M[1]}
 S.rk.taker=tk;const hs=H.filter(c=>!c.ai&&c.team===team);if(hs.length&&!tk.gk&&!isHuman(tk)){const c=hs.sort((a,b)=>d2(a.p.pos,{x,z})-d2(b.p.pos,{x,z}))[0];setControl(c,tk)}
 if(kind!=='kickoff'||tele){emit('wh',0)}if(foulCard>=0&&(kind==='freekick'||kind==='penalty'))emit('n',10+(kind==='penalty'?1:0)+(foulCard?2:0));else emit('n',RKN[kind]);foulCard=-1}
function deadTarget(q){const R=S.rk,fw=fwd(q.team),w=q.team===R.team;let x=q.home.x,z=q.home.z;const b=ball.position;
 if(R.kind==='penalty'){if(q.gk){return[gx(1-R.team)*1+0,0,true]}const e=gx(R.team),s=Math.sign(e);return[e-s*(BOXD+3.5+(q.slot%3)*2.2),(q.slot-3)*3.6,false]}
 if(R.kind==='kickoff'){const nx=q.team?Math.max(2,q.home.x):Math.min(-2,q.home.x);if(q===R.taker2)return[-fw*.8,3.2];return[nx,q.home.z]}
 x=lerp(x,b.x,.35);z=lerp(z,b.z,.3);if(R.kind==='corner'&&w&&q.slot>=3){const e=gx(R.team);return[e-Math.sign(e)*(5+(q.slot-3)*1.2),(q.slot-4.5)*3.2]}if(R.kind==='corner'&&!w&&q.slot>=1){const e=gx(R.team);return[e-Math.sign(e)*(3+(q.slot)*1.1),(q.slot-3.5)*2.6]}
 if(R.kind==='goalkick'&&q.gk&&!w)return[-fw*0+gx(1-q.team)*0+(-fw)*(PX-1.2),0];
 if(!w){const dx=x-b.x,dz=z-b.z,d=Math.hypot(dx,dz)||1;if(d<6.5){x=b.x+dx/d*6.5;z=b.z+dz/d*6.5}}
 return[cl(x,-PX+1,PX-1),cl(z,-PZ+1,PZ-1)]}
/* human control */
function setControl(c,p){if(c.p===p)return;if(c.p){c.p.ctl=-1}c.p=p;p.ctl=c.idx;refreshLabels()}
function refreshLabels(){for(const p of players){if(p.isRef)continue;const c=H.find(h=>h.p===p&&!h.ai);if(c)setLabel(p,'name',c.name,p.team);else setLabel(p,'num',p.num,p.team);p.ring.visible=!!(mine&&mine.p===p)}}
function processSwitches(){const req=H.filter(c=>c.inp.sw&&!c.ai).sort((a,b)=>a.inp.swT-b.inp.swT);for(const c of req){c.inp.sw=false;const taken=new Set(H.filter(o=>o!==c&&!o.ai&&o.p).map(o=>o.p));const cand=mate(c.team).filter(q=>!q.gk&&!taken.has(q)&&q!==c.p);if(!cand.length)continue;const car=owner&&owner.team===c.team&&owner!==c.p&&!owner.gk&&!taken.has(owner)?owner:null;let pick=car;if(!pick){cand.sort((a,b)=>d2(a.pos,ball.position)-d2(b.pos,ball.position));pick=cand[0]}setControl(c,pick)}}
function humanUpdate(c,dt){const p=c.p;if(!p)return;const i=c.inp,wx=c.team?-i.x:i.x,wz=c.team?-i.z:i.z;
 c.swCd=(c.swCd||0)-dt;if(S.mode==='play'&&H.filter(h=>!h.ai&&h.team===c.team).length===1&&c.swCd<=0&&owner!==p){const cand=mate(c.team).filter(q=>!q.gk&&q!==p&&!q.stun);cand.sort((a,b)=>d2(a.pos,ball.position)-d2(b.pos,ball.position));const q=cand[0];if(q&&dist(p.pos,ball.position)>dist(q.pos,ball.position)+3){setControl(c,q);c.swCd=1.2;return}}
 if(p.stun>0||p.slideT>0||p.diveT>0)return;
 const dead=S.mode==='dead',tk=dead&&S.rk.taker===p;
 if(dead&&!tk||S.mode==='goal'||S.mode==='half'||S.mode==='end'){drive(p,wx,wz,false,dt,.8);return}
 if(!tk)drive(p,wx,wz,i.sprint,dt);
 if(tk){const px=S.rk.x,pz=S.rk.z,aim=Math.hypot(wx,wz)>.25?[wx,wz]:null;const fx=S.rk.kind==='kickoff'?-fwd(p.team)*.9:0;goTo(p,px-(aim?aim[0]:fwd(p.team))*.9+fx,pz-(aim?aim[1]:0)*.9,dt,false,.7,.05);if(aim)faceTo(p,p.pos.x+aim[0],p.pos.z+aim[1],dt);else if(S.rk.kind!=='kickoff')faceTo(p,px+fwd(p.team)*3,pz,dt)}
 const near=!owner&&dist(p.pos,ball.position)<1.3&&ball.position.y<1.2,can=owner===p||(tk&&S.rk.t>.8)||near;
 const aim=Math.hypot(wx,wz)>.25?{x:wx,z:wz}:null;
 if(i.pass){i.pass=false;if(can&&p.cd<=0){const b=bestPass(p,aim||{x:Math.sin(p.face),z:Math.cos(p.face)});if(b)kickPass(p,b.t,b.lob);else kickVec(p,aim?aim.x:Math.sin(p.face),aim?aim.z:Math.cos(p.face),13,.4,.4)}}
 if(i.lob){i.lob=false;if(can&&p.cd<=0){const b=bestPass(p,aim||{x:Math.sin(p.face),z:Math.cos(p.face)});if(b)kickPass(p,b.t,true);else kickVec(p,aim?aim.x:Math.sin(p.face),aim?aim.z:Math.cos(p.face),16,7,.6)}}
 if(i.shoot>0){const pw=i.shoot;i.shoot=0;if(can&&p.cd<=0){if(tk&&S.rk.kind!=='freekick'&&S.rk.kind!=='penalty'&&S.rk.kind!=='kickoff'){const b=bestPass(p,aim||null);if(b)kickPass(p,b.t,true);else kickVec(p,Math.sin(p.face),Math.cos(p.face),16,6,.6)}else{const dx=aim?aim.x:Math.sin(p.face),dz=aim?aim.z:Math.cos(p.face);const az=cl(p.pos.z+(aim?aim.z*10:0),-GW*.85,GW*.85);kickShot(p,az,pw,dx,dz)}}}
 if(i.tackle){i.tackle=false;if(S.mode==='play'&&(!owner||owner.team!==p.team))doTackle(p,i.sprint&&Math.hypot(p.vel.x,p.vel.z)>3)}}
/* AI */
function shape(q,has){const fw=fwd(q.team),b=ball.position;let x=q.home.x+cl(b.x*.5,-17,17),z=q.home.z*.88+b.z*.22;if(has){if(q.slot>=3)x+=fw*(q.slot>=5?10:5)}else x-=fw*2.5;x=cl(x,-PX+5,PX-5);z=cl(z,-PZ+3,PZ-3);for(const m of mate(q.team)){if(m!==q&&!m.gk){const dx=x-m.pos.x,dz=z-m.pos.z,d=Math.hypot(dx,dz);if(d<5&&d>.01){x+=dx/d*(5-d)*.5;z+=dz/d*(5-d)*.5}}}return[x,z]}
function aiOwner(q,dt){const fw=fwd(q.team),g=gx(q.team),O=opp(q.team);q.ct=(q.ct||0)+dt;q.tt=(q.tt||0)-dt;let pr=99,nearO=null;for(const o of O){const d=dist(o.pos,q.pos);if(d<pr){pr=d;nearO=o}}const dg=Math.hypot(g-q.pos.x,q.pos.z);
 if(q.tt<=0){q.tt=.2+rnd(0,.18);
  if(dg<20&&pr>1.6&&(dg<14||pr<3.4||Math.random()<.3)&&Math.abs(q.pos.z)<PZ-3&&(Math.abs(Math.atan2(q.pos.z,Math.abs(g-q.pos.x)))<1.0)){const az=rnd(-1,1)*GW*.78;kickShot(q,az,rnd(.55,1));q.ct=0;return}
  const b=bestPass(q,null);if(b&&(pr<3.2||q.ct>2.6||b.s>1.35&&Math.random()<.5||(q.pos.x*fw<-PX*.5&&pr<5))){kickPass(q,b.t,b.lob);q.ct=0;return}}
 let dx=g-q.pos.x,dz=-q.pos.z*.55;const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;for(const o of O){const ex=o.pos.x-q.pos.x,ez=o.pos.z-q.pos.z,d=Math.hypot(ex,ez);if(d<4.5&&d>.01&&(ex*dx+ez*dz)>0){const k=(4.5-d)/4.5;dx-=ex/d*k*1.4;dz-=ez/d*k*1.4}}
 if(q.pos.z>PZ-3)dz-=.8;if(q.pos.z<-PZ+3)dz+=.8;drive(q,dx,dz,pr>5,dt,AIC)}
function aiChase(q,dt){const b=ball.position;let tx=b.x+bv.x*.25,tz=b.z+bv.z*.25;if(owner&&owner.team!==q.team){tx=owner.pos.x+owner.vel.x*.25;tz=owner.pos.z+owner.vel.z*.25}
 const d=goTo(q,tx,tz,dt,true,AIC*1.02,.5);q.tcd=(q.tcd||0);if(owner&&owner.team!==q.team&&d<1.35&&q.tcd<=0&&S.mode==='play'){if(Math.random()<.55)doTackle(q,false);else q.tcd=.5}}
function keeperAI(k,dt){const b=ball.position,inx=fwd(k.team),gl=-inx*PX,gxn=gl;
 if(S.hold&&owner===k){S.holdT+=dt;k.vel.multiplyScalar(.8);faceTo(k,0,0,dt);if(S.holdT>1.5&&!isHuman(k)){const cand=mate(k.team).filter(q=>!q.gk).sort((a,b2)=>(b2.pos.x-a.pos.x)*inx);const t=cand.find(q=>q.pos.x*inx>-6&&Math.random()<.6)||cand[Math.floor(Math.random()*cand.length)];kickPass(k,t,true)}return}
 const heading=bv.x*inx<-4&&Math.hypot(bv.x,bv.z)>8&&!owner;
 if(heading){const tg=(gl-b.x)/bv.x;if(tg>0&&tg<1.5){if(!k.sv||S.t-k.sv.t0>1.5){const zp=b.z+bv.z*tg,yp=b.y+bv.y*tg-4.9*tg*tg;if(Math.abs(zp)<GW+1.4&&yp<GH+.7){k.sv={t0:S.t,z:zp+rnd(-.55,.55)*(1+Math.hypot(bv.x,bv.z)/25),d:.15+rnd(0,.1)}}else k.sv=null}}}else if(k.sv&&S.t-k.sv.t0>1.7)k.sv=null;
 if(k.sv&&S.t-k.sv.t0>k.sv.d){const tz=cl(k.sv.z,-GW-.4,GW+.4),dz=tz-k.pos.z;const sp=6.3;k.vel.x=0;k.vel.z=cl(dz*8,-sp,sp);if(Math.abs(dz)>1.1&&k.diveT<=0&&k.sv.dove!==S.t&&!k.sv.did){k.sv.did=1;k.diveT=.85;const rx=-Math.cos(k.face),rz=Math.sin(k.face);k.diveDir=(dz*rz>0)?4:5}faceTo(k,k.pos.x+inx*5,k.pos.z,dt);return}
 const dx=b.x-gl,dz=b.z,d=Math.hypot(dx,dz)||1,dp=cl(d*.17,1.4,5),tx=gl+dx/d*dp,tz=cl(dz/d*dp*1.25,-GW+.5,GW-.5);goTo(k,tx,tz,dt,false,.95,.1);faceTo(k,b.x,b.z,dt)}
function teamAI(team,dt){const O=opp(team),b=ball.position,has=owner&&owner.team===team,they=owner&&owner.team!==team,M=mate(team);
 const free=M.filter(q=>!q.gk&&!isHuman(q)&&q.stun<=0&&q.slideT<=0).sort((a,c)=>d2(a.pos,b)-d2(c.pos,b));const near=free.filter(q=>S.expect&&S.expect.p===q);
 const nCh=has?0:(they&&Math.abs(b.x+fwd(team)*PX)<22?2:1);
 for(const q of M){if(isHuman(q)||q.stun>0||q.slideT>0||q.diveT>0)continue;
  if(S.mode==='dead'){const R=S.rk;if(q.gk){if(R.kind==='goalkick'&&R.taker===q){goTo(q,R.x-fwd(q.team)*.9,R.z,dt,false,.7,.05);faceTo(q,R.x,R.z,dt)}else if(R.kind==='penalty'&&q.team!==R.team){goTo(q,gx(R.team)-(gx(R.team)>0?.8:-.8),0,dt,false,.8,.1);faceTo(q,0,0,dt)}else keeperAI(q,dt);continue}
   if(R.taker===q){if(R.kind==='kickoff'){goTo(q,R.x-fwd(q.team)*.6,R.z,dt,false,.8,.05);faceTo(q,R.x+fwd(q.team),R.z,dt)}else{const g=gx(q.team),dxg=g-R.x,dzg=-R.z,l=Math.hypot(dxg,dzg)||1,k=R.kind==='throwin'?[0,-Math.sign(R.z)]:[dxg/l,dzg/l];const ax=R.x-k[0]*.9,az=R.z-k[1]*.9;goTo(q,ax,az,dt,false,.8,.05);faceTo(q,R.x,R.z,dt)}continue}
   const t=deadTarget(q);goTo(q,t[0],t[1],dt,false,.85,.3);faceTo(q,b.x,b.z,dt);continue}
  if(S.mode==='goal'){if(S.scorer&&q.team===S.scorer.team&&q!==S.scorer&&dist(q.pos,S.scorer.pos)<30)goTo(q,S.scorer.pos.x,S.scorer.pos.z,dt,true,.9,1.8);else drive(q,0,0,false,dt);continue}
  if(S.mode!=='play'){drive(q,0,0,false,dt);continue}
  if(q.gk){keeperAI(q,dt);continue}
  if(q===owner){aiOwner(q,dt);continue}
  if(S.expect&&S.expect.p===q){const tx=b.x+bv.x*.3,tz=b.z+bv.z*.3;goTo(q,tx,tz,dt,true,AIC,.3);continue}
  if(free.indexOf(q)>=0&&free.indexOf(q)<nCh){aiChase(q,dt);continue}
  const t=shape(q,has);goTo(q,t[0],t[1],dt,false,AIC*.95,.6);faceTo(q,b.x,b.z,dt)}}
function refUpdate(dt){const b=ball.position,tx=cl(b.x-fwd(1)*0-4,-PX+3,PX-3),tz=cl(b.z+(b.z>0?-9:9),-PZ+1,PZ-1);goTo(ref,tx,tz,dt,false,.85,1.5);faceTo(ref,b.x,b.z,dt)}
/* ball */
function holdBall(k){owner=k;S.hold=true;S.holdT=0;bv.set(0,0,0);k.vel.set(0,0,0)}
function ballStep(dt){const b=ball.position;
 if(owner){const o=owner,fx=Math.sin(o.face),fz=Math.cos(o.face);if(S.hold&&o.gk){b.set(o.pos.x+fx*.32,1.15,o.pos.z+fz*.32);bv.set(0,0,0)}else{const sp=Math.hypot(o.vel.x,o.vel.z),lead=.52+sp*.05,tx=o.pos.x+fx*lead,tz=o.pos.z+fz*lead,k=Math.min(1,dt*20);b.x+=(tx-b.x)*k;b.z+=(tz-b.z)*k;b.y=BR+(sp>.5?Math.abs(Math.sin(S.t*sp*1.5))*.09:0);bv.set(o.vel.x,0,o.vel.z)}return}
 if(S.mode==='dead'){return}
 const px=b.x,py=b.y,pz=b.z;bv.y-=9.8*dt;const dr=Math.exp(-.09*dt);bv.x*=dr;bv.z*=dr;b.addScaledVector(bv,dt);
 if(b.y<BR){b.y=BR;if(bv.y<-1.5){bv.y=-bv.y*.58;bv.x*=.93;bv.z*=.93}else bv.y=0}
 if(b.y<=BR+.03){const f=Math.exp(-.85*dt);bv.x*=f;bv.z*=f;if(Math.hypot(bv.x,bv.z)<.1){bv.x=0;bv.z=0}}
 if(S.mode==='goal'){const s=Math.sign(b.x);if(Math.abs(b.x)>PX+NETD-BR){b.x=s*(PX+NETD-BR);bv.x*=-.12}if(Math.abs(b.z)>GW-BR*.5){b.z=Math.sign(b.z)*(GW-BR*.5);bv.z*=-.2}if(b.y>GH-.2){b.y=GH-.2;bv.y=-Math.abs(bv.y)*.2}const f=Math.exp(-2.2*dt);bv.x*=f;bv.z*=f;return}
 // goal line, posts, bar
 for(const s of[-1,1]){const L=s*PX;if((px-L)*(b.x-L)<=0&&Math.abs(b.x-px)>1e-6){const t=(L-px)/(b.x-px),yA=py+(b.y-py)*t,zA=pz+(b.z-pz)*t,r=BR*.7+.07;
   if(Math.abs(Math.abs(zA)-GW)<r&&yA<GH+.1&&Math.abs(zA)<GW+r){bv.x*=-.5;bv.z+=Math.sign(zA)*2.2;b.x=px;emit('po');if(Math.abs(bv.x)<2)bv.x=-s*3;continue}
   if(Math.abs(yA-GH)<r&&Math.abs(zA)<GW+.1){bv.x*=-.55;bv.y=-Math.abs(bv.y)*.5-1;b.x=px;emit('po');continue}
   if(Math.abs(zA)<GW&&yA<GH){const team=s>0?0:1;if(lastTouch&&lastTouch.team===team||true){goalScored(team)}return}}}
}
function goalScored(team){lastConcede=1-team;score[team]++;S.mode='goal';S.gt=0;let sc=lastTouch&&lastTouch.team===team?lastTouch:mate(team).filter(q=>!q.gk).sort((a,b)=>dist(a.pos,ball.position)-dist(b.pos,ball.position))[0];S.scorer=sc;owner=null;S.hold=false;emit('g',team,sc?sc.idx:0);emit('wh',0);hud()}
function pickups(){if(owner||S.mode!=='play')return;const b=ball.position,sp=Math.hypot(bv.x,bv.y,bv.z);let best=null,bd=9;
 for(const p of players){if(p.isRef||p.cd>0||p.stun>0)continue;const dx=p.pos.x-b.x,dz=p.pos.z-b.z;let reach=p.gk?1.0:.78;if(p.slideT>0)reach=1.25;if(p.diveT>0)reach=1.95;const hy=p.gk?(p.diveT>0?1.6:1.1):.6,dy=Math.abs(b.y-(p.gk?hy+.5:hy)),d=Math.hypot(dx,dz);if(d>reach||dy>(p.gk?1.45:(b.y>1.7?9:1.2)))continue;if(b.y>2.0&&!p.gk)continue;if(d<bd){bd=d;best=p}}
 if(!best)return;const p=best,same=lastTouch&&lastTouch.team===p.team;
 if(p.gk){const sh=!same&&sp>9;if(!sh||Math.random()<cl(1.05-sp/30,.18,.95)){holdBall(p);if(sh)emit('sv',1);else if(!same)emit('sv',0);lastTouch=p;S.expect=null}else{const s2=Math.hypot(bv.x,bv.z)*.5,a=Math.atan2(p.pos.x*0+(b.x>0?-1:1),0);bv.set(-Math.sign(b.x)*s2*.6,rnd(1,4),(b.z-p.pos.z)*2.5+rnd(-2,2));p.cd=.5;lastTouch=p;emit('sv',1)}return}
 if(same||sp<17){if(sp<(same?20:15)){owner=p;lastTouch=p;S.expect=null;S.hold=false;p.tcd=Math.max(p.tcd||0,.0)}else if(!same){bv.x*=-.35;bv.z*=.35;bv.y=rnd(1,3);lastTouch=p;p.cd=.25}}else if(!same){bv.x*=-.3;bv.z*=.3;bv.y=rnd(.8,3);lastTouch=p;p.cd=.25}}
function rules(){if(S.mode!=='play')return;const b=ball.position;
 if(Math.abs(b.z)>PZ+.15){const team=lastTouch?1-lastTouch.team:0;setDead('throwin',team,cl(b.x,-PX+1,PX-1),Math.sign(b.z)*(PZ-.25));return}
 if(Math.abs(b.x)>PX+.1){const dteam=b.x>0?1:0;if(lastTouch&&lastTouch.team===dteam)setDead('corner',1-dteam,Math.sign(b.x)*(PX-.4),Math.sign(b.z||1)*(PZ-.4));else setDead('goalkick',dteam,Math.sign(b.x)*(PX-SIXD),0)}}
function hud(){$('hs').textContent=score[0];$('as').textContent=score[1];const m=Math.floor(time/60),s=Math.floor(time%60);$('time').textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function takeRestart(dt){const R=S.rk;if(!R)return;R.t+=dt;const k=R.taker;if(!k)return;
 // ball sits at the spot; taker walks to it
 ball.position.set(R.x,BR,R.z);bv.set(0,0,0);if(isHuman(k)){if(R.t>10)aiTake(k)}else if(R.t>(R.kind==='kickoff'?2.3:1.5)+k.slot*.05&&dist(k.pos,{x:R.x-0,z:R.z})<1.4)aiTake(k)}
function aiTake(k){const R=S.rk,g=gx(k.team);S.mode='dead';if(R.kind==='penalty'){kickShot(k,(Math.random()<.5?-1:1)*rnd(1.8,3.2),rnd(.8,1));return}
 if(R.kind==='freekick'&&Math.abs(g-R.x)<26&&Math.abs(R.z)<16&&Math.random()<.7){kickShot(k,rnd(-1,1)*GW*.8,rnd(.7,1));return}
 if(R.kind==='corner'){const t=mate(k.team).filter(q=>!q.gk&&q!==k).sort((a,c)=>Math.abs(a.pos.x-g)-Math.abs(c.pos.x-g))[0];if(t){kickPass(k,t,true);return}}
 const b=bestPass(k,null);if(b)kickPass(k,b.t,R.kind==='goalkick'||b.lob);else{const t=mate(k.team).find(q=>q!==k)||k;kickPass(k,t,false)}}
function simStep(dt){S.t+=dt;
 if(S.mode==='lobby')return;
 for(const p of players){p.cd=Math.max(0,p.cd-dt);p.tcd=Math.max(0,(p.tcd||0)-dt);p.stun=Math.max(0,p.stun-dt);p.kickT=Math.max(0,p.kickT-dt);if(p.slideT>0){p.slideT-=dt;p.vel.multiplyScalar(Math.exp(-3.2*dt))}if(p.diveT>0)p.diveT-=dt;if(p.celT>0)p.celT-=dt}
 if(S.mode==='half'){for(const p of players)p.vel.multiplyScalar(.9);S.gt+=dt;if(S.gt>4){half=2;time=GAME_HALF;setDead('kickoff',1,0,0,true)}}
 else if(S.mode==='end'){}
 else{
 if(S.expect){S.expect.t-=dt;if(S.expect.t<=0)S.expect=null}
 processSwitches();for(const c of H){if(!c.ai)humanUpdate(c,dt)}
 teamAI(0,dt);teamAI(1,dt);refUpdate(dt);
 if(S.mode==='dead')takeRestart(dt);
 if(S.mode==='goal'){S.gt+=dt;if(S.scorer){S.scorer.celT=1;}if(S.gt>4.2){const conc=1-(S.scorer?S.scorer.team:0);setDead('kickoff',lastGoalConcede(),0,0,true)}}
 }
 // integrate players
 for(const p of players){if(p.stun>0&&!p.isRef){p.vel.multiplyScalar(Math.exp(-6*dt))}p.pos.x+=p.vel.x*dt;p.pos.z+=p.vel.z*dt;p.pos.x=cl(p.pos.x,-PX-3.5,PX+3.5);p.pos.z=cl(p.pos.z,-PZ-3.5,PZ+3.5)}
 for(let i=0;i<players.length;i++){const a=players[i];for(let j=i+1;j<players.length;j++){const c=players[j];const dx=c.pos.x-a.pos.x,dz=c.pos.z-a.pos.z,d=Math.hypot(dx,dz);if(d<.62&&d>.001){const k=(.62-d)*.5/d;if(!a.slideT)a.pos.x-=dx*k,a.pos.z-=dz*k;if(!c.slideT)c.pos.x+=dx*k,c.pos.z+=dz*k}}}
 if(S.mode!=='end'&&S.mode!=='half'){ballStep(dt);pickups();rules()}
 // overlay codes
 for(const p of players){p.ov=p.stun>.15&&!p.isRef?6:p.slideT>0?2:p.diveT>0?p.diveDir:(p.celT>0?3:0)}
 // clock
 if(S.mode==='play'||S.mode==='dead'){time+=dt*(GAME_HALF/HALF_REAL);if(half===1&&time>=GAME_HALF){time=GAME_HALF;S.mode='half';S.gt=0;owner=null;S.hold=false;emit('wh',1);emit('n',7)}else if(half===2&&time>=2*GAME_HALF){time=2*GAME_HALF;S.mode='end';owner=null;emit('wh',1);emit('n',8);endMatch()}}
 hud()}
var lastConcede=1;function lastGoalConcede(){return lastConcede}
/* ---------- NETWORK / INPUT / LOOP ---------- */
const fresh=()=>({x:0,z:0,sprint:false,pass:false,lob:false,tackle:false,shoot:0,sw:false,swT:0}),input=fresh(),r2=n=>Math.round(n*100)/100;
let helloT=0,sendT=0,inT=0,lastIn='',snapN=0,buf=[],seenEv=0,pred=null,last=0,acc=0,fpsE=.016,fpsT=0,qDrops=0,gSnap=null,camLook=V(0,0,0),orbit=0,ballBlob,lblDirty=true;
const MODE={lobby:0,play:1,dead:2,goal:3,half:4,end:5},MODEN=['lobby','play','dead','goal','half','end'];
function nameOf(id){const q=(Borego.players||[]).find(p=>p.id===id);return q&&q.name?q.name:(id===Borego.me?(Borego.myName||'You'):'Player')}
function assign(L){const n=Math.min(4,L.length),id=i=>L[i].id;if(n<=1)return[[id(0),'b',5]];if(n===2)return[[id(0),'b',5],[id(1),'r',5]];if(n===3)return[[id(0),'b',5],[id(1),'b',4],[id(2),'r',5]];return[[id(0),'b',5],[id(1),'b',4],[id(2),'r',5],[id(3),'r',4]]}
function setupControllers(a){ASSIGN=a;H=a.map((x,i)=>{const t=x[1]==='b'?0:1;return{id:x[0],team:t,idx:i,p:(t?redP:blueP)[x[2]],inp:x[0]===Borego.me&&side==='host'?input:fresh(),ai:false,name:nameOf(x[0]),swCd:0}});players.forEach(p=>p.ctl=-1);H.forEach(c=>c.p.ctl=c.idx);mine=H.find(c=>c.id===Borego.me)||null;myTeam=mine?mine.team:0;refreshLabels()}
function send(ev,payload){try{Borego.send({e:ev,p:payload})}catch(e){}}
function snapshot(){const f=snapN++<30||snapN%30===0;return{t:r2(time),h:half,s:score,m:MODE[S.mode],b:[r2(ball.position.x),r2(ball.position.y),r2(ball.position.z)],o:owner?owner.idx:-1,p:players.map(p=>[r2(p.pos.x),r2(p.pos.z),r2(p.face),p.ov]),c:players.map(p=>p.ctl),e:evq,a:f?ASSIGN:0}}
function netMsg(m,from){if(!m||!m.e)return;const ev=m.e,pl=m.p;
 if(ev==='rx'){showRx(from,pl);return}
 if(ev==='in'){if(side==='host'&&pl){const c=H.find(x=>x.id===from&&!x.ai);if(c&&c.inp!==input){const i=c.inp;i.x=+pl.x||0;i.z=+pl.z||0;i.sprint=!!pl.sprint;if(pl.pass)i.pass=true;if(pl.lob)i.lob=true;if(pl.tackle)i.tackle=true;if(pl.shoot>0)i.shoot=Math.max(i.shoot,+pl.shoot);if(pl.sw&&!i.sw){i.sw=true;i.swT=performance.now()}}}}
 else if(ev==='st'){if(side!=='guest'||!pl)return;if(pl.a&&!H.length)setupControllers(pl.a);if(pl.a&&!playing){}if(!playing){playing=true;$('lobby').classList.add('hidden');$('net').textContent=lobbyList().length+' PLAYERS';startCrowd()}
  buf.push({at:performance.now(),d:pl});if(buf.length>8)buf.shift();gSnap=pl;
  for(const e of pl.e||[])if(e[0]>seenEv){seenEv=e[0];handle(e[1],e[2],e[3])}
  if(MODEN[pl.m]==='end'&&!$('final').textContent){endMatch(pl.s)}}
 else if(ev==='fin'){if(pl)endMatch(pl)}}
function endMatch(sc){sc=sc||score;playing=false;stopCrowd();let t=sc[0]+' — '+sc[1];if(mine){const my=sc[mine.team],th=sc[1-mine.team];t+=my>th?'  ·  YOU WIN!':my<th?'  ·  YOU LOSE':'  ·  DRAW'}$('final').textContent=t;$('end').classList.remove('hidden');if(side==='host')send('fin',sc)}
/* guest view */
function lerpA(a,b,t){let d=b-a;d=Math.atan2(Math.sin(d),Math.cos(d));return a+d*t}
function guestUpdate(dt){if(!buf.length)return;const now=performance.now()-110;let A=buf[0],B=buf[buf.length-1];for(let i=0;i<buf.length-1;i++){if(buf[i].at<=now&&buf[i+1].at>=now){A=buf[i];B=buf[i+1];break}}
 let k=B===A?1:cl((now-A.at)/Math.max(1,B.at-A.at),0,1);if(now>B.at)k=1;const a=A.d,b=B.d;
 const lastP=players.map(p=>[p.pos.x,p.pos.z]);
 players.forEach((p,i)=>{const pa=a.p[i],pb=b.p[i];if(!pa||!pb)return;p.pos.x=lerp(pa[0],pb[0],k);p.pos.z=lerp(pa[1],pb[1],k);p.face=lerpA(pa[2],pb[2],k);p.ov=pb[3];p.ctl=b.c[i]});
 if(mine&&b.m===1){const p=mine.p;if(!pred){pred={x:p.pos.x,z:p.pos.z,vx:0,vz:0}}const i2=input,wx=myTeam?-i2.x:i2.x,wz=myTeam?-i2.z:i2.z,l=Math.min(1,Math.hypot(wx,wz)),sp=(i2.sprint?7.3:5)*(owner?.95:1),kk=25*dt,dx=l>0?wx/Math.max(1,Math.hypot(wx,wz)):0,dz=l>0?wz/Math.max(1,Math.hypot(wx,wz)):0;pred.vx+=cl(dx*l*sp-pred.vx,-kk,kk);pred.vz+=cl(dz*l*sp-pred.vz,-kk,kk);pred.x+=pred.vx*dt;pred.z+=pred.vz*dt;const ex=p.pos.x-pred.x,ez=p.pos.z-pred.z;if(Math.hypot(ex,ez)>3||p.ov){pred.x=p.pos.x;pred.z=p.pos.z}else{pred.x+=ex*Math.min(1,dt*5);pred.z+=ez*Math.min(1,dt*5)}p.pos.x=pred.x;p.pos.z=pred.z;if(Math.hypot(pred.vx,pred.vz)>.7)p.face=lerpA(p.face,Math.atan2(pred.vx,pred.vz),Math.min(1,dt*10))}else pred=null;
 players.forEach((p,i)=>{p.vel.set((p.pos.x-lastP[i][0])/Math.max(dt,.001),0,(p.pos.z-lastP[i][1])/Math.max(dt,.001));if(p.vel.length()>12)p.vel.set(0,0,0)});
 ball.position.set(lerp(a.b[0],b.b[0],k),lerp(a.b[1],b.b[1],k),lerp(a.b[2],b.b[2],k));bv.set((ball.position.x-(guestUpdate.px??ball.position.x))/Math.max(dt,.001),0,(ball.position.z-(guestUpdate.pz??ball.position.z))/Math.max(dt,.001));guestUpdate.px=ball.position.x;guestUpdate.pz=ball.position.z;
 owner=b.o>=0?players[b.o]:null;score=b.s;time=b.t;half=b.h;S.mode=MODEN[b.m];hud();
 // labels / controllers
 const key=b.c.join(',');if(key!==guestUpdate.key){guestUpdate.key=key;H=H.length?H:[];players.forEach((p,i)=>{if(p.isRef)return;const idx=b.c[i];if(idx>=0&&ASSIGN[idx]){setLabel(p,'name',nameOf(ASSIGN[idx][0]),p.team)}else setLabel(p,'num',p.num,p.team);const isMine=idx>=0&&mine&&mine.idx===idx;p.ring.visible=isMine;if(isMine)mine.p=p})}}
/* camera */
function camUpdate(dt){const focus=V();
 if(!playing&&(S.mode==='lobby'||!gSnap)){orbit+=dt*.07;camera.position.set(Math.cos(orbit)*30,13,Math.sin(orbit)*22);camLook.set(0,1.5,0);camera.lookAt(camLook);key.position.set(-20,46,26);key.target.position.set(0,0,0);return}
 const bp=ball.position;let mp=mine&&mine.p;if(S.mode==='goal'&&S.scorer)focus.set(S.scorer.pos.x*.7+bp.x*.3,0,S.scorer.pos.z*.7+bp.z*.3);else if(mp)focus.set(mp.pos.x*.5+bp.x*.5,0,mp.pos.z*.5+bp.z*.5);else focus.set(bp.x,0,bp.z);
 focus.x=cl(focus.x,-PX-2,PX+2);focus.z=cl(focus.z,-PZ,PZ);const sgn=myTeam?-1:1,asp=camera.aspect,H0=asp<1?20:14.5,D0=asp<1?26:19.5;
 const tx=focus.x,ty=H0,tz=focus.z+sgn*D0,k=1-Math.exp(-dt*(S.mode==='goal'?1.6:3.4));camera.position.x+=(tx-camera.position.x)*k;camera.position.y+=(ty-camera.position.y)*k;camera.position.z+=(tz-camera.position.z)*k;camLook.x+=(focus.x-camLook.x)*k;camLook.z+=(focus.z-camLook.z)*k;camLook.y=.8;camera.lookAt(camLook);
 key.position.set(focus.x-18,46,focus.z+24);key.target.position.set(focus.x,0,focus.z);key.target.updateMatrixWorld()}
/* lobby */
function lobbyList(){return Borego.players&&Borego.players.length?Borego.players.slice(0,4):[{id:Borego.me,name:'You',seat:1}]}
function drawLobby(){if(playing)return;const L=lobbyList(),n=L.length,a=assign(L),nm={};L.forEach(p=>nm[p.id]=p.name||'Player');
 $('lobmode').textContent=n===1?'1 PLAYER · YOU VS COMPUTER':n===2?'2 PLAYERS · 1 VS 1':n===3?'3 PLAYERS · 2 VS 2 (COMPUTER FILLS ONE SPOT)':'4 PLAYERS · 2 VS 2';
 const bN=a.filter(x=>x[1]==='b').map(x=>nm[x[0]]),rN=a.filter(x=>x[1]==='r').map(x=>nm[x[0]]);if(n===1||n===3)rN.push('Computer');if(bN.length<2)bN.push('Computer team-mates');if(rN.length<2&&n!==1&&n!==3)rN.push('Computer team-mates');
 $('lobteams').replaceChildren(...[['BOREGO FC',bN],['RIVALS',rN]].map(([h,l])=>{const d=document.createElement('div'),b=document.createElement('b'),s=document.createElement('span');b.textContent=h;s.textContent=l.join(', ');d.append(b,s);return d}));
 const host=Borego.isHost||n===1;$('create').classList.toggle('hidden',!host||!ready);$('create').textContent=n===1?'KICK OFF vs COMPUTER':'KICK OFF';
 $('status').textContent=!ready?'Loading players and stadium…':n===1?'Playing alone against the computer. To play with friends, start Football from a chat.':host?'Press KICK OFF when everyone is ready.':'Waiting for the host to kick off…'}
let ready=false;
function kickoff(){if(playing||!ready)return;ac();const L=lobbyList(),n=L.length;side='host';solo=n===1;online=!solo;$('net').textContent=solo?'VS COMPUTER':n+' PLAYERS';setupControllers(assign(L));playing=true;$('lobby').classList.add('hidden');time=0;half=1;score=[0,0];hud();setDead('kickoff',0,0,0,true);startCrowd();chantT=6}
function wireBorego(){Borego.on('message',netMsg);
 Borego.on('ready',()=>{if(Borego.spectator){side='guest';$('status').textContent='You are watching. Players are in the match.';return}const n=lobbyList().length;side=(Borego.isHost||n===1)?'host':'guest';online=n>1;drawLobby()});
 Borego.on('players',()=>{if(playing){if(side==='host'){H.forEach(c=>{if(!c.ai&&!(Borego.players||[]).some(p=>p.id===c.id)){c.ai=true;c.p.ctl=-1}});refreshLabels()}return}const n=lobbyList().length;side=(Borego.isHost||n===1)?'host':'guest';online=n>1;drawLobby()})}
/* loop */
function qualityDown(){if(Q<=0||qDrops>2)return;Q--;qDrops++;renderer.setPixelRatio(Q>1?Math.min(devicePixelRatio,1.5):Math.min(devicePixelRatio,1));renderer.setSize(innerWidth,innerHeight);if(Q<1){renderer.shadowMap.enabled=false;key.castShadow=false;scene.traverse(o=>{if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true)}})}crowdMats.forEach(im=>{im.count=Math.floor(im.count*.55)});fpsE=.016;fpsT=0}
function frame(t){requestAnimationFrame(frame);if(!renderer)return;let dt=Math.min(.05,(t-last)/1000||.016);last=t;
 fpsE+=(dt-fpsE)*.05;fpsT+=dt;if(fpsT>5&&fpsE>1/27&&document.visibilityState==='visible'){qualityDown();fpsT=0}
 if(side==='host'&&S.mode!=='lobby'){acc+=dt;let n=0;while(acc>=1/60&&n<4){simStep(1/60);acc-=1/60;n++}if(n===4)acc=0;
  sendT+=dt;if(online&&sendT>=.066){sendT=0;send('st',snapshot())}}
 else if(side==='guest'&&playing){guestUpdate(dt);inT+=dt;const i=input,k=[Math.round(i.x*20),Math.round(i.z*20),i.sprint?1:0].join(),fl=i.pass||i.lob||i.tackle||i.shoot>0||i.sw;if(fl||(k!==lastIn&&inT>.05)||inT>.4){inT=0;lastIn=k;send('in',{x:r2(i.x),z:r2(i.z),sprint:i.sprint,pass:i.pass,lob:i.lob,tackle:i.tackle,shoot:i.shoot,sw:i.sw});i.pass=i.lob=i.tackle=i.sw=false;i.shoot=0}}
 for(const p of players)animate(p,dt);
 // ball visuals
 const sp=Math.hypot(bv.x,bv.z);if(sp>.05){ball.rotateOnWorldAxis(V(bv.z,0,-bv.x).normalize(),sp*dt/BR)}
 ballBlob.position.set(ball.position.x,.04,ball.position.z);const hs=Math.max(.5,1+ball.position.y*.25);ballBlob.scale.set(hs*.6,hs*.6,1);ballBlob.material.opacity=Math.max(.2,.9-ball.position.y*.15);
 crowdUni.uT.value+=dt;crowdUni.uE.value=exc;crowdTick(dt);
 camUpdate(dt);renderer.render(scene,camera)}
/* input */
let shootAt=0;const pwr=()=>$('pwr');
function shootStart(){if(!shootAt){shootAt=performance.now();if(pwr())pwr().classList.add('on')}}
function shootEnd(){if(shootAt){const h=(performance.now()-shootAt)/750;input.shoot=cl(h,.25,1);shootAt=0;if(pwr()){pwr().classList.remove('on');pwr().firstChild.style.width='0'}}}
setInterval(()=>{if(shootAt&&pwr()){pwr().firstChild.style.width=Math.round(cl((performance.now()-shootAt)/750,0,1)*100)+'%'}},40);
function wireUI(){const B=(id,down,up)=>{const e=$(id);e.addEventListener('pointerdown',ev=>{ev.preventDefault();ac();down&&down()});if(up){e.addEventListener('pointerup',up);e.addEventListener('pointerleave',up);e.addEventListener('pointercancel',up)}};
 B('pass',()=>input.pass=true);B('lob',()=>input.lob=true);B('shoot',shootStart,shootEnd);B('tackle',()=>input.tackle=true);B('switch',()=>{input.sw=true;input.swT=performance.now()});B('sprint',()=>input.sprint=true,()=>input.sprint=false);
 $('sound').onclick=()=>{sndOn=!sndOn;$('sound').textContent=sndOn?'SOUND ON':'SOUND OFF';if(!sndOn)stopCrowd();else{ac();if(playing)startCrowd()}};
 const keys={};const kd=()=>{input.x=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);input.z=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);input.sprint=!!keys.shift};
 addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(e.repeat)return;keys[k]=true;ac();kd();if(k==='j')input.pass=true;if(k==='l')input.lob=true;if(k==='k')shootStart();if(k==='h'||k==='x')input.tackle=true;if(k==='q'||k==='tab'){input.sw=true;input.swT=performance.now();e.preventDefault()}});
 addEventListener('keyup',e=>{const k=e.key.toLowerCase();keys[k]=false;kd();if(k==='k')shootEnd()});
 const stick=$('stick'),knob=$('knob');let tp=null;function mv(e){const r=stick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,m=r.width*.35,k=Math.min(1,m/(Math.hypot(dx,dy)||1)),x=dx*k,y=dy*k;knob.style.left='calc(50% + '+x+'px)';knob.style.top='calc(50% + '+y+'px)';input.x=cl(x/m,-1,1);input.z=cl(y/m,-1,1)}
 stick.onpointerdown=e=>{tp=e.pointerId;stick.setPointerCapture(tp);ac();mv(e)};stick.onpointermove=e=>{if(e.pointerId===tp)mv(e)};const up=e=>{if(e.pointerId===tp){tp=null;input.x=input.z=0;knob.style.left='50%';knob.style.top='50%'}};stick.onpointerup=up;stick.onpointercancel=up;
 $('create').onclick=kickoff;document.addEventListener('pointerdown',()=>{ac();if(playing)startCrowd()},{passive:true})}

/* ---------- LIVE REACTIONS + MESSAGES + LANDSCAPE ---------- */
const EMO=['😂','😡','👏','😮','🔥','😭','👎','🎉'],QUICK=['Nice one!','Pass it!','Unlucky','Foul!!','Come on!','GG'];
let rxLast=0,rxSeq=0;
function cleanTxt(t){return String(t||'').replace(/[<>]/g,'').replace(/\s+/g,' ').trim().slice(0,60)}
function showRx(from,p){if(!p||typeof p!=='object')return;const name=from?nameOf(from):(Borego.myName||'You');
 if(p.k==='emoji'&&EMO.indexOf(p.v)>=0){const e=document.createElement('div');e.className='rxfly';e.textContent=p.v;e.style.left=(8+Math.random()*34)+'%';const n=document.createElement('small');n.textContent=name;e.appendChild(n);$('rxfloat').appendChild(e);setTimeout(()=>e.remove(),3600);feedAdd(name,p.v,true)}
 else if(p.k==='msg'){const t=cleanTxt(p.v);if(t)feedAdd(name,t,false)}}
function feedAdd(name,txt,emo){const f=$('rxfeed'),d=document.createElement('div');d.className='rxmsg';const b=document.createElement('b');b.textContent=name;const s=document.createElement('span');s.textContent=' '+txt;if(emo)s.style.fontSize='16px';d.appendChild(b);d.appendChild(s);f.appendChild(d);while(f.children.length>5)f.firstChild.remove();setTimeout(()=>{d.classList.add('out');setTimeout(()=>d.remove(),600)},7000)}
function sendRx(p){const n=performance.now();if(n-rxLast<700)return;rxLast=n;showRx(null,p);if(online)send('rx',p)}
function wireSocial(){const bar=$('rxbar');EMO.forEach(e=>{const b=document.createElement('button');b.textContent=e;b.onclick=()=>{sendRx({k:'emoji',v:e});$('rxpanel').classList.add('hidden')};bar.appendChild(b)});
 const q=$('rxquick');QUICK.forEach(t=>{const b=document.createElement('button');b.textContent=t;b.onclick=()=>{sendRx({k:'msg',v:t});$('rxpanel').classList.add('hidden')};q.appendChild(b)});
 $('rxtoggle').onclick=()=>{$('rxpanel').classList.toggle('hidden')};
 const go=()=>{const i=$('rxinput'),t=cleanTxt(i.value);if(t){sendRx({k:'msg',v:t});i.value='';$('rxpanel').classList.add('hidden')}};$('rxsend').onclick=go;$('rxinput').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')go()});$('rxinput').addEventListener('keyup',e=>e.stopPropagation());
 // landscape
 const port=()=>innerHeight>innerWidth*1.05;let dismissed=false;
 const upd=()=>{$('rotate').classList.toggle('hidden',!port()||dismissed);resizeAll()};
 const lock=()=>{try{const so=screen.orientation;if(so&&so.lock){const go2=()=>so.lock('landscape').catch(()=>{});if(!document.fullscreenElement&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().then(go2).catch(go2);else go2()}}catch(e){}};
 $('rotlock').onclick=()=>{lock();setTimeout(upd,400)};$('rotskip').onclick=()=>{dismissed=true;upd()};
 addEventListener('orientationchange',()=>setTimeout(upd,250));addEventListener('resize',upd);document.addEventListener('pointerdown',()=>{if(port()&&!dismissed)lock()},{once:true,passive:true});
 if(window.visualViewport)visualViewport.addEventListener('resize',upd);upd()}
function resizeAll(){if(!renderer)return;camera.aspect=innerWidth/innerHeight;camera.fov=camera.aspect<1?58:42;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}
/* boot */
async function boot(){
 try{initRender();ballBlob=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:blobTexForBall(),transparent:true,depthWrite:false,opacity:.8}));ballBlob.rotation.x=-Math.PI/2;ballBlob.renderOrder=1;scene.add(ballBlob);
  await Promise.race([loadAssets(),new Promise(r=>setTimeout(r,25000))]);
  for(let t=0;t<2;t++)for(let s=0;s<NP;s++){const p=mkPlayer(t,s);players.push(p);(t?redP:blueP).push(p)}
  ref=mkPlayer(0,0,true);ref.num=0;ref.home.set(0,0,10);ref.pos.set(-4,0,10);players.push(ref);
  H=[];refreshLabels();ball.position.set(0,BR,0);ready=true;$('loading').remove();wireUI();wireSocial();wireBorego();requestAnimationFrame(frame);if(Borego.ready)drawLobby()}
 catch(e){$('loading').textContent='Could not load the 3D game. Please update your browser.';console.error(e)}}
function blobTexForBall(){return BLOB||(BLOB=blobTex())}
window.__fb={get S(){return S},players,get H(){return H},ball:()=>ball,simStep,kickoff,score:()=>score,setDead,doTackle,get time(){return time},input,assign,hud};
boot();
})();
