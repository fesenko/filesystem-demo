React = require 'react'
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

    uploadResource: (url)->
        downloader.fetch url
        .then (blob)=>
            fs.uploadFile blob
            .then (url)=>
                pictureUrls = @state.pictureUrls
                pictureUrls.unshift url
                @setState
                    pictureUrls: pictureUrls


    render: ->
        <div>
            <UploadForm onSubmit={@uploadResource} />
            <PictureList pictureUrls={@state.pictureUrls} />
        </div>


module.exports = View