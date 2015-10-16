React = require 'react'

Picture = React.createClass
    render: ->
        <img src = {this.props.url} />

module.exports = Picture