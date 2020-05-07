/*! lz4.js Released under the MIT license. https://github.com/STUkh/lz4.js */

let lz4init = (function() {
  let _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(lz4init) {
  lz4init = lz4init || {};

  let c; c || (c = typeof lz4init !== 'undefined' ? lz4init : {}); let k = {},
    l; for (l in c)c.hasOwnProperty(l) && (k[l] = c[l]); function m(a, b) {throw b;} let aa = !1,
      p = !1,
      q = !1; aa = typeof window === "object"; p = typeof importScripts === "function"; q = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string"; let r = "",
        t, u, v, w;
  if (q)r = p ? require("path").dirname(r) + "/" : __dirname + "/", t = function(a, b) {v || (v = require("fs")); w || (w = require("path")); a = w.normalize(a); return v.readFileSync(a, b ? null : "utf8");}, u = function(a) {a = t(a, !0); a.buffer || (a = new Uint8Array(a)); a.buffer || x("Assertion failed: undefined"); return a;}, process.argv.length > 1 && process.argv[1].replace(/\\/g, "/"), process.argv.slice(2), process.on("uncaughtException", function(a) {if (!(a instanceof y)) throw a;}), process.on("unhandledRejection", x), m = function(a) {process.exit(a);},
c.inspect = function() {return "[Emscripten Module object]";}; else if (aa || p)p ? r = self.location.href : document.currentScript && (r = document.currentScript.src), _scriptDir && (r = _scriptDir), r.indexOf("blob:") !== 0 ? r = r.substr(0, r.lastIndexOf("/") + 1) : r = "", t = function(a) {let b = new XMLHttpRequest(); b.open("GET", a, !1); b.send(null); return b.responseText;}, p && (u = function(a) {let b = new XMLHttpRequest(); b.open("GET", a, !1); b.responseType = "arraybuffer"; b.send(null); return new Uint8Array(b.response);});
  let ba = c.print || console.log.bind(console),
    z = c.printErr || console.warn.bind(console); for (l in k)k.hasOwnProperty(l) && (c[l] = k[l]); k = null; c.quit && (m = c.quit); let A; c.wasmBinary && (A = c.wasmBinary); let noExitRuntime; c.noExitRuntime && (noExitRuntime = c.noExitRuntime); typeof WebAssembly !== "object" && z("no native wasm support detected"); let B,
      ca = new WebAssembly.Table({initial: 5, maximum: 5, element: "anyfunc"}),
      C = !1,
      da = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : void 0;
  typeof TextDecoder !== "undefined" && new TextDecoder("utf-16le"); let D, E, F, ea,
    G = c.INITIAL_MEMORY || 33554432; c.wasmMemory ? B = c.wasmMemory : B = new WebAssembly.Memory({initial: G / 65536, maximum: G / 65536}); B && (D = B.buffer); G = D.byteLength; let H = D; D = H; c.HEAP8 = new Int8Array(H); c.HEAP16 = new Int16Array(H); c.HEAP32 = F = new Int32Array(H); c.HEAPU8 = E = new Uint8Array(H); c.HEAPU16 = new Uint16Array(H); c.HEAPU32 = new Uint32Array(H); c.HEAPF32 = new Float32Array(H); c.HEAPF64 = ea = new Float64Array(H); F[636] = 5245584;
  function I(a) {for (;a.length > 0;) {let b = a.shift(); if (typeof b == "function")b(); else {let d = b.O; typeof d === "number" ? void 0 === b.C ? c.dynCall_v(d) : c.dynCall_vi(d, b.C) : d(void 0 === b.C ? null : b.C);}}} let fa = [],
    ha = [],
    ia = [],
    J = []; function ja() {let a = c.preRun.shift(); fa.unshift(a);} let K = 0,
      L = null,
      M = null; c.preloadedImages = {}; c.preloadedAudios = {}; function x(a) {if (c.onAbort)c.onAbort(a); ba(a); z(a); C = !0; throw new WebAssembly.RuntimeError("abort(" + a + "). Build with -s ASSERTIONS=1 for more info.");} let N = "_lz4.wasm";
  if (String.prototype.startsWith ? !N.startsWith("data:application/octet-stream;base64,") : N.indexOf("data:application/octet-stream;base64,") !== 0) {let ka = N; N = c.locateFile ? c.locateFile(ka, r) : r + ka;} let pa = {1024: function() {void la();}, 1043: function(a, b, d) {return ma(a, b, d);}, 1075: function(a, b, d) {na(a, b, d);}, 1101: function(a, b) {oa(a, b);}}; ha.push({O: function() {qa();}});
  let O,
    ra = {a: function(a, b, d) {O || (O = []); let f = O; f.length = 0; for (let g; g = E[b++];)g === 100 || g === 102 ? (d = d + 7 & -8, f.push(ea[d >> 3]), d += 8) : (d = d + 3 & -4, f.push(F[d >> 2]), d += 4); return pa[a].apply(null, f);}, b: function(a, b, d) {E.copyWithin(a, b, b + d);}, c: function() {x("OOM");}, memory: B, table: ca},
    P = (function() {function a(d) {c.asm = d.exports; K--; c.monitorRunDependencies && c.monitorRunDependencies(K); K == 0 && (L !== null && (clearInterval(L), L = null), M && (d = M, M = null, d()));} let b = {a: ra}; K++; c.monitorRunDependencies && c.monitorRunDependencies(K);
      if (c.instantiateWasm) try {return c.instantiateWasm(b, a);} catch (d) {return z("Module.instantiateWasm callback failed with error: " + d), !1;}(function() {try {a: {try {if (A) {var d = new Uint8Array(A); break a;} if (u) {d = u(N); break a;} throw "sync fetching of the wasm failed: you can preload it to Module['wasmBinary'] manually, or emcc.py will do that for you when generating HTML (but not JS)";} catch (e) {x(e);}d = void 0;} var f = new WebAssembly.Module(d); var g = new WebAssembly.Instance(f, b);} catch (e) {throw g = e.toString(), z("failed to compile wasm module: " +
g), (g.indexOf("imported Memory") >= 0 || g.indexOf("memory import") >= 0) && z("Memory size incompatibility issues may be due to changing INITIAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set INITIAL_MEMORY at runtime to something smaller than it was at compile time)."), e;}a(g, f);})(); return c.asm;})(),
    qa = c.___wasm_call_ctors = P.d,
    la = c._LZ4JS_init = P.e,
    ta = c._LZ4JS_createCompressionContext = P.f,
    ua = c._LZ4JS_freeCompressionContext = P.g,
    va =
c._LZ4JS_compressBegin = P.h,
    wa = c._LZ4JS_compressUpdate = P.i,
    xa = c._LZ4JS_compressEnd = P.j,
    ya = c._LZ4JS_createDecompressionContext = P.k,
    za = c._LZ4JS_freeDecompressionContext = P.l,
    Aa = c._LZ4JS_decompress = P.m; c._main = P.n; c.asm = P; let Q; c.then = function(a) {if (Q)a(c); else {let b = c.onRuntimeInitialized; c.onRuntimeInitialized = function() {b && b(); a(c);};} return c;}; function y(a) {this.name = "ExitStatus"; this.message = "Program terminated with exit(" + a + ")"; this.status = a;}M = function Ba() {Q || R(); Q || (M = Ba);};
  function R() {function a() {if (!Q && (Q = !0, c.calledRun = !0, !C)) {I(ha); I(ia); if (c.onRuntimeInitialized)c.onRuntimeInitialized(); if (Ca) {let b = c._main; try {let d = b(0, 0); if (!noExitRuntime || d !== 0) {if (!noExitRuntime && (C = !0, c.onExit))c.onExit(d); m(d, new y(d));}} catch (f) {f instanceof y || (f == "unwind" ? noExitRuntime = !0 : ((b = f) && typeof f === "object" && f.stack && (b = [f, f.stack]), z("exception thrown: " + b), m(1, f)));} finally {}} if (c.postRun) for (typeof c.postRun == "function" && (c.postRun = [c.postRun]); c.postRun.length;)J.unshift(c.postRun.shift());
    I(J);}} if (!(K > 0)) {if (c.preRun) for (typeof c.preRun == "function" && (c.preRun = [c.preRun]); c.preRun.length;)ja(); I(fa); K > 0 || (c.setStatus ? (c.setStatus("Running..."), setTimeout(function() {setTimeout(function() {c.setStatus("");}, 1); a();}, 1)) : a());}}c.run = R; if (c.preInit) for (typeof c.preInit == "function" && (c.preInit = [c.preInit]); c.preInit.length > 0;)c.preInit.pop()(); let Ca = !0; c.noInitialRun && (Ca = !1); noExitRuntime = !0; R(); let S = {}; function ma(a, b) {return S[a].F(b);} function na(a, b, d) {return S[a].G(b, d);}
  function oa(a, b) {a = S[a]; let d = Error; if (b) {for (var f = b + NaN, g = b; E[g] && !(g >= f);)++g; if (g - b > 16 && E.subarray && da)b = da.decode(E.subarray(b, g)); else {for (f = ""; b < g;) {let e = E[b++]; if (e & 128) {let h = E[b++] & 63; if ((e & 224) == 192)f += String.fromCharCode((e & 31) << 6 | h); else {let n = E[b++] & 63; e = (e & 240) == 224 ? (e & 15) << 12 | h << 6 | n : (e & 7) << 18 | h << 12 | n << 6 | E[b++] & 63; e < 65536 ? f += String.fromCharCode(e) : (e -= 65536, f += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));}} else f += String.fromCharCode(e);}b = f;}} else b = ""; a.w = d(b);}
  let T = {"64KB": 4, "256KB": 5, "1MB": 6, "4MB": 7}; function U(a) {void 0 === a && (a = {}); this.M = {blockSizeID: T["4MB"], blockMode: 0, contentChecksumFlag: 0, frameType: 0, dictID: 0, blockChecksumFlag: 0}; this.N = {compressionLevel: 0, autoFlush: 1, favorDecSpeed: 1}; this.options = {}; this.options.frameInfo = Object.assign({}, this.M, a.frameInfo); this.options.preferences = Object.assign({}, this.options.frameInfo, this.N, a.preferences); this.w = null;}
  function Da(a, b) {a.u = ta(a.options.frameInfo.blockSizeID, a.options.frameInfo.blockMode, a.options.frameInfo.contentChecksumFlag, a.options.frameInfo.frameType, b || 0, a.options.frameInfo.dictID, a.options.frameInfo.blockChecksumFlag, a.options.preferences.compressionLevel, a.options.preferences.autoFlush, a.options.preferences.favorDecSpeed); if (!a.u) throw Error("LZ4JS_createCompressionContext"); S[a.u] = a;}U.prototype.s = function() {ua(this.u); delete S[this.u]; if (this.w) throw this.w;}; function V() {}
  V.prototype.G = function(a, b) {this.B.push(new Uint8Array(E.subarray(a, a + b)));}; V.prototype.F = function(a) {E.set(this.src.subarray(this.offset, this.offset + this.o), a); return this.o;}; function Ea(a) {let b = 0,
    d = a.reduce(function(g, e) {return g + e.length;}, 0),
    f = new Uint8Array(d); a.forEach(function(g) {f.set(g, b); b += g.length;}); return f;}
  function W(a) {function b(e, h) {Object.getOwnPropertyNames(h).concat(Object.getOwnPropertySymbols(h)).forEach(function(n) {n.match(/^(?:initializer|constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/) || Object.defineProperty(e, n, Object.getOwnPropertyDescriptor(h, n));});} for (var d = [], f = arguments.length - 1; f-- > 0;)d[f] = arguments[f + 1]; let g = (function(e) {function h() {for (var n = [], Z = arguments.length; Z--;)n[Z] = arguments[Z]; e.apply(this, n); d.forEach(function(sa) {typeof sa.prototype.P === "function" &&
sa.prototype.P.apply(this, n);});}e && (h.__proto__ = e); h.prototype = Object.create(e && e.prototype); return h.prototype.constructor = h;})(a); d.forEach(function(e) {b(g.prototype, e.prototype); b(g, e);}); return g;}
  let Fa = (function(a) {function b(d) {a.call(this, d); this.A();}a && (b.__proto__ = a); b.prototype = Object.create(a && a.prototype); b.prototype.constructor = b; b.prototype.J = function() {for (;this.offset < this.src.length; this.offset += 8192) this.o = Math.min(this.src.length - this.offset, 8192), wa(this.u) || this.s();}; b.prototype.I = function(d) {let f; this.src = d; Da(this, d.length); va(this.u) || this.s(); this.J(); xa(this.u); this.s(); let g = Ea(this.B); q && Buffer.isBuffer(d) ? f = Buffer.from(g.buffer, g.byteOffset, g.byteOffset + g.length) :
f = g; this.A(); return f;}; b.prototype.A = function() {this.src = null; this.o = this.offset = 0; this.B = [];}; return b;})(W(U, V)); function X() {this.v = ya(); if (!this.v) throw Error("LZ4JS_createDecompressionContext"); S[this.v] = this;}X.prototype.s = function() {za(this.v); delete S[this.v]; if (this.w) throw this.w;};
  let Ga = (function(a) {function b() {a.call(this); this.A();}a && (b.__proto__ = a); b.prototype = Object.create(a && a.prototype); b.prototype.constructor = b; b.prototype.L = function() {for (;this.offset < this.src.length; this.offset += 8192) this.o = Math.min(this.src.length - this.offset, 8192), Aa(this.v) || this.s(); this.s();}; b.prototype.K = function(d) {this.src = d; this.L(); let f = Ea(this.B); d = q ? Buffer.isBuffer(d) ? Buffer.from(f.buffer) : f : f; this.A(); return d;}; b.prototype.A = function() {this.src = null; this.offset = 0; this.B = []; this.o = 0;};
    return b;})(W(X, V)); function Y() {}Y.prototype.F = function(a) {E.set(new Uint8Array(this.src.buffer, this.src.byteOffset, this.o), a); return this.o;}; Y.prototype.G = function(a, b) {this.D = Buffer.from(E.buffer).slice(a, a + b); this.push(Buffer.from(this.D));}; let Ha, Ia;
  try {Ha = require("stream").Transform, Ia = (function(a) {function b(d) {a.call(this, d); U.call(this, d); this.H = !1; this.o = 0; this.src = Buffer.alloc(0); this.D = Buffer.alloc(0); Da(this, 0);}a && (b.__proto__ = a); b.prototype = Object.create(a && a.prototype); b.prototype.constructor = b; b.prototype._transform = function(d, f, g) {try {this.H || (va(this.u) || this.s(), this.H = !0); let e; for (e = 0; e < d.length; e += 8192) this.o = Math.min(d.length - e, 8192), this.src = d.slice(e, e + this.o), wa(this.u) || this.s(); g();} catch (h) {g(h);}}; b.prototype._flush = function(d) {try {xa(this.u),
this.s(), d();} catch (f) {d(f);}}; return b;})(W(Ha, U, Y));} catch (a) {} let Ja = Ia,
  Ka, La;
  try {Ka = require("stream").Transform, La = (function(a) {function b(d) {a.call(this, d); X.call(this); this.o = 0; this.src = Buffer.alloc(0); this.D = Buffer.alloc(0);}a && (b.__proto__ = a); b.prototype = Object.create(a && a.prototype); b.prototype.constructor = b; b.prototype._transform = function(d, f, g) {try {let e; for (e = 0; e < d.length; e += 8192) this.o = Math.min(d.length - e, 8192), this.src = d.slice(e, e + this.o), Aa(this.v) || this.s(); g();} catch (h) {g(h);}}; b.prototype._flush = function(d) {this.s(); d();}; return b;})(W(Ka, X, Y));} catch (a) {}
  let Ma = La,
    Na = {BLOCK_MAX_SIZE: T, LZ4JS_instances: S, LZ4JS_read: ma, LZ4JS_write: na, LZ4JS_error: oa, compress: function(a, b) {return (new Fa(b)).I(a);}, decompress: function(a) {return (new Ga()).K(a);}}; q && (Na.createCompressStream = function(a) {return new Ja(a);}, Na.createDecompressStream = function() {return new Ma();}); c.then && (delete c.then, c.ready = new Promise(function(a, b) {if (c.calledRun) return a(c); J.unshift(function() {return a(c);}); c.onAbort = function(d) {return b(d);};})); c.BLOCK_MAX_SIZE = T; c.lz4js = Na;

  return lz4init;
}
);
})();
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = lz4init;
else if (typeof define === 'function' && define.amd)
  define([], function() { return lz4init; });
else if (typeof exports === 'object')
  exports.lz4init = lz4init;

