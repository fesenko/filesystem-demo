jest.dontMock '../UploadForm.coffee'
React = require 'react/addons'

TestUtils = React.addons.TestUtils
UploadForm = require '../UploadForm.coffee'

describe 'UploadForm', ->
    beforeEach ->
        @cb = jest.genMockFn().mockImplementation -> Promise.resolve()
        @component = TestUtils.renderIntoDocument <UploadForm onSubmit=@cb />
        @form = TestUtils.findRenderedDOMComponentWithTag @component, 'form'

    it 'renders the form', ->
        expect @form
            .toBeDefined()

    it 'calls the submit callback stored in the props', ->
        inputValue = 'foo'
        input = TestUtils.findRenderedDOMComponentWithTag @component, 'input'
        input.getDOMNode().value = inputValue

        TestUtils.Simulate.submit @form

        expect @cb
            .toBeCalledWith inputValue





