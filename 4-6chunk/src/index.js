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

async function getComp() {
  const { default: _ } = await import(/* webpackChunkName:"lodash" */ 'lodash')
  const elem = document.createElement('div')
  elem.innerHTML = _.join(['123', '456'], '-')
  return elem
}

document.addEventListener('click', () => {
  getComp().then((elem) => {
    document.body.appendChild(elem)
  })
})
