import { Background } from './background.js'
import { Links } from './links.js'
import { Schedule } from './schedule.js'
import { Title } from './title.js'

let background = new Background()
let links = new Links()
let schedule = new Schedule()
let title = new Title()

// enable tooltips and popovers
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()
})
