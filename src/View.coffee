React = require 'React'
UploadForm = require './UploadForm.coffee'
PictureList = require './PictureList.coffee'
storage = require './storage.coffee'

View = React.createClass
  getInitialState: ->
    pictureUrls: []

  componentDidMount: ->
    storage.getAllFiles().then (fileUrls)=>
      @setState
        pictureUrls: fileUrls

  uploadFiles: (fileList)->
    storage.uploadFiles fileList

  render: ->
    <div>
      <UploadForm onChooseFiles={this.uploadFiles} />
      <PictureList pictureUrls={this.state.pictureUrls} />
    </div>


module.exports = View