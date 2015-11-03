React = require 'react'
ReactDOM = require 'react-dom'
View = require './View.coffee'

container = document.getElementById 'app-container'

ReactDOM.render <View />, container
