React = require 'React'
UploadForm = require './UploadForm.coffee'
PictureList = require './PictureList.coffee'
downloader = require './downloader.coffee'
FileSystem = require './FileSystem.coffee'
fs = new FileSystem()

View = React.createClass
    getInitialState: ->
        pictureUrls: []

    componentDidMount: ->
        fs.init()
        .then =>
            fs.getAllFiles().then (fileUrls)=>
                @setState
                    pictureUrls: fileUrls

    uploadFile: (url)->
        downloader.fetch url
        .then (blob)->
            fs.uploadFile blob

    render: ->
        <div>
            <UploadForm onChooseFiles={this.uploadFile} />
            <PictureList pictureUrls={this.state.pictureUrls} />
        </div>


module.exports = View