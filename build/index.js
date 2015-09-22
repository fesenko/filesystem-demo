(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React, View;

React = require('React');

View = require('./view/view.coffee');

React.render(React.createElement(View, null), document.body);


},{"./view/view.coffee":6,"React":"React"}],2:[function(require,module,exports){
var Picture, PictureList, React;

React = require('React');

Picture = require('../picture/picture.coffee');

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


},{"../picture/picture.coffee":3,"React":"React"}],3:[function(require,module,exports){
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


},{"React":"React"}],4:[function(require,module,exports){
var init, requestFS, requestQuota, size, uploadFile;

require('promise-polyfill');

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

uploadFile = function(file) {
  return new Promise(function(resolve, reject) {
    return init().then(function(fs) {
      return fs.root.getFile(file.name, {
        create: true,
        exclusive: true
      }, function(fileEntry) {
        return fileEntry.createWriter(function(fileWriter) {
          return fileWriter.write(file);
        }, function(err) {
          return reject(err);
        });
      }, function(err) {
        return reject(err);
      });
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

exports.removeFile = function() {};

exports.uploadFiles = function(fileList) {
  var file, i, j, length, promises, ref;
  length = fileList.length;
  promises = [];
  for (i = j = 0, ref = length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    file = fileList[i];
    promises.push(uploadFile(file));
  }
  return Promise.all(promises);
};


},{"promise-polyfill":"promise-polyfill"}],5:[function(require,module,exports){
var React, UploadForm;

React = require('React');

UploadForm = React.createClass({displayName: "UploadForm",
  handleSubmit: function(event) {
    var fileElem;
    event.preventDefault();
    fileElem = React.findDOMNode(this.refs.file);
    return this.props.onChooseFiles(fileElem.files);
  },
  render: function() {
    return React.createElement("div", null, React.createElement("form", {
      "onSubmit": this.handleSubmit
    }, React.createElement("input", {
      "type": 'file',
      "ref": 'file'
    }), React.createElement("input", {
      "type": 'submit',
      "value": 'Upload'
    })));
  }
});

module.exports = UploadForm;


},{"React":"React"}],6:[function(require,module,exports){
var PictureList, React, UploadForm, View, storage;

React = require('React');

UploadForm = require('../upload-form/upload-form.coffee');

PictureList = require('../picture-list/picture-list.coffee');

storage = require('../storage/storage.coffee');

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
    return storage.uploadFiles(fileList);
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


},{"../picture-list/picture-list.coffee":2,"../storage/storage.coffee":4,"../upload-form/upload-form.coffee":5,"React":"React"}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9waWN0dXJlLWxpc3QvcGljdHVyZS1saXN0LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL3BpY3R1cmUvcGljdHVyZS5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9zdG9yYWdlL3N0b3JhZ2UuY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvdXBsb2FkLWZvcm0vdXBsb2FkLWZvcm0uY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvdmlldy92aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLElBQUEsR0FBTyxPQUFBLENBQVEsb0JBQVI7O0FBRVAsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFLLENBQUMsYUFBTixDQUFvQixJQUFwQixFQUEwQixJQUExQixDQUFiLEVBQThDLFFBQVEsQ0FBQyxJQUF2RDs7OztBQ0hBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLE9BQUEsR0FBVSxPQUFBLENBQVEsMkJBQVI7O0FBRVYsV0FBQSxHQUFjLEtBQUssQ0FBQyxXQUFOLENBQ1o7RUFBQSxNQUFBLEVBQVEsU0FBQTtBQUNOLFFBQUE7SUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBdkIsQ0FBMkIsU0FBQyxHQUFEO2FBQ3BD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TixDQUFvQixXQUFwQixFQUFpQztNQUFDLGFBQUEsRUFBZ0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUE1QjtLQUFqQyxDQUZGO0VBRE0sQ0FYUjtDQURLOztBQW1CUCxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuVmlldyA9IHJlcXVpcmUgJy4vdmlldy92aWV3LmNvZmZlZSdcblxuUmVhY3QucmVuZGVyIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVmlldywgbnVsbCksIGRvY3VtZW50LmJvZHlcbiIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5QaWN0dXJlID0gcmVxdWlyZSAnLi4vcGljdHVyZS9waWN0dXJlLmNvZmZlZSdcblxuUGljdHVyZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICByZW5kZXI6IC0+XG4gICAgcGljdHVyZXMgPSB0aGlzLnByb3BzLnBpY3R1cmVVcmxzLm1hcCAodXJsKS0+XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBpY3R1cmUsIHtcImtleVwiOiAodXJsKSwgXCJ1cmxcIjogKHVybCl9KVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCAocGljdHVyZXMpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpY3R1cmVMaXN0IiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblxuUGljdHVyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtcInNyY1wiOiAodGhpcy5wcm9wcy51cmwpfSlcblxubW9kdWxlLmV4cG9ydHMgPSBQaWN0dXJlIiwicmVxdWlyZSAncHJvbWlzZS1wb2x5ZmlsbCdcblxuc2l6ZSA9IDIwICogMTAyNCAqIDEwMjRcbnJlcXVlc3RGUyA9IHdpbmRvdy5yZXF1ZXN0RmlsZVN5c3RlbSB8fCB3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbVxuXG5yZXF1ZXN0UXVvdGEgPSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KS0+XG4gICAgbmF2aWdhdG9yLndlYmtpdFBlcnNpc3RlbnRTdG9yYWdlLnJlcXVlc3RRdW90YSBzaXplLCAoZ3JhbnRlZEJ5dGVzKS0+XG4gICAgICByZXNvbHZlIGdyYW50ZWRCeXRlc1xuICAgICwgKGVyciktPlxuICAgICAgcmVqZWN0IGVyclxuXG5pbml0ID0gLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgIHJlcXVlc3RRdW90YSgpXG4gICAgLnRoZW4gLT5cbiAgICAgIHJlcXVlc3RGUyB3aW5kb3cuUEVSU0lTVEVOVCwgc2l6ZSwgKGZzKS0+XG4gICAgICAgIHJlc29sdmUgZnNcbiAgICAgICwgKGVyciktPlxuICAgICAgICByZWplY3QgZXJyXG5cbnVwbG9hZEZpbGUgPSAoZmlsZSktPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KS0+XG4gICAgaW5pdCgpLnRoZW4gKGZzKS0+XG4gICAgICBmcy5yb290LmdldEZpbGUgZmlsZS5uYW1lLCB7Y3JlYXRlOiB0cnVlLCBleGNsdXNpdmU6IHRydWV9LCAoZmlsZUVudHJ5KS0+XG5cbiAgICAgICAgZmlsZUVudHJ5LmNyZWF0ZVdyaXRlciAoZmlsZVdyaXRlciktPlxuICAgICAgICAgIGZpbGVXcml0ZXIud3JpdGUgZmlsZVxuICAgICAgICAsIChlcnIpLT5cbiAgICAgICAgICByZWplY3QgZXJyXG5cbiAgICAgICwgKGVyciktPlxuICAgICAgICByZWplY3QgZXJyXG5cbmV4cG9ydHMuZ2V0QWxsRmlsZXMgPSAtPlxuICBmaWxlcyA9IFtdXG5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgIGluaXQoKS50aGVuIChmcyktPlxuICAgICAgZGlyUmVhZGVyID0gZnMucm9vdC5jcmVhdGVSZWFkZXIoKVxuXG4gICAgICByZWFkID0gLT5cbiAgICAgICAgZGlyUmVhZGVyLnJlYWRFbnRyaWVzIChmaWxlRW50cmllcyktPlxuICAgICAgICAgIGlmICFmaWxlRW50cmllcy5sZW5ndGhcbiAgICAgICAgICAgIHJlc29sdmUgZmlsZXNcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBmaWxlVXJscyA9IGZpbGVFbnRyaWVzLm1hcCAoZmlsZUVudHJ5KS0+IGZpbGVFbnRyeS50b1VSTCgpXG4gICAgICAgICAgICBmaWxlcyA9IGZpbGVzLmNvbmNhdCBmaWxlVXJsc1xuXG4gICAgICAgICAgICByZWFkKClcbiAgICAgICAgLCAoZXJyKS0+XG4gICAgICAgICAgcmVqZWN0IGVyclxuXG4gICAgICByZWFkKClcblxuZXhwb3J0cy5yZW1vdmVGaWxlID0gLT5cblxuZXhwb3J0cy51cGxvYWRGaWxlcyA9IChmaWxlTGlzdCktPlxuICBsZW5ndGggPSBmaWxlTGlzdC5sZW5ndGhcbiAgcHJvbWlzZXMgPSBbXVxuXG4gIGZvciBpIGluIFswLi5sZW5ndGggLSAxXVxuICAgIGZpbGUgPSBmaWxlTGlzdFtpXVxuICAgIHByb21pc2VzLnB1c2ggdXBsb2FkRmlsZShmaWxlKVxuXG4gIHJldHVybiBQcm9taXNlLmFsbCBwcm9taXNlc1xuIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblxuVXBsb2FkRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gIGhhbmRsZVN1Ym1pdDogKGV2ZW50KS0+XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgZmlsZUVsZW0gPSBSZWFjdC5maW5kRE9NTm9kZSBAcmVmcy5maWxlXG5cbiAgICB0aGlzLnByb3BzLm9uQ2hvb3NlRmlsZXMgZmlsZUVsZW0uZmlsZXNcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwge1wib25TdWJtaXRcIjogKEBoYW5kbGVTdWJtaXQpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcInR5cGVcIjogJ2ZpbGUnLCBcInJlZlwiOiAnZmlsZSd9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcInR5cGVcIjogJ3N1Ym1pdCcsIFwidmFsdWVcIjogJ1VwbG9hZCd9KVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRGb3JtIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblVwbG9hZEZvcm0gPSByZXF1aXJlICcuLi91cGxvYWQtZm9ybS91cGxvYWQtZm9ybS5jb2ZmZWUnXG5QaWN0dXJlTGlzdCA9IHJlcXVpcmUgJy4uL3BpY3R1cmUtbGlzdC9waWN0dXJlLWxpc3QuY29mZmVlJ1xuc3RvcmFnZSA9IHJlcXVpcmUgJy4uL3N0b3JhZ2Uvc3RvcmFnZS5jb2ZmZWUnXG5cblZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgcGljdHVyZVVybHM6IFtdXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgc3RvcmFnZS5nZXRBbGxGaWxlcygpLnRoZW4gKGZpbGVVcmxzKT0+XG4gICAgICBAc2V0U3RhdGVcbiAgICAgICAgcGljdHVyZVVybHM6IGZpbGVVcmxzXG5cbiAgdXBsb2FkRmlsZXM6IChmaWxlTGlzdCktPlxuICAgIHN0b3JhZ2UudXBsb2FkRmlsZXMgZmlsZUxpc3RcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChVcGxvYWRGb3JtLCB7XCJvbkNob29zZUZpbGVzXCI6ICh0aGlzLnVwbG9hZEZpbGVzKX0pLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQaWN0dXJlTGlzdCwge1wicGljdHVyZVVybHNcIjogKHRoaXMuc3RhdGUucGljdHVyZVVybHMpfSlcbiAgICApXG5cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3Il19
