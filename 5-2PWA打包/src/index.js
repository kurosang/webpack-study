console.log('hello world')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('sw succes')
      })
      .catch((err) => {
        console.log('sw error')
      })
  })
}
