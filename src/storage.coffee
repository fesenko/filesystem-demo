require 'promise-polyfill'

exports.getAllPictures = ->
  new Promise (resolve)->
    resolve [
      'https://pbs.twimg.com/profile_images/447460759329460224/mt2UmwGG_400x400.jpeg'
    ]


exports.removePicture = ->


exports.uploadPicture = ->