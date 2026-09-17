import * as T from 'three';

const centers = Array.from({length:8},(_,i)=>new T.Vector3(i%2===0 ? -3.1 : 3.1,0,-i*8));
const smooth = t=>{t=T.MathUtils.clamp(t,0,1);return t*t*(3-2*t);};
function labelMaterial(text){const c=document.createElement('canvas');c.width=256;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#755490';ctx.font='500 84px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,128,64);const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;return new T.MeshBasicMaterial({map,transparent:true,depthWrite:false});}
const mesh=(geometry,material,parent,x=0,y=0,z=0)=>{const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};

export function createJourneyWorld(host,{step=0,unlocked=0,onStation=()=>{},onReady=()=>{}}={}) {
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0xf5f1e9,1);
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
  renderer.domElement.setAttribute('aria-hidden','true');host.appendChild(renderer.domElement);
  const scene=new T.Scene();scene.fog=new T.Fog(0xf5f1e9,20,70);
  const camera=new T.PerspectiveCamera(38,1,.1,150);
  scene.add(new T.HemisphereLight(0xfff9f0,0xd6c6e4,2.4));
  const sun=new T.DirectionalLight(0xffefd8,4);sun.position.set(-7,16,10);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-18;sun.shadow.normalBias=.035;sun.shadow.bias=-.0001;scene.add(sun);scene.add(sun.target);
  const fill=new T.DirectionalLight(0xccc0ff,2);fill.position.set(8,6,-3);scene.add(fill);
  const pearl=new T.MeshPhysicalMaterial({color:0xfffcf4,roughness:.32,metalness:.08,clearcoat:.5});
  const lavender=new T.MeshPhysicalMaterial({color:0xb6a0d5,roughness:.28,metalness:.18,clearcoat:.7});
  const gold=new T.MeshPhysicalMaterial({color:0xbb863e,roughness:.25,metalness:.5,clearcoat:.5});
  const purple=new T.MeshPhysicalMaterial({color:0x76529b,roughness:.25,metalness:.18,clearcoat:1});
  const pale=new T.MeshStandardMaterial({color:0xe7dcf0,roughness:.55});
  const ground=mesh(new T.PlaneGeometry(240,240),new T.MeshStandardMaterial({color:0xf5f1e9,roughness:1}),scene,0,-.62,-28);ground.rotation.x=-Math.PI/2;ground.castShadow=false;
  const path=new T.CatmullRomCurve3(centers.map(p=>p.clone().add(new T.Vector3(0,-.18,0))),false,'catmullrom',.55);
  const tube=new T.TubeGeometry(path,500,.1,10,false);mesh(tube,pale,scene);
  const goldPath=mesh(new T.TubeGeometry(path,500,.115,10,false),purple,scene);goldPath.geometry.setDrawRange(0,0);
  const traveller=mesh(new T.SphereGeometry(.24,24,16),gold,scene);traveller.position.copy(centers[0]);
  const stations=[],clickTargets=[];
  for(let i=0;i<8;i++){
    const group=new T.Group();group.position.copy(centers[i]);scene.add(group);
    const base=mesh(new T.CylinderGeometry(2.0,2.08,.36,64),pearl,group,0,-.1,0);base.userData.station=i;clickTargets.push(base);
    const ring=mesh(new T.TorusGeometry(1.82,.048,10,64),i===step?gold:lavender,group,0,.12,0);ring.rotation.x=Math.PI/2;
    const disk=mesh(new T.CylinderGeometry(1.52,1.6,.12,64),i===step?lavender:pale,group,0,.16,0);disk.userData.station=i;clickTargets.push(disk);
    const prop=new T.Group();prop.position.y=.32;group.add(prop);
    if(i===0){
      mesh(new T.CylinderGeometry(.09,.11,2.6,16),gold,prop,-.65,1.27,0);
      const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(1.65,0);shape.lineTo(1.3,-.52);shape.lineTo(1.65,-1.05);shape.lineTo(0,-1.05);shape.closePath();
      const flag=mesh(new T.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.04,bevelThickness:.03}),purple,prop,-.57,2.5,0);flag.rotation.y=-.2;
    }else if(i===1){
      mesh(new T.SphereGeometry(.75,32,24),pearl,prop,0,1.25,0);
      for(let k=0;k<3;k++){const hoop=mesh(new T.TorusGeometry(.9,.045,8,48),k===1?gold:purple,prop,0,1.25,0);hoop.rotation.set(k===0?Math.PI/2:0,k*Math.PI/3,0);}
      mesh(new T.CylinderGeometry(.08,.1,.55,16),gold,prop,0,.4,0);
    }else if(i===2){
      const arch=mesh(new T.TorusGeometry(.72,.2,16,48,Math.PI),purple,prop,0,1.2,0);arch.rotation.z=Math.PI;
      mesh(new T.CylinderGeometry(.2,.2,.68,20),purple,prop,-.72,1.5,0);mesh(new T.CylinderGeometry(.2,.2,.68,20),purple,prop,.72,1.5,0);
      mesh(new T.CylinderGeometry(.21,.21,.22,20),gold,prop,-.72,1.91,0);mesh(new T.CylinderGeometry(.21,.21,.22,20),gold,prop,.72,1.91,0);
      for(let j=0;j<3;j++)mesh(new T.SphereGeometry(.12,16,12),gold,prop,(j-1)*.42,2.45+(j%2)*.2,0);
    }else if(i===3){
      mesh(new T.CylinderGeometry(.87,.28,1.2,40,1,true),purple,prop,0,1.5,0);mesh(new T.CylinderGeometry(.27,.27,.65,24),gold,prop,0,.65,0);
      for(let j=0;j<3;j++)mesh(new T.SphereGeometry(.14,16,12),j%2?gold:lavender,prop,(j-1)*.43,2.5+(j%2)*.35,0);
    }else if(i===4){
      for(let j=0;j<4;j++){mesh(new T.CylinderGeometry(.81,.81,.34,48),j===3?gold:lavender,prop,0,.4+j*.45,0);const r=mesh(new T.TorusGeometry(.79,.025,8,48),pearl,prop,0,.58+j*.45,0);r.rotation.x=Math.PI/2;}
    }else if(i===5){
      const shape=new T.Shape();for(let j=0;j<48;j++){const a=j/48*Math.PI*2,r=j%4<2?1:.77;const x=Math.cos(a)*r,y=Math.sin(a)*r;j?shape.lineTo(x,y):shape.moveTo(x,y);}shape.closePath();const hole=new T.Path();hole.absarc(0,0,.36,0,Math.PI*2,true);shape.holes.push(hole);
      const gear=mesh(new T.ExtrudeGeometry(shape,{depth:.27,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.045,bevelThickness:.045}),purple,prop,0,1.25,0);gear.rotation.y=.15;
      const pin=mesh(new T.TorusGeometry(.27,.05,10,32),gold,prop,0,1.25,.18);
    }else if(i===6){
      for(let j=0;j<3;j++){const height=.6+j*.62;mesh(new T.BoxGeometry(.46,height,.65),j===2?gold:lavender,prop,(j-1)*.58,height/2+.15,0);}
      const curve=new T.CatmullRomCurve3([new T.Vector3(-.85,1.4,.3),new T.Vector3(0,2,.3),new T.Vector3(.85,2.75,.3)]);mesh(new T.TubeGeometry(curve,20,.055,8,false),gold,prop);
      const tip=mesh(new T.ConeGeometry(.16,.36,3),gold,prop,.95,2.83,.3);tip.rotation.z=-.65;
    }else{
      const arch=mesh(new T.TorusGeometry(.88,.15,16,60,Math.PI),gold,prop,0,1.55,0);mesh(new T.CylinderGeometry(.15,.15,1.25,16),gold,prop,-.88,.93,0);mesh(new T.CylinderGeometry(.15,.15,1.25,16),gold,prop,.88,.93,0);
      mesh(new T.SphereGeometry(.3,32,24),purple,prop,0,1.1,0);
    }
    const label=mesh(new T.PlaneGeometry(.7,.35),labelMaterial(i===7?'E':String(i+1).padStart(2,'0')),group,0,.14,1.62);label.rotation.x=-Math.PI/2;
    stations.push({group,prop,ring,disk});
  }
  let disposed=false,raf,current=step,target=step,transition=null,overview=false,overviewMix=0,available=unlocked,pulse=0,pointer={x:0,y:0},drag={x:0,y:0},dragStart=null,moved=false;
  const raycaster=new T.Raycaster(),pointerV=new T.Vector2();
  const size=()=>{const r=host.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height));camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();};
  const resize=new ResizeObserver(size);resize.observe(host);size();
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const down=e=>{dragStart={x:e.clientX,y:e.clientY,old:{...drag}};moved=false;};
  const move=e=>{const r=host.getBoundingClientRect();pointer={x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5};if(dragStart){const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y;moved=moved||Math.abs(dx)+Math.abs(dy)>8;drag.x=T.MathUtils.clamp(dragStart.old.x+dx*.008,-1.2,1.2);drag.y=T.MathUtils.clamp(dragStart.old.y+dy*.005,-.45,.5);}};
  const up=e=>{if(dragStart&&!moved){const r=host.getBoundingClientRect();pointerV.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointerV,camera);const hit=raycaster.intersectObjects(clickTargets)[0];if(hit&&hit.object.userData.station<=available)onStation(hit.object.userData.station);}dragStart=null;};
  const cancel=()=>{dragStart=null;pointer={x:0,y:0};};
  host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointerleave',cancel);host.addEventListener('pointercancel',cancel);
  const position=new T.Vector3(),look=new T.Vector3(),targetLook=new T.Vector3();
  let last=performance.now();
  function render(now){
    if(disposed)return;const dt=Math.min((now-last)/1000,.05);last=now;
    if(transition){const t=smooth((now-transition.start)/1250);current=T.MathUtils.lerp(transition.from,transition.to,t);if(t>=1)transition=null;}
    overviewMix=reduced?(overview?1:0):T.MathUtils.damp(overviewMix,overview?1:0,5,dt);
    scene.fog.near=T.MathUtils.lerp(14,90,overviewMix);scene.fog.far=T.MathUtils.lerp(32,160,overviewMix);
    const floor=Math.floor(current),ceil=Math.min(7,floor+1),fraction=current-floor;
    position.copy(path.getPoint(current/7));targetLook.copy(position).add(new T.Vector3(0,.5,0));
    const compact=host.clientWidth<760&&host.clientHeight<240;
    if(compact)targetLook.x-=1.5;
    const wide=camera.aspect>1.1;
    const yaw=.35+drag.x+(reduced?0:pointer.x*.12),distance=compact?9:(wide?13.8:12.7);
    const nearPos=new T.Vector3(position.x+Math.sin(yaw)*distance,(compact?5.5:8.5)+drag.y*7,position.z+Math.cos(yaw)*distance);
    const mapPos=new T.Vector3(24,53,20);nearPos.lerp(mapPos,overviewMix);
    targetLook.lerp(new T.Vector3(0,0,-26),overviewMix);
    camera.position.copy(nearPos);look.lerp(targetLook,reduced?1:.16);camera.lookAt(look);
    sun.position.set(position.x-7,16,position.z+10);sun.target.position.copy(position);
    traveller.position.copy(path.getPoint(current/7));traveller.position.y=.35+(reduced?0:Math.sin(now*.002)*.04);
    goldPath.geometry.setDrawRange(0,Math.max(0,Math.floor(current/7*500))*10*6);
    stations.forEach((s,i)=>{s.group.visible=overviewMix>.15||Math.abs(i-current)<.86;s.prop.position.y=.32+(reduced?0:Math.sin(now*.0014+i)*.07);s.prop.rotation.y=(!reduced&&i===Math.round(current)?Math.sin(now*.00045)*.11:0);s.ring.material=i<=Math.round(current)?gold:lavender;s.disk.material=i===Math.round(current)?lavender:pale;const p=i===Math.round(current)?Math.max(0,1-(now-pulse)/650):0;s.prop.scale.setScalar(1+Math.sin(p*Math.PI)*.07);});
    renderer.render(scene,camera);if(!document.hidden)raf=requestAnimationFrame(render);
  }
  const visibility=()=>{if(!document.hidden&&!disposed){last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(render);}};document.addEventListener('visibilitychange',visibility);
  // Establish a correct initial camera before the first visible frame.
  look.copy(centers[step]).add(new T.Vector3(0,.5,0));raf=requestAnimationFrame(render);onReady();
  return {
    setStep(i){target=T.MathUtils.clamp(i,0,7);overview=false;drag={x:0,y:0};if(reduced)current=target;else transition={from:current,to:target,start:performance.now()};},
    setUnlocked(i){available=i;},
    setOverview(value){overview=value;},
    acknowledge(){pulse=performance.now();},
    dispose(){disposed=true;cancelAnimationFrame(raf);resize.disconnect();document.removeEventListener('visibilitychange',visibility);host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointerleave',cancel);host.removeEventListener('pointercancel',cancel);const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});geometries.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose();});renderer.dispose();renderer.domElement.remove();}
  };
}

