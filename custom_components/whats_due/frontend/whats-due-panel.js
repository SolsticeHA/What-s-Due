function t(t,e,i,s){var a,r=arguments.length,o=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(a=t[n])&&(o=(r<3?a(o):r>3?a(e,i,o):a(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),a=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=a.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,g=globalThis,m=g.trustedTypes,f=m?m.emptyScript:"",y=g.reactiveElementPolyfillSupport,v=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},_=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:a}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);a?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),a=e.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const r=a.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,a){if(void 0!==t){const r=this.constructor;if(!1===s&&(a=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??_)(a,e)||i.useDefault&&i.reflect&&a===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:a},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==a||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,y?.({ReactiveElement:x}),(g.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,C=w.trustedTypes,E=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,D="?"+S,P=`<${D}>`,T=document,O=()=>T.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,N="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,H=/>/g,R=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,j=/"/g,W=/^(?:script|style|textarea|title)$/i,q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),F=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),V=new WeakMap,Y=T.createTreeWalker(T,129);function K(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let a,r=2===e?"<svg>":3===e?"<math>":"",o=I;for(let e=0;e<i;e++){const i=t[e];let n,c,l=-1,d=0;for(;d<i.length&&(o.lastIndex=d,c=o.exec(i),null!==c);)d=o.lastIndex,o===I?"!--"===c[1]?o=M:void 0!==c[1]?o=H:void 0!==c[2]?(W.test(c[2])&&(a=RegExp("</"+c[2],"g")),o=R):void 0!==c[3]&&(o=R):o===R?">"===c[0]?(o=a??I,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,n=c[1],o=void 0===c[3]?R:'"'===c[3]?j:L):o===j||o===L?o=R:o===M||o===H?o=I:(o=R,a=void 0);const h=o===R&&t[e+1].startsWith("/>")?" ":"";r+=o===I?i+P:l>=0?(s.push(n),i.slice(0,l)+k+i.slice(l)+S+h):i+S+(-2===l?e:h)}return[K(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let a=0,r=0;const o=t.length-1,n=this.parts,[c,l]=J(t,e);if(this.el=Z.createElement(c,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Y.nextNode())&&n.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(k)){const e=l[r++],i=s.getAttribute(t).split(S),o=/([.?@])?(.*)/.exec(e);n.push({type:1,index:a,name:o[2],strings:i,ctor:"."===o[1]?et:"?"===o[1]?it:"@"===o[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(S)&&(n.push({type:6,index:a}),s.removeAttribute(t));if(W.test(s.tagName)){const t=s.textContent.split(S),e=t.length-1;if(e>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],O()),Y.nextNode(),n.push({type:2,index:++a});s.append(t[e],O())}}}else if(8===s.nodeType)if(s.data===D)n.push({type:2,index:a});else{let t=-1;for(;-1!==(t=s.data.indexOf(S,t+1));)n.push({type:7,index:a}),t+=S.length-1}a++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,s){if(e===F)return e;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const r=U(e)?void 0:e._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),void 0===r?a=void 0:(a=new r(t),a._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(e=G(t,a._$AS(t,e.values),a,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);Y.currentNode=s;let a=Y.nextNode(),r=0,o=0,n=i[0];for(;void 0!==n;){if(r===n.index){let e;2===n.type?e=new X(a,a.nextSibling,this,t):1===n.type?e=new n.ctor(a,n.name,n.strings,this,t):6===n.type&&(e=new at(a,this,t)),this._$AV.push(e),n=i[++o]}r!==n?.index&&(a=Y.nextNode(),r++)}return Y.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),U(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==B&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new Z(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const a of t)s===e.length?e.push(i=new X(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(a),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,a){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}_$AI(t,e=this,i,s){const a=this.strings;let r=!1;if(void 0===a)t=G(this,t,e,0),r=!U(t)||t!==this._$AH&&t!==F,r&&(this._$AH=t);else{const s=t;let o,n;for(t=a[0],o=0;o<a.length-1;o++)n=G(this,s[i+o],e,o),n===F&&(n=this._$AH[o]),r||=!U(n)||n!==this._$AH[o],n===B?t=B:t!==B&&(t+=(n??"")+a[o+1]),this._$AH[o]=n}r&&!s&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==B)}}class st extends tt{constructor(t,e,i,s,a){super(t,e,i,s,a),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??B)===F)return;const i=this._$AH,s=t===B&&i!==B||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==B&&(i===B||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(Z,X),(w.litHtmlVersions??=[]).push("3.3.2");const ot=globalThis;class nt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let a=s._$litPart$;if(void 0===a){const t=i?.renderBefore??null;s._$litPart$=a=new X(e.insertBefore(O(),t),t,void 0,i??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}nt._$litElement$=!0,nt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:nt});const ct=ot.litElementPolyfillSupport;ct?.({LitElement:nt}),(ot.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:_},ht=(t=dt,e,i)=>{const{kind:s,metadata:a}=i;let r=globalThis.litPropertyMetadata.get(a);if(void 0===r&&globalThis.litPropertyMetadata.set(a,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const a=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,a,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const a=this[s];e.call(this,i),this.requestUpdate(s,a,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function pt(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ut(t){return pt({...t,state:!0,attribute:!1})}const gt="whats_due";class mt{constructor(t){this.hass=t}getAll(){return this.hass.callWS({type:`${gt}/get_all`})}addItem(t){return this.hass.callWS({type:`${gt}/add_item`,...ft(t)})}updateItem(t,e){return this.hass.callWS({type:`${gt}/update_item`,item_id:t,...ft(e)})}deleteItem(t){return this.hass.callWS({type:`${gt}/delete_item`,item_id:t})}markDone(t){return this.hass.callWS({type:`${gt}/mark_done`,item_id:t})}uncompleteItem(t){return this.hass.callWS({type:`${gt}/uncomplete_item`,item_id:t})}addCategory(t){return this.hass.callWS({type:`${gt}/add_category`,...ft(t)})}updateCategory(t,e){return this.hass.callWS({type:`${gt}/update_category`,category_id:t,...ft(e)})}deleteCategory(t){return this.hass.callWS({type:`${gt}/delete_category`,category_id:t})}updateSettings(t){return this.hass.callWS({type:`${gt}/update_settings`,...ft(t)})}}function ft(t){const e={};for(const[i,s]of Object.entries(t))void 0!==s&&(e[i]=s);return e}const yt=["ha-dialog","ha-button-menu","ha-select","ha-textfield","ha-textarea","ha-icon-picker","mwc-button","mwc-list-item"];const vt={title:"What's Due",add:"Add",addItem:"Add item",editItem:"Edit item",deleteItem:"Delete",markDone:"Mark done",undo:"Undo",active:"Active",done:"Done",completedOn:"Completed",lastDoneOn:"Last done",all:"All",categories:"Categories",settings:"Settings",empty:"Nothing here yet. Tap + to add your first item.",name:"Name",dueDate:"Due date",category:"Category",icon:"Icon",notes:"Notes",recurrence:"Recurrence",recurrenceDays:"Every N days",recurrenceNone:"Does not repeat",recurrenceMonthly:"Monthly",recurrenceYearly:"Yearly",recurrenceCustom:"Custom (days)",save:"Save",cancel:"Cancel",close:"Close",daysLeft:"days left",daysOverdue:"days overdue",dueToday:"Due today",dueTomorrow:"Due tomorrow",searchPlaceholder:"Search…",confirmDelete:"Delete this item?",confirmDeleteCategory:"Delete this category? Items in it will move to 'Other'.",newCategory:"New category",color:"Color",warningDays:"Warning threshold (days)",urgentDays:"Urgent threshold (days)",criticalDays:"Critical threshold (days)",statusOk:"OK",statusWarning:"Upcoming",statusUrgent:"Soon",statusCritical:"Very soon",statusExpired:"Expired",statusCompleted:"Completed",notifications:"Notifications",notificationsEnabled:"Send notifications on status change",notificationsTargets:"Notify services",notificationsTargetsHint:"Comma-separated list of notify targets (without the 'notify.' prefix). Example: mobile_app_phone, persistent_notification",notificationsStatuses:"Notify on statuses"},$t={title:"Scadențe",add:"Adaugă",addItem:"Adaugă scadență",editItem:"Editează",deleteItem:"Șterge",markDone:"Marchează ca făcut",undo:"Anulează marcarea",active:"Active",done:"Făcute",completedOn:"Finalizat",lastDoneOn:"Ultima dată făcut",all:"Toate",categories:"Categorii",settings:"Setări",empty:"Nimic încă. Apasă + pentru a adăuga primul element.",name:"Nume",dueDate:"Data scadenței",category:"Categorie",icon:"Iconiță",notes:"Notițe",recurrence:"Recurență",recurrenceDays:"La fiecare N zile",recurrenceNone:"Nu se repetă",recurrenceMonthly:"Lunar",recurrenceYearly:"Anual",recurrenceCustom:"Personalizat (zile)",save:"Salvează",cancel:"Anulează",close:"Închide",daysLeft:"zile rămase",daysOverdue:"zile întârziere",dueToday:"Astăzi",dueTomorrow:"Mâine",searchPlaceholder:"Caută…",confirmDelete:"Ștergi acest element?",confirmDeleteCategory:"Ștergi această categorie? Elementele vor fi mutate la 'Altele'.",newCategory:"Categorie nouă",color:"Culoare",warningDays:"Prag atenționare (zile)",urgentDays:"Prag urgent (zile)",criticalDays:"Prag critic (zile)",statusOk:"OK",statusWarning:"În curând",statusUrgent:"Aproape",statusCritical:"Foarte aproape",statusExpired:"Expirat",statusCompleted:"Finalizat",notifications:"Notificări",notificationsEnabled:"Trimite notificări la schimbare de status",notificationsTargets:"Servicii notify",notificationsTargetsHint:"Listă separată prin virgulă, fără prefixul 'notify.'. Exemplu: mobile_app_telefon, persistent_notification",notificationsStatuses:"Notifică pe statusurile"};const _t=o`
  .wd-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .wd-row > * { flex: 1; }
  .wd-row > .wd-shrink { flex: 0 0 auto; }

  .wd-form {
    display: grid;
    gap: 12px;
    padding: 4px 0;
  }

  .wd-dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 0 4px;
  }

  .wd-list {
    display: flex;
    flex-direction: column;
  }

  .wd-btn {
    font: inherit;
    font-weight: 500;
    letter-spacing: 0.0892857em;
    text-transform: uppercase;
    font-size: 0.875rem;
    padding: 8px 14px;
    min-height: 36px;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: var(--primary-color);
    cursor: pointer;
    transition: background 120ms ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .wd-btn:hover { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.08); }
  .wd-btn:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .wd-btn.primary {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  .wd-btn.primary:hover { filter: brightness(1.1); }
  .wd-btn[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .wd-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .wd-field > span {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    padding-left: 2px;
  }
  .wd-field > select {
    font: inherit;
    font-size: 1rem;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, var(--primary-background-color));
    color: var(--primary-text-color);
    min-height: 44px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
  }
  .wd-field > select:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .wd-chip-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .wd-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--secondary-background-color);
    border: 1px solid var(--divider-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 100ms ease, background 100ms ease;
  }
  .wd-chip:hover { transform: translateY(-1px); }
  .wd-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: transparent;
  }
  .wd-chip ha-icon { --mdc-icon-size: 16px; }
`;let bt=class extends nt{constructor(){super(...arguments),this.label="",this.value="",this._onChange=t=>{this._emit(t.detail.value)}}render(){return t="ha-icon-picker",void 0!==customElements.get(t)?q`
        <ha-icon-picker
          .label=${this.label}
          .value=${this.value}
          @value-changed=${this._onChange}
        ></ha-icon-picker>
      `:q`
      <ha-textfield
        .label=${this.label}
        .value=${this.value}
        @input=${t=>{const e=t.target.value;this._emit(e)}}
      ></ha-textfield>
      ${this.value?q`<ha-icon .icon=${this.value}></ha-icon>`:B}
    `;var t}_emit(t){this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}};function xt(t){return{id:t.id,name:t.name,due_date:t.due_date,category_id:t.category_id,icon:t.icon,notes:t.notes??"",recurrence:t.recurrence,recurrence_days:t.recurrence_days??null}}function wt(t){const e=new Date;return{name:"",due_date:`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`,category_id:t,icon:"mdi:calendar",notes:"",recurrence:"none",recurrence_days:null}}bt.styles=o`
    :host { display: block; }
    ha-icon-picker, ha-textfield { width: 100%; }
  `,t([pt()],bt.prototype,"label",void 0),t([pt()],bt.prototype,"value",void 0),bt=t([lt("wd-icon-picker")],bt);let At=class extends nt{constructor(){super(...arguments),this.categories=[],this._cancel=()=>{this.dispatchEvent(new CustomEvent("cancel"))},this._save=()=>{this._local.name.trim()&&this._local.due_date&&this.dispatchEvent(new CustomEvent("save",{detail:this._local}))}}willUpdate(t){t.has("draft")&&this.draft&&(this._local={...this.draft})}_patch(t,e){this._local={...this._local,[t]:e},this.requestUpdate()}render(){if(!this._local)return B;const t=this.strings,e=this._local;return q`
      <ha-dialog
        open
        heading=${e.id?t.editItem:t.addItem}
        @closed=${t=>{t.detail?.action&&this._cancel()}}
      >
        <div class="wd-form">
          <ha-textfield
            .label=${t.name}
            .value=${e.name}
            required
            @input=${t=>this._patch("name",t.target.value)}
          ></ha-textfield>

          <ha-textfield
            .label=${t.dueDate}
            type="date"
            .value=${e.due_date}
            required
            @input=${t=>this._patch("due_date",t.target.value)}
          ></ha-textfield>

          <div class="wd-field">
            <span>${t.category}</span>
            <div class="wd-chip-group">
              ${this.categories.map(t=>q`
                  <button
                    type="button"
                    class="wd-chip ${e.category_id===t.id?"active":""}"
                    @click=${()=>this._patch("category_id",t.id)}
                  >
                    <ha-icon .icon=${t.icon}></ha-icon>
                    ${t.name}
                  </button>
                `)}
            </div>
          </div>

          <wd-icon-picker
            .label=${t.icon}
            .value=${e.icon}
            @value-changed=${t=>this._patch("icon",t.detail.value)}
          ></wd-icon-picker>

          <div class="wd-field">
            <span>${t.recurrence}</span>
            <div class="wd-chip-group">
              ${[["none",t.recurrenceNone],["monthly",t.recurrenceMonthly],["yearly",t.recurrenceYearly],["custom",t.recurrenceCustom]].map(([t,i])=>q`
                  <button
                    type="button"
                    class="wd-chip ${e.recurrence===t?"active":""}"
                    @click=${()=>this._patch("recurrence",t)}
                  >
                    ${i}
                  </button>
                `)}
            </div>
          </div>

          ${"custom"===e.recurrence?q`
                <ha-textfield
                  .label=${t.recurrenceDays}
                  type="number"
                  min="1"
                  .value=${null!=e.recurrence_days?String(e.recurrence_days):""}
                  @input=${t=>{const e=t.target.value;this._patch("recurrence_days",e?parseInt(e,10):null)}}
                ></ha-textfield>
              `:B}

          <ha-textarea
            .label=${t.notes}
            .value=${e.notes}
            @input=${t=>this._patch("notes",t.target.value)}
          ></ha-textarea>
        </div>

        <div class="wd-dialog-actions">
          <button class="wd-btn" @click=${this._cancel}>${t.cancel}</button>
          <button class="wd-btn primary" @click=${this._save}>${t.save}</button>
        </div>
      </ha-dialog>
    `}};function Ct(t){return{id:t.id,name:t.name,icon:t.icon,color:t.color}}At.styles=_t,t([pt({attribute:!1})],At.prototype,"strings",void 0),t([pt({attribute:!1})],At.prototype,"categories",void 0),t([pt({attribute:!1})],At.prototype,"draft",void 0),t([ut()],At.prototype,"_local",void 0),At=t([lt("wd-item-dialog")],At);let Et=class extends nt{constructor(){super(...arguments),this._cancel=()=>this.dispatchEvent(new CustomEvent("cancel")),this._save=()=>{this._local.name.trim()&&this.dispatchEvent(new CustomEvent("save",{detail:this._local}))}}willUpdate(t){t.has("draft")&&this.draft&&(this._local={...this.draft})}_patch(t,e){this._local={...this._local,[t]:e},this.requestUpdate()}render(){if(!this._local)return B;const t=this.strings,e=this._local;return q`
      <ha-dialog
        open
        heading=${e.id?t.categories:t.newCategory}
        @closed=${t=>{t.detail?.action&&this._cancel()}}
      >
        <div class="form">
          <ha-textfield
            .label=${t.name}
            .value=${e.name}
            required
            @input=${t=>this._patch("name",t.target.value)}
          ></ha-textfield>

          <wd-icon-picker
            .label=${t.icon}
            .value=${e.icon}
            @value-changed=${t=>this._patch("icon",t.detail.value)}
          ></wd-icon-picker>

          <div class="color-row">
            <input
              type="color"
              .value=${e.color}
              @input=${t=>this._patch("color",t.target.value)}
            />
            <span class="color-label">${t.color}</span>
          </div>
        </div>

        <div class="wd-dialog-actions">
          <button class="wd-btn" @click=${this._cancel}>${t.cancel}</button>
          <button class="wd-btn primary" @click=${this._save}>${t.save}</button>
        </div>
      </ha-dialog>
    `}};Et.styles=[_t,o`
      .form { display: grid; gap: 12px; padding: 4px 0; }
      .color-row { display: flex; gap: 10px; align-items: center; }
      .color-row input[type="color"] {
        padding: 0;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        width: 48px;
        height: 36px;
        background: transparent;
        cursor: pointer;
      }
      .color-label { color: var(--secondary-text-color); font-size: 0.85rem; }
    `],t([pt({attribute:!1})],Et.prototype,"strings",void 0),t([pt({attribute:!1})],Et.prototype,"draft",void 0),t([ut()],Et.prototype,"_local",void 0),Et=t([lt("wd-category-dialog")],Et);let kt=class extends nt{constructor(){super(...arguments),this.categories=[],this._close=()=>this.dispatchEvent(new CustomEvent("close")),this._add=()=>this.dispatchEvent(new CustomEvent("add"))}_edit(t){this.dispatchEvent(new CustomEvent("edit",{detail:t}))}_delete(t){this.dispatchEvent(new CustomEvent("delete",{detail:t}))}render(){const t=this.strings;return q`
      <ha-dialog
        open
        heading=${t.categories}
        @closed=${t=>{t.detail?.action&&this._close()}}
      >
        <div class="list">
          ${0===this.categories.length?q`<div class="empty">—</div>`:this.categories.map(e=>q`
                  <div class="row">
                    <div class="swatch" style="background: ${e.color}">
                      <ha-icon .icon=${e.icon}></ha-icon>
                    </div>
                    <div class="name">
                      <div>${e.name}</div>
                      <div class="muted">${e.id}</div>
                    </div>
                    <ha-icon-button
                      .label=${t.editItem}
                      @click=${()=>this._edit(e)}
                    >
                      <ha-icon icon="mdi:pencil"></ha-icon>
                    </ha-icon-button>
                    <ha-icon-button
                      .label=${t.deleteItem}
                      @click=${()=>this._delete(e)}
                    >
                      <ha-icon icon="mdi:delete"></ha-icon>
                    </ha-icon-button>
                  </div>
                `)}
        </div>

        <div class="wd-dialog-actions">
          <button class="wd-btn" @click=${this._close}>${t.close}</button>
          <button class="wd-btn primary" @click=${this._add}>
            <ha-icon icon="mdi:plus"></ha-icon>
            ${t.newCategory}
          </button>
        </div>
      </ha-dialog>
    `}};kt.styles=[_t,o`
      .list { display: flex; flex-direction: column; }
      .row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 4px;
        border-bottom: 1px solid var(--divider-color);
      }
      .row:last-child { border-bottom: 0; }
      .swatch {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        flex-shrink: 0;
      }
      .name { flex: 1; }
      .muted { color: var(--secondary-text-color); font-size: 0.85rem; }
      .empty { padding: 20px 4px; color: var(--secondary-text-color); text-align: center; }
    `],t([pt({attribute:!1})],kt.prototype,"strings",void 0),t([pt({attribute:!1})],kt.prototype,"categories",void 0),kt=t([lt("wd-categories-dialog")],kt);const St=["warning","urgent","critical","expired"];let Dt=class extends nt{constructor(){super(...arguments),this._targetsText="",this._cancel=()=>this.dispatchEvent(new CustomEvent("cancel")),this._save=()=>{const t=this._targetsText.split(",").map(t=>t.trim().replace(/^notify\./,"")).filter(t=>t.length>0),e={...this._local,notifications:{...this._local.notifications,targets:t}};this.dispatchEvent(new CustomEvent("save",{detail:e}))}}willUpdate(t){t.has("settings")&&this.settings&&(this._local={...this.settings,notifications:{...this.settings.notifications,targets:[...this.settings.notifications?.targets??[]],statuses:[...this.settings.notifications?.statuses??[]]}},this._targetsText=this._local.notifications.targets.join(", "))}_patch(t,e){this._local={...this._local,[t]:e},this.requestUpdate()}_patchNotif(t,e){this._local={...this._local,notifications:{...this._local.notifications,[t]:e}},this.requestUpdate()}_toggleStatus(t,e){const i=new Set(this._local.notifications.statuses);e?i.add(t):i.delete(t),this._patchNotif("statuses",Array.from(i))}_num(t){const e=parseInt(t.target.value,10);return Number.isFinite(e)&&e>=0?e:0}_statusLabel(t){const e=this.strings;switch(t){case"warning":return e.statusWarning;case"urgent":return e.statusUrgent;case"critical":return e.statusCritical;case"expired":return e.statusExpired}}render(){if(!this._local)return B;const t=this.strings,e=this._local,i=e.notifications;return q`
      <ha-dialog
        open
        heading=${t.settings}
        @closed=${t=>{t.detail?.action&&this._cancel()}}
      >
        <div class="form">
          <p class="hint">
            ${t.warningDays} &gt; ${t.urgentDays} &gt; ${t.criticalDays}
          </p>
          <ha-textfield
            .label=${t.warningDays}
            type="number"
            min="1"
            .value=${String(e.warning_days)}
            @input=${t=>this._patch("warning_days",this._num(t))}
          ></ha-textfield>
          <ha-textfield
            .label=${t.urgentDays}
            type="number"
            min="1"
            .value=${String(e.urgent_days)}
            @input=${t=>this._patch("urgent_days",this._num(t))}
          ></ha-textfield>
          <ha-textfield
            .label=${t.criticalDays}
            type="number"
            min="0"
            .value=${String(e.critical_days)}
            @input=${t=>this._patch("critical_days",this._num(t))}
          ></ha-textfield>

          <div class="section-title">${t.notifications}</div>

          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${i.enabled}
              @change=${t=>this._patchNotif("enabled",t.target.checked)}
            />
            <span>${t.notificationsEnabled}</span>
          </label>

          <ha-textfield
            .label=${t.notificationsTargets}
            .value=${this._targetsText}
            .disabled=${!i.enabled}
            @input=${t=>this._targetsText=t.target.value}
          ></ha-textfield>
          <p class="hint">${t.notificationsTargetsHint}</p>

          <div>
            <div class="hint" style="margin-bottom: 6px;">
              ${t.notificationsStatuses}
            </div>
            <div class="status-grid">
              ${St.map(t=>q`
                  <label class="toggle-row">
                    <input
                      type="checkbox"
                      .checked=${i.statuses.includes(t)}
                      .disabled=${!i.enabled}
                      @change=${e=>this._toggleStatus(t,e.target.checked)}
                    />
                    <span>${this._statusLabel(t)}</span>
                  </label>
                `)}
            </div>
          </div>
        </div>

        <div class="wd-dialog-actions">
          <button class="wd-btn" @click=${this._cancel}>${t.cancel}</button>
          <button class="wd-btn primary" @click=${this._save}>${t.save}</button>
        </div>
      </ha-dialog>
    `}};Dt.styles=[_t,o`
      .form { display: grid; gap: 14px; padding: 4px 0; min-width: 320px; }
      .hint {
        font-size: 0.85rem;
        color: var(--secondary-text-color);
        line-height: 1.4;
        margin: 0;
      }
      .section-title {
        font-size: 0.95rem;
        font-weight: 500;
        margin: 8px 0 -4px;
        padding-top: 6px;
        border-top: 1px solid var(--divider-color);
      }
      .toggle-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .toggle-row input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
        cursor: pointer;
      }
      .status-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 8px;
      }
    `],t([pt({attribute:!1})],Dt.prototype,"strings",void 0),t([pt({attribute:!1})],Dt.prototype,"settings",void 0),t([ut()],Dt.prototype,"_local",void 0),t([ut()],Dt.prototype,"_targetsText",void 0),Dt=t([lt("wd-settings-dialog")],Dt);let Pt=class extends nt{constructor(){super(...arguments),this.narrow=!1,this.items=[],this.categories=[],this.settings={warning_days:30,urgent_days:7,critical_days:1,notifications:{enabled:!1,targets:[],statuses:["urgent","critical","expired"]}},this.activeCategory="all",this.statusFilter="active",this.search="",this.dialog=null,this.loaded=!1,this.openAddItem=()=>{const t=this.categories[0]?.id??"other";this.dialog={kind:"item",draft:wt(t)}},this.openCategories=()=>{this.dialog={kind:"categories"}},this.openAddCategory=()=>{this.dialog={kind:"category",draft:{name:"",icon:"mdi:tag",color:"#78909C"}}},this.openSettings=()=>{this.dialog={kind:"settings"}},this.closeDialog=()=>{this.dialog=null}}connectedCallback(){super.connectedCallback(),this.api=new mt(this.hass),async function(t=5e3){const e=window;if("function"==typeof e.loadCardHelpers)try{await e.loadCardHelpers()}catch{}const i=yt.map(t=>customElements.whenDefined(t));await Promise.race([Promise.all(i),new Promise(e=>setTimeout(e,t))])}().catch(()=>{}),this.refresh()}get strings(){return t=this.hass?.language,t&&t.toLowerCase().startsWith("ro")?$t:vt;var t}async refresh(){const t=await this.api.getAll();this.items=t.items,this.categories=t.categories,this.settings=t.settings,this.loaded=!0}getCategory(t){return this.categories.find(e=>e.id===t)}filteredItems(){const t=this.search.trim().toLowerCase();return this.items.filter(t=>"done"===this.statusFilter?"completed"===t.status:"completed"!==t.status).filter(t=>"all"===this.activeCategory||t.category_id===this.activeCategory).filter(e=>!t||e.name.toLowerCase().includes(t)||(e.notes||"").toLowerCase().includes(t)).sort((t,e)=>{if("done"===this.statusFilter){const i=t.completed_at?Date.parse(t.completed_at):0;return(e.completed_at?Date.parse(e.completed_at):0)-i}return t.days_until_due-e.days_until_due})}openEditItem(t){this.dialog={kind:"item",draft:xt(t)}}async deleteItem(t){confirm(this.strings.confirmDelete)&&(await this.api.deleteItem(t.id),await this.refresh())}async markDone(t){await this.api.markDone(t.id),await this.refresh()}async uncomplete(t){await this.api.uncompleteItem(t.id),await this.refresh()}async saveItem(t){const e={name:t.name.trim(),due_date:t.due_date,category_id:t.category_id,icon:t.icon||"mdi:calendar",notes:t.notes,recurrence:t.recurrence,recurrence_days:"custom"===t.recurrence?t.recurrence_days??void 0:void 0};t.id?await this.api.updateItem(t.id,e):await this.api.addItem(e),this.dialog=null,await this.refresh()}openEditCategory(t){this.dialog={kind:"category",draft:Ct(t)}}async deleteCategory(t){confirm(this.strings.confirmDeleteCategory)&&(await this.api.deleteCategory(t.id),await this.refresh(),this.activeCategory===t.id&&(this.activeCategory="all"))}async saveCategory(t){t.id?await this.api.updateCategory(t.id,{name:t.name.trim(),icon:t.icon,color:t.color}):await this.api.addCategory({name:t.name.trim(),icon:t.icon,color:t.color}),await this.refresh(),this.dialog={kind:"categories"}}async saveSettings(t){await this.api.updateSettings(t),this.dialog=null,await this.refresh()}formatDays(t){const e=this.strings;if("completed"===t.status&&t.completed_at)return`${e.completedOn} ${this._formatTimestamp(t.completed_at)}`;const i=t.days_until_due;return i<0?`${Math.abs(i)} ${e.daysOverdue}`:0===i?e.dueToday:1===i?e.dueTomorrow:`${i} ${e.daysLeft}`}_formatTimestamp(t){return t.slice(0,10)}render(){const t=this.strings,e=this.filteredItems();return q`
      <div class="app">
        <header class="bar">
          <h1>${t.title}</h1>
          <ha-icon-button
            .label=${t.categories}
            @click=${this.openCategories}
          >
            <ha-icon icon="mdi:tag-multiple"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${t.settings}
            @click=${this.openSettings}
          >
            <ha-icon icon="mdi:cog"></ha-icon>
          </ha-icon-button>
        </header>

        <div class="filter-row">
          <button
            class="segment ${"active"===this.statusFilter?"active":""}"
            @click=${()=>this.statusFilter="active"}
          >
            ${t.active}
          </button>
          <button
            class="segment ${"done"===this.statusFilter?"active":""}"
            @click=${()=>this.statusFilter="done"}
          >
            ${t.done}
          </button>
        </div>

        <div class="chips">
          <button
            class="chip ${"all"===this.activeCategory?"active":""}"
            @click=${()=>this.activeCategory="all"}
          >
            <ha-icon icon="mdi:view-grid"></ha-icon>
            <span>${t.all}</span>
          </button>
          ${this.categories.map(t=>q`
              <button
                class="chip ${this.activeCategory===t.id?"active":""}"
                @click=${()=>this.activeCategory=t.id}
              >
                <ha-icon .icon=${t.icon}></ha-icon>
                <span>${t.name}</span>
              </button>
            `)}
        </div>

        <div class="search">
          <ha-textfield
            class="search-field"
            icon
            .placeholder=${t.searchPlaceholder}
            .value=${this.search}
            @input=${t=>this.search=t.target.value}
          >
            <ha-icon slot="leadingIcon" icon="mdi:magnify"></ha-icon>
          </ha-textfield>
        </div>

        <div class="grid">
          ${this.loaded?0===e.length?q`<div class="empty">${t.empty}</div>`:e.map(t=>this._renderCard(t)):B}
        </div>

        <ha-fab
          .label=${t.addItem}
          extended
          @click=${this.openAddItem}
        >
          <ha-icon slot="icon" icon="mdi:plus"></ha-icon>
          ${t.addItem}
        </ha-fab>

        ${this._renderDialog()}
      </div>
    `}_renderCard(t){const e=this.getCategory(t.category_id),i=this.strings,s="completed"===t.status;return q`
      <ha-card class="status-${t.status}">
        <div class="icon-wrap" style="background: ${e?.color??"#78909C"}">
          <ha-icon .icon=${t.icon}></ha-icon>
        </div>
        <div class="body">
          <h3>${t.name}</h3>
          <div class="meta">
            <span>${e?.name??"—"}</span>
            <span>${t.due_date}</span>
            ${t.last_completed_at&&!s?q`<span
                  >${i.lastDoneOn}
                  ${this._formatTimestamp(t.last_completed_at)}</span
                >`:B}
          </div>
          <div class="days">${this.formatDays(t)}</div>
        </div>
        <div class="actions">
          ${s?q`
                <ha-icon-button
                  .label=${i.undo}
                  @click=${()=>this.uncomplete(t)}
                >
                  <ha-icon icon="mdi:undo"></ha-icon>
                </ha-icon-button>
              `:q`
                <ha-icon-button
                  .label=${i.markDone}
                  @click=${()=>this.markDone(t)}
                >
                  <ha-icon icon="mdi:check"></ha-icon>
                </ha-icon-button>
                <ha-icon-button
                  .label=${i.editItem}
                  @click=${()=>this.openEditItem(t)}
                >
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </ha-icon-button>
              `}
          <ha-icon-button
            .label=${i.deleteItem}
            @click=${()=>this.deleteItem(t)}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </ha-icon-button>
        </div>
      </ha-card>
    `}_renderDialog(){if(!this.dialog)return B;const t=this.strings;return"item"===this.dialog.kind?q`
        <wd-item-dialog
          .strings=${t}
          .categories=${this.categories}
          .draft=${this.dialog.draft}
          @save=${t=>this.saveItem(t.detail)}
          @cancel=${this.closeDialog}
        ></wd-item-dialog>
      `:"categories"===this.dialog.kind?q`
        <wd-categories-dialog
          .strings=${t}
          .categories=${this.categories}
          @close=${this.closeDialog}
          @add=${this.openAddCategory}
          @edit=${t=>this.openEditCategory(t.detail)}
          @delete=${t=>this.deleteCategory(t.detail)}
        ></wd-categories-dialog>
      `:"category"===this.dialog.kind?q`
        <wd-category-dialog
          .strings=${t}
          .draft=${this.dialog.draft}
          @save=${t=>this.saveCategory(t.detail)}
          @cancel=${()=>this.dialog={kind:"categories"}}
        ></wd-category-dialog>
      `:"settings"===this.dialog.kind?q`
        <wd-settings-dialog
          .strings=${t}
          .settings=${this.settings}
          @save=${t=>this.saveSettings(t.detail)}
          @cancel=${this.closeDialog}
        ></wd-settings-dialog>
      `:B}};Pt.styles=o`
    :host {
      display: block;
      height: 100vh;
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      --wd-status-ok: var(--success-color, #4caf50);
      --wd-status-warning: #ffc107;
      --wd-status-urgent: #ff9800;
      --wd-status-critical: #f44336;
      --wd-status-expired: #b71c1c;
      --wd-status-completed: #9e9e9e;
    }

    .app {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
    }

    header.bar {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 12px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      --mdc-icon-button-size: 40px;
    }
    header.bar h1 {
      margin: 0 8px;
      font-size: 1.2rem;
      font-weight: 500;
      flex: 1;
    }

    .chips {
      display: flex;
      gap: 8px;
      padding: 10px 16px;
      overflow-x: auto;
      scrollbar-width: thin;
      border-bottom: 1px solid var(--divider-color);
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 999px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      cursor: pointer;
      white-space: nowrap;
      font-size: 0.85rem;
      color: var(--primary-text-color);
      transition: transform 120ms ease;
    }
    .chip:hover { transform: translateY(-1px); }
    .chip.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    .chip ha-icon { --mdc-icon-size: 18px; }

    .search {
      padding: 10px 16px 4px;
    }

    .grid {
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px 96px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 12px;
      align-content: start;
    }

    ha-card {
      position: relative;
      padding: 14px 16px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      border-left: 4px solid transparent;
      transition: transform 120ms ease;
    }
    ha-card:hover { transform: translateY(-1px); }
    ha-card.status-ok { border-left-color: var(--wd-status-ok); }
    ha-card.status-warning { border-left-color: var(--wd-status-warning); }
    ha-card.status-urgent { border-left-color: var(--wd-status-urgent); }
    ha-card.status-critical { border-left-color: var(--wd-status-critical); }
    ha-card.status-expired { border-left-color: var(--wd-status-expired); }
    ha-card.status-completed {
      border-left-color: var(--wd-status-completed);
      opacity: 0.78;
    }
    ha-card.status-completed .body h3 { text-decoration: line-through; }

    .icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #fff;
    }
    .icon-wrap ha-icon { --mdc-icon-size: 24px; }

    .body { flex: 1; min-width: 0; }
    .body h3 {
      margin: 0 0 2px;
      font-size: 1rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .meta {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .days {
      font-weight: 600;
      font-size: 0.95rem;
      margin-top: 4px;
    }
    .status-expired .days,
    .status-critical .days { color: var(--wd-status-critical); }
    .status-urgent .days { color: var(--wd-status-urgent); }
    .status-warning .days { color: var(--wd-status-warning); }
    .status-ok .days { color: var(--wd-status-ok); }
    .status-completed .days { color: var(--wd-status-completed); }

    .filter-row {
      display: flex;
      gap: 8px;
      padding: 10px 16px 0;
    }
    .segment {
      font: inherit;
      font-size: 0.85rem;
      padding: 6px 16px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      transition: background 120ms ease;
    }
    .segment:hover { background: var(--secondary-background-color); }
    .segment.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }

    .actions {
      display: flex;
      gap: 2px;
      margin-left: auto;
      --mdc-icon-button-size: 36px;
      --mdc-icon-size: 20px;
    }

    .empty {
      grid-column: 1 / -1;
      padding: 40px 16px;
      text-align: center;
      color: var(--secondary-text-color);
    }

    ha-fab {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 10;
    }

    ha-textfield.search-field { width: 100%; }
  `,t([pt({attribute:!1})],Pt.prototype,"hass",void 0),t([pt({attribute:!1})],Pt.prototype,"narrow",void 0),t([pt({attribute:!1})],Pt.prototype,"route",void 0),t([pt({attribute:!1})],Pt.prototype,"panel",void 0),t([ut()],Pt.prototype,"items",void 0),t([ut()],Pt.prototype,"categories",void 0),t([ut()],Pt.prototype,"settings",void 0),t([ut()],Pt.prototype,"activeCategory",void 0),t([ut()],Pt.prototype,"statusFilter",void 0),t([ut()],Pt.prototype,"search",void 0),t([ut()],Pt.prototype,"dialog",void 0),t([ut()],Pt.prototype,"loaded",void 0),Pt=t([lt("whats-due-panel")],Pt);export{Pt as WhatsDuePanel};
