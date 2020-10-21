import _ from 'lodash'
import $ from 'jquery'
import ui from './jq.ui'

const dom = $('div')
dom.html(_.join(['hello', 'world！！！'], ' '))
$('body').append(dom)

ui()
