uuid = require 'node-uuid'
React = require 'react'
Picture = require './Picture.coffee'

PictureList = React.createClass
    render: ->
        pictures = this.props.pictureUrls.map (url, index)->
            <Picture key={index} url={url} />

        <div>{pictures}</div>

module.exports = PictureList