jest
    .dontMock '../View.coffee'

React = require 'react/addons'
TestUtils = React.addons.TestUtils
View = require '../View.coffee'
UploadForm = require '../UploadForm.coffee'
PictureList = require '../PictureList.coffee'
FileSystem = require '../FileSystem.coffee'

describe 'View', ->
    beforeEach ->
        FileSystem::init.mockImplementation -> Promise.resolve()
        FileSystem::getAllFiles.mockImplementation => Promise.resolve()
        @component = TestUtils.renderIntoDocument <View />

    it 'renders PictureList and UploadForms', ->
        list = TestUtils.findRenderedComponentWithType @component, PictureList
        form = TestUtils.findRenderedComponentWithType @component, UploadForm

        expect list
            .toBeDefined()

        expect form
            .toBeDefined()


    pit 'reads all files and fills the state', ->
        fileUrls = ['<url1>', '<url2>']
        FileSystem::getAllFiles.mockImplementation => Promise.resolve(fileUrls)

        @component.componentDidMount()
        .then ()=>
            expect @component.state.pictureUrls
                .toEqual fileUrls








