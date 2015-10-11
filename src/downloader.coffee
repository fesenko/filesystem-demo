xhr = require 'xhr'

exports.fetch = (url)->
    new Promise (resolve, reject)->
        xhr
            uri: url
            method: 'GET'
            responseType: 'blob'
        , (err, resp, body)->
            if err || resp.statusCode != 200
                reject 'Cannot fetch the resource'
            else
                resolve body
