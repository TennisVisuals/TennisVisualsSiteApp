/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/
var UUID = (function() {
  var self = {};
  var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
  self.generate = function() {
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
      lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
      lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
      lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
  }
  return self;
})();
var BrowserStorage = (function() {
    /**
     * Whether the current browser supports local storage as a way of storing data
     * @var {Boolean}
     */
    var _hasLocalStorageSupport = (function() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    })();

    /**
     * @param {String} name The name of the property to read from this document's cookies
     * @return {?String} The specified cookie property's value (or null if it has not been set)
     */
    var _readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }

        return null;
    };

    /**
     * @param {String} name The name of the property to set by writing to a cookie
     * @param {String} value The value to use when setting the specified property
     * @param {int} [days] The number of days until the storage of this item expires
     */
    var _writeCookie = function(name, value, days) {
        var expiration = (function() {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                return "; expires=" + date.toGMTString();
            }
            else {
                return "";
            }
        })();

        document.cookie = name + "=" + value + expiration + "; path=/";
    };

    return {
        /**
         * @param {String} name The name of the property to set
         * @param {String} value The value to use when setting the specified property
         * @param {int} [days] The number of days until the storage of this item expires (if storage of the provided item must fallback to using cookies)
         */
        set: function(name, value, days) { _hasLocalStorageSupport ? localStorage.setItem(name, value) : _writeCookie(name, value, days); },

        /**
         * @param {String} name The name of the value to retrieve
         * @return {?String} The value of the 
         */
        get: function(name) { return _hasLocalStorageSupport ? localStorage.getItem(name) : _readCookie(name); },

        /**
         * @param {String} name The name of the value to delete/remove from storage
         */
        remove: function(name) { _hasLocalStorageSupport ? localStorage.removeItem(name) : this.set(name, "", -1); }
    };
})();
// https://d3js.org Version 4.5.0. Copyright 2017 Mike Bostock.
(function(t,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n(t.d3=t.d3||{})})(this,function(t){"use strict";function n(t){return function(n,e){return Ns(t(n),e)}}function e(t,n,e){var r=Math.abs(n-t)/Math.max(0,e),i=Math.pow(10,Math.floor(Math.log(r)/Math.LN10)),o=r/i;return o>=Ys?i*=10:o>=Bs?i*=5:o>=js&&(i*=2),n<t?-i:i}function r(t){return t.length}function i(t,n,e){var r=t(e);return"translate("+(isFinite(r)?r:n(e))+",0)"}function o(t,n,e){var r=t(e);return"translate(0,"+(isFinite(r)?r:n(e))+")"}function u(t){var n=t.bandwidth()/2;return t.round()&&(n=Math.round(n)),function(e){return t(e)+n}}function a(){return!this.__axis}function c(t,n){function e(e){var p,d=null==c?n.ticks?n.ticks.apply(n,r):n.domain():c,v=null==s?n.tickFormat?n.tickFormat.apply(n,r):ff:s,_=Math.max(f,0)+h,y=t===lf||t===pf?i:o,g=n.range(),m=g[0]+.5,x=g[g.length-1]+.5,b=(n.bandwidth?u:ff)(n.copy()),w=e.selection?e.selection():e,M=w.selectAll(".domain").data([null]),T=w.selectAll(".tick").data(d,n).order(),N=T.exit(),k=T.enter().append("g").attr("class","tick"),S=T.select("line"),E=T.select("text"),A=t===lf||t===df?-1:1,C=t===df||t===hf?(p="x","y"):(p="y","x");M=M.merge(M.enter().insert("path",".tick").attr("class","domain").attr("stroke","#000")),T=T.merge(k),S=S.merge(k.append("line").attr("stroke","#000").attr(p+"2",A*f).attr(C+"1",.5).attr(C+"2",.5)),E=E.merge(k.append("text").attr("fill","#000").attr(p,A*_).attr(C,.5).attr("dy",t===lf?"0em":t===pf?"0.71em":"0.32em")),e!==w&&(M=M.transition(e),T=T.transition(e),S=S.transition(e),E=E.transition(e),N=N.transition(e).attr("opacity",vf).attr("transform",function(t){return y(b,this.parentNode.__axis||b,t)}),k.attr("opacity",vf).attr("transform",function(t){return y(this.parentNode.__axis||b,b,t)})),N.remove(),M.attr("d",t===df||t==hf?"M"+A*l+","+m+"H0.5V"+x+"H"+A*l:"M"+m+","+A*l+"V0.5H"+x+"V"+A*l),T.attr("opacity",1).attr("transform",function(t){return y(b,b,t)}),S.attr(p+"2",A*f),E.attr(p,A*_).text(v),w.filter(a).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",t===hf?"start":t===df?"end":"middle"),w.each(function(){this.__axis=b})}var r=[],c=null,s=null,f=6,l=6,h=3;return e.scale=function(t){return arguments.length?(n=t,e):n},e.ticks=function(){return r=sf.call(arguments),e},e.tickArguments=function(t){return arguments.length?(r=null==t?[]:sf.call(t),e):r.slice()},e.tickValues=function(t){return arguments.length?(c=null==t?null:sf.call(t),e):c&&c.slice()},e.tickFormat=function(t){return arguments.length?(s=t,e):s},e.tickSize=function(t){return arguments.length?(f=l=+t,e):f},e.tickSizeInner=function(t){return arguments.length?(f=+t,e):f},e.tickSizeOuter=function(t){return arguments.length?(l=+t,e):l},e.tickPadding=function(t){return arguments.length?(h=+t,e):h},e}function s(t){return c(lf,t)}function f(t){return c(hf,t)}function l(t){return c(pf,t)}function h(t){return c(df,t)}function p(){for(var t,n=0,e=arguments.length,r={};n<e;++n){if(!(t=arguments[n]+"")||t in r)throw new Error("illegal type: "+t);r[t]=[]}return new d(r)}function d(t){this._=t}function v(t,n){return t.trim().split(/^|\s+/).map(function(t){var e="",r=t.indexOf(".");if(r>=0&&(e=t.slice(r+1),t=t.slice(0,r)),t&&!n.hasOwnProperty(t))throw new Error("unknown type: "+t);return{type:t,name:e}})}function _(t,n){for(var e,r=0,i=t.length;r<i;++r)if((e=t[r]).name===n)return e.value}function y(t,n,e){for(var r=0,i=t.length;r<i;++r)if(t[r].name===n){t[r]=_f,t=t.slice(0,r).concat(t.slice(r+1));break}return null!=e&&t.push({name:n,value:e}),t}function g(t){return function(){var n=this.ownerDocument,e=this.namespaceURI;return e===yf&&n.documentElement.namespaceURI===yf?n.createElement(t):n.createElementNS(e,t)}}function m(t){return function(){return this.ownerDocument.createElementNS(t.space,t.local)}}function x(){return new b}function b(){this._="@"+(++bf).toString(36)}function w(t,n,e){return t=M(t,n,e),function(n){var e=n.relatedTarget;e&&(e===this||8&e.compareDocumentPosition(this))||t.call(this,n)}}function M(n,e,r){return function(i){var o=t.event;t.event=i;try{n.call(this,this.__data__,e,r)}finally{t.event=o}}}function T(t){return t.trim().split(/^|\s+/).map(function(t){var n="",e=t.indexOf(".");return e>=0&&(n=t.slice(e+1),t=t.slice(0,e)),{type:t,name:n}})}function N(t){return function(){var n=this.__on;if(n){for(var e,r=0,i=-1,o=n.length;r<o;++r)e=n[r],t.type&&e.type!==t.type||e.name!==t.name?n[++i]=e:this.removeEventListener(e.type,e.listener,e.capture);++i?n.length=i:delete this.__on}}}function k(t,n,e){var r=kf.hasOwnProperty(t.type)?w:M;return function(i,o,u){var a,c=this.__on,s=r(n,o,u);if(c)for(var f=0,l=c.length;f<l;++f)if((a=c[f]).type===t.type&&a.name===t.name)return this.removeEventListener(a.type,a.listener,a.capture),this.addEventListener(a.type,a.listener=s,a.capture=e),void(a.value=n);this.addEventListener(t.type,s,e),a={type:t.type,name:t.name,value:n,listener:s,capture:e},c?c.push(a):this.__on=[a]}}function S(n,e,r,i){var o=t.event;n.sourceEvent=t.event,t.event=n;try{return e.apply(r,i)}finally{t.event=o}}function E(){}function A(){return[]}function C(t,n){this.ownerDocument=t.ownerDocument,this.namespaceURI=t.namespaceURI,this._next=null,this._parent=t,this.__data__=n}function z(t,n,e,r,i,o){for(var u,a=0,c=n.length,s=o.length;a<s;++a)(u=n[a])?(u.__data__=o[a],r[a]=u):e[a]=new C(t,o[a]);for(;a<c;++a)(u=n[a])&&(i[a]=u)}function P(t,n,e,r,i,o,u){var a,c,s,f={},l=n.length,h=o.length,p=new Array(l);for(a=0;a<l;++a)(c=n[a])&&(p[a]=s=If+u.call(c,c.__data__,a,n),s in f?i[a]=c:f[s]=c);for(a=0;a<h;++a)s=If+u.call(t,o[a],a,o),(c=f[s])?(r[a]=c,c.__data__=o[a],f[s]=null):e[a]=new C(t,o[a]);for(a=0;a<l;++a)(c=n[a])&&f[p[a]]===c&&(i[a]=c)}function R(t,n){return t<n?-1:t>n?1:t>=n?0:NaN}function q(t){return function(){this.removeAttribute(t)}}function L(t){return function(){this.removeAttributeNS(t.space,t.local)}}function U(t,n){return function(){this.setAttribute(t,n)}}function D(t,n){return function(){this.setAttributeNS(t.space,t.local,n)}}function O(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttribute(t):this.setAttribute(t,e)}}function F(t,n){return function(){var e=n.apply(this,arguments);null==e?this.removeAttributeNS(t.space,t.local):this.setAttributeNS(t.space,t.local,e)}}function I(t){return function(){this.style.removeProperty(t)}}function Y(t,n,e){return function(){this.style.setProperty(t,n,e)}}function B(t,n,e){return function(){var r=n.apply(this,arguments);null==r?this.style.removeProperty(t):this.style.setProperty(t,r,e)}}function j(t){return function(){delete this[t]}}function H(t,n){return function(){this[t]=n}}function X(t,n){return function(){var e=n.apply(this,arguments);null==e?delete this[t]:this[t]=e}}function V(t){return t.trim().split(/^|\s+/)}function W(t){return t.classList||new $(t)}function $(t){this._node=t,this._names=V(t.getAttribute("class")||"")}function Z(t,n){for(var e=W(t),r=-1,i=n.length;++r<i;)e.add(n[r])}function G(t,n){for(var e=W(t),r=-1,i=n.length;++r<i;)e.remove(n[r])}function J(t){return function(){Z(this,t)}}function Q(t){return function(){G(this,t)}}function K(t,n){return function(){(n.apply(this,arguments)?Z:G)(this,t)}}function tt(){this.textContent=""}function nt(t){return function(){this.textContent=t}}function et(t){return function(){var n=t.apply(this,arguments);this.textContent=null==n?"":n}}function rt(){this.innerHTML=""}function it(t){return function(){this.innerHTML=t}}function ot(t){return function(){var n=t.apply(this,arguments);this.innerHTML=null==n?"":n}}function ut(){this.nextSibling&&this.parentNode.appendChild(this)}function at(){this.previousSibling&&this.parentNode.insertBefore(this,this.parentNode.firstChild)}function ct(){return null}function st(){var t=this.parentNode;t&&t.removeChild(this)}function ft(t,n,e){var r=Kf(t),i=r.CustomEvent;i?i=new i(n,e):(i=r.document.createEvent("Event"),e?(i.initEvent(n,e.bubbles,e.cancelable),i.detail=e.detail):i.initEvent(n,!1,!1)),t.dispatchEvent(i)}function lt(t,n){return function(){return ft(this,t,n)}}function ht(t,n){return function(){return ft(this,t,n.apply(this,arguments))}}function pt(t,n){this._groups=t,this._parents=n}function dt(){return new pt([[document.documentElement]],hl)}function vt(){t.event.stopImmediatePropagation()}function _t(t,n){var e=t.document.documentElement,r=pl(t).on("dragstart.drag",null);n&&(r.on("click.drag",yl,!0),setTimeout(function(){r.on("click.drag",null)},0)),"onselectstart"in e?r.on("selectstart.drag",null):(e.style.MozUserSelect=e.__noselect,delete e.__noselect)}function yt(t,n,e,r,i,o,u,a,c,s){this.target=t,this.type=n,this.subject=e,this.identifier=r,this.active=i,this.x=o,this.y=u,this.dx=a,this.dy=c,this._=s}function gt(){return!t.event.button}function mt(){return this.parentNode}function xt(n){return null==n?{x:t.event.x,y:t.event.y}:n}function bt(t,n){var e=Object.create(t.prototype);for(var r in n)e[r]=n[r];return e}function wt(){}function Mt(t){var n;return t=(t+"").trim().toLowerCase(),(n=Sl.exec(t))?(n=parseInt(n[1],16),new Et(n>>8&15|n>>4&240,n>>4&15|240&n,(15&n)<<4|15&n,1)):(n=El.exec(t))?Tt(parseInt(n[1],16)):(n=Al.exec(t))?new Et(n[1],n[2],n[3],1):(n=Cl.exec(t))?new Et(255*n[1]/100,255*n[2]/100,255*n[3]/100,1):(n=zl.exec(t))?Nt(n[1],n[2],n[3],n[4]):(n=Pl.exec(t))?Nt(255*n[1]/100,255*n[2]/100,255*n[3]/100,n[4]):(n=Rl.exec(t))?At(n[1],n[2]/100,n[3]/100,1):(n=ql.exec(t))?At(n[1],n[2]/100,n[3]/100,n[4]):Ll.hasOwnProperty(t)?Tt(Ll[t]):"transparent"===t?new Et(NaN,NaN,NaN,0):null}function Tt(t){return new Et(t>>16&255,t>>8&255,255&t,1)}function Nt(t,n,e,r){return r<=0&&(t=n=e=NaN),new Et(t,n,e,r)}function kt(t){return t instanceof wt||(t=Mt(t)),t?(t=t.rgb(),new Et(t.r,t.g,t.b,t.opacity)):new Et}function St(t,n,e,r){return 1===arguments.length?kt(t):new Et(t,n,e,null==r?1:r)}function Et(t,n,e,r){this.r=+t,this.g=+n,this.b=+e,this.opacity=+r}function At(t,n,e,r){return r<=0?t=n=e=NaN:e<=0||e>=1?t=n=NaN:n<=0&&(t=NaN),new Pt(t,n,e,r)}function Ct(t){if(t instanceof Pt)return new Pt(t.h,t.s,t.l,t.opacity);if(t instanceof wt||(t=Mt(t)),!t)return new Pt;if(t instanceof Pt)return t;t=t.rgb();var n=t.r/255,e=t.g/255,r=t.b/255,i=Math.min(n,e,r),o=Math.max(n,e,r),u=NaN,a=o-i,c=(o+i)/2;return a?(u=n===o?(e-r)/a+6*(e<r):e===o?(r-n)/a+2:(n-e)/a+4,a/=c<.5?o+i:2-o-i,u*=60):a=c>0&&c<1?0:u,new Pt(u,a,c,t.opacity)}function zt(t,n,e,r){return 1===arguments.length?Ct(t):new Pt(t,n,e,null==r?1:r)}function Pt(t,n,e,r){this.h=+t,this.s=+n,this.l=+e,this.opacity=+r}function Rt(t,n,e){return 255*(t<60?n+(e-n)*t/60:t<180?e:t<240?n+(e-n)*(240-t)/60:n)}function qt(t){if(t instanceof Ut)return new Ut(t.l,t.a,t.b,t.opacity);if(t instanceof jt){var n=t.h*Ul;return new Ut(t.l,Math.cos(n)*t.c,Math.sin(n)*t.c,t.opacity)}t instanceof Et||(t=kt(t));var e=It(t.r),r=It(t.g),i=It(t.b),o=Dt((.4124564*e+.3575761*r+.1804375*i)/Fl),u=Dt((.2126729*e+.7151522*r+.072175*i)/Il),a=Dt((.0193339*e+.119192*r+.9503041*i)/Yl);return new Ut(116*u-16,500*(o-u),200*(u-a),t.opacity)}function Lt(t,n,e,r){return 1===arguments.length?qt(t):new Ut(t,n,e,null==r?1:r)}function Ut(t,n,e,r){this.l=+t,this.a=+n,this.b=+e,this.opacity=+r}function Dt(t){return t>Xl?Math.pow(t,1/3):t/Hl+Bl}function Ot(t){return t>jl?t*t*t:Hl*(t-Bl)}function Ft(t){return 255*(t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055)}function It(t){return(t/=255)<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function Yt(t){if(t instanceof jt)return new jt(t.h,t.c,t.l,t.opacity);t instanceof Ut||(t=qt(t));var n=Math.atan2(t.b,t.a)*Dl;return new jt(n<0?n+360:n,Math.sqrt(t.a*t.a+t.b*t.b),t.l,t.opacity)}function Bt(t,n,e,r){return 1===arguments.length?Yt(t):new jt(t,n,e,null==r?1:r)}function jt(t,n,e,r){this.h=+t,this.c=+n,this.l=+e,this.opacity=+r}function Ht(t){if(t instanceof Vt)return new Vt(t.h,t.s,t.l,t.opacity);t instanceof Et||(t=kt(t));var n=t.r/255,e=t.g/255,r=t.b/255,i=(Kl*r+Jl*n-Ql*e)/(Kl+Jl-Ql),o=r-i,u=(Gl*(e-i)-$l*o)/Zl,a=Math.sqrt(u*u+o*o)/(Gl*i*(1-i)),c=a?Math.atan2(u,o)*Dl-120:NaN;return new Vt(c<0?c+360:c,a,i,t.opacity)}function Xt(t,n,e,r){return 1===arguments.length?Ht(t):new Vt(t,n,e,null==r?1:r)}function Vt(t,n,e,r){this.h=+t,this.s=+n,this.l=+e,this.opacity=+r}function Wt(t,n,e,r,i){var o=t*t,u=o*t;return((1-3*t+3*o-u)*n+(4-6*o+3*u)*e+(1+3*t+3*o-3*u)*r+u*i)/6}function $t(t,n){return function(e){return t+e*n}}function Zt(t,n,e){return t=Math.pow(t,e),n=Math.pow(n,e)-t,e=1/e,function(r){return Math.pow(t+r*n,e)}}function Gt(t,n){var e=n-t;return e?$t(t,e>180||e<-180?e-360*Math.round(e/360):e):ch(isNaN(t)?n:t)}function Jt(t){return 1===(t=+t)?Qt:function(n,e){return e-n?Zt(n,e,t):ch(isNaN(n)?e:n)}}function Qt(t,n){var e=n-t;return e?$t(t,e):ch(isNaN(t)?n:t)}function Kt(t){return function(n){var e,r,i=n.length,o=new Array(i),u=new Array(i),a=new Array(i);for(e=0;e<i;++e)r=St(n[e]),o[e]=r.r||0,u[e]=r.g||0,a[e]=r.b||0;return o=t(o),u=t(u),a=t(a),r.opacity=1,function(t){return r.r=o(t),r.g=u(t),r.b=a(t),r+""}}}function tn(t){return function(){return t}}function nn(t){return function(n){return t(n)+""}}function en(t){return"none"===t?wh:(th||(th=document.createElement("DIV"),nh=document.documentElement,eh=document.defaultView),th.style.transform=t,t=eh.getComputedStyle(nh.appendChild(th),null).getPropertyValue("transform"),nh.removeChild(th),t=t.slice(7,-1).split(","),Mh(+t[0],+t[1],+t[2],+t[3],+t[4],+t[5]))}function rn(t){return null==t?wh:(rh||(rh=document.createElementNS("http://www.w3.org/2000/svg","g")),rh.setAttribute("transform",t),(t=rh.transform.baseVal.consolidate())?(t=t.matrix,Mh(t.a,t.b,t.c,t.d,t.e,t.f)):wh)}function on(t,n,e,r){function i(t){return t.length?t.pop()+" ":""}function o(t,r,i,o,u,a){if(t!==i||r!==o){var c=u.push("translate(",null,n,null,e);a.push({i:c-4,x:dh(t,i)},{i:c-2,x:dh(r,o)})}else(i||o)&&u.push("translate("+i+n+o+e)}function u(t,n,e,o){t!==n?(t-n>180?n+=360:n-t>180&&(t+=360),o.push({i:e.push(i(e)+"rotate(",null,r)-2,x:dh(t,n)})):n&&e.push(i(e)+"rotate("+n+r)}function a(t,n,e,o){t!==n?o.push({i:e.push(i(e)+"skewX(",null,r)-2,x:dh(t,n)}):n&&e.push(i(e)+"skewX("+n+r)}function c(t,n,e,r,o,u){if(t!==e||n!==r){var a=o.push(i(o)+"scale(",null,",",null,")");u.push({i:a-4,x:dh(t,e)},{i:a-2,x:dh(n,r)})}else 1===e&&1===r||o.push(i(o)+"scale("+e+","+r+")")}return function(n,e){var r=[],i=[];return n=t(n),e=t(e),o(n.translateX,n.translateY,e.translateX,e.translateY,r,i),u(n.rotate,e.rotate,r,i),a(n.skewX,e.skewX,r,i),c(n.scaleX,n.scaleY,e.scaleX,e.scaleY,r,i),n=e=null,function(t){for(var n,e=-1,o=i.length;++e<o;)r[(n=i[e]).i]=n.x(t);return r.join("")}}}function un(t){return((t=Math.exp(t))+1/t)/2}function an(t){return((t=Math.exp(t))-1/t)/2}function cn(t){return((t=Math.exp(2*t))-1)/(t+1)}function sn(t){return function(n,e){var r=t((n=zt(n)).h,(e=zt(e)).h),i=Qt(n.s,e.s),o=Qt(n.l,e.l),u=Qt(n.opacity,e.opacity);return function(t){return n.h=r(t),n.s=i(t),n.l=o(t),n.opacity=u(t),n+""}}}function fn(t,n){var e=Qt((t=Lt(t)).l,(n=Lt(n)).l),r=Qt(t.a,n.a),i=Qt(t.b,n.b),o=Qt(t.opacity,n.opacity);return function(n){return t.l=e(n),t.a=r(n),t.b=i(n),t.opacity=o(n),t+""}}function ln(t){return function(n,e){var r=t((n=Bt(n)).h,(e=Bt(e)).h),i=Qt(n.c,e.c),o=Qt(n.l,e.l),u=Qt(n.opacity,e.opacity);return function(t){return n.h=r(t),n.c=i(t),n.l=o(t),n.opacity=u(t),n+""}}}function hn(t){return function n(e){function r(n,r){var i=t((n=Xt(n)).h,(r=Xt(r)).h),o=Qt(n.s,r.s),u=Qt(n.l,r.l),a=Qt(n.opacity,r.opacity);return function(t){return n.h=i(t),n.s=o(t),n.l=u(Math.pow(t,e)),n.opacity=a(t),n+""}}return e=+e,r.gamma=n,r}(1)}function pn(){return jh||(Vh(dn),jh=Xh.now()+Hh)}function dn(){jh=0}function vn(){this._call=this._time=this._next=null}function _n(t,n,e){var r=new vn;return r.restart(t,n,e),r}function yn(){pn(),++Oh;for(var t,n=ih;n;)(t=jh-n._time)>=0&&n._call.call(null,t),n=n._next;--Oh}function gn(){jh=(Bh=Xh.now())+Hh,Oh=Fh=0;try{yn()}finally{Oh=0,xn(),jh=0}}function mn(){var t=Xh.now(),n=t-Bh;n>Yh&&(Hh-=n,Bh=t)}function xn(){for(var t,n,e=ih,r=1/0;e;)e._call?(r>e._time&&(r=e._time),t=e,e=e._next):(n=e._next,e._next=null,e=t?t._next=n:ih=n);oh=t,bn(r)}function bn(t){if(!Oh){Fh&&(Fh=clearTimeout(Fh));var n=t-jh;n>24?(t<1/0&&(Fh=setTimeout(gn,n)),Ih&&(Ih=clearInterval(Ih))):(Ih||(Bh=jh,Ih=setInterval(mn,Yh)),Oh=1,Vh(gn))}}function wn(t,n){var e=t.__transition;if(!e||!(e=e[n])||e.state>Jh)throw new Error("too late");return e}function Mn(t,n){var e=t.__transition;if(!e||!(e=e[n])||e.state>Kh)throw new Error("too late");return e}function Tn(t,n){var e=t.__transition;if(!e||!(e=e[n]))throw new Error("too late");return e}function Nn(t,n,e){function r(t){e.state=Qh,e.timer.restart(i,e.delay,e.time),e.delay<=t&&i(t-e.delay)}function i(r){var s,f,l,h;if(e.state!==Qh)return u();for(s in c)if(h=c[s],h.name===e.name){if(h.state===tp)return Wh(i);h.state===np?(h.state=rp,h.timer.stop(),h.on.call("interrupt",t,t.__data__,h.index,h.group),delete c[s]):+s<n&&(h.state=rp,h.timer.stop(),delete c[s])}if(Wh(function(){e.state===tp&&(e.state=np,e.timer.restart(o,e.delay,e.time),o(r))}),e.state=Kh,e.on.call("start",t,t.__data__,e.index,e.group),e.state===Kh){for(e.state=tp,a=new Array(l=e.tween.length),s=0,f=-1;s<l;++s)(h=e.tween[s].value.call(t,t.__data__,e.index,e.group))&&(a[++f]=h);a.length=f+1}}function o(n){for(var r=n<e.duration?e.ease.call(null,n/e.duration):(e.timer.restart(u),e.state=ep,1),i=-1,o=a.length;++i<o;)a[i].call(null,r);e.state===ep&&(e.on.call("end",t,t.__data__,e.index,e.group),u())}function u(){e.state=rp,e.timer.stop(),delete c[n];for(var r in c)return;delete t.__transition}var a,c=t.__transition;c[n]=e,e.timer=_n(r,0,e.time)}function kn(t,n){var e,r;return function(){var i=Mn(this,t),o=i.tween;if(o!==e){r=e=o;for(var u=0,a=r.length;u<a;++u)if(r[u].name===n){r=r.slice(),r.splice(u,1);break}}i.tween=r}}function Sn(t,n,e){var r,i;if("function"!=typeof e)throw new Error;return function(){var o=Mn(this,t),u=o.tween;if(u!==r){i=(r=u).slice();for(var a={name:n,value:e},c=0,s=i.length;c<s;++c)if(i[c].name===n){i[c]=a;break}c===s&&i.push(a)}o.tween=i}}function En(t,n,e){var r=t._id;return t.each(function(){var t=Mn(this,r);(t.value||(t.value={}))[n]=e.apply(this,arguments)}),function(t){return Tn(t,r).value[n]}}function An(t){return function(){this.removeAttribute(t)}}function Cn(t){return function(){this.removeAttributeNS(t.space,t.local)}}function zn(t,n,e){var r,i;return function(){var o=this.getAttribute(t);return o===e?null:o===r?i:i=n(r=o,e)}}function Pn(t,n,e){var r,i;return function(){var o=this.getAttributeNS(t.space,t.local);return o===e?null:o===r?i:i=n(r=o,e)}}function Rn(t,n,e){var r,i,o;return function(){var u,a=e(this);return null==a?void this.removeAttribute(t):(u=this.getAttribute(t),u===a?null:u===r&&a===i?o:o=n(r=u,i=a))}}function qn(t,n,e){var r,i,o;return function(){var u,a=e(this);return null==a?void this.removeAttributeNS(t.space,t.local):(u=this.getAttributeNS(t.space,t.local),u===a?null:u===r&&a===i?o:o=n(r=u,i=a))}}function Ln(t,n){function e(){var e=this,r=n.apply(e,arguments);return r&&function(n){e.setAttributeNS(t.space,t.local,r(n))}}return e._value=n,e}function Un(t,n){function e(){var e=this,r=n.apply(e,arguments);return r&&function(n){e.setAttribute(t,r(n))}}return e._value=n,e}function Dn(t,n){return function(){wn(this,t).delay=+n.apply(this,arguments)}}function On(t,n){return n=+n,function(){wn(this,t).delay=n}}function Fn(t,n){return function(){Mn(this,t).duration=+n.apply(this,arguments)}}function In(t,n){return n=+n,function(){Mn(this,t).duration=n}}function Yn(t,n){if("function"!=typeof n)throw new Error;return function(){Mn(this,t).ease=n}}function Bn(t){return(t+"").trim().split(/^|\s+/).every(function(t){var n=t.indexOf(".");return n>=0&&(t=t.slice(0,n)),!t||"start"===t})}function jn(t,n,e){var r,i,o=Bn(n)?wn:Mn;return function(){var u=o(this,t),a=u.on;a!==r&&(i=(r=a).copy()).on(n,e),u.on=i}}function Hn(t){return function(){var n=this.parentNode;for(var e in this.__transition)if(+e!==t)return;n&&n.removeChild(this)}}function Xn(t,n){var e,r,i;return function(){var o=Kf(this).getComputedStyle(this,null),u=o.getPropertyValue(t),a=(this.style.removeProperty(t),o.getPropertyValue(t));return u===a?null:u===e&&a===r?i:i=n(e=u,r=a)}}function Vn(t){return function(){this.style.removeProperty(t)}}function Wn(t,n,e){var r,i;return function(){var o=Kf(this).getComputedStyle(this,null).getPropertyValue(t);return o===e?null:o===r?i:i=n(r=o,e)}}function $n(t,n,e){var r,i,o;return function(){var u=Kf(this).getComputedStyle(this,null),a=u.getPropertyValue(t),c=e(this);return null==c&&(this.style.removeProperty(t),c=u.getPropertyValue(t)),a===c?null:a===r&&c===i?o:o=n(r=a,i=c)}}function Zn(t,n,e){function r(){var r=this,i=n.apply(r,arguments);return i&&function(n){r.style.setProperty(t,i(n),e)}}return r._value=n,r}function Gn(t){return function(){this.textContent=t}}function Jn(t){return function(){var n=t(this);this.textContent=null==n?"":n}}function Qn(t,n,e,r){this._groups=t,this._parents=n,this._name=e,this._id=r}function Kn(t){return dt().transition(t)}function te(){return++kp}function ne(t){return+t}function ee(t){return t*t}function re(t){return t*(2-t)}function ie(t){return((t*=2)<=1?t*t:--t*(2-t)+1)/2}function oe(t){return t*t*t}function ue(t){return--t*t*t+1}function ae(t){return((t*=2)<=1?t*t*t:(t-=2)*t*t+2)/2}function ce(t){return 1-Math.cos(t*Rp)}function se(t){return Math.sin(t*Rp)}function fe(t){return(1-Math.cos(Pp*t))/2}function le(t){return Math.pow(2,10*t-10)}function he(t){return 1-Math.pow(2,-10*t)}function pe(t){return((t*=2)<=1?Math.pow(2,10*t-10):2-Math.pow(2,10-10*t))/2}function de(t){return 1-Math.sqrt(1-t*t)}function ve(t){return Math.sqrt(1- --t*t)}function _e(t){return((t*=2)<=1?1-Math.sqrt(1-t*t):Math.sqrt(1-(t-=2)*t)+1)/2}function ye(t){return 1-ge(1-t)}function ge(t){return(t=+t)<qp?jp*t*t:t<Up?jp*(t-=Lp)*t+Dp:t<Fp?jp*(t-=Op)*t+Ip:jp*(t-=Yp)*t+Bp}function me(t){return((t*=2)<=1?1-ge(1-t):ge(t-1)+1)/2}function xe(t,n){for(var e;!(e=t.__transition)||!(e=e[n]);)if(!(t=t.parentNode))return td.time=pn(),td;return e}function be(){t.event.stopImmediatePropagation()}function we(t){return{type:t}}function Me(){return!t.event.button}function Te(){var t=this.ownerSVGElement||this;return[[0,0],[t.width.baseVal.value,t.height.baseVal.value]]}function Ne(t){for(;!t.__brush;)if(!(t=t.parentNode))return;return t.__brush}function ke(t){return t[0][0]===t[1][0]||t[0][1]===t[1][1]}function Se(t){var n=t.__brush;return n?n.dim.output(n.selection):null}function Ee(){return Ce(ld)}function Ae(){return Ce(hd)}function Ce(n){function e(t){var e=t.property("__brush",a).selectAll(".overlay").data([we("overlay")]);e.enter().append("rect").attr("class","overlay").attr("pointer-events","all").attr("cursor",dd.overlay).merge(e).each(function(){var t=Ne(this).extent;pl(this).attr("x",t[0][0]).attr("y",t[0][1]).attr("width",t[1][0]-t[0][0]).attr("height",t[1][1]-t[0][1])}),t.selectAll(".selection").data([we("selection")]).enter().append("rect").attr("class","selection").attr("cursor",dd.selection).attr("fill","#777").attr("fill-opacity",.3).attr("stroke","#fff").attr("shape-rendering","crispEdges");var i=t.selectAll(".handle").data(n.handles,function(t){return t.type});i.exit().remove(),i.enter().append("rect").attr("class",function(t){return"handle handle--"+t.type}).attr("cursor",function(t){return dd[t.type]}),t.each(r).attr("fill","none").attr("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush touchstart.brush",u)}function r(){var t=pl(this),n=Ne(this).selection;n?(t.selectAll(".selection").style("display",null).attr("x",n[0][0]).attr("y",n[0][1]).attr("width",n[1][0]-n[0][0]).attr("height",n[1][1]-n[0][1]),t.selectAll(".handle").style("display",null).attr("x",function(t){return"e"===t.type[t.type.length-1]?n[1][0]-h/2:n[0][0]-h/2}).attr("y",function(t){return"s"===t.type[0]?n[1][1]-h/2:n[0][1]-h/2}).attr("width",function(t){return"n"===t.type||"s"===t.type?n[1][0]-n[0][0]+h:h}).attr("height",function(t){return"e"===t.type||"w"===t.type?n[1][1]-n[0][1]+h:h})):t.selectAll(".selection,.handle").style("display","none").attr("x",null).attr("y",null).attr("width",null).attr("height",null)}function i(t,n){return t.__brush.emitter||new o(t,n)}function o(t,n){this.that=t,this.args=n,this.state=t.__brush,this.active=0}function u(){function e(){var t=zf(T);!U||w||M||(Math.abs(t[0]-O[0])>Math.abs(t[1]-O[1])?M=!0:w=!0),O=t,b=!0,ud(),o()}function o(){var t;switch(m=O[0]-D[0],x=O[1]-D[1],k){case cd:case ad:S&&(m=Math.max(P-l,Math.min(q-v,m)),h=l+m,_=v+m),E&&(x=Math.max(R-p,Math.min(L-y,x)),d=p+x,g=y+x);break;case sd:S<0?(m=Math.max(P-l,Math.min(q-l,m)),h=l+m,_=v):S>0&&(m=Math.max(P-v,Math.min(q-v,m)),h=l,_=v+m),E<0?(x=Math.max(R-p,Math.min(L-p,x)),d=p+x,g=y):E>0&&(x=Math.max(R-y,Math.min(L-y,x)),d=p,g=y+x);break;case fd:S&&(h=Math.max(P,Math.min(q,l-m*S)),_=Math.max(P,Math.min(q,v+m*S))),E&&(d=Math.max(R,Math.min(L,p-x*E)),g=Math.max(R,Math.min(L,y+x*E)))}_<h&&(S*=-1,t=l,l=v,v=t,t=h,h=_,_=t,N in vd&&Y.attr("cursor",dd[N=vd[N]])),g<d&&(E*=-1,t=p,p=y,y=t,t=d,d=g,g=t,N in _d&&Y.attr("cursor",dd[N=_d[N]])),A.selection&&(z=A.selection),w&&(h=z[0][0],_=z[1][0]),M&&(d=z[0][1],g=z[1][1]),z[0][0]===h&&z[0][1]===d&&z[1][0]===_&&z[1][1]===g||(A.selection=[[h,d],[_,g]],r.call(T),F.brush())}function u(){if(be(),t.event.touches){if(t.event.touches.length)return;c&&clearTimeout(c),c=setTimeout(function(){c=null},500),I.on("touchmove.brush touchend.brush touchcancel.brush",null)}else _t(t.event.view,b),B.on("keydown.brush keyup.brush mousemove.brush mouseup.brush",null);I.attr("pointer-events","all"),Y.attr("cursor",dd.overlay),A.selection&&(z=A.selection),ke(z)&&(A.selection=null,r.call(T)),F.end()}function a(){switch(t.event.keyCode){case 16:U=S&&E;break;case 18:k===sd&&(S&&(v=_-m*S,l=h+m*S),E&&(y=g-x*E,p=d+x*E),k=fd,o());break;case 32:k!==sd&&k!==fd||(S<0?v=_-m:S>0&&(l=h-m),E<0?y=g-x:E>0&&(p=d-x),k=cd,Y.attr("cursor",dd.selection),o());break;default:return}ud()}function s(){switch(t.event.keyCode){case 16:U&&(w=M=U=!1,o());break;case 18:k===fd&&(S<0?v=_:S>0&&(l=h),E<0?y=g:E>0&&(p=d),k=sd,o());break;case 32:k===cd&&(t.event.altKey?(S&&(v=_-m*S,l=h+m*S),E&&(y=g-x*E,p=d+x*E),k=fd):(S<0?v=_:S>0&&(l=h),E<0?y=g:E>0&&(p=d),k=sd),Y.attr("cursor",dd[N]),o());break;default:return}ud()}if(t.event.touches){if(t.event.changedTouches.length<t.event.touches.length)return ud()}else if(c)return;if(f.apply(this,arguments)){var l,h,p,d,v,_,y,g,m,x,b,w,M,T=this,N=t.event.target.__data__.type,k="selection"===(t.event.metaKey?N="overlay":N)?ad:t.event.altKey?fd:sd,S=n===hd?null:yd[N],E=n===ld?null:gd[N],A=Ne(T),C=A.extent,z=A.selection,P=C[0][0],R=C[0][1],q=C[1][0],L=C[1][1],U=S&&E&&t.event.shiftKey,D=zf(T),O=D,F=i(T,arguments).beforestart();"overlay"===N?A.selection=z=[[l=n===hd?P:D[0],p=n===ld?R:D[1]],[v=n===hd?q:l,y=n===ld?L:p]]:(l=z[0][0],p=z[0][1],v=z[1][0],y=z[1][1]),h=l,d=p,_=v,g=y;var I=pl(T).attr("pointer-events","none"),Y=I.selectAll(".overlay").attr("cursor",dd[N]);if(t.event.touches)I.on("touchmove.brush",e,!0).on("touchend.brush touchcancel.brush",u,!0);else{var B=pl(t.event.view).on("keydown.brush",a,!0).on("keyup.brush",s,!0).on("mousemove.brush",e,!0).on("mouseup.brush",u,!0);gl(t.event.view)}be(),op(T),r.call(T),F.start()}}function a(){var t=this.__brush||{selection:null};return t.extent=s.apply(this,arguments),t.dim=n,t}var c,s=Te,f=Me,l=p(e,"start","brush","end"),h=6;return e.move=function(t,e){t.selection?t.on("start.brush",function(){i(this,arguments).beforestart().start()}).on("interrupt.brush end.brush",function(){i(this,arguments).end()}).tween("brush",function(){function t(t){u.selection=1===t&&ke(s)?null:f(t),r.call(o),a.brush()}var o=this,u=o.__brush,a=i(o,arguments),c=u.selection,s=n.input("function"==typeof e?e.apply(this,arguments):e,u.extent),f=mh(c,s);return c&&s?t:t(1)}):t.each(function(){var t=this,o=arguments,u=t.__brush,a=n.input("function"==typeof e?e.apply(t,o):e,u.extent),c=i(t,o).beforestart();op(t),u.selection=null==a||ke(a)?null:a,r.call(t),c.start().brush().end()})},o.prototype={beforestart:function(){return 1===++this.active&&(this.state.emitter=this,this.starting=!0),this},start:function(){return this.starting&&(this.starting=!1,this.emit("start")),this},brush:function(){return this.emit("brush"),this},end:function(){return 0===--this.active&&(delete this.state.emitter,this.emit("end")),this},emit:function(t){S(new od(e,t,n.output(this.state.selection)),l.apply,l,[t,this.that,this.args])}},e.extent=function(t){return arguments.length?(s="function"==typeof t?t:id([[+t[0][0],+t[0][1]],[+t[1][0],+t[1][1]]]),e):s},e.filter=function(t){return arguments.length?(f="function"==typeof t?t:id(!!t),e):f},e.handleSize=function(t){return arguments.length?(h=+t,e):h},e.on=function(){var t=l.on.apply(l,arguments);return t===l?e:t},e}function ze(t){return function(n,e){return t(n.source.value+n.target.value,e.source.value+e.target.value)}}function Pe(){this._x0=this._y0=this._x1=this._y1=null,this._=""}function Re(){return new Pe}function qe(t){return t.source}function Le(t){return t.target}function Ue(t){return t.radius}function De(t){return t.startAngle}function Oe(t){return t.endAngle}function Fe(){}function Ie(t,n){var e=new Fe;if(t instanceof Fe)t.each(function(t,n){e.set(n,t)});else if(Array.isArray(t)){var r,i=-1,o=t.length;if(null==n)for(;++i<o;)e.set(i,t[i]);else for(;++i<o;)e.set(n(r=t[i],i,t),r)}else if(t)for(var u in t)e.set(u,t[u]);return e}function Ye(){return{}}function Be(t,n,e){t[n]=e}function je(){return Ie()}function He(t,n,e){t.set(n,e)}function Xe(){}function Ve(t,n){var e=new Xe;if(t instanceof Xe)t.each(function(t){e.add(t)});else if(t){var r=-1,i=t.length;if(null==n)for(;++r<i;)e.add(t[r]);else for(;++r<i;)e.add(n(t[r],r,t))}return e}function We(t){return new Function("d","return {"+t.map(function(t,n){return JSON.stringify(t)+": d["+n+"]"}).join(",")+"}")}function $e(t,n){var e=We(t);return function(r,i){return n(e(r),i,t)}}function Ze(t){var n=Object.create(null),e=[];return t.forEach(function(t){for(var r in t)r in n||e.push(n[r]=r)}),e}function Ge(t,n,e,r){if(isNaN(n)||isNaN(e))return t;var i,o,u,a,c,s,f,l,h,p=t._root,d={data:r},v=t._x0,_=t._y0,y=t._x1,g=t._y1;if(!p)return t._root=d,t;for(;p.length;)if((s=n>=(o=(v+y)/2))?v=o:y=o,(f=e>=(u=(_+g)/2))?_=u:g=u,i=p,!(p=p[l=f<<1|s]))return i[l]=d,t;if(a=+t._x.call(null,p.data),c=+t._y.call(null,p.data),n===a&&e===c)return d.next=p,i?i[l]=d:t._root=d,t;do i=i?i[l]=new Array(4):t._root=new Array(4),(s=n>=(o=(v+y)/2))?v=o:y=o,(f=e>=(u=(_+g)/2))?_=u:g=u;while((l=f<<1|s)===(h=(c>=u)<<1|a>=o));return i[h]=p,i[l]=d,t}function Je(t){var n,e,r,i,o=t.length,u=new Array(o),a=new Array(o),c=1/0,s=1/0,f=-(1/0),l=-(1/0);for(e=0;e<o;++e)isNaN(r=+this._x.call(null,n=t[e]))||isNaN(i=+this._y.call(null,n))||(u[e]=r,a[e]=i,r<c&&(c=r),r>f&&(f=r),i<s&&(s=i),i>l&&(l=i));for(f<c&&(c=this._x0,f=this._x1),l<s&&(s=this._y0,l=this._y1),this.cover(c,s).cover(f,l),e=0;e<o;++e)Ge(this,u[e],a[e],t[e]);return this}function Qe(t){for(var n=0,e=t.length;n<e;++n)this.remove(t[n]);return this}function Ke(t){return t[0]}function tr(t){return t[1]}function nr(t,n,e){var r=new er(null==n?Ke:n,null==e?tr:e,NaN,NaN,NaN,NaN);return null==t?r:r.addAll(t)}function er(t,n,e,r,i,o){this._x=t,this._y=n,this._x0=e,this._y0=r,this._x1=i,this._y1=o,this._root=void 0}function rr(t){for(var n={data:t.data},e=n;t=t.next;)e=e.next={data:t.data};return n}function ir(t){return t.x+t.vx}function or(t){return t.y+t.vy}function ur(t){return t.index}function ar(t,n){var e=t.get(n);if(!e)throw new Error("missing: "+n);return e}function cr(t){return t.x}function sr(t){return t.y}function fr(t){if(!(n=Cv.exec(t)))throw new Error("invalid format: "+t);var n,e=n[1]||" ",r=n[2]||">",i=n[3]||"-",o=n[4]||"",u=!!n[5],a=n[6]&&+n[6],c=!!n[7],s=n[8]&&+n[8].slice(1),f=n[9]||"";"n"===f?(c=!0,f="g"):Av[f]||(f=""),(u||"0"===e&&"="===r)&&(u=!0,e="0",r="="),this.fill=e,this.align=r,this.sign=i,this.symbol=o,this.zero=u,this.width=a,this.comma=c,this.precision=s,this.type=f}function lr(t){return t}function hr(n){return Pv=qv(n),
t.format=Pv.format,t.formatPrefix=Pv.formatPrefix,Pv}function pr(){this.reset()}function dr(t,n,e){var r=t.s=n+e,i=r-n,o=r-i;t.t=n-o+(e-i)}function vr(t){return t>1?0:t<-1?m_:Math.acos(t)}function _r(t){return t>1?x_:t<-1?-x_:Math.asin(t)}function yr(t){return(t=R_(t/2))*t}function gr(){}function mr(t,n){t&&O_.hasOwnProperty(t.type)&&O_[t.type](t,n)}function xr(t,n,e){var r,i=-1,o=t.length-e;for(n.lineStart();++i<o;)r=t[i],n.point(r[0],r[1],r[2]);n.lineEnd()}function br(t,n){var e=-1,r=t.length;for(n.polygonStart();++e<r;)xr(t[e],n,1);n.polygonEnd()}function wr(){B_.point=Tr}function Mr(){Nr(Fv,Iv)}function Tr(t,n){B_.point=Nr,Fv=t,Iv=n,t*=T_,n*=T_,Yv=t,Bv=E_(n=n/2+b_),jv=R_(n)}function Nr(t,n){t*=T_,n*=T_,n=n/2+b_;var e=t-Yv,r=e>=0?1:-1,i=r*e,o=E_(n),u=R_(n),a=jv*u,c=Bv*o+a*E_(i),s=a*r*R_(i);I_.add(S_(s,c)),Yv=t,Bv=o,jv=u}function kr(t){return[S_(t[1],t[0]),_r(t[2])]}function Sr(t){var n=t[0],e=t[1],r=E_(e);return[r*E_(n),r*R_(n),R_(e)]}function Er(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]}function Ar(t,n){return[t[1]*n[2]-t[2]*n[1],t[2]*n[0]-t[0]*n[2],t[0]*n[1]-t[1]*n[0]]}function Cr(t,n){t[0]+=n[0],t[1]+=n[1],t[2]+=n[2]}function zr(t,n){return[t[0]*n,t[1]*n,t[2]*n]}function Pr(t){var n=L_(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);t[0]/=n,t[1]/=n,t[2]/=n}function Rr(t,n){Qv.push(Kv=[Hv=t,Vv=t]),n<Xv&&(Xv=n),n>Wv&&(Wv=n)}function qr(t,n){var e=Sr([t*T_,n*T_]);if(Jv){var r=Ar(Jv,e),i=[r[1],-r[0],0],o=Ar(i,r);Pr(o),o=kr(o);var u,a=t-$v,c=a>0?1:-1,s=o[0]*M_*c,f=N_(a)>180;f^(c*$v<s&&s<c*t)?(u=o[1]*M_,u>Wv&&(Wv=u)):(s=(s+360)%360-180,f^(c*$v<s&&s<c*t)?(u=-o[1]*M_,u<Xv&&(Xv=u)):(n<Xv&&(Xv=n),n>Wv&&(Wv=n))),f?t<$v?Ir(Hv,t)>Ir(Hv,Vv)&&(Vv=t):Ir(t,Vv)>Ir(Hv,Vv)&&(Hv=t):Vv>=Hv?(t<Hv&&(Hv=t),t>Vv&&(Vv=t)):t>$v?Ir(Hv,t)>Ir(Hv,Vv)&&(Vv=t):Ir(t,Vv)>Ir(Hv,Vv)&&(Hv=t)}else Rr(t,n);Jv=e,$v=t}function Lr(){X_.point=qr}function Ur(){Kv[0]=Hv,Kv[1]=Vv,X_.point=Rr,Jv=null}function Dr(t,n){if(Jv){var e=t-$v;H_.add(N_(e)>180?e+(e>0?360:-360):e)}else Zv=t,Gv=n;B_.point(t,n),qr(t,n)}function Or(){B_.lineStart()}function Fr(){Dr(Zv,Gv),B_.lineEnd(),N_(H_)>y_&&(Hv=-(Vv=180)),Kv[0]=Hv,Kv[1]=Vv,Jv=null}function Ir(t,n){return(n-=t)<0?n+360:n}function Yr(t,n){return t[0]-n[0]}function Br(t,n){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}function jr(t,n){t*=T_,n*=T_;var e=E_(n);Hr(e*E_(t),e*R_(t),R_(n))}function Hr(t,n,e){++t_,e_+=(t-e_)/t_,r_+=(n-r_)/t_,i_+=(e-i_)/t_}function Xr(){W_.point=Vr}function Vr(t,n){t*=T_,n*=T_;var e=E_(n);p_=e*E_(t),d_=e*R_(t),v_=R_(n),W_.point=Wr,Hr(p_,d_,v_)}function Wr(t,n){t*=T_,n*=T_;var e=E_(n),r=e*E_(t),i=e*R_(t),o=R_(n),u=S_(L_((u=d_*o-v_*i)*u+(u=v_*r-p_*o)*u+(u=p_*i-d_*r)*u),p_*r+d_*i+v_*o);n_+=u,o_+=u*(p_+(p_=r)),u_+=u*(d_+(d_=i)),a_+=u*(v_+(v_=o)),Hr(p_,d_,v_)}function $r(){W_.point=jr}function Zr(){W_.point=Jr}function Gr(){Qr(l_,h_),W_.point=jr}function Jr(t,n){l_=t,h_=n,t*=T_,n*=T_,W_.point=Qr;var e=E_(n);p_=e*E_(t),d_=e*R_(t),v_=R_(n),Hr(p_,d_,v_)}function Qr(t,n){t*=T_,n*=T_;var e=E_(n),r=e*E_(t),i=e*R_(t),o=R_(n),u=d_*o-v_*i,a=v_*r-p_*o,c=p_*i-d_*r,s=L_(u*u+a*a+c*c),f=p_*r+d_*i+v_*o,l=s&&-vr(f)/s,h=S_(s,f);c_+=l*u,s_+=l*a,f_+=l*c,n_+=h,o_+=h*(p_+(p_=r)),u_+=h*(d_+(d_=i)),a_+=h*(v_+(v_=o)),Hr(p_,d_,v_)}function Kr(t,n){return[t>m_?t-w_:t<-m_?t+w_:t,n]}function ti(t,n,e){return(t%=w_)?n||e?G_(ei(t),ri(n,e)):ei(t):n||e?ri(n,e):Kr}function ni(t){return function(n,e){return n+=t,[n>m_?n-w_:n<-m_?n+w_:n,e]}}function ei(t){var n=ni(t);return n.invert=ni(-t),n}function ri(t,n){function e(t,n){var e=E_(n),a=E_(t)*e,c=R_(t)*e,s=R_(n),f=s*r+a*i;return[S_(c*o-f*u,a*r-s*i),_r(f*o+c*u)]}var r=E_(t),i=R_(t),o=E_(n),u=R_(n);return e.invert=function(t,n){var e=E_(n),a=E_(t)*e,c=R_(t)*e,s=R_(n),f=s*o-c*u;return[S_(c*o+s*u,a*r+f*i),_r(f*r-a*i)]},e}function ii(t,n,e,r,i,o){if(e){var u=E_(n),a=R_(n),c=r*e;null==i?(i=n+r*w_,o=n-c/2):(i=oi(u,i),o=oi(u,o),(r>0?i<o:i>o)&&(i+=r*w_));for(var s,f=i;r>0?f>o:f<o;f-=c)s=kr([u,-a*E_(f),-a*R_(f)]),t.point(s[0],s[1])}}function oi(t,n){n=Sr(n),n[0]-=t,Pr(n);var e=vr(-n[1]);return((-n[2]<0?-e:e)+w_-y_)%w_}function ui(t,n,e,r){this.x=t,this.z=n,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function ai(t){if(n=t.length){for(var n,e,r=0,i=t[0];++r<n;)i.n=e=t[r],e.p=i,i=e;i.n=e=t[0],e.p=i}}function ci(t,n,e,r){function i(i,o){return t<=i&&i<=e&&n<=o&&o<=r}function o(i,o,a,s){var f=0,l=0;if(null==i||(f=u(i,a))!==(l=u(o,a))||c(i,o)<0^a>0){do s.point(0===f||3===f?t:e,f>1?r:n);while((f=(f+a+4)%4)!==l)}else s.point(o[0],o[1])}function u(r,i){return N_(r[0]-t)<y_?i>0?0:3:N_(r[0]-e)<y_?i>0?2:1:N_(r[1]-n)<y_?i>0?1:0:i>0?3:2}function a(t,n){return c(t.x,n.x)}function c(t,n){var e=u(t,1),r=u(n,1);return e!==r?e-r:0===e?n[1]-t[1]:1===e?t[0]-n[0]:2===e?t[1]-n[1]:n[0]-t[0]}return function(u){function c(t,n){i(t,n)&&k.point(t,n)}function s(){for(var n=0,e=0,i=_.length;e<i;++e)for(var o,u,a=_[e],c=1,s=a.length,f=a[0],l=f[0],h=f[1];c<s;++c)o=l,u=h,f=a[c],l=f[0],h=f[1],u<=r?h>r&&(l-o)*(r-u)>(h-u)*(t-o)&&++n:h<=r&&(l-o)*(r-u)<(h-u)*(t-o)&&--n;return n}function f(){k=S,v=[],_=[],N=!0}function l(){var t=s(),n=N&&t,e=(v=Ks(v)).length;(n||e)&&(u.polygonStart(),n&&(u.lineStart(),o(null,null,1,u),u.lineEnd()),e&&py(v,a,t,o,u),u.polygonEnd()),k=u,v=_=y=null}function h(){E.point=d,_&&_.push(y=[]),T=!0,M=!1,b=w=NaN}function p(){v&&(d(g,m),x&&M&&S.rejoin(),v.push(S.result())),E.point=c,M&&k.lineEnd()}function d(o,u){var a=i(o,u);if(_&&y.push([o,u]),T)g=o,m=u,x=a,T=!1,a&&(k.lineStart(),k.point(o,u));else if(a&&M)k.point(o,u);else{var c=[b=Math.max(vy,Math.min(dy,b)),w=Math.max(vy,Math.min(dy,w))],s=[o=Math.max(vy,Math.min(dy,o)),u=Math.max(vy,Math.min(dy,u))];ly(c,s,t,n,e,r)?(M||(k.lineStart(),k.point(c[0],c[1])),k.point(s[0],s[1]),a||k.lineEnd(),N=!1):a&&(k.lineStart(),k.point(o,u),N=!1)}b=o,w=u,M=a}var v,_,y,g,m,x,b,w,M,T,N,k=u,S=fy(),E={point:c,lineStart:h,lineEnd:p,polygonStart:f,polygonEnd:l};return E}}function si(){gy.point=li,gy.lineEnd=fi}function fi(){gy.point=gy.lineEnd=gr}function li(t,n){t*=T_,n*=T_,J_=t,Q_=R_(n),K_=E_(n),gy.point=hi}function hi(t,n){t*=T_,n*=T_;var e=R_(n),r=E_(n),i=N_(t-J_),o=E_(i),u=R_(i),a=r*u,c=K_*e-Q_*r*o,s=Q_*e+K_*r*o;yy.add(S_(L_(a*a+c*c),s)),J_=t,Q_=e,K_=r}function pi(t,n,e){var r=Is(t,n-y_,e).concat(n);return function(t){return r.map(function(n){return[t,n]})}}function di(t,n,e){var r=Is(t,n-y_,e).concat(n);return function(t){return r.map(function(n){return[n,t]})}}function vi(){function t(){return{type:"MultiLineString",coordinates:n()}}function n(){return Is(A_(o/_)*_,i,_).map(h).concat(Is(A_(s/y)*y,c,y).map(p)).concat(Is(A_(r/d)*d,e,d).filter(function(t){return N_(t%_)>y_}).map(f)).concat(Is(A_(a/v)*v,u,v).filter(function(t){return N_(t%y)>y_}).map(l))}var e,r,i,o,u,a,c,s,f,l,h,p,d=10,v=d,_=90,y=360,g=2.5;return t.lines=function(){return n().map(function(t){return{type:"LineString",coordinates:t}})},t.outline=function(){return{type:"Polygon",coordinates:[h(o).concat(p(c).slice(1),h(i).reverse().slice(1),p(s).reverse().slice(1))]}},t.extent=function(n){return arguments.length?t.extentMajor(n).extentMinor(n):t.extentMinor()},t.extentMajor=function(n){return arguments.length?(o=+n[0][0],i=+n[1][0],s=+n[0][1],c=+n[1][1],o>i&&(n=o,o=i,i=n),s>c&&(n=s,s=c,c=n),t.precision(g)):[[o,s],[i,c]]},t.extentMinor=function(n){return arguments.length?(r=+n[0][0],e=+n[1][0],a=+n[0][1],u=+n[1][1],r>e&&(n=r,r=e,e=n),a>u&&(n=a,a=u,u=n),t.precision(g)):[[r,a],[e,u]]},t.step=function(n){return arguments.length?t.stepMajor(n).stepMinor(n):t.stepMinor()},t.stepMajor=function(n){return arguments.length?(_=+n[0],y=+n[1],t):[_,y]},t.stepMinor=function(n){return arguments.length?(d=+n[0],v=+n[1],t):[d,v]},t.precision=function(n){return arguments.length?(g=+n,f=pi(a,u,90),l=di(r,e,g),h=pi(s,c,90),p=di(o,i,g),t):g},t.extentMajor([[-180,-90+y_],[180,90-y_]]).extentMinor([[-180,-80-y_],[180,80+y_]])}function _i(){return vi()()}function yi(){Sy.point=gi}function gi(t,n){Sy.point=mi,ty=ey=t,ny=ry=n}function mi(t,n){ky.add(ry*t-ey*n),ey=t,ry=n}function xi(){mi(ty,ny)}function bi(t,n){t<Ey&&(Ey=t),t>Cy&&(Cy=t),n<Ay&&(Ay=n),n>zy&&(zy=n)}function wi(t,n){Ry+=t,qy+=n,++Ly}function Mi(){By.point=Ti}function Ti(t,n){By.point=Ni,wi(uy=t,ay=n)}function Ni(t,n){var e=t-uy,r=n-ay,i=L_(e*e+r*r);Uy+=i*(uy+t)/2,Dy+=i*(ay+n)/2,Oy+=i,wi(uy=t,ay=n)}function ki(){By.point=wi}function Si(){By.point=Ai}function Ei(){Ci(iy,oy)}function Ai(t,n){By.point=Ci,wi(iy=uy=t,oy=ay=n)}function Ci(t,n){var e=t-uy,r=n-ay,i=L_(e*e+r*r);Uy+=i*(uy+t)/2,Dy+=i*(ay+n)/2,Oy+=i,i=ay*t-uy*n,Fy+=i*(uy+t),Iy+=i*(ay+n),Yy+=3*i,wi(uy=t,ay=n)}function zi(t){this._context=t}function Pi(){this._string=[]}function Ri(t){return"m0,"+t+"a"+t+","+t+" 0 1,1 0,"+-2*t+"a"+t+","+t+" 0 1,1 0,"+2*t+"z"}function qi(t){return t.length>1}function Li(t,n){return((t=t.x)[0]<0?t[1]-x_-y_:x_-t[1])-((n=n.x)[0]<0?n[1]-x_-y_:x_-n[1])}function Ui(t){var n,e=NaN,r=NaN,i=NaN;return{lineStart:function(){t.lineStart(),n=1},point:function(o,u){var a=o>0?m_:-m_,c=N_(o-e);N_(c-m_)<y_?(t.point(e,r=(r+u)/2>0?x_:-x_),t.point(i,r),t.lineEnd(),t.lineStart(),t.point(a,r),t.point(o,r),n=0):i!==a&&c>=m_&&(N_(e-i)<y_&&(e-=i*y_),N_(o-a)<y_&&(o-=a*y_),r=Di(e,r,o,u),t.point(i,r),t.lineEnd(),t.lineStart(),t.point(a,r),n=0),t.point(e=o,r=u),i=a},lineEnd:function(){t.lineEnd(),e=r=NaN},clean:function(){return 2-n}}}function Di(t,n,e,r){var i,o,u=R_(t-e);return N_(u)>y_?k_((R_(n)*(o=E_(r))*R_(e)-R_(r)*(i=E_(n))*R_(t))/(i*o*u)):(n+r)/2}function Oi(t,n,e,r){var i;if(null==t)i=e*x_,r.point(-m_,i),r.point(0,i),r.point(m_,i),r.point(m_,0),r.point(m_,-i),r.point(0,-i),r.point(-m_,-i),r.point(-m_,0),r.point(-m_,i);else if(N_(t[0]-n[0])>y_){var o=t[0]<n[0]?m_:-m_;i=e*o/2,r.point(-o,i),r.point(0,i),r.point(o,i)}else r.point(n[0],n[1])}function Fi(t){return function(n){var e=new Ii;for(var r in t)e[r]=t[r];return e.stream=n,e}}function Ii(){}function Yi(t,n,e){var r=n[1][0]-n[0][0],i=n[1][1]-n[0][1],o=t.clipExtent&&t.clipExtent();t.scale(150).translate([0,0]),null!=o&&t.clipExtent(null),F_(e,t.stream(Py));var u=Py.result(),a=Math.min(r/(u[1][0]-u[0][0]),i/(u[1][1]-u[0][1])),c=+n[0][0]+(r-a*(u[1][0]+u[0][0]))/2,s=+n[0][1]+(i-a*(u[1][1]+u[0][1]))/2;return null!=o&&t.clipExtent(o),t.scale(150*a).translate([c,s])}function Bi(t,n,e){return Yi(t,[[0,0],n],e)}function ji(t){return Fi({point:function(n,e){n=t(n,e),this.stream.point(n[0],n[1])}})}function Hi(t,n){function e(r,i,o,u,a,c,s,f,l,h,p,d,v,_){var y=s-r,g=f-i,m=y*y+g*g;if(m>4*n&&v--){var x=u+h,b=a+p,w=c+d,M=L_(x*x+b*b+w*w),T=_r(w/=M),N=N_(N_(w)-1)<y_||N_(o-l)<y_?(o+l)/2:S_(b,x),k=t(N,T),S=k[0],E=k[1],A=S-r,C=E-i,z=g*A-y*C;(z*z/m>n||N_((y*A+g*C)/m-.5)>.3||u*h+a*p+c*d<Jy)&&(e(r,i,o,u,a,c,S,E,N,x/=M,b/=M,w,v,_),_.point(S,E),e(S,E,N,x,b,w,s,f,l,h,p,d,v,_))}}return function(n){function r(e,r){e=t(e,r),n.point(e[0],e[1])}function i(){y=NaN,w.point=o,n.lineStart()}function o(r,i){var o=Sr([r,i]),u=t(r,i);e(y,g,_,m,x,b,y=u[0],g=u[1],_=r,m=o[0],x=o[1],b=o[2],Gy,n),n.point(y,g)}function u(){w.point=r,n.lineEnd()}function a(){i(),w.point=c,w.lineEnd=s}function c(t,n){o(f=t,n),l=y,h=g,p=m,d=x,v=b,w.point=o}function s(){e(y,g,_,m,x,b,l,h,f,p,d,v,Gy,n),w.lineEnd=u,u()}var f,l,h,p,d,v,_,y,g,m,x,b,w={point:r,lineStart:i,lineEnd:u,polygonStart:function(){n.polygonStart(),w.lineStart=a},polygonEnd:function(){n.polygonEnd(),w.lineStart=i}};return w}}function Xi(t){return Vi(function(){return t})()}function Vi(t){function n(t){return t=f(t[0]*T_,t[1]*T_),[t[0]*_+a,c-t[1]*_]}function e(t){return t=f.invert((t[0]-a)/_,(c-t[1])/_),t&&[t[0]*M_,t[1]*M_]}function r(t,n){return t=u(t,n),[t[0]*_+a,c-t[1]*_]}function i(){f=G_(s=ti(b,w,M),u);var t=u(m,x);return a=y-t[0]*_,c=g+t[1]*_,o()}function o(){return d=v=null,n}var u,a,c,s,f,l,h,p,d,v,_=150,y=480,g=250,m=0,x=0,b=0,w=0,M=0,T=null,N=Wy,k=null,S=Ty,E=.5,A=Qy(r,E);return n.stream=function(t){return d&&v===t?d:d=Ky(N(s,A(S(v=t))))},n.clipAngle=function(t){return arguments.length?(N=+t?$y(T=t*T_,6*T_):(T=null,Wy),o()):T*M_},n.clipExtent=function(t){return arguments.length?(S=null==t?(k=l=h=p=null,Ty):ci(k=+t[0][0],l=+t[0][1],h=+t[1][0],p=+t[1][1]),o()):null==k?null:[[k,l],[h,p]]},n.scale=function(t){return arguments.length?(_=+t,i()):_},n.translate=function(t){return arguments.length?(y=+t[0],g=+t[1],i()):[y,g]},n.center=function(t){return arguments.length?(m=t[0]%360*T_,x=t[1]%360*T_,i()):[m*M_,x*M_]},n.rotate=function(t){return arguments.length?(b=t[0]%360*T_,w=t[1]%360*T_,M=t.length>2?t[2]%360*T_:0,i()):[b*M_,w*M_,M*M_]},n.precision=function(t){return arguments.length?(A=Qy(r,E=t*t),o()):L_(E)},n.fitExtent=function(t,e){return Yi(n,t,e)},n.fitSize=function(t,e){return Bi(n,t,e)},function(){return u=t.apply(this,arguments),n.invert=u.invert&&e,i()}}function Wi(t){var n=0,e=m_/3,r=Vi(t),i=r(n,e);return i.parallels=function(t){return arguments.length?r(n=t[0]*T_,e=t[1]*T_):[n*M_,e*M_]},i}function $i(t){function n(t,n){return[t*e,R_(n)/e]}var e=E_(t);return n.invert=function(t,n){return[t/e,_r(n*e)]},n}function Zi(t,n){function e(t,n){var e=L_(o-2*i*R_(n))/i;return[e*R_(t*=i),u-e*E_(t)]}var r=R_(t),i=(r+R_(n))/2;if(N_(i)<y_)return $i(t);var o=1+r*(2*i-r),u=L_(o)/i;return e.invert=function(t,n){var e=u-n;return[S_(t,N_(e))/i*q_(e),_r((o-(t*t+e*e)*i*i)/(2*i))]},e}function Gi(t){var n=t.length;return{point:function(e,r){for(var i=-1;++i<n;)t[i].point(e,r)},sphere:function(){for(var e=-1;++e<n;)t[e].sphere()},lineStart:function(){for(var e=-1;++e<n;)t[e].lineStart()},lineEnd:function(){for(var e=-1;++e<n;)t[e].lineEnd()},polygonStart:function(){for(var e=-1;++e<n;)t[e].polygonStart()},polygonEnd:function(){for(var e=-1;++e<n;)t[e].polygonEnd()}}}function Ji(t){return function(n,e){var r=E_(n),i=E_(e),o=t(r*i);return[o*i*R_(n),o*R_(e)]}}function Qi(t){return function(n,e){var r=L_(n*n+e*e),i=t(r),o=R_(i),u=E_(i);return[S_(n*o,r*u),_r(r&&e*o/r)]}}function Ki(t,n){return[t,z_(U_((x_+n)/2))]}function to(t){var n,e=Xi(t),r=e.scale,i=e.translate,o=e.clipExtent;return e.scale=function(t){return arguments.length?(r(t),n&&e.clipExtent(null),e):r()},e.translate=function(t){return arguments.length?(i(t),n&&e.clipExtent(null),e):i()},e.clipExtent=function(t){if(!arguments.length)return n?null:o();if(n=null==t){var u=m_*r(),a=i();t=[[a[0]-u,a[1]-u],[a[0]+u,a[1]+u]]}return o(t),e},e.clipExtent(null)}function no(t){return U_((x_+t)/2)}function eo(t,n){function e(t,n){o>0?n<-x_+y_&&(n=-x_+y_):n>x_-y_&&(n=x_-y_);var e=o/P_(no(n),i);return[e*R_(i*t),o-e*E_(i*t)]}var r=E_(t),i=t===n?R_(t):z_(r/E_(n))/z_(no(n)/no(t)),o=r*P_(no(t),i)/i;return i?(e.invert=function(t,n){var e=o-n,r=q_(i)*L_(t*t+e*e);return[S_(t,N_(e))/i*q_(e),2*k_(P_(o/r,1/i))-x_]},e):Ki}function ro(t,n){return[t,n]}function io(t,n){function e(t,n){var e=o-n,r=i*t;return[e*R_(r),o-e*E_(r)]}var r=E_(t),i=t===n?R_(t):(r-E_(n))/(n-t),o=r/i+t;return N_(i)<y_?ro:(e.invert=function(t,n){var e=o-n;return[S_(t,N_(e))/i*q_(e),o-q_(i)*L_(t*t+e*e)]},e)}function oo(t,n){var e=E_(n),r=E_(t)*e;return[e*R_(t)/r,R_(n)/r]}function uo(t,n,e,r){return 1===t&&1===n&&0===e&&0===r?Ty:Fi({point:function(i,o){this.stream.point(i*t+e,o*n+r)}})}function ao(t,n){return[E_(n)*R_(t),R_(n)]}function co(t,n){var e=E_(n),r=1+E_(t)*e;return[e*R_(t)/r,R_(n)/r]}function so(t,n){return[z_(U_((x_+n)/2)),-t]}function fo(t,n){return t.parent===n.parent?1:2}function lo(t){return t.reduce(ho,0)/t.length}function ho(t,n){return t+n.x}function po(t){return 1+t.reduce(vo,0)}function vo(t,n){return Math.max(t,n.y)}function _o(t){for(var n;n=t.children;)t=n[0];return t}function yo(t){for(var n;n=t.children;)t=n[n.length-1];return t}function go(t){var n=0,e=t.children,r=e&&e.length;if(r)for(;--r>=0;)n+=e[r].value;else n=1;t.value=n}function mo(t,n){if(t===n)return t;var e=t.ancestors(),r=n.ancestors(),i=null;for(t=e.pop(),n=r.pop();t===n;)i=t,t=e.pop(),n=r.pop();return i}function xo(t,n){var e,r,i,o,u,a=new No(t),c=+t.value&&(a.value=t.value),s=[a];for(null==n&&(n=wo);e=s.pop();)if(c&&(e.value=+e.data.value),(i=n(e.data))&&(u=i.length))for(e.children=new Array(u),o=u-1;o>=0;--o)s.push(r=e.children[o]=new No(i[o])),r.parent=e,r.depth=e.depth+1;return a.eachBefore(To)}function bo(){return xo(this).eachBefore(Mo)}function wo(t){return t.children}function Mo(t){t.data=t.data.data}function To(t){var n=0;do t.height=n;while((t=t.parent)&&t.height<++n)}function No(t){this.data=t,this.depth=this.height=0,this.parent=null}function ko(t){this._=t,this.next=null}function So(t,n){var e=n.x-t.x,r=n.y-t.y,i=t.r-n.r;return i*i+1e-6>e*e+r*r}function Eo(t,n){var e,r,i,o=null,u=t.head;switch(n.length){case 1:e=Ao(n[0]);break;case 2:e=Co(n[0],n[1]);break;case 3:e=zo(n[0],n[1],n[2])}for(;u;)i=u._,r=u.next,e&&So(e,i)?o=u:(o?(t.tail=o,o.next=null):t.head=t.tail=null,n.push(i),e=Eo(t,n),n.pop(),t.head?(u.next=t.head,t.head=u):(u.next=null,t.head=t.tail=u),o=t.tail,o.next=r),u=r;return t.tail=o,e}function Ao(t){return{x:t.x,y:t.y,r:t.r}}function Co(t,n){var e=t.x,r=t.y,i=t.r,o=n.x,u=n.y,a=n.r,c=o-e,s=u-r,f=a-i,l=Math.sqrt(c*c+s*s);return{x:(e+o+c/l*f)/2,y:(r+u+s/l*f)/2,r:(l+i+a)/2}}function zo(t,n,e){var r=t.x,i=t.y,o=t.r,u=n.x,a=n.y,c=n.r,s=e.x,f=e.y,l=e.r,h=2*(r-u),p=2*(i-a),d=2*(c-o),v=r*r+i*i-o*o-u*u-a*a+c*c,_=2*(r-s),y=2*(i-f),g=2*(l-o),m=r*r+i*i-o*o-s*s-f*f+l*l,x=_*p-h*y,b=(p*m-y*v)/x-r,w=(y*d-p*g)/x,M=(_*v-h*m)/x-i,T=(h*g-_*d)/x,N=w*w+T*T-1,k=2*(b*w+M*T+o),S=b*b+M*M-o*o,E=(-k-Math.sqrt(k*k-4*N*S))/(2*N);return{x:b+w*E+r,y:M+T*E+i,r:E}}function Po(t,n,e){var r=t.x,i=t.y,o=n.r+e.r,u=t.r+e.r,a=n.x-r,c=n.y-i,s=a*a+c*c;if(s){var f=.5+((u*=u)-(o*=o))/(2*s),l=Math.sqrt(Math.max(0,2*o*(u+s)-(u-=s)*u-o*o))/(2*s);e.x=r+f*a+l*c,e.y=i+f*c-l*a}else e.x=r+u,e.y=i}function Ro(t,n){var e=n.x-t.x,r=n.y-t.y,i=t.r+n.r;return i*i-1e-6>e*e+r*r}function qo(t,n){for(var e=t._.r;t!==n;)e+=2*(t=t.next)._.r;return e-n._.r}function Lo(t,n,e){var r=t.x-n,i=t.y-e;return r*r+i*i}function Uo(t){this._=t,this.next=null,this.previous=null}function Do(t){if(!(i=t.length))return 0;var n,e,r,i;if(n=t[0],n.x=0,n.y=0,!(i>1))return n.r;if(e=t[1],n.x=-e.r,e.x=n.r,e.y=0,!(i>2))return n.r+e.r;Po(e,n,r=t[2]);var o,u,a,c,s,f,l,h=n.r*n.r,p=e.r*e.r,d=r.r*r.r,v=h+p+d,_=h*n.x+p*e.x+d*r.x,y=h*n.y+p*e.y+d*r.y;n=new Uo(n),e=new Uo(e),r=new Uo(r),n.next=r.previous=e,e.next=n.previous=r,r.next=e.previous=n;t:for(a=3;a<i;++a){Po(n._,e._,r=t[a]),r=new Uo(r),c=e.next,s=n.previous,f=e._.r,l=n._.r;do if(f<=l){if(Ro(c._,r._)){f+n._.r+e._.r>qo(c,e)?n=c:e=c,n.next=e,e.previous=n,--a;continue t}f+=c._.r,c=c.next}else{if(Ro(s._,r._)){qo(n,s)>l+n._.r+e._.r?n=s:e=s,n.next=e,e.previous=n,--a;continue t}l+=s._.r,s=s.previous}while(c!==s.next);for(r.previous=n,r.next=e,n.next=e.previous=e=r,v+=d=r._.r*r._.r,_+=d*r._.x,y+=d*r._.y,h=Lo(n._,o=_/v,u=y/v);(r=r.next)!==e;)(d=Lo(r._,o,u))<h&&(n=r,h=d);e=n.next}for(n=[e._],r=e;(r=r.next)!==e;)n.push(r._);for(r=Ag(n),a=0;a<i;++a)n=t[a],n.x-=r.x,n.y-=r.y;return r.r}function Oo(t){return null==t?null:Fo(t)}function Fo(t){if("function"!=typeof t)throw new Error;return t}function Io(){return 0}function Yo(t){return Math.sqrt(t.value)}function Bo(t){return function(n){n.children||(n.r=Math.max(0,+t(n)||0))}}function jo(t,n){return function(e){if(r=e.children){var r,i,o,u=r.length,a=t(e)*n||0;if(a)for(i=0;i<u;++i)r[i].r+=a;if(o=Do(r),a)for(i=0;i<u;++i)r[i].r-=a;e.r=o+a}}}function Ho(t){return function(n){var e=n.parent;n.r*=t,e&&(n.x=e.x+t*n.x,n.y=e.y+t*n.y)}}function Xo(t){return t.id}function Vo(t){return t.parentId}function Wo(t,n){return t.parent===n.parent?1:2}function $o(t){var n=t.children;return n?n[0]:t.t}function Zo(t){var n=t.children;return n?n[n.length-1]:t.t}function Go(t,n,e){var r=e/(n.i-t.i);n.c-=r,n.s+=e,t.c+=r,n.z+=e,n.m+=e}function Jo(t){for(var n,e=0,r=0,i=t.children,o=i.length;--o>=0;)n=i[o],n.z+=e,n.m+=e,e+=n.s+(r+=n.c)}function Qo(t,n,e){return t.a.parent===n.parent?t.a:e}function Ko(t,n){this._=t,this.parent=null,this.children=null,this.A=null,this.a=this,this.z=0,this.m=0,this.c=0,this.s=0,this.t=null,this.i=n}function tu(t){for(var n,e,r,i,o,u=new Ko(t,0),a=[u];n=a.pop();)if(r=n._.children)for(n.children=new Array(o=r.length),i=o-1;i>=0;--i)a.push(e=n.children[i]=new Ko(r[i],i)),e.parent=n;return(u.parent=new Ko(null,0)).children=[u],u}function nu(t,n,e,r,i,o){for(var u,a,c,s,f,l,h,p,d,v,_,y=[],g=n.children,m=0,x=0,b=g.length,w=n.value;m<b;){c=i-e,s=o-r;do f=g[x++].value;while(!f&&x<b);for(l=h=f,v=Math.max(s/c,c/s)/(w*t),_=f*f*v,d=Math.max(h/_,_/l);x<b;++x){if(f+=a=g[x].value,a<l&&(l=a),a>h&&(h=a),_=f*f*v,p=Math.max(h/_,_/l),p>d){f-=a;break}d=p}y.push(u={value:f,dice:c<s,children:g.slice(m,x)}),u.dice?qg(u,e,r,i,w?r+=s*f/w:o):Yg(u,e,r,w?e+=c*f/w:i,o),w-=f,m=x}return y}function eu(t,n){return t[0]-n[0]||t[1]-n[1]}function ru(t){for(var n=t.length,e=[0,1],r=2,i=2;i<n;++i){for(;r>1&&Gg(t[e[r-2]],t[e[r-1]],t[i])<=0;)--r;e[r++]=i}return e.slice(0,r)}function iu(t){if(!(t>=1))throw new Error;this._size=t,this._call=this._error=null,this._tasks=[],this._data=[],this._waiting=this._active=this._ended=this._start=0}function ou(t){if(!t._start)try{uu(t)}catch(n){if(t._tasks[t._ended+t._active-1])cu(t,n);else if(!t._data)throw n}}function uu(t){for(;t._start=t._waiting&&t._active<t._size;){var n=t._ended+t._active,e=t._tasks[n],r=e.length-1,i=e[r];e[r]=au(t,n),--t._waiting,++t._active,e=i.apply(null,e),t._tasks[n]&&(t._tasks[n]=e||nm)}}function au(t,n){return function(e,r){t._tasks[n]&&(--t._active,++t._ended,t._tasks[n]=null,null==t._error&&(null!=e?cu(t,e):(t._data[n]=r,t._waiting?ou(t):su(t))))}}function cu(t,n){var e,r=t._tasks.length;for(t._error=n,t._data=void 0,t._waiting=NaN;--r>=0;)if((e=t._tasks[r])&&(t._tasks[r]=null,e.abort))try{e.abort()}catch(t){}t._active=NaN,su(t)}function su(t){if(!t._active&&t._call){var n=t._data;t._data=void 0,t._call(t._error,n)}}function fu(t){return new iu(arguments.length?+t:1/0)}function lu(t){return function(n,e){t(null==n?e:null)}}function hu(t){var n=t.responseType;return n&&"text"!==n?t.response:t.responseText}function pu(t,n){return function(e){return t(e.responseText,n)}}function du(t){function n(n){var o=n+"",u=e.get(o);if(!u){if(i!==xm)return i;e.set(o,u=r.push(n))}return t[(u-1)%t.length]}var e=Ie(),r=[],i=xm;return t=null==t?[]:mm.call(t),n.domain=function(t){if(!arguments.length)return r.slice();r=[],e=Ie();for(var i,o,u=-1,a=t.length;++u<a;)e.has(o=(i=t[u])+"")||e.set(o,r.push(i));return n},n.range=function(e){return arguments.length?(t=mm.call(e),n):t.slice()},n.unknown=function(t){return arguments.length?(i=t,n):i},n.copy=function(){return du().domain(r).range(t).unknown(i)},n}function vu(){function t(){var t=i().length,r=u[1]<u[0],l=u[r-0],h=u[1-r];n=(h-l)/Math.max(1,t-c+2*s),a&&(n=Math.floor(n)),l+=(h-l-n*(t-c))*f,e=n*(1-c),a&&(l=Math.round(l),e=Math.round(e));var p=Is(t).map(function(t){return l+n*t});return o(r?p.reverse():p)}var n,e,r=du().unknown(void 0),i=r.domain,o=r.range,u=[0,1],a=!1,c=0,s=0,f=.5;return delete r.unknown,r.domain=function(n){return arguments.length?(i(n),t()):i()},r.range=function(n){return arguments.length?(u=[+n[0],+n[1]],t()):u.slice()},r.rangeRound=function(n){return u=[+n[0],+n[1]],a=!0,t()},r.bandwidth=function(){return e},r.step=function(){return n},r.round=function(n){return arguments.length?(a=!!n,t()):a},r.padding=function(n){return arguments.length?(c=s=Math.max(0,Math.min(1,n)),t()):c},r.paddingInner=function(n){return arguments.length?(c=Math.max(0,Math.min(1,n)),t()):c},r.paddingOuter=function(n){return arguments.length?(s=Math.max(0,Math.min(1,n)),t()):s},r.align=function(n){return arguments.length?(f=Math.max(0,Math.min(1,n)),t()):f},r.copy=function(){return vu().domain(i()).range(u).round(a).paddingInner(c).paddingOuter(s).align(f)},t()}function _u(t){var n=t.copy;return t.padding=t.paddingOuter,delete t.paddingInner,delete t.paddingOuter,t.copy=function(){return _u(n())},t}function yu(){return _u(vu().paddingInner(1))}function gu(t,n){return(n-=t=+t)?function(e){return(e-t)/n}:bm(n)}function mu(t){return function(n,e){var r=t(n=+n,e=+e);return function(t){return t<=n?0:t>=e?1:r(t)}}}function xu(t){return function(n,e){var r=t(n=+n,e=+e);return function(t){return t<=0?n:t>=1?e:r(t)}}}function bu(t,n,e,r){var i=t[0],o=t[1],u=n[0],a=n[1];return o<i?(i=e(o,i),u=r(a,u)):(i=e(i,o),u=r(u,a)),function(t){return u(i(t))}}function wu(t,n,e,r){var i=Math.min(t.length,n.length)-1,o=new Array(i),u=new Array(i),a=-1;for(t[i]<t[0]&&(t=t.slice().reverse(),n=n.slice().reverse());++a<i;)o[a]=e(t[a],t[a+1]),u[a]=r(n[a],n[a+1]);return function(n){var e=Es(t,n,1,i)-1;return u[e](o[e](n))}}function Mu(t,n){return n.domain(t.domain()).range(t.range()).interpolate(t.interpolate()).clamp(t.clamp())}function Tu(t,n){function e(){return i=Math.min(a.length,c.length)>2?wu:bu,o=u=null,r}function r(n){return(o||(o=i(a,c,f?mu(t):t,s)))(+n)}var i,o,u,a=Mm,c=Mm,s=mh,f=!1;return r.invert=function(t){return(u||(u=i(c,a,gu,f?xu(n):n)))(+t)},r.domain=function(t){return arguments.length?(a=gm.call(t,wm),e()):a.slice()},r.range=function(t){return arguments.length?(c=mm.call(t),e()):c.slice()},r.rangeRound=function(t){return c=mm.call(t),s=xh,e()},r.clamp=function(t){return arguments.length?(f=!!t,e()):f},r.interpolate=function(t){return arguments.length?(s=t,e()):s},e()}function Nu(t){var n=t.domain;return t.ticks=function(t){var e=n();return Hs(e[0],e[e.length-1],null==t?10:t)},t.tickFormat=function(t,e){return Tm(n(),t,e)},t.nice=function(r){var i=n(),o=i.length-1,u=null==r?10:r,a=i[0],c=i[o],s=e(a,c,u);return s&&(s=e(Math.floor(a/s)*s,Math.ceil(c/s)*s,u),i[0]=Math.floor(a/s)*s,i[o]=Math.ceil(c/s)*s,n(i)),t},t}function ku(){var t=Tu(gu,dh);return t.copy=function(){return Mu(t,ku())},Nu(t)}function Su(){function t(t){return+t}var n=[0,1];return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=gm.call(e,wm),t):n.slice()},t.copy=function(){return Su().domain(n)},Nu(t)}function Eu(t,n){return(n=Math.log(n/t))?function(e){return Math.log(e/t)/n}:bm(n)}function Au(t,n){return t<0?function(e){return-Math.pow(-n,e)*Math.pow(-t,1-e)}:function(e){return Math.pow(n,e)*Math.pow(t,1-e)}}function Cu(t){return isFinite(t)?+("1e"+t):t<0?0:t}function zu(t){return 10===t?Cu:t===Math.E?Math.exp:function(n){return Math.pow(t,n)}}function Pu(t){return t===Math.E?Math.log:10===t&&Math.log10||2===t&&Math.log2||(t=Math.log(t),function(n){return Math.log(n)/t})}function Ru(t){return function(n){return-t(-n)}}function qu(){function n(){return o=Pu(i),u=zu(i),r()[0]<0&&(o=Ru(o),u=Ru(u)),e}var e=Tu(Eu,Au).domain([1,10]),r=e.domain,i=10,o=Pu(10),u=zu(10);return e.base=function(t){return arguments.length?(i=+t,n()):i},e.domain=function(t){return arguments.length?(r(t),n()):r()},e.ticks=function(t){var n,e=r(),a=e[0],c=e[e.length-1];(n=c<a)&&(h=a,a=c,c=h);var s,f,l,h=o(a),p=o(c),d=null==t?10:+t,v=[];if(!(i%1)&&p-h<d){if(h=Math.round(h)-1,p=Math.round(p)+1,a>0){for(;h<p;++h)for(f=1,s=u(h);f<i;++f)if(l=s*f,!(l<a)){if(l>c)break;v.push(l)}}else for(;h<p;++h)for(f=i-1,s=u(h);f>=1;--f)if(l=s*f,!(l<a)){if(l>c)break;v.push(l)}}else v=Hs(h,p,Math.min(p-h,d)).map(u);return n?v.reverse():v},e.tickFormat=function(n,r){if(null==r&&(r=10===i?".0e":","),"function"!=typeof r&&(r=t.format(r)),n===1/0)return r;null==n&&(n=10);var a=Math.max(1,i*n/e.ticks().length);return function(t){var n=t/u(Math.round(o(t)));return n*i<i-.5&&(n*=i),n<=a?r(t):""}},e.nice=function(){return r(Nm(r(),{floor:function(t){return u(Math.floor(o(t)))},ceil:function(t){return u(Math.ceil(o(t)))}}))},e.copy=function(){return Mu(e,qu().base(i))},e}function Lu(t,n){return t<0?-Math.pow(-t,n):Math.pow(t,n)}function Uu(){function t(t,n){return(n=Lu(n,e)-(t=Lu(t,e)))?function(r){return(Lu(r,e)-t)/n}:bm(n)}function n(t,n){return n=Lu(n,e)-(t=Lu(t,e)),function(r){return Lu(t+n*r,1/e)}}var e=1,r=Tu(t,n),i=r.domain;return r.exponent=function(t){return arguments.length?(e=+t,i(i())):e},r.copy=function(){return Mu(r,Uu().exponent(e))},Nu(r)}function Du(){return Uu().exponent(.5)}function Ou(){function t(){var t=0,o=Math.max(1,r.length);for(i=new Array(o-1);++t<o;)i[t-1]=Ws(e,t/o);return n}function n(t){if(!isNaN(t=+t))return r[Es(i,t)]}var e=[],r=[],i=[];return n.invertExtent=function(t){var n=r.indexOf(t);return n<0?[NaN,NaN]:[n>0?i[n-1]:e[0],n<i.length?i[n]:e[e.length-1]]},n.domain=function(n){if(!arguments.length)return e.slice();e=[];for(var r,i=0,o=n.length;i<o;++i)r=n[i],null==r||isNaN(r=+r)||e.push(r);return e.sort(Ns),t()},n.range=function(n){return arguments.length?(r=mm.call(n),t()):r.slice()},n.quantiles=function(){return i.slice()},n.copy=function(){return Ou().domain(e).range(r)},n}function Fu(){function t(t){if(t<=t)return u[Es(o,t,0,i)]}function n(){var n=-1;for(o=new Array(i);++n<i;)o[n]=((n+1)*r-(n-i)*e)/(i+1);return t}var e=0,r=1,i=1,o=[.5],u=[0,1];return t.domain=function(t){return arguments.length?(e=+t[0],r=+t[1],n()):[e,r]},t.range=function(t){return arguments.length?(i=(u=mm.call(t)).length-1,n()):u.slice()},t.invertExtent=function(t){var n=u.indexOf(t);return n<0?[NaN,NaN]:n<1?[e,o[0]]:n>=i?[o[i-1],r]:[o[n-1],o[n]]},t.copy=function(){return Fu().domain([e,r]).range(u)},Nu(t)}function Iu(){function t(t){if(t<=t)return e[Es(n,t,0,r)]}var n=[.5],e=[0,1],r=1;return t.domain=function(i){return arguments.length?(n=mm.call(i),r=Math.min(n.length,e.length-1),t):n.slice()},t.range=function(i){return arguments.length?(e=mm.call(i),r=Math.min(n.length,e.length-1),t):e.slice()},t.invertExtent=function(t){var r=e.indexOf(t);return[n[r-1],n[r]]},t.copy=function(){return Iu().domain(n).range(e)},t}function Yu(t,n,e,r){function i(n){return t(n=new Date(+n)),n}return i.floor=i,i.ceil=function(e){return t(e=new Date(e-1)),n(e,1),t(e),e},i.round=function(t){var n=i(t),e=i.ceil(t);return t-n<e-t?n:e},i.offset=function(t,e){return n(t=new Date(+t),null==e?1:Math.floor(e)),t},i.range=function(e,r,o){var u=[];if(e=i.ceil(e),o=null==o?1:Math.floor(o),!(e<r&&o>0))return u;do u.push(new Date(+e));while(n(e,o),t(e),e<r);return u},i.filter=function(e){return Yu(function(n){if(n>=n)for(;t(n),!e(n);)n.setTime(n-1)},function(t,r){if(t>=t)for(;--r>=0;)for(;n(t,1),!e(t););})},e&&(i.count=function(n,r){return km.setTime(+n),Sm.setTime(+r),t(km),t(Sm),Math.floor(e(km,Sm))},i.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?i.filter(r?function(n){return r(n)%t===0}:function(n){return i.count(0,n)%t===0}):i:null}),i}function Bu(t){return Yu(function(n){n.setDate(n.getDate()-(n.getDay()+7-t)%7),n.setHours(0,0,0,0)},function(t,n){t.setDate(t.getDate()+7*n)},function(t,n){return(n-t-(n.getTimezoneOffset()-t.getTimezoneOffset())*zm)/qm})}function ju(t){return Yu(function(n){n.setUTCDate(n.getUTCDate()-(n.getUTCDay()+7-t)%7),n.setUTCHours(0,0,0,0)},function(t,n){t.setUTCDate(t.getUTCDate()+7*n)},function(t,n){return(n-t)/qm})}function Hu(t){if(0<=t.y&&t.y<100){var n=new Date(-1,t.m,t.d,t.H,t.M,t.S,t.L);return n.setFullYear(t.y),n}return new Date(t.y,t.m,t.d,t.H,t.M,t.S,t.L)}function Xu(t){if(0<=t.y&&t.y<100){var n=new Date(Date.UTC(-1,t.m,t.d,t.H,t.M,t.S,t.L));return n.setUTCFullYear(t.y),n}return new Date(Date.UTC(t.y,t.m,t.d,t.H,t.M,t.S,t.L))}function Vu(t){return{y:t,m:0,d:1,H:0,M:0,S:0,L:0}}function Wu(t){function n(t,n){return function(e){var r,i,o,u=[],a=-1,c=0,s=t.length;for(e instanceof Date||(e=new Date(+e));++a<s;)37===t.charCodeAt(a)&&(u.push(t.slice(c,a)),null!=(i=Px[r=t.charAt(++a)])?r=t.charAt(++a):i="e"===r?" ":"0",(o=n[r])&&(r=o(e,i)),u.push(r),c=a+1);return u.push(t.slice(c,a)),u.join("")}}function e(t,n){return function(e){var i=Vu(1900),o=r(i,t,e+="",0);if(o!=e.length)return null;if("p"in i&&(i.H=i.H%12+12*i.p),"W"in i||"U"in i){"w"in i||(i.w="W"in i?1:0);var u="Z"in i?Xu(Vu(i.y)).getUTCDay():n(Vu(i.y)).getDay();i.m=0,i.d="W"in i?(i.w+6)%7+7*i.W-(u+5)%7:i.w+7*i.U-(u+6)%7}return"Z"in i?(i.H+=i.Z/100|0,i.M+=i.Z%100,Xu(i)):n(i)}}function r(t,n,e,r){for(var i,o,u=0,a=n.length,c=e.length;u<a;){if(r>=c)return-1;if(i=n.charCodeAt(u++),37===i){if(i=n.charAt(u++),o=B[i in Px?n.charAt(u++):i],!o||(r=o(t,e,r))<0)return-1}else if(i!=e.charCodeAt(r++))return-1}return r}function i(t,n,e){var r=C.exec(n.slice(e));return r?(t.p=z[r[0].toLowerCase()],e+r[0].length):-1}function o(t,n,e){var r=q.exec(n.slice(e));return r?(t.w=L[r[0].toLowerCase()],e+r[0].length):-1}function u(t,n,e){var r=P.exec(n.slice(e));return r?(t.w=R[r[0].toLowerCase()],e+r[0].length):-1;
}function a(t,n,e){var r=O.exec(n.slice(e));return r?(t.m=F[r[0].toLowerCase()],e+r[0].length):-1}function c(t,n,e){var r=U.exec(n.slice(e));return r?(t.m=D[r[0].toLowerCase()],e+r[0].length):-1}function s(t,n,e){return r(t,w,n,e)}function f(t,n,e){return r(t,M,n,e)}function l(t,n,e){return r(t,T,n,e)}function h(t){return S[t.getDay()]}function p(t){return k[t.getDay()]}function d(t){return A[t.getMonth()]}function v(t){return E[t.getMonth()]}function _(t){return N[+(t.getHours()>=12)]}function y(t){return S[t.getUTCDay()]}function g(t){return k[t.getUTCDay()]}function m(t){return A[t.getUTCMonth()]}function x(t){return E[t.getUTCMonth()]}function b(t){return N[+(t.getUTCHours()>=12)]}var w=t.dateTime,M=t.date,T=t.time,N=t.periods,k=t.days,S=t.shortDays,E=t.months,A=t.shortMonths,C=Gu(N),z=Ju(N),P=Gu(k),R=Ju(k),q=Gu(S),L=Ju(S),U=Gu(E),D=Ju(E),O=Gu(A),F=Ju(A),I={a:h,A:p,b:d,B:v,c:null,d:ha,e:ha,H:pa,I:da,j:va,L:_a,m:ya,M:ga,p:_,S:ma,U:xa,w:ba,W:wa,x:null,X:null,y:Ma,Y:Ta,Z:Na,"%":Ia},Y={a:y,A:g,b:m,B:x,c:null,d:ka,e:ka,H:Sa,I:Ea,j:Aa,L:Ca,m:za,M:Pa,p:b,S:Ra,U:qa,w:La,W:Ua,x:null,X:null,y:Da,Y:Oa,Z:Fa,"%":Ia},B={a:o,A:u,b:a,B:c,c:s,d:oa,e:oa,H:aa,I:aa,j:ua,L:fa,m:ia,M:ca,p:i,S:sa,U:Ku,w:Qu,W:ta,x:f,X:l,y:ea,Y:na,Z:ra,"%":la};return I.x=n(M,I),I.X=n(T,I),I.c=n(w,I),Y.x=n(M,Y),Y.X=n(T,Y),Y.c=n(w,Y),{format:function(t){var e=n(t+="",I);return e.toString=function(){return t},e},parse:function(t){var n=e(t+="",Hu);return n.toString=function(){return t},n},utcFormat:function(t){var e=n(t+="",Y);return e.toString=function(){return t},e},utcParse:function(t){var n=e(t,Xu);return n.toString=function(){return t},n}}}function $u(t,n,e){var r=t<0?"-":"",i=(r?-t:t)+"",o=i.length;return r+(o<e?new Array(e-o+1).join(n)+i:i)}function Zu(t){return t.replace(Lx,"\\$&")}function Gu(t){return new RegExp("^(?:"+t.map(Zu).join("|")+")","i")}function Ju(t){for(var n={},e=-1,r=t.length;++e<r;)n[t[e].toLowerCase()]=e;return n}function Qu(t,n,e){var r=Rx.exec(n.slice(e,e+1));return r?(t.w=+r[0],e+r[0].length):-1}function Ku(t,n,e){var r=Rx.exec(n.slice(e));return r?(t.U=+r[0],e+r[0].length):-1}function ta(t,n,e){var r=Rx.exec(n.slice(e));return r?(t.W=+r[0],e+r[0].length):-1}function na(t,n,e){var r=Rx.exec(n.slice(e,e+4));return r?(t.y=+r[0],e+r[0].length):-1}function ea(t,n,e){var r=Rx.exec(n.slice(e,e+2));return r?(t.y=+r[0]+(+r[0]>68?1900:2e3),e+r[0].length):-1}function ra(t,n,e){var r=/^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(n.slice(e,e+6));return r?(t.Z=r[1]?0:-(r[2]+(r[3]||"00")),e+r[0].length):-1}function ia(t,n,e){var r=Rx.exec(n.slice(e,e+2));return r?(t.m=r[0]-1,e+r[0].length):-1}function oa(t,n,e){var r=Rx.exec(n.slice(e,e+2));return r?(t.d=+r[0],e+r[0].length):-1}function ua(t,n,e){var r=Rx.exec(n.slice(e,e+3));return r?(t.m=0,t.d=+r[0],e+r[0].length):-1}function aa(t,n,e){var r=Rx.exec(n.slice(e,e+2));return r?(t.H=+r[0],e+r[0].length):-1}function ca(t,n,e){var r=Rx.exec(n.slice(e,e+2));return r?(t.M=+r[0],e+r[0].length):-1}function sa(t,n,e){var r=Rx.exec(n.slice(e,e+2));return r?(t.S=+r[0],e+r[0].length):-1}function fa(t,n,e){var r=Rx.exec(n.slice(e,e+3));return r?(t.L=+r[0],e+r[0].length):-1}function la(t,n,e){var r=qx.exec(n.slice(e,e+1));return r?e+r[0].length:-1}function ha(t,n){return $u(t.getDate(),n,2)}function pa(t,n){return $u(t.getHours(),n,2)}function da(t,n){return $u(t.getHours()%12||12,n,2)}function va(t,n){return $u(1+Ym.count(ox(t),t),n,3)}function _a(t,n){return $u(t.getMilliseconds(),n,3)}function ya(t,n){return $u(t.getMonth()+1,n,2)}function ga(t,n){return $u(t.getMinutes(),n,2)}function ma(t,n){return $u(t.getSeconds(),n,2)}function xa(t,n){return $u(jm.count(ox(t),t),n,2)}function ba(t){return t.getDay()}function wa(t,n){return $u(Hm.count(ox(t),t),n,2)}function Ma(t,n){return $u(t.getFullYear()%100,n,2)}function Ta(t,n){return $u(t.getFullYear()%1e4,n,4)}function Na(t){var n=t.getTimezoneOffset();return(n>0?"-":(n*=-1,"+"))+$u(n/60|0,"0",2)+$u(n%60,"0",2)}function ka(t,n){return $u(t.getUTCDate(),n,2)}function Sa(t,n){return $u(t.getUTCHours(),n,2)}function Ea(t,n){return $u(t.getUTCHours()%12||12,n,2)}function Aa(t,n){return $u(1+lx.count(Ax(t),t),n,3)}function Ca(t,n){return $u(t.getUTCMilliseconds(),n,3)}function za(t,n){return $u(t.getUTCMonth()+1,n,2)}function Pa(t,n){return $u(t.getUTCMinutes(),n,2)}function Ra(t,n){return $u(t.getUTCSeconds(),n,2)}function qa(t,n){return $u(px.count(Ax(t),t),n,2)}function La(t){return t.getUTCDay()}function Ua(t,n){return $u(dx.count(Ax(t),t),n,2)}function Da(t,n){return $u(t.getUTCFullYear()%100,n,2)}function Oa(t,n){return $u(t.getUTCFullYear()%1e4,n,4)}function Fa(){return"+0000"}function Ia(){return"%"}function Ya(n){return Cx=Wu(n),t.timeFormat=Cx.format,t.timeParse=Cx.parse,t.utcFormat=Cx.utcFormat,t.utcParse=Cx.utcParse,Cx}function Ba(t){return t.toISOString()}function ja(t){var n=new Date(t);return isNaN(n)?null:n}function Ha(t){return new Date(t)}function Xa(t){return t instanceof Date?+t:+new Date(+t)}function Va(t,n,r,i,o,u,a,c,s){function f(e){return(a(e)<e?v:u(e)<e?_:o(e)<e?y:i(e)<e?g:n(e)<e?r(e)<e?m:x:t(e)<e?b:w)(e)}function l(n,r,i,o){if(null==n&&(n=10),"number"==typeof n){var u=Math.abs(i-r)/n,a=ks(function(t){return t[2]}).right(M,u);a===M.length?(o=e(r/Xx,i/Xx,n),n=t):a?(a=M[u/M[a-1][2]<M[a][2]/u?a-1:a],o=a[1],n=a[0]):(o=e(r,i,n),n=c)}return null==o?n:n.every(o)}var h=Tu(gu,dh),p=h.invert,d=h.domain,v=s(".%L"),_=s(":%S"),y=s("%I:%M"),g=s("%I %p"),m=s("%a %d"),x=s("%b %d"),b=s("%B"),w=s("%Y"),M=[[a,1,Fx],[a,5,5*Fx],[a,15,15*Fx],[a,30,30*Fx],[u,1,Ix],[u,5,5*Ix],[u,15,15*Ix],[u,30,30*Ix],[o,1,Yx],[o,3,3*Yx],[o,6,6*Yx],[o,12,12*Yx],[i,1,Bx],[i,2,2*Bx],[r,1,jx],[n,1,Hx],[n,3,3*Hx],[t,1,Xx]];return h.invert=function(t){return new Date(p(t))},h.domain=function(t){return arguments.length?d(gm.call(t,Xa)):d().map(Ha)},h.ticks=function(t,n){var e,r=d(),i=r[0],o=r[r.length-1],u=o<i;return u&&(e=i,i=o,o=e),e=l(t,i,o,n),e=e?e.range(i,o+1):[],u?e.reverse():e},h.tickFormat=function(t,n){return null==n?f:s(n)},h.nice=function(t,n){var e=d();return(t=l(t,e[0],e[e.length-1],n))?d(Nm(e,t)):h},h.copy=function(){return Mu(h,Va(t,n,r,i,o,u,a,c,s))},h}function Wa(t){var n=t.length;return function(e){return t[Math.max(0,Math.min(n-1,Math.floor(e*n)))]}}function $a(t){function n(n){var o=(n-e)/(r-e);return t(i?Math.max(0,Math.min(1,o)):o)}var e=0,r=1,i=!1;return n.domain=function(t){return arguments.length?(e=+t[0],r=+t[1],n):[e,r]},n.clamp=function(t){return arguments.length?(i=!!t,n):i},n.interpolator=function(e){return arguments.length?(t=e,n):t},n.copy=function(){return $a(t).domain([e,r]).clamp(i)},Nu(n)}function Za(t){return t.innerRadius}function Ga(t){return t.outerRadius}function Ja(t){return t.startAngle}function Qa(t){return t.endAngle}function Ka(t){return t&&t.padAngle}function tc(t){return t>=1?lb:t<=-1?-lb:Math.asin(t)}function nc(t,n,e,r,i,o,u,a){var c=e-t,s=r-n,f=u-i,l=a-o,h=(f*(n-o)-l*(t-i))/(l*c-f*s);return[t+h*c,n+h*s]}function ec(t,n,e,r,i,o,u){var a=t-e,c=n-r,s=(u?o:-o)/Math.sqrt(a*a+c*c),f=s*c,l=-s*a,h=t+f,p=n+l,d=e+f,v=r+l,_=(h+d)/2,y=(p+v)/2,g=d-h,m=v-p,x=g*g+m*m,b=i-o,w=h*v-d*p,M=(m<0?-1:1)*Math.sqrt(Math.max(0,b*b*x-w*w)),T=(w*m-g*M)/x,N=(-w*g-m*M)/x,k=(w*m+g*M)/x,S=(-w*g+m*M)/x,E=T-_,A=N-y,C=k-_,z=S-y;return E*E+A*A>C*C+z*z&&(T=k,N=S),{cx:T,cy:N,x01:-f,y01:-l,x11:T*(i/b-1),y11:N*(i/b-1)}}function rc(t){this._context=t}function ic(t){return t[0]}function oc(t){return t[1]}function uc(t){this._curve=t}function ac(t){function n(n){return new uc(t(n))}return n._curve=t,n}function cc(t){var n=t.curve;return t.angle=t.x,delete t.x,t.radius=t.y,delete t.y,t.curve=function(t){return arguments.length?n(ac(t)):n()._curve},t}function sc(t,n,e){t._context.bezierCurveTo((2*t._x0+t._x1)/3,(2*t._y0+t._y1)/3,(t._x0+2*t._x1)/3,(t._y0+2*t._y1)/3,(t._x0+4*t._x1+n)/6,(t._y0+4*t._y1+e)/6)}function fc(t){this._context=t}function lc(t){this._context=t}function hc(t){this._context=t}function pc(t,n){this._basis=new fc(t),this._beta=n}function dc(t,n,e){t._context.bezierCurveTo(t._x1+t._k*(t._x2-t._x0),t._y1+t._k*(t._y2-t._y0),t._x2+t._k*(t._x1-n),t._y2+t._k*(t._y1-e),t._x2,t._y2)}function vc(t,n){this._context=t,this._k=(1-n)/6}function _c(t,n){this._context=t,this._k=(1-n)/6}function yc(t,n){this._context=t,this._k=(1-n)/6}function gc(t,n,e){var r=t._x1,i=t._y1,o=t._x2,u=t._y2;if(t._l01_a>sb){var a=2*t._l01_2a+3*t._l01_a*t._l12_a+t._l12_2a,c=3*t._l01_a*(t._l01_a+t._l12_a);r=(r*a-t._x0*t._l12_2a+t._x2*t._l01_2a)/c,i=(i*a-t._y0*t._l12_2a+t._y2*t._l01_2a)/c}if(t._l23_a>sb){var s=2*t._l23_2a+3*t._l23_a*t._l12_a+t._l12_2a,f=3*t._l23_a*(t._l23_a+t._l12_a);o=(o*s+t._x1*t._l23_2a-n*t._l12_2a)/f,u=(u*s+t._y1*t._l23_2a-e*t._l12_2a)/f}t._context.bezierCurveTo(r,i,o,u,t._x2,t._y2)}function mc(t,n){this._context=t,this._alpha=n}function xc(t,n){this._context=t,this._alpha=n}function bc(t,n){this._context=t,this._alpha=n}function wc(t){this._context=t}function Mc(t){return t<0?-1:1}function Tc(t,n,e){var r=t._x1-t._x0,i=n-t._x1,o=(t._y1-t._y0)/(r||i<0&&-0),u=(e-t._y1)/(i||r<0&&-0),a=(o*i+u*r)/(r+i);return(Mc(o)+Mc(u))*Math.min(Math.abs(o),Math.abs(u),.5*Math.abs(a))||0}function Nc(t,n){var e=t._x1-t._x0;return e?(3*(t._y1-t._y0)/e-n)/2:n}function kc(t,n,e){var r=t._x0,i=t._y0,o=t._x1,u=t._y1,a=(o-r)/3;t._context.bezierCurveTo(r+a,i+a*n,o-a,u-a*e,o,u)}function Sc(t){this._context=t}function Ec(t){this._context=new Ac(t)}function Ac(t){this._context=t}function Cc(t){return new Sc(t)}function zc(t){return new Ec(t)}function Pc(t){this._context=t}function Rc(t){var n,e,r=t.length-1,i=new Array(r),o=new Array(r),u=new Array(r);for(i[0]=0,o[0]=2,u[0]=t[0]+2*t[1],n=1;n<r-1;++n)i[n]=1,o[n]=4,u[n]=4*t[n]+2*t[n+1];for(i[r-1]=2,o[r-1]=7,u[r-1]=8*t[r-1]+t[r],n=1;n<r;++n)e=i[n]/o[n-1],o[n]-=e,u[n]-=e*u[n-1];for(i[r-1]=u[r-1]/o[r-1],n=r-2;n>=0;--n)i[n]=(u[n]-i[n+1])/o[n];for(o[r-1]=(t[r]+i[r-1])/2,n=0;n<r-1;++n)o[n]=2*t[n+1]-i[n+1];return[i,o]}function qc(t,n){this._context=t,this._t=n}function Lc(t){return new qc(t,0)}function Uc(t){return new qc(t,1)}function Dc(t,n){return t[n]}function Oc(t){for(var n,e=0,r=-1,i=t.length;++r<i;)(n=+t[r][1])&&(e+=n);return e}function Fc(t){return t[0]}function Ic(t){return t[1]}function Yc(){this._=null}function Bc(t){t.U=t.C=t.L=t.R=t.P=t.N=null}function jc(t,n){var e=n,r=n.R,i=e.U;i?i.L===e?i.L=r:i.R=r:t._=r,r.U=i,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}function Hc(t,n){var e=n,r=n.L,i=e.U;i?i.L===e?i.L=r:i.R=r:t._=r,r.U=i,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}function Xc(t){for(;t.L;)t=t.L;return t}function Vc(t,n,e,r){var i=[null,null],o=mw.push(i)-1;return i.left=t,i.right=n,e&&$c(i,t,n,e),r&&$c(i,n,t,r),yw[t.index].halfedges.push(o),yw[n.index].halfedges.push(o),i}function Wc(t,n,e){var r=[n,e];return r.left=t,r}function $c(t,n,e,r){t[0]||t[1]?t.left===e?t[1]=r:t[0]=r:(t[0]=r,t.left=n,t.right=e)}function Zc(t,n,e,r,i){var o,u=t[0],a=t[1],c=u[0],s=u[1],f=a[0],l=a[1],h=0,p=1,d=f-c,v=l-s;if(o=n-c,d||!(o>0)){if(o/=d,d<0){if(o<h)return;o<p&&(p=o)}else if(d>0){if(o>p)return;o>h&&(h=o)}if(o=r-c,d||!(o<0)){if(o/=d,d<0){if(o>p)return;o>h&&(h=o)}else if(d>0){if(o<h)return;o<p&&(p=o)}if(o=e-s,v||!(o>0)){if(o/=v,v<0){if(o<h)return;o<p&&(p=o)}else if(v>0){if(o>p)return;o>h&&(h=o)}if(o=i-s,v||!(o<0)){if(o/=v,v<0){if(o>p)return;o>h&&(h=o)}else if(v>0){if(o<h)return;o<p&&(p=o)}return!(h>0||p<1)||(h>0&&(t[0]=[c+h*d,s+h*v]),p<1&&(t[1]=[c+p*d,s+p*v]),!0)}}}}}function Gc(t,n,e,r,i){var o=t[1];if(o)return!0;var u,a,c=t[0],s=t.left,f=t.right,l=s[0],h=s[1],p=f[0],d=f[1],v=(l+p)/2,_=(h+d)/2;if(d===h){if(v<n||v>=r)return;if(l>p){if(c){if(c[1]>=i)return}else c=[v,e];o=[v,i]}else{if(c){if(c[1]<e)return}else c=[v,i];o=[v,e]}}else if(u=(l-p)/(d-h),a=_-u*v,u<-1||u>1)if(l>p){if(c){if(c[1]>=i)return}else c=[(e-a)/u,e];o=[(i-a)/u,i]}else{if(c){if(c[1]<e)return}else c=[(i-a)/u,i];o=[(e-a)/u,e]}else if(h<d){if(c){if(c[0]>=r)return}else c=[n,u*n+a];o=[r,u*r+a]}else{if(c){if(c[0]<n)return}else c=[r,u*r+a];o=[n,u*n+a]}return t[0]=c,t[1]=o,!0}function Jc(t,n,e,r){for(var i,o=mw.length;o--;)Gc(i=mw[o],t,n,e,r)&&Zc(i,t,n,e,r)&&(Math.abs(i[0][0]-i[1][0])>ww||Math.abs(i[0][1]-i[1][1])>ww)||delete mw[o]}function Qc(t){return yw[t.index]={site:t,halfedges:[]}}function Kc(t,n){var e=t.site,r=n.left,i=n.right;return e===i&&(i=r,r=e),i?Math.atan2(i[1]-r[1],i[0]-r[0]):(e===r?(r=n[1],i=n[0]):(r=n[0],i=n[1]),Math.atan2(r[0]-i[0],i[1]-r[1]))}function ts(t,n){return n[+(n.left!==t.site)]}function ns(t,n){return n[+(n.left===t.site)]}function es(){for(var t,n,e,r,i=0,o=yw.length;i<o;++i)if((t=yw[i])&&(r=(n=t.halfedges).length)){var u=new Array(r),a=new Array(r);for(e=0;e<r;++e)u[e]=e,a[e]=Kc(t,mw[n[e]]);for(u.sort(function(t,n){return a[n]-a[t]}),e=0;e<r;++e)a[e]=n[u[e]];for(e=0;e<r;++e)n[e]=a[e]}}function rs(t,n,e,r){var i,o,u,a,c,s,f,l,h,p,d,v,_=yw.length,y=!0;for(i=0;i<_;++i)if(o=yw[i]){for(u=o.site,c=o.halfedges,a=c.length;a--;)mw[c[a]]||c.splice(a,1);for(a=0,s=c.length;a<s;)p=ns(o,mw[c[a]]),d=p[0],v=p[1],f=ts(o,mw[c[++a%s]]),l=f[0],h=f[1],(Math.abs(d-l)>ww||Math.abs(v-h)>ww)&&(c.splice(a,0,mw.push(Wc(u,p,Math.abs(d-t)<ww&&r-v>ww?[t,Math.abs(l-t)<ww?h:r]:Math.abs(v-r)<ww&&e-d>ww?[Math.abs(h-r)<ww?l:e,r]:Math.abs(d-e)<ww&&v-n>ww?[e,Math.abs(l-e)<ww?h:n]:Math.abs(v-n)<ww&&d-t>ww?[Math.abs(h-n)<ww?l:t,n]:null))-1),++s);s&&(y=!1)}if(y){var g,m,x,b=1/0;for(i=0,y=null;i<_;++i)(o=yw[i])&&(u=o.site,g=u[0]-t,m=u[1]-n,x=g*g+m*m,x<b&&(b=x,y=o));if(y){var w=[t,n],M=[t,r],T=[e,r],N=[e,n];y.halfedges.push(mw.push(Wc(u=y.site,w,M))-1,mw.push(Wc(u,M,T))-1,mw.push(Wc(u,T,N))-1,mw.push(Wc(u,N,w))-1)}}for(i=0;i<_;++i)(o=yw[i])&&(o.halfedges.length||delete yw[i])}function is(){Bc(this),this.x=this.y=this.arc=this.site=this.cy=null}function os(t){var n=t.P,e=t.N;if(n&&e){var r=n.site,i=t.site,o=e.site;if(r!==o){var u=i[0],a=i[1],c=r[0]-u,s=r[1]-a,f=o[0]-u,l=o[1]-a,h=2*(c*l-s*f);if(!(h>=-Mw)){var p=c*c+s*s,d=f*f+l*l,v=(l*p-s*d)/h,_=(c*d-f*p)/h,y=xw.pop()||new is;y.arc=t,y.site=i,y.x=v+u,y.y=(y.cy=_+a)+Math.sqrt(v*v+_*_),t.circle=y;for(var g=null,m=gw._;m;)if(y.y<m.y||y.y===m.y&&y.x<=m.x){if(!m.L){g=m.P;break}m=m.L}else{if(!m.R){g=m;break}m=m.R}gw.insert(g,y),g||(vw=y)}}}}function us(t){var n=t.circle;n&&(n.P||(vw=n.N),gw.remove(n),xw.push(n),Bc(n),t.circle=null)}function as(){Bc(this),this.edge=this.site=this.circle=null}function cs(t){var n=bw.pop()||new as;return n.site=t,n}function ss(t){us(t),_w.remove(t),bw.push(t),Bc(t)}function fs(t){var n=t.circle,e=n.x,r=n.cy,i=[e,r],o=t.P,u=t.N,a=[t];ss(t);for(var c=o;c.circle&&Math.abs(e-c.circle.x)<ww&&Math.abs(r-c.circle.cy)<ww;)o=c.P,a.unshift(c),ss(c),c=o;a.unshift(c),us(c);for(var s=u;s.circle&&Math.abs(e-s.circle.x)<ww&&Math.abs(r-s.circle.cy)<ww;)u=s.N,a.push(s),ss(s),s=u;a.push(s),us(s);var f,l=a.length;for(f=1;f<l;++f)s=a[f],c=a[f-1],$c(s.edge,c.site,s.site,i);c=a[0],s=a[l-1],s.edge=Vc(c.site,s.site,null,i),os(c),os(s)}function ls(t){for(var n,e,r,i,o=t[0],u=t[1],a=_w._;a;)if(r=hs(a,u)-o,r>ww)a=a.L;else{if(i=o-ps(a,u),!(i>ww)){r>-ww?(n=a.P,e=a):i>-ww?(n=a,e=a.N):n=e=a;break}if(!a.R){n=a;break}a=a.R}Qc(t);var c=cs(t);if(_w.insert(n,c),n||e){if(n===e)return us(n),e=cs(n.site),_w.insert(c,e),c.edge=e.edge=Vc(n.site,c.site),os(n),void os(e);if(!e)return void(c.edge=Vc(n.site,c.site));us(n),us(e);var s=n.site,f=s[0],l=s[1],h=t[0]-f,p=t[1]-l,d=e.site,v=d[0]-f,_=d[1]-l,y=2*(h*_-p*v),g=h*h+p*p,m=v*v+_*_,x=[(_*g-p*m)/y+f,(h*m-v*g)/y+l];$c(e.edge,s,d,x),c.edge=Vc(s,t,null,x),e.edge=Vc(t,d,null,x),os(n),os(e)}}function hs(t,n){var e=t.site,r=e[0],i=e[1],o=i-n;if(!o)return r;var u=t.P;if(!u)return-(1/0);e=u.site;var a=e[0],c=e[1],s=c-n;if(!s)return a;var f=a-r,l=1/o-1/s,h=f/s;return l?(-h+Math.sqrt(h*h-2*l*(f*f/(-2*s)-c+s/2+i-o/2)))/l+r:(r+a)/2}function ps(t,n){var e=t.N;if(e)return hs(e,n);var r=t.site;return r[1]===n?r[0]:1/0}function ds(t,n,e){return(t[0]-e[0])*(n[1]-t[1])-(t[0]-n[0])*(e[1]-t[1])}function vs(t,n){return n[1]-t[1]||n[0]-t[0]}function _s(t,n){var e,r,i,o=t.sort(vs).pop();for(mw=[],yw=new Array(t.length),_w=new Yc,gw=new Yc;;)if(i=vw,o&&(!i||o[1]<i.y||o[1]===i.y&&o[0]<i.x))o[0]===e&&o[1]===r||(ls(o),e=o[0],r=o[1]),o=t.pop();else{if(!i)break;fs(i.arc)}if(es(),n){var u=+n[0][0],a=+n[0][1],c=+n[1][0],s=+n[1][1];Jc(u,a,c,s),rs(u,a,c,s)}this.edges=mw,this.cells=yw,_w=gw=mw=yw=null}function ys(t,n,e){this.target=t,this.type=n,this.transform=e}function gs(t,n,e){this.k=t,this.x=n,this.y=e}function ms(t){return t.__zoom||kw}function xs(){t.event.stopImmediatePropagation()}function bs(){return!t.event.button}function ws(){var t,n,e=this;return e instanceof SVGElement?(e=e.ownerSVGElement||e,t=e.width.baseVal.value,n=e.height.baseVal.value):(t=e.clientWidth,n=e.clientHeight),[[0,0],[t,n]]}function Ms(){return this.__zoom||kw}var Ts="4.5.0",Ns=function(t,n){return t<n?-1:t>n?1:t>=n?0:NaN},ks=function(t){return 1===t.length&&(t=n(t)),{left:function(n,e,r,i){for(null==r&&(r=0),null==i&&(i=n.length);r<i;){var o=r+i>>>1;t(n[o],e)<0?r=o+1:i=o}return r},right:function(n,e,r,i){for(null==r&&(r=0),null==i&&(i=n.length);r<i;){var o=r+i>>>1;t(n[o],e)>0?i=o:r=o+1}return r}}},Ss=ks(Ns),Es=Ss.right,As=Ss.left,Cs=function(t,n){return n<t?-1:n>t?1:n>=t?0:NaN},zs=function(t){return null===t?NaN:+t},Ps=function(t,n){var e,r,i=t.length,o=0,u=0,a=-1,c=0;if(null==n)for(;++a<i;)isNaN(e=zs(t[a]))||(r=e-o,o+=r/++c,u+=r*(e-o));else for(;++a<i;)isNaN(e=zs(n(t[a],a,t)))||(r=e-o,o+=r/++c,u+=r*(e-o));if(c>1)return u/(c-1)},Rs=function(t,n){var e=Ps(t,n);return e?Math.sqrt(e):e},qs=function(t,n){var e,r,i,o=-1,u=t.length;if(null==n){for(;++o<u;)if(null!=(r=t[o])&&r>=r){e=i=r;break}for(;++o<u;)null!=(r=t[o])&&(e>r&&(e=r),i<r&&(i=r))}else{for(;++o<u;)if(null!=(r=n(t[o],o,t))&&r>=r){e=i=r;break}for(;++o<u;)null!=(r=n(t[o],o,t))&&(e>r&&(e=r),i<r&&(i=r))}return[e,i]},Ls=Array.prototype,Us=Ls.slice,Ds=Ls.map,Os=function(t){return function(){return t}},Fs=function(t){return t},Is=function(t,n,e){t=+t,n=+n,e=(i=arguments.length)<2?(n=t,t=0,1):i<3?1:+e;for(var r=-1,i=0|Math.max(0,Math.ceil((n-t)/e)),o=new Array(i);++r<i;)o[r]=t+r*e;return o},Ys=Math.sqrt(50),Bs=Math.sqrt(10),js=Math.sqrt(2),Hs=function(t,n,r){var i=e(t,n,r);return Is(Math.ceil(t/i)*i,Math.floor(n/i)*i+i/2,i)},Xs=function(t){return Math.ceil(Math.log(t.length)/Math.LN2)+1},Vs=function(){function t(t){var i,o,u=t.length,a=new Array(u);for(i=0;i<u;++i)a[i]=n(t[i],i,t);var c=e(a),s=c[0],f=c[1],l=r(a,s,f);Array.isArray(l)||(l=Hs(s,f,l));for(var h=l.length;l[0]<=s;)l.shift(),--h;for(;l[h-1]>=f;)l.pop(),--h;var p,d=new Array(h+1);for(i=0;i<=h;++i)p=d[i]=[],p.x0=i>0?l[i-1]:s,p.x1=i<h?l[i]:f;for(i=0;i<u;++i)o=a[i],s<=o&&o<=f&&d[Es(l,o,0,h)].push(t[i]);return d}var n=Fs,e=qs,r=Xs;return t.value=function(e){return arguments.length?(n="function"==typeof e?e:Os(e),t):n},t.domain=function(n){return arguments.length?(e="function"==typeof n?n:Os([n[0],n[1]]),t):e},t.thresholds=function(n){return arguments.length?(r="function"==typeof n?n:Os(Array.isArray(n)?Us.call(n):n),t):r},t},Ws=function(t,n,e){if(null==e&&(e=zs),r=t.length){if((n=+n)<=0||r<2)return+e(t[0],0,t);if(n>=1)return+e(t[r-1],r-1,t);var r,i=(r-1)*n,o=Math.floor(i),u=+e(t[o],o,t),a=+e(t[o+1],o+1,t);return u+(a-u)*(i-o)}},$s=function(t,n,e){return t=Ds.call(t,zs).sort(Ns),Math.ceil((e-n)/(2*(Ws(t,.75)-Ws(t,.25))*Math.pow(t.length,-1/3)))},Zs=function(t,n,e){return Math.ceil((e-n)/(3.5*Rs(t)*Math.pow(t.length,-1/3)))},Gs=function(t,n){var e,r,i=-1,o=t.length;if(null==n){for(;++i<o;)if(null!=(r=t[i])&&r>=r){e=r;break}for(;++i<o;)null!=(r=t[i])&&r>e&&(e=r)}else{for(;++i<o;)if(null!=(r=n(t[i],i,t))&&r>=r){e=r;break}for(;++i<o;)null!=(r=n(t[i],i,t))&&r>e&&(e=r)}return e},Js=function(t,n){var e,r=0,i=t.length,o=-1,u=i;if(null==n)for(;++o<i;)isNaN(e=zs(t[o]))?--u:r+=e;else for(;++o<i;)isNaN(e=zs(n(t[o],o,t)))?--u:r+=e;if(u)return r/u},Qs=function(t,n){var e,r=[],i=t.length,o=-1;if(null==n)for(;++o<i;)isNaN(e=zs(t[o]))||r.push(e);else for(;++o<i;)isNaN(e=zs(n(t[o],o,t)))||r.push(e);return Ws(r.sort(Ns),.5)},Ks=function(t){for(var n,e,r,i=t.length,o=-1,u=0;++o<i;)u+=t[o].length;for(e=new Array(u);--i>=0;)for(r=t[i],n=r.length;--n>=0;)e[--u]=r[n];return e},tf=function(t,n){var e,r,i=-1,o=t.length;if(null==n){for(;++i<o;)if(null!=(r=t[i])&&r>=r){e=r;break}for(;++i<o;)null!=(r=t[i])&&e>r&&(e=r)}else{for(;++i<o;)if(null!=(r=n(t[i],i,t))&&r>=r){e=r;break}for(;++i<o;)null!=(r=n(t[i],i,t))&&e>r&&(e=r)}return e},nf=function(t){for(var n=0,e=t.length-1,r=t[0],i=new Array(e<0?0:e);n<e;)i[n]=[r,r=t[++n]];return i},ef=function(t,n){for(var e=n.length,r=new Array(e);e--;)r[e]=t[n[e]];return r},rf=function(t,n){if(e=t.length){var e,r,i=0,o=0,u=t[o];for(n||(n=Ns);++i<e;)(n(r=t[i],u)<0||0!==n(u,u))&&(u=r,o=i);return 0===n(u,u)?o:void 0}},of=function(t,n,e){for(var r,i,o=(null==e?t.length:e)-(n=null==n?0:+n);o;)i=Math.random()*o--|0,r=t[o+n],t[o+n]=t[i+n],t[i+n]=r;return t},uf=function(t,n){var e,r=0,i=t.length,o=-1;if(null==n)for(;++o<i;)(e=+t[o])&&(r+=e);else for(;++o<i;)(e=+n(t[o],o,t))&&(r+=e);return r},af=function(t){if(!(o=t.length))return[];for(var n=-1,e=tf(t,r),i=new Array(e);++n<e;)for(var o,u=-1,a=i[n]=new Array(o);++u<o;)a[u]=t[u][n];return i},cf=function(){return af(arguments)},sf=Array.prototype.slice,ff=function(t){return t},lf=1,hf=2,pf=3,df=4,vf=1e-6,_f={value:function(){}};d.prototype=p.prototype={constructor:d,on:function(t,n){var e,r=this._,i=v(t+"",r),o=-1,u=i.length;{if(!(arguments.length<2)){if(null!=n&&"function"!=typeof n)throw new Error("invalid callback: "+n);for(;++o<u;)if(e=(t=i[o]).type)r[e]=y(r[e],t.name,n);else if(null==n)for(e in r)r[e]=y(r[e],t.name,null);return this}for(;++o<u;)if((e=(t=i[o]).type)&&(e=_(r[e],t.name)))return e}},copy:function(){var t={},n=this._;for(var e in n)t[e]=n[e].slice();return new d(t)},call:function(t,n){if((e=arguments.length-2)>0)for(var e,r,i=new Array(e),o=0;o<e;++o)i[o]=arguments[o+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(r=this._[t],o=0,e=r.length;o<e;++o)r[o].value.apply(n,i)},apply:function(t,n,e){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],i=0,o=r.length;i<o;++i)r[i].value.apply(n,e)}};var yf="http://www.w3.org/1999/xhtml",gf={svg:"http://www.w3.org/2000/svg",xhtml:yf,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"},mf=function(t){var n=t+="",e=n.indexOf(":");return e>=0&&"xmlns"!==(n=t.slice(0,e))&&(t=t.slice(e+1)),gf.hasOwnProperty(n)?{space:gf[n],local:t}:t},xf=function(t){var n=mf(t);return(n.local?m:g)(n)},bf=0;b.prototype=x.prototype={constructor:b,get:function(t){for(var n=this._;!(n in t);)if(!(t=t.parentNode))return;return t[n]},set:function(t,n){return t[this._]=n},remove:function(t){return this._ in t&&delete t[this._]},toString:function(){return this._}};var wf=function(t){return function(){return this.matches(t)}};if("undefined"!=typeof document){var Mf=document.documentElement;if(!Mf.matches){var Tf=Mf.webkitMatchesSelector||Mf.msMatchesSelector||Mf.mozMatchesSelector||Mf.oMatchesSelector;wf=function(t){return function(){return Tf.call(this,t)}}}}var Nf=wf,kf={};if(t.event=null,"undefined"!=typeof document){var Sf=document.documentElement;"onmouseenter"in Sf||(kf={mouseenter:"mouseover",mouseleave:"mouseout"})}var Ef=function(t,n,e){var r,i,o=T(t+""),u=o.length;{if(!(arguments.length<2)){for(a=n?k:N,null==e&&(e=!1),r=0;r<u;++r)this.each(a(o[r],n,e));return this}var a=this.node().__on;if(a)for(var c,s=0,f=a.length;s<f;++s)for(r=0,c=a[s];r<u;++r)if((i=o[r]).type===c.type&&i.name===c.name)return c.value}},Af=function(){for(var n,e=t.event;n=e.sourceEvent;)e=n;return e},Cf=function(t,n){var e=t.ownerSVGElement||t;if(e.createSVGPoint){var r=e.createSVGPoint();return r.x=n.clientX,r.y=n.clientY,r=r.matrixTransform(t.getScreenCTM().inverse()),[r.x,r.y]}var i=t.getBoundingClientRect();return[n.clientX-i.left-t.clientLeft,n.clientY-i.top-t.clientTop]},zf=function(t){var n=Af();return n.changedTouches&&(n=n.changedTouches[0]),Cf(t,n)},Pf=function(t){return null==t?E:function(){return this.querySelector(t)}},Rf=function(t){"function"!=typeof t&&(t=Pf(t));for(var n=this._groups,e=n.length,r=new Array(e),i=0;i<e;++i)for(var o,u,a=n[i],c=a.length,s=r[i]=new Array(c),f=0;f<c;++f)(o=a[f])&&(u=t.call(o,o.__data__,f,a))&&("__data__"in o&&(u.__data__=o.__data__),s[f]=u);return new pt(r,this._parents)},qf=function(t){return null==t?A:function(){return this.querySelectorAll(t)}},Lf=function(t){"function"!=typeof t&&(t=qf(t));for(var n=this._groups,e=n.length,r=[],i=[],o=0;o<e;++o)for(var u,a=n[o],c=a.length,s=0;s<c;++s)(u=a[s])&&(r.push(t.call(u,u.__data__,s,a)),i.push(u));return new pt(r,i)},Uf=function(t){"function"!=typeof t&&(t=Nf(t));for(var n=this._groups,e=n.length,r=new Array(e),i=0;i<e;++i)for(var o,u=n[i],a=u.length,c=r[i]=[],s=0;s<a;++s)(o=u[s])&&t.call(o,o.__data__,s,u)&&c.push(o);return new pt(r,this._parents)},Df=function(t){return new Array(t.length)},Of=function(){return new pt(this._enter||this._groups.map(Df),this._parents)};C.prototype={constructor:C,appendChild:function(t){return this._parent.insertBefore(t,this._next)},insertBefore:function(t,n){return this._parent.insertBefore(t,n)},querySelector:function(t){return this._parent.querySelector(t)},querySelectorAll:function(t){return this._parent.querySelectorAll(t)}};var Ff=function(t){return function(){return t}},If="$",Yf=function(t,n){if(!t)return p=new Array(this.size()),s=-1,this.each(function(t){p[++s]=t}),p;var e=n?P:z,r=this._parents,i=this._groups;"function"!=typeof t&&(t=Ff(t));for(var o=i.length,u=new Array(o),a=new Array(o),c=new Array(o),s=0;s<o;++s){var f=r[s],l=i[s],h=l.length,p=t.call(f,f&&f.__data__,s,r),d=p.length,v=a[s]=new Array(d),_=u[s]=new Array(d),y=c[s]=new Array(h);e(f,l,v,_,y,p,n);for(var g,m,x=0,b=0;x<d;++x)if(g=v[x]){for(x>=b&&(b=x+1);!(m=_[b])&&++b<d;);g._next=m||null}}return u=new pt(u,r),u._enter=a,u._exit=c,u},Bf=function(){return new pt(this._exit||this._groups.map(Df),this._parents)},jf=function(t){for(var n=this._groups,e=t._groups,r=n.length,i=e.length,o=Math.min(r,i),u=new Array(r),a=0;a<o;++a)for(var c,s=n[a],f=e[a],l=s.length,h=u[a]=new Array(l),p=0;p<l;++p)(c=s[p]||f[p])&&(h[p]=c);for(;a<r;++a)u[a]=n[a];return new pt(u,this._parents)},Hf=function(){for(var t=this._groups,n=-1,e=t.length;++n<e;)for(var r,i=t[n],o=i.length-1,u=i[o];--o>=0;)(r=i[o])&&(u&&u!==r.nextSibling&&u.parentNode.insertBefore(r,u),u=r);return this},Xf=function(t){function n(n,e){return n&&e?t(n.__data__,e.__data__):!n-!e}t||(t=R);for(var e=this._groups,r=e.length,i=new Array(r),o=0;o<r;++o){for(var u,a=e[o],c=a.length,s=i[o]=new Array(c),f=0;f<c;++f)(u=a[f])&&(s[f]=u);s.sort(n)}return new pt(i,this._parents).order()},Vf=function(){var t=arguments[0];return arguments[0]=this,t.apply(null,arguments),this},Wf=function(){var t=new Array(this.size()),n=-1;return this.each(function(){t[++n]=this}),t},$f=function(){for(var t=this._groups,n=0,e=t.length;n<e;++n)for(var r=t[n],i=0,o=r.length;i<o;++i){var u=r[i];if(u)return u}return null},Zf=function(){var t=0;return this.each(function(){++t}),t},Gf=function(){return!this.node()},Jf=function(t){for(var n=this._groups,e=0,r=n.length;e<r;++e)for(var i,o=n[e],u=0,a=o.length;u<a;++u)(i=o[u])&&t.call(i,i.__data__,u,o);return this},Qf=function(t,n){var e=mf(t);if(arguments.length<2){var r=this.node();return e.local?r.getAttributeNS(e.space,e.local):r.getAttribute(e)}return this.each((null==n?e.local?L:q:"function"==typeof n?e.local?F:O:e.local?D:U)(e,n))},Kf=function(t){return t.ownerDocument&&t.ownerDocument.defaultView||t.document&&t||t.defaultView},tl=function(t,n,e){var r;return arguments.length>1?this.each((null==n?I:"function"==typeof n?B:Y)(t,n,null==e?"":e)):Kf(r=this.node()).getComputedStyle(r,null).getPropertyValue(t)},nl=function(t,n){return arguments.length>1?this.each((null==n?j:"function"==typeof n?X:H)(t,n)):this.node()[t]};$.prototype={add:function(t){var n=this._names.indexOf(t);n<0&&(this._names.push(t),this._node.setAttribute("class",this._names.join(" ")))},remove:function(t){var n=this._names.indexOf(t);n>=0&&(this._names.splice(n,1),this._node.setAttribute("class",this._names.join(" ")))},contains:function(t){return this._names.indexOf(t)>=0}};var el=function(t,n){var e=V(t+"");if(arguments.length<2){for(var r=W(this.node()),i=-1,o=e.length;++i<o;)if(!r.contains(e[i]))return!1;return!0}return this.each(("function"==typeof n?K:n?J:Q)(e,n))},rl=function(t){return arguments.length?this.each(null==t?tt:("function"==typeof t?et:nt)(t)):this.node().textContent},il=function(t){return arguments.length?this.each(null==t?rt:("function"==typeof t?ot:it)(t)):this.node().innerHTML},ol=function(){return this.each(ut)},ul=function(){return this.each(at)},al=function(t){var n="function"==typeof t?t:xf(t);return this.select(function(){return this.appendChild(n.apply(this,arguments))})},cl=function(t,n){var e="function"==typeof t?t:xf(t),r=null==n?ct:"function"==typeof n?n:Pf(n);return this.select(function(){return this.insertBefore(e.apply(this,arguments),r.apply(this,arguments)||null)})},sl=function(){return this.each(st)},fl=function(t){return arguments.length?this.property("__data__",t):this.node().__data__},ll=function(t,n){return this.each(("function"==typeof n?ht:lt)(t,n))},hl=[null];pt.prototype=dt.prototype={constructor:pt,select:Rf,selectAll:Lf,filter:Uf,data:Yf,enter:Of,exit:Bf,merge:jf,order:Hf,sort:Xf,call:Vf,nodes:Wf,node:$f,size:Zf,empty:Gf,each:Jf,attr:Qf,style:tl,property:nl,classed:el,text:rl,html:il,raise:ol,lower:ul,append:al,insert:cl,remove:sl,datum:fl,on:Ef,dispatch:ll};var pl=function(t){return"string"==typeof t?new pt([[document.querySelector(t)]],[document.documentElement]):new pt([[t]],hl)},dl=function(t){return"string"==typeof t?new pt([document.querySelectorAll(t)],[document.documentElement]):new pt([null==t?[]:t],hl)},vl=function(t,n,e){arguments.length<3&&(e=n,n=Af().changedTouches);for(var r,i=0,o=n?n.length:0;i<o;++i)if((r=n[i]).identifier===e)return Cf(t,r);return null},_l=function(t,n){null==n&&(n=Af().touches);for(var e=0,r=n?n.length:0,i=new Array(r);e<r;++e)i[e]=Cf(t,n[e]);return i},yl=function(){t.event.preventDefault(),t.event.stopImmediatePropagation()},gl=function(t){var n=t.document.documentElement,e=pl(t).on("dragstart.drag",yl,!0);"onselectstart"in n?e.on("selectstart.drag",yl,!0):(n.__noselect=n.style.MozUserSelect,n.style.MozUserSelect="none")},ml=function(t){return function(){return t}};yt.prototype.on=function(){var t=this._.on.apply(this._,arguments);return t===this._?this:t};var xl=function(){function n(t){t.on("mousedown.drag",e).on("touchstart.drag",o).on("touchmove.drag",u).on("touchend.drag touchcancel.drag",a).style("-webkit-tap-highlight-color","rgba(0,0,0,0)")}function e(){if(!f&&l.apply(this,arguments)){var n=c("mouse",h.apply(this,arguments),zf,this,arguments);n&&(pl(t.event.view).on("mousemove.drag",r,!0).on("mouseup.drag",i,!0),gl(t.event.view),vt(),s=!1,n("start"))}}function r(){yl(),s=!0,v.mouse("drag")}function i(){pl(t.event.view).on("mousemove.drag mouseup.drag",null),_t(t.event.view,s),yl(),v.mouse("end")}function o(){if(l.apply(this,arguments)){var n,e,r=t.event.changedTouches,i=h.apply(this,arguments),o=r.length;for(n=0;n<o;++n)(e=c(r[n].identifier,i,vl,this,arguments))&&(vt(),e("start"))}}function u(){var n,e,r=t.event.changedTouches,i=r.length;for(n=0;n<i;++n)(e=v[r[n].identifier])&&(yl(),e("drag"))}function a(){var n,e,r=t.event.changedTouches,i=r.length;for(f&&clearTimeout(f),f=setTimeout(function(){f=null},500),n=0;n<i;++n)(e=v[r[n].identifier])&&(vt(),e("end"))}function c(e,r,i,o,u){var a,c,s,f=i(r,e),l=_.copy();if(S(new yt(n,"beforestart",a,e,y,f[0],f[1],0,0,l),function(){return null!=(t.event.subject=a=d.apply(o,u))&&(c=a.x-f[0]||0,s=a.y-f[1]||0,!0)}))return function t(h){var p,d=f;switch(h){case"start":v[e]=t,p=y++;break;case"end":delete v[e],--y;case"drag":f=i(r,e),p=y}S(new yt(n,h,a,e,p,f[0]+c,f[1]+s,f[0]-d[0],f[1]-d[1],l),l.apply,l,[h,o,u])}}var s,f,l=gt,h=mt,d=xt,v={},_=p("start","drag","end"),y=0;return n.filter=function(t){return arguments.length?(l="function"==typeof t?t:ml(!!t),n):l},n.container=function(t){return arguments.length?(h="function"==typeof t?t:ml(t),n):h},n.subject=function(t){return arguments.length?(d="function"==typeof t?t:ml(t),
n):d},n.on=function(){var t=_.on.apply(_,arguments);return t===_?n:t},n},bl=function(t,n,e){t.prototype=n.prototype=e,e.constructor=t},wl=.7,Ml=1/wl,Tl="\\s*([+-]?\\d+)\\s*",Nl="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",kl="\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",Sl=/^#([0-9a-f]{3})$/,El=/^#([0-9a-f]{6})$/,Al=new RegExp("^rgb\\("+[Tl,Tl,Tl]+"\\)$"),Cl=new RegExp("^rgb\\("+[kl,kl,kl]+"\\)$"),zl=new RegExp("^rgba\\("+[Tl,Tl,Tl,Nl]+"\\)$"),Pl=new RegExp("^rgba\\("+[kl,kl,kl,Nl]+"\\)$"),Rl=new RegExp("^hsl\\("+[Nl,kl,kl]+"\\)$"),ql=new RegExp("^hsla\\("+[Nl,kl,kl,Nl]+"\\)$"),Ll={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};bl(wt,Mt,{displayable:function(){return this.rgb().displayable()},toString:function(){return this.rgb()+""}}),bl(Et,St,bt(wt,{brighter:function(t){return t=null==t?Ml:Math.pow(Ml,t),new Et(this.r*t,this.g*t,this.b*t,this.opacity)},darker:function(t){return t=null==t?wl:Math.pow(wl,t),new Et(this.r*t,this.g*t,this.b*t,this.opacity)},rgb:function(){return this},displayable:function(){return 0<=this.r&&this.r<=255&&0<=this.g&&this.g<=255&&0<=this.b&&this.b<=255&&0<=this.opacity&&this.opacity<=1},toString:function(){var t=this.opacity;return t=isNaN(t)?1:Math.max(0,Math.min(1,t)),(1===t?"rgb(":"rgba(")+Math.max(0,Math.min(255,Math.round(this.r)||0))+", "+Math.max(0,Math.min(255,Math.round(this.g)||0))+", "+Math.max(0,Math.min(255,Math.round(this.b)||0))+(1===t?")":", "+t+")")}})),bl(Pt,zt,bt(wt,{brighter:function(t){return t=null==t?Ml:Math.pow(Ml,t),new Pt(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?wl:Math.pow(wl,t),new Pt(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=this.h%360+360*(this.h<0),n=isNaN(t)||isNaN(this.s)?0:this.s,e=this.l,r=e+(e<.5?e:1-e)*n,i=2*e-r;return new Et(Rt(t>=240?t-240:t+120,i,r),Rt(t,i,r),Rt(t<120?t+240:t-120,i,r),this.opacity)},displayable:function(){return(0<=this.s&&this.s<=1||isNaN(this.s))&&0<=this.l&&this.l<=1&&0<=this.opacity&&this.opacity<=1}}));var Ul=Math.PI/180,Dl=180/Math.PI,Ol=18,Fl=.95047,Il=1,Yl=1.08883,Bl=4/29,jl=6/29,Hl=3*jl*jl,Xl=jl*jl*jl;bl(Ut,Lt,bt(wt,{brighter:function(t){return new Ut(this.l+Ol*(null==t?1:t),this.a,this.b,this.opacity)},darker:function(t){return new Ut(this.l-Ol*(null==t?1:t),this.a,this.b,this.opacity)},rgb:function(){var t=(this.l+16)/116,n=isNaN(this.a)?t:t+this.a/500,e=isNaN(this.b)?t:t-this.b/200;return t=Il*Ot(t),n=Fl*Ot(n),e=Yl*Ot(e),new Et(Ft(3.2404542*n-1.5371385*t-.4985314*e),Ft(-.969266*n+1.8760108*t+.041556*e),Ft(.0556434*n-.2040259*t+1.0572252*e),this.opacity)}})),bl(jt,Bt,bt(wt,{brighter:function(t){return new jt(this.h,this.c,this.l+Ol*(null==t?1:t),this.opacity)},darker:function(t){return new jt(this.h,this.c,this.l-Ol*(null==t?1:t),this.opacity)},rgb:function(){return qt(this).rgb()}}));var Vl=-.14861,Wl=1.78277,$l=-.29227,Zl=-.90649,Gl=1.97294,Jl=Gl*Zl,Ql=Gl*Wl,Kl=Wl*$l-Zl*Vl;bl(Vt,Xt,bt(wt,{brighter:function(t){return t=null==t?Ml:Math.pow(Ml,t),new Vt(this.h,this.s,this.l*t,this.opacity)},darker:function(t){return t=null==t?wl:Math.pow(wl,t),new Vt(this.h,this.s,this.l*t,this.opacity)},rgb:function(){var t=isNaN(this.h)?0:(this.h+120)*Ul,n=+this.l,e=isNaN(this.s)?0:this.s*n*(1-n),r=Math.cos(t),i=Math.sin(t);return new Et(255*(n+e*(Vl*r+Wl*i)),255*(n+e*($l*r+Zl*i)),255*(n+e*(Gl*r)),this.opacity)}}));var th,nh,eh,rh,ih,oh,uh=function(t){var n=t.length-1;return function(e){var r=e<=0?e=0:e>=1?(e=1,n-1):Math.floor(e*n),i=t[r],o=t[r+1],u=r>0?t[r-1]:2*i-o,a=r<n-1?t[r+2]:2*o-i;return Wt((e-r/n)*n,u,i,o,a)}},ah=function(t){var n=t.length;return function(e){var r=Math.floor(((e%=1)<0?++e:e)*n),i=t[(r+n-1)%n],o=t[r%n],u=t[(r+1)%n],a=t[(r+2)%n];return Wt((e-r/n)*n,i,o,u,a)}},ch=function(t){return function(){return t}},sh=function t(n){function e(t,n){var e=r((t=St(t)).r,(n=St(n)).r),i=r(t.g,n.g),o=r(t.b,n.b),u=Qt(t.opacity,n.opacity);return function(n){return t.r=e(n),t.g=i(n),t.b=o(n),t.opacity=u(n),t+""}}var r=Jt(n);return e.gamma=t,e}(1),fh=Kt(uh),lh=Kt(ah),hh=function(t,n){var e,r=n?n.length:0,i=t?Math.min(r,t.length):0,o=new Array(r),u=new Array(r);for(e=0;e<i;++e)o[e]=mh(t[e],n[e]);for(;e<r;++e)u[e]=n[e];return function(t){for(e=0;e<i;++e)u[e]=o[e](t);return u}},ph=function(t,n){var e=new Date;return t=+t,n-=t,function(r){return e.setTime(t+n*r),e}},dh=function(t,n){return t=+t,n-=t,function(e){return t+n*e}},vh=function(t,n){var e,r={},i={};null!==t&&"object"==typeof t||(t={}),null!==n&&"object"==typeof n||(n={});for(e in n)e in t?r[e]=mh(t[e],n[e]):i[e]=n[e];return function(t){for(e in r)i[e]=r[e](t);return i}},_h=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,yh=new RegExp(_h.source,"g"),gh=function(t,n){var e,r,i,o=_h.lastIndex=yh.lastIndex=0,u=-1,a=[],c=[];for(t+="",n+="";(e=_h.exec(t))&&(r=yh.exec(n));)(i=r.index)>o&&(i=n.slice(o,i),a[u]?a[u]+=i:a[++u]=i),(e=e[0])===(r=r[0])?a[u]?a[u]+=r:a[++u]=r:(a[++u]=null,c.push({i:u,x:dh(e,r)})),o=yh.lastIndex;return o<n.length&&(i=n.slice(o),a[u]?a[u]+=i:a[++u]=i),a.length<2?c[0]?nn(c[0].x):tn(n):(n=c.length,function(t){for(var e,r=0;r<n;++r)a[(e=c[r]).i]=e.x(t);return a.join("")})},mh=function(t,n){var e,r=typeof n;return null==n||"boolean"===r?ch(n):("number"===r?dh:"string"===r?(e=Mt(n))?(n=e,sh):gh:n instanceof Mt?sh:n instanceof Date?ph:Array.isArray(n)?hh:isNaN(n)?vh:dh)(t,n)},xh=function(t,n){return t=+t,n-=t,function(e){return Math.round(t+n*e)}},bh=180/Math.PI,wh={translateX:0,translateY:0,rotate:0,skewX:0,scaleX:1,scaleY:1},Mh=function(t,n,e,r,i,o){var u,a,c;return(u=Math.sqrt(t*t+n*n))&&(t/=u,n/=u),(c=t*e+n*r)&&(e-=t*c,r-=n*c),(a=Math.sqrt(e*e+r*r))&&(e/=a,r/=a,c/=a),t*r<n*e&&(t=-t,n=-n,c=-c,u=-u),{translateX:i,translateY:o,rotate:Math.atan2(n,t)*bh,skewX:Math.atan(c)*bh,scaleX:u,scaleY:a}},Th=on(en,"px, ","px)","deg)"),Nh=on(rn,", ",")",")"),kh=Math.SQRT2,Sh=2,Eh=4,Ah=1e-12,Ch=function(t,n){var e,r,i=t[0],o=t[1],u=t[2],a=n[0],c=n[1],s=n[2],f=a-i,l=c-o,h=f*f+l*l;if(h<Ah)r=Math.log(s/u)/kh,e=function(t){return[i+t*f,o+t*l,u*Math.exp(kh*t*r)]};else{var p=Math.sqrt(h),d=(s*s-u*u+Eh*h)/(2*u*Sh*p),v=(s*s-u*u-Eh*h)/(2*s*Sh*p),_=Math.log(Math.sqrt(d*d+1)-d),y=Math.log(Math.sqrt(v*v+1)-v);r=(y-_)/kh,e=function(t){var n=t*r,e=un(_),a=u/(Sh*p)*(e*cn(kh*n+_)-an(_));return[i+a*f,o+a*l,u*e/un(kh*n+_)]}}return e.duration=1e3*r,e},zh=sn(Gt),Ph=sn(Qt),Rh=ln(Gt),qh=ln(Qt),Lh=hn(Gt),Uh=hn(Qt),Dh=function(t,n){for(var e=new Array(n),r=0;r<n;++r)e[r]=t(r/(n-1));return e},Oh=0,Fh=0,Ih=0,Yh=1e3,Bh=0,jh=0,Hh=0,Xh="object"==typeof performance&&performance.now?performance:Date,Vh="function"==typeof requestAnimationFrame?requestAnimationFrame:function(t){setTimeout(t,17)};vn.prototype=_n.prototype={constructor:vn,restart:function(t,n,e){if("function"!=typeof t)throw new TypeError("callback is not a function");e=(null==e?pn():+e)+(null==n?0:+n),this._next||oh===this||(oh?oh._next=this:ih=this,oh=this),this._call=t,this._time=e,bn()},stop:function(){this._call&&(this._call=null,this._time=1/0,bn())}};var Wh=function(t,n,e){var r=new vn;return n=null==n?0:+n,r.restart(function(e){r.stop(),t(e+n)},n,e),r},$h=function(t,n,e){var r=new vn,i=n;return null==n?(r.restart(t,n,e),r):(n=+n,e=null==e?pn():+e,r.restart(function o(u){u+=i,r.restart(o,i+=n,e),t(u)},n,e),r)},Zh=p("start","end","interrupt"),Gh=[],Jh=0,Qh=1,Kh=2,tp=3,np=4,ep=5,rp=6,ip=function(t,n,e,r,i,o){var u=t.__transition;if(u){if(e in u)return}else t.__transition={};Nn(t,e,{name:n,index:r,group:i,on:Zh,tween:Gh,time:o.time,delay:o.delay,duration:o.duration,ease:o.ease,timer:null,state:Jh})},op=function(t,n){var e,r,i,o=t.__transition,u=!0;if(o){n=null==n?null:n+"";for(i in o)(e=o[i]).name===n?(r=e.state>Kh&&e.state<ep,e.state=rp,e.timer.stop(),r&&e.on.call("interrupt",t,t.__data__,e.index,e.group),delete o[i]):u=!1;u&&delete t.__transition}},up=function(t){return this.each(function(){op(this,t)})},ap=function(t,n){var e=this._id;if(t+="",arguments.length<2){for(var r,i=Tn(this.node(),e).tween,o=0,u=i.length;o<u;++o)if((r=i[o]).name===t)return r.value;return null}return this.each((null==n?kn:Sn)(e,t,n))},cp=function(t,n){var e;return("number"==typeof n?dh:n instanceof Mt?sh:(e=Mt(n))?(n=e,sh):gh)(t,n)},sp=function(t,n){var e=mf(t),r="transform"===e?Nh:cp;return this.attrTween(t,"function"==typeof n?(e.local?qn:Rn)(e,r,En(this,"attr."+t,n)):null==n?(e.local?Cn:An)(e):(e.local?Pn:zn)(e,r,n))},fp=function(t,n){var e="attr."+t;if(arguments.length<2)return(e=this.tween(e))&&e._value;if(null==n)return this.tween(e,null);if("function"!=typeof n)throw new Error;var r=mf(t);return this.tween(e,(r.local?Ln:Un)(r,n))},lp=function(t){var n=this._id;return arguments.length?this.each(("function"==typeof t?Dn:On)(n,t)):Tn(this.node(),n).delay},hp=function(t){var n=this._id;return arguments.length?this.each(("function"==typeof t?Fn:In)(n,t)):Tn(this.node(),n).duration},pp=function(t){var n=this._id;return arguments.length?this.each(Yn(n,t)):Tn(this.node(),n).ease},dp=function(t){"function"!=typeof t&&(t=Nf(t));for(var n=this._groups,e=n.length,r=new Array(e),i=0;i<e;++i)for(var o,u=n[i],a=u.length,c=r[i]=[],s=0;s<a;++s)(o=u[s])&&t.call(o,o.__data__,s,u)&&c.push(o);return new Qn(r,this._parents,this._name,this._id)},vp=function(t){if(t._id!==this._id)throw new Error;for(var n=this._groups,e=t._groups,r=n.length,i=e.length,o=Math.min(r,i),u=new Array(r),a=0;a<o;++a)for(var c,s=n[a],f=e[a],l=s.length,h=u[a]=new Array(l),p=0;p<l;++p)(c=s[p]||f[p])&&(h[p]=c);for(;a<r;++a)u[a]=n[a];return new Qn(u,this._parents,this._name,this._id)},_p=function(t,n){var e=this._id;return arguments.length<2?Tn(this.node(),e).on.on(t):this.each(jn(e,t,n))},yp=function(){return this.on("end.remove",Hn(this._id))},gp=function(t){var n=this._name,e=this._id;"function"!=typeof t&&(t=Pf(t));for(var r=this._groups,i=r.length,o=new Array(i),u=0;u<i;++u)for(var a,c,s=r[u],f=s.length,l=o[u]=new Array(f),h=0;h<f;++h)(a=s[h])&&(c=t.call(a,a.__data__,h,s))&&("__data__"in a&&(c.__data__=a.__data__),l[h]=c,ip(l[h],n,e,h,l,Tn(a,e)));return new Qn(o,this._parents,n,e)},mp=function(t){var n=this._name,e=this._id;"function"!=typeof t&&(t=qf(t));for(var r=this._groups,i=r.length,o=[],u=[],a=0;a<i;++a)for(var c,s=r[a],f=s.length,l=0;l<f;++l)if(c=s[l]){for(var h,p=t.call(c,c.__data__,l,s),d=Tn(c,e),v=0,_=p.length;v<_;++v)(h=p[v])&&ip(h,n,e,v,p,d);o.push(p),u.push(c)}return new Qn(o,u,n,e)},xp=dt.prototype.constructor,bp=function(){return new xp(this._groups,this._parents)},wp=function(t,n,e){var r="transform"==(t+="")?Th:cp;return null==n?this.styleTween(t,Xn(t,r)).on("end.style."+t,Vn(t)):this.styleTween(t,"function"==typeof n?$n(t,r,En(this,"style."+t,n)):Wn(t,r,n),e)},Mp=function(t,n,e){var r="style."+(t+="");if(arguments.length<2)return(r=this.tween(r))&&r._value;if(null==n)return this.tween(r,null);if("function"!=typeof n)throw new Error;return this.tween(r,Zn(t,n,null==e?"":e))},Tp=function(t){return this.tween("text","function"==typeof t?Jn(En(this,"text",t)):Gn(null==t?"":t+""))},Np=function(){for(var t=this._name,n=this._id,e=te(),r=this._groups,i=r.length,o=0;o<i;++o)for(var u,a=r[o],c=a.length,s=0;s<c;++s)if(u=a[s]){var f=Tn(u,n);ip(u,t,e,s,a,{time:f.time+f.delay+f.duration,delay:0,duration:f.duration,ease:f.ease})}return new Qn(r,this._parents,t,e)},kp=0,Sp=dt.prototype;Qn.prototype=Kn.prototype={constructor:Qn,select:gp,selectAll:mp,filter:dp,merge:vp,selection:bp,transition:Np,call:Sp.call,nodes:Sp.nodes,node:Sp.node,size:Sp.size,empty:Sp.empty,each:Sp.each,on:_p,attr:sp,attrTween:fp,style:wp,styleTween:Mp,text:Tp,remove:yp,tween:ap,delay:lp,duration:hp,ease:pp};var Ep=3,Ap=function t(n){function e(t){return Math.pow(t,n)}return n=+n,e.exponent=t,e}(Ep),Cp=function t(n){function e(t){return 1-Math.pow(1-t,n)}return n=+n,e.exponent=t,e}(Ep),zp=function t(n){function e(t){return((t*=2)<=1?Math.pow(t,n):2-Math.pow(2-t,n))/2}return n=+n,e.exponent=t,e}(Ep),Pp=Math.PI,Rp=Pp/2,qp=4/11,Lp=6/11,Up=8/11,Dp=.75,Op=9/11,Fp=10/11,Ip=.9375,Yp=21/22,Bp=63/64,jp=1/qp/qp,Hp=1.70158,Xp=function t(n){function e(t){return t*t*((n+1)*t-n)}return n=+n,e.overshoot=t,e}(Hp),Vp=function t(n){function e(t){return--t*t*((n+1)*t+n)+1}return n=+n,e.overshoot=t,e}(Hp),Wp=function t(n){function e(t){return((t*=2)<1?t*t*((n+1)*t-n):(t-=2)*t*((n+1)*t+n)+2)/2}return n=+n,e.overshoot=t,e}(Hp),$p=2*Math.PI,Zp=1,Gp=.3,Jp=function t(n,e){function r(t){return n*Math.pow(2,10*--t)*Math.sin((i-t)/e)}var i=Math.asin(1/(n=Math.max(1,n)))*(e/=$p);return r.amplitude=function(n){return t(n,e*$p)},r.period=function(e){return t(n,e)},r}(Zp,Gp),Qp=function t(n,e){function r(t){return 1-n*Math.pow(2,-10*(t=+t))*Math.sin((t+i)/e)}var i=Math.asin(1/(n=Math.max(1,n)))*(e/=$p);return r.amplitude=function(n){return t(n,e*$p)},r.period=function(e){return t(n,e)},r}(Zp,Gp),Kp=function t(n,e){function r(t){return((t=2*t-1)<0?n*Math.pow(2,10*t)*Math.sin((i-t)/e):2-n*Math.pow(2,-10*t)*Math.sin((i+t)/e))/2}var i=Math.asin(1/(n=Math.max(1,n)))*(e/=$p);return r.amplitude=function(n){return t(n,e*$p)},r.period=function(e){return t(n,e)},r}(Zp,Gp),td={time:null,delay:0,duration:250,ease:ae},nd=function(t){var n,e;t instanceof Qn?(n=t._id,t=t._name):(n=te(),(e=td).time=pn(),t=null==t?null:t+"");for(var r=this._groups,i=r.length,o=0;o<i;++o)for(var u,a=r[o],c=a.length,s=0;s<c;++s)(u=a[s])&&ip(u,t,n,s,a,e||xe(u,n));return new Qn(r,this._parents,t,n)};dt.prototype.interrupt=up,dt.prototype.transition=nd;var ed=[null],rd=function(t,n){var e,r,i=t.__transition;if(i){n=null==n?null:n+"";for(r in i)if((e=i[r]).state>Qh&&e.name===n)return new Qn([[t]],ed,n,+r)}return null},id=function(t){return function(){return t}},od=function(t,n,e){this.target=t,this.type=n,this.selection=e},ud=function(){t.event.preventDefault(),t.event.stopImmediatePropagation()},ad={name:"drag"},cd={name:"space"},sd={name:"handle"},fd={name:"center"},ld={name:"x",handles:["e","w"].map(we),input:function(t,n){return t&&[[t[0],n[0][1]],[t[1],n[1][1]]]},output:function(t){return t&&[t[0][0],t[1][0]]}},hd={name:"y",handles:["n","s"].map(we),input:function(t,n){return t&&[[n[0][0],t[0]],[n[1][0],t[1]]]},output:function(t){return t&&[t[0][1],t[1][1]]}},pd={name:"xy",handles:["n","e","s","w","nw","ne","se","sw"].map(we),input:function(t){return t},output:function(t){return t}},dd={overlay:"crosshair",selection:"move",n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},vd={e:"w",w:"e",nw:"ne",ne:"nw",se:"sw",sw:"se"},_d={n:"s",s:"n",nw:"sw",ne:"se",se:"ne",sw:"nw"},yd={overlay:1,selection:1,n:null,e:1,s:null,w:-1,nw:-1,ne:1,se:1,sw:-1},gd={overlay:1,selection:1,n:-1,e:null,s:1,w:null,nw:-1,ne:-1,se:1,sw:1},md=function(){return Ce(pd)},xd=Math.cos,bd=Math.sin,wd=Math.PI,Md=wd/2,Td=2*wd,Nd=Math.max,kd=function(){function t(t){var o,u,a,c,s,f,l=t.length,h=[],p=Is(l),d=[],v=[],_=v.groups=new Array(l),y=new Array(l*l);for(o=0,s=-1;++s<l;){for(u=0,f=-1;++f<l;)u+=t[s][f];h.push(u),d.push(Is(l)),o+=u}for(e&&p.sort(function(t,n){return e(h[t],h[n])}),r&&d.forEach(function(n,e){n.sort(function(n,i){return r(t[e][n],t[e][i])})}),o=Nd(0,Td-n*l)/o,c=o?n:Td/l,u=0,s=-1;++s<l;){for(a=u,f=-1;++f<l;){var g=p[s],m=d[g][f],x=t[g][m],b=u,w=u+=x*o;y[m*l+g]={index:g,subindex:m,startAngle:b,endAngle:w,value:x}}_[g]={index:g,startAngle:a,endAngle:u,value:h[g]},u+=c}for(s=-1;++s<l;)for(f=s-1;++f<l;){var M=y[f*l+s],T=y[s*l+f];(M.value||T.value)&&v.push(M.value<T.value?{source:T,target:M}:{source:M,target:T})}return i?v.sort(i):v}var n=0,e=null,r=null,i=null;return t.padAngle=function(e){return arguments.length?(n=Nd(0,e),t):n},t.sortGroups=function(n){return arguments.length?(e=n,t):e},t.sortSubgroups=function(n){return arguments.length?(r=n,t):r},t.sortChords=function(n){return arguments.length?(null==n?i=null:(i=ze(n))._=n,t):i&&i._},t},Sd=Array.prototype.slice,Ed=function(t){return function(){return t}},Ad=Math.PI,Cd=2*Ad,zd=1e-6,Pd=Cd-zd;Pe.prototype=Re.prototype={constructor:Pe,moveTo:function(t,n){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+n)},closePath:function(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")},lineTo:function(t,n){this._+="L"+(this._x1=+t)+","+(this._y1=+n)},quadraticCurveTo:function(t,n,e,r){this._+="Q"+ +t+","+ +n+","+(this._x1=+e)+","+(this._y1=+r)},bezierCurveTo:function(t,n,e,r,i,o){this._+="C"+ +t+","+ +n+","+ +e+","+ +r+","+(this._x1=+i)+","+(this._y1=+o)},arcTo:function(t,n,e,r,i){t=+t,n=+n,e=+e,r=+r,i=+i;var o=this._x1,u=this._y1,a=e-t,c=r-n,s=o-t,f=u-n,l=s*s+f*f;if(i<0)throw new Error("negative radius: "+i);if(null===this._x1)this._+="M"+(this._x1=t)+","+(this._y1=n);else if(l>zd)if(Math.abs(f*a-c*s)>zd&&i){var h=e-o,p=r-u,d=a*a+c*c,v=h*h+p*p,_=Math.sqrt(d),y=Math.sqrt(l),g=i*Math.tan((Ad-Math.acos((d+l-v)/(2*_*y)))/2),m=g/y,x=g/_;Math.abs(m-1)>zd&&(this._+="L"+(t+m*s)+","+(n+m*f)),this._+="A"+i+","+i+",0,0,"+ +(f*h>s*p)+","+(this._x1=t+x*a)+","+(this._y1=n+x*c)}else this._+="L"+(this._x1=t)+","+(this._y1=n);else;},arc:function(t,n,e,r,i,o){t=+t,n=+n,e=+e;var u=e*Math.cos(r),a=e*Math.sin(r),c=t+u,s=n+a,f=1^o,l=o?r-i:i-r;if(e<0)throw new Error("negative radius: "+e);null===this._x1?this._+="M"+c+","+s:(Math.abs(this._x1-c)>zd||Math.abs(this._y1-s)>zd)&&(this._+="L"+c+","+s),e&&(l>Pd?this._+="A"+e+","+e+",0,1,"+f+","+(t-u)+","+(n-a)+"A"+e+","+e+",0,1,"+f+","+(this._x1=c)+","+(this._y1=s):(l<0&&(l=l%Cd+Cd),this._+="A"+e+","+e+",0,"+ +(l>=Ad)+","+f+","+(this._x1=t+e*Math.cos(i))+","+(this._y1=n+e*Math.sin(i))))},rect:function(t,n,e,r){this._+="M"+(this._x0=this._x1=+t)+","+(this._y0=this._y1=+n)+"h"+ +e+"v"+ +r+"h"+-e+"Z"},toString:function(){return this._}};var Rd=function(){function t(){var t,a=Sd.call(arguments),c=n.apply(this,a),s=e.apply(this,a),f=+r.apply(this,(a[0]=c,a)),l=i.apply(this,a)-Md,h=o.apply(this,a)-Md,p=f*xd(l),d=f*bd(l),v=+r.apply(this,(a[0]=s,a)),_=i.apply(this,a)-Md,y=o.apply(this,a)-Md;if(u||(u=t=Re()),u.moveTo(p,d),u.arc(0,0,f,l,h),l===_&&h===y||(u.quadraticCurveTo(0,0,v*xd(_),v*bd(_)),u.arc(0,0,v,_,y)),u.quadraticCurveTo(0,0,p,d),u.closePath(),t)return u=null,t+""||null}var n=qe,e=Le,r=Ue,i=De,o=Oe,u=null;return t.radius=function(n){return arguments.length?(r="function"==typeof n?n:Ed(+n),t):r},t.startAngle=function(n){return arguments.length?(i="function"==typeof n?n:Ed(+n),t):i},t.endAngle=function(n){return arguments.length?(o="function"==typeof n?n:Ed(+n),t):o},t.source=function(e){return arguments.length?(n=e,t):n},t.target=function(n){return arguments.length?(e=n,t):e},t.context=function(n){return arguments.length?(u=null==n?null:n,t):u},t},qd="$";Fe.prototype=Ie.prototype={constructor:Fe,has:function(t){return qd+t in this},get:function(t){return this[qd+t]},set:function(t,n){return this[qd+t]=n,this},remove:function(t){var n=qd+t;return n in this&&delete this[n]},clear:function(){for(var t in this)t[0]===qd&&delete this[t]},keys:function(){var t=[];for(var n in this)n[0]===qd&&t.push(n.slice(1));return t},values:function(){var t=[];for(var n in this)n[0]===qd&&t.push(this[n]);return t},entries:function(){var t=[];for(var n in this)n[0]===qd&&t.push({key:n.slice(1),value:this[n]});return t},size:function(){var t=0;for(var n in this)n[0]===qd&&++t;return t},empty:function(){for(var t in this)if(t[0]===qd)return!1;return!0},each:function(t){for(var n in this)n[0]===qd&&t(this[n],n.slice(1),this)}};var Ld=function(){function t(n,i,u,a){if(i>=o.length)return null!=r?r(n):null!=e?n.sort(e):n;for(var c,s,f,l=-1,h=n.length,p=o[i++],d=Ie(),v=u();++l<h;)(f=d.get(c=p(s=n[l])+""))?f.push(s):d.set(c,[s]);return d.each(function(n,e){a(v,e,t(n,i,u,a))}),v}function n(t,e){if(++e>o.length)return t;var i,a=u[e-1];return null!=r&&e>=o.length?i=t.entries():(i=[],t.each(function(t,r){i.push({key:r,values:n(t,e)})})),null!=a?i.sort(function(t,n){return a(t.key,n.key)}):i}var e,r,i,o=[],u=[];return i={object:function(n){return t(n,0,Ye,Be)},map:function(n){return t(n,0,je,He)},entries:function(e){return n(t(e,0,je,He),0)},key:function(t){return o.push(t),i},sortKeys:function(t){return u[o.length-1]=t,i},sortValues:function(t){return e=t,i},rollup:function(t){return r=t,i}}},Ud=Ie.prototype;Xe.prototype=Ve.prototype={constructor:Xe,has:Ud.has,add:function(t){return t+="",this[qd+t]=t,this},remove:Ud.remove,clear:Ud.clear,values:Ud.keys,size:Ud.size,empty:Ud.empty,each:Ud.each};var Dd=function(t){var n=[];for(var e in t)n.push(e);return n},Od=function(t){var n=[];for(var e in t)n.push(t[e]);return n},Fd=function(t){var n=[];for(var e in t)n.push({key:e,value:t[e]});return n},Id=function(t){function n(t,n){var r,i,o=e(t,function(t,e){return r?r(t,e-1):(i=t,void(r=n?$e(t,n):We(t)))});return o.columns=i,o}function e(t,n){function e(){if(f>=s)return u;if(i)return i=!1,o;var n,e=f;if(34===t.charCodeAt(e)){for(var r=e;r++<s;)if(34===t.charCodeAt(r)){if(34!==t.charCodeAt(r+1))break;++r}return f=r+2,n=t.charCodeAt(r+1),13===n?(i=!0,10===t.charCodeAt(r+2)&&++f):10===n&&(i=!0),t.slice(e+1,r).replace(/""/g,'"')}for(;f<s;){var a=1;if(n=t.charCodeAt(f++),10===n)i=!0;else if(13===n)i=!0,10===t.charCodeAt(f)&&(++f,++a);else if(n!==c)continue;return t.slice(e,f-a)}return t.slice(e)}for(var r,i,o={},u={},a=[],s=t.length,f=0,l=0;(r=e())!==u;){for(var h=[];r!==o&&r!==u;)h.push(r),r=e();n&&null==(h=n(h,l++))||a.push(h)}return a}function r(n,e){return null==e&&(e=Ze(n)),[e.map(u).join(t)].concat(n.map(function(n){return e.map(function(t){return u(n[t])}).join(t)})).join("\n")}function i(t){return t.map(o).join("\n")}function o(n){return n.map(u).join(t)}function u(t){return null==t?"":a.test(t+="")?'"'+t.replace(/\"/g,'""')+'"':t}var a=new RegExp('["'+t+"\n]"),c=t.charCodeAt(0);return{parse:n,parseRows:e,format:r,formatRows:i}},Yd=Id(","),Bd=Yd.parse,jd=Yd.parseRows,Hd=Yd.format,Xd=Yd.formatRows,Vd=Id("\t"),Wd=Vd.parse,$d=Vd.parseRows,Zd=Vd.format,Gd=Vd.formatRows,Jd=function(t,n){function e(){var e,i,o=r.length,u=0,a=0;for(e=0;e<o;++e)i=r[e],u+=i.x,a+=i.y;for(u=u/o-t,a=a/o-n,e=0;e<o;++e)i=r[e],i.x-=u,i.y-=a}var r;return null==t&&(t=0),null==n&&(n=0),e.initialize=function(t){r=t},e.x=function(n){return arguments.length?(t=+n,e):t},e.y=function(t){return arguments.length?(n=+t,e):n},e},Qd=function(t){return function(){return t}},Kd=function(){return 1e-6*(Math.random()-.5)},tv=function(t){var n=+this._x.call(null,t),e=+this._y.call(null,t);return Ge(this.cover(n,e),n,e,t)},nv=function(t,n){if(isNaN(t=+t)||isNaN(n=+n))return this;var e=this._x0,r=this._y0,i=this._x1,o=this._y1;if(isNaN(e))i=(e=Math.floor(t))+1,o=(r=Math.floor(n))+1;else{if(!(e>t||t>i||r>n||n>o))return this;var u,a,c=i-e,s=this._root;switch(a=(n<(r+o)/2)<<1|t<(e+i)/2){case 0:do u=new Array(4),u[a]=s,s=u;while(c*=2,i=e+c,o=r+c,t>i||n>o);break;case 1:do u=new Array(4),u[a]=s,s=u;while(c*=2,e=i-c,o=r+c,e>t||n>o);break;case 2:do u=new Array(4),u[a]=s,s=u;while(c*=2,i=e+c,r=o-c,t>i||r>n);break;case 3:do u=new Array(4),u[a]=s,s=u;while(c*=2,e=i-c,r=o-c,e>t||r>n)}this._root&&this._root.length&&(this._root=s)}return this._x0=e,this._y0=r,this._x1=i,this._y1=o,this},ev=function(){var t=[];return this.visit(function(n){if(!n.length)do t.push(n.data);while(n=n.next)}),t},rv=function(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]},iv=function(t,n,e,r,i){this.node=t,this.x0=n,this.y0=e,this.x1=r,this.y1=i},ov=function(t,n,e){var r,i,o,u,a,c,s,f=this._x0,l=this._y0,h=this._x1,p=this._y1,d=[],v=this._root;for(v&&d.push(new iv(v,f,l,h,p)),null==e?e=1/0:(f=t-e,l=n-e,h=t+e,p=n+e,e*=e);c=d.pop();)if(!(!(v=c.node)||(i=c.x0)>h||(o=c.y0)>p||(u=c.x1)<f||(a=c.y1)<l))if(v.length){var _=(i+u)/2,y=(o+a)/2;d.push(new iv(v[3],_,y,u,a),new iv(v[2],i,y,_,a),new iv(v[1],_,o,u,y),new iv(v[0],i,o,_,y)),(s=(n>=y)<<1|t>=_)&&(c=d[d.length-1],d[d.length-1]=d[d.length-1-s],d[d.length-1-s]=c)}else{var g=t-+this._x.call(null,v.data),m=n-+this._y.call(null,v.data),x=g*g+m*m;if(x<e){var b=Math.sqrt(e=x);f=t-b,l=n-b,h=t+b,p=n+b,r=v.data}}return r},uv=function(t){if(isNaN(o=+this._x.call(null,t))||isNaN(u=+this._y.call(null,t)))return this;var n,e,r,i,o,u,a,c,s,f,l,h,p=this._root,d=this._x0,v=this._y0,_=this._x1,y=this._y1;if(!p)return this;if(p.length)for(;;){if((s=o>=(a=(d+_)/2))?d=a:_=a,(f=u>=(c=(v+y)/2))?v=c:y=c,n=p,!(p=p[l=f<<1|s]))return this;if(!p.length)break;(n[l+1&3]||n[l+2&3]||n[l+3&3])&&(e=n,h=l)}for(;p.data!==t;)if(r=p,!(p=p.next))return this;return(i=p.next)&&delete p.next,r?(i?r.next=i:delete r.next,this):n?(i?n[l]=i:delete n[l],(p=n[0]||n[1]||n[2]||n[3])&&p===(n[3]||n[2]||n[1]||n[0])&&!p.length&&(e?e[h]=p:this._root=p),this):(this._root=i,this)},av=function(){return this._root},cv=function(){var t=0;return this.visit(function(n){if(!n.length)do++t;while(n=n.next)}),t},sv=function(t){var n,e,r,i,o,u,a=[],c=this._root;for(c&&a.push(new iv(c,this._x0,this._y0,this._x1,this._y1));n=a.pop();)if(!t(c=n.node,r=n.x0,i=n.y0,o=n.x1,u=n.y1)&&c.length){var s=(r+o)/2,f=(i+u)/2;(e=c[3])&&a.push(new iv(e,s,f,o,u)),(e=c[2])&&a.push(new iv(e,r,f,s,u)),(e=c[1])&&a.push(new iv(e,s,i,o,f)),(e=c[0])&&a.push(new iv(e,r,i,s,f))}return this},fv=function(t){var n,e=[],r=[];for(this._root&&e.push(new iv(this._root,this._x0,this._y0,this._x1,this._y1));n=e.pop();){var i=n.node;if(i.length){var o,u=n.x0,a=n.y0,c=n.x1,s=n.y1,f=(u+c)/2,l=(a+s)/2;(o=i[0])&&e.push(new iv(o,u,a,f,l)),(o=i[1])&&e.push(new iv(o,f,a,c,l)),(o=i[2])&&e.push(new iv(o,u,l,f,s)),(o=i[3])&&e.push(new iv(o,f,l,c,s))}r.push(n)}for(;n=r.pop();)t(n.node,n.x0,n.y0,n.x1,n.y1);return this},lv=function(t){return arguments.length?(this._x=t,this):this._x},hv=function(t){return arguments.length?(this._y=t,this):this._y},pv=nr.prototype=er.prototype;pv.copy=function(){var t,n,e=new er(this._x,this._y,this._x0,this._y0,this._x1,this._y1),r=this._root;if(!r)return e;if(!r.length)return e._root=rr(r),e;for(t=[{source:r,target:e._root=new Array(4)}];r=t.pop();)for(var i=0;i<4;++i)(n=r.source[i])&&(n.length?t.push({source:n,target:r.target[i]=new Array(4)}):r.target[i]=rr(n));return e},pv.add=tv,pv.addAll=Je,pv.cover=nv,pv.data=ev,pv.extent=rv,pv.find=ov,pv.remove=uv,pv.removeAll=Qe,pv.root=av,pv.size=cv,pv.visit=sv,pv.visitAfter=fv,pv.x=lv,pv.y=hv;var dv,vv=function(t){function n(){function t(t,n,e,r,i){var o=t.data,a=t.r,p=l+a;{if(!o)return n>s+p||r<s-p||e>f+p||i<f-p;if(o.index>c.index){var d=s-o.x-o.vx,v=f-o.y-o.vy,_=d*d+v*v;_<p*p&&(0===d&&(d=Kd(),_+=d*d),0===v&&(v=Kd(),_+=v*v),_=(p-(_=Math.sqrt(_)))/_*u,c.vx+=(d*=_)*(p=(a*=a)/(h+a)),c.vy+=(v*=_)*p,o.vx-=d*(p=1-p),o.vy-=v*p)}}}for(var n,r,c,s,f,l,h,p=i.length,d=0;d<a;++d)for(r=nr(i,ir,or).visitAfter(e),n=0;n<p;++n)c=i[n],l=o[c.index],h=l*l,s=c.x+c.vx,f=c.y+c.vy,r.visit(t)}function e(t){if(t.data)return t.r=o[t.data.index];for(var n=t.r=0;n<4;++n)t[n]&&t[n].r>t.r&&(t.r=t[n].r)}function r(){if(i){var n,e,r=i.length;for(o=new Array(r),n=0;n<r;++n)e=i[n],o[e.index]=+t(e,n,i)}}var i,o,u=1,a=1;return"function"!=typeof t&&(t=Qd(null==t?1:+t)),n.initialize=function(t){i=t,r()},n.iterations=function(t){return arguments.length?(a=+t,n):a},n.strength=function(t){return arguments.length?(u=+t,n):u},n.radius=function(e){return arguments.length?(t="function"==typeof e?e:Qd(+e),r(),n):t},n},_v=function(t){function n(t){return 1/Math.min(s[t.source.index],s[t.target.index])}function e(n){for(var e=0,r=t.length;e<d;++e)for(var i,o,c,s,l,h,p,v=0;v<r;++v)i=t[v],o=i.source,c=i.target,s=c.x+c.vx-o.x-o.vx||Kd(),l=c.y+c.vy-o.y-o.vy||Kd(),h=Math.sqrt(s*s+l*l),h=(h-a[v])/h*n*u[v],s*=h,l*=h,c.vx-=s*(p=f[v]),c.vy-=l*p,o.vx+=s*(p=1-p),o.vy+=l*p}function r(){if(c){var n,e,r=c.length,h=t.length,p=Ie(c,l);for(n=0,s=new Array(r);n<h;++n)e=t[n],e.index=n,"object"!=typeof e.source&&(e.source=ar(p,e.source)),"object"!=typeof e.target&&(e.target=ar(p,e.target)),s[e.source.index]=(s[e.source.index]||0)+1,s[e.target.index]=(s[e.target.index]||0)+1;for(n=0,f=new Array(h);n<h;++n)e=t[n],f[n]=s[e.source.index]/(s[e.source.index]+s[e.target.index]);u=new Array(h),i(),a=new Array(h),o()}}function i(){if(c)for(var n=0,e=t.length;n<e;++n)u[n]=+h(t[n],n,t)}function o(){if(c)for(var n=0,e=t.length;n<e;++n)a[n]=+p(t[n],n,t)}var u,a,c,s,f,l=ur,h=n,p=Qd(30),d=1;return null==t&&(t=[]),e.initialize=function(t){c=t,r()},e.links=function(n){return arguments.length?(t=n,r(),e):t},e.id=function(t){return arguments.length?(l=t,e):l},e.iterations=function(t){return arguments.length?(d=+t,e):d},e.strength=function(t){return arguments.length?(h="function"==typeof t?t:Qd(+t),i(),e):h},e.distance=function(t){return arguments.length?(p="function"==typeof t?t:Qd(+t),o(),e):p},e},yv=10,gv=Math.PI*(3-Math.sqrt(5)),mv=function(t){function n(){e(),d.call("tick",o),u<a&&(h.stop(),d.call("end",o))}function e(){var n,e,r=t.length;for(u+=(s-u)*c,l.each(function(t){t(u)}),n=0;n<r;++n)e=t[n],null==e.fx?e.x+=e.vx*=f:(e.x=e.fx,e.vx=0),null==e.fy?e.y+=e.vy*=f:(e.y=e.fy,e.vy=0)}function r(){for(var n,e=0,r=t.length;e<r;++e){if(n=t[e],n.index=e,isNaN(n.x)||isNaN(n.y)){var i=yv*Math.sqrt(e),o=e*gv;n.x=i*Math.cos(o),n.y=i*Math.sin(o)}(isNaN(n.vx)||isNaN(n.vy))&&(n.vx=n.vy=0)}}function i(n){return n.initialize&&n.initialize(t),n}var o,u=1,a=.001,c=1-Math.pow(a,1/300),s=0,f=.6,l=Ie(),h=_n(n),d=p("tick","end");return null==t&&(t=[]),r(),o={tick:e,restart:function(){return h.restart(n),o},stop:function(){return h.stop(),o},nodes:function(n){return arguments.length?(t=n,r(),l.each(i),o):t},alpha:function(t){return arguments.length?(u=+t,o):u},alphaMin:function(t){return arguments.length?(a=+t,o):a},alphaDecay:function(t){return arguments.length?(c=+t,o):+c},alphaTarget:function(t){
return arguments.length?(s=+t,o):s},velocityDecay:function(t){return arguments.length?(f=1-t,o):1-f},force:function(t,n){return arguments.length>1?(null==n?l.remove(t):l.set(t,i(n)),o):l.get(t)},find:function(n,e,r){var i,o,u,a,c,s=0,f=t.length;for(null==r?r=1/0:r*=r,s=0;s<f;++s)a=t[s],i=n-a.x,o=e-a.y,u=i*i+o*o,u<r&&(c=a,r=u);return c},on:function(t,n){return arguments.length>1?(d.on(t,n),o):d.on(t)}}},xv=function(){function t(t){var n,a=i.length,c=nr(i,cr,sr).visitAfter(e);for(u=t,n=0;n<a;++n)o=i[n],c.visit(r)}function n(){if(i){var t,n,e=i.length;for(a=new Array(e),t=0;t<e;++t)n=i[t],a[n.index]=+c(n,t,i)}}function e(t){var n,e,r,i,o,u=0;if(t.length){for(r=i=o=0;o<4;++o)(n=t[o])&&(e=n.value)&&(u+=e,r+=e*n.x,i+=e*n.y);t.x=r/u,t.y=i/u}else{n=t,n.x=n.data.x,n.y=n.data.y;do u+=a[n.data.index];while(n=n.next)}t.value=u}function r(t,n,e,r){if(!t.value)return!0;var i=t.x-o.x,c=t.y-o.y,h=r-n,p=i*i+c*c;if(h*h/l<p)return p<f&&(0===i&&(i=Kd(),p+=i*i),0===c&&(c=Kd(),p+=c*c),p<s&&(p=Math.sqrt(s*p)),o.vx+=i*t.value*u/p,o.vy+=c*t.value*u/p),!0;if(!(t.length||p>=f)){(t.data!==o||t.next)&&(0===i&&(i=Kd(),p+=i*i),0===c&&(c=Kd(),p+=c*c),p<s&&(p=Math.sqrt(s*p)));do t.data!==o&&(h=a[t.data.index]*u/p,o.vx+=i*h,o.vy+=c*h);while(t=t.next)}}var i,o,u,a,c=Qd(-30),s=1,f=1/0,l=.81;return t.initialize=function(t){i=t,n()},t.strength=function(e){return arguments.length?(c="function"==typeof e?e:Qd(+e),n(),t):c},t.distanceMin=function(n){return arguments.length?(s=n*n,t):Math.sqrt(s)},t.distanceMax=function(n){return arguments.length?(f=n*n,t):Math.sqrt(f)},t.theta=function(n){return arguments.length?(l=n*n,t):Math.sqrt(l)},t},bv=function(t){function n(t){for(var n,e=0,u=r.length;e<u;++e)n=r[e],n.vx+=(o[e]-n.x)*i[e]*t}function e(){if(r){var n,e=r.length;for(i=new Array(e),o=new Array(e),n=0;n<e;++n)i[n]=isNaN(o[n]=+t(r[n],n,r))?0:+u(r[n],n,r)}}var r,i,o,u=Qd(.1);return"function"!=typeof t&&(t=Qd(null==t?0:+t)),n.initialize=function(t){r=t,e()},n.strength=function(t){return arguments.length?(u="function"==typeof t?t:Qd(+t),e(),n):u},n.x=function(r){return arguments.length?(t="function"==typeof r?r:Qd(+r),e(),n):t},n},wv=function(t){function n(t){for(var n,e=0,u=r.length;e<u;++e)n=r[e],n.vy+=(o[e]-n.y)*i[e]*t}function e(){if(r){var n,e=r.length;for(i=new Array(e),o=new Array(e),n=0;n<e;++n)i[n]=isNaN(o[n]=+t(r[n],n,r))?0:+u(r[n],n,r)}}var r,i,o,u=Qd(.1);return"function"!=typeof t&&(t=Qd(null==t?0:+t)),n.initialize=function(t){r=t,e()},n.strength=function(t){return arguments.length?(u="function"==typeof t?t:Qd(+t),e(),n):u},n.y=function(r){return arguments.length?(t="function"==typeof r?r:Qd(+r),e(),n):t},n},Mv=function(t,n){if((e=(t=n?t.toExponential(n-1):t.toExponential()).indexOf("e"))<0)return null;var e,r=t.slice(0,e);return[r.length>1?r[0]+r.slice(2):r,+t.slice(e+1)]},Tv=function(t){return t=Mv(Math.abs(t)),t?t[1]:NaN},Nv=function(t,n){return function(e,r){for(var i=e.length,o=[],u=0,a=t[0],c=0;i>0&&a>0&&(c+a+1>r&&(a=Math.max(1,r-c)),o.push(e.substring(i-=a,i+a)),!((c+=a+1)>r));)a=t[u=(u+1)%t.length];return o.reverse().join(n)}},kv=function(t,n){t=t.toPrecision(n);t:for(var e,r=t.length,i=1,o=-1;i<r;++i)switch(t[i]){case".":o=e=i;break;case"0":0===o&&(o=i),e=i;break;case"e":break t;default:o>0&&(o=0)}return o>0?t.slice(0,o)+t.slice(e+1):t},Sv=function(t,n){var e=Mv(t,n);if(!e)return t+"";var r=e[0],i=e[1],o=i-(dv=3*Math.max(-8,Math.min(8,Math.floor(i/3))))+1,u=r.length;return o===u?r:o>u?r+new Array(o-u+1).join("0"):o>0?r.slice(0,o)+"."+r.slice(o):"0."+new Array(1-o).join("0")+Mv(t,Math.max(0,n+o-1))[0]},Ev=function(t,n){var e=Mv(t,n);if(!e)return t+"";var r=e[0],i=e[1];return i<0?"0."+new Array(-i).join("0")+r:r.length>i+1?r.slice(0,i+1)+"."+r.slice(i+1):r+new Array(i-r.length+2).join("0")},Av={"":kv,"%":function(t,n){return(100*t).toFixed(n)},b:function(t){return Math.round(t).toString(2)},c:function(t){return t+""},d:function(t){return Math.round(t).toString(10)},e:function(t,n){return t.toExponential(n)},f:function(t,n){return t.toFixed(n)},g:function(t,n){return t.toPrecision(n)},o:function(t){return Math.round(t).toString(8)},p:function(t,n){return Ev(100*t,n)},r:Ev,s:Sv,X:function(t){return Math.round(t).toString(16).toUpperCase()},x:function(t){return Math.round(t).toString(16)}},Cv=/^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i,zv=function(t){return new fr(t)};fr.prototype.toString=function(){return this.fill+this.align+this.sign+this.symbol+(this.zero?"0":"")+(null==this.width?"":Math.max(1,0|this.width))+(this.comma?",":"")+(null==this.precision?"":"."+Math.max(0,0|this.precision))+this.type};var Pv,Rv=["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"],qv=function(t){function n(t){function n(t){var n,i,c,g=d,m=v;if("c"===p)m=_(t)+m,t="";else{t=+t;var x=(t<0||1/t<0)&&(t*=-1,!0);if(t=_(t,h),x)for(n=-1,i=t.length,x=!1;++n<i;)if(c=t.charCodeAt(n),48<c&&c<58||"x"===p&&96<c&&c<103||"X"===p&&64<c&&c<71){x=!0;break}if(g=(x?"("===a?a:"-":"-"===a||"("===a?"":a)+g,m=m+("s"===p?Rv[8+dv/3]:"")+(x&&"("===a?")":""),y)for(n=-1,i=t.length;++n<i;)if(c=t.charCodeAt(n),48>c||c>57){m=(46===c?o+t.slice(n+1):t.slice(n))+m,t=t.slice(0,n);break}}l&&!s&&(t=r(t,1/0));var b=g.length+t.length+m.length,w=b<f?new Array(f-b+1).join(e):"";switch(l&&s&&(t=r(w+t,w.length?f-m.length:1/0),w=""),u){case"<":return g+t+m+w;case"=":return g+w+t+m;case"^":return w.slice(0,b=w.length>>1)+g+t+m+w.slice(b)}return w+g+t+m}t=zv(t);var e=t.fill,u=t.align,a=t.sign,c=t.symbol,s=t.zero,f=t.width,l=t.comma,h=t.precision,p=t.type,d="$"===c?i[0]:"#"===c&&/[boxX]/.test(p)?"0"+p.toLowerCase():"",v="$"===c?i[1]:/[%p]/.test(p)?"%":"",_=Av[p],y=!p||/[defgprs%]/.test(p);return h=null==h?p?6:12:/[gprs]/.test(p)?Math.max(1,Math.min(21,h)):Math.max(0,Math.min(20,h)),n.toString=function(){return t+""},n}function e(t,e){var r=n((t=zv(t),t.type="f",t)),i=3*Math.max(-8,Math.min(8,Math.floor(Tv(e)/3))),o=Math.pow(10,-i),u=Rv[8+i/3];return function(t){return r(o*t)+u}}var r=t.grouping&&t.thousands?Nv(t.grouping,t.thousands):lr,i=t.currency,o=t.decimal;return{format:n,formatPrefix:e}};hr({decimal:".",thousands:",",grouping:[3],currency:["$",""]});var Lv=function(t){return Math.max(0,-Tv(Math.abs(t)))},Uv=function(t,n){return Math.max(0,3*Math.max(-8,Math.min(8,Math.floor(Tv(n)/3)))-Tv(Math.abs(t)))},Dv=function(t,n){return t=Math.abs(t),n=Math.abs(n)-t,Math.max(0,Tv(n)-Tv(t))+1},Ov=function(){return new pr};pr.prototype={constructor:pr,reset:function(){this.s=this.t=0},add:function(t){dr(__,t,this.t),dr(this,__.s,this.s),this.s?this.t+=__.t:this.s=__.t},valueOf:function(){return this.s}};var Fv,Iv,Yv,Bv,jv,Hv,Xv,Vv,Wv,$v,Zv,Gv,Jv,Qv,Kv,t_,n_,e_,r_,i_,o_,u_,a_,c_,s_,f_,l_,h_,p_,d_,v_,__=new pr,y_=1e-6,g_=1e-12,m_=Math.PI,x_=m_/2,b_=m_/4,w_=2*m_,M_=180/m_,T_=m_/180,N_=Math.abs,k_=Math.atan,S_=Math.atan2,E_=Math.cos,A_=Math.ceil,C_=Math.exp,z_=Math.log,P_=Math.pow,R_=Math.sin,q_=Math.sign||function(t){return t>0?1:t<0?-1:0},L_=Math.sqrt,U_=Math.tan,D_={Feature:function(t,n){mr(t.geometry,n)},FeatureCollection:function(t,n){for(var e=t.features,r=-1,i=e.length;++r<i;)mr(e[r].geometry,n)}},O_={Sphere:function(t,n){n.sphere()},Point:function(t,n){t=t.coordinates,n.point(t[0],t[1],t[2])},MultiPoint:function(t,n){for(var e=t.coordinates,r=-1,i=e.length;++r<i;)t=e[r],n.point(t[0],t[1],t[2])},LineString:function(t,n){xr(t.coordinates,n,0)},MultiLineString:function(t,n){for(var e=t.coordinates,r=-1,i=e.length;++r<i;)xr(e[r],n,0)},Polygon:function(t,n){br(t.coordinates,n)},MultiPolygon:function(t,n){for(var e=t.coordinates,r=-1,i=e.length;++r<i;)br(e[r],n)},GeometryCollection:function(t,n){for(var e=t.geometries,r=-1,i=e.length;++r<i;)mr(e[r],n)}},F_=function(t,n){t&&D_.hasOwnProperty(t.type)?D_[t.type](t,n):mr(t,n)},I_=Ov(),Y_=Ov(),B_={point:gr,lineStart:gr,lineEnd:gr,polygonStart:function(){I_.reset(),B_.lineStart=wr,B_.lineEnd=Mr},polygonEnd:function(){var t=+I_;Y_.add(t<0?w_+t:t),this.lineStart=this.lineEnd=this.point=gr},sphere:function(){Y_.add(w_)}},j_=function(t){return Y_.reset(),F_(t,B_),2*Y_},H_=Ov(),X_={point:Rr,lineStart:Lr,lineEnd:Ur,polygonStart:function(){X_.point=Dr,X_.lineStart=Or,X_.lineEnd=Fr,H_.reset(),B_.polygonStart()},polygonEnd:function(){B_.polygonEnd(),X_.point=Rr,X_.lineStart=Lr,X_.lineEnd=Ur,I_<0?(Hv=-(Vv=180),Xv=-(Wv=90)):H_>y_?Wv=90:H_<-y_&&(Xv=-90),Kv[0]=Hv,Kv[1]=Vv}},V_=function(t){var n,e,r,i,o,u,a;if(Wv=Vv=-(Hv=Xv=1/0),Qv=[],F_(t,X_),e=Qv.length){for(Qv.sort(Yr),n=1,r=Qv[0],o=[r];n<e;++n)i=Qv[n],Br(r,i[0])||Br(r,i[1])?(Ir(r[0],i[1])>Ir(r[0],r[1])&&(r[1]=i[1]),Ir(i[0],r[1])>Ir(r[0],r[1])&&(r[0]=i[0])):o.push(r=i);for(u=-(1/0),e=o.length-1,n=0,r=o[e];n<=e;r=i,++n)i=o[n],(a=Ir(r[1],i[0]))>u&&(u=a,Hv=i[0],Vv=r[1])}return Qv=Kv=null,Hv===1/0||Xv===1/0?[[NaN,NaN],[NaN,NaN]]:[[Hv,Xv],[Vv,Wv]]},W_={sphere:gr,point:jr,lineStart:Xr,lineEnd:$r,polygonStart:function(){W_.lineStart=Zr,W_.lineEnd=Gr},polygonEnd:function(){W_.lineStart=Xr,W_.lineEnd=$r}},$_=function(t){t_=n_=e_=r_=i_=o_=u_=a_=c_=s_=f_=0,F_(t,W_);var n=c_,e=s_,r=f_,i=n*n+e*e+r*r;return i<g_&&(n=o_,e=u_,r=a_,n_<y_&&(n=e_,e=r_,r=i_),i=n*n+e*e+r*r,i<g_)?[NaN,NaN]:[S_(e,n)*M_,_r(r/L_(i))*M_]},Z_=function(t){return function(){return t}},G_=function(t,n){function e(e,r){return e=t(e,r),n(e[0],e[1])}return t.invert&&n.invert&&(e.invert=function(e,r){return e=n.invert(e,r),e&&t.invert(e[0],e[1])}),e};Kr.invert=Kr;var J_,Q_,K_,ty,ny,ey,ry,iy,oy,uy,ay,cy=function(t){function n(n){return n=t(n[0]*T_,n[1]*T_),n[0]*=M_,n[1]*=M_,n}return t=ti(t[0]*T_,t[1]*T_,t.length>2?t[2]*T_:0),n.invert=function(n){return n=t.invert(n[0]*T_,n[1]*T_),n[0]*=M_,n[1]*=M_,n},n},sy=function(){function t(t,n){e.push(t=r(t,n)),t[0]*=M_,t[1]*=M_}function n(){var t=i.apply(this,arguments),n=o.apply(this,arguments)*T_,c=u.apply(this,arguments)*T_;return e=[],r=ti(-t[0]*T_,-t[1]*T_,0).invert,ii(a,n,c,1),t={type:"Polygon",coordinates:[e]},e=r=null,t}var e,r,i=Z_([0,0]),o=Z_(90),u=Z_(6),a={point:t};return n.center=function(t){return arguments.length?(i="function"==typeof t?t:Z_([+t[0],+t[1]]),n):i},n.radius=function(t){return arguments.length?(o="function"==typeof t?t:Z_(+t),n):o},n.precision=function(t){return arguments.length?(u="function"==typeof t?t:Z_(+t),n):u},n},fy=function(){var t,n=[];return{point:function(n,e){t.push([n,e])},lineStart:function(){n.push(t=[])},lineEnd:gr,rejoin:function(){n.length>1&&n.push(n.pop().concat(n.shift()))},result:function(){var e=n;return n=[],t=null,e}}},ly=function(t,n,e,r,i,o){var u,a=t[0],c=t[1],s=n[0],f=n[1],l=0,h=1,p=s-a,d=f-c;if(u=e-a,p||!(u>0)){if(u/=p,p<0){if(u<l)return;u<h&&(h=u)}else if(p>0){if(u>h)return;u>l&&(l=u)}if(u=i-a,p||!(u<0)){if(u/=p,p<0){if(u>h)return;u>l&&(l=u)}else if(p>0){if(u<l)return;u<h&&(h=u)}if(u=r-c,d||!(u>0)){if(u/=d,d<0){if(u<l)return;u<h&&(h=u)}else if(d>0){if(u>h)return;u>l&&(l=u)}if(u=o-c,d||!(u<0)){if(u/=d,d<0){if(u>h)return;u>l&&(l=u)}else if(d>0){if(u<l)return;u<h&&(h=u)}return l>0&&(t[0]=a+l*p,t[1]=c+l*d),h<1&&(n[0]=a+h*p,n[1]=c+h*d),!0}}}}},hy=function(t,n){return N_(t[0]-n[0])<y_&&N_(t[1]-n[1])<y_},py=function(t,n,e,r,i){var o,u,a=[],c=[];if(t.forEach(function(t){if(!((n=t.length-1)<=0)){var n,e,r=t[0],u=t[n];if(hy(r,u)){for(i.lineStart(),o=0;o<n;++o)i.point((r=t[o])[0],r[1]);return void i.lineEnd()}a.push(e=new ui(r,t,null,!0)),c.push(e.o=new ui(r,null,e,!1)),a.push(e=new ui(u,t,null,!1)),c.push(e.o=new ui(u,null,e,!0))}}),a.length){for(c.sort(n),ai(a),ai(c),o=0,u=c.length;o<u;++o)c[o].e=e=!e;for(var s,f,l=a[0];;){for(var h=l,p=!0;h.v;)if((h=h.n)===l)return;s=h.z,i.lineStart();do{if(h.v=h.o.v=!0,h.e){if(p)for(o=0,u=s.length;o<u;++o)i.point((f=s[o])[0],f[1]);else r(h.x,h.n.x,1,i);h=h.n}else{if(p)for(s=h.p.z,o=s.length-1;o>=0;--o)i.point((f=s[o])[0],f[1]);else r(h.x,h.p.x,-1,i);h=h.p}h=h.o,s=h.z,p=!p}while(!h.v);i.lineEnd()}}},dy=1e9,vy=-dy,_y=function(){var t,n,e,r=0,i=0,o=960,u=500;return e={stream:function(e){return t&&n===e?t:t=ci(r,i,o,u)(n=e)},extent:function(a){return arguments.length?(r=+a[0][0],i=+a[0][1],o=+a[1][0],u=+a[1][1],t=n=null,e):[[r,i],[o,u]]}}},yy=Ov(),gy={sphere:gr,point:gr,lineStart:si,lineEnd:gr,polygonStart:gr,polygonEnd:gr},my=function(t){return yy.reset(),F_(t,gy),+yy},xy=[null,null],by={type:"LineString",coordinates:xy},wy=function(t,n){return xy[0]=t,xy[1]=n,my(by)},My=function(t,n){var e=t[0]*T_,r=t[1]*T_,i=n[0]*T_,o=n[1]*T_,u=E_(r),a=R_(r),c=E_(o),s=R_(o),f=u*E_(e),l=u*R_(e),h=c*E_(i),p=c*R_(i),d=2*_r(L_(yr(o-r)+u*c*yr(i-e))),v=R_(d),_=d?function(t){var n=R_(t*=d)/v,e=R_(d-t)/v,r=e*f+n*h,i=e*l+n*p,o=e*a+n*s;return[S_(i,r)*M_,S_(o,L_(r*r+i*i))*M_]}:function(){return[e*M_,r*M_]};return _.distance=d,_},Ty=function(t){return t},Ny=Ov(),ky=Ov(),Sy={point:gr,lineStart:gr,lineEnd:gr,polygonStart:function(){Sy.lineStart=yi,Sy.lineEnd=xi},polygonEnd:function(){Sy.lineStart=Sy.lineEnd=Sy.point=gr,Ny.add(N_(ky)),ky.reset()},result:function(){var t=Ny/2;return Ny.reset(),t}},Ey=1/0,Ay=Ey,Cy=-Ey,zy=Cy,Py={point:bi,lineStart:gr,lineEnd:gr,polygonStart:gr,polygonEnd:gr,result:function(){var t=[[Ey,Ay],[Cy,zy]];return Cy=zy=-(Ay=Ey=1/0),t}},Ry=0,qy=0,Ly=0,Uy=0,Dy=0,Oy=0,Fy=0,Iy=0,Yy=0,By={point:wi,lineStart:Mi,lineEnd:ki,polygonStart:function(){By.lineStart=Si,By.lineEnd=Ei},polygonEnd:function(){By.point=wi,By.lineStart=Mi,By.lineEnd=ki},result:function(){var t=Yy?[Fy/Yy,Iy/Yy]:Oy?[Uy/Oy,Dy/Oy]:Ly?[Ry/Ly,qy/Ly]:[NaN,NaN];return Ry=qy=Ly=Uy=Dy=Oy=Fy=Iy=Yy=0,t}};zi.prototype={_radius:4.5,pointRadius:function(t){return this._radius=t,this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){0===this._line&&this._context.closePath(),this._point=NaN},point:function(t,n){switch(this._point){case 0:this._context.moveTo(t,n),this._point=1;break;case 1:this._context.lineTo(t,n);break;default:this._context.moveTo(t+this._radius,n),this._context.arc(t,n,this._radius,0,w_)}},result:gr},Pi.prototype={_circle:Ri(4.5),pointRadius:function(t){return this._circle=Ri(t),this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){0===this._line&&this._string.push("Z"),this._point=NaN},point:function(t,n){switch(this._point){case 0:this._string.push("M",t,",",n),this._point=1;break;case 1:this._string.push("L",t,",",n);break;default:this._string.push("M",t,",",n,this._circle)}},result:function(){if(this._string.length){var t=this._string.join("");return this._string=[],t}}};var jy=function(t,n){function e(t){return t&&("function"==typeof o&&i.pointRadius(+o.apply(this,arguments)),F_(t,r(i))),i.result()}var r,i,o=4.5;return e.area=function(t){return F_(t,r(Sy)),Sy.result()},e.bounds=function(t){return F_(t,r(Py)),Py.result()},e.centroid=function(t){return F_(t,r(By)),By.result()},e.projection=function(n){return arguments.length?(r=null==n?(t=null,Ty):(t=n).stream,e):t},e.context=function(t){return arguments.length?(i=null==t?(n=null,new Pi):new zi(n=t),"function"!=typeof o&&i.pointRadius(o),e):n},e.pointRadius=function(t){return arguments.length?(o="function"==typeof t?t:(i.pointRadius(+t),+t),e):o},e.projection(t).context(n)},Hy=Ov(),Xy=function(t,n){var e=n[0],r=n[1],i=[R_(e),-E_(e),0],o=0,u=0;Hy.reset();for(var a=0,c=t.length;a<c;++a)if(f=(s=t[a]).length)for(var s,f,l=s[f-1],h=l[0],p=l[1]/2+b_,d=R_(p),v=E_(p),_=0;_<f;++_,h=g,d=x,v=b,l=y){var y=s[_],g=y[0],m=y[1]/2+b_,x=R_(m),b=E_(m),w=g-h,M=w>=0?1:-1,T=M*w,N=T>m_,k=d*x;if(Hy.add(S_(k*M*R_(T),v*b+k*E_(T))),o+=N?w+M*w_:w,N^h>=e^g>=e){var S=Ar(Sr(l),Sr(y));Pr(S);var E=Ar(i,S);Pr(E);var A=(N^w>=0?-1:1)*_r(E[2]);(r>A||r===A&&(S[0]||S[1]))&&(u+=N^w>=0?1:-1)}}return(o<-y_||o<y_&&Hy<-y_)^1&u},Vy=function(t,n,e,r){return function(i,o){function u(n,e){var r=i(n,e);t(n=r[0],e=r[1])&&o.point(n,e)}function a(t,n){var e=i(t,n);_.point(e[0],e[1])}function c(){b.point=a,_.lineStart()}function s(){b.point=u,_.lineEnd()}function f(t,n){v.push([t,n]);var e=i(t,n);m.point(e[0],e[1])}function l(){m.lineStart(),v=[]}function h(){f(v[0][0],v[0][1]),m.lineEnd();var t,n,e,r,i=m.clean(),u=g.result(),a=u.length;if(v.pop(),p.push(v),v=null,a)if(1&i){if(e=u[0],(n=e.length-1)>0){for(x||(o.polygonStart(),x=!0),o.lineStart(),t=0;t<n;++t)o.point((r=e[t])[0],r[1]);o.lineEnd()}}else a>1&&2&i&&u.push(u.pop().concat(u.shift())),d.push(u.filter(qi))}var p,d,v,_=n(o),y=i.invert(r[0],r[1]),g=fy(),m=n(g),x=!1,b={point:u,lineStart:c,lineEnd:s,polygonStart:function(){b.point=f,b.lineStart=l,b.lineEnd=h,d=[],p=[]},polygonEnd:function(){b.point=u,b.lineStart=c,b.lineEnd=s,d=Ks(d);var t=Xy(p,y);d.length?(x||(o.polygonStart(),x=!0),py(d,Li,t,e,o)):t&&(x||(o.polygonStart(),x=!0),o.lineStart(),e(null,null,1,o),o.lineEnd()),x&&(o.polygonEnd(),x=!1),d=p=null},sphere:function(){o.polygonStart(),o.lineStart(),e(null,null,1,o),o.lineEnd(),o.polygonEnd()}};return b}},Wy=Vy(function(){return!0},Ui,Oi,[-m_,-x_]),$y=function(t,n){function e(e,r,i,o){ii(o,t,n,i,e,r)}function r(t,n){return E_(t)*E_(n)>a}function i(t){var n,e,i,a,f;return{lineStart:function(){a=i=!1,f=1},point:function(l,h){var p,d=[l,h],v=r(l,h),_=c?v?0:u(l,h):v?u(l+(l<0?m_:-m_),h):0;if(!n&&(a=i=v)&&t.lineStart(),v!==i&&(p=o(n,d),(hy(n,p)||hy(d,p))&&(d[0]+=y_,d[1]+=y_,v=r(d[0],d[1]))),v!==i)f=0,v?(t.lineStart(),p=o(d,n),t.point(p[0],p[1])):(p=o(n,d),t.point(p[0],p[1]),t.lineEnd()),n=p;else if(s&&n&&c^v){var y;_&e||!(y=o(d,n,!0))||(f=0,c?(t.lineStart(),t.point(y[0][0],y[0][1]),t.point(y[1][0],y[1][1]),t.lineEnd()):(t.point(y[1][0],y[1][1]),t.lineEnd(),t.lineStart(),t.point(y[0][0],y[0][1])))}!v||n&&hy(n,d)||t.point(d[0],d[1]),n=d,i=v,e=_},lineEnd:function(){i&&t.lineEnd(),n=null},clean:function(){return f|(a&&i)<<1}}}function o(t,n,e){var r=Sr(t),i=Sr(n),o=[1,0,0],u=Ar(r,i),c=Er(u,u),s=u[0],f=c-s*s;if(!f)return!e&&t;var l=a*c/f,h=-a*s/f,p=Ar(o,u),d=zr(o,l),v=zr(u,h);Cr(d,v);var _=p,y=Er(d,_),g=Er(_,_),m=y*y-g*(Er(d,d)-1);if(!(m<0)){var x=L_(m),b=zr(_,(-y-x)/g);if(Cr(b,d),b=kr(b),!e)return b;var w,M=t[0],T=n[0],N=t[1],k=n[1];T<M&&(w=M,M=T,T=w);var S=T-M,E=N_(S-m_)<y_,A=E||S<y_;if(!E&&k<N&&(w=N,N=k,k=w),A?E?N+k>0^b[1]<(N_(b[0]-M)<y_?N:k):N<=b[1]&&b[1]<=k:S>m_^(M<=b[0]&&b[0]<=T)){var C=zr(_,(-y+x)/g);return Cr(C,d),[b,kr(C)]}}}function u(n,e){var r=c?t:m_-t,i=0;return n<-r?i|=1:n>r&&(i|=2),e<-r?i|=4:e>r&&(i|=8),i}var a=E_(t),c=a>0,s=N_(a)>y_;return Vy(r,i,e,c?[0,-t]:[-m_,t-m_])},Zy=function(t){return{stream:Fi(t)}};Ii.prototype={constructor:Ii,point:function(t,n){this.stream.point(t,n)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};var Gy=16,Jy=E_(30*T_),Qy=function(t,n){return+n?Hi(t,n):ji(t)},Ky=Fi({point:function(t,n){this.stream.point(t*T_,n*T_)}}),tg=function(){return Wi(Zi).scale(155.424).center([0,33.6442])},ng=function(){return tg().parallels([29.5,45.5]).scale(1070).translate([480,250]).rotate([96,0]).center([-.6,38.7])},eg=function(){function t(t){var n=t[0],e=t[1];return a=null,i.point(n,e),a||(o.point(n,e),a)||(u.point(n,e),a)}function n(){return e=r=null,t}var e,r,i,o,u,a,c=ng(),s=tg().rotate([154,0]).center([-2,58.5]).parallels([55,65]),f=tg().rotate([157,0]).center([-3,19.9]).parallels([8,18]),l={point:function(t,n){a=[t,n]}};return t.invert=function(t){var n=c.scale(),e=c.translate(),r=(t[0]-e[0])/n,i=(t[1]-e[1])/n;return(i>=.12&&i<.234&&r>=-.425&&r<-.214?s:i>=.166&&i<.234&&r>=-.214&&r<-.115?f:c).invert(t)},t.stream=function(t){return e&&r===t?e:e=Gi([c.stream(r=t),s.stream(t),f.stream(t)])},t.precision=function(t){return arguments.length?(c.precision(t),s.precision(t),f.precision(t),n()):c.precision()},t.scale=function(n){return arguments.length?(c.scale(n),s.scale(.35*n),f.scale(n),t.translate(c.translate())):c.scale()},t.translate=function(t){if(!arguments.length)return c.translate();var e=c.scale(),r=+t[0],a=+t[1];return i=c.translate(t).clipExtent([[r-.455*e,a-.238*e],[r+.455*e,a+.238*e]]).stream(l),o=s.translate([r-.307*e,a+.201*e]).clipExtent([[r-.425*e+y_,a+.12*e+y_],[r-.214*e-y_,a+.234*e-y_]]).stream(l),u=f.translate([r-.205*e,a+.212*e]).clipExtent([[r-.214*e+y_,a+.166*e+y_],[r-.115*e-y_,a+.234*e-y_]]).stream(l),n()},t.fitExtent=function(n,e){return Yi(t,n,e)},t.fitSize=function(n,e){return Bi(t,n,e)},t.scale(1070)},rg=Ji(function(t){return L_(2/(1+t))});rg.invert=Qi(function(t){return 2*_r(t/2)});var ig=function(){return Xi(rg).scale(124.75).clipAngle(179.999)},og=Ji(function(t){return(t=vr(t))&&t/R_(t)});og.invert=Qi(function(t){return t});var ug=function(){return Xi(og).scale(79.4188).clipAngle(179.999)};Ki.invert=function(t,n){return[t,2*k_(C_(n))-x_]};var ag=function(){return to(Ki).scale(961/w_)},cg=function(){return Wi(eo).scale(109.5).parallels([30,30])};ro.invert=ro;var sg=function(){return Xi(ro).scale(152.63)},fg=function(){return Wi(io).scale(131.154).center([0,13.9389])};oo.invert=Qi(k_);var lg=function(){return Xi(oo).scale(144.049).clipAngle(60)},hg=function(){function t(){return i=o=null,u}var n,e,r,i,o,u,a=1,c=0,s=0,f=1,l=1,h=Ty,p=null,d=Ty;return u={stream:function(t){return i&&o===t?i:i=h(d(o=t))},clipExtent:function(i){return arguments.length?(d=null==i?(p=n=e=r=null,Ty):ci(p=+i[0][0],n=+i[0][1],e=+i[1][0],r=+i[1][1]),t()):null==p?null:[[p,n],[e,r]]},scale:function(n){return arguments.length?(h=uo((a=+n)*f,a*l,c,s),t()):a},translate:function(n){return arguments.length?(h=uo(a*f,a*l,c=+n[0],s=+n[1]),t()):[c,s]},reflectX:function(n){return arguments.length?(h=uo(a*(f=n?-1:1),a*l,c,s),t()):f<0},reflectY:function(n){return arguments.length?(h=uo(a*f,a*(l=n?-1:1),c,s),t()):l<0},fitExtent:function(t,n){return Yi(u,t,n)},fitSize:function(t,n){return Bi(u,t,n)}}};ao.invert=Qi(_r);var pg=function(){return Xi(ao).scale(249.5).clipAngle(90+y_)};co.invert=Qi(function(t){return 2*k_(t)});var dg=function(){return Xi(co).scale(250).clipAngle(142)};so.invert=function(t,n){return[-n,2*k_(C_(t))-x_]};var vg=function(){var t=to(so),n=t.center,e=t.rotate;return t.center=function(t){return arguments.length?n([-t[1],t[0]]):(t=n(),[t[1],-t[0]])},t.rotate=function(t){return arguments.length?e([t[0],t[1],t.length>2?t[2]+90:90]):(t=e(),[t[0],t[1],t[2]-90])},e([0,0,90]).scale(159.155)},_g=function(){function t(t){var o,u=0;t.eachAfter(function(t){var e=t.children;e?(t.x=lo(e),t.y=po(e)):(t.x=o?u+=n(t,o):0,t.y=0,o=t)});var a=_o(t),c=yo(t),s=a.x-n(a,c)/2,f=c.x+n(c,a)/2;return t.eachAfter(i?function(n){n.x=(n.x-t.x)*e,n.y=(t.y-n.y)*r}:function(n){n.x=(n.x-s)/(f-s)*e,n.y=(1-(t.y?n.y/t.y:1))*r})}var n=fo,e=1,r=1,i=!1;return t.separation=function(e){return arguments.length?(n=e,t):n},t.size=function(n){return arguments.length?(i=!1,e=+n[0],r=+n[1],t):i?null:[e,r]},t.nodeSize=function(n){return arguments.length?(i=!0,e=+n[0],r=+n[1],t):i?[e,r]:null},t},yg=function(){return this.eachAfter(go)},gg=function(t){var n,e,r,i,o=this,u=[o];do for(n=u.reverse(),u=[];o=n.pop();)if(t(o),e=o.children)for(r=0,i=e.length;r<i;++r)u.push(e[r]);while(u.length);return this},mg=function(t){for(var n,e,r=this,i=[r];r=i.pop();)if(t(r),n=r.children)for(e=n.length-1;e>=0;--e)i.push(n[e]);return this},xg=function(t){for(var n,e,r,i=this,o=[i],u=[];i=o.pop();)if(u.push(i),n=i.children)for(e=0,r=n.length;e<r;++e)o.push(n[e]);for(;i=u.pop();)t(i);return this},bg=function(t){return this.eachAfter(function(n){for(var e=+t(n.data)||0,r=n.children,i=r&&r.length;--i>=0;)e+=r[i].value;n.value=e})},wg=function(t){return this.eachBefore(function(n){n.children&&n.children.sort(t)})},Mg=function(t){for(var n=this,e=mo(n,t),r=[n];n!==e;)n=n.parent,r.push(n);for(var i=r.length;t!==e;)r.splice(i,0,t),t=t.parent;return r},Tg=function(){for(var t=this,n=[t];t=t.parent;)n.push(t);return n},Ng=function(){var t=[];return this.each(function(n){t.push(n)}),t},kg=function(){var t=[];return this.eachBefore(function(n){n.children||t.push(n)}),t},Sg=function(){var t=this,n=[];return t.each(function(e){e!==t&&n.push({source:e.parent,target:e})}),n};No.prototype=xo.prototype={constructor:No,count:yg,each:gg,eachAfter:xg,eachBefore:mg,sum:bg,sort:wg,path:Mg,ancestors:Tg,descendants:Ng,leaves:kg,links:Sg,copy:bo};var Eg=function(t){for(var n,e=(t=t.slice()).length,r=null,i=r;e;){var o=new ko(t[e-1]);i=i?i.next=o:r=o,t[n]=t[--e]}return{head:r,tail:i}},Ag=function(t){return Eo(Eg(t),[])},Cg=function(t){return Do(t),t},zg=function(t){return function(){return t}},Pg=function(){function t(t){return t.x=e/2,t.y=r/2,n?t.eachBefore(Bo(n)).eachAfter(jo(i,.5)).eachBefore(Ho(1)):t.eachBefore(Bo(Yo)).eachAfter(jo(Io,1)).eachAfter(jo(i,t.r/Math.min(e,r))).eachBefore(Ho(Math.min(e,r)/(2*t.r))),t}var n=null,e=1,r=1,i=Io;return t.radius=function(e){return arguments.length?(n=Oo(e),t):n},t.size=function(n){return arguments.length?(e=+n[0],r=+n[1],t):[e,r]},t.padding=function(n){return arguments.length?(i="function"==typeof n?n:zg(+n),t):i},t},Rg=function(t){t.x0=Math.round(t.x0),t.y0=Math.round(t.y0),t.x1=Math.round(t.x1),t.y1=Math.round(t.y1)},qg=function(t,n,e,r,i){for(var o,u=t.children,a=-1,c=u.length,s=t.value&&(r-n)/t.value;++a<c;)o=u[a],o.y0=e,o.y1=i,o.x0=n,o.x1=n+=o.value*s},Lg=function(){function t(t){var u=t.height+1;return t.x0=t.y0=i,t.x1=e,t.y1=r/u,t.eachBefore(n(r,u)),o&&t.eachBefore(Rg),t}function n(t,n){return function(e){e.children&&qg(e,e.x0,t*(e.depth+1)/n,e.x1,t*(e.depth+2)/n);var r=e.x0,o=e.y0,u=e.x1-i,a=e.y1-i;u<r&&(r=u=(r+u)/2),a<o&&(o=a=(o+a)/2),e.x0=r,e.y0=o,e.x1=u,e.y1=a}}var e=1,r=1,i=0,o=!1;return t.round=function(n){return arguments.length?(o=!!n,t):o},t.size=function(n){return arguments.length?(e=+n[0],r=+n[1],t):[e,r]},t.padding=function(n){return arguments.length?(i=+n,t):i},t},Ug="$",Dg={depth:-1},Og={},Fg=function(){function t(t){var r,i,o,u,a,c,s,f=t.length,l=new Array(f),h={};for(i=0;i<f;++i)r=t[i],a=l[i]=new No(r),null!=(c=n(r,i,t))&&(c+="")&&(s=Ug+(a.id=c),h[s]=s in h?Og:a);for(i=0;i<f;++i)if(a=l[i],c=e(t[i],i,t),null!=c&&(c+="")){if(u=h[Ug+c],!u)throw new Error("missing: "+c);if(u===Og)throw new Error("ambiguous: "+c);u.children?u.children.push(a):u.children=[a],a.parent=u}else{if(o)throw new Error("multiple roots");o=a}if(!o)throw new Error("no root");if(o.parent=Dg,o.eachBefore(function(t){t.depth=t.parent.depth+1,--f}).eachBefore(To),o.parent=null,f>0)throw new Error("cycle");return o}var n=Xo,e=Vo;return t.id=function(e){return arguments.length?(n=Fo(e),t):n},t.parentId=function(n){return arguments.length?(e=Fo(n),t):e},t};Ko.prototype=Object.create(No.prototype);var Ig=function(){function t(t){var r=tu(t);if(r.eachAfter(n),r.parent.m=-r.z,r.eachBefore(e),c)t.eachBefore(i);else{var s=t,f=t,l=t;t.eachBefore(function(t){t.x<s.x&&(s=t),t.x>f.x&&(f=t),t.depth>l.depth&&(l=t)});var h=s===f?1:o(s,f)/2,p=h-s.x,d=u/(f.x+h+p),v=a/(l.depth||1);t.eachBefore(function(t){t.x=(t.x+p)*d,t.y=t.depth*v})}return t}function n(t){var n=t.children,e=t.parent.children,i=t.i?e[t.i-1]:null;if(n){Jo(t);var u=(n[0].z+n[n.length-1].z)/2;i?(t.z=i.z+o(t._,i._),t.m=t.z-u):t.z=u}else i&&(t.z=i.z+o(t._,i._));t.parent.A=r(t,i,t.parent.A||e[0])}function e(t){t._.x=t.z+t.parent.m,t.m+=t.parent.m}function r(t,n,e){if(n){for(var r,i=t,u=t,a=n,c=i.parent.children[0],s=i.m,f=u.m,l=a.m,h=c.m;a=Zo(a),i=$o(i),a&&i;)c=$o(c),u=Zo(u),u.a=t,r=a.z+l-i.z-s+o(a._,i._),r>0&&(Go(Qo(a,t,e),t,r),s+=r,f+=r),l+=a.m,s+=i.m,h+=c.m,f+=u.m;a&&!Zo(u)&&(u.t=a,u.m+=l-f),i&&!$o(c)&&(c.t=i,c.m+=s-h,e=t)}return e}function i(t){t.x*=u,t.y=t.depth*a}var o=Wo,u=1,a=1,c=null;return t.separation=function(n){return arguments.length?(o=n,t):o},t.size=function(n){return arguments.length?(c=!1,u=+n[0],a=+n[1],t):c?null:[u,a]},t.nodeSize=function(n){return arguments.length?(c=!0,u=+n[0],a=+n[1],t):c?[u,a]:null},t},Yg=function(t,n,e,r,i){for(var o,u=t.children,a=-1,c=u.length,s=t.value&&(i-e)/t.value;++a<c;)o=u[a],o.x0=n,o.x1=r,o.y0=e,o.y1=e+=o.value*s},Bg=(1+Math.sqrt(5))/2,jg=function t(n){function e(t,e,r,i,o){nu(n,t,e,r,i,o)}return e.ratio=function(n){return t((n=+n)>1?n:1)},e}(Bg),Hg=function(){function t(t){return t.x0=t.y0=0,t.x1=i,t.y1=o,t.eachBefore(n),u=[0],r&&t.eachBefore(Rg),t}function n(t){var n=u[t.depth],r=t.x0+n,i=t.y0+n,o=t.x1-n,h=t.y1-n;o<r&&(r=o=(r+o)/2),h<i&&(i=h=(i+h)/2),t.x0=r,t.y0=i,t.x1=o,t.y1=h,t.children&&(n=u[t.depth+1]=a(t)/2,r+=l(t)-n,i+=c(t)-n,o-=s(t)-n,h-=f(t)-n,o<r&&(r=o=(r+o)/2),h<i&&(i=h=(i+h)/2),e(t,r,i,o,h))}var e=jg,r=!1,i=1,o=1,u=[0],a=Io,c=Io,s=Io,f=Io,l=Io;return t.round=function(n){return arguments.length?(r=!!n,t):r},t.size=function(n){return arguments.length?(i=+n[0],o=+n[1],t):[i,o]},t.tile=function(n){return arguments.length?(e=Fo(n),t):e},t.padding=function(n){return arguments.length?t.paddingInner(n).paddingOuter(n):t.paddingInner()},t.paddingInner=function(n){return arguments.length?(a="function"==typeof n?n:zg(+n),t):a},t.paddingOuter=function(n){return arguments.length?t.paddingTop(n).paddingRight(n).paddingBottom(n).paddingLeft(n):t.paddingTop()},t.paddingTop=function(n){return arguments.length?(c="function"==typeof n?n:zg(+n),t):c},t.paddingRight=function(n){return arguments.length?(s="function"==typeof n?n:zg(+n),t):s},t.paddingBottom=function(n){return arguments.length?(f="function"==typeof n?n:zg(+n),t):f},t.paddingLeft=function(n){return arguments.length?(l="function"==typeof n?n:zg(+n),t):l},t},Xg=function(t,n,e,r,i){function o(t,n,e,r,i,u,a){if(t>=n-1){var s=c[t];return s.x0=r,s.y0=i,s.x1=u,s.y1=a,void 0}for(var l=f[t],h=e/2+l,p=t+1,d=n-1;p<d;){var v=p+d>>>1;f[v]<h?p=v+1:d=v}var _=f[p]-l,y=e-_;if(a-i>u-r){var g=(i*y+a*_)/e;o(t,p,_,r,i,u,g),o(p,n,y,r,g,u,a)}else{var m=(r*y+u*_)/e;o(t,p,_,r,i,m,a),o(p,n,y,m,i,u,a)}}var u,a,c=t.children,s=c.length,f=new Array(s+1);for(f[0]=a=u=0;u<s;++u)f[u+1]=a+=c[u].value;o(0,s,t.value,n,e,r,i)},Vg=function(t,n,e,r,i){(1&t.depth?Yg:qg)(t,n,e,r,i)},Wg=function t(n){function e(t,e,r,i,o){if((u=t._squarify)&&u.ratio===n)for(var u,a,c,s,f,l=-1,h=u.length,p=t.value;++l<h;){for(a=u[l],c=a.children,s=a.value=0,f=c.length;s<f;++s)a.value+=c[s].value;a.dice?qg(a,e,r,i,r+=(o-r)*a.value/p):Yg(a,e,r,e+=(i-e)*a.value/p,o),p-=a.value}else t._squarify=u=nu(n,t,e,r,i,o),u.ratio=n}return e.ratio=function(n){return t((n=+n)>1?n:1)},e}(Bg),$g=function(t){for(var n,e=-1,r=t.length,i=t[r-1],o=0;++e<r;)n=i,i=t[e],o+=n[1]*i[0]-n[0]*i[1];return o/2},Zg=function(t){for(var n,e,r=-1,i=t.length,o=0,u=0,a=t[i-1],c=0;++r<i;)n=a,a=t[r],c+=e=n[0]*a[1]-a[0]*n[1],o+=(n[0]+a[0])*e,u+=(n[1]+a[1])*e;return c*=3,[o/c,u/c]},Gg=function(t,n,e){return(n[0]-t[0])*(e[1]-t[1])-(n[1]-t[1])*(e[0]-t[0])},Jg=function(t){if((e=t.length)<3)return null;var n,e,r=new Array(e),i=new Array(e);for(n=0;n<e;++n)r[n]=[+t[n][0],+t[n][1],n];for(r.sort(eu),n=0;n<e;++n)i[n]=[r[n][0],-r[n][1]];var o=ru(r),u=ru(i),a=u[0]===o[0],c=u[u.length-1]===o[o.length-1],s=[];for(n=o.length-1;n>=0;--n)s.push(t[r[o[n]][2]]);for(n=+a;n<u.length-c;++n)s.push(t[r[u[n]][2]]);return s},Qg=function(t,n){for(var e,r,i=t.length,o=t[i-1],u=n[0],a=n[1],c=o[0],s=o[1],f=!1,l=0;l<i;++l)o=t[l],e=o[0],r=o[1],r>a!=s>a&&u<(c-e)*(a-r)/(s-r)+e&&(f=!f),c=e,s=r;return f},Kg=function(t){for(var n,e,r=-1,i=t.length,o=t[i-1],u=o[0],a=o[1],c=0;++r<i;)n=u,e=a,o=t[r],u=o[0],a=o[1],n-=u,e-=a,c+=Math.sqrt(n*n+e*e);return c},tm=[].slice,nm={};iu.prototype=fu.prototype={constructor:iu,defer:function(t){if("function"!=typeof t||this._call)throw new Error;if(null!=this._error)return this;var n=tm.call(arguments,1);return n.push(t),++this._waiting,this._tasks.push(n),ou(this),this},abort:function(){return null==this._error&&cu(this,new Error("abort")),this},await:function(t){if("function"!=typeof t||this._call)throw new Error;return this._call=function(n,e){t.apply(null,[n].concat(e))},su(this),this},awaitAll:function(t){if("function"!=typeof t||this._call)throw new Error;return this._call=t,su(this),this}};var em=function(t,n){return t=null==t?0:+t,n=null==n?1:+n,1===arguments.length?(n=t,t=0):n-=t,function(){return Math.random()*n+t}},rm=function(t,n){var e,r;return t=null==t?0:+t,n=null==n?1:+n,function(){var i;if(null!=e)i=e,e=null;else do e=2*Math.random()-1,i=2*Math.random()-1,r=e*e+i*i;while(!r||r>1);return t+n*i*Math.sqrt(-2*Math.log(r)/r)}},im=function(){var t=rm.apply(this,arguments);return function(){return Math.exp(t())}},om=function(t){
return function(){for(var n=0,e=0;e<t;++e)n+=Math.random();return n}},um=function(t){var n=om(t);return function(){return n()/t}},am=function(t){return function(){return-Math.log(1-Math.random())/t}},cm=function(t,n){function e(t){var n,e=s.status;if(!e&&hu(s)||e>=200&&e<300||304===e){if(o)try{n=o.call(r,s)}catch(t){return void a.call("error",r,t)}else n=s;a.call("load",r,n)}else a.call("error",r,t)}var r,i,o,u,a=p("beforesend","progress","load","error"),c=Ie(),s=new XMLHttpRequest,f=null,l=null,h=0;if("undefined"==typeof XDomainRequest||"withCredentials"in s||!/^(http(s)?:)?\/\//.test(t)||(s=new XDomainRequest),"onload"in s?s.onload=s.onerror=s.ontimeout=e:s.onreadystatechange=function(t){s.readyState>3&&e(t)},s.onprogress=function(t){a.call("progress",r,t)},r={header:function(t,n){return t=(t+"").toLowerCase(),arguments.length<2?c.get(t):(null==n?c.remove(t):c.set(t,n+""),r)},mimeType:function(t){return arguments.length?(i=null==t?null:t+"",r):i},responseType:function(t){return arguments.length?(u=t,r):u},timeout:function(t){return arguments.length?(h=+t,r):h},user:function(t){return arguments.length<1?f:(f=null==t?null:t+"",r)},password:function(t){return arguments.length<1?l:(l=null==t?null:t+"",r)},response:function(t){return o=t,r},get:function(t,n){return r.send("GET",t,n)},post:function(t,n){return r.send("POST",t,n)},send:function(n,e,o){return s.open(n,t,!0,f,l),null==i||c.has("accept")||c.set("accept",i+",*/*"),s.setRequestHeader&&c.each(function(t,n){s.setRequestHeader(n,t)}),null!=i&&s.overrideMimeType&&s.overrideMimeType(i),null!=u&&(s.responseType=u),h>0&&(s.timeout=h),null==o&&"function"==typeof e&&(o=e,e=null),null!=o&&1===o.length&&(o=lu(o)),null!=o&&r.on("error",o).on("load",function(t){o(null,t)}),a.call("beforesend",r,s),s.send(null==e?null:e),r},abort:function(){return s.abort(),r},on:function(){var t=a.on.apply(a,arguments);return t===a?r:t}},null!=n){if("function"!=typeof n)throw new Error("invalid callback: "+n);return r.get(n)}return r},sm=function(t,n){return function(e,r){var i=cm(e).mimeType(t).response(n);if(null!=r){if("function"!=typeof r)throw new Error("invalid callback: "+r);return i.get(r)}return i}},fm=sm("text/html",function(t){return document.createRange().createContextualFragment(t.responseText)}),lm=sm("application/json",function(t){return JSON.parse(t.responseText)}),hm=sm("text/plain",function(t){return t.responseText}),pm=sm("application/xml",function(t){var n=t.responseXML;if(!n)throw new Error("parse error");return n}),dm=function(t,n){return function(e,r,i){arguments.length<3&&(i=r,r=null);var o=cm(e).mimeType(t);return o.row=function(t){return arguments.length?o.response(pu(n,r=t)):r},o.row(r),i?o.get(i):o}},vm=dm("text/csv",Bd),_m=dm("text/tab-separated-values",Wd),ym=Array.prototype,gm=ym.map,mm=ym.slice,xm={name:"implicit"},bm=function(t){return function(){return t}},wm=function(t){return+t},Mm=[0,1],Tm=function(n,r,i){var o,u=n[0],a=n[n.length-1],c=e(u,a,null==r?10:r);switch(i=zv(null==i?",f":i),i.type){case"s":var s=Math.max(Math.abs(u),Math.abs(a));return null!=i.precision||isNaN(o=Uv(c,s))||(i.precision=o),t.formatPrefix(i,s);case"":case"e":case"g":case"p":case"r":null!=i.precision||isNaN(o=Dv(c,Math.max(Math.abs(u),Math.abs(a))))||(i.precision=o-("e"===i.type));break;case"f":case"%":null!=i.precision||isNaN(o=Lv(c))||(i.precision=o-2*("%"===i.type))}return t.format(i)},Nm=function(t,n){t=t.slice();var e,r=0,i=t.length-1,o=t[r],u=t[i];return u<o&&(e=r,r=i,i=e,e=o,o=u,u=e),t[r]=n.floor(o),t[i]=n.ceil(u),t},km=new Date,Sm=new Date,Em=Yu(function(){},function(t,n){t.setTime(+t+n)},function(t,n){return n-t});Em.every=function(t){return t=Math.floor(t),isFinite(t)&&t>0?t>1?Yu(function(n){n.setTime(Math.floor(n/t)*t)},function(n,e){n.setTime(+n+e*t)},function(n,e){return(e-n)/t}):Em:null};var Am=Em.range,Cm=1e3,zm=6e4,Pm=36e5,Rm=864e5,qm=6048e5,Lm=Yu(function(t){t.setTime(Math.floor(t/Cm)*Cm)},function(t,n){t.setTime(+t+n*Cm)},function(t,n){return(n-t)/Cm},function(t){return t.getUTCSeconds()}),Um=Lm.range,Dm=Yu(function(t){t.setTime(Math.floor(t/zm)*zm)},function(t,n){t.setTime(+t+n*zm)},function(t,n){return(n-t)/zm},function(t){return t.getMinutes()}),Om=Dm.range,Fm=Yu(function(t){var n=t.getTimezoneOffset()*zm%Pm;n<0&&(n+=Pm),t.setTime(Math.floor((+t-n)/Pm)*Pm+n)},function(t,n){t.setTime(+t+n*Pm)},function(t,n){return(n-t)/Pm},function(t){return t.getHours()}),Im=Fm.range,Ym=Yu(function(t){t.setHours(0,0,0,0)},function(t,n){t.setDate(t.getDate()+n)},function(t,n){return(n-t-(n.getTimezoneOffset()-t.getTimezoneOffset())*zm)/Rm},function(t){return t.getDate()-1}),Bm=Ym.range,jm=Bu(0),Hm=Bu(1),Xm=Bu(2),Vm=Bu(3),Wm=Bu(4),$m=Bu(5),Zm=Bu(6),Gm=jm.range,Jm=Hm.range,Qm=Xm.range,Km=Vm.range,tx=Wm.range,nx=$m.range,ex=Zm.range,rx=Yu(function(t){t.setDate(1),t.setHours(0,0,0,0)},function(t,n){t.setMonth(t.getMonth()+n)},function(t,n){return n.getMonth()-t.getMonth()+12*(n.getFullYear()-t.getFullYear())},function(t){return t.getMonth()}),ix=rx.range,ox=Yu(function(t){t.setMonth(0,1),t.setHours(0,0,0,0)},function(t,n){t.setFullYear(t.getFullYear()+n)},function(t,n){return n.getFullYear()-t.getFullYear()},function(t){return t.getFullYear()});ox.every=function(t){return isFinite(t=Math.floor(t))&&t>0?Yu(function(n){n.setFullYear(Math.floor(n.getFullYear()/t)*t),n.setMonth(0,1),n.setHours(0,0,0,0)},function(n,e){n.setFullYear(n.getFullYear()+e*t)}):null};var ux=ox.range,ax=Yu(function(t){t.setUTCSeconds(0,0)},function(t,n){t.setTime(+t+n*zm)},function(t,n){return(n-t)/zm},function(t){return t.getUTCMinutes()}),cx=ax.range,sx=Yu(function(t){t.setUTCMinutes(0,0,0)},function(t,n){t.setTime(+t+n*Pm)},function(t,n){return(n-t)/Pm},function(t){return t.getUTCHours()}),fx=sx.range,lx=Yu(function(t){t.setUTCHours(0,0,0,0)},function(t,n){t.setUTCDate(t.getUTCDate()+n)},function(t,n){return(n-t)/Rm},function(t){return t.getUTCDate()-1}),hx=lx.range,px=ju(0),dx=ju(1),vx=ju(2),_x=ju(3),yx=ju(4),gx=ju(5),mx=ju(6),xx=px.range,bx=dx.range,wx=vx.range,Mx=_x.range,Tx=yx.range,Nx=gx.range,kx=mx.range,Sx=Yu(function(t){t.setUTCDate(1),t.setUTCHours(0,0,0,0)},function(t,n){t.setUTCMonth(t.getUTCMonth()+n)},function(t,n){return n.getUTCMonth()-t.getUTCMonth()+12*(n.getUTCFullYear()-t.getUTCFullYear())},function(t){return t.getUTCMonth()}),Ex=Sx.range,Ax=Yu(function(t){t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},function(t,n){t.setUTCFullYear(t.getUTCFullYear()+n)},function(t,n){return n.getUTCFullYear()-t.getUTCFullYear()},function(t){return t.getUTCFullYear()});Ax.every=function(t){return isFinite(t=Math.floor(t))&&t>0?Yu(function(n){n.setUTCFullYear(Math.floor(n.getUTCFullYear()/t)*t),n.setUTCMonth(0,1),n.setUTCHours(0,0,0,0)},function(n,e){n.setUTCFullYear(n.getUTCFullYear()+e*t)}):null};var Cx,zx=Ax.range,Px={"-":"",_:" ",0:"0"},Rx=/^\s*\d+/,qx=/^%/,Lx=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;Ya({dateTime:"%x, %X",date:"%-m/%-d/%Y",time:"%-I:%M:%S %p",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});var Ux="%Y-%m-%dT%H:%M:%S.%LZ",Dx=Date.prototype.toISOString?Ba:t.utcFormat(Ux),Ox=+new Date("2000-01-01T00:00:00.000Z")?ja:t.utcParse(Ux),Fx=1e3,Ix=60*Fx,Yx=60*Ix,Bx=24*Yx,jx=7*Bx,Hx=30*Bx,Xx=365*Bx,Vx=function(){return Va(ox,rx,jm,Ym,Fm,Dm,Lm,Em,t.timeFormat).domain([new Date(2e3,0,1),new Date(2e3,0,2)])},Wx=function(){return Va(Ax,Sx,px,lx,sx,ax,Lm,Em,t.utcFormat).domain([Date.UTC(2e3,0,1),Date.UTC(2e3,0,2)])},$x=function(t){return t.match(/.{6}/g).map(function(t){return"#"+t})},Zx=$x("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf"),Gx=$x("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6"),Jx=$x("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9"),Qx=$x("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5"),Kx=Uh(Xt(300,.5,0),Xt(-240,.5,1)),tb=Uh(Xt(-100,.75,.35),Xt(80,1.5,.8)),nb=Uh(Xt(260,.75,.35),Xt(80,1.5,.8)),eb=Xt(),rb=function(t){(t<0||t>1)&&(t-=Math.floor(t));var n=Math.abs(t-.5);return eb.h=360*t-100,eb.s=1.5-1.5*n,eb.l=.8-.9*n,eb+""},ib=Wa($x("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725")),ob=Wa($x("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf")),ub=Wa($x("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4")),ab=Wa($x("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921")),cb=function(t){return function(){return t}},sb=1e-12,fb=Math.PI,lb=fb/2,hb=2*fb,pb=function(){function t(){var t,s,f=+n.apply(this,arguments),l=+e.apply(this,arguments),h=o.apply(this,arguments)-lb,p=u.apply(this,arguments)-lb,d=Math.abs(p-h),v=p>h;if(c||(c=t=Re()),l<f&&(s=l,l=f,f=s),l>sb)if(d>hb-sb)c.moveTo(l*Math.cos(h),l*Math.sin(h)),c.arc(0,0,l,h,p,!v),f>sb&&(c.moveTo(f*Math.cos(p),f*Math.sin(p)),c.arc(0,0,f,p,h,v));else{var _,y,g=h,m=p,x=h,b=p,w=d,M=d,T=a.apply(this,arguments)/2,N=T>sb&&(i?+i.apply(this,arguments):Math.sqrt(f*f+l*l)),k=Math.min(Math.abs(l-f)/2,+r.apply(this,arguments)),S=k,E=k;if(N>sb){var A=tc(N/f*Math.sin(T)),C=tc(N/l*Math.sin(T));(w-=2*A)>sb?(A*=v?1:-1,x+=A,b-=A):(w=0,x=b=(h+p)/2),(M-=2*C)>sb?(C*=v?1:-1,g+=C,m-=C):(M=0,g=m=(h+p)/2)}var z=l*Math.cos(g),P=l*Math.sin(g),R=f*Math.cos(b),q=f*Math.sin(b);if(k>sb){var L=l*Math.cos(m),U=l*Math.sin(m),D=f*Math.cos(x),O=f*Math.sin(x);if(d<fb){var F=w>sb?nc(z,P,D,O,L,U,R,q):[R,q],I=z-F[0],Y=P-F[1],B=L-F[0],j=U-F[1],H=1/Math.sin(Math.acos((I*B+Y*j)/(Math.sqrt(I*I+Y*Y)*Math.sqrt(B*B+j*j)))/2),X=Math.sqrt(F[0]*F[0]+F[1]*F[1]);S=Math.min(k,(f-X)/(H-1)),E=Math.min(k,(l-X)/(H+1))}}M>sb?E>sb?(_=ec(D,O,z,P,l,E,v),y=ec(L,U,R,q,l,E,v),c.moveTo(_.cx+_.x01,_.cy+_.y01),E<k?c.arc(_.cx,_.cy,E,Math.atan2(_.y01,_.x01),Math.atan2(y.y01,y.x01),!v):(c.arc(_.cx,_.cy,E,Math.atan2(_.y01,_.x01),Math.atan2(_.y11,_.x11),!v),c.arc(0,0,l,Math.atan2(_.cy+_.y11,_.cx+_.x11),Math.atan2(y.cy+y.y11,y.cx+y.x11),!v),c.arc(y.cx,y.cy,E,Math.atan2(y.y11,y.x11),Math.atan2(y.y01,y.x01),!v))):(c.moveTo(z,P),c.arc(0,0,l,g,m,!v)):c.moveTo(z,P),f>sb&&w>sb?S>sb?(_=ec(R,q,L,U,f,-S,v),y=ec(z,P,D,O,f,-S,v),c.lineTo(_.cx+_.x01,_.cy+_.y01),S<k?c.arc(_.cx,_.cy,S,Math.atan2(_.y01,_.x01),Math.atan2(y.y01,y.x01),!v):(c.arc(_.cx,_.cy,S,Math.atan2(_.y01,_.x01),Math.atan2(_.y11,_.x11),!v),c.arc(0,0,f,Math.atan2(_.cy+_.y11,_.cx+_.x11),Math.atan2(y.cy+y.y11,y.cx+y.x11),v),c.arc(y.cx,y.cy,S,Math.atan2(y.y11,y.x11),Math.atan2(y.y01,y.x01),!v))):c.arc(0,0,f,b,x,v):c.lineTo(R,q)}else c.moveTo(0,0);if(c.closePath(),t)return c=null,t+""||null}var n=Za,e=Ga,r=cb(0),i=null,o=Ja,u=Qa,a=Ka,c=null;return t.centroid=function(){var t=(+n.apply(this,arguments)+ +e.apply(this,arguments))/2,r=(+o.apply(this,arguments)+ +u.apply(this,arguments))/2-fb/2;return[Math.cos(r)*t,Math.sin(r)*t]},t.innerRadius=function(e){return arguments.length?(n="function"==typeof e?e:cb(+e),t):n},t.outerRadius=function(n){return arguments.length?(e="function"==typeof n?n:cb(+n),t):e},t.cornerRadius=function(n){return arguments.length?(r="function"==typeof n?n:cb(+n),t):r},t.padRadius=function(n){return arguments.length?(i=null==n?null:"function"==typeof n?n:cb(+n),t):i},t.startAngle=function(n){return arguments.length?(o="function"==typeof n?n:cb(+n),t):o},t.endAngle=function(n){return arguments.length?(u="function"==typeof n?n:cb(+n),t):u},t.padAngle=function(n){return arguments.length?(a="function"==typeof n?n:cb(+n),t):a},t.context=function(n){return arguments.length?(c=null==n?null:n,t):c},t};rc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;default:this._context.lineTo(t,n)}}};var db=function(t){return new rc(t)},vb=function(){function t(t){var a,c,s,f=t.length,l=!1;for(null==i&&(u=o(s=Re())),a=0;a<=f;++a)!(a<f&&r(c=t[a],a,t))===l&&((l=!l)?u.lineStart():u.lineEnd()),l&&u.point(+n(c,a,t),+e(c,a,t));if(s)return u=null,s+""||null}var n=ic,e=oc,r=cb(!0),i=null,o=db,u=null;return t.x=function(e){return arguments.length?(n="function"==typeof e?e:cb(+e),t):n},t.y=function(n){return arguments.length?(e="function"==typeof n?n:cb(+n),t):e},t.defined=function(n){return arguments.length?(r="function"==typeof n?n:cb(!!n),t):r},t.curve=function(n){return arguments.length?(o=n,null!=i&&(u=o(i)),t):o},t.context=function(n){return arguments.length?(null==n?i=u=null:u=o(i=n),t):i},t},_b=function(){function t(t){var n,f,l,h,p,d=t.length,v=!1,_=new Array(d),y=new Array(d);for(null==a&&(s=c(p=Re())),n=0;n<=d;++n){if(!(n<d&&u(h=t[n],n,t))===v)if(v=!v)f=n,s.areaStart(),s.lineStart();else{for(s.lineEnd(),s.lineStart(),l=n-1;l>=f;--l)s.point(_[l],y[l]);s.lineEnd(),s.areaEnd()}v&&(_[n]=+e(h,n,t),y[n]=+i(h,n,t),s.point(r?+r(h,n,t):_[n],o?+o(h,n,t):y[n]))}if(p)return s=null,p+""||null}function n(){return vb().defined(u).curve(c).context(a)}var e=ic,r=null,i=cb(0),o=oc,u=cb(!0),a=null,c=db,s=null;return t.x=function(n){return arguments.length?(e="function"==typeof n?n:cb(+n),r=null,t):e},t.x0=function(n){return arguments.length?(e="function"==typeof n?n:cb(+n),t):e},t.x1=function(n){return arguments.length?(r=null==n?null:"function"==typeof n?n:cb(+n),t):r},t.y=function(n){return arguments.length?(i="function"==typeof n?n:cb(+n),o=null,t):i},t.y0=function(n){return arguments.length?(i="function"==typeof n?n:cb(+n),t):i},t.y1=function(n){return arguments.length?(o=null==n?null:"function"==typeof n?n:cb(+n),t):o},t.lineX0=t.lineY0=function(){return n().x(e).y(i)},t.lineY1=function(){return n().x(e).y(o)},t.lineX1=function(){return n().x(r).y(i)},t.defined=function(n){return arguments.length?(u="function"==typeof n?n:cb(!!n),t):u},t.curve=function(n){return arguments.length?(c=n,null!=a&&(s=c(a)),t):c},t.context=function(n){return arguments.length?(null==n?a=s=null:s=c(a=n),t):a},t},yb=function(t,n){return n<t?-1:n>t?1:n>=t?0:NaN},gb=function(t){return t},mb=function(){function t(t){var a,c,s,f,l,h=t.length,p=0,d=new Array(h),v=new Array(h),_=+i.apply(this,arguments),y=Math.min(hb,Math.max(-hb,o.apply(this,arguments)-_)),g=Math.min(Math.abs(y)/h,u.apply(this,arguments)),m=g*(y<0?-1:1);for(a=0;a<h;++a)(l=v[d[a]=a]=+n(t[a],a,t))>0&&(p+=l);for(null!=e?d.sort(function(t,n){return e(v[t],v[n])}):null!=r&&d.sort(function(n,e){return r(t[n],t[e])}),a=0,s=p?(y-h*m)/p:0;a<h;++a,_=f)c=d[a],l=v[c],f=_+(l>0?l*s:0)+m,v[c]={data:t[c],index:a,value:l,startAngle:_,endAngle:f,padAngle:g};return v}var n=gb,e=yb,r=null,i=cb(0),o=cb(hb),u=cb(0);return t.value=function(e){return arguments.length?(n="function"==typeof e?e:cb(+e),t):n},t.sortValues=function(n){return arguments.length?(e=n,r=null,t):e},t.sort=function(n){return arguments.length?(r=n,e=null,t):r},t.startAngle=function(n){return arguments.length?(i="function"==typeof n?n:cb(+n),t):i},t.endAngle=function(n){return arguments.length?(o="function"==typeof n?n:cb(+n),t):o},t.padAngle=function(n){return arguments.length?(u="function"==typeof n?n:cb(+n),t):u},t},xb=ac(db);uc.prototype={areaStart:function(){this._curve.areaStart()},areaEnd:function(){this._curve.areaEnd()},lineStart:function(){this._curve.lineStart()},lineEnd:function(){this._curve.lineEnd()},point:function(t,n){this._curve.point(n*Math.sin(t),n*-Math.cos(t))}};var bb=function(){return cc(vb().curve(xb))},wb=function(){var t=_b().curve(xb),n=t.curve,e=t.lineX0,r=t.lineX1,i=t.lineY0,o=t.lineY1;return t.angle=t.x,delete t.x,t.startAngle=t.x0,delete t.x0,t.endAngle=t.x1,delete t.x1,t.radius=t.y,delete t.y,t.innerRadius=t.y0,delete t.y0,t.outerRadius=t.y1,delete t.y1,t.lineStartAngle=function(){return cc(e())},delete t.lineX0,t.lineEndAngle=function(){return cc(r())},delete t.lineX1,t.lineInnerRadius=function(){return cc(i())},delete t.lineY0,t.lineOuterRadius=function(){return cc(o())},delete t.lineY1,t.curve=function(t){return arguments.length?n(ac(t)):n()._curve},t},Mb={draw:function(t,n){var e=Math.sqrt(n/fb);t.moveTo(e,0),t.arc(0,0,e,0,hb)}},Tb={draw:function(t,n){var e=Math.sqrt(n/5)/2;t.moveTo(-3*e,-e),t.lineTo(-e,-e),t.lineTo(-e,-3*e),t.lineTo(e,-3*e),t.lineTo(e,-e),t.lineTo(3*e,-e),t.lineTo(3*e,e),t.lineTo(e,e),t.lineTo(e,3*e),t.lineTo(-e,3*e),t.lineTo(-e,e),t.lineTo(-3*e,e),t.closePath()}},Nb=Math.sqrt(1/3),kb=2*Nb,Sb={draw:function(t,n){var e=Math.sqrt(n/kb),r=e*Nb;t.moveTo(0,-e),t.lineTo(r,0),t.lineTo(0,e),t.lineTo(-r,0),t.closePath()}},Eb=.8908130915292852,Ab=Math.sin(fb/10)/Math.sin(7*fb/10),Cb=Math.sin(hb/10)*Ab,zb=-Math.cos(hb/10)*Ab,Pb={draw:function(t,n){var e=Math.sqrt(n*Eb),r=Cb*e,i=zb*e;t.moveTo(0,-e),t.lineTo(r,i);for(var o=1;o<5;++o){var u=hb*o/5,a=Math.cos(u),c=Math.sin(u);t.lineTo(c*e,-a*e),t.lineTo(a*r-c*i,c*r+a*i)}t.closePath()}},Rb={draw:function(t,n){var e=Math.sqrt(n),r=-e/2;t.rect(r,r,e,e)}},qb=Math.sqrt(3),Lb={draw:function(t,n){var e=-Math.sqrt(n/(3*qb));t.moveTo(0,2*e),t.lineTo(-qb*e,-e),t.lineTo(qb*e,-e),t.closePath()}},Ub=-.5,Db=Math.sqrt(3)/2,Ob=1/Math.sqrt(12),Fb=3*(Ob/2+1),Ib={draw:function(t,n){var e=Math.sqrt(n/Fb),r=e/2,i=e*Ob,o=r,u=e*Ob+e,a=-o,c=u;t.moveTo(r,i),t.lineTo(o,u),t.lineTo(a,c),t.lineTo(Ub*r-Db*i,Db*r+Ub*i),t.lineTo(Ub*o-Db*u,Db*o+Ub*u),t.lineTo(Ub*a-Db*c,Db*a+Ub*c),t.lineTo(Ub*r+Db*i,Ub*i-Db*r),t.lineTo(Ub*o+Db*u,Ub*u-Db*o),t.lineTo(Ub*a+Db*c,Ub*c-Db*a),t.closePath()}},Yb=[Mb,Tb,Sb,Rb,Pb,Lb,Ib],Bb=function(){function t(){var t;if(r||(r=t=Re()),n.apply(this,arguments).draw(r,+e.apply(this,arguments)),t)return r=null,t+""||null}var n=cb(Mb),e=cb(64),r=null;return t.type=function(e){return arguments.length?(n="function"==typeof e?e:cb(e),t):n},t.size=function(n){return arguments.length?(e="function"==typeof n?n:cb(+n),t):e},t.context=function(n){return arguments.length?(r=null==n?null:n,t):r},t},jb=function(){};fc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=NaN,this._point=0},lineEnd:function(){switch(this._point){case 3:sc(this,this._x1,this._y1);case 2:this._context.lineTo(this._x1,this._y1)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;break;case 2:this._point=3,this._context.lineTo((5*this._x0+this._x1)/6,(5*this._y0+this._y1)/6);default:sc(this,t,n)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n}};var Hb=function(t){return new fc(t)};lc.prototype={areaStart:jb,areaEnd:jb,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._y0=this._y1=this._y2=this._y3=this._y4=NaN,this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x2,this._y2),this._context.closePath();break;case 2:this._context.moveTo((this._x2+2*this._x3)/3,(this._y2+2*this._y3)/3),this._context.lineTo((this._x3+2*this._x2)/3,(this._y3+2*this._y2)/3),this._context.closePath();break;case 3:this.point(this._x2,this._y2),this.point(this._x3,this._y3),this.point(this._x4,this._y4)}},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._x2=t,this._y2=n;break;case 1:this._point=2,this._x3=t,this._y3=n;break;case 2:this._point=3,this._x4=t,this._y4=n,this._context.moveTo((this._x0+4*this._x1+t)/6,(this._y0+4*this._y1+n)/6);break;default:sc(this,t,n)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n}};var Xb=function(t){return new lc(t)};hc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=NaN,this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3;var e=(this._x0+4*this._x1+t)/6,r=(this._y0+4*this._y1+n)/6;this._line?this._context.lineTo(e,r):this._context.moveTo(e,r);break;case 3:this._point=4;default:sc(this,t,n)}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n}};var Vb=function(t){return new hc(t)};pc.prototype={lineStart:function(){this._x=[],this._y=[],this._basis.lineStart()},lineEnd:function(){var t=this._x,n=this._y,e=t.length-1;if(e>0)for(var r,i=t[0],o=n[0],u=t[e]-i,a=n[e]-o,c=-1;++c<=e;)r=c/e,this._basis.point(this._beta*t[c]+(1-this._beta)*(i+r*u),this._beta*n[c]+(1-this._beta)*(o+r*a));this._x=this._y=null,this._basis.lineEnd()},point:function(t,n){this._x.push(+t),this._y.push(+n)}};var Wb=function t(n){function e(t){return 1===n?new fc(t):new pc(t,n)}return e.beta=function(n){return t(+n)},e}(.85);vc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:dc(this,this._x1,this._y1)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2,this._x1=t,this._y1=n;break;case 2:this._point=3;default:dc(this,t,n)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var $b=function t(n){function e(t){return new vc(t,n)}return e.tension=function(n){return t(+n)},e}(0);_c.prototype={areaStart:jb,areaEnd:jb,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._x5=this._y0=this._y1=this._y2=this._y3=this._y4=this._y5=NaN,this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x3,this._y3),this._context.closePath();break;case 2:this._context.lineTo(this._x3,this._y3),this._context.closePath();break;case 3:this.point(this._x3,this._y3),this.point(this._x4,this._y4),this.point(this._x5,this._y5)}},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._x3=t,this._y3=n;break;case 1:this._point=2,this._context.moveTo(this._x4=t,this._y4=n);break;case 2:this._point=3,this._x5=t,this._y5=n;break;default:dc(this,t,n)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Zb=function t(n){function e(t){return new _c(t,n)}return e.tension=function(n){return t(+n)},e}(0);yc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._point=0},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3,this._line?this._context.lineTo(this._x2,this._y2):this._context.moveTo(this._x2,this._y2);break;case 3:this._point=4;default:dc(this,t,n)}this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Gb=function t(n){function e(t){return new yc(t,n)}return e.tension=function(n){return t(+n)},e}(0);mc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x2,this._y2);break;case 3:this.point(this._x2,this._y2)}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){if(t=+t,n=+n,this._point){var e=this._x2-t,r=this._y2-n;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(e*e+r*r,this._alpha))}switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;break;case 2:this._point=3;default:gc(this,t,n)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Jb=function t(n){function e(t){return n?new mc(t,n):new vc(t,0)}return e.alpha=function(n){return t(+n)},e}(.5);xc.prototype={areaStart:jb,areaEnd:jb,lineStart:function(){this._x0=this._x1=this._x2=this._x3=this._x4=this._x5=this._y0=this._y1=this._y2=this._y3=this._y4=this._y5=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0},lineEnd:function(){switch(this._point){case 1:this._context.moveTo(this._x3,this._y3),this._context.closePath();break;case 2:this._context.lineTo(this._x3,this._y3),this._context.closePath();break;case 3:this.point(this._x3,this._y3),this.point(this._x4,this._y4),this.point(this._x5,this._y5)}},point:function(t,n){if(t=+t,n=+n,this._point){var e=this._x2-t,r=this._y2-n;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(e*e+r*r,this._alpha))}switch(this._point){case 0:this._point=1,this._x3=t,this._y3=n;break;case 1:this._point=2,this._context.moveTo(this._x4=t,this._y4=n);break;case 2:this._point=3,this._x5=t,this._y5=n;break;default:gc(this,t,n)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Qb=function t(n){function e(t){return n?new xc(t,n):new _c(t,0)}return e.alpha=function(n){return t(+n)},e}(.5);bc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._x2=this._y0=this._y1=this._y2=NaN,this._l01_a=this._l12_a=this._l23_a=this._l01_2a=this._l12_2a=this._l23_2a=this._point=0;
},lineEnd:function(){(this._line||0!==this._line&&3===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){if(t=+t,n=+n,this._point){var e=this._x2-t,r=this._y2-n;this._l23_a=Math.sqrt(this._l23_2a=Math.pow(e*e+r*r,this._alpha))}switch(this._point){case 0:this._point=1;break;case 1:this._point=2;break;case 2:this._point=3,this._line?this._context.lineTo(this._x2,this._y2):this._context.moveTo(this._x2,this._y2);break;case 3:this._point=4;default:gc(this,t,n)}this._l01_a=this._l12_a,this._l12_a=this._l23_a,this._l01_2a=this._l12_2a,this._l12_2a=this._l23_2a,this._x0=this._x1,this._x1=this._x2,this._x2=t,this._y0=this._y1,this._y1=this._y2,this._y2=n}};var Kb=function t(n){function e(t){return n?new bc(t,n):new yc(t,0)}return e.alpha=function(n){return t(+n)},e}(.5);wc.prototype={areaStart:jb,areaEnd:jb,lineStart:function(){this._point=0},lineEnd:function(){this._point&&this._context.closePath()},point:function(t,n){t=+t,n=+n,this._point?this._context.lineTo(t,n):(this._point=1,this._context.moveTo(t,n))}};var tw=function(t){return new wc(t)};Sc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x0=this._x1=this._y0=this._y1=this._t0=NaN,this._point=0},lineEnd:function(){switch(this._point){case 2:this._context.lineTo(this._x1,this._y1);break;case 3:kc(this,this._t0,Nc(this,this._t0))}(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(t,n){var e=NaN;if(t=+t,n=+n,t!==this._x1||n!==this._y1){switch(this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;break;case 2:this._point=3,kc(this,Nc(this,e=Tc(this,t,n)),e);break;default:kc(this,this._t0,e=Tc(this,t,n))}this._x0=this._x1,this._x1=t,this._y0=this._y1,this._y1=n,this._t0=e}}},(Ec.prototype=Object.create(Sc.prototype)).point=function(t,n){Sc.prototype.point.call(this,n,t)},Ac.prototype={moveTo:function(t,n){this._context.moveTo(n,t)},closePath:function(){this._context.closePath()},lineTo:function(t,n){this._context.lineTo(n,t)},bezierCurveTo:function(t,n,e,r,i,o){this._context.bezierCurveTo(n,t,r,e,o,i)}},Pc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=[],this._y=[]},lineEnd:function(){var t=this._x,n=this._y,e=t.length;if(e)if(this._line?this._context.lineTo(t[0],n[0]):this._context.moveTo(t[0],n[0]),2===e)this._context.lineTo(t[1],n[1]);else for(var r=Rc(t),i=Rc(n),o=0,u=1;u<e;++o,++u)this._context.bezierCurveTo(r[0][o],i[0][o],r[1][o],i[1][o],t[u],n[u]);(this._line||0!==this._line&&1===e)&&this._context.closePath(),this._line=1-this._line,this._x=this._y=null},point:function(t,n){this._x.push(+t),this._y.push(+n)}};var nw=function(t){return new Pc(t)};qc.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._x=this._y=NaN,this._point=0},lineEnd:function(){0<this._t&&this._t<1&&2===this._point&&this._context.lineTo(this._x,this._y),(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line>=0&&(this._t=1-this._t,this._line=1-this._line)},point:function(t,n){switch(t=+t,n=+n,this._point){case 0:this._point=1,this._line?this._context.lineTo(t,n):this._context.moveTo(t,n);break;case 1:this._point=2;default:if(this._t<=0)this._context.lineTo(this._x,n),this._context.lineTo(t,n);else{var e=this._x*(1-this._t)+t*this._t;this._context.lineTo(e,this._y),this._context.lineTo(e,n)}}this._x=t,this._y=n}};var ew=function(t){return new qc(t,.5)},rw=Array.prototype.slice,iw=function(t,n){if((r=t.length)>1)for(var e,r,i=1,o=t[n[0]],u=o.length;i<r;++i){e=o,o=t[n[i]];for(var a=0;a<u;++a)o[a][1]+=o[a][0]=isNaN(e[a][1])?e[a][0]:e[a][1]}},ow=function(t){for(var n=t.length,e=new Array(n);--n>=0;)e[n]=n;return e},uw=function(){function t(t){var o,u,a=n.apply(this,arguments),c=t.length,s=a.length,f=new Array(s);for(o=0;o<s;++o){for(var l,h=a[o],p=f[o]=new Array(c),d=0;d<c;++d)p[d]=l=[0,+i(t[d],h,d,t)],l.data=t[d];p.key=h}for(o=0,u=e(f);o<s;++o)f[u[o]].index=o;return r(f,u),f}var n=cb([]),e=ow,r=iw,i=Dc;return t.keys=function(e){return arguments.length?(n="function"==typeof e?e:cb(rw.call(e)),t):n},t.value=function(n){return arguments.length?(i="function"==typeof n?n:cb(+n),t):i},t.order=function(n){return arguments.length?(e=null==n?ow:"function"==typeof n?n:cb(rw.call(n)),t):e},t.offset=function(n){return arguments.length?(r=null==n?iw:n,t):r},t},aw=function(t,n){if((r=t.length)>0){for(var e,r,i,o=0,u=t[0].length;o<u;++o){for(i=e=0;e<r;++e)i+=t[e][o][1]||0;if(i)for(e=0;e<r;++e)t[e][o][1]/=i}iw(t,n)}},cw=function(t,n){if((e=t.length)>0){for(var e,r=0,i=t[n[0]],o=i.length;r<o;++r){for(var u=0,a=0;u<e;++u)a+=t[u][r][1]||0;i[r][1]+=i[r][0]=-a/2}iw(t,n)}},sw=function(t,n){if((i=t.length)>0&&(r=(e=t[n[0]]).length)>0){for(var e,r,i,o=0,u=1;u<r;++u){for(var a=0,c=0,s=0;a<i;++a){for(var f=t[n[a]],l=f[u][1]||0,h=f[u-1][1]||0,p=(l-h)/2,d=0;d<a;++d){var v=t[n[d]],_=v[u][1]||0,y=v[u-1][1]||0;p+=_-y}c+=l,s+=p*l}e[u-1][1]+=e[u-1][0]=o,c&&(o-=s/c)}e[u-1][1]+=e[u-1][0]=o,iw(t,n)}},fw=function(t){var n=t.map(Oc);return ow(t).sort(function(t,e){return n[t]-n[e]})},lw=function(t){return fw(t).reverse()},hw=function(t){var n,e,r=t.length,i=t.map(Oc),o=ow(t).sort(function(t,n){return i[n]-i[t]}),u=0,a=0,c=[],s=[];for(n=0;n<r;++n)e=o[n],u<a?(u+=i[e],c.push(e)):(a+=i[e],s.push(e));return s.reverse().concat(c)},pw=function(t){return ow(t).reverse()},dw=function(t){return function(){return t}};Yc.prototype={constructor:Yc,insert:function(t,n){var e,r,i;if(t){if(n.P=t,n.N=t.N,t.N&&(t.N.P=n),t.N=n,t.R){for(t=t.R;t.L;)t=t.L;t.L=n}else t.R=n;e=t}else this._?(t=Xc(this._),n.P=null,n.N=t,t.P=t.L=n,e=t):(n.P=n.N=null,this._=n,e=null);for(n.L=n.R=null,n.U=e,n.C=!0,t=n;e&&e.C;)r=e.U,e===r.L?(i=r.R,i&&i.C?(e.C=i.C=!1,r.C=!0,t=r):(t===e.R&&(jc(this,e),t=e,e=t.U),e.C=!1,r.C=!0,Hc(this,r))):(i=r.L,i&&i.C?(e.C=i.C=!1,r.C=!0,t=r):(t===e.L&&(Hc(this,e),t=e,e=t.U),e.C=!1,r.C=!0,jc(this,r))),e=t.U;this._.C=!1},remove:function(t){t.N&&(t.N.P=t.P),t.P&&(t.P.N=t.N),t.N=t.P=null;var n,e,r,i=t.U,o=t.L,u=t.R;if(e=o?u?Xc(u):o:u,i?i.L===t?i.L=e:i.R=e:this._=e,o&&u?(r=e.C,e.C=t.C,e.L=o,o.U=e,e!==u?(i=e.U,e.U=t.U,t=e.R,i.L=t,e.R=u,u.U=e):(e.U=i,i=e,t=e.R)):(r=t.C,t=e),t&&(t.U=i),!r){if(t&&t.C)return void(t.C=!1);do{if(t===this._)break;if(t===i.L){if(n=i.R,n.C&&(n.C=!1,i.C=!0,jc(this,i),n=i.R),n.L&&n.L.C||n.R&&n.R.C){n.R&&n.R.C||(n.L.C=!1,n.C=!0,Hc(this,n),n=i.R),n.C=i.C,i.C=n.R.C=!1,jc(this,i),t=this._;break}}else if(n=i.L,n.C&&(n.C=!1,i.C=!0,Hc(this,i),n=i.L),n.L&&n.L.C||n.R&&n.R.C){n.L&&n.L.C||(n.R.C=!1,n.C=!0,jc(this,n),n=i.L),n.C=i.C,i.C=n.L.C=!1,Hc(this,i),t=this._;break}n.C=!0,t=i,i=i.U}while(!t.C);t&&(t.C=!1)}}};var vw,_w,yw,gw,mw,xw=[],bw=[],ww=1e-6,Mw=1e-12;_s.prototype={constructor:_s,polygons:function(){var t=this.edges;return this.cells.map(function(n){var e=n.halfedges.map(function(e){return ts(n,t[e])});return e.data=n.site.data,e})},triangles:function(){var t=[],n=this.edges;return this.cells.forEach(function(e,r){if(o=(i=e.halfedges).length)for(var i,o,u,a=e.site,c=-1,s=n[i[o-1]],f=s.left===a?s.right:s.left;++c<o;)u=f,s=n[i[c]],f=s.left===a?s.right:s.left,u&&f&&r<u.index&&r<f.index&&ds(a,u,f)<0&&t.push([a.data,u.data,f.data])}),t},links:function(){return this.edges.filter(function(t){return t.right}).map(function(t){return{source:t.left.data,target:t.right.data}})},find:function(t,n,e){for(var r,i,o=this,u=o._found||0,a=o.cells.length;!(i=o.cells[u]);)if(++u>=a)return null;var c=t-i.site[0],s=n-i.site[1],f=c*c+s*s;do i=o.cells[r=u],u=null,i.halfedges.forEach(function(e){var r=o.edges[e],a=r.left;if(a!==i.site&&a||(a=r.right)){var c=t-a[0],s=n-a[1],l=c*c+s*s;l<f&&(f=l,u=a.index)}});while(null!==u);return o._found=r,null==e||f<=e*e?i.site:null}};var Tw=function(){function t(t){return new _s(t.map(function(r,i){var o=[Math.round(n(r,i,t)/ww)*ww,Math.round(e(r,i,t)/ww)*ww];return o.index=i,o.data=r,o}),r)}var n=Fc,e=Ic,r=null;return t.polygons=function(n){return t(n).polygons()},t.links=function(n){return t(n).links()},t.triangles=function(n){return t(n).triangles()},t.x=function(e){return arguments.length?(n="function"==typeof e?e:dw(+e),t):n},t.y=function(n){return arguments.length?(e="function"==typeof n?n:dw(+n),t):e},t.extent=function(n){return arguments.length?(r=null==n?null:[[+n[0][0],+n[0][1]],[+n[1][0],+n[1][1]]],t):r&&[[r[0][0],r[0][1]],[r[1][0],r[1][1]]]},t.size=function(n){return arguments.length?(r=null==n?null:[[0,0],[+n[0],+n[1]]],t):r&&[r[1][0]-r[0][0],r[1][1]-r[0][1]]},t},Nw=function(t){return function(){return t}};gs.prototype={constructor:gs,scale:function(t){return 1===t?this:new gs(this.k*t,this.x,this.y)},translate:function(t,n){return 0===t&0===n?this:new gs(this.k,this.x+this.k*t,this.y+this.k*n)},apply:function(t){return[t[0]*this.k+this.x,t[1]*this.k+this.y]},applyX:function(t){return t*this.k+this.x},applyY:function(t){return t*this.k+this.y},invert:function(t){return[(t[0]-this.x)/this.k,(t[1]-this.y)/this.k]},invertX:function(t){return(t-this.x)/this.k},invertY:function(t){return(t-this.y)/this.k},rescaleX:function(t){return t.copy().domain(t.range().map(this.invertX,this).map(t.invert,t))},rescaleY:function(t){return t.copy().domain(t.range().map(this.invertY,this).map(t.invert,t))},toString:function(){return"translate("+this.x+","+this.y+") scale("+this.k+")"}};var kw=new gs(1,0,0);ms.prototype=gs.prototype;var Sw=function(){t.event.preventDefault(),t.event.stopImmediatePropagation()},Ew=function(){function n(t){t.on("wheel.zoom",s).on("mousedown.zoom",f).on("dblclick.zoom",l).on("touchstart.zoom",h).on("touchmove.zoom",d).on("touchend.zoom touchcancel.zoom",v).style("-webkit-tap-highlight-color","rgba(0,0,0,0)").property("__zoom",Ms)}function e(t,n){return n=Math.max(x,Math.min(b,n)),n===t.k?t:new gs(n,t.x,t.y)}function r(t,n,e){var r=n[0]-e[0]*t.k,i=n[1]-e[1]*t.k;return r===t.x&&i===t.y?t:new gs(t.k,r,i)}function i(t,n){var e=t.invertX(n[0][0])-w,r=t.invertX(n[1][0])-M,i=t.invertY(n[0][1])-T,o=t.invertY(n[1][1])-N;return t.translate(r>e?(e+r)/2:Math.min(0,e)||Math.max(0,r),o>i?(i+o)/2:Math.min(0,i)||Math.max(0,o))}function o(t){return[(+t[0][0]+ +t[1][0])/2,(+t[0][1]+ +t[1][1])/2]}function u(t,n,e){t.on("start.zoom",function(){a(this,arguments).start()}).on("interrupt.zoom end.zoom",function(){a(this,arguments).end()}).tween("zoom",function(){var t=this,r=arguments,i=a(t,r),u=m.apply(t,r),c=e||o(u),s=Math.max(u[1][0]-u[0][0],u[1][1]-u[0][1]),f=t.__zoom,l="function"==typeof n?n.apply(t,r):n,h=E(f.invert(c).concat(s/f.k),l.invert(c).concat(s/l.k));return function(t){if(1===t)t=l;else{var n=h(t),e=s/n[2];t=new gs(e,c[0]-n[0]*e,c[1]-n[1]*e)}i.zoom(null,t)}})}function a(t,n){for(var e,r=0,i=A.length;r<i;++r)if((e=A[r]).that===t)return e;return new c(t,n)}function c(t,n){this.that=t,this.args=n,this.index=-1,this.active=0,this.extent=m.apply(t,n)}function s(){function n(){o.wheel=null,o.end()}if(g.apply(this,arguments)){var o=a(this,arguments),u=this.__zoom,c=Math.max(x,Math.min(b,u.k*Math.pow(2,-t.event.deltaY*(t.event.deltaMode?120:1)/500))),s=zf(this);if(o.wheel)o.mouse[0][0]===s[0]&&o.mouse[0][1]===s[1]||(o.mouse[1]=u.invert(o.mouse[0]=s)),clearTimeout(o.wheel);else{if(u.k===c)return;o.mouse=[s,u.invert(s)],op(this),o.start()}Sw(),o.wheel=setTimeout(n,P),o.zoom("mouse",i(r(e(u,c),o.mouse[0],o.mouse[1]),o.extent))}}function f(){function n(){Sw(),o.moved=!0,o.zoom("mouse",i(r(o.that.__zoom,o.mouse[0]=zf(o.that),o.mouse[1]),o.extent))}function e(){u.on("mousemove.zoom mouseup.zoom",null),_t(t.event.view,o.moved),Sw(),o.end()}if(!y&&g.apply(this,arguments)){var o=a(this,arguments),u=pl(t.event.view).on("mousemove.zoom",n,!0).on("mouseup.zoom",e,!0),c=zf(this);gl(t.event.view),xs(),o.mouse=[c,this.__zoom.invert(c)],op(this),o.start()}}function l(){if(g.apply(this,arguments)){var o=this.__zoom,a=zf(this),c=o.invert(a),s=o.k*(t.event.shiftKey?.5:2),f=i(r(e(o,s),a,c),m.apply(this,arguments));Sw(),k>0?pl(this).transition().duration(k).call(u,f,a):pl(this).call(n.transform,f)}}function h(){if(g.apply(this,arguments)){var n,e,r,i,o=a(this,arguments),u=t.event.changedTouches,c=u.length;for(xs(),e=0;e<c;++e)r=u[e],i=vl(this,u,r.identifier),i=[i,this.__zoom.invert(i),r.identifier],o.touch0?o.touch1||(o.touch1=i):(o.touch0=i,n=!0);return _&&(_=clearTimeout(_),!o.touch1)?(o.end(),i=pl(this).on("dblclick.zoom"),void(i&&i.apply(this,arguments))):void(n&&(_=setTimeout(function(){_=null},z),op(this),o.start()))}}function d(){var n,o,u,c,s=a(this,arguments),f=t.event.changedTouches,l=f.length;for(Sw(),_&&(_=clearTimeout(_)),n=0;n<l;++n)o=f[n],u=vl(this,f,o.identifier),s.touch0&&s.touch0[2]===o.identifier?s.touch0[0]=u:s.touch1&&s.touch1[2]===o.identifier&&(s.touch1[0]=u);if(o=s.that.__zoom,s.touch1){var h=s.touch0[0],p=s.touch0[1],d=s.touch1[0],v=s.touch1[1],y=(y=d[0]-h[0])*y+(y=d[1]-h[1])*y,g=(g=v[0]-p[0])*g+(g=v[1]-p[1])*g;o=e(o,Math.sqrt(y/g)),u=[(h[0]+d[0])/2,(h[1]+d[1])/2],c=[(p[0]+v[0])/2,(p[1]+v[1])/2]}else{if(!s.touch0)return;u=s.touch0[0],c=s.touch0[1]}s.zoom("touch",i(r(o,u,c),s.extent))}function v(){var n,e,r=a(this,arguments),i=t.event.changedTouches,o=i.length;for(xs(),y&&clearTimeout(y),y=setTimeout(function(){y=null},z),n=0;n<o;++n)e=i[n],r.touch0&&r.touch0[2]===e.identifier?delete r.touch0:r.touch1&&r.touch1[2]===e.identifier&&delete r.touch1;r.touch1&&!r.touch0&&(r.touch0=r.touch1,delete r.touch1),r.touch0||r.end()}var _,y,g=bs,m=ws,x=0,b=1/0,w=-b,M=b,T=w,N=M,k=250,E=Ch,A=[],C=p("start","zoom","end"),z=500,P=150;return n.transform=function(t,n){var e=t.selection?t.selection():t;e.property("__zoom",Ms),t!==e?u(t,n):e.interrupt().each(function(){a(this,arguments).start().zoom(null,"function"==typeof n?n.apply(this,arguments):n).end()})},n.scaleBy=function(t,e){n.scaleTo(t,function(){var t=this.__zoom.k,n="function"==typeof e?e.apply(this,arguments):e;return t*n})},n.scaleTo=function(t,u){n.transform(t,function(){var t=m.apply(this,arguments),n=this.__zoom,a=o(t),c=n.invert(a),s="function"==typeof u?u.apply(this,arguments):u;return i(r(e(n,s),a,c),t)})},n.translateBy=function(t,e,r){n.transform(t,function(){return i(this.__zoom.translate("function"==typeof e?e.apply(this,arguments):e,"function"==typeof r?r.apply(this,arguments):r),m.apply(this,arguments))})},c.prototype={start:function(){return 1===++this.active&&(this.index=A.push(this)-1,this.emit("start")),this},zoom:function(t,n){return this.mouse&&"mouse"!==t&&(this.mouse[1]=n.invert(this.mouse[0])),this.touch0&&"touch"!==t&&(this.touch0[1]=n.invert(this.touch0[0])),this.touch1&&"touch"!==t&&(this.touch1[1]=n.invert(this.touch1[0])),this.that.__zoom=n,this.emit("zoom"),this},end:function(){return 0===--this.active&&(A.splice(this.index,1),this.index=-1,this.emit("end")),this},emit:function(t){S(new ys(n,t,this.that.__zoom),C.apply,C,[t,this.that,this.args])}},n.filter=function(t){return arguments.length?(g="function"==typeof t?t:Nw(!!t),n):g},n.extent=function(t){return arguments.length?(m="function"==typeof t?t:Nw([[+t[0][0],+t[0][1]],[+t[1][0],+t[1][1]]]),n):m},n.scaleExtent=function(t){return arguments.length?(x=+t[0],b=+t[1],n):[x,b]},n.translateExtent=function(t){return arguments.length?(w=+t[0][0],M=+t[1][0],T=+t[0][1],N=+t[1][1],n):[[w,T],[M,N]]},n.duration=function(t){return arguments.length?(k=+t,n):k},n.interpolate=function(t){return arguments.length?(E=t,n):E},n.on=function(){var t=C.on.apply(C,arguments);return t===C?n:t},n};t.version=Ts,t.bisect=Es,t.bisectRight=Es,t.bisectLeft=As,t.ascending=Ns,t.bisector=ks,t.descending=Cs,t.deviation=Rs,t.extent=qs,t.histogram=Vs,t.thresholdFreedmanDiaconis=$s,t.thresholdScott=Zs,t.thresholdSturges=Xs,t.max=Gs,t.mean=Js,t.median=Qs,t.merge=Ks,t.min=tf,t.pairs=nf,t.permute=ef,t.quantile=Ws,t.range=Is,t.scan=rf,t.shuffle=of,t.sum=uf,t.ticks=Hs,t.tickStep=e,t.transpose=af,t.variance=Ps,t.zip=cf,t.axisTop=s,t.axisRight=f,t.axisBottom=l,t.axisLeft=h,t.brush=md,t.brushX=Ee,t.brushY=Ae,t.brushSelection=Se,t.chord=kd,t.ribbon=Rd,t.nest=Ld,t.set=Ve,t.map=Ie,t.keys=Dd,t.values=Od,t.entries=Fd,t.color=Mt,t.rgb=St,t.hsl=zt,t.lab=Lt,t.hcl=Bt,t.cubehelix=Xt,t.dispatch=p,t.drag=xl,t.dragDisable=gl,t.dragEnable=_t,t.dsvFormat=Id,t.csvParse=Bd,t.csvParseRows=jd,t.csvFormat=Hd,t.csvFormatRows=Xd,t.tsvParse=Wd,t.tsvParseRows=$d,t.tsvFormat=Zd,t.tsvFormatRows=Gd,t.easeLinear=ne,t.easeQuad=ie,t.easeQuadIn=ee,t.easeQuadOut=re,t.easeQuadInOut=ie,t.easeCubic=ae,t.easeCubicIn=oe,t.easeCubicOut=ue,t.easeCubicInOut=ae,t.easePoly=zp,t.easePolyIn=Ap,t.easePolyOut=Cp,t.easePolyInOut=zp,t.easeSin=fe,t.easeSinIn=ce,t.easeSinOut=se,t.easeSinInOut=fe,t.easeExp=pe,t.easeExpIn=le,t.easeExpOut=he,t.easeExpInOut=pe,t.easeCircle=_e,t.easeCircleIn=de,t.easeCircleOut=ve,t.easeCircleInOut=_e,t.easeBounce=ge,t.easeBounceIn=ye,t.easeBounceOut=ge,t.easeBounceInOut=me,t.easeBack=Wp,t.easeBackIn=Xp,t.easeBackOut=Vp,t.easeBackInOut=Wp,t.easeElastic=Qp,t.easeElasticIn=Jp,t.easeElasticOut=Qp,t.easeElasticInOut=Kp,t.forceCenter=Jd,t.forceCollide=vv,t.forceLink=_v,t.forceManyBody=xv,t.forceSimulation=mv,t.forceX=bv,t.forceY=wv,t.formatDefaultLocale=hr,t.formatLocale=qv,t.formatSpecifier=zv,t.precisionFixed=Lv,t.precisionPrefix=Uv,t.precisionRound=Dv,t.geoArea=j_,t.geoBounds=V_,t.geoCentroid=$_,t.geoCircle=sy,t.geoClipExtent=_y,t.geoDistance=wy,t.geoGraticule=vi,t.geoGraticule10=_i,t.geoInterpolate=My,t.geoLength=my,t.geoPath=jy,t.geoAlbers=ng,t.geoAlbersUsa=eg,t.geoAzimuthalEqualArea=ig,t.geoAzimuthalEqualAreaRaw=rg,t.geoAzimuthalEquidistant=ug,t.geoAzimuthalEquidistantRaw=og,t.geoConicConformal=cg,t.geoConicConformalRaw=eo,t.geoConicEqualArea=tg,t.geoConicEqualAreaRaw=Zi,t.geoConicEquidistant=fg,t.geoConicEquidistantRaw=io,t.geoEquirectangular=sg,t.geoEquirectangularRaw=ro,t.geoGnomonic=lg,t.geoGnomonicRaw=oo,t.geoIdentity=hg,t.geoProjection=Xi,t.geoProjectionMutator=Vi,t.geoMercator=ag,t.geoMercatorRaw=Ki,t.geoOrthographic=pg,t.geoOrthographicRaw=ao,t.geoStereographic=dg,t.geoStereographicRaw=co,t.geoTransverseMercator=vg,t.geoTransverseMercatorRaw=so,t.geoRotation=cy,t.geoStream=F_,t.geoTransform=Zy,t.cluster=_g,t.hierarchy=xo,t.pack=Pg,t.packSiblings=Cg,t.packEnclose=Ag,t.partition=Lg,t.stratify=Fg,t.tree=Ig,t.treemap=Hg,t.treemapBinary=Xg,t.treemapDice=qg,t.treemapSlice=Yg,t.treemapSliceDice=Vg,t.treemapSquarify=jg,t.treemapResquarify=Wg,t.interpolate=mh,t.interpolateArray=hh,t.interpolateBasis=uh,t.interpolateBasisClosed=ah,t.interpolateDate=ph,t.interpolateNumber=dh,t.interpolateObject=vh,t.interpolateRound=xh,t.interpolateString=gh,t.interpolateTransformCss=Th,t.interpolateTransformSvg=Nh,t.interpolateZoom=Ch,t.interpolateRgb=sh,t.interpolateRgbBasis=fh,t.interpolateRgbBasisClosed=lh,t.interpolateHsl=zh,t.interpolateHslLong=Ph,t.interpolateLab=fn,t.interpolateHcl=Rh,t.interpolateHclLong=qh,t.interpolateCubehelix=Lh,t.interpolateCubehelixLong=Uh,t.quantize=Dh,t.path=Re,t.polygonArea=$g,t.polygonCentroid=Zg,t.polygonHull=Jg,t.polygonContains=Qg,t.polygonLength=Kg;t.quadtree=nr;t.queue=fu,t.randomUniform=em,t.randomNormal=rm,t.randomLogNormal=im,t.randomBates=um,t.randomIrwinHall=om,t.randomExponential=am,t.request=cm,t.html=fm,t.json=lm,t.text=hm,t.xml=pm,t.csv=vm,t.tsv=_m,t.scaleBand=vu,t.scalePoint=yu,t.scaleIdentity=Su,t.scaleLinear=ku,t.scaleLog=qu,t.scaleOrdinal=du,t.scaleImplicit=xm,t.scalePow=Uu,t.scaleSqrt=Du,t.scaleQuantile=Ou,t.scaleQuantize=Fu,t.scaleThreshold=Iu,t.scaleTime=Vx,t.scaleUtc=Wx,t.schemeCategory10=Zx,t.schemeCategory20b=Gx,t.schemeCategory20c=Jx,t.schemeCategory20=Qx,t.interpolateCubehelixDefault=Kx,t.interpolateRainbow=rb,t.interpolateWarm=tb,t.interpolateCool=nb,t.interpolateViridis=ib,t.interpolateMagma=ob,t.interpolateInferno=ub,t.interpolatePlasma=ab,t.scaleSequential=$a,t.creator=xf,t.local=x,t.matcher=Nf,t.mouse=zf,t.namespace=mf,t.namespaces=gf,t.select=pl,t.selectAll=dl,t.selection=dt,t.selector=Pf,t.selectorAll=qf,t.touch=vl,t.touches=_l,t.window=Kf,t.customEvent=S,t.arc=pb,t.area=_b,t.line=vb,t.pie=mb,t.radialArea=wb,t.radialLine=bb,t.symbol=Bb,t.symbols=Yb,t.symbolCircle=Mb,t.symbolCross=Tb,t.symbolDiamond=Sb,t.symbolSquare=Rb,t.symbolStar=Pb,t.symbolTriangle=Lb,t.symbolWye=Ib,t.curveBasisClosed=Xb,t.curveBasisOpen=Vb,t.curveBasis=Hb,t.curveBundle=Wb,t.curveCardinalClosed=Zb,t.curveCardinalOpen=Gb,t.curveCardinal=$b,t.curveCatmullRomClosed=Qb,t.curveCatmullRomOpen=Kb,t.curveCatmullRom=Jb,t.curveLinearClosed=tw,t.curveLinear=db,t.curveMonotoneX=Cc,t.curveMonotoneY=zc,t.curveNatural=nw,t.curveStep=ew,t.curveStepAfter=Uc,t.curveStepBefore=Lc,t.stack=uw,t.stackOffsetExpand=aw,t.stackOffsetNone=iw,t.stackOffsetSilhouette=cw,t.stackOffsetWiggle=sw,t.stackOrderAscending=fw,t.stackOrderDescending=lw,t.stackOrderInsideOut=hw,t.stackOrderNone=ow,t.stackOrderReverse=pw,t.timeInterval=Yu,t.timeMillisecond=Em,t.timeMilliseconds=Am,t.utcMillisecond=Em,t.utcMilliseconds=Am,t.timeSecond=Lm,t.timeSeconds=Um,t.utcSecond=Lm,t.utcSeconds=Um,t.timeMinute=Dm,t.timeMinutes=Om,t.timeHour=Fm,t.timeHours=Im,t.timeDay=Ym,t.timeDays=Bm,t.timeWeek=jm,t.timeWeeks=Gm,t.timeSunday=jm,t.timeSundays=Gm,t.timeMonday=Hm,t.timeMondays=Jm,t.timeTuesday=Xm,t.timeTuesdays=Qm,t.timeWednesday=Vm,t.timeWednesdays=Km,t.timeThursday=Wm,t.timeThursdays=tx,t.timeFriday=$m,t.timeFridays=nx,t.timeSaturday=Zm,t.timeSaturdays=ex,t.timeMonth=rx,t.timeMonths=ix,t.timeYear=ox,t.timeYears=ux,t.utcMinute=ax,t.utcMinutes=cx,t.utcHour=sx,t.utcHours=fx,t.utcDay=lx,t.utcDays=hx,t.utcWeek=px,t.utcWeeks=xx,t.utcSunday=px,t.utcSundays=xx,t.utcMonday=dx,t.utcMondays=bx,t.utcTuesday=vx,t.utcTuesdays=wx,t.utcWednesday=_x,t.utcWednesdays=Mx,t.utcThursday=yx,t.utcThursdays=Tx,t.utcFriday=gx,t.utcFridays=Nx,t.utcSaturday=mx,t.utcSaturdays=kx,t.utcMonth=Sx,t.utcMonths=Ex,t.utcYear=Ax,t.utcYears=zx,t.timeFormatDefaultLocale=Ya,t.timeFormatLocale=Wu,t.isoFormat=Dx,t.isoParse=Ox,t.now=pn,t.timer=_n,t.timerFlush=yn,t.timeout=Wh,t.interval=$h,t.transition=Kn,t.active=rd,t.interrupt=op,t.voronoi=Tw,t.zoom=Ew,t.zoomTransform=ms,t.zoomIdentity=kw,Object.defineProperty(t,"__esModule",{value:!0})});!function() {

   let umo = function() {};

   // these events will propagate to all objects created with factory functions
   umo.addPoint_events = [];
   umo.undo_events = [];
   umo.reset_events = [];

   umo.pointParser = defaultPointParser;

   let formats = {
      games: {
         'advantage': { description: 'Advantage Game', tiebreak: false, hasDecider: false, threshold: 4, minDiff: 2, },
         'noAdvantage': { description: 'No Advantage Game', tiebreak: false, hasDecider: true, threshold: 4, minDiff: 1, },
         'tiebreak7a': { description: 'Tiebreak to 7', tiebreak: true, hasDecider: false, threshold: 7, minDiff: 2,  },
         'tiebreak10a': { description: 'Tiebreak to 10', tiebreak: true, hasDecider: false, threshold: 10, minDiff: 2, },
         'tiebreak12a': { description: 'Tiebreak to 10', tiebreak: true, hasDecider: false, threshold: 12, minDiff: 2, },
         'tiebreak9n': { description: 'Tiebreak to 9, Golden Point', tiebreak: true, hasDecider: true, threshold: 9, minDiff: 1, },
      },
      sets: {
         'AdSetsTo6tb7': { 
            description: 'Advantage, 6 games for set, Tiebreak to 7',
            hasDecider: true, threshold: 6, minDiff: 2, children: 'advantage', decidingChild: 'tiebreak7a', 
         },
         'NoAdSetsTo6tb7': { 
            description: 'No-Ad, 6 games for set, Tiebreak to 7',
            hasDecider: true, threshold: 6, minDiff: 2, children: 'noAdvantage', decidingChild: 'tiebreak7a', 
         },
         'NoAdSetsTo4tb7': { 
            description: 'No-Ad, 4 games for set, Tiebreak to 7',
            hasDecider: true, threshold: 4, minDiff: 0, children: 'noAdvantage', decidingChild: 'tiebreak7a', 
         },
         'longSetTo6by2': { 
            description: 'Advantage, 6 games for set, win by 2 games',
            hasDecider: false, threshold: 6, minDiff: 2, children: 'advantage', decidingChild: 'advantage', 
         },
         'supertiebreak': { 
            description: 'Supertiebreak',
            hasDecider: true, threshold: 1, minDiff: 1, children: 'tiebreak10a',  decidingChild: 'tiebreak10a', 
         },
         'pro10a12': { 
            description: '10 Game No Ad Pro Set; tiebreak to 12',
            hasDecider: true, threshold: 10, minDiff: 2, children: 'noAdvantage', decidingChild: 'tiebreak12a',
         },
         'pro8a7': { 
            description: '8 Game Pro Set; tiebreak to 7', 
            hasDecider: true, threshold: 8, minDiff: 2, children: 'advantage', decidingChild: 'tiebreak7a'
         },
      },
      matches: {
         '3_6a_7': { 
            name: 'Standard Advantage',
            description: 'best of 3 sets, Advantage, 6 games for set, Tiebreak to 7', 
            hasDecider: true, threshold: 2, minDiff: 0, children: 'AdSetsTo6tb7', decidingChild: 'AdSetsTo6tb7',
         },
         '3_6n_7': { 
            name: 'Standard No-Advantage',
            description: 'best of 3 sets, No Advantage, 6 games for set, Tiebreak to 7', 
            hasDecider: true, threshold: 2, minDiff: 0, children: 'NoAdSetsTo6tb7', decidingChild: 'NoAdSetsTo6tb7',
         },
         '3_4n_10': { 
            name: 'Standard Under 10',
            description: 'best of 3 sets, No Advantage, 4 games for set, Tiebreak to 7, final set Supertiebreak', 
            hasDecider: true, threshold: 2, minDiff: 0, children: 'NoAdSetsTo4tb7', decidingChild: 'supertiebreak',
         },
         '1_4n_7': { 
            name: 'Under 10 Qualifying',
            description: '4 games for set, No Advantage, Tiebreak to 7 at 3-3', 
            hasDecider: false, threshold: 1, minDiff: 0, children: 'NoAdSetsTo4tb7', decidingChild: 'NoAdSetsTo4tb7',
         },
         '3_6n_10': { 
            name: 'No-Ad, 3rd Set Supertiebreak',
            description: 'best of 3 sets, No-Ad, 6 games for set, Tiebreak to 7, final set Supertiebreak', 
            hasDecider: true, threshold: 2, minDiff: 0, children: 'NoAdSetsTo6tb7', decidingChild: 'supertiebreak',
         },
         '5_6a_7': { 
            name: 'US Open Men',
            description: 'best of 5 sets, Advantage, 6 games for set, Tiebreak to 7', 
            hasDecider: true, threshold: 3, minDiff: 0, children: 'AdSetsTo6tb7', decidingChild: 'AdSetsTo6tb7',
         },
         '5_6a_7_long': { 
            name: 'Grand Slam Men - Final Advantage Set',
            description: 'best of 5 sets, Advantage, 6 games for set, Tiebreak to 7, final set by 2 games', 
            hasDecider: true, threshold: 3, minDiff: 0, children: 'AdSetsTo6tb7', decidingChild: 'longSetTo6by2',
         },
         '3_6a_7_long': { 
            name: 'Grand Slam Women - Final Advantage Set',
            description: 'best of 5 sets, Advantage, 6 games for set, Tiebreak to 7, final set by 2 games', 
            hasDecider: true, threshold: 2, minDiff: 0, children: 'AdSetsTo6tb7', decidingChild: 'longSetTo6by2',
         },
         '1_8a_7': { 
            name: '8 Game Pro Set',
            description: '1 set, Advantage, 8 games for set, Tiebreak to 7', 
            hasDecider: true, threshold: 1, minDiff: 0, children: 'pro8a7', decidingChild: 'pro8a7',
         },
      },
   }

   umo.formats = () => formats;
   umo.newFormat = ({type, code, description, tiebreak, hasDecider, threshold, minDiff, children, decidingChild} = {}) => {
      let hasType = Object.keys(formats).indexOf(type) >= 0;
      let hasCode = hasType && Object.keys(formats[type]).indexOf(code) >= 0;
      if (hasType && hasCode) return false;
      formats[type][code] = { description, tiebreak, hasDecider, threshold, minDiff, children, decidingChild };
      return true;
   }

   umo.stateObject = ({index, object, parent_object, child, format, common = umo.common()} = {}) => {
      let so = {};
      so.child = child;
      so.format = format;
      so.child_attributes = ['hasDecider', 'threshold', 'minDiff', 'tiebreak', 'code', 'description'];

      (so.reset = function(format) {
         so.children = [];
         so.local_history = [];
         so.counter = [0, 0];
         so.first_service = 0;
         if (!parent_object) {
            common.metadata.reset();
            common.metadata.resetStats();
            common.history = [];
            common.perspective_score = false;
            common.events.reset().forEach(fx => fx());
         }
         if (!parent_object && format) {
            so.format.singles(true);
            so.format.type(format);
         }
      })();

      so.set = {
         index(value) {
            if (!arguments.length) return index;
            if (!isNaN(value)) index = value;
            return so.set;
         },
         liveStats(value) {
            if (!arguments.length) return common.live_stats;
            if ([true, false].indexOf(value) < 0) return false;
            if (value && !common.live_stats && so.history.points().length) {
               common.metadata.resetStats();
               common.stats.counters();
            }
            if (!value && common.live_stats) common.metadata.resetStats();
            common.live_stats = value;
            return so.set;
         },
         perspectiveScore(value) {
            if (!arguments.length) return common.perspective_score;
            if (so.history.points().length) return false;
            if ([true, false].indexOf(value) >= 0) common.perspective_score = value;
            return so.set;
         },
         firstService(value) {
            if (!arguments.length) return so.first_service;
            if (common.metadata.serviceOrder().indexOf(value) < 0) return false;
            so.first_service = value;
            return so.set;
         },
      };

      so.history = {};
      so.history.local = () => so.local_history;
      so.history.action = (action) =>  common.history.filter(episode => episode.action == action);
      so.history.points = (set) => {
         let points = common.history.filter(episode => episode.action == 'addPoint').map(episode => episode.point); 
         if (set != undefined) points = points.filter(point => point.set == set);
         return points;
      }
      so.history.score = () => { 
         if (object == 'Game') return so.history.points().map(point => point.score); 
         return [].concat(...so.children.map(child => child.history.score())); 
      }
      so.history.games = () => (object == 'Set') ? so.local_history : [].concat(...so.children.map(child => child.history.games()));
      so.history.lastPoint = () => { 
         let point_history = so.history.points();
         return point_history[point_history.length - 1] || { score: '0-0' };
      }
      so.history.common = () => common.history;

      so.score = () => {
         let counters = {};
         counters.local = so.counter;
         counters.points = object == 'Game' ? (so.complete() ? [0, 0] : so.counter) : (so.lastChild() ? so.lastChild().score().counters.points : [0, 0]); 
         counters.games = object == 'Set' ? (so.complete() ? [0, 0] : so.counter) : (object == 'Match' ? (so.lastChild() ? so.lastChild().score().counters.games : [0, 0]) : undefined);
         counters.sets = object == 'Match' ? so.counter : undefined;
         let current = {};
         let score = { counters };
         score.points = object == 'Game' ? (so.complete() ? '0-0' : so.scoreboard()) : (so.lastChild() ? so.lastChild().score().points : '0-0'); 
         score.games = object == 'Set' ? (so.complete() ? '0-0' : so.perspectiveScore().join('-')) : (so.lastChild() ? so.lastChild().score().games : '0-0');
         score.sets = object == 'Match' ? (so.complete() ? '0-0' : so.perspectiveScore().join('-')) : (so.lastChild() ? so.lastChild().score().sets : '0-0');
         score.components = {};
         if (object == 'Match' && so.children.length) {
            score.components.sets = so.children.map(set => {
               let map = { games: set.score().counters.local };
               if (set.lastChild() && set.lastChild().format.tiebreak()) map.tiebreak = set.lastChild().score().counters.local;
               return map;
            });
         }
         score.display = {};
         return score;
      };

      so.accessChildren = () => so.children;
      so.lastChild = () => so.children[so.children.length - 1];
      so.scoreDifference = () => Math.abs(so.counter[0] - so.counter[1]);
      so.thresholdMet = () => Math.max(...so.counter) >= so.format.threshold();
      so.minDifferenceMet = () => so.scoreDifference() >= so.format.minDiff();
      so.singleThresholdMet = () => Math.max(...so.counter) >= so.format.threshold() && Math.min(...so.counter) < so.format.threshold();
      so.winner = () => (so.complete()) ? (so.counter[0] > so.counter[1] ? 0 : 1) : undefined;
      so.reverseScore = () => common.perspective_score && (so.nextTeamServing() % 2) == 1;
      so.nextTeamServing = () => common.metadata.teams().map(team => team.indexOf(so.nextService()) >= 0).indexOf(true);
      so.nextTeamReceiving = () => common.metadata.teams().map(team => team.indexOf(so.nextService()) >= 0).indexOf(false);
      so.perspectiveScore = (counter = so.counter, force) => {
         if (force != undefined) return force ? counter.slice().reverse() : counter;
         return so.reverseScore() ? counter.slice().reverse() : counter; 
      }
      so.complete = () => {
         function beyondDoubleThreshold() { return so.counter[0] >= so.format.threshold() && so.counter[1] >= so.format.threshold(); }
         return (so.thresholdMet() && so.minDifferenceMet()) || (beyondDoubleThreshold() && so.scoreDifference() && so.format.hasDecider()) ? true : false;
      }
      so.nextService = () => {
         if (so.complete()) return false;
         let last_child = so.lastChild();

         if (common.metadata.serviceOrder().indexOf(so.first_service) < 0) {
            // this would imply that #players decreased from 4 to 2
            // so, if at the beginning of a game the next team should be 1 - last team
            console.log('PROBLEM');
         }

         if (object == 'Game') {
            if (!so.format.tiebreak()) return so.first_service;
            return common.nextTiebreakService(so.local_history, so.first_service);
         }

         if (!last_child) return so.first_service;
         if (last_child.complete()) {
            let descendent = last_child.lastChild();
            while(descendent) { 
               last_child = descendent;
               descendent = last_child.lastChild();
            }
            let last_first_service = last_child.set.firstService();
            return common.advanceService(last_first_service);
         }
         return last_child.nextService();
      }

      so.currentChild = () => {
         if (so.complete()) return false;
         let last_child = so.lastChild();
         if (last_child && !last_child.complete()) return last_child;
         return so.newChild();
      }

      so.newChild = () => {
         let last_child = so.lastChild();
         let next_first_service;
         if (!last_child) {
            next_first_service = so.first_service;
         } else {
            let descendent = last_child.lastChild();
            while(descendent) { 
               last_child = descendent;
               descendent = last_child.lastChild();
            }
            next_first_service = common.advanceService(last_child.set.firstService());
         }

         let threshold = so.format.threshold();
         let min_diff = so.format.minDiff();
         let countersAtValue = (value) => so.counter[0] == value && so.counter[1] == value;
         let deciding_child_required = ( 
            (countersAtValue(threshold) && (so.format.hasDecider() || min_diff == 1)) || 
            (countersAtValue(threshold - 1) && min_diff == 0) );
         let code = (deciding_child_required) ? so.format.decidingChild.settings().code : so.format.children.settings().code;
         let total_children = so.children.length;

         let new_child = umo[so.child.object]({index: total_children, parent_object: so, type: code, common: common, });
         new_child.set.firstService(next_first_service);

         if (!code) {
            let source_format = (deciding_child_required) ? so.format.decidingChild : so.format.children;
            copyAttributes(source_format, new_child.format, so.child_attributes);
            if (source_format.children) {
               copyAttributes(source_format.children, new_child.format.children, so.child_attributes);
               copyAttributes(source_format.decidingChild, new_child.format.decidingChild, so.child_attributes);
            }
         }

         so.children.push(new_child);
         return new_child;

         function copyAttributes(source, target, attributes) { 
            attributes.forEach(attribute => { 
               if (typeof source[attribute] == 'function') {
                  let value = source[attribute]();
                  let existing_value = target[attribute]();
                  target[attribute](value); 
                  let new_value = target[attribute]();
               }
            }); 
         }
      }

      let addPoint = (value) => {
         if (so.complete()) return { result: false };

         let server = so.nextService();
         let point = common.pointParser(value, server, so.history.lastPoint(), so.format, common.metadata.teams(), so.set.perspectiveScore(), so.score());
         if (!point) return { result: false };
         so.counter[point.winner] += 1;

         let attributes = { 
            points: so.counter.slice(), 
            score: so.scoreboard(), 
            number: so.local_history.filter(episode => episode.winner != undefined).length,
            index: so.history.points().length,
            [object.toLowerCase()]: index,
         }
        
         let points_to_game = so.pointsToGame();
         let has_game_point = points_to_game ? points_to_game.indexOf(1) : undefined;
         let breakpoint = has_game_point >= 0 && has_game_point == 1 - common.metadata.playerTeam(server);

         if (breakpoint) attributes.breakpoint = true;
         if (so.format.tiebreak()) attributes.tiebreak = true;
         if (common.metadata.timestamps() && !point.uts) attributes.uts = new Date().valueOf();
         Object.assign(point, attributes);
         so.local_history.push(point);

         let episode = { 
            action: 'addPoint',
            result: true, complete: so.complete(), 
            point: point, 
            needed: { points_to_game } 
         };

         common.history.push(episode);
         return episode;
      }

      so.addPoint = (value) => {
         if (Array.isArray(value)) return false;
         if (object == 'Game') return addPoint(value);

         let child = so.currentChild();
         if (!child) return { result: false };
         let episode = child.addPoint(value);
         if (!episode.result) return episode;

         if (child.complete()) {
            so.counter[episode.point.winner] += 1;
            so.local_history.push({ winner: episode.point.winner, [so.child.plural]: so.counter.slice(), index: child.set.index() });
         }
         episode.complete = so.complete();
         episode.next_service = so.nextService();
         let points_to_set = so.pointsNeeded ? so.pointsNeeded() : undefined;
         if (points_to_set) episode.needed = Object.assign({}, episode.needed, points_to_set);
         episode.point[so.child.label] = child.set.index();
         episode[so.child.label] = { 
            complete: child.complete(), 
            winner: child.winner(), 
            [so.child.plural]: so.counter.slice(), 
            index: child.set.index() 
         };
         if (!parent_object) common.addStatPoint(episode);
         if (!parent_object) common.events.addPoint().forEach(fx => fx(episode));
         return episode;
      }

      so.addPoints = (values = []) => so.addMultiple({values});

      so.addScore = (value) => {
         let episode = so.addPoint(value);
         if (episode.result) return episode;
         let last_point = so.history.lastPoint();
         let last_points = !last_point || last_point.score == '0-0' ? [0, 0] : last_point.points;
         let total_points = last_points.reduce((a, b) => (a + b));
         let attempt = so.change.pointScore(value);
         if (attempt.result) {
            so.undo();
            let new_points = attempt.pointChange.to;
            let new_total = new_points.reduce((a, b) => (a + b));
            let change = new_points.map((p, i) => { return { diff: p - last_points[i], i } }).filter(f=>f.diff);
            if (change.length == 1 && change[0].diff > 0) {
               let result;
               let player = change[0].i;
               let points_to_player = change[0].diff;
               for (let p=0; p < points_to_player; p++) {
                  result = so.addPoint(player);
                  if (!result.result) return result;
                  if (result.game.complete) return result;
               }
               return result;
            }
         }
         return { result: false };
      }

      so.addScores = (values = []) => so.addMultiple({values, fx: so.addScore});

      so.addMultiple = ({ values = [], fx = so.addPoint }) => {
         if (typeof values == 'string') values = values.match(/[01A-Za-z][\*\#\@]*/g);
         let added = [];
         let rejected = [];
         while (values.length) {
            let value = values.shift();
            let episode = fx(value);
            if (episode.result) {
               added.push(episode);
            } else {
               values.unshift(value);
               rejected = values.slice();
               values = [];
            }
         }
         return { result: added.length, added, rejected };
      }

      so.decoratePoint = (point, attributes) => {
         let indices = common.history
            .map((episode, i)  => { if (episode.action == 'addPoint' && episode.point.index == point.index) return i; })
            .filter(index => index != undefined);
         if (!indices.length) return false;
         let episode = common.history[indices[0]];
         episode.point = Object.assign({}, episode.point, attributes);
      }

      so.change = {};
      so.change.points = (values) => {
         if (!numbersArray(values) || values.length != 2) return false;
         if (object == 'Game') {
            let past_threshold = Math.max(...values) > so.format.threshold();
            let value_difference = Math.abs(values[0] - values[1]);
            if (past_threshold && value_difference > so.format.minDiff()) return false;
            if (so.complete()) return { result: false };
            let episode = { action: 'changePoints', result: true, pointChange: { from: so.counter, to: values } };
            so.local_history.push(episode);
            common.history.push(episode);
            so.counter = values;
            if (so.complete()) { 
               let winner = parseInt(so.winner());
               parent_object.counter[winner] += 1;
               parent_object.local_history.push({ winner: winner, games: parent_object.counter.slice(), index: index });
            }
            return episode;
         }
         return so.propagatePointChange(values, 'points');
      }
      so.change.pointScore = (value) => {
         if (value == '0-0') return so.change.points([0, 0]);
         if (object == 'Game') {
            if (so.format.tiebreak()) return so.change.points(value.split('-').map(v => parseInt(v)));
            value = value.replace(':', '-').split('-').map(m => m.trim()).join('-').split('D').join('40');
            let progression = Object.assign({}, adProgression);
            if (so.format.hasDecider()) Object.keys(noAdProgression).forEach(key => progression[key] = noAdProgression[key]);
            let valid_values = [].concat(...Object.keys(progression).map(key => progression[key]));
            if (valid_values.indexOf(value) < 0) return false;
            let point_value = ['0', '15', '30', '40', 'A', 'G'];
            let values = value.split('-').map(v => point_value.indexOf(v));

            // correct for advantage games that don't reach deuce
            if (values[0] == 5 && values[1] != 3) values[0] = 4;
            if (values[1] == 5 && values[0] != 3) values[1] = 4;
            return so.change.points(values);
         }
         return so.propagatePointChange(value, 'pointScore');
      }
      so.propagatePointChange = (values, fx) => {
         let last_child = so.lastChild();
         if (!last_child) { 
            if (object == 'Match') { return so.newChild().newChild().change[fx](values); }
            if (object == 'Set') { return so.newChild().change[fx](values); }
         };
         if (!parent_object && so.complete()) return { result: false };
         if (last_child.complete()) { return so.newChild().change[fx](values); }
         return last_child.change[fx](values);
      }
      so.change.games = (values) => {
         if (!numbersArray(values) || values.length != 2) return false;
         if (object == 'Game') return { result: false };
         if (object == 'Set') {
            if (so.complete()) return { result: false };
            let episode = { action: 'changeGames', result: true, gameChange: { from: so.counter, to: values } };
            so.local_history.push(episode);
            common.history.push(episode);
            so.counter = values;
            return episode;
         }
         let last_child = so.lastChild();
         if (!last_child && object == 'Match') { return so.newChild().change.games(values); };
         if (!parent_object && so.complete()) return { result: false };
         if (last_child.complete()) { return so.newChild().change.games(values); }
         return last_child.change.games(values);
      }

      so.undo = (count = 1) => {
         if (isNaN(count)) return false;
         if (object != 'Game' && !so.children.length && !so.local_history.length) return false;
         if (!common.history.length) return false;
         let undo = () => {
            let action = common.history[common.history.length - 1].action;
            return undo_actions[action]();
         }
         let undone = [...Array(count).keys()].map(i => undo());
         common.events.undo().forEach(fx => fx(undone));
         return (count == 1) ? undone[0] : undone;
      }

      let undo_actions = {};
      undo_actions.addPoint = () => {
         if (object == 'Game') {
            // clean up local and common histories
            so.local_history.pop();
            let common_episode = common.history.pop();
            so.counter[common_episode.point.winner] -= 1;
            common.removeStatPoint(common_episode);
            // common.events.undo().forEach(fx => fx(common_episode.point));
            return common_episode.point;
         }
         return so.propagateUndo();
      };
      undo_actions.changePoints = () => {
         if (object == 'Game') {
            // clean up local and common histories
            so.local_history.pop();
            let common_episode = common.history.pop();
            so.counter = common_episode.pointChange.from;
            return common_episode;
         }
         return so.propagateUndo();
      };
      undo_actions.changeGames = () => {
         if (object == 'Set') {
            // clean up local and common histories
            so.local_history.pop();
            let common_episode = common.history.pop();
            so.counter = common_episode.gameChange.from;
            return common_episode;
         }
         return so.propagateUndo();
      };

      so.propagateUndo = () => {
         let last_child = so.lastChild();
         let last_child_complete = last_child.complete();
         let episode = last_child.undo();

         // remove the last history event and decrement the counter
         if (last_child_complete) {
            // pop history of non-game object
            let episode = so.local_history.pop();
            if (episode && episode.winner != undefined) so.counter[episode.winner] -= 1;
         }

         if (!last_child.history.local().length && last_child.lastChild() == undefined) so.children.pop();
         return episode;
      }
      return so;
   }

   umo.Match = ({index, type, common = umo.common()} = {}) => {
      let child = { object: 'Set', label: 'set', plural: 'sets' }
      let format = umo.matchFormat({type, common});
      let match = umo.stateObject({index, object: 'Match', format, child, common});

      match.scoreboard = (perspective) => { 
         if (!match.children.length) return '0-0';
         if (perspective == undefined) perspective = match.set.perspectiveScore() ? match.nextService() : undefined;
         return match.children.map(child => child.scoreboard(perspective)).join(', '); 
      }

      return { 
         set: match.set, reset: match.reset, format: match.format, 
         events: common.events, assignParser: common.assignParser, metadata: common.metadata, 
         nextService: match.nextService, nextTeamServing: match.nextTeamServing, nextTeamReceiving: match.nextTeamReceiving,
         change: match.change, undo: match.undo, 
         addPoint: match.addPoint, addPoints: match.addPoints, decoratePoint: match.decoratePoint,
         addScore: match.addScore, addScores: match.addScores, 
         complete: match.complete, winner: match.winner, 
         score: match.score, scoreboard: match.scoreboard,
         [match.child.plural]: match.accessChildren, 
         history: match.history, stats: common.stats,
      }
   }

   umo.Set = ({index, parent_object, type, common = umo.common()} = {}) => {
      let child = { object: 'Game', label: 'game', plural: 'games' }
      let format = umo.setFormat({type, common});
      let set = umo.stateObject({index, parent_object, object: 'Set', format, child, common});

      set.pointsNeeded = () => {
         let threshold = set.format.threshold();
         if (set.complete()) {
            let points_to_set = [];
            points_to_set[set.winner()] = 0;
            let loser = 1 - set.winner();
            let pts = set.history.action('addPoint').filter(episode => episode.point.set == index).map(episode => episode.needed.points_to_set).filter(f=>f);
            points_to_set[loser] = Math.max(...pts.map(p=>p[loser]));
            return { points_to_set };
         }
         let deciding_game = set.format.hasDecider();
         let score_difference = set.scoreDifference();
         let min_diff = set.format.minDiff();
         let deciding_game_format_required = [false, false];
         let games_to_set = set.counter.map((player_score, player) => {
            let opponent_score = set.counter[1 - player];
            if (player_score > opponent_score) {
               if (opponent_score == threshold && deciding_game) return 0;
               if (player_score >= threshold && score_difference >= min_diff) return 0;
               if (player_score >= threshold - 1) return 1;
               return threshold - player_score;
            } else if (opponent_score > player_score) {
               deciding_game_format_required[player] = deciding_game && threshold == opponent_score;
               if (player_score == threshold && deciding_game) return 0;
               if (opponent_score >= threshold && score_difference >= min_diff) return 0;
               if (deciding_game_format_required[player]) return score_difference + 1;
               if (opponent_score >= threshold - 1) return score_difference + min_diff;
               return threshold - player_score;
            } else {
               deciding_game_format_required[player] = 
                  ((deciding_game && threshold == player_score && threshold == opponent_score) ||
                   (min_diff == 1 && threshold == player_score && threshold == opponent_score) ||
                   (min_diff == 0 && threshold - 1 == player_score && threshold - 1 == opponent_score));
               if (deciding_game_format_required[player]) return 1;
               if (player_score >= threshold - 1) return min_diff;
               return threshold - player_score;
            }
         });

         let last_game = set.lastChild();
         let points_to_set = games_to_set.map((player_games_to_set, player) => {
            let points_needed = 0;
            if (last_game && !last_game.complete()) {
               points_needed += last_game.pointsToGame()[player];
               player_games_to_set -= 1;
            }
            if (!player_games_to_set) return points_needed;
            
            if (deciding_game_format_required[player]) {
               points_needed += set.format.decidingChild.threshold();
               player_games_to_set -= 1;
            }

            for (let i=player_games_to_set; i; i--) { points_needed += set.format.children.threshold(); }
            return points_needed;
         });

         return { points_to_set, games_to_set };
      }

      let formatScore = ([p0score, p1score], [t0score, t1score], tiebreak_to) => {
         if (t0score || t1score) {
            if (t0score > t1score) p1score += `(${t1score})`;
            if (t1score > t0score) p0score += `(${t0score})`;
         }
         return `${p0score}-${p1score}`
      }

      set.scoreboard = (perspective) => {
         let last_game = set.lastChild();
         let score = set.perspectiveScore(set.counter, perspective);
         if (!last_game) return score.join('-');
         let tiebreak = (last_game.format.tiebreak() == true);
         if (last_game.complete() && !tiebreak) return score.join('-');
         if (!last_game.complete()) return `${score.join('-')} (${last_game.scoreboard(perspective)})`;
         let last_game_score = last_game.score().counters.local;
         let tiebreak_score = set.perspectiveScore(last_game_score, perspective);
         if (tiebreak && set.complete() && set.children.length == 1) return tiebreak_score.join('-');
         let tiebreak_to = last_game.format.threshold();
         return formatScore(score, tiebreak_score, tiebreak_to);
      }

      return { 
         set: set.set, reset: set.reset, format: set.format, 
         events: common.events, assignParser: common.assignParser, metadata: common.metadata, 
         nextService: set.nextService, nextTeamServing: set.nextTeamServing, nextTeamReceiving: set.nextTeamReceiving,
         change: set.change, undo: set.undo, 
         addPoint: set.addPoint, addPoints: set.addPoints, decoratePoint: set.decoratePoint,
         addScore: set.addScore, addScores: set.addScores, 
         complete: set.complete, winner: set.winner, 
         score: set.score, scoreboard: set.scoreboard, 
         [set.child.plural]: set.accessChildren, children: set.accessChildren, lastChild: set.lastChild, newChild: set.newChild,
         history: set.history,
         pointsNeeded: set.pointsNeeded, 
      }
   }

   umo.Game = ({index, parent_object, type, common = umo.common()} = {}) => {
      let child = { object: 'Point', label: 'point', plural: 'points' }
      let format = umo.gameFormat({type, common});
      let game = umo.stateObject({index, object: 'Game', parent_object, format, child, common});

      game.pointsToGame = () => {
         if (game.complete()) return undefined;
         let threshold = game.format.threshold();
         let deciding_point = game.format.hasDecider();
         let score_difference = game.scoreDifference();
         let min_diff = game.format.minDiff();
         let points_to_game = game.counter.map((player_score, player) => {
            let opponent_score = game.counter[1 - player];
            if (player_score > opponent_score) {
               if (opponent_score == threshold && deciding_point) return 0;
               if (player_score >= threshold && score_difference >= min_diff) return 0;
               if (player_score >= threshold - 1) return 1;
               return threshold - player_score;
            } else if (opponent_score > player_score) {
               if (player_score == threshold && deciding_point) return 0;
               if (opponent_score >= threshold && score_difference >= min_diff) return 0;
               if (opponent_score == threshold && deciding_point) return score_difference + 1;
               if (opponent_score >= threshold - 1) return score_difference + min_diff;
               return threshold - player_score;
            } else {
               if (deciding_point && threshold == player_score && threshold == opponent_score) return 1;
               if (player_score >= threshold - 1) return min_diff;
               return threshold - player_score;
            }
         });
         return points_to_game;
      }

      game.scoreboard = (perspective) => {
         let scoreboard;
         let threshold = game.format.threshold();
         let min_diff = game.format.minDiff();
         let score = game.perspectiveScore(game.counter, perspective);
         let tiebreak = threshold != 4 || game.format.tiebreak() == true;
         if (tiebreak) return score.join('-');
         if (!game.thresholdMet() || 
             (game.singleThresholdMet() && game.minDifferenceMet()) ||
             (game.singleThresholdMet() && game.format.hasDecider() && min_diff == 1) ) {
            let progression = ['0', '15', '30', '40', 'G', 'G'];
            scoreboard = score.map((points, player) => progression[points]).join('-');
         } else {
            scoreboard = score.map((points, player) => {
               let opponent_points = score[1 - player];
               let point = points - threshold;
               let opponent_point = opponent_points - threshold;
               if (point > opponent_point && game.minDifferenceMet()) return 'G';
               return (point > opponent_point) ? 'A' : '40';
            }).join('-');
         }
         return scoreboard.indexOf('G') >= 0 ? '0-0' : scoreboard;
      } 

      return { 
         set: game.set, reset: game.reset, format: game.format, 
         events: common.events, assignParser: common.assignParser, metadata: common.metadata,
         nextService: game.nextService, nextTeamServing: game.nextTeamServing, nextTeamReceiving: game.nextTeamReceiving,
         change: game.change, undo: game.undo,
         addPoint: game.addPoint, addPoints: game.addPoints, decoratePoint: game.decoratePoint,
         addScore: game.addScore, addScores: game.addScores, 
         complete: game.complete, winner: game.winner,
         score: game.score, scoreboard: game.scoreboard,
         history: game.history,
         lastChild: game.lastChild,
         pointsToGame: game.pointsToGame, 
      };
   }

   // necessary to define it this way so that hoisting works!
   umo.defaultPointParser = defaultPointParser;
   function defaultPointParser(value, server, last_point, format, teams, perspective, score_object) {
      if (value == undefined) return false;
      if ((value).toString().length == 1 && !isNaN(value)) { 
         let code = +value == server ? 'S' : 'R';
         return ([0, 1].indexOf(+value) < 0) ? false : { winner: +value, server: server, code: code }; 
      }

      let winning_team;
      let serving_team = teams.map(team => team.indexOf(server) >=0).indexOf(true);
      let point = { server: server };

      if (typeof value == 'object') {
         if (value.winner != undefined && [0, 1].indexOf(+value.winner) >= 0) {
            value.winner = parseInt(value.winner);
            value.code = !value.code ? (value.winner == server ? 'S' : 'R') : value.code;
            // lowercase indicates that point was played on second serve
            if (value.first_serve) value.code = value.code.toLowerCase();
            return Object.assign({}, value, point);
         }
         if (value.code && parseCode(value.code)) return Object.assign({}, value, point);
      }

      if (typeof value == 'string') {
         if (parseScore(value)) return point;
         if (parseCode(value)) return point;
      }

      function parseCode(code) {
         let upper_code = code.toUpperCase().match(/[A-Za-z]/g);
         let modifier = code.match(/[*#@]/g);
         if (upper_code) upper_code = upper_code.join('');
         if (modifier) modifier = modifier.join('');
         if ('SAQDRP'.split('').indexOf(String(upper_code)) >= 0 ) {
            if (['S', 'A', 'Q'].indexOf(upper_code) >= 0) { winning_team = serving_team; }
            if (['D', 'R', 'P'].indexOf(upper_code) >= 0) { winning_team = 1 - serving_team; }
            if (['Q', 'P'].indexOf(upper_code) >= 0) { point.result = 'Penalty'; }
            if (upper_code == 'A') point.result = 'Ace';
            if (upper_code == 'D') {
               point.first_serve = { error: 'Error', serves: [ '0e'] };
               point.result = 'Double Fault';
            }
            if (modifier && !point.result) {
               if (modifier == '*') point.result = 'Winner';
               if (modifier == '#') point.result = 'Forced Error';
               if (modifier == '@') point.result = 'Unforced Error';
            }
            point.code = code;
            point.winner = parseInt(winning_team);
            if (code === code.toLowerCase()) point.first_serve = { error: 'Error', serves: [ '0e'] };
            return point;
         }
      }

      function parseScore(value) {
         value = value.replace(':', '-').split('-').map(m => m.trim()).join('-').split('D').join('40');
         if (value.split('-').length != 2) return false;
         let last_score = score_object.points;
         let combinedTotal = (score) => score.reduce((a, b) => a + b); 
         if (format.tiebreak()) {
            let values = value.split('-').map(m => parseInt(m));;
            let last_values = last_score.split('-').map(m => parseInt(m));
            if (!numbersArray(values) || values.length != 2) return false;
            if (combinedTotal(last_values) + 1 != combinedTotal(values)) return false;
            let change = [Math.abs(values[0] - last_values[0]), Math.abs(values[1] - last_values[1])];
            point.winner = change.indexOf(1);
            return point;
         }
         let progression = Object.assign({}, adProgression);
         if (format.hasDecider()) Object.keys(noAdProgression).forEach(key => progression[key] = noAdProgression[key]);

         if (value == '0-0' && progression[last_score].join('-').indexOf('G') >= 0) {
            // one player had game point.  assign winner based on which player has greater # of points.
            point.winner = last_point.points.indexOf(Math.max(...last_point.points));
            return point;
         }
         // after a tiebreak, for instance...
         if (progression[last_score] == undefined) last_score = '0-0';
         let winner = progression[last_score] ? progression[last_score].indexOf(value) : false;
         if (winner >= 0) {
            if (perspective && server) winner = 1 - winner;
            point.winner = winner;
            return point;
         }
      }
   }

   var noAdProgression = { '40-40' : ['G-40', '40-G'] };
   var adProgression = { 
      '0-0'  : ['15-0',  '0-15'], '0-15' : ['15-15', '0-30'], '0-30' : ['15-30', '0-40'], '0-40' : ['15-40', '0-G'], 
      '15-0' : ['30-0',  '15-15'], '15-15': ['30-15', '15-30'], '15-30': ['30-30', '15-40'], '15-40': ['30-40', '15-G'], 
      '30-0' : ['40-0',  '30-15'], '30-15': ['40-15', '30-30'], '30-30': ['40-30', '30-40'], '30-40': ['40-40', '30-G'], 
      '40-0' : ['G-0',   '40-15'], '40-15': ['G-15',  '40-30'], '40-30': ['G-30',  '40-40'], '40-40': ['A-40',  '40-A'], 
      'A-40' : ['G-40',  '40-40'], '40-A' : ['40-40', '40-G']
   };

   umo.matchFormat = ({type = '3_6a_7', common} = {}) => {
      let mf = umo.formatObject({plural: 'matches', common});
      mf.children = umo.setFormat({common});
      mf.decidingChild = umo.setFormat({common});
      mf.init(type);

      return { 
         description: mf.description, singles: mf.singles, doubles: mf.doubles, settings: mf.settings, 
         type: mf.type, types: mf.types, threshold: mf.threshold, hasDecider: mf.hasDecider, 
         minDiff: mf.minDiff, children: mf.children, decidingChild: mf.decidingChild, 
      }
   }

   umo.setFormat = ({type = 'AdSetsTo6tb7', common} = {}) => {
      let sf = umo.formatObject({plural: 'sets', common});
      sf.children = umo.gameFormat({common});
      sf.decidingChild = umo.gameFormat({common, type: 'tiebreak7a'});
      sf.init(type);

      return { 
         description: sf.description, singles: sf.singles, doubles: sf.doubles, settings: sf.settings, 
         type: sf.type, types: sf.types, threshold: sf.threshold, hasDecider: sf.hasDecider, 
         minDiff: sf.minDiff, children: sf.children, decidingChild: sf.decidingChild, 
      }
   }

   umo.gameFormat = ({type = 'advantage', common} = {}) => {
      let gf = umo.formatObject({plural: 'games', common});
      gf.init(type);

      return { 
         description: gf.description, settings: gf.settings, singles: gf.singles, doubles: gf.doubles,
         type: gf.type, types: gf.types, threshold: gf.threshold, hasDecider: gf.hasDecider, 
         minDiff: gf.minDiff, tiebreak: gf.tiebreak,
      }
   }

   umo.formatObject = ({plural, common = umo.common()} = {}) => {
      let fo = {
         values: { plural: plural },
         singles: common.singles,
         doubles: common.doubles,
         init(format_type) { 
            if (fo.types(fo.values.plural).indexOf(format_type) >= 0) { 
               fo.type(format_type); 
               fo.values.initial_code = format_type;
            }
         },
         types(object = fo.values.plural) { return Object.keys(formats[object]); },
         type(format_type) {
            if (!fo.values.plural) return false;
            if (format_type == true && fo.values.initial_code) format_type = fo.values.initial_code;
            if (fo.types(fo.values.plural).indexOf(format_type) >= 0) {
               let f = formats[fo.values.plural][format_type];

               fo.hasDecider(f.hasDecider).minDiff(f.minDiff).threshold(f.threshold);
               if (f.tiebreak != undefined) fo.tiebreak(f.tiebreak);

               // must be set after all other attributes!
               fo.name(f.name);
               fo.description(f.description);
               fo.values.code = format_type;

               if (f.children) fo.children.type(f.children);
               if (f.decidingChild) fo.decidingChild.type(f.decidingChild);
               return true;
            }
         },
         settings({name, description, code, players, threshold, has_decider, min_diff, tiebreak} = {}) {
            if (code) {
               fo.type(code);
            } else if (!threshold || !has_decider || !min_diff || !tiebreak) {
               let number_of_players = typeof common.singles == 'function' ? common.singles() ? 2 : 4 : '';
               let settings = { 
                  name: fo.values.name, description: fo.values.description, 
                  code: fo.values.code, players: number_of_players,
                  threshold: fo.values.threshold, has_decider: fo.values.has_decider, 
                  min_diff: fo.values.min_diff, tiebreak: fo.values.tiebreak,
               };
               return settings;
            } else {
               // TODO: propagate these settings down to unfinished sets/games
               fo.tiebreak(tiebreak);
               fo.threshold(threshold);
               fo.minDiff(min_diff);
               fo.hasDecider(has_decider);
               if (description) fo.description(description);
               if (name) fo.name(name);
               if (players) {
                  if (players == 4) {
                     fo.doubles();
                  } else {
                     fo.singles();
                  }
               }
            }
         },
         name(value) {
            if (!arguments.length) return fo.values.name;
            if (typeof value == 'string') fo.values.name = value;
            return fo;
         },
         description(value) {
            if (!arguments.length) return fo.values.description;
            if (typeof value == 'string') fo.values.description = value;
            return fo;
         },
         tiebreak(value) {
            if (!arguments.length) return fo.values.tiebreak;
            fo.values.description = fo.values.code = undefined;
            if ([true, false].indexOf(value) >= 0) fo.values.tiebreak = value;
            return fo;
         },
         threshold(value) {
            if (!arguments.length) return fo.values.threshold;
            fo.values.description = fo.values.code = undefined;
            if (!isNaN(value)) fo.values.threshold = value;
            return fo;
         },
         minDiff(value) {
            if (!arguments.length) return fo.values.min_diff;
            fo.values.description = fo.values.code = undefined;
            if (!isNaN(value)) fo.values.min_diff = value;
            return fo;
         },
         hasDecider(value) {
            if (!arguments.length) return fo.values.has_decider;
            fo.values.description = fo.values.code = undefined;
            if ([true, false].indexOf(value) >= 0) fo.values.has_decider = value;
            return fo;
         },
      };
      return fo;
   }

   umo.common = () => {
      let number_of_players = 2;
      let addPoint_events = umo.addPoint_events.slice();
      let undo_events = umo.undo_events.slice();
      let reset_events = umo.reset_events.slice();
      let metadata = {};

      let stat_points;
      let last_episode;
      let filtered_stats;

      let accessors = {
         resetStats() { 
            stat_points = undefined; 
            last_episode = undefined;
            filtered_stats = undefined;
         },
         reset() {
            metadata = { 
               players: [], teams: [], service_order: [0, 1], receive_order: [1, 0],
               tournament: {}, match: {}, timestamps: false, 
               charter: undefined, 
            }
         },
         timestamps(value){
            if (!arguments.length) return metadata.timestamps;
            if ([true, false].indexOf(value) >= 0) metadata.timestamps = value;
            return accessors;
         },
         serviceOrder(order) {
            if (!arguments.length) return metadata.service_order.slice();
            return changeOrder(order, 'service_order', 'receive_order');
         },
         doublesServiceChange() {
            if (number_of_players != 4) return false;
            // FIXME: Not allowed if not the end of a set; how to determine within common?
         },
         receiveOrder(order) {
            if (!arguments.length) return metadata.receive_order.slice();
            return changeOrder(order, 'receive_order', 'service_order');
         },
         teams() {
            let teams = [];
            teams[0] = metadata.service_order.filter((service, i) => (i+1)%2).sort();
            teams[1] = metadata.service_order.filter((service, i) => i%2).sort();
            teams.sort();
            return teams;
         },
         playerTeam(player) {
            return accessors.teams().map(team => team.indexOf(player) >= 0).indexOf(true);
         },
         teamPlayers() {
            return accessors.teams().map(team => team.map(i => accessors.players(i).name));
         },
         players(index) {
            if (!arguments.length) {
               if (metadata.players.length > metadata.service_order.length) return metadata.players;
               return metadata.service_order.map(i => accessors.players(i));
            }
            if (isNaN(index) || index < 0 || index > 3) return false;
            if (metadata.players[index]) return metadata.players[index];
            return { name: `Player ${['One', 'Two', 'Three', 'Four'][index]}` };
         },
         definePlayer({index, name, birth, puid, hand, seed, rank, age, entry, ioc, draw_position, } = {}) {
            if (index == undefined) index = metadata.players.length;
            let player = metadata.players[index] || {};
            if ((!name && !player.name) || (isNaN(index) || index > 3)) return false;
            let definition = { name, birth, puid, hand, seed, rank, age, entry, ioc,  draw_position, };
            Object.keys(definition).forEach(key => { if (definition[key]) player[key] = definition[key] });
            metadata.players[index] = player;
            return { index, player };
         },
         defineTournament({ name, tuid, start_date, tour, rank, surface, in_out, draw, draw_size, round, level } = {}) {
            let definition = {name, tuid, start_date, tour, rank, surface, in_out, draw, draw_size, round, level };
            Object.keys(definition).forEach(key => { if (definition[key]) metadata.tournament[key] = definition[key] });
            return metadata.tournament;
         },
         defineMatch({ muid, date, gender, year, court, start_time, end_time, duration, status, umpire, official_score } = {}) {
            let definition = {muid, date, gender, year, court, start_time, end_time, duration, status, umpire, official_score };
            Object.keys(definition).forEach(key => { if (definition[key]) metadata.match[key] = definition[key] });
            return metadata.match;
         },
         showTiebreakOrder(first_service) { return calcTiebreakService(12, first_service); },
      }

      function changeOrder(order, submitted, counterpart) {
         let sameOrder = (a, b) => !a.filter((o, i) => o != b[i]).length;
         let notXinY = (x, y) => y.filter(n => x.indexOf(n) != -1).length != y.length;
         if (!Array.isArray(order) || order.length != number_of_players || notXinY(order, [0,1]) || notXinY([0, 1, 2, 3], order)) return false;

         let no_format_change = (order.length == metadata[submitted].length);
         if (sameOrder(order, metadata[submitted]) && no_format_change) return accessors;

         let teams = accessors.teams();
         metadata[submitted] = order;
         let new_teams = accessors.teams();

         if (order.length == 4 && sameOrder(teams[0], new_teams[0]) && no_format_change && 
               serviceToOpponent(metadata[submitted], metadata[counterpart], new_teams)) return accessors;

         metadata[counterpart] = order.map(o => (order.length - 1) - o);
         return accessors;
      }

      function serviceToOpponent(players, opponents, teams) {
         let sameTeam = (p, o) => teams.filter(team => team.filter(player => [p, o].indexOf(player) >= 0).length > 1).length;
         return !players.filter((s, i) => sameTeam(s, opponents[i])).length;
      }

      function calcTiebreakService(number, first_service) {
         let progression = [];
         return [...Array(number).keys()].map(() => { let result = calcNext(progression, first_service); progression.push(result); return result; });
      }

      function calcNext(progression, first_service) {
         let last_position = pos(progression.length);
         let next_position = ((progression.length + 1) % 4) < 2;
         let last_score = progression[progression.length - 1];
         let last_service = last_score != undefined ? last_score : (first_service != undefined ? first_service : metadata.service_order[0]);
         let next_service = (next_position == last_position) ? last_service : pub.advanceService(last_service);
         return next_service;
      }

      function pos(number) {
         let iterations = [true].concat([...Array(number).keys()].map(i => ((i+1)%4)<2));
         return iterations[number];
      }

      function setServiceOrder() {
         if (number_of_players == 2) {
            let existing_order = pub.metadata.serviceOrder();
            if (existing_order.length == 2) return;
            pub.metadata.serviceOrder(existing_order.filter(f => [0, 1].indexOf(f) >= 0));
         } else {
            let existing_order = pub.metadata.serviceOrder();
            if (existing_order.length == 4) return;
            let new_order = existing_order.slice();
            existing_order.forEach(o => new_order.push(o + 2));
            pub.metadata.serviceOrder(new_order);
         }
      }

      let addEvent = (add_event) => {
         if (!add_event) return addPoint_events;
         if (typeof add_event == 'function') {
            if(addPoint_events.indexOf(add_event) < 0) addPoint_events.push(add_event);
         } else if (typeof add_event == 'array') {
            add_event.foreach(e) (e => { if (typeof e == 'function') addPoint_events.push(c); });
         }
      }

      let undoEvent = (undo_event) => {
         if (!undo_event) return undo_events;
         if (typeof undo_event == 'function') {
            if(undo_events.indexOf(undo_event) < 0) undo_events.push(undo_event);
         } else if (typeof undo_event == 'array') {
            undo_event.foreach(e) (e => { if (typeof e == 'function') undo_events.push(c); });
         }
      }

      let resetEvent = (reset_event) => {
         if (!reset_event) return reset_events;
         if (typeof reset_event == 'function') {
            if(reset_events.indexOf(reset_event) < 0) reset_events.push(reset_event);
         } else if (typeof reset_event == 'array') {
            reset_event.foreach(e) (e => { if (typeof e == 'function') reset_events.push(c); });
         }
      }

      let clearEvents = () => {
         addPoint_events = [];
         undo_events = [];
         reset_events = [];
      }

      let pub = {
         metadata: accessors,
         pointParser: umo.pointParser,
         events: { addPoint: addEvent, undo: undoEvent, clearEvents, reset: resetEvent },
         history: [],
         live_stats: false,
         perspective_score: false,
         assignParser(parser) { pub.pointParser = parser; },
         advanceService(service) {
            let index = metadata.service_order.indexOf(service) + 1;
            return metadata.service_order[index < accessors.players().length ? index : 0];
         },
         nextTiebreakService(history, first_service) {
            let so = calcTiebreakService(history.length + 1, first_service);
            return so[so.length - 1];
         },
         singles(value) { 
            if (!arguments.length) return number_of_players == 2 ? true : false;
            number_of_players = value ? 2 : 4;
            setServiceOrder();
            return pub;
         },
         doubles(value) { 
            if (!arguments.length) return number_of_players == 4 ? true : false;
            number_of_players = value ? 4 : 2;
            setServiceOrder();
            return pub;
         },
         stats: {
            calculated(set_filter) { return calculatedStats(pub.stats.counters(set_filter)); },
            counters(set_filter) {
               if ((set_filter != undefined && filtered_stats != set_filter) || (set_filter == undefined && filtered_stats != undefined)) {
                  accessors.resetStats();
               }
               if (!stat_points) {
                  pub.live_stats = true;
                  let episodes = pub.history.filter(episode => episode.action == 'addPoint');
                  if (set_filter != undefined) {
                     episodes = episodes.filter(episode => episode.point.set == set_filter);
                     filtered_stats = set_filter;
                  }
                  episodes.forEach(episode => pub.addStatPoint(episode));
               }
               return stat_points; 
            },
         },
         addStatPoint(episode) {
            if (!pub.live_stats) return;
            let point = episode.point;
            if (!stat_points) stat_points = { players: {}, teams: {} };
            let server_team = accessors.playerTeam(point.server);
            let team_winner = accessors.playerTeam(point.winner);
            let team_loser = 1 - team_winner;

            addStat({ player: point.server, episode, stat: 'pointsServed' });
            addStat({ team: team_winner, episode, stat: 'pointsWon' });
            if (point.result && point.hand) {
               let player = point.result.indexOf('Winner') >= 0 ? team_winner : team_loser;
               addStat({ player, episode, stat: point.hand });
            }
            if (point.result == 'Ace') addStat({ player: point.server, episode, stat: 'aces' });
            if (point.result == 'Double Fault') addStat({ player: point.server, episode, stat: 'doubleFaults' });
            if (point.result == 'Winner') addStat({ player: point.winner, episode, stat: 'winners' });

            if (point.result == 'Unforced Error') addStat({ team: team_loser, episode, stat: 'unforcedErrors' });
            if (point.result == 'Forced Error') addStat({ team: team_loser, episode, stat: 'forcedErrors' });

            if (!point.first_serve) addStat({ player: point.server, episode, stat: 'serves1stIn' });
            if (!point.first_serve && point.winner == server_team) {
               addStat({ player: point.server, episode, stat: 'serves1stWon' });
               addStat({ team: team_loser, undefined, stat: 'received1stWon' });
               addStat({ team: team_loser, undefined, stat: 'received2ndWon' });
            }
            if (!point.first_serve && point.winner != server_team) addStat({ team: team_winner, episode, stat: 'received1stWon' });
            if (point.first_serve && !point.result != 'Double Fault') addStat({ player: point.server, episode, stat: 'serves2ndIn' });
            if (point.first_serve && !point.result != 'Double Fault' && point.winner == point.server) {
               addStat({ player: point.server, episode, stat: 'serves2ndWon' });
               addStat({ team: team_loser, undefined, stat: 'received1stWon' });
               addStat({ team: team_loser, undefined, stat: 'received2ndWon' });
            }
            if (point.first_serve && !point.result != 'Double Fault' && point.winner != server_team) {
               addStat({ team: team_winner, episode, stat: 'received2ndWon' });
            }
            if (point.breakpoint) {
               addStat({ player: point.server, undefined, stat: 'breakpointsSaved' });
               addStat({ player: point.server, episode, stat: 'breakpointsFaced' });
            }
            if (last_episode && last_episode.point.breakpoint && last_episode.point.server == point.winner) {
               addStat({ player: point.server, episode, stat: 'breakpointsSaved' });
            }

            if (episode.game && episode.game.complete) { addStat({ team: team_winner, episode, stat: 'gamesWon' }); }
            last_episode = episode;
         },
         removeStatPoint(episode) {
            if (!pub.live_stats) return;
            Object.keys(stat_points).forEach(grouping => {
               Object.keys(stat_points[grouping]).forEach(group => {
                  Object.keys(stat_points[grouping][group]).forEach(stat => {
                     if (stat_points[grouping][group][stat].length) {
                        stat_points[grouping][group][stat] = stat_points[grouping][group][stat].filter(f=>f.point.index != episode.point.index);
                     }
                  });
               }); 
            });
            let points = pub.history.filter(episode => episode.action == 'addPoint');
            last_episode = points.length ? points[points.length - 1] : undefined;
         },
      }
      accessors.reset();
      return pub;

      function calculatedStats(stats) {
         if (!stats || !stats.teams) return [];

         // prefix of '-' indicates that value for opposing team should be used
         // '*' indicates that value is optional
         let calculated_stats = {
            'Aces': { numerators: ['aces'], calc: 'number', },
            'Double Faults': { numerators: ['doubleFaults'], calc: 'number',  },
            'First Serve %': { numerators: ['serves1stIn'], denominators: ['pointsServed'], calc: 'percentage', },
            'Unforced Errors': { numerators: ['unforcedErrors'], calc: 'number', },
            'Forced Errors': { numerators: ['forcedErrors'], calc: 'number', },
            'Winners': { numerators: ['winners'], calc: 'number', },
            'Total Points Won': { numerators: ['pointsWon'], calc: 'number', },
            'Max Pts/Row': { numerators: ['pointsWon'], calc: 'maxConsecutive', attribute: 'index', },
            'Max Games/Row': { numerators: ['gamesWon'], calc: 'maxConsecutive', attribute: 'game', },
            'Total Points Won': { numerators: ['pointsWon'], calc: 'number', },
            'Points Won 1st': { numerators: ['serves1stWon'], denominators: ['serves1stIn'], calc: 'percentage', },
            'Points Won 2nd': { numerators: ['serves2ndWon'], denominators: ['serves2ndIn'], calc: 'percentage', },
            'Points Won Receiving': { numerators: ['received1stWon', 'received2ndWon'], denominators: ['-pointsServed'], calc: 'percentage', },
            'Breakpoints Saved': { numerators: ['breakpointsSaved'], denominators: ['breakpointsFaced'], calc: 'percentage', },
            'Breakpoints Converted': { numerators: ['-breakpointsSaved'], denominators: ['-breakpointsFaced'], calc: 'difference', },
            'Aggressive Margin': { 
               calc: 'aggressiveMargin', 
               numerators: ['*doubleFaults', '*unforcedErrors'], 
               denominators: ['*aces', '*winners', '-*forcedErrors'], 
            },
         };

         let reduceComponents = (components, teams, team) => {
            if (!components) return undefined;
            let values = components.map(component => {
               let counter = component.split('-').reverse()[0].split('*').join('');
               let component_team = teams[component.indexOf('-') == 0 ? 1 - team : team];
               return component_team && component_team[counter] ? component_team[counter].length : 0;
            });
            return [].concat(0, 0, ...values).reduce((a, b) => a + b);
         }

         let numeratorDenominator = (stat_obj, teams, team) => {
            let numerator = reduceComponents(stat_obj.numerators, teams, team);
            let denominator = reduceComponents(stat_obj.denominators, teams, team);
            return { numerator, denominator };
         }

         let displayPct = (numerator, denominator) => {
            let pct = Math.round((numerator / denominator) * 100);
            return { value: pct, display: `${pct}% (${numerator}/${denominator})` };
         }

         let stat_calcs = {
            number(stat_obj, teams, team) {
               ({numerator, denominator} = numeratorDenominator(stat_obj, teams, team));
               return { display: numerator, value: numerator, numerators: stat_obj.numerators };
            },
            maxConsecutive(stat_obj, teams, team) {
               let stat = stat_obj.numerators[0];
               let attribute = stat_obj.attribute;
               let episodes = teams[team][stat];
               if (!episodes) return { value: 0, display: 0 };
               let current = undefined;
               let max_consecutive = 0;
               let consecutive = episodes.length ? 1 : 0;
               episodes.forEach(episode => {
                  if (current + 1 == episode.point[attribute]) {
                     consecutive += 1;
                  } else {
                     if (consecutive > max_consecutive) max_consecutive = consecutive;
                     consecutive = 1;
                  }
                  current = episode.point[attribute];
               });
               if (consecutive > max_consecutive) max_consecutive = consecutive;
               return { display: max_consecutive, value: max_consecutive };
            },
            percentage(stat_obj, teams, team) {
               ({numerator, denominator} = numeratorDenominator(stat_obj, teams, team));
               if (numerator == undefined || !denominator) return { value: 0, display: 0 };
               return Object.assign(displayPct(numerator, denominator), { numerators: stat_obj.numerators });
            },
            difference(stat_obj, teams, team) {
               ({numerator, denominator} = numeratorDenominator(stat_obj, teams, team));
               if (numerator == undefined || !denominator) return { value: 0, display: 0 };
               let diff = Math.abs(denominator - numerator);
               return Object.assign(displayPct(diff, denominator), { numerators: stat_obj.numerators });
            },
            aggressiveMargin(stat_obj, teams, team) {
               ({numerator, denominator} = numeratorDenominator(stat_obj, teams, team));
               let diff = denominator - numerator;
               let point_counts = Object.keys(teams).map(team => teams[team].pointsWon ? teams[team].pointsWon.length : 0);
               let total_points = [].concat(0, 0, ...point_counts).reduce((a, b) => a + b);
               return Object.assign(displayPct(diff, total_points), { numerators: stat_obj.numerators });
            }
         }

         let teams_counters = [].concat(...Object.keys(stats.teams).map(team => Object.keys(stats.teams[team])));
         let available_stats = Object.keys(calculated_stats).map(stat => {
            let stat_obj = calculated_stats[stat];
            if (!stat_obj.denominators) stat_obj.denominators = [];
            // must remove any '-' indicators to invert
            let required_counters = [].concat(...stat_obj.numerators, ...stat_obj.denominators).map(m=>m.split('-').reverse()[0]);
            required_counters = required_counters.filter(counter => counter.indexOf('*') < 0);
            let counters_exist = required_counters.map(counter => teams_counters.indexOf(counter) < 0).filter(f=>f).length < 1;
            if (!counters_exist) return false;
            let team_stats = [0, 1].map(team => { return stat_calcs[stat_obj.calc](stat_obj, stats.teams, team); });
            return { name: stat, team_stats };
         }).filter(f=>f);

         return available_stats;
      }

      function addStat({player, team, episode, stat}) {
         // stat object is created even if there is no episode to add (=0)
         if (player != undefined) {
            if (!stat_points.players[player]) stat_points.players[player] = {};
            if (!stat_points.players[player][stat]) stat_points.players[player][stat] = [];
            if (episode) stat_points.players[player][stat].push(episode);
            team = accessors.playerTeam(player);
         }
         if (team != undefined) {
            if (!stat_points.teams[team]) stat_points.teams[team] = {};
            if (!stat_points.teams[team][stat]) stat_points.teams[team][stat] = [];
            if (episode) stat_points.teams[team][stat].push(episode);
         }
      }
   }

   function numbersArray(values) {
      if (!Array.isArray(values)) return false;
      if (values.map(value => !isNaN(value)).indexOf(false) >=0 ) return false;
      return true;
   }

   if (typeof define === "function" && define.amd) define(umo); else if (typeof module === "object" && module.exports) module.exports = umo;
   this.umo = umo;
 
}();
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-scale')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-scale'], factory) :
    (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3));
}(this, (function (exports,d3Selection,d3Scale) { 'use strict';

function pulseCircle () {

    var width;  // in pixels
    var height; // in pixels
    var radius = 50;
    var duration = 1000;
    var stroke = 'black';
    var pulse_circles = 5;
    var stroke_width = 10;
    var delay_multiplier = 150;
    var color_range = ['white', 'blue'];
    var margins = { top: 0, right: 0, bottom: 0, left: 0 };

    function pulseCircle(selection) {

        var dims = selection.node().getBoundingClientRect();
        if (!height || !width) {
           radius = Math.min(width || dims.width, dims.width, height || dims.height, dims.height) * .45;
           stroke_width = radius / 3;
        }
        width = width || dims.width;
        height = height || dims.height;

        if (!height || !width) return;

        var color = d3.scaleLinear()
            .domain([100, 0])
            .range(color_range)
            .interpolate(d3.interpolateHcl);

        var colorFill = function(d) { return color(Math.abs(d % 20 - 10)); }

        var y = d3.scalePoint()
            .domain(d3.range(pulse_circles))
            .range([0, height]);

        var z = d3.scaleLinear()
            .domain([10, 0])
            .range(["hsl(240, 90%, 100%)", "hsl(240,90%,40%)"])
            .interpolate(d3.interpolateHcl);

        var svg = selection.append('svg')
            .attr('width', width)
            .attr('height', height);

        var g = svg.append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        g.selectAll("circle")
           .data(y.domain())
           .enter().append("circle")
             .attr("fill", "#000")
             .attr("stroke", stroke)
             .attr("stroke-width", stroke_width + "px")
             .attr("r", 0)
             .attr("cx", width/2)
             .attr("cy", height/2)
             .style("fill", colorFill)
           .transition()
             .duration(duration)
             .delay(function(d) { return d * delay_multiplier; })
             .on("start", function repeat() {
                 d3.active(this)
                     .attr("r", radius)
                     .attr('stroke-width', "0px")
                   .transition()
                     .attr("r", 0)
                     .attr('stroke-width', stroke_width + "px")
                   .transition()
                     .on("start", repeat);
             });

    }

    pulseCircle.height = function (_) { return arguments.length ? (height = _, pulseCircle) : height; };
    pulseCircle.width = function (_) { return arguments.length ? (width = _, pulseCircle) : width; };
    pulseCircle.duration = function (_) { return arguments.length ? (duration = _, pulseCircle) : duration; };
    pulseCircle.pulse_circles = function (_) { return arguments.length ? (pulse_circles = _, pulseCircle) : pulse_circles; };
    pulseCircle.radius = function (_) { return arguments.length ? (radius = _, pulseCircle) : radius; };
    pulseCircle.delay_multiplier = function (_) { return arguments.length ? (delay_multiplier = _, pulseCircle) : delay_multiplier; };
    pulseCircle.stroke_width = function (_) { return arguments.length ? (stroke_width = _, pulseCircle) : stroke_width; };
    pulseCircle.color_range = function (_) { return arguments.length ? (color_range = _, pulseCircle) : color_range; };

    return pulseCircle;
}

exports.pulseCircle = pulseCircle;

Object.defineProperty(exports, '__esModule', { value: true });

})));
function simpleChart(target, data) {

   let dom_parent = d3.select('#' + target);
   let dims = dom_parent.node().getBoundingClientRect();
//   let screen_width = dims.width;
//   let screen_height = screen_width / 2;
   let screen_width = window.innerWidth * .85;
   let screen_height = screen_width / 2;

   let min_points = 50;
   let colors =["#a55194", "#6b6ecf"];
   dom_parent.selectAll('svg').remove();
   let svg = dom_parent.append('svg')
         .attr('width', screen_width)
         .attr('height', screen_height);

   let margin = {top: 20, right: 20, bottom: 30, left: 40};
   let width = +svg.attr("width") - margin.left - margin.right;
   let height = +svg.attr("height") - margin.top - margin.bottom;

   let x = d3.scaleLinear().range([0, width]);
   let y = d3.scaleLinear().range([height, 0]);

   let line = d3.line()
       .x(function(d) { return x(d[0]); })
       .y(function(d) { return y(d[1]); })
 //      .curve(d3.curveStepAfter);

   let chart = svg.append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let maxY = Math.max(...data.map(p => p.length));
    x.domain([0, Math.max(...data.map(p => Math.max(...p)), min_points)]);
    y.domain([0, maxY]);

    chart.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(0));

    chart.append("g")
        .style("font", "24px times")
        .call(d3.axisLeft(y).ticks(Math.min(maxY, 4)).tickFormat(d=>d))

    drawLines(data);
    appendCircles(data);

    function lineData(points) {
       points = points.map((point, index) => [point, index + 1]);
       points.unshift([0, 0]);
       return points;
    }

    function drawLines(players) {
       players.forEach((points, index) => {
          chart.append("path")
             .datum(lineData(points))
             .attr("fill", "none")
             .attr("stroke", colors[index])
             .attr("stroke-width", "5px")
             .attr("shape-rendering", "crispEdges")
             .attr("d", line);
       });
    }

    function appendCircles(players) {
       players.forEach((points, index) => {
          let targetclass = ".datapoint" + index;
          if (points.length < 10) {
             chart.selectAll(targetclass)
                .data(lineData(points))
               .enter().append('circle')
                .attr("class", targetclass)
                .attr("fill", "#FFFFFF")
                .attr("stroke", colors[index])
                .attr("stroke-width", "2px")
                .attr("r", 3.5)
                .attr("cx", function(d) { return x(d[0]); })
                .attr("cy", function(d) { return y(d[1]); });
          }
       });
    }

}

var touchManager = (function() {

   // Test via a getter in the options object to see if the passive property is accessed
   let supportsPassive = false;
   try {
     let opts = Object.defineProperty({}, 'passive', {
       get: function() {
         supportsPassive = true;
       }
     });
     window.addEventListener("test", null, opts);
   } catch (e) {}

   let behaviors = {
      orientation: undefined,
      time_threshold: 200,
      diff_threshold: 130,
      press_hold_threshold: 400,
      prevent_touch: true,
      prevent_double_tap: false,
      addSwipeTarget(target) {
         target.addEventListener('touchstart', handleTouchStart, supportsPassive ? { passive: true } : false);
         target.addEventListener('touchmove', handleTouchMove, supportsPassive ? { passive: true } : false);
         target.addEventListener('touchend', swipeTouchEnd, false);

         target.addEventListener('mousedown', handleTouchStart, false);
         target.addEventListener('mousemove', handleTouchMove, false);
         target.addEventListener('mouseup', swipeTouchEnd, false);
      },
      addPressAndHold(target) {
         target.addEventListener('touchstart', handleTouchStart, supportsPassive ? { passive: true } : false);
         target.addEventListener('mousedown', handleTouchStart, false);
         target.addEventListener('touchend', pressAndHoldEnd, false);
         target.addEventListener('mouseup', pressAndHoldEnd, false);
      }
   };

   document.addEventListener('touchmove', preventDrag, false);
   document.addEventListener('touchend', preventDoubleTap, false);

   document.addEventListener('mousemove', preventDrag, false);
   document.addEventListener('mouseup', preventDoubleTap, false);

   /* to make it appear more like a native app disable dragging and double tap */
   function preventDrag(evt) {
      if (behaviors.prevent_touch && (window.innerHeight > 450 || behaviors.orientation == 'landscape')) evt.preventDefault();
   }

   function preventDoubleTap(evt) { 
      let now = new Date().getTime();
      if (behaviors.prevent_double_tap && now - last_touch < 500) evt.preventDefault(); 
      last_touch = now;
   }

   let xDown = null;
   let yDown = null; 
   let xDiff = null;
   let yDiff = null;
   let timeDown = null;
   let touch_target = null;
   let last_touch = new Date().getTime();

   function handleTouchMove(evt) {
      if (!xDown || !yDown) return;
      if (evt.type == 'mousemove') {
         var xUp = evt.clientX;
         var yUp = evt.clientY;
      } else {
         var xUp = evt.touches[0].clientX;
         var yUp = evt.touches[0].clientY;
      }
      xDiff = xDown - xUp;
      yDiff = yDown - yUp;
   }

   function containsClassName (evntarget , classArr) {
      for (var i = classArr.length - 1; i >= 0; i--) {
         if( evntarget.classList.contains(classArr[i]) ) return true;
      }
   }

   function handleTouchStart(evt) { 
      touch_target = evt.target;
      timeDown = Date.now();
      if (evt.type == 'mousedown') {
         xDown = evt.clientX;
         yDown = evt.clientY;
      } else {
         xDown = evt.touches[0].clientX;
         yDown = evt.touches[0].clientY;
      }
      xDiff = 0;
      yDiff = 0;
   }

   function findAncestor (el, cls) {
      if (el.classList.contains(cls)) return el;
      while ((el = el.parentNode) && el.classList && !el.classList.contains(cls));
      return el;
   }

   function swipeTouchEnd(evt) { 
      let timeDiff = Date.now() - timeDown; 
      if ((Math.abs(xDiff) > behaviors.diff_threshold || Math.abs(yDiff) > behaviors.diff_threshold) && timeDiff < behaviors.time_threshold) {
         if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) { 
               if (typeof behaviors.swipeLeft == 'function') behaviors.swipeLeft(findAncestor(touch_target, 'swipe'));
            } else { 
               if (typeof behaviors.swipeRight == 'function') behaviors.swipeRight(findAncestor(touch_target, 'swipe'));
            }
         } else {
            if (yDiff > 0) { 
               if (typeof behaviors.swipeUp == 'function') behaviors.swipeUp(findAncestor(touch_target, 'swipe'));
            } else { 
               if (typeof behaviors.swipeDown == 'function') behaviors.swipeDown(findAncestor(touch_target, 'swipe'));
            }
         }
      }
      xDown = null;
      yDown = null;
      timeDown = null; 
   }

   function pressAndHoldEnd(evt) {
      let timeDiff = Date.now() - timeDown; 
      if (timeDiff > behaviors.press_hold_threshold) {
         if (typeof behaviors.pressAndHold == 'function') behaviors.pressAndHold(findAncestor(touch_target, 'pressAndHold'));
      }
      xDown = null;
      yDown = null;
      timeDown = null; 
   }

   return behaviors;

})();
/*!
 * clipboard.js v1.6.1
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Clipboard=e()}}(function(){var e,t,n;return function e(t,n,o){function i(a,c){if(!n[a]){if(!t[a]){var l="function"==typeof require&&require;if(!c&&l)return l(a,!0);if(r)return r(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var s=n[a]={exports:{}};t[a][0].call(s.exports,function(e){var n=t[a][1][e];return i(n?n:e)},s,s.exports,e,t,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(e,t,n){function o(e,t){for(;e&&e.nodeType!==i;){if(e.matches(t))return e;e=e.parentNode}}var i=9;if("undefined"!=typeof Element&&!Element.prototype.matches){var r=Element.prototype;r.matches=r.matchesSelector||r.mozMatchesSelector||r.msMatchesSelector||r.oMatchesSelector||r.webkitMatchesSelector}t.exports=o},{}],2:[function(e,t,n){function o(e,t,n,o,r){var a=i.apply(this,arguments);return e.addEventListener(n,a,r),{destroy:function(){e.removeEventListener(n,a,r)}}}function i(e,t,n,o){return function(n){n.delegateTarget=r(n.target,t),n.delegateTarget&&o.call(e,n)}}var r=e("./closest");t.exports=o},{"./closest":1}],3:[function(e,t,n){n.node=function(e){return void 0!==e&&e instanceof HTMLElement&&1===e.nodeType},n.nodeList=function(e){var t=Object.prototype.toString.call(e);return void 0!==e&&("[object NodeList]"===t||"[object HTMLCollection]"===t)&&"length"in e&&(0===e.length||n.node(e[0]))},n.string=function(e){return"string"==typeof e||e instanceof String},n.fn=function(e){var t=Object.prototype.toString.call(e);return"[object Function]"===t}},{}],4:[function(e,t,n){function o(e,t,n){if(!e&&!t&&!n)throw new Error("Missing required arguments");if(!c.string(t))throw new TypeError("Second argument must be a String");if(!c.fn(n))throw new TypeError("Third argument must be a Function");if(c.node(e))return i(e,t,n);if(c.nodeList(e))return r(e,t,n);if(c.string(e))return a(e,t,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function i(e,t,n){return e.addEventListener(t,n),{destroy:function(){e.removeEventListener(t,n)}}}function r(e,t,n){return Array.prototype.forEach.call(e,function(e){e.addEventListener(t,n)}),{destroy:function(){Array.prototype.forEach.call(e,function(e){e.removeEventListener(t,n)})}}}function a(e,t,n){return l(document.body,e,t,n)}var c=e("./is"),l=e("delegate");t.exports=o},{"./is":3,delegate:2}],5:[function(e,t,n){function o(e){var t;if("SELECT"===e.nodeName)e.focus(),t=e.value;else if("INPUT"===e.nodeName||"TEXTAREA"===e.nodeName){var n=e.hasAttribute("readonly");n||e.setAttribute("readonly",""),e.select(),e.setSelectionRange(0,e.value.length),n||e.removeAttribute("readonly"),t=e.value}else{e.hasAttribute("contenteditable")&&e.focus();var o=window.getSelection(),i=document.createRange();i.selectNodeContents(e),o.removeAllRanges(),o.addRange(i),t=o.toString()}return t}t.exports=o},{}],6:[function(e,t,n){function o(){}o.prototype={on:function(e,t,n){var o=this.e||(this.e={});return(o[e]||(o[e]=[])).push({fn:t,ctx:n}),this},once:function(e,t,n){function o(){i.off(e,o),t.apply(n,arguments)}var i=this;return o._=t,this.on(e,o,n)},emit:function(e){var t=[].slice.call(arguments,1),n=((this.e||(this.e={}))[e]||[]).slice(),o=0,i=n.length;for(o;o<i;o++)n[o].fn.apply(n[o].ctx,t);return this},off:function(e,t){var n=this.e||(this.e={}),o=n[e],i=[];if(o&&t)for(var r=0,a=o.length;r<a;r++)o[r].fn!==t&&o[r].fn._!==t&&i.push(o[r]);return i.length?n[e]=i:delete n[e],this}},t.exports=o},{}],7:[function(t,n,o){!function(i,r){if("function"==typeof e&&e.amd)e(["module","select"],r);else if("undefined"!=typeof o)r(n,t("select"));else{var a={exports:{}};r(a,i.select),i.clipboardAction=a.exports}}(this,function(e,t){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i=n(t),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),c=function(){function e(t){o(this,e),this.resolveOptions(t),this.initSelection()}return a(e,[{key:"resolveOptions",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action=t.action,this.emitter=t.emitter,this.target=t.target,this.text=t.text,this.trigger=t.trigger,this.selectedText=""}},{key:"initSelection",value:function e(){this.text?this.selectFake():this.target&&this.selectTarget()}},{key:"selectFake",value:function e(){var t=this,n="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return t.removeFake()},this.fakeHandler=document.body.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[n?"right":"left"]="-9999px";var o=window.pageYOffset||document.documentElement.scrollTop;this.fakeElem.style.top=o+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,document.body.appendChild(this.fakeElem),this.selectedText=(0,i.default)(this.fakeElem),this.copyText()}},{key:"removeFake",value:function e(){this.fakeHandler&&(document.body.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(document.body.removeChild(this.fakeElem),this.fakeElem=null)}},{key:"selectTarget",value:function e(){this.selectedText=(0,i.default)(this.target),this.copyText()}},{key:"copyText",value:function e(){var t=void 0;try{t=document.execCommand(this.action)}catch(e){t=!1}this.handleResult(t)}},{key:"handleResult",value:function e(t){this.emitter.emit(t?"success":"error",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}},{key:"clearSelection",value:function e(){this.target&&this.target.blur(),window.getSelection().removeAllRanges()}},{key:"destroy",value:function e(){this.removeFake()}},{key:"action",set:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"copy";if(this._action=t,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function e(){return this._action}},{key:"target",set:function e(t){if(void 0!==t){if(!t||"object"!==("undefined"==typeof t?"undefined":r(t))||1!==t.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&t.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(t.hasAttribute("readonly")||t.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=t}},get:function e(){return this._target}}]),e}();e.exports=c})},{select:5}],8:[function(t,n,o){!function(i,r){if("function"==typeof e&&e.amd)e(["module","./clipboard-action","tiny-emitter","good-listener"],r);else if("undefined"!=typeof o)r(n,t("./clipboard-action"),t("tiny-emitter"),t("good-listener"));else{var a={exports:{}};r(a,i.clipboardAction,i.tinyEmitter,i.goodListener),i.clipboard=a.exports}}(this,function(e,t,n,o){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function c(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function l(e,t){var n="data-clipboard-"+e;if(t.hasAttribute(n))return t.getAttribute(n)}var u=i(t),s=i(n),f=i(o),d=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),h=function(e){function t(e,n){r(this,t);var o=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return o.resolveOptions(n),o.listenClick(e),o}return c(t,e),d(t,[{key:"resolveOptions",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof t.action?t.action:this.defaultAction,this.target="function"==typeof t.target?t.target:this.defaultTarget,this.text="function"==typeof t.text?t.text:this.defaultText}},{key:"listenClick",value:function e(t){var n=this;this.listener=(0,f.default)(t,"click",function(e){return n.onClick(e)})}},{key:"onClick",value:function e(t){var n=t.delegateTarget||t.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new u.default({action:this.action(n),target:this.target(n),text:this.text(n),trigger:n,emitter:this})}},{key:"defaultAction",value:function e(t){return l("action",t)}},{key:"defaultTarget",value:function e(t){var n=l("target",t);if(n)return document.querySelector(n)}},{key:"defaultText",value:function e(t){return l("text",t)}},{key:"destroy",value:function e(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)}}],[{key:"isSupported",value:function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],n="string"==typeof t?[t]:t,o=!!document.queryCommandSupported;return n.forEach(function(e){o=o&&!!document.queryCommandSupported(e)}),o}}]),t}(s.default);e.exports=h})},{"./clipboard-action":7,"good-listener":4,"tiny-emitter":6}]},{},[8])(8)});// TODO: color the gamescore in the momentum chart

function momentumChart() {

    var data;
    var update;
    var fish_school = [];
    var images = { left: undefined, right: undefined };

    var options = {
        id: 'm1',
        fullWidth: window.innerWidth,
        fullHeight: window.innerHeight,
        margins: {
           top:    1, bottom: 1,  // Chrome bug can't be 0
           left:   3, right:  3   // Chrome bug can't be 0
        },
        fish: {
           gridcells: ['0', '15', '30', '40', 'G'],
           cell_size: undefined,
           min_cell_size: 5,
           max_cell_size: 10
        },
        display: {
           continuous:  false,
           reverse:     false,
           orientation: 'vertical',
           leftImg:     false,
           rightImg:    false,
           show_images: undefined,
           transition_time: 0,
           sizeToFit:   true,
           service:     true,
           player:      true,
           rally:       true,
           score:       false,
           momentum_score: true,
           grid:        true
        },
        colors: {
           players: { 0: 'red', 1: 'black' },
           results: { 'Out': 'red', 'Net': 'coral', 'Unforced Error': 'red', 'Forced': 'orange', 
                      'Ace': 'lightgreen', 'Serve Winner': 'lightgreen', 'Winner': 'lightgreen', 
                      'Forced Volley Error': 'orange', 'Forced Error': 'orange', 'In': 'yellow', 
                      'Passing Shot': 'lightgreen', 'Out Passing Shot': 'red', 'Net Cord': 'yellow', 
                      'Out Wide': 'red', 'Out Long': 'red', 'Double Fault': 'red', 'Unknown': 'blue',
                      'Error': 'red'
           }
        }
    };

    function width() { return options.fullWidth - options.margins.left - options.margins.right }
    function height() { return options.fullHeight - options.margins.top - options.margins.bottom }

    options.height = height();
    options.width = width();

    var default_colors = { default: "#235dba" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'score':      { 'click': null },
       'leftImage':  { 'click': null },
       'rightImage': { 'click': null },
       'update':     { 'begin': null, 'end': null },
       'point':      { 'mouseover': null, 'mouseout': null, 'click': null },
    };

    function chart(selection) {
      selection.each(function () {
         dom_parent = d3.select(this);

       var root = dom_parent.append('div')
           .attr('class', 'momentumRoot')
           .attr('transform', "translate(0, 0)")

       var momentumFrame = root.append('svg').attr('class','momentumFrame');

       momentumFrame.node().setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.w3.org/2000/svg");
       momentumFrame.node().setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

       var bars = momentumFrame.append('g').attr('id', 'momentumBars');
       var fish = momentumFrame.append('g').attr('id', 'momentumFish');
       var game = momentumFrame.append('g').attr('id', 'momentumGame');
 
       update = function(opts) {

          if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
             var dims = selection.node().getBoundingClientRect();
             if (options.display.orientation == 'vertical') {
                options.fullWidth = Math.max(dims.width, 100);
                options.fullHeight = Math.max(dims.height, 100);
             } else {
                // options.fullWidth = Math.max(dims.width, 100);
                options.fullHeight = Math.max(dims.height, 100);
                // options.fullHeight = cellSize() * maxDiff() * 2;
             }
          }

          options.height = height();
          options.width = width();

          var vert = options.display.orientation == 'vertical' ? 1 : 0;
          var fish_offset = vert ? options.width : options.height;
          var fish_length = vert ? options.height : options.width;
          var midpoint = fish_offset / 2;

          var all_games = groupGames(data);
          var max_rally = 0;
          data.forEach(function(point) {
             if (point.rally != undefined && point.rally.length > max_rally) max_rally = point.rally.length;
          })

          var cell_size = cellSize();

          // remove extraneous fish instances
          var old_fish = fish_school.slice(all_games.length);
          old_fish.forEach(function(f) {
              d3.selectAll('.c' + f.options().id).remove();
          });
          // trim school based on length of data
          fish_school = fish_school.slice(0, all_games.length);

          var radius;
          var coords = [0, 0];
          var score_lines = [];
          all_games.forEach(function(g, i) {
             // add fish where necessary
             if (!fish_school[i]) { 
                fish_school.push(gameFish()); 
                momentumFrame.call(fish_school[i]);
                fish_school[i].g({ 
                   bars: bars.append('g').attr('class', 'cGF' + i), 
                   fish: fish.append('g').attr('class', 'cGF' + i), 
                   game: game.append('g').attr('class', 'cGF' + i) 
                });
                fish_school[i].options({
                   id: 'GF' + i, 
                   display: { score: false, point_score: false },
                   fish: { school: true },
                });
             }
             fish_school[i].width(fish_offset).height(fish_offset);
             fish_school[i].options({ 
                score: g.score, 
                fish: { cell_size: cell_size, max_rally: max_rally },
                display: { 
                   orientation: options.display.orientation,
                   service: options.display.service,
                   rally: options.display.rally,
                   player: options.display.player,
                   grid: options.display.grid
                },
                colors: { players: { 0: options.colors.players[0], 1: options.colors.players[1] }}
             });
             fish_school[i].data(g.points);
             fish_school[i].coords(coords).update();
             var new_coords = fish_school[i].coords();
             coords[0] += vert ? new_coords[0] : new_coords[1] - (new_coords[2] / 2);
             coords[1] += vert ? new_coords[1] : new_coords[0] + (new_coords[2] / 2);
             score_lines.push({ 
                score: g.score, 
                index: g.index,
                l: coords[1] + (new_coords[2] * 1.75),
                o: coords[0] + (new_coords[2] * 1.75),
                set_end: g.last_game
             });
             if (g.last_game && !options.display.continuous) { coords[vert ? 0 : 1] = 0; }
             radius = new_coords[2] / 2;
          });

          // This resize *must* take place after the fishshcool has been generated!
          // ---------------------------------------------------------------------
          root
             .attr('width', options.width + 'px')
             .attr('height', (vert ? (100 + coords[1]) : options.height) + 'px')
             .on('mouseover', showImages)
             .on('mouseout', hideImages);

          momentumFrame
             .attr('width',    options.width + 'px')
             .attr('height',   (vert ? (100 + coords[1])  : options.height) + 'px');
          // ---------------------------------------------------------------------

          var midline = fish.selectAll('.midline' + options.id)
             .data([0])

          midline.enter()
            .append('line')
            .attr("class",          "midline" + options.id)
            .attr("x1",             vert ? midpoint : radius)
            .attr("x2",             vert ? midpoint : coords[0] + (5 * (radius || 0)))
            .attr("y1",             vert ? radius : midpoint)
            .attr("y2",             vert ? coords[1] + (5 * radius) : midpoint)
            .attr("stroke-width",   lineWidth)
            .attr("stroke",         "#ccccdd")

          midline.exit().remove()

          midline
            .transition().duration(options.display.transition_time)
            .attr("x1",             vert ? midpoint : radius)
            .attr("x2",             vert ? midpoint : coords[0] + (5 * (radius || 0)))
            .attr("y1",             vert ? radius : midpoint)
            .attr("y2",             vert ? coords[1] + (5 * radius) : midpoint)
            .attr("stroke-width",   lineWidth)
            .attr("stroke",         "#ccccdd")

          var scoreLines = fish.selectAll('.score_line' + options.id)
             .data(score_lines)

          scoreLines.enter()
            .append('line')
            .attr("class",          "score_line" + options.id)
            .attr("x1",             function(d) { return vert ? cell_size * 2 : d.o })
            .attr("x2",             function(d) { return vert ? fish_offset - cell_size * 2 : d.o })
            .attr("y1",             function(d) { return vert ? d.l : cell_size * 3 })
            .attr("y2",             function(d) { return vert ? d.l : fish_offset - cell_size * 3 })
            .attr("stroke-width",   lineWidth)
            .attr("stroke-dasharray", function(d) { return d.set_end ? "0" : "5,5"; })
            .attr("stroke",         function(d) { return d.set_end ? "#000000" : "#ccccdd"; })
 
          scoreLines.exit().remove()
 
          scoreLines
            .transition().duration(options.display.transition_time)
            .attr("x1",             function(d) { return vert ? cell_size * 2 : d.o })
            .attr("x2",             function(d) { return vert ? fish_offset - cell_size * 2 : d.o })
            .attr("y1",             function(d) { return vert ? d.l : cell_size * 3 })
            .attr("y2",             function(d) { return vert ? d.l : fish_offset - cell_size * 3 })
            .attr("stroke-width",   lineWidth)
            .attr("stroke-dasharray", function(d) { return d.set_end ? "0" : "5,5"; })
            .attr("stroke",         function(d) { return d.set_end ? "#000000" : "#ccccdd"; })


          if (options.display.momentum_score) {
             var score_text = fish.selectAll(".score_text" + options.id)
                .data(score_lines)

             score_text.exit().remove()

             score_text.enter()
                .append('g')
                .attr("class", "score_text" + options.id)
                .attr('transform',  scoreText)
                .on('click', function(d) { if (events.score.click) events.score.click(d); }) 
               .merge(score_text)
                .attr("class", "score_text" + options.id)
                .attr('transform',  scoreText)
                .on('click', function(d) { if (events.score.click) events.score.click(d); }) 

             var scores = score_text.selectAll(".score" + options.id)
                .data(function(d) { return d.score; })

             scores.exit().remove()

             scores.enter()
                .append('text')
                .attr('class',          'score' + options.id)
                .attr('transform',      scoreT)
                .attr('font-size',      radius * 4.0 + 'px')
                .attr('opacity',        .1)
                .attr('text-anchor',    'middle')
                .text(function(d) { return d } )
               .merge(scores)
                .attr('class',          'score' + options.id)
                .transition().duration(options.display.transition_time)
                .attr('transform',      scoreT)
                .attr('font-size',      radius * 4.0 + 'px')
                .attr('opacity',        .1)
                .attr('text-anchor',    'middle')
                .text(function(d) { return d } )
          } else {
             fish.selectAll(".score_text" + options.id).remove();
          }

          function scoreText(d) { return translate(0, (vert ? d.l : d.o - radius), 0); }
          function scoreT(d, i) {
             var offset = vert ? fish_offset / 3 : options.height / 3;
             var o = i ? midpoint + offset : midpoint - offset + radius * 3;
             var l = -1 * radius * (vert ? .25 : .5);
             return translate(o, l, 0);
          }

          function translate(o, l, rotate) {
             var x = vert ? o : l;
             var y = vert ? l : o;
             return "translate(" + x + "," + y + ") rotate(" + rotate + ")" 
          }

          function lineWidth(d, i) { return radius > 20 ? 2 : 1; }

          function cellSize() {
             var cell_size;

             if (options.display.orientation == 'vertical') {
                // if the display is vertical use the width divided by maxDiff
                cell_size = options.width / 2 / (maxDiff() + 1);
             } else {
                // if the display is horizontal use the width divided by # points
                // var radius = options.width / (data.points().length + 4);
                var radius = options.width / (data.length + 4);
                var cell_size = Math.sqrt(2 * radius * radius);
             }
            return Math.min(options.fish.max_cell_size, cell_size);
          }

          function maxDiff() {
             var max_diff = 0;
             var cumulative = [0, 0];

             data.forEach(function(episode)  {
                cumulative[episode.point.winner] += 1;
                var diff = Math.abs(cumulative[0] - cumulative[1]);
                if (diff > max_diff) max_diff = diff;
             });

             return max_diff;
          }

          if (options.display.rightImg) {
             images.right = momentumFrame.selectAll('image.rightImage')
                .data([0])
 
             images.right.exit().remove();
 
             images.right.enter()
               .append('image')
               .attr('class', 'rightImage')
               .attr('xlink:href', options.display.rightImg)
               .attr('x', options.width - 20)
               .attr('y', 5)
               .attr('height', '20px')
               .attr('width',  '20px')
               .attr('opacity', options.display.show_images ? 1 : 0)
               .on('click', function() { if (events.rightImage.click) events.rightImage.click(options.id); }) 
              .merge(images.right)
               .attr('x', options.width - 20)
               .attr('xlink:href', options.display.rightImg)
               .on('click', function() { if (events.rightImage.click) events.rightImage.click(options.id); }) 
 
          } else {
             momentumFrame.selectAll('image.rightImage').remove();
          }

          if (options.display.leftImg) {
             images.left = momentumFrame.selectAll('image.leftImage')
                .data([0])

             images.left.enter()
               .append('image')
               .attr('class', 'leftImage')
               .attr('xlink:href', options.display.leftImg)
               .attr('x', 10)
               .attr('y', 5)
               .attr('height', '20px')
               .attr('width',  '20px')
               .attr('opacity', options.display.show_images ? 1 : 0)
               .on('click', function() { if (events.leftImage.click) events.leftImage.click(); }) 
              .merge(images.left)
               .attr('xlink:href', options.display.leftImg)
               .on('click', function() { if (events.leftImage.click) events.leftImage.click(options.id); }) 

             images.left.exit().remove();
          } else {
             momentumFrame.selectAll('image.leftImage').remove();
          }

          function showImages() {
             if (options.display.show_images == false) return;
             if (options.display.leftImg) images.left.attr('opacity', 1);
             if (options.display.rightImg) images.right.attr('opacity', 1);
          }

          function hideImages() {
             if (options.display.show_images) return;
             if (options.display.leftImg) images.left.attr('opacity', 0);
             if (options.display.rightImg) images.right.attr('opacity', 0);
          }

       }
      });
    }

    // ACCESSORS

    chart.exports = function() {
       return { function1: function1, function1: function1 }
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.fullWidth;
        options.fullWidth = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.fullHeight;
        options.fullHeight = value;
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function' && data) update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.colors = function(color3s) {
        if (!arguments.length) return colors;
        if (typeof color3s !== 'object') return false;
        var keys = Object.keys(color3s);        
        if (!keys.length) return false;
        // remove all properties that are not colors
        keys.forEach(function(f) { if (! /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color3s[f])) delete color3s[f]; })
        if (Object.keys(color3s).length) {
           colors = color3s;
        } else {
           colors = JSON.parse(JSON.stringify(default_colors));
        }
        return chart;
    }

   chart.groupGames = function(point_episodes) {
      let games = [{ points: [] }];
      let game_counter = 0;
      let current_game = 0;
      point_episodes.forEach(episode => {
         let point = episode.point;
         if (point.game != current_game) {
            game_counter += 1;
            current_game = point.game;
            games[game_counter] = { points: [] };
         }
         games[game_counter].points.push(point);
         games[game_counter].index = game_counter;
         games[game_counter].set = episode.set.index;
         games[game_counter].score = episode.game.games;
         games[game_counter].complete = episode.game.complete;
         if (episode.game.complete) games[game_counter].winner = point.winner;
         if (episode.set.complete) games[game_counter].last_game = true;
      });
      return games;
   }

   return chart;
}

function gameFish() {

    var data;
    var fish_width;
    var fish_height;
    var coords = [0, 0];
    var last_coords;
    var update;
    var images = { left: undefined, right: undefined };

    var options = {
        id: 'gf1',
        score: [0, 0],
        width: window.innerWidth,
        height: window.innerHeight,
        margins: {
           top:    10, bottom: 10, 
           left:   10, right:  10
        },
        fish: {
           school:    false,
           gridcells: ['0', '15', '30', '40', 'G'],
           max_rally: undefined,
           cell_size: undefined,
           min_cell_size: 5,
           max_cell_size: 20
        },
        set: {
           tiebreak_to: 7
        },
        display: {
           orientation: 'vertical',
           transition_time: 0,
           sizeToFit:   false,
           leftImg:     false,
           rightImg:    false,
           show_images: undefined,
           reverse:     false,
           point_score: true,
           service:     true,
           player:      true,
           rally:       true,
           score:       true,
           grid:        true,
        },
        colors: {
           players: { 0: 'red', 1: 'black' },
           results: { 'Out': 'red', 'Net': 'coral', 'Unforced Error': 'red', 'Forced': 'orange', 
                      'Ace': 'lightgreen', 'Serve Winner': 'lightgreen', 'Winner': 'lightgreen', 
                      'Forced Volley Error': 'orange', 'Forced Error': 'orange', 'In': 'yellow', 
                      'Passing Shot': 'lightgreen', 'Out Passing Shot': 'red', 'Net Cord': 'yellow', 
                      'Out Wide': 'red', 'Out Long': 'red', 'Double Fault': 'red', 'Unknown': 'blue',
                      'Error': 'red'
           }
        }
    };

    var default_colors = { default: "#235dba" };
    var colors = JSON.parse(JSON.stringify(default_colors));

    var events = {
       'leftImage':  { 'click': null },
       'rightImage': { 'click': null },
       'update':  { 'begin': null, 'end': null },
       'point':    { 'mouseover': null, 'mouseout': null, 'click': null }
    };

    var fishFrame;
    var root;
    var bars;
    var fish;
    var game;

    function chart(selection) {
      var parent_type = selection._groups[0][0].tagName.toLowerCase();

      if (parent_type != 'svg') {
         root = selection.append('div')
             .attr('class', 'fishRoot');

         fishFrame = root.append('svg')
           .attr('id',    'gameFish' + options.id)
           .attr('class', 'fishFrame')

         bars = fishFrame.append('g');
         fish = fishFrame.append('g');
         game = fishFrame.append('g');

      }

      update = function(opts) {

         if (bars == undefined || fish == undefined || game == undefined) return;

         if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
            var dims = selection.node().getBoundingClientRect();
            options.width = Math.max(dims.width, 100);
            options.height = Math.max(dims.height, 100);
         }

         if (options.fish.cell_size && !options.fish.school) {
            var multiplier = Math.max(10, data.length + 2);
            options.height = options.fish.cell_size * multiplier * .9;
         }

         var tiebreak = false;
         var max_rally = 0;
         data.forEach(function(e) { 
            if (e.rally && e.rally.length > max_rally) max_rally = e.rally.length;
            if (e.score.indexOf('T') > 0) tiebreak = true; 
         });

         if (options.fish.max_rally && options.fish.max_rally > max_rally) max_rally = options.fish.max_rally;

         fish_width  = options.width  - (options.margins.left + options.margins.right);
         fish_height = options.height - (options.margins.top + options.margins.bottom);
         var vert = options.display.orientation == 'vertical' ? 1 : 0;
         var fish_offset = vert ? fish_width : fish_height;
         var fish_length = vert ? fish_height : fish_width;
         var midpoint = (vert ? options.margins.left : options.margins.top) + fish_offset / 2;
         var sw = 1;    // service box % offset
         var rw = .9;   // rally_width % offset

         bars.attr('transform', 'translate(' + (vert ? 0 : coords[0]) + ',' + (vert ? coords[1] : 0) + ')');
         fish.attr('transform', 'translate(' + coords[0] + ',' + coords[1] + ')');
         game.attr('transform', 'translate(' + coords[0] + ',' + coords[1] + ')');

         if (options.fish.cell_size) {
            var cell_size = options.fish.cell_size;
         } else {
            var offset_divisor = tiebreak ? options.set.tiebreak_to + 4 : options.fish.gridcells.length + 2;
            var cell_offset = fish_offset / (options.fish.gridcells.length + (options.display.service ? offset_divisor : 0));
            var cell_length = fish_length / (data.length + 2);
            var cell_size = Math.min(cell_offset, cell_length);
            var cell_size = Math.max(options.fish.min_cell_size, cell_size);
            var cell_size = Math.min(options.fish.max_cell_size, cell_size);
         }

         var diag = Math.sqrt(2 * Math.pow(cell_size, 2));
         var radius = diag / 2;

         grid_data = [];
         grid_labels = [];
         var grid_side = tiebreak ? options.set.tiebreak_to : options.fish.gridcells.length - 1;
         for (var g=0; g < grid_side; g++) {
            var label = tiebreak ? g : options.fish.gridcells[g];
            // l = length, o = offset
            grid_labels.push({ label: label, l: (g + (vert ? 1.25 : .75)) * radius, o: (g + (vert ? .75 : 1.25)) * radius, rotate: 45 });
            grid_labels.push({ label: label, l: (g + 1.25) * radius, o: -1 * (g + .75) * radius, rotate: -45 });
            for (var c=0; c < grid_side; c++) {
               grid_data.push([g, c]);
            }
         }

         var score_offset = options.display.score ? cell_size : 0;

         // check if this is a standalone SVG or part of larger SVG
         if (root) {
            root
               .attr('width',    options.width  + 'px')
               .attr('height',   options.height + 'px')

            fishFrame
               .attr('width',    options.width  + 'px')
               .attr('height',   options.height + 'px')
         }

         if (options.display.point_score) {
            var game_score = fish.selectAll('.game_score' + options.id)
               .data(grid_labels)
               
            game_score.exit().remove()

            game_score.enter()
               .append('text')
               .attr("font-size",   radius * .8 + 'px')
               .attr("transform",   gscoreT)
               .attr("text-anchor", "middle")
              .merge(game_score)
               .transition().duration(options.display.transition_time)
               .attr("class", "game_score" + options.id)
               .attr("font-size",   radius * .8 + 'px')
               .attr("transform",   gscoreT)
               .attr("text-anchor", "middle")
               .text(function(d) { return d.label })
         } else {
            fish.selectAll('.game_score' + options.id).remove();
         }

         if (options.display.grid) {
            var gridcells = fish.selectAll('.gridcell' + options.id)
               .data(grid_data);

            gridcells.exit().remove()

            gridcells.enter()
               .append('rect')
               .attr("stroke",         "#ccccdd")
               .attr("stroke-width",   lineWidth)
               .attr("transform",      gridCT)
               .attr("width",          cell_size)
               .attr("height",         cell_size)
              .merge(gridcells)
               .transition().duration(options.display.transition_time)
               .attr("class",          "gridcell" + options.id)
               .attr("stroke-width",   lineWidth)
               .attr("width",          cell_size)
               .attr("height",         cell_size)
               .attr("transform",      gridCT)
               .attr("fill-opacity",   0)
         } else {
            fish.selectAll('.gridcell' + options.id).remove();
         }

         var gamecells = game.selectAll('.gamecell' + options.id)
              .data(data);

         gamecells.exit().remove()

         gamecells.enter()
            .append('rect')
            .attr("opacity",     0)
            .attr("width",          cell_size)
            .attr("height",         cell_size)
            .attr("transform",      gameCT)
            .attr("stroke",         "#ccccdd")
            .attr("stroke-width",   lineWidth)
           .merge(gamecells)
            .attr("id", function(d, i) { return options.id + 'Gs' + d.set + 'g' + d.game + 'p' + i })
            .transition().duration(options.display.transition_time)
            .attr("class",          "gamecell" + options.id)
            .attr("width",          cell_size)
            .attr("height",         cell_size)
            .attr("transform",      gameCT)
            .attr("stroke",         "#ccccdd")
            .attr("stroke-width",   lineWidth)
            .attr("opacity",        options.display.player ? 1 : 0)
            .style("fill", function(d) { return options.colors.players[d.winner]; })

         var results = game.selectAll('.result' + options.id)
            .data(data)
            
         results.exit().remove()

         results.enter()
            .append('circle')
            .attr("stroke",         "black")
            .attr("id", function(d, i) { return options.id + 'Rs' + d.set + 'g' + d.game + 'p' + i })
            .attr("class",    'result' + options.id)
            .attr("opacity",        1)
            .attr("stroke-width",   lineWidth)
            .attr("cx",             zX)
            .attr("cy",             zY)
            .attr("r",              circleRadius)
            .style("fill", function(d) { return options.colors.results[d.result]; })
           .merge(results)
            .attr("id", function(d, i) { return options.id + 'Rs' + d.set + 'g' + d.game + 'p' + i })
            .attr("class",    'result' + options.id)
            .transition().duration(options.display.transition_time)
            .attr("stroke-width",   lineWidth)
            .attr("cx",             zX)
            .attr("cy",             zY)
            .attr("r",              circleRadius)
            .style("fill", function(d) { return options.colors.results[d.result]; })

         // offset Scale
         var oScale = d3.scaleLinear()
            .range([0, fish_offset * rw])
            .domain([0, max_rally])

         // lengthScale
         var lScale = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([0, (data.length) * radius])
            .round(true)

         if (options.display.rally) {
            var rally_bars = bars.selectAll(".rally_bar" + options.id)
               .data(data)

            rally_bars.exit().remove()

            rally_bars.enter()
               .append("rect")
               .attr("opacity",        0)
               .attr("transform",      rallyTstart)
               .attr("height",         vert ? lScale.bandwidth() : 0)
               .attr("width",          vert ? 0 : lScale.bandwidth())
              .merge(rally_bars)
               .attr("class",          "rally_bar" + options.id)
               .on("mouseover", function(d) { d3.select(this).attr('fill', 'yellow'); })
               .on("mouseout", function(d) { d3.select(this).attr('fill', '#eeeeff'); })
               .transition().duration(options.display.transition_time)
               .attr("id", function(d, i) { return options.id + 'Bs' + d.set + 'g' + d.game + 'p' + i })
               .attr("opacity",        1)
               .attr("stroke",         "white")
               .attr("stroke-width",   lineWidth)
               .attr("fill",           "#eeeeff")
               .attr("transform",      rallyT)
               .attr("height",         vert ? lScale.bandwidth() : rallyCalc)
               .attr("width",          vert ? rallyCalc : lScale.bandwidth())
         } else {
            bars.selectAll(".rally_bar" + options.id).remove();
         }

         if (options.display.score) {
            var score = options.score.slice();
            if (options.display.reverse) score.reverse();
            var set_score = bars.selectAll(".set_score" + options.id)
               .data(score)

            set_score.exit().remove()

            set_score.enter()
               .append('text')
               .attr("class", "set_score" + options.id)
               .attr('transform',      sscoreT)
               .attr('font-size',      radius * .8 + 'px')
               .attr('text-anchor',    'middle')
               .text(function(d) { return d } )
              .merge(set_score)
               .attr("class", "set_score" + options.id)
               .attr('transform',      sscoreT)
               .attr('font-size',      radius * .8 + 'px')
               .attr('text-anchor',    'middle')
               .text(function(d) { return d } )

            var ssb = bars.selectAll(".ssb" + options.id)
               .data(options.score)

            ssb.exit().remove()

            ssb.enter()
               .append('rect')
              .merge(ssb)
               .attr("class", "ssb" + options.id)
               .attr('transform',      ssbT)
               .attr('stroke',         'black')
               .attr('stroke-width',   lineWidth)
               .attr('fill-opacity',   0)
               .attr('height',         radius + 'px')
               .attr('width',          radius + 'px')

         } else {
            bars.selectAll(".set_score" + options.id).remove();
            bars.selectAll(".ssb" + options.id).remove();
         }

         if (options.display.service) {
            var serves = [];
            data.forEach(function(s, i) {
               var first_serve = false;
               var serve_outcomes = ['Ace', 'Serve Winner', 'Double Fault'];
               if (s.first_serve) {
                  first_serve = true;
                  serves.push({ point: i, serve: 'first', server: s.server, result: s.first_serve.error });
               }

               serves.push({ 
                  point: i, 
                  serve: first_serve ? 'second' : 'first', 
                  server: s.server,
                  result: serve_outcomes.indexOf(s.result) >= 0 ? s.result : 'In' 
               });
            });

            var service = bars.selectAll(".serve" + options.id)
               .data(serves)

            service.exit().remove()

            service.enter()
               .append("circle")
               .attr("class",          "serve" + options.id)
               .attr("cx",             sX)
               .attr("cy",             sY)
               .attr("r",              circleRadius)
               .attr("stroke",         colorShot)
               .attr("stroke-width",   lineWidth)
               .attr("fill",           colorShot)
              .merge(service)
               .attr("class",          "serve" + options.id)
               .attr("cx",             sX)
               .attr("cy",             sY)
               .attr("r",              circleRadius)
               .attr("stroke",         colorShot)
               .attr("stroke-width",   lineWidth)
               .attr("fill",           colorShot)

            var service_box = bars.selectAll(".sbox" + options.id)
               .data(data)

            service_box.exit().remove()

            service_box.enter()
               .append("rect")
               .attr("stroke",         "#ccccdd")
               .attr("fill-opacity",   0)
               .attr("transform",      sBoxT)
               .attr("class",          "sbox" + options.id)
               .attr("stroke-width",   lineWidth)
               .attr("height",         vert ? lScale.bandwidth() : 1.5 * radius)
               .attr("width",          vert ? 1.5 * radius : lScale.bandwidth())
              .merge(service_box)
               .attr("transform",      sBoxT)
               .attr("class",          "sbox" + options.id)
               .attr("stroke-width",   lineWidth)
               .attr("height",         vert ? lScale.bandwidth() : 1.5 * radius)
               .attr("width",          vert ? 1.5 * radius : lScale.bandwidth())

            var returns = bars.selectAll(".return" + options.id)
               .data(data)

            returns.exit().remove()

            returns.enter()
               .append("circle")
               .attr("class",          "return" + options.id)
               .attr("cx",             rX)
               .attr("cy",             rY)
               .attr("r",              circleRadius)
               .attr("stroke",         colorReturn)
               .attr("stroke-width",   lineWidth)
               .attr("fill",           colorReturn)
              .merge(returns)
               .attr("class",          "return" + options.id)
               .attr("cx",             rX)
               .attr("cy",             rY)
               .attr("r",              circleRadius)
               .attr("stroke",         colorReturn)
               .attr("stroke-width",   lineWidth)
               .attr("fill",           colorReturn)

         } else {
            bars.selectAll(".sbox" + options.id).remove();
            bars.selectAll(".return" + options.id).remove();
            bars.selectAll(".serve" + options.id).remove();
         }

         if (options.display.rightImg) {
            images.right = fishFrame.selectAll('image.rightImage')
               .data([0])

            images.right.exit().remove();

            images.right.enter()
              .append('image')
              .attr('class', 'rightImage')
              .attr('xlink:href', options.display.rightImg)
              .attr('x', options.width - 30)
              .attr('y', 5)
              .attr('height', '20px')
              .attr('width',  '20px')
              .attr('opacity', options.display.show_images ? 1 : 0)
              .on('click', function() { if (events.rightImage.click) events.rightImage.click(options.id); }) 
             .merge(images.right)
              .attr('x', options.width - 30)
              .attr('xlink:href', options.display.rightImg)
              .on('click', function() { if (events.rightImage.click) events.rightImage.click(options.id); }) 

         } else {
            if (fishFrame) fishFrame.selectAll('image.rightImage').remove();
         }

         if (options.display.leftImg) {
            images.left = fishFrame.selectAll('image.leftImage')
               .data([0])

            images.left.enter()
              .append('image')
              .attr('class', 'leftImage')
              .attr('xlink:href', options.display.leftImg)
              .attr('x', 10)
              .attr('y', 5)
              .attr('height', '20px')
              .attr('width',  '20px')
              .attr('opacity', options.display.show_images ? 1 : 0)
              .on('click', function() { if (events.leftImage.click) events.leftImage.click(); }) 
             .merge(images.left)
              .attr('xlink:href', options.display.leftImg)
              .on('click', function() { if (events.leftImage.click) events.leftImage.click(options.id); }) 

            images.left.exit().remove();
         } else {
            if (fishFrame) fishFrame.selectAll('image.leftImage').remove();
         }

         // ancillary functions for update()
         function circleRadius(d, i) { 
            return (options.display.player || options.display.service) ? radius / 4 : radius / 2; 
         }
         function lineWidth(d, i) { return radius > 20 ? 1 : .5; }
         function colorShot(d, i) { return options.colors.results[d.result]; }
         function colorReturn(d, i) { 
            if (d.rally == undefined) return "white";
            if (d.rally.length > 1) return 'yellow';
            if (d.rally.length == 1) return options.colors.results[d.result]; 
            return "white";
         }

         function rallyCalc(d, i) { return d.rally ? oScale(d.rally.length) : 0; }

         function sscoreT(d, i) {
            var o = i ? midpoint + radius * .5 : midpoint - radius * .5;
            var o = vert ? o : o + radius * .3;
            var l = radius * (vert ? .8 : .5);
            return translate(o, l, 0);
         }

         function ssbT(d, i) {
            var o = i ? midpoint : midpoint - radius;
            var l = 0;
            return translate(o, l, 0);
         }

         function gscoreT(d, i) {
            var o = +midpoint + d.o;
            var l = radius + d.l;
            return translate(o, l, d.rotate);
         }

         function gridCT(d, i) {
            var o = midpoint + ((d[1] - d[0] + vert - 1) * radius);
            var l = (d[0] + d[1] + 3 - vert ) * radius;
            return translate(o, l, 45);
         }

         function gameCT(d, i) {
            var o = midpoint + (findOffset(d) + vert - 1) * radius;
            var l = (i + 4 - vert) * radius;
            last_coords = [o - midpoint, l - diag, diag];
            return translate(o, l, 45);
         }

         function sBoxT(d, i) {
            var o = d.server == 0 ? midpoint - (fish_offset / 2 * sw) : midpoint + (fish_offset / 2 * sw) - (1.5 * radius);
            var l = radius + cL(d, i);
            return translate(o, l, 0); 
         }

         function rallyTstart(d, i) {
            var o = midpoint;
            var l = radius + cL(d, i);
            return translate(o, l, 0);
         }

         function rallyT(d, i) {
            var o = d.rally ? (midpoint - (oScale(d.rally.length) / 2)) : 0;
            var l = radius + cL(d, i);
            return translate(o, l, 0);
         }

         function translate(o, l, rotate) {
            var x = vert ? o : l;
            var y = vert ? l : o;
            return "translate(" + x + "," + y + ") rotate(" + rotate + ")" 
         }

         function cL(d, i) { return (i + 2.5) * radius; }

         function rX(d, i) { return vert ? rO(d, i) : rL(d, i); }
         function rY(d, i) { return vert ? rL(d, i) : rO(d, i); }
         function rL(d, i) { return radius + (i + 3) * radius; }
         function rO(d, i) {
            return d.server == 0 ? midpoint + (fish_offset / 2 * sw) - (.75 * radius) : midpoint - (fish_offset / 2 * sw) + (.75 * radius);
         }

         function sX(d, i) { return vert ? sO(d, i) : sL(d, i); }
         function sY(d, i) { return vert ? sL(d, i) : sO(d, i); }
         function sL(d, i) { return radius + (d.point + 3) * radius; }
         function sO(d) {
            var offset = ((d.serve == 'first' && d.server == 0) || (d.serve == 'second' && d.server == 1)) ? .4 : 1.1;
            return d.server == 0 ? midpoint - (fish_offset / 2 * sw) + (offset * radius) : midpoint + (fish_offset / 2 * sw) - (offset * radius);
         }

         function zX(d, i) { return vert ? zO(d, i) : zL(d, i); }
         function zY(d, i) { return vert ? zL(d, i) : zO(d, i); }
         function zL(d, i) { return radius + (i + 3) * radius; }
         function zO(d, i) { return +midpoint + findOffset(d) * radius; }
      }

      function findOffset(point) { 
         return point.points[options.display.reverse ? 0 : 1] - point.points[options.display.reverse ? 1 : 0]; 
      }
    }

    // ACCESSORS

    chart.g = function(values) {
        if (!arguments.length) return chart;
        if (typeof values != 'object' || values.constructor == Array) return;
        if (values.bars) bars = values.bars;
        if (values.fish) fish = values.fish;
        if (values.game) game = values.game;
    }

    chart.exports = function() {
       return { function1: function1, function1: function1 }
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };

    chart.coords = function(value) {
        if (!arguments.length) return last_coords;
        coords = value;
       return chart;
    }

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = JSON.parse(JSON.stringify(value));
        return chart;
    };

    chart.update = function(opts) {
      if (events.update.begin) events.update.begin(); 
      if (typeof update === 'function' && data) update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
    }

    chart.colors = function(color3s) {
        if (!arguments.length) return colors;
        if (typeof color3s !== 'object') return false;
        var keys = Object.keys(color3s);        
        if (!keys.length) return false;
        // remove all properties that are not colors
        keys.forEach(function(f) { if (! /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color3s[f])) delete color3s[f]; })
        if (Object.keys(color3s).length) {
           colors = color3s;
        } else {
           colors = JSON.parse(JSON.stringify(default_colors));
        }
        return chart;
    }


   return chart;

}
function gameTree() {

   /* TODO
      change the gradient direction in lines across width
      which means changing line so that it is short and wide
      rather than long and thick

      GAMETREE -> counters contain points, not just number of points
               -> data is episode_points, not just points
     
      bar chart showing win % for each player or primary/opponents
      for each point position
   */

   function applyMax(arr) { return Math.max.apply(null, arr); }
   function applyMin(arr) { return Math.min.apply(null, arr); }
   var images = { left: undefined, right: undefined };

   // All options that should be accessible to caller
   var data = [];
   var options = {
      width: 150,
	   height: 150,
      min_max: 20,                  // scaling factor for line widths

      // Margins for the SVG
      margins: {
         top: 0, 
         right: 0, 
         bottom: 0, 
         left: 0
      },

      display: {
         noAd:        false,
         leftImg:     false,
         rightImg:    false,
         show_images: false,
         sizeToFit:   true,
         showEmpty:   false   // display even if no data
      },

      lines: {
         easing: false, // 'bounce'
         duration: 600,
         points: { winners: "#2ed2db", errors: "#2ed2db", unknown: "#2ed2db" },
         colors: { underlines: "#2ed2db" }
      },

      nodes: {
         colors: { 0: "black" , 1: "red", neutral: '#ecf0f1' }
      },

      points: {
         winners: [
            'Winner', 'Ace', 'Serve Winner', 'Passing Shot', 'Return Winner', 
            'Forcing Error', 'Forcing Volley Error', 'Net Cord', 'In'
            ],
         errors: [
            'Unforced Error', 'Unforced', 'Forced Error', 'Error', 'Out', 'Net', 
            'Netted Passing Shot', 'L', 'Overhead Passing Shot', 'Double Fault'
            ],
         highlight: [] // opposite of filter; filter unhighlighted...
      },

      selectors: {
         enabled: true, 
         selected: { 0: false, 1: false }
      },

      labels: { 'Game': 'GAME', 'Player': 'Player', 'Opponent': 'Opponent' },

   };

   // functions which should be accessible via ACCESSORS
   var update;

   // PROGRAMMATIC
   // ------------
   var canvas;
   var radius;
   var transition_time = 0;
   var point_connector = 'x';
   var counters = { w: {}, e: {}, p: {}, n: {} };

   // DEFINABLE EVENTS
   // Define with ACCESSOR function chart.events()
   var events = {
      'leftImage':  { 'click': null },
      'rightImage': { 'click': null },
      'update': { 'begin': null, 'end': null },
      'point': { 'mousemove': null, 'mouseout': null },
      'node': { 'mousemove': null, 'mouseout': null },
      'score': { 'mousemove': null, 'mouseout': null },
      'label': { 'mousemove': null, 'mouseout': null, 'click': selectView },
      'selector': { 'mousemove': null, 'mouseout': null, 'click': selectView },
   };

   function chart(selection) {
       var root = selection.append('div')
           .attr('class', 'gametreeRoot')

         var tree_width  = options.width  - (options.margins.left + options.margins.right);
         var tree_height = options.width * .9;
         canvas = root.append('svg')
              
         update = function(opts) {

             if (!data.length && !options.display.showEmpty) {
                canvas.selectAll('*').remove();
                return;
             }

             counterCalcs();

             if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
                var dims = selection.node().getBoundingClientRect();
                options.width = Math.min(dims.width, dims.height);
             }

             var tree_width  = options.width  - (options.margins.left + options.margins.right);
             var tree_height = options.width * .9;
             radius = (tree_height + tree_width) / 2 * .03;

             var keys = point_lines.map(function(m) { return m.id; });

             var point_min = applyMin( keys.map(function(k) { return isNaN(counters.p[k]) ? 0 : counters.p[k] }) );
             var point_max = applyMax( [applyMax(keys.map(function(k) { return isNaN(counters.p[k]) ? 0 : counters.p[k] } )), options.min_max] );

             var scale = d3.scaleLinear().domain([ point_min, point_max ]) .range([0, radius * 2])
             canvas.transition().duration(transition_time).attr('width', tree_width).attr('height', tree_height);

             var gradients = canvas.selectAll('.gradient')
                  .data(point_lines, get_id)

             gradients.exit().remove();

             gradients.enter()
                  .append('linearGradient')
                  .attr("id", function(d) { return 'gradient' + d.id; })
                  .attr("class", "gradient")
                  .attr("gradientUnits", "userSpaceOnUse")
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
                 .merge(gradients)
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
 
             var point_stops = gradients.selectAll(".points_stop")
                  .data(function(d, i) { return calcStops(d, i); })
 
             point_stops.exit().remove();

             point_stops.enter()
                  .append("stop")
                  .attr("class", "points_stop")
                  .attr("offset", function(d) { return d.offset; })
                  .attr("stop-color", function(d) { return d.color; })
                 .merge(point_stops)
                  .attr("offset", function(d) { return d.offset; })

             var lines = canvas.selectAll('.line')
                  .data(point_lines)

             lines.exit().remove()

             lines.enter()
                  .append('line')
                  .attr("class", "line")
                  .attr("id", function(d) { return d.id })
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
                  .attr("stroke-width", function(d) { return d.width ? d.width : 0 })
                  .attr("stroke", function(d) { return 'url(#gradient' + d.id + ')' })
                  .on("mousemove", function(d, i) { if (events.point.mousemove) events.point.mousemove(d, i); })
                  .on("mouseout", function(d, i) { if (events.point.mouseout) events.point.mouseout(d, i); })
                  .on("click", function(d, i) { if (events.point.click) events.point.click(d, i); })
                 .merge(lines)
                  .transition()
                     .duration((options.lines.easing || (opts && opts.easing)) ? options.lines.duration : 0)
//                     .ease(options.lines.easing || (opts && opts.easing) || 'none')
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
                  .attr("stroke-width", function(d) { return (counters.p[d.id]) ? scale(counters.p[d.id]) : 0; })

             var ulines = canvas.selectAll('.uline')
                  .data(under_lines)

             ulines.exit().remove()

             ulines.enter()
                  .append('line')
                  .attr("class", "uline")
                  .attr("id", function(d) { return d.id })
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
                  .attr("stroke-width", function(d) { return d.width ? d.width : 0 } )
                  .attr("stroke", function(d) { return options.lines.colors.underlines })
                 .merge(ulines)
                  .transition().duration(transition_time)
                  .attr("id", function(d) { return d.id })
                  .attr("x1", function(d) { return d.start.x * tree_width })
                  .attr("y1", function(d) { return d.start.y * tree_height })
                  .attr("x2", function(d) { return d.end.x  * tree_width })
                  .attr("y2", function(d) { return d.end.y  * tree_height })
                  .attr("stroke-width", function(d) { return d.width ? d.width : 0 } )

             var nodes = canvas.selectAll('.node')
                  .data(point_circles)

             nodes.exit().remove()

             nodes.enter()
                  .append('circle')
                  .attr("class", "node")
                  .attr("cx", function(d) { return d.pos.x * tree_width })
                  .attr("cy", function(d) { return d.pos.y * tree_height })
                  .attr("r", function(d) { return radius })
                  .attr("stroke", function(d) { 
                     return (d.color_pct != undefined) 
                            ? colorShade( getHexColor(options.nodes.colors[d.player]) , d.color_pct)
                            : options.nodes.colors.neutral; 
                  })
                  .attr("fill", function(d) { 
                     return (d.color_pct != undefined) 
                            ? colorShade( getHexColor(options.nodes.colors[d.player]) , d.color_pct)
                            : options.nodes.colors.neutral; 
                  })
                  .on("mousemove", function(d, i) { if (events.score.mousemove) events.score.mousemove(d, i); })
                  .on("mouseout", function(d, i) { if (events.node.mouseout) events.node.mouseout(d, i); })
                  .on("click", function(d, i) { if (events.node.click) events.node.click(d, i); })
                 .merge(nodes)
                  .transition().duration(transition_time)
                  .attr("cx", function(d) { return d.pos.x * tree_width })
                  .attr("cy", function(d) { return d.pos.y * tree_height })
                  .attr("r",  function(d) { return radius })

             var scores = canvas.selectAll('.score')
                  .data(point_text)

             scores.exit().remove()

             scores.enter()
                  .append('text')
                  .attr("class", "score")
                  .attr("x", function(d) { return d.pos.x * tree_width })
                  .attr("y", function(d) { return d.pos.y * tree_height })
                  .attr("font-size", function(d) { return radius * d.fontsize + 'px' })
                  .attr("font-family", "Lato, Arial, sans-serif")
                  .attr("text-anchor", "middle")
                  .attr("alignment-baseline", "central")
                  .attr("stroke", function(d) { return d.stroke })
                  .attr("fill", function(d) { return d.fill })
                  .text(function(d) { if (radius * d.fontsize > 7) return d.text })
                  .on("mousemove", function(d, i) { if (events.score.mousemove) events.score.mousemove(d, i); })
                  .on("mouseout", function(d, i) { if (events.score.mouseout) events.score.mouseout(d, i); })
                  .on("click", function(d, i) { if (events.score.click) events.score.click(d, i); })
                 .merge(scores)
                  .transition().duration(transition_time)
                  .attr("x", function(d) { return d.pos.x * tree_width })
                  .attr("y", function(d) { return d.pos.y * tree_height })
                  .attr("font-size", function(d) { return radius * d.fontsize + 'px' })
                  .text(function(d) { if (radius * d.fontsize > 5) return d.text })

             var labels = canvas.selectAll('.gt_label')
                  .data(label_text)

             labels.exit().remove()

             labels.enter()
                  .append('text')
                  .attr("class", "gt_label")
                  .attr("x", function(d) { return d.pos.x * tree_width })
                  .attr("y", function(d) { return d.pos.y * tree_height })
                  .attr("alignment-baseline", function(d) { return d.baseline ? d.baseline : undefined })
                  .attr("font-size", function(d) { return radius * d.fontsize + 'px' })
                  .attr("text-anchor", function(d) { return d.anchor ? d.anchor : undefined })
                  .attr("font-family", "Lato, Arial, sans-serif")
                  .attr("stroke", function(d) { return d.stroke })
                  .attr("fill", function(d) { return d.fill })
                  .text(function(d) { if (radius * d.fontsize > 5) return d.id })
                  .attr('selector', function(d) { return d.id })
                  .on("click", function(d, i) { if (events.label.click) events.label.click(d, i, this); })
                 .merge(labels)
                  .transition().duration(transition_time)
                  .attr("x", function(d) { return d.pos.x * tree_width })
                  .attr("y", function(d) { return d.pos.y * tree_height })
                  .attr("font-size", function(d) { return radius * d.fontsize + 'px' })
                  .text(function(d) { if (radius * d.fontsize > 5) return options.labels[d.id] })

             var select = canvas.selectAll('.selector')
                  .data(selectors)

             select.exit()

             select.enter()
                  .append('circle')
                  .attr('class', 'selector')
                  .attr('status', function(d) { return d.status })
                  .attr('id', function(d) { return d.id })
                  .attr('selector', function(d) { return d.id })
                  .attr("cx", function(d) { return d.pos.x * tree_width })
                  .attr("cy", function(d) { return d.pos.y * tree_height + 4 })
                  .attr("r", function(d) { return radius * d.r_pct; })
                  .attr("stroke", function(d, i) { return options.nodes.colors[i]; })
                  .attr("stroke-width", function(d) { return radius * .25; })
                  .attr("fill", function(d, i) { 
                     return (!options.selectors.enabled || (options.selectors.enabled && options.selectors.selected[i])) 
                            ? options.nodes.colors[i] 
                            : options.nodes.colors.neutral; 
                  })
                  .attr("opacity", function(d) { return d.opacity })
                  .on("mousemove", function(d, i) { if (events.selector.mousemove) events.selector.mousemove(d, i); })
                  .on("mouseout", function(d, i) { if (events.selector.mouseout) events.selector.mouseout(d, i); })
                  .on("click", function(d, i) { if (events.selector.click) events.selector.click(d, i, this); })
                 .merge(select)
                  .transition().duration(transition_time)
                  .attr("cx", function(d) { return d.pos.x * tree_width })
                  .attr("cy", function(d) { return d.pos.y * tree_height + 4 })
                  .attr("r", function(d) { return radius * d.r_pct })
                  .attr("stroke-width", function(d) { return radius * .25; })
                  .attr("fill", function(d, i) { 
                     return (!options.selectors.enabled || (options.selectors.enabled && options.selectors.selected[i])) 
                            ? options.nodes.colors[i] 
                            : options.nodes.colors.neutral; 
                  })

                   if (options.display.rightImg) {
                      images.right = canvas.selectAll('image.rightImage')
                         .data([0])
          
                      images.right.exit().remove();
          
                      images.right.enter()
                        .append('image')
                        .attr('class', 'rightImage')
                        .attr('xlink:href', options.display.rightImg)
                        .attr('x', options.width - (options.margins.right + 30))
                        .attr('y', 5)
                        .attr('height', '20px')
                        .attr('width',  '20px')
                        .attr('opacity', options.display.show_images ? 1 : 0)
                        .on('click', function() { if (events.rightImage.click) events.rightImage.click(options.id); }) 
                       .merge(images.right)
                        .attr('x', options.width - (options.margins.right + 30))
                        .attr('xlink:href', options.display.rightImg)
                        .on('click', function() { if (events.rightImage.click) events.rightImage.click(options.id); }) 
          
                   } else {
                      root.selectAll('image.rightImage').remove();
                   }

                   if (options.display.leftImg) {
                      images.left = canvas.selectAll('image.leftImage')
                         .data([0])

                      images.left.enter()
                        .append('image')
                        .attr('class', 'leftImage')
                        .attr('xlink:href', options.display.leftImg)
                        .attr('x', 10 + options.margins.left)
                        .attr('y', 5)
                        .attr('height', '20px')
                        .attr('width',  '20px')
                        .attr('opacity', options.display.show_images ? 1 : 0)
                        .on('click', function() { if (events.leftImage.click) events.leftImage.click(); }) 
                       .merge(images.left)
                        .attr('x', 10 + options.margins.left)
                        .attr('xlink:href', options.display.leftImg)
                        .on('click', function() { if (events.leftImage.click) events.leftImage.click(options.id); }) 

                      images.left.exit().remove();
                   } else {
                      root.selectAll('image.leftImage').remove();
                   }

                   function showImages() {
                      if (options.display.show_images == false) return;
                      if (options.display.leftImg) images.left.attr('opacity', 1);
                      if (options.display.rightImg) images.right.attr('opacity', 1);
                   }

                   function hideImages() {
                      if (options.display.show_images) return;
                      if (options.display.leftImg) images.left.attr('opacity', 0);
                      if (options.display.rightImg) images.right.attr('opacity', 0);
                   }

         };
   }

   // ACCESSORS

    chart.exports = function() {
       return { selectView: selectView }
    }

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

   chart.reset = function(clear_active) {
      data = [];
      clearView();
      counters = { w: {}, e: {}, p: {}, n: {} };
      return chart;
   }

   chart.width = function(value) {
       if (!arguments.length) return options.width;
       options.width = value;
       return chart;
   };

   chart.height = function(value) {
       if (!arguments.length) return options.height;
       options.height = value;
       return chart;
   };

   chart.data = function(values) {
      if (!arguments.length) return data;
      if ( values.constructor === Array ) {
         chart.reset();
         data = values;
      }
      return chart;
   }

   chart.counters = function() {
      counterCalcs();
      return counters;
   }

   chart.update = function(opts) {
     if (events.update.begin) events.update.begin(); 
     if (typeof update === 'function') update(opts);
      setTimeout(function() { 
        if (events.update.end) events.update.end(); 
      }, transition_time);
   }

   // REUSABLE FUNCTIONS
   // ------------------

   function counterCalcs() {
      // w = winners, e = errors, p = points, n = nodes
      counters = { w: {}, e: {}, p: {}, n: {} };
      if (options.selectors.selected[0] || options.selectors.selected[1]) {
         var selected = options.selectors.selected[0] ? 0 : 1;
         var _data = data.filter(function(f) { return f.point.server == selected; });
      } else {
         var _data = data;
      }
      _data = _data.filter(function(f) { return !f.point.tiebreak; });
      for (var d=0; d < _data.length; d++) {
         var previous_episode = _data[d - 1];
         var previous = (d == 0 || previous_episode.game.complete) ? calcPosition([0, 0]) : calcPosition(previous_episode.point.points);
         var progression = 'L' + previous + point_connector + calcPosition(_data[d].point.points);
         if (options.points.highlight.length && options.points.highlight.indexOf(d) < 0) { continue; }
         counters.p[progression] = counters.p[progression] ? counters.p[progression] + 1 : 1;

         if (options.points.winners.indexOf(_data[d].point.result) >= 0) {
            counters.w[progression] = counters.w[progression] ? counters.w[progression] + 1 : 1;
         } else if (options.points.errors.indexOf(_data[d].point.result) >= 0) {
            counters.e[progression] = counters.e[progression] ? counters.e[progression] + 1 : 1;
         }
      }

      // make adjustment for multiple dueces
      function calcPosition(points) {
         let point_min = Math.min(...points);
         let diff = (point_min >= 4) ? point_min - 3 : 0;
         var pos = points.map((point, index) => (options.display.noAd && point == 4 && points[1 - index] == 3) ? 'G' : point - diff);
         return pos.join('-');
      }
   }

   function get_id(d) { return d && d.id; }

   function isEven(n) {
      return n == parseFloat(n)? !(n%2) : void 0;
   }

   function clearView() {
      d3.select('[id=Player]').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);
      d3.select('[id=Opponent]').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);
      options.selectors.selected[1] = false;
      options.selectors.selected[0] = false;
   }

   function selectView(d, i, self) {
     if (!options.selectors.enabled) return;
     var selector = d3.select(self).attr('selector');
     if (d3.select('[id=' + selector + ']').attr('status') == 'none') {
         if (d3.select(self).attr('selector') == "Opponent") {
            d3.select('[id=Player]').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);
            d3.select('[id=Opponent]').attr('opacity', 1).attr('status', 'selected').attr('fill', options.nodes.colors[i]);
            options.selectors.selected[1] = true;
            options.selectors.selected[0] = false;
         } else {
            d3.select('[id=Opponent]').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);
            d3.select('[id=Player]').attr('opacity', 1).attr('status', 'selected').attr('fill', options.nodes.colors[i]);
            options.selectors.selected[0] = true;
            options.selectors.selected[1] = false;
         }
     } else {
         d3.select('[id=' + selector + ']').attr('opacity', .4).attr('status', 'none').attr('fill', options.nodes.colors.neutral);;
         if (d3.select(self).attr('selector') == "Opponent") {
            options.selectors.selected[1] = false;
         } else {
            options.selectors.selected[0] = false;
         }
     }
     update();
   }

   function calcStops(d, i) {
      if (!counters.p[d.id]) return [];
      var total_points = counters.p[d.id] == undefined ? 1 : counters.p[d.id];
      var winners = counters.w[d.id] ? counters.w[d.id] : 0;
      var errors = counters.e[d.id] ? counters.e[d.id] : 0;
      var winner_pct = winners / total_points * 100;
      var error_pct =  errors / total_points * 100;
      var u_pct = (total_points - (winners + errors)) / total_points * 100;
      return [ {offset: "0%", color: options.lines.points.unknown }, 
               {offset: u_pct + "%", color: options.lines.points.unknown }, 
               {offset: u_pct + "%", color: options.lines.points.winners }, 
               {offset: (u_pct + winner_pct) + "%", color: options.lines.points.winners }, 
               {offset: (u_pct + winner_pct) + "%", color: options.lines.points.errors }, 
               {offset: "100%", color: options.lines.points.errors } ] 
   }

   // DATA
   // --------------
  
   var c_start = .07;
   var c_dist  = .14;

   var r_start = .05;
   var r_dist  = .21;

   var f = { col1: c_start, col2: c_start + c_dist, col3: c_start + (2 * c_dist),  col4: c_start + (3 * c_dist),  
             col5: c_start + (4 * c_dist),  col6: c_start + (5 * c_dist),  col7: c_start + (6 * c_dist),

             row1: r_start, row2: r_start + r_dist, row3: r_start + (2 * r_dist), row4: r_start + (3 * r_dist), 
             row5: r_start + (4 * r_dist), foot: r_start + (4.1 * r_dist),

             adr1: r_start + (3.5 * r_dist), adc1: c_start + (c_dist * 2.5),  adc2: c_start + (c_dist * 3.5),

             selc: c_start * .8, tslc: c_start, sl1r: r_start / 2, sl2r: r_start * 1.5,
             plr1: c_start * .8, plr2: c_start + (4 * c_dist), plrs: r_start + (4.25 * r_dist)
   };

   var pos = {
      "p0-0"  : { x: f.col4, y: f.row1 }, "p1-1" : { x: f.col4, y: f.row2 }, 
      "p2-2"  : { x: f.col4, y: f.row3 }, "p3-3" : { x: f.col4, y: f.row4 }, 
      "p1-0"  : { x: f.col3, y: f.row2 }, "p0-1" : { x: f.col5, y: f.row2 },
      "p2-1"  : { x: f.col3, y: f.row3 }, "p1-2" : { x: f.col5, y: f.row3 }, 
      "p2-0"  : { x: f.col2, y: f.row3 }, "p0-2" : { x: f.col6, y: f.row3 }, 
      "p3-2"  : { x: f.col3, y: f.row4 }, "p2-3" : { x: f.col5, y: f.row4 },
      "p3-1"  : { x: f.col2, y: f.row4 }, "p1-3" : { x: f.col6, y: f.row4 }, 
      "p3-0"  : { x: f.col1, y: f.row4 }, "p0-3" : { x: f.col7, y: f.row4 }, 
      "p3-4"  : { x: f.adc1, y: f.adr1 }, "p4-3" : { x: f.adc2, y: f.adr1 },
      "p5-3"  : { x: f.adc2, y: f.row5 }, "p3-5" : { x: f.adc1, y: f.row5 }, 
      "p4-1"  : { x: f.col2, y: f.row5 }, "p1-4" : { x: f.col6, y: f.row5 }, 
      "p4-2"  : { x: f.col3, y: f.row5 }, "p2-4" : { x: f.col5, y: f.row5 },
      "p4-0"  : { x: f.col1, y: f.row5 }, "p0-4" : { x: f.col7, y: f.row5 }, 

      // No Ad
      "pG-3" : { x: f.col4, y: f.row5 }, "p3-G" : { x: f.col4, y: f.row5 }, 

      "sPlyr" : { x: f.adc1, y: f.plrs }, "tPlyr" : { x: f.col2, y: f.plrs },
      "sOpp"  : { x: f.adc2, y: f.plrs }, "tOpp"  : { x: f.col6, y: f.plrs },

      "GAME"  : { x: f.col4, y: f.foot }, 
      "L1s"   : { x: f.col1, y: f.foot }, "L1e"   : { x: f.adc1, y: f.foot }, 
      "L2s"   : { x: f.adc2, y: f.foot }, "L2e"   : { x: f.col7, y: f.foot } 
   }
 
   var point_circles = [
      { name: "0-0",   pos: pos["p0-0"], player: 0 },
      { name: "15-15", pos: pos["p1-1"], player: 0 },
      { name: "30-30", pos: pos["p2-2"], player: 0 },
      { name: "40-40", pos: pos["p3-3"], player: 0 },

      { name: "0-15",  pos: pos["p0-1"], color_pct: .4, player: 1 },
      { name: "15-30", pos: pos["p1-2"], color_pct: .4, player: 1 },
      { name: "0-30",  pos: pos["p0-2"], color_pct: .2, player: 1 },
      { name: "30-40", pos: pos["p2-3"], color_pct: .4, player: 1 },
      { name: "15-40", pos: pos["p1-3"], color_pct: .2, player: 1 },
      { name: "0-40",  pos: pos["p0-3"], color_pct: 0,  player: 1 },
      { name: "40-A",  pos: pos["p4-3"], color_pct: .5, player: 1 },

      { name: "15-0",  pos: pos["p1-0"], color_pct: .4, player: 0 },
      { name: "30-15", pos: pos["p2-1"], color_pct: .4, player: 0 },
      { name: "30-0",  pos: pos["p2-0"], color_pct: .2, player: 0 },
      { name: "40-30", pos: pos["p3-2"], color_pct: .4, player: 0 },
      { name: "40-15", pos: pos["p3-1"], color_pct: .2, player: 0 },
      { name: "40-0",  pos: pos["p3-0"], color_pct: 0,  player: 0 },
      { name: "A-40",  pos: pos["p3-4"], color_pct: .5, player: 0 } 
   ]

   var point_lines = [
      { id: "L0-0x0-1", start: pos["p0-0"], end: pos["p0-1"] },
      { id: "L0-0x1-0", start: pos["p0-0"], end: pos["p1-0"] },
      { id: "L0-1x0-2", start: pos["p0-1"], end: pos["p0-2"] },
      { id: "L0-1x1-1", start: pos["p0-1"], end: pos["p1-1"] },
      { id: "L1-0x2-0", start: pos["p1-0"], end: pos["p2-0"] },
      { id: "L1-0x1-1", start: pos["p1-0"], end: pos["p1-1"] },
      { id: "L1-1x1-2", start: pos["p1-1"], end: pos["p1-2"] },
      { id: "L1-1x2-1", start: pos["p1-1"], end: pos["p2-1"] },
      { id: "L2-0x2-1", start: pos["p2-0"], end: pos["p2-1"] },
      { id: "L2-0x3-0", start: pos["p2-0"], end: pos["p3-0"] },
      { id: "L2-1x2-2", start: pos["p2-1"], end: pos["p2-2"] },
      { id: "L2-1x3-1", start: pos["p2-1"], end: pos["p3-1"] },
      { id: "L2-2x2-3", start: pos["p2-2"], end: pos["p2-3"] },
      { id: "L2-2x3-2", start: pos["p2-2"], end: pos["p3-2"] },
      { id: "L0-2x0-3", start: pos["p0-2"], end: pos["p0-3"] },
      { id: "L0-2x1-2", start: pos["p0-2"], end: pos["p1-2"] },
      { id: "L0-3x0-4", start: pos["p0-3"], end: pos["p0-4"] },
      { id: "L0-3x1-3", start: pos["p0-3"], end: pos["p1-3"] },
      { id: "L1-2x2-2", start: pos["p1-2"], end: pos["p2-2"] },
      { id: "L1-2x1-3", start: pos["p1-2"], end: pos["p1-3"] },
      { id: "L1-3x2-3", start: pos["p1-3"], end: pos["p2-3"] },
      { id: "L1-3x1-4", start: pos["p1-3"], end: pos["p1-4"] },
      { id: "L2-3x3-3", start: pos["p2-3"], end: pos["p3-3"] },
      { id: "L2-3x2-4", start: pos["p2-3"], end: pos["p2-4"] },
      { id: "L3-3x3-4", start: pos["p3-3"], end: pos["p4-3"] },
      { id: "L3-3x4-3", start: pos["p3-3"], end: pos["p3-4"] },
      { id: "L3-2x3-3", start: pos["p3-2"], end: pos["p3-3"] },
      { id: "L3-2x4-2", start: pos["p3-2"], end: pos["p4-2"] },
      { id: "L3-1x3-2", start: pos["p3-1"], end: pos["p3-2"] },
      { id: "L3-1x4-1", start: pos["p3-1"], end: pos["p4-1"] },
      { id: "L3-0x3-1", start: pos["p3-0"], end: pos["p3-1"] },
      { id: "L3-0x4-0", start: pos["p3-0"], end: pos["p4-0"] },
      { id: "L3-4x3-5", start: pos["p4-3"], end: pos["p5-3"] },
      { id: "L4-3x5-3", start: pos["p3-4"], end: pos["p3-5"] },

      // no Ad
      { id: "L3-3xG-3",  start: pos["p3-3"], end: pos["pG-3"] },
      { id: "L3-3x3-G",  start: pos["p3-3"], end: pos["p3-G"] },
   ]

   var under_lines = [
      { stroke: "blue", start: pos["L1s"], end: pos["L1e"], width: 2 },
      { stroke: "blue", start: pos["L2s"], end: pos["L2e"], width: 2 }
   ]

   var point_text = [
      { pos: pos["p0-0"],   fill: 'black',   fontsize: .7, text: "0-0" },
      { pos: pos["p1-1"], fill: 'black',   fontsize: .7, text: "15-15" },
      { pos: pos["p2-2"], fill: 'black',   fontsize: .7, text: "30-30" },
      { pos: pos["p3-3"], fill: 'black',   fontsize: .7, text: "40-40" },

      { pos: pos["p0-1"],  fill: 'white',   fontsize: .7, text: "0-15" },
      { pos: pos["p1-2"], fill: 'white',   fontsize: .7, text: "15-30" },
      { pos: pos["p0-2"],  fill: 'white',   fontsize: .7, text: "0-30" },
      { pos: pos["p2-3"], fill: 'white',   fontsize: .7, text: "30-40" },
      { pos: pos["p1-3"], fill: 'white',   fontsize: .7, text: "15-40" },
      { pos: pos["p0-3"],  fill: 'white',   fontsize: .7, text: "0-40" },
      { pos: pos["p4-3"], fill: 'white',   fontsize: .7, text: "40-A" },

      { pos: pos["p1-0"],  fill: 'white',   fontsize: .7, text: "15-0" },
      { pos: pos["p2-1"], fill: 'white',   fontsize: .7, text: "30-15" },
      { pos: pos["p2-0"],  fill: 'white',   fontsize: .7, text: "30-0" },
      { pos: pos["p3-2"], fill: 'white',   fontsize: .7, text: "40-30" },
      { pos: pos["p3-1"], fill: 'white',   fontsize: .7, text: "40-15" },
      { pos: pos["p3-0"],  fill: 'white',   fontsize: .7, text: "40-0" },
      { pos: pos["p3-4"], fill: 'white',   fontsize: .7, text: "A-40" },
   ];

   var label_text = [
      { pos: pos["tPlyr"],  fill: 'black',   fontsize: .9, id: "Player", anchor: "middle", baseline: "hanging" },
      { pos: pos["tOpp"],   fill: 'black',   fontsize: .9, id: "Opponent", anchor: "middle", baseline: "hanging" },
      { pos: pos["GAME"],   fill: "#555555", fontsize: .9, id: "Game", anchor: "middle", baseline: "central" }
   ];

   var selectors = [
      { id: "Player",   pos: pos["sPlyr"], r_pct: .4, opacity: 1, status: 'none' },
      { id: "Opponent", pos: pos["sOpp"], r_pct: .4, opacity: .4, status: 'none' }
   ]

	// Helper Functions
   // ----------------

   // http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors 
   function shadeColor2(color, percent) {   
       var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
       return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
   }

   function blendColors(c0, c1, p) {
       var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
       return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
   }

   function shadeRGBColor(color, percent) {
      var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
      return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
   }

   function blendRGBColors(c0, c1, p) {
       var f=c0.split(","),t=c1.split(","),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
       return "rgb("+(Math.round((parseInt(t[0].slice(4))-R)*p)+R)+","+(Math.round((parseInt(t[1])-G)*p)+G)+","+(Math.round((parseInt(t[2])-B)*p)+B)+")";
   }

   function colorShade(color, percent){
      if (color.length > 7 ) return shadeRGBColor(color,percent);
      else return shadeColor2(color,percent);
   }

   function colorBlend(color1, color2, percent){
       if (color1.length > 7) return blendRGBColors(color1,color2,percent);
       else return blendColors(color1,color2,percent);
   }

   // http://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
   function getHexColor(colorStr) {
      var a = document.createElement('div');
      a.style.color = colorStr;
      var colors = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
      document.body.removeChild(a);
      return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
   }

   return chart;
}
function ptsMatch() {

   var match_data;

   var options = {

      id: 0,
      class: 'ptsMatch',

      resize: true,
      width: window.innerWidth,
	   height: 80,
	   max_height: 100,

      margins: {
         top: 0, 
         right: 0, 
         bottom: 0, 
         left: 0
      },

      set: {
         average_points: 56
      },

      lines: {
         width: 2,
         interpolation: 'linear'
      },

      points: {
         max_width_points: 100
      },

      score: {
         font: 'Arial',
         font_size: '12px',
         font_weight: 'bold',
         reverse: true
      },

      header: {
         font: 'Arial',
         font_size: '14px',
         font_weight: 'bold'
      },

      display: {
         sizeToFit: true,
         transition_time: 0,
         point_highlighting: true,
         point_opacity: .4,
         win_err_highlight: true,
         game_highlighting: true,
         game_opacity: .2,
         game_boundaries: true,
         gamepoints: false,
         score: true,
         points: true,
         winner: true
      },

      colors: {
         orientation: 'yellow',
         gamepoints: 'black',
         players: { 0: "#a55194", 1: "#6b6ecf" }
      }
   }

   // functions which should be accessible via ACCESSORS
   var update;

   // programmatic
   var pts_sets = [];
   var dom_parent;

   // prepare charts
   pts_charts = [];
   for (var s=0; s < 5; s++) {
      pts_charts.push(ptsChart());
   }

   // DEFINABLE EVENTS
   // Define with ACCESSOR function chart.events()
   var events = {
       'update': { begin: null, end: null},
       'set_box': { 'mouseover': null, 'mouseout': null },
       'update': { 'begin': null, 'end': null },
       'point_bars': { 'mouseover': null, 'mouseout': null, 'click': null }
   };

   function chart(selection) {
        dom_parent = selection;

        if (options.display.sizeToFit) {
           var dims = selection.node().getBoundingClientRect();
           options.width = Math.max(dims.width, 400);
        }

        // append svg
        var root = dom_parent.append('div')
            .attr('class', options.class + 'root')
            .style('width', options.width + 'px')
            .style('height', options.height + 'px' );

        for (var s=0; s < 5; s++) {
           pts_sets[s] = root.append("div")
              .attr("class", "pts")
              .style('display', 'none')
           pts_sets[s].call(pts_charts[s]);
        }

        update = function(opts) {
           var sets = match_data.sets();

           if (options.display.sizeToFit || (opts && opts.sizeToFit)) {
              var dims = selection.node().getBoundingClientRect();
              options.width = Math.max(dims.width, 400);
              options.height = (dims.height - (+options.margins.top + +options.margins.bottom)) / sets.length;
              if (options.height > options.max_height) options.height = options.max_height;
           }

           var true_height = 0;
           for (var s=0; s < pts_charts.length; s++) {
              if (sets[s] && sets[s].history.points().length) {
                 pts_sets[s].style('display', 'inline');
                 pts_charts[s].width(options.width); 
                 pts_charts[s].height(options.height); 
                 pts_charts[s].update();
                 true_height += +options.height + 5;
              } else {
                 pts_sets[s].style('display', 'none')
              }
           }

           root
             .style('width', options.width + 'px')
             .style('height', true_height + 'px');
     
        }
   }

    // ACCESSORS

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        keyWalk(values, options);
        return chart;
    }

    function keyWalk(valuesObject, optionsObject) {
        if (!valuesObject || !optionsObject) return;
        var vKeys = Object.keys(valuesObject);
        var oKeys = Object.keys(optionsObject);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              var oo = optionsObject[vKeys[k]];
              var vo = valuesObject[vKeys[k]];
              if (typeof oo == 'object' && typeof vo !== 'function' && oo && oo.constructor !== Array) {
                 keyWalk(valuesObject[vKeys[k]], optionsObject[vKeys[k]]);
              } else {
                 optionsObject[vKeys[k]] = valuesObject[vKeys[k]];
              }
           }
        }
    }

    chart.events = function(functions) {
         if (!arguments.length) return events;
         keyWalk(functions, events);
         return chart;
    }

    chart.colors = function(colores) {
        if (!arguments.length) return options.colors;
        options.colors.players = colores;
        return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        if (typeof update === 'function') update(true);
        pts_charts.forEach(function(e) { e.width(value) });
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        if (typeof update === 'function') update(true);
        pts_charts.forEach(function(e) { e.height(value) });
        return chart;
    };

    chart.duration = function(value) {
        if (!arguments.length) return options.display.transition_time;
       options.display.transition_time = value;
       return chart;
    }

    chart.update = function(opts) {
       if (events.update.begin) events.update.begin(); 
       var sets = match_data.sets();
       var max_width_points = Math.max(...sets.map((set, index) => set.history.points().filter(f=>f.set == index).length));
       if (sets.length > 1) chart.options({ points: { max_width_points }});
       sets.forEach(function(e, i) {
          pts_charts[i].data(sets[i]);
          pts_charts[i].options({ id: i });
          pts_charts[i].options({ lines: options.lines, points: options.points, score: options.score, header: options.header});
          pts_charts[i].options({ set: options.set, display: options.display, colors: options.colors});
          pts_charts[i].events(events);
          pts_charts[i].width(options.width).height(options.height).update(opts);
       })
       if (typeof update === 'function') update(opts);
       setTimeout(function() { 
         if (events.update.end) events.update.end(); 
       }, options.display.transition_time);
       return true;
    }

    chart.data = function(matchObject) {
       if (!arguments.length) { return match_data; }
       match_data = matchObject;
       chart.update();
    }

   function lastElement(arr) { return arr[arr.length - 1]; }

   return chart;
}

function ptsChart() {

    var set_data;

    var game_data;
    var points_to_set;

    var winners = ['Ace', 'Winner', 'Serve Winner'];
    var errors = ['Forced Error', 'Unforced Error', 'Double Fault', 'Penalty', 'Out', 'Net'];

    var options = {
      id: 0,
      class: 'ptsChart',

      resize: true,
      width: window.innerWidth,
	   height: 80,

      margins: {
         top: 5, 
         right: 15, 
         bottom: 5, 
         left: 5
      },

      set: {
         average_points: 56
      },

      lines: {
         width: 2,
         interpolation: 'linear'
      },

      points: {
         max_width_points: 100
      },

      score: {
         font: 'Arial',
         font_size: '12px',
         font_weight: 'bold',
         reverse: true
      },

      header: {
         font: 'Arial',
         font_size: '14px',
         font_weight: 'bold'
      },

      display: {
         transition_time: 0,
         point_highlighting: true,
         point_opacity: .4,
         win_err_highlight: true,
         game_highlighting: true,
         game_opacity: .2,
         game_boundaries: false,
         gamepoints: false,
         score: true,
         points: true,
         winner: true
      },

      colors: {
         orientation: 'yellow',
         gamepoints: 'black',
         players: { 0: "blue" , 1: "purple" }
      }

    }

    // functions which should be accessible via ACCESSORS
    var update;

    // programmatic
    var dom_parent;

    // DEFINABLE EVENTS
    // Define with ACCESSOR function chart.events()
    var events = {
       'set_box': { 'mouseover': null, 'mouseout': null },
       'update': { 'begin': null, 'end': null },
       'point_bars': { 'mouseover': null, 'mouseout': null, 'click': null }
    };

    function chart(selection) {
        selection.each(function () {

            dom_parent = d3.select(this);

            // append svg
            var root = dom_parent.append('svg')
                .attr('class', options.class + 'root')
                .style('width', options.width + 'px' )
                .style('height', options.height + 'px' );

            // append children g
            var pts = root.append('g').attr('class', options.class + 'pts')
                          .attr('transform', 'translate(5, 5)')

            // For Point Bars which must always be on top
            var ptsHover = root.append('g').attr('class', options.class + 'pts')
                          .attr('transform', 'translate(5, 5)')

            // append labels
            var set_winner = pts.append('text')
                    .attr('class', options.class + 'Header')
                    .attr('opacity', 0)
                    .attr('font-size', options.header.font_size)
                    .attr('font-weight', options.header.font_weight)
                    .attr('x', function(d, i) { return (options.margins.left) + 'px'})
                    .attr('y', function(d, i) { return (options.margins.top + 8) + 'px' })

            var set_score = pts.append('text')
                    .attr('class', options.class + 'Score')
                    .attr('opacity', 0)
                    .attr('font-size', options.score.font_size)
                    .attr('font-weight', options.score.font_weight)
                    .attr('x', function(d, i) { return (options.margins.left) + 'px'})
                    .attr('y', function(d, i) { return (options.margins.top + 20) + 'px' })

            var set_points = pts.append('text')
                    .attr('class', options.class + 'Points')
                    .attr('opacity', 0)
                    .attr('font-size', options.score.font_size)
                    .attr('font-weight', options.score.font_weight)
                    .attr('x', function(d, i) { return (options.margins.left + 40) + 'px'})
                    .attr('y', function(d, i) { return (options.margins.top + 20) + 'px' })

            // resize used to disable transitions during resize operation
            update = function(opts, resize) {
               if (!set_data) { return false; }

               root
                .transition().duration(options.display.transition_time)
                .style('width', options.width + 'px')
                .style('height', options.height + 'px');

               var points = set_data.history.action('addPoint').filter(f=>f.point.set == options.id);
               var range_start = points[0].point.index;

               game_data = groupGames(points);
               points_to_set = points.map(p => p.needed.points_to_set);
               var pts_max = Math.max(...[].concat(points_to_set.map(p=>p[0]), points_to_set.map(p=>p[1])));
               var pts_start = Math.max(...points_to_set[0]);

               // add pts prior to first point
               points_to_set.unshift([pts_start, pts_start]);

               var longest_rally = Math.max.apply(null, points.map(function(m) { return m.point.rally ? m.point.rally.length : 0 })) + 2;

               displayScore(resize);

               var xScale = d3.scaleLinear()
                    .domain([0, calcWidth()])
                    .range([0, options.width - (options.margins.left + options.margins.right)]);

               function pointScale(d, r, a) { 
                  if (d.range[r] < range_start) return xScale(d.range[r] + a);
                  return xScale(d.range[r] + a - range_start); 
               }

               var yScale = d3.scaleLinear()
                    .range([options.height - (options.margins.top + options.margins.bottom), options.margins.bottom])
                    .domain([-2, pts_max - 1]);

               // Set Box
               var set_box = pts.selectAll("." + options.class + "SetBox")
                   .data([options.id]) // # of list elements only used for index, data not important

               set_box.enter()
                   .append("rect")
                   .attr("class", options.class + "SetBox")
                   .style("position", "relative")
                   .attr("height", function() { return options.height - (options.margins.top + options.margins.bottom) } )
                   .attr("width", function() { return xScale(boxWidth() + 1); })
                   .attr('stroke', 'black')
                   .attr('stroke-width', 1)
                   .attr('fill', 'none')
                   .on('mouseover', function(d, i) { if (events.set_box.mouseover) events.set_box.mouseover(d, i); })
                   .on('mouseout', function(d, i) { if (events.set_box.mouseout) events.set_box.mouseout(d, i); })
                  .merge(set_box)
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .attr("height", function() { return options.height - (options.margins.top + options.margins.bottom) } )
                   .attr("width", function() { return xScale(boxWidth() + 1); })

                set_box.exit()
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .style('opacity', 0)
                   .remove()

                // Game Boundaries
                var game_boundaries = pts.selectAll("." + options.class + "GameBoundary")
                   .data(game_data)

                game_boundaries.exit().remove()

                game_boundaries.enter()
                   .append('rect')
                   .attr("class", options.class + "GameBoundary")
                  .merge(game_boundaries)
                   .attr("id", function(d, i) { return options.class + options.id + 'boundary' + i; })
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .attr('opacity', function() { return options.display.game_boundaries ? .02 : 0 })
                   .attr("transform", function(d, i) { return "translate(" + pointScale(d, 0, 0) + ", 0)"; })
                   .attr("height", yScale(-2))
                   .attr('width', function(d) { return pointScale(d, 1, 1) - pointScale(d, 0, 0); })
                   .attr('stroke', 'black')
                   .attr('stroke-width', 1)
                   .attr('fill', 'none')

                // Game Boxes
                var game_boxes = pts.selectAll("." + options.class + "Game")
                   .data(game_data)

                game_boxes.exit().remove()

                game_boxes.enter()
                   .append('rect')
                   .attr("class", options.class + "Game")
                  .merge(game_boxes)
                   .attr("id", function(d, i) { return options.class + options.id + 'game' + i; })
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .attr('opacity', function() { return options.display.game_boundaries ? .02 : 0 })
                   .attr("transform", function(d, i) { return "translate(" + pointScale(d, 0, 0) + ", 0)"; })
                   .attr("height", yScale(-2))
                   .attr('width', function(d) { return pointScale(d, 1, 1) - pointScale(d, 0, 0); })
                   .attr('stroke', function(d) { return options.colors.players[d.winner]; })
                   .attr('stroke-width', 1)
                   .attr('fill', function(d) { return d.winner != undefined ? options.colors.players[d.winner] : 'none'; })

                // Player PTS Lines
                var lineGen = d3.line()
                   .x(function(d, i) { return xScale(i); })
                   .y(function(d) { return yScale(pts_max - d); })

                var pts_lines = pts.selectAll("." + options.class + "Line")
                   .data([0, 1])

                pts_lines.exit().remove();

                pts_lines.enter()
                   .append('path')
                   .attr('class', options.class + 'Line')
                   .attr('id', function(d) { return options.class + options.id + 'player' + d + 'Line'; })
                   .attr('fill', 'none')
                  .merge(pts_lines)
                   .transition().duration(resize ? 0 : options.display.transition_time / 2)
                   .style('opacity', .1)
                   .transition().duration(resize ? 0 : options.display.transition_time / 2)
                   .style('opacity', 1)
                   .attr('stroke', function(d) { return options.colors.players[d]; })
                   .attr('stroke-width', function(d) { return options.lines.width; })
                   // .attr('d', function(d) { return lineGen(player_data[d]) })
                   .attr('d', function(d) { return lineGen(points_to_set.map(p=>p[d])) })

                // var bp_data = [points_to_set.map(p=>p[0]), points_to_set.map(p=>p[1])];
                var bp_data = [points_to_set.map(p=>{ return { pts:p[0] }}), points_to_set.map(p=>{ return { pts: p[1] }})];
                var bp_wrappers = pts.selectAll('.' + options.class + 'BPWrapper')
                   .data(bp_data) 

                bp_wrappers.enter()
                   .append('g')
                   .attr('class', options.class + 'BPWrapper');

                bp_wrappers.exit().remove();

                var breakpoints = bp_wrappers.selectAll('.' + options.class + 'Breakpoint')
                   .data(function(d, i) { return add_index(d, i); })

                breakpoints.exit().attr('opacity', '0').remove()

                breakpoints.enter()
                   .append('circle')
                   .attr('class', options.class + 'Breakpoint')
                   .attr('opacity', '0')
                  .merge(breakpoints)
                   .transition().duration(resize ? 0 : options.display.transition_time / 2)
                   .style('opacity', 0)
                   .transition().duration(resize ? 0 : options.display.transition_time / 2)
                   .attr('fill', function(d, i) { 
                      if (points[i - 1] && points[i - 1].point.breakpoint != undefined) {
                         return options.colors.players[d._i]; 
                      }
                   })
                   .style('opacity', function(d, i) { 
                      if (points[i - 1]) {
                         if (points[i - 1].point.breakpoint != undefined) {
                            // return points[i - 1].point.breakpoint == d._i ? 1 : 0
                            return points[i - 1].point.server == 1 - d._i ? 1 : 0
                         }
                      }
                   })
                   .attr("cx", function(d, i) { return xScale(i); })
                   .attr("cy", function(d) { return yScale(pts_max - d.pts); })
                   .attr("r", 2)

                var points_index = d3.range(points.length);
                var barsX = d3.scaleBand()
                   .domain(points_index)
                   .range([0, xScale(points.length)])
                   .round(true)

                var bX = d3.scaleLinear()
                   .domain([0, points.length])
                   .range([0, xScale(points.length)])

                // gradients cause hover errors when data is replaced
                pts.selectAll('.gradient' + options.id).remove();

                var gradients = pts.selectAll('.gradient' + options.id)
                     .data(d3.range(points.length)) // data not important, only length of array
                    .enter()
                     .append('linearGradient')
                     .attr("id", function(d, i) { return 'gradient' + options.id + i; })
                     .attr("class", function() { return "gradient" + options.id })
                     .attr("gradientUnits", "userSpaceOnUse")
                     .attr("x1", function(d) { return barsX.bandwidth() / 2; })
                     .attr("y1", function(d) { return 0 })
                     .attr("x2", function(d) { return barsX.bandwidth() / 2; })
                     .attr("y2", function(d) { return yScale(-2) })
                     .attr("transform", function(d, i) { return "translate(" + bX(i) + ", 0)"; })
                    .selectAll(".points_stop")
                     .data(function(d, i) { return calcStops(points[i].point, i); })
                     .enter()
                     .append("stop")
                     .attr("class", "points_stop")
                     .attr("offset", function(d) { return d.offset; })
                     .attr("stop-color", function(d) { return d.color; })
                     .attr("offset", function(d) { return d.offset; })

                var point_bars = ptsHover.selectAll("." + options.class + "Bar")
                   .data(d3.range(points.length)) // data not important, only length of array

                point_bars.exit()
                   .transition().duration(resize ? 0 : options.display.transition_time)
                   .attr('opacity', '0')
                   .remove()

                point_bars.enter()
                   .append("line")
                   .attr("class", options.class + "Bar")
                   .attr('opacity', '0')
                  .merge(point_bars)
                   .attr('opacity', '0')
                   .attr("transform", function(d, i) { return "translate(" + bX(i) + ", 0)"; })
                   .attr("x1", function(d) { return barsX.bandwidth() / 2; })
                   .attr("y1", function(d) { return 0 })
                   .attr("x2", function(d) { return barsX.bandwidth() / 2; })
                   .attr("y2", function(d) { return yScale(-2) })
                   .attr("stroke-width", function() { return barsX.bandwidth(); })
                   .attr("stroke", function(d, i) { return 'url(#gradient' + options.id + i + ')' })
                   .attr("uid", function(d, i) { return 'point' + i; })
                   .on("mousemove", function(d, i) { 
                      if (options.display.point_highlighting) { d3.select(this).attr("opacity", options.display.point_opacity); }
                      if (options.display.game_highlighting && points[i]) {
                         d3.select('[id="' + options.class + options.id + 'game' + points[i].point.game + '"]').attr("opacity", options.display.game_opacity);
                      }
                      if (events.point_bars.mouseover) { events.point_bars.mouseover(points[d], i); };
                      if (d==0) {
                         ptsHover.selectAll('.' + options.class + 'Bar').attr("opacity", options.display.point_opacity);
                      }
                      if (d + 2 == points_to_set.length && (points_to_set[d + 1][0] == 0 || points_to_set[d + 1][1] == 0)) {
                         pts.selectAll('.' + options.class + 'Game').attr("opacity", options.display.game_opacity);
                      }
                      highlightScore(d);
                   })
                   .on("mouseout", function(d, i) { 
                      ptsHover.selectAll('.' + options.class + 'Bar').attr("opacity", 0);
                      pts.selectAll('.' + options.class + 'Game').attr("opacity", "0");
                      if (events.point_bars.mouseout) { events.point_bars.mouseout(points[d], i); }; 
                      displayScore();
                   })
                   .on("click", function(d, i) {
                      if (events.point_bars.click) { events.point_bars.click(points[d], i, this); }; 
                   })

               function lastName(name) { 
                  let split = name.split(' ');
                  return split[split.length - 1];
               }

               function displayScore(resize) {
                  var winner = set_data.winner(); 
                  let players = set_data.metadata.players();
                  var legend = winner != undefined ? players[winner].name : `${lastName(players[0].name)}/${lastName(players[1].name)}`;

                  set_winner
                    .transition().duration(resize ? 0 : options.display.transition_time)
                    .attr('opacity', 1)
                    .attr('fill', winner != undefined ? options.colors.players[winner] : 'black')
                    .text(legend);

                  var game_score = set_data.scoreboard(winner);
                  set_score
                    .transition().duration(resize ? 0 : options.display.transition_time)
                    .attr('opacity', 1)
                    .attr('fill', winner != undefined ? options.colors.players[winner] : 'black')
                    .text(game_score);

                  set_points
                    .transition().duration(100) // necessary
                    .attr('opacity', 0)
               }

               function highlightScore(d) {
                  if (!points[d]) return;
                  let p_t_s = points_to_set[d + 1];
                  let point_score = points[d].point.score;
                  let players = set_data.metadata.players();
                  let leader = p_t_s[0] < p_t_s[1] ? 1 : p_t_s[0] > p_t_s[1] ? 0 : undefined;
                  let legend = leader != undefined ? players[leader].name : `${lastName(players[0].name)}/${lastName(players[1].name)}`;

                  set_winner
                    .transition().duration(100) // necessary
                    .attr('opacity', 1)
                    .attr('fill', function() { return leader != undefined ? options.colors.players[leader] : 'black'; })
                    .text(legend);

                  set_score
                    .transition().duration(100) // necessary
                    .attr('opacity', 1)
                    .attr('fill', function() { return leader != undefined ? options.colors.players[leader] : 'black'; })
                    .text(points[d].game.games.join('-'));

                  set_points
                    .transition().duration(100) // necessary
                    .attr('opacity', 1)
                    .attr('fill', function() { return leader != undefined ? options.colors.players[leader] : 'black'; })
                    .text(point_score != '0-0' ? point_score : '');
               }

               function calcStops(point, i) {
                  var win_pct = 0;
                  var err_pct = 0;
                  var u_pct = 0;

                  if (options.display.win_err_highlight) {
                     var rally = point.rally;
                     var result = point.result;
                     var rally_pct = rally ? 100 - Math.floor(rally.length / longest_rally * 100) : 100;
                     if (winners.indexOf(result) >= 0) {
                        win_pct = rally_pct;
                     } else if (errors.indexOf(result) >= 0) {
                        err_pct = rally_pct;
                     } else {
                        u_pct = rally_pct;
                     }
                  }

                  return [ {offset: "0%", color: 'blue' }, 
                           {offset: u_pct + "%", color: 'blue' }, 
                           {offset: u_pct + "%", color: 'green' }, 
                           {offset: u_pct + win_pct + "%", color: 'green' }, 
                           {offset: u_pct + win_pct + "%", color: 'red' }, 
                           {offset: u_pct + win_pct + err_pct + "%", color: 'red' }, 
                           {offset: u_pct + win_pct + err_pct + "%", color: options.colors.orientation }, 
                           {offset: "100%", color: options.colors.orientation } ] 
               }

            }
        });
    }

    // REUSABLE functions
    // ------------------

    function add_index(d, i) {
       for (var v=0; v<d.length; v++) { d[v]['_i'] = i; }
       return d;
    }

    function boxWidth() {
       var dl = set_data.history.points().filter(f=>f.set == options.id).length - 1;
       var pw = set_data.complete() ? dl : dl < options.set.average_points ? options.set.average_points : dl;
       return pw;
    }

    function calcWidth() {
       var dl = set_data.history.points().filter(f=>f.set == options.id).length - 1;
       var mw = Math.max(dl, options.points.max_width_points, options.set.average_points);
       return mw;
    }

    function groupGames(point_episodes) {
       let games = [{ points: [], range: [0, 0] }];
       let game_counter = 0;
       let current_game = 0;
       point_episodes.forEach(episode => {
          let point = episode.point;
          if (point.game != current_game) {
             game_counter += 1;
             current_game = point.game;
             games[game_counter] = { points: [], range: [point.index, point.index] };
          }
          games[game_counter].points.push(point);
          games[game_counter].index = game_counter;
          games[game_counter].set = episode.set.index;
          games[game_counter].score = episode.game.games;
          games[game_counter].complete = episode.game.complete;
          games[game_counter].range[1] = point.index;
          if (episode.game.complete) games[game_counter].winner = point.winner;
       });
       return games;
       if (set != undefined) games = games.filter(function(game) { return game.set == set });
    }

    // ACCESSORS

    // allows updating individual options and suboptions
    // while preserving state of other options
    chart.options = function(values) {
        if (!arguments.length) return options;
        var vKeys = Object.keys(values);
        var oKeys = Object.keys(options);
        for (var k=0; k < vKeys.length; k++) {
           if (oKeys.indexOf(vKeys[k]) >= 0) {
              if (typeof(options[vKeys[k]]) == 'object') {
                 var sKeys = Object.keys(values[vKeys[k]]);
                 var osKeys = Object.keys(options[vKeys[k]]);
                 for (var sk=0; sk < sKeys.length; sk++) {
                    if (osKeys.indexOf(sKeys[sk]) >= 0) {
                       options[vKeys[k]][sKeys[sk]] = values[vKeys[k]][sKeys[sk]];
                    }
                 }
              } else {
                 options[vKeys[k]] = values[vKeys[k]];
              }
           }
        }
        return chart;
    }

    chart.data = function(set_object) {
      if (!arguments.length) return set_data;
      set_data = set_object;
    }

   chart.events = function(functions) {
        if (!arguments.length) return events;
        var fKeys = Object.keys(functions);
        var eKeys = Object.keys(events);
        for (var k=0; k < fKeys.length; k++) {
           if (eKeys.indexOf(fKeys[k]) >= 0) events[fKeys[k]] = functions[fKeys[k]];
        }
        return chart;
   }

    chart.colors = function(colores) {
        if (!arguments.length) return options.colors;
        options.colors.players = colores;
        return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return options.width;
        options.width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return options.height;
        options.height = value;
        return chart;
    };

    chart.update = function(opts) {
       if (events.update.begin) events.update.begin(); 
       if (typeof update === 'function') update(opts);
        setTimeout(function() { 
          if (events.update.end) events.update.end(); 
        }, options.display.transition_time);
       return true;
    }

    chart.duration = function(value) {
        if (!arguments.length) return options.display.transition_time;
       options.display.transition_time = value;
       return chart;
    }

    function lastElement(arr) { return arr[arr.length - 1]; }

    return chart;
}
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.io=e():t.io=e()}(this,function(){return function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";function n(t,e){"object"===("undefined"==typeof t?"undefined":i(t))&&(e=t,t=void 0),e=e||{};var r,n=s(t),a=n.source,p=n.id,f=n.path,l=h[p]&&f in h[p].nsps,d=e.forceNew||e["force new connection"]||!1===e.multiplex||l;return d?(u("ignoring socket cache for %s",a),r=c(a,e)):(h[p]||(u("new io instance for %s",a),h[p]=c(a,e)),r=h[p]),n.query&&!e.query?e.query=n.query:e&&"object"===i(e.query)&&(e.query=o(e.query)),r.socket(n.path,e)}function o(t){var e=[];for(var r in t)t.hasOwnProperty(r)&&e.push(encodeURIComponent(r)+"="+encodeURIComponent(t[r]));return e.join("&")}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s=r(1),a=r(7),c=r(17),u=r(3)("socket.io-client");t.exports=e=n;var h=e.managers={};e.protocol=a.protocol,e.connect=n,e.Manager=r(17),e.Socket=r(44)},function(t,e,r){(function(e){"use strict";function n(t,r){var n=t;r=r||e.location,null==t&&(t=r.protocol+"//"+r.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?r.protocol+t:r.host+t),/^(https?|wss?):\/\//.test(t)||(i("protocol-less url %s",t),t="undefined"!=typeof r?r.protocol+"//"+t:"https://"+t),i("parse %s",t),n=o(t)),n.port||(/^(http|ws)$/.test(n.protocol)?n.port="80":/^(http|ws)s$/.test(n.protocol)&&(n.port="443")),n.path=n.path||"/";var s=n.host.indexOf(":")!==-1,a=s?"["+n.host+"]":n.host;return n.id=n.protocol+"://"+a+":"+n.port,n.href=n.protocol+"://"+a+(r&&r.port===n.port?"":":"+n.port),n}var o=r(2),i=r(3)("socket.io-client:url");t.exports=n}).call(e,function(){return this}())},function(t,e){var r=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,n=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");o!=-1&&i!=-1&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=r.exec(t||""),a={},c=14;c--;)a[n[c]]=s[c]||"";return o!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a}},function(t,e,r){(function(n){function o(){return"undefined"!=typeof document&&"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}function i(){var t=arguments,r=this.useColors;if(t[0]=(r?"%c":"")+this.namespace+(r?" %c":" ")+t[0]+(r?"%c ":" ")+"+"+e.humanize(this.diff),!r)return t;var n="color: "+this.color;t=[t[0],n,"color: inherit"].concat(Array.prototype.slice.call(t,1));var o=0,i=0;return t[0].replace(/%[a-z%]/g,function(t){"%%"!==t&&(o++,"%c"===t&&(i=o))}),t.splice(i,0,n),t}function s(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function a(t){try{null==t?e.storage.removeItem("debug"):e.storage.debug=t}catch(t){}}function c(){try{return e.storage.debug}catch(t){}if("undefined"!=typeof n&&"env"in n)return n.env.DEBUG}function u(){try{return window.localStorage}catch(t){}}e=t.exports=r(5),e.log=s,e.formatArgs=i,e.save=a,e.load=c,e.useColors=o,e.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:u(),e.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],e.formatters.j=function(t){try{return JSON.stringify(t)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}},e.enable(c())}).call(e,r(4))},function(t,e){function r(){throw new Error("setTimeout has not been defined")}function n(){throw new Error("clearTimeout has not been defined")}function o(t){if(h===setTimeout)return setTimeout(t,0);if((h===r||!h)&&setTimeout)return h=setTimeout,setTimeout(t,0);try{return h(t,0)}catch(e){try{return h.call(null,t,0)}catch(e){return h.call(this,t,0)}}}function i(t){if(p===clearTimeout)return clearTimeout(t);if((p===n||!p)&&clearTimeout)return p=clearTimeout,clearTimeout(t);try{return p(t)}catch(e){try{return p.call(null,t)}catch(e){return p.call(this,t)}}}function s(){y&&l&&(y=!1,l.length?d=l.concat(d):g=-1,d.length&&a())}function a(){if(!y){var t=o(s);y=!0;for(var e=d.length;e;){for(l=d,d=[];++g<e;)l&&l[g].run();g=-1,e=d.length}l=null,y=!1,i(t)}}function c(t,e){this.fun=t,this.array=e}function u(){}var h,p,f=t.exports={};!function(){try{h="function"==typeof setTimeout?setTimeout:r}catch(t){h=r}try{p="function"==typeof clearTimeout?clearTimeout:n}catch(t){p=n}}();var l,d=[],y=!1,g=-1;f.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];d.push(new c(t,e)),1!==d.length||y||o(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=u,f.addListener=u,f.once=u,f.off=u,f.removeListener=u,f.removeAllListeners=u,f.emit=u,f.binding=function(t){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(t){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(t,e,r){function n(){return e.colors[h++%e.colors.length]}function o(t){function r(){}function o(){var t=o,r=+new Date,i=r-(u||r);t.diff=i,t.prev=u,t.curr=r,u=r,null==t.useColors&&(t.useColors=e.useColors()),null==t.color&&t.useColors&&(t.color=n());for(var s=new Array(arguments.length),a=0;a<s.length;a++)s[a]=arguments[a];s[0]=e.coerce(s[0]),"string"!=typeof s[0]&&(s=["%o"].concat(s));var c=0;s[0]=s[0].replace(/%([a-z%])/g,function(r,n){if("%%"===r)return r;c++;var o=e.formatters[n];if("function"==typeof o){var i=s[c];r=o.call(t,i),s.splice(c,1),c--}return r}),s=e.formatArgs.apply(t,s);var h=o.log||e.log||console.log.bind(console);h.apply(t,s)}r.enabled=!1,o.enabled=!0;var i=e.enabled(t)?o:r;return i.namespace=t,i}function i(t){e.save(t);for(var r=(t||"").split(/[\s,]+/),n=r.length,o=0;o<n;o++)r[o]&&(t=r[o].replace(/[\\^$+?.()|[\]{}]/g,"\\$&").replace(/\*/g,".*?"),"-"===t[0]?e.skips.push(new RegExp("^"+t.substr(1)+"$")):e.names.push(new RegExp("^"+t+"$")))}function s(){e.enable("")}function a(t){var r,n;for(r=0,n=e.skips.length;r<n;r++)if(e.skips[r].test(t))return!1;for(r=0,n=e.names.length;r<n;r++)if(e.names[r].test(t))return!0;return!1}function c(t){return t instanceof Error?t.stack||t.message:t}e=t.exports=o.debug=o,e.coerce=c,e.disable=s,e.enable=i,e.enabled=a,e.humanize=r(6),e.names=[],e.skips=[],e.formatters={};var u,h=0},function(t,e){function r(t){if(t=String(t),!(t.length>1e4)){var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(e){var r=parseFloat(e[1]),n=(e[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return r*h;case"days":case"day":case"d":return r*u;case"hours":case"hour":case"hrs":case"hr":case"h":return r*c;case"minutes":case"minute":case"mins":case"min":case"m":return r*a;case"seconds":case"second":case"secs":case"sec":case"s":return r*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r;default:return}}}}function n(t){return t>=u?Math.round(t/u)+"d":t>=c?Math.round(t/c)+"h":t>=a?Math.round(t/a)+"m":t>=s?Math.round(t/s)+"s":t+"ms"}function o(t){return i(t,u,"day")||i(t,c,"hour")||i(t,a,"minute")||i(t,s,"second")||t+" ms"}function i(t,e,r){if(!(t<e))return t<1.5*e?Math.floor(t/e)+" "+r:Math.ceil(t/e)+" "+r+"s"}var s=1e3,a=60*s,c=60*a,u=24*c,h=365.25*u;t.exports=function(t,e){e=e||{};var i=typeof t;if("string"===i&&t.length>0)return r(t);if("number"===i&&isNaN(t)===!1)return e.long?o(t):n(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},function(t,e,r){function n(){}function o(t){var r="",n=!1;return r+=t.type,e.BINARY_EVENT!=t.type&&e.BINARY_ACK!=t.type||(r+=t.attachments,r+="-"),t.nsp&&"/"!=t.nsp&&(n=!0,r+=t.nsp),null!=t.id&&(n&&(r+=",",n=!1),r+=t.id),null!=t.data&&(n&&(r+=","),r+=f.stringify(t.data)),p("encoded %j as %s",t,r),r}function i(t,e){function r(t){var r=d.deconstructPacket(t),n=o(r.packet),i=r.buffers;i.unshift(n),e(i)}d.removeBlobs(t,r)}function s(){this.reconstructor=null}function a(t){var r={},n=0;if(r.type=Number(t.charAt(0)),null==e.types[r.type])return h();if(e.BINARY_EVENT==r.type||e.BINARY_ACK==r.type){for(var o="";"-"!=t.charAt(++n)&&(o+=t.charAt(n),n!=t.length););if(o!=Number(o)||"-"!=t.charAt(n))throw new Error("Illegal attachments");r.attachments=Number(o)}if("/"==t.charAt(n+1))for(r.nsp="";++n;){var i=t.charAt(n);if(","==i)break;if(r.nsp+=i,n==t.length)break}else r.nsp="/";var s=t.charAt(n+1);if(""!==s&&Number(s)==s){for(r.id="";++n;){var i=t.charAt(n);if(null==i||Number(i)!=i){--n;break}if(r.id+=t.charAt(n),n==t.length)break}r.id=Number(r.id)}return t.charAt(++n)&&(r=c(r,t.substr(n))),p("decoded %s as %j",t,r),r}function c(t,e){try{t.data=f.parse(e)}catch(t){return h()}return t}function u(t){this.reconPack=t,this.buffers=[]}function h(t){return{type:e.ERROR,data:"parser error"}}var p=r(8)("socket.io-parser"),f=r(11),l=r(13),d=r(14),y=r(16);e.protocol=4,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6,e.Encoder=n,e.Decoder=s,n.prototype.encode=function(t,r){if(p("encoding packet %j",t),e.BINARY_EVENT==t.type||e.BINARY_ACK==t.type)i(t,r);else{var n=o(t);r([n])}},l(s.prototype),s.prototype.add=function(t){var r;if("string"==typeof t)r=a(t),e.BINARY_EVENT==r.type||e.BINARY_ACK==r.type?(this.reconstructor=new u(r),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",r)):this.emit("decoded",r);else{if(!y(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");r=this.reconstructor.takeBinaryData(t),r&&(this.reconstructor=null,this.emit("decoded",r))}},s.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},u.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length==this.reconPack.attachments){var e=d.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},u.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},function(t,e,r){function n(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}function o(){var t=arguments,r=this.useColors;if(t[0]=(r?"%c":"")+this.namespace+(r?" %c":" ")+t[0]+(r?"%c ":" ")+"+"+e.humanize(this.diff),!r)return t;var n="color: "+this.color;t=[t[0],n,"color: inherit"].concat(Array.prototype.slice.call(t,1));var o=0,i=0;return t[0].replace(/%[a-z%]/g,function(t){"%%"!==t&&(o++,"%c"===t&&(i=o))}),t.splice(i,0,n),t}function i(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function s(t){try{null==t?e.storage.removeItem("debug"):e.storage.debug=t}catch(t){}}function a(){var t;try{t=e.storage.debug}catch(t){}return t}function c(){try{return window.localStorage}catch(t){}}e=t.exports=r(9),e.log=i,e.formatArgs=o,e.save=s,e.load=a,e.useColors=n,e.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:c(),e.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],e.formatters.j=function(t){return JSON.stringify(t)},e.enable(a())},function(t,e,r){function n(){return e.colors[h++%e.colors.length]}function o(t){function r(){}function o(){var t=o,r=+new Date,i=r-(u||r);t.diff=i,t.prev=u,t.curr=r,u=r,null==t.useColors&&(t.useColors=e.useColors()),null==t.color&&t.useColors&&(t.color=n());var s=Array.prototype.slice.call(arguments);s[0]=e.coerce(s[0]),"string"!=typeof s[0]&&(s=["%o"].concat(s));var a=0;s[0]=s[0].replace(/%([a-z%])/g,function(r,n){if("%%"===r)return r;a++;var o=e.formatters[n];if("function"==typeof o){var i=s[a];r=o.call(t,i),s.splice(a,1),a--}return r}),"function"==typeof e.formatArgs&&(s=e.formatArgs.apply(t,s));var c=o.log||e.log||console.log.bind(console);c.apply(t,s)}r.enabled=!1,o.enabled=!0;var i=e.enabled(t)?o:r;return i.namespace=t,i}function i(t){e.save(t);for(var r=(t||"").split(/[\s,]+/),n=r.length,o=0;o<n;o++)r[o]&&(t=r[o].replace(/\*/g,".*?"),"-"===t[0]?e.skips.push(new RegExp("^"+t.substr(1)+"$")):e.names.push(new RegExp("^"+t+"$")))}function s(){e.enable("")}function a(t){var r,n;for(r=0,n=e.skips.length;r<n;r++)if(e.skips[r].test(t))return!1;for(r=0,n=e.names.length;r<n;r++)if(e.names[r].test(t))return!0;return!1}function c(t){return t instanceof Error?t.stack||t.message:t}e=t.exports=o,e.coerce=c,e.disable=s,e.enable=i,e.enabled=a,e.humanize=r(10),e.names=[],e.skips=[],e.formatters={};var u,h=0},function(t,e){function r(t){if(t=""+t,!(t.length>1e4)){var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(e){var r=parseFloat(e[1]),n=(e[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return r*h;case"days":case"day":case"d":return r*u;case"hours":case"hour":case"hrs":case"hr":case"h":return r*c;case"minutes":case"minute":case"mins":case"min":case"m":return r*a;case"seconds":case"second":case"secs":case"sec":case"s":return r*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r}}}}function n(t){return t>=u?Math.round(t/u)+"d":t>=c?Math.round(t/c)+"h":t>=a?Math.round(t/a)+"m":t>=s?Math.round(t/s)+"s":t+"ms"}function o(t){return i(t,u,"day")||i(t,c,"hour")||i(t,a,"minute")||i(t,s,"second")||t+" ms"}function i(t,e,r){if(!(t<e))return t<1.5*e?Math.floor(t/e)+" "+r:Math.ceil(t/e)+" "+r+"s"}var s=1e3,a=60*s,c=60*a,u=24*c,h=365.25*u;t.exports=function(t,e){return e=e||{},"string"==typeof t?r(t):e.long?o(t):n(t)}},function(t,e,r){(function(t,r){var n=!1;(function(){function o(t,e){function r(t){if(r[t]!==g)return r[t];var o;if("bug-string-char-index"==t)o="a"!="a"[0];else if("json"==t)o=r("json-stringify")&&r("json-parse");else{var s,a='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==t){var c=e.stringify,h="function"==typeof c&&b;if(h){(s=function(){return 1}).toJSON=s;try{h="0"===c(0)&&"0"===c(new n)&&'""'==c(new i)&&c(v)===g&&c(g)===g&&c()===g&&"1"===c(s)&&"[1]"==c([s])&&"[null]"==c([g])&&"null"==c(null)&&"[null,null,null]"==c([g,v,null])&&c({a:[s,!0,!1,null,"\0\b\n\f\r\t"]})==a&&"1"===c(null,s)&&"[\n 1,\n 2\n]"==c([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==c(new u(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==c(new u(864e13))&&'"-000001-01-01T00:00:00.000Z"'==c(new u(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==c(new u(-1))}catch(t){h=!1}}o=h}if("json-parse"==t){var p=e.parse;if("function"==typeof p)try{if(0===p("0")&&!p(!1)){s=p(a);var f=5==s.a.length&&1===s.a[0];if(f){try{f=!p('"\t"')}catch(t){}if(f)try{f=1!==p("01")}catch(t){}if(f)try{f=1!==p("1.")}catch(t){}}}}catch(t){f=!1}o=f}}return r[t]=!!o}t||(t=c.Object()),e||(e=c.Object());var n=t.Number||c.Number,i=t.String||c.String,a=t.Object||c.Object,u=t.Date||c.Date,h=t.SyntaxError||c.SyntaxError,p=t.TypeError||c.TypeError,f=t.Math||c.Math,l=t.JSON||c.JSON;"object"==typeof l&&l&&(e.stringify=l.stringify,e.parse=l.parse);var d,y,g,m=a.prototype,v=m.toString,b=new u(-0xc782b5b800cec);try{b=b.getUTCFullYear()==-109252&&0===b.getUTCMonth()&&1===b.getUTCDate()&&10==b.getUTCHours()&&37==b.getUTCMinutes()&&6==b.getUTCSeconds()&&708==b.getUTCMilliseconds()}catch(t){}if(!r("json")){var w="[object Function]",k="[object Date]",x="[object Number]",A="[object String]",C="[object Array]",B="[object Boolean]",S=r("bug-string-char-index");if(!b)var T=f.floor,E=[0,31,59,90,120,151,181,212,243,273,304,334],_=function(t,e){return E[e]+365*(t-1970)+T((t-1969+(e=+(e>1)))/4)-T((t-1901+e)/100)+T((t-1601+e)/400)};if((d=m.hasOwnProperty)||(d=function(t){var e,r={};return(r.__proto__=null,r.__proto__={toString:1},r).toString!=v?d=function(t){var e=this.__proto__,r=t in(this.__proto__=null,this);return this.__proto__=e,r}:(e=r.constructor,d=function(t){var r=(this.constructor||e).prototype;return t in this&&!(t in r&&this[t]===r[t])}),r=null,d.call(this,t)}),y=function(t,e){var r,n,o,i=0;(r=function(){this.valueOf=0}).prototype.valueOf=0,n=new r;for(o in n)d.call(n,o)&&i++;return r=n=null,i?y=2==i?function(t,e){var r,n={},o=v.call(t)==w;for(r in t)o&&"prototype"==r||d.call(n,r)||!(n[r]=1)||!d.call(t,r)||e(r)}:function(t,e){var r,n,o=v.call(t)==w;for(r in t)o&&"prototype"==r||!d.call(t,r)||(n="constructor"===r)||e(r);(n||d.call(t,r="constructor"))&&e(r)}:(n=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],y=function(t,e){var r,o,i=v.call(t)==w,a=!i&&"function"!=typeof t.constructor&&s[typeof t.hasOwnProperty]&&t.hasOwnProperty||d;for(r in t)i&&"prototype"==r||!a.call(t,r)||e(r);for(o=n.length;r=n[--o];a.call(t,r)&&e(r));}),y(t,e)},!r("json-stringify")){var N={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},j="000000",O=function(t,e){return(j+(e||0)).slice(-t)},P="\\u00",R=function(t){for(var e='"',r=0,n=t.length,o=!S||n>10,i=o&&(S?t.split(""):t);r<n;r++){var s=t.charCodeAt(r);switch(s){case 8:case 9:case 10:case 12:case 13:case 34:case 92:e+=N[s];break;default:if(s<32){e+=P+O(2,s.toString(16));break}e+=o?i[r]:t.charAt(r)}}return e+'"'},D=function(t,e,r,n,o,i,s){var a,c,u,h,f,l,m,b,w,S,E,N,j,P,q,U;try{a=e[t]}catch(t){}if("object"==typeof a&&a)if(c=v.call(a),c!=k||d.call(a,"toJSON"))"function"==typeof a.toJSON&&(c!=x&&c!=A&&c!=C||d.call(a,"toJSON"))&&(a=a.toJSON(t));else if(a>-1/0&&a<1/0){if(_){for(f=T(a/864e5),u=T(f/365.2425)+1970-1;_(u+1,0)<=f;u++);for(h=T((f-_(u,0))/30.42);_(u,h+1)<=f;h++);f=1+f-_(u,h),l=(a%864e5+864e5)%864e5,m=T(l/36e5)%24,b=T(l/6e4)%60,w=T(l/1e3)%60,S=l%1e3}else u=a.getUTCFullYear(),h=a.getUTCMonth(),f=a.getUTCDate(),m=a.getUTCHours(),b=a.getUTCMinutes(),w=a.getUTCSeconds(),S=a.getUTCMilliseconds();a=(u<=0||u>=1e4?(u<0?"-":"+")+O(6,u<0?-u:u):O(4,u))+"-"+O(2,h+1)+"-"+O(2,f)+"T"+O(2,m)+":"+O(2,b)+":"+O(2,w)+"."+O(3,S)+"Z"}else a=null;if(r&&(a=r.call(e,t,a)),null===a)return"null";if(c=v.call(a),c==B)return""+a;if(c==x)return a>-1/0&&a<1/0?""+a:"null";if(c==A)return R(""+a);if("object"==typeof a){for(P=s.length;P--;)if(s[P]===a)throw p();if(s.push(a),E=[],q=i,i+=o,c==C){for(j=0,P=a.length;j<P;j++)N=D(j,a,r,n,o,i,s),E.push(N===g?"null":N);U=E.length?o?"[\n"+i+E.join(",\n"+i)+"\n"+q+"]":"["+E.join(",")+"]":"[]"}else y(n||a,function(t){var e=D(t,a,r,n,o,i,s);e!==g&&E.push(R(t)+":"+(o?" ":"")+e)}),U=E.length?o?"{\n"+i+E.join(",\n"+i)+"\n"+q+"}":"{"+E.join(",")+"}":"{}";return s.pop(),U}};e.stringify=function(t,e,r){var n,o,i,a;if(s[typeof e]&&e)if((a=v.call(e))==w)o=e;else if(a==C){i={};for(var c,u=0,h=e.length;u<h;c=e[u++],a=v.call(c),(a==A||a==x)&&(i[c]=1));}if(r)if((a=v.call(r))==x){if((r-=r%1)>0)for(n="",r>10&&(r=10);n.length<r;n+=" ");}else a==A&&(n=r.length<=10?r:r.slice(0,10));return D("",(c={},c[""]=t,c),o,i,n,"",[])}}if(!r("json-parse")){var q,U,M=i.fromCharCode,L={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"},I=function(){throw q=U=null,h()},H=function(){for(var t,e,r,n,o,i=U,s=i.length;q<s;)switch(o=i.charCodeAt(q)){case 9:case 10:case 13:case 32:q++;break;case 123:case 125:case 91:case 93:case 58:case 44:return t=S?i.charAt(q):i[q],q++,t;case 34:for(t="@",q++;q<s;)if(o=i.charCodeAt(q),o<32)I();else if(92==o)switch(o=i.charCodeAt(++q)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:t+=L[o],q++;break;case 117:for(e=++q,r=q+4;q<r;q++)o=i.charCodeAt(q),o>=48&&o<=57||o>=97&&o<=102||o>=65&&o<=70||I();t+=M("0x"+i.slice(e,q));break;default:I()}else{if(34==o)break;for(o=i.charCodeAt(q),e=q;o>=32&&92!=o&&34!=o;)o=i.charCodeAt(++q);t+=i.slice(e,q)}if(34==i.charCodeAt(q))return q++,t;I();default:if(e=q,45==o&&(n=!0,o=i.charCodeAt(++q)),o>=48&&o<=57){for(48==o&&(o=i.charCodeAt(q+1),o>=48&&o<=57)&&I(),n=!1;q<s&&(o=i.charCodeAt(q),o>=48&&o<=57);q++);if(46==i.charCodeAt(q)){for(r=++q;r<s&&(o=i.charCodeAt(r),o>=48&&o<=57);r++);r==q&&I(),q=r}if(o=i.charCodeAt(q),101==o||69==o){for(o=i.charCodeAt(++q),43!=o&&45!=o||q++,r=q;r<s&&(o=i.charCodeAt(r),o>=48&&o<=57);r++);r==q&&I(),q=r}return+i.slice(e,q)}if(n&&I(),"true"==i.slice(q,q+4))return q+=4,!0;if("false"==i.slice(q,q+5))return q+=5,!1;if("null"==i.slice(q,q+4))return q+=4,null;I()}return"$"},z=function(t){var e,r;if("$"==t&&I(),"string"==typeof t){if("@"==(S?t.charAt(0):t[0]))return t.slice(1);if("["==t){for(e=[];t=H(),"]"!=t;r||(r=!0))r&&(","==t?(t=H(),"]"==t&&I()):I()),","==t&&I(),e.push(z(t));return e}if("{"==t){for(e={};t=H(),"}"!=t;r||(r=!0))r&&(","==t?(t=H(),"}"==t&&I()):I()),","!=t&&"string"==typeof t&&"@"==(S?t.charAt(0):t[0])&&":"==H()||I(),e[t.slice(1)]=z(H());return e}I()}return t},J=function(t,e,r){var n=X(t,e,r);n===g?delete t[e]:t[e]=n},X=function(t,e,r){var n,o=t[e];if("object"==typeof o&&o)if(v.call(o)==C)for(n=o.length;n--;)J(o,n,r);else y(o,function(t){J(o,t,r)});return r.call(t,e,o)};e.parse=function(t,e){var r,n;return q=0,U=""+t,r=z(H()),"$"!=H()&&I(),q=U=null,e&&v.call(e)==w?X((n={},n[""]=r,n),"",e):r}}}return e.runInContext=o,e}var i="function"==typeof n&&n.amd,s={function:!0,object:!0},a=s[typeof e]&&e&&!e.nodeType&&e,c=s[typeof window]&&window||this,u=a&&s[typeof t]&&t&&!t.nodeType&&"object"==typeof r&&r;if(!u||u.global!==u&&u.window!==u&&u.self!==u||(c=u),a&&!i)o(c,a);else{var h=c.JSON,p=c.JSON3,f=!1,l=o(c,c.JSON3={noConflict:function(){return f||(f=!0,c.JSON=h,c.JSON3=p,h=p=null),l}});c.JSON={parse:l.parse,stringify:l.stringify}}i&&n(function(){return l})}).call(this)}).call(e,r(12)(t),function(){return this}())},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e){function r(t){if(t)return n(t)}function n(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}t.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks[t]=this._callbacks[t]||[]).push(e),this},r.prototype.once=function(t,e){function r(){n.off(t,r),e.apply(this,arguments)}var n=this;return this._callbacks=this._callbacks||{},r.fn=e,this.on(t,r),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var r=this._callbacks[t];if(!r)return this;if(1==arguments.length)return delete this._callbacks[t],this;for(var n,o=0;o<r.length;o++)if(n=r[o],n===e||n.fn===e){r.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),r=this._callbacks[t];if(r){r=r.slice(0);for(var n=0,o=r.length;n<o;++n)r[n].apply(this,e)}return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks[t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,r){(function(t){var n=r(15),o=r(16);e.deconstructPacket=function(t){function e(t){if(!t)return t;if(o(t)){var i={_placeholder:!0,num:r.length};return r.push(t),i}if(n(t)){for(var s=new Array(t.length),a=0;a<t.length;a++)s[a]=e(t[a]);return s}if("object"==typeof t&&!(t instanceof Date)){var s={};for(var c in t)s[c]=e(t[c]);return s}return t}var r=[],i=t.data,s=t;return s.data=e(i),s.attachments=r.length,{packet:s,buffers:r}},e.reconstructPacket=function(t,e){function r(t){if(t&&t._placeholder){var o=e[t.num];return o}if(n(t)){for(var i=0;i<t.length;i++)t[i]=r(t[i]);return t}if(t&&"object"==typeof t){for(var s in t)t[s]=r(t[s]);return t}return t}return t.data=r(t.data),t.attachments=void 0,t},e.removeBlobs=function(e,r){function i(e,c,u){if(!e)return e;if(t.Blob&&e instanceof Blob||t.File&&e instanceof File){s++;var h=new FileReader;h.onload=function(){u?u[c]=this.result:a=this.result,--s||r(a)},h.readAsArrayBuffer(e)}else if(n(e))for(var p=0;p<e.length;p++)i(e[p],p,e);else if(e&&"object"==typeof e&&!o(e))for(var f in e)i(e[f],f,e)}var s=0,a=e;i(a),s||r(a)}}).call(e,function(){return this}())},function(t,e){t.exports=Array.isArray||function(t){return"[object Array]"==Object.prototype.toString.call(t)}},function(t,e){(function(e){function r(t){return e.Buffer&&e.Buffer.isBuffer(t)||e.ArrayBuffer&&t instanceof ArrayBuffer}t.exports=r}).call(e,function(){return this}())},function(t,e,r){"use strict";function n(t,e){return this instanceof n?(t&&"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new l({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[],this.encoder=new c.Encoder,this.decoder=new c.Decoder,this.autoConnect=e.autoConnect!==!1,void(this.autoConnect&&this.open())):new n(t,e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(18),s=r(44),a=r(35),c=r(7),u=r(46),h=r(47),p=r(3)("socket.io-client:manager"),f=r(42),l=r(48),d=Object.prototype.hasOwnProperty;t.exports=n,n.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)d.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},n.prototype.updateSocketIds=function(){for(var t in this.nsps)d.call(this.nsps,t)&&(this.nsps[t].id=this.engine.id)},a(n.prototype),n.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},n.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},n.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},n.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},n.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},n.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},n.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},n.prototype.open=n.prototype.connect=function(t,e){if(p("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this;p("opening %s",this.uri),this.engine=i(this.uri,this.opts);var r=this.engine,n=this;this.readyState="opening",this.skipReconnect=!1;var o=u(r,"open",function(){n.onopen(),t&&t()}),s=u(r,"error",function(e){if(p("connect_error"),n.cleanup(),n.readyState="closed",n.emitAll("connect_error",e),t){var r=new Error("Connection error");r.data=e,t(r)}else n.maybeReconnectOnOpen()});if(!1!==this._timeout){var a=this._timeout;p("connect attempt will timeout after %d",a);var c=setTimeout(function(){p("connect attempt timed out after %d",a),o.destroy(),r.close(),r.emit("error","timeout"),n.emitAll("connect_timeout",a)},a);this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(o),this.subs.push(s),this},n.prototype.onopen=function(){p("open"),this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(u(t,"data",h(this,"ondata"))),this.subs.push(u(t,"ping",h(this,"onping"))),this.subs.push(u(t,"pong",h(this,"onpong"))),this.subs.push(u(t,"error",h(this,"onerror"))),this.subs.push(u(t,"close",h(this,"onclose"))),this.subs.push(u(this.decoder,"decoded",h(this,"ondecoded")))},n.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},n.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},n.prototype.ondata=function(t){this.decoder.add(t)},n.prototype.ondecoded=function(t){this.emit("packet",t)},n.prototype.onerror=function(t){p("error",t),this.emitAll("error",t)},n.prototype.socket=function(t,e){function r(){~f(o.connecting,n)||o.connecting.push(n)}var n=this.nsps[t];if(!n){n=new s(this,t,e),this.nsps[t]=n;var o=this;n.on("connecting",r),n.on("connect",function(){n.id=o.engine.id}),this.autoConnect&&r()}return n},n.prototype.destroy=function(t){var e=f(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},n.prototype.packet=function(t){p("writing packet %j",t);var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(r){for(var n=0;n<r.length;n++)e.engine.write(r[n],t.options);e.encoding=!1,e.processPacketQueue()}))},n.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},n.prototype.cleanup=function(){p("cleanup");for(var t=this.subs.length,e=0;e<t;e++){var r=this.subs.shift();r.destroy()}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},n.prototype.close=n.prototype.disconnect=function(){p("disconnect"),this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},n.prototype.onclose=function(t){p("onclose"),this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},n.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)p("reconnect failed"),this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();p("will wait %dms before reconnect attempt",e),this.reconnecting=!0;var r=setTimeout(function(){t.skipReconnect||(p("attempting reconnect"),t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(p("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):(p("reconnect success"),t.onreconnect())}))},e);this.subs.push({destroy:function(){clearTimeout(r)}})}},n.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)}},function(t,e,r){t.exports=r(19)},function(t,e,r){t.exports=r(20),t.exports.parser=r(27)},function(t,e,r){(function(e){function n(t,r){if(!(this instanceof n))return new n(t,r);r=r||{},t&&"object"==typeof t&&(r=t,t=null),t?(t=h(t),r.hostname=t.host,r.secure="https"===t.protocol||"wss"===t.protocol,r.port=t.port,t.query&&(r.query=t.query)):r.host&&(r.hostname=h(r.host).host),
this.secure=null!=r.secure?r.secure:e.location&&"https:"===location.protocol,r.hostname&&!r.port&&(r.port=this.secure?"443":"80"),this.agent=r.agent||!1,this.hostname=r.hostname||(e.location?location.hostname:"localhost"),this.port=r.port||(e.location&&location.port?location.port:this.secure?443:80),this.query=r.query||{},"string"==typeof this.query&&(this.query=f.decode(this.query)),this.upgrade=!1!==r.upgrade,this.path=(r.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!r.forceJSONP,this.jsonp=!1!==r.jsonp,this.forceBase64=!!r.forceBase64,this.enablesXDR=!!r.enablesXDR,this.timestampParam=r.timestampParam||"t",this.timestampRequests=r.timestampRequests,this.transports=r.transports||["polling","websocket"],this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=r.policyPort||843,this.rememberUpgrade=r.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=r.onlyBinaryUpgrades,this.perMessageDeflate=!1!==r.perMessageDeflate&&(r.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=r.pfx||null,this.key=r.key||null,this.passphrase=r.passphrase||null,this.cert=r.cert||null,this.ca=r.ca||null,this.ciphers=r.ciphers||null,this.rejectUnauthorized=void 0===r.rejectUnauthorized?null:r.rejectUnauthorized,this.forceNode=!!r.forceNode;var o="object"==typeof e&&e;o.global===o&&(r.extraHeaders&&Object.keys(r.extraHeaders).length>0&&(this.extraHeaders=r.extraHeaders),r.localAddress&&(this.localAddress=r.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,this.open()}function o(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e}var i=r(21),s=r(35),a=r(3)("engine.io-client:socket"),c=r(42),u=r(27),h=r(2),p=r(43),f=r(36);t.exports=n,n.priorWebsocketSuccess=!1,s(n.prototype),n.protocol=u.protocol,n.Socket=n,n.Transport=r(26),n.transports=r(21),n.parser=r(27),n.prototype.createTransport=function(t){a('creating transport "%s"',t);var e=o(this.query);e.EIO=u.protocol,e.transport=t,this.id&&(e.sid=this.id);var r=new i[t]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:e,forceJSONP:this.forceJSONP,jsonp:this.jsonp,forceBase64:this.forceBase64,enablesXDR:this.enablesXDR,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,policyPort:this.policyPort,socket:this,pfx:this.pfx,key:this.key,passphrase:this.passphrase,cert:this.cert,ca:this.ca,ciphers:this.ciphers,rejectUnauthorized:this.rejectUnauthorized,perMessageDeflate:this.perMessageDeflate,extraHeaders:this.extraHeaders,forceNode:this.forceNode,localAddress:this.localAddress});return r},n.prototype.open=function(){var t;if(this.rememberUpgrade&&n.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1)t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout(function(){e.emit("error","No transports available")},0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(t){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)},n.prototype.setTransport=function(t){a("setting transport %s",t.name);var e=this;this.transport&&(a("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},n.prototype.probe=function(t){function e(){if(f.onlyBinaryUpgrades){var e=!this.supportsBinary&&f.transport.supportsBinary;p=p||e}p||(a('probe transport "%s" opened',t),h.send([{type:"ping",data:"probe"}]),h.once("packet",function(e){if(!p)if("pong"===e.type&&"probe"===e.data){if(a('probe transport "%s" pong',t),f.upgrading=!0,f.emit("upgrading",h),!h)return;n.priorWebsocketSuccess="websocket"===h.name,a('pausing current transport "%s"',f.transport.name),f.transport.pause(function(){p||"closed"!==f.readyState&&(a("changing transport and sending upgrade packet"),u(),f.setTransport(h),h.send([{type:"upgrade"}]),f.emit("upgrade",h),h=null,f.upgrading=!1,f.flush())})}else{a('probe transport "%s" failed',t);var r=new Error("probe error");r.transport=h.name,f.emit("upgradeError",r)}}))}function r(){p||(p=!0,u(),h.close(),h=null)}function o(e){var n=new Error("probe error: "+e);n.transport=h.name,r(),a('probe transport "%s" failed because of error: %s',t,e),f.emit("upgradeError",n)}function i(){o("transport closed")}function s(){o("socket closed")}function c(t){h&&t.name!==h.name&&(a('"%s" works - aborting "%s"',t.name,h.name),r())}function u(){h.removeListener("open",e),h.removeListener("error",o),h.removeListener("close",i),f.removeListener("close",s),f.removeListener("upgrading",c)}a('probing transport "%s"',t);var h=this.createTransport(t,{probe:1}),p=!1,f=this;n.priorWebsocketSuccess=!1,h.once("open",e),h.once("error",o),h.once("close",i),this.once("close",s),this.once("upgrading",c),h.open()},n.prototype.onOpen=function(){if(a("socket open"),this.readyState="open",n.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause){a("starting upgrade probes");for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t])}},n.prototype.onPacket=function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(a('socket receive: type "%s", data "%s"',t.type,t.data),this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(p(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}else a('packet received with socket readyState "%s"',this.readyState)},n.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},n.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!==e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},n.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){a("writing ping packet - expecting pong within %sms",t.pingTimeout),t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},n.prototype.ping=function(){var t=this;this.sendPacket("ping",function(){t.emit("ping")})},n.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},n.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(a("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},n.prototype.write=n.prototype.send=function(t,e,r){return this.sendPacket("message",t,e,r),this},n.prototype.sendPacket=function(t,e,r,n){if("function"==typeof e&&(n=e,e=void 0),"function"==typeof r&&(n=r,r=null),"closing"!==this.readyState&&"closed"!==this.readyState){r=r||{},r.compress=!1!==r.compress;var o={type:t,data:e,options:r};this.emit("packetCreate",o),this.writeBuffer.push(o),n&&this.once("flush",n),this.flush()}},n.prototype.close=function(){function t(){n.onClose("forced close"),a("socket closing - telling transport to close"),n.transport.close()}function e(){n.removeListener("upgrade",e),n.removeListener("upgradeError",e),t()}function r(){n.once("upgrade",e),n.once("upgradeError",e)}if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var n=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?r():t()}):this.upgrading?r():t()}return this},n.prototype.onError=function(t){a("socket error %j",t),n.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},n.prototype.onClose=function(t,e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){a('socket close with reason: "%s"',t);var r=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),r.writeBuffer=[],r.prevBufferLen=0}},n.prototype.filterUpgrades=function(t){for(var e=[],r=0,n=t.length;r<n;r++)~c(this.transports,t[r])&&e.push(t[r]);return e}}).call(e,function(){return this}())},function(t,e,r){(function(t){function n(e){var r,n=!1,a=!1,c=!1!==e.jsonp;if(t.location){var u="https:"===location.protocol,h=location.port;h||(h=u?443:80),n=e.hostname!==location.hostname||h!==e.port,a=e.secure!==u}if(e.xdomain=n,e.xscheme=a,r=new o(e),"open"in r&&!e.forceJSONP)return new i(e);if(!c)throw new Error("JSONP disabled");return new s(e)}var o=r(22),i=r(24),s=r(39),a=r(40);e.polling=n,e.websocket=a}).call(e,function(){return this}())},function(t,e,r){(function(e){var n=r(23);t.exports=function(t){var r=t.xdomain,o=t.xscheme,i=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!r||n))return new XMLHttpRequest}catch(t){}try{if("undefined"!=typeof XDomainRequest&&!o&&i)return new XDomainRequest}catch(t){}if(!r)try{return new(e[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(t){}}}).call(e,function(){return this}())},function(t,e){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(e){t.exports=!1}},function(t,e,r){(function(e){function n(){}function o(t){if(c.call(this,t),this.requestTimeout=t.requestTimeout,e.location){var r="https:"===location.protocol,n=location.port;n||(n=r?443:80),this.xd=t.hostname!==e.location.hostname||n!==t.port,this.xs=t.secure!==r}else this.extraHeaders=t.extraHeaders}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort()}var a=r(22),c=r(25),u=r(35),h=r(37),p=r(3)("engine.io-client:polling-xhr");t.exports=o,t.exports.Request=i,h(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new i(t)},o.prototype.doWrite=function(t,e){var r="string"!=typeof t&&void 0!==t,n=this.request({method:"POST",data:t,isBinary:r}),o=this;n.on("success",e),n.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=n},o.prototype.doPoll=function(){p("xhr poll");var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},u(i.prototype),i.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var r=this.xhr=new a(t),n=this;try{p("xhr open %s: %s",this.method,this.uri),r.open(this.method,this.uri,this.async);try{if(this.extraHeaders){r.setDisableHeaderCheck(!0);for(var o in this.extraHeaders)this.extraHeaders.hasOwnProperty(o)&&r.setRequestHeader(o,this.extraHeaders[o])}}catch(t){}if(this.supportsBinary&&(r.responseType="arraybuffer"),"POST"===this.method)try{this.isBinary?r.setRequestHeader("Content-type","application/octet-stream"):r.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(t){}try{r.setRequestHeader("Accept","*/*")}catch(t){}"withCredentials"in r&&(r.withCredentials=!0),this.requestTimeout&&(r.timeout=this.requestTimeout),this.hasXDR()?(r.onload=function(){n.onLoad()},r.onerror=function(){n.onError(r.responseText)}):r.onreadystatechange=function(){4===r.readyState&&(200===r.status||1223===r.status?n.onLoad():setTimeout(function(){n.onError(r.status)},0))},p("xhr data %s",this.data),r.send(this.data)}catch(t){return void setTimeout(function(){n.onError(t)},0)}e.document&&(this.index=i.requestsCount++,i.requests[this.index]=this)},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},i.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},i.prototype.cleanup=function(t){if("undefined"!=typeof this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=n:this.xhr.onreadystatechange=n,t)try{this.xhr.abort()}catch(t){}e.document&&delete i.requests[this.index],this.xhr=null}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type").split(";")[0]}catch(t){}if("application/octet-stream"===e)t=this.xhr.response||this.xhr.responseText;else if(this.supportsBinary)try{t=String.fromCharCode.apply(null,new Uint8Array(this.xhr.response))}catch(e){for(var r=new Uint8Array(this.xhr.response),n=[],o=0,i=r.length;o<i;o++)n.push(r[o]);t=String.fromCharCode.apply(null,n)}else t=this.xhr.responseText}catch(t){this.onError(t)}null!=t&&this.onData(t)},i.prototype.hasXDR=function(){return"undefined"!=typeof e.XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup()},i.requestsCount=0,i.requests={},e.document&&(e.attachEvent?e.attachEvent("onunload",s):e.addEventListener&&e.addEventListener("beforeunload",s,!1))}).call(e,function(){return this}())},function(t,e,r){function n(t){var e=t&&t.forceBase64;h&&!e||(this.supportsBinary=!1),o.call(this,t)}var o=r(26),i=r(36),s=r(27),a=r(37),c=r(38),u=r(3)("engine.io-client:polling");t.exports=n;var h=function(){var t=r(22),e=new t({xdomain:!1});return null!=e.responseType}();a(n,o),n.prototype.name="polling",n.prototype.doOpen=function(){this.poll()},n.prototype.pause=function(t){function e(){u("paused"),r.readyState="paused",t()}var r=this;if(this.readyState="pausing",this.polling||!this.writable){var n=0;this.polling&&(u("we are currently polling - waiting to pause"),n++,this.once("pollComplete",function(){u("pre-pause polling complete"),--n||e()})),this.writable||(u("we are currently writing - waiting to pause"),n++,this.once("drain",function(){u("pre-pause writing complete"),--n||e()}))}else e()},n.prototype.poll=function(){u("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},n.prototype.onData=function(t){var e=this;u("polling got data %s",t);var r=function(t,r,n){return"opening"===e.readyState&&e.onOpen(),"close"===t.type?(e.onClose(),!1):void e.onPacket(t)};s.decodePayload(t,this.socket.binaryType,r),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState?this.poll():u('ignoring poll - transport state "%s"',this.readyState))},n.prototype.doClose=function(){function t(){u("writing close packet"),e.write([{type:"close"}])}var e=this;"open"===this.readyState?(u("transport open - closing"),t()):(u("transport not open - deferring close"),this.once("open",t))},n.prototype.write=function(t){var e=this;this.writable=!1;var r=function(){e.writable=!0,e.emit("drain")};s.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,r)})},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",r="";!1!==this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||t.sid||(t.b64=1),t=i.encode(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(r=":"+this.port),t.length&&(t="?"+t);var n=this.hostname.indexOf(":")!==-1;return e+"://"+(n?"["+this.hostname+"]":this.hostname)+r+this.path+t}},function(t,e,r){function n(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress}var o=r(27),i=r(35);t.exports=n,i(n.prototype),n.prototype.onError=function(t,e){var r=new Error(t);return r.type="TransportError",r.description=e,this.emit("error",r),this},n.prototype.open=function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},n.prototype.close=function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},n.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");this.write(t)},n.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},n.prototype.onData=function(t){var e=o.decodePacket(t,this.socket.binaryType);this.onPacket(e)},n.prototype.onPacket=function(t){this.emit("packet",t)},n.prototype.onClose=function(){this.readyState="closed",this.emit("close")}},function(t,e,r){(function(t){function n(t,r){var n="b"+e.packets[t.type]+t.data.data;return r(n)}function o(t,r,n){if(!r)return e.encodeBase64Packet(t,n);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=v[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return n(s.buffer)}function i(t,r,n){if(!r)return e.encodeBase64Packet(t,n);var o=new FileReader;return o.onload=function(){t.data=o.result,e.encodePacket(t,r,!0,n)},o.readAsArrayBuffer(t.data)}function s(t,r,n){if(!r)return e.encodeBase64Packet(t,n);if(m)return i(t,r,n);var o=new Uint8Array(1);o[0]=v[t.type];var s=new k([o.buffer,t.data]);return n(s)}function a(t){try{t=d.decode(t)}catch(t){return!1}return t}function c(t,e,r){for(var n=new Array(t.length),o=l(t.length,r),i=function(t,r,o){e(r,function(e,r){n[t]=r,o(e,n)})},s=0;s<t.length;s++)i(s,t[s],o)}var u,h=r(28),p=r(29),f=r(30),l=r(31),d=r(32);t&&t.ArrayBuffer&&(u=r(33));var y="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),g="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),m=y||g;e.protocol=3;var v=e.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},b=h(v),w={type:"error",data:"parser error"},k=r(34);e.encodePacket=function(e,r,i,a){"function"==typeof r&&(a=r,r=!1),"function"==typeof i&&(a=i,i=null);var c=void 0===e.data?void 0:e.data.buffer||e.data;if(t.ArrayBuffer&&c instanceof ArrayBuffer)return o(e,r,a);if(k&&c instanceof t.Blob)return s(e,r,a);if(c&&c.base64)return n(e,a);var u=v[e.type];return void 0!==e.data&&(u+=i?d.encode(String(e.data)):String(e.data)),a(""+u)},e.encodeBase64Packet=function(r,n){var o="b"+e.packets[r.type];if(k&&r.data instanceof t.Blob){var i=new FileReader;return i.onload=function(){var t=i.result.split(",")[1];n(o+t)},i.readAsDataURL(r.data)}var s;try{s=String.fromCharCode.apply(null,new Uint8Array(r.data))}catch(t){for(var a=new Uint8Array(r.data),c=new Array(a.length),u=0;u<a.length;u++)c[u]=a[u];s=String.fromCharCode.apply(null,c)}return o+=t.btoa(s),n(o)},e.decodePacket=function(t,r,n){if(void 0===t)return w;if("string"==typeof t){if("b"==t.charAt(0))return e.decodeBase64Packet(t.substr(1),r);if(n&&(t=a(t),t===!1))return w;var o=t.charAt(0);return Number(o)==o&&b[o]?t.length>1?{type:b[o],data:t.substring(1)}:{type:b[o]}:w}var i=new Uint8Array(t),o=i[0],s=f(t,1);return k&&"blob"===r&&(s=new k([s])),{type:b[o],data:s}},e.decodeBase64Packet=function(t,e){var r=b[t.charAt(0)];if(!u)return{type:r,data:{base64:!0,data:t.substr(1)}};var n=u.decode(t.substr(1));return"blob"===e&&k&&(n=new k([n])),{type:r,data:n}},e.encodePayload=function(t,r,n){function o(t){return t.length+":"+t}function i(t,n){e.encodePacket(t,!!s&&r,!0,function(t){n(null,o(t))})}"function"==typeof r&&(n=r,r=null);var s=p(t);return r&&s?k&&!m?e.encodePayloadAsBlob(t,n):e.encodePayloadAsArrayBuffer(t,n):t.length?void c(t,i,function(t,e){return n(e.join(""))}):n("0:")},e.decodePayload=function(t,r,n){if("string"!=typeof t)return e.decodePayloadAsBinary(t,r,n);"function"==typeof r&&(n=r,r=null);var o;if(""==t)return n(w,0,1);for(var i,s,a="",c=0,u=t.length;c<u;c++){var h=t.charAt(c);if(":"!=h)a+=h;else{if(""==a||a!=(i=Number(a)))return n(w,0,1);if(s=t.substr(c+1,i),a!=s.length)return n(w,0,1);if(s.length){if(o=e.decodePacket(s,r,!0),w.type==o.type&&w.data==o.data)return n(w,0,1);var p=n(o,c+i,u);if(!1===p)return}c+=i,a=""}}return""!=a?n(w,0,1):void 0},e.encodePayloadAsArrayBuffer=function(t,r){function n(t,r){e.encodePacket(t,!0,!0,function(t){return r(null,t)})}return t.length?void c(t,n,function(t,e){var n=e.reduce(function(t,e){var r;return r="string"==typeof e?e.length:e.byteLength,t+r.toString().length+r+2},0),o=new Uint8Array(n),i=0;return e.forEach(function(t){var e="string"==typeof t,r=t;if(e){for(var n=new Uint8Array(t.length),s=0;s<t.length;s++)n[s]=t.charCodeAt(s);r=n.buffer}e?o[i++]=0:o[i++]=1;for(var a=r.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var n=new Uint8Array(r),s=0;s<n.length;s++)o[i++]=n[s]}),r(o.buffer)}):r(new ArrayBuffer(0))},e.encodePayloadAsBlob=function(t,r){function n(t,r){e.encodePacket(t,!0,!0,function(t){var e=new Uint8Array(1);if(e[0]=1,"string"==typeof t){for(var n=new Uint8Array(t.length),o=0;o<t.length;o++)n[o]=t.charCodeAt(o);t=n.buffer,e[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,k){var c=new k([e.buffer,a.buffer,t]);r(null,c)}})}c(t,n,function(t,e){return r(new k(e))})},e.decodePayloadAsBinary=function(t,r,n){"function"==typeof r&&(n=r,r=null);for(var o=t,i=[],s=!1;o.byteLength>0;){for(var a=new Uint8Array(o),c=0===a[0],u="",h=1;255!=a[h];h++){if(u.length>310){s=!0;break}u+=a[h]}if(s)return n(w,0,1);o=f(o,2+u.length),u=parseInt(u);var p=f(o,0,u);if(c)try{p=String.fromCharCode.apply(null,new Uint8Array(p))}catch(t){var l=new Uint8Array(p);p="";for(var h=0;h<l.length;h++)p+=String.fromCharCode(l[h])}i.push(p),o=f(o,u)}var d=i.length;i.forEach(function(t,o){n(e.decodePacket(t,r,!0),o,d)})}}).call(e,function(){return this}())},function(t,e){t.exports=Object.keys||function(t){var e=[],r=Object.prototype.hasOwnProperty;for(var n in t)r.call(t,n)&&e.push(n);return e}},function(t,e,r){(function(e){function n(t){function r(t){if(!t)return!1;if(e.Buffer&&e.Buffer.isBuffer&&e.Buffer.isBuffer(t)||e.ArrayBuffer&&t instanceof ArrayBuffer||e.Blob&&t instanceof Blob||e.File&&t instanceof File)return!0;if(o(t)){for(var n=0;n<t.length;n++)if(r(t[n]))return!0}else if(t&&"object"==typeof t){t.toJSON&&"function"==typeof t.toJSON&&(t=t.toJSON());for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&r(t[i]))return!0}return!1}return r(t)}var o=r(15);t.exports=n}).call(e,function(){return this}())},function(t,e){t.exports=function(t,e,r){var n=t.byteLength;if(e=e||0,r=r||n,t.slice)return t.slice(e,r);if(e<0&&(e+=n),r<0&&(r+=n),r>n&&(r=n),e>=n||e>=r||0===n)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(r-e),s=e,a=0;s<r;s++,a++)i[a]=o[s];return i.buffer}},function(t,e){function r(t,e,r){function o(t,n){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(i=!0,e(t),e=r):0!==o.count||i||e(null,n)}var i=!1;return r=r||n,o.count=t,0===t?e():o}function n(){}t.exports=r},function(t,e,r){var n;(function(t,o){!function(i){function s(t){for(var e,r,n=[],o=0,i=t.length;o<i;)e=t.charCodeAt(o++),e>=55296&&e<=56319&&o<i?(r=t.charCodeAt(o++),56320==(64512&r)?n.push(((1023&e)<<10)+(1023&r)+65536):(n.push(e),o--)):n.push(e);return n}function a(t){for(var e,r=t.length,n=-1,o="";++n<r;)e=t[n],e>65535&&(e-=65536,o+=b(e>>>10&1023|55296),e=56320|1023&e),o+=b(e);return o}function c(t,e){return b(t>>e&63|128)}function u(t){if(0==(4294967168&t))return b(t);var e="";return 0==(4294965248&t)?e=b(t>>6&31|192):0==(4294901760&t)?(e=b(t>>12&15|224),e+=c(t,6)):0==(4292870144&t)&&(e=b(t>>18&7|240),e+=c(t,12),e+=c(t,6)),e+=b(63&t|128)}function h(t){for(var e,r=s(t),n=r.length,o=-1,i="";++o<n;)e=r[o],i+=u(e);return i}function p(){if(v>=m)throw Error("Invalid byte index");var t=255&g[v];if(v++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function f(){var t,e,r,n,o;if(v>m)throw Error("Invalid byte index");if(v==m)return!1;if(t=255&g[v],v++,0==(128&t))return t;if(192==(224&t)){var e=p();if(o=(31&t)<<6|e,o>=128)return o;throw Error("Invalid continuation byte")}if(224==(240&t)){if(e=p(),r=p(),o=(15&t)<<12|e<<6|r,o>=2048)return o;throw Error("Invalid continuation byte")}if(240==(248&t)&&(e=p(),r=p(),n=p(),o=(15&t)<<18|e<<12|r<<6|n,o>=65536&&o<=1114111))return o;throw Error("Invalid WTF-8 detected")}function l(t){g=s(t),m=g.length,v=0;for(var e,r=[];(e=f())!==!1;)r.push(e);return a(r)}var d="object"==typeof e&&e,y=("object"==typeof t&&t&&t.exports==d&&t,"object"==typeof o&&o);y.global!==y&&y.window!==y||(i=y);var g,m,v,b=String.fromCharCode,w={version:"1.0.0",encode:h,decode:l};n=function(){return w}.call(e,r,e,t),!(void 0!==n&&(t.exports=n))}(this)}).call(e,r(12)(t),function(){return this}())},function(t,e){!function(){"use strict";for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r=new Uint8Array(256),n=0;n<t.length;n++)r[t.charCodeAt(n)]=n;e.encode=function(e){var r,n=new Uint8Array(e),o=n.length,i="";for(r=0;r<o;r+=3)i+=t[n[r]>>2],i+=t[(3&n[r])<<4|n[r+1]>>4],i+=t[(15&n[r+1])<<2|n[r+2]>>6],i+=t[63&n[r+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},e.decode=function(t){var e,n,o,i,s,a=.75*t.length,c=t.length,u=0;"="===t[t.length-1]&&(a--,"="===t[t.length-2]&&a--);var h=new ArrayBuffer(a),p=new Uint8Array(h);for(e=0;e<c;e+=4)n=r[t.charCodeAt(e)],o=r[t.charCodeAt(e+1)],i=r[t.charCodeAt(e+2)],s=r[t.charCodeAt(e+3)],p[u++]=n<<2|o>>4,p[u++]=(15&o)<<4|i>>2,p[u++]=(3&i)<<6|63&s;return h}}()},function(t,e){(function(e){function r(t){for(var e=0;e<t.length;e++){var r=t[e];if(r.buffer instanceof ArrayBuffer){var n=r.buffer;if(r.byteLength!==n.byteLength){var o=new Uint8Array(r.byteLength);o.set(new Uint8Array(n,r.byteOffset,r.byteLength)),n=o.buffer}t[e]=n}}}function n(t,e){e=e||{};var n=new i;r(t);for(var o=0;o<t.length;o++)n.append(t[o]);return e.type?n.getBlob(e.type):n.getBlob()}function o(t,e){return r(t),new Blob(t,e||{})}var i=e.BlobBuilder||e.WebKitBlobBuilder||e.MSBlobBuilder||e.MozBlobBuilder,s=function(){try{var t=new Blob(["hi"]);return 2===t.size}catch(t){return!1}}(),a=s&&function(){try{var t=new Blob([new Uint8Array([1,2])]);return 2===t.size}catch(t){return!1}}(),c=i&&i.prototype.append&&i.prototype.getBlob;t.exports=function(){return s?a?e.Blob:o:c?n:void 0}()}).call(e,function(){return this}())},function(t,e,r){function n(t){if(t)return o(t)}function o(t){for(var e in n.prototype)t[e]=n.prototype[e];return t}t.exports=n,n.prototype.on=n.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},n.prototype.once=function(t,e){function r(){this.off(t,r),e.apply(this,arguments)}return r.fn=e,this.on(t,r),this},n.prototype.off=n.prototype.removeListener=n.prototype.removeAllListeners=n.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var n,o=0;o<r.length;o++)if(n=r[o],n===e||n.fn===e){r.splice(o,1);break}return this},n.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),r=this._callbacks["$"+t];if(r){r=r.slice(0);for(var n=0,o=r.length;n<o;++n)r[n].apply(this,e)}return this},n.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},n.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e){e.encode=function(t){var e="";for(var r in t)t.hasOwnProperty(r)&&(e.length&&(e+="&"),e+=encodeURIComponent(r)+"="+encodeURIComponent(t[r]));return e},e.decode=function(t){for(var e={},r=t.split("&"),n=0,o=r.length;n<o;n++){var i=r[n].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},function(t,e){t.exports=function(t,e){var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}},function(t,e){"use strict";function r(t){var e="";do e=s[t%a]+e,t=Math.floor(t/a);while(t>0);return e}function n(t){var e=0;for(h=0;h<t.length;h++)e=e*a+c[t.charAt(h)];return e}function o(){var t=r(+new Date);return t!==i?(u=0,i=t):t+"."+r(u++)}for(var i,s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),a=64,c={},u=0,h=0;h<a;h++)c[s[h]]=h;o.encode=r,o.decode=n,t.exports=o},function(t,e,r){(function(e){function n(){}function o(t){i.call(this,t),this.query=this.query||{},a||(e.___eio||(e.___eio=[]),a=e.___eio),this.index=a.length;var r=this;a.push(function(t){r.onData(t)}),this.query.j=this.index,e.document&&e.addEventListener&&e.addEventListener("beforeunload",function(){r.script&&(r.script.onerror=n)},!1)}var i=r(25),s=r(37);t.exports=o;var a,c=/\n/g,u=/\\n/g;s(o,i),o.prototype.supportsBinary=!1,o.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),i.prototype.doClose.call(this)},o.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var r=document.getElementsByTagName("script")[0];r?r.parentNode.insertBefore(e,r):(document.head||document.body).appendChild(e),this.script=e;var n="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);n&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)},100)},o.prototype.doWrite=function(t,e){function r(){n(),e()}function n(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var t='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(t)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),h=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=h,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),n(),t=t.replace(u,"\\\n"),this.area.value=t.replace(c,"\\n");try{this.form.submit()}catch(t){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===o.iframe.readyState&&r();
}:this.iframe.onload=r}}).call(e,function(){return this}())},function(t,e,r){(function(e){function n(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,this.usingBrowserWebSocket=p&&!t.forceNode,this.usingBrowserWebSocket||(f=o),i.call(this,t)}var o,i=r(26),s=r(27),a=r(36),c=r(37),u=r(38),h=r(3)("engine.io-client:websocket"),p=e.WebSocket||e.MozWebSocket;if("undefined"==typeof window)try{o=r(41)}catch(t){}var f=p;f||"undefined"!=typeof window||(f=o),t.exports=n,c(n,i),n.prototype.name="websocket",n.prototype.supportsBinary=!0,n.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=void 0,r={agent:this.agent,perMessageDeflate:this.perMessageDeflate};r.pfx=this.pfx,r.key=this.key,r.passphrase=this.passphrase,r.cert=this.cert,r.ca=this.ca,r.ciphers=this.ciphers,r.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(r.headers=this.extraHeaders),this.localAddress&&(r.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket?new f(t):new f(t,e,r)}catch(t){return this.emit("error",t)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},n.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},n.prototype.write=function(t){function r(){n.emit("flush"),setTimeout(function(){n.writable=!0,n.emit("drain")},0)}var n=this;this.writable=!1;for(var o=t.length,i=0,a=o;i<a;i++)!function(t){s.encodePacket(t,n.supportsBinary,function(i){if(!n.usingBrowserWebSocket){var s={};if(t.options&&(s.compress=t.options.compress),n.perMessageDeflate){var a="string"==typeof i?e.Buffer.byteLength(i):i.length;a<n.perMessageDeflate.threshold&&(s.compress=!1)}}try{n.usingBrowserWebSocket?n.ws.send(i):n.ws.send(i,s)}catch(t){h("websocket closed before onclose event")}--o||r()})}(t[i])},n.prototype.onClose=function(){i.prototype.onClose.call(this)},n.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close()},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",r="";this.port&&("wss"===e&&443!==Number(this.port)||"ws"===e&&80!==Number(this.port))&&(r=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=u()),this.supportsBinary||(t.b64=1),t=a.encode(t),t.length&&(t="?"+t);var n=this.hostname.indexOf(":")!==-1;return e+"://"+(n?"["+this.hostname+"]":this.hostname)+r+this.path+t},n.prototype.check=function(){return!(!f||"__initialize"in f&&this.name===n.prototype.name)}}).call(e,function(){return this}())},function(t,e){},function(t,e){var r=[].indexOf;t.exports=function(t,e){if(r)return t.indexOf(e);for(var n=0;n<t.length;++n)if(t[n]===e)return n;return-1}},function(t,e){(function(e){var r=/^[\],:{}\s]*$/,n=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,o=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,i=/(?:^|:|,)(?:\s*\[)+/g,s=/^\s+/,a=/\s+$/;t.exports=function(t){return"string"==typeof t&&t?(t=t.replace(s,"").replace(a,""),e.JSON&&JSON.parse?JSON.parse(t):r.test(t.replace(n,"@").replace(o,"]").replace(i,""))?new Function("return "+t)():void 0):null}}).call(e,function(){return this}())},function(t,e,r){"use strict";function n(t,e,r){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,r&&r.query&&(this.query=r.query),this.io.autoConnect&&this.open()}var o=r(7),i=r(35),s=r(45),a=r(46),c=r(47),u=r(3)("socket.io-client:socket"),h=r(29);t.exports=e=n;var p={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},f=i.prototype.emit;i(n.prototype),n.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[a(t,"open",c(this,"onopen")),a(t,"packet",c(this,"onpacket")),a(t,"close",c(this,"onclose"))]}},n.prototype.open=n.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting"),this)},n.prototype.send=function(){var t=s(arguments);return t.unshift("message"),this.emit.apply(this,t),this},n.prototype.emit=function(t){if(p.hasOwnProperty(t))return f.apply(this,arguments),this;var e=s(arguments),r=o.EVENT;h(e)&&(r=o.BINARY_EVENT);var n={type:r,data:e};return n.options={},n.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(u("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),n.id=this.ids++),this.connected?this.packet(n):this.sendBuffer.push(n),delete this.flags,this},n.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},n.prototype.onopen=function(){u("transport is open - connecting"),"/"!==this.nsp&&(this.query?this.packet({type:o.CONNECT,query:this.query}):this.packet({type:o.CONNECT}))},n.prototype.onclose=function(t){u("close (%s)",t),this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},n.prototype.onpacket=function(t){if(t.nsp===this.nsp)switch(t.type){case o.CONNECT:this.onconnect();break;case o.EVENT:this.onevent(t);break;case o.BINARY_EVENT:this.onevent(t);break;case o.ACK:this.onack(t);break;case o.BINARY_ACK:this.onack(t);break;case o.DISCONNECT:this.ondisconnect();break;case o.ERROR:this.emit("error",t.data)}},n.prototype.onevent=function(t){var e=t.data||[];u("emitting event %j",e),null!=t.id&&(u("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?f.apply(this,e):this.receiveBuffer.push(e)},n.prototype.ack=function(t){var e=this,r=!1;return function(){if(!r){r=!0;var n=s(arguments);u("sending ack %j",n);var i=h(n)?o.BINARY_ACK:o.ACK;e.packet({type:i,id:t,data:n})}}},n.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e?(u("calling ack %s with %j",t.id,t.data),e.apply(this,t.data),delete this.acks[t.id]):u("bad ack %s",t.id)},n.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},n.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)f.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},n.prototype.ondisconnect=function(){u("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},n.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},n.prototype.close=n.prototype.disconnect=function(){return this.connected&&(u("performing disconnect (%s)",this.nsp),this.packet({type:o.DISCONNECT})),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},n.prototype.compress=function(t){return this.flags=this.flags||{},this.flags.compress=t,this}},function(t,e){function r(t,e){var r=[];e=e||0;for(var n=e||0;n<t.length;n++)r[n-e]=t[n];return r}t.exports=r},function(t,e){"use strict";function r(t,e,r){return t.on(e,r),{destroy:function(){t.removeListener(e,r)}}}t.exports=r},function(t,e){var r=[].slice;t.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var n=r.call(arguments,2);return function(){return e.apply(t,n.concat(r.call(arguments)))}}},function(t,e){function r(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=r,r.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),r=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-r:t+r}return 0|Math.min(t,this.max)},r.prototype.reset=function(){this.attempts=0},r.prototype.setMin=function(t){this.ms=t},r.prototype.setMax=function(t){this.max=t},r.prototype.setJitter=function(t){this.jitter=t}}])});