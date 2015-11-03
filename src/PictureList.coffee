uuid = require 'node-uuid'
React = require 'react'
ReactDOM = require 'react-dom'
Bootstrap = require 'react-bootstrap'
Modal = Bootstrap.Modal
Button = Bootstrap.Button
Picture = require './Picture.coffee'

PictureList = React.createClass
    getInitialState: ->
         showModal: false
         pictureUrl: null

    open: (url)->
        @setState
            showModal: true
            pictureUrl: url

    close: ->
        @setState
            showModal: false
            pictureUrl: null

    render: ->
        pictures = this.props.pictureUrls.map (url, index)=>
            <Picture onClick={@open} key={index} url={url} />

        <div className="container-fluid">
            <div className="row">
                <Modal show={@state.showModal} onHide={@close} animation=false bsSize="large">
                  <Modal.Header closeButton>&nbsp;</Modal.Header>
                  <Modal.Body>
                    <img src={@state.pictureUrl} style={{width: 838 + "px"}} />
                  </Modal.Body>
                </Modal>

                {pictures}
            </div>
        </div>


module.exports = PictureList