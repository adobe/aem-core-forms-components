/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@adobe/json-formula/dist/cjs/json-formula.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@adobe/json-formula/dist/cjs/json-formula.js ***!
  \*******************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(t,r)=>{for(var n in r)e.o(r,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:r[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{Formula:()=>gt,jsonFormula:()=>bt});const r="UnquotedIdentifier",n="QuotedIdentifier",i="Rbracket",u="Rparen",a="Comma",o="Colon",s="Concatenate",c="Rbrace",l="Number",h="Current",f="Global",p="Expref",v="Pipe",y="Subtract",d="Multiply",_="Power",g="Union",b="Divide",m="Flatten",w="Star",k="Filter",O="Lbrace",x="Lbracket",E="Lparen",j="Literal";var S;function P(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function T(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var N=0,A=2,I=3,M=5,C=7,D=8,L=9,F=p,U=(T(S={},N,"number"),T(S,1,"any"),T(S,A,"string"),T(S,I,"array"),T(S,4,"object"),T(S,M,"boolean"),T(S,6,"expression"),T(S,C,"null"),T(S,D,"Array<number>"),T(S,L,"Array<string>"),T(S,10,"class"),T(S,11,"Array<array>"),S);function R(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(null===e)return C;var r=t?Object.getPrototypeOf(e).valueOf.call(e):e;switch(Object.prototype.toString.call(r)){case"[object String]":return A;case"[object Number]":return N;case"[object Array]":return I;case"[object Boolean]":return M;case"[object Null]":return C;case"[object Object]":return r.jmespathType===F?6:4;default:return 4}}function G(e){return[R(e),R(e,!1)]}function H(e,t,r,n,i){var u=e[0];if(-1!==t.findIndex((function(e){return 1===e||u===e})))return r;var a=!1;if((4===u||1===t.length&&10===t[0])&&(a=!0),u===I&&1===t.length&&4===t[0]&&(a=!0),t.includes(11)){if(u===I&&(r.forEach((function(e){e instanceof Array||(a=!0)})),!a))return r;a=!0}if(a)throw new Error("TypeError: ".concat(n," expected argument to be type ").concat(U[t[0]]," but received type ").concat(U[u]," instead."));var o=-1;if(u===I&&t.includes(L)&&t.includes(D)&&(o=r.length>0&&"string"==typeof r[0]?L:D),-1===o&&[L,D,I].includes(u)&&(o=t.find((function(e){return[L,D,I].includes(e)}))),-1===o&&(o=function(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,i,u=[],a=!0,o=!1;try{for(r=r.call(e);!(a=(n=r.next()).done)&&(u.push(n.value),!t||u.length!==t);a=!0);}catch(e){o=!0,i=e}finally{try{a||null==r.return||r.return()}finally{if(o)throw i}}return u}}(e,t)||function(e,t){if(e){if("string"==typeof e)return P(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?P(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}(t,1)[0]),1===o)return r;if(o===L||o===D||o===I){if(o===I)return u===D||u===L?r:null===r?[]:[r];var s=o===D?N:A;if(u===I){for(var c=r.slice(),l=0;l<c.length;l+=1){var h=G(c[l]);c[l]=H(h,[s],c[l],n,i)}return c}if([N,A,C,M].includes(s))return[H(e,[s],r,n,i)]}else{if(o===N)return[A,M,C].includes(u)?i(r):0;if(o===A)return u===C||4===u?"":Object.getPrototypeOf(r).toString.call(r);if(o===M)return!!r;if(4===o&&4===e[1])return r}throw new Error("unhandled argument")}function q(e){return null!==e&&"[object Array]"===Object.prototype.toString.call(e)}function Q(e){return null!==e&&"[object Object]"===Object.prototype.toString.call(e)}function z(e){return null==e?e:q(e)?e.map((function(e){return z(e)})):Object.getPrototypeOf(e).valueOf.call(e)}function B(e,t){var r=z(e),n=z(t);if(r===n)return!0;if(Object.prototype.toString.call(r)!==Object.prototype.toString.call(n))return!1;if(!0===q(r)){if(r.length!==n.length)return!1;for(var i=0;i<r.length;i+=1)if(!1===B(r[i],n[i]))return!1;return!0}if(!0===Q(r)){var u={};for(var a in r)if(hasOwnProperty.call(r,a)){if(!1===B(r[a],n[a]))return!1;u[a]=!0}for(var o in n)if(hasOwnProperty.call(n,o)&&!0!==u[o])return!1;return!0}return!1}function J(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function $(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,i,u=[],a=!0,o=!1;try{for(r=r.call(e);!(a=(n=r.next()).done)&&(u.push(n.value),!t||u.length!==t);a=!0);}catch(e){o=!0,i=e}finally{try{a||null==r.return||r.return()}finally{if(o)throw i}}return u}}(e,t)||V(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function V(e,t){if(e){if("string"==typeof e)return W(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?W(e,t):void 0}}function W(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Y(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function K(e){if(null===e)return!0;var t=z(e);if(""===t||!1===t||null===t)return!0;if(q(t)&&0===t.length)return!0;if(Q(t)){for(var r in t)if(Object.prototype.hasOwnProperty.call(t,r))return!1;return!0}return!t}var Z=function(){function e(t,r,n,i,u,a){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.runtime=t,this.globals=r,this.toNumber=n,this.toString=i,this.debug=u,this.language=a}var t,r;return t=e,(r=[{key:"search",value:function(e,t){return this.visit(e,t)}},{key:"visit",value:function(e,t){var r,n=this,i=(J(r={Field:function(e,t){if(null!==t&&Q(t)){var r=t[e.name];if("function"==typeof r&&(r=void 0),void 0===r){try{n.debug.push("Failed to find: '".concat(e.name,"'"));var i=Object.keys(t).map((function(e){return"'".concat(e,"'")})).toString();i.length&&n.debug.push("Available fields: ".concat(i))}catch(e){}return null}return r}return null},Subexpression:function(e,t){for(var r=n.visit(e.children[0],t),i=1;i<e.children.length;i+=1)if(null===(r=n.visit(e.children[1],r)))return null;return r},IndexExpression:function(e,t){var r=n.visit(e.children[0],t);return n.visit(e.children[1],r)},Index:function(e,t){if(q(t)){var r=n.toNumber(n.visit(e.value,t));r<0&&(r=t.length+r);var i=t[r];return void 0===i?(n.debug.push("Index ".concat(r," out of range")),null):i}if(Q(t)){var u=n.toString(n.visit(e.value,t)),a=t[u];return void 0===a?(n.debug.push("Key ".concat(u," does not exist")),null):a}return n.debug.push("left side of index expression ".concat(t," is not an array or object.")),null},Slice:function(e,t){if(!q(t))return null;var r=e.children.slice(0).map((function(e){return null!=e?n.toNumber(n.visit(e,t)):null})),i=$(n.computeSliceParams(t.length,r),3),u=i[0],a=i[1],o=i[2],s=[];if(o>0)for(var c=u;c<a;c+=o)s.push(t[c]);else for(var l=u;l>a;l+=o)s.push(t[l]);return s},Projection:function(e,t){var r=n.visit(e.children[0],t);if(!q(r))return null;var i=[];return r.forEach((function(t){var r=n.visit(e.children[1],t);null!==r&&i.push(r)})),i},ValueProjection:function(e,t){var r=n.visit(e.children[0],t);if(!Q(z(r)))return null;var i,u=[];return(i=r,Object.values(i)).forEach((function(t){var r=n.visit(e.children[1],t);null!==r&&u.push(r)})),u},FilterProjection:function(e,t){var r=n.visit(e.children[0],t);if(!q(r))return null;var i=r.filter((function(t){return!K(n.visit(e.children[2],t))})),u=[];return i.forEach((function(t){var r=n.visit(e.children[1],t);null!==r&&u.push(r)})),u},Comparator:function(e,t){var r=n.visit(e.children[0],t),i=n.visit(e.children[1],t);if("EQ"===e.name)return B(r,i);if("NE"===e.name)return!B(r,i);if("GT"===e.name)return r>i;if("GTE"===e.name)return r>=i;if("LT"===e.name)return r<i;if("LTE"===e.name)return r<=i;throw new Error("Unknown comparator: ".concat(e.name))}},"Flatten",(function(e,t){var r=n.visit(e.children[0],t);if(!q(r))return null;var i=[];return r.forEach((function(e){var t;q(e)?i.push.apply(i,function(e){if(Array.isArray(e))return W(e)}(t=e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(t)||V(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()):i.push(e)})),i})),J(r,"Identity",(function(e,t){return t})),J(r,"MultiSelectList",(function(e,t){return null===t?null:e.children.map((function(e){return n.visit(e,t)}))})),J(r,"MultiSelectHash",(function(e,t){if(null===t)return null;var r={};return e.children.forEach((function(e){r[e.name]=n.visit(e.value,t)})),r})),J(r,"OrExpression",(function(e,t){var r=n.visit(e.children[0],t);return K(r)&&(r=n.visit(e.children[1],t)),r})),J(r,"AndExpression",(function(e,t){var r=n.visit(e.children[0],t);return!0===K(r)?r:n.visit(e.children[1],t)})),J(r,"AddExpression",(function(e,t){var r=n.visit(e.children[0],t),i=n.visit(e.children[1],t);return n.applyOperator(r,i,"+")})),J(r,"ConcatenateExpression",(function(e,t){var r=n.visit(e.children[0],t),i=n.visit(e.children[1],t);return r=H(G(r),[2,9],r,"concatenate",n.toNumber),i=H(G(i),[2,9],i,"concatenate",n.toNumber),n.applyOperator(r,i,"&")})),J(r,"UnionExpression",(function(e,t){var r=n.visit(e.children[0],t),i=n.visit(e.children[1],t);return r=H(G(r),[3],r,"union",n.toNumber),i=H(G(i),[3],i,"union",n.toNumber),r.concat(i)})),J(r,"SubtractExpression",(function(e,t){var r=n.visit(e.children[0],t),i=n.visit(e.children[1],t);return n.applyOperator(r,i,"-")})),J(r,"MultiplyExpression",(function(e,t){var r=n.visit(e.children[0],t),i=n.visit(e.children[1],t);return n.applyOperator(r,i,"*")})),J(r,"DivideExpression",(function(e,t){var r=n.visit(e.children[0],t),i=n.visit(e.children[1],t);return n.applyOperator(r,i,"/")})),J(r,"PowerExpression",(function(e,t){var r=n.visit(e.children[0],t),i=n.visit(e.children[1],t);return n.applyOperator(r,i,"^")})),J(r,"NotExpression",(function(e,t){return K(n.visit(e.children[0],t))})),J(r,"Literal",(function(e){return e.value})),J(r,"Number",(function(e){return e.value})),J(r,"Pipe",(function(e,t){var r=n.visit(e.children[0],t);return n.visit(e.children[1],r)})),J(r,"Current",(function(e,t){return t})),J(r,"Global",(function(e){var t=n.globals[e.name];return void 0===t?null:t})),J(r,"Function",(function(e,t){if("if"===e.name)return n.runtime.callFunction(e.name,e.children,t,n,!1);var r=e.children.map((function(e){return n.visit(e,t)}));return n.runtime.callFunction(e.name,r,t,n)})),J(r,"ExpressionReference",(function(e){var t=$(e.children,1)[0];return t.jmespathType="Expref",t})),r),u=e&&i[e.type];if(!u)throw new Error("Unknown/missing node type ".concat(e&&e.type||""));return u(e,t)}},{key:"computeSliceParams",value:function(e,t){function r(e,t,r){var n=t;return n<0?(n+=e)<0&&(n=r<0?-1:0):n>=e&&(n=r<0?e-1:e),n}var n=$(t,3),i=n[0],u=n[1],a=n[2];if(null===a)a=1;else if(0===a){var o=new Error("Invalid slice, step cannot be 0");throw o.name="RuntimeError",o}var s=a<0;return[i=null===i?s?e-1:0:r(e,i,a),u=null===u?s?-1:e:r(e,u,a),a]}},{key:"applyOperator",value:function(e,t,r){var n=this;if(q(e)&&q(t)){var i=e.length<t.length?e:t,u=Math.abs(e.length-t.length);i.length+=u,i.fill(null,i.length-u);for(var a=[],o=0;o<e.length;o+=1)a.push(this.applyOperator(e[o],t[o],r));return a}if(q(e))return e.map((function(e){return n.applyOperator(e,t,r)}));if(q(t))return t.map((function(t){return n.applyOperator(e,t,r)}));if("*"===r)return this.toNumber(e)*this.toNumber(t);if("&"===r)return e+t;if("+"===r)return this.toNumber(e)+this.toNumber(t);if("-"===r)return this.toNumber(e)-this.toNumber(t);if("/"===r){var s=e/t;return Number.isFinite(s)?s:null}if("^"===r)return Math.pow(e,t);throw new Error("Unknown operator: ".concat(r))}}])&&Y(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function X(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function ee(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var te=r,re=n,ne=i,ie=u,ue=a,ae=o,oe=l,se=h,ce=v,le="Or",he="And",fe="Dot",pe=x,ve=E,ye=j,de={".":fe,",":ue,":":ae,"{":O,"}":c,"]":ne,"(":ve,")":ie,"@":se},_e={"<":!0,">":!0,"=":!0,"!":!0},ge={" ":!0,"\t":!0,"\n":!0};function be(e,t){return e>="0"&&e<="9"||t&&"-"===e||"."===e}function me(e){return e>="a"&&e<="z"||e>="A"&&e<="Z"||e>="0"&&e<="9"||"_"===e}function we(e,t){var r=e[t];return"$"===r?e.length>t&&me(e[t+1]):r>="a"&&r<="z"||r>="A"&&r<="Z"||"_"===r}var ke,Oe=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];X(this,e),this._allowedGlobalNames=t,this.debug=r}var t,r;return t=e,(r=[{key:"tokenize",value:function(e){var t,r,n,i=[];for(this._current=0;this._current<e.length;){var u=i.length?i.slice(-1)[0].type:null;if(this._isGlobal(u,e,this._current))i.push(this._consumeGlobal(e));else if(we(e,this._current))t=this._current,r=this._consumeUnquotedIdentifier(e),i.push({type:te,value:r,start:t});else if(void 0!==de[e[this._current]])i.push({type:de[e[this._current]],value:e[this._current],start:this._current}),this._current+=1;else if("-"===e[this._current]&&![se,oe,ie,te,re,ne].includes(u)||be(e[this._current],!1))n=this._consumeNumber(e),i.push(n);else if("["===e[this._current])n=this._consumeLBracket(e),i.push(n);else if('"'===e[this._current])t=this._current,r=this._consumeQuotedIdentifier(e),i.push({type:re,value:r,start:t});else if("'"===e[this._current])t=this._current,r=this._consumeRawStringLiteral(e),i.push({type:ye,value:r,start:t});else if("`"===e[this._current]){t=this._current;var a=this._consumeLiteral(e);i.push({type:ye,value:a,start:t})}else if(void 0!==_e[e[this._current]])i.push(this._consumeOperator(e));else if(void 0!==ge[e[this._current]])this._current+=1;else if("&"===e[this._current])t=this._current,this._current+=1,"&"===e[this._current]?(this._current+=1,i.push({type:he,value:"&&",start:t})):u===ue||u===ve?i.push({type:"Expref",value:"&",start:t}):i.push({type:"Concatenate",value:"&",start:t});else if("~"===e[this._current])t=this._current,this._current+=1,i.push({type:"Union",value:"~",start:t});else if("+"===e[this._current])t=this._current,this._current+=1,i.push({type:"Add",value:"+",start:t});else if("-"===e[this._current])t=this._current,this._current+=1,i.push({type:"Subtract",value:"-",start:t});else if("*"===e[this._current]){t=this._current,this._current+=1;var o=i.length&&i.slice(-1)[0].type;0===i.length||[pe,fe,ce,he,le,ue,ae].includes(o)?i.push({type:"Star",value:"*",start:t}):i.push({type:"Multiply",value:"*",start:t})}else if("/"===e[this._current])t=this._current,this._current+=1,i.push({type:"Divide",value:"/",start:t});else if("^"===e[this._current])t=this._current,this._current+=1,i.push({type:"Power",value:"^",start:t});else{if("|"!==e[this._current]){var s=new Error("Unknown character:".concat(e[this._current]));throw s.name="LexerError",s}t=this._current,this._current+=1,"|"===e[this._current]?(this._current+=1,i.push({type:le,value:"||",start:t})):i.push({type:ce,value:"|",start:t})}}return i}},{key:"_consumeUnquotedIdentifier",value:function(e){var t=this._current;for(this._current+=1;this._current<e.length&&me(e[this._current]);)this._current+=1;return e.slice(t,this._current)}},{key:"_consumeQuotedIdentifier",value:function(e){var t=this._current;this._current+=1;for(var r=e.length,n=!we(e,t+1);'"'!==e[this._current]&&this._current<r;){var i=this._current;me(e[i])||(n=!0),"\\"!==e[i]||"\\"!==e[i+1]&&'"'!==e[i+1]?i+=1:i+=2,this._current=i}this._current+=1;var u=e.slice(t,this._current);try{n&&!u.includes(" ")||(this.debug.push("Suspicious quotes: ".concat(u)),this.debug.push("Did you intend a literal? '".concat(u.replace(/"/g,""),"'?")))}catch(e){}return JSON.parse(u)}},{key:"_consumeRawStringLiteral",value:function(e){var t=this._current;this._current+=1;for(var r=e.length;"'"!==e[this._current]&&this._current<r;){var n=this._current;"\\"!==e[n]||"\\"!==e[n+1]&&"'"!==e[n+1]?n+=1:n+=2,this._current=n}return this._current+=1,e.slice(t+1,this._current-1).replace("\\'","'")}},{key:"_consumeNumber",value:function(e){var t=this._current;this._current+=1;for(var r=e.length;be(e[this._current],!1)&&this._current<r;)this._current+=1;var n,i=e.slice(t,this._current);return n=i.includes(".")?parseFloat(i):parseInt(i,10),{type:oe,value:n,start:t}}},{key:"_consumeLBracket",value:function(e){var t=this._current;return this._current+=1,"?"===e[this._current]?(this._current+=1,{type:"Filter",value:"[?",start:t}):"]"===e[this._current]?(this._current+=1,{type:"Flatten",value:"[]",start:t}):{type:pe,value:"[",start:t}}},{key:"_isGlobal",value:function(e,t,r){if(null!==e&&e===fe)return!1;if("$"!==t[r])return!1;for(var n=r+1;n<t.length&&me(t[n]);)n+=1;var i=t.slice(r,n);return this._allowedGlobalNames.includes(i)}},{key:"_consumeGlobal",value:function(e){var t=this._current;for(this._current+=1;this._current<e.length&&me(e[this._current]);)this._current+=1;return{type:"Global",name:e.slice(t,this._current),start:t}}},{key:"_consumeOperator",value:function(e){var t=this._current,r=e[t];return this._current+=1,"!"===r?"="===e[this._current]?(this._current+=1,{type:"NE",value:"!=",start:t}):{type:"Not",value:"!",start:t}:"<"===r?"="===e[this._current]?(this._current+=1,{type:"LTE",value:"<=",start:t}):{type:"LT",value:"<",start:t}:">"===r?"="===e[this._current]?(this._current+=1,{type:"GTE",value:">=",start:t}):{type:"GT",value:">",start:t}:"="===e[this._current]?(this._current+=1,{type:"EQ",value:"==",start:t}):{type:"EQ",value:"=",start:t}}},{key:"_consumeLiteral",value:function(e){this._current+=1;for(var t,r=this._current,n=e.length;"`"!==e[this._current]&&this._current<n;){var i=this._current;"\\"!==e[i]||"\\"!==e[i+1]&&"`"!==e[i+1]?i+=1:i+=2,this._current=i}var u=e.slice(r,this._current).trimStart();return t=function(e){if(""===e)return!1;if('[{"'.includes(e[0]))return!0;if(["true","false","null"].includes(e))return!0;if(!"-0123456789".includes(e[0]))return!1;try{return JSON.parse(e),!0}catch(e){return!1}}(u=u.replace("\\`","`"))?JSON.parse(u):JSON.parse('"'.concat(u,'"')),this._current+=1,t}}])&&ee(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function xe(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Ee(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function je(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var Se=o,Pe="EOF",Te=r,Ne=n,Ae=i,Ie=u,Me=a,Ce=s,De=c,Le=l,Fe=h,Ue=f,Re="Field",Ge=p,He=v,qe=y,Qe=d,ze=_,Be=b,Je=g,$e=m,Ve=w,We=k,Ye="Dot",Ke=O,Ze=x,Xe=E,et=(je(ke={},Pe,0),je(ke,Te,0),je(ke,Ne,0),je(ke,Ae,0),je(ke,Ie,0),je(ke,Me,0),je(ke,De,0),je(ke,Le,0),je(ke,Fe,0),je(ke,Ue,0),je(ke,Re,0),je(ke,Ge,0),je(ke,He,1),je(ke,"Or",2),je(ke,"And",3),je(ke,"Add",6),je(ke,qe,6),je(ke,Ce,7),je(ke,Qe,7),je(ke,Be,7),je(ke,ze,7),je(ke,Je,7),je(ke,"EQ",5),je(ke,"GT",5),je(ke,"LT",5),je(ke,"GTE",5),je(ke,"LTE",5),je(ke,"NE",5),je(ke,$e,9),je(ke,Ve,20),je(ke,We,21),je(ke,Ye,40),je(ke,"Not",45),je(ke,Ke,50),je(ke,Ze,55),je(ke,Xe,60),ke),tt=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];xe(this,e),this._allowedGlobalNames=t}var t,r;return t=e,(r=[{key:"parse",value:function(e,t){this._loadTokens(e,t),this.index=0;var r=this.expression(0);if(this._lookahead(0)!==Pe){var n=this._lookaheadToken(0),i=new Error("Unexpected token type: ".concat(n.type,", value: ").concat(n.value));throw i.name="ParserError",i}return r}},{key:"_loadTokens",value:function(e,t){var r=new Oe(this._allowedGlobalNames,t).tokenize(e);r.push({type:Pe,value:"",start:e.length}),this.tokens=r}},{key:"expression",value:function(e){var t=this._lookaheadToken(0);this._advance();for(var r=this.nud(t),n=this._lookahead(0);e<et[n];)this._advance(),r=this.led(n,r),n=this._lookahead(0);return r}},{key:"_lookahead",value:function(e){return this.tokens[this.index+e].type}},{key:"_lookaheadToken",value:function(e){return this.tokens[this.index+e]}},{key:"_advance",value:function(){this.index+=1}},{key:"_getIndex",value:function(){return this.index}},{key:"_setIndex",value:function(e){this.index=e}},{key:"nud",value:function(e){var t,r,n;switch(e.type){case"Literal":return{type:"Literal",value:e.value};case Le:return{type:"Number",value:e.value};case Te:return{type:"Field",name:e.value};case Ne:if(r={type:"Field",name:e.value},this._lookahead(0)===Xe)throw new Error("Quoted identifier not allowed for function names.");return r;case"Not":return{type:"NotExpression",children:[this.expression(et.Not)]};case Ve:return{type:"ValueProjection",children:[{type:"Identity"},this._lookahead(0)===Ae?{type:"Identity"}:this._parseProjectionRHS(et.Star)]};case We:return this.led(e.type,{type:"Identity"});case Ke:return this._parseMultiselectHash();case $e:return{type:"Projection",children:[{type:$e,children:[{type:"Identity"}]},this._parseProjectionRHS(et.Flatten)]};case Ze:return this._lookahead(0)===Ve&&this._lookahead(1)===Ae?(this._advance(),this._advance(),{type:"Projection",children:[{type:"Identity"},this._parseProjectionRHS(et.Star)]}):this._parseUnchainedIndexExpression();case Fe:return{type:Fe};case Ue:return{type:Ue,name:e.name};case Re:return{type:Re};case Ge:return{type:"ExpressionReference",children:[t=this.expression(et.Expref)]};case Xe:for(n=[];this._lookahead(0)!==Ie;)t=this.expression(0),n.push(t);return this._match(Ie),n[0];default:this._errorToken(e)}}},{key:"led",value:function(e,t){var r,n,i,u,a,o;switch(e){case Ce:return{type:"ConcatenateExpression",children:[t,n=this.expression(et.Concatenate)]};case Ye:return o=et.Dot,this._lookahead(0)!==Ve?{type:"Subexpression",children:[t,n=this._parseDotRHS(o)]}:(this._advance(),{type:"ValueProjection",children:[t,n=this._parseProjectionRHS(o)]});case He:return n=this.expression(et.Pipe),{type:He,children:[t,n]};case"Or":return{type:"OrExpression",children:[t,n=this.expression(et.Or)]};case"And":return{type:"AndExpression",children:[t,n=this.expression(et.And)]};case"Add":return{type:"AddExpression",children:[t,n=this.expression(et.Add)]};case qe:return{type:"SubtractExpression",children:[t,n=this.expression(et.Subtract)]};case Qe:return{type:"MultiplyExpression",children:[t,n=this.expression(et.Multiply)]};case Be:return{type:"DivideExpression",children:[t,n=this.expression(et.Divide)]};case ze:return{type:"PowerExpression",children:[t,n=this.expression(et.Power)]};case Je:return{type:"UnionExpression",children:[t,n=this.expression(et.Power)]};case Xe:for(i=t.name,u=[];this._lookahead(0)!==Ie;)a=this.expression(0),this._lookahead(0)===Me&&this._match(Me),u.push(a);return this._match(Ie),{type:"Function",name:i,children:u};case We:return r=this.expression(0),this._match(Ae),{type:"FilterProjection",children:[t,n=this._lookahead(0)===$e?{type:"Identity"}:this._parseProjectionRHS(et.Filter),r]};case $e:return{type:"Projection",children:[{type:$e,children:[t]},this._parseProjectionRHS(et.Flatten)]};case"EQ":case"NE":case"GT":case"GTE":case"LT":case"LTE":return this._parseComparator(t,e);case Ze:return this._lookahead(0)===Ve&&this._lookahead(1)===Ae?(this._advance(),this._advance(),{type:"Projection",children:[t,n=this._parseProjectionRHS(et.Star)]}):(n=this._parseChainedIndexExpression(),this._projectIfSlice(t,n));default:this._errorToken(this._lookaheadToken(0))}}},{key:"_match",value:function(e){if(this._lookahead(0)!==e){var t=this._lookaheadToken(0),r=new Error("Expected ".concat(e,", got: ").concat(t.type));throw r.name="ParserError",r}this._advance()}},{key:"_errorToken",value:function(e){var t=new Error("Invalid token (".concat(e.type,'): "').concat(e.value,'"'));throw t.name="ParserError",t}},{key:"_parseChainedIndexExpression",value:function(){var e=this._getIndex();if(this._lookahead(0)===Se)return this._parseSliceExpression();var t=this.expression(0);return this._lookahead(0)===Se?(this._setIndex(e),this._parseSliceExpression()):(this._match(Ae),{type:"Index",value:t})}},{key:"_parseUnchainedIndexExpression",value:function(){var e=this._getIndex(),t=this._lookahead(0);if(t===Se){var r=this._parseSliceExpression();return this._projectIfSlice({type:"Identity"},r)}var n=this.expression(0),i=this._lookahead(0);if(i===Me)return this._setIndex(e),this._parseMultiselectList();if(i===Se){this._setIndex(e);var u=this._parseSliceExpression();return this._projectIfSlice({type:"Identity"},u)}return t===Le?(this._match(Ae),{type:"Index",value:n}):(this._setIndex(e),this._parseMultiselectList())}},{key:"_projectIfSlice",value:function(e,t){var r={type:"IndexExpression",children:[e,t]};return"Slice"===t.type?{type:"Projection",children:[r,this._parseProjectionRHS(et.Star)]}:r}},{key:"_parseSliceExpression",value:function(){for(var e=[null,null,null],t=0,r=this._lookahead(0);r!==Ae&&t<3;){if(r===Se&&t<2)t+=1,this._advance();else{e[t]=this.expression(0);var n=this._lookahead(0);if(n!==Se&&n!==Ae){var i=new Error("Syntax error, unexpected token: ".concat(n.value,"(").concat(n.type,")"));throw i.name="Parsererror",i}}r=this._lookahead(0)}return this._match(Ae),{type:"Slice",children:e}}},{key:"_parseComparator",value:function(e,t){return{type:"Comparator",name:t,children:[e,this.expression(et[t])]}}},{key:"_parseDotRHS",value:function(e){var t=this._lookahead(0);return[Te,Ne,Ve].indexOf(t)>=0?this.expression(e):t===Ze?(this._match(Ze),this._parseMultiselectList()):t===Ke?(this._match(Ke),this._parseMultiselectHash()):void 0}},{key:"_parseProjectionRHS",value:function(e){var t;if(et[this._lookahead(0)]<10)t={type:"Identity"};else if(this._lookahead(0)===Ze)t=this.expression(e);else if(this._lookahead(0)===We)t=this.expression(e);else{if(this._lookahead(0)!==Ye){var r=this._lookaheadToken(0),n=new Error("Sytanx error, unexpected token: ".concat(r.value,"(").concat(r.type,")"));throw n.name="ParserError",n}this._match(Ye),t=this._parseDotRHS(e)}return t}},{key:"_parseMultiselectList",value:function(){for(var e=[];this._lookahead(0)!==Ae;){var t=this.expression(0);if(e.push(t),this._lookahead(0)===Me&&(this._match(Me),this._lookahead(0)===Ae))throw new Error("Unexpected token Rbracket")}return this._match(Ae),{type:"MultiSelectList",children:e}}},{key:"_parseMultiselectHash",value:function(){var e,t,r,n=[],i=[Te,Ne];if(this._lookahead(0)===De)return this._advance(),{type:"MultiSelectHash",children:[]};for(;;){if(e=this._lookaheadToken(0),i.indexOf(e.type)<0)throw new Error("Expecting an identifier token, got: ".concat(e.type));if(t=e.value,this._advance(),this._match(Se),r={type:"KeyValuePair",name:t,value:this.expression(0)},n.push(r),this._lookahead(0)===Me)this._match(Me);else if(this._lookahead(0)===De){this._match(De);break}}return{type:"MultiSelectHash",children:n}}}])&&Ee(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function rt(e,t,r){return{casefold:{_func:function(e,r,n){return t(e[0]).toLocaleUpperCase(n.language).toLocaleLowerCase(n.language)},_signature:[{types:[2]}]},and:{_func:function(t){var r=!!e(t[0]);return t.slice(1).forEach((function(t){r=r&&!!e(t)})),r},_signature:[{types:[1],variadic:!0}]},or:{_func:function(t){var r=!!e(t[0]);return t.slice(1).forEach((function(t){r=r||!!e(t)})),r},_signature:[{types:[1],variadic:!0}]},not:{_func:function(t){return!e(t[0])},_signature:[{types:[1]}]},true:{_func:function(){return!0},_signature:[]},false:{_func:function(){return!1},_signature:[]},if:{_func:function(t,r,n){var i=t[0],u=t[1],a=t[2],o=n.visit(i,r);return e(o)?n.visit(u,r):n.visit(a,r)},_signature:[{types:[1]},{types:[1]},{types:[1]}]},substitute:{_func:function(e){var n=t(e[0]),i=t(e[1]),u=t(e[2]);if(e.length<=3)return n.replaceAll(i,u);var a=r(e[3]);if(a<1)return n;for(var o=-1,s=0;s<a;s+=1){o+=1;var c=n.slice(o).indexOf(i);if(-1===c)return n;o+=c}return n.slice(0,o)+n.slice(o).replace(i,u)},_signature:[{types:[2]},{types:[2]},{types:[2]},{types:[0],optional:!0}]},value:{_func:function(e){var t=(e[0]||{})[e[1]];return void 0===t?null:t},_signature:[{types:[4,3,7]},{types:[2,0]}]},lower:{_func:function(e){return t(e[0]).toLowerCase()},_signature:[{types:[2]}]},upper:{_func:function(e){return t(e[0]).toUpperCase()},_signature:[{types:[2]}]},exp:{_func:function(e){var t=r(e[0]);return Math.exp(t)},_signature:[{types:[0]}]},power:{_func:function(e){var t=r(e[0]),n=r(e[1]);return Math.pow(t,n)},_signature:[{types:[0]},{types:[0]}]},find:{_func:function(e){var n=t(e[0]),i=t(e[1]),u=e.length>2?r(e[2]):0,a=i.indexOf(n,u);return-1===a?null:a},_signature:[{types:[2]},{types:[2]},{types:[0],optional:!0}]},left:{_func:function(e){var n=e.length>1?r(e[1]):1;return n<0?null:e[0]instanceof Array?e[0].slice(0,n):t(e[0]).substr(0,n)},_signature:[{types:[2,3]},{types:[0],optional:!0}]},right:{_func:function(e){var n=e.length>1?r(e[1]):1;if(n<0)return null;if(e[0]instanceof Array)return 0===n?[]:e[0].slice(-1*n);var i=t(e[0]),u=i.length-n;return i.substr(u,n)},_signature:[{types:[2,3]},{types:[0],optional:!0}]},mid:{_func:function(e){var n=r(e[1]),i=r(e[2]);return n<0?null:e[0]instanceof Array?e[0].slice(n,n+i):t(e[0]).substr(n,i)},_signature:[{types:[2,3]},{types:[0]},{types:[0]}]},mod:{_func:function(e){return r(e[0])%r(e[1])},_signature:[{types:[0]},{types:[0]}]},proper:{_func:function(e){return t(e[0]).split(" ").map((function(e){return e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()})).join(" ")},_signature:[{types:[2]}]},rept:{_func:function(e){var n=t(e[0]),i=r(e[1]);return i<0?null:n.repeat(i)},_signature:[{types:[2]},{types:[0]}]},replace:{_func:function(e){var n=t(e[0]),i=r(e[1]),u=r(e[2]),a=t(e[3]);return i<0?null:n.substr(0,i)+a+n.substr(i+u)},_signature:[{types:[2]},{types:[0]},{types:[0]},{types:[2]}]},round:{_func:function(e){var t=r(e[0]),n=r(e[1]);return Math.round(t*Math.pow(10,n))/Math.pow(10,n)},_signature:[{types:[0]},{types:[0]}]},sqrt:{_func:function(e){var t=Math.sqrt(r(e[0]));return Number.isNaN(t)?null:t},_signature:[{types:[0]}]},stdevp:{_func:function(e){var t=e[0]||[];if(0===t.length)return null;var n=t.map((function(e){return r(e)})),i=n.reduce((function(e,t){return e+t}),0)/t.length,u=n.reduce((function(e,t){return e+t*t}),0)/t.length,a=Math.sqrt(u-i*i);return Number.isNaN(a)?null:a},_signature:[{types:[8]}]},stdev:{_func:function(e){var t=e[0]||[];if(t.length<=1)return null;var n=t.map((function(e){return r(e)})),i=n.reduce((function(e,t){return e+t}),0)/t.length,u=n.reduce((function(e,t){return e+t*t}),0),a=Math.sqrt((u-t.length*i*i)/(t.length-1));return Number.isNaN(a)?null:a},_signature:[{types:[8]}]},trim:{_func:function(e){return t(e[0]).split(" ").filter((function(e){return e})).join(" ")},_signature:[{types:[2]}]},trunc:{_func:function(e){var t=r(e[0]),n=e.length>1?r(e[1]):0;return(t>=0?Math.floor:Math.ceil)(t*Math.pow(10,n))/Math.pow(10,n)},_signature:[{types:[0]},{types:[0],optional:!0}]},charCode:{_func:function(e){var t=r(e[0]);return Number.isInteger(t)?String.fromCharCode(t):null},_signature:[{types:[0]}]},codePoint:{_func:function(e){var r=t(e[0]);return 0===r.length?null:r.codePointAt(0)},_signature:[{types:[2]}]},date:{_func:function(e){var t=r(e[0]),n=r(e[1]),i=r(e[2]),u=Date.UTC(t,n-1,i);return Math.floor(u/864e5)},_signature:[{types:[0]},{types:[0]},{types:[0]}]},day:{_func:function(e){var t=r(e[0]);return new Date(864e5*t).getUTCDate()},_signature:[{types:[0]}]},month:{_func:function(e){var t=r(e[0]);return new Date(864e5*t).getUTCMonth()+1},_signature:[{types:[0]}]},year:{_func:function(e){var t=r(e[0]);return new Date(864e5*t).getUTCFullYear()},_signature:[{types:[0]}]},time:{_func:function(e){var t=(3600*r(e[0])+60*r(e[1])+r(e[2]))/86400;return t<0?null:t-Math.floor(t)},_signature:[{types:[0]},{types:[0]},{types:[0]}]},hour:{_func:function(e){var t=r(e[0]);return t<0?null:86400*t/3600%24},_signature:[{types:[0]}]},minute:{_func:function(e){var t=r(e[0]);return t<0?null:1440*t%60},_signature:[{types:[0]}]},second:{_func:function(e){var t=r(e[0]);return t<0?null:86400*t%60},_signature:[{types:[0]}]},now:{_func:function(){var e=new Date,t=e.getFullYear(),r=e.getMonth(),n=e.getDate(),i=e.getHours(),u=e.getMinutes(),a=e.getSeconds();return Date.UTC(t,r,n,i,u,a)/864e5},_signature:[]},today:{_func:function(){var e=new Date,t=e.getFullYear(),r=e.getMonth(),n=e.getDate();return Math.floor(Date.UTC(t,r,n)/864e5)},_signature:[]},weekday:{_func:function(e){var t=r(e[0]),n=e.length>1?r(e[1]):1,i=new Date(864e5*t).getUTCDay();switch(n){case 1:return i+1;case 2:return(i+6)%7+1;case 3:return(i+6)%7;default:return null}},_signature:[{types:[0]},{types:[0],optional:!0}]},entries:{_func:function(t){var r=e(t[0]);return Object.entries(r)},_signature:[{types:[0,2,3,4,5]}]},fromEntries:{_func:function(e){var t=e[0];return Object.fromEntries(t)},_signature:[{types:[11]}]},split:{_func:function(e){var r=t(e[0]),n=t(e[1]);return r.split(n)},_signature:[{types:[2]},{types:[2]}]}}}function nt(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function it(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,i,u=[],a=!0,o=!1;try{for(r=r.call(e);!(a=(n=r.next()).done)&&(u.push(n.value),!t||u.length!==t);a=!0);}catch(e){o=!0,i=e}finally{try{a||null==r.return||r.return()}finally{if(o)throw i}}return u}}(e,t)||function(e,t){if(e){if("string"==typeof e)return ut(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?ut(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ut(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function at(e,t,r,n,i,u,a){var o=0,s=2;function c(t,r){return function(n){var u=e.visit(t,n);if(r.indexOf(i(u))<0){var a="TypeError: expected one of ".concat(r,", received ").concat(i(u));throw new Error(a)}return u}}return{abs:{_func:function(e){return Math.abs(e[0])},_signature:[{types:[o]}]},avg:{_func:function(e){var t=0,r=e[0];return r.forEach((function(e){t+=e})),t/r.length},_signature:[{types:[8]}]},ceil:{_func:function(e){return Math.ceil(e[0])},_signature:[{types:[o]}]},contains:{_func:function(e){return u(e[0]).indexOf(u(e[1]))>=0},_signature:[{types:[s,3]},{types:[1]}]},endsWith:{_func:function(e){var t=u(e[0]),r=u(e[1]);return-1!==t.indexOf(r,t.length-r.length)},_signature:[{types:[s]},{types:[s]}]},floor:{_func:function(e){return Math.floor(e[0])},_signature:[{types:[o]}]},length:{_func:function(e){var n=u(e[0]);return t(n)?Object.keys(n).length:r(n)?n.length:a(n).length},_signature:[{types:[s,3,4]}]},map:{_func:function(t){var r=t[0];return t[1].map((function(t){return e.visit(r,t)}))},_signature:[{types:[6]},{types:[3]}]},reduce:{_func:function(t){var r=t[0];return t[1].reduce((function(t,n,i,u){return e.visit(r,{previous:t,current:n,index:i,array:u})}),3===t.length?t[2]:null)},_signature:[{types:[6]},{types:[3]},{types:[1],optional:!0}]},max:{_func:function(e){return e[0].length>0?i(e[0][0])===o?e[0].reduce((function(e,t){return n(e)>=n(t)?e:t}),e[0][0]):e[0].reduce((function(e,t){return a(t).localeCompare(a(e))<0?e:t}),e[0][0]):null},_signature:[{types:[3,8,9]}]},merge:{_func:function(e){var t={};return e.forEach((function(e){Object.entries(e).forEach((function(e){var r=it(e,2),n=r[0],i=r[1];t[n]=i}))})),t},_signature:[{types:[4],variadic:!0}]},maxBy:{_func:function(e){var t,r,n=e[1],i=e[0],u=c(n,[o,s]),a=-1/0;return i.forEach((function(e){(r=u(e))>a&&(a=r,t=e)})),t},_signature:[{types:[3]},{types:[6]}]},sum:{_func:function(e){var t=0;return e[0].forEach((function(e){t+=1*e})),t},_signature:[{types:[8]}]},startsWith:{_func:function(e){return u(e[0]).startsWith(u(e[1]))},_signature:[{types:[s]},{types:[s]}]},min:{_func:function(e){if(e[0].length>0){if(i(e[0][0])===o)return e[0].reduce((function(e,t){return n(e)<=n(t)?e:t}),e[0][0]);for(var t=e[0],r=t[0],u=1;u<t.length;u+=1)a(t[u]).localeCompare(a(r))<0&&(r=t[u]);return r}return null},_signature:[{types:[3,8,9]}]},minBy:{_func:function(e){var t,r,n=e[1],i=e[0],u=c(n,[o,s]),a=1/0;return i.forEach((function(e){(r=u(e))<a&&(a=r,t=e)})),t},_signature:[{types:[3]},{types:[6]}]},type:{_func:function(e){var t;return(t={},nt(t,o,"number"),nt(t,s,"string"),nt(t,3,"array"),nt(t,4,"object"),nt(t,5,"boolean"),nt(t,6,"expref"),nt(t,7,"null"),t)[i(e[0])]},_signature:[{types:[1]}]},keys:{_func:function(e){return Object.keys(e[0])},_signature:[{types:[1]}]},values:{_func:function(e){return Object.values(e[0])},_signature:[{types:[1]}]},sort:{_func:function(e){var t=e[0].slice(0);if(t.length>0){var r=i(e[0][0])===o?n:a;t.sort((function(e,t){var n=r(e),i=r(t);return n<i?-1:n>i?1:0}))}return t},_signature:[{types:[3,9,8]}]},sortBy:{_func:function(t){var r=t[0].slice(0);if(0===r.length)return r;var n=t[1],u=i(e.visit(n,r[0]));if([o,s].indexOf(u)<0)throw new Error("TypeError");for(var a=[],c=0;c<r.length;c+=1)a.push([c,r[c]]);a.sort((function(t,r){var a=e.visit(n,t[1]),o=e.visit(n,r[1]);if(i(a)!==u)throw new Error("TypeError: expected ".concat(u,", received ").concat(i(a)));if(i(o)!==u)throw new Error("TypeError: expected ".concat(u,", received ").concat(i(o)));return a>o?1:a<o?-1:t[0]-r[0]}));for(var l=0;l<a.length;l+=1){var h=it(a[l],2);r[l]=h[1]}return r},_signature:[{types:[3]},{types:[6]}]},join:{_func:function(e){var t=e[0];return e[1].join(t)},_signature:[{types:[s]},{types:[9]}]},reverse:{_func:function(e){var t=u(e[0]);if(i(t)===s){for(var r="",n=t.length-1;n>=0;n-=1)r+=t[n];return r}var a=e[0].slice(0);return a.reverse(),a},_signature:[{types:[s,3]}]},toArray:{_func:function(e){return 3===i(e[0])?e[0]:[e[0]]},_signature:[{types:[1]}]},toString:{_func:function(e){return i(e[0])===s?e[0]:JSON.stringify(e[0])},_signature:[{types:[1]}]},toNumber:{_func:function(e){var t=i(e[0]);return t===o?e[0]:t===s?n(e[0]):null},_signature:[{types:[1]}]},notNull:{_func:function(e){return e.find((function(e){return 7!==i(e)}))||null},_signature:[{types:[1],variadic:!0}]}}}function ot(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function st(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?ot(Object(r),!0).forEach((function(t){ct(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):ot(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function ct(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function lt(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function ht(e){return ht="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ht(e)}const ft=new function(){var e;function t(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return function(r){var n=z(r);if(null===n)return null;if(n instanceof Array)return t.push("Converted array to zero"),0;var i=ht(n);return"number"===i?n:"string"===i?e(n,t):"boolean"===i?n?1:0:(t.push("Converted object to zero"),0)}}function r(e){return null==e?"":Object.getPrototypeOf(e).toString.call(e)}var n=function(){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t)}var n,i;return n=t,i=[{key:"addFunctions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.functionTable=st(st(st({},at(this._interpreter,Q,q,e,R,z,r)),rt(z,r,e)),t)}},{key:"_validateArgs",value:function(t,r,n,i){if(0!==n.length){var u;if(n[n.length-1].variadic){if(r.length<n.length)throw u=1===n.length?" argument":" arguments",new Error("ArgumentError: ".concat(t,"() ")+"takes at least".concat(n.length).concat(u," but received ").concat(r.length))}else if(r.length!==n.length&&!n[n.length-1].optional)throw u=1===n.length?" argument":" arguments",new Error("ArgumentError: ".concat(t,"() ")+"takes ".concat(n.length).concat(u," but received ").concat(r.length));if(i)for(var a,o,s=Math.min(n.length,r.length),c=0;c<s;c+=1)a=n[c].types,l=r[c],h=a,f=void 0,null!==(f=l)&&!Array.isArray(f)&&"Object"!==Object.getPrototypeOf(f).constructor.name&&h.includes(10)||(o=G(r[c]),r[c]=H(o,a,r[c],t,e))}var l,h,f}},{key:"callFunction",value:function(e,t,r,n){var i=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];if(!Object.prototype.hasOwnProperty.call(this.functionTable,e))throw new Error("Unknown function: ".concat(e,"()"));var u=this.functionTable[e];return this._validateArgs(e,t,u._signature,i),u._func.call(this,t,r,n)}}],i&&lt(n.prototype,i),Object.defineProperty(n,"prototype",{writable:!1}),t}();this.compile=function(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];try{var i=new tt(r);t=i.parse(e,n)}catch(e){throw n.push(e.toString()),e}return t},this.search=function(i,u,a,o,s){var c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:[],l=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"en-US",h=new n(o);h.debug=c;var f=function(e){var t=+e;return Number.isNaN(t)?0:t};e=t(s||f,c);var p=new Z(h,a,e,r,c,l);h._interpreter=p,h.addFunctions(o);try{return p.search(i,u)}catch(e){throw c.push(e.message||e.toString()),e}},this.strictDeepEqual=B};function pt(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function vt(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?pt(Object(r),!0).forEach((function(t){yt(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):pt(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function yt(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function dt(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _t(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}var gt=function(){function e(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[],u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:[],a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"en-US";dt(this,e),this.expression=t,this.customFunctions=r,this.stringToNumber=n,this.node=ft.compile(t,i,u),this.debug=u,this.language=a}var t,r;return t=e,(r=[{key:"search",value:function(e,t){return ft.search(this.node,e,t,vt({},this.customFunctions),this.stringToNumber,this.debug,this.language)}}])&&_t(t.prototype,r),Object.defineProperty(t,"prototype",{writable:!1}),e}();function bt(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,u=arguments.length>5&&void 0!==arguments[5]?arguments[5]:[],a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"en-US",o=new gt(r,n,i,Object.keys(t),u,a);return o.search(e,t,vt({},n),i,u,a)}module.exports=t})();
//# sourceMappingURL=json-formula.js.map

/***/ }),

/***/ "./node_modules/@adobe/json-formula/dist/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@adobe/json-formula/dist/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./cjs/json-formula.js */ "./node_modules/@adobe/json-formula/dist/cjs/json-formula.js");

/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/BaseNode.js":
/*!********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/BaseNode.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseNode = exports.target = void 0;
const controller_1 = __webpack_require__(/*! ./controller */ "./node_modules/@aemforms/af-core/lib/controller/index.js");
const DataRefParser_1 = __webpack_require__(/*! ./utils/DataRefParser */ "./node_modules/@aemforms/af-core/lib/utils/DataRefParser.js");
const EmptyDataValue_1 = __importDefault(__webpack_require__(/*! ./data/EmptyDataValue */ "./node_modules/@aemforms/af-core/lib/data/EmptyDataValue.js"));
/**
 * Implementation of action with target
 * @private
 */
class ActionImplWithTarget {
    /**
     * @constructor
     * @param _action
     * @param _target
     * @private
     */
    constructor(_action, _target) {
        this._action = _action;
        this._target = _target;
    }
    get type() {
        return this._action.type;
    }
    get payload() {
        return this._action.payload;
    }
    get metadata() {
        return this._action.metadata;
    }
    get target() {
        return this._target;
    }
    get isCustomEvent() {
        return this._action.isCustomEvent;
    }
    get originalAction() {
        return this._action.originalAction;
    }
    toString() {
        return this._action.toString();
    }
}
exports.target = Symbol('target');
/**
 * Defines a generic base class which all objects of form runtime model should extend from.
 * @typeparam T type of the form object which extends from {@link BaseJson | base type}
 */
class BaseNode {
    /**
     * @constructor
     * @param params
     * @param _options
     * @private
     */
    constructor(params, 
    //@ts_ignore
    _options) {
        this._options = _options;
        this._callbacks = {};
        this._dependents = [];
        this._tokens = [];
        this._jsonModel = Object.assign(Object.assign({}, params), { 
            //@ts-ignore
            id: 'id' in params ? params.id : this.form.getUniqueId() });
    }
    get isContainer() {
        return false;
    }
    setupRuleNode() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        this._ruleNode = new Proxy(this.ruleNodeReference(), {
            get: (ruleNodeReference, prop) => {
                return self.getFromRule(ruleNodeReference, prop);
            }
        });
    }
    /**
     * @private
     */
    ruleNodeReference() {
        return this;
    }
    /**
     * @private
     */
    getRuleNode() {
        return this._ruleNode;
    }
    getFromRule(ruleNodeReference, prop) {
        if (prop === Symbol.toPrimitive || (prop === 'valueOf' && !ruleNodeReference.hasOwnProperty('valueOf'))) {
            return this.valueOf;
        }
        else if (prop === exports.target) {
            return this;
        }
        else if (typeof (prop) === 'string') {
            //look for property
            if (prop.startsWith('$')) {
                prop = prop.substr(1);
                //@todo: create a list of properties that are allowed
                //@ts-ignore
                // return only non functional properties in this object
                if (typeof this[prop] !== 'function') {
                    //@ts-ignore
                    return this[prop];
                }
            }
            else {
                //look in the items
                if (ruleNodeReference.hasOwnProperty(prop)) {
                    return ruleNodeReference[prop];
                }
                else if (typeof ruleNodeReference[prop] === 'function') { //todo : create allow list of functions
                    //to support panel instanceof Array panel1.map(..)
                    return ruleNodeReference[prop];
                }
            }
        }
    }
    get id() {
        return this._jsonModel.id;
    }
    get index() {
        return this.parent.indexOf(this);
    }
    get parent() {
        return this._options.parent;
    }
    get type() {
        return this._jsonModel.type;
    }
    get fieldType() {
        return this._jsonModel.fieldType || 'text-input';
    }
    get ':type'() {
        return this._jsonModel[':type'] || this.fieldType;
    }
    get name() {
        return this._jsonModel.name;
    }
    get description() {
        return this._jsonModel.description;
    }
    set description(d) {
        this._setProperty('description', d);
    }
    get dataRef() {
        return this._jsonModel.dataRef;
    }
    get visible() {
        return this._jsonModel.visible;
    }
    set visible(v) {
        if (v !== this._jsonModel.visible) {
            const changeAction = (0, controller_1.propertyChange)('visible', v, this._jsonModel.visible);
            this._jsonModel.visible = v;
            this.notifyDependents(changeAction);
        }
    }
    get form() {
        return this._options.form;
    }
    get ruleEngine() {
        return this.form.ruleEngine;
    }
    get label() {
        return this._jsonModel.label;
    }
    set label(l) {
        if (l !== this._jsonModel.label) {
            const changeAction = (0, controller_1.propertyChange)('label', l, this._jsonModel.label);
            this._jsonModel = Object.assign(Object.assign({}, this._jsonModel), { label: l });
            this.notifyDependents(changeAction);
        }
    }
    /**
     * Transparent form fields are meant only for creation of view. They are also not part of data
     */
    isTransparent() {
        var _a, _b;
        // named form fields are not transparent
        // @ts-ignore
        // handling repeatable use-case where first item of array can be unnamed
        const isNonTransparent = ((_a = this.parent) === null || _a === void 0 ? void 0 : _a._jsonModel.type) === 'array' && ((_b = this.parent) === null || _b === void 0 ? void 0 : _b.items.length) === 1;
        return !this._jsonModel.name && !isNonTransparent;
    }
    getState() {
        return Object.assign(Object.assign({}, this._jsonModel), { ':type': this[':type'] });
    }
    /**
     * @private
     */
    subscribe(callback, eventName = 'change') {
        this._callbacks[eventName] = this._callbacks[eventName] || [];
        this._callbacks[eventName].push(callback);
        //console.log(`subscription added : ${this._elem.id}, count : ${this._callbacks[eventName].length}`);
        return {
            unsubscribe: () => {
                this._callbacks[eventName] = this._callbacks[eventName].filter(x => x !== callback);
                //console.log(`subscription removed : ${this._elem.id}, count : ${this._callbacks[eventName].length}`);
            }
        };
    }
    /**
     * @private
     */
    addDependent(action) {
        if (this._dependents.find(({ node }) => node === action.payload) === undefined) {
            const subscription = this.subscribe((change) => {
                const changes = change.payload.changes;
                const propsToLook = ['value', 'items'];
                // @ts-ignore
                const isPropChanged = changes.findIndex(x => {
                    return propsToLook.indexOf(x.propertyName) > -1;
                }) > -1;
                if (isPropChanged) {
                    action.payload.dispatch(new controller_1.ExecuteRule());
                }
            });
            this._dependents.push({ node: action.payload, subscription });
        }
    }
    /**
     * @private
     */
    removeDependent(action) {
        const index = this._dependents.findIndex(({ node }) => node === action.payload);
        if (index > -1) {
            this._dependents[index].subscription.unsubscribe();
            this._dependents.splice(index, 1);
        }
    }
    /**
     * @private
     */
    queueEvent(action) {
        const actionWithTarget = new ActionImplWithTarget(action, this);
        this.form.getEventQueue().queue(this, actionWithTarget, ['valid', 'invalid'].indexOf(actionWithTarget.type) > -1);
    }
    dispatch(action) {
        this.queueEvent(action);
        this.form.getEventQueue().runPendingQueue();
    }
    /**
     * @private
     */
    notifyDependents(action) {
        const handlers = this._callbacks[action.type] || [];
        handlers.forEach(x => {
            x(new ActionImplWithTarget(action, this));
        });
    }
    /**
     * @param prop
     * @param newValue
     * @private
     */
    _setProperty(prop, newValue, notify = true) {
        //@ts-ignore
        const oldValue = this._jsonModel[prop];
        let isValueSame = false;
        if (newValue !== null && oldValue !== null &&
            typeof newValue === 'object' && typeof oldValue === 'object') {
            isValueSame = JSON.stringify(newValue) === JSON.stringify(oldValue);
        }
        else {
            // @ts-ignore
            isValueSame = oldValue === newValue;
        }
        if (!isValueSame) {
            //@ts-ignore
            this._jsonModel[prop] = newValue;
            const changeAction = (0, controller_1.propertyChange)(prop, newValue, oldValue);
            if (notify) {
                this.notifyDependents(changeAction);
            }
            return changeAction.payload.changes;
        }
        return [];
    }
    /**
     * @private
     */
    _bindToDataModel(contextualDataModel) {
        if (this.id === '$form') {
            this._data = contextualDataModel;
            return;
        }
        const dataRef = this._jsonModel.dataRef;
        let _data;
        if (dataRef === null) {
            _data = EmptyDataValue_1.default;
        }
        else if (dataRef !== undefined) {
            if (this._tokens.length === 0) {
                this._tokens = (0, DataRefParser_1.tokenize)(dataRef);
            }
            let searchData = contextualDataModel;
            if (this._tokens[0].type === DataRefParser_1.TOK_GLOBAL) {
                searchData = this.form.getDataNode();
            }
            if (typeof searchData !== 'undefined') {
                const name = this._tokens[this._tokens.length - 1].value;
                const create = this.defaultDataModel(name);
                _data = (0, DataRefParser_1.resolveData)(searchData, this._tokens, create);
            }
        }
        else {
            if (contextualDataModel != null) {
                const name = this._jsonModel.name || '';
                const key = contextualDataModel.$type === 'array' ? this.index : name;
                if (key !== '') {
                    const create = this.defaultDataModel(key);
                    if (create !== undefined) {
                        _data = contextualDataModel.$getDataNode(key) || create;
                        contextualDataModel.$addDataNode(key, _data);
                    }
                }
                else {
                    _data = EmptyDataValue_1.default;
                }
            }
        }
        if (!this.isContainer) {
            _data = _data === null || _data === void 0 ? void 0 : _data.$convertToDataValue();
        }
        _data === null || _data === void 0 ? void 0 : _data.$bindToField(this);
        this._data = _data;
    }
    /**
     * @private
     */
    getDataNode() {
        if (this._data === undefined) {
            return this.parent.getDataNode();
        }
        return this._data;
    }
    get properties() {
        return this._jsonModel.properties || {};
    }
    set properties(p) {
        this._setProperty('properties', Object.assign({}, p));
    }
    /**
     * called after the node is inserted in the parent
     * @private
     */
    _initialize() {
        if (typeof this._data === 'undefined') {
            const dataNode = this.parent.getDataNode();
            this._bindToDataModel(dataNode);
        }
    }
}
exports.BaseNode = BaseNode;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/Checkbox.js":
/*!********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/Checkbox.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core/lib/Field.js"));
const ValidationUtils_1 = __webpack_require__(/*! ./utils/ValidationUtils */ "./node_modules/@aemforms/af-core/lib/utils/ValidationUtils.js");
/**
 * @param offValue
 * @private
 */
const requiredConstraint = (offValue) => (constraint, value) => {
    const valid = ValidationUtils_1.Constraints.required(constraint, value) && (!constraint || value != offValue);
    return { valid, value };
};
/**
 * Implementation of check box runtime model which extends from {@link Field | field} model
 */
class Checkbox extends Field_1.default {
    offValue() {
        const opts = this.enum;
        return opts.length > 1 ? opts[1] : null;
    }
    /**
     * @private
     */
    _getConstraintObject() {
        const baseConstraints = Object.assign({}, super._getConstraintObject());
        baseConstraints.required = requiredConstraint(this.offValue());
        return baseConstraints;
    }
    _getDefaults() {
        return Object.assign(Object.assign({}, super._getDefaults()), { enforceEnum: true });
    }
    /**
     * Returns the `enum` constraints from the json
     */
    get enum() {
        return this._jsonModel.enum || [];
    }
}
exports["default"] = Checkbox;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/CheckboxGroup.js":
/*!*************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/CheckboxGroup.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core/lib/Field.js"));
/**
 * Implementation of CheckBoxGroup runtime model which extends from {@link Field | field}
 */
class CheckboxGroup extends Field_1.default {
    /**
     * @param params
     * @param _options
     * @private
     */
    constructor(params, _options) {
        super(params, _options);
    }
    /**
     * converts the fallback type, if required, to an array. Since checkbox-group has an array type
     * @protected
     */
    _getFallbackType() {
        const fallbackType = super._getFallbackType();
        if (typeof fallbackType === 'string') {
            return `${fallbackType}[]`;
        }
    }
    _getDefaults() {
        return Object.assign(Object.assign({}, super._getDefaults()), { enforceEnum: true, enum: [] });
    }
}
exports["default"] = CheckboxGroup;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/Container.js":
/*!*********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/Container.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const JsonUtils_1 = __webpack_require__(/*! ./utils/JsonUtils */ "./node_modules/@aemforms/af-core/lib/utils/JsonUtils.js");
const Scriptable_1 = __importDefault(__webpack_require__(/*! ./Scriptable */ "./node_modules/@aemforms/af-core/lib/Scriptable.js"));
const controller_1 = __webpack_require__(/*! ./controller */ "./node_modules/@aemforms/af-core/lib/controller/index.js");
const DataGroup_1 = __importDefault(__webpack_require__(/*! ./data/DataGroup */ "./node_modules/@aemforms/af-core/lib/data/DataGroup.js"));
/**
 * Defines a generic container class which any form container should extend from.
 * @typeparam T type of the node which extends {@link ContainerJson} and {@link RulesJson}
 */
class Container extends Scriptable_1.default {
    constructor() {
        super(...arguments);
        this._children = [];
        this._itemTemplate = null;
    }
    /**
     * @private
     */
    ruleNodeReference() {
        return this._childrenReference;
    }
    //todo : this should not be public
    get items() {
        return this._children;
    }
    set maxItems(m) {
        this._jsonModel.maxItems = m;
        const minItems = this._jsonModel.minItems || 1;
        const itemsLength = this._children.length;
        const items2Remove = Math.min(itemsLength - m, itemsLength - minItems);
        if (items2Remove > 0) {
            for (let i = 0; i < items2Remove; i++) {
                this.getDataNode().$removeDataNode(m + i);
                this._childrenReference.pop();
            }
            const elems = this._children.splice(m, items2Remove);
            this.notifyDependents((0, controller_1.propertyChange)('items', elems, null));
        }
    }
    /**
     * returns whether the items in the Panel can repeat or not
     */
    hasDynamicItems() {
        return this._itemTemplate != null;
    }
    get isContainer() {
        return true;
    }
    /**
     * Returns the current container state
     */
    getState() {
        return Object.assign(Object.assign({}, this._jsonModel), { ':type': this[':type'], items: this._children.map(x => {
                return Object.assign({}, x.getState());
            }) });
    }
    _addChildToRuleNode(child, options) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const { parent = this } = options;
        //the child has not been added to the array, hence using the length as new index
        // this means unnamed panel inside repeatable named parent // this is an edge case, handling it gracefully
        // todo: rules don't work inside repeatable array
        const name = parent.type == 'array' ? parent._children.length + '' : child.name || '';
        if (name.length > 0) {
            Object.defineProperty(parent._childrenReference, name, {
                get: () => {
                    if (child.isContainer && child.hasDynamicItems()) {
                        self.ruleEngine.trackDependency(child); //accessing dynamic panel directly
                    }
                    if (self.hasDynamicItems()) {
                        self.ruleEngine.trackDependency(self); //accessing a child of dynamic panel
                        if (this._children[name] !== undefined) { // pop function calls this getter in order to return the item
                            return this._children[name].getRuleNode();
                        }
                    }
                    else {
                        return child.getRuleNode();
                    }
                },
                configurable: true,
                enumerable: true
            });
        }
    }
    _addChild(itemJson, index) {
        // get first non transparent parent
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let nonTransparentParent = this;
        while (nonTransparentParent != null && nonTransparentParent.isTransparent()) {
            // @ts-ignore
            nonTransparentParent = nonTransparentParent.parent;
        }
        if (typeof index !== 'number' || index > nonTransparentParent._children.length) {
            index = nonTransparentParent === null || nonTransparentParent === void 0 ? void 0 : nonTransparentParent._children.length;
        }
        const itemTemplate = Object.assign({ index }, (0, JsonUtils_1.deepClone)(itemJson));
        //@ts-ignore
        const retVal = this._createChild(itemTemplate, { parent: nonTransparentParent, index: index });
        this._addChildToRuleNode(retVal, { parent: nonTransparentParent });
        if (index === (nonTransparentParent === null || nonTransparentParent === void 0 ? void 0 : nonTransparentParent._children.length)) {
            nonTransparentParent === null || nonTransparentParent === void 0 ? void 0 : nonTransparentParent._children.push(retVal);
            //(this.getDataNode() as DataGroup).$addDataNode(index);
        }
        else {
            // @ts-ignore
            nonTransparentParent === null || nonTransparentParent === void 0 ? void 0 : nonTransparentParent._children.splice(index, 0, retVal);
            //(this.getDataNode() as DataGroup).$addDataNode();
        }
        retVal._initialize();
        return retVal;
    }
    indexOf(f) {
        return this._children.indexOf(f);
    }
    /**
     * @private
     */
    defaultDataModel(name) {
        const type = this._jsonModel.type || undefined;
        if (type === undefined) {
            return undefined;
        }
        else {
            const instance = type === 'array' ? [] : {};
            return new DataGroup_1.default(name, instance, type);
        }
    }
    /**
     * @private
     */
    _initialize() {
        super._initialize();
        const items = this._jsonModel.items;
        this._jsonModel.items = [];
        this._childrenReference = this._jsonModel.type == 'array' ? [] : {};
        if (this._jsonModel.type == 'array' && items.length === 1 && this.getDataNode() != null) {
            this._itemTemplate = (0, JsonUtils_1.deepClone)(items[0]);
            if (typeof (this._jsonModel.minItems) !== 'number') {
                this._jsonModel.minItems = 0;
            }
            if (typeof (this._jsonModel.maxItems) !== 'number') {
                this._jsonModel.maxItems = -1;
            }
            if (typeof (this._jsonModel.initialItems) !== 'number') {
                this._jsonModel.initialItems = Math.max(1, this._jsonModel.minItems);
            }
            for (let i = 0; i < this._jsonModel.initialItems; i++) {
                //@ts-ignore
                this._addChild(this._itemTemplate);
            }
        }
        else if (items.length > 0) {
            items.forEach((item) => {
                this._addChild(item);
            });
            this._jsonModel.minItems = this._children.length;
            this._jsonModel.maxItems = this._children.length;
            this._jsonModel.initialItems = this._children.length;
        }
        this.setupRuleNode();
    }
    /**
     * @private
     */
    addItem(action) {
        if (action.type === 'addItem' && this._itemTemplate != null) {
            //@ts-ignore
            if ((this._jsonModel.maxItems === -1) || (this._children.length < this._jsonModel.maxItems)) {
                const retVal = this._addChild(this._itemTemplate, action.payload);
                this.notifyDependents((0, controller_1.propertyChange)('items', retVal.getState, null));
                retVal.dispatch(new controller_1.Initialize());
                retVal.dispatch(new controller_1.ExecuteRule());
            }
        }
    }
    /**
     * @private
     */
    removeItem(action) {
        if (action.type === 'removeItem' && this._itemTemplate != null) {
            const index = action.payload || this._children.length - 1;
            const state = this._children[index].getState();
            //@ts-ignore
            if (this._children.length > this._jsonModel.minItems) {
                // clear child
                //remove field
                this._childrenReference.pop();
                this._children.splice(index, 1);
                this.getDataNode().$removeDataNode(index);
                for (let i = index; i < this._children.length; i++) {
                    this._children[i].dispatch(new controller_1.ExecuteRule());
                }
                this.notifyDependents((0, controller_1.propertyChange)('items', null, state));
            }
        }
    }
    /**
     * @private
     */
    queueEvent(action) {
        var _a;
        super.queueEvent(action);
        if ((_a = action.metadata) === null || _a === void 0 ? void 0 : _a.dispatch) {
            this.items.forEach(x => {
                //@ts-ignore
                x.queueEvent(action);
            });
        }
    }
    validate() {
        return this.items.flatMap(x => {
            return x.validate();
        }).filter(x => x.fieldName !== '');
    }
    /**
     * @private
     */
    dispatch(action) {
        var _a;
        super.dispatch(action);
        if ((_a = action.metadata) === null || _a === void 0 ? void 0 : _a.dispatch) {
            this.items.forEach(x => {
                x.dispatch(action);
            });
        }
    }
    /**
     * @private
     */
    importData(contextualDataModel) {
        this._bindToDataModel(contextualDataModel);
        this.syncDataAndFormModel(this.getDataNode());
    }
    /**
     * prefill the form with data on the given element
     * @param dataModel
     * @param contextualDataModel
     * @param operation
     * @private
     */
    syncDataAndFormModel(contextualDataModel) {
        if ((contextualDataModel === null || contextualDataModel === void 0 ? void 0 : contextualDataModel.$type) === 'array' && this._itemTemplate != null) {
            const dataLength = contextualDataModel === null || contextualDataModel === void 0 ? void 0 : contextualDataModel.$value.length;
            const itemsLength = this._children.length;
            const maxItems = this._jsonModel.maxItems === -1 ? dataLength : this._jsonModel.maxItems;
            const minItems = this._jsonModel.minItems;
            //@ts-ignore
            let items2Add = Math.min(dataLength - itemsLength, maxItems - itemsLength);
            //@ts-ignore
            const items2Remove = Math.min(itemsLength - dataLength, itemsLength - minItems);
            while (items2Add > 0) {
                items2Add--;
                this._addChild(this._itemTemplate);
            }
            if (items2Remove > 0) {
                this._children.splice(dataLength, items2Remove);
                for (let i = 0; i < items2Remove; i++) {
                    this._childrenReference.pop();
                }
            }
        }
        this._children.forEach(x => {
            x.importData(contextualDataModel);
        });
    }
}
exports["default"] = Container;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/Field.js":
/*!*****************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/Field.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const types_1 = __webpack_require__(/*! ./types */ "./node_modules/@aemforms/af-core/lib/types/index.js");
const ValidationUtils_1 = __webpack_require__(/*! ./utils/ValidationUtils */ "./node_modules/@aemforms/af-core/lib/utils/ValidationUtils.js");
const controller_1 = __webpack_require__(/*! ./controller */ "./node_modules/@aemforms/af-core/lib/controller/index.js");
const Scriptable_1 = __importDefault(__webpack_require__(/*! ./Scriptable */ "./node_modules/@aemforms/af-core/lib/Scriptable.js"));
const SchemaUtils_1 = __webpack_require__(/*! ./utils/SchemaUtils */ "./node_modules/@aemforms/af-core/lib/utils/SchemaUtils.js");
const DataValue_1 = __importDefault(__webpack_require__(/*! ./data/DataValue */ "./node_modules/@aemforms/af-core/lib/data/DataValue.js"));
const BaseNode_1 = __webpack_require__(/*! ./BaseNode */ "./node_modules/@aemforms/af-core/lib/BaseNode.js");
const EmptyDataValue_1 = __importDefault(__webpack_require__(/*! ./data/EmptyDataValue */ "./node_modules/@aemforms/af-core/lib/data/EmptyDataValue.js"));
/**
 * Defines a form object field which implements {@link FieldModel | field model} interface
 */
class Field extends Scriptable_1.default {
    /**
     * @param params
     * @param _options
     * @private
     */
    constructor(params, _options) {
        super(params, _options);
        this._applyDefaults();
        this.queueEvent(new controller_1.Initialize());
        this.queueEvent(new controller_1.ExecuteRule());
    }
    /**
     * @private
     */
    _initialize() {
        super._initialize();
        this.setupRuleNode();
    }
    _getDefaults() {
        return {
            readOnly: false,
            enabled: true,
            visible: true,
            type: this._getFallbackType()
        };
    }
    /**
     * Returns the fallback type to be used for this field, in case type is not defined. Otherwise returns
     * undefined
     * @protected
     */
    _getFallbackType() {
        const type = this._jsonModel.type;
        if (typeof type !== 'string') {
            const _enum = this.enum;
            return _enum && _enum.length > 0 ? typeof _enum[0] : 'string';
        }
    }
    _applyDefaults() {
        Object.entries(this._getDefaults()).map(([key, value]) => {
            //@ts-ignore
            if (this._jsonModel[key] === undefined && value !== undefined) {
                //@ts-ignore
                this._jsonModel[key] = value;
            }
        });
        const value = this._jsonModel.value;
        if (value === undefined) {
            this._jsonModel.value = this._jsonModel.default;
        }
        if (this._jsonModel.fieldType === undefined) {
            //@ts-ignore
            if (this._jsonModel.viewType) {
                //@ts-ignore
                if (this._jsonModel.viewType.startsWith('custom:')) {
                    this.form.logger.error('viewType property has been removed. For custom types, use :type property');
                }
                else {
                    this.form.logger.error('viewType property has been removed. Use fieldType property');
                }
                //@ts-ignore
                this._jsonModel.fieldType = this._jsonModel.viewType;
            }
            else {
                this._jsonModel.fieldType = (0, SchemaUtils_1.defaultFieldTypes)(this._jsonModel);
            }
        }
        if (this._jsonModel.enum === undefined) {
            const type = this._jsonModel.type;
            if (type === 'boolean') {
                this._jsonModel.enum = [true, false];
            }
        }
        if (typeof this._jsonModel.step !== 'number' || this._jsonModel.type !== 'number') {
            this._jsonModel.step = undefined;
        }
    }
    get readOnly() {
        return this._jsonModel.readOnly;
    }
    set readOnly(e) {
        this._setProperty('readOnly', e);
    }
    get enabled() {
        return this._jsonModel.enabled;
    }
    set enabled(e) {
        this._setProperty('enabled', e);
    }
    get valid() {
        return this._jsonModel.valid;
    }
    get emptyValue() {
        if (this._jsonModel.emptyValue === 'null') {
            return null;
        }
        else if (this._jsonModel.emptyValue === '' && this.type === 'string') {
            return '';
        }
        else {
            return undefined;
        }
    }
    get enum() {
        return this._jsonModel.enum;
    }
    set enum(e) {
        this._setProperty('enum', e);
    }
    get enumNames() {
        return this._jsonModel.enumNames;
    }
    set enumNames(e) {
        this._setProperty('enumNames', e);
    }
    get required() {
        return this._jsonModel.required || false;
    }
    set required(r) {
        this._setProperty('required', r);
    }
    get maximum() {
        return this._jsonModel.maximum;
    }
    set maximum(m) {
        this._setProperty('maximum', m);
    }
    get minimum() {
        return this._jsonModel.minimum;
    }
    set minimum(m) {
        this._setProperty('minimum', m);
    }
    /**
     * returns whether the value is empty. Empty value is either a '', undefined or null
     * @private
     */
    isEmpty() {
        return this._jsonModel.value === undefined || this._jsonModel.value === null || this._jsonModel.value === '';
    }
    get value() {
        //@ts-ignore
        this.ruleEngine.trackDependency(this);
        if (this._jsonModel.value === undefined) {
            return null;
        }
        else {
            return this._jsonModel.value;
        }
    }
    set value(v) {
        const Constraints = this._getConstraintObject();
        const typeRes = Constraints.type(this._jsonModel.type || 'string', v);
        const changes = this._setProperty('value', typeRes.value, false);
        if (changes.length > 0) {
            const dataNode = this.getDataNode();
            if (typeof dataNode !== 'undefined') {
                dataNode.setValue(this.isEmpty() ? this.emptyValue : this._jsonModel.value, this._jsonModel.value);
            }
            let updates;
            if (typeRes.valid) {
                updates = this.evaluateConstraints();
            }
            else {
                const changes = {
                    'valid': typeRes.valid,
                    'errorMessage': typeRes.valid ? '' : this.getErrorMessage('type')
                };
                updates = this._applyUpdates(['valid', 'errorMessage'], changes);
            }
            if (updates.valid) {
                this.triggerValidationEvent(updates);
            }
            const changeAction = new controller_1.Change({ changes: changes.concat(Object.values(updates)) });
            this.dispatch(changeAction);
        }
    }
    valueOf() {
        // @ts-ignore
        const obj = this[BaseNode_1.target];
        const actualField = obj === undefined ? this : obj;
        actualField.ruleEngine.trackDependency(actualField);
        return actualField._jsonModel.value || null;
    }
    toString() {
        var _a;
        // @ts-ignore
        const obj = this[BaseNode_1.target];
        const actualField = obj === undefined ? this : obj;
        return ((_a = actualField._jsonModel.value) === null || _a === void 0 ? void 0 : _a.toString()) || '';
    }
    /**
     * Returns the error message for a given constraint
     * @param constraint
     */
    getErrorMessage(constraint) {
        var _a;
        return ((_a = this._jsonModel.constraintMessages) === null || _a === void 0 ? void 0 : _a[constraint]) || '';
    }
    /**
     *
     * @private
     */
    _getConstraintObject() {
        return ValidationUtils_1.Constraints;
    }
    /**
     * returns whether the field is array type or not
     * @private
     */
    isArrayType() {
        return this.type ? this.type.indexOf('[]') > -1 : false;
    }
    /**
     *
     * @param value
     * @param constraints
     * @private
     */
    checkEnum(value, constraints) {
        if (this._jsonModel.enforceEnum === true && value != null) {
            const fn = constraints.enum;
            if (value instanceof Array && this.isArrayType()) {
                return value.every(x => fn(this.enum || [], x).valid);
            }
            else {
                return fn(this.enum || [], value).valid;
            }
        }
        return true;
    }
    /**
     * checks whether the value can be achieved by stepping the min/default value by the step constraint.
     * Basically to find a integer solution for n in the equation
     * initialValue + n * step = value
     * @param constraints
     * @private
     */
    checkStep() {
        const value = this._jsonModel.value;
        if (typeof this._jsonModel.step === 'number') {
            const initialValue = this._jsonModel.minimum || this._jsonModel.default || 0;
            return (value - initialValue) % this._jsonModel.step === 0;
        }
        return true;
    }
    /**
     * checks whether the validation expression returns a boolean value or not
     * @private
     */
    checkValidationExpression() {
        if (typeof this._jsonModel.validationExpression === 'string') {
            return this.executeExpression(this._jsonModel.validationExpression);
        }
        return true;
    }
    /**
     * Returns the applicable constraints for a given type
     * @private
     */
    getConstraints() {
        switch (this.type) {
            case 'string':
                switch (this.format) {
                    case 'date':
                        return ValidationUtils_1.ValidConstraints.date;
                    case 'binary':
                        return ValidationUtils_1.ValidConstraints.file;
                    case 'data-url':
                        return ValidationUtils_1.ValidConstraints.file;
                    default:
                        return ValidationUtils_1.ValidConstraints.string;
                }
            case 'number':
                return ValidationUtils_1.ValidConstraints.number;
        }
        if (this.isArrayType()) {
            return ValidationUtils_1.ValidConstraints.array;
        }
        return [];
    }
    /**
     * returns the format constraint
     */
    get format() {
        return this._jsonModel.format || '';
    }
    /**
     * @private
     */
    evaluateConstraints() {
        let constraint = 'type';
        const elem = this._jsonModel;
        const value = this._jsonModel.value;
        const Constraints = this._getConstraintObject();
        const supportedConstraints = this.getConstraints();
        let valid = true;
        if (valid) {
            valid = Constraints.required(this.required, value).valid &&
                (this.isArrayType() && this.required ? value.length > 0 : true);
            constraint = 'required';
        }
        if (valid) {
            const invalidConstraint = supportedConstraints.find(key => {
                if (key in elem) {
                    // @ts-ignore
                    const restriction = elem[key];
                    // @ts-ignore
                    const fn = Constraints[key];
                    if (value instanceof Array && this.isArrayType()) {
                        return value.some(x => !(fn(restriction, x).valid));
                    }
                    else if (typeof fn === 'function') {
                        return !fn(restriction, value).valid;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            });
            if (invalidConstraint != null) {
                valid = false;
                constraint = invalidConstraint;
            }
            else {
                valid = this.checkEnum(value, Constraints);
                constraint = 'enum';
                if (valid && this.type === 'number') {
                    valid = this.checkStep();
                    constraint = 'step';
                }
                if (valid) {
                    valid = this.checkValidationExpression();
                    constraint = 'validationExpression';
                }
            }
        }
        if (!valid) {
            //@ts-ignore
            this.form.logger.log(`${constraint} constraint evaluation failed ${this[constraint]}. Received ${this._jsonModel.value}`);
        }
        const changes = {
            'valid': valid,
            'errorMessage': valid ? '' : this.getErrorMessage(constraint)
        };
        return this._applyUpdates(['valid', 'errorMessage'], changes);
    }
    triggerValidationEvent(changes) {
        if (changes.valid) {
            if (this.valid) {
                this.dispatch(new controller_1.Valid());
            }
            else {
                this.dispatch(new controller_1.Invalid());
            }
        }
    }
    /**
     * Checks whether there are any updates in the properties. If there are applies them to the
     * json model as well.
     * @param propNames
     * @param updates
     * @private
     */
    _applyUpdates(propNames, updates) {
        return propNames.reduce((acc, propertyName) => {
            //@ts-ignore
            const currentValue = updates[propertyName];
            const changes = this._setProperty(propertyName, currentValue, false);
            if (changes.length > 0) {
                acc[propertyName] = changes[0];
            }
            return acc;
        }, {});
    }
    /**
     * Validates the current form object
     */
    validate() {
        const changes = this.evaluateConstraints();
        if (changes.valid) {
            this.triggerValidationEvent(changes);
            this.notifyDependents(new controller_1.Change({ changes: Object.values(changes) }));
        }
        return this.valid ? [new types_1.ValidationError()] : [new types_1.ValidationError(this.id, [this._jsonModel.errorMessage])];
    }
    importData(contextualDataModel) {
        this._bindToDataModel(contextualDataModel);
        const dataNode = this.getDataNode();
        // only if the value has changed, queue change event
        if (dataNode !== undefined && dataNode !== EmptyDataValue_1.default && dataNode.$value !== this._jsonModel.value) {
            const changeAction = (0, controller_1.propertyChange)('value', dataNode.$value, this._jsonModel.value);
            this._jsonModel.value = dataNode.$value;
            this.queueEvent(changeAction);
        }
    }
    /**
     * @param name
     * @private
     */
    defaultDataModel(name) {
        return new DataValue_1.default(name, this.isEmpty() ? this.emptyValue : this._jsonModel.value, this.type || 'string');
    }
}
exports["default"] = Field;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/Fieldset.js":
/*!********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/Fieldset.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Fieldset = exports.createChild = void 0;
const Container_1 = __importDefault(__webpack_require__(/*! ./Container */ "./node_modules/@aemforms/af-core/lib/Container.js"));
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core/lib/Field.js"));
const FileUpload_1 = __importDefault(__webpack_require__(/*! ./FileUpload */ "./node_modules/@aemforms/af-core/lib/FileUpload.js"));
const JsonUtils_1 = __webpack_require__(/*! ./utils/JsonUtils */ "./node_modules/@aemforms/af-core/lib/utils/JsonUtils.js");
const Controller_1 = __webpack_require__(/*! ./controller/Controller */ "./node_modules/@aemforms/af-core/lib/controller/Controller.js");
const Checkbox_1 = __importDefault(__webpack_require__(/*! ./Checkbox */ "./node_modules/@aemforms/af-core/lib/Checkbox.js"));
const CheckboxGroup_1 = __importDefault(__webpack_require__(/*! ./CheckboxGroup */ "./node_modules/@aemforms/af-core/lib/CheckboxGroup.js"));
/**
 * Creates a child model inside the given parent
 * @param child
 * @param options
 * @private
 */
const createChild = (child, options) => {
    let retVal;
    if ('items' in child) {
        retVal = new Fieldset(child, options);
    }
    else {
        if ((0, JsonUtils_1.isFile)(child) || child.fieldType === 'file-input') {
            // @ts-ignore
            retVal = new FileUpload_1.default(child, options);
        }
        else if ((0, JsonUtils_1.isCheckbox)(child)) {
            retVal = new Checkbox_1.default(child, options);
        }
        else if ((0, JsonUtils_1.isCheckboxGroup)(child)) {
            retVal = new CheckboxGroup_1.default(child, options);
        }
        else {
            retVal = new Field_1.default(child, options);
        }
    }
    options.form.fieldAdded(retVal);
    return retVal;
};
exports.createChild = createChild;
const defaults = {
    visible: true
};
/**
 * Defines a field set class which extends from {@link Container | container}
 */
class Fieldset extends Container_1.default {
    /**
     * @param params
     * @param _options
     * @private
     */
    constructor(params, _options) {
        super(params, _options);
        this._applyDefaults();
        this.queueEvent(new Controller_1.Initialize());
        this.queueEvent(new Controller_1.ExecuteRule());
    }
    _applyDefaults() {
        Object.entries(defaults).map(([key, value]) => {
            //@ts-ignore
            if (this._jsonModel[key] === undefined) {
                //@ts-ignore
                this._jsonModel[key] = value;
            }
        });
    }
    get type() {
        const ret = super.type;
        if (ret === 'array' || ret === 'object') {
            return ret;
        }
        return undefined;
    }
    // @ts-ignore
    _createChild(child, options) {
        const { parent = this } = options;
        return (0, exports.createChild)(child, { form: this.form, parent: parent });
    }
    get items() {
        return super.items;
    }
    get value() {
        return null;
    }
}
exports.Fieldset = Fieldset;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/FileObject.js":
/*!**********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/FileObject.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FileObject = void 0;
/**
 * Defines a file object which implements the {@link IFileObject | file object interface}
 */
class FileObject {
    constructor(init) {
        this.mediaType = 'application/octet-stream';
        this.name = 'unknown';
        this.size = 0;
        Object.assign(this, init);
    }
    toJSON() {
        return {
            'name': this.name,
            'size': this.size,
            'mediaType': this.mediaType,
            'data': this.data.toString()
        };
    }
}
exports.FileObject = FileObject;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/FileUpload.js":
/*!**********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/FileUpload.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Controller_1 = __webpack_require__(/*! ./controller/Controller */ "./node_modules/@aemforms/af-core/lib/controller/Controller.js");
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core/lib/Field.js"));
const FormUtils_1 = __webpack_require__(/*! ./utils/FormUtils */ "./node_modules/@aemforms/af-core/lib/utils/FormUtils.js");
const ValidationUtils_1 = __webpack_require__(/*! ./utils/ValidationUtils */ "./node_modules/@aemforms/af-core/lib/utils/ValidationUtils.js");
const FileObject_1 = __webpack_require__(/*! ./FileObject */ "./node_modules/@aemforms/af-core/lib/FileObject.js");
function addNameToDataURL(dataURL, name) {
    return dataURL.replace(';base64', `;name=${encodeURIComponent(name)};base64`);
}
function processFiles(files) {
    return Promise.all([].map.call(files, processFile));
}
function processFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, size, mediaType } = file;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const fileObj = yield new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
                resolve(new FileObject_1.FileObject({
                    // @ts-ignore
                    data: addNameToDataURL(event.target.result, name),
                    mediaType: mediaType,
                    name,
                    size
                }));
            };
            reader.readAsDataURL(file.data);
        });
        return fileObj;
    });
}
/**
 * Implementation of FileUpload runtime model which extends from {@link Field | field}
 */
class FileUpload extends Field_1.default {
    //private _files: FileObject[];
    _getDefaults() {
        return Object.assign(Object.assign({}, super._getDefaults()), { accept: ['audio/*', 'video/*', 'image/*', 'text/*', 'application/pdf'], maxFileSize: '2MB', type: 'file' });
    }
    static extractFileInfo(files) {
        return (files instanceof Array ? files : [files])
            .map((file) => {
            let retVal = null;
            if (file instanceof FileObject_1.FileObject) {
                retVal = file;
            }
            else if (typeof File !== 'undefined' && file instanceof File) {
                // case: file object
                retVal = {
                    name: file.name,
                    mediaType: file.type,
                    size: file.size,
                    data: file
                };
            }
            else if (typeof file === 'string' && (0, ValidationUtils_1.isDataUrl)(file)) {
                // case: data URL
                const { blob, name } = (0, FormUtils_1.dataURItoBlob)(file);
                retVal = {
                    name: name,
                    mediaType: blob.type,
                    size: blob.size,
                    data: blob
                };
            }
            else {
                // case: string as file object
                let jFile = file;
                try {
                    jFile = JSON.parse(file);
                    retVal = jFile;
                }
                catch (ex) {
                    // do nothing
                }
                if (typeof (jFile === null || jFile === void 0 ? void 0 : jFile.data) === 'string' && (0, ValidationUtils_1.isDataUrl)(jFile === null || jFile === void 0 ? void 0 : jFile.data)) {
                    // case: data URL
                    const { blob } = (0, FormUtils_1.dataURItoBlob)(jFile === null || jFile === void 0 ? void 0 : jFile.data);
                    retVal = {
                        name: jFile === null || jFile === void 0 ? void 0 : jFile.name,
                        mediaType: jFile === null || jFile === void 0 ? void 0 : jFile.type,
                        size: blob.size,
                        data: blob
                    };
                }
                else if (typeof jFile === 'string') {
                    // case: data as external url
                    const fileName = jFile.split('/').pop();
                    retVal = {
                        name: fileName,
                        mediaType: 'application/octet-stream',
                        size: 0,
                        data: jFile
                    };
                }
                else if (jFile instanceof Object) {
                    // todo: just added for ease of integration for the view layer
                    retVal = {
                        name: jFile === null || jFile === void 0 ? void 0 : jFile.name,
                        mediaType: jFile === null || jFile === void 0 ? void 0 : jFile.type,
                        size: jFile === null || jFile === void 0 ? void 0 : jFile.size,
                        data: jFile === null || jFile === void 0 ? void 0 : jFile.data
                    };
                }
            }
            return new FileObject_1.FileObject(retVal);
        });
    }
    /**
     * Returns the max file size in bytes as per IEC specification
     */
    get maxFileSize() {
        return (0, FormUtils_1.getFileSizeInBytes)(this._jsonModel.maxFileSize);
    }
    /**
     * Returns the list of mime types which file attachment can accept
     */
    get accept() {
        return this._jsonModel.accept;
    }
    /**
     * Checks whether there are any updates in the properties
     * @param propNames
     * @param updates
     * @private
     */
    _applyUpdates(propNames, updates) {
        return propNames.reduce((acc, propertyName) => {
            //@ts-ignore
            const prevValue = this._jsonModel[propertyName];
            const currentValue = updates[propertyName];
            if (currentValue !== prevValue) {
                acc[propertyName] = {
                    propertyName,
                    currentValue,
                    prevValue
                };
                if (prevValue instanceof FileObject_1.FileObject && typeof currentValue === 'object' && propertyName === 'value') {
                    // @ts-ignore
                    this._jsonModel[propertyName] = new FileObject_1.FileObject(Object.assign(Object.assign({}, prevValue), { 'data': currentValue.data }));
                }
                else {
                    // @ts-ignore
                    this._jsonModel[propertyName] = currentValue;
                }
            }
            return acc;
        }, {});
    }
    typeCheck(value) {
        const type = this._jsonModel.type || 'file';
        switch (type) {
            case 'string':
                return { valid: true, value: value };
            default:
                return ValidationUtils_1.Constraints.type(type, value);
        }
    }
    get value() {
        // @ts-ignore
        this.ruleEngine.trackDependency(this);
        if (this._jsonModel.value === undefined) {
            return null;
        }
        let val = this._jsonModel.value;
        // always return file object irrespective of data schema
        if (val != null) {
            // @ts-ignore
            val = this.coerce((val instanceof Array ? val : [val])
                .map(file => {
                let retVal = file;
                if (!(retVal instanceof FileObject_1.FileObject)) {
                    retVal = new FileObject_1.FileObject({
                        'name': file.name,
                        'mediaType': file.mediaType,
                        'size': file.size,
                        'data': file.data
                    });
                }
                // define serialization here
                /*
                Object.defineProperty(retVal, 'data', {
                    get: async function() {
                        if (file.data instanceof File) {
                            return processFile(file);
                        } else {
                            return file.data;
                        }
                    }
                });
                */
                return retVal;
            }));
        }
        return val;
    }
    set value(value) {
        if (value !== undefined) {
            // store file list here
            const typeRes = this.typeCheck(value);
            const changes = this._setProperty('value', typeRes.value, false);
            let fileInfoPayload = FileUpload.extractFileInfo(value);
            fileInfoPayload = this.coerce(fileInfoPayload);
            this._setProperty('value', fileInfoPayload, false);
            if (changes.length > 0) {
                const dataNode = this.getDataNode();
                if (typeof dataNode !== 'undefined') {
                    let val = this._jsonModel.value;
                    const retVal = (val instanceof Array ? val : [val]).map(file => {
                        if (this.type === 'file' || this.type === 'file[]') {
                            return file;
                        }
                        else if (this.type === 'string' || this.type === 'string[]') {
                            // @ts-ignore
                            return file.data.toString();
                        }
                    });
                    val = this.coerce(retVal);
                    if (dataNode !== undefined) {
                        dataNode.setValue(val, this._jsonModel.value);
                    }
                }
                let updates;
                if (typeRes.valid) {
                    updates = this.evaluateConstraints();
                }
                else {
                    const changes = {
                        'valid': typeRes.valid,
                        'errorMessage': typeRes.valid ? '' : this.getErrorMessage('type')
                    };
                    updates = this._applyUpdates(['valid', 'errorMessage'], changes);
                }
                if (updates.valid) {
                    this.triggerValidationEvent(updates);
                }
                const changeAction = new Controller_1.Change({ changes: changes.concat(Object.values(updates)) });
                this.dispatch(changeAction);
            }
        }
    }
    _serialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const val = this._jsonModel.value;
            if (val === undefined) {
                return null;
            }
            // @ts-ignore
            const filesInfo = yield processFiles(val instanceof Array ? val : [val]);
            return filesInfo;
        });
    }
    coerce(val) {
        let retVal = val;
        if ((this.type === 'string' || this.type === 'file') && retVal instanceof Array) {
            // @ts-ignore
            retVal = val[0];
        }
        return retVal;
    }
    importData(dataModel) {
        this._bindToDataModel(dataModel);
        const dataNode = this.getDataNode();
        if (dataNode !== undefined) {
            const value = dataNode === null || dataNode === void 0 ? void 0 : dataNode.$value;
            let newValue = value;
            // only if not undefined, proceed further
            if (value != null) {
                const fileObj = FileUpload.extractFileInfo(value);
                newValue = this.coerce(fileObj);
                // is this needed ?
                this.form.getEventQueue().queue(this, (0, Controller_1.propertyChange)('value', newValue, this._jsonModel.value));
            }
            this._jsonModel.value = newValue;
        }
    }
}
exports["default"] = FileUpload;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/Form.js":
/*!****************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/Form.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const Container_1 = __importDefault(__webpack_require__(/*! ./Container */ "./node_modules/@aemforms/af-core/lib/Container.js"));
const FormMetaData_1 = __importDefault(__webpack_require__(/*! ./FormMetaData */ "./node_modules/@aemforms/af-core/lib/FormMetaData.js"));
const Fieldset_1 = __webpack_require__(/*! ./Fieldset */ "./node_modules/@aemforms/af-core/lib/Fieldset.js");
const EventQueue_1 = __importDefault(__webpack_require__(/*! ./controller/EventQueue */ "./node_modules/@aemforms/af-core/lib/controller/EventQueue.js"));
const FormUtils_1 = __webpack_require__(/*! ./utils/FormUtils */ "./node_modules/@aemforms/af-core/lib/utils/FormUtils.js");
const DataGroup_1 = __importDefault(__webpack_require__(/*! ./data/DataGroup */ "./node_modules/@aemforms/af-core/lib/data/DataGroup.js"));
const FunctionRuntime_1 = __webpack_require__(/*! ./rules/FunctionRuntime */ "./node_modules/@aemforms/af-core/lib/rules/FunctionRuntime.js");
const controller_1 = __webpack_require__(/*! ./controller */ "./node_modules/@aemforms/af-core/lib/controller/index.js");
const levels = {
    off: 0,
    info: 1,
    warn: 2,
    error: 3
};
/**
 * @private
 */
class Logger {
    constructor(logLevel = 'off') {
        this.logLevel = levels[logLevel];
    }
    info(msg) {
        this.log(msg, 'info');
    }
    warn(msg) {
        this.log(msg, 'warn');
    }
    error(msg) {
        this.log(msg, 'error');
    }
    log(msg, level) {
        if (this.logLevel !== 0 && this.logLevel <= levels[level]) {
            console[level](msg);
        }
    }
}
exports.Logger = Logger;
/**
 * Defines `form model` which implements {@link FormModel | form model}
 */
class Form extends Container_1.default {
    /**
     * @param n
     * @param _ruleEngine
     * @param _eventQueue
     * @param logLevel
     * @private
     */
    constructor(n, _ruleEngine, _eventQueue = new EventQueue_1.default(), logLevel = 'off') {
        //@ts-ignore
        super(n, {});
        this._ruleEngine = _ruleEngine;
        this._eventQueue = _eventQueue;
        /**
         * @private
         */
        this._fields = {};
        /**
         * @private
         */
        this._invalidFields = [];
        this.dataRefRegex = /("[^"]+?"|[^.]+?)(?:\.|$)/g;
        this._logger = new Logger(logLevel);
        this.queueEvent(new controller_1.Initialize());
        this.queueEvent(new controller_1.ExecuteRule());
        this._ids = (0, FormUtils_1.IdGenerator)();
        this._bindToDataModel(new DataGroup_1.default('$form', {}));
        this._initialize();
    }
    get logger() {
        return this._logger;
    }
    get metaData() {
        const metaData = this._jsonModel.metadata || {};
        return new FormMetaData_1.default(metaData);
    }
    get action() {
        return this._jsonModel.action;
    }
    _createChild(child) {
        return (0, Fieldset_1.createChild)(child, { form: this, parent: this });
    }
    importData(dataModel) {
        this._bindToDataModel(new DataGroup_1.default('$form', dataModel));
        this.syncDataAndFormModel(this.getDataNode());
        this._eventQueue.runPendingQueue();
    }
    exportData() {
        var _a;
        return (_a = this.getDataNode()) === null || _a === void 0 ? void 0 : _a.$value;
    }
    /**
     * Returns the current state of the form
     *
     * To access the form data and attachments, one needs to use the `data` and `attachments` property.
     * For example,
     * ```
     * const data = form.getState().data
     * const attachments = form.getState().attachments
     * ```
     */
    getState() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const res = super.getState();
        res.id = '$form';
        Object.defineProperty(res, 'data', {
            get: function () {
                return self.exportData();
            }
        });
        Object.defineProperty(res, 'attachments', {
            get: function () {
                return (0, FormUtils_1.getAttachments)(self);
            }
        });
        return res;
    }
    get type() {
        return 'object';
    }
    isTransparent() {
        return false;
    }
    get form() {
        return this;
    }
    get ruleEngine() {
        return this._ruleEngine;
    }
    getUniqueId() {
        if (this._ids == null) {
            return '';
        }
        return this._ids.next().value;
    }
    /**
     * @param field
     * @private
     */
    fieldAdded(field) {
        this._fields[field.id] = field;
        field.subscribe((action) => {
            if (this._invalidFields.indexOf(action.target.id) === -1) {
                this._invalidFields.push(action.target.id);
            }
        }, 'invalid');
        field.subscribe((action) => {
            const index = this._invalidFields.indexOf(action.target.id);
            if (index > -1) {
                this._invalidFields.splice(index, 1);
            }
        }, 'valid');
        field.subscribe((action) => {
            //@ts-ignore
            const field = action.target.getState();
            if (field) {
                const fieldChangedAction = new controller_1.FieldChanged(action.payload.changes, field);
                this.dispatch(fieldChangedAction);
            }
        });
    }
    validate() {
        const validationErrors = super.validate();
        // trigger event on form so that user's can customize their application
        this.dispatch(new controller_1.ValidationComplete(validationErrors));
        return validationErrors;
    }
    /**
     * Checks if the given form is valid or not
     * @returns `true`, if form is valid, `false` otherwise
     */
    isValid() {
        return this._invalidFields.length === 0;
    }
    /**
     * @param field
     * @private
     */
    dispatch(action) {
        if (action.type === 'submit') {
            super.queueEvent(action);
            this._eventQueue.runPendingQueue();
        }
        else {
            super.dispatch(action);
        }
    }
    /**
     * @param action
     * @private
     */
    executeAction(action) {
        if (action.type !== 'submit' || this._invalidFields.length === 0) {
            super.executeAction(action);
        }
    }
    /**
     * @param action
     * @param context
     * @private
     */
    submit(action, context) {
        // if no errors, only then submit
        if (this.validate().length === 0) {
            (0, FunctionRuntime_1.submit)(context, action.payload.success, action.payload.error, action.payload.submit_as, action.payload.data);
        }
    }
    getElement(id) {
        if (id == this.id) {
            return this;
        }
        return this._fields[id];
    }
    /**
     * @private
     */
    getEventQueue() {
        return this._eventQueue;
    }
    get name() {
        return '$form';
    }
    get value() {
        return null;
    }
    get id() {
        return '$form';
    }
    get title() {
        return this._jsonModel.title || '';
    }
}
exports["default"] = Form;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/FormInstance.js":
/*!************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/FormInstance.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fetchForm = exports.validateFormInstance = exports.createFormInstance = void 0;
const Form_1 = __importStar(__webpack_require__(/*! ./Form */ "./node_modules/@aemforms/af-core/lib/Form.js"));
const JsonUtils_1 = __webpack_require__(/*! ./utils/JsonUtils */ "./node_modules/@aemforms/af-core/lib/utils/JsonUtils.js");
const Fetch_1 = __webpack_require__(/*! ./utils/Fetch */ "./node_modules/@aemforms/af-core/lib/utils/Fetch.js");
const RuleEngine_1 = __importDefault(__webpack_require__(/*! ./rules/RuleEngine */ "./node_modules/@aemforms/af-core/lib/rules/RuleEngine.js"));
const EventQueue_1 = __importDefault(__webpack_require__(/*! ./controller/EventQueue */ "./node_modules/@aemforms/af-core/lib/controller/EventQueue.js"));
/**
 * Creates form instance using form model definition as per `adaptive form specification`
 * @param formModel form model definition
 * @param callback a callback that recieves the FormModel instance that gets executed before any event in the Form
 * is executed
 * @param logLevel Logging Level for the form. Setting it off will disable the logging
 * @param fModel existing form model, this is additional optimization to prevent creation of form instance
 * @returns {@link FormModel | form model}
 */
const createFormInstance = (formModel, callback, logLevel = 'error', fModel = undefined) => {
    try {
        let f = fModel;
        if (f == null) {
            f = new Form_1.default(Object.assign({}, formModel), new RuleEngine_1.default(), new EventQueue_1.default(new Form_1.Logger(logLevel)), logLevel);
        }
        const formData = formModel === null || formModel === void 0 ? void 0 : formModel.data;
        if (formData) {
            f.importData(formData);
        }
        if (typeof callback === 'function') {
            callback(f);
        }
        // Once the field or panel is initialized, execute the initialization script
        // this means initialization happens after prefill and restore
        // Before execution of calcExp, visibleExp, enabledExp, validate, options, navigationChange, we execute init script
        //f.queueEvent(new Initialize(undefined, true));
        //f.queueEvent(new ExecuteRule(undefined, true));
        f.getEventQueue().runPendingQueue();
        return f;
    }
    catch (e) {
        console.error(`Unable to create an instance of the Form ${e}`);
        throw new Error(e);
    }
};
exports.createFormInstance = createFormInstance;
/**
 * Validates Form model definition with the given data
 * @param formModel     form model definition
 * @param data          form data
 * @returns `true`, if form is valid against the given form data, `false` otherwise
 */
const validateFormInstance = (formModel, data) => {
    try {
        const f = new Form_1.default(Object.assign({}, formModel), new RuleEngine_1.default());
        if (data) {
            f.importData(data);
        }
        return f.validate().length === 0;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.validateFormInstance = validateFormInstance;
/**
 * Helper API to fetch form model definition from an AEM instance
 * @param url       URL of the instance
 * @param headers   HTTP headers to pass to the aem instance
 * @returns promise which resolves to the form model definition
 */
const fetchForm = (url, headers = {}) => {
    const headerObj = new Headers();
    Object.entries(headers).forEach(([key, value]) => {
        headerObj.append(key, value);
    });
    return (0, Fetch_1.request)(`${url}.model.json`, null, { headers }).then((formObj) => {
        if ('model' in formObj) {
            const { model } = formObj;
            formObj = model;
        }
        return (0, JsonUtils_1.jsonString)(formObj);
    });
};
exports.fetchForm = fetchForm;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/FormMetaData.js":
/*!************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/FormMetaData.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Node_1 = __importDefault(__webpack_require__(/*! ./Node */ "./node_modules/@aemforms/af-core/lib/Node.js"));
/**
 * Defines form metadata which implements {@link FormMetaDataModel | Form MetaData Model}
 */
class FormMetaData extends Node_1.default {
    get version() {
        return this.getP('version', '');
    }
    get locale() {
        return this.getP('locale', '');
    }
    get grammar() {
        return this.getP('grammar', '');
    }
}
exports["default"] = FormMetaData;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/Node.js":
/*!****************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/Node.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const JsonUtils_1 = __webpack_require__(/*! ./utils/JsonUtils */ "./node_modules/@aemforms/af-core/lib/utils/JsonUtils.js");
/**
 * Defines generic form object class which any form runtime model (like textbox, checkbox etc)
 * should extend from.
 * @typeparam T type of the node (for example, {@link MetaDataJson | form meta data}
 */
class Node {
    constructor(inputModel) {
        this._jsonModel = Object.assign({}, inputModel);
    }
    getP(key, def) {
        return (0, JsonUtils_1.getProperty)(this._jsonModel, key, def);
    }
    get isContainer() {
        return false;
    }
}
exports["default"] = Node;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/Scriptable.js":
/*!**********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/Scriptable.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BaseNode_1 = __webpack_require__(/*! ./BaseNode */ "./node_modules/@aemforms/af-core/lib/BaseNode.js");
/**
 * Defines scriptable aspects (ie rules, events) of form runtime model. Any form runtime object which requires
 * execution of rules/events should extend from this class.
 */
const dynamicProps = ['label',
    'enum',
    'enumNames',
    'enforceEnum',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'maxLength',
    'maximum',
    'maxItems',
    'minLength',
    'minimum',
    'minItems',
    'required',
    'step',
    'description',
    'properties',
    'readOnly',
    'value',
    'visible',
    'enabled',
    'placeholder'];
class Scriptable extends BaseNode_1.BaseNode {
    constructor() {
        super(...arguments);
        this._events = {};
        this._rules = {};
    }
    get rules() {
        return this._jsonModel.rules || {};
    }
    getCompiledRule(eName, rule) {
        if (!(eName in this._rules)) {
            const eString = rule || this.rules[eName];
            if (typeof eString === 'string' && eString.length > 0) {
                try {
                    this._rules[eName] = this.ruleEngine.compileRule(eString);
                }
                catch (e) {
                    this.form.logger.error(`Unable to compile rule \`"${eName}" : "${eString}"\` Exception : ${e}`);
                }
            }
            else {
                throw new Error(`only expression strings are supported. ${typeof (eString)} types are not supported`);
            }
        }
        return this._rules[eName];
    }
    getCompiledEvent(eName) {
        var _a;
        if (!(eName in this._events)) {
            let eString = (_a = this._jsonModel.events) === null || _a === void 0 ? void 0 : _a[eName];
            if (typeof eString === 'string' && eString.length > 0) {
                eString = [eString];
            }
            if (typeof eString !== 'undefined' && eString.length > 0) {
                this._events[eName] = eString.map(x => {
                    try {
                        return this.ruleEngine.compileRule(x);
                    }
                    catch (e) {
                        this.form.logger.error(`Unable to compile expression \`"${eName}" : "${eString}"\` Exception : ${e}`);
                    }
                    return null;
                }).filter(x => x !== null);
            }
        }
        return this._events[eName] || [];
    }
    applyUpdates(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            // @ts-ignore
            // the first check is to disable accessing this.value & this.items property
            // otherwise that will trigger dependency tracking
            if (key in dynamicProps || (key in this && typeof this[key] !== 'function')) {
                try {
                    // @ts-ignore
                    this[key] = value;
                }
                catch (e) {
                    console.error(e);
                }
            }
        });
    }
    executeAllRules(context) {
        const entries = Object.entries(this.rules);
        if (entries.length > 0) {
            const scope = this.getExpressionScope();
            const values = entries.map(([prop, rule]) => {
                const node = this.getCompiledRule(prop, rule);
                let newVal;
                if (node) {
                    newVal = this.ruleEngine.execute(node, scope, context, true);
                    if (dynamicProps.indexOf(prop) > -1) {
                        //@ts-ignore
                        this[prop] = newVal;
                    }
                }
                return [];
            }).filter(x => x.length == 2);
            this.applyUpdates(Object.fromEntries(values));
        }
    }
    getExpressionScope() {
        var _a;
        const target = {
            self: this.getRuleNode(),
            siblings: ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.ruleNodeReference()) || {}
        };
        const scope = new Proxy(target, {
            get: (target, prop) => {
                if (prop === Symbol.toStringTag) {
                    return 'Object';
                }
                prop = prop;
                // The order of resolution is
                // 1. property
                // 2. sibling
                // 3. child
                if (prop.startsWith('$')) {
                    //this returns children as well, so adding an explicit check for property name
                    return target.self[prop];
                }
                else {
                    if (prop in target.siblings) {
                        return target.siblings[prop];
                    }
                    else {
                        return target.self[prop];
                    }
                }
            },
            has: (target, prop) => {
                prop = prop;
                const selfPropertyOrChild = target.self[prop];
                const sibling = target.siblings[prop];
                return typeof selfPropertyOrChild != 'undefined' || typeof sibling != 'undefined';
            }
        });
        return scope;
    }
    executeEvent(context, node) {
        let updates;
        if (node) {
            updates = this.ruleEngine.execute(node, this.getExpressionScope(), context);
        }
        if (typeof updates !== 'undefined') {
            this.applyUpdates(updates);
        }
    }
    /**
     * Executes the given rule
     * @param event
     * @param context
     * @private
     */
    executeRule(event, context) {
        if (typeof event.payload.ruleName === 'undefined') {
            this.executeAllRules(context);
        }
    }
    executeExpression(expr) {
        const ruleContext = {
            'form': this.form,
            '$form': this.form.getRuleNode(),
            '$field': this.getRuleNode(),
            'field': this
        };
        const node = this.ruleEngine.compileRule(expr);
        return this.ruleEngine.execute(node, this.getExpressionScope(), ruleContext);
    }
    /**
     * Executes the given action
     * @param action    {@link Action | event object}
     */
    executeAction(action) {
        const context = {
            'form': this.form,
            '$form': this.form.getRuleNode(),
            '$field': this.getRuleNode(),
            'field': this,
            '$event': {
                type: action.type,
                payload: action.payload,
                target: this.getRuleNode()
            }
        };
        const eventName = action.isCustomEvent ? `custom:${action.type}` : action.type;
        const funcName = action.isCustomEvent ? `custom_${action.type}` : action.type;
        const node = this.getCompiledEvent(eventName);
        //todo: apply all the updates at the end  or
        // not trigger the change event until the execution is finished
        node.forEach((n) => this.executeEvent(context, n));
        // @ts-ignore
        if (funcName in this && typeof this[funcName] === 'function') {
            //@ts-ignore
            this[funcName](action, context);
        }
        this.notifyDependents(action);
    }
}
exports["default"] = Scriptable;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/controller/Controller.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/controller/Controller.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoveItem = exports.AddItem = exports.CustomEvent = exports.FieldChanged = exports.Submit = exports.ValidationComplete = exports.Blur = exports.Click = exports.Initialize = exports.propertyChange = exports.ExecuteRule = exports.Valid = exports.Invalid = exports.Change = exports.ActionImpl = void 0;
/**
 * Implementation of generic event
 * @private
 */
