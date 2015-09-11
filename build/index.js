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


},{"./PictureList.coffee":2,"./UploadForm.coffee":3,"./storage.coffee":6,"React":"React"}],5:[function(require,module,exports){
var React, View;

React = require('React');

View = require('./View.coffee');

React.render(React.createElement(View, null), document.body);


},{"./View.coffee":4,"React":"React"}],6:[function(require,module,exports){
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


},{"promise-polyfill":"promise-polyfill"}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9QaWN0dXJlLmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1BpY3R1cmVMaXN0LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1VwbG9hZEZvcm0uY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvVmlldy5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9zdG9yYWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUVSLE9BQUEsR0FBVSxLQUFLLENBQUMsV0FBTixDQUNSO0VBQUEsTUFBQSxFQUFRLFNBQUE7V0FDTixLQUFLLENBQUMsYUFBTixDQUFvQixLQUFwQixFQUEyQjtNQUFDLEtBQUEsRUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQXBCO0tBQTNCO0VBRE0sQ0FBUjtDQURROztBQUlWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDTmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVI7O0FBRVYsV0FBQSxHQUFjLEtBQUssQ0FBQyxXQUFOLENBQ1o7RUFBQSxNQUFBLEVBQVEsU0FBQTtBQUNOLFFBQUE7SUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBdkIsQ0FBMkIsU0FB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YyxVQUFBLENBQVcsSUFBWCxDQUFkO0FBRkY7QUFJQSxTQUFPLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWjtBQVJhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5cblBpY3R1cmUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XCJzcmNcIjogKHRoaXMucHJvcHMudXJsKX0pXG5cbm1vZHVsZS5leHBvcnRzID0gUGljdHVyZSIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5QaWN0dXJlID0gcmVxdWlyZSAnLi9QaWN0dXJlLmNvZmZlZSdcblxuUGljdHVyZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICByZW5kZXI6IC0+XG4gICAgcGljdHVyZXMgPSB0aGlzLnByb3BzLnBpY3R1cmVVcmxzLm1hcCAodXJsKS0+XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBpY3R1cmUsIHtcImtleVwiOiAodXJsKSwgXCJ1cmxcIjogKHVybCl9KVxuXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCAocGljdHVyZXMpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpY3R1cmVMaXN0IiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblxuVXBsb2FkRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gIGhhbmRsZVN1Ym1pdDogKGV2ZW50KS0+XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgZmlsZUVsZW0gPSBSZWFjdC5maW5kRE9NTm9kZSBAcmVmcy5maWxlXG5cbiAgICB0aGlzLnByb3BzLm9uQ2hvb3NlRmlsZXMgZmlsZUVsZW0uZmlsZXNcblxuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwge1wib25TdWJtaXRcIjogKEBoYW5kbGVTdWJtaXQpfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcInR5cGVcIjogJ2ZpbGUnLCBcInJlZlwiOiAnZmlsZSd9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcInR5cGVcIjogJ3N1Ym1pdCcsIFwidmFsdWVcIjogJ1VwbG9hZCd9KVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRGb3JtIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblVwbG9hZEZvcm0gPSByZXF1aXJlICcuL1VwbG9hZEZvcm0uY29mZmVlJ1xuUGljdHVyZUxpc3QgPSByZXF1aXJlICcuL1BpY3R1cmVMaXN0LmNvZmZlZSdcbnN0b3JhZ2UgPSByZXF1aXJlICcuL3N0b3JhZ2UuY29mZmVlJ1xuXG5WaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHBpY3R1cmVVcmxzOiBbXVxuXG4gIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgIHN0b3JhZ2UuZ2V0QWxsRmlsZXMoKS50aGVuIChmaWxlVXJscyk9PlxuICAgICAgQHNldFN0YXRlXG4gICAgICAgIHBpY3R1cmVVcmxzOiBmaWxlVXJsc1xuXG4gIHVwbG9hZEZpbGVzOiAoZmlsZUxpc3QpLT5cbiAgICBzdG9yYWdlLnVwbG9hZEZpbGVzIGZpbGVMaXN0XG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXBsb2FkRm9ybSwge1wib25DaG9vc2VGaWxlc1wiOiAodGhpcy51cGxvYWRGaWxlcyl9KSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGljdHVyZUxpc3QsIHtcInBpY3R1cmVVcmxzXCI6ICh0aGlzLnN0YXRlLnBpY3R1cmVVcmxzKX0pXG4gICAgKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5WaWV3ID0gcmVxdWlyZSAnLi9WaWV3LmNvZmZlZSdcblxuUmVhY3QucmVuZGVyIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVmlldywgbnVsbCksIGRvY3VtZW50LmJvZHlcbiIsInJlcXVpcmUgJ3Byb21pc2UtcG9seWZpbGwnXG5cbnNpemUgPSAyMCAqIDEwMjQgKiAxMDI0XG5yZXF1ZXN0RlMgPSB3aW5kb3cucmVxdWVzdEZpbGVTeXN0ZW0gfHwgd2Via2l0UmVxdWVzdEZpbGVTeXN0ZW1cblxucmVxdWVzdFF1b3RhID0gLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgIG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZS5yZXF1ZXN0UXVvdGEgc2l6ZSwgKGdyYW50ZWRCeXRlcyktPlxuICAgICAgcmVzb2x2ZSBncmFudGVkQnl0ZXNcbiAgICAsIChlcnIpLT5cbiAgICAgIHJlamVjdCBlcnJcblxuaW5pdCA9IC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpLT5cbiAgICByZXF1ZXN0UXVvdGEoKVxuICAgIC50aGVuIC0+XG4gICAgICByZXF1ZXN0RlMgd2luZG93LlBFUlNJU1RFTlQsIHNpemUsIChmcyktPlxuICAgICAgICByZXNvbHZlIGZzXG4gICAgICAsIChlcnIpLT5cbiAgICAgICAgcmVqZWN0IGVyclxuXG51cGxvYWRGaWxlID0gKGZpbGUpLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgIGluaXQoKS50aGVuIChmcyktPlxuICAgICAgZnMucm9vdC5nZXRGaWxlIGZpbGUubmFtZSwge2NyZWF0ZTogdHJ1ZSwgZXhjbHVzaXZlOiB0cnVlfSwgKGZpbGVFbnRyeSktPlxuXG4gICAgICAgIGZpbGVFbnRyeS5jcmVhdGVXcml0ZXIgKGZpbGVXcml0ZXIpLT5cbiAgICAgICAgICBmaWxlV3JpdGVyLndyaXRlIGZpbGVcbiAgICAgICAgLCAoZXJyKS0+XG4gICAgICAgICAgcmVqZWN0IGVyclxuXG4gICAgICAsIChlcnIpLT5cbiAgICAgICAgcmVqZWN0IGVyclxuXG5leHBvcnRzLmdldEFsbEZpbGVzID0gLT5cbiAgZmlsZXMgPSBbXVxuXG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpLT5cbiAgICBpbml0KCkudGhlbiAoZnMpLT5cbiAgICAgIGRpclJlYWRlciA9IGZzLnJvb3QuY3JlYXRlUmVhZGVyKClcblxuICAgICAgcmVhZCA9IC0+XG4gICAgICAgIGRpclJlYWRlci5yZWFkRW50cmllcyAoZmlsZUVudHJpZXMpLT5cbiAgICAgICAgICBpZiAhZmlsZUVudHJpZXMubGVuZ3RoXG4gICAgICAgICAgICByZXNvbHZlIGZpbGVzXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZmlsZVVybHMgPSBmaWxlRW50cmllcy5tYXAgKGZpbGVFbnRyeSktPiBmaWxlRW50cnkudG9VUkwoKVxuICAgICAgICAgICAgZmlsZXMgPSBmaWxlcy5jb25jYXQgZmlsZVVybHNcblxuICAgICAgICAgICAgcmVhZCgpXG4gICAgICAgICwgKGVyciktPlxuICAgICAgICAgIHJlamVjdCBlcnJcblxuICAgICAgcmVhZCgpXG5cbmV4cG9ydHMucmVtb3ZlRmlsZSA9IC0+XG5cbmV4cG9ydHMudXBsb2FkRmlsZXMgPSAoZmlsZUxpc3QpLT5cbiAgbGVuZ3RoID0gZmlsZUxpc3QubGVuZ3RoXG4gIHByb21pc2VzID0gW11cblxuICBmb3IgaSBpbiBbMC4ubGVuZ3RoIC0gMV1cbiAgICBmaWxlID0gZmlsZUxpc3RbaV1cbiAgICBwcm9taXNlcy5wdXNoIHVwbG9hZEZpbGUoZmlsZSlcblxuICByZXR1cm4gUHJvbWlzZS5hbGwgcHJvbWlzZXNcbiJdfQ==
