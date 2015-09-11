React = require 'React'

UploadForm = React.createClass
  handleSubmit: (event)->
    event.preventDefault()

    fileElem = React.findDOMNode @refs.file

    this.props.onChooseFiles fileElem.files

  render: ->
    <div>
      <form onSubmit={@handleSubmit}>
        <input type='file' ref='file' />
        <input type='submit' value='Upload' />
      </form>
    </div>

module.exports = UploadForm