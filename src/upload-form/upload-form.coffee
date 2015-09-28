React = require 'React'

UploadForm = React.createClass
  handleSubmit: (event)->
    event.preventDefault()

    fileElem = React.findDOMNode @refs.fileURI
    fileURI = fileElem.value

    this.props.onChooseFiles fileURI

  componentDidMount: ->
    fileElem = React.findDOMNode @refs.fileURI
    fileElem.value = 'https://pbs.twimg.com/profile_images/378800000532546226/dbe5f0727b69487016ffd67a6689e75a.jpeg'

  render: ->
    <div>
      <form onSubmit={@handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" placeholder="file URI" ref="fileURI" />
        </div>
        <button type="submit" className="btn btn-default">Upload</button>
      </form>
    </div>

module.exports = UploadForm