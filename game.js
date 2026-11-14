(()=>{'use strict';
const $=x=>document.getElementById(x),V=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z),cl=(n,a,b)=>Math.max(a,Math.min(b,n));let scene,camera,renderer,ball,players=[],blue=[],red=[],me,channel,side='host',online=false,playing=false,room='',time=0,half=1,score=[0,0],last=0,sendClock=0,remote={x:0,z:0,sprint:false,pass:false,shoot:false,lob:false,tackle:false},input={x:0,z:0,sprint:false,pass:false,shoot:false,lob:false,tackle:false},audio,deadBall=false,lastTouch='b',restartKind='',restartSpot=V(),yellow={b:0,r:0},redCards={b:0,r:0},offsideLine=0,cardFlash=0;
const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.8});
let soundEnabled=true,crowdOsc=[],crowdGain=null;
function tone(freq,dur,wave='sine',vol=.045,delay=0){try{if(!soundEnabled)return;audio||=new (window.AudioContext||window.webkitAudioContext)();let o=audio.createOscillator(),g=audio.createGain();o.type=wave;o.frequency.setValueAtTime(freq,audio.currentTime+delay);g.gain.setValueAtTime(.0001,audio.currentTime+delay);g.gain.exponentialRampToValueAtTime(vol,audio.currentTime+delay+.015);g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+delay+dur);o.connect(g);g.connect(audio.destination);o.start(audio.currentTime+delay);o.stop(audio.currentTime+delay+dur+.03)}catch(e){}}
function noiseBurst(dur=.18,vol=.025,filter=900){try{if(!soundEnabled)return;audio||=new (window.AudioContext||window.webkitAudioContext)();let n=Math.floor(audio.sampleRate*dur),b=audio.createBuffer(1,n,audio.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);let src=audio.createBufferSource(),f=audio.createBiquadFilter(),g=audio.createGain();src.buffer=b;f.type='lowpass';f.frequency.value=filter;g.gain.value=vol;src.connect(f);f.connect(g);g.connect(audio.destination);src.start()}catch(e){}}
function sfx(name){if(!soundEnabled)return;
 if(name==='kick'){noiseBurst(.09,.045,1500);tone(115,.08,'triangle',.025)}
 if(name==='pass'){noiseBurst(.06,.025,1800);tone(420,.07,'sine',.025)}
 if(name==='lob'){noiseBurst(.1,.04,1300);tone(220,.14,'triangle',.03)}
 if(name==='tackle'){noiseBurst(.22,.055,650);tone(95,.16,'sawtooth',.025)}
 if(name==='whistle'){tone(2100,.24,'sine',.045);tone(2350,.2,'sine',.035,.25)}
 if(name==='goal'){tone(523,.22,'triangle',.055);tone(659,.22,'triangle',.055,.18);tone(784,.35,'triangle',.06,.36);tone(1046,.55,'triangle',.06,.62);noiseBurst(.65,.04,700)}
 if(name==='save'){noiseBurst(.15,.045,800);tone(620,.16,'sine',.04)}
 if(name==='half'){tone(1600,.2,'sine',.05);tone(1900,.2,'sine',.05,.24);tone(1600,.3,'sine',.05,.48)}
 if(name==='full'){tone(1900,.24,'sine',.055);tone(2200,.24,'sine',.055,.28);tone(1900,.4,'sine',.055,.56)}
 if(name==='crowd'){noiseBurst(.9,.012,450)}
}
function beep(f=400,d=.12){tone(f,d,'triangle',.035)}
function startCrowd(){if(!soundEnabled||crowdGain)return;try{audio||=new (window.AudioContext||window.webkitAudioContext)();let o=audio.createOscillator(),g=audio.createGain(),f=audio.createBiquadFilter();o.type='sawtooth';o.frequency.value=58;f.type='lowpass';f.frequency.value=125;g.gain.value=.006;o.connect(f);f.connect(g);g.connect(audio.destination);o.start();crowdOsc=[o];crowdGain=g}catch(e){}}
function stopCrowd(){try{crowdOsc.forEach(o=>o.stop());crowdOsc=[];crowdGain=null}catch(e){}}
function say(t){$('notice').textContent=t;$('notice').classList.add('show');setTimeout(()=>$('notice').classList.remove('show'),1500)}
function line(x,z,X,Z){let d=Math.hypot(X-x,Z-z),m=new THREE.Mesh(new THREE.BoxGeometry(d,.05,.05),new THREE.MeshBasicMaterial({color:0xffffff}));m.position.set((x+X)/2,.03,(z+Z)/2);m.rotation.y=-Math.atan2(Z-z,X-x);scene.add(m)}
function pitch(){let g=new THREE.Mesh(new THREE.PlaneGeometry(70,46),mat(0x167b40));g.rotation.x=-Math.PI/2;g.position.y=-.06;scene.add(g);for(let i=0;i<10;i++){let s=new THREE.Mesh(new THREE.PlaneGeometry(7,46),mat(i%2?0x167b40:0x1b8747));s.rotation.x=-Math.PI/2;s.position.set(-31.5+i*7,-.03,0);scene.add(s)}line(-35,-23,35,-23);line(-35,23,35,23);line(-35,-23,-35,23);line(35,-23,35,23);line(0,-23,0,23);let c=new THREE.Mesh(new THREE.RingGeometry(8.9,9,.1,80),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}));c.rotation.x=-Math.PI/2;c.position.y=.02;scene.add(c);for(let s of [-1,1]){let x=s*28;line(s*35,-9,x,-9);line(x,-9,x,9);line(x,9,s*35,9);for(let z of [-3.7,3.7]){let p=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,2.5,8),mat(0xffffff));p.position.set(s*35,1.25,z);scene.add(p)}let b=new THREE.Mesh(new THREE.BoxGeometry(.15,.15,7.4),mat(0xffffff));b.position.set(s*35,2.5,0);scene.add(b)}for(let s of [-1,1]){let st=new THREE.Mesh(new THREE.BoxGeometry(76,4,7),mat(0x263e46));st.position.set(0,2,s*27);scene.add(st)}}
function add(team,n,x,z){let g=new THREE.Group(),shirt=mat(team==='b'?0x1687e8:0xe34242),short=mat(team==='b'?0x12366e:0x792020),skin=mat(0xb87953);let torso=new THREE.Mesh(new THREE.CapsuleGeometry(.43,.72,4,8),shirt);torso.position.y=1.5;g.add(torso);let head=new THREE.Mesh(new THREE.SphereGeometry(.25,12,10),skin);head.position.y=2.28;g.add(head);let pants=new THREE.Mesh(new THREE.BoxGeometry(.66,.38,.44),short);pants.position.y=.92;g.add(pants);for(let s of [-1,1]){let l=new THREE.Mesh(new THREE.CylinderGeometry(.1,.13,.68,8),mat(team==='b'?0x91d1ff:0xffaaa5));l.position.set(s*.18,.42,0);g.add(l)}let ring=new THREE.Mesh(new THREE.RingGeometry(.48,.6,20),new THREE.MeshBasicMaterial({color:0xfff17a,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;ring.visible=false;g.add(ring);scene.add(g);let p={team,n,g,pos:g.position,home:V(x,0,z),ring,st:100};players.push(p);(team==='b'?blue:red).push(p);return p}
function init(){scene=new THREE.Scene();scene.background=new THREE.Color(0x88b9d1);scene.fog=new THREE.Fog(0x88b9d1,85,160);camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,220);camera.position.set(0,50,55);renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);$('game').insertBefore(renderer.domElement,$('hud'));scene.add(new THREE.HemisphereLight(0xe4f6ff,0x244b2e,2));let sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(-20,50,20);scene.add(sun);pitch();for(let i=0;i<11;i++){let x,z;if(!i){x=-31;z=0}else if(i<5){x=-20;z=(i-2.5)*7}else if(i<8){x=-7;z=(i-6)*10}else{x=9;z=(i-9)*10}add('b',i,x,z);add('r',i,-x,-z)}me=blue[9];me.ring.visible=true;ball=new THREE.Mesh(new THREE.SphereGeometry(.37,20,16),mat(0xf5f3e9));ball.position.set(0,.4,0);scene.add(ball)}
function nearest(team,pos){return team.filter(p=>p.n>0).sort((a,b)=>a.pos.distanceToSquared(pos)-b.pos.distanceToSquared(pos))[0]}function move(p,inp,dt){let v=V(inp.x,0,inp.z);if(v.length()>1)v.normalize();p.pos.addScaledVector(v,(inp.sprint&&p.st>0?9:5.8)*dt);p.st=cl(p.st+(inp.sprint?-22:8)*dt,0,100);p.pos.x=cl(p.pos.x,-33,33);p.pos.z=cl(p.pos.z,-21,21);if(v.length()>.1)p.g.rotation.y=Math.atan2(v.x,v.z)}function auto(p,t,dt){let v=V(t.x-p.pos.x,0,t.z-p.pos.z);if(v.length()>.4){v.normalize();p.pos.addScaledVector(v,dt*4);p.g.rotation.y=Math.atan2(v.x,v.z)}}function ai(dt){
 const keeperB=blue[0],keeperR=red[0],hs=new Set(H.map(c=>c.p)),nb=nearest(blue.filter(p=>!hs.has(p)),ball.position),nr=nearest(red.filter(p=>!hs.has(p)),ball.position);
 for(let p of blue)if(!hs.has(p)&&p.n){let target=p.home;if(p===nb)target=ball.position;else if(p.n>=8&&ball.position.x>4)target=V(p.home.x+5,p.home.y,p.home.z*.7);auto(p,target,dt)}
 for(let p of red)if(!hs.has(p)&&p.n){let target=p.home;if(p===nr)target=ball.position;else if(p.n>=8&&ball.position.x< -4)target=V(p.home.x-5,p.home.y,p.home.z*.7);auto(p,target,dt)}
 autoKeeper(keeperB,-32,dt);autoKeeper(keeperR,32,dt);
}
function autoKeeper(p,x,dt){let tx=x, tz=cl(ball.position.z*.34,-4.2,4.2);if(Math.abs(ball.position.x-x)<13){tx=x+(ball.position.x-x)*.12;tz=cl(ball.position.z*.58,-5.5,5.5)}auto(p,V(tx,0,tz),dt)}
function tacklePlayer(p,opponents){
 let target=opponents.filter(q=>q.pos.distanceTo(p.pos)<1.85).sort((a,b)=>a.pos.distanceToSquared(p.pos)-b.pos.distanceToSquared(p.pos))[0];
 if(!target)return false;
 let ballOwner=target.pos.distanceTo(ball.position)<1.55;
 if(ballOwner){let v=V(p.pos.x-target.pos.x,0,p.pos.z-target.pos.z).normalize();ball.position.copy(target.pos).add(V(0,.55,0));ball.userData.v=v.multiplyScalar(8);lastTouch=p.team;sfx('tackle');say('CLEAN TACKLE');return true}
 return false;
}
function restart(kind,x,z,team){deadBall=true;restartKind=kind;restartSpot.set(cl(x,-34,34),.42,cl(z,-22,22));lastTouch=team;ball.position.copy(restartSpot);ball.userData.v=V();say(kind.toUpperCase(),1900);sfx('whistle')}
function restartKick(p){deadBall=false;let forward=p.team==='b'?1:-1;ball.position.copy(p.pos).add(V(0,.8,0));ball.userData.v=V(forward*13,2,0);lastTouch=p.team;sfx('kick');say('PLAY ON')}
function kick(p,power,forward,loft=false,inp=input){
 let team=p.team==='b'?blue:red,opponents=p.team==='b'?red:blue;
 let d;
 if(power<20){let candidates=team.filter(q=>q!==p&&q.n>0).sort((a,b)=>a.pos.distanceToSquared(p.pos)-b.pos.distanceToSquared(p.pos));let target=candidates.find(q=>(q.pos.x-p.pos.x)*forward>0)||candidates[0];d=target?target.pos.clone().sub(p.pos):V(forward,0,0)}
 else d=V(forward,0,cl(inp.z*.42,-.55,.55));
 d.y=0;d.normalize();ball.position.copy(p.pos).add(V(0,1,0));ball.userData.v=d.multiplyScalar(power);ball.userData.v.y=loft?7:(power>20?4:1);lastTouch=p.team;sfx(loft?'lob':power<20?'pass':'kick')
}function reset(){for(let p of players)p.pos.copy(p.home);ball.position.set(0,.4,0);ball.userData.v=V();me=mine?mine.p:blue[9];players.forEach(p=>p.ring.visible=p===me)}
function resetPlayersOnly(){for(let p of players)p.pos.copy(p.home);me=mine?mine.p:blue[9];players.forEach(p=>p.ring.visible=p===me)}function snapshot(){return{dead:deadBall,rk:restartKind,spot:[restartSpot.x,restartSpot.y,restartSpot.z],p:players.map(p=>[p.pos.x,p.pos.z,p.g.rotation.y,p.st]),b:[ball.position.x,ball.position.y,ball.position.z,ball.userData.v?.x||0,ball.userData.v?.y||0,ball.userData.v?.z||0],s:score,t:time,h:half}}function apply(s){if(!s?.p||s.p.length!==22)return;deadBall=!!s.dead;restartKind=s.rk||'';if(s.spot)restartSpot.set(...s.spot);s.p.forEach((a,i)=>{players[i].pos.set(a[0],0,a[1]);players[i].g.rotation.y=a[2];players[i].st=a[3]});ball.position.set(...s.b.slice(0,3));ball.userData.v=V(...s.b.slice(3));score=s.s;time=s.t;half=s.h;$('hs').textContent=score[0];$('as').textContent=score[1];$('time').textContent=String(Math.floor(time/60)).padStart(2,'0')+':'+String(Math.floor(time%60)).padStart(2,'0')}
function goal(team){score[team==='b'?0:1]++;$('hs').textContent=score[0];$('as').textContent=score[1];say('GOOOOAL!',2400);sfx('goal');deadBall=true;restartKind='kickoff';restartSpot.set(0,.42,0);ball.position.copy(restartSpot);ball.userData.v=V();resetPlayersOnly();deadBall=true}function physics(dt){
 if(deadBall){ball.position.lerp(restartSpot,.12);return}
 let v=ball.userData.v||V(),old=ball.position.clone();ball.position.addScaledVector(v,dt);v.y-=9.8*dt;
 if(ball.position.y<.4){ball.position.y=.4;v.y=Math.abs(v.y)*.38;if(Math.abs(v.y)<.6)v.y=0}
 v.multiplyScalar(Math.pow(.987,dt*60));
 let touch=players.filter(p=>p.pos.distanceTo(ball.position)<1.05&&ball.position.y<1.25).sort((a,b)=>a.pos.distanceToSquared(ball.position)-b.pos.distanceToSquared(ball.position))[0];
 if(touch&&v.length()<15){ball.position.copy(touch.pos).add(V(touch.team==='b'?.7:-.7,.42,0));v.set(0,0,0);lastTouch=touch.team}
 if(ball.position.x>35&&Math.abs(ball.position.z)<3.8){goal('b');return}
 if(ball.position.x< -35&&Math.abs(ball.position.z)<3.8){goal('r');return}
 if(Math.abs(ball.position.z)>22){let z=cl(ball.position.z,-22,22),x=cl(ball.position.x,-34,34);restart('throw-in',x,z,lastTouch==='b'?'r':'b');return}
 if(ball.position.x>35||ball.position.x< -35){let x=cl(ball.position.x,-34,34);if(lastTouch==='b')restart(ball.position.x>0?'goal-kick':'corner',x,ball.position.z,lastTouch==='b'?'r':'b');else restart(ball.position.x<0?'goal-kick':'corner',x,ball.position.z,lastTouch==='r'?'b':'r');return}
}
let solo=false,helloT=null,inT=0,lastIn='',snapN=0,H=[],mine=null,myTeam='b',ASSIGN=[],names={};
const fresh=()=>({x:0,z:0,sprint:false,pass:false,shoot:false,lob:false,tackle:false});
function assign(L){const n=Math.min(4,L.length),id=i=>L[i].id;
 if(n<=1)return[[id(0),'b',9]];
 if(n===2)return[[id(0),'b',9],[id(1),'r',9]];
 if(n===3)return[[id(0),'b',9],[id(1),'b',8],[id(2),'r',9]];
 return[[id(0),'b',9],[id(1),'b',8],[id(2),'r',9],[id(3),'r',8]]}
function setupControllers(a){ASSIGN=a;H=a.map(x=>({id:x[0],team:x[1],p:(x[1]==='b'?blue:red)[x[2]],inp:x[0]===Borego.me?input:fresh(),ai:false}));
 if(a.length===1)H.push({id:'cpu',team:'r',p:red[9],inp:fresh(),ai:true});
 mine=H.find(c=>c.id===Borego.me)||null;if(mine){me=mine.p;myTeam=mine.team}players.forEach(p=>p.ring.visible=p===me)}
function aiControl(c,dt){const p=c.p,fw=c.team==='b'?1:-1,i=c.inp,dx=ball.position.x-p.pos.x,dz=ball.position.z-p.pos.z,l=Math.hypot(dx,dz);i.x=l>1?dx/l*.85:0;i.z=l>1?dz/l*.85:0;i.sprint=false;c.t=(c.t||0)-dt;if(l<1.8&&c.t<=0){c.t=.8+Math.random()*.7;if(p.pos.x*fw>14)i.shoot=true;else i.pass=true}}
function send(ev,payload){if(channel&&online)try{Borego.send({e:ev,p:payload})}catch(e){console.warn(e)}}
function netMsg(m,from){if(!m||!m.e)return;const ev=m.e,payload=m.p;
 if(ev==='input'){if(side==='host'&&payload){const c=H.find(x=>x.id===from&&!x.ai);if(c){c.inp.x=+payload.x||0;c.inp.z=+payload.z||0;c.inp.sprint=!!payload.sprint;for(const k of['pass','shoot','lob','tackle'])c.inp[k]=c.inp[k]||!!payload[k]}}}
 else if(ev==='state'){if(side==='guest'&&payload){if(payload.a&&!mine)setupControllers(payload.a);apply(payload);if(!playing){playing=true;$('lobby').classList.add('hidden');say('MATCH STARTED')}}}
 else if(ev==='finish'){if(payload){$('final').textContent=payload.join(' — ');$('end').classList.remove('hidden');playing=false}}}
function lobbyList(){return Borego.players.length?Borego.players.slice(0,4):[{id:Borego.me,name:'You',seat:1}]}
function drawLobby(){if(playing)return;const L=lobbyList(),n=L.length,a=assign(L),nm={};L.forEach(p=>nm[p.id]=p.name||'Player');
 const t=n===1?'1 PLAYER · YOU VS COMPUTER':n===2?'2 PLAYERS · 1 VS 1':n===3?'3 PLAYERS · 2 VS 2 (COMPUTER FILLS ONE SPOT)':'4 PLAYERS · 2 VS 2';$('lobmode').textContent=t;
 const blueN=a.filter(x=>x[1]==='b').map(x=>nm[x[0]]),redN=a.filter(x=>x[1]==='r').map(x=>nm[x[0]]);if(n===1||n===3)redN.push('Computer');
 $('lobteams').replaceChildren(...[['BOREGO FC',blueN],['RIVALS',redN]].map(([h,l])=>{const d=document.createElement('div');const b=document.createElement('b');b.textContent=h;const s=document.createElement('span');s.textContent=l.join(', ');d.append(b,s);return d}));
 const host=Borego.isHost||n===1;$('create').classList.toggle('hidden',!host);$('create').textContent=n===1?'KICK OFF vs COMPUTER':'KICK OFF';
 $('status').textContent=n===1?'Playing alone. Want a real match? Start Football from a chat to invite friends.':host?'Press KICK OFF when everyone is ready.':'Waiting for the host to kick off…'}
function kickoff(){if(playing)return;const L=lobbyList(),n=L.length;side='host';solo=n===1;online=!solo;channel=solo?{}:{};$('net').textContent=solo?'VS COMPUTER':Math.min(4,n)+' PLAYERS';$('switch').style.display=solo?'':'none';setupControllers(assign(L));start()}
function wireBorego(){Borego.on('message',netMsg);
 Borego.on('ready',()=>{if(Borego.spectator){$('status').textContent='You are watching. Players are in the match.';return}
  const n=lobbyList().length;side=(Borego.isHost||n===1)?'host':'guest';online=n>1;channel=n>1?{}:null;if(side==='guest')$('switch').style.display='none';drawLobby()});
 Borego.on('players',()=>{if(playing){if(side==='host')H.forEach(c=>{if(!c.ai&&!Borego.players.some(p=>p.id===c.id))c.ai=true});return}const n=lobbyList().length;side=(Borego.isHost||n===1)?'host':'guest';online=n>1;drawLobby()})}
function start(){if(side!=='host'||playing)return;playing=true;$('lobby').classList.add('hidden');reset();deadBall=false;startCrowd();say('KICK OFF');sfx('whistle')}function finish(){playing=false;sfx('full');stopCrowd();let r=[...score];send('finish',r);$('final').textContent=r.join(' — ');$('end').classList.remove('hidden')}
function update(dt){if(!playing)return;if(side==='host'){time+=dt*5;if(time>=45*60){if(half===1){half=2;time=45*60;reset();say('HALF TIME');sfx('half')}else{finish();return}}for(const c of H){if(c.ai)aiControl(c,dt);move(c.p,c.inp,dt)}
 if(deadBall){for(const c of H){const i=c.inp;if(i.pass||i.shoot||i.lob){i.pass=i.shoot=i.lob=false;restartKick(c.p)}}}
 else{for(const c of H){const i=c.inp,fw=c.team==='b'?1:-1,opp=c.team==='b'?red:blue;
  if(i.tackle){i.tackle=false;tacklePlayer(c.p,opp)}
  if(i.pass){i.pass=false;kick(c.p,16,fw,false,i)}
  if(i.shoot){i.shoot=false;kick(c.p,25,fw,false,i)}
  if(i.lob){i.lob=false;kick(c.p,20,fw,true,i)}}}
 ai(dt);physics(dt);sendClock+=dt;if(sendClock>.08){sendClock=0;const sn=snapshot();if(snapN++<40||snapN%25===0)sn.a=ASSIGN;send('state',sn)}$('time').textContent=String(Math.floor(time/60)).padStart(2,'0')+':'+String(Math.floor(time%60)).padStart(2,'0')}else if(side==='guest'&&mine){inT+=dt;const f=myTeam==='r'?-1:1,k=[Math.round(input.x*f*20),Math.round(input.z*f*20),input.sprint?1:0].join(),fl=input.pass||input.shoot||input.lob||input.tackle;if(fl||(k!==lastIn&&inT>.08)||inT>.5){inT=0;lastIn=k;send('input',{x:input.x*f,z:input.z*f,sprint:input.sprint,pass:input.pass,shoot:input.shoot,lob:input.lob,tackle:input.tackle});input.pass=input.shoot=input.lob=input.tackle=false}}let target=V(me.pos.x,49,me.pos.z+(myTeam==='r'?-38:38));camera.position.lerp(target,.06);camera.lookAt(me.pos.x,0,me.pos.z)}function frame(t){requestAnimationFrame(frame);let dt=Math.min(.04,(t-last)/1000||.016);last=t;if(scene){update(dt);renderer.render(scene,camera)}}
$('create').onclick=kickoff;$('pass').onpointerdown=()=>input.pass=true;$('shoot').onpointerdown=()=>input.shoot=true;$('lob').onpointerdown=()=>input.lob=true;$('tackle').onpointerdown=()=>input.tackle=true;$('sound').onclick=()=>{soundEnabled=!soundEnabled;$('sound').textContent=soundEnabled?'SOUND ON':'SOUND OFF';if(!soundEnabled)stopCrowd();else if(playing)startCrowd()};$('sprint').onpointerdown=()=>input.sprint=true;$('sprint').onpointerup=$('sprint').onpointerleave=()=>input.sprint=false;$('tackle').onpointerup=$('tackle').onpointerleave=()=>input.tackle=false;$('switch').onpointerdown=()=>{if(!solo||!mine)return;me.ring.visible=false;me=nearest(blue.filter(p=>p.n>0),ball.position)||blue[9];mine.p=me;me.ring.visible=true};let keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;input.x=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);input.z=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);input.sprint=!!keys.shift;if(e.key.toLowerCase()==='j')input.pass=true;if(e.key.toLowerCase()==='k')input.shoot=true});addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;input.x=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);input.z=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);input.sprint=!!keys.shift});let stick=$('stick'),knob=$('knob'),touch=null;function stickMove(e){let r=stick.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,m=r.width*.35,k=Math.min(1,m/(Math.hypot(dx,dy)||1)),x=dx*k,y=dy*k;knob.style.left=`calc(50% + ${x}px)`;knob.style.top=`calc(50% + ${y}px)`;input.x=cl(x/m,-1,1);input.z=cl(y/m,-1,1)}stick.onpointerdown=e=>{touch=e.pointerId;stick.setPointerCapture(touch);stickMove(e)};stick.onpointermove=e=>{if(e.pointerId===touch)stickMove(e)};function up(e){if(e.pointerId===touch){touch=null;input.x=input.z=0;knob.style.left='50%';knob.style.top='50%'}}stick.onpointerup=up;stick.onpointercancel=up;addEventListener('resize',()=>{if(camera){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}});try{init();$('loading').remove();requestAnimationFrame(frame)}catch(e){$('loading').textContent='Unable to load 3D game. Update your browser.';console.error(e)}
wireBorego();
})();