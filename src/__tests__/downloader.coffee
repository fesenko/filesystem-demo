jest.dontMock '../downloader.coffee'

describe 'Downloader', ->
    xhr = require 'xhr'
    downloader = require '../downloader.coffee'

    describe 'fetch', ->
        url = '<url>'
        blobResult = '<blobResult>'

        describe 'when no errors occur', ->
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

        describe 'when there is an error that prevents sending the request', ->
            pit 'rejects the promise with the error', ->
                xhr.mockImplementation (params, cb)->
                    cb 'Cannot send the request'

                downloader.fetch url
                .catch (err)->
                    expect err
                        .toEqual 'Cannot fetch the resource'

        describe 'when there is a HTTP error', ->
            pit 'rejects the promise with the error', ->
                xhr.mockImplementation (params, cb)->
                    cb null, statusCode: 500

                downloader.fetch url
                .catch (err)->
                    expect err
                        .toEqual 'Cannot fetch the resource'


