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
var init, requestFS, requestQuota, size;

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

exports.uploadFile = function(fileURI) {
  return new Promise(function(resolve, reject) {
    console.log(fileURI);
    return resolve();
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


},{"promise-polyfill":"promise-polyfill"}],5:[function(require,module,exports){
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
    return fileElem.value = 'https://pbs.twimg.com/profile_images/378800000532546226/dbe5f0727b69487016ffd67a6689e75a.jpeg';
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


},{"../picture-list/picture-list.coffee":2,"../storage/storage.coffee":4,"../upload-form/upload-form.coffee":5,"React":"React"}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9waWN0dXJlLWxpc3QvcGljdHVyZS1saXN0LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL3BpY3R1cmUvcGljdHVyZS5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9zdG9yYWdlL3N0b3JhZ2UuY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvdXBsb2FkLWZvcm0vdXBsb2FkLWZvcm0uY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvdmlldy92aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLElBQUEsR0FBTyxPQUFBLENBQVEsb0JBQVI7O0FBRVAsS0FBSyxDQUFDLE1BQU4sQ0FBYSxLQUFLLENBQUMsYUFBTixDQUFvQixJQUFwQixFQUEwQixJQUExQixDQUFiLEVBQThDLFFBQVEsQ0FBQyxJQUF2RDs7OztBQ0hBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLE9BQUEsR0FBVSxPQUFBLENBQVEsMkJBQVI7O0FBRVYsV0FBQSxHQUFjLEtBQUssQ0FBQyxXQUFOLENBQ1o7RUFBQSxNQUFBLEVBQVEsU0FBQTtBQUNOLFFBQUE7SUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBdkIsQ0FBMkIsU0FBQyxHQUFEO2FBQ3BD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LEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7QUFDUixVQUFBLEdBQWEsT0FBQSxDQUFRLG1DQUFSOztBQUNiLFdBQUEsR0FBYyxPQUFBLENBQVEscUNBQVI7O0FBQ2QsT0FBQSxHQUFVLE9BQUEsQ0FBUSwyQkFBUjs7QUFFVixJQUFBLEdBQU8sS0FBSyxDQUFDLFdBQU4sQ0FDTDtFQUFBLGVBQUEsRUFBaUIsU0FBQTtXQUNmO01BQUEsV0FBQSxFQUFhLEVBQWI7O0VBRGUsQ0FBakI7RUFHQSxpQkFBQSxFQUFtQixTQUFBO1dBQ2pCLE9BQU8sQ0FBQyxXQUFSLENBQUEsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsUUFBRDtlQUN6QixLQUFDLENBQUEsUUFBRCxDQUNFO1VBQUEsV0FBQSxFQUFhLFFBQWI7U0FERjtNQUR5QjtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0I7RUFEaUIsQ0FIbkI7RUFRQSxXQUFBLEVBQWEsU0FBQyxRQUFEO1dBQ1gsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsUUFBbkI7RUFEVyxDQVJiO0VBV0EsTUFBQSxFQUFRLFNBQUE7V0FDTixLQUFLLENBQUMsYUFBTixDQUFvQixLQUFwQixFQUEyQixJQUEzQixFQUNFLEtBQUssQ0FBQyxhQUFOLENBQW9CLFVBQXBCLEVBQWdDO01BQUMsZUFBQSxFQUFrQixJQUFJLENBQUMsV0FBeEI7S0FBaEMsQ0FERixFQUVFLEtBQUssQ0FBQyxhQUFOLENBQW9CLFdBQXBCLEVBQWlDO01BQUMsYUFBQSxFQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQTVCO0tBQWpDLENBRkY7RUFETSxDQVhSO0NBREs7O0FBbUJQLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5WaWV3ID0gcmVxdWlyZSAnLi92aWV3L3ZpZXcuY29mZmVlJ1xuXG5SZWFjdC5yZW5kZXIgUmVhY3QuY3JlYXRlRWxlbWVudChWaWV3LCBudWxsKSwgZG9jdW1lbnQuYm9keVxuIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblBpY3R1cmUgPSByZXF1aXJlICcuLi9waWN0dXJlL3BpY3R1cmUuY29mZmVlJ1xuXG5QaWN0dXJlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gIHJlbmRlcjogLT5cbiAgICBwaWN0dXJlcyA9IHRoaXMucHJvcHMucGljdHVyZVVybHMubWFwICh1cmwpLT5cbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGljdHVyZSwge1wia2V5XCI6ICh1cmwpLCBcInVybFwiOiAodXJsKX0pXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIChwaWN0dXJlcykpXG5cbm1vZHVsZS5leHBvcnRzID0gUGljdHVyZUxpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuXG5QaWN0dXJlID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwge1wic3JjXCI6ICh0aGlzLnByb3BzLnVybCl9KVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpY3R1cmUiLCJyZXF1aXJlICdwcm9taXNlLXBvbHlmaWxsJ1xuXG5zaXplID0gMjAgKiAxMDI0ICogMTAyNFxucmVxdWVzdEZTID0gd2luZG93LnJlcXVlc3RGaWxlU3lzdGVtIHx8IHdlYmtpdFJlcXVlc3RGaWxlU3lzdGVtXG5cbnJlcXVlc3RRdW90YSA9IC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpLT5cbiAgICBuYXZpZ2F0b3Iud2Via2l0UGVyc2lzdGVudFN0b3JhZ2UucmVxdWVzdFF1b3RhIHNpemUsIChncmFudGVkQnl0ZXMpLT5cbiAgICAgIHJlc29sdmUgZ3JhbnRlZEJ5dGVzXG4gICAgLCAoZXJyKS0+XG4gICAgICByZWplY3QgZXJyXG5cbmluaXQgPSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KS0+XG4gICAgcmVxdWVzdFF1b3RhKClcbiAgICAudGhlbiAtPlxuICAgICAgcmVxdWVzdEZTIHdpbmRvdy5QRVJTSVNURU5ULCBzaXplLCAoZnMpLT5cbiAgICAgICAgcmVzb2x2ZSBmc1xuICAgICAgLCAoZXJyKS0+XG4gICAgICAgIHJlamVjdCBlcnJcblxuZXhwb3J0cy51cGxvYWRGaWxlID0gKGZpbGVVUkkpLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgIGNvbnNvbGUubG9nIGZpbGVVUklcbiAgICByZXR1cm4gcmVzb2x2ZSgpXG4gICAgIyBpbml0KCkudGhlbiAoZnMpLT5cbiAgICAjICAgZnMucm9vdC5nZXRGaWxlIERhdGUubm93KCksIHtjcmVhdGU6IHRydWUsIGV4Y2x1c2l2ZTogdHJ1ZX0sIChmaWxlRW50cnkpLT5cblxuICAgICMgICAgIGZpbGVFbnRyeS5jcmVhdGVXcml0ZXIgKGZpbGVXcml0ZXIpLT5cbiAgICAjICAgICAgIGZpbGVXcml0ZXIud3JpdGUgZmlsZVxuICAgICMgICAgICwgKGVyciktPlxuICAgICMgICAgICAgcmVqZWN0IGVyclxuXG4gICAgIyAgICwgKGVyciktPlxuICAgICMgICAgIHJlamVjdCBlcnJcblxuZXhwb3J0cy5nZXRBbGxGaWxlcyA9IC0+XG4gIGZpbGVzID0gW11cblxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KS0+XG4gICAgaW5pdCgpLnRoZW4gKGZzKS0+XG4gICAgICBkaXJSZWFkZXIgPSBmcy5yb290LmNyZWF0ZVJlYWRlcigpXG5cbiAgICAgIHJlYWQgPSAtPlxuICAgICAgICBkaXJSZWFkZXIucmVhZEVudHJpZXMgKGZpbGVFbnRyaWVzKS0+XG4gICAgICAgICAgaWYgIWZpbGVFbnRyaWVzLmxlbmd0aFxuICAgICAgICAgICAgcmVzb2x2ZSBmaWxlc1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZpbGVVcmxzID0gZmlsZUVudHJpZXMubWFwIChmaWxlRW50cnkpLT4gZmlsZUVudHJ5LnRvVVJMKClcbiAgICAgICAgICAgIGZpbGVzID0gZmlsZXMuY29uY2F0IGZpbGVVcmxzXG5cbiAgICAgICAgICAgIHJlYWQoKVxuICAgICAgICAsIChlcnIpLT5cbiAgICAgICAgICByZWplY3QgZXJyXG5cbiAgICAgIHJlYWQoKVxuXG5leHBvcnRzLnJlbW92ZUZpbGUgPSAtPiIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5cblVwbG9hZEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuICBoYW5kbGVTdWJtaXQ6IChldmVudCktPlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIGZpbGVFbGVtID0gUmVhY3QuZmluZERPTU5vZGUgQHJlZnMuZmlsZVVSSVxuICAgIGZpbGVVUkkgPSBmaWxlRWxlbS52YWx1ZVxuXG4gICAgdGhpcy5wcm9wcy5vbkNob29zZUZpbGVzIGZpbGVVUklcblxuICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICBmaWxlRWxlbSA9IFJlYWN0LmZpbmRET01Ob2RlIEByZWZzLmZpbGVVUklcbiAgICBmaWxlRWxlbS52YWx1ZSA9ICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvMzc4ODAwMDAwNTMyNTQ2MjI2L2RiZTVmMDcyN2I2OTQ4NzAxNmZmZDY3YTY2ODllNzVhLmpwZWcnXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIHtcIm9uU3VibWl0XCI6IChAaGFuZGxlU3VibWl0KX0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwiZm9ybS1ncm91cFwifSxcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge1widHlwZVwiOiBcInRleHRcIiwgXCJjbGFzc05hbWVcIjogXCJmb3JtLWNvbnRyb2xcIiwgXCJwbGFjZWhvbGRlclwiOiBcImZpbGUgVVJJXCIsIFwicmVmXCI6IFwiZmlsZVVSSVwifSlcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XCJ0eXBlXCI6IFwic3VibWl0XCIsIFwiY2xhc3NOYW1lXCI6IFwiYnRuIGJ0bi1kZWZhdWx0XCJ9LCBcIlVwbG9hZFwiKVxuICAgICAgKVxuICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRGb3JtIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblVwbG9hZEZvcm0gPSByZXF1aXJlICcuLi91cGxvYWQtZm9ybS91cGxvYWQtZm9ybS5jb2ZmZWUnXG5QaWN0dXJlTGlzdCA9IHJlcXVpcmUgJy4uL3BpY3R1cmUtbGlzdC9waWN0dXJlLWxpc3QuY29mZmVlJ1xuc3RvcmFnZSA9IHJlcXVpcmUgJy4uL3N0b3JhZ2Uvc3RvcmFnZS5jb2ZmZWUnXG5cblZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgcGljdHVyZVVybHM6IFtdXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgc3RvcmFnZS5nZXRBbGxGaWxlcygpLnRoZW4gKGZpbGVVcmxzKT0+XG4gICAgICBAc2V0U3RhdGVcbiAgICAgICAgcGljdHVyZVVybHM6IGZpbGVVcmxzXG5cbiAgdXBsb2FkRmlsZXM6IChmaWxlTGlzdCktPlxuICAgIHN0b3JhZ2UudXBsb2FkRmlsZSBmaWxlTGlzdFxuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVwbG9hZEZvcm0sIHtcIm9uQ2hvb3NlRmlsZXNcIjogKHRoaXMudXBsb2FkRmlsZXMpfSksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBpY3R1cmVMaXN0LCB7XCJwaWN0dXJlVXJsc1wiOiAodGhpcy5zdGF0ZS5waWN0dXJlVXJscyl9KVxuICAgIClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXciXX0=