class ActionImpl {
    constructor(payload, type, _metadata) {
        this._metadata = _metadata;
        this._payload = payload;
        this._type = type;
    }
    get type() {
        return this._type;
    }
    get payload() {
        return this._payload;
    }
    get metadata() {
        return this._metadata;
    }
    get target() {
        return this._target;
    }
    get isCustomEvent() {
        return false;
    }
    payloadToJson() {
        return this.payload;
    }
    toJson() {
        return {
            payload: this.payloadToJson(),
            type: this.type,
            isCustomEvent: this.isCustomEvent
        };
    }
    toString() {
        return JSON.stringify(this.toJson());
    }
}
exports.ActionImpl = ActionImpl;
/**
 * Implementation of `change` event. The change event is triggered on the field whenever the value of the field is changed
 */
class Change extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
     */
    constructor(payload, dispatch = false) {
        super(payload, 'change', { dispatch });
    }
}
exports.Change = Change;
/**
 * Implementation of `invalid` event. The invalid event is triggered when a Field’s value becomes invalid after a change event or whenever its value property change
 */
class Invalid extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     */
    constructor(payload = {}) {
        super(payload, 'invalid', {});
    }
}
exports.Invalid = Invalid;
/**
 * Implementation of `valid` event. The valid event is triggered whenever the field’s valid state is changed from invalid to valid.
 */
