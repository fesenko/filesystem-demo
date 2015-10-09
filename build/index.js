(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Picture, React;

React = require('React');

Picture = React.createClass({displayName: "Picture",
  render: function() {
    return React.createElement("img", {
      "src": this.props.url
    });
  }
});

module.exports = Picture;


},{"React":"React"}],2:[function(require,module,exports){
var Picture, PictureList, React;

React = require('React');

Picture = require('./Picture.coffee');

PictureList = React.createClass({displayName: "PictureList",
  render: function() {
    var pictures;
    pictures = this.props.pictureUrls.map(function(url) {
      return React.createElement(Picture, {
        "key": url,
        "url": url
      });
    });
    return React.createElement("div", null, pictures);
  }
});

module.exports = PictureList;


},{"./Picture.coffee":1,"React":"React"}],3:[function(require,module,exports){
var React, UploadForm;

React = require('React');

UploadForm = React.createClass({displayName: "UploadForm",
  handleSubmit: function(event) {
    var fileElem, fileURI;
    event.preventDefault();
    fileElem = React.findDOMNode(this.refs.fileURI);
    fileURI = fileElem.value;
    return this.props.onChooseFiles(fileURI);
  },
  componentDidMount: function() {
    var fileElem;
    fileElem = React.findDOMNode(this.refs.fileURI);
    return fileElem.value = 'https://s3-ap-northeast-1.amazonaws.com/b2b-test-video/cities/hk.jpg';
  },
  render: function() {
    return React.createElement("div", null, React.createElement("form", {
      "onSubmit": this.handleSubmit
    }, React.createElement("div", {
      "className": "form-group"
    }, React.createElement("input", {
      "type": "text",
      "className": "form-control",
      "placeholder": "file URI",
      "ref": "fileURI"
    })), React.createElement("button", {
      "type": "submit",
      "className": "btn btn-default"
    }, "Upload")));
  }
});

module.exports = UploadForm;


},{"React":"React"}],4:[function(require,module,exports){
var PictureList, React, UploadForm, View, storage;

React = require('React');

UploadForm = require('./UploadForm.coffee');

PictureList = require('./PictureList.coffee');

storage = require('./storage.coffee');

View = React.createClass({displayName: "View",
  getInitialState: function() {
    return {
      pictureUrls: []
    };
  },
  componentDidMount: function() {
    return storage.getAllFiles().then((function(_this) {
      return function(fileUrls) {
        return _this.setState({
          pictureUrls: fileUrls
        });
      };
    })(this));
  },
  uploadFiles: function(fileList) {
    return storage.uploadFile(fileList);
  },
  render: function() {
    return React.createElement("div", null, React.createElement(UploadForm, {
      "onChooseFiles": this.uploadFiles
    }), React.createElement(PictureList, {
      "pictureUrls": this.state.pictureUrls
    }));
  }
});

module.exports = View;


},{"./PictureList.coffee":2,"./UploadForm.coffee":3,"./storage.coffee":7,"React":"React"}],5:[function(require,module,exports){
var xhr;

xhr = require('xhr');

exports.fetch = function(url) {
  return new Promise(function(resolve, reject) {
    return xhr({
      uri: url,
      method: 'GET',
      responseType: 'blob'
    }, function(err, resp, body) {
      if (resp.statusCode === 200) {
        return resolve(body);
      } else {
        return reject();
      }
    });
  });
};


},{"xhr":"xhr"}],6:[function(require,module,exports){
var React, View;

React = require('React');

View = require('./View.coffee');

React.render(React.createElement(View, null), document.body);


},{"./View.coffee":4,"React":"React"}],7:[function(require,module,exports){
var downloader, init, requestFS, requestQuota, size;

downloader = require('./downloader.coffee');

size = 20 * 1024 * 1024;

requestFS = window.requestFileSystem || webkitRequestFileSystem;

requestQuota = function() {
  return new Promise(function(resolve, reject) {
    return navigator.webkitPersistentStorage.requestQuota(size, function(grantedBytes) {
      return resolve(grantedBytes);
    }, function(err) {
      return reject(err);
    });
  });
};

init = function() {
  return new Promise(function(resolve, reject) {
    return requestQuota().then(function() {
      return requestFS(window.PERSISTENT, size, function(fs) {
        return resolve(fs);
      }, function(err) {
        return reject(err);
      });
    });
  });
};

exports.uploadFile = function(fileURI) {
  return new Promise(function(resolve, reject) {
    return downloader.fetch(fileURI).then(function(blob) {
      return init().then(function(fs) {
        return fs.root.getFile(Date.now(), {
          create: true,
          exclusive: true
        }, function(fileEntry) {
          return fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
              console.log('--completed');
              return resolve();
            };
            fileWriter.onerror = function(e) {
              console.log('--error');
              return reject();
            };
            console.log('-- blob', blob);
            return fileWriter.write(blob);
          }, function(err) {
            return reject(err);
          });
        }, function(err) {
          return reject(err);
        });
      });
    })["catch"](function() {
      console.log('error');
      return resolve();
    });
  });
};

