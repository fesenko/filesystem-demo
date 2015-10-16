jest.dontMock '../PictureList.coffee'
React = require 'react/addons'

TestUtils = React.addons.TestUtils
Picture = require '../Picture.coffee'
PictureList = require '../PictureList.coffee'

describe 'PictureList', ->
    it 'renders a list of images', ->
        imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
        imgUrls = [imgUrl, imgUrl]

        list = TestUtils.renderIntoDocument <PictureList pictureUrls=imgUrls />
        images = TestUtils.findAllInRenderedTree list, (component)->
            return TestUtils.isCompositeComponentWithType component, Picture

        expect images.length
            .toEqual 2