class Valid extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     */
    constructor(payload = {}) {
        super(payload, 'valid', {});
    }
}
exports.Valid = Valid;
/**
 * Implementation of an ExecuteRule event.
 * @private
 */
class ExecuteRule extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
     */
    constructor(payload = {}, dispatch = false) {
        super(payload, 'executeRule', { dispatch });
    }
}
exports.ExecuteRule = ExecuteRule;
/**
 * Creates a change event
 * @param propertyName  name of the form field property
 * @param currentValue  current value
 * @param prevValue     previous value
 * @returns {@link Change} change event
 */
const propertyChange = (propertyName, currentValue, prevValue) => {
    return new Change({
        changes: [
            {
                propertyName,
                currentValue,
                prevValue
            }
        ]
    });
};
exports.propertyChange = propertyChange;
/**
 * Implementation of `initialize` event. The event is triggered on all the fields when the form initialisation is complete
 */
class Initialize extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
     */
    constructor(payload, dispatch = false) {
        super(payload, 'initialize', { dispatch });
    }
}
exports.Initialize = Initialize;
/**
 * Implementation of `click` event. The event is triggered when user clicks on an element.
 */
class Click extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
     */
    constructor(payload, dispatch = false) {
        super(payload, 'click', { dispatch });
    }
}
exports.Click = Click;
/**
 * Implementation of `blur` event. The event is triggered when the element loses focus.
 */
