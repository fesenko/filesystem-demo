jest.dontMock '../FileSystem.coffee'
anyFunc = jasmine.any Function
uuid = require 'node-uuid'
FileSystem = require '../FileSystem.coffee'

describe 'FileSystem', ->
    beforeEach ->
        @fs = new FileSystem()

    describe 'as a Constructor', ->
        it 'creates an instance', ->
            expect @fs
                .toBeDefined()

            expect @fs.filer
                .toBeDefined()

    describe 'init', ->
        beforeEach ->
          @fs.filer.init.mockImplementation (persistent, size, onSuccess, onError)->
                onSuccess()

        pit 'calls the method init of the filer instance', ->
            @fs.init()
            .then =>
                expect @fs.filer.init
                    .toBeCalledWith
                        persistent: true
                        size: 20 * 1024 * 1024

    describe 'uploadFile', ->
        beforeEach ->
            uuid.v4.mockImplementation -> '<uuid>'
            @fs.filer.write.mockImplementation (name, data, onSuccess, onError)->
                onSuccess()

        pit 'calls the method write of the filer instance', ->
            @fs.uploadFile '<blob>'
            .then =>
                expect @fs.filer.write
                    .toBeCalledWith '<uuid>', data: '<blob>', anyFunc, anyFunc

    describe 'getAllFiles', ->
        beforeEach ->
            @mockEntry =
                toURL: -> '<url>'

            @fs.filer.ls.mockImplementation (path, cb)=>
                cb [@mockEntry]

        pit 'calls the method ls of the filer instance', ->
            @fs.getAllFiles()
            .then (fileUrls)=>
                expect @fs.filer.ls
                    .toBeCalledWith '/', anyFunc, anyFunc

                expect fileUrls
                    .toEqual ['<url>']



