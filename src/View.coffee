React = require 'React'
UploadForm = require './UploadForm.coffee'
PictureList = require './PictureList.coffee'

View = React.createClass
  getInitialState: ->
    pictureUrls: [
      'https://pbs.twimg.com/profile_images/447460759329460224/mt2UmwGG_400x400.jpeg'
    ]

  render: ->
    <div>
      <UploadForm />
      <PictureList pictureUrls={this.state.pictureUrls} />
    </div>


module.exports = View