class Blur extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
     */
    constructor(payload, dispatch = false) {
        super(payload, 'blur', { dispatch });
    }
}
exports.Blur = Blur;
/**
 * Implementation of `ValidationComplete` event. The ValidationComplete event is triggered once validation is completed
 * on the form.
 *
 * An example of using this event,
 * ```
 * function onValidationComplete(event) {
 *	 const x = event.payload[0].id;
 *	 // do something with the invalid field
 * }
 * ```
 */
class ValidationComplete extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload (ie) list of {@link ValidationError | validation errors}
     * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
     */
    constructor(payload, dispatch = false) {
        super(payload, 'validationComplete', { dispatch });
    }
}
exports.ValidationComplete = ValidationComplete;
/**
 * Implementation of `submit` event. The submit event is triggered on the Form.
 * To trigger the submit event, submit function needs to be invoked or one can invoke dispatchEvent API.
 */
class Submit extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
     */
    constructor(payload, dispatch = false) {
        super(payload, 'submit', { dispatch });
    }
}
exports.Submit = Submit;
/**
 * Implementation of `fieldChanged` event. The field changed event is triggered on the field which it has changed.
 */
class FieldChanged extends ActionImpl {
    constructor(changes, field) {
        super({
            field,
            changes
        }, 'fieldChanged');
    }
}
exports.FieldChanged = FieldChanged;
/**
 * Implementation of `custom event`.
 */
