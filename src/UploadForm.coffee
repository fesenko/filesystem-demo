React = require 'react'
ReactDOM = require 'react-dom'

UploadForm = React.createClass

    handleSubmit: (event)->
        event.preventDefault()

        inputElem = ReactDOM.findDOMNode @refs.uri
        uri = inputElem.value

        if uri
            @props.onSubmit uri
            .then ->
                inputElem.value = ''
            .catch (err)->
                inputElem.value = ''
                alert err

    render: ->
        <div className="container-fluid">
            <div className="page-header">
                <h1>Enter an image URL to upload it</h1>
                <form onSubmit={@handleSubmit}>
                    <div className="form-group">
                        <input type="text" className="form-control" placeholder="Image URL" ref="uri" />
                    </div>
                    <button type="submit" className="btn btn-primary">Upload</button>
                </form>
            </div>
        </div>

module.exports = UploadForm