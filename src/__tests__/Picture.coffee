jest.dontMock '../Picture.coffee'
React = require 'react/addons'

TestUtils = React.addons.TestUtils
Picture = require '../Picture.coffee'

describe 'Picture', ->
    it 'renders an image', ->
        imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

        renderedComponent = TestUtils.renderIntoDocument <Picture url=imgUrl />
        elem = React.findDOMNode renderedComponent

        expect elem.tagName
            .toEqual 'IMG'

        expect elem.src
            .toEqual imgUrl
