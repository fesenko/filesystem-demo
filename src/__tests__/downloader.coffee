jest
    .dontMock '../downloader.coffee'

describe 'Downloader', ->
    xhr = require 'xhr'
    downloader = require '../downloader.coffee'

    describe 'fetch', ->
        url = '<url>'
        blobResult = '<blobResult>'

        it 'calls into xhr with the correct params', ->
            downloader.fetch url

            expect xhr
                .toBeCalledWith
                    uri: url
                    method: 'GET'
                    responseType: 'blob'
                    , jasmine.any Function

        pit 'resolves the promise with the received result', ->
            xhr.mockImplementation (params, cb)->
                cb null, statusCode: 200, blobResult

            downloader.fetch url
            .then (response)->
                expect response
                    .toEqual blobResult

