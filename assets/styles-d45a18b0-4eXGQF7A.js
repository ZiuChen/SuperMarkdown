import{A as e,At as t,C as n,Et as r,Pt as i,R as a,T as o,_ as s,b as c,cn as l,ln as u,on as d,ot as f,p,s as m,sn as h,z as g}from"./mermaid-7ea9cbd6-CWj4G8EI.js";import{t as _}from"./channel-DAzbB0CF.js";import{t as v}from"./graphlib-DnWv_P8P.js";import{t as y}from"./index-5325376f-CO2Ea527.js";function b(e){return typeof e==`string`?new h([document.querySelectorAll(e)],[document.documentElement]):new h([u(e)],l)}function x(e,t){return!!e.children(t).length}function S(e){return w(e.v)+`:`+w(e.w)+`:`+w(e.name)}var C=/:/g;function w(e){return e?String(e).replace(C,`\\:`):``}function T(e,t){t&&e.attr(`style`,t)}function E(e,t,n){t&&e.attr(`class`,t).attr(`class`,n+` `+e.attr(`class`))}function D(e,t){var n=t.graph();if(f(n)){var i=n.transition;if(r(i))return i(e)}return e}function O(e,t){var n=e.append(`foreignObject`).attr(`width`,`100000`),r=n.append(`xhtml:div`);r.attr(`xmlns`,`http://www.w3.org/1999/xhtml`);var i=t.label;switch(typeof i){case`function`:r.insert(i);break;case`object`:r.insert(function(){return i});break;default:r.html(i)}T(r,t.labelStyle),r.style(`display`,`inline-block`),r.style(`white-space`,`nowrap`);var a=r.node().getBoundingClientRect();return n.attr(`width`,a.width).attr(`height`,a.height),n}var k={},A=function(e){let t=Object.keys(e);for(let n of t)k[n]=e[n]},j=async function(t,n,r,i,a,l){let u=i.select(`[id="${r}"]`),d=Object.keys(t);for(let r of d){let i=t[r],d=`default`;i.classes.length>0&&(d=i.classes.join(` `)),d+=` flowchart-label`;let f=c(i.styles),h=i.text===void 0?i.id:i.text,g;if(o.info(`vertex`,i,i.labelType),i.labelType===`markdown`)o.info(`vertex`,i,i.labelType);else if(p(s().flowchart.htmlLabels))g=O(u,{label:h}).node(),g.parentNode.removeChild(g);else{let e=a.createElementNS(`http://www.w3.org/2000/svg`,`text`);e.setAttribute(`style`,f.labelStyle.replace(`color:`,`fill:`));let t=h.split(m.lineBreakRegex);for(let n of t){let t=a.createElementNS(`http://www.w3.org/2000/svg`,`tspan`);t.setAttributeNS(`http://www.w3.org/XML/1998/namespace`,`xml:space`,`preserve`),t.setAttribute(`dy`,`1em`),t.setAttribute(`x`,`1`),t.textContent=n,e.appendChild(t)}g=e}let _=0,v=``;switch(i.type){case`round`:_=5,v=`rect`;break;case`square`:v=`rect`;break;case`diamond`:v=`question`;break;case`hexagon`:v=`hexagon`;break;case`odd`:v=`rect_left_inv_arrow`;break;case`lean_right`:v=`lean_right`;break;case`lean_left`:v=`lean_left`;break;case`trapezoid`:v=`trapezoid`;break;case`inv_trapezoid`:v=`inv_trapezoid`;break;case`odd_right`:v=`rect_left_inv_arrow`;break;case`circle`:v=`circle`;break;case`ellipse`:v=`ellipse`;break;case`stadium`:v=`stadium`;break;case`subroutine`:v=`subroutine`;break;case`cylinder`:v=`cylinder`;break;case`group`:v=`rect`;break;case`doublecircle`:v=`doublecircle`;break;default:v=`rect`}let y=await e(h,s());n.setNode(i.id,{labelStyle:f.labelStyle,shape:v,labelText:y,labelType:i.labelType,rx:_,ry:_,class:d,style:f.style,id:i.id,link:i.link,linkTarget:i.linkTarget,tooltip:l.db.getTooltip(i.id)||``,domId:l.db.lookUpDomId(i.id),haveCallback:i.haveCallback,width:i.type===`group`?500:void 0,dir:i.dir,type:i.type,props:i.props,padding:s().flowchart.padding}),o.info(`setNode`,{labelStyle:f.labelStyle,labelType:i.labelType,shape:v,labelText:y,rx:_,ry:_,class:d,style:f.style,id:i.id,domId:l.db.lookUpDomId(i.id),width:i.type===`group`?500:void 0,type:i.type,dir:i.dir,props:i.props,padding:s().flowchart.padding})}},M=async function(t,r,a){o.info(`abc78 edges = `,t);let l=0,u={},d,f;if(t.defaultStyle!==void 0){let e=c(t.defaultStyle);d=e.style,f=e.labelStyle}for(let a of t){l++;let p=`L-`+a.start+`-`+a.end;u[p]===void 0?(u[p]=0,o.info(`abc78 new entry`,p,u[p])):(u[p]++,o.info(`abc78 new entry`,p,u[p]));let h=p+`-`+u[p];o.info(`abc78 new link id to be used is`,p,h,u[p]);let g=`LS-`+a.start,_=`LE-`+a.end,v={style:``,labelStyle:``};switch(v.minlen=a.length||1,a.type===`arrow_open`?v.arrowhead=`none`:v.arrowhead=`normal`,v.arrowTypeStart=`arrow_open`,v.arrowTypeEnd=`arrow_open`,a.type){case`double_arrow_cross`:v.arrowTypeStart=`arrow_cross`;case`arrow_cross`:v.arrowTypeEnd=`arrow_cross`;break;case`double_arrow_point`:v.arrowTypeStart=`arrow_point`;case`arrow_point`:v.arrowTypeEnd=`arrow_point`;break;case`double_arrow_circle`:v.arrowTypeStart=`arrow_circle`;case`arrow_circle`:v.arrowTypeEnd=`arrow_circle`;break}let y=``,b=``;switch(a.stroke){case`normal`:y=`fill:none;`,d!==void 0&&(y=d),f!==void 0&&(b=f),v.thickness=`normal`,v.pattern=`solid`;break;case`dotted`:v.thickness=`normal`,v.pattern=`dotted`,v.style=`fill:none;stroke-width:2px;stroke-dasharray:3;`;break;case`thick`:v.thickness=`thick`,v.pattern=`solid`,v.style=`stroke-width: 3.5px;fill:none;`;break;case`invisible`:v.thickness=`invisible`,v.pattern=`solid`,v.style=`stroke-width: 0;fill:none;`;break}if(a.style!==void 0){let e=c(a.style);y=e.style,b=e.labelStyle}v.style=v.style+=y,v.labelStyle=v.labelStyle+=b,a.interpolate===void 0?t.defaultInterpolate===void 0?v.curve=n(k.curve,i):v.curve=n(t.defaultInterpolate,i):v.curve=n(a.interpolate,i),a.text===void 0?a.style!==void 0&&(v.arrowheadStyle=`fill: #333`):(v.arrowheadStyle=`fill: #333`,v.labelpos=`c`),v.labelType=a.labelType,v.label=await e(a.text.replace(m.lineBreakRegex,`
`),s()),a.style===void 0&&(v.style=v.style||`stroke: #333; stroke-width: 1.5px;fill:none;`),v.labelStyle=v.labelStyle.replace(`color:`,`fill:`),v.id=h,v.classes=`flowchart-link `+g+` `+_,r.setEdge(a.start,a.end,v,l)}},N={setConf:A,addVertices:j,addEdges:M,getClasses:function(e,t){return t.db.getClasses()},draw:async function(e,t,n,r){o.info(`Drawing flowchart`);let i=r.db.getDirection();i===void 0&&(i=`TD`);let{securityLevel:c,flowchart:l}=s(),u=l.nodeSpacing||50,f=l.rankSpacing||50,p;c===`sandbox`&&(p=d(`#i`+t));let m=d(c===`sandbox`?p.nodes()[0].contentDocument.body:`body`),h=c===`sandbox`?p.nodes()[0].contentDocument:document,_=new v({multigraph:!0,compound:!0}).setGraph({rankdir:i,nodesep:u,ranksep:f,marginx:0,marginy:0}).setDefaultEdgeLabel(function(){return{}}),x,S=r.db.getSubGraphs();o.info(`Subgraphs - `,S);for(let e=S.length-1;e>=0;e--)x=S[e],o.info(`Subgraph - `,x),r.db.addVertex(x.id,{text:x.title,type:x.labelType},`group`,void 0,x.classes,x.dir);let C=r.db.getVertices(),w=r.db.getEdges();o.info(`Edges`,w);let T=0;for(T=S.length-1;T>=0;T--){x=S[T],b(`cluster`).append(`text`);for(let e=0;e<x.nodes.length;e++)o.info(`Setting up subgraphs`,x.nodes[e],x.id),_.setParent(x.nodes[e],x.id)}await j(C,_,t,m,h,r),await M(w,_);let E=m.select(`[id="${t}"]`);if(await y(m.select(`#`+t+` g`),_,[`point`,`circle`,`cross`],`flowchart`,t),g.insertTitle(E,`flowchartTitleText`,l.titleTopMargin,r.db.getDiagramTitle()),a(_,E,l.diagramPadding,l.useMaxWidth),r.db.indexNodes(`subGraph`+T),!l.htmlLabels){let e=h.querySelectorAll(`[id="`+t+`"] .edgeLabel .label`);for(let t of e){let e=t.getBBox(),n=h.createElementNS(`http://www.w3.org/2000/svg`,`rect`);n.setAttribute(`rx`,0),n.setAttribute(`ry`,0),n.setAttribute(`width`,e.width),n.setAttribute(`height`,e.height),t.insertBefore(n,t.firstChild)}}Object.keys(C).forEach(function(e){let n=C[e];if(n.link){let r=d(`#`+t+` [id="`+e+`"]`);if(r){let e=h.createElementNS(`http://www.w3.org/2000/svg`,`a`);e.setAttributeNS(`http://www.w3.org/2000/svg`,`class`,n.classes.join(` `)),e.setAttributeNS(`http://www.w3.org/2000/svg`,`href`,n.link),e.setAttributeNS(`http://www.w3.org/2000/svg`,`rel`,`noopener`),c===`sandbox`?e.setAttributeNS(`http://www.w3.org/2000/svg`,`target`,`_top`):n.linkTarget&&e.setAttributeNS(`http://www.w3.org/2000/svg`,`target`,n.linkTarget);let t=r.insert(function(){return e},`:first-child`),i=r.select(`.label-container`);i&&t.append(function(){return i.node()});let a=r.select(`.label`);a&&t.append(function(){return a.node()})}}})}},P=(e,n)=>{let r=_;return t(r(e,`r`),r(e,`g`),r(e,`b`),n)},F=e=>`.label {
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
    background-color: ${P(e.edgeLabelBackground,.5)};
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
`;export{T as a,x as c,E as i,b as l,F as n,D as o,O as r,S as s,N as t};