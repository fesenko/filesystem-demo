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
      if (err || resp.statusCode !== 200) {
        return reject('Cannot fetch the resource');
      } else {
        return resolve(body);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9QaWN0dXJlLmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1BpY3R1cmVMaXN0LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1VwbG9hZEZvcm0uY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvVmlldy5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9kb3dubG9hZGVyLmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL2luZGV4LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL3N0b3JhZ2UuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0FBRVIsT0FBQSxHQUFVLEtBQUssQ0FBQyxXQUFOLENBQ1I7RUFBQSxNQUFBLEVBQVEsU0FBQTtXQUNOLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCLEVBQTJCO01BQUMsS0FBQSxFQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBcEI7S0FBM0I7RUFETSxDQUFSO0NBRFE7O0FBSVYsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNOakIsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0FBQ1IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUjs7QUFFVixXQUFBLEdBQWMsS0FBSyxDQUFDLFdBQU4sQ0FDWjtFQUFBLE1BQUEsRUFBUSxTQUFBO0FBQ04sUUFB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QUQ7aUJBQ0EsTUFBQSxDQUFPLEdBQVA7UUFEQSxDQVRGO01BREs7YUFhUCxJQUFBLENBQUE7SUFoQlUsQ0FBWjtFQURVLENBQVI7QUFIZ0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblxuUGljdHVyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtcInNyY1wiOiAodGhpcy5wcm9wcy51cmwpfSlcblxubW9kdWxlLmV4cG9ydHMgPSBQaWN0dXJlIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblBpY3R1cmUgPSByZXF1aXJlICcuL1BpY3R1cmUuY29mZmVlJ1xuXG5QaWN0dXJlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gIHJlbmRlcjogLT5cbiAgICBwaWN0dXJlcyA9IHRoaXMucHJvcHMucGljdHVyZVVybHMubWFwICh1cmwpLT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGljdHVyZSwge1wia2V5XCI6ICh1cmwpLCBcInVybFwiOiAodXJsKX0pXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIChwaWN0dXJlcykpXG5cbm1vZHVsZS5leHBvcnRzID0gUGljdHVyZUxpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuXG5VcGxvYWRGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgaGFuZGxlU3VibWl0OiAoZXZlbnQpLT5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBmaWxlRWxlbSA9IFJlYWN0LmZpbmRET01Ob2RlIEByZWZzLmZpbGVVUklcbiAgICBmaWxlVVJJID0gZmlsZUVsZW0udmFsdWVcblxuICAgIHRoaXMucHJvcHMub25DaG9vc2VGaWxlcyBmaWxlVVJJXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgZmlsZUVsZW0gPSBSZWFjdC5maW5kRE9NTm9kZSBAcmVmcy5maWxlVVJJXG4gICAgZmlsZUVsZW0udmFsdWUgPSAnaHR0cHM6Ly9zMy1hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tL2IyYi10ZXN0LXZpZGVvL2NpdGllcy9oay5qcGcnXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIHtcIm9uU3VibWl0XCI6IChAaGFuZGxlU3VibWl0KX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwiZm9ybS1ncm91cFwifSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1widHlwZVwiOiBcInRleHRcIiwgXCJjbGFzc05hbWVcIjogXCJmb3JtLWNvbnRyb2xcIiwgXCJwbGFjZWhvbGRlclwiOiBcImZpbGUgVVJJXCIsIFwicmVmXCI6IFwiZmlsZVVSSVwifSlcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XCJ0eXBlXCI6IFwic3VibWl0XCIsIFwiY2xhc3NOYW1lXCI6IFwiYnRuIGJ0bi1kZWZhdWx0XCJ9LCBcIlVwbG9hZFwiKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRGb3JtIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblVwbG9hZEZvcm0gPSByZXF1aXJlICcuL1VwbG9hZEZvcm0uY29mZmVlJ1xuUGljdHVyZUxpc3QgPSByZXF1aXJlICcuL1BpY3R1cmVMaXN0LmNvZmZlZSdcbnN0b3JhZ2UgPSByZXF1aXJlICcuL3N0b3JhZ2UuY29mZmVlJ1xuXG5WaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHBpY3R1cmVVcmxzOiBbXVxuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHN0b3JhZ2UuZ2V0QWxsRmlsZXMoKS50aGVuIChmaWxlVXJscyk9PlxuICAgICAgQHNldFN0YXRlXG4gICAgICAgIHBpY3R1cmVVcmxzOiBmaWxlVXJsc1xuXG4gIHVwbG9hZEZpbGVzOiAoZmlsZUxpc3QpLT5cbiAgICBzdG9yYWdlLnVwbG9hZEZpbGUgZmlsZUxpc3RcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVcGxvYWRGb3JtLCB7XCJvbkNob29zZUZpbGVzXCI6ICh0aGlzLnVwbG9hZEZpbGVzKX0pLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQaWN0dXJlTGlzdCwge1wicGljdHVyZVVybHNcIjogKHRoaXMuc3RhdGUucGljdHVyZVVybHMpfSlcbiAgICApXG5cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IiwieGhyID0gcmVxdWlyZSAneGhyJ1xuXG5leHBvcnRzLmZldGNoID0gKHVybCktPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpLT5cbiAgICAgICAgeGhyXG4gICAgICAgICAgICB1cmk6IHVybFxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJ1xuICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnYmxvYidcbiAgICAgICAgLCAoZXJyLCByZXNwLCBib2R5KS0+XG4gICAgICAgICAgICBpZiBlcnIgfHwgcmVzcC5zdGF0dXNDb2RlICE9IDIwMFxuICAgICAgICAgICAgICAgIHJlamVjdCAnQ2Fubm90IGZldGNoIHRoZSByZXNvdXJjZSdcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXNvbHZlIGJvZHlcbiIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5WaWV3ID0gcmVxdWlyZSAnLi9WaWV3LmNvZmZlZSdcblxuUmVhY3QucmVuZGVyIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVmlldywgbnVsbCksIGRvY3VtZW50LmJvZHlcbiIsImRvd25sb2FkZXIgPSByZXF1aXJlICcuL2Rvd25sb2FkZXIuY29mZmVlJ1xuXG5zaXplID0gMjAgKiAxMDI0ICogMTAyNFxucmVxdWVzdEZTID0gd2luZG93LnJlcXVlc3RGaWxlU3lzdGVtIHx8IHdlYmtpdFJlcXVlc3RGaWxlU3lzdGVtXG5cbnJlcXVlc3RRdW90YSA9IC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpLT5cbiAgICBuYXZpZ2F0b3Iud2Via2l0UGVyc2lzdGVudFN0b3JhZ2UucmVxdWVzdFF1b3RhIHNpemUsIChncmFudGVkQnl0ZXMpLT5cbiAgICAgIHJlc29sdmUgZ3JhbnRlZEJ5dGVzXG4gICAgLCAoZXJyKS0+XG4gICAgICByZWplY3QgZXJyXG5cbmluaXQgPSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KS0+XG4gICAgcmVxdWVzdFF1b3RhKClcbiAgICAudGhlbiAtPlxuICAgICAgcmVxdWVzdEZTIHdpbmRvdy5QRVJTSVNURU5ULCBzaXplLCAoZnMpLT5cbiAgICAgICAgcmVzb2x2ZSBmc1xuICAgICAgLCAoZXJyKS0+XG4gICAgICAgIHJlamVjdCBlcnJcblxuZXhwb3J0cy51cGxvYWRGaWxlID0gKGZpbGVVUkkpLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgIGRvd25sb2FkZXIuZmV0Y2ggZmlsZVVSSVxuICAgIC50aGVuIChibG9iKS0+XG5cbiAgICAgIGluaXQoKS50aGVuIChmcyktPlxuICAgICAgICBmcy5yb290LmdldEZpbGUgRGF0ZS5ub3coKSwge2NyZWF0ZTogdHJ1ZSwgZXhjbHVzaXZlOiB0cnVlfSwgKGZpbGVFbnRyeSktPlxuXG4gICAgICAgICAgZmlsZUVudHJ5LmNyZWF0ZVdyaXRlciAoZmlsZVdyaXRlciktPlxuICAgICAgICAgICAgZmlsZVdyaXRlci5vbndyaXRlZW5kID0gKGUpLT5cbiAgICAgICAgICAgICAgY29uc29sZS5sb2cgJy0tY29tcGxldGVkJ1xuICAgICAgICAgICAgICByZXNvbHZlKClcblxuICAgICAgICAgICAgZmlsZVdyaXRlci5vbmVycm9yID0gKGUpLT5cbiAgICAgICAgICAgICAgY29uc29sZS5sb2cgJy0tZXJyb3InXG4gICAgICAgICAgICAgIHJlamVjdCgpXG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICctLSBibG9iJywgYmxvYlxuICAgICAgICAgICAgZmlsZVdyaXRlci53cml0ZSBibG9iXG4gICAgICAgICAgLCAoZXJyKS0+XG4gICAgICAgICAgICByZWplY3QgZXJyXG5cbiAgICAgICAgLCAoZXJyKS0+XG4gICAgICAgICAgcmVqZWN0IGVyclxuXG4gICAgLmNhdGNoIC0+XG4gICAgICBjb25zb2xlLmxvZyAnZXJyb3InXG4gICAgICByZXNvbHZlKClcblxuZXhwb3J0cy5nZXRBbGxGaWxlcyA9IC0+XG4gIGZpbGVzID0gW11cblxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KS0+XG4gICAgaW5pdCgpLnRoZW4gKGZzKS0+XG4gICAgICBkaXJSZWFkZXIgPSBmcy5yb290LmNyZWF0ZVJlYWRlcigpXG5cbiAgICAgIHJlYWQgPSAtPlxuICAgICAgICBkaXJSZWFkZXIucmVhZEVudHJpZXMgKGZpbGVFbnRyaWVzKS0+XG4gICAgICAgICAgaWYgIWZpbGVFbnRyaWVzLmxlbmd0aFxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ2ZpbGVzJywgZmlsZXMubGVuZ3RoXG4gICAgICAgICAgICByZXNvbHZlIGZpbGVzXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVVybHMgPSBmaWxlRW50cmllcy5tYXAgKGZpbGVFbnRyeSktPiBmaWxlRW50cnkudG9VUkwoKVxuICAgICAgICAgICAgZmlsZXMgPSBmaWxlcy5jb25jYXQgZmlsZVVybHNcblxuICAgICAgICAgICAgcmVhZCgpXG4gICAgICAgICwgKGVyciktPlxuICAgICAgICAgIHJlamVjdCBlcnJcblxuICAgICAgcmVhZCgpXG5cbiJdfQ==
