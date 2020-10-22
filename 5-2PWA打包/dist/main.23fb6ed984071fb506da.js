(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],[
/* 0 */
/***/ (function(module, exports) {

console.log('hello world');

if ('serviceWorker' in navigator) {
  console.log(12312312);
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../dist/service-worker.js').then(registration => {
      console.log('sw succes');
    }).catch(err => {
      console.log('sw error');
    });
  });
}

/***/ })
],[[0,1]]]);