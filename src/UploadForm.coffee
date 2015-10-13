React = require 'React'

UploadForm = React.createClass
    handleSubmit: (event)->
        event.preventDefault()

        fileElem = React.findDOMNode @refs.fileURI
        fileURI = fileElem.value

        this.props.onChooseFiles fileURI

    componentDidMount: ->
        fileElem = React.findDOMNode @refs.fileURI
        fileElem.value = 'https://s3-ap-northeast-1.amazonaws.com/b2b-test-video/cities/hk.jpg'

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