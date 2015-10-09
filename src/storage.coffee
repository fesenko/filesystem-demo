downloader = require './downloader.coffee'

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
    downloader.fetch fileURI
    .then (blob)->

      init().then (fs)->
        fs.root.getFile Date.now(), {create: true, exclusive: true}, (fileEntry)->

          fileEntry.createWriter (fileWriter)->
            fileWriter.onwriteend = (e)->
              console.log '--completed'
              resolve()

            fileWriter.onerror = (e)->
              console.log '--error'
              reject()

            console.log '-- blob', blob
            fileWriter.write blob
          , (err)->
            reject err

        , (err)->
          reject err

    .catch ->
      console.log 'error'
      resolve()

exports.getAllFiles = ->
  files = []

  new Promise (resolve, reject)->
    init().then (fs)->
      dirReader = fs.root.createReader()

      read = ->
        dirReader.readEntries (fileEntries)->
          if !fileEntries.length
            console.log 'files', files.length
            resolve files
          else
            fileUrls = fileEntries.map (fileEntry)-> fileEntry.toURL()
            files = files.concat fileUrls

            read()
        , (err)->
          reject err

      read()