export function createScoreMedal(host,score){
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;host.appendChild(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,50);camera.position.set(0,0,6.5);scene.add(new T.HemisphereLight(0xffffff,0xb9a5cf,2.2));const light=new T.DirectionalLight(0xffeac4,3.5);light.position.set(-3,5,5);scene.add(light);const rimLight=new T.DirectionalLight(0xe5d4ff,2);rimLight.position.set(4,-2,3);scene.add(rimLight);
  const medal=new T.Group();scene.add(medal);const pearl=new T.MeshPhysicalMaterial({color:0xfffcf7,roughness:.34,metalness:.15,clearcoat:.6}),gold=new T.MeshPhysicalMaterial({color:0xc09249,roughness:.22,metalness:.6}),purple=new T.MeshPhysicalMaterial({color:0x815aa3,roughness:.24,metalness:.2});
  const coin=mesh(new T.CylinderGeometry(1.47,1.47,.2,80),pearl,medal);coin.rotation.x=Math.PI/2;
  mesh(new T.TorusGeometry(1.5,.07,16,90),gold,medal,0,0,.08);
  mesh(new T.TorusGeometry(1.34,.035,10,90),new T.MeshStandardMaterial({color:0xe1d2ed,roughness:.4}),medal,0,0,.14);
  const arc=mesh(new T.TorusGeometry(1.34,.045,12,90,Math.PI*2*score/100),purple,medal,0,0,.155);arc.rotation.z=Math.PI/2;arc.scale.x=-1;
  let raf,disposed=false,pointer={x:0,y:0};const started=performance.now();const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const resize=()=>{const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const move=e=>{const r=host.getBoundingClientRect();pointer={x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5};};host.parentElement.addEventListener('pointermove',move);
  const render=now=>{if(disposed)return;const progress=reduced?1:smooth((now-started)/1400);arc.geometry.setDrawRange(0,Math.floor(progress*90)*12*6);medal.scale.setScalar(.8+.2*progress);medal.rotation.set(reduced?0:pointer.y*.12,reduced?0:Math.sin(now*.0005)*.07+pointer.x*.14,-.015);renderer.render(scene,camera);if(!document.hidden)raf=requestAnimationFrame(render);};
  const visibility=()=>{if(!document.hidden&&!disposed){cancelAnimationFrame(raf);raf=requestAnimationFrame(render);}};document.addEventListener('visibilitychange',visibility);raf=requestAnimationFrame(render);
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();host.parentElement?.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});renderer.dispose();renderer.domElement.remove();};
}
