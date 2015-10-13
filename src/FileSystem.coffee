uuid = require 'node-uuid'
Filer = require '@phated/filer'
defaultSize = 20 * 1024 * 1024

class FileSystem
    constructor: (@size=defaultSize, @isPersistent=true)->
        @filer = new Filer()

    init: ->
        new Promise (resolve, reject)=>
            @filer.init persistent: @isPersistent, size: @size, resolve, reject

    uploadFile: (blob)->
        new Promise (resolve, reject)=>
            @filer.write uuid.v4(), data: blob, ->
                resolve()
            , reject

    getAllFiles: ->
        new Promise (resolve, reject)=>
            @filer.ls '/', (entries)->
                fileURLs = entries.map (entry)-> entry.toURL()
                resolve fileURLs
            , reject

module.exports = FileSystem
