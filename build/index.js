(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var FileSystem, Filer, defaultSize, uuid;

uuid = require('node-uuid');

Filer = require('@phated/filer');

defaultSize = 20 * 1024 * 1024;

FileSystem = (function() {
  function FileSystem(size, isPersistent) {
    this.size = size != null ? size : defaultSize;
    this.isPersistent = isPersistent != null ? isPersistent : true;
    this.filer = new Filer();
  }

  FileSystem.prototype.init = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.filer.init({
          persistent: _this.isPersistent,
          size: _this.size
        }, resolve, reject);
      };
    })(this));
  };

  FileSystem.prototype.uploadFile = function(blob) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.filer.write(uuid.v4(), {
          data: blob
        }, function(entry) {
          return resolve(entry.toURL());
        }, reject);
      };
    })(this));
  };

  FileSystem.prototype.getAllFiles = function() {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        return _this.filer.ls('/', function(entries) {
          var fileURLs;
          fileURLs = entries.map(function(entry) {
            return entry.toURL();
          });
          return resolve(fileURLs);
        }, reject);
      };
    })(this));
  };

  return FileSystem;

})();

module.exports = FileSystem;


},{"@phated/filer":"@phated/filer","node-uuid":"node-uuid"}],2:[function(require,module,exports){
var Picture, React;

React = require('react');

Picture = React.createClass({displayName: "Picture",
  clickHandler: function(event) {
    event.preventDefault();
    return this.props.onClick(this.props.url);
  },
  render: function() {
    return React.createElement("div", {
      "className": "col-xs-6 col-md-3"
    }, React.createElement("a", {
      "href": "#",
      "className": "thumbnail",
      "onClick": this.clickHandler
    }, React.createElement("img", {
      "src": this.props.url
    })));
  }
});

module.exports = Picture;


},{"react":"react"}],3:[function(require,module,exports){
var Bootstrap, Button, Modal, Picture, PictureList, React, ReactDOM, uuid;

uuid = require('node-uuid');

React = require('react');

ReactDOM = require('react-dom');

Bootstrap = require('react-bootstrap');

Modal = Bootstrap.Modal;

Button = Bootstrap.Button;

Picture = require('./Picture.coffee');

PictureList = React.createClass({displayName: "PictureList",
  getInitialState: function() {
    return {
      showModal: false,
      pictureUrl: null
    };
  },
  open: function(url) {
    return this.setState({
      showModal: true,
      pictureUrl: url
    });
  },
  close: function() {
    return this.setState({
      showModal: false,
      pictureUrl: null
    });
  },
  render: function() {
    var pictures;
    pictures = this.props.pictureUrls.map((function(_this) {
      return function(url, index) {
        return React.createElement(Picture, {
          "onClick": _this.open,
          "key": index,
          "url": url
        });
      };
    })(this));
    return React.createElement("div", {
      "className": "container-fluid"
    }, React.createElement("div", {
      "className": "row"
    }, React.createElement(Modal, {
      "show": this.state.showModal,
      "onHide": this.close,
      "animation": false,
      "bsSize": "large"
    }, React.createElement(Modal.Header, {
      "closeButton": true
    }, " "), React.createElement(Modal.Body, null, React.createElement("img", {
      "src": this.state.pictureUrl,
      "style": {
        width: 838 + "px"
      }
    }))), pictures));
  }
});

module.exports = PictureList;


},{"./Picture.coffee":2,"node-uuid":"node-uuid","react":"react","react-bootstrap":"react-bootstrap","react-dom":"react-dom"}],4:[function(require,module,exports){
var React, ReactDOM, UploadForm;

React = require('react');

ReactDOM = require('react-dom');

UploadForm = React.createClass({displayName: "UploadForm",
  handleSubmit: function(event) {
    var inputElem, uri;
    event.preventDefault();
    inputElem = ReactDOM.findDOMNode(this.refs.uri);
    uri = inputElem.value;
    if (uri) {
      return this.props.onSubmit(uri).then(function() {
        return inputElem.value = '';
      })["catch"](function(err) {
        inputElem.value = '';
        return alert(err);
      });
    }
  },
  render: function() {
    return React.createElement("div", {
      "className": "container-fluid"
    }, React.createElement("div", {
      "className": "page-header"
    }, React.createElement("h1", null, "Enter an image URL to upload it"), React.createElement("form", {
      "onSubmit": this.handleSubmit
    }, React.createElement("div", {
      "className": "form-group"
    }, React.createElement("input", {
      "type": "text",
      "className": "form-control",
      "placeholder": "Image URL",
      "ref": "uri"
    })), React.createElement("button", {
      "type": "submit",
      "className": "btn btn-primary"
    }, "Upload"))));
  }
});

module.exports = UploadForm;


},{"react":"react","react-dom":"react-dom"}],5:[function(require,module,exports){
var FileSystem, PictureList, React, UploadForm, View, downloader, fs;

React = require('react');

UploadForm = require('./UploadForm.coffee');

PictureList = require('./PictureList.coffee');

downloader = require('./downloader.coffee');

FileSystem = require('./FileSystem.coffee');

fs = new FileSystem();

View = React.createClass({displayName: "View",
  getInitialState: function() {
    return {
      pictureUrls: []
    };
  },
  componentDidMount: function() {
    return fs.init().then((function(_this) {
      return function() {
        return fs.getAllFiles().then(function(fileUrls) {
          return _this.setState({
            pictureUrls: fileUrls
          });
        });
      };
    })(this));
  },
  uploadResource: function(url) {
    return downloader.fetch(url).then((function(_this) {
      return function(blob) {
        return fs.uploadFile(blob).then(function(url) {
          var pictureUrls;
          pictureUrls = _this.state.pictureUrls;
          pictureUrls.unshift(url);
          return _this.setState({
            pictureUrls: pictureUrls
          });
        });
      };
    })(this));
  },
  render: function() {
    return React.createElement("div", null, React.createElement(UploadForm, {
      "onSubmit": this.uploadResource
    }), React.createElement(PictureList, {
      "pictureUrls": this.state.pictureUrls
    }));
  }
});

module.exports = View;


},{"./FileSystem.coffee":1,"./PictureList.coffee":3,"./UploadForm.coffee":4,"./downloader.coffee":6,"react":"react"}],6:[function(require,module,exports){
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


},{"xhr":"xhr"}],7:[function(require,module,exports){
var React, ReactDOM, View, container;

React = require('react');

ReactDOM = require('react-dom');

View = require('./View.coffee');

container = document.getElementById('app-container');

ReactDOM.render(React.createElement(View, null), container);


},{"./View.coffee":5,"react":"react","react-dom":"react-dom"}]},{},[7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9GaWxlU3lzdGVtLmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1BpY3R1cmUuY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvUGljdHVyZUxpc3QuY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvVXBsb2FkRm9ybS5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9WaWV3LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL2Rvd25sb2FkZXIuY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFdBQVI7O0FBQ1AsS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSOztBQUNSLFdBQUEsR0FBYyxFQUFBLEdBQUssSUFBTCxHQUFZOztBQUVwQjtFQUNXLG9CQUFDLElBQUQsRUFBb0IsWUFBcEI7SUFBQyxJQUFDLENBQUEsc0JBQUQsT0FBTTtJQUFhLElBQUMsQ0FBQSxzQ0FBRCxlQUFjO0lBQzNDLElBQUMsQ0FBQSxLQUFELEdBQWEsSUFBQSxLQUFBLENBQUE7RUFESjs7dUJBR2IsSUFBQSxHQUFNLFNBQUE7V0FDRSxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7ZUFDUixLQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWTtVQUFBLFVBQUEsRUFBWSxLQUFDLENBQUEsWUFB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QUFBO2VBR0ksT0FBQSxDQUFRLElBQVIsRUFISjs7SUFERixDQUpGO0VBRFEsQ0FBUjtBQURROzs7O0FDRmhCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLFFBQUEsR0FBVyxPQUFBLENBQVEsV0FBUjs7QUFDWCxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVI7O0FBRVAsU0FBQSxHQUFZLFFBQVEsQ0FBQyxjQUFULENBQXdCLGVBQXhCOztBQUVaLFFBQVEsQ0FBQyxNQUFULENBQWdCLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLENBQWhCLEVBQWlELFNBQWpEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInV1aWQgPSByZXF1aXJlICdub2RlLXV1aWQnXG5GaWxlciA9IHJlcXVpcmUgJ0BwaGF0ZWQvZmlsZXInXG5kZWZhdWx0U2l6ZSA9IDIwICogMTAyNCAqIDEwMjRcblxuY2xhc3MgRmlsZVN5c3RlbVxuICAgIGNvbnN0cnVjdG9yOiAoQHNpemU9ZGVmYXVsdFNpemUsIEBpc1BlcnNpc3RlbnQ9dHJ1ZSktPlxuICAgICAgICBAZmlsZXIgPSBuZXcgRmlsZXIoKVxuXG4gICAgaW5pdDogLT5cbiAgICAgICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCk9PlxuICAgICAgICAgICAgQGZpbGVyLmluaXQgcGVyc2lzdGVudDogQGlzUGVyc2lzdGVudCwgc2l6ZTogQHNpemUsIHJlc29sdmUsIHJlamVjdFxuXG4gICAgdXBsb2FkRmlsZTogKGJsb2IpLT5cbiAgICAgICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCk9PlxuICAgICAgICAgICAgQGZpbGVyLndyaXRlIHV1aWQudjQoKSwgZGF0YTogYmxvYiwgKGVudHJ5KS0+XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSBlbnRyeS50b1VSTCgpXG4gICAgICAgICAgICAsIHJlamVjdFxuXG4gICAgZ2V0QWxsRmlsZXM6IC0+XG4gICAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpPT5cbiAgICAgICAgICAgIEBmaWxlci5scyAnLycsIChlbnRyaWVzKS0+XG4gICAgICAgICAgICAgICAgZmlsZVVSTHMgPSBlbnRyaWVzLm1hcCAoZW50cnkpLT4gZW50cnkudG9VUkwoKVxuICAgICAgICAgICAgICAgIHJlc29sdmUgZmlsZVVSTHNcbiAgICAgICAgICAgICwgcmVqZWN0XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsZVN5c3RlbVxuIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdCdcblxuUGljdHVyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gICAgY2xpY2tIYW5kbGVyOiAoZXZlbnQpLT5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIEBwcm9wcy5vbkNsaWNrIEBwcm9wcy51cmxcblxuICAgIHJlbmRlcjogLT5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJjb2wteHMtNiBjb2wtbWQtM1wifSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHtcImhyZWZcIjogXCIjXCIsIFwiY2xhc3NOYW1lXCI6IFwidGh1bWJuYWlsXCIsIFwib25DbGlja1wiOiAoQGNsaWNrSGFuZGxlcil9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwge1wic3JjXCI6IChAcHJvcHMudXJsKX0pXG4gICAgICAgICAgICApXG4gICAgICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBQaWN0dXJlIiwidXVpZCA9IHJlcXVpcmUgJ25vZGUtdXVpZCdcblJlYWN0ID0gcmVxdWlyZSAncmVhY3QnXG5SZWFjdERPTSA9IHJlcXVpcmUgJ3JlYWN0LWRvbSdcbkJvb3RzdHJhcCA9IHJlcXVpcmUgJ3JlYWN0LWJvb3RzdHJhcCdcbk1vZGFsID0gQm9vdHN0cmFwLk1vZGFsXG5CdXR0b24gPSBCb290c3RyYXAuQnV0dG9uXG5QaWN0dXJlID0gcmVxdWlyZSAnLi9QaWN0dXJlLmNvZmZlZSdcblxuUGljdHVyZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICAgIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICAgICAgIHNob3dNb2RhbDogZmFsc2VcbiAgICAgICAgIHBpY3R1cmVVcmw6IG51bGxcblxuICAgIG9wZW46ICh1cmwpLT5cbiAgICAgICAgQHNldFN0YXRlXG4gICAgICAgICAgICBzaG93TW9kYWw6IHRydWVcbiAgICAgICAgICAgIHBpY3R1cmVVcmw6IHVybFxuXG4gICAgY2xvc2U6IC0+XG4gICAgICAgIEBzZXRTdGF0ZVxuICAgICAgICAgICAgc2hvd01vZGFsOiBmYWxzZVxuICAgICAgICAgICAgcGljdHVyZVVybDogbnVsbFxuXG4gICAgcmVuZGVyOiAtPlxuICAgICAgICBwaWN0dXJlcyA9IHRoaXMucHJvcHMucGljdHVyZVVybHMubWFwICh1cmwsIGluZGV4KT0+XG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBpY3R1cmUsIHtcIm9uQ2xpY2tcIjogKEBvcGVuKSwgXCJrZXlcIjogKGluZGV4KSwgXCJ1cmxcIjogKHVybCl9KVxuXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge1wiY2xhc3NOYW1lXCI6IFwiY29udGFpbmVyLWZsdWlkXCJ9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJyb3dcIn0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNb2RhbCwge1wic2hvd1wiOiAoQHN0YXRlLnNob3dNb2RhbCksIFwib25IaWRlXCI6IChAY2xvc2UpLCBcImFuaW1hdGlvblwiOiBmYWxzZSwgXCJic1NpemVcIjogXCJsYXJnZVwifSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuSGVhZGVyLCB7XCJjbG9zZUJ1dHRvblwiOiB0cnVlfSwgXCLCoFwiKSxcbiAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTW9kYWwuQm9keSwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XCJzcmNcIjogKEBzdGF0ZS5waWN0dXJlVXJsKSwgXCJzdHlsZVwiOiAoe3dpZHRoOiA4MzggKyBcInB4XCJ9KX0pXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSxcblxuICAgICAgICAgICAgICAgIChwaWN0dXJlcylcbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gUGljdHVyZUxpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ3JlYWN0J1xuUmVhY3RET00gPSByZXF1aXJlICdyZWFjdC1kb20nXG5cblVwbG9hZEZvcm0gPSBSZWFjdC5jcmVhdGVDbGFzc1xuXG4gICAgaGFuZGxlU3VibWl0OiAoZXZlbnQpLT5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIGlucHV0RWxlbSA9IFJlYWN0RE9NLmZpbmRET01Ob2RlIEByZWZzLnVyaVxuICAgICAgICB1cmkgPSBpbnB1dEVsZW0udmFsdWVcblxuICAgICAgICBpZiB1cmlcbiAgICAgICAgICAgIEBwcm9wcy5vblN1Ym1pdCB1cmlcbiAgICAgICAgICAgIC50aGVuIC0+XG4gICAgICAgICAgICAgICAgaW5wdXRFbGVtLnZhbHVlID0gJydcbiAgICAgICAgICAgIC5jYXRjaCAoZXJyKS0+XG4gICAgICAgICAgICAgICAgaW5wdXRFbGVtLnZhbHVlID0gJydcbiAgICAgICAgICAgICAgICBhbGVydCBlcnJcblxuICAgIHJlbmRlcjogLT5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJjb250YWluZXItZmx1aWRcIn0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcInBhZ2UtaGVhZGVyXCJ9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoMVwiLCBudWxsLCBcIkVudGVyIGFuIGltYWdlIFVSTCB0byB1cGxvYWQgaXRcIiksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwge1wib25TdWJtaXRcIjogKEBoYW5kbGVTdWJtaXQpfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7XCJjbGFzc05hbWVcIjogXCJmb3JtLWdyb3VwXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtcInR5cGVcIjogXCJ0ZXh0XCIsIFwiY2xhc3NOYW1lXCI6IFwiZm9ybS1jb250cm9sXCIsIFwicGxhY2Vob2xkZXJcIjogXCJJbWFnZSBVUkxcIiwgXCJyZWZcIjogXCJ1cmlcIn0pXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwge1widHlwZVwiOiBcInN1Ym1pdFwiLCBcImNsYXNzTmFtZVwiOiBcImJ0biBidG4tcHJpbWFyeVwifSwgXCJVcGxvYWRcIilcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcblxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRGb3JtIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdCdcblVwbG9hZEZvcm0gPSByZXF1aXJlICcuL1VwbG9hZEZvcm0uY29mZmVlJ1xuUGljdHVyZUxpc3QgPSByZXF1aXJlICcuL1BpY3R1cmVMaXN0LmNvZmZlZSdcbmRvd25sb2FkZXIgPSByZXF1aXJlICcuL2Rvd25sb2FkZXIuY29mZmVlJ1xuRmlsZVN5c3RlbSA9IHJlcXVpcmUgJy4vRmlsZVN5c3RlbS5jb2ZmZWUnXG5mcyA9IG5ldyBGaWxlU3lzdGVtKClcblxuVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgICAgICBwaWN0dXJlVXJsczogW11cblxuICAgIGNvbXBvbmVudERpZE1vdW50OiAtPlxuICAgICAgICBmcy5pbml0KClcbiAgICAgICAgLnRoZW4gPT5cbiAgICAgICAgICAgIGZzLmdldEFsbEZpbGVzKCkudGhlbiAoZmlsZVVybHMpPT5cbiAgICAgICAgICAgICAgICBAc2V0U3RhdGVcbiAgICAgICAgICAgICAgICAgICAgcGljdHVyZVVybHM6IGZpbGVVcmxzXG5cbiAgICB1cGxvYWRSZXNvdXJjZTogKHVybCktPlxuICAgICAgICBkb3dubG9hZGVyLmZldGNoIHVybFxuICAgICAgICAudGhlbiAoYmxvYik9PlxuICAgICAgICAgICAgZnMudXBsb2FkRmlsZSBibG9iXG4gICAgICAgICAgICAudGhlbiAodXJsKT0+XG4gICAgICAgICAgICAgICAgcGljdHVyZVVybHMgPSBAc3RhdGUucGljdHVyZVVybHNcbiAgICAgICAgICAgICAgICBwaWN0dXJlVXJscy51bnNoaWZ0IHVybFxuICAgICAgICAgICAgICAgIEBzZXRTdGF0ZVxuICAgICAgICAgICAgICAgICAgICBwaWN0dXJlVXJsczogcGljdHVyZVVybHNcblxuXG4gICAgcmVuZGVyOiAtPlxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVwbG9hZEZvcm0sIHtcIm9uU3VibWl0XCI6IChAdXBsb2FkUmVzb3VyY2UpfSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBpY3R1cmVMaXN0LCB7XCJwaWN0dXJlVXJsc1wiOiAoQHN0YXRlLnBpY3R1cmVVcmxzKX0pXG4gICAgICAgIClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXciLCJ4aHIgPSByZXF1aXJlICd4aHInXG5cbmV4cG9ydHMuZmV0Y2ggPSAodXJsKS0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCktPlxuICAgICAgICB4aHJcbiAgICAgICAgICAgIHVyaTogdXJsXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnXG4gICAgICAgICAgICByZXNwb25zZVR5cGU6ICdibG9iJ1xuICAgICAgICAsIChlcnIsIHJlc3AsIGJvZHkpLT5cbiAgICAgICAgICAgIGlmIGVyciB8fCByZXNwLnN0YXR1c0NvZGUgIT0gMjAwXG4gICAgICAgICAgICAgICAgcmVqZWN0ICdDYW5ub3QgZmV0Y2ggdGhlIHJlc291cmNlJ1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJlc29sdmUgYm9keVxuIiwiUmVhY3QgPSByZXF1aXJlICdyZWFjdCdcblJlYWN0RE9NID0gcmVxdWlyZSAncmVhY3QtZG9tJ1xuVmlldyA9IHJlcXVpcmUgJy4vVmlldy5jb2ZmZWUnXG5cbmNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkICdhcHAtY29udGFpbmVyJ1xuXG5SZWFjdERPTS5yZW5kZXIgUmVhY3QuY3JlYXRlRWxlbWVudChWaWV3LCBudWxsKSwgY29udGFpbmVyXG4iXX0=
