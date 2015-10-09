xhr = require 'xhr'

exports.fetch = (url)->
    new Promise (resolve, reject)->
        xhr
            uri: url
            method: 'GET'
            responseType: 'blob'
        , (err, resp, body)->
            if resp.statusCode == 200
                resolve body
            else
                reject()
