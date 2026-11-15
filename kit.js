// kit + hair helpers (shared by proto and game)
function makeKitMaterial(base,kit){
  const m=base.clone();m.userData.kit=kit;
  m.onBeforeCompile=sh=>{
    sh.uniforms.uShirt={value:new THREE.Color(kit.shirt)};sh.uniforms.uTrim={value:new THREE.Color(kit.trim)};
    sh.uniforms.uShorts={value:new THREE.Color(kit.shorts)};sh.uniforms.uSock={value:new THREE.Color(kit.sock)};sh.uniforms.uSkin={value:new THREE.Color(kit.skin)};
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vBind;').replace('#include <begin_vertex>','#include <begin_vertex>\nvBind=position;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vBind;uniform vec3 uShirt,uTrim,uShorts,uSock,uSkin;')
    .replace('#include <map_fragment>',`#include <map_fragment>
     {float y=vBind.y,ax=abs(vBind.x);float L=dot(diffuseColor.rgb,vec3(.299,.587,.114));
      vec3 skin=uSkin*(.35+1.25*L);
      float shirt=smoothstep(.955,.985,y)*(1.-smoothstep(1.51,1.54,y))*(1.-smoothstep(.45,.47,ax));
      float collar=smoothstep(1.47,1.5,y)*(1.-smoothstep(1.51,1.54,y))*(1.-smoothstep(.1,.12,ax));
      float shorts=smoothstep(.60,.63,y)*(1.-smoothstep(.955,.985,y));
      float sockM=(1.-smoothstep(.46,.49,y))*smoothstep(.115,.14,y);
      float boot=1.-smoothstep(.105,.13,y);
      float sockTop=smoothstep(.40,.42,y)*sockM;
      vec3 shirtC=mix(uShirt,uTrim,collar)*(.45+1.15*L);
      vec3 shortsC=uShorts*(.4+1.3*L);
      vec3 sockC=mix(uSock,uTrim,sockTop*.0)*(.5+1.1*L);
      vec3 c=skin;c=mix(c,shortsC,shorts);c=mix(c,shirtC,shirt);c=mix(c,sockC,sockM);c=mix(c,vec3(.04),boot);
      diffuseColor.rgb=c;}`);
  };
  m.customProgramCacheKey=()=>'kit'+kit.shirt+kit.shorts+kit.sock+kit.skin;
  return m}
// hair: attach pieces from hair.glb to the Head bone of a cloned player
function attachHair(clone,hairGltf,which,color,srcScene){
  let head=null;clone.traverse(o=>{if(o.name==='Head'&&o.isBone)head=o});if(!head||!which)return;
  srcScene.updateMatrixWorld(true);let srcHead=null;srcScene.traverse(o=>{if(o.name==='Head'&&o.isBone)srcHead=o});
  const inv=srcHead.matrixWorld.clone().invert();
  which.forEach(n=>{let node=null;hairGltf.scene.traverse(o=>{if(o.name===n)node=o});if(!node)return;
    const h=node.clone();h.material=node.material.clone();if(color!=null)h.material.color.set(color);h.matrixAutoUpdate=false;
    hairGltf.scene.updateMatrixWorld(true);h.matrix.copy(inv).multiply(node.matrixWorld);head.add(h)})}