exports.getAllFiles = function() {
  var files;
  files = [];
  return new Promise(function(resolve, reject) {
    return init().then(function(fs) {
      var dirReader, read;
      dirReader = fs.root.createReader();
      read = function() {
        return dirReader.readEntries(function(fileEntries) {
          var fileUrls;
          if (!fileEntries.length) {
            console.log('files', files.length);
            return resolve(files);
          } else {
            fileUrls = fileEntries.map(function(fileEntry) {
              return fileEntry.toURL();
            });
            files = files.concat(fileUrls);
            return read();
          }
        }, function(err) {
          return reject(err);
        });
      };
      return read();
    });
  });
};


},{"./downloader.coffee":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9QaWN0dXJlLmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1BpY3R1cmVMaXN0LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1VwbG9hZEZvcm0uY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvVmlldy5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9kb3dubG9hZGVyLmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL2luZGV4LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL3N0b3JhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0FBRVIsT0FBQSxHQUFVLEtBQUssQ0FBQyxXQUFOLENBQ1I7RUFBQSxNQUFBLEVBQVEsU0FBQTtXQUNOLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCLEVBQTJCO01BQUMsS0FBQSxFQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBcEI7S0FBM0I7RUFETSxDQUFSO0NBRFE7O0FBSVYsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNOakIsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0FBQ1IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUjs7QUFFVixXQUFBLEdBQWMsS0FBSyxDQUFDLFdBQU4sQ0FDWjtFQUFBLE1BQUEsRUFBUSxTQUFBO0FBQ04sUUFB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QU8sR0FBUDtRQURBLENBVEY7TUFESzthQWFQLElBQUEsQ0FBQTtJQWhCVSxDQUFaO0VBRFUsQ0FBUjtBQUhnQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuXG5QaWN0dXJlID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwge1wic3JjXCI6ICh0aGlzLnByb3BzLnVybCl9KVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpY3R1cmUiLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuUGljdHVyZSA9IHJlcXVpcmUgJy4vUGljdHVyZS5jb2ZmZWUnXG5cblBpY3R1cmVMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgcmVuZGVyOiAtPlxuICAgIHBpY3R1cmVzID0gdGhpcy5wcm9wcy5waWN0dXJlVXJscy5tYXAgKHVybCktPlxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQaWN0dXJlLCB7XCJrZXlcIjogKHVybCksIFwidXJsXCI6ICh1cmwpfSlcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgKHBpY3R1cmVzKSlcblxubW9kdWxlLmV4cG9ydHMgPSBQaWN0dXJlTGlzdCIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5cblVwbG9hZEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuICBoYW5kbGVTdWJtaXQ6IChldmVudCktPlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGZpbGVFbGVtID0gUmVhY3QuZmluZERPTU5vZGUgQHJlZnMuZmlsZVVSSVxuICAgIGZpbGVVUkkgPSBmaWxlRWxlbS52YWx1ZVxuXG4gICAgdGhpcy5wcm9wcy5vbkNob29zZUZpbGVzIGZpbGVVUklcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICBmaWxlRWxlbSA9IFJlYWN0LmZpbmRET01Ob2RlIEByZWZzLmZpbGVVUklcbiAgICBmaWxlRWxlbS52YWx1ZSA9ICdodHRwczovL3MzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYjJiLXRlc3QtdmlkZW8vY2l0aWVzL2hrLmpwZydcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwge1wib25TdWJtaXRcIjogKEBoYW5kbGVTdWJtaXQpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJmb3JtLWdyb3VwXCJ9LFxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XCJ0eXBlXCI6IFwidGV4dFwiLCBcImNsYXNzTmFtZVwiOiBcImZvcm0tY29udHJvbFwiLCBcInBsYWNlaG9sZGVyXCI6IFwiZmlsZSBVUklcIiwgXCJyZWZcIjogXCJmaWxlVVJJXCJ9KVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHtcInR5cGVcIjogXCJzdWJtaXRcIiwgXCJjbGFzc05hbWVcIjogXCJidG4gYnRuLWRlZmF1bHRcIn0sIFwiVXBsb2FkXCIpXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZEZvcm0iLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuVXBsb2FkRm9ybSA9IHJlcXVpcmUgJy4vVXBsb2FkRm9ybS5jb2ZmZWUnXG5QaWN0dXJlTGlzdCA9IHJlcXVpcmUgJy4vUGljdHVyZUxpc3QuY29mZmVlJ1xuc3RvcmFnZSA9IHJlcXVpcmUgJy4vc3RvcmFnZS5jb2ZmZWUnXG5cblZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgcGljdHVyZVVybHM6IFtdXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgc3RvcmFnZS5nZXRBbGxGaWxlcygpLnRoZW4gKGZpbGVVcmxzKT0+XG4gICAgICBAc2V0U3RhdGVcbiAgICAgICAgcGljdHVyZVVybHM6IGZpbGVVcmxzXG5cbiAgdXBsb2FkRmlsZXM6IChmaWxlTGlzdCktPlxuICAgIHN0b3JhZ2UudXBsb2FkRmlsZSBmaWxlTGlzdFxuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVwbG9hZEZvcm0sIHtcIm9uQ2hvb3NlRmlsZXNcIjogKHRoaXMudXBsb2FkRmlsZXMpfSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBpY3R1cmVMaXN0LCB7XCJwaWN0dXJlVXJsc1wiOiAodGhpcy5zdGF0ZS5waWN0dXJlVXJscyl9KVxuICAgIClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXciLCJ4aHIgPSByZXF1aXJlICd4aHInXG5cbmV4cG9ydHMuZmV0Y2ggPSAodXJsKS0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgICAgICB4aHJcbiAgICAgICAgICAgIHVyaTogdXJsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXG4gICAgICAgICAgICByZXNwb25zZVR5cGU6ICdibG9iJ1xuICAgICAgICAsIChlcnIsIHJlc3AsIGJvZHkpLT5cbiAgICAgICAgICAgIGlmIHJlc3Auc3RhdHVzQ29kZSA9PSAyMDBcbiAgICAgICAgICAgICAgICByZXNvbHZlIGJvZHlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZWplY3QoKVxuXG4jIGV4cG9ydHMuZmV0Y2ggPSAodXJsKS0+XG4jICAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KS0+XG4jICAgICAgICAgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiMgICAgICAgICB4aHIub3BlbiAnR0VUJywgdXJsXG4jICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuXG4jICAgICAgICAgeGhyLm9ubG9hZCA9IChlKS0+XG4jICAgICAgICAgICAgIGlmIHRoaXMuc3RhdHVzID09IDIwMFxuIyAgICAgICAgICAgICAgICAgcmVzb2x2ZSB0aGlzLnJlc3BvbnNlXG4jICAgICAgICAgICAgIGVsc2VcbiMgICAgICAgICAgICAgICAgIHJlamVjdCgpXG5cbiMgICAgICAgICB4aHIuc2VuZCgpXG4iLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuVmlldyA9IHJlcXVpcmUgJy4vVmlldy5jb2ZmZWUnXG5cblJlYWN0LnJlbmRlciBSZWFjdC5jcmVhdGVFbGVtZW50KFZpZXcsIG51bGwpLCBkb2N1bWVudC5ib2R5XG4iLCJkb3dubG9hZGVyID0gcmVxdWlyZSAnLi9kb3dubG9hZGVyLmNvZmZlZSdcblxuc2l6ZSA9IDIwICogMTAyNCAqIDEwMjRcbnJlcXVlc3RGUyA9IHdpbmRvdy5yZXF1ZXN0RmlsZVN5c3RlbSB8fCB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbVxuXG5yZXF1ZXN0UXVvdGEgPSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KS0+XG4gICAgbmF2aWdhdG9yLndlYmtpdFBlcnNpc3RlbnRTdG9yYWdlLnJlcXVlc3RRdW90YSBzaXplLCAoZ3JhbnRlZEJ5dGVzKS0+XG4gICAgICByZXNvbHZlIGdyYW50ZWRCeXRlc1xuICAgICwgKGVyciktPlxuICAgICAgcmVqZWN0IGVyclxuXG5pbml0ID0gLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgIHJlcXVlc3RRdW90YSgpXG4gICAgLnRoZW4gLT5cbiAgICAgIHJlcXVlc3RGUyB3aW5kb3cuUEVSU0lTVEVOVCwgc2l6ZSwgKGZzKS0+XG4gICAgICAgIHJlc29sdmUgZnNcbiAgICAgICwgKGVyciktPlxuICAgICAgICByZWplY3QgZXJyXG5cbmV4cG9ydHMudXBsb2FkRmlsZSA9IChmaWxlVVJJKS0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpLT5cbiAgICBkb3dubG9hZGVyLmZldGNoIGZpbGVVUklcbiAgICAudGhlbiAoYmxvYiktPlxuXG4gICAgICBpbml0KCkudGhlbiAoZnMpLT5cbiAgICAgICAgZnMucm9vdC5nZXRGaWxlIERhdGUubm93KCksIHtjcmVhdGU6IHRydWUsIGV4Y2x1c2l2ZTogdHJ1ZX0sIChmaWxlRW50cnkpLT5cblxuICAgICAgICAgIGZpbGVFbnRyeS5jcmVhdGVXcml0ZXIgKGZpbGVXcml0ZXIpLT5cbiAgICAgICAgICAgIGZpbGVXcml0ZXIub253cml0ZWVuZCA9IChlKS0+XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nICctLWNvbXBsZXRlZCdcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpXG5cbiAgICAgICAgICAgIGZpbGVXcml0ZXIub25lcnJvciA9IChlKS0+XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nICctLWVycm9yJ1xuICAgICAgICAgICAgICByZWplY3QoKVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAnLS0gYmxvYicsIGJsb2JcbiAgICAgICAgICAgIGZpbGVXcml0ZXIud3JpdGUgYmxvYlxuICAgICAgICAgICwgKGVyciktPlxuICAgICAgICAgICAgcmVqZWN0IGVyclxuXG4gICAgICAgICwgKGVyciktPlxuICAgICAgICAgIHJlamVjdCBlcnJcblxuICAgIC5jYXRjaCAtPlxuICAgICAgY29uc29sZS5sb2cgJ2Vycm9yJ1xuICAgICAgcmVzb2x2ZSgpXG5cbmV4cG9ydHMuZ2V0QWxsRmlsZXMgPSAtPlxuICBmaWxlcyA9IFtdXG5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgIGluaXQoKS50aGVuIChmcyktPlxuICAgICAgZGlyUmVhZGVyID0gZnMucm9vdC5jcmVhdGVSZWFkZXIoKVxuXG4gICAgICByZWFkID0gLT5cbiAgICAgICAgZGlyUmVhZGVyLnJlYWRFbnRyaWVzIChmaWxlRW50cmllcyktPlxuICAgICAgICAgIGlmICFmaWxlRW50cmllcy5sZW5ndGhcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICdmaWxlcycsIGZpbGVzLmxlbmd0aFxuICAgICAgICAgICAgcmVzb2x2ZSBmaWxlc1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZpbGVVcmxzID0gZmlsZUVudHJpZXMubWFwIChmaWxlRW50cnkpLT4gZmlsZUVudHJ5LnRvVVJMKClcbiAgICAgICAgICAgIGZpbGVzID0gZmlsZXMuY29uY2F0IGZpbGVVcmxzXG5cbiAgICAgICAgICAgIHJlYWQoKVxuICAgICAgICAsIChlcnIpLT5cbiAgICAgICAgICByZWplY3QgZXJyXG5cbiAgICAgIHJlYWQoKVxuXG4iXX0=
