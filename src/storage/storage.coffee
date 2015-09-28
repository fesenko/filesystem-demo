require 'promise-polyfill'

size = 20 * 1024 * 1024
requestFS = window.requestFileSystem || webkitRequestFileSystem

requestQuota = ->
  new Promise (resolve, reject)->
    navigator.webkitPersistentStorage.requestQuota size, (grantedBytes)->
      resolve grantedBytes
    , (err)->
      reject err

init = ->
  new Promise (resolve, reject)->
    requestQuota()
    .then ->
      requestFS window.PERSISTENT, size, (fs)->
        resolve fs
      , (err)->
        reject err

exports.uploadFile = (fileURI)->
  new Promise (resolve, reject)->
    console.log fileURI
    return resolve()
    # init().then (fs)->
    #   fs.root.getFile Date.now(), {create: true, exclusive: true}, (fileEntry)->

    #     fileEntry.createWriter (fileWriter)->
    #       fileWriter.write file
    #     , (err)->
    #       reject err

    #   , (err)->
    #     reject err

exports.getAllFiles = ->
  files = []

  new Promise (resolve, reject)->
    init().then (fs)->
      dirReader = fs.root.createReader()

      read = ->
        dirReader.readEntries (fileEntries)->
          if !fileEntries.length
            resolve files
          else
            fileUrls = fileEntries.map (fileEntry)-> fileEntry.toURL()
            files = files.concat fileUrls

            read()
        , (err)->
          reject err

      read()