class CustomEvent extends ActionImpl {
    /**
     * @constructor
     * @param [eventName] name of the event
     * @param [payload] event payload
     * @param [dispatch] true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
     */
    constructor(eventName, payload = {}, dispatch = false) {
        super(payload, eventName, { dispatch });
    }
    /**
     * Defines if the event is custom
     */
    get isCustomEvent() {
        return true;
    }
}
exports.CustomEvent = CustomEvent;
/**
 * Implementation of `addItem` event. The event is triggered on a panel to add a new instance of items inside it.
 */
class AddItem extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     */
    constructor(payload) {
        super(payload, 'addItem');
    }
}
exports.AddItem = AddItem;
/**
 * Implementation of `removeItem` event. The event is triggered on a panel to remove an instance of items inside it.
 */
class RemoveItem extends ActionImpl {
    /**
     * @constructor
     * @param [payload] event payload
     */
    constructor(payload) {
        super(payload, 'removeItem');
    }
}
exports.RemoveItem = RemoveItem;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/controller/EventQueue.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/controller/EventQueue.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Form_1 = __webpack_require__(/*! ../Form */ "./node_modules/@aemforms/af-core/lib/Form.js");
/**
 * Implementation of event node
 * @private
 */
class EventNode {
    constructor(_node, _event) {
        this._node = _node;
        this._event = _event;
    }
    get node() {
        return this._node;
    }
    get event() {
        return this._event;
    }
    isEqual(that) {
        return that !== null && that !== undefined && this._node == that._node && this._event.type == that._event.type;
    }
    toString() {
        return this._node.id + '__' + this.event.type;
    }
    valueOf() {
        return this.toString();
    }
}
/**
 * Implementation of event queue. When a user event, like change or click, is captured the expression to be evaluated
 * must be put in an Event Queue and then evaluated.
 * @private
 */
class EventQueue {
    constructor(logger = new Form_1.Logger('off')) {
        this.logger = logger;
        this._isProcessing = false;
        this._pendingEvents = [];
        this._runningEventCount = {};
    }
    get length() {
        return this._pendingEvents.length;
    }
    get isProcessing() {
        return this._isProcessing;
    }
    isQueued(node, event) {
        const evntNode = new EventNode(node, event);
        return this._pendingEvents.find(x => evntNode.isEqual(x)) !== undefined;
    }
    queue(node, events, priority = false) {
        if (!node || !events) {
            return;
        }
        if (!(events instanceof Array)) {
            events = [events];
        }
        events.forEach(e => {
            const evntNode = new EventNode(node, e);
            const counter = this._runningEventCount[evntNode.valueOf()] || 0;
            const alreadyExists = this.isQueued(node, e);
            if (!alreadyExists || counter < 10) {
                this.logger.info(`Queued event : ${e.type} node: ${node.id} - ${node.name}`);
                //console.log(`Event Details ${e.toString()}`)
                if (priority) {
                    const index = this._isProcessing ? 1 : 0;
                    this._pendingEvents.splice(index, 0, evntNode);
                }
                else {
                    this._pendingEvents.push(evntNode);
                }
                this._runningEventCount[evntNode.valueOf()] = counter + 1;
            }
        });
    }
    runPendingQueue() {
        if (this._isProcessing) {
            return;
        }
        this._isProcessing = true;
        while (this._pendingEvents.length > 0) {
            const e = this._pendingEvents[0];
            this.logger.info(`Dequeued event : ${e.event.type} node: ${e.node.id} - ${e.node.name}`);
            //console.log(`Event Details ${e.event.toString()}`);
            e.node.executeAction(e.event);
            this._pendingEvents.shift();
        }
        this._runningEventCount = {};
        this._isProcessing = false;
    }
}
exports["default"] = EventQueue;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/controller/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/controller/index.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Controller */ "./node_modules/@aemforms/af-core/lib/controller/Controller.js"), exports);


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/data/DataGroup.js":
/*!**************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/data/DataGroup.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Defines data group
 */
const DataValue_1 = __importDefault(__webpack_require__(/*! ./DataValue */ "./node_modules/@aemforms/af-core/lib/data/DataValue.js"));
const EmptyDataValue_1 = __importDefault(__webpack_require__(/*! ./EmptyDataValue */ "./node_modules/@aemforms/af-core/lib/data/EmptyDataValue.js"));
/**
 * @private
 */
class DataGroup extends DataValue_1.default {
    constructor(_name, _value, _type = typeof _value) {
        super(_name, _value, _type);
        this.$_items = {};
        Object.entries(_value).forEach(([key, value]) => {
            let x;
            const t = value instanceof Array ? 'array' : typeof value;
            if (typeof value === 'object' && value != null) {
                x = new DataGroup(key, value, t);
            }
            else {
                x = new DataValue_1.default(key, value, t);
            }
            this.$_items[key] = x;
        });
    }
    get $value() {
        if (this.$type === 'array') {
            return Object.values(this.$_items).filter(x => typeof x !== 'undefined').map(x => x.$value);
        }
        else {
            return Object.fromEntries(Object.values(this.$_items).filter(x => typeof x !== 'undefined').map(x => {
                return [x.$name, x.$value];
            }));
        }
    }
    get $length() {
        return Object.entries(this.$_items).length;
    }
    $convertToDataValue() {
        return new DataValue_1.default(this.$name, this.$value, this.$type);
    }
    $addDataNode(name, value) {
        if (value !== EmptyDataValue_1.default) {
            this.$_items[name] = value;
        }
    }
    $removeDataNode(name) {
        //@ts-ignore not calling delete
        this.$_items[name] = undefined;
    }
    $getDataNode(name) {
        if (this.$_items.hasOwnProperty(name)) {
            return this.$_items[name];
        }
    }
    $containsDataNode(name) {
        return this.$_items.hasOwnProperty(name) && typeof (this.$_items[name]) !== 'undefined';
    }
    get $isDataGroup() {
        return true;
    }
}
exports["default"] = DataGroup;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/data/DataValue.js":
/*!**************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/data/DataValue.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @private
 */
class DataValue {
    constructor($_name, $_value, $_type = typeof $_value) {
        this.$_name = $_name;
        this.$_value = $_value;
        this.$_type = $_type;
        this.$_fields = [];
    }
    valueOf() {
        return this.$_value;
    }
    get $name() {
        return this.$_name;
    }
    get $value() {
        return this.$_value;
    }
    setValue(typedValue, originalValue) {
        this.$_value = typedValue;
        this.$_fields.forEach(x => {
            x.value = originalValue;
        });
    }
    get $type() {
        return this.$_type;
    }
    $bindToField(field) {
        if (this.$_fields.indexOf(field) === -1) {
            this.$_fields.push(field);
        }
    }
    $convertToDataValue() {
        return this;
    }
    get $isDataGroup() {
        return false;
    }
}
exports["default"] = DataValue;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/data/EmptyDataValue.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/data/EmptyDataValue.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const DataValue_1 = __importDefault(__webpack_require__(/*! ./DataValue */ "./node_modules/@aemforms/af-core/lib/data/DataValue.js"));
const value = Symbol('NullValue');
class NullDataValueClass extends DataValue_1.default {
    constructor() {
        super('', value, 'null');
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setValue() {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    $bindToField() {
    }
    $length() {
        return 0;
    }
    $convertToDataValue() {
        return this;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    $addDataNode() {
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    $removeDataNode() {
    }
    $getDataNode() {
        return this;
    }
    $containsDataNode() {
        return false;
    }
}
//@ts-ignore
const NullDataValue = new NullDataValueClass();
exports["default"] = NullDataValue;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFileSizeInBytes = exports.Scriptable = exports.Node = exports.FormMetaData = exports.FileUpload = exports.FileObject = exports.Fieldset = exports.Field = exports.Container = exports.CheckboxGroup = exports.Checkbox = exports.BaseNode = exports.Form = void 0;
__exportStar(__webpack_require__(/*! ./FormInstance */ "./node_modules/@aemforms/af-core/lib/FormInstance.js"), exports);
__exportStar(__webpack_require__(/*! ./types/index */ "./node_modules/@aemforms/af-core/lib/types/index.js"), exports);
__exportStar(__webpack_require__(/*! ./controller/index */ "./node_modules/@aemforms/af-core/lib/controller/index.js"), exports);
__exportStar(__webpack_require__(/*! ./utils/TranslationUtils */ "./node_modules/@aemforms/af-core/lib/utils/TranslationUtils.js"), exports);
__exportStar(__webpack_require__(/*! ./utils/JsonUtils */ "./node_modules/@aemforms/af-core/lib/utils/JsonUtils.js"), exports);
__exportStar(__webpack_require__(/*! ./utils/SchemaUtils */ "./node_modules/@aemforms/af-core/lib/utils/SchemaUtils.js"), exports);
const FormUtils_1 = __webpack_require__(/*! ./utils/FormUtils */ "./node_modules/@aemforms/af-core/lib/utils/FormUtils.js");
Object.defineProperty(exports, "getFileSizeInBytes", ({ enumerable: true, get: function () { return FormUtils_1.getFileSizeInBytes; } }));
const BaseNode_1 = __webpack_require__(/*! ./BaseNode */ "./node_modules/@aemforms/af-core/lib/BaseNode.js");
Object.defineProperty(exports, "BaseNode", ({ enumerable: true, get: function () { return BaseNode_1.BaseNode; } }));
const Checkbox_1 = __importDefault(__webpack_require__(/*! ./Checkbox */ "./node_modules/@aemforms/af-core/lib/Checkbox.js"));
exports.Checkbox = Checkbox_1.default;
const CheckboxGroup_1 = __importDefault(__webpack_require__(/*! ./CheckboxGroup */ "./node_modules/@aemforms/af-core/lib/CheckboxGroup.js"));
exports.CheckboxGroup = CheckboxGroup_1.default;
const Container_1 = __importDefault(__webpack_require__(/*! ./Container */ "./node_modules/@aemforms/af-core/lib/Container.js"));
exports.Container = Container_1.default;
const Field_1 = __importDefault(__webpack_require__(/*! ./Field */ "./node_modules/@aemforms/af-core/lib/Field.js"));
exports.Field = Field_1.default;
const Fieldset_1 = __webpack_require__(/*! ./Fieldset */ "./node_modules/@aemforms/af-core/lib/Fieldset.js");
Object.defineProperty(exports, "Fieldset", ({ enumerable: true, get: function () { return Fieldset_1.Fieldset; } }));
const FileObject_1 = __webpack_require__(/*! ./FileObject */ "./node_modules/@aemforms/af-core/lib/FileObject.js");
Object.defineProperty(exports, "FileObject", ({ enumerable: true, get: function () { return FileObject_1.FileObject; } }));
const FileUpload_1 = __importDefault(__webpack_require__(/*! ./FileUpload */ "./node_modules/@aemforms/af-core/lib/FileUpload.js"));
exports.FileUpload = FileUpload_1.default;
const FormMetaData_1 = __importDefault(__webpack_require__(/*! ./FormMetaData */ "./node_modules/@aemforms/af-core/lib/FormMetaData.js"));
exports.FormMetaData = FormMetaData_1.default;
const Node_1 = __importDefault(__webpack_require__(/*! ./Node */ "./node_modules/@aemforms/af-core/lib/Node.js"));
exports.Node = Node_1.default;
const Scriptable_1 = __importDefault(__webpack_require__(/*! ./Scriptable */ "./node_modules/@aemforms/af-core/lib/Scriptable.js"));
exports.Scriptable = Scriptable_1.default;
const Form_1 = __importDefault(__webpack_require__(/*! ./Form */ "./node_modules/@aemforms/af-core/lib/Form.js"));
exports.Form = Form_1.default;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/rules/FunctionRuntime.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/rules/FunctionRuntime.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.submit = exports.request = void 0;
/**
 * Implementation of function runtime in rule engine
 */
const JsonUtils_1 = __webpack_require__(/*! ../utils/JsonUtils */ "./node_modules/@aemforms/af-core/lib/utils/JsonUtils.js");
const Controller_1 = __webpack_require__(/*! ../controller/Controller */ "./node_modules/@aemforms/af-core/lib/controller/Controller.js");
const Fetch_1 = __webpack_require__(/*! ../utils/Fetch */ "./node_modules/@aemforms/af-core/lib/utils/Fetch.js");
const FileObject_1 = __webpack_require__(/*! ../FileObject */ "./node_modules/@aemforms/af-core/lib/FileObject.js");
const FormUtils_1 = __webpack_require__(/*! ../utils/FormUtils */ "./node_modules/@aemforms/af-core/lib/utils/FormUtils.js");
/**
 * Implementation of generic request API. This API can be used to make external web request
 * @param context                   expression execution context(consists of current form, current field, current event)
 * @param uri                       request URI
 * @param httpVerb                  http verb (for example, GET or POST)
 * @param payload                   request payload
 * @param success                   success handler
 * @param error                     error handler
 * @param payloadContentType        content type of the request
 * @private
 */
const request = (context, uri, httpVerb, payload, success, error, payloadContentType = 'application/json') => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = uri;
    const requestOptions = {
        method: httpVerb
    };
    let result;
    let inputPayload;
    try {
        if (payload && payload instanceof FileObject_1.FileObject && payload.data instanceof File) {
            // todo: have to implement array type
            const formData = new FormData();
            formData.append(payload.name, payload.data);
            inputPayload = formData;
        }
        else if (payload && typeof payload === 'object' && Object.keys(payload).length > 0) {
            if (payloadContentType.length > 0) {
                requestOptions.headers = {
                    'Content-Type': payloadContentType // this should match content type of the payload
                };
            }
            inputPayload = JSON.stringify(payload);
        }
        result = yield (0, Fetch_1.request)(endpoint, inputPayload, requestOptions);
    }
    catch (e) {
        //todo: define error payload
        context.form.logger.error('Error invoking a rest API');
        context.form.dispatch(new Controller_1.CustomEvent(error, {}, true));
        return;
    }
    context.form.dispatch(new Controller_1.CustomEvent(success, result, true));
});
exports.request = request;
/**
 * Create multi part form data using form data and form attachments
 * @param data              form data
 * @param attachments       form events
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const multipartFormData = (data, attachments) => {
    const formData = new FormData();
    formData.append(':data', data);
    formData.append(':contentType', 'application/json');
    const transformAttachment = (objValue, formData) => {
        const newValue = {
            ':name': objValue.name,
            ':contentType': objValue.mediaType,
            ':data': objValue.data,
            ':bindRef': objValue.dataRef
        };
        if ((objValue === null || objValue === void 0 ? void 0 : objValue.data) instanceof File) {
            let attIdentifier = `${objValue === null || objValue === void 0 ? void 0 : objValue.dataRef}/${objValue === null || objValue === void 0 ? void 0 : objValue.name}`;
            if (!attIdentifier.startsWith('/')) {
                attIdentifier = `/${attIdentifier}`;
            }
            formData.append(attIdentifier, objValue.data);
            newValue[':data'] = `#${attIdentifier}`;
        }
        return newValue;
    };
    // @ts-ignore
    const submitAttachments = Object.keys(attachments).reduce((acc, curr) => {
        const objValue = attachments[curr];
        if (objValue && objValue instanceof Array) {
            return [...acc, ...objValue.map((x) => transformAttachment(x, formData))];
        }
        else {
            return [...acc, transformAttachment(objValue, formData)];
        }
    }, []);
    if ((submitAttachments === null || submitAttachments === void 0 ? void 0 : submitAttachments.length) > 0) {
        formData.append(':attachments', (0, JsonUtils_1.jsonString)(submitAttachments));
    }
    return formData;
};
const submit = (context, success, error, submitAs = 'json', input_data = null) => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = context.form.action;
    let data = input_data;
    if (typeof data != 'object' || data == null) {
        data = context.form.exportData();
    }
    // todo: have to implement sending of attachments here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const attachments = (0, FormUtils_1.getAttachments)(context.$form);
    let submitContentType = submitAs;
    //let formData: any;
    //if (Object.keys(attachments).length > 0) {
    //    multipartFormData(jsonString(data), attachments);
    //    submitContentType = 'multipart/form-data';
    //} else {
    const formData = { 'data': data };
    submitContentType = 'application/json';
    //}
    // note: don't send multipart/form-data let browser decide on the content type
    yield (0, exports.request)(context, endpoint, 'POST', formData, success, error, submitContentType);
});
exports.submit = submit;
/**
 * Helper function to create an action
 * @param name          name of the event
 * @param payload       event payload
 * @param dispatch      true to trigger the event on all the fields in DFS order starting from the top level form element, false otherwise
 * @private
 */
const createAction = (name, payload = {}) => {
    switch (name) {
        case 'change':
            return new Controller_1.Change(payload);
        case 'submit':
            return new Controller_1.Submit(payload);
        case 'click':
            return new Controller_1.Click(payload);
        case 'addItem':
            return new Controller_1.AddItem(payload);
        case 'removeItem':
            return new Controller_1.RemoveItem(payload);
        default:
            console.error('invalid action');
    }
};
/**
 * Implementation of function runtime
 * @private
 */
class FunctionRuntimeImpl {
    getFunctions() {
        // todo: remove these once json-formula exposes a way to call them from custom functions
        function isArray(obj) {
            if (obj !== null) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }
            return false;
        }
        function valueOf(a) {
            if (a === null || a === undefined) {
                return a;
            }
            if (isArray(a)) {
                return a.map(i => valueOf(i));
            }
            return a.valueOf();
        }
        function toString(a) {
            if (a === null || a === undefined) {
                return '';
            }
            return a.toString();
        }
        return {
            validate: {
                _func: (args, data, interpreter) => {
                    const element = args[0];
                    if (typeof element === 'string' || typeof element === 'undefined') {
                        return interpreter.globals.form.validate();
                    }
                    else {
                        return interpreter.globals.form.getElement(element.$id).validate();
                    }
                },
                _signature: []
            },
            getData: {
                _func: (args, data, interpreter) => {
                    return interpreter.globals.form.exportData();
                },
                _signature: []
            },
            submitForm: {
                _func: (args, data, interpreter) => {
                    // success: string, error: string, submit_as: 'json' | 'multipart' = 'json', data: any = null
                    const success = toString(args[0]);
                    const error = toString(args[1]);
                    const submit_as = args.length > 2 ? toString(args[2]) : 'json';
                    const submit_data = args.length > 3 ? valueOf(args[3]) : null;
                    interpreter.globals.form.dispatch(new Controller_1.Submit({
                        success,
                        error,
                        submit_as,
                        data: submit_data
                    }));
                    return {};
                },
                _signature: []
            },
            // todo: only supports application/json for now
            request: {
                _func: (args, data, interpreter) => {
                    const uri = toString(args[0]);
                    const httpVerb = toString(args[1]);
                    const payload = valueOf(args[2]);
                    const success = valueOf(args[3]);
                    const error = valueOf(args[4]);
                    (0, exports.request)(interpreter.globals, uri, httpVerb, payload, success, error, 'application/json');
                    return {};
                },
                _signature: []
            },
            dispatchEvent: {
                _func: (args, data, interpreter) => {
                    const element = args[0];
                    let eventName = valueOf(args[1]);
                    let payload = args.length > 2 ? valueOf(args[2]) : undefined;
                    let dispatch = false;
                    if (typeof element === 'string') {
                        payload = eventName;
                        eventName = element;
                        dispatch = true;
                    }
                    let event;
                    if (eventName.startsWith('custom:')) {
                        event = new Controller_1.CustomEvent(eventName.substring('custom:'.length), payload, dispatch);
                    }
                    else {
                        event = createAction(eventName, payload);
                    }
                    if (event != null) {
                        if (typeof element === 'string') {
                            interpreter.globals.form.dispatch(event);
                        }
                        else {
                            interpreter.globals.form.getElement(element.$id).dispatch(event);
                        }
                    }
                    return {};
                },
                _signature: []
            }
        };
    }
}
const FunctionRuntime = new FunctionRuntimeImpl();
exports["default"] = FunctionRuntime;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/rules/RuleEngine.js":
/*!****************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/rules/RuleEngine.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Controller_1 = __webpack_require__(/*! ../controller/Controller */ "./node_modules/@aemforms/af-core/lib/controller/Controller.js");
const json_formula_1 = __webpack_require__(/*! @adobe/json-formula */ "./node_modules/@adobe/json-formula/dist/index.js");
const FunctionRuntime_1 = __importDefault(__webpack_require__(/*! ./FunctionRuntime */ "./node_modules/@aemforms/af-core/lib/rules/FunctionRuntime.js"));
/**
 * Implementation of AddDependant event
 * @private
 */
