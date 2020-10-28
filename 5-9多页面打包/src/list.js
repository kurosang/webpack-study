import React, { Component } from 'react'
import ReactDom from 'react-dom'
import _ from 'lodash'

class App extends Component {
  render() {
    return (
      <div>
        <div>this is list page</div>
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('root'))
