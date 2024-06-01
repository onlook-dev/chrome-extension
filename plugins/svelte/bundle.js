import t from"path";import e from"fs";import{parse as n,walk as r}from"svelte/compiler";import{execSync as i}from"child_process";const o=",".charCodeAt(0),s=";".charCodeAt(0),a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",h=new Uint8Array(64),l=new Uint8Array(128);for(let t=0;t<64;t++){const e=a.charCodeAt(t);h[t]=e,l[e]=t}const u="undefined"!=typeof TextDecoder?new TextDecoder:"undefined"!=typeof Buffer?{decode:t=>Buffer.from(t.buffer,t.byteOffset,t.byteLength).toString()}:{decode(t){let e="";for(let n=0;n<t.length;n++)e+=String.fromCharCode(t[n]);return e}};function f(t,e,n,r,i){const o=r[i];let s=o-n[i];n[i]=o,s=s<0?-s<<1|1:s<<1;do{let n=31&s;s>>>=5,s>0&&(n|=32),t[e++]=h[n]}while(s>0);return e}class c{constructor(t){this.bits=t instanceof c?t.bits.slice():[]}add(t){this.bits[t>>5]|=1<<(31&t)}has(t){return!!(this.bits[t>>5]&1<<(31&t))}}class d{constructor(t,e,n){this.start=t,this.end=e,this.original=n,this.intro="",this.outro="",this.content=n,this.storeName=!1,this.edited=!1,this.previous=null,this.next=null}appendLeft(t){this.outro+=t}appendRight(t){this.intro=this.intro+t}clone(){const t=new d(this.start,this.end,this.original);return t.intro=this.intro,t.outro=this.outro,t.content=this.content,t.storeName=this.storeName,t.edited=this.edited,t}contains(t){return this.start<t&&t<this.end}eachNext(t){let e=this;for(;e;)t(e),e=e.next}eachPrevious(t){let e=this;for(;e;)t(e),e=e.previous}edit(t,e,n){return this.content=t,n||(this.intro="",this.outro=""),this.storeName=e,this.edited=!0,this}prependLeft(t){this.outro=t+this.outro}prependRight(t){this.intro=t+this.intro}split(t){const e=t-this.start,n=this.original.slice(0,e),r=this.original.slice(e);this.original=n;const i=new d(t,this.end,r);return i.outro=this.outro,this.outro="",this.end=t,this.edited?(i.edit("",!1),this.content=""):this.content=n,i.next=this.next,i.next&&(i.next.previous=i),i.previous=this,this.next=i,i}toString(){return this.intro+this.content+this.outro}trimEnd(t){if(this.outro=this.outro.replace(t,""),this.outro.length)return!0;const e=this.content.replace(t,"");return e.length?(e!==this.content&&(this.split(this.start+e.length).edit("",void 0,!0),this.edited&&this.edit(e,this.storeName,!0)),!0):(this.edit("",void 0,!0),this.intro=this.intro.replace(t,""),!!this.intro.length||void 0)}trimStart(t){if(this.intro=this.intro.replace(t,""),this.intro.length)return!0;const e=this.content.replace(t,"");if(e.length){if(e!==this.content){const t=this.split(this.end-e.length);this.edited&&t.edit(e,this.storeName,!0),this.edit("",void 0,!0)}return!0}return this.edit("",void 0,!0),this.outro=this.outro.replace(t,""),!!this.outro.length||void 0}}function g(){return"undefined"!=typeof window&&"function"==typeof window.btoa?t=>window.btoa(unescape(encodeURIComponent(t))):"function"==typeof Buffer?t=>Buffer.from(t,"utf-8").toString("base64"):()=>{throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.")}}const p=g();class v{constructor(t){this.version=3,this.file=t.file,this.sources=t.sources,this.sourcesContent=t.sourcesContent,this.names=t.names,this.mappings=function(t){const e=new Int32Array(5),n=16384,r=16348,i=new Uint8Array(n),a=i.subarray(0,r);let h=0,l="";for(let c=0;c<t.length;c++){const d=t[c];if(c>0&&(h===n&&(l+=u.decode(i),h=0),i[h++]=s),0!==d.length){e[0]=0;for(let t=0;t<d.length;t++){const n=d[t];h>r&&(l+=u.decode(a),i.copyWithin(0,r,h),h-=r),t>0&&(i[h++]=o),h=f(i,h,e,n,0),1!==n.length&&(h=f(i,h,e,n,1),h=f(i,h,e,n,2),h=f(i,h,e,n,3),4!==n.length&&(h=f(i,h,e,n,4)))}}}return l+u.decode(i.subarray(0,h))}(t.mappings),void 0!==t.x_google_ignoreList&&(this.x_google_ignoreList=t.x_google_ignoreList)}toString(){return JSON.stringify(this)}toUrl(){return"data:application/json;charset=utf-8;base64,"+p(this.toString())}}function m(t,e){const n=t.split(/[/\\]/),r=e.split(/[/\\]/);for(n.pop();n[0]===r[0];)n.shift(),r.shift();if(n.length){let t=n.length;for(;t--;)n[t]=".."}return n.concat(r).join("/")}const w=Object.prototype.toString;function b(t){const e=t.split("\n"),n=[];for(let t=0,r=0;t<e.length;t++)n.push(r),r+=e[t].length+1;return function(t){let e=0,r=n.length;for(;e<r;){const i=e+r>>1;t<n[i]?r=i:e=i+1}const i=e-1;return{line:i,column:t-n[i]}}}const y=/\w/;class x{constructor(t){this.hires=t,this.generatedCodeLine=0,this.generatedCodeColumn=0,this.raw=[],this.rawSegments=this.raw[this.generatedCodeLine]=[],this.pending=null}addEdit(t,e,n,r){if(e.length){let i=e.indexOf("\n",0),o=-1;for(;i>=0;){const s=[this.generatedCodeColumn,t,n.line,n.column];r>=0&&s.push(r),this.rawSegments.push(s),this.generatedCodeLine+=1,this.raw[this.generatedCodeLine]=this.rawSegments=[],this.generatedCodeColumn=0,o=i,i=e.indexOf("\n",i+1)}const s=[this.generatedCodeColumn,t,n.line,n.column];r>=0&&s.push(r),this.rawSegments.push(s),this.advance(e.slice(o+1))}else this.pending&&(this.rawSegments.push(this.pending),this.advance(e));this.pending=null}addUneditedChunk(t,e,n,r,i){let o=e.start,s=!0,a=!1;for(;o<e.end;){if(this.hires||s||i.has(o)){const e=[this.generatedCodeColumn,t,r.line,r.column];"boundary"===this.hires?y.test(n[o])?a||(this.rawSegments.push(e),a=!0):(this.rawSegments.push(e),a=!1):this.rawSegments.push(e)}"\n"===n[o]?(r.line+=1,r.column=0,this.generatedCodeLine+=1,this.raw[this.generatedCodeLine]=this.rawSegments=[],this.generatedCodeColumn=0,s=!0):(r.column+=1,this.generatedCodeColumn+=1,s=!1),o+=1}this.pending=null}advance(t){if(!t)return;const e=t.split("\n");if(e.length>1){for(let t=0;t<e.length-1;t++)this.generatedCodeLine++,this.raw[this.generatedCodeLine]=this.rawSegments=[];this.generatedCodeColumn=0}this.generatedCodeColumn+=e[e.length-1].length}}const C="\n",S={insertLeft:!1,insertRight:!1,storeName:!1};class E{constructor(t,e={}){const n=new d(0,t.length,t);Object.defineProperties(this,{original:{writable:!0,value:t},outro:{writable:!0,value:""},intro:{writable:!0,value:""},firstChunk:{writable:!0,value:n},lastChunk:{writable:!0,value:n},lastSearchedChunk:{writable:!0,value:n},byStart:{writable:!0,value:{}},byEnd:{writable:!0,value:{}},filename:{writable:!0,value:e.filename},indentExclusionRanges:{writable:!0,value:e.indentExclusionRanges},sourcemapLocations:{writable:!0,value:new c},storedNames:{writable:!0,value:{}},indentStr:{writable:!0,value:void 0},ignoreList:{writable:!0,value:e.ignoreList}}),this.byStart[0]=n,this.byEnd[t.length]=n}addSourcemapLocation(t){this.sourcemapLocations.add(t)}append(t){if("string"!=typeof t)throw new TypeError("outro content must be a string");return this.outro+=t,this}appendLeft(t,e){if("string"!=typeof e)throw new TypeError("inserted content must be a string");this._split(t);const n=this.byEnd[t];return n?n.appendLeft(e):this.intro+=e,this}appendRight(t,e){if("string"!=typeof e)throw new TypeError("inserted content must be a string");this._split(t);const n=this.byStart[t];return n?n.appendRight(e):this.outro+=e,this}clone(){const t=new E(this.original,{filename:this.filename});let e=this.firstChunk,n=t.firstChunk=t.lastSearchedChunk=e.clone();for(;e;){t.byStart[n.start]=n,t.byEnd[n.end]=n;const r=e.next,i=r&&r.clone();i&&(n.next=i,i.previous=n,n=i),e=r}return t.lastChunk=n,this.indentExclusionRanges&&(t.indentExclusionRanges=this.indentExclusionRanges.slice()),t.sourcemapLocations=new c(this.sourcemapLocations),t.intro=this.intro,t.outro=this.outro,t}generateDecodedMap(t){t=t||{};const e=Object.keys(this.storedNames),n=new x(t.hires),r=b(this.original);return this.intro&&n.advance(this.intro),this.firstChunk.eachNext((t=>{const i=r(t.start);t.intro.length&&n.advance(t.intro),t.edited?n.addEdit(0,t.content,i,t.storeName?e.indexOf(t.original):-1):n.addUneditedChunk(0,t,this.original,i,this.sourcemapLocations),t.outro.length&&n.advance(t.outro)})),{file:t.file?t.file.split(/[/\\]/).pop():void 0,sources:[t.source?m(t.file||"",t.source):t.file||""],sourcesContent:t.includeContent?[this.original]:void 0,names:e,mappings:n.raw,x_google_ignoreList:this.ignoreList?[0]:void 0}}generateMap(t){return new v(this.generateDecodedMap(t))}_ensureindentStr(){void 0===this.indentStr&&(this.indentStr=function(t){const e=t.split("\n"),n=e.filter((t=>/^\t+/.test(t))),r=e.filter((t=>/^ {2,}/.test(t)));if(0===n.length&&0===r.length)return null;if(n.length>=r.length)return"\t";const i=r.reduce(((t,e)=>{const n=/^ +/.exec(e)[0].length;return Math.min(n,t)}),1/0);return new Array(i+1).join(" ")}(this.original))}_getRawIndentString(){return this._ensureindentStr(),this.indentStr}getIndentString(){return this._ensureindentStr(),null===this.indentStr?"\t":this.indentStr}indent(t,e){const n=/^[^\r\n]/gm;var r;if(r=t,"[object Object]"===w.call(r)&&(e=t,t=void 0),void 0===t&&(this._ensureindentStr(),t=this.indentStr||"\t"),""===t)return this;const i={};if((e=e||{}).exclude){("number"==typeof e.exclude[0]?[e.exclude]:e.exclude).forEach((t=>{for(let e=t[0];e<t[1];e+=1)i[e]=!0}))}let o=!1!==e.indentStart;const s=e=>o?`${t}${e}`:(o=!0,e);this.intro=this.intro.replace(n,s);let a=0,h=this.firstChunk;for(;h;){const e=h.end;if(h.edited)i[a]||(h.content=h.content.replace(n,s),h.content.length&&(o="\n"===h.content[h.content.length-1]));else for(a=h.start;a<e;){if(!i[a]){const e=this.original[a];"\n"===e?o=!0:"\r"!==e&&o&&(o=!1,a===h.start||(this._splitChunk(h,a),h=h.next),h.prependRight(t))}a+=1}a=h.end,h=h.next}return this.outro=this.outro.replace(n,s),this}insert(){throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)")}insertLeft(t,e){return S.insertLeft||(console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"),S.insertLeft=!0),this.appendLeft(t,e)}insertRight(t,e){return S.insertRight||(console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"),S.insertRight=!0),this.prependRight(t,e)}move(t,e,n){if(n>=t&&n<=e)throw new Error("Cannot move a selection inside itself");this._split(t),this._split(e),this._split(n);const r=this.byStart[t],i=this.byEnd[e],o=r.previous,s=i.next,a=this.byStart[n];if(!a&&i===this.lastChunk)return this;const h=a?a.previous:this.lastChunk;return o&&(o.next=s),s&&(s.previous=o),h&&(h.next=r),a&&(a.previous=i),r.previous||(this.firstChunk=i.next),i.next||(this.lastChunk=r.previous,this.lastChunk.next=null),r.previous=h,i.next=a||null,h||(this.firstChunk=r),a||(this.lastChunk=i),this}overwrite(t,e,n,r){return r=r||{},this.update(t,e,n,{...r,overwrite:!r.contentOnly})}update(t,e,n,r){if("string"!=typeof n)throw new TypeError("replacement content must be a string");for(;t<0;)t+=this.original.length;for(;e<0;)e+=this.original.length;if(e>this.original.length)throw new Error("end is out of bounds");if(t===e)throw new Error("Cannot overwrite a zero-length range – use appendLeft or prependRight instead");this._split(t),this._split(e),!0===r&&(S.storeName||(console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"),S.storeName=!0),r={storeName:!0});const i=void 0!==r&&r.storeName,o=void 0!==r&&r.overwrite;if(i){const n=this.original.slice(t,e);Object.defineProperty(this.storedNames,n,{writable:!0,value:!0,enumerable:!0})}const s=this.byStart[t],a=this.byEnd[e];if(s){let t=s;for(;t!==a;){if(t.next!==this.byStart[t.end])throw new Error("Cannot overwrite across a split point");t=t.next,t.edit("",!1)}s.edit(n,i,!o)}else{const r=new d(t,e,"").edit(n,i);a.next=r,r.previous=a}return this}prepend(t){if("string"!=typeof t)throw new TypeError("outro content must be a string");return this.intro=t+this.intro,this}prependLeft(t,e){if("string"!=typeof e)throw new TypeError("inserted content must be a string");this._split(t);const n=this.byEnd[t];return n?n.prependLeft(e):this.intro=e+this.intro,this}prependRight(t,e){if("string"!=typeof e)throw new TypeError("inserted content must be a string");this._split(t);const n=this.byStart[t];return n?n.prependRight(e):this.outro=e+this.outro,this}remove(t,e){for(;t<0;)t+=this.original.length;for(;e<0;)e+=this.original.length;if(t===e)return this;if(t<0||e>this.original.length)throw new Error("Character is out of bounds");if(t>e)throw new Error("end must be greater than start");this._split(t),this._split(e);let n=this.byStart[t];for(;n;)n.intro="",n.outro="",n.edit(""),n=e>n.end?this.byStart[n.end]:null;return this}lastChar(){if(this.outro.length)return this.outro[this.outro.length-1];let t=this.lastChunk;do{if(t.outro.length)return t.outro[t.outro.length-1];if(t.content.length)return t.content[t.content.length-1];if(t.intro.length)return t.intro[t.intro.length-1]}while(t=t.previous);return this.intro.length?this.intro[this.intro.length-1]:""}lastLine(){let t=this.outro.lastIndexOf(C);if(-1!==t)return this.outro.substr(t+1);let e=this.outro,n=this.lastChunk;do{if(n.outro.length>0){if(t=n.outro.lastIndexOf(C),-1!==t)return n.outro.substr(t+1)+e;e=n.outro+e}if(n.content.length>0){if(t=n.content.lastIndexOf(C),-1!==t)return n.content.substr(t+1)+e;e=n.content+e}if(n.intro.length>0){if(t=n.intro.lastIndexOf(C),-1!==t)return n.intro.substr(t+1)+e;e=n.intro+e}}while(n=n.previous);return t=this.intro.lastIndexOf(C),-1!==t?this.intro.substr(t+1)+e:this.intro+e}slice(t=0,e=this.original.length){for(;t<0;)t+=this.original.length;for(;e<0;)e+=this.original.length;let n="",r=this.firstChunk;for(;r&&(r.start>t||r.end<=t);){if(r.start<e&&r.end>=e)return n;r=r.next}if(r&&r.edited&&r.start!==t)throw new Error(`Cannot use replaced character ${t} as slice start anchor.`);const i=r;for(;r;){!r.intro||i===r&&r.start!==t||(n+=r.intro);const o=r.start<e&&r.end>=e;if(o&&r.edited&&r.end!==e)throw new Error(`Cannot use replaced character ${e} as slice end anchor.`);const s=i===r?t-r.start:0,a=o?r.content.length+e-r.end:r.content.length;if(n+=r.content.slice(s,a),!r.outro||o&&r.end!==e||(n+=r.outro),o)break;r=r.next}return n}snip(t,e){const n=this.clone();return n.remove(0,t),n.remove(e,n.original.length),n}_split(t){if(this.byStart[t]||this.byEnd[t])return;let e=this.lastSearchedChunk;const n=t>e.end;for(;e;){if(e.contains(t))return this._splitChunk(e,t);e=n?this.byStart[e.end]:this.byEnd[e.start]}}_splitChunk(t,e){if(t.edited&&t.content.length){const n=b(this.original)(e);throw new Error(`Cannot split a chunk that has already been edited (${n.line}:${n.column} – "${t.original}")`)}const n=t.split(e);return this.byEnd[e]=t,this.byStart[e]=n,this.byEnd[n.end]=n,t===this.lastChunk&&(this.lastChunk=n),this.lastSearchedChunk=t,!0}toString(){let t=this.intro,e=this.firstChunk;for(;e;)t+=e.toString(),e=e.next;return t+this.outro}isEmpty(){let t=this.firstChunk;do{if(t.intro.length&&t.intro.trim()||t.content.length&&t.content.trim()||t.outro.length&&t.outro.trim())return!1}while(t=t.next);return!0}length(){let t=this.firstChunk,e=0;do{e+=t.intro.length+t.content.length+t.outro.length}while(t=t.next);return e}trimLines(){return this.trim("[\\r\\n]")}trim(t){return this.trimStart(t).trimEnd(t)}trimEndAborted(t){const e=new RegExp((t||"\\s")+"+$");if(this.outro=this.outro.replace(e,""),this.outro.length)return!0;let n=this.lastChunk;do{const t=n.end,r=n.trimEnd(e);if(n.end!==t&&(this.lastChunk===n&&(this.lastChunk=n.next),this.byEnd[n.end]=n,this.byStart[n.next.start]=n.next,this.byEnd[n.next.end]=n.next),r)return!0;n=n.previous}while(n);return!1}trimEnd(t){return this.trimEndAborted(t),this}trimStartAborted(t){const e=new RegExp("^"+(t||"\\s")+"+");if(this.intro=this.intro.replace(e,""),this.intro.length)return!0;let n=this.firstChunk;do{const t=n.end,r=n.trimStart(e);if(n.end!==t&&(n===this.lastChunk&&(this.lastChunk=n.next),this.byEnd[n.end]=n,this.byStart[n.next.start]=n.next,this.byEnd[n.next.end]=n.next),r)return!0;n=n.next}while(n);return!1}trimStart(t){return this.trimStartAborted(t),this}hasChanged(){return this.original!==this.toString()}_replaceRegexp(t,e){function n(t,n){return"string"==typeof e?e.replace(/\$(\$|&|\d+)/g,((e,n)=>{if("$"===n)return"$";if("&"===n)return t[0];return+n<t.length?t[+n]:`$${n}`})):e(...t,t.index,n,t.groups)}if(t.global){(function(t,e){let n;const r=[];for(;n=t.exec(e);)r.push(n);return r})(t,this.original).forEach((t=>{null!=t.index&&this.overwrite(t.index,t.index+t[0].length,n(t,this.original))}))}else{const e=this.original.match(t);e&&null!=e.index&&this.overwrite(e.index,e.index+e[0].length,n(e,this.original))}return this}_replaceString(t,e){const{original:n}=this,r=n.indexOf(t);return-1!==r&&this.overwrite(r,r+t.length,e),this}replace(t,e){return"string"==typeof t?this._replaceString(t,e):this._replaceRegexp(t,e)}_replaceAllString(t,e){const{original:n}=this,r=t.length;for(let i=n.indexOf(t);-1!==i;i=n.indexOf(t,i+r))this.overwrite(i,i+r,e);return this}replaceAll(t,e){if("string"==typeof t)return this._replaceAllString(t,e);if(!t.global)throw new TypeError("MagicString.prototype.replaceAll called with a non-global RegExp argument");return this._replaceRegexp(t,e)}}function k(){try{return i("git rev-parse HEAD").toString().trim()}catch(t){return null}}var L=Uint8Array,_=Uint16Array,R=Int32Array,O=new L([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),A=new L([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),T=new L([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),M=function(t,e){for(var n=new _(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];var i=new R(n[30]);for(r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},N=M(O,2),$=N.b,U=N.r;$[28]=258,U[258]=28;for(var I=M(A,0),j=I.b,D=I.r,z=new _(32768),B=0;B<32768;++B){var F=(43690&B)>>1|(21845&B)<<1;F=(61680&(F=(52428&F)>>2|(13107&F)<<2))>>4|(3855&F)<<4,z[B]=((65280&F)>>8|(255&F)<<8)>>1}var J=function(t,e,n){for(var r=t.length,i=0,o=new _(e);i<r;++i)t[i]&&++o[t[i]-1];var s,a=new _(e);for(i=1;i<e;++i)a[i]=a[i-1]+o[i-1]<<1;if(n){s=new _(1<<e);var h=15-e;for(i=0;i<r;++i)if(t[i])for(var l=i<<4|t[i],u=e-t[i],f=a[t[i]-1]++<<u,c=f|(1<<u)-1;f<=c;++f)s[z[f]>>h]=l}else for(s=new _(r),i=0;i<r;++i)t[i]&&(s[i]=z[a[t[i]-1]++]>>15-t[i]);return s},P=new L(288);for(B=0;B<144;++B)P[B]=8;for(B=144;B<256;++B)P[B]=9;for(B=256;B<280;++B)P[B]=7;for(B=280;B<288;++B)P[B]=8;var W=new L(32);for(B=0;B<32;++B)W[B]=5;var H=J(P,9,0),q=J(P,9,1),G=J(W,5,0),K=J(W,5,1),Q=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},V=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(7&e)&n},X=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(7&e)},Y=function(t){return(t+7)/8|0},Z=function(t,e,n){return(null==e||e<0)&&(e=0),(null==n||n>t.length)&&(n=t.length),new L(t.subarray(e,n))},tt=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],et=function(t,e,n){var r=new Error(e||tt[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,et),!n)throw r;return r},nt=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new L(0);var s=!n,a=s||2!=e.i,h=e.i;s&&(n=new L(3*i));var l=function(t){var e=n.length;if(t>e){var r=new L(Math.max(2*e,t));r.set(n),n=r}},u=e.f||0,f=e.p||0,c=e.b||0,d=e.l,g=e.d,p=e.m,v=e.n,m=8*i;do{if(!d){u=V(t,f,1);var w=V(t,f+1,3);if(f+=3,!w){var b=t[(U=Y(f)+4)-4]|t[U-3]<<8,y=U+b;if(y>i){h&&et(0);break}a&&l(c+b),n.set(t.subarray(U,y),c),e.b=c+=b,e.p=f=8*y,e.f=u;continue}if(1==w)d=q,g=K,p=9,v=5;else if(2==w){var x=V(t,f,31)+257,C=V(t,f+10,15)+4,S=x+V(t,f+5,31)+1;f+=14;for(var E=new L(S),k=new L(19),_=0;_<C;++_)k[T[_]]=V(t,f+3*_,7);f+=3*C;var R=Q(k),M=(1<<R)-1,N=J(k,R,1);for(_=0;_<S;){var U,I=N[V(t,f,M)];if(f+=15&I,(U=I>>4)<16)E[_++]=U;else{var D=0,z=0;for(16==U?(z=3+V(t,f,3),f+=2,D=E[_-1]):17==U?(z=3+V(t,f,7),f+=3):18==U&&(z=11+V(t,f,127),f+=7);z--;)E[_++]=D}}var B=E.subarray(0,x),F=E.subarray(x);p=Q(B),v=Q(F),d=J(B,p,1),g=J(F,v,1)}else et(1);if(f>m){h&&et(0);break}}a&&l(c+131072);for(var P=(1<<p)-1,W=(1<<v)-1,H=f;;H=f){var G=(D=d[X(t,f)&P])>>4;if((f+=15&D)>m){h&&et(0);break}if(D||et(2),G<256)n[c++]=G;else{if(256==G){H=f,d=null;break}var tt=G-254;if(G>264){var nt=O[_=G-257];tt=V(t,f,(1<<nt)-1)+$[_],f+=nt}var rt=g[X(t,f)&W],it=rt>>4;rt||et(3),f+=15&rt;F=j[it];if(it>3){nt=A[it];F+=X(t,f)&(1<<nt)-1,f+=nt}if(f>m){h&&et(0);break}a&&l(c+131072);var ot=c+tt;if(c<F){var st=o-F,at=Math.min(F,ot);for(st+c<0&&et(3);c<at;++c)n[c]=r[st+c]}for(;c<ot;++c)n[c]=n[c-F]}}e.l=d,e.p=H,e.b=c,e.f=u,d&&(u=1,e.m=p,e.d=g,e.n=v)}while(!u);return c!=n.length&&s?Z(n,0,c):n.subarray(0,c)},rt=function(t,e,n){n<<=7&e;var r=e/8|0;t[r]|=n,t[r+1]|=n>>8},it=function(t,e,n){n<<=7&e;var r=e/8|0;t[r]|=n,t[r+1]|=n>>8,t[r+2]|=n>>16},ot=function(t,e){for(var n=[],r=0;r<t.length;++r)t[r]&&n.push({s:r,f:t[r]});var i=n.length,o=n.slice();if(!i)return{t:ct,l:0};if(1==i){var s=new L(n[0].s+1);return s[n[0].s]=1,{t:s,l:1}}n.sort((function(t,e){return t.f-e.f})),n.push({s:-1,f:25001});var a=n[0],h=n[1],l=0,u=1,f=2;for(n[0]={s:-1,f:a.f+h.f,l:a,r:h};u!=i-1;)a=n[n[l].f<n[f].f?l++:f++],h=n[l!=u&&n[l].f<n[f].f?l++:f++],n[u++]={s:-1,f:a.f+h.f,l:a,r:h};var c=o[0].s;for(r=1;r<i;++r)o[r].s>c&&(c=o[r].s);var d=new _(c+1),g=st(n[u-1],d,0);if(g>e){r=0;var p=0,v=g-e,m=1<<v;for(o.sort((function(t,e){return d[e.s]-d[t.s]||t.f-e.f}));r<i;++r){var w=o[r].s;if(!(d[w]>e))break;p+=m-(1<<g-d[w]),d[w]=e}for(p>>=v;p>0;){var b=o[r].s;d[b]<e?p-=1<<e-d[b]++-1:++r}for(;r>=0&&p;--r){var y=o[r].s;d[y]==e&&(--d[y],++p)}g=e}return{t:new L(d),l:g}},st=function(t,e,n){return-1==t.s?Math.max(st(t.l,e,n+1),st(t.r,e,n+1)):e[t.s]=n},at=function(t){for(var e=t.length;e&&!t[--e];);for(var n=new _(++e),r=0,i=t[0],o=1,s=function(t){n[r++]=t},a=1;a<=e;++a)if(t[a]==i&&a!=e)++o;else{if(!i&&o>2){for(;o>138;o-=138)s(32754);o>2&&(s(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(s(i),--o;o>6;o-=6)s(8304);o>2&&(s(o-3<<5|8208),o=0)}for(;o--;)s(i);o=1,i=t[a]}return{c:n.subarray(0,r),n:e}},ht=function(t,e){for(var n=0,r=0;r<e.length;++r)n+=t[r]*e[r];return n},lt=function(t,e,n){var r=n.length,i=Y(e+2);t[i]=255&r,t[i+1]=r>>8,t[i+2]=255^t[i],t[i+3]=255^t[i+1];for(var o=0;o<r;++o)t[i+o+4]=n[o];return 8*(i+4+r)},ut=function(t,e,n,r,i,o,s,a,h,l,u){rt(e,u++,n),++i[256];for(var f=ot(i,15),c=f.t,d=f.l,g=ot(o,15),p=g.t,v=g.l,m=at(c),w=m.c,b=m.n,y=at(p),x=y.c,C=y.n,S=new _(19),E=0;E<w.length;++E)++S[31&w[E]];for(E=0;E<x.length;++E)++S[31&x[E]];for(var k=ot(S,7),L=k.t,R=k.l,M=19;M>4&&!L[T[M-1]];--M);var N,$,U,I,j=l+5<<3,D=ht(i,P)+ht(o,W)+s,z=ht(i,c)+ht(o,p)+s+14+3*M+ht(S,L)+2*S[16]+3*S[17]+7*S[18];if(h>=0&&j<=D&&j<=z)return lt(e,u,t.subarray(h,h+l));if(rt(e,u,1+(z<D)),u+=2,z<D){N=J(c,d,0),$=c,U=J(p,v,0),I=p;var B=J(L,R,0);rt(e,u,b-257),rt(e,u+5,C-1),rt(e,u+10,M-4),u+=14;for(E=0;E<M;++E)rt(e,u+3*E,L[T[E]]);u+=3*M;for(var F=[w,x],q=0;q<2;++q){var K=F[q];for(E=0;E<K.length;++E){var Q=31&K[E];rt(e,u,B[Q]),u+=L[Q],Q>15&&(rt(e,u,K[E]>>5&127),u+=K[E]>>12)}}}else N=H,$=P,U=G,I=W;for(E=0;E<a;++E){var V=r[E];if(V>255){it(e,u,N[(Q=V>>18&31)+257]),u+=$[Q+257],Q>7&&(rt(e,u,V>>23&31),u+=O[Q]);var X=31&V;it(e,u,U[X]),u+=I[X],X>3&&(it(e,u,V>>5&8191),u+=A[X])}else it(e,u,N[V]),u+=$[V]}return it(e,u,N[256]),u+$[256]},ft=new R([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),ct=new L(0),dt=function(){for(var t=new Int32Array(256),e=0;e<256;++e){for(var n=e,r=9;--r;)n=(1&n&&-306674912)^n>>>1;t[e]=n}return t}(),gt=function(){var t=-1;return{p:function(e){for(var n=t,r=0;r<e.length;++r)n=dt[255&n^e[r]]^n>>>8;t=n},d:function(){return~t}}},pt=function(t,e,n,r,i){if(!i&&(i={l:1},e.dictionary)){var o=e.dictionary.subarray(-32768),s=new L(o.length+t.length);s.set(o),s.set(t,o.length),t=s,i.w=o.length}return function(t,e,n,r,i,o){var s=o.z||t.length,a=new L(r+s+5*(1+Math.ceil(s/7e3))+i),h=a.subarray(r,a.length-i),l=o.l,u=7&(o.r||0);if(e){u&&(h[0]=o.r>>3);for(var f=ft[e-1],c=f>>13,d=8191&f,g=(1<<n)-1,p=o.p||new _(32768),v=o.h||new _(g+1),m=Math.ceil(n/3),w=2*m,b=function(e){return(t[e]^t[e+1]<<m^t[e+2]<<w)&g},y=new R(25e3),x=new _(288),C=new _(32),S=0,E=0,k=o.i||0,T=0,M=o.w||0,N=0;k+2<s;++k){var $=b(k),I=32767&k,j=v[$];if(p[I]=j,v[$]=I,M<=k){var z=s-k;if((S>7e3||T>24576)&&(z>423||!l)){u=ut(t,h,0,y,x,C,E,T,N,k-N,u),T=S=E=0,N=k;for(var B=0;B<286;++B)x[B]=0;for(B=0;B<30;++B)C[B]=0}var F=2,J=0,P=d,W=I-j&32767;if(z>2&&$==b(k-W))for(var H=Math.min(c,z)-1,q=Math.min(32767,k),G=Math.min(258,z);W<=q&&--P&&I!=j;){if(t[k+F]==t[k+F-W]){for(var K=0;K<G&&t[k+K]==t[k+K-W];++K);if(K>F){if(F=K,J=W,K>H)break;var Q=Math.min(W,K-2),V=0;for(B=0;B<Q;++B){var X=k-W+B&32767,tt=X-p[X]&32767;tt>V&&(V=tt,j=X)}}}W+=(I=j)-(j=p[I])&32767}if(J){y[T++]=268435456|U[F]<<18|D[J];var et=31&U[F],nt=31&D[J];E+=O[et]+A[nt],++x[257+et],++C[nt],M=k+F,++S}else y[T++]=t[k],++x[t[k]]}}for(k=Math.max(k,M);k<s;++k)y[T++]=t[k],++x[t[k]];u=ut(t,h,l,y,x,C,E,T,N,k-N,u),l||(o.r=7&u|h[u/8|0]<<3,u-=7,o.h=v,o.p=p,o.i=k,o.w=M)}else{for(k=o.w||0;k<s+l;k+=65535){var rt=k+65535;rt>=s&&(h[u/8|0]=l,rt=s),u=lt(h,u+1,t.subarray(k,rt))}o.i=s}return Z(a,0,r+Y(u)+i)}(t,null==e.level?6:e.level,null==e.mem?i.l?Math.ceil(1.5*Math.max(8,Math.min(13,Math.log(t.length)))):20:12+e.mem,n,r,i)},vt=function(t,e,n){for(;n;++e)t[e]=n,n>>>=8},mt=function(t,e){var n=e.filename;if(t[0]=31,t[1]=139,t[2]=8,t[8]=e.level<2?4:9==e.level?2:0,t[9]=3,0!=e.mtime&&vt(t,4,Math.floor(new Date(e.mtime||Date.now())/1e3)),n){t[3]=8;for(var r=0;r<=n.length;++r)t[r+10]=n.charCodeAt(r)}},wt=function(t){31==t[0]&&139==t[1]&&8==t[2]||et(6,"invalid gzip data");var e=t[3],n=10;4&e&&(n+=2+(t[10]|t[11]<<8));for(var r=(e>>3&1)+(e>>4&1);r>0;r-=!t[n++]);return n+(2&e)},bt=function(t){var e=t.length;return(t[e-4]|t[e-3]<<8|t[e-2]<<16|t[e-1]<<24)>>>0},yt=function(t){return 10+(t.filename?t.filename.length+1:0)},xt=function(t,e){return(8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31)&&et(6,"invalid zlib data"),(t[1]>>5&1)==+!e&&et(6,"invalid zlib data: "+(32&t[1]?"need":"unexpected")+" dictionary"),2+(t[1]>>3&4)};function Ct(t,e){return 31==t[0]&&139==t[1]&&8==t[2]?function(t,e){var n=wt(t);return n+8>t.length&&et(6,"invalid gzip data"),nt(t.subarray(n,-8),{i:2},e&&e.out||new L(bt(t)),e&&e.dictionary)}(t,e):8!=(15&t[0])||t[0]>>4>7||(t[0]<<8|t[1])%31?function(t,e){return nt(t,{i:2},e&&e.out,e&&e.dictionary)}(t,e):function(t,e){return nt(t.subarray(xt(t,e&&e.dictionary),-4),{i:2},e&&e.out,e&&e.dictionary)}(t,e)}var St="undefined"!=typeof TextEncoder&&new TextEncoder,Et="undefined"!=typeof TextDecoder&&new TextDecoder;try{Et.decode(ct,{stream:!0}),1}catch(t){}var kt=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:Z(t,n-1)};i?3==i?(r=((15&r)<<18|(63&t[n++])<<12|(63&t[n++])<<6|63&t[n++])-65536,e+=String.fromCharCode(55296|r>>10,56320|1023&r)):e+=1&i?String.fromCharCode((31&r)<<6|63&t[n++]):String.fromCharCode((15&r)<<12|(63&t[n++])<<6|63&t[n++]):e+=String.fromCharCode(r)}};const Lt=({root:i=t.resolve("."),absolute:o=!1,commit_hash:s=k()})=>({markup:({content:a,filename:h})=>{const l=t.resolve(i,"node_modules"),u=t.resolve(i,".svelte-kit");if(h.startsWith(l)||h.startsWith(u))return{code:a};let f=0;try{let t=e.readFileSync(h).toString().split("\n").length,n=a.split("\n").length;f=t-n}catch(t){f=0}const c=n(a),d=new E(a,{filename:h});return r(c.html,{enter(n){if("Element"===n.type){const r=function(n,r,i,o,s,a,h){const{startTag:l,endTag:u}=function(t,e,n){let r,i=null;if(e.children&&e.children.length>0){r=e.children[0].start,i=e.children[e.children.length-1].end;const n=`</${e.name}>`;i=t.indexOf(n,i),-1===i&&(i=e.end)}else r=t.indexOf(">",e.start)+1,"/"===t[r-2]?r=e.end:i=t.lastIndexOf("<",e.end);function o(e){if(!e||!t)return null;return{line:t.slice(0,e).split("\n").length+n,column:e-t.lastIndexOf("\n",e-1)}}return{startTag:{start:o(e.start),end:o(r)},endTag:r===e.end?null:{start:o(i),end:o(e.end)}}}(r,n,i),f={path:h?o:t.relative(a,o),startTag:l,endTag:u,commit:s};return function(t,n,r){const i=e.readFileSync(t,"utf8"),o=Ot(i,n);if(console.log("S:","'"+o+"'"),r){const t=Ot(i,r);console.log("E:","'"+t+"'")}else console.log("E:","null")}(o,l,u),_t(f)}(n,a,f,h,s,i,o),l=`data-onlook-id='${r}'`,u=n.start+n.name.length+1;d.appendLeft(u,` ${l}`)}}}),{code:d.toString(),map:d.generateMap({hires:!0})}}});function _t(t){const e=function(t,e){if(e){for(var n=new L(t.length),r=0;r<t.length;++r)n[r]=t.charCodeAt(r);return n}if(St)return St.encode(t);var i=t.length,o=new L(t.length+(t.length>>1)),s=0,a=function(t){o[s++]=t};for(r=0;r<i;++r){if(s+5>o.length){var h=new L(s+8+(i-r<<1));h.set(o),o=h}var l=t.charCodeAt(r);l<128||e?a(l):l<2048?(a(192|l>>6),a(128|63&l)):l>55295&&l<57344?(a(240|(l=65536+(1047552&l)|1023&t.charCodeAt(++r))>>18),a(128|l>>12&63),a(128|l>>6&63),a(128|63&l)):(a(224|l>>12),a(128|l>>6&63),a(128|63&l))}return Z(o,0,s)}(JSON.stringify(t)),n=function(t,e){e||(e={});var n=gt(),r=t.length;n.p(t);var i=pt(t,e,yt(e),8),o=i.length;return mt(i,e),vt(i,o-8,n.d()),vt(i,o-4,r),i}(e);return Buffer.from(n).toString("base64")}function Rt(t){const e=function(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}if(Et)return Et.decode(t);var i=kt(t),o=i.s;return(n=i.r).length&&et(8),o}(Ct(Buffer.from(t,"base64")));return JSON.parse(e)}function Ot(t,e){const n=t.split("\n");if(e){const{start:t,end:r}=e;if(!t||!r)return null;if(t.line===r.line)return n[t.line-1].substring(t.column-1,r.column-1);{let e=[];e.push(n[t.line-1].substring(t.column-1));for(let i=t.line;i<r.line-1;i++)e.push(n[i]);return e.push(n[r.line-1].substring(0,r.column-1)),e.join("\n")}}return null}export{_t as compress,Rt as decompress,Ot as extractTagContent,Lt as onlookPreprocess};