class AddDependent extends Controller_1.ActionImpl {
    constructor(payload) {
        super(payload, 'addDependent');
    }
    payloadToJson() {
        return this.payload.getState();
    }
}
/**
 * Implementation of rule engine
 * @private
 */
class RuleEngine {
    constructor() {
        this._globalNames = [
            '$form',
            '$field',
            '$event'
        ];
    }
    compileRule(rule) {
        const customFunctions = FunctionRuntime_1.default.getFunctions();
        return new json_formula_1.Formula(rule, customFunctions, undefined, this._globalNames);
    }
    execute(node, data, globals, useValueOf = false) {
        const oldContext = this._context;
        this._context = globals;
        const res = node.search(data, globals);
        let finalRes = res;
        if (useValueOf) {
            if (typeof res === 'object' && res !== null) {
                finalRes = Object.getPrototypeOf(res).valueOf.call(res);
            }
        }
        this._context = oldContext;
        return finalRes;
    }
    /**
     * Listen to subscriber for
     * @param subscriber
     */
    trackDependency(subscriber) {
        if (this._context && this._context.field !== undefined && this._context.field !== subscriber) {
            subscriber.dispatch(new AddDependent(this._context.field));
        }
    }
}
exports["default"] = RuleEngine;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/types/Json.js":
/*!**********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/types/Json.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.constraintProps = exports.translationProps = void 0;
/** Constant for all properties which can be translated based on `adaptive form specification` */
exports.translationProps = ['description', 'placeholder', 'enum', 'enumNames'];
/** Constant for all properties which are constraints based on `adaptive form specification` */
exports.constraintProps = ['accept', 'enum', 'exclusiveMinimum', 'exclusiveMaximum',
    'format', 'maxFileSize', 'maxLength', 'maximum', 'maxItems',
    'minLength', 'minimum', 'minItems', 'pattern', 'required', 'step', 'validationExpression', 'enumNames'];


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/types/Model.js":
/*!***********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/types/Model.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationError = void 0;
/**
 * Implementation of {@link IValidationError | Validation Error} interface
 */
class ValidationError {
    constructor(fieldName = '', errorMessages = []) {
        this.errorMessages = errorMessages;
        this.fieldName = fieldName;
    }
}
exports.ValidationError = ValidationError;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/types/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/types/index.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./Json */ "./node_modules/@aemforms/af-core/lib/types/Json.js"), exports);
__exportStar(__webpack_require__(/*! ./Model */ "./node_modules/@aemforms/af-core/lib/types/Model.js"), exports);


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/utils/DataRefParser.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/utils/DataRefParser.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolveData = exports.tokenize = exports.global$ = exports.bracket = exports.identifier = exports.TOK_GLOBAL = void 0;
/**
 * Defines utilities to parse form data
 */
const DataGroup_1 = __importDefault(__webpack_require__(/*! ../data/DataGroup */ "./node_modules/@aemforms/af-core/lib/data/DataGroup.js"));
const TOK_DOT = 'DOT';
const TOK_IDENTIFIER = 'Identifier';
exports.TOK_GLOBAL = 'Global';
const TOK_BRACKET = 'bracket';
const TOK_NUMBER = 'Number';
const globalStartToken = '$';
const identifier = (value, start) => {
    return {
        type: TOK_IDENTIFIER,
        value,
        start
    };
};
exports.identifier = identifier;
const bracket = (value, start) => {
    return {
        type: TOK_BRACKET,
        value,
        start
    };
};
exports.bracket = bracket;
const global$ = () => {
    return {
        type: exports.TOK_GLOBAL,
        start: 0,
        value: globalStartToken
    };
};
exports.global$ = global$;
const isAlphaNum = function (ch) {
    return (ch >= 'a' && ch <= 'z')
        || (ch >= 'A' && ch <= 'Z')
        || (ch >= '0' && ch <= '9')
        || ch === '_';
};
const isGlobal = (prev, stream, pos) => {
    // global tokens occur only at the start of an expression
    return prev === null && stream[pos] === globalStartToken;
};
const isIdentifier = (stream, pos) => {
    const ch = stream[pos];
    // $ is special -- it's allowed to be part of an identifier if it's the first character
    if (ch === '$') {
        return stream.length > pos && isAlphaNum(stream[pos + 1]);
    }
    // return whether character 'isAlpha'
    return (ch >= 'a' && ch <= 'z')
        || (ch >= 'A' && ch <= 'Z')
        || ch === '_';
};
const isNum = (ch) => {
    return (ch >= '0' && ch <= '9');
};
class Tokenizer {
    constructor(stream) {
        this.stream = stream;
        this._tokens = [];
        this._result_tokens = [];
        this._current = 0;
    }
    _consumeGlobal() {
        this._current += 1;
        return (0, exports.global$)();
    }
    _consumeUnquotedIdentifier(stream) {
        const start = this._current;
        this._current += 1;
        while (this._current < stream.length && isAlphaNum(stream[this._current])) {
            this._current += 1;
        }
        return (0, exports.identifier)(stream.slice(start, this._current), start);
    }
    _consumeQuotedIdentifier(stream) {
        const start = this._current;
        this._current += 1;
        const maxLength = stream.length;
        while (stream[this._current] !== '"' && this._current < maxLength) {
            // You can escape a double quote and you can escape an escape.
            let current = this._current;
            if (stream[current] === '\\' && (stream[current + 1] === '\\'
                || stream[current + 1] === '"')) {
                current += 2;
            }
            else {
                current += 1;
            }
            this._current = current;
        }
        this._current += 1;
        return (0, exports.identifier)(JSON.parse(stream.slice(start, this._current)), start);
    }
    _consumeNumber(stream) {
        const start = this._current;
        this._current += 1;
        const maxLength = stream.length;
        while (isNum(stream[this._current]) && this._current < maxLength) {
            this._current += 1;
        }
        const n = stream.slice(start, this._current);
        const value = parseInt(n, 10);
        return { type: TOK_NUMBER, value, start };
    }
    _consumeBracket(stream) {
        const start = this._current;
        this._current += 1;
        let value;
        if (isNum(stream[this._current])) {
            value = this._consumeNumber(stream).value;
        }
        else {
            throw new Error(`unexpected exception at position ${this._current}. Must be a character`);
        }
        if (this._current < this.stream.length && stream[this._current] !== ']') {
            throw new Error(`unexpected exception at position ${this._current}. Must be a character`);
        }
        this._current++;
        return (0, exports.bracket)(value, start);
    }
    tokenize() {
        const stream = this.stream;
        while (this._current < stream.length) {
            const prev = this._tokens.length ? this._tokens.slice(-1)[0] : null;
            if (isGlobal(prev, stream, this._current)) {
                const token = this._consumeGlobal();
                this._tokens.push(token);
                this._result_tokens.push(token);
            }
            else if (isIdentifier(stream, this._current)) {
                const token = this._consumeUnquotedIdentifier(stream);
                this._tokens.push(token);
                this._result_tokens.push(token);
            }
            else if (stream[this._current] === '.' && prev != null && prev.type !== TOK_DOT) {
                this._tokens.push({
                    type: TOK_DOT,
                    value: '.',
                    start: this._current
                });
                this._current += 1;
            }
            else if (stream[this._current] === '[') {
                // No need to increment this._current.  This happens
                // in _consumeLBracket
                const token = this._consumeBracket(stream);
                this._tokens.push(token);
                this._result_tokens.push(token);
            }
            else if (stream[this._current] === '"') {
                const token = this._consumeQuotedIdentifier(stream);
                this._tokens.push(token);
                this._result_tokens.push(token);
            }
            else {
                const p = Math.max(0, this._current - 2);
                const s = Math.min(this.stream.length, this._current + 2);
                throw new Error(`Exception at parsing stream ${this.stream.slice(p, s)}`);
            }
        }
        return this._result_tokens;
    }
}
const tokenize = (stream) => {
    return new Tokenizer(stream).tokenize();
};
exports.tokenize = tokenize;
const resolveData = (data, input, create) => {
    let tokens;
    if (typeof input === 'string') {
        tokens = (0, exports.tokenize)(input);
    }
    else {
        tokens = input;
    }
    let result = data;
    let i = 0;
    const createIntermediateNode = (token, nextToken, create) => {
        return nextToken === null ? create :
            (nextToken.type === TOK_BRACKET) ? new DataGroup_1.default(token.value, [], 'array') :
                new DataGroup_1.default(token.value, {});
    };
    while (i < tokens.length && result != null) {
        const token = tokens[i];
        if (token.type === exports.TOK_GLOBAL) {
            result = data;
        }
        else if (token.type === TOK_IDENTIFIER) {
            if (result instanceof DataGroup_1.default && result.$type === 'object') {
                //@ts-ignore
                if (result.$containsDataNode(token.value) && result.$getDataNode(token.value).$value !== null) {
                    result = result.$getDataNode(token.value);
                }
                else if (create) {
                    const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;
                    const toCreate = createIntermediateNode(token, nextToken, create);
                    result.$addDataNode(token.value, toCreate);
                    result = toCreate;
                }
                else {
                    result = undefined;
                }
            }
            else {
                throw new Error(`Looking for ${token.value} in ${result.$value}`);
            }
        }
        else if (token.type === TOK_BRACKET) {
            if (result instanceof DataGroup_1.default && result.$type === 'array') {
                const index = token.value;
                if (index < result.$length) {
                    //@ts-ignore
                    result = result.$getDataNode(index);
                }
                else if (create) {
                    const nextToken = i < tokens.length - 1 ? tokens[i + 1] : null;
                    const toCreate = createIntermediateNode(token, nextToken, create);
                    result.$addDataNode(index, toCreate);
                    result = toCreate;
                }
                else {
                    result = undefined;
                }
            }
            else {
                throw new Error(`Looking for index ${token.value} in non array${result.$value}`);
            }
        }
        i += 1;
    }
    return result;
};
exports.resolveData = resolveData;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/utils/Fetch.js":
/*!***********************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/utils/Fetch.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.request = void 0;
const request = (url, data = null, options = {}) => {
    const opts = Object.assign(Object.assign({}, defaultRequestOptions), options);
    return fetch(url, Object.assign(Object.assign({}, opts), { body: data })).then((response) => {
        var _a;
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        if ((_a = response === null || response === void 0 ? void 0 : response.headers.get('Content-Type')) === null || _a === void 0 ? void 0 : _a.includes('application/json')) {
            return response.json();
        }
        else {
            return response.text();
        }
    });
};
exports.request = request;
const defaultRequestOptions = {
    method: 'GET'
};


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/utils/FormUtils.js":
/*!***************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/utils/FormUtils.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dataURItoBlob = exports.IdGenerator = exports.sizeToBytes = exports.getFileSizeInBytes = exports.getAttachments = exports.isEmpty = exports.randomWord = void 0;
/**
 * Defines generic utilities to interact with form runtime model
 */
const JsonUtils_1 = __webpack_require__(/*! ./JsonUtils */ "./node_modules/@aemforms/af-core/lib/utils/JsonUtils.js");
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'.split('');
const fileSizeRegex = /^(\d*\.?\d+)(\\?(?=[KMGT])([KMGT])(?:i?B)?|B?)$/i;
/**
 * Utility to generate a random word from seed
 * @param l seed value
 * @returns random word
 */
const randomWord = (l) => {
    const ret = [];
    for (let i = 0; i <= l; i++) {
        const randIndex = Math.floor(Math.random() * (chars.length));
        ret.push(chars[randIndex]);
    }
    return ret.join('');
};
exports.randomWord = randomWord;
/**
 * Utility to check if the value is empty
 * @param value value
 * @returns `true` if value is empty, `false` otherwise
 */
const isEmpty = (value) => {
    return value === '' || value === null || value === undefined;
};
exports.isEmpty = isEmpty;
/**
 * @param input
 * @private
 */
const getAttachments = (input) => {
    const items = input.items || [];
    return items === null || items === void 0 ? void 0 : items.reduce((acc, item) => {
        let ret = null;
        if (item.isContainer) {
            ret = (0, exports.getAttachments)(item);
        }
        else {
            if ((0, JsonUtils_1.isFile)(item.getState())) {
                ret = {}; // @ts-ignore
                const name = item.name || '';
                const dataRef = (item.dataRef != null)
                    ? item.dataRef
                    : (name.length > 0 ? item.name : undefined);
                //@ts-ignore
                if (item.value instanceof Array) {
                    // @ts-ignore
                    ret[item.id] = item.value.map((x) => {
                        return Object.assign(Object.assign({}, x), { 'dataRef': dataRef });
                    });
                }
                else if (item.value != null) {
                    // @ts-ignore
                    ret[item.id] = Object.assign(Object.assign({}, item.value), { 'dataRef': dataRef });
                }
            }
        }
        return Object.assign(acc, ret);
    }, {});
};
exports.getAttachments = getAttachments;
/**
 * Converts file size in string to bytes based on IEC specification
 * @param str   file size
 * @returns file size as bytes (in kb) based on IEC specification
 */
const getFileSizeInBytes = (str) => {
    let retVal = 0;
    if (typeof str === 'string') {
        const matches = fileSizeRegex.exec(str.trim());
        if (matches != null) {
            retVal = (0, exports.sizeToBytes)(parseFloat(matches[1]), (matches[2] || 'kb').toUpperCase());
        }
    }
    return retVal;
};
exports.getFileSizeInBytes = getFileSizeInBytes;
/**
 * Converts number to bytes based on the symbol as per IEC specification
 * @param size      size as number
 * @param symbol    symbol to use (for example, kb, mb, gb or tb)
 * @returns number as bytes based on the symbol
 */
const sizeToBytes = (size, symbol) => {
    const sizes = { 'KB': 1, 'MB': 2, 'GB': 3, 'TB': 4 };
    // @ts-ignore
    const i = Math.pow(1024, sizes[symbol]);
    return Math.round(size * i);
};
exports.sizeToBytes = sizeToBytes;
/**
 * ID Generator
 * @param initial
 * @constructor
 * @private
 */
const IdGenerator = function* (initial = 50) {
    const initialize = function () {
        const arr = [];
        for (let i = 0; i < initial; i++) {
            arr.push((0, exports.randomWord)(10));
        }
        return arr;
    };
    const passedIds = {};
    let ids = initialize();
    do {
        let x = ids.pop();
        while (x in passedIds) {
            if (ids.length === 0) {
                ids = initialize();
            }
            x = ids.pop();
        }
        passedIds[x] = true;
        yield ids.pop();
        if (ids.length === 0) {
            ids = initialize();
        }
    } while (ids.length > 0);
};
exports.IdGenerator = IdGenerator;
/**
 * Utility to convert data URI to a `blob` object
 * @param dataURI uri to convert to blob
 * @returns `Blob` object for the data URI
 */
const dataURItoBlob = (dataURI) => {
    // Split metadata from data
    const splitted = dataURI.split(',');
    // Split params
    const params = splitted[0].split(';');
    // Get mime-type from params
    const type = params[0].replace('data:', '');
    // Filter the name property from params
    const properties = params.filter(param => {
        return param.split('=')[0] === 'name';
    });
    // Look for the name and use unknown if no name property.
    let name;
    if (properties.length !== 1) {
        name = 'unknown';
    }
    else {
        // Because we filtered out the other property,
        // we only have the name case here.
        name = properties[0].split('=')[1];
    }
    // Built the Uint8Array Blob parameter from the base64 string.
    const binary = atob(splitted[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    // Create the blob object
    const blob = new window.Blob([new Uint8Array(array)], { type });
    return { blob, name };
};
exports.dataURItoBlob = dataURItoBlob;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/utils/JsonUtils.js":
/*!***************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/utils/JsonUtils.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jsonString = exports.checkIfKeyAdded = exports.deepClone = exports.isCheckboxGroup = exports.isCheckbox = exports.checkIfConstraintsArePresent = exports.isFile = exports.getProperty = void 0;
/**
 * Defines generic utilities to interact with form model definition which is represented as json
 */
const types_1 = __webpack_require__(/*! ../types */ "./node_modules/@aemforms/af-core/lib/types/index.js");
const SchemaUtils_1 = __webpack_require__(/*! ./SchemaUtils */ "./node_modules/@aemforms/af-core/lib/utils/SchemaUtils.js");
/**
 * Get the property value form the json
 * @param data      object as json
 * @param key       name of the key
 * @param def       default value
 * @typeParam P     type for the default value
 */
const getProperty = (data, key, def) => {
    if (key in data) {
        return data[key];
    }
    else if (!key.startsWith(':')) {
        const prefixedKey = `:${key}`;
        if (prefixedKey in data) {
            return data[prefixedKey];
        }
    }
    return def;
};
exports.getProperty = getProperty;
/**
 * Checks if the input item provided is a form file attachment field
 * @param item  input item it could be {@link FieldsetJson | Fieldset} or {@link FieldJson | Field}
 * @returns `true` if `item` is a form file attachment, `false` otherwise
 */
const isFile = function (item) {
    return ((item === null || item === void 0 ? void 0 : item.type) === 'file' || (item === null || item === void 0 ? void 0 : item.type) === 'file[]') ||
        (((item === null || item === void 0 ? void 0 : item.type) === 'string' || (item === null || item === void 0 ? void 0 : item.type) === 'string[]') &&
            ((item === null || item === void 0 ? void 0 : item.format) === 'binary' || (item === null || item === void 0 ? void 0 : item.format) === 'data-url'));
};
exports.isFile = isFile;
/**
 * Utility to check if the given form field has any data constraints
 * @param item form field to check
 * @returns `true` if `item` has data constraints, `false` otherwise
 */
const checkIfConstraintsArePresent = function (item) {
    // @ts-ignore
    return types_1.constraintProps.some(cp => item[cp] !== undefined);
};
exports.checkIfConstraintsArePresent = checkIfConstraintsArePresent;
/**
 * Checks if the input item provided is a form check box field
 * @param item  input item it could be {@link FieldsetJson | Fieldset} or {@link FieldJson | Field}
 * @returns `true` if `item` is a form check box, `false` otherwise
 */
const isCheckbox = function (item) {
    const fieldType = (item === null || item === void 0 ? void 0 : item.fieldType) || (0, SchemaUtils_1.defaultFieldTypes)(item);
    return fieldType === 'checkbox';
};
exports.isCheckbox = isCheckbox;
/**
 * Checks if the input item provided is a form check box group field
 * @param item  input item it could be {@link FieldsetJson | Fieldset} or {@link FieldJson | Field}
 * @returns `true` if `item` is a form check box group, `false` otherwise
 */
const isCheckboxGroup = function (item) {
    const fieldType = (item === null || item === void 0 ? void 0 : item.fieldType) || (0, SchemaUtils_1.defaultFieldTypes)(item);
    return fieldType === 'checkbox-group';
};
exports.isCheckboxGroup = isCheckboxGroup;
/**
 * Clones an object completely including any nested objects or arrays
 * @param obj
 * @private
 */
function deepClone(obj) {
    let result;
    if (obj instanceof Array) {
        result = [];
        result = obj.map(x => deepClone(x));
    }
    else if (typeof obj === 'object' && obj !== null) {
        result = {};
        Object.entries(obj).forEach(([key, value]) => {
            result[key] = deepClone(value);
        });
    }
    else {
        result = obj;
    }
    return result;
}
exports.deepClone = deepClone;
/**
 * Checks if the key got added in current object
 * @param currentObj
 * @param prevObj
 * @param objKey
 */
function checkIfKeyAdded(currentObj, prevObj, objKey) {
    if (currentObj != null && prevObj != null) {
        // add the new key
        const newPrvObj = Object.assign({}, prevObj);
        newPrvObj[objKey] = currentObj[objKey];
        // do compare using json stringify
        const newJsonStr = (0, exports.jsonString)(currentObj).replace((0, exports.jsonString)(newPrvObj), '');
        return newJsonStr === '';
    }
    else {
        return false;
    }
}
exports.checkIfKeyAdded = checkIfKeyAdded;
/**
 * Prettifies obj as json string
 * @param obj object to prettify
 * @return json string
 */
const jsonString = (obj) => {
    return JSON.stringify(obj, null, 2);
};
exports.jsonString = jsonString;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/utils/SchemaUtils.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/utils/SchemaUtils.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.exportDataSchema = exports.defaultFieldTypes = void 0;
// const primitives = ['string', 'boolean', 'number'];
// const containers = ['object', 'array', 'number'];
const objToMap = (o) => new Map(Object.entries(o));
const stringViewTypes = objToMap({ 'date': 'date-input', 'data-url': 'file-input', 'binary': 'file-input' });
const typeToViewTypes = objToMap({
    'number': 'number-input',
    'boolean': 'checkbox',
    'object': 'panel',
    'array': 'panel',
    'file': 'file-input',
    'file[]': 'file-input'
});
const arrayTypes = ['string[]', 'boolean[]', 'number[]', 'array'];
/**
 * Returns the default view type for a given form field object based on `adaptive form specification`
 * @param schema    schema item for which default view type is to found
 * @returns default view type
 */
const defaultFieldTypes = (schema) => {
    const type = schema.type || 'string';
    if ('enum' in schema) {
        const enums = schema.enum;
        if (enums.length > 2 || arrayTypes.indexOf(type) > -1) {
            return 'drop-down';
        }
        else {
            return 'checkbox';
        }
    }
    if (type === 'string' || type === 'string[]') {
        return stringViewTypes.get(schema.format) || 'text-input';
    }
    return typeToViewTypes.get(type) || 'text-input';
};
exports.defaultFieldTypes = defaultFieldTypes;
const fieldSchema = (input) => {
    var _a;
    if ('items' in input) {
        const fieldset = input;
        const items = fieldset.items;
        if (fieldset.type === 'array') {
            return {
                type: 'array',
                items: fieldSchema(items[0]),
                minItems: fieldset === null || fieldset === void 0 ? void 0 : fieldset.minItems,
                maxItems: fieldset === null || fieldset === void 0 ? void 0 : fieldset.maxItems
            };
        }
        else {
            const iter = items.filter(x => x.name != null);
            return {
                type: 'object',
                properties: Object.fromEntries(iter.map(item => [item.name, fieldSchema(item)])),
                required: iter.filter(x => x.required).map(x => x.name)
            };
        }
    }
    else {
        const field = input;
        const schemaProps = ['type', 'maxLength', 'minLength', 'minimum', 'maximum', 'format', 'pattern', 'step', 'enum'];
        const schema = schemaProps.reduce((acc, prop) => {
            const p = prop;
            if (prop in field && field[p] != undefined) {
                acc[prop] = field[p];
            }
            return acc;
        }, {});
        if (field.dataRef === 'none' || Object.keys(schema).length == 0) {
            return undefined;
        }
        return Object.assign({ title: (_a = field.label) === null || _a === void 0 ? void 0 : _a.value, description: field.description }, schema);
    }
};
/**
 * Creates a json schema from form model definition
 * @param form {@link FormJson | form model definition}
 * @returns json schema of form model definition
 */
const exportDataSchema = (form) => {
    return fieldSchema(form);
};
exports.exportDataSchema = exportDataSchema;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/utils/TranslationUtils.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/utils/TranslationUtils.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createTranslationObject = exports.createTranslationObj = exports.addTranslationId = exports.invalidateTranslation = exports.CUSTOM_PROPS_KEY = exports.TRANSLATION_ID = exports.TRANSLATION_TOKEN = void 0;
/**
 * Defines generic utilities to translated form model definition
 */
// todo: The API's defined in this file could move to a different package later on
const types_1 = __webpack_require__(/*! ../types */ "./node_modules/@aemforms/af-core/lib/types/index.js");
/** Token used while creating translation specific properties from `adaptive form specification` */
exports.TRANSLATION_TOKEN = '##';
/** Name of the object which holds all translation specific properties */
exports.TRANSLATION_ID = 'afs:translationIds';
exports.CUSTOM_PROPS_KEY = 'properties';
const defaultBcp47LangTags = [
    'de-DE',
    'en-US',
    'es-ES',
    'fr-FR',
    'it-IT',
    'ja-JP',
    'ko-KR',
    'pt-BR',
    'zh-CN',
    'zh-TW'
];
/**
 * @private
 */
const invalidateTranslation = (input, updates) => {
    types_1.translationProps.forEach((prop) => {
        var _a, _b, _c, _d;
        if (prop in updates && ((_b = (_a = input === null || input === void 0 ? void 0 : input[exports.CUSTOM_PROPS_KEY]) === null || _a === void 0 ? void 0 : _a[exports.TRANSLATION_ID]) === null || _b === void 0 ? void 0 : _b[prop])) {
            (_d = (_c = input === null || input === void 0 ? void 0 : input[exports.CUSTOM_PROPS_KEY]) === null || _c === void 0 ? void 0 : _c[exports.TRANSLATION_ID]) === null || _d === void 0 ? true : delete _d[prop];
        }
    });
};
exports.invalidateTranslation = invalidateTranslation;
/**
 * @private
 */
const addTranslationId = (input, additionalTranslationProps = []) => {
    // don't create a schema copy, add it to the existing
    const model = input;
    const transProps = [...types_1.translationProps, ...additionalTranslationProps];
    _createTranslationId(model, '', transProps);
    return model;
};
exports.addTranslationId = addTranslationId;
/**
 * @private
 */
const _createTranslationId = (input, path, transProps) => {
    Object.entries(input).forEach(([key, value]) => {
        if (typeof value == 'object') {
            _createTranslationId(value, ((key === 'items') ? path : `${path === '' ? path : path + exports.TRANSLATION_TOKEN}${key}${exports.TRANSLATION_TOKEN}${Math.floor(Math.random() * 10000) + 1}`), transProps);
        }
        else {
            // set it only if either of type or fieldType properties is present
            if ('type' in input ||
                'fieldType' in input) {
                for (const transProp of transProps) {
                    // if property exist add it
                    if (input[transProp] != null) {
                        // if translation id is not yet set, set it
                        if (!(exports.CUSTOM_PROPS_KEY in input)) {
                            input[exports.CUSTOM_PROPS_KEY] = {};
                        }
                        if (!(exports.TRANSLATION_ID in input[exports.CUSTOM_PROPS_KEY])) {
                            input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID] = {};
                        }
                        // if transprop is not yet set, set it
                        // this is done to prevent overwrite
                        if (!(transProp in input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID])) {
                            input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID][transProp] = `${path}${exports.TRANSLATION_TOKEN}${transProp}${exports.TRANSLATION_TOKEN}${Math.floor(Math.random() * 10000) + 1}`;
                        }
                    }
                }
            }
        }
    });
};
/**
 * @param input
 * @param translationObj
 * @param translationProps
 * @private
 */
