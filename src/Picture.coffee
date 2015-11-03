React = require 'react'

Picture = React.createClass
    clickHandler: (event)->
        event.preventDefault()

        @props.onClick @props.url

    render: ->
        <div className="col-xs-6 col-md-3">
            <a href="#" className="thumbnail" onClick={@clickHandler}>
                <img src = {@props.url} />
            </a>
        </div>

module.exports = Picture