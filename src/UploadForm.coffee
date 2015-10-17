React = require 'react'

UploadForm = React.createClass
    handleSubmit: (event)->
        event.preventDefault()
        inputElem = React.findDOMNode @refs.uri
        uri = inputElem.value
        this.props.onSubmit uri
        .then =>
            inputElem.value = ''

    render: ->
        <div>
            <form onSubmit={@handleSubmit}>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Enter url to upload" ref="uri" />
                </div>
                <button type="submit" className="btn btn-default">Upload</button>
            </form>
        </div>

module.exports = UploadForm