jest.dontMock '../Picture.coffee'
React = require 'react/addons'

TestUtils = React.addons.TestUtils
Picture = require '../Picture.coffee'

describe 'Picture', ->
    it 'renders an image', ->
        imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

        renderedComponent = TestUtils.renderIntoDocument <Picture url=imgUrl />
        node = React.findDOMNode renderedComponent

        expect node.tagName
            .toEqual 'IMG'

        expect node.src
            .toEqual imgUrl
