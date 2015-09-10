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
var PictureList, React, UploadForm, View;

React = require('React');

UploadForm = require('./UploadForm.coffee');

PictureList = require('./PictureList.coffee');

View = React.createClass({displayName: "View",
  getInitialState: function() {
    return {
      pictureUrls: ['https://pbs.twimg.com/profile_images/447460759329460224/mt2UmwGG_400x400.jpeg']
    };
  },
  render: function() {
    return React.createElement("div", null, React.createElement(UploadForm, null), React.createElement(PictureList, {
      "pictureUrls": this.state.pictureUrls
    }));
  }
});

module.exports = View;


},{"./PictureList.coffee":2,"./UploadForm.coffee":3,"React":"React"}],5:[function(require,module,exports){
var React, View;

React = require('React');

View = require('./View.coffee');

React.render(React.createElement(View, null), document.body);


},{"./View.coffee":4,"React":"React"}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9QaWN0dXJlLmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1BpY3R1cmVMaXN0LmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1VwbG9hZEZvcm0uY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvVmlldy5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7QUFFUixPQUFBLEdBQVUsS0FBSyxDQUFDLFdBQU4sQ0FDUjtFQUFBLE1BQUEsRUFBUSxTQUFBO1dBQ04sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkI7TUFBQyxLQUFBLEVBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFwQjtLQUEzQjtFQURNLENBQVI7Q0FEUTs7QUFJVixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ05qQixJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7QUFDUixPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSOztBQUVWLFdBQUEsR0FBYyxLQUFLLENBQUMsV0FBTixDQUNaO0VBQUEsTUFBQSxFQUFRLFNBQUE7QUFDTixRQUFBO0lBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQXZCLENBQTJCLFNBQUMsR0FBRDthQUNwQyxLQUFLLENBQUMsYUFBTixDQUFvQixPQUFwQixFQUE2QjtRQUFDLEtBQUEsRUFBUSxHQUFUO09BQTdCO0lBRG9DLENBQTNCO1dBR1gsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsS0FBcEIsRUFBMkIsSUFBM0IsRUFBa0MsUUFBbEM7RUFKTSxDQUFSO0NBRFk7O0FBT2QsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNWakIsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0FBRVIsVUFBQSxHQUFhLEtBQUssQ0FBQyxXQUFOLENBQ1g7RUFBQSxNQUFBLEVBQVEsU0FBQTtXQUNOLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCLEVBQTJCLElBQTNCLEVBQ0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsTUFBcEIsRUFBNEIsSUFBNUIsRUFDRSxLQUFLLENBQUMsYUFBTixDQUFvQixPQUFwQixFQUE2QjtNQUFDLE1BQUEsRUFBUSxNQUFUO0tBQTdCLENBREYsQ0FERjtFQURNLENBQVI7Q0FEVzs7QUFRYixNQUFNLENBQUMsT0FBUCxHQUFpQjs7OztBQ1ZqQixJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUjs7QUFDUixVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSOztBQUNiLFdBQUEsR0FBYyxPQUFBLENBQVEsc0JBQVI7O0FBRWQsSUFBQSxHQUFPLEtBQUssQ0FBQyxXQUFOLENBQ0w7RUFBQSxlQUFBLEVBQWlCLFNBQUE7V0FDZjtNQUFBLFdBQUEsRUFBYSxDQUNYLCtFQURXLENBQWI7O0VBRGUsQ0FBakI7RUFLQSxNQUFBLEVBQVEsU0FBQTtXQUNOLEtBQUssQ0FBQyxhQUFOLENBQW9CLEtBQXBCLEVBQTJCLElBQTNCLEVBQ0UsS0FBSyxDQUFDLGFBQU4sQ0FBb0IsVUFBcEIsRUFBZ0MsSUFBaEMsQ0FERixFQUVFLEtBQUssQ0FBQyxhQUFOLENBQW9CLFdBQXBCLEVBQWlDO01BQUMsYUFBQSxFQUFnQixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQTVCO0tBQWpDLENBRkY7RUFETSxDQUxSO0NBREs7O0FBYVAsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7QUNqQmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7QUFFUCxLQUFLLENBQUMsTUFBTixDQUFhLEtBQUssQ0FBQyxhQUFOLENBQW9CLElBQXBCLEVBQTBCLElBQTFCLENBQWIsRUFBOEMsUUFBUSxDQUFDLElBQXZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5cblBpY3R1cmUgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICByZW5kZXI6IC0+XG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7XCJzcmNcIjogKHRoaXMucHJvcHMudXJsKX0pXG5cbm1vZHVsZS5leHBvcnRzID0gUGljdHVyZSIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5QaWN0dXJlID0gcmVxdWlyZSAnLi9QaWN0dXJlLmNvZmZlZSdcblxuUGljdHVyZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICByZW5kZXI6IC0+XG4gICAgcGljdHVyZXMgPSB0aGlzLnByb3BzLnBpY3R1cmVVcmxzLm1hcCAodXJsKS0+XG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFBpY3R1cmUsIHtcInVybFwiOiAodXJsKX0pXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIChwaWN0dXJlcykpXG5cbm1vZHVsZS5leHBvcnRzID0gUGljdHVyZUxpc3QiLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuXG5VcGxvYWRGb3JtID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgcmVuZGVyOiAtPlxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XCJ0eXBlXCI6ICdmaWxlJ30pXG4gICAgICApXG4gICAgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZEZvcm0iLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuVXBsb2FkRm9ybSA9IHJlcXVpcmUgJy4vVXBsb2FkRm9ybS5jb2ZmZWUnXG5QaWN0dXJlTGlzdCA9IHJlcXVpcmUgJy4vUGljdHVyZUxpc3QuY29mZmVlJ1xuXG5WaWV3ID0gUmVhY3QuY3JlYXRlQ2xhc3NcbiAgZ2V0SW5pdGlhbFN0YXRlOiAtPlxuICAgIHBpY3R1cmVVcmxzOiBbXG4gICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzQ0NzQ2MDc1OTMyOTQ2MDIyNC9tdDJVbXdHR180MDB4NDAwLmpwZWcnXG4gICAgXVxuXG4gIHJlbmRlcjogLT5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFVwbG9hZEZvcm0sIG51bGwpLFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQaWN0dXJlTGlzdCwge1wicGljdHVyZVVybHNcIjogKHRoaXMuc3RhdGUucGljdHVyZVVybHMpfSlcbiAgICApXG5cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblZpZXcgPSByZXF1aXJlICcuL1ZpZXcuY29mZmVlJ1xuXG5SZWFjdC5yZW5kZXIgUmVhY3QuY3JlYXRlRWxlbWVudChWaWV3LCBudWxsKSwgZG9jdW1lbnQuYm9keVxuIl19
