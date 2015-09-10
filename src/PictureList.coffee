React = require 'React'
Picture = require './Picture.coffee'

PictureList = React.createClass
  render: ->
    pictures = this.props.pictureUrls.map (url)->
      <Picture url={url} />

    <div>{pictures}</div>

module.exports = PictureList