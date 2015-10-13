React = require 'React'
Picture = require './Picture.coffee'

PictureList = React.createClass
    render: ->
        pictures = this.props.pictureUrls.map (url)->
            <Picture key={url} url={url} />

        <div>{pictures}</div>

module.exports = PictureList