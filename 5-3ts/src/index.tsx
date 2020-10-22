import * as _ from 'lodash'

class Greeter {
  greeting: string
  constructor(msg: string) {
    this.greeting = msg
  }
  greet() {
    // return _.join()
    return 'hello, ' + this.greeting
  }
}

let greeter = new Greeter('world')

alert(greeter.greet())