const _createTranslationObj = (input, translationObj, translationProps) => {
    Object.values(input).forEach((value) => {
        var _a, _b;
        if (typeof value == 'object') {
            _createTranslationObj(value, translationObj, translationProps);
        }
        else {
            for (const translationProp of translationProps) {
                if (translationProp in input && ((_b = (_a = input === null || input === void 0 ? void 0 : input[exports.CUSTOM_PROPS_KEY]) === null || _a === void 0 ? void 0 : _a[exports.TRANSLATION_ID]) === null || _b === void 0 ? void 0 : _b[translationProp])) {
                    // todo: right now we create only for english
                    if (input[translationProp] instanceof Array) {
                        input[translationProp].forEach((item, index) => {
                            if (typeof item === 'string') { // only if string, then convert, since values can also be boolean
                                // @ts-ignore
                                translationObj[`${input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID][translationProp]}${exports.TRANSLATION_TOKEN}${index}`] = item;
                            }
                        });
                    }
                    else {
                        // @ts-ignore
                        translationObj[`${input[exports.CUSTOM_PROPS_KEY][exports.TRANSLATION_ID][translationProp]}`] = input[translationProp];
                    }
                }
            }
        }
    });
};
/**
 * @param input
 * @param additionalTranslationProps
 * @private
 */
const createTranslationObj = (input, additionalTranslationProps = []) => {
    const obj = {};
    const transProps = [...types_1.translationProps, ...additionalTranslationProps];
    _createTranslationObj(input, obj, transProps);
    return obj;
};
exports.createTranslationObj = createTranslationObj;
/**
 * Creates translation object with [BCP 47](https://tools.ietf.org/search/bcp47) language tags as key and value is a translation object. Key of translation object is
 * generated based on the form hierarchy and it is separated by "##" token to signify that the id is machine generated (ie its not a human generated string)
 * @param input             form model definition
 * @param additionalTranslationProps    optional properties which needs to be translated, by default, only OOTB properties of form model definition is translated
 * @param bcp47LangTags     optional additional language tags
 * @returns translation object for each bcp 47 language tag
 */
const createTranslationObject = (input, additionalTranslationProps = [], bcp47LangTags = []) => {
    const transProps = [...types_1.translationProps, ...additionalTranslationProps];
    // create a copy of the input
    const inputCopy = JSON.parse(JSON.stringify(input));
    const obj = (0, exports.createTranslationObj)((0, exports.addTranslationId)(inputCopy), transProps);
    const langTags = [...defaultBcp47LangTags, ...bcp47LangTags];
    const allLangs = {};
    for (const langTag of langTags) {
        // todo: added temporarily to test
        // todo: need to fix this as per machine translation
        allLangs[langTag] = JSON.parse(JSON.stringify(obj));
    }
    return [inputCopy, allLangs];
};
exports.createTranslationObject = createTranslationObject;


/***/ }),

/***/ "./node_modules/@aemforms/af-core/lib/utils/ValidationUtils.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@aemforms/af-core/lib/utils/ValidationUtils.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*
 * Copyright 2022 Adobe, Inc.
 *
 * Your access and use of this software is governed by the Adobe Customer Feedback Program Terms and Conditions or other Beta License Agreement signed by your employer and Adobe, Inc.. This software is NOT open source and may not be used without one of the foregoing licenses. Even with a foregoing license, your access and use of this file is limited to the earlier of (a) 180 days, (b) general availability of the product(s) which utilize this software (i.e. AEM Forms), (c) January 1, 2023, (d) Adobe providing notice to you that you may no longer use the software or that your beta trial has otherwise ended.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL ADOBE NOR ITS THIRD PARTY PROVIDERS AND PARTNERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Constraints = exports.ValidConstraints = exports.isDataUrl = void 0;
/**
 * Defines generic utilities to validate form runtime model based on the constraints defined
 * as per `adaptive form specification`
 */
// issue with import
//import {FieldJson, isFileObject} from '../types';
const dateRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const dataUrlRegex = /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/;
const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const daysInMonth = (leapYear, month) => {
    if (leapYear && month == 2) {
        return 29;
    }
    return days[month - 1];
};
const isLeapYear = (year) => {
    return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
};
const isDataUrl = (str) => {
    return dataUrlRegex.exec(str.trim()) != null;
};
exports.isDataUrl = isDataUrl;
/**
 * Checks whether inputVal is valid number value or not
 *
 * ```
 * const x = checkNumber('12')
 * ```
 * would return
 * ```
 * {
 *     value : 12,
 *     valid : true
 * }
 * ```
 * @param inputVal input value
 * @returns {@link ValidationResult | Validation result}
 */
const checkNumber = (inputVal) => {
    let value = parseFloat(inputVal);
    const valid = !isNaN(value);
    if (!valid) {
        value = inputVal;
    }
    return {
        value, valid
    };
};
/**
 * Wraps a non-null value and not an array value into an array
 * @param inputVal input value
 * @returns wraps the input value into an array
 */
const toArray = (inputVal) => {
    if (inputVal != null && !(inputVal instanceof Array)) {
        return [inputVal];
    }
    return inputVal;
};
/**
 * Checks whether inputVal is valid boolean value or not
 *
 * ```
 * const x = checkBool('false')
 * ```
 * would return
 * ```
 * {
 *     value : false,
 *     valid : true
 * }
 * ```
 * @param inputVal input value
 * @returns {@link ValidationResult | Validation result}
 */
const checkBool = (inputVal) => {
    const valid = typeof inputVal === 'boolean' || inputVal === 'true' || inputVal === 'false';
    const value = typeof inputVal === 'boolean' ? inputVal : (valid ? inputVal === 'true' : inputVal);
    return { valid, value };
};
/**
 * Validates an array of values using a validator function.
 * @param inputVal
 * @param validatorFn
 * @return an array containing two arrays, the first one with all the valid values and the second one with one invalid
 * value (if there is).
 */
const partitionArray = (inputVal, validatorFn) => {
    const value = toArray(inputVal);
    if (value == null) {
        return [[], [value]];
    }
    return value.reduce((acc, x) => {
        if (acc[1].length == 0) {
            const r = validatorFn(x);
            const index = r.valid ? 0 : 1;
            acc[index].push(r.value);
        }
        return acc;
    }, [[], []]);
};
exports.ValidConstraints = {
    date: ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum', 'format'],
    string: ['minLength', 'maxLength', 'pattern'],
    number: ['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum'],
    array: ['minItems', 'maxItems', 'uniqueItems'],
    file: ['accept', 'maxFileSize']
};
/**
 * Implementation of all constraints defined by `adaptive form specification`
 */
exports.Constraints = {
    /**
     * Implementation of type constraint
     * @param constraint    `type` property of the form object
     * @param inputVal      value of the form object
     * @return {@link ValidationResult | validation result}
     */
    type: (constraint, inputVal) => {
        let value = inputVal;
        if (inputVal == undefined) {
            return {
                valid: true,
                value: inputVal
            };
        }
        let valid = true, res;
        switch (constraint) {
            case 'string':
                valid = true;
                value = inputVal.toString();
                break;
            case 'string[]':
                value = toArray(inputVal);
                break;
            case 'number':
                res = checkNumber(inputVal);
                value = res.value;
                valid = res.valid;
                break;
            case 'boolean':
                res = checkBool(inputVal);
                valid = res.valid;
                value = res.value;
                break;
            case 'integer':
                value = parseFloat(inputVal);
                valid = !isNaN(value) && Math.round(value) === value;
                if (!valid) {
                    value = inputVal;
                }
                break;
            case 'file' || 0:
                valid = true;
                //valid = isFileObject(value);
                if (!valid) {
                    value = inputVal;
                }
                break;
            case 'number[]':
                res = partitionArray(inputVal, checkNumber);
                valid = res[1].length === 0;
                value = valid ? res[0] : inputVal;
                break;
            case 'boolean[]':
                res = partitionArray(inputVal, checkBool);
                valid = res[1].length === 0;
                value = valid ? res[0] : inputVal;
                break;
        }
        return {
            valid,
            value
        };
    },
    /**
     * Implementation of format constraint
     * @param constraint    `format` property of the form object
     * @param input         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    format: (constraint, input) => {
        let valid = true;
        const value = input;
        let res;
        switch (constraint) {
            case 'date':
                res = dateRegex.exec(input.trim());
                if (res != null) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [match, year, month, date] = res;
                    const [nMonth, nDate] = [+month, +date];
                    const leapYear = isLeapYear(+year);
                    valid = (nMonth >= 1 && nMonth <= 12) &&
                        (nDate >= 1 && nDate <= daysInMonth(leapYear, nMonth));
                }
                else {
                    valid = false;
                }
                break;
            case 'data-url':
                // todo: input is of type file, do we need this format ? since value is always of type file object
                //res = dataUrlRegex.exec(input.trim());
                //valid = res != null;
                valid = true;
                break;
        }
        return { valid, value };
    },
    //todo : add support for date
    /**
     * Implementation of minimum constraint
     * @param constraint    `minimum` property of the form object
     * @param value         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    minimum: (constraint, value) => {
        return { valid: value >= constraint, value };
    },
    //todo : add support for date
    /**
     * Implementation of maximum constraint
     * @param constraint    `maximum` property of the form object
     * @param value         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    maximum: (constraint, value) => {
        return { valid: value <= constraint, value };
    },
    /**
     * Implementation of exclusiveMinimum constraint
     * @param constraint    `minimum` property of the form object
     * @param value         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    exclusiveMinimum: (constraint, value) => {
        return { valid: value > constraint, value };
    },
    //todo : add support for date
    /**
     * Implementation of exclusiveMaximum constraint
     * @param constraint    `maximum` property of the form object
     * @param value         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    exclusiveMaximum: (constraint, value) => {
        return { valid: value < constraint, value };
    },
    /**
     * Implementation of the minItems constraint
     * @param constraint `minItems` constraint from object
     * @param value value of the form object
     */
    minItems: (constraint, value) => {
        return { valid: (value instanceof Array) && value.length >= constraint, value };
    },
    /**
     * Implementation of the maxItems constraint
     * @param constraint `maxItems` constraint from object
     * @param value value of the form object
     */
    maxItems: (constraint, value) => {
        return { valid: (value instanceof Array) && value.length <= constraint, value };
    },
    /**
     * Implementation of the uniqueItems constraint
     * @param constraint `uniqueItems` constraint from object
     * @param value value of the form object
     */
    uniqueItems: (constraint, value) => {
        return { valid: !constraint || ((value instanceof Array) && value.length === new Set(value).size), value };
    },
    /**
     * Implementation of minLength constraint
     * @param constraint    `minLength` property of the form object
     * @param value         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    minLength: (constraint, value) => {
        return Object.assign(Object.assign({}, exports.Constraints.minimum(constraint, typeof value === 'string' ? value.length : 0)), { value });
    },
    /**
     * Implementation of maxLength constraint
     * @param constraint    `maxLength` property of the form object
     * @param value         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    maxLength: (constraint, value) => {
        return Object.assign(Object.assign({}, exports.Constraints.maximum(constraint, typeof value === 'string' ? value.length : 0)), { value });
    },
    /**
     * Implementation of pattern constraint
     * @param constraint    `pattern` property of the form object
     * @param value         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    pattern: (constraint, value) => {
        let regex;
        if (typeof constraint === 'string') {
            regex = new RegExp(constraint);
        }
        else {
            regex = constraint;
        }
        return { valid: regex.test(value), value };
    },
    /**
     * Implementation of required constraint
     * @param constraint    `required` property of the form object
     * @param value         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    required: (constraint, value) => {
        const valid = constraint ? value != null && value !== '' : true;
        return { valid, value };
    },
    /**
     * Implementation of enum constraint
     * @param constraint    `enum` property of the form object
     * @param value         value of the form object
     * @return {@link ValidationResult | validation result}
     */
    enum: (constraint, value) => {
        return {
            valid: constraint.indexOf(value) > -1,
            value
        };
    }
};


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ readData),
/* harmony export */   "registerMutationObserver": () => (/* binding */ registerMutationObserver)
/* harmony export */ });
/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

const NS = "cmp";

function readData(element, clazz) {
    const data = element.dataset;
    let options = [];
    let capitalized = clazz;
    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
    const reserved = ["is", "hook" + capitalized];

    for (let key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            let value = data[key];
            if (key.indexOf(NS) === 0) {
                key = key.slice(NS.length);
                key = key.charAt(0).toLowerCase() + key.substring(1);
                if (reserved.indexOf(key) === -1) {
                    options[key] = value;
                }
            }
        }
    }
    return options;
}
function registerMutationObserver(formFieldClass) {
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    let body = document.querySelector("body");
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // needed for IE
            var nodesArray = [].slice.call(mutation.addedNodes);
            if (nodesArray.length > 0) {
                nodesArray.forEach(function(addedNode) {
                    if (addedNode.querySelectorAll) {
                        var elementsArray = [].slice.call(addedNode.querySelectorAll(formFieldClass.selectors.self));
                        elementsArray.forEach(function(element) {
                            let dataset = FormView.readData(element, formFieldClass.IS);
                            let formContainerPath = dataset["formcontainer"];
                            let formContainer = window.af.formsRuntime.view.formContainer[formContainerPath];
                            let formField = new formFieldClass({element: element, formContainer: formContainer});
                        });
                    }
                });
            }
        });
    });

    observer.observe(body, {
        subtree: true,
        childList: true,
        characterData: true
    });
}


/***/ }),

/***/ "./src/view/DatePicker.js":
/*!********************************!*\
  !*** ./src/view/DatePicker.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DatePicker)
/* harmony export */ });
/* harmony import */ var _FormField__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FormField */ "./src/view/FormField.js");
/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/



class DatePicker extends _FormField__WEBPACK_IMPORTED_MODULE_0__["default"] {

    static NS = "cmp";
    static IS = "datepicker";
    static selectors  = {
        self: "[data-" + this.NS + '-is="' + this.IS + '"]'
    };

    constructor(params) {
        super(params);
    }

    getClass() {
        return "datepicker"
    }

    getTagName() {
        return "input";
    }

    setValue(value) {
        let dateInput = this.element.querySelector("input[type=date]");
        dateInput.value = value;
    }
}



/***/ }),

/***/ "./src/view/FormContainer.js":
/*!***********************************!*\
  !*** ./src/view/FormContainer.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FormContainer)
/* harmony export */ });
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aemforms/af-core */ "./node_modules/@aemforms/af-core/lib/index.js");
/* harmony import */ var _aemforms_af_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_aemforms_af_core__WEBPACK_IMPORTED_MODULE_0__);
/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/



class FormContainer {
    constructor(params) {
        this._formJson = params._formJson;
        this._fields = {};
    }

    async initialise() {
        this._model = await (0,_aemforms_af_core__WEBPACK_IMPORTED_MODULE_0__.createFormInstance)(this._formJson);
    }
    /**
     * returns the form field view
     * @param fieldId
     */
    getField(fieldId) {
        if (this._fields.hasOwnProperty(fieldId)) {
            return this._fields[fieldId];
        }
        return null;
    }

    getModel(id) {
        return id ? this._model.getElement(id) : this._model;
    }

    addField(fieldView) {
        this._fields[fieldView.getId()]  = fieldView;
        fieldView.setModel(this.getModel(fieldView.getId()));
        fieldView.subscribe();
    }

}



/***/ }),

/***/ "./src/view/FormField.js":
/*!*******************************!*\
  !*** ./src/view/FormField.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FormField)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.js");
/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/



class FormField {

    constructor(params) {
        this.formContainer = params.formContainer;
        this.parent = params.parent || params.formContainer;
        this.element = params.element; //html element of field
        this.options = (0,_utils__WEBPACK_IMPORTED_MODULE_0__["default"])(this.element, this.getClass());  //dataset of field
        let el = this.element.getElementsByTagName(this.getTagName());
        if (el && el.length > 0) {
            this.setId(el[0].id);
        }
        this.bindEventListeners();
        this.formContainer.addField(this);
    }

    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    bindEventListeners() {
        this.element.addEventListener('change', (event) => {
            this._model.value = event.target.value;
        });
    }

    setModel(model) {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    getClass() {
       throw new Error ("Not Implemented");
    }

    getTagName() {
        throw new Error ("Not Implemented");
    }

    setValue(value) {
       throw new Error("Not implemented");
    }

    subscribe() {
        this._model.subscribe((action) => {
            let state = action.target.getState();
            if (!state.valid) {
                alert(state.errorMessage);
                this.setValue(null);
            } else {
                this.setValue(state.value);
            }
        });
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DatePicker": () => (/* reexport safe */ _view_DatePicker__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "FormContainer": () => (/* reexport safe */ _view_FormContainer__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "readData": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "registerMutationObserver": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_1__.registerMutationObserver)
/* harmony export */ });
/* harmony import */ var _view_FormContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view/FormContainer */ "./src/view/FormContainer.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.js");
/* harmony import */ var _view_DatePicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view/DatePicker */ "./src/view/DatePicker.js");
/*******************************************************************************
 * Copyright 2022 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/




window.af = {
    formsRuntime: {
        model: {
            form: {}
        },
        view: {
            formContainer: {},
            utils: {}
        },
        event: {}
    }
}

})();

window.FormView = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=main.js.map