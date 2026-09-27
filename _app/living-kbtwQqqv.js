import{$ as e,Ct as t,G as n,J as r,K as i,P as a,Q as o,St as s,W as c,X as l,Y as u,_t as d,bt as f,ct as p,dt as m,et as h,ft as g,ht as _,nt as v,pt as y,q as b,rt as x,tt as S,vt as C,xt as w}from"./index-CrRI8HnO.js";var T=[`low`,`mid`,`high`];function E(e){let t=T.indexOf(e);return t<0?2:t}function D(e,t,n){if(e==null)return n;if(typeof e==`number`||typeof e==`string`||Array.isArray(e))return e;if(e[t]!=null)return e[t];let r=E(t);for(let t=r;t>=0;t--)if(e[T[t]]!=null)return e[T[t]];for(let t=r;t<T.length;t++)if(e[T[t]]!=null)return e[T[t]];return n}function O(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619)>>>0;return t>>>0}function k(e){let t=e>>>0,n=()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};return{next:n,float:(e=0,t=1)=>e+(t-e)*n(),int:(e,t)=>Math.floor(e+(t-e+1)*n()),pick:e=>e[Math.floor(n()*e.length)]}}function A(e,t){let n=Math.sin(e*127.1+t*311.7)*43758.5453123;return n-Math.floor(n)}function j(e,t={},n=`#ffffff`){let i=e??n;for(let e=0;e<4&&typeof i==`string`&&i.startsWith(`$`);e++)i=t[i.slice(1)]??n;let a=new r;if(Array.isArray(i))return a.setRGB(i[0],i[1],i[2],x);let o=String(i).replace(`#`,``);o.length===3&&(o=o.split(``).map(e=>e+e).join(``));let s=parseInt(o,16);return Number.isFinite(s)?a.setRGB((s>>16&255)/255,(s>>8&255)/255,(s&255)/255,x):j(n)}function M(e,t){let[n=.3,r=1,i=2,a=1]=e||[];if(t<0)return 0;if(t<n)return a*(n>0?t/n:1);if(t<n+r)return a;if(t<n+r+i){let e=1-(t-n-r)/i;return a*e*e*(3-2*e)}return 0}var ee={homerun:[.3,2.4,2.6,1],contact:[.15,.3,.9,.35],"ball:wall":[.1,1.2,1.6,1],lightning:[0,0,.6,1]};function N(e){let t=e.map(e=>[e[0],e[1]]),n=[0];for(let e=1;e<t.length;e++)n.push(n[e-1]+Math.hypot(t[e][0]-t[e-1][0],t[e][1]-t[e-1][1]));let r=n[n.length-1]||1;function i(e){let i=Math.max(0,Math.min(1,e))*r,a=1;for(;a<n.length-1&&n[a]<i;)a++;let o=n[a-1],s=n[a]-o||1,c=(i-o)/s,l=t[a-1],u=t[a]||l,d=u[0]-l[0],f=u[1]-l[1],p=Math.hypot(d,f)||1;return{x:l[0]+d*c,y:l[1]+f*c,tx:d/p,ty:f/p}}function a(e=0){let n=1/0,r=1/0,i=-1/0,a=-1/0;for(let[e,o]of t)n=Math.min(n,e),r=Math.min(r,o),i=Math.max(i,e),a=Math.max(a,o);return[n-e,r-e,i-n+2*e,a-r+2*e]}return{points:t,length:r,at:i,bounds:a}}var P=`
uniform vec2 uAxis;      // plate px (1x) of the solved view axis
uniform float uPPT;      // plate px (1x) per unit tan
uniform vec2 uTanHalf;   // live camera tan(hfov/2), tan(vfov/2)
uniform vec2 uCrop;      // canvas ndc = frame ndc * uCrop (the renderer's low-res grid crop), usually 1
vec4 plateToClip(vec2 P) {
  vec2 tn = vec2(P.x - uAxis.x, uAxis.y - P.y) / uPPT;
  return vec4(tn / uTanHalf * uCrop, 0.0, 1.0);
}`,F=`
precision highp float;
uniform float uTime;     // park-local time (s)
uniform vec2 uSize;      // plate 1x size (px)
uniform float uGrid;     // pixel-snap grid (plate 1x px)
uniform vec2 uGridOff;   // grid origin (plate px)
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float hash11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x), mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x), f.y);
}
float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 l2s(vec3 c) { c = max(c, 0.0); return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
// the centre of the painting-grid cell this plate px falls in
vec2 snapP(vec2 P) { return (floor((P - uGridOff) / uGrid) + 0.5) * uGrid + uGridOff; }
vec2 cellOf(vec2 P) { return floor((P - uGridOff) / uGrid); }
// 4x4 ordered dither threshold of a grid cell (0..1)
float bayer4(vec2 c) {
  vec2 a = mod(c, 4.0);
  float b = mod(a.x, 2.0) * 2.0 + mod(a.y, 2.0) * 3.0 - 4.0 * mod(a.x, 2.0) * mod(a.y, 2.0);
  vec2 h = floor(a / 2.0);
  float b2 = mod(h.x, 2.0) * 2.0 + mod(h.y, 2.0) * 3.0 - 4.0 * mod(h.x, 2.0) * mod(h.y, 2.0);
  return (b * 4.0 + b2 + 0.5) / 16.0;
}
// posterise a soft 0..1 value into pixel-art bands with an ordered dither between them
float bands(float v, float levels, vec2 cell) {
  if (levels < 1.5) return v;
  float x = v * levels;
  return (floor(x) + step(bayer4(cell), fract(x))) / levels;
}
vec2 texUv(vec2 P, float flip) { vec2 uv = P / uSize; if (flip > 0.5) uv.y = 1.0 - uv.y; return uv; }
`,I=`
uniform sampler2D tMask;
uniform vec4 uMaskCh;
uniform float uMaskFlip, uMaskInv, uHasMask;
uniform vec4 uMaskXf;
uniform vec4 uMaskBox;
uniform float uMaskOut;
float maskAt(vec2 P) {
  if (uHasMask < 0.5) return 1.0;
  float m;
  if (uMaskXf.z > 0.0) {
    if (P.x < uMaskBox.x || P.y < uMaskBox.y || P.x >= uMaskBox.x + uMaskBox.z || P.y >= uMaskBox.y + uMaskBox.w) {
      m = uMaskOut;
    } else {
      vec2 uv = (P - uMaskXf.xy) * uMaskXf.zw;
      if (uMaskFlip > 0.5) uv.y = 1.0 - uv.y;
      m = dot(texture2D(tMask, uv), uMaskCh);
    }
  } else {
    m = dot(texture2D(tMask, texUv(P, uMaskFlip)), uMaskCh);
  }
  return uMaskInv > 0.5 ? 1.0 - m : m;
}`,L=`
uniform sampler2D tPlate;
uniform float uPlateSRGB, uPlateFlip;
vec3 plateAt(vec2 P) {
  vec2 fw = max(fwidth(P), vec2(1e-4));
  vec2 seam = floor(P + 0.5);
  vec2 sp = seam + clamp((P - seam) / fw, -0.5, 0.5);
  vec2 uv = texUv(sp, uPlateFlip);
  vec2 g = P / uSize;
  vec2 gx = dFdx(g), gy = dFdy(g);
  if (uPlateFlip > 0.5) { gx.y = -gx.y; gy.y = -gy.y; }
  vec3 c = textureGrad(tPlate, uv, gx, gy).rgb;
  return uPlateSRGB > 0.5 ? l2s(c) : c;
}`,R=`
void emit(vec3 c, float a) {
#if defined(BLEND_MUL2)
  vec3 k = mix(vec3(1.0), c, clamp(a, 0.0, 1.0));
  if (max(abs(k.r - 1.0), max(abs(k.g - 1.0), abs(k.b - 1.0))) < 0.004) discard;
  gl_FragColor = vec4(clamp(0.5 * k, 0.0, 1.0), 1.0);
#elif defined(BLEND_SCREEN)
  if (a < 0.002) discard;
  gl_FragColor = vec4(clamp(c * a, 0.0, 1.0), 1.0);
#else
  if (a < 0.002) discard;
  gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
#endif
}`,z=P+`
uniform vec4 uRect;
varying vec2 vP;
void main() {
  vec2 P = uRect.xy + position.xy * uRect.zw;
  vP = P;
  gl_Position = plateToClip(P);
}`,B=P+`
varying vec2 vP;
void main() {
  vP = position.xy;
  gl_Position = plateToClip(position.xy);
}`;function V(e){let t=new n,r=new Float32Array(12);return e.forEach((e,t)=>r.set([e[0],e[1],0],t*3)),t.setAttribute(`position`,new c(r,3)),t.setIndex([0,1,2,0,2,3]),t}function te(e,t){e.blending=5,e.blendEquation=100,e.blendEquationAlpha=100,e.blendSrcAlpha=200,e.blendDstAlpha=201,e.premultipliedAlpha=!1,e.transparent=!0,t===`add`?(e.blendSrc=204,e.blendDst=201):t===`screen`?(e.blendSrc=201,e.blendDst=203):t===`mul2`?(e.blendSrc=208,e.blendDst=202):(e.blendSrc=204,e.blendDst=205)}var ne={add:`BLEND_ADD`,screen:`BLEND_SCREEN`,mul2:`BLEND_MUL2`,alpha:`BLEND_ALPHA`};function re(e,t,n){return t==null?n:t===`art`?e.art:typeof t==`object`&&!Array.isArray(t)&&t.art!=null?e.art*t.art:t}function H(e,{name:t,vertexShader:n=z,fragmentShader:r,uniforms:i={},blend:a=`alpha`,grid:o,defines:s={}}){let c={...e.shared,uGrid:{value:re(e,o,e.grid)},uGridOff:{value:new w(e.gridOffset[0],e.gridOffset[1])},...i},l=new C({name:`living:${t}`,vertexShader:n,fragmentShader:r,uniforms:c,defines:{[ne[a]||`BLEND_ALPHA`]:``,...s},depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,side:2});return te(l,a),l}var U=null,ie=0;function W(){return U||(U=new y(1,1),U.translate(.5,.5,0)),ie++,U}function G(){--ie<=0&&U&&(U.dispose(),U=null,ie=0)}function K(t,n){let r=new h,i=new y(1,1);i.translate(.5,.5,0),r.index=i.index,r.setAttribute(`position`,i.getAttribute(`position`)),r.setAttribute(`uv`,i.getAttribute(`uv`));let a={};for(let[i,o]of Object.entries(n)){let n=new Float32Array(Math.max(1,t)*o),s=new e(n,o);s.setUsage(l),r.setAttribute(i,s),a[i]=s}return r.instanceCount=t,i.dispose=()=>{},{geometry:r,attrs:a}}function q(e,t,n,r){let i=new p(t,n);return i.frustumCulled=!1,i.renderOrder=r,i.matrixAutoUpdate=!1,e.layer!=null&&i.layers.set(e.layer),i}function J(e,n){let r={tMask:{value:e.blank},uMaskCh:{value:new t(1,0,0,0)},uMaskFlip:{value:0},uMaskInv:{value:0},uHasMask:{value:0},uMaskXf:{value:new t(0,0,0,0)},uMaskBox:{value:new t(0,0,0,0)},uMaskOut:{value:0}};if(!n)return r;let i=typeof n==`string`?n:n.name,a=typeof n==`object`&&!!n.invert,o=e.masks[i];return o?(r.tMask.value=o.texture,r.uMaskCh.value.fromArray(o.channel),r.uMaskFlip.value=+!!o.texture.flipY,r.uMaskInv.value=+!!a,r.uHasMask.value=1,o.xf&&(r.uMaskXf.value.fromArray(o.xf),r.uMaskBox.value.fromArray(o.box),r.uMaskOut.value=o.outside??0),r):(console.warn(`[living] unknown mask "${i}" (known: ${Object.keys(e.masks).join(`, `)})`),r)}function Y(e,t=`plate`){let n=t===`skyLayer`&&e.textures.skyLayer||e.textures.plate;return{tPlate:{value:n||e.blank},uPlateSRGB:{value:n&&n.colorSpace===`srgb`?1:0},uPlateFlip:{value:n&&(n.flipY||n.userData?.bitmapFlipY)?1:0}}}function X(e,t){if(!e)return t;if(Array.isArray(e))return e;if(e.rect)return e.rect;if(e.ellipse){let[t,n,r,i]=e.ellipse;return[t-r,n-i,2*r,2*i]}return t}function ae(e=[]){let n=[0,1,2,3].map(()=>new t(-1e5,-1e5,1,1));return(e||[]).slice(0,4).forEach((e,t)=>{e.ellipse?n[t].fromArray(e.ellipse):e.rect&&n[t].set(e.rect[0]+e.rect[2]/2,e.rect[1]+e.rect[3]/2,e.rect[2]/2,e.rect[3]/2)}),n}var oe=`
uniform vec4 uExcl[4];
uniform float uExclSoft;
// 0 inside any exclusion ellipse, 1 outside (soft edge)
float keepOut(vec2 P) {
  float k = 1.0;
  for (int i = 0; i < 4; i++) {
    vec2 d = (P - uExcl[i].xy) / uExcl[i].zw;
    k *= smoothstep(1.0 - uExclSoft, 1.0, length(d));
  }
  return k;
}`,se={bird_far:{fps:8,glide:1,frames:[[`#...#`,`.#.#.`,`..#..`],[`.....`,`##.##`,`..#..`],[`.....`,`.###.`,`#...#`],[`.....`,`##.##`,`..#..`]]},bird_mid:{fps:9,glide:1,frames:[[`#.......#`,`##.....##`,`.###-###.`,`...#+#...`,`.........`],[`.........`,`##.....##`,`.###-###.`,`...#+#...`,`.........`],[`.........`,`.........`,`####-####`,`...#+#...`,`.........`],[`.........`,`.........`,`...#-#...`,`.###+###.`,`##.....##`],[`.........`,`.........`,`####-####`,`...#+#...`,`.........`],[`.........`,`##.....##`,`.###-###.`,`...#+#...`,`.........`]]},bird_near:{fps:9,glide:1,frames:[[`#...........#`,`##.........##`,`.###.....###.`,`..####-####..`,`....##+##....`,`.....#.#.....`,`.............`],[`.............`,`##.........##`,`.####...####.`,`...###-###...`,`....##+##....`,`.....#.#.....`,`.............`],[`.............`,`.............`,`#...........#`,`######-######`,`....##+##....`,`.....#.#.....`,`.............`],[`.............`,`.............`,`.............`,`....##-##....`,`..####+####..`,`.###.#.#.###.`,`##.........##`],[`.............`,`.............`,`#...........#`,`######-######`,`....##+##....`,`.....#.#.....`,`.............`],[`.............`,`##.........##`,`.####...####.`,`...###-###...`,`....##+##....`,`.....#.#.....`,`.............`]]},gull_mid:{fps:6,glide:2,frames:[[`x.........x`,`x#.......#x`,`.##.....##.`,`..###-###..`,`....#+#....`],[`...........`,`xx.......xx`,`..###.###..`,`....#-#....`,`....#+#....`],[`...........`,`..##...##..`,`x#..#-#..#x`,`....#+#....`,`...........`],[`...........`,`...........`,`....#-#....`,`..##+++##..`,`xx.......xx`],[`...........`,`..##...##..`,`x#..#-#..#x`,`....#+#....`,`...........`],[`...........`,`xx.......xx`,`..###.###..`,`....#-#....`,`....#+#....`]]},gull_near:{fps:6,glide:2,frames:[[`x.............x`,`xx...........xx`,`.x##.......##x.`,`..###.....###..`,`...####-####...`,`......#+#......`,`......-.-......`],[`...............`,`xx...........xx`,`.x###.....###x.`,`...###...###...`,`.....##-##.....`,`......#+#......`,`......-.-......`],[`...............`,`...............`,`..###.....###..`,`x##..##-##..##x`,`x.....#+#.....x`,`......-.-......`,`...............`],[`...............`,`...............`,`...............`,`.....##-##.....`,`...###+++###...`,`.x##..-.-..##x.`,`xx...........xx`],[`...............`,`...............`,`..###.....###..`,`x##..##-##..##x`,`x.....#+#.....x`,`......-.-......`,`...............`],[`...............`,`xx...........xx`,`.x###.....###x.`,`...###...###...`,`.....##-##.....`,`......#+#......`,`......-.-......`]]},swift:{fps:12,glide:1,frames:[[`#.....#`,`.#...#.`,`..#+#..`,`...-...`],[`.......`,`##...##`,`..#+#..`,`...-...`],[`.......`,`.......`,`###+###`,`...-...`],[`.......`,`..#+#..`,`.#.-.#.`,`#.....#`]]},bat:{fps:10,frames:[[`#.......#`,`##.#.#.##`,`.###+###.`,`..#...#..`],[`.........`,`#.#.#.#.#`,`####+####`,`.#.....#.`],[`.........`,`....#....`,`.##-+-##.`,`##.....##`],[`.........`,`#.#.#.#.#`,`####+####`,`.#.....#.`]]},maple:{fps:5,frames:[[`..#...`,`#.##.#`,`######`,`.####.`,`..+#..`,`..x...`],[`...#..`,`..###.`,`.####.`,`..##+.`,`..x...`,`......`],[`......`,`......`,`.####+`,`....x.`,`......`,`......`],[`..#...`,`.###..`,`.####.`,`+##...`,`...x..`,`......`]]},leaf_small:{fps:6,frames:[[`.#..`,`###.`,`.#+#`,`..x.`],[`....`,`.##.`,`###+`,`....`],[`....`,`....`,`###+`,`....`],[`....`,`.##.`,`+###`,`....`]]},sakura:{fps:5,frames:[[`.+.`,`+#+`,`.#-`],[`.+.`,`##-`,`...`],[`...`,`+#-`,`...`],[`...`,`-##`,`.+.`]]},snowflake:{fps:3,frames:[[`.+.`,`+#+`,`.+.`],[`.#.`,`#+#`,`.#.`],[`.+.`,`+#+`,`.+.`],[`...`,`.+.`,`...`]]},snow_puff:{fps:0,frames:[[`.##.`,`#++#`,`#+##`,`.##.`]]},puff:{fps:2,frames:[[`.....`,`..#..`,`.#+#.`,`..#..`,`.....`],[`.....`,`.##+.`,`.#+##`,`..##.`,`.....`],[`.##+.`,`##+##`,`#####`,`.###-`,`..-..`],[`.#.+.`,`#.#.#`,`.#-#.`,`#.-.#`,`.....`]]},firefly:{fps:4,frames:[[`...`,`.y.`,`...`],[`.#.`,`#y#`,`.#.`],[`...`,`.y.`,`...`],[`...`,`...`,`...`]]},moth:{fps:12,frames:[[`#.#`,`.+.`],[`...`,`#+#`]]},lantern:{fps:3,frames:[[`.xx.`,`#yy#`,`yyyy`,`yyyy`,`#yy#`,`.-..`],[`.xx.`,`#yy#`,`yyyy`,`yyyy`,`#yy#`,`..-.`]]},satellite:{fps:0,frames:[[`-+.#.+-`,`-+###+-`,`...r...`]]}},ce=typeof navigator<`u`&&navigator.userAgent||``,le=/AppleWebKit/.test(ce)&&!/Chrome\/|Chromium\/|Edg\//.test(ce);async function Z(e,{nearest:t=!1,mipmaps:n=!1}={}){let r;if(typeof e==`string`){let t=await fetch(e);if(!t.ok)throw Error(`${e}: HTTP ${t.status}`);r=await t.blob()}else r=await e;le&&await a();let i=await createImageBitmap(r,{premultiplyAlpha:`none`,colorSpaceConversion:`none`}),o=new f(i);return o.flipY=!1,o.premultiplyAlpha=!1,o.colorSpace=``,o.generateMipmaps=n,o.magFilter=t?m:S,o.minFilter=n?t?g:v:t?m:S,o.wrapS=o.wrapT=b,o.needsUpdate=!0,o.userData.living=!0,o.userData.bitmap=i,o.userData.size=[i.width,i.height],o}function ue(){let e=new u(new Uint8Array([0,0,0,0]),1,1);return e.needsUpdate=!0,e}var Q={bird:{fps:7,frames:[[`#.....#`,`.#...#.`,`..#.#..`,`...#...`],[`.......`,`##...##`,`..#.#..`,`...#...`],[`.......`,`.......`,`.##.##.`,`#..#..#`],[`.......`,`##...##`,`..#.#..`,`...#...`]]},gull:{fps:5,frames:[[`+.......+`,`-+.....+-`,`..-+.+-..`,`....#....`],[`.........`,`+++...+++`,`...-#-...`,`....#....`],[`.........`,`.........`,`.++-#-++.`,`+...#...+`],[`.........`,`+++...+++`,`...-#-...`,`....#....`]]},plane:{fps:0,frames:[[`......#......`,`r.#########.w`,`..-##+##-....`,`.....#.......`]]},blimp:{fps:0,frames:[[`...+++++++++...`,`.++#########+..`,`+############-#`,`.-###########-.`,`...-------yy...`,`.......r.......`]]},boat:{fps:2,frames:[[`....#....#....`,`...###..###...`,`.+++++++++++..`,`.#y#y#y#y#y#..`,`##############`,`.------------.`],[`....#....#....`,`...###..###...`,`.+++++++++++..`,`.#y#y#y#y#y#..`,`##############`,`..-----------.`]]},leaf:{fps:6,frames:[[`..#..`,`.###.`,`#####`,`.###.`,`..-..`],[`.....`,`.##..`,`#####`,`..##.`,`.....`],[`.....`,`.....`,`#####`,`.....`,`.....`],[`.....`,`..##.`,`#####`,`.##..`,`.....`]]},petal:{fps:5,frames:[[`.++.`,`+##+`,`.#-.`],[`.+..`,`+##.`,`.#-.`],[`....`,`+##+`,`....`],[`..+.`,`.##+`,`.-#.`]]},snow:{fps:0,frames:[[`.+.`,`+#+`,`.+.`]]},bubble:{fps:0,frames:[[`.+++.`,`+...+`,`+...#`,`+..-#`,`.###.`]]}};for(let[e,t]of Object.entries(se))Q[e]||(Q[e]=t);var de={".":null,"#":[128,128,128,255],"+":[255,255,255,255],"-":[40,40,40,255],x:[190,190,190,255],r:[255,60,40,200],w:[255,255,255,150],y:[255,214,140,100]};function fe(e){let t=[...new Set(e)].filter(e=>Q[e]),n=[],r=0,i=0,a=0,o=0;for(let e of t)for(let t of Q[e].frames){let s=t[0].length,c=t.length;r+s+1>128&&(o+=i+1,r=0,i=0),n.push({n:e,f:t,x:r,y:o,w:s,h:c}),r+=s+1,i=Math.max(i,c),a=Math.max(a,r)}o+=i+1,a=Math.max(4,a),o=Math.max(4,o);let s=new Uint8Array(a*o*4),c={};for(let e of n)(c[e.n]||=[]).push({x:e.x,y:e.y,w:e.w,h:e.h}),e.f.forEach((t,n)=>{for(let r=0;r<t.length;r++){let i=de[t[r]];if(!i)continue;let o=((e.y+n)*a+e.x+r)*4;s.set(i,o)}});let l=new u(s,a,o,_);return l.flipY=!1,l.magFilter=m,l.minFilter=m,l.generateMipmaps=!1,l.colorSpace=``,l.needsUpdate=!0,{texture:l,frames:c,size:[a,o]}}var pe={windows:0,neon:1,lamps:2,fire:3,twinkle:4},me=F+I+L+oe+`
uniform float uHasPlate, uGap;
uniform float uMode, uDepth, uRate, uBreathe, uIdCells, uLevel, uExcite, uSeed;
uniform vec2 uCell;
uniform vec4 uDusk;      // fraction, start, duration, -
uniform vec3 uOff;       // colour multiplier of a window that is off (per channel: dim + cool)
uniform float uSpeed;
varying vec2 vP;
`+R+`
void main() {
  float mv = maskAt(vP);
  float m = uIdCells > 0.5 ? step(0.5 / 255.0, mv) : mv;
  m *= keepOut(vP);
  if (m < 0.01) discard;
  vec2 cell = uIdCells > 0.5 ? vec2(floor(mv * 255.0 + 0.5), uSeed) : floor(vP / uCell) + uSeed;
  float h = hash12(cell);
  float h2 = hash12(cell + 17.31);
  float h3 = hash12(cell + 5.77);
  float t = uTime * uSpeed;
  vec3 k = vec3(1.0 + uBreathe * sin(t * 0.8 + vP.x * 0.004 + h * 0.8));
  if (uMode < 0.5) {
    // ---- windows ----
    float on = 1.0;
    if (h2 < uDusk.x) {
      // this window switches on at its own moment of the dusk
      float tOn = uDusk.y + hash12(cell + 3.1) * uDusk.z;
      float x = uTime - tOn;
      float stutter = step(0.45, hash12(cell + floor(x * 14.0)));
      on = x < 0.0 ? 0.0 : (x < 0.7 ? mix(stutter, 1.0, smoothstep(0.35, 0.7, x)) : 1.0);
    }
    // now and then someone switches a light off for a while (slot per window, soft edges)
    float per = 14.0 + h * 26.0;
    float ph = t / per + h * 13.0;
    float slot = floor(ph);
    float f = fract(ph);
    float offNow = step(1.0 - uRate, hash12(cell + slot * 1.37)) * smoothstep(0.1, 0.14, f) * (1.0 - smoothstep(0.62, 0.66, f));
    on *= 1.0 - offNow;
    if (uHasPlate > 0.5) {
      // an unlit window takes the colour of the facade around it (the darkest of four samples between
      // windows), cooled by uOff: expressed as a multiplier so it still composes with other layers
      vec3 here = plateAt(vP);
      vec3 f0 = plateAt(vP + vec2(uGap, 0.0)), f1 = plateAt(vP - vec2(uGap, 0.0));
      vec3 f2 = plateAt(vP + vec2(0.0, uGap)), f3 = plateAt(vP - vec2(0.0, uGap));
      vec3 fa = luma(f0) < luma(f1) ? f0 : f1;
      vec3 fb = luma(f2) < luma(f3) ? f2 : f3;
      vec3 facade = (luma(fa) < luma(fb) ? fa : fb) * uOff;
      vec3 offK = clamp(facade / max(here, vec3(0.02)), 0.0, 1.0);
      k *= mix(offK, vec3(1.0), on);
    } else {
      k *= mix(uOff, vec3(1.0), on);
    }
    k *= 1.0 + uDepth * 0.12 * (h3 - 0.5);          // static warmth variety
  } else if (uMode < 1.5) {
    // ---- neon: hum + rare stutter bursts ----
    float burst = step(1.0 - uRate * (1.0 + 2.0 * uExcite), hash12(vec2(h * 91.0, floor(t * 1.3 + h * 5.0))));
    float buzz = step(0.45, hash12(cell + floor(t * 18.0)));
    // only the saturated neon tubes stutter (white lamp banks and screens in the same mask stay steady)
    float satW = 1.0;
    if (uHasPlate > 0.5) {
      vec3 pc = plateAt(vP);
      float mx = max(pc.r, max(pc.g, pc.b));
      satW = smoothstep(0.3, 0.6, (mx - min(pc.r, min(pc.g, pc.b))) / max(mx, 1e-3));
    }
    k *= 1.0 - burst * buzz * uDepth * satW;
    k *= 1.0 + 0.04 * sin(t * (2.0 + 3.0 * h) + h * 30.0);
  } else if (uMode < 2.5) {
    // ---- lamps: slow breathing ----
    k *= 1.0 + uDepth * (0.6 * sin(t * 1.1 + h * 6.2831) + 0.4 * sin(t * 2.9 + h * 3.0)) + uExcite * 0.25;
  } else if (uMode < 3.5) {
    // ---- firelight ----
    k *= 1.0 + uDepth * ((vnoise(cell * 0.6 + vec2(t * 2.3, t * 1.7)) - 0.5) + 0.4 * (vnoise(cell * 1.7 - t * 4.0) - 0.5));
  } else {
    // ---- stars ----
    float tw = 0.5 + 0.5 * sin(t * (1.3 + 2.2 * h) + h * 40.0);
    k *= 1.0 + uDepth * (tw * tw - 0.45);
  }
  k = mix(vec3(1.0), k, uLevel);
  emit(k, m);
}`;function he(e,n,r){let i=X(n.rect||n.region,[0,0,e.size[0],e.size[1]]),a=n.dusk||null,o={uRect:{value:new t(...i)},...J(e,n.mask===void 0?`glow`:n.mask),uMode:{value:pe[n.mode||`windows`]??0},uDepth:{value:n.depth??.5},uRate:{value:n.rate??.08},uBreathe:{value:n.breathe??.02},uIdCells:{value:+(n.cells===`mask`)},uCell:{value:new w(...n.cell||[5,6])},uDusk:{value:new t(a?.fraction??0,a?.start??0,a?.duration??60,0)},...Y(e,`plate`),uHasPlate:{value:e.textures.plate&&[`windows`,`neon`].includes(n.mode||`windows`)&&n.facade!==!1?1:0},uGap:{value:n.gap??4},uOff:{value:new s(...Array.isArray(n.off)?n.off:[n.off??.35,n.off??.35,n.off??.35])},uSpeed:{value:n.speed??1},uLevel:{value:n.intensity??1},uExcite:{value:0},uSeed:{value:e.seedOf(n.id)%997+.5},uExcl:{value:ae(n.exclude)},uExclSoft:{value:n.excludeSoft??.25}},c=H(e,{name:n.id,fragmentShader:me,uniforms:o,blend:`mul2`});if(n.cells===`mask`&&o.tMask.value){let e=o.tMask.value;e.magFilter!==1003&&e.userData?.living&&(e.magFilter=m,e.minFilter=m,e.needsUpdate=!0)}return{meshes:[q(e,W(),c,r)],update(t){o.uExcite.value=e.excite(n.on,t)},dispose(){c.dispose(),G()}}}var ge={blink:0,strobe:1,double:2,pulse:3,steady:4,flicker:5},_e=P+F+`
attribute vec2 aP;
attribute vec3 aColor;
attribute vec4 aTime;     // period, phase (0..1), duty (0..1), pattern
attribute vec3 aSize;     // core size (px), glow radius (px), intensity
uniform float uExcite, uGain;
varying vec2 vP;
varying vec2 vC;
varying vec3 vColor;
varying vec3 vSize;
varying float vI;
float pattern(float t, vec4 T) {
  float per = max(T.x, 0.05);
  float x = fract(t / per + T.y);
  float rf = min(0.18 / per, 0.2);      // ~0.18 s filament ramp
  if (T.w < 0.5) return smoothstep(0.0, rf, x) * (1.0 - smoothstep(T.z, T.z + rf, x));
  if (T.w < 1.5) return step(x, T.z) * (1.0 - x / max(T.z, 1e-3) * 0.5);
  if (T.w < 2.5) return step(x, T.z) + step(T.z * 2.2, x) * step(x, T.z * 3.2);
  if (T.w < 3.5) { float s = 0.5 + 0.5 * sin(6.2831 * x); return mix(1.0 - T.z, 1.0, s * s); }
  if (T.w < 4.5) return 0.94 + 0.06 * sin(t * 3.1 + T.y * 40.0);
  return 0.75 + 0.25 * vnoise(vec2(t * 7.0, T.y * 50.0));
}
void main() {
  float ext = aSize.y * 2.2 + aSize.x + uGrid;
  vec2 P = aP + (position.xy - 0.5) * 2.0 * ext;
  vP = P;
  vC = aP;
  vColor = aColor;
  vSize = aSize;
  vI = pattern(uTime, aTime) * aSize.z * uGain * (1.0 + uExcite);
  gl_Position = vI < 0.002 ? vec4(2.0, 2.0, 2.0, 1.0) : plateToClip(P);
}`,ve=F+`
varying vec2 vP;
varying vec2 vC;
varying vec3 vColor;
varying vec3 vSize;
varying float vI;
uniform float uGlowLevels;
`+R+`
void main() {
  // hard core: whole painting-grid cells around the centre
  vec2 cc = snapP(vC);
  vec2 d = abs(snapP(vP) - cc);
  float half_ = max(vSize.x * 0.5, uGrid * 0.5);
  float core = step(max(d.x, d.y), half_ - 0.01);
  float r = length(vP - vC) / max(vSize.y, 0.5);
  float glow = exp(-r * r * 1.6) * 0.55;
  glow = bands(glow, uGlowLevels, cellOf(vP));
#if defined(BLEND_ALPHA)
  // painted light: a solid coloured pixel + a tinted glow (reads on bright sunset skies too)
  float a = max(core, glow * 0.8) * vI;
  emit(mix(vColor * 0.85, vColor, core), a);
#else
  float a = (core + glow * (1.0 - core)) * vI;
  // the core keeps its colour, the glow is a touch paler/softer
  emit(mix(vColor, vColor * 0.8 + 0.2, 1.0 - core), a);
#endif
}`;function ye(e,t,n){let r=t.lights||[],i={period:2,phase:0,duty:.4,pattern:`blink`,size:2,glow:6,intensity:1,color:`#ff3b2a`,...t.defaults||{}},a=r.length,{geometry:o,attrs:s}=K(a,{aP:2,aColor:3,aTime:4,aSize:3});r.forEach((n,r)=>{let a={...i,...n},o=a.p||a.at;s.aP.setXY(r,o[0],o[1]);let c=j(a.color,e.palette);s.aColor.setXYZ(r,c.r,c.g,c.b),s.aTime.setXYZW(r,a.period,a.phase??e.rng(`${t.id}:${r}`).next(),a.duty,ge[a.pattern]??0),s.aSize.setXYZ(r,a.size,a.glow,a.intensity)});let c={uExcite:{value:0},uGain:{value:t.intensity??1},uGlowLevels:{value:t.levels??0}},l=H(e,{name:t.id,vertexShader:_e,fragmentShader:ve,uniforms:c,blend:t.blend||`screen`,grid:t.grid});return{meshes:[q(e,o,l,n)],update(n){c.uExcite.value=e.excite(t.on,n)},dispose(){o.dispose(),l.dispose()}}}var be={wave:0,marquee:1,twinkle:2,steady:3},xe=P+F+`
attribute vec2 aP;
attribute float aI;      // bulb index / count (0..1 along the path)
attribute float aK;      // bulb index
uniform float uPattern, uSpeed, uWaves, uEvery, uOn, uBase, uExcite, uGain, uDot, uGlow;
varying vec2 vP;
varying vec2 vC;
varying float vI;
void main() {
  float t = uTime * uSpeed * (1.0 + uExcite);
  float b;
  if (uPattern < 0.5) { float s = 0.5 + 0.5 * sin(6.2831 * (aI * uWaves - t)); b = pow(s, 3.0); }
  else if (uPattern < 1.5) b = step(mod(aK + floor(t), uEvery), 0.5);
  else if (uPattern < 2.5) b = step(1.0 - uOn, hash12(vec2(aK, floor(t * 3.0 + hash11(aK) * 5.0))));
  else b = 1.0;
  vI = mix(uBase, 1.0, b) * uGain;
  float ext = uGlow * 2.2 + uDot + uGrid;
  vec2 P = aP + (position.xy - 0.5) * 2.0 * ext;
  vP = P;
  vC = aP;
  gl_Position = vI < 0.002 ? vec4(2.0, 2.0, 2.0, 1.0) : plateToClip(P);
}`,Se=F+`
uniform vec3 uColor;
uniform float uDot, uGlow;
varying vec2 vP;
varying vec2 vC;
varying float vI;
`+R+`
void main() {
  vec2 d = abs(snapP(vP) - snapP(vC));
  float core = step(max(d.x, d.y), max(uDot * 0.5, uGrid * 0.5) - 0.01);
  float r = length(vP - vC) / max(uGlow, 0.5);
  float glow = exp(-r * r * 1.6) * 0.45;
  emit(mix(uColor, uColor * 0.8 + 0.2, 1.0 - core), (core + glow * (1.0 - core)) * vI);
}`,Ce=F+I+`
uniform vec2 uHead, uTan;
uniform float uLen, uWid, uAmt, uLevels, uSoft, uComet;
uniform vec3 uColor;
varying vec2 vP;
`+R+`
void main() {
  if (uAmt < 0.002) discard;
  vec2 P = snapP(vP);
  vec2 rel = P - uHead;
  float a = dot(rel, uTan) / uLen;
  float c = dot(rel, vec2(-uTan.y, uTan.x)) / uWid;
  float g;
  if (uComet > 0.5) {
    // head + tail behind it (a < 0), thinning toward the end
    float tail = step(a, 0.3) * clamp(1.0 + a, 0.0, 1.0);
    float thin = mix(1.0, 0.35, clamp(-a, 0.0, 1.0));
    g = tail * tail * exp(-(c * c) / (thin * thin) * 2.0) + exp(-(a * a * 36.0 + c * c * 2.0)) * 0.8;
  } else {
    g = exp(-(a * a) * 2.0) * exp(-(c * c) * 2.0);
  }
  // a bright core in the middle of the band
  g = g * (1.0 - uSoft) + uSoft * g * g * 1.6;
  float m = maskAt(vP);
  g = bands(g, uLevels, cellOf(vP));
  emit(uColor, g * m * uAmt);
}`;function we(e,n,r){let i=N(n.path||[[0,0],[1,0]]),a=j(n.color||`#ffe7b8`,e.palette),o=n.mode||`bulbs`;if(o===`glint`||o===`comet`){let i=o===`comet`,s=(n.paths||[n.path||[[0,0],[1,0]]]).map(N),c=Math.max(n.width??24,n.length??40)*1.5,l=n.rect||(()=>{let e=s.map(e=>e.bounds(c)),t=Math.min(...e.map(e=>e[0])),n=Math.min(...e.map(e=>e[1]));return[t,n,Math.max(...e.map(e=>e[0]+e[2]))-t,Math.max(...e.map(e=>e[1]+e[3]))-n]})(),u={uRect:{value:new t(...l)},...J(e,n.mask),uHead:{value:new w(-1e4,-1e4)},uTan:{value:new w(1,0)},uLen:{value:n.length??40},uWid:{value:n.width??24},uAmt:{value:0},uLevels:{value:n.levels??0},uSoft:{value:n.core??.4},uComet:{value:+!!i},uColor:{value:a}},d=H(e,{name:n.id,vertexShader:z,fragmentShader:Ce,uniforms:u,blend:n.blend||`screen`,grid:n.grid}),f=q(e,W(),d,r),p=n.period??16,m=n.travel??(i?.9:7),h=n.delay??0,g=n.intensity??.5,_=!!n.reverse,v=!!n.pingpong,y=n.ease??!i,b=[];if(n.interval){let t=k(e.seedOf(`${n.id}:passes`)),r=h;for(let e=0;e<4e3;e++)b.push(r),r+=m+t.float(n.interval[0],n.interval[1])}function x(e){if(!b.length){let t=e-h,n=Math.floor(t/p);return t<0?null:{n,ct:t-n*p}}let t=0,n=b.length-1;if(e<b[0])return null;for(;t<n;){let r=t+n+1>>1;b[r]<=e?t=r:n=r-1}return{n:t,ct:e-b[t]}}return{meshes:[f],update(t){let r=x(t);if(!r||r.ct>m){u.uAmt.value=0,f.visible=!1;return}let{n:a,ct:o}=r,c=o/m;y&&(c=c*c*(3-2*c));let l=_;v&&a%2==1&&(l=!l);let d=s[s.length>1?Math.floor(a*.6180339887%1*s.length):0].at(l?1-c:c);u.uHead.value.set(d.x,d.y),u.uTan.value.set(d.tx,d.ty);let p=i?Math.sin(Math.PI*Math.min(1,o/m)):Math.min(1,o/(m*.18),(m-o)/(m*.18));u.uAmt.value=g*Math.max(0,p)*(1+e.excite(n.on,t)),f.visible=!0},dispose(){d.dispose(),G()}}}let s=n.count??Math.max(2,Math.round(i.length/(n.spacing??8))),c=!!n.closed,{geometry:l,attrs:u}=K(s,{aP:2,aI:1,aK:1});for(let e=0;e<s;e++){let t=c?e/s:s>1?e/(s-1):0,n=i.at(t);u.aP.setXY(e,n.x,n.y),u.aI.setX(e,t),u.aK.setX(e,e)}let d={uPattern:{value:be[n.pattern||`wave`]??0},uSpeed:{value:n.speed??.25},uWaves:{value:n.waves??1},uEvery:{value:n.every??3},uOn:{value:n.density??.3},uBase:{value:n.base??.25},uExcite:{value:0},uGain:{value:n.intensity??.8},uDot:{value:n.size??2},uGlow:{value:n.glow??5},uColor:{value:a}},f=H(e,{name:n.id,vertexShader:xe,fragmentShader:Se,uniforms:d,blend:n.blend||`screen`,grid:n.grid});return{meshes:[q(e,l,f,r)],update(t){d.uExcite.value=e.excite(n.on,t)},dispose(){l.dispose(),f.dispose()}}}var Te=P+F+`
attribute vec4 aRect;     // top-left x, y (plate px), w, h (plate px)
attribute vec4 aFrame;    // atlas rect x, y, w, h (atlas px)
attribute vec4 aParams;   // alpha, flipX, lightPhase, texel px
varying vec2 vP;
varying vec2 vLocal;      // 0..1 inside the sprite
varying vec4 vFrame;
varying vec4 vParams;
void main() {
  vec2 P = aRect.xy + position.xy * aRect.zw;
  vP = P;
  vLocal = position.xy;
  vFrame = aFrame;
  vParams = aParams;
  gl_Position = aParams.x < 0.002 ? vec4(2.0, 2.0, 2.0, 1.0) : plateToClip(P);
}`,Ee=F+I+`
uniform sampler2D tAtlas;
uniform vec2 uAtlasSize;
uniform float uPixel, uSmooth, uExact;
uniform vec3 uTint, uHi, uLo, uAccent;
uniform float uTintAmt;
varying vec2 vP;
varying vec2 vLocal;
varying vec4 vFrame;
varying vec4 vParams;
`+R+`
void main() {
  vec2 l = vLocal;
  if (vParams.y > 0.5) l.x = 1.0 - l.x;
  vec2 tp = vFrame.xy + (uSmooth > 0.5 ? l * vFrame.zw : floor(l * vFrame.zw) + 0.5);
  vec4 s = texture2D(tAtlas, tp / uAtlasSize);
  if (s.a < 0.01) discard;
  vec3 c;
  float a = 1.0;
  if (uPixel > 0.5) {
    float code = s.a * 255.0;
    float t = uTime + vParams.z * 3.0;
    if (code > 240.0) {
      float g = s.r;
      if (uExact > 0.5) {
        // v2: the painting's own colours per tone (body / light / shade / accent)
        c = g > 0.9 ? uHi : (g < 0.3 ? uLo : (g > 0.6 ? uAccent : uTint));
      } else {
        c = g > 0.9 ? mix(uTint, uHi, 0.65) : (g < 0.3 ? mix(uTint, uLo, 0.6) : (g > 0.6 ? mix(uTint, uLo, 0.8) : uTint));
      }
    } else if (code > 175.0) {           // red nav light, slow blink
      a = step(0.55, fract(t * 0.9));
      c = vec3(1.0, 0.24, 0.16);
    } else if (code > 125.0) {           // white strobe
      a = step(0.9, fract(t * 0.9 + 0.37));
      c = vec3(1.0);
    } else {                             // warm lamp
      c = vec3(1.0, 0.84, 0.55) * (0.92 + 0.08 * sin(t * 2.3));
    }
  } else {
    c = mix(s.rgb, s.rgb * uTint, uTintAmt);
    a = s.a;
  }
  a *= vParams.x * maskAt(vP);
  emit(c, a);
}`;function De(e,t,n){let r=e.speed??30,i=t=>e.duration??n[t].length/Math.max(r,.001),a=i(0),o=Math.max(...n.map((e,t)=>i(t)))*(1+(e.speedJitter??0)),s=e.mode||`interval`,c=e.start??0,[l,u]=e.interval||[20,40],d=k(t.seedOf(`${e.id}:schedule`)),f=k(t.seedOf(`${e.id}:pass`)),p=Math.max(0,Math.min(.5,e.speedJitter??0)),m=[],h=e.reverse===!0,g=e.reverse===`random`,_=c;function v(e){for(;_<=e+o&&m.length<1e5;){let e=g?d.next()<.5:h,t=n.length>1?Math.floor(f.next()*n.length):0,r=i(t)*(p?1+p*(f.next()*2-1):1);m.push({t0:_,rev:e,dur:r,pi:t}),_+=r+d.float(l,u)}}return function(t,n=0){let r=t-n;if(r<c)return null;if(s===`loop`){let e=(r-c)/a,t=Math.floor(e);return{u:e-t,rev:h,n:t,pi:0}}if(s===`pingpong`){let t=(r-c)/a+(e.homeT??0),n=Math.floor(t),i=t-n;return{u:n%2==0?i:1-i,rev:!1,n:0,pi:0,dir:n%2==0?1:-1}}v(r);let i=0,o=m.length-1;if(o<0||m[0].t0>r)return null;for(;i<o;){let e=i+o+1>>1;m[e].t0<=r?i=e:o=e-1}let l=m[i],u=(r-l.t0)/l.dur;return u>1?null:{u,rev:l.rev,n:i,pi:l.pi}}}function Oe(e,t){let n=t.colors;if(typeof n==`string`&&(n=e.roles?.[n]||null),!n||typeof n!=`object`)return null;let r=n.body??t.color??`#2a1a26`;return{body:r,light:n.light??r,shade:n.shade??r,accent:n.accent??n.shade??r}}function ke(e,t,n){let r=(Array.isArray(t.paths)&&t.paths.length?t.paths:[t.path||[[0,0],[100,0]]]).map(N),i=t.flock||{},a=Math.max(1,Math.min(16,i.count??1)),{geometry:o,attrs:s}=K(a,{aRect:4,aFrame:4,aParams:4}),c=Array.isArray(t.sprite)?t.sprite.filter(e=>typeof e==`string`):null,l=typeof t.sprite==`string`||!!(c&&c.length),u=l?Oe(e,t):null,d,f,p=[];if(l){let n=e.atlas;d=n?.texture||e.blank,f=n?.size||[1,1];for(let r of c||[t.sprite])p.push({frames:n?.frames[r]||[{x:0,y:0,w:1,h:1}],fps:t.fps??e.pixelSpriteFps(r),glide:t.glideFrame??Q[r]?.glide??0})}else{let n=t.sprite||{};d=e.textures.files[n.file]||e.blank;let[r,i]=d.userData?.size||[1,1],a=Math.max(1,n.frames||1),o=r/a;p.push({frames:Array.from({length:a},(e,t)=>({x:t*o,y:0,w:o,h:i})),fps:n.fps??t.fps??0,glide:0}),f=[r,i]}let m=l?re(e,t.px,e.art):re(e,(t.sprite||{}).px??t.px,.5),h=j(u?u.body:t.color||(l?`#2a1a26`:`#ffffff`),e.palette),g={...J(e,t.occlude),tAtlas:{value:d},uAtlasSize:{value:new w(...f)},uPixel:{value:+!!l},uSmooth:{value:+(!l&&m<1)},uExact:{value:+!!u},uTint:{value:h},uHi:{value:j(u?u.light:t.highlight||`#ffd9a8`,e.palette)},uLo:{value:j(u?u.shade:t.shade||`#120a14`,e.palette)},uAccent:{value:j(u?u.accent:t.shade||`#120a14`,e.palette)},uTintAmt:{value:t.color&&!l?1:0}},_=H(e,{name:t.id,vertexShader:Te,fragmentShader:Ee,uniforms:g,blend:t.blend||`alpha`,grid:t.grid}),v=q(e,o,_,n),y=De(t,e,r),b=k(e.seedOf(`${t.id}:flock`)),[x,S]=i.spread||[22,10],C=i.formation||`v`,T=Array.from({length:a},(e,t)=>{let n=p[t%p.length];if(t===0)return{dx:0,dy:0,lag:0,ph:b.next(),bob:b.next()*6.28,look:n,fk:1,wph:[0,0]};let r=t%2==0?1:-1,a=Math.ceil(t/2),o,s;return C===`line`?(o=-t*x*(.8+.4*b.next()),s=(b.next()*2-1)*S*.3):C===`loose`?(o=-(.2+.9*b.next())*x*a,s=(b.next()*2-1)*S*(.6+a*.5)):(o=-a*x*(.8+.4*b.next()),s=r*a*S*(.7+.6*b.next())),{dx:o,dy:s,lag:(i.lag??.15)*a*b.next(),ph:b.next(),bob:b.next()*6.28,look:n,fk:1,wph:[0,0]}}),E=k(e.seedOf(`${t.id}:flock2`)),D=t.fpsJitter??(e.styled?.15:0);for(let e of T)e.fk=1+D*(E.next()*2-1),e.wph=[E.next()*6.28,E.next()*6.28];let O=Array.isArray(i.sizes)&&i.sizes.length?i.sizes:null,[M,ee]=i.wander||[0,0],[P,F]=Array.isArray(t.scale)?t.scale:[t.scale??1,t.scale??1],[I,L]=Array.isArray(t.alpha)?t.alpha:[t.alpha??1,t.alpha??1],[R,z]=t.bob||[0,0],B=t.snap??(l&&e.styled?`art`:!0),V=B===`art`?e.art:typeof B==`number`?B:+!!B,[te,ne]=e.gridOffset||[0,0],U=(e,t)=>V>0?Math.round((e-t)/V)*V+t:e,ie=t.flipX??`auto`,W=t.fadeEnds??.04,G=t.anchor||typeof t.sprite==`object`&&!Array.isArray(t.sprite)&&t.sprite.anchor||[.5,.5],[Y,X]=t.glide||[0,0];function ae(e,t){let n=e.look,r=n.frames.length,i=n.fps*e.fk;if(!(i>0))return n.frames[0];let a=t+e.ph*10;if(X>0){let e=r/i,t=Math.max(1,Math.round(Y/e))*e,o=t+X,s=(a%o+o)%o;return s>=t?n.frames[n.glide%r]:n.frames[Math.floor(s*i)%r]}return n.frames[Math.floor(a*i)%r]}return{meshes:[v],update(n){let i=!1,o=e.excite(t.on,n);for(let e=0;e<a;e++){let t=T[e],a=y(n,t.lag);if(!a||O&&e>=O[Math.floor(A(a.n+.5,17.3)*O.length)]){s.aParams.setXYZW(e,0,0,0,0);continue}let c=r[a.pi]||r[0],u=a.rev?1-a.u:a.u,d=c.at(u),f=a.rev?-d.tx:d.tx,p=a.rev?-d.ty:d.ty;a.dir===-1&&(f=-f,p=-p);let h=P+(F-P)*a.u,g=(I+(L-I)*a.u)*Math.min(1,a.u/W,(1-a.u)/W)*(1+o),_=V>0&&l?Math.max(1,Math.round(m*h)):m*h,v=ae(t,n),b=v.w*_,x=v.h*_,S=t.dx,C=t.dy;e>0&&(M||ee)&&(S+=M*Math.sin(n*.21+t.wph[0]),C+=ee*Math.sin(n*.17+t.wph[1]));let w=S*h*f-C*h*p,E=S*h*p+C*h*f,D=ie===`auto`?+(f<0):+!!ie,k=D?1-G[0]:G[0],j=d.x+w-b*k,N=d.y+E-x*G[1]+(R?R*Math.sin(n*z*6.2831+t.bob):0);j=U(j,te),N=U(N,ne),s.aRect.setXYZW(e,j,N,b,x),s.aFrame.setXYZW(e,v.x,v.y,v.w,v.h),s.aParams.setXYZW(e,Math.max(0,g),D,t.ph,_),i=!0}s.aRect.needsUpdate=!0,s.aFrame.needsUpdate=!0,s.aParams.needsUpdate=!0,v.visible=i},dispose(){o.dispose(),_.dispose()}}}var Ae={dot:0,glow:1,soft:2,sprite:3},je=P+F+`
attribute vec4 aSeed;
uniform float uRegion;    // 0 rect, 1 ellipse, 2 cone
uniform vec4 uRect;       // rect x, y, w, h | ellipse cx, cy, rx, ry
uniform vec4 uCone;       // apex x, y, unit dir x, y
uniform vec4 uCone2;      // length, half width at apex, half width at end, falloff
uniform vec2 uLife;
uniform vec2 uVel;
uniform vec2 uWander;
uniform float uWanderF;
uniform vec2 uSizeR;
uniform float uTwinkle, uTwinkleF, uExcite, uGain, uGlow, uFrames, uFps, uColors;
varying vec2 vP;
varying vec2 vC;
varying float vSize;
varying float vA;
varying float vCol;
varying float vFrame;
varying vec2 vLocal;
void main() {
  float L = mix(uLife.x, uLife.y, aSeed.x);
  float tt = uTime + aSeed.y * L * 7.0;
  float cyc = floor(tt / L);
  float age = tt - cyc * L;
  float f = age / L;
  vec2 r = hash22(aSeed.zw * 131.7 + cyc * 1.37);
  vec2 p0;
  float w = 1.0;
  if (uRegion < 0.5) {
    p0 = uRect.xy + r * uRect.zw;
  } else if (uRegion < 1.5) {
    float ang = r.x * 6.2831853;
    p0 = uRect.xy + vec2(cos(ang), sin(ang)) * sqrt(r.y) * uRect.zw;
  } else {
    float u = mix(r.x, sqrt(r.x), 0.5);
    float v = r.y * 2.0 - 1.0;
    float hw = mix(uCone2.y, uCone2.z, u);
    vec2 dir = uCone.zw;
    p0 = uCone.xy + dir * u * uCone2.x + vec2(-dir.y, dir.x) * v * hw;
    w = (1.0 - v * v) * (1.0 - u * uCone2.w);
  }
  float wf = uWanderF * 6.2831853;
  vec2 wob = uWander * vec2(sin(age * wf + aSeed.z * 6.2831), sin(age * wf * 0.77 + aSeed.w * 6.2831));
  vec2 c = p0 + uVel * age + wob;
  float tw = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * uTwinkleF * 6.2831 * (0.6 + aSeed.w) + aSeed.z * 40.0));
  float a = smoothstep(0.0, 0.18, f) * (1.0 - smoothstep(0.72, 1.0, f)) * w * tw * uGain * (1.0 + uExcite);
  vSize = mix(uSizeR.x, uSizeR.y, hash11(aSeed.x * 91.3 + cyc));
  vA = a;
  vC = c;
  vCol = floor(hash11(aSeed.z * 17.1 + cyc * 0.31) * uColors);
  vFrame = uFps > 0.0 ? mod(floor((uTime + aSeed.y * 10.0) * uFps * (0.7 + 0.6 * aSeed.x)), uFrames) : floor(aSeed.x * uFrames);
  float ext = vSize * 0.5 + uGlow * 2.2 + uGrid;
  vLocal = position.xy;
  vec2 P = c + (position.xy - 0.5) * 2.0 * ext;
  vP = P;
  gl_Position = a < 0.002 ? vec4(2.0, 2.0, 2.0, 1.0) : plateToClip(P);
}`,Me=F+I+`
uniform float uShape, uGlow, uLevels;
uniform vec3 uColor[4];
uniform sampler2D tAtlas;
uniform vec2 uAtlasSize;
uniform vec4 uFrameRect[4];
uniform vec3 uHi, uLo;
varying vec2 vP;
varying vec2 vC;
varying float vSize;
varying float vA;
varying float vCol;
varying float vFrame;
varying vec2 vLocal;
`+R+`
vec3 pickColor(float i) {
  if (i < 0.5) return uColor[0];
  if (i < 1.5) return uColor[1];
  if (i < 2.5) return uColor[2];
  return uColor[3];
}
vec4 pickFrame(float i) {
  if (i < 0.5) return uFrameRect[0];
  if (i < 1.5) return uFrameRect[1];
  if (i < 2.5) return uFrameRect[2];
  return uFrameRect[3];
}
void main() {
  vec3 col = pickColor(vCol);
  float a;
  if (uShape < 0.5 || uShape > 0.5 && uShape < 1.5) {
    // hard pixel core on the painting grid (+ a soft glow for "glow")
    vec2 d = abs(snapP(vP) - snapP(vC));
    float core = step(max(d.x, d.y), max(vSize * 0.5, uGrid * 0.5) - 0.01);
    a = core;
    if (uShape > 0.5) {
      float r = length(vP - vC) / max(uGlow, 0.5);
      float g = bands(exp(-r * r * 1.6) * 0.5, uLevels, cellOf(vP));
      a = core + g * (1.0 - core);
      col = mix(col, col * 0.75 + 0.25, 1.0 - core);
    }
  } else if (uShape < 2.5) {
    float r = length(snapP(vP) - vC) / max(vSize * 0.5, 0.5);
    a = bands(clamp(1.0 - r * r, 0.0, 1.0), max(uLevels, 3.0), cellOf(vP));
  } else {
    // pixel sprite (texel = uGrid plate px)
    vec4 F = pickFrame(vFrame);
    vec2 tl = floor(vC / uGrid) * uGrid - floor(F.zw * 0.5) * uGrid;
    vec2 tx = floor((vP - tl) / uGrid);
    if (tx.x < 0.0 || tx.y < 0.0 || tx.x >= F.z || tx.y >= F.w) discard;
    vec4 s = texture2D(tAtlas, (F.xy + tx + 0.5) / uAtlasSize);
    if (s.a < 0.5) discard;
    float g = s.r;
    col = g > 0.9 ? mix(col, uHi, 0.6) : (g < 0.3 ? mix(col, uLo, 0.55) : (g > 0.6 ? mix(col, uLo, 0.75) : col));
    a = 1.0;
  }
  emit(col, a * vA * maskAt(vP));
}`;function Ne(e,n,r){let i=e.quality,a=Math.max(1,Math.round(D(n.count,`high`,12))),o=k(e.seedOf(`${n.id}:particles`)),{geometry:s,attrs:c}=K(a,{aSeed:4});for(let e=0;e<a;e++)c.aSeed.setXYZW(e,o.next(),o.next(),o.next(),o.next());let l=n.region||{rect:[0,0,e.size[0],e.size[1]]};if(l.coneOf){let t=e.specById[l.coneOf];l=t?{cone:{apex:t.apex,target:t.target,width:t.width,falloff:l.falloff}}:{rect:[0,0,1,1]}}let u=new t(0,0,1,1),d=new t(0,0,0,1),f=new t(1,1,1,0),p=0;if(l.ellipse)p=1,u.fromArray(l.ellipse);else if(l.cone){p=2;let e=l.cone,t=e.target[0]-e.apex[0],n=e.target[1]-e.apex[1],r=e.length??Math.hypot(t,n),i=Math.hypot(t,n)||1;d.set(e.apex[0],e.apex[1],t/i,n/i);let[a,o]=e.width||[10,80];f.set(r,a,o,e.falloff??l.falloff??.6)}else u.fromArray(l.rect||[0,0,e.size[0],e.size[1]]);let m=(Array.isArray(n.color)?n.color:[n.color||`#fff2d8`]).slice(0,4),h=[0,1,2,3].map(t=>j(m[t%m.length],e.palette)),g=n.shape||`dot`,_=!(g in Ae),v=_&&e.atlas?.frames[g]||[],y=[0,1,2,3].map(e=>{let n=v[e%Math.max(1,v.length)];return n?new t(n.x,n.y,n.w,n.h):new t(0,0,1,1)}),[b,x]=Array.isArray(n.size)?n.size:[n.size??2,n.size??2],[S,C]=Array.isArray(n.life)?n.life:[n.life??6,n.life??6],T={...J(e,n.mask),uRegion:{value:p},uRect:{value:u},uCone:{value:d},uCone2:{value:f},uLife:{value:new w(S,C)},uVel:{value:new w(...n.vel||[0,0])},uWander:{value:new w(...n.wander||[3,3])},uWanderF:{value:n.wanderFreq??.15},uSizeR:{value:new w(b,x)},uTwinkle:{value:n.twinkle??.3},uTwinkleF:{value:n.twinkleFreq??.5},uExcite:{value:0},uGain:{value:n.intensity??.6},uGlow:{value:n.glow??(g===`glow`?4:0)},uLevels:{value:n.levels??0},uFrames:{value:Math.max(1,Math.min(4,v.length||1))},uFps:{value:n.fps??(_?e.pixelSpriteFps(g):0)},uColors:{value:m.length},uShape:{value:_?Ae.sprite:Ae[g]},uColor:{value:h},tAtlas:{value:e.atlas?.texture||e.blank},uAtlasSize:{value:new w(...e.atlas?.size||[1,1])},uFrameRect:{value:y},uHi:{value:j(n.highlight||`#ffffff`,e.palette)},uLo:{value:j(n.shade||`#20141c`,e.palette)}},E=n.blend||(_?`alpha`:`screen`),O=H(e,{name:n.id,vertexShader:je,fragmentShader:Me,uniforms:T,blend:E,grid:n.grid}),A=q(e,s,O,r);function M(e){s.instanceCount=Math.max(0,Math.min(a,Math.round(D(n.count,e,a))))}return M(i),{meshes:[A],setQuality:M,update(t){T.uExcite.value=e.excite(n.on,t),A.visible=s.instanceCount>0},dispose(){s.dispose(),O.dispose()}}}var Pe={drift:0,shimmer:1,haze:2,aurora:3},Fe=F+I+L+oe+`
uniform sampler2D tSrc;
uniform float uSrcFlip, uSrcSRGB, uMode, uPeriod, uPhase, uMatch, uSnap, uWave, uSpeed, uSparkle, uLevels, uGain, uExcite;
uniform vec2 uAmp;
uniform vec4 uPar;
uniform vec2 uFadeY;
uniform vec3 uColA, uColB;
varying vec2 vP;
`+R+`
vec3 srcAt(vec2 P) {
  vec3 c = texture2D(tSrc, texUv(P, uSrcFlip)).rgb;
  return uSrcSRGB > 0.5 ? l2s(c) : c;
}
// sharp-bilinear sample of the source layer (same pixel look as the plate)
vec3 srcSharp(vec2 P) {
  vec2 fw = max(fwidth(P), vec2(1e-4));
  vec2 seam = floor(P + 0.5);
  vec2 sp = seam + clamp((P - seam) / fw, -0.5, 0.5);
  return srcAt(sp);
}
void main() {
  float m = maskAt(vP) * keepOut(vP);
  if (m < 0.01) discard;
  float t = uTime;
  if (uMode < 0.5) {
    // ---- drifting painted clouds ----
    float fy = 1.0 - smoothstep(uFadeY.x, uFadeY.y, vP.y);
    if (fy < 0.001) discard;
    float par = mix(uPar.z, uPar.w, clamp((vP.y - uPar.x) / (uPar.y - uPar.x), 0.0, 1.0));
    vec2 d = uAmp * sin(6.2831853 * t / uPeriod + uPhase) * par * fy;
    if (uSnap > 0.0) d = floor(d / uSnap + 0.5) * uSnap;
    if (abs(d.x) + abs(d.y) < 0.01) discard;
    vec3 here = plateAt(vP);
    if (uMatch > 0.0) {
      vec3 s0 = srcAt(vP);
      vec3 dd = abs(s0 - here);
      m *= 1.0 - smoothstep(uMatch, uMatch * 2.5, max(dd.r, max(dd.g, dd.b)));
    }
    vec3 c = srcSharp(vP + d);
    emit(c, m);
  } else if (uMode < 1.5) {
    // ---- water shimmer ----
    float n = vnoise(vec2(vP.x * 0.02, vP.y * 0.08 - t * 0.3));
    vec2 sp = snapP(vP);
    float wav = sin(sp.y * 6.2831853 / uWave + t * uSpeed * 6.2831853 + n * 5.0);
    vec2 d = vec2(wav * uAmp.x, wav * uAmp.y * 0.5);
    if (uSnap > 0.0) d = floor(d / uSnap + 0.5) * uSnap;
    vec3 c = plateAt(vP + d);
    if (uSparkle > 0.0) {
      vec2 cell = cellOf(vP);
      float h = hash12(cell);
      float s = step(1.0 - uSparkle * (1.0 + uExcite), hash12(cell + floor(t * (1.5 + h * 2.0) + h * 7.0)));
      c += uColA * s * smoothstep(0.15, 0.5, luma(c)) * uGain;
    }
    emit(c, m);
  } else if (uMode < 2.5) {
    // ---- heat haze ----
    vec2 q = vP * 0.05 + vec2(0.0, t * uSpeed);
    vec2 d = (vec2(vnoise(q), vnoise(q + 7.3)) - 0.5) * 2.0 * uAmp;
    if (uSnap > 0.0) d = floor(d / uSnap + 0.5) * uSnap;
    emit(plateAt(vP + d), m);
  } else {
    // ---- aurora: a curtain with a wavy lower hem, bright at the hem, rays fading upward ----
    float span = max(uFadeY.y - uFadeY.x, 1.0);
    float x = vP.x;
    float ts = t * uSpeed;
    float hem = uFadeY.y - span * 0.25 + span * (0.12 * sin(x * 0.006 + ts * 0.35) + 0.07 * sin(x * 0.017 - ts * 0.5));
    float h = (hem - vP.y) / span;                       // height above the hem (0..1)
    float curtain = exp(-max(h, 0.0) * 3.2) * smoothstep(-0.03, 0.02, h);
    float rays = 0.55 + 0.45 * vnoise(vec2(x * 0.035, ts * 0.6)) * (0.7 + 0.3 * sin(x * 0.11 + ts));
    float fold = 0.75 + 0.25 * sin(x * 0.004 - ts * 0.2);
    vec3 c = mix(uColA, uColB, clamp(h * 1.6, 0.0, 1.0));
    float a = bands(clamp(curtain * rays * fold, 0.0, 1.0), uLevels, cellOf(vP)) * uGain;
    emit(c, a * m);
  }
}`;function Ie(e,n,r){let i=n.mode||`drift`,a=X(n.rect||n.region,[0,0,e.size[0],e.size[1]]),o=n.source||(i===`drift`?`skyLayer`:`plate`),s=Y(e,`plate`),c=Y(e,o),l=n.parallax||{},u=n.fadeY||[a[1]+a[3]*.8,a[1]+a[3]],d={uRect:{value:new t(...a)},...J(e,n.mask===void 0?i===`drift`&&(n.source||`skyLayer`)===`skyLayer`?`sky`:null:n.mask),...s,tSrc:c.tPlate,uSrcFlip:c.uPlateFlip,uSrcSRGB:c.uPlateSRGB,uMode:{value:Pe[i]??0},uAmp:{value:new w(...Array.isArray(n.amp)?n.amp:[n.amp??(i===`drift`?30:1.5),0])},uPeriod:{value:n.period??160},uPhase:{value:n.phase??0},uPar:{value:new t(l.y0??a[1]+a[3],l.y1??a[1],l.k0??.3,l.k1??1)},uFadeY:{value:new w(u[0],u[1])},uMatch:{value:n.match===!1?0:n.match??(i===`drift`&&o===`skyLayer`?.05:0)},uSnap:{value:n.snap??1},uWave:{value:n.wavelength??6},uSpeed:{value:n.speed??(i===`aurora`?.15:.6)},uSparkle:{value:n.sparkle??0},uLevels:{value:n.levels??0},uGain:{value:n.intensity??(i===`aurora`?.35:.6)},uExcite:{value:0},uColA:{value:j((n.colors||[])[0]||n.color||`#fff4dc`,e.palette)},uColB:{value:j((n.colors||[])[1]||`#7ef0c8`,e.palette)},uExcl:{value:ae(n.exclude)},uExclSoft:{value:n.excludeSoft??.35}},f=n.blend||(i===`aurora`?`screen`:`alpha`),p=H(e,{name:n.id,fragmentShader:Fe,uniforms:d,blend:f,grid:n.grid});return{meshes:[q(e,W(),p,r)],update(t){d.uExcite.value=e.excite(n.on,t)},dispose(){p.dispose(),G()}}}var Le=P+F+`
attribute vec4 aSeed;
uniform vec2 uOrigin;
uniform float uLife, uRise, uWobble, uGain, uCount, uSpread;
uniform vec2 uWind;
uniform vec2 uSizeR;
varying vec2 vP;
varying vec2 vC;
varying float vR;
varying float vA;
varying float vK;
void main() {
  // puffs are evenly staggered along the life so the plume is continuous
  float tt = uTime + aSeed.x * uLife;
  float cyc = floor(tt / uLife);
  float age = tt - cyc * uLife;
  float f = age / uLife;
  float h = hash11(aSeed.y * 71.0 + cyc * 3.1);
  vec2 wob = vec2(sin(age * 1.3 + h * 6.28), 0.0) * uWobble * f;
  vec2 c = uOrigin + vec2((h - 0.5) * uSpread, 0.0) + vec2(0.0, -uRise * age) + uWind * pow(age, 1.35) + wob;
  float r = mix(uSizeR.x, uSizeR.y, pow(f, 0.7)) * (0.8 + 0.4 * h);
  vA = smoothstep(0.0, 0.12, f) * (1.0 - smoothstep(0.45, 1.0, f)) * uGain;
  vC = c;
  vR = r;
  vK = f;
  vec2 P = c + (position.xy - 0.5) * 2.0 * (r + uGrid);
  vP = P;
  gl_Position = vA < 0.002 ? vec4(2.0, 2.0, 2.0, 1.0) : plateToClip(P);
}`,Re=F+I+`
uniform vec3 uColA, uColB;
uniform float uLevels;
varying vec2 vP;
varying vec2 vC;
varying float vR;
varying float vA;
varying float vK;
`+R+`
void main() {
  vec2 sp = snapP(vP);
  float r = length(sp - vC) / max(vR, 0.5);
  float a = clamp(1.0 - r * r, 0.0, 1.0);
  a *= 0.75 + 0.25 * vnoise(sp * 0.25 + vC * 0.05);
  a = bands(a, uLevels, cellOf(vP));
  vec3 c = mix(uColA, uColB, vK);
  emit(c, a * vA * maskAt(vP));
}`;function ze(e,t,n){let r=Math.max(1,Math.round(D(t.count,`high`,12))),i=k(e.seedOf(`${t.id}:smoke`)),{geometry:a,attrs:o}=K(r,{aSeed:4});for(let e=0;e<r;e++)o.aSeed.setXYZW(e,(e*.6180339887+i.next()*.05)%1,i.next(),i.next(),i.next());let[s,c]=t.size||[3,14],l=Array.isArray(t.color)?t.color:[t.color||`#cfc6c2`,t.color||`#cfc6c2`],u={...J(e,t.mask),uOrigin:{value:new w(...t.origin||[0,0])},uLife:{value:t.life??7},uRise:{value:t.rise??9},uWind:{value:new w(...t.wind||[3,0])},uWobble:{value:t.wobble??3},uSpread:{value:t.spread??2},uSizeR:{value:new w(s,c)},uGain:{value:t.intensity??.35},uCount:{value:r},uColA:{value:j(l[0],e.palette)},uColB:{value:j(l[1]??l[0],e.palette)},uLevels:{value:t.levels??4}},d=H(e,{name:t.id,vertexShader:Le,fragmentShader:Re,uniforms:u,blend:t.blend||`alpha`,grid:t.grid}),f=q(e,a,d,n);function p(e){a.instanceCount=Math.max(0,Math.min(r,Math.round(D(t.count,e,r))))}return p(e.quality),{meshes:[f],setQuality:p,update(){f.visible=a.instanceCount>0},dispose(){a.dispose(),d.dispose()}}}var Be={top:0,left:1,right:2,bottom:3},Ve=F+I+L+`
uniform vec4 uRect;
uniform float uAnchor, uAmp, uWave, uSpeed, uStiff, uGust, uSnap, uExcite, uFeather;
uniform vec2 uDir;
varying vec2 vP;
`+R+`
void main() {
  float m = maskAt(vP);
  vec2 rel = (vP - uRect.xy) / uRect.zw;
  vec2 e = min(vP - uRect.xy, uRect.xy + uRect.zw - vP);
  m *= smoothstep(0.0, uFeather, min(e.x, e.y));
  if (m < 0.01) discard;
  float w = uAnchor < 0.5 ? rel.y : uAnchor < 1.5 ? rel.x : uAnchor < 2.5 ? 1.0 - rel.x : 1.0 - rel.y;
  w = pow(clamp(w, 0.0, 1.0), uStiff);
  vec2 sp = snapP(vP);
  float along = uAnchor > 0.5 && uAnchor < 2.5 ? (uAnchor < 1.5 ? sp.x - uRect.x : uRect.x + uRect.z - sp.x) : sp.x;
  float t = uTime;
  float gust = 1.0 + uGust * (0.6 * sin(t * 0.31 + 1.7) + 0.4 * (vnoise(vec2(t * 0.45, uRect.x * 0.01)) - 0.5) * 2.0);
  float s = sin(6.2831853 * (along / uWave - t * uSpeed)) + 0.35 * sin(6.2831853 * (along / (uWave * 0.47) - t * uSpeed * 1.63) + 1.3);
  vec2 d = uDir * s * uAmp * w * gust * (1.0 + uExcite);
  if (uSnap > 0.0) d = floor(d / uSnap + 0.5) * uSnap;
  if (abs(d.x) + abs(d.y) < 0.01) discard;
  emit(plateAt(vP - d), m);
}`;function He(e,n,r){let i=X(n.rect||n.region,[0,0,16,16]),a=n.anchor||`top`,o=n.dir||(a===`top`||a===`bottom`?[.35,1]:[0,1]),s=Math.hypot(o[0],o[1])||1,c={uRect:{value:new t(...i)},...J(e,n.mask),...Y(e,`plate`),uAnchor:{value:Be[a]??0},uAmp:{value:n.amp??1.5},uWave:{value:n.wavelength??40},uSpeed:{value:n.speed??.35},uStiff:{value:n.stiffness??1.2},uGust:{value:n.gust??.4},uSnap:{value:n.snap??1},uExcite:{value:0},uFeather:{value:n.feather??1.5},uDir:{value:new w(o[0]/s,o[1]/s)}},l=H(e,{name:n.id,fragmentShader:Ve,uniforms:c,blend:`alpha`,grid:n.grid});return{meshes:[q(e,W(),l,r)],update(t){c.uExcite.value=e.excite(n.on,t)},dispose(){l.dispose(),G()}}}var Ue=F+I+L+`
uniform vec2 uCell;
uniform float uShimmer, uShimRate, uCheer, uLift, uBob;
varying vec2 vP;
`+R+`
void main() {
  float m = maskAt(vP);
  if (m < 0.03) discard;
  vec2 cell = floor(vP / uCell);
  float h = hash12(cell);
  float t = uTime;
  vec2 d = vec2(0.0);
  if (uCheer > 0.001 && m > 0.6) {
    float jump = step(0.5, hash12(cell + floor(t * (4.0 + h * 3.0))));
    d.y = floor(uCheer * uBob * jump + 0.5);
    // only ever pull crowd pixels (never the rail, the ledges or the stairs next to them)
    if (maskAt(vP + d) < 0.6 || maskAt(vP + d * 0.5) < 0.6) d = vec2(0.0);
  }
  vec3 c = plateAt(vP + d);
  float n = hash12(cell + floor(t * uShimRate * (0.7 + 0.6 * h) + h * 3.0));
  c *= 1.0 + (n - 0.5) * uShimmer + uCheer * uLift * (0.6 + 0.8 * n);
  emit(c, m);
}`,We=P+F+I+`
attribute vec4 aSeed;
uniform vec4 uRegions[4]; // x, y, w, h (flashes pick one of these, then a spot on the crowd mask in it)
uniform float uRegionCount;
uniform vec4 uRegionCdf;  // cumulative area share of the regions (bigger stands get more flashes)
uniform float uIdle, uBurst, uExcite, uDur, uDot, uGlow, uGain, uMinMask;
varying vec2 vP;
varying vec2 vC;
varying float vA;
varying float vBig;
void main() {
  float cyc = mix(0.35, 0.8, aSeed.x);
  float x = uTime / cyc + aSeed.y * 13.0;
  float n = floor(x);
  float f = (x - n) * cyc;                         // s since this slot began
  float rate = uIdle + uBurst * uExcite;           // chance that this instance fires in this slot
  float fire = step(hash12(vec2(aSeed.z * 97.0, n)), rate);
  float start = hash12(vec2(aSeed.w * 51.0, n)) * max(cyc - uDur, 0.0);
  float age = f - start;
  // a pop, then a short afterglow
  float a = fire * step(0.0, age) * step(age, uDur) * (0.35 + 0.65 * exp(-max(age, 0.0) / (uDur * 0.3))) * (1.0 - smoothstep(uDur * 0.6, uDur, age));
  // find a spot on the crowd: a few tries inside one of the regions
  vec2 c = vec2(-1e4);
  float ok = 0.0;
  for (int k = 0; k < 8; k++) {
    vec2 r = hash22(vec2(aSeed.z * 31.0 + float(k) * 7.7, n * 1.31 + aSeed.w));
    float u = hash11(aSeed.x * 13.7 + n * 0.71 + float(k) * 3.3);
    vec4 R = u < uRegionCdf.x ? uRegions[0] : u < uRegionCdf.y ? uRegions[1] : u < uRegionCdf.z ? uRegions[2] : uRegions[3];
    vec2 p = R.xy + r * R.zw;
    if (ok < 0.5 && maskAt(p) > uMinMask) { c = p; ok = 1.0; }
  }
  a *= ok * uGain;
  vA = a;
  vBig = step(0.5, hash11(aSeed.x * 17.0 + n));
  vC = floor(c / uGrid) * uGrid + uGrid * 0.5;
  float ext = uGlow * 2.5 + uDot + uGrid * 2.0;
  vec2 P = vC + (position.xy - 0.5) * 2.0 * ext;
  vP = P;
  gl_Position = a < 0.002 ? vec4(2.0, 2.0, 2.0, 1.0) : plateToClip(P);
}`,Ge=F+`
uniform vec3 uColor;
uniform float uDot, uGlow;
varying vec2 vP;
varying vec2 vC;
varying float vA;
varying float vBig;
`+R+`
void main() {
  vec2 d = abs(snapP(vP) - vC) / uGrid;          // in grid cells
  float core = step(max(d.x, d.y), max(uDot / uGrid * 0.5, 0.5) - 0.01);
  // a little 4-point pixel star on the bigger flashes
  float arms = vBig * step(min(d.x, d.y), 0.1) * step(max(d.x, d.y), 1.1) * 0.55;
  float r = length(vP - vC) / max(uGlow, 0.5);
  float glow = exp(-r * r * 1.5) * 0.5;
  float a = max(max(core, arms), glow);
  emit(mix(uColor, vec3(1.0), core), a * vA);
}`;function Ke(e){let n=e.map(e=>Math.max(1,e[2]*e[3])),r=n.reduce((e,t)=>e+t,0),i=0,a=[0,1,2,3].map(e=>e<n.length?i+=n[e]/r:1);return a[Math.min(3,n.length-1)]=1,new t(...a)}function qe(e,n,r){let i=X(n.rect||n.region,[0,0,e.size[0],e.size[1]]),a=n.mask===void 0?`crowd`:n.mask,o=n.cheer||{},s=n.flashes||{},c=[],l={uRect:{value:new t(...i)},...J(e,a),...Y(e,`plate`),uCell:{value:new w(...n.cell||[3,4])},uShimmer:{value:n.shimmer??.07},uShimRate:{value:n.shimmerRate??3},uCheer:{value:0},uLift:{value:o.lift??.12},uBob:{value:o.bob??2}},u=H(e,{name:`${n.id}:crowd`,fragmentShader:Ue,uniforms:l,blend:`alpha`,grid:n.grid});c.push(q(e,W(),u,r));let d=Math.max(1,Math.round(D(s.count,`high`,36))),f=(s.rects||[X(s.rect,i)]).slice(0,4),{geometry:p,attrs:m}=K(d,{aSeed:4}),h=k(e.seedOf(`${n.id}:flashes`));for(let e=0;e<d;e++)m.aSeed.setXYZW(e,h.next(),h.next(),h.next(),h.next());let g={...J(e,a),uRegions:{value:[0,1,2,3].map(e=>new t(...f[e%f.length]))},uRegionCount:{value:Math.min(4,f.length)},uRegionCdf:{value:Ke(f)},uIdle:{value:s.idle??.012},uBurst:{value:s.burst??.35},uExcite:{value:0},uDur:{value:s.duration??.22},uDot:{value:s.size??2},uGlow:{value:s.glow??4},uGain:{value:s.intensity??.9},uMinMask:{value:s.minMask??.5},uColor:{value:j(s.color||`#f6f4ff`,e.palette)}},_=H(e,{name:`${n.id}:flashes`,vertexShader:We,fragmentShader:Ge,uniforms:g,blend:`screen`,grid:s.grid??n.grid}),v=q(e,p,_,r+.5);c.push(v);let y=o.on??n.on??{homerun:[.35,2.6,2.4,1]},b=s.on??n.on??{homerun:[.15,1.8,1.8,1]};function x(e){p.instanceCount=Math.max(0,Math.min(d,Math.round(D(s.count,e,d))))}return x(e.quality),{meshes:c,setQuality:x,update(t){l.uCheer.value=e.excite(y,t),g.uExcite.value=e.excite(b,t)},dispose(){u.dispose(),_.dispose(),p.dispose(),G()}}}var Je=F+I+`
uniform vec2 uC, uR;
uniform vec3 uColor;
uniform float uGain, uHole, uLevels, uSLen, uSThick, uSGain;
uniform vec4 uRays;      // count, amount, sharpness, length (x radius)
uniform float uRaySpin, uRayUp;
varying vec2 vP;
`+R+`
void main() {
  vec2 P = uLevels > 1.5 ? snapP(vP) : vP;
  vec2 d = (P - uC) / uR;
  float r = length(d);
  float a = exp(-r * r * 2.2) * smoothstep(uHole * 0.6, uHole, r);
  if (uSGain > 0.0) {
    float dy = abs(P.y - uC.y);
    float dx = abs(P.x - uC.x);
    a += exp(-dy / max(uSThick, 0.3)) * exp(-dx / max(uSLen, 1.0)) * uSGain * smoothstep(uR.x * 0.3, uR.x * 0.9, dx);
  }
  if (uRays.y > 0.0) {
    // a slow sunburst: soft spokes that turn very slowly and breathe
    float ang = atan(d.y, d.x);
    float spoke = pow(0.5 + 0.5 * cos(uRays.x * ang + uTime * uRaySpin), uRays.z);
    spoke *= 0.75 + 0.25 * sin(uTime * 0.21 + ang * 3.0);
    float upK = uRayUp > 0.5 ? smoothstep(0.35, -0.15, d.y / max(r, 1e-3)) : 1.0;
    a += spoke * upK * uRays.y * exp(-r * r * 2.2 / (uRays.w * uRays.w)) * smoothstep(0.15, 0.6, r);
  }
  a = bands(clamp(a, 0.0, 1.0), uLevels, cellOf(vP));
  emit(uColor, a * uGain * maskAt(vP));
}`,Ye=F+I+`
uniform vec2 uApex, uAxis2;
uniform float uLen, uW0, uW1, uFall, uShafts, uGain, uLevels;
uniform vec3 uColor;
varying vec2 vP;
`+R+`
void main() {
  vec2 P = uLevels > 1.5 ? snapP(vP) : vP;
  vec2 v = P - uApex;
  float s = dot(v, uAxis2) / uLen;
  if (s < 0.0 || s > 1.0) discard;
  float perp = v.x * uAxis2.y - v.y * uAxis2.x;
  float hw = mix(uW0, uW1, s);
  float x = perp / hw;
  float a = exp(-x * x * 2.0) * pow(1.0 - s, uFall) * smoothstep(0.0, 0.06, s);
  if (uShafts > 0.0) {
    float n = vnoise(vec2(x * 2.5 + uTime * 0.05, s * 1.5 - uTime * 0.04));
    a *= 1.0 + uShafts * (n - 0.5) * 2.0;
  }
  a = bands(clamp(a, 0.0, 1.0), uLevels, cellOf(vP));
  emit(uColor, a * uGain * maskAt(vP));
}`;function Xe(e,t,n){let[r,i]=e.pulse||[.06,.12];return 1+r*(.65*Math.sin(t*i*6.2831853+n)+.35*Math.sin(t*i*2.71*6.2831853+n*1.7))}function Ze(e,n,r){let[i,a]=n.center||[0,0],[o,s]=Array.isArray(n.radius)?n.radius:[n.radius??60,n.radius??60],c=n.streak||null,l=n.rays||null,u=Math.max(1.9,l?1.3*(l.length??2.2):0),d=Math.max(o*u,c?(c.length??o*2)*3.5:0),f=l?.up??!1,p=[i-d,a-s*u,2*d,s*u+(f?s*1.9:s*u)],m={uRect:{value:new t(...p)},...J(e,n.mask),uC:{value:new w(i,a)},uR:{value:new w(o,s)},uColor:{value:j(n.color||`#ffe6bf`,e.palette)},uGain:{value:0},uHole:{value:n.hole??0},uLevels:{value:n.levels??0},uSLen:{value:c?c.length??o*2:1},uSThick:{value:c?c.thickness??2:1},uSGain:{value:c?c.intensity??.3:0},uRays:{value:new t(l?.count??7,l?l.amount??.5:0,l?.sharpness??6,l?.length??2.2)},uRaySpin:{value:l?.spin??.02},uRayUp:{value:+!!f}},h=H(e,{name:n.id,fragmentShader:Je,uniforms:m,blend:n.blend||`screen`,grid:n.grid}),g=q(e,W(),h,r),_=e.seedOf(n.id)%1e3/159,v=n.intensity??.25,y=n.boost??.6;return{meshes:[g],update(t){m.uGain.value=v*Xe(n,t,_)*(1+y*e.excite(n.on,t))},dispose(){h.dispose(),G()}}}function Qe(e,t,n){let[r,i]=t.apex||[0,0],[a,o]=t.target||[0,100],s=Math.hypot(a-r,o-i)||1,[c,l]=t.width||[10,80],u=(a-r)/s,d=-((o-i)/s),f=u,p=1.6,m=V([[r+d*c*p,i+f*c*p],[a+d*l*p,o+f*l*p],[a-d*l*p,o-f*l*p],[r-d*c*p,i-f*c*p]]),h={...J(e,t.mask),uApex:{value:new w(r,i)},uAxis2:{value:new w((a-r)/s,(o-i)/s)},uLen:{value:s},uW0:{value:c},uW1:{value:l},uFall:{value:t.falloff??1.2},uShafts:{value:t.shafts??.35},uGain:{value:0},uLevels:{value:t.levels??0},uColor:{value:j(t.color||`#ffe9c4`,e.palette)}},g=H(e,{name:t.id,vertexShader:B,fragmentShader:Ye,uniforms:h,blend:t.blend||`screen`,grid:t.grid}),_=q(e,m,g,n),v=e.seedOf(t.id)%1e3/159,y=t.intensity??.08,b=t.boost??.5;return{meshes:[_],update(n){h.uGain.value=y*Xe(t,n,v)*(1+b*e.excite(t.on,n))},dispose(){g.dispose(),m.dispose()}}}var $e=F+I+`
uniform vec3 uColor;
uniform float uFlash, uAmbient, uHorizonY, uLevels;
varying vec2 vP;
`+R+`
void main() {
  if (uFlash < 0.002) discard;
  float m = maskAt(vP);
  // brighter high in the sky, where the bolt lives
  float hk = 0.55 + 0.45 * clamp(1.0 - vP.y / max(uHorizonY, 1.0), 0.0, 1.0);
  float a = (m * hk + uAmbient) * uFlash;
  a = bands(clamp(a, 0.0, 1.0), uLevels, cellOf(vP));
  emit(uColor, a);
}`,et=F+`
uniform vec3 uK;
varying vec2 vP;
`+R+`
void main() { emit(uK, 1.0); }`;function tt(e){if(e<0||e>1.4)return 0;let t=(t,n,r)=>e>=t?n*Math.exp(-(e-t)/r):0;return Math.min(1,t(0,1,.05)+t(.09,.5,.04)+t(.21,.85,.08)+t(.21,.18,.45))}function nt(e,n,r){let i=X(n.rect,[0,0,e.size[0],e.size[1]]),a={uRect:{value:new t(...i)},...J(e,n.mask===void 0?`sky`:n.mask),uColor:{value:j(n.color||`#c4ccff`,e.palette)},uFlash:{value:0},uAmbient:{value:n.ambient??.08},uHorizonY:{value:n.horizonY??e.horizonY},uLevels:{value:n.levels??0}},o=H(e,{name:n.id,fragmentShader:$e,uniforms:a,blend:n.blend||`screen`,grid:n.grid}),s=q(e,W(),o,r),c=n.intensity??.55,l=typeof n.on==`string`?n.on:`lightning`,u=n.auto?[]:null;if(u){let t=k(e.seedOf(`${n.auto.seed||n.id}:auto`)),[r,i]=n.auto.interval||[9,22],a=n.auto.start??t.float(r,i);for(let e=0;e<400;e++)u.push({t:a,k:t.float(.5,1)}),a+=t.float(r,i)}return{meshes:[s],update(t){let n=0;for(let r of e.eventsOf(l))n=Math.max(n,tt(t-r.t)*(r.payload?.intensity??1));if(u)for(let e of u)t>=e.t&&t-e.t<1.5&&(n=Math.max(n,tt(t-e.t)*e.k));a.uFlash.value=n*c,s.visible=n>.002},dispose(){o.dispose(),G()}}}function rt(e,n,r){let i=X(n.rect,[0,0,e.size[0],e.size[1]]),a=new s(1,1,1),o={uRect:{value:new t(...i)},uK:{value:a}},c=H(e,{name:n.id,fragmentShader:et,uniforms:o,blend:`mul2`,grid:n.grid}),l=q(e,W(),c,r),u=n.amp??.01,d=n.period??12,f=n.tint||[0,0,0];return{meshes:[l],update(e){let t=2*Math.PI*e,n=.65*Math.sin(t/d)+.35*Math.sin(t/(d*2.37)+1.1),r=Math.sin(t/(d*3.1)+.4);a.set(1+u*n+f[0]*r,1+u*n+f[1]*r,1+u*n+f[2]*r),l.visible=Math.max(Math.abs(a.x-1),Math.abs(a.y-1),Math.abs(a.z-1))>.003},dispose(){c.dispose(),G()}}}var it={0:[1,1,1,1,1,1,0],1:[0,1,1,0,0,0,0],2:[1,1,0,1,1,0,1],3:[1,1,1,1,0,0,1],4:[0,1,1,0,0,1,1],5:[1,0,1,1,0,1,1],6:[1,0,1,1,1,1,1],7:[1,1,1,0,0,0,0],8:[1,1,1,1,1,1,1],9:[1,1,1,1,0,1,1]},at=e=>it[e].reduce((e,t,n)=>e|t<<n,0),ot=F+`
uniform vec4 uBox[4];       // digit boxes x, y, w, h (plate px)
uniform float uSegs[4];     // 7-bit segment masks
uniform float uCount, uTh, uFlip, uLevel, uPad, uBright;
uniform vec3 uOn, uRim, uBg;
uniform vec4 uDots;         // dot-matrix LED grid: origin x, y, pitch, line (pitch 0 = off)
uniform float uCorners;     // 1: a, d, g span the full box width (filled corners, like painted dot fonts)
varying vec2 vP;
`+R+`
float bit(float m, float i) { return mod(floor(m / pow(2.0, i)), 2.0); }
// distance-like test: inside segment i of a digit box (local px), with the rim flag
vec2 seg(vec2 l, vec2 s, float th, float i) {
  float hm = s.y * 0.5;
  vec4 r;                                           // x0, y0, x1, y1
  float cx = uCorners > 0.5 ? 0.0 : th;
  if (i < 0.5) r = vec4(cx, 0.0, s.x - cx, th);                        // a
  else if (i < 1.5) r = vec4(s.x - th, th * 0.5, s.x, hm - 1.0);       // b
  else if (i < 2.5) r = vec4(s.x - th, hm + 1.0, s.x, s.y - th * 0.5); // c
  else if (i < 3.5) r = vec4(cx, s.y - th, s.x - cx, s.y);             // d
  else if (i < 4.5) r = vec4(0.0, hm + 1.0, th, s.y - th * 0.5);       // e
  else if (i < 5.5) r = vec4(0.0, th * 0.5, th, hm - 1.0);             // f
  else r = vec4(cx, hm - th * 0.5, s.x - cx, hm + th * 0.5);           // g
  float inside = step(r.x, l.x) * step(l.x, r.z) * step(r.y, l.y) * step(l.y, r.w);
  float edge = min(min(l.x - r.x, r.z - l.x), min(l.y - r.y, r.w - l.y));
  return vec2(inside, step(edge, 1.0));
}
void main() {
  if (uLevel < 0.5) discard;
  for (int k = 0; k < 4; k++) {
    if (float(k) >= uCount) break;
    vec4 B = uBox[k];
    vec2 l = floor(vP - B.xy) + 0.5;
    if (l.x < -uPad || l.y < -uPad || l.x > B.z + uPad || l.y > B.w + uPad) continue;
    float m = uSegs[k];
    // scramble while the board clicks over
    if (uFlip > 0.0) m = floor(hash12(vec2(float(k) * 7.0, floor(uFlip * 14.0))) * 128.0);
    vec3 c = uBg * (0.94 + 0.06 * hash12(floor(vP)));
    for (int i = 0; i < 7; i++) {
      if (bit(m, float(i)) < 0.5) continue;
      vec2 s = seg(l, B.zw, uTh, float(i));
      if (s.x > 0.5) {
        if (uDots.z > 0.5) {
          // LED cells: the grid lines between cells show the rim colour
          vec2 g = mod(vP - uDots.xy, uDots.z); // continuous: a thin line never falls between screen pixels
          float line = step(uDots.z - uDots.w, max(g.x, g.y));
          c = mix(c, line > 0.5 ? uRim : uOn, uBright);
        } else c = mix(c, s.y > 0.5 ? uRim : uOn, uBright);
      }
    }
    emit(c, 1.0);
    return;
  }
  discard;
}`;function st(e,n,r){let i=(n.digits||[]).slice(0,4),a=n.pad??2,o=Math.min(...i.map(e=>e[0]))-a,s=Math.min(...i.map(e=>e[1]))-a,c=Math.max(...i.map(e=>e[0]+e[2]))+a,l=Math.max(...i.map(e=>e[1]+e[3]))+a,u={uRect:{value:new t(o,s,c-o,l-s)},uBox:{value:[0,1,2,3].map(e=>new t(...i[e]||[0,0,0,0]))},uSegs:{value:[0,0,0,0]},uCount:{value:i.length},uTh:{value:n.thickness??5},uDots:{value:new t(...n.dots?.origin||[o+a,s+a],n.dots?.pitch??0,n.dots?.line??1)},uCorners:{value:+!!n.corners},uPad:{value:a},uFlip:{value:0},uLevel:{value:0},uBright:{value:1},uOn:{value:j(n.color||`#ffb530`,e.palette)},uRim:{value:j(n.rim||`#d77f1d`,e.palette)},uBg:{value:j(n.background||`#26252f`,e.palette)}},d=H(e,{name:n.id,fragmentShader:ot,uniforms:u,blend:`alpha`,grid:1}),f=q(e,W(),d,r),p=n.on?typeof n.on==`string`?[n.on]:Object.keys(n.on):[`homerun`,`derby:update`,`scoreboard`],m=n.field||`hr`,h=n.flip??.7,g=n.flipStyle||`blink`,_=e=>{let t=String(e).padStart(i.length,n.blankLeading?` `:`0`);return[0,1,2,3].map(e=>t[e]!=null&&it[t[e]]?at(Number(t[e])):0)},v=[0,0,0,0],y=[0,0,0,0],b=null,x=-1e9;return{meshes:[f],update(t){let r=null,a=-1e9;for(let n of[...p,`scoreboard`])for(let i of e.eventsOf(n)){let e=i.payload?.[n===`scoreboard`?`value`:m]??i.payload?.value;typeof e==`number`&&i.t>=a&&i.t<=t&&(r=e,a=i.t)}if(r==null&&b==null){f.visible=!1;return}r!=null&&r!==b&&(x=b==null&&String(r).padStart(i.length,`0`)===String(n.painted??``)?-1e9:a,v=b==null?_(n.painted??``):y,b=r,y=_(Math.max(0,Math.floor(r))%10**i.length));let o=t-x;if(u.uLevel.value=1,u.uFlip.value=0,u.uBright.value=1,u.uSegs.value=y,o>=0&&o<h){if(g===`scramble`)u.uFlip.value=o+.001;else{let e=o/h;e<.2?(u.uSegs.value=v,u.uBright.value=1-e/.2):e<.4?u.uBright.value=0:e<.55?u.uBright.value=1:e<.68?u.uBright.value=.15:u.uBright.value=1}}},dispose(){d.dispose(),G()}}}var ct=F+I+L+`
uniform vec4 uObj;        // object rect (plate px)
uniform vec2 uD;          // current displacement (whole plate px)
uniform float uLift;      // 0..1
uniform float uFillMode;  // 0 colour, 1 clone
uniform vec2 uClone;
uniform vec4 uZoneRect[3];
uniform vec2 uZoneOff[3];
uniform vec3 uFill;
uniform float uLightUp;
uniform float uCore, uFillMin;
varying vec2 vP;
`+R+`
float inObj(vec2 P) {
  vec2 a = step(uObj.xy, P) * step(P, uObj.xy + uObj.zw);
  return a.x * a.y;
}
void main() {
  vec2 Q = vP - uD;
  float mq = maskAt(Q) * inObj(Q);     // the object, moved here
  float mp = maskAt(vP) * inObj(vP);   // where the object was (vacated unless covered again)
  if (uCore > 0.0) {
    mq = step(uCore, mq);
    mp = step(uFillMin, mp);
  }
  if (mq < 0.01 && mp < 0.01) discard;
  vec2 co = uClone;
  for (int i = 2; i >= 0; i--) {
    vec4 r = uZoneRect[i];
    if (vP.x >= r.x && vP.y >= r.y && vP.x < r.x + r.z && vP.y < r.y + r.w) co = uZoneOff[i];
  }
  vec3 fill = uFillMode > 0.5 ? plateAt(vP + co) : uFill;
  vec3 obj = plateAt(Q) * (1.0 + uLightUp * uLift);
  float a = 1.0 - (1.0 - mp) * (1.0 - mq);
  vec3 c = (fill * mp * (1.0 - mq) + obj * mq) / max(a, 1e-3);
  emit(c, a);
}`;function lt(e,t){let n=t*10;return 1+(n+1)*(e-1)**3+n*(e-1)**2}function ut(e,n,r){let i=X(n.rect||n.region,[0,0,16,16]),a=n.offset||[0,-12],[o,s]=n.bob||[0,0],c=Math.abs(o)+1,l=1+(n.overshoot??0)*1.5,u=Math.min(i[0],i[0]+a[0]*l)-c,d=Math.min(i[1],i[1]+a[1]*l)-c,f=Math.max(i[0]+i[2],i[0]+i[2]+a[0]*l)+c,p=Math.max(i[1]+i[3],i[1]+i[3]+a[1]*l)+c,m=n.fill||{clone:[-(i[2]+8),0]},h={uRect:{value:new t(u,d,f-u,p-d)},uObj:{value:new t(...i)},...J(e,n.mask),...Y(e,`plate`),uD:{value:new w},uLift:{value:0},uFillMode:{value:+!!m.clone},uClone:{value:new w(...m.clone||[0,0])},uFill:{value:j(m.color||`#101018`,e.palette)},uZoneRect:{value:[0,1,2].map(e=>new t(...m.zones?.[e]?.rect||[-1e5,-1e5,0,0]))},uZoneOff:{value:[0,1,2].map(e=>new w(...m.zones?.[e]?.clone||[0,0]))},uLightUp:{value:n.lightUp??0},uCore:{value:n.core??0},uFillMin:{value:n.fillMin??.08}},g=H(e,{name:n.id,vertexShader:z,fragmentShader:ct,uniforms:h,blend:`alpha`,grid:n.grid}),_=q(e,W(),g,r);_.visible=!1;let v=n.on||`homerun`,y=typeof v==`string`?{[v]:[1,3,1.8]}:v,b=n.overshoot??0;function x(t){let n=0;for(let[r,i]of Object.entries(y)){let[a=1,o=3,s=1.8]=i||[];for(let i of e.eventsOf(r)){let e=t-i.t;if(e<0)continue;let r;if(e<a)r=b>0?lt(e/a,b):1-(1-e/a)**3;else if(e<a+o)r=1;else if(e<a+o+s){let t=(e-a-o)/s;r=1-t*t*(3-2*t)}else r=0;n=Math.max(n,r*(i.payload?.intensity??1))}}return n}return{meshes:[_],update(e){let t=x(e),n=o?o*Math.sin(e*s*6.2831853)*Math.min(1,t):0,r=Math.round(a[0]*t),i=Math.round(a[1]*t+(Math.abs(a[1])>=Math.abs(a[0])?n:0)),c=Math.abs(a[0])>Math.abs(a[1])?Math.round(a[0]*t+n):r;h.uD.value.set(c,i),h.uLift.value=Math.max(0,Math.min(1.2,t)),_.visible=c!==0||i!==0},dispose(){g.dispose(),G()}}}var dt=F+I+`
uniform vec4 uBoard;        // x, y, w, h of the board
uniform float uSpill, uSpillLift;
uniform float uLevel;       // 0..1 whole-board level (blink / hold / release)
uniform float uSweep;       // sweep progress 0..1 (< 0: not sweeping)
uniform float uIdleX;       // idle shine centre 0..1 (< -1: none)
uniform float uIdleW, uIdleLift;
uniform float uLift, uHum, uDip, uDipK;
uniform vec3 uTint;
varying vec2 vP;
`+R+`
void main() {
  vec2 lo = uBoard.xy, hi = uBoard.xy + uBoard.zw;
  vec2 q = clamp(vP, lo, hi);
  float dist = length(vP - q);                         // 0 inside the board
  float inside = step(dist, 0.001);
  float m = inside > 0.5 ? maskAt(vP) : 0.0;
  // columns on the painting grid (chunky, like a real LED board switching)
  float xn = (snapP(vP).x - lo.x) / max(uBoard.z, 1.0);
  xn = clamp(xn, 0.0, 1.0);
  float L = uLevel;
  if (uSweep >= 0.0) {
    float lit = 1.0 - smoothstep(uSweep - 0.02, uSweep, xn);
    float edge = exp(-pow((xn - uSweep) / 0.035, 2.0));
    L = max(L, lit * 0.8 + edge * 0.9);
  }
  float shine = 0.0;
  if (uIdleX > -1.0) {
    shine = exp(-pow((xn - uIdleX) / max(uIdleW, 0.01), 2.0)) * uIdleLift;
  }
  // a board pixel's lift: letters (bright) lift more than the backing
  vec3 k = vec3(1.0);
  if (m > 0.0) {
    k += uTint * (L * uLift + shine) * m;
    k *= 1.0 - uDip * uDipK * m;
    k *= 1.0 + uHum * sin(uTime * 5.3 + xn * 2.0) * m;
  }
  // spill: a soft fall-off of the board's light onto its surroundings (only when lit)
  if (uSpill > 0.0 && inside < 0.5) {
    float s = exp(-pow(dist / uSpill, 2.0) * 2.2);
    k += uTint * (L * uLift) * uSpillLift * s;
  }
  emit(k, 1.0);
}`;function ft(e){return e?typeof e==`string`?[e]:Array.isArray(e)?e:Object.keys(e):[`homerun`]}function pt(e,n,r){let i=n.rect||[0,0,10,10],a=n.spill??0,o=[i[0]-a,i[1]-a,i[2]+2*a,i[3]+2*a],c={uRect:{value:new t(...o)},uBoard:{value:new t(...i)},...J(e,n.mask??null),uSpill:{value:a},uSpillLift:{value:n.spillLift??.35},uLevel:{value:0},uSweep:{value:-1},uIdleX:{value:-2},uIdleW:{value:n.idle?.width??.12},uIdleLift:{value:0},uLift:{value:n.lift??.5},uHum:{value:n.hum??0},uDip:{value:0},uDipK:{value:n.dip??.35},uTint:{value:new s(...n.tint||[1,1,1])}},l=H(e,{name:n.id,fragmentShader:dt,uniforms:c,blend:`mul2`,grid:n.grid}),u=q(e,W(),l,r),d=ft(n.on),f=n.delay??.25,p=n.sweep??.6,m=n.blinks??3,h=n.rate??2.5,g=n.duty??.6,_=n.hold??1.2,v=n.release??1,y=p+m/h+_+v,b=n.idle||null,x=[];if(b){let t=k(e.seedOf(`${n.id}:idle`)),[r,i]=b.every||[16,28],a=b.start??r*t.next();for(let e=0;e<4e3&&a<36e3;e++)x.push(a),a+=r+(i-r)*t.next()}let S=b?.travel??1.8;function C(t){let n=null;for(let r of d)for(let i of e.eventsOf(r))i.t<=t&&(!n||i.t>n.t)&&(n=i);return n}return{meshes:[u],update(e){let t=0,r=-1,i=0,a=C(e);if(a){let n=e-a.t-f;if(n>=0&&n<y){if(n<p)r=n/p;else if(n<p+m/h){let e=(n-p)*h%1,r=e<g?Math.min(1,e/.06,(g-e)/.08):0;t=r,i=r>0?0:1}else if(n<p+m/h+_)t=1;else{let e=1-(n-p-m/h-_)/v;t=e*e*(3-2*e)}}}let o=-2,s=0;if(b&&r<0&&t<.01){let t=0,n=x.length-1;for(;t<n;){let r=t+n+1>>1;x[r]<=e?t=r:n=r-1}let r=x[t];if(r!=null&&r<=e&&e-r<S){let t=(e-r)/S;o=-.2+1.4*t,s=(b.lift??.15)*Math.sin(Math.PI*t)}}c.uLevel.value=t,c.uSweep.value=r,c.uDip.value=i,c.uIdleX.value=o,c.uIdleLift.value=s,u.visible=t>.002||r>=0||i>0||s>.002||(n.hum??0)>0},dispose(){l.dispose(),G()}}}var mt=P+F+`
attribute vec4 aSeed;     // x speed/len, y phase, z column, w light pick
attribute float aLight;   // which light (0..3)
uniform vec4 uBox[4];     // spawn box per light (x, y, w, h)
uniform vec2 uSpeed, uLen;
uniform vec2 uDir;        // unit fall direction
uniform float uW, uTwinkle, uGain;
varying vec2 vP;
varying vec2 vHead;
varying float vLen;
varying float vA;
varying float vLight;
vec4 boxOf(float i) {
  if (i < 0.5) return uBox[0];
  if (i < 1.5) return uBox[1];
  if (i < 2.5) return uBox[2];
  return uBox[3];
}
void main() {
  vec4 B = boxOf(aLight);
  float sp = mix(uSpeed.x, uSpeed.y, aSeed.x);
  float len = mix(uLen.x, uLen.y, hash11(aSeed.x * 53.1 + aSeed.z * 7.7));
  // one fall = from above the box to below it (plus the streak length), then respawn at a new column
  float fall = (B.w + len * 2.0) / max(uDir.y, 0.2);
  float T = fall / max(sp, 1.0);
  float tt = uTime + aSeed.y * T * 13.0;
  float cyc = floor(tt / T);
  float age = tt - cyc * T;
  float col = hash12(vec2(aSeed.z * 97.3, cyc * 1.618 + aSeed.w * 11.0));
  // start above the box, shifted up-wind so the slanted streaks still cover the box
  vec2 start = vec2(B.x + col * B.z - uDir.x / max(uDir.y, 0.2) * B.w * 0.5, B.y - len);
  vec2 head = start + uDir * sp * age;
  vHead = head;
  vLen = len;
  vLight = aLight;
  vA = uGain * (1.0 - uTwinkle * hash12(vec2(aSeed.w * 31.0, cyc)));
  // an axis-aligned quad around the streak (+ a grid cell of margin for the pixel snapping)
  vec2 tail = head - uDir * len;
  vec2 lo = min(head, tail) - vec2(uW + uGrid);
  vec2 hi = max(head, tail) + vec2(uW + uGrid);
  vec2 P = mix(lo, hi, position.xy);
  vP = P;
  gl_Position = vA < 0.002 ? vec4(2.0, 2.0, 2.0, 1.0) : plateToClip(P);
}`,ht=F+I+`
uniform vec2 uDir;
uniform float uW, uLevels;
uniform vec3 uColor;
uniform vec4 uLA[4];      // ellipse: cx, cy, rx, ry | cone: apex x, y, axis x, y
uniform vec4 uLB[4];      // cone: length, half width at apex, at end, falloff
uniform vec4 uLT;         // type per light: 0 ellipse, 1 cone
uniform vec4 uLG;         // gain per light
varying vec2 vP;
varying vec2 vHead;
varying float vLen;
varying float vA;
varying float vLight;
`+R+`
float lightAt(vec2 P, vec4 A, vec4 B, float type) {
  if (type < 0.5) {
    vec2 d = (P - A.xy) / A.zw;
    return exp(-dot(d, d) * 2.2);
  }
  vec2 v = P - A.xy;
  float s = dot(v, A.zw) / B.x;
  if (s < 0.0 || s > 1.0) return 0.0;
  float perp = v.x * A.w - v.y * A.z;
  float x = perp / mix(B.y, B.z, s);
  return exp(-x * x * 2.0) * pow(1.0 - s, B.w) * smoothstep(0.0, 0.08, s);
}
float lightOf(vec2 P, float i) {
  if (i < 0.5) return lightAt(P, uLA[0], uLB[0], uLT.x) * uLG.x;
  if (i < 1.5) return lightAt(P, uLA[1], uLB[1], uLT.y) * uLG.y;
  if (i < 2.5) return lightAt(P, uLA[2], uLB[2], uLT.z) * uLG.z;
  return lightAt(P, uLA[3], uLB[3], uLT.w) * uLG.w;
}
void main() {
  // whole painting pixels: the cell centre decides, so the streak is a crisp stair-stepped pixel line
  vec2 P = snapP(vP);
  vec2 rel = P - vHead;
  float along = -dot(rel, uDir);                 // 0 at the head, vLen at the tail
  if (along < -uGrid * 0.5 || along > vLen) discard;
  float across = abs(rel.x * uDir.y - rel.y * uDir.x);
  if (across > max(uW, uGrid) * 0.5 + 0.01) discard;
  // brightest at the head, thinning out toward the tail
  float k = 1.0 - clamp(along / vLen, 0.0, 1.0);
  float a = (0.3 + 0.7 * k) * lightOf(P, vLight) * vA;
  a = bands(clamp(a, 0.0, 1.0), uLevels, cellOf(vP));
  emit(uColor, a * maskAt(vP));
}`;function gt(e,n,r){let i=Math.max(1,Math.round(D(n.count,`high`,60))),a=k(e.seedOf(`${n.id}:rain`)),o=[0,1,2,3].map(()=>new t(-1e5,-1e5,1,1)),s=[0,1,2,3].map(()=>new t(1,1,1,1)),c=new t(0,0,0,0),l=new t(0,0,0,0),u=[0,1,2,3].map(()=>new t(0,0,1,1)),d=[],f=(n.lights||[]).slice(0,4);f.forEach((t,n)=>{let r=t;if(r.coneOf){let t=e.specById[r.coneOf];r=t?{cone:{apex:t.apex,target:t.target,width:t.width,falloff:r.falloff??t.falloff},gain:r.gain}:{ellipse:[-1e5,-1e5,1,1]}}if(l.setComponent(n,r.gain??1),r.cone){let e=r.cone,t=e.target[0]-e.apex[0],i=e.target[1]-e.apex[1],a=Math.hypot(t,i)||1,[l,f]=e.width||[10,80];o[n].set(e.apex[0],e.apex[1],t/a,i/a),s[n].set(a,l,f,e.falloff??1.2),c.setComponent(n,1);let p=-i/a,m=t/a,h=[[e.apex[0]+p*l*1.3,e.apex[1]+m*l*1.3],[e.apex[0]-p*l*1.3,e.apex[1]-m*l*1.3],[e.target[0]+p*f*1.3,e.target[1]+m*f*1.3],[e.target[0]-p*f*1.3,e.target[1]-m*f*1.3]],g=Math.min(...h.map(e=>e[0])),_=Math.min(...h.map(e=>e[1])),v=Math.max(...h.map(e=>e[0])),y=Math.max(...h.map(e=>e[1]));u[n].set(g,_,v-g,y-_),d.push(a*(l+f))}else{let[e,t,i,a]=r.ellipse||[0,0,50,50];o[n].set(e,t,i,a),c.setComponent(n,0),u[n].set(e-i*1.2,t-a*1.2,i*2.4,a*2.4),d.push(i*a*2.4)}});let p=Math.max(1,f.length),m=d.reduce((e,t)=>e+t,0)||1,h=[];d.reduce((e,t,n)=>(h[n]=(e+t)/m,e+t),0);let{geometry:g,attrs:_}=K(i,{aSeed:4,aLight:1});for(let e=0;e<i;e++){let t=[a.next(),a.next(),a.next(),a.next()];_.aSeed.setXYZW(e,t[0],t[1],t[2],t[3]);let n=(e+.5)*.6180339887%1,r=h.findIndex(e=>n<=e);r<0&&(r=p-1),_.aLight.setX(e,r)}let v=(n.angle??6)*Math.PI/180,[y,b]=Array.isArray(n.speed)?n.speed:[n.speed??380,n.speed??380],[x,S]=Array.isArray(n.length)?n.length:[n.length??16,n.length??16],C=n.grid??e.grid,T={...J(e,n.mask),uBox:{value:u},uSpeed:{value:new w(y,b)},uLen:{value:new w(x,S)},uDir:{value:new w(Math.sin(v),Math.cos(v))},uW:{value:(n.width??1)*C},uTwinkle:{value:n.twinkle??.5},uGain:{value:0},uLevels:{value:n.levels??0},uColor:{value:j(n.color||`#dfe8ff`,e.palette)},uLA:{value:o},uLB:{value:s},uLT:{value:c},uLG:{value:l}},E=H(e,{name:n.id,vertexShader:mt,fragmentShader:ht,uniforms:T,blend:n.blend||`screen`,grid:C}),O=q(e,g,E,r);function A(e){g.instanceCount=Math.max(0,Math.min(i,Math.round(D(n.count,e,i))))}A(e.quality);let M=n.intensity??.5,ee=n.boost??.8,N=n.weather?new Set([].concat(n.weather)):null;function P(t){if(!N)return 1;let n=e.eventsOf(`weather:change`).filter(e=>e.t<=t);if(!n.length)return 1;let r=n[n.length-1],i=n.length>1?n[n.length-2]:null,a=e=>e&&N.has(e.payload?.type)?Math.min(1,e.payload?.intensity??1):+!e,o=Math.min(1,(t-r.t)/2);return a(i)+(a(r)-a(i))*o}return{meshes:[O],setQuality:A,update(t){let r=P(t);T.uGain.value=M*r*(1+ee*e.excite(n.on,t)),O.visible=g.instanceCount>0&&T.uGain.value>.002},dispose(){g.dispose(),E.dispose()}}}var _t=F+I+`
uniform float uMaskMin;
uniform vec4 uPip[4];      // cx, cy, r, -
uniform vec4 uLit;         // 0..1 per pip
uniform vec4 uPop;         // extra glow per pip
uniform vec3 uDim;
varying vec2 vP;
`+R+`
void main() {
  float m = smoothstep(uMaskMin, uMaskMin + 0.25, maskAt(vP));
  if (m < 0.01) discard;
  vec3 k = vec3(1.0);
  float hit = 0.0;
  for (int i = 0; i < 4; i++) {
    if (uPip[i].z <= 0.0) continue;
    if (length(vP - uPip[i].xy) < uPip[i].z) {
      k = mix(uDim, vec3(1.0 + uPop[i]), uLit[i]);
      hit = 1.0;
    }
  }
  if (hit < 0.5) discard;
  emit(clamp(k, 0.0, 2.0), m);
}`;function vt(e,n,r){let i=(n.items||[]).slice(0,4),a=Math.min(...i.map(e=>e[0]-e[2]))-2,o=Math.min(...i.map(e=>e[1]-e[2]))-2,c=Math.max(...i.map(e=>e[0]+e[2]))+2,l=Math.max(...i.map(e=>e[1]+e[2]))+2,u=n.dim??.45,d={uRect:{value:new t(a,o,c-a,l-o)},...J(e,n.mask??null),uMaskMin:{value:n.maskMin??.2},uPip:{value:[0,1,2,3].map(e=>i[e]?new t(i[e][0],i[e][1],i[e][2],0):new t(0,0,0,0))},uLit:{value:new t(1,1,1,1)},uPop:{value:new t(0,0,0,0)},uDim:{value:new s(...Array.isArray(u)?u:[u,u,u])}},f=H(e,{name:n.id,fragmentShader:_t,uniforms:d,blend:`mul2`,grid:n.grid}),p=q(e,W(),f,r),m=n.field||`stadiumHr`,h=n.initial??0,g=n.delay??.6,_=n.popTime??.9,v=n.pop??.7;function y(t){let n=[];for(let r of[`homerun`,`derby:update`,`scoreboard`])for(let i of e.eventsOf(r))i.t+g<=t&&n.push({n:r,e:i});n.sort((e,t)=>e.e.t-t.e.t);let r=h,i=h,a=-1e9;for(let{n:e,e:t}of n){let n=t.payload?.[m];typeof n!=`number`&&e===`homerun`&&(n=i+1),typeof n==`number`&&(n>r&&(a=t.t+g),r=n,i=n)}return{v:r,changed:a}}return{meshes:[p],update(e){let{v:t,changed:n}=y(e),r=e-n;for(let e=0;e<4;e++){let n=+(t>e),i=0;if(n&&Math.floor(t)-1===e&&r<_){let e=r/_;n=e<.08?.7:e<.15?.15:e<.22?1:e<.27?.4:1,i=v*(1-e)*(1-e)}d.uLit.value.setComponent(e,n),d.uPop.value.setComponent(e,i)}p.visible=i.some((e,t)=>d.uLit.value.getComponent(t)<.999||d.uPop.value.getComponent(t)>.002)},dispose(){f.dispose(),G()}}}var yt=F+I+`
uniform sampler2D tEarth;
uniform vec4 uCropR;     // x, y, w, h (plate px) of the texture
uniform vec2 uC;
uniform float uR, uAng, uTilt, uShade, uHasTex, uEdge;
varying vec2 vP;
`+R+`
// sharp-bilinear sample of the cleaned disc (same crisp-texel look as the plate), fw = plate px per screen px
vec4 earthAt(vec2 P, vec2 fw) {
  vec2 q = P - uCropR.xy;
  vec2 seam = floor(q + 0.5);
  vec2 sp = seam + clamp((q - seam) / fw, -0.5, 0.5);
  return texture2D(tEarth, clamp(sp, vec2(0.5), uCropR.zw - 0.5) / uCropR.zw);
}
void main() {
  if (uHasTex < 0.5) discard;
  float m = maskAt(vP);
  if (m < 0.5) discard;
  vec2 d = (vP - uC) / uR;
  float r2 = dot(d, d);
  if (r2 >= 1.0) discard;
  // onto the sphere (y up), un-tilt the axis, turn, re-tilt, back to the disc
  float z = sqrt(1.0 - r2);
  float yu = -d.y;
  float ct = cos(uTilt), st = sin(uTilt);
  float y1 = yu * ct + z * st;
  float z1 = -yu * st + z * ct;
  // the turn fades out toward the limb (from uEdge of the radius): the painted atmosphere rim and the limb
  // itself never move, and the surface compresses into them like a real limb (no seam anywhere)
  float ang = uAng * (1.0 - smoothstep(uEdge, 1.0, sqrt(r2)));
  float ca = cos(ang), sa = sin(ang);
  float x2 = d.x * ca - z1 * sa;
  float z2 = d.x * sa + z1 * ca;
  float y3 = y1 * ct - z2 * st;
  // (a point turned onto the far side projects back inside the disc: a mirror of the near side, seamless
  // at the limb; with a swing it never gets far)
  vec2 src = uC + uR * vec2(x2, -y3);
  if (length(src - vP) < 0.02) discard;
  vec2 fw = max(fwidth(vP), vec2(1e-4));
  vec4 s = earthAt(src, fw);
  vec3 c = s.rgb;
  if (uShade > 0.5) {
    float here = earthAt(vP, fw).a;
    float shHere = here * here, shSrc = s.a * s.a;
    c *= clamp((shHere + 0.004) / (shSrc + 0.004), 0.75, 1.35);
  }
  emit(c, 1.0);
}`;function bt(e,n,r){let i=n.crop||[0,0,e.size[0],e.size[1]],a=X(n.rect,i),o=n.texture&&e.textures.files?.[n.texture]||null;o?(o.minFilter=S,o.magFilter=S):n.texture&&console.warn(`[living] globe "${n.id}": texture ${n.texture} not loaded`);let s=Math.PI/180,c={uRect:{value:new t(...a)},...J(e,n.mask??null),tEarth:{value:o||e.blank},uHasTex:{value:+!!o},uCropR:{value:new t(...i)},uC:{value:new w(...n.center||[i[0]+i[2]/2,i[1]+i[3]/2])},uR:{value:n.radius??Math.min(i[2],i[3])/2},uAng:{value:0},uTilt:{value:n.tilt??0},uShade:{value:n.shade===0||n.shade===!1?0:1},uEdge:{value:n.edge??.8}},l=H(e,{name:n.id,fragmentShader:yt,uniforms:c,blend:n.blend||`alpha`,grid:n.grid}),u=q(e,W(),l,r),d=(n.speed??.15)*s,f=(n.swing??30)*s,p=(n.phase??0)*s;return{meshes:[u],update(e){let t=f>0?f*Math.sin(d*e/f):d*e;c.uAng.value=p+t,u.visible=!!o&&Math.abs(c.uAng.value)>1e-6},dispose(){l.dispose(),G()}}}var xt=12,St=F+I+L+`
uniform float uAmp, uAmpCheer, uDur, uIdle, uCheer, uMaxH, uSeed;
uniform vec4 uEnv;       // attack, hold, release, peak
uniform vec4 uEvT;       // the last 4 trigger times (park s; -1e4 = none)
uniform vec4 uEvK;       // their intensities
varying vec2 vP;
`+R+`
float idAt(vec2 P) {
  if (P.y < 0.0 || P.y > uSize.y) return 0.0;
  return floor(dot(texture2D(tMask, texUv(P, uMaskFlip)), uMaskCh) * 255.0 + 0.5);
}
float envAt(float x) {
  if (x < 0.0) return 0.0;
  if (x < uEnv.x) return uEnv.w * x / max(uEnv.x, 1e-3);
  if (x < uEnv.x + uEnv.y) return uEnv.w;
  float k = 1.0 - (x - uEnv.x - uEnv.y) / max(uEnv.z, 1e-3);
  return k > 0.0 ? uEnv.w * k * k * (3.0 - 2.0 * k) : 0.0;
}
float exciteAt(float t) {
  return max(max(envAt(t - uEvT.x) * uEvK.x, envAt(t - uEvT.y) * uEvK.y), max(envAt(t - uEvT.z) * uEvK.z, envAt(t - uEvT.w) * uEvK.w));
}
// the current hop height (whole px) of figure id
float hopOf(float id) {
  if (id < 0.5) return 0.0;
  float h = hash11(id * 1.37 + uSeed);
  float slot = uDur * 1.15 + h * 0.8;
  float x = uTime / slot + h * 7.0;
  float n = floor(x);
  float f = (x - n) * slot;                          // s since this slot began
  float ex = clamp(exciteAt((n - h * 7.0) * slot), 0.0, 1.0);   // decided when the slot begins
  if (hash12(vec2(id * 0.73 + uSeed, n)) >= mix(uIdle, uCheer, ex)) return 0.0;
  float delay = hash12(vec2(id + 3.1, n + uSeed)) * max(slot - uDur, 0.0);
  float u = (f - delay) / uDur;
  if (u <= 0.0 || u >= 1.0) return 0.0;
  float amp = mix(uAmp, uAmpCheer, ex) * (0.8 + 0.4 * hash12(vec2(id, n + 9.0)));
  return floor(amp * 4.0 * u * (1.0 - u) + 0.5);
}
void main() {
  vec2 P = floor(vP) + 0.5;
  float own = idAt(P);
  float ownHop = hopOf(own);
  // the front-most figure (highest id) whose lifted pixel lands here
  float best = 0.0;
  vec2 src = P;
  for (int k = 0; k <= ${xt}; k++) {
    if (float(k) > uMaxH) break;
    vec2 s = P + vec2(0.0, float(k));
    float id = idAt(s);
    if (id > best && abs(hopOf(id) - float(k)) < 0.5) { best = id; src = s; }
  }
  if (best < 0.5) {
    if (own < 0.5 || ownHop < 0.5) discard;
    // a seat uncovered under a hopping figure: continue the seat row from beside the figure
    vec2 fill = P;
    for (int i = 1; i <= 24; i++) {
      vec2 l = P - vec2(float(i), 0.0), r = P + vec2(float(i), 0.0);
      if (idAt(l) < 0.5) { fill = l; break; }
      if (idAt(r) < 0.5) { fill = r; break; }
    }
    src = fill;
  } else if (best == own && ownHop < 0.5) {
    discard;                                         // unchanged
  }
  emit(plateAt(src), 1.0);
}`;function Ct(e,n,r){let i=X(n.rect||n.region,[0,0,e.size[0],e.size[1]]),a=n.on??{homerun:[.1,2.6,1.8,1]},o=typeof a==`string`?a:Object.keys(a)[0],s=typeof a==`string`?[.1,2.6,1.8,1]:a[o],c=n.ampCheer??6,l={uRect:{value:new t(...i)},...J(e,n.mask??`fans`),...Y(e,`plate`),uAmp:{value:n.amp??3},uAmpCheer:{value:c},uDur:{value:n.duration??1.3},uIdle:{value:n.idle??.02},uCheer:{value:n.cheer??.85},uMaxH:{value:Math.min(xt,n.maxH??Math.ceil(c*1.2)+1)},uSeed:{value:e.seedOf(n.id)%997/997},uEnv:{value:new t(...[0,1,2,3].map(e=>s[e]??[.1,2.6,1.8,1][e]))},uEvT:{value:new t(-1e4,-1e4,-1e4,-1e4)},uEvK:{value:new t(0,0,0,0)}},u=l.tMask.value;u&&u.userData?.living&&u.magFilter!==1003&&(u.magFilter=m,u.minFilter=m,u.needsUpdate=!0);let d=H(e,{name:n.id,fragmentShader:St,uniforms:l,blend:`alpha`,grid:n.grid});return{meshes:[q(e,W(),d,r)],update(){let t=e.eventsOf(o).slice(-4);for(let e=0;e<4;e++){let n=t[t.length-1-e];l.uEvT.value.setComponent(e,n?n.t:-1e4),l.uEvK.value.setComponent(e,n?n.payload?.intensity??1:0)}},dispose(){d.dispose(),G()}}}var wt=F+oe+`
uniform sampler2D tSheet;
uniform vec2 uSheetSize;
uniform float uSheetFlip;
uniform vec4 uRegion;     // plate px x, y, w, h
uniform vec4 uClean;      // atlas px x, y, w, h (1:1 with the region)
uniform vec4 uLayer[4];   // atlas px x, y, w, h
uniform vec4 uLayerP[4];  // plate y of the strip's top row, scroll offset px, period px (w + gap), alpha
uniform float uLayerX[4]; // plate x of the strip's left end at rest
uniform float uLayers, uRelight;
varying vec2 vP;
`+R+`
vec2 gFw, gGx, gGy;
vec4 sheetAt(vec2 A) {
  // sharp-bilinear: crisp texels, 1-px anti-aliased seams (same look as the renderer's plate)
  vec2 seam = floor(A + 0.5);
  vec2 sp = seam + clamp((A - seam) / gFw, -0.5, 0.5);
  vec2 uv = sp / uSheetSize;
  if (uSheetFlip > 0.5) uv.y = 1.0 - uv.y;
  return textureGrad(tSheet, uv, gGx, gGy);
}
void main() {
  gFw = max(fwidth(vP), vec2(1e-4));
  vec2 g = vP / uSheetSize;
  gGx = dFdx(g);
  gGy = dFdy(g);
  if (uSheetFlip > 0.5) { gGx.y = -gGx.y; gGy.y = -gGy.y; }
  vec2 lp = vP - uRegion.xy;
  vec4 clean = sheetAt(uClean.xy + lp);
  float m = clean.a;
  if (m < 0.004) discard;
  vec3 col = clean.rgb;
  float keep = keepOut(vP);
  for (int i = 0; i < 4; i++) {
    if (float(i) >= uLayers) break;
    vec4 L = uLayer[i];
    vec4 Q = uLayerP[i];
    float ly = vP.y - Q.x;
    if (ly < 0.0 || ly >= L.w) continue;
    float x0 = uLayerX[i];
    float lx = mod(vP.x - x0 - Q.y, Q.z);
    if (lx < 0.0 || lx >= L.z) continue;
    vec4 c = sheetAt(L.xy + vec2(lx, ly));
    float a = c.a * Q.w * keep;
    if (a < 0.004) continue;
    vec3 cc = c.rgb;
    if (uRelight > 0.0) {
      // the sky where this cloud was painted vs the sky here: carry the local light over
      vec3 src = sheetAt(uClean.xy + vec2(clamp(lx + x0 - uRegion.x, 0.0, uClean.z - 1.0), lp.y)).rgb;
      vec3 k = clamp((clean.rgb + 0.03) / (src + 0.03), vec3(0.8), vec3(1.3));
      cc = clamp(cc * mix(vec3(1.0), k, uRelight), 0.0, 1.0);
    }
    col = mix(col, cc, a);
  }
  emit(col, m);
}`;function Tt(e,n,r){let i=e.textures.files[n.texture]||null,a=i?.userData?.size||[1,1],o=n.region||[0,0,e.size[0],Math.round(e.horizonY)],s=n.clean||[0,0,o[2],o[3]],c=Array.isArray(n.speeds)?n.speeds:null,l=(e,t)=>c?c[t]??c[c.length-1]:e.speed??0,u=(n.layers||[]).slice(0,4).map((e,t)=>({...e,v:l(e,t)})).sort((e,t)=>Math.abs(e.v)-Math.abs(t.v)),d=n.gap??240,f=re(e,n.snap??1,1),p=[0,1,2,3].map(()=>new t(0,0,0,0)),m=[0,1,2,3].map(()=>new t(0,0,1,0)),h=[0,0,0,0];u.forEach((e,t)=>{p[t].fromArray(e.atlas||[0,0,0,0]),h[t]=e.x??o[0],m[t].set(e.y??o[1],0,(e.atlas?.[2]??o[2])+(e.gap??d),(e.alpha??1)*(n.intensity??1))});let g=n.relight??.5,_={uRect:{value:new t(...o)},tSheet:{value:i||e.blank},uSheetSize:{value:new w(a[0],a[1])},uSheetFlip:{value:+!!i?.flipY},uRegion:{value:new t(...o)},uClean:{value:new t(...s)},uLayer:{value:p},uLayerP:{value:m},uLayerX:{value:h},uLayers:{value:i?u.length:0},uRelight:{value:g},uExcl:{value:ae(n.exclude)},uExclSoft:{value:n.excludeSoft??.5}},v=H(e,{name:n.id,fragmentShader:wt,uniforms:_,blend:`alpha`,grid:n.grid}),y=q(e,W(),v,r);return y.visible=!!i,i||console.warn(`[living] ${e.id}: clouds "${n.id}" has no sheet (${n.texture}); run tools/living/clouds_kit.py`),{meshes:[y],setQuality(e){_.uRelight.value=e===`low`?0:g},update(e){if(!i){y.visible=!1;return}u.forEach((t,n)=>{let r=m[n].z,i=t.v*e+(t.phase??0);f>0&&(i=Math.round(i/f)*f),i=(i%r+r)%r,m[n].y=i})},dispose(){v.dispose(),G()}}}var Et=F+I+L+`
uniform vec4 uObj;        // object rect (plate px)
uniform vec4 uWin;        // where the moved object may show (plate px)
uniform vec2 uD;          // current displacement (whole plate px)
uniform float uFillMode;  // 0 colour, 1 clone
uniform vec2 uClone;
uniform vec4 uZoneRect[3];
uniform vec2 uZoneOff[3];
uniform vec3 uFill;
uniform float uCore, uFillMin;
varying vec2 vP;
`+R+`
float inRect(vec2 P, vec4 r) {
  vec2 a = step(r.xy, P) * step(P, r.xy + r.zw);
  return a.x * a.y;
}
void main() {
  vec2 Q = vP - uD;
  float mq = maskAt(Q) * inRect(Q, uObj) * inRect(vP, uWin);   // the object, moved here (inside the window)
  float mp = maskAt(vP) * inRect(vP, uObj);                     // where the object stands at rest (vacated)
  if (uCore > 0.0) {
    mq = step(uCore, mq);
    mp = step(uFillMin, mp);
  }
  if (mq < 0.01 && mp < 0.01) discard;
  vec2 co = uClone;
  for (int i = 2; i >= 0; i--) {
    vec4 r = uZoneRect[i];
    if (vP.x >= r.x && vP.y >= r.y && vP.x < r.x + r.z && vP.y < r.y + r.w) co = uZoneOff[i];
  }
  vec3 fill = uFillMode > 0.5 ? plateAt(vP + co) : uFill;
  vec3 obj = plateAt(Q);
  float a = 1.0 - (1.0 - mp) * (1.0 - mq);
  vec3 c = (fill * mp * (1.0 - mq) + obj * mq) / max(a, 1e-3);
  emit(c, a);
}`;function Dt(e,n,r){let i=X(n.rect||n.region,[0,0,16,16]),a=n.away||[-i[2],0],o=n.from||a,s=n.window||[0,0,1e5,1e5],c=Math.min(i[0],i[0]+a[0],i[0]+o[0])-1,l=Math.min(i[1],i[1]+a[1],i[1]+o[1])-1,u=Math.max(i[0]+i[2],i[0]+i[2]+a[0],i[0]+i[2]+o[0])+1,d=Math.max(i[1]+i[3],i[1]+i[3]+a[1],i[1]+i[3]+o[1])+1,f=n.fill||{clone:[0,-i[3]]},p={uRect:{value:new t(c,l,u-c,d-l)},uObj:{value:new t(...i)},uWin:{value:new t(...s)},...J(e,n.mask),...Y(e,`plate`),uD:{value:new w},uFillMode:{value:+!!f.clone},uClone:{value:new w(...f.clone||[0,0])},uFill:{value:j(f.color||`#101018`,e.palette)},uZoneRect:{value:[0,1,2].map(e=>new t(...f.zones?.[e]?.rect||[-1e5,-1e5,0,0]))},uZoneOff:{value:[0,1,2].map(e=>new w(...f.zones?.[e]?.clone||[0,0]))},uCore:{value:n.core??0},uFillMin:{value:n.fillMin??.08}},m=H(e,{name:n.id,vertexShader:z,fragmentShader:Et,uniforms:p,blend:`alpha`,grid:n.grid}),h=q(e,W(),m,r);h.visible=!1;let g=n.start??2,_=Math.max(.1,n.depart??8),v=Math.max(0,n.gone??6),y=Math.max(.1,n.arrive??8),b=Math.max(0,n.dwell??16),x=_+v+y+b,S=n.ease===`inout`;function C(e){if(e<g)return[0,0];let t=(e-g)%x;if(t<_){let e=t/_,n=S?e*e*(3-2*e):e*e*(1.6-.6*e);return[a[0]*n,a[1]*n]}if(t<_+v)return[a[0],a[1]];if(t<_+v+y){let e=(t-_-v)/y,n=S?e*e*(3-2*e):1-(1-e)*(1-e);return[o[0]*(1-n),o[1]*(1-n)]}return[0,0]}return{meshes:[h],update(e){let[t,n]=C(e),r=Math.round(t),i=Math.round(n);p.uD.value.set(r,i),h.visible=r!==0||i!==0},dispose(){m.dispose(),G()}}}var $=8,Ot=P+F+`
attribute vec4 aA;        // burst index, spark index (-1 = rocket), kind (0 spark, 1 trail), event slot
attribute vec4 aS;        // random: angle jitter, speed, twinkle phase, colour pick
uniform vec4 uB[${$}];      // burst p.x, p.y, at, radius
uniform vec4 uB2[${$}];     // count, life, 0, 0
uniform vec3 uC0[${$}];
uniform vec3 uC1[${$}];
uniform vec2 uEv;              // the two latest trigger times (park s; -1e4 = none)
uniform float uGravity, uRise, uRiseT, uSizePx, uTrail, uGain, uRing, uOpen;
varying vec2 vP;
varying vec2 vC;
varying float vA;
varying vec3 vCol;
vec4 pickB(float i) { vec4 r = uB[0]; for (int k = 1; k < ${$}; k++) if (float(k) == i) r = uB[k]; return r; }
vec4 pickB2(float i) { vec4 r = uB2[0]; for (int k = 1; k < ${$}; k++) if (float(k) == i) r = uB2[k]; return r; }
vec3 pickC0(float i) { vec3 r = uC0[0]; for (int k = 1; k < ${$}; k++) if (float(k) == i) r = uC0[k]; return r; }
vec3 pickC1(float i) { vec3 r = uC1[0]; for (int k = 1; k < ${$}; k++) if (float(k) == i) r = uC1[k]; return r; }
void main() {
  vec4 B = pickB(aA.x);
  vec4 B2 = pickB2(aA.x);
  float ev = aA.w < 0.5 ? uEv.x : uEv.y;
  float age = uTime - ev - B.z;          // s since this burst opened
  float life = B2.y;
  vec2 c = B.xy;
  float a = 0.0;
  vec3 col = vec3(1.0);
  if (aA.y < 0.0) {
    // rocket: climbs to the burst point over riseT, a faint wobbling pixel
    float q = (age + uRiseT) / max(uRiseT, 0.01);
    if (q > 0.0 && q < 1.0 && uRise > 0.0) {
      float e = 1.0 - (1.0 - q) * (1.0 - q);
      c = B.xy + vec2(sin(q * 9.0 + aS.z * 6.0) * 1.5, uRise * (1.0 - e));
      a = 0.75 * (0.6 + 0.4 * step(0.5, fract(uTime * 14.0 + aS.z)));
      col = mix(pickC0(aA.x), vec3(1.0, 0.95, 0.85), 0.6);
    }
  } else if (aA.y < B2.x && age > 0.0 && age < life) {
    float t = aA.z > 0.5 ? max(age - 0.07, 0.0) : age;
    float ang = (aA.y + 0.5 + (aS.x - 0.5) * 0.7) / B2.x * 6.2831853;
    float sp = B.w * mix(0.3 + 0.7 * sqrt(aS.y), 0.78 + 0.22 * aS.y, uRing);   // filled chrysanthemum or a ring
    float open = 1.0 - exp(-uOpen * t / life);
    c = B.xy + vec2(cos(ang), sin(ang) * 0.92) * sp * open + vec2(0.0, 0.5 * uGravity * t * t);
    float f = age / life;
    float fade = 1.0 - f * f;   // stays bright, then burns out
    float tw = f > 0.45 ? step(0.35, hash11(floor(uTime * 12.0) + aS.z * 91.0)) : 1.0;
    a = fade * tw * (aA.z > 0.5 ? uTrail : 1.0) * smoothstep(0.0, 0.04, age);
    vec3 c0 = pickC0(aA.x), c1 = pickC1(aA.x);
    col = f < 0.18 ? mix(vec3(1.0, 0.97, 0.9), c0, f / 0.18) : mix(c0, c1, smoothstep(0.25, 0.9, f) * (0.4 + 0.6 * aS.w));
  }
  vA = a * uGain;
  vCol = col;
  vC = c;
  vec2 P = c + (position.xy - 0.5) * (uSizePx + uGrid * 2.0);
  vP = P;
  gl_Position = vA < 0.004 ? vec4(2.0, 2.0, 2.0, 1.0) : plateToClip(P);
}`,kt=F+I+`
uniform float uSizePx;
varying vec2 vP;
varying vec2 vC;
varying float vA;
varying vec3 vCol;
`+R+`
void main() {
  vec2 d = abs(snapP(vP) - snapP(vC));
  float core = step(max(d.x, d.y), max(uSizePx * 0.5, uGrid * 0.5) - 0.01);
  if (core < 0.5) discard;
  emit(vCol, vA * maskAt(vP));
}`;function At(e,n,i){let a=n,o=(n.bursts||[]).slice(0,$),s=Math.max(1,o.length),c=o.map(e=>Math.max(4,Math.min(48,Math.round(e.count??a.count??24)))),l=Math.max(4,...c),u=s*(l*2+1)*2,d=k(e.seedOf(`${n.id}:fireworks`)),{geometry:f,attrs:p}=K(u,{aA:4,aS:4}),m=0,h=[];for(let e=0;e<2;e++){let t=0;for(let n=0;n<s;n++)for(let r=-1;r<l;r++)for(let i=0;i<(r<0?1:2);i++){p.aA.setXYZW(m,n,r,i,e),e===0&&h.push([d.next(),d.next(),d.next(),d.next()]);let a=h[t++];p.aS.setXYZW(m,a[0],a[1],a[2],a[3]),m++}}f.instanceCount=m;let g=[],_=[],v=[],y=[];for(let n=0;n<$;n++){let i=o[n];if(!i){g.push(new t(-1e4,-1e4,1e4,1)),_.push(new t(0,1,0,0)),v.push(new r(1,1,1)),y.push(new r(1,1,1));continue}g.push(new t(i.p[0],i.p[1],i.at??0,i.radius??a.radius??56)),_.push(new t(c[n],i.life??a.life??1.7,0,0));let s=Array.isArray(i.color)?i.color:[i.color||`#ffd27a`,i.color||`#ff8a5c`];v.push(j(s[0],e.palette)),y.push(j(s[1]??s[0],e.palette))}let b={...J(e,n.mask),uB:{value:g},uB2:{value:_},uC0:{value:v},uC1:{value:y},uEv:{value:new w(-1e4,-1e4)},uGravity:{value:n.gravity??26},uRise:{value:n.rise??150},uRiseT:{value:n.riseTime??.7},uSizePx:{value:n.size??e.art??e.grid??4},uTrail:{value:n.trail??.45},uGain:{value:n.intensity??.9},uRing:{value:+!!n.ring},uOpen:{value:n.open??12}},x=H(e,{name:n.id,vertexShader:Ot,fragmentShader:kt,uniforms:b,blend:n.blend||`screen`,grid:n.grid}),S=q(e,f,x,i);S.visible=!1;let C=typeof n.on==`string`?[n.on]:n.on?Object.keys(n.on):[`homerun`],T=Math.max(...o.map(e=>(e.at??0)+(e.life??a.life??1.7)),1)+.2,E=n.riseTime??.7;return{meshes:[S],update(t){let n=[];for(let r of C)for(let i of e.eventsOf(r))i.t<=t+E&&n.push(i.t);n.sort((e,t)=>t-e);let r=n[0]??-1e4,i=n[1]??-1e4;b.uEv.value.set(r,i),S.visible=t-r<T||t-i<T},dispose(){f.dispose(),x.dispose()}}}var jt=F+I+`
uniform vec4 uBeam[4];    // apex x, y, unit axis x, y
uniform float uCount, uLen, uW0, uW1, uFall, uShafts, uGain, uLevels;
uniform vec3 uColor;
varying vec2 vP;
`+R+`
float beam(vec2 P, vec4 B, float k) {
  vec2 v = P - B.xy;
  float s = dot(v, B.zw) / uLen;
  if (s < 0.0 || s > 1.0) return 0.0;
  float perp = v.x * B.w - v.y * B.z;
  float x = perp / mix(uW0, uW1, s);
  float a = exp(-x * x * 2.0) * pow(1.0 - s, uFall) * smoothstep(0.0, 0.06, s);
  if (uShafts > 0.0) {
    float n = vnoise(vec2(x * 2.5 + uTime * 0.05 + k * 3.1, s * 1.5 - uTime * 0.04));
    a *= 1.0 + uShafts * (n - 0.5) * 2.0;
  }
  return a;
}
void main() {
  vec2 P = uLevels > 1.5 ? snapP(vP) : vP;
  float a = 0.0;
  for (int i = 0; i < 4; i++) {
    if (float(i) >= uCount) break;
    a = max(a, beam(P, uBeam[i], float(i)));
  }
  if (a < 0.002) discard;
  a = bands(clamp(a, 0.0, 1.0), uLevels, cellOf(vP));
  emit(uColor, a * uGain * maskAt(vP));
}`;function Mt(e,n,r){let i=(n.beams||[{apex:n.apex||[0,0],target:n.target||[0,-100],phase:n.phase||0}]).slice(0,4),[a,o]=n.width||[6,40],s=(n.sweep??12)*Math.PI/180,c=n.period??18,l=i.map(e=>{let t=e.target[0]-e.apex[0],n=e.target[1]-e.apex[1];return{apex:e.apex,len:Math.hypot(t,n)||1,ang:Math.atan2(n,t),phase:e.phase||0}}),u=Math.max(...l.map(e=>e.len)),d=1/0,f=1/0,p=-1/0,m=-1/0;for(let e of l)for(let t=0;t<=16;t++){let n=e.ang-s+2*s*t/16;for(let t of[0,u]){let r=e.apex[0]+Math.cos(n)*t,i=e.apex[1]+Math.sin(n)*t,s=(t?o:a)*1.6;d=Math.min(d,r-s),f=Math.min(f,i-s),p=Math.max(p,r+s),m=Math.max(m,i+s)}}let h=V([[d,f],[p,f],[p,m],[d,m]]),g=[0,1,2,3].map(()=>new t),_={...J(e,n.mask),uBeam:{value:g},uCount:{value:l.length},uLen:{value:u},uW0:{value:a},uW1:{value:o},uFall:{value:n.falloff??1.1},uShafts:{value:n.shafts??.3},uGain:{value:0},uLevels:{value:n.levels??0},uColor:{value:j(n.color||`#e6e2ff`,e.palette)}},v=H(e,{name:n.id,vertexShader:B,fragmentShader:jt,uniforms:_,blend:n.blend||`screen`,grid:n.grid}),y=q(e,h,v,r),b=n.intensity??.1,x=n.boost??.5,S=n.sweepBoost??0,C=0,w=null;return{meshes:[y],update(t){let r=e.excite(n.on,t);S>0?(C+=w===null?t:Math.max(0,t-w)*(1+S*r),w=t):C=t,l.forEach((e,t)=>{let n=e.ang+s*Math.sin(2*Math.PI*C/c+e.phase);g[t].set(e.apex[0],e.apex[1],Math.cos(n),Math.sin(n))}),_.uGain.value=b*(1+x*r)},dispose(){v.dispose(),h.dispose()}}}var Nt={flicker:he,blink:ye,chase:we,sprite:ke,particles:Ne,drift:Ie,smoke:ze,flag:He,crowd:qe,halo:Ze,cone:Qe,lightning:nt,breathe:rt,scoreboard:st,lift:ut,sign:pt,rain:gt,pips:vt,globe:bt,hop:Ct,clouds:Tt,shuttle:Dt,fireworks:At,searchlight:Mt},Pt=new Set([`drift`,`flag`,`crowd`,`lift`,`hop`,`shuttle`]),Ft={flicker:`glow`,crowd:`crowd`,lightning:`sky`};function It(e){let t=[],n=e=>e&&t.push(typeof e==`string`?e:e.name),r=Ft[e.type]??(e.type===`drift`&&(e.mode||`drift`)===`drift`&&(e.source||`skyLayer`)===`skyLayer`?`sky`:null);return n(e.mask===void 0?r:e.mask),n(e.occlude),e.flashes?.mask&&n(e.flashes.mask),t}function Lt(e,t){return e?e.replace(/\/?$/,`/`)+t:t}function Rt(e={},t={}){let n=t.plateJson,r=t.livingJson||{effects:[]};if(!n)throw Error(`[living] plateJson is required`);let a=t.basePath??`assets/plates/${n.id}/`,s=t=>{let n=Lt(a,t);return e.assets?.url?e.assets.url(n):n},c=t=>e.assets?.blob?e.assets.blob(Lt(a,t)):s(t),l=n.size.scale||2,u=n.size.w1x||n.size.w/l,f=n.size.h1x||n.size.h/l,p=n.frame,m=n.lines?.horizonUv?(n.lines.horizonUv[0][1]+n.lines.horizonUv[1][1])/2*f:f*.55,h={uTime:{value:0},uSize:{value:new w(u,f)},uAxis:{value:new w(p.axisPx[0]/l,p.axisPx[1]/l)},uPPT:{value:p.pxPerTan/l},uTanHalf:{value:new w(.4243,.918)},uCrop:{value:new w(1,1)}},g=new d;g.name=`living:${n.id}`;let _=new o;_.name=`living:${n.id}`,g.add(_);let v=new i,y=t.quality||(e.quality?.tier===`low`?`low`:e.quality?.tier===`mid`?`mid`:`high`),b=O(`${n.id}:${r.seed??1}`),x=[],S=t.t0??null,C=0,D=!1,A=!1,j=[],N={id:n.id,shared:h,size:[u,f],horizonY:m,grid:typeof r.grid==`number`?r.grid:3,art:typeof r.grid==`number`?r.grid:3,gridOffset:r.gridOffset||[0,0],palette:{...r.palette||{}},roles:{},style:null,get styled(){return!!this.style},masks:{},textures:{plate:null,skyLayer:null,files:{}},atlas:null,blank:ue(),layer:t.layer??null,get quality(){return y},specById:{},seedOf:e=>O(`${b}:${e}`),rng:e=>k(O(`${b}:${e}`)),pixelSpriteFps:e=>Q[e]?.fps??0,eventsOf:e=>x.filter(t=>t.name===e),excite(e,t){if(!e)return 0;let n=typeof e==`string`?{[e]:ee[e]||[.3,1.5,2,1]}:e,r=0;for(let e of x){let i=n[e.name];if(!i)continue;let a=e.payload?.intensity??1;r=Math.max(r,M(i,t-e.t)*a)}return r}},P=[],F=(r.effects||[]).filter(e=>e&&e.enabled!==!1);F.forEach((e,t)=>{e.id||=`${e.type}_${t}`,N.specById[e.id]=e});function I(e){if(!e||typeof e!=`object`)return;N.style=e;let t=Number(e.artPx);t>0&&(N.art=t,(r.grid==null||r.grid===`art`)&&(N.grid=t)),!r.gridOffset&&Array.isArray(e.gridOffset)&&(N.gridOffset=e.gridOffset),N.palette={...e.palette||{},...r.palette||{}},N.roles=e.roles||{}}async function L(){let i=t.textures||{},o=[];r.style&&typeof r.style==`object`?I(r.style):typeof r.style==`string`&&o.push((e.assets?.blob?e.assets.blob(Lt(a,r.style)).then(e=>e.text()).then(e=>JSON.parse(e)):fetch(s(r.style)).then(e=>{if(!e.ok)throw Error(`${r.style}: HTTP ${e.status}`);return e.json()})).then(I));let l=new Set(F.flatMap(It)),u=F.some(e=>Pt.has(e.type)||e.type===`flicker`&&[`windows`,`neon`].includes(e.mode||`windows`)&&e.facade!==!1),d=F.some(e=>e.type===`drift`&&(e.source||((e.mode||`drift`)===`drift`?`skyLayer`:`plate`))===`skyLayer`),f=n.files?.masksPacked1x,p=f?.channels||{r:`glow`,g:`crowd`,b:`field`,a:`sky`},m={r:[1,0,0,0],g:[0,1,0,0],b:[0,0,1,0],a:[0,0,0,1]},h=new Set(Object.values(p));[...l].some(e=>h.has(e))&&o.push((i.masks?Promise.resolve(i.masks):Z(c(f?.file||`masks_1x.png`)).then(e=>(j.push(e),e))).then(e=>{for(let[t,n]of Object.entries(p))N.masks[n]={texture:e,channel:m[t]}})),l.has(`dirt`)&&n.files?.dirt1x&&o.push(Z(c(n.files.dirt1x)).then(e=>(j.push(e),N.masks.dirt={texture:e,channel:m.r})));let g=new Map;for(let[e,t]of Object.entries(r.masks||{})){let n=typeof t==`string`?{file:t.split(`:`)[0],channel:t.split(`:`)[1]||`r`}:t;g.has(n.file)||g.set(n.file,[]),g.get(n.file).push({name:e,...n})}for(let[e,t]of g){let n=t.some(e=>(e.filter||`nearest`)===`nearest`);o.push(Z(c(e),{nearest:n}).then(e=>{j.push(e);for(let n of t)N.masks[n.name]={texture:e,channel:m[n.channel]||m.r}}))}u&&o.push((i.plate?Promise.resolve(i.plate):Z(c(n.files?.plate1x||`plate_1x.png`),{mipmaps:!0}).then(e=>(j.push(e),e))).then(e=>N.textures.plate=e)),d&&n.files?.skyLayer1x&&o.push((i.skyLayer?Promise.resolve(i.skyLayer):Z(c(n.files.skyLayer1x)).then(e=>(j.push(e),e))).then(e=>N.textures.skyLayer=e));let _=new Set(F.filter(e=>e.type===`sprite`&&e.sprite&&typeof e.sprite==`object`&&!Array.isArray(e.sprite)&&e.sprite.file).map(e=>e.sprite.file));for(let e of F)typeof e.texture==`string`&&_.add(e.texture);let v=new Set(F.filter(e=>e.type===`clouds`&&typeof e.texture==`string`).map(e=>e.texture));for(let e of _)o.push(Z(c(e),{nearest:!1,mipmaps:v.has(e)}).then(t=>{j.push(t),N.textures.files[e]=t}));let y=[];for(let e of F)e.type===`sprite`&&typeof e.sprite==`string`&&y.push(e.sprite),e.type===`sprite`&&Array.isArray(e.sprite)&&y.push(...e.sprite.filter(e=>typeof e==`string`)),e.type===`particles`&&e.shape&&Q[e.shape]&&y.push(e.shape);y.length&&(N.atlas=fe(y),j.push(N.atlas.texture));let b=await Promise.allSettled(o);for(let e of b)e.status===`rejected`&&console.warn(`[living] texture failed:`,e.reason?.message||e.reason)}function R(){if(A){for(let e of j)e.dispose();return}for(let e of F){let t=e.type===`clouds`&&N.textures.files[e.texture];if(!t||!e.region)continue;let[n,r]=t.userData?.size||[1,1],i=e.clean||[0,0,e.region[2],e.region[3]];N.masks[`${e.id}:sky`]={texture:t,channel:[0,0,0,1],xf:[e.region[0]-i[0],e.region[1]-i[1],1/n,1/r],box:e.region,outside:0}}F.forEach((e,t)=>{let r=Nt[e.type];if(!r){console.warn(`[living] ${n.id}: unknown effect type "${e.type}" (${e.id})`);return}try{let n=r(N,e,(e.order??t)*2);for(let e of n.meshes)_.add(e);P.push({id:e.id,type:e.type,spec:e,fx:n,enabled:!0})}catch(t){console.warn(`[living] ${n.id}: effect "${e.id}" failed`,t)}}),B()}function z(e){return e.enabled&&E(y)>=E(e.spec.minQuality||`low`)}function B(){for(let e of P)e.fx.setQuality?.(y)}function V(e,t={}){let n=C;t&&typeof t.t==`number`&&S!=null&&(n=t.t-S),x.push({name:e,t:n,payload:t}),x.length>24&&x.shift()}let te=[];if(t.autoEvents!==!1&&e.events?.on){let t=new Set([`homerun`,`lightning`,`derby:update`]),n=e=>{e&&(typeof e==`string`?t.add(e):Object.keys(e).forEach(e=>t.add(e)))};for(let e of F)n(e.on),n(e.cheer?.on),n(e.flashes?.on),(e.listen||[]).forEach(e=>t.add(e));for(let n of t)te.push(e.events.on(n,e=>V(n,e)))}function ne(){if(D)return;let t=e.camera;if(t?.projectionMatrix){let e=t.projectionMatrix.elements;h.uTanHalf.value.set(1/e[0],1/e[5])}let n=e.modules?.renderer?.size;n?.backW&&h.uCrop.value.set(n.lowW*n.k/n.backW,n.lowH*n.k/n.backH)}let re=L().then(R).catch(e=>console.warn(`[living] ${n.id}: load failed`,e)),H=!1;return{ready:re,scene:g,camera:v,object3d:_,get effects(){return P.map(e=>({id:e.id,type:e.type,enabled:e.enabled,on:z(e)}))},get active(){return H},get time(){return C},get quality(){return y},update(e,t){if(!A){t??=(S??0)+C+(e||0),S??=t,C=t-S,h.uTime.value=C,ne(),H=!1;for(let t of P){let n=z(t);for(let e of t.fx.meshes)e.visible=n;n&&t.fx.update?.(C,e);for(let e of t.fx.meshes)H||=e.visible}}},onEvent:V,setQuality(e){y=T.includes(e)?e:`high`,B()},setView(e){if(!e){D=!1;return}D=!0,e.tanHalf&&h.uTanHalf.value.set(e.tanHalf[0],e.tanHalf[1]),e.crop&&h.uCrop.value.set(e.crop[0],e.crop[1])},setEnabled(e,t){for(let n of P)n.id===e&&(n.enabled=!!t)},render(e,t){if(A||!H)return;t!==void 0&&e.setRenderTarget(t);let n=e.autoClear;e.autoClear=!1,e.render(g,v),e.autoClear=n},dispose(){if(!A){A=!0,te.forEach(e=>e?.());for(let e of P)e.fx.dispose?.();P.length=0,_.removeFromParent();for(let e of j)e.dispose(),e.userData?.bitmap?.close?.();N.blank.dispose()}}}}export{Rt as createLiving};