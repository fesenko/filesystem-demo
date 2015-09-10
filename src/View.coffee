React = require 'React'
UploadForm = require './UploadForm.coffee'
PictureList = require './PictureList.coffee'
storage = require './storage.coffee'

View = React.createClass
  getInitialState: ->
    pictureUrls: []

  componentDidMount: ->
    storage.getAllPictures().then (pictureUrls)=>
      @setState
        pictureUrls: pictureUrls

  render: ->
    <div>
      <UploadForm />
      <PictureList pictureUrls={this.state.pictureUrls} />
    </div>


module.exports = View