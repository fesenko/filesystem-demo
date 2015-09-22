React = require 'React'
Picture = require '../picture/picture.coffee'

PictureList = React.createClass
  render: ->
    pictures = this.props.pictureUrls.map (url)->
      <Picture key={url} url={url} />

    <div>{pictures}</div>

module.exports = PictureList