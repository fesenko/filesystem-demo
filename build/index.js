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
  render: function() {
    return React.createElement("div", null, React.createElement("form", null, React.createElement("input", {
      "type": 'file'
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
    return storage.getAllPictures().then((function(_this) {
      return function(pictureUrls) {
        return _this.setState({
          pictureUrls: pictureUrls
        });
      };
    })(this));
  },
  render: function() {
    return React.createElement("div", null, React.createElement(UploadForm, null), React.createElement(PictureList, {
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
require('promise-polyfill');

exports.getAllPictures = function() {
  return new Promise(function(resolve) {
    return resolve(['https://pbs.twimg.com/profile_images/447460759329460224/mt2UmwGG_400x400.jpeg']);
  });
};

exports.removePicture = function() {};

exports.uploadPicture = function() {};


},{"promise-polyfill":"promise-polyfill"}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9QaWN0dXJlLmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1BpY3R1cmVMaXN0LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1VwbG9hZEZvcm0uY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvVmlldy5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9pbmRleC5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9zdG9yYWdlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUVSLE9BQUEsR0FBVSxLQUFLLENBQUMsV0FBTixDQUNSO0VBQUEsTUFBQSxFQUFRLFNBQUE7V0FDTixLQUFLLENBQUMsYUFBTixDQUFvQixLQUFwQixFQUEyQjtNQUFDLEtBQUEsRUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQXBCO0tBQTNCO0VBRE0sQ0FBUjtDQURROztBQUlWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDTmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVI7O0FBRVYsV0FBQSxHQUFjLEtBQUssQ0FBQyxXQUFOLENBQ1o7RUFBQSxNQUFBLEVBQVEsU0FBQTtBQUNOLFFBQUE7SUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBdkIsQ0FBMkIsU0FBQyxHQUFEO2FBQ3BDLEtBQUssQ0FBQyxhQUFOLENBQW9CLE9BQXBCLEVBQTZCO1FBQUMsS0FBQSxFQUFRLEdBQVQ7T0FBN0I7SUFEb0MsQ0FBM0I7V0FHWCxLQUFLLENBQUMsYUFBTixDQUFvQixLQUFwQixFQUEyQixJQUEzQixFQUFrQyxRQUFsQztFQUpNLENBQVI7Q0FEWTs7QUFPZCxNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ1ZqQixJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7QUFFUixVQUFBLEdBQWEsS0FBSyxDQUFDLFdBQU4sQ0FDWDtFQUFBLE1BQUEsRUFBUSxTQUFBO1dBQ04sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkIsSUFBM0IsRUFDRSxLQUFLLENBQUMsYUFBTixDQUFvQixNQUFwQixFQUE0QixJQUE1QixFQUNFLEtBQUssQ0FBQyxhQUFOLENBQW9CLE9BQXBCLEVBQTZCO01BQUMsTUFBQSxFQUFRLE1BQVQ7S0FBN0IsQ0FERixDQURGO0VBRE0sQ0FBUjtDQURXOztBQVFiLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7O0FDVmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLFVBQUEsR0FBYSxPQUFBLENBQVEscUJBQVI7O0FBQ2IsV0FBQSxHQUFjLE9BQUEsQ0FBUSxzQkFBUjs7QUFDZCxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSOztBQUVWLElBQUEsR0FBTyxLQUFLLENBQUMsV0FBTixDQUNMO0VBQUEsZUFBQSxFQUFpQixTQUFBO1dBQ2Y7TUFBQSxXQUFBLEVBQWEsRUFBYjs7RUFEZSxDQUFqQjtFQUdBLGlCQUFBLEVBQW1CLFNBQUE7V0FDakIsT0FBTyxDQUFDLGNBQVIsQ0FBQSxDQUF3QixDQUFDLElBQXpCLENBQThCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxXQUFEO2VBQzVCLEtBQUMsQ0FBQSxRQUFELENBQ0U7VUFBQSxXQUFBLEVBQWEsV0FBYjtTQURGO01BRDRCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QjtFQURpQixDQUhuQjtFQVFBLE1BQUEsRUFBUSxTQUFBO1dBQ04sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkIsSUFBM0IsRUFDRSxLQUFLLENBQUMsYUFBTixDQUFvQixVQUFwQixFQUFnQyxJQUFoQyxDQURGLEVBRUUsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsV0FBcEIsRUFBaUM7TUFBQyxhQUFBLEVBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBNUI7S0FBakMsQ0FGRjtFQURNLENBUlI7Q0FESzs7QUFnQlAsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNyQmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7QUFFUCxLQUFLLENBQUMsTUFBTixDQUFhLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLENBQWIsRUFBOEMsUUFBUSxDQUFDLElBQXZEOzs7O0FDSEEsT0FBQSxDQUFRLGtCQUFSOztBQUVBLE9BQU8sQ0FBQyxjQUFSLEdBQXlCLFNBQUE7U0FDbkIsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFEO1dBQ1YsT0FBQSxDQUFRLENBQ04sK0VBRE0sQ0FBUjtFQURVLENBQVI7QUFEbUI7O0FBT3pCLE9BQU8sQ0FBQyxhQUFSLEdBQXdCLFNBQUEsR0FBQTs7QUFHeEIsT0FBTyxDQUFDLGFBQVIsR0FBd0IsU0FBQSxHQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5cblBpY3R1cmUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XCJzcmNcIjogKHRoaXMucHJvcHMudXJsKX0pXG5cbm1vZHVsZS5leHBvcnRzID0gUGljdHVyZSIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5QaWN0dXJlID0gcmVxdWlyZSAnLi9QaWN0dXJlLmNvZmZlZSdcblxuUGljdHVyZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICByZW5kZXI6IC0+XG4gICAgcGljdHVyZXMgPSB0aGlzLnByb3BzLnBpY3R1cmVVcmxzLm1hcCAodXJsKS0+XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBpY3R1cmUsIHtcInVybFwiOiAodXJsKX0pXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIChwaWN0dXJlcykpXG5cbm1vZHVsZS5leHBvcnRzID0gUGljdHVyZUxpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuXG5VcGxvYWRGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XCJ0eXBlXCI6ICdmaWxlJ30pXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZEZvcm0iLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuVXBsb2FkRm9ybSA9IHJlcXVpcmUgJy4vVXBsb2FkRm9ybS5jb2ZmZWUnXG5QaWN0dXJlTGlzdCA9IHJlcXVpcmUgJy4vUGljdHVyZUxpc3QuY29mZmVlJ1xuc3RvcmFnZSA9IHJlcXVpcmUgJy4vc3RvcmFnZS5jb2ZmZWUnXG5cblZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICBnZXRJbml0aWFsU3RhdGU6IC0+XG4gICAgcGljdHVyZVVybHM6IFtdXG5cbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgc3RvcmFnZS5nZXRBbGxQaWN0dXJlcygpLnRoZW4gKHBpY3R1cmVVcmxzKT0+XG4gICAgICBAc2V0U3RhdGVcbiAgICAgICAgcGljdHVyZVVybHM6IHBpY3R1cmVVcmxzXG5cbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXBsb2FkRm9ybSwgbnVsbCksXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBpY3R1cmVMaXN0LCB7XCJwaWN0dXJlVXJsc1wiOiAodGhpcy5zdGF0ZS5waWN0dXJlVXJscyl9KVxuICAgIClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXciLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuVmlldyA9IHJlcXVpcmUgJy4vVmlldy5jb2ZmZWUnXG5cblJlYWN0LnJlbmRlciBSZWFjdC5jcmVhdGVFbGVtZW50KFZpZXcsIG51bGwpLCBkb2N1bWVudC5ib2R5XG4iLCJyZXF1aXJlICdwcm9taXNlLXBvbHlmaWxsJ1xuXG5leHBvcnRzLmdldEFsbFBpY3R1cmVzID0gLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUpLT5cbiAgICByZXNvbHZlIFtcbiAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vcHJvZmlsZV9pbWFnZXMvNDQ3NDYwNzU5MzI5NDYwMjI0L210MlVtd0dHXzQwMHg0MDAuanBlZydcbiAgICBdXG5cblxuZXhwb3J0cy5yZW1vdmVQaWN0dXJlID0gLT5cblxuXG5leHBvcnRzLnVwbG9hZFBpY3R1cmUgPSAtPiJdfQ==
