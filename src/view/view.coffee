React = require 'React'
UploadForm = require '../upload-form/upload-form.coffee'
PictureList = require '../picture-list/picture-list.coffee'
storage = require '../storage/storage.coffee'

View = React.createClass
  getInitialState: ->
    pictureUrls: []

  componentDidMount: ->
    storage.getAllFiles().then (fileUrls)=>
      @setState
        pictureUrls: fileUrls

  uploadFiles: (fileList)->
    storage.uploadFile fileList

  render: ->
    <div>
      <UploadForm onChooseFiles={this.uploadFiles} />
      <PictureList pictureUrls={this.state.pictureUrls} />
    </div>


module.exports = View