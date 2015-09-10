React = require 'React'

UploadForm = React.createClass
  render: ->
    <div>
      <form>
        <input type='file'/>
      </form>
    </div>

module.exports = UploadForm