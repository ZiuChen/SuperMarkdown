import{A as e,Y as t,a4 as n,a8 as r,aA as i,aB as a,ay as o,az as s,b as c,c as l,d as u,i as d,n as f,p,r as m,t as h}from"./mermaid-b5860b54-CNJcd_uB.js";import{b as g}from"./channel-BOBJuItw.js";import{E as _}from"./_getTag-BZDbFPkM.js";import{b as v}from"./graphlib-A0QLJVoB.js";import{b as y}from"./index-3862675e-C7y5BmZT.js";function b(e){return typeof e==`string`?new i([document.querySelectorAll(e)],[document.documentElement]):new i([a(e)],s)}function x(e,t){return!!e.children(t).length}function S(e){return w(e.v)+`:`+w(e.w)+`:`+w(e.name)}var C=/:/g;function w(e){return e?String(e).replace(C,`\\:`):``}function T(e,t){t&&e.attr(`style`,t)}function E(e,t,n){t&&e.attr(`class`,t).attr(`class`,n+` `+e.attr(`class`))}function D(e,n){var r=n.graph();if(t(r)){var i=r.transition;if(_(i))return i(e)}return e}function O(e,t){var n=e.append(`foreignObject`).attr(`width`,`100000`),r=n.append(`xhtml:div`);r.attr(`xmlns`,`http://www.w3.org/1999/xhtml`);var i=t.label;switch(typeof i){case`function`:r.insert(i);break;case`object`:r.insert(function(){return i});break;default:r.html(i)}T(r,t.labelStyle),r.style(`display`,`inline-block`),r.style(`white-space`,`nowrap`);var a=r.node().getBoundingClientRect();return n.attr(`width`,a.width).attr(`height`,a.height),n}const k={},A=function(e){let t=Object.keys(e);for(let n of t)k[n]=e[n]},j=async function(t,n,r,i,a,o){let s=i.select(`[id="${r}"]`),c=Object.keys(t);for(let r of c){let i=t[r],c=`default`;i.classes.length>0&&(c=i.classes.join(` `)),c+=` flowchart-label`;let l=e(i.styles),h=i.text===void 0?i.id:i.text,g;if(p.info(`vertex`,i,i.labelType),i.labelType===`markdown`)p.info(`vertex`,i,i.labelType);else if(d(f().flowchart.htmlLabels)){let e={label:h};g=O(s,e).node(),g.parentNode.removeChild(g)}else{let e=a.createElementNS(`http://www.w3.org/2000/svg`,`text`);e.setAttribute(`style`,l.labelStyle.replace(`color:`,`fill:`));let t=h.split(m.lineBreakRegex);for(let n of t){let t=a.createElementNS(`http://www.w3.org/2000/svg`,`tspan`);t.setAttributeNS(`http://www.w3.org/XML/1998/namespace`,`xml:space`,`preserve`),t.setAttribute(`dy`,`1em`),t.setAttribute(`x`,`1`),t.textContent=n,e.appendChild(t)}g=e}let _=0,v=``;switch(i.type){case`round`:_=5,v=`rect`;break;case`square`:v=`rect`;break;case`diamond`:v=`question`;break;case`hexagon`:v=`hexagon`;break;case`odd`:v=`rect_left_inv_arrow`;break;case`lean_right`:v=`lean_right`;break;case`lean_left`:v=`lean_left`;break;case`trapezoid`:v=`trapezoid`;break;case`inv_trapezoid`:v=`inv_trapezoid`;break;case`odd_right`:v=`rect_left_inv_arrow`;break;case`circle`:v=`circle`;break;case`ellipse`:v=`ellipse`;break;case`stadium`:v=`stadium`;break;case`subroutine`:v=`subroutine`;break;case`cylinder`:v=`cylinder`;break;case`group`:v=`rect`;break;case`doublecircle`:v=`doublecircle`;break;default:v=`rect`}let y=await u(h,f());n.setNode(i.id,{labelStyle:l.labelStyle,shape:v,labelText:y,labelType:i.labelType,rx:_,ry:_,class:c,style:l.style,id:i.id,link:i.link,linkTarget:i.linkTarget,tooltip:o.db.getTooltip(i.id)||``,domId:o.db.lookUpDomId(i.id),haveCallback:i.haveCallback,width:i.type===`group`?500:void 0,dir:i.dir,type:i.type,props:i.props,padding:f().flowchart.padding}),p.info(`setNode`,{labelStyle:l.labelStyle,labelType:i.labelType,shape:v,labelText:y,rx:_,ry:_,class:c,style:l.style,id:i.id,domId:o.db.lookUpDomId(i.id),width:i.type===`group`?500:void 0,type:i.type,dir:i.dir,props:i.props,padding:f().flowchart.padding})}},M=async function(t,n,i){p.info(`abc78 edges = `,t);let a=0,o={},s,c;if(t.defaultStyle!==void 0){let n=e(t.defaultStyle);s=n.style,c=n.labelStyle}for(let i of t){a++;let l=`L-`+i.start+`-`+i.end;o[l]===void 0?(o[l]=0,p.info(`abc78 new entry`,l,o[l])):(o[l]++,p.info(`abc78 new entry`,l,o[l]));let d=l+`-`+o[l];p.info(`abc78 new link id to be used is`,l,d,o[l]);let g=`LS-`+i.start,_=`LE-`+i.end,v={style:``,labelStyle:``};switch(v.minlen=i.length||1,i.type===`arrow_open`?v.arrowhead=`none`:v.arrowhead=`normal`,v.arrowTypeStart=`arrow_open`,v.arrowTypeEnd=`arrow_open`,i.type){case`double_arrow_cross`:v.arrowTypeStart=`arrow_cross`;case`arrow_cross`:v.arrowTypeEnd=`arrow_cross`;break;case`double_arrow_point`:v.arrowTypeStart=`arrow_point`;case`arrow_point`:v.arrowTypeEnd=`arrow_point`;break;case`double_arrow_circle`:v.arrowTypeStart=`arrow_circle`;case`arrow_circle`:v.arrowTypeEnd=`arrow_circle`;break}let y=``,b=``;switch(i.stroke){case`normal`:y=`fill:none;`,s!==void 0&&(y=s),c!==void 0&&(b=c),v.thickness=`normal`,v.pattern=`solid`;break;case`dotted`:v.thickness=`normal`,v.pattern=`dotted`,v.style=`fill:none;stroke-width:2px;stroke-dasharray:3;`;break;case`thick`:v.thickness=`thick`,v.pattern=`solid`,v.style=`stroke-width: 3.5px;fill:none;`;break;case`invisible`:v.thickness=`invisible`,v.pattern=`solid`,v.style=`stroke-width: 0;fill:none;`;break}if(i.style!==void 0){let t=e(i.style);y=t.style,b=t.labelStyle}v.style=v.style+=y,v.labelStyle=v.labelStyle+=b,i.interpolate===void 0?t.defaultInterpolate===void 0?v.curve=h(k.curve,r):v.curve=h(t.defaultInterpolate,r):v.curve=h(i.interpolate,r),i.text===void 0?i.style!==void 0&&(v.arrowheadStyle=`fill: #333`):(v.arrowheadStyle=`fill: #333`,v.labelpos=`c`),v.labelType=i.labelType,v.label=await u(i.text.replace(m.lineBreakRegex,`
`),f()),i.style===void 0&&(v.style=v.style||`stroke: #333; stroke-width: 1.5px;fill:none;`),v.labelStyle=v.labelStyle.replace(`color:`,`fill:`),v.id=d,v.classes=`flowchart-link `+g+` `+_,n.setEdge(i.start,i.end,v,a)}},N=function(e,t){return t.db.getClasses()},P=async function(e,t,n,r){p.info(`Drawing flowchart`);let i=r.db.getDirection();i===void 0&&(i=`TD`);let{securityLevel:a,flowchart:s}=f(),u=s.nodeSpacing||50,d=s.rankSpacing||50,m;a===`sandbox`&&(m=o(`#i`+t));let h=o(a===`sandbox`?m.nodes()[0].contentDocument.body:`body`),g=a===`sandbox`?m.nodes()[0].contentDocument:document,_=new v({multigraph:!0,compound:!0}).setGraph({rankdir:i,nodesep:u,ranksep:d,marginx:0,marginy:0}).setDefaultEdgeLabel(function(){return{}}),x,S=r.db.getSubGraphs();p.info(`Subgraphs - `,S);for(let e=S.length-1;e>=0;e--)x=S[e],p.info(`Subgraph - `,x),r.db.addVertex(x.id,{text:x.title,type:x.labelType},`group`,void 0,x.classes,x.dir);let C=r.db.getVertices(),w=r.db.getEdges();p.info(`Edges`,w);let T=0;for(T=S.length-1;T>=0;T--){x=S[T],b(`cluster`).append(`text`);for(let e=0;e<x.nodes.length;e++)p.info(`Setting up subgraphs`,x.nodes[e],x.id),_.setParent(x.nodes[e],x.id)}await j(C,_,t,h,g,r),await M(w,_);let E=h.select(`[id="${t}"]`),D=h.select(`#`+t+` g`);if(await y(D,_,[`point`,`circle`,`cross`],`flowchart`,t),c.insertTitle(E,`flowchartTitleText`,s.titleTopMargin,r.db.getDiagramTitle()),l(_,E,s.diagramPadding,s.useMaxWidth),r.db.indexNodes(`subGraph`+T),!s.htmlLabels){let e=g.querySelectorAll(`[id="`+t+`"] .edgeLabel .label`);for(let t of e){let e=t.getBBox(),n=g.createElementNS(`http://www.w3.org/2000/svg`,`rect`);n.setAttribute(`rx`,0),n.setAttribute(`ry`,0),n.setAttribute(`width`,e.width),n.setAttribute(`height`,e.height),t.insertBefore(n,t.firstChild)}}let O=Object.keys(C);O.forEach(function(e){let n=C[e];if(n.link){let r=o(`#`+t+` [id="`+e+`"]`);if(r){let e=g.createElementNS(`http://www.w3.org/2000/svg`,`a`);e.setAttributeNS(`http://www.w3.org/2000/svg`,`class`,n.classes.join(` `)),e.setAttributeNS(`http://www.w3.org/2000/svg`,`href`,n.link),e.setAttributeNS(`http://www.w3.org/2000/svg`,`rel`,`noopener`),a===`sandbox`?e.setAttributeNS(`http://www.w3.org/2000/svg`,`target`,`_top`):n.linkTarget&&e.setAttributeNS(`http://www.w3.org/2000/svg`,`target`,n.linkTarget);let t=r.insert(function(){return e},`:first-child`),i=r.select(`.label-container`);i&&t.append(function(){return i.node()});let o=r.select(`.label`);o&&t.append(function(){return o.node()})}}})},F={setConf:A,addVertices:j,addEdges:M,getClasses:N,draw:P},I=(e,t)=>{let r=g,i=r(e,`r`),a=r(e,`g`),o=r(e,`b`);return n(i,a,o,t)},L=e=>`.label {
    font-family: ${e.fontFamily};
    color: ${e.nodeTextColor||e.textColor};
  }
  .cluster-label text {
    fill: ${e.titleColor};
  }
  .cluster-label span,p {
    color: ${e.titleColor};
  }

  .label text,span,p {
    fill: ${e.nodeTextColor||e.textColor};
    color: ${e.nodeTextColor||e.textColor};
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${e.mainBkg};
    stroke: ${e.nodeBorder};
    stroke-width: 1px;
  }
  .flowchart-label text {
    text-anchor: middle;
  }
  // .flowchart-label .text-outer-tspan {
  //   text-anchor: middle;
  // }
  // .flowchart-label .text-inner-tspan {
  //   text-anchor: start;
  // }

  .node .katex path {
    fill: #000;
    stroke: #000;
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${e.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${e.lineColor};
    stroke-width: 2.0px;
  }

  .flowchart-link {
    stroke: ${e.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${e.edgeLabelBackground};
    rect {
      opacity: 0.5;
      background-color: ${e.edgeLabelBackground};
      fill: ${e.edgeLabelBackground};
    }
    text-align: center;
  }

  /* For html labels only */
  .labelBkg {
    background-color: ${I(e.edgeLabelBackground,.5)};
    // background-color: 
  }

  .cluster rect {
    fill: ${e.clusterBkg};
    stroke: ${e.clusterBorder};
    stroke-width: 1px;
  }

  .cluster text {
    fill: ${e.titleColor};
  }

  .cluster span,p {
    color: ${e.titleColor};
  }
  /* .cluster div {
    color: ${e.titleColor};
  } */

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: ${e.fontFamily};
    font-size: 12px;
    background: ${e.tertiaryColor};
    border: 1px solid ${e.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .flowchartTitleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${e.textColor};
  }
`,R=L;export{R as b,F as c,O as d,S as e,E as f,x as g,D as h,T as i,b as j};