//同步
// import _ from 'lodash'
// var elem = document.createElement('div')
// elem.innerHTML = _.join(['123', '456'], '-')
// document.body.appendChild(elem)

//异步
// function getComp() {
//   return import(/* webpackChunkName:"lodash" */ 'lodash').then(
//     ({ default: _ }) => {
//       var elem = document.createElement('div')
//       elem.innerHTML = _.join(['123', '456'], '-')
//       return elem
//     }
//   )
// }

// getComp().then((elem) => {
//   document.body.appendChild(elem)
// })

import test from './test.js'
import test2 from './test2.js'
console.log(test.name, test2.name)
