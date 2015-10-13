(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["Filer"] = factory();
	else
		root["Filer"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/*** IMPORTS FROM imports-loader ***/
	(function() {
	var FileError = global.FileError;

	/**
	 * Copyright 2013 - Eric Bidelman
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.

	 * @fileoverview
	 * Convenient wrapper library for the HTML5 Filesystem API, implementing
	 * familiar UNIX commands (cp, mv, ls) for its API.
	 *
	 * @author Eric Bidelman (ebidel@gmail.com)
	 * @version: 0.4.3
	 */

	'use strict';

	var self = this; // window or worker context.

	var reqFS = window.requestFileSystem || window.webkitRequestFileSystem;

	function requestFileSystem(type, size, callback, errorCallback){
	  if(typeof chrome === 'undefined' || typeof chrome.syncFileSystem === 'undefined'){
	    reqFS(type, size, callback, errorCallback);
	    return;
	  }

	  chrome.syncFileSystem.requestFileSystem(function(filesystem){
	    var err = chrome.runtime.lastError;
	    if(err || filesystem == null){
	      reqFS(type, size, callback, errorCallback);
	    } else {
	      callback(filesystem);
	    }
	  });
	}

	self.URL = self.URL || self.webkitURL;
	self.requestFileSystem = requestFileSystem;
	self.resolveLocalFileSystemURL = self.resolveLocalFileSystemURL ||
	                                 self.webkitResolveLocalFileSystemURL;
	navigator.temporaryStorage = navigator.temporaryStorage ||
	                             navigator.webkitTemporaryStorage;
	navigator.persistentStorage = navigator.persistentStorage ||
	                              navigator.webkitPersistentStorage;
	self.BlobBuilder = self.BlobBuilder || self.MozBlobBuilder ||
	                   self.WebKitBlobBuilder;

	// Prevent errors in browsers that don't support FileError.
	if (self.FileError === undefined) {
	  var FileError = function() {};
	  FileError.prototype.prototype = Error.prototype;
	}

	var Util = {

	  /**
	   * Turns a NodeList into an array.
	   *
	   * @param {NodeList} list The array-like object.
	   * @return {Array} The NodeList as an array.
	   */
	  toArray: function(list) {
	    return Array.prototype.slice.call(list || [], 0);
	  },

	  /*toDataURL: function(contentType, uint8Array) {
	    return 'data:' + contentType + ';base64,' +
	        self.btoa(this.arrayToBinaryString(uint8Array));
	  },*/

	  /**
	   * Creates a data: URL from string data.
	   *
	   * @param {string} str The content to encode the data: URL from.
	   * @param {string} contentType The mimetype of the data str represents.
	   * @param {bool=} opt_isBinary Whether the string data is a binary string
	   *     (and therefore should be base64 encoded). True by default.
	   * @return {string} The created data: URL.
	   */
	  strToDataURL: function(str, contentType, opt_isBinary) {
	    var isBinary = opt_isBinary != undefined ? opt_isBinary : true;
	    if (isBinary) {
	      return 'data:' + contentType + ';base64,' + self.btoa(str);
	    } else {
	      return 'data:' + contentType + ',' + str;
	    }
	  },

	  /**
	   * Creates a blob: URL from a binary str.
	   *
	   * @param {string} binStr The content as a binary string.
	   * @param {string=} opt_contentType An optional mimetype of the data.
	   * @return {string} A new blob: URL.
	   */
	  strToObjectURL: function(binStr, opt_contentType) {

	    var ui8a = new Uint8Array(binStr.length);
	    for (var i = 0; i < ui8a.length; ++i) {
	      ui8a[i] = binStr.charCodeAt(i);
	    }

	    var blob = new Blob([ui8a],
	                        opt_contentType ? {type: opt_contentType} : {});

	    return self.URL.createObjectURL(blob);
	  },

	  /**
	   * Creates a blob: URL from a File or Blob object.
	   *
	   * @param {Blob|File} blob The File or Blob data.
	   * @return {string} A new blob: URL.
	   */
	  fileToObjectURL: function(blob) {
	    return self.URL.createObjectURL(blob);
	  },

	  /**
	   * Reads a File or Blob object and returns it as an ArrayBuffer.
	   *
	   * @param {Blob|File} blob The File or Blob data.
	   * @param {Function} callback Success callback passed the array buffer.
	   * @param {Function=} opt_error Optional error callback if the read fails.
	   */
	  fileToArrayBuffer: function(blob, callback, opt_errorCallback) {
	    var reader = new FileReader();
	    reader.onload = function(e) {
	      callback(e.target.result);
	    };
	    reader.onerror = function(e) {
	      if (opt_errorCallback) {
	        opt_errorCallback(e);
	      }
	    };

	    reader.readAsArrayBuffer(blob);
	  },

	  /**
	   * Creates and returns a blob from a data URL (either base64 encoded or not).
	   *
	   * @param {string} dataURL The data URL to convert.
	   * @return {Blob} A blob representing the array buffer data.
	   */
	  dataURLToBlob: function(dataURL) {
	    var BASE64_MARKER = ';base64,';
	    if (dataURL.indexOf(BASE64_MARKER) == -1) {
	      var parts = dataURL.split(',');
	      var contentType = parts[0].split(':')[1];
	      var raw = decodeURIComponent(parts[1]);

	      return new Blob([raw], {type: contentType});
	    }

	    var parts = dataURL.split(BASE64_MARKER);
	    var contentType = parts[0].split(':')[1];
	    var raw = window.atob(parts[1]);
	    var rawLength = raw.length;

	    var uInt8Array = new Uint8Array(rawLength);

	    for (var i = 0; i < rawLength; ++i) {
	      uInt8Array[i] = raw.charCodeAt(i);
	    }

	    return new Blob([uInt8Array], {type: contentType});
	  },

	  /**
	   * Reads an ArrayBuffer as returns its contents as a binary string.
	   *
	   * @param {ArrayBuffer} buffer The buffer of data.
	   * @param {string=} opt_contentType An optional mimetype of the data.
	   * @return {Blob} A blob representing the array buffer data.
	   */
	  arrayBufferToBlob: function(buffer, opt_contentType) {
	    var uInt8Array = new Uint8Array(buffer);
	    return new Blob([uInt8Array],
	                    opt_contentType ? {type: opt_contentType} : {});
	  },

	  /**
	   * Reads an ArrayBuffer as returns its contents as a binary string.
	   *
	   * @param {ArrayBuffer} buffer The buffer of data.
	   * @param {Function} callback Success callback passed the binary string.
	   * @param {Function=} opt_error Optional error callback if the read fails.
	   */
	  arrayBufferToBinaryString: function(buffer, callback, opt_errorCallback) {
	    var reader = new FileReader();
	    reader.onload = function(e) {
	      callback(e.target.result);
	    };
	    reader.onerror = function(e) {
	      if (opt_errorCallback) {
	        opt_errorCallback(e);
	      }
	    };

	    var uInt8Array = new Uint8Array(buffer);
	    reader.readAsBinaryString(new Blob([uInt8Array]));
	  },

	  /**
	   * Create a binary string out of an array of numbers (bytes), each varying
	   * from 0-255.
	   *
	   * @param {Array} bytes The array of numbers to transform into a binary str.
	   * @return {string} The byte array as a string.
	   */
	  arrayToBinaryString: function(bytes) {
	    if (typeof bytes != typeof []) {
	      return null;
	    }
	    var i = bytes.length;
	    var bstr = new Array(i);
	    while (i--) {
	      bstr[i] = String.fromCharCode(bytes[i]);
	    }
	    return bstr.join('');
	  },

	  /**
	   * Returns the file extension for a given filename.
	   *
	   * @param {string} filename The filename.
	   * @return {string} The file's extension.
	   */
	  getFileExtension: function(filename) {
	    var idx = filename.lastIndexOf('.');
	    return idx != -1 ? filename.substring(idx) : '';
	  }
	};


	var MyFileError = function(obj) {
	  this.prototype = FileError.prototype;
	  this.code = obj.code;
	  this.name = obj.name;
	};
	//MyFileError.prototype.__proto__ = FileError.prototype;

	// Extend FileError with custom errors and a convenience method to get error
	// code mnemonic.
	FileError.BROWSER_NOT_SUPPORTED = 1000;

	// TODO: remove when FileError.name is implemented (crbug.com/86014).
	FileError.prototype.__defineGetter__('name', function() {
	  var keys = Object.keys(FileError);
	  for (var i = 0, key; key = keys[i]; ++i) {
	    if (FileError[key] == this.code) {
	      return key;
	    }
	  }
	  return 'Unknown Error';
	});


	var Filer = new function() {

	  var FS_INIT_ERROR_MSG = 'Filesystem has not been initialized.';
	  var NOT_IMPLEMENTED_MSG = 'Not implemented.';
	  var NOT_A_DIRECTORY = 'Path was not a directory.';
	  var INCORRECT_ARGS = 'These method arguments are not supported.';
	  var FS_URL_SCHEME = 'filesystem:';
	  var DEFAULT_FS_SIZE = 1024 * 1024; // 1MB.

	  var fs_ = null;
	  var cwd_ = null;
	  var isOpen_ = false;

	  var isFsURL_ = function(path) {
	    return path.indexOf(FS_URL_SCHEME) == 0;
	  };

	  // Path can be relative or absolute. If relative, it's taken from the cwd_.
	  // If a filesystem URL is passed it, it is simple returned
	  var pathToFsURL_ = function(path) {
	    if (!isFsURL_(path)) {
	      if (path[0] == '/') {
	        path = fs_.root.toURL() + path.substring(1);
	      } else if (path.indexOf('./') == 0 || path.indexOf('../') == 0) {
	        if (path == '../' && cwd_ != fs_.root) {
	          path = cwd_.toURL() + '/' + path;
	        } else {
	          path = cwd_.toURL() + path;
	        }
	      } else {
	        path = cwd_.toURL() + '/' + path;
	      }
	    }

	    return path;
	  };

	  /**
	   * Looks up a FileEntry or DirectoryEntry for a given path.
	   *
	   * @param {function(...FileEntry|DirectorEntry)} callback A callback to be
	   *     passed the entry/entries that were fetched. The ordering of the
	   *     entries passed to the callback correspond to the same order passed
	   *     to this method.
	   * @param {function(...Error)} errback A callback to be called when an error occurs.
	   * @param {...string} var_args 1-2 paths to lookup and return entries for.
	   *     These can be paths or filesystem: URLs.
	   */
	  var getEntry_ = function(callback, errback, var_args) {
	    var srcStr = arguments[2];
	    var destStr = arguments[3];

	    var onError = function(e) {
	      if (e.code == FileError.NOT_FOUND_ERR) {
	        if (destStr) {
	          throw new Error('"' + srcStr + '" or "' + destStr +
	                          '" does not exist.');
	        } else {
	          throw new Error('"' + srcStr + '" does not exist.');
	        }
	      } else {
	        throw new Error('Problem getting Entry for one or more paths.');
	      }
	    };

	    if(typeof errback !== 'function' && errback != null){
	      srcStr = arguments[1];
	      destStr = arguments[2];
	      errback = onError;
	    }

	    // Build a filesystem: URL manually if we need to.
	    var src = pathToFsURL_(srcStr);

	    if (destStr) {
	      var dest = pathToFsURL_(destStr);
	      self.resolveLocalFileSystemURL(src, function(srcEntry) {
	        self.resolveLocalFileSystemURL(dest, function(destEntry) {
	          callback(srcEntry, destEntry);
	        }, errback);
	      }, errback);
	    } else {
	      self.resolveLocalFileSystemURL(src, callback, errback);
	    }
	  };

	  /**
	   * Copy or moves a file or directory to a destination.
	   *
	   * See public method's description (Filer.cp()) for rest of params.
	   * @param {Boolean=} opt_deleteOrig True if the original entry should be
	   *     deleted after the copy takes place, essentially making the operation
	   *     a move instead of a copy. Defaults to false.
	   */
	  var copyOrMove_ = function(src, dest, opt_newName, opt_successCallback,
	                             opt_errorHandler, opt_deleteOrig) {
	    var self = this;

	    if (!fs_) {
	      throw new Error(FS_INIT_ERROR_MSG);
	    }

	    if (typeof src != typeof dest) {
	      throw new Error(INCORRECT_ARGS);
	    }

	    var newName = opt_newName || null;
	    var deleteOrig = opt_deleteOrig != undefined ? opt_deleteOrig : false;

	    if ((src.isFile || dest.isDirectory) && dest.isDirectory) {
	      if (deleteOrig) {
	        src.moveTo(dest, newName, opt_successCallback, opt_errorHandler);
	      } else {
	        src.copyTo(dest, newName, opt_successCallback, opt_errorHandler);
	      }
	    } else {
	      getEntry_(function(srcEntry, destDir) {
	        if (!destDir.isDirectory) {
	          var e = new Error('Oops! "' + destDir.name + ' is not a directory!');
	          if (opt_errorHandler) {
	            opt_errorHandler(e);
	          } else {
	            throw e;
	          }
	          return;
	        }
	        if (deleteOrig) {
	          srcEntry.moveTo(destDir, newName, opt_successCallback, opt_errorHandler);
	        } else {
	          srcEntry.copyTo(destDir, newName, opt_successCallback, opt_errorHandler);
	        }
	      }, opt_errorCallback, src, dest);
	    }
	  }

	  function Filer(fs) {
	    fs_  = fs || null;
	    if (fs_) {
	      cwd_ = fs_.root;
	      isOpen_ = true; // TODO: this may not be the case.
	    }
	  }

	  Filer.DEFAULT_FS_SIZE = DEFAULT_FS_SIZE;
	  Filer.version = '0.4.3';

	  Filer.prototype = {
	    get fs() {
	      return fs_;
	    },
	    get isOpen() {
	      return isOpen_;
	    },
	    get cwd() {
	      return cwd_;
	    }
	  }

	  /**
	   * Constructs and returns a filesystem: URL given a path.
	   *
	   * @param {string=} path The path to construct a URL for.
	   *     size {int=} The storage size (in bytes) to open the filesystem with.
	   *         Defaults to DEFAULT_FS_SIZE.
	   * @return {string} The filesystem: URL.
	   */
	  Filer.prototype.pathToFilesystemURL = function(path) {
	    return pathToFsURL_(path);
	  }

	  /**
	   * Initializes (opens) the file system.
	   *
	   * @param {object=} opt_initObj Optional object literal with the following
	   *     properties. Note: If {} or null is passed, default values are used.
	   *     persistent {Boolean=} Whether the browser should use persistent quota.
	   *         Default is false.
	   *     size {int=} The storage size (in bytes) to open the filesystem with.
	   *         Defaults to DEFAULT_FS_SIZE.
	   * @param {Function=} opt_successCallback Optional success handler passed a
	   *      DOMFileSystem object.
	   * @param {Function=} opt_errorHandler Optional error callback.
	   */
	  Filer.prototype.init = function(opt_initObj, opt_successCallback,
	                                  opt_errorHandler) {
	    if (!self.requestFileSystem) {
	      throw new MyFileError({
	        code: FileError.BROWSER_NOT_SUPPORTED,
	        name: 'BROWSER_NOT_SUPPORTED'
	      });
	    }

	    if (fs_) {
	      if (opt_successCallback) opt_successCallback(fs_);
	      return;
	    }

	    var initObj = opt_initObj ? opt_initObj : {}; // Use defaults if obj is null.

	    var size = initObj.size || DEFAULT_FS_SIZE;
	    this.type = self.TEMPORARY;
	    if ('persistent' in initObj && initObj.persistent) {
	      this.type = self.PERSISTENT;
	    }

	    var init = function(fs) {
	      this.size = size;
	      fs_ = fs;
	      cwd_ = fs_.root;
	      isOpen_ = true;

	      opt_successCallback && opt_successCallback(fs);
	    };

	    if (this.type == self.PERSISTENT && !!navigator.persistentStorage) {
	      navigator.persistentStorage.requestQuota(size, function(grantedBytes) {
	        self.requestFileSystem(
	            this.type, grantedBytes, init.bind(this), opt_errorHandler);
	      }.bind(this), opt_errorHandler);
	    } else {
	      self.requestFileSystem(
	          this.type, size, init.bind(this), opt_errorHandler);
	    }
	  };

	  /**
	   * Reads the contents of a directory.
	   *
	   * @param {string|DirectoryEntry} dirEntryOrPath A path relative to the
	   *     current working directory. In most cases that is the root entry, unless
	   *     cd() has been called. A DirectoryEntry or filesystem URL can also be
	   *     passed, in which case, the folder's contents will be returned.
	   * @param {Function} successCallback Success handler passed an Array<Entry>.
	   * @param {Function=} opt_errorHandler Optional error callback.
	   */
	  Filer.prototype.ls = function(dirEntryOrPath, successCallback,
	                                opt_errorHandler) {
	    if (!fs_) {
	      throw new Error(FS_INIT_ERROR_MSG);
	    }

	    var callback = function(dirEntry) {

	      // Read contents of current working directory. According to spec, need to
	      // keep calling readEntries() until length of result array is 0. We're
	      // guarenteed the same entry won't be returned again.
	      var entries_ = [];
	      var reader = dirEntry.createReader();

	      var readEntries = function() {
	        reader.readEntries(function(results) {
	          if (!results.length) {
	            // By default, sort the list by name.
	            entries_.sort(function(a, b) {
	              return a.name < b.name ? -1 : b.name < a.name ? 1 : 0;
	            });
	            successCallback(entries_);
	          } else {
	            entries_ = entries_.concat(Util.toArray(results));
	            readEntries();
	          }
	        }, opt_errorHandler);
	      };

	      readEntries();
	    };

	    if (dirEntryOrPath.isDirectory) { // passed a DirectoryEntry.
	      callback(dirEntryOrPath);
	    } else if (isFsURL_(dirEntryOrPath)) { // passed a filesystem URL.
	      getEntry_(callback, opt_errorHandler, dirEntryOrPath);
	    } else { // Passed a path. Look up DirectoryEntry and proceeed.
	      // TODO: Find way to use getEntry_(callback, dirEntryOrPath); with cwd_.
	      cwd_.getDirectory(dirEntryOrPath, {}, callback, opt_errorHandler);
	    }
	  };

	  /**
	   * Creates a new directory.
	   *
	   * @param {string} path The name of the directory to create. If a path is
	   *     given, each intermediate dir is created (e.g. similar to mkdir -p).
	   * @param {bool=} opt_exclusive True if an error should be thrown if
	   *     one or more of the directories already exists. False by default.
	   * @param {Function} opt_successCallback Success handler passed the
	   *     DirectoryEntry that was created. If we were passed a path, the last
	   *     directory that was created is passed back.
	   * @param {Function=} opt_errorHandler Optional error callback.
	   */
	  Filer.prototype.mkdir = function(path, opt_exclusive, opt_successCallback,
	                                   opt_errorHandler) {
	    if (!fs_) {
	      throw new Error(FS_INIT_ERROR_MSG);
	    }

	    // juggle exclusive arg
	    if (typeof opt_exclusive === 'function'){
	      opt_errorHandler = opt_successCallback;
	      opt_successCallback = opt_exclusive;
	    }

	    var exclusive = typeof opt_exclusive === 'boolean' ? opt_exclusive : false;

	    var isAbsolute = path[0] === '/';
	    var folderParts = path.split('/');

	    var createDir = function(rootDir, folders) {
	      // Throw out './' or '/' and move on. Prevents: '/foo/.//bar'.
	      folders = folders.filter(function(chunk){
	        return chunk !== '.' && chunk !== '';
	      });

	      if (!folders.length) {
	        if (opt_successCallback) opt_successCallback(rootDir);
	        return;
	      }

	      rootDir.getDirectory(folders[0], {create: true, exclusive: exclusive},
	        function (dirEntry) {
	          if (dirEntry.isDirectory) { // TODO: check shouldn't be necessary.
	            // Recursively add the new subfolder if we have more to create and
	            // There was more than one folder to create.
	            if (folders.length && folderParts.length != 1) {
	              createDir(dirEntry, folders.slice(1));
	            } else {
	              // Return the last directory that was created.
	              if (opt_successCallback) opt_successCallback(dirEntry);
	            }
	          } else {
	            var e = new Error(path + ' is not a directory');
	            if (opt_errorHandler) {
	              opt_errorHandler(e);
	            } else {
	              throw e;
	            }
	          }
	        },
	        function(e) {
	          if (e.code == FileError.INVALID_MODIFICATION_ERR) {
	            e.message = "'" + path + "' already exists";
	          }

	          if (opt_errorHandler) {
	            opt_errorHandler(e);
	          } else {
	            throw e;
	          }
	        }
	      );
	    };

	    if (isAbsolute) {
	      createDir(fs_.root, folderParts);
	    } else {
	      createDir(cwd_, folderParts);
	    }
	  };

	  /**
	   * Looks up and return a File for a given file entry.
	   *
	   * @param {string|FileEntry} entryOrPath A path, filesystem URL, or FileEntry
	   *     of the file to lookup.
	   * @param {Function} successCallback Success callback passed the File object.
	   * @param {Function=} opt_errorHandler Optional error callback.
	   */
	  Filer.prototype.open = function(entryOrPath, successCallback, opt_errorHandler) {
	    if (!fs_) {
	      throw new Error(FS_INIT_ERROR_MSG);
	    }

	    if (entryOrPath.isFile) {
	      entryOrPath.file(successCallback, opt_errorHandler);
	    } else {
	      getEntry_(function(fileEntry) {
	        fileEntry.file(successCallback, opt_errorHandler);
	      }, opt_errorHandler, pathToFsURL_(entryOrPath));
	    }
	  };

	  /**
	   * Creates an empty file.
	   *
	   * @param {string} path The relative path of the file to create, from the
	   *     current working directory.
	   * @param {bool=} opt_exclusive True (default) if an error should be thrown if
	   *     the file already exists.
	   * @param {Function} successCallback A success callback, which is passed
	   *     the new FileEntry.
	   * @param {Function=} opt_errorHandler Optional error callback.
	   */
	  Filer.prototype.create = function(path, opt_exclusive, successCallback,
	                                    opt_errorHandler) {
	    if (!fs_) {
	      throw new Error(FS_INIT_ERROR_MSG);
	    }

	    var exclusive = opt_exclusive != null ? opt_exclusive : true;

	    cwd_.getFile(path, {create: true,  exclusive: exclusive}, successCallback,
	      function(e) {
	        if (e.code == FileError.INVALID_MODIFICATION_ERR) {
	          e.message = "'" + path + "' already exists";
	        }
	        if (opt_errorHandler) {
	          opt_errorHandler(e);
	        } else {
	          throw e;
	        }
	      }
	    );
	  };

	  /**
	    * Moves a file or directory.
	    *
	    * @param {string|FileEntry|DirectoryEntry} src The file/directory
	    *     to move. If src is a string, a path or filesystem: URL is accepted.
	    * @param {string|DirectoryEntry} dest The directory to move the src into.
	    *     If dest is a string, a path or filesystem: URL is accepted.
	    *     Note: dest needs to be the same type as src.
	    * @param {string=} opt_newName An optional new name for the moved entry.
	    * @param {Function=} opt_successCallback Optional callback passed the moved
	    *     entry on a successful move.
	    * @param {Function=} opt_errorHandler Optional error callback.
	    */
	  Filer.prototype.mv = function(src, dest, opt_newName, opt_successCallback,
	                                opt_errorHandler) {
	    copyOrMove_.bind(this, src, dest, opt_newName, opt_successCallback,
	                     opt_errorHandler, true)();
	  };

	  /**
	   * Deletes a file or directory entry.
	   *
	   * @param {string|FileEntry|DirectoryEntry} entryOrPath The file or directory
	   *     to remove. If entry is a DirectoryEntry, its contents are removed
	   *     recursively. If entryOrPath is a string, a path or filesystem: URL is
	   *     accepted.
	   * @param {Function} successCallback Zero arg callback invoked on
	   *     successful removal.
	   * @param {Function=} opt_errorHandler Optional error callback.
	   */
	  Filer.prototype.rm = function(entryOrPath, successCallback,
	                                opt_errorHandler) {
	    if (!fs_) {
	      throw new Error(FS_INIT_ERROR_MSG);
	    }

	    var removeIt = function(entry) {
	      if (entry.isFile) {
	        entry.remove(successCallback, opt_errorHandler);
	      } else if (entry.isDirectory) {
	        entry.removeRecursively(successCallback, opt_errorHandler);
	      }
	    };

	    if (entryOrPath.isFile || entryOrPath.isDirectory) {
	      removeIt(entryOrPath);
	    } else {
	      getEntry_(removeIt, opt_errorHandler, entryOrPath);
	    }
	  };

	  /**
	   * Changes the current working directory.
	   *
	   * @param {string|DirectoryEntry} dirEntryOrPath A DirectoryEntry to move into
	   *     or a path relative to the current working directory. A filesystem: URL
	   *     is also accepted
	   * @param {Function=} opt_successCallback Optional success callback, which is
	   *     passed the DirectoryEntry of the new current directory.
	   * @param {Function=} opt_errorHandler Optional error callback.
	   */
	  Filer.prototype.cd = function(dirEntryOrPath, opt_successCallback,
	                                opt_errorHandler) {
	    if (!fs_) {
	      throw new Error(FS_INIT_ERROR_MSG);
	    }

	    if (dirEntryOrPath.isDirectory) {
	      cwd_ = dirEntryOrPath;
	      opt_successCallback && opt_successCallback(cwd_);
	    } else {
	      // Build a filesystem: URL manually if we need to.
	      var dirEntryOrPath = pathToFsURL_(dirEntryOrPath);

	      getEntry_(function(dirEntry) {
	        if (dirEntry.isDirectory) {
	          cwd_ = dirEntry;
	          opt_successCallback && opt_successCallback(cwd_);
	        } else {
	          var e = new Error(NOT_A_DIRECTORY);
	          if (opt_errorHandler) {
	            opt_errorHandler(e);
	          } else {
	            throw e;
	          }
	        }
	      }, opt_errorHandler, dirEntryOrPath);
	    }
	  };

	  /**
	    * Copies a file or directory to a destination.
	    *
	    * @param {string|FileEntry|DirectoryEntry} src The file/directory
	    *     to copy. If src is a string, a path or filesystem: URL is accepted.
	    * @param {string|DirectoryEntry} dest The directory to copy the src into.
	    *     If dest is a string, a path or filesystem: URL is accepted.
	    *     Note: dest needs to be the same type as src.
	    * @param {string=} opt_newName An optional name for the copied entry.
	    * @param {Function=} opt_successCallback Optional callback passed the moved
	    *     entry on a successful copy.
	    * @param {Function=} opt_errorHandler Optional error callback.
	    */
	  Filer.prototype.cp = function(src, dest, opt_newName, opt_successCallback,
	                                opt_errorHandler) {
	    copyOrMove_.bind(this, src, dest, opt_newName, opt_successCallback,
	                     opt_errorHandler)();
	  };

	  /**
	   * Writes data to a file.
	   *
	   * If the file already exists, its contents are overwritten.
	   *
	   * @param {string|FileEntry} entryOrPath A path, filesystem URL, or FileEntry
	    *     of the file to lookup.
	   * @param {object} dataObj The data to write. Example:
	   *     {data: string|Blob|File|ArrayBuffer, type: mimetype, append: true}
	   *     If append is specified, data is appended to the end of the file.
	   * @param {Function} opt_successCallback Success callback, which is passed
	   *     the created FileEntry and FileWriter object used to write the data.
	   * @param {Function=} opt_errorHandler Optional error callback.
	   */
	  Filer.prototype.write = function(entryOrPath, dataObj, opt_successCallback,
	                                   opt_errorHandler) {
	    if (!fs_) {
	      throw new Error(FS_INIT_ERROR_MSG);
	    }

	    var writeFile_ = function(fileEntry) {
	      fileEntry.createWriter(function(fileWriter) {

	        fileWriter.onerror = opt_errorHandler;

	        if (dataObj.append) {
	          fileWriter.onwriteend = function(e) {
	            if (opt_successCallback) opt_successCallback(fileEntry, this);
	          };

	          fileWriter.seek(fileWriter.length); // Start write position at EOF.
	        } else {
	          var truncated = false;
	          fileWriter.onwriteend = function(e) {
	            // Truncate file to newly written file size.
	            if (!truncated) {
	              truncated = true;
	              this.truncate(this.position);
	              return;
	            }
	            if (opt_successCallback) opt_successCallback(fileEntry, this);
	          };
	        }

	        // Blob() takes ArrayBufferView, not ArrayBuffer.
	        if (dataObj.data.__proto__ == ArrayBuffer.prototype) {
	          dataObj.data = new Uint8Array(dataObj.data);
	        }
	        var blob = new Blob([dataObj.data],
	                            dataObj.type ? {type: dataObj.type} : {});

	        fileWriter.write(blob);

	      }, opt_errorHandler);
	    };

	    if (entryOrPath.isFile) {
	      writeFile_(entryOrPath);
	    } else if (isFsURL_(entryOrPath)) {
	      getEntry_(writeFile_, opt_errorHandler, entryOrPath);
	    } else {
	      cwd_.getFile(entryOrPath, {create: true, exclusive: false}, writeFile_,
	                   opt_errorHandler);
	    }
	  };

	  /**
	   * Displays disk space usage.
	   *
	   * @param {Function} successCallback Success callback, which is passed
	   *     Used space, Free space and Currently allocated total space in bytes.
	   * @param {Function=} opt_errorHandler Optional error callback.
	   */
	  Filer.prototype.df = function(successCallback, opt_errorHandler) {
	    var queryCallback = function(byteUsed, byteCap) {
	      successCallback(byteUsed, byteCap - byteUsed, byteCap);
	    }

	    if (!(navigator.temporaryStorage.queryUsageAndQuota && navigator.persistentStorage.queryUsageAndQuota)) {
	      throw new Error(NOT_IMPLEMENTED_MSG);
	    }

	    if (self.TEMPORARY == this.type) {
	      navigator.temporaryStorage.queryUsageAndQuota(queryCallback, opt_errorHandler);
	    } else if (self.PERSISTENT == this.type) {
	      navigator.persistentStorage.queryUsageAndQuota(queryCallback, opt_errorHandler);
	    }
	  };

	  return Filer;
	};

	Filer.Util = Util;


	/*** EXPORTS FROM exports-loader ***/
	module.exports = Filer}.call(global));
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;
},{}],2:[function(require,module,exports){
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

(function() {
  var _global = this;

  // Unique ID creation requires a high quality random # generator.  We feature
  // detect to determine the best RNG source, normalizing to a function that
  // returns 128-bits of randomness, since that's what's usually required
  var _rng;

  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
  //
  // Moderately fast, high quality
  if (typeof(_global.require) == 'function') {
    try {
      var _rb = _global.require('crypto').randomBytes;
      _rng = _rb && function() {return _rb(16);};
    } catch(e) {}
  }

  if (!_rng && _global.crypto && crypto.getRandomValues) {
    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
    //
    // Moderately fast, high quality
    var _rnds8 = new Uint8Array(16);
    _rng = function whatwgRNG() {
      crypto.getRandomValues(_rnds8);
      return _rnds8;
    };
  }

  if (!_rng) {
    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    var  _rnds = new Array(16);
    _rng = function() {
      for (var i = 0, r; i < 16; i++) {
        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
      }

      return _rnds;
    };
  }

  // Buffer class to use
  var BufferClass = typeof(_global.Buffer) == 'function' ? _global.Buffer : Array;

  // Maps for number <-> hex string conversion
  var _byteToHex = [];
  var _hexToByte = {};
  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  // **`parse()` - Parse a UUID into it's component bytes**
  function parse(s, buf, offset) {
    var i = (buf && offset) || 0, ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
      if (ii < 16) { // Don't overflow!
        buf[i + ii++] = _hexToByte[oct];
      }
    });

    // Zero out remaining bytes if string was short
    while (ii < 16) {
      buf[i + ii++] = 0;
    }

    return buf;
  }

  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
  function unparse(buf, offset) {
    var i = offset || 0, bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
  }

  // **`v1()` - Generate time-based UUID**
  //
  // Inspired by https://github.com/LiosK/UUID.js
  // and http://docs.python.org/library/uuid.html

  // random #'s we need to init node and clockseq
  var _seedBytes = _rng();

  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
  var _nodeId = [
    _seedBytes[0] | 0x01,
    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
  ];

  // Per 4.2.2, randomize (14 bit) clockseq
  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

  // Previous uuid creation time
  var _lastMSecs = 0, _lastNSecs = 0;

  // See https://github.com/broofa/node-uuid for API details
  function v1(options, buf, offset) {
    var i = buf && offset || 0;
    var b = buf || [];

    options = options || {};

    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;

    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    var msecs = options.msecs != null ? options.msecs : new Date().getTime();

    // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;

    // Time since last uuid creation (in msecs)
    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

    // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq == null) {
      clockseq = clockseq + 1 & 0x3fff;
    }

    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
      nsecs = 0;
    }

    // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
    }

    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq;

    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000;

    // `time_low`
    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff;

    // `time_mid`
    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff;

    // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff;

    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80;

    // `clock_seq_low`
    b[i++] = clockseq & 0xff;

    // `node`
    var node = options.node || _nodeId;
    for (var n = 0; n < 6; n++) {
      b[i + n] = node[n];
    }

    return buf ? buf : unparse(b);
  }

  // **`v4()` - Generate random UUID**

  // See https://github.com/broofa/node-uuid for API details
  function v4(options, buf, offset) {
    // Deprecated - 'format' argument, as supported in v1.2
    var i = buf && offset || 0;

    if (typeof(options) == 'string') {
      buf = options == 'binary' ? new BufferClass(16) : null;
      options = null;
    }
    options = options || {};

    var rnds = options.random || (options.rng || _rng)();

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Copy bytes to buffer, if provided
    if (buf) {
      for (var ii = 0; ii < 16; ii++) {
        buf[i + ii] = rnds[ii];
      }
    }

    return buf || unparse(rnds);
  }

  // Export public API
  var uuid = v4;
  uuid.v1 = v1;
  uuid.v4 = v4;
  uuid.parse = parse;
  uuid.unparse = unparse;
  uuid.BufferClass = BufferClass;

  if (typeof(module) != 'undefined' && module.exports) {
    // Publish as node.js module
    module.exports = uuid;
  } else  if (typeof define === 'function' && define.amd) {
    // Publish as AMD module
    define(function() {return uuid;});
 

  } else {
    // Publish as global (in browsers)
    var _previousRoot = _global.uuid;

    // **`noConflict()` - (browser only) to reset global 'uuid' var**
    uuid.noConflict = function() {
      _global.uuid = _previousRoot;
      return uuid;
    };

    _global.uuid = uuid;
  }
}).call(this);

},{}],3:[function(require,module,exports){
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
        }, function() {
          return resolve();
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


},{"@phated/filer":1,"node-uuid":2}],4:[function(require,module,exports){
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


},{"React":"React"}],5:[function(require,module,exports){
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


},{"./Picture.coffee":4,"React":"React"}],6:[function(require,module,exports){
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


},{"React":"React"}],7:[function(require,module,exports){
var FileSystem, PictureList, React, UploadForm, View, downloader, fs;

React = require('React');

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
  uploadFile: function(url) {
    return downloader.fetch(url).then(function(blob) {
      return fs.uploadFile(blob);
    });
  },
  render: function() {
    return React.createElement("div", null, React.createElement(UploadForm, {
      "onChooseFiles": this.uploadFile
    }), React.createElement(PictureList, {
      "pictureUrls": this.state.pictureUrls
    }));
  }
});

module.exports = View;


},{"./FileSystem.coffee":3,"./PictureList.coffee":5,"./UploadForm.coffee":6,"./downloader.coffee":8,"React":"React"}],8:[function(require,module,exports){
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


},{"xhr":"xhr"}],9:[function(require,module,exports){
var React, View;

React = require('React');

View = require('./View.coffee');

React.render(React.createElement(View, null), document.body);


},{"./View.coffee":7,"React":"React"}]},{},[9])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvQHBoYXRlZC9maWxlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ub2RlLXV1aWQvdXVpZC5qcyIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL0ZpbGVTeXN0ZW0uY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvUGljdHVyZS5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9QaWN0dXJlTGlzdC5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9VcGxvYWRGb3JtLmNvZmZlZSIsIi9Vc2Vycy9zZXJnZXkvbml4L2IyYi9maWxlc3lzdGVtLWRlbW8vc3JjL1ZpZXcuY29mZmVlIiwiL1VzZXJzL3NlcmdleS9uaXgvYjJiL2ZpbGVzeXN0ZW0tZGVtby9zcmMvZG93bmxvYWRlci5jb2ZmZWUiLCIvVXNlcnMvc2VyZ2V5L25peC9iMmIvZmlsZXN5c3RlbS1kZW1vL3NyYy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3g3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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dXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiRmlsZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiRmlsZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAvKioqKioqLyAoZnVuY3Rpb24obW9kdWxlcykgeyAvLyB3ZWJwYWNrQm9vdHN0cmFwXG4vKioqKioqLyBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbi8qKioqKiovIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuLyoqKioqKi8gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuLyoqKioqKi8gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbi8qKioqKiovIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fSxcbi8qKioqKiovIFx0XHRcdGlkOiBtb2R1bGVJZCxcbi8qKioqKiovIFx0XHRcdGxvYWRlZDogZmFsc2Vcbi8qKioqKiovIFx0XHR9O1xuXG4vKioqKioqLyBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4vKioqKioqLyBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbi8qKioqKiovIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4vKioqKioqLyBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuXG5cbi8qKioqKiovIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbi8qKioqKiovIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuLyoqKioqKi8gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuLyoqKioqKi8gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4vKioqKioqLyBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4vKioqKioqLyBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbi8qKioqKiovIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vKioqKioqLyBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuLyoqKioqKi8gfSlcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyAoW1xuLyogMCAqL1xuLyoqKi8gZnVuY3Rpb24obW9kdWxlLCBleHBvcnRzKSB7XG5cblx0LyogV0VCUEFDSyBWQVIgSU5KRUNUSU9OICovKGZ1bmN0aW9uKGdsb2JhbCkgey8qKiogSU1QT1JUUyBGUk9NIGltcG9ydHMtbG9hZGVyICoqKi9cblx0KGZ1bmN0aW9uKCkge1xuXHR2YXIgRmlsZUVycm9yID0gZ2xvYmFsLkZpbGVFcnJvcjtcblxuXHQvKipcblx0ICogQ29weXJpZ2h0IDIwMTMgLSBFcmljIEJpZGVsbWFuXG5cdCAqXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG5cdCAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cblx0ICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG5cdCAqXG5cdCAqICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG5cdCAqXG5cdCAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcblx0ICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuXHQgKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cblx0ICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuXHQgKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuXHQgKiBAZmlsZW92ZXJ2aWV3XG5cdCAqIENvbnZlbmllbnQgd3JhcHBlciBsaWJyYXJ5IGZvciB0aGUgSFRNTDUgRmlsZXN5c3RlbSBBUEksIGltcGxlbWVudGluZ1xuXHQgKiBmYW1pbGlhciBVTklYIGNvbW1hbmRzIChjcCwgbXYsIGxzKSBmb3IgaXRzIEFQSS5cblx0ICpcblx0ICogQGF1dGhvciBFcmljIEJpZGVsbWFuIChlYmlkZWxAZ21haWwuY29tKVxuXHQgKiBAdmVyc2lvbjogMC40LjNcblx0ICovXG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBzZWxmID0gdGhpczsgLy8gd2luZG93IG9yIHdvcmtlciBjb250ZXh0LlxuXG5cdHZhciByZXFGUyA9IHdpbmRvdy5yZXF1ZXN0RmlsZVN5c3RlbSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEZpbGVTeXN0ZW07XG5cblx0ZnVuY3Rpb24gcmVxdWVzdEZpbGVTeXN0ZW0odHlwZSwgc2l6ZSwgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spe1xuXHQgIGlmKHR5cGVvZiBjaHJvbWUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBjaHJvbWUuc3luY0ZpbGVTeXN0ZW0gPT09ICd1bmRlZmluZWQnKXtcblx0ICAgIHJlcUZTKHR5cGUsIHNpemUsIGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKTtcblx0ICAgIHJldHVybjtcblx0ICB9XG5cblx0ICBjaHJvbWUuc3luY0ZpbGVTeXN0ZW0ucmVxdWVzdEZpbGVTeXN0ZW0oZnVuY3Rpb24oZmlsZXN5c3RlbSl7XG5cdCAgICB2YXIgZXJyID0gY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yO1xuXHQgICAgaWYoZXJyIHx8IGZpbGVzeXN0ZW0gPT0gbnVsbCl7XG5cdCAgICAgIHJlcUZTKHR5cGUsIHNpemUsIGNhbGxiYWNrLCBlcnJvckNhbGxiYWNrKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGNhbGxiYWNrKGZpbGVzeXN0ZW0pO1xuXHQgICAgfVxuXHQgIH0pO1xuXHR9XG5cblx0c2VsZi5VUkwgPSBzZWxmLlVSTCB8fCBzZWxmLndlYmtpdFVSTDtcblx0c2VsZi5yZXF1ZXN0RmlsZVN5c3RlbSA9IHJlcXVlc3RGaWxlU3lzdGVtO1xuXHRzZWxmLnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwgPSBzZWxmLnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwgfHxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi53ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMO1xuXHRuYXZpZ2F0b3IudGVtcG9yYXJ5U3RvcmFnZSA9IG5hdmlnYXRvci50ZW1wb3JhcnlTdG9yYWdlIHx8XG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLndlYmtpdFRlbXBvcmFyeVN0b3JhZ2U7XG5cdG5hdmlnYXRvci5wZXJzaXN0ZW50U3RvcmFnZSA9IG5hdmlnYXRvci5wZXJzaXN0ZW50U3RvcmFnZSB8fFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3Iud2Via2l0UGVyc2lzdGVudFN0b3JhZ2U7XG5cdHNlbGYuQmxvYkJ1aWxkZXIgPSBzZWxmLkJsb2JCdWlsZGVyIHx8IHNlbGYuTW96QmxvYkJ1aWxkZXIgfHxcblx0ICAgICAgICAgICAgICAgICAgIHNlbGYuV2ViS2l0QmxvYkJ1aWxkZXI7XG5cblx0Ly8gUHJldmVudCBlcnJvcnMgaW4gYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IEZpbGVFcnJvci5cblx0aWYgKHNlbGYuRmlsZUVycm9yID09PSB1bmRlZmluZWQpIHtcblx0ICB2YXIgRmlsZUVycm9yID0gZnVuY3Rpb24oKSB7fTtcblx0ICBGaWxlRXJyb3IucHJvdG90eXBlLnByb3RvdHlwZSA9IEVycm9yLnByb3RvdHlwZTtcblx0fVxuXG5cdHZhciBVdGlsID0ge1xuXG5cdCAgLyoqXG5cdCAgICogVHVybnMgYSBOb2RlTGlzdCBpbnRvIGFuIGFycmF5LlxuXHQgICAqXG5cdCAgICogQHBhcmFtIHtOb2RlTGlzdH0gbGlzdCBUaGUgYXJyYXktbGlrZSBvYmplY3QuXG5cdCAgICogQHJldHVybiB7QXJyYXl9IFRoZSBOb2RlTGlzdCBhcyBhbiBhcnJheS5cblx0ICAgKi9cblx0ICB0b0FycmF5OiBmdW5jdGlvbihsaXN0KSB7XG5cdCAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobGlzdCB8fCBbXSwgMCk7XG5cdCAgfSxcblxuXHQgIC8qdG9EYXRhVVJMOiBmdW5jdGlvbihjb250ZW50VHlwZSwgdWludDhBcnJheSkge1xuXHQgICAgcmV0dXJuICdkYXRhOicgKyBjb250ZW50VHlwZSArICc7YmFzZTY0LCcgK1xuXHQgICAgICAgIHNlbGYuYnRvYSh0aGlzLmFycmF5VG9CaW5hcnlTdHJpbmcodWludDhBcnJheSkpO1xuXHQgIH0sKi9cblxuXHQgIC8qKlxuXHQgICAqIENyZWF0ZXMgYSBkYXRhOiBVUkwgZnJvbSBzdHJpbmcgZGF0YS5cblx0ICAgKlxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIGNvbnRlbnQgdG8gZW5jb2RlIHRoZSBkYXRhOiBVUkwgZnJvbS5cblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFR5cGUgVGhlIG1pbWV0eXBlIG9mIHRoZSBkYXRhIHN0ciByZXByZXNlbnRzLlxuXHQgICAqIEBwYXJhbSB7Ym9vbD19IG9wdF9pc0JpbmFyeSBXaGV0aGVyIHRoZSBzdHJpbmcgZGF0YSBpcyBhIGJpbmFyeSBzdHJpbmdcblx0ICAgKiAgICAgKGFuZCB0aGVyZWZvcmUgc2hvdWxkIGJlIGJhc2U2NCBlbmNvZGVkKS4gVHJ1ZSBieSBkZWZhdWx0LlxuXHQgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGNyZWF0ZWQgZGF0YTogVVJMLlxuXHQgICAqL1xuXHQgIHN0clRvRGF0YVVSTDogZnVuY3Rpb24oc3RyLCBjb250ZW50VHlwZSwgb3B0X2lzQmluYXJ5KSB7XG5cdCAgICB2YXIgaXNCaW5hcnkgPSBvcHRfaXNCaW5hcnkgIT0gdW5kZWZpbmVkID8gb3B0X2lzQmluYXJ5IDogdHJ1ZTtcblx0ICAgIGlmIChpc0JpbmFyeSkge1xuXHQgICAgICByZXR1cm4gJ2RhdGE6JyArIGNvbnRlbnRUeXBlICsgJztiYXNlNjQsJyArIHNlbGYuYnRvYShzdHIpO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgcmV0dXJuICdkYXRhOicgKyBjb250ZW50VHlwZSArICcsJyArIHN0cjtcblx0ICAgIH1cblx0ICB9LFxuXG5cdCAgLyoqXG5cdCAgICogQ3JlYXRlcyBhIGJsb2I6IFVSTCBmcm9tIGEgYmluYXJ5IHN0ci5cblx0ICAgKlxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfSBiaW5TdHIgVGhlIGNvbnRlbnQgYXMgYSBiaW5hcnkgc3RyaW5nLlxuXHQgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X2NvbnRlbnRUeXBlIEFuIG9wdGlvbmFsIG1pbWV0eXBlIG9mIHRoZSBkYXRhLlxuXHQgICAqIEByZXR1cm4ge3N0cmluZ30gQSBuZXcgYmxvYjogVVJMLlxuXHQgICAqL1xuXHQgIHN0clRvT2JqZWN0VVJMOiBmdW5jdGlvbihiaW5TdHIsIG9wdF9jb250ZW50VHlwZSkge1xuXG5cdCAgICB2YXIgdWk4YSA9IG5ldyBVaW50OEFycmF5KGJpblN0ci5sZW5ndGgpO1xuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1aThhLmxlbmd0aDsgKytpKSB7XG5cdCAgICAgIHVpOGFbaV0gPSBiaW5TdHIuY2hhckNvZGVBdChpKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbdWk4YV0sXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIG9wdF9jb250ZW50VHlwZSA/IHt0eXBlOiBvcHRfY29udGVudFR5cGV9IDoge30pO1xuXG5cdCAgICByZXR1cm4gc2VsZi5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXHQgIH0sXG5cblx0ICAvKipcblx0ICAgKiBDcmVhdGVzIGEgYmxvYjogVVJMIGZyb20gYSBGaWxlIG9yIEJsb2Igb2JqZWN0LlxuXHQgICAqXG5cdCAgICogQHBhcmFtIHtCbG9ifEZpbGV9IGJsb2IgVGhlIEZpbGUgb3IgQmxvYiBkYXRhLlxuXHQgICAqIEByZXR1cm4ge3N0cmluZ30gQSBuZXcgYmxvYjogVVJMLlxuXHQgICAqL1xuXHQgIGZpbGVUb09iamVjdFVSTDogZnVuY3Rpb24oYmxvYikge1xuXHQgICAgcmV0dXJuIHNlbGYuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblx0ICB9LFxuXG5cdCAgLyoqXG5cdCAgICogUmVhZHMgYSBGaWxlIG9yIEJsb2Igb2JqZWN0IGFuZCByZXR1cm5zIGl0IGFzIGFuIEFycmF5QnVmZmVyLlxuXHQgICAqXG5cdCAgICogQHBhcmFtIHtCbG9ifEZpbGV9IGJsb2IgVGhlIEZpbGUgb3IgQmxvYiBkYXRhLlxuXHQgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFN1Y2Nlc3MgY2FsbGJhY2sgcGFzc2VkIHRoZSBhcnJheSBidWZmZXIuXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9lcnJvciBPcHRpb25hbCBlcnJvciBjYWxsYmFjayBpZiB0aGUgcmVhZCBmYWlscy5cblx0ICAgKi9cblx0ICBmaWxlVG9BcnJheUJ1ZmZlcjogZnVuY3Rpb24oYmxvYiwgY2FsbGJhY2ssIG9wdF9lcnJvckNhbGxiYWNrKSB7XG5cdCAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0ICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG5cdCAgICAgIGNhbGxiYWNrKGUudGFyZ2V0LnJlc3VsdCk7XG5cdCAgICB9O1xuXHQgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG5cdCAgICAgIGlmIChvcHRfZXJyb3JDYWxsYmFjaykge1xuXHQgICAgICAgIG9wdF9lcnJvckNhbGxiYWNrKGUpO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYik7XG5cdCAgfSxcblxuXHQgIC8qKlxuXHQgICAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBibG9iIGZyb20gYSBkYXRhIFVSTCAoZWl0aGVyIGJhc2U2NCBlbmNvZGVkIG9yIG5vdCkuXG5cdCAgICpcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YVVSTCBUaGUgZGF0YSBVUkwgdG8gY29udmVydC5cblx0ICAgKiBAcmV0dXJuIHtCbG9ifSBBIGJsb2IgcmVwcmVzZW50aW5nIHRoZSBhcnJheSBidWZmZXIgZGF0YS5cblx0ICAgKi9cblx0ICBkYXRhVVJMVG9CbG9iOiBmdW5jdGlvbihkYXRhVVJMKSB7XG5cdCAgICB2YXIgQkFTRTY0X01BUktFUiA9ICc7YmFzZTY0LCc7XG5cdCAgICBpZiAoZGF0YVVSTC5pbmRleE9mKEJBU0U2NF9NQVJLRVIpID09IC0xKSB7XG5cdCAgICAgIHZhciBwYXJ0cyA9IGRhdGFVUkwuc3BsaXQoJywnKTtcblx0ICAgICAgdmFyIGNvbnRlbnRUeXBlID0gcGFydHNbMF0uc3BsaXQoJzonKVsxXTtcblx0ICAgICAgdmFyIHJhdyA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJ0c1sxXSk7XG5cblx0ICAgICAgcmV0dXJuIG5ldyBCbG9iKFtyYXddLCB7dHlwZTogY29udGVudFR5cGV9KTtcblx0ICAgIH1cblxuXHQgICAgdmFyIHBhcnRzID0gZGF0YVVSTC5zcGxpdChCQVNFNjRfTUFSS0VSKTtcblx0ICAgIHZhciBjb250ZW50VHlwZSA9IHBhcnRzWzBdLnNwbGl0KCc6JylbMV07XG5cdCAgICB2YXIgcmF3ID0gd2luZG93LmF0b2IocGFydHNbMV0pO1xuXHQgICAgdmFyIHJhd0xlbmd0aCA9IHJhdy5sZW5ndGg7XG5cblx0ICAgIHZhciB1SW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkocmF3TGVuZ3RoKTtcblxuXHQgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7ICsraSkge1xuXHQgICAgICB1SW50OEFycmF5W2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBuZXcgQmxvYihbdUludDhBcnJheV0sIHt0eXBlOiBjb250ZW50VHlwZX0pO1xuXHQgIH0sXG5cblx0ICAvKipcblx0ICAgKiBSZWFkcyBhbiBBcnJheUJ1ZmZlciBhcyByZXR1cm5zIGl0cyBjb250ZW50cyBhcyBhIGJpbmFyeSBzdHJpbmcuXG5cdCAgICpcblx0ICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBidWZmZXIgVGhlIGJ1ZmZlciBvZiBkYXRhLlxuXHQgICAqIEBwYXJhbSB7c3RyaW5nPX0gb3B0X2NvbnRlbnRUeXBlIEFuIG9wdGlvbmFsIG1pbWV0eXBlIG9mIHRoZSBkYXRhLlxuXHQgICAqIEByZXR1cm4ge0Jsb2J9IEEgYmxvYiByZXByZXNlbnRpbmcgdGhlIGFycmF5IGJ1ZmZlciBkYXRhLlxuXHQgICAqL1xuXHQgIGFycmF5QnVmZmVyVG9CbG9iOiBmdW5jdGlvbihidWZmZXIsIG9wdF9jb250ZW50VHlwZSkge1xuXHQgICAgdmFyIHVJbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXIpO1xuXHQgICAgcmV0dXJuIG5ldyBCbG9iKFt1SW50OEFycmF5XSxcblx0ICAgICAgICAgICAgICAgICAgICBvcHRfY29udGVudFR5cGUgPyB7dHlwZTogb3B0X2NvbnRlbnRUeXBlfSA6IHt9KTtcblx0ICB9LFxuXG5cdCAgLyoqXG5cdCAgICogUmVhZHMgYW4gQXJyYXlCdWZmZXIgYXMgcmV0dXJucyBpdHMgY29udGVudHMgYXMgYSBiaW5hcnkgc3RyaW5nLlxuXHQgICAqXG5cdCAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYnVmZmVyIFRoZSBidWZmZXIgb2YgZGF0YS5cblx0ICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBTdWNjZXNzIGNhbGxiYWNrIHBhc3NlZCB0aGUgYmluYXJ5IHN0cmluZy5cblx0ICAgKiBAcGFyYW0ge0Z1bmN0aW9uPX0gb3B0X2Vycm9yIE9wdGlvbmFsIGVycm9yIGNhbGxiYWNrIGlmIHRoZSByZWFkIGZhaWxzLlxuXHQgICAqL1xuXHQgIGFycmF5QnVmZmVyVG9CaW5hcnlTdHJpbmc6IGZ1bmN0aW9uKGJ1ZmZlciwgY2FsbGJhY2ssIG9wdF9lcnJvckNhbGxiYWNrKSB7XG5cdCAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0ICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG5cdCAgICAgIGNhbGxiYWNrKGUudGFyZ2V0LnJlc3VsdCk7XG5cdCAgICB9O1xuXHQgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG5cdCAgICAgIGlmIChvcHRfZXJyb3JDYWxsYmFjaykge1xuXHQgICAgICAgIG9wdF9lcnJvckNhbGxiYWNrKGUpO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICB2YXIgdUludDhBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG5cdCAgICByZWFkZXIucmVhZEFzQmluYXJ5U3RyaW5nKG5ldyBCbG9iKFt1SW50OEFycmF5XSkpO1xuXHQgIH0sXG5cblx0ICAvKipcblx0ICAgKiBDcmVhdGUgYSBiaW5hcnkgc3RyaW5nIG91dCBvZiBhbiBhcnJheSBvZiBudW1iZXJzIChieXRlcyksIGVhY2ggdmFyeWluZ1xuXHQgICAqIGZyb20gMC0yNTUuXG5cdCAgICpcblx0ICAgKiBAcGFyYW0ge0FycmF5fSBieXRlcyBUaGUgYXJyYXkgb2YgbnVtYmVycyB0byB0cmFuc2Zvcm0gaW50byBhIGJpbmFyeSBzdHIuXG5cdCAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgYnl0ZSBhcnJheSBhcyBhIHN0cmluZy5cblx0ICAgKi9cblx0ICBhcnJheVRvQmluYXJ5U3RyaW5nOiBmdW5jdGlvbihieXRlcykge1xuXHQgICAgaWYgKHR5cGVvZiBieXRlcyAhPSB0eXBlb2YgW10pIHtcblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdCAgICB2YXIgaSA9IGJ5dGVzLmxlbmd0aDtcblx0ICAgIHZhciBic3RyID0gbmV3IEFycmF5KGkpO1xuXHQgICAgd2hpbGUgKGktLSkge1xuXHQgICAgICBic3RyW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG5cdCAgICB9XG5cdCAgICByZXR1cm4gYnN0ci5qb2luKCcnKTtcblx0ICB9LFxuXG5cdCAgLyoqXG5cdCAgICogUmV0dXJucyB0aGUgZmlsZSBleHRlbnNpb24gZm9yIGEgZ2l2ZW4gZmlsZW5hbWUuXG5cdCAgICpcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgVGhlIGZpbGVuYW1lLlxuXHQgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGZpbGUncyBleHRlbnNpb24uXG5cdCAgICovXG5cdCAgZ2V0RmlsZUV4dGVuc2lvbjogZnVuY3Rpb24oZmlsZW5hbWUpIHtcblx0ICAgIHZhciBpZHggPSBmaWxlbmFtZS5sYXN0SW5kZXhPZignLicpO1xuXHQgICAgcmV0dXJuIGlkeCAhPSAtMSA/IGZpbGVuYW1lLnN1YnN0cmluZyhpZHgpIDogJyc7XG5cdCAgfVxuXHR9O1xuXG5cblx0dmFyIE15RmlsZUVycm9yID0gZnVuY3Rpb24ob2JqKSB7XG5cdCAgdGhpcy5wcm90b3R5cGUgPSBGaWxlRXJyb3IucHJvdG90eXBlO1xuXHQgIHRoaXMuY29kZSA9IG9iai5jb2RlO1xuXHQgIHRoaXMubmFtZSA9IG9iai5uYW1lO1xuXHR9O1xuXHQvL015RmlsZUVycm9yLnByb3RvdHlwZS5fX3Byb3RvX18gPSBGaWxlRXJyb3IucHJvdG90eXBlO1xuXG5cdC8vIEV4dGVuZCBGaWxlRXJyb3Igd2l0aCBjdXN0b20gZXJyb3JzIGFuZCBhIGNvbnZlbmllbmNlIG1ldGhvZCB0byBnZXQgZXJyb3Jcblx0Ly8gY29kZSBtbmVtb25pYy5cblx0RmlsZUVycm9yLkJST1dTRVJfTk9UX1NVUFBPUlRFRCA9IDEwMDA7XG5cblx0Ly8gVE9ETzogcmVtb3ZlIHdoZW4gRmlsZUVycm9yLm5hbWUgaXMgaW1wbGVtZW50ZWQgKGNyYnVnLmNvbS84NjAxNCkuXG5cdEZpbGVFcnJvci5wcm90b3R5cGUuX19kZWZpbmVHZXR0ZXJfXygnbmFtZScsIGZ1bmN0aW9uKCkge1xuXHQgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoRmlsZUVycm9yKTtcblx0ICBmb3IgKHZhciBpID0gMCwga2V5OyBrZXkgPSBrZXlzW2ldOyArK2kpIHtcblx0ICAgIGlmIChGaWxlRXJyb3Jba2V5XSA9PSB0aGlzLmNvZGUpIHtcblx0ICAgICAgcmV0dXJuIGtleTtcblx0ICAgIH1cblx0ICB9XG5cdCAgcmV0dXJuICdVbmtub3duIEVycm9yJztcblx0fSk7XG5cblxuXHR2YXIgRmlsZXIgPSBuZXcgZnVuY3Rpb24oKSB7XG5cblx0ICB2YXIgRlNfSU5JVF9FUlJPUl9NU0cgPSAnRmlsZXN5c3RlbSBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQuJztcblx0ICB2YXIgTk9UX0lNUExFTUVOVEVEX01TRyA9ICdOb3QgaW1wbGVtZW50ZWQuJztcblx0ICB2YXIgTk9UX0FfRElSRUNUT1JZID0gJ1BhdGggd2FzIG5vdCBhIGRpcmVjdG9yeS4nO1xuXHQgIHZhciBJTkNPUlJFQ1RfQVJHUyA9ICdUaGVzZSBtZXRob2QgYXJndW1lbnRzIGFyZSBub3Qgc3VwcG9ydGVkLic7XG5cdCAgdmFyIEZTX1VSTF9TQ0hFTUUgPSAnZmlsZXN5c3RlbTonO1xuXHQgIHZhciBERUZBVUxUX0ZTX1NJWkUgPSAxMDI0ICogMTAyNDsgLy8gMU1CLlxuXG5cdCAgdmFyIGZzXyA9IG51bGw7XG5cdCAgdmFyIGN3ZF8gPSBudWxsO1xuXHQgIHZhciBpc09wZW5fID0gZmFsc2U7XG5cblx0ICB2YXIgaXNGc1VSTF8gPSBmdW5jdGlvbihwYXRoKSB7XG5cdCAgICByZXR1cm4gcGF0aC5pbmRleE9mKEZTX1VSTF9TQ0hFTUUpID09IDA7XG5cdCAgfTtcblxuXHQgIC8vIFBhdGggY2FuIGJlIHJlbGF0aXZlIG9yIGFic29sdXRlLiBJZiByZWxhdGl2ZSwgaXQncyB0YWtlbiBmcm9tIHRoZSBjd2RfLlxuXHQgIC8vIElmIGEgZmlsZXN5c3RlbSBVUkwgaXMgcGFzc2VkIGl0LCBpdCBpcyBzaW1wbGUgcmV0dXJuZWRcblx0ICB2YXIgcGF0aFRvRnNVUkxfID0gZnVuY3Rpb24ocGF0aCkge1xuXHQgICAgaWYgKCFpc0ZzVVJMXyhwYXRoKSkge1xuXHQgICAgICBpZiAocGF0aFswXSA9PSAnLycpIHtcblx0ICAgICAgICBwYXRoID0gZnNfLnJvb3QudG9VUkwoKSArIHBhdGguc3Vic3RyaW5nKDEpO1xuXHQgICAgICB9IGVsc2UgaWYgKHBhdGguaW5kZXhPZignLi8nKSA9PSAwIHx8IHBhdGguaW5kZXhPZignLi4vJykgPT0gMCkge1xuXHQgICAgICAgIGlmIChwYXRoID09ICcuLi8nICYmIGN3ZF8gIT0gZnNfLnJvb3QpIHtcblx0ICAgICAgICAgIHBhdGggPSBjd2RfLnRvVVJMKCkgKyAnLycgKyBwYXRoO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICBwYXRoID0gY3dkXy50b1VSTCgpICsgcGF0aDtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcGF0aCA9IGN3ZF8udG9VUkwoKSArICcvJyArIHBhdGg7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHBhdGg7XG5cdCAgfTtcblxuXHQgIC8qKlxuXHQgICAqIExvb2tzIHVwIGEgRmlsZUVudHJ5IG9yIERpcmVjdG9yeUVudHJ5IGZvciBhIGdpdmVuIHBhdGguXG5cdCAgICpcblx0ICAgKiBAcGFyYW0ge2Z1bmN0aW9uKC4uLkZpbGVFbnRyeXxEaXJlY3RvckVudHJ5KX0gY2FsbGJhY2sgQSBjYWxsYmFjayB0byBiZVxuXHQgICAqICAgICBwYXNzZWQgdGhlIGVudHJ5L2VudHJpZXMgdGhhdCB3ZXJlIGZldGNoZWQuIFRoZSBvcmRlcmluZyBvZiB0aGVcblx0ICAgKiAgICAgZW50cmllcyBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrIGNvcnJlc3BvbmQgdG8gdGhlIHNhbWUgb3JkZXIgcGFzc2VkXG5cdCAgICogICAgIHRvIHRoaXMgbWV0aG9kLlxuXHQgICAqIEBwYXJhbSB7ZnVuY3Rpb24oLi4uRXJyb3IpfSBlcnJiYWNrIEEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gYW4gZXJyb3Igb2NjdXJzLlxuXHQgICAqIEBwYXJhbSB7Li4uc3RyaW5nfSB2YXJfYXJncyAxLTIgcGF0aHMgdG8gbG9va3VwIGFuZCByZXR1cm4gZW50cmllcyBmb3IuXG5cdCAgICogICAgIFRoZXNlIGNhbiBiZSBwYXRocyBvciBmaWxlc3lzdGVtOiBVUkxzLlxuXHQgICAqL1xuXHQgIHZhciBnZXRFbnRyeV8gPSBmdW5jdGlvbihjYWxsYmFjaywgZXJyYmFjaywgdmFyX2FyZ3MpIHtcblx0ICAgIHZhciBzcmNTdHIgPSBhcmd1bWVudHNbMl07XG5cdCAgICB2YXIgZGVzdFN0ciA9IGFyZ3VtZW50c1szXTtcblxuXHQgICAgdmFyIG9uRXJyb3IgPSBmdW5jdGlvbihlKSB7XG5cdCAgICAgIGlmIChlLmNvZGUgPT0gRmlsZUVycm9yLk5PVF9GT1VORF9FUlIpIHtcblx0ICAgICAgICBpZiAoZGVzdFN0cikge1xuXHQgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBzcmNTdHIgKyAnXCIgb3IgXCInICsgZGVzdFN0ciArXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiIGRvZXMgbm90IGV4aXN0LicpO1xuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArIHNyY1N0ciArICdcIiBkb2VzIG5vdCBleGlzdC4nKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9ibGVtIGdldHRpbmcgRW50cnkgZm9yIG9uZSBvciBtb3JlIHBhdGhzLicpO1xuXHQgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICBpZih0eXBlb2YgZXJyYmFjayAhPT0gJ2Z1bmN0aW9uJyAmJiBlcnJiYWNrICE9IG51bGwpe1xuXHQgICAgICBzcmNTdHIgPSBhcmd1bWVudHNbMV07XG5cdCAgICAgIGRlc3RTdHIgPSBhcmd1bWVudHNbMl07XG5cdCAgICAgIGVycmJhY2sgPSBvbkVycm9yO1xuXHQgICAgfVxuXG5cdCAgICAvLyBCdWlsZCBhIGZpbGVzeXN0ZW06IFVSTCBtYW51YWxseSBpZiB3ZSBuZWVkIHRvLlxuXHQgICAgdmFyIHNyYyA9IHBhdGhUb0ZzVVJMXyhzcmNTdHIpO1xuXG5cdCAgICBpZiAoZGVzdFN0cikge1xuXHQgICAgICB2YXIgZGVzdCA9IHBhdGhUb0ZzVVJMXyhkZXN0U3RyKTtcblx0ICAgICAgc2VsZi5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKHNyYywgZnVuY3Rpb24oc3JjRW50cnkpIHtcblx0ICAgICAgICBzZWxmLnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoZGVzdCwgZnVuY3Rpb24oZGVzdEVudHJ5KSB7XG5cdCAgICAgICAgICBjYWxsYmFjayhzcmNFbnRyeSwgZGVzdEVudHJ5KTtcblx0ICAgICAgICB9LCBlcnJiYWNrKTtcblx0ICAgICAgfSwgZXJyYmFjayk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBzZWxmLnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoc3JjLCBjYWxsYmFjaywgZXJyYmFjayk7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIC8qKlxuXHQgICAqIENvcHkgb3IgbW92ZXMgYSBmaWxlIG9yIGRpcmVjdG9yeSB0byBhIGRlc3RpbmF0aW9uLlxuXHQgICAqXG5cdCAgICogU2VlIHB1YmxpYyBtZXRob2QncyBkZXNjcmlwdGlvbiAoRmlsZXIuY3AoKSkgZm9yIHJlc3Qgb2YgcGFyYW1zLlxuXHQgICAqIEBwYXJhbSB7Qm9vbGVhbj19IG9wdF9kZWxldGVPcmlnIFRydWUgaWYgdGhlIG9yaWdpbmFsIGVudHJ5IHNob3VsZCBiZVxuXHQgICAqICAgICBkZWxldGVkIGFmdGVyIHRoZSBjb3B5IHRha2VzIHBsYWNlLCBlc3NlbnRpYWxseSBtYWtpbmcgdGhlIG9wZXJhdGlvblxuXHQgICAqICAgICBhIG1vdmUgaW5zdGVhZCBvZiBhIGNvcHkuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgICAqL1xuXHQgIHZhciBjb3B5T3JNb3ZlXyA9IGZ1bmN0aW9uKHNyYywgZGVzdCwgb3B0X25ld05hbWUsIG9wdF9zdWNjZXNzQ2FsbGJhY2ssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlciwgb3B0X2RlbGV0ZU9yaWcpIHtcblx0ICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgaWYgKCFmc18pIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKEZTX0lOSVRfRVJST1JfTVNHKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHR5cGVvZiBzcmMgIT0gdHlwZW9mIGRlc3QpIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKElOQ09SUkVDVF9BUkdTKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIG5ld05hbWUgPSBvcHRfbmV3TmFtZSB8fCBudWxsO1xuXHQgICAgdmFyIGRlbGV0ZU9yaWcgPSBvcHRfZGVsZXRlT3JpZyAhPSB1bmRlZmluZWQgPyBvcHRfZGVsZXRlT3JpZyA6IGZhbHNlO1xuXG5cdCAgICBpZiAoKHNyYy5pc0ZpbGUgfHwgZGVzdC5pc0RpcmVjdG9yeSkgJiYgZGVzdC5pc0RpcmVjdG9yeSkge1xuXHQgICAgICBpZiAoZGVsZXRlT3JpZykge1xuXHQgICAgICAgIHNyYy5tb3ZlVG8oZGVzdCwgbmV3TmFtZSwgb3B0X3N1Y2Nlc3NDYWxsYmFjaywgb3B0X2Vycm9ySGFuZGxlcik7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgc3JjLmNvcHlUbyhkZXN0LCBuZXdOYW1lLCBvcHRfc3VjY2Vzc0NhbGxiYWNrLCBvcHRfZXJyb3JIYW5kbGVyKTtcblx0ICAgICAgfVxuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgZ2V0RW50cnlfKGZ1bmN0aW9uKHNyY0VudHJ5LCBkZXN0RGlyKSB7XG5cdCAgICAgICAgaWYgKCFkZXN0RGlyLmlzRGlyZWN0b3J5KSB7XG5cdCAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcignT29wcyEgXCInICsgZGVzdERpci5uYW1lICsgJyBpcyBub3QgYSBkaXJlY3RvcnkhJyk7XG5cdCAgICAgICAgICBpZiAob3B0X2Vycm9ySGFuZGxlcikge1xuXHQgICAgICAgICAgICBvcHRfZXJyb3JIYW5kbGVyKGUpO1xuXHQgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgdGhyb3cgZTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKGRlbGV0ZU9yaWcpIHtcblx0ICAgICAgICAgIHNyY0VudHJ5Lm1vdmVUbyhkZXN0RGlyLCBuZXdOYW1lLCBvcHRfc3VjY2Vzc0NhbGxiYWNrLCBvcHRfZXJyb3JIYW5kbGVyKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgc3JjRW50cnkuY29weVRvKGRlc3REaXIsIG5ld05hbWUsIG9wdF9zdWNjZXNzQ2FsbGJhY2ssIG9wdF9lcnJvckhhbmRsZXIpO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSwgb3B0X2Vycm9yQ2FsbGJhY2ssIHNyYywgZGVzdCk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgZnVuY3Rpb24gRmlsZXIoZnMpIHtcblx0ICAgIGZzXyAgPSBmcyB8fCBudWxsO1xuXHQgICAgaWYgKGZzXykge1xuXHQgICAgICBjd2RfID0gZnNfLnJvb3Q7XG5cdCAgICAgIGlzT3Blbl8gPSB0cnVlOyAvLyBUT0RPOiB0aGlzIG1heSBub3QgYmUgdGhlIGNhc2UuXG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgRmlsZXIuREVGQVVMVF9GU19TSVpFID0gREVGQVVMVF9GU19TSVpFO1xuXHQgIEZpbGVyLnZlcnNpb24gPSAnMC40LjMnO1xuXG5cdCAgRmlsZXIucHJvdG90eXBlID0ge1xuXHQgICAgZ2V0IGZzKCkge1xuXHQgICAgICByZXR1cm4gZnNfO1xuXHQgICAgfSxcblx0ICAgIGdldCBpc09wZW4oKSB7XG5cdCAgICAgIHJldHVybiBpc09wZW5fO1xuXHQgICAgfSxcblx0ICAgIGdldCBjd2QoKSB7XG5cdCAgICAgIHJldHVybiBjd2RfO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIC8qKlxuXHQgICAqIENvbnN0cnVjdHMgYW5kIHJldHVybnMgYSBmaWxlc3lzdGVtOiBVUkwgZ2l2ZW4gYSBwYXRoLlxuXHQgICAqXG5cdCAgICogQHBhcmFtIHtzdHJpbmc9fSBwYXRoIFRoZSBwYXRoIHRvIGNvbnN0cnVjdCBhIFVSTCBmb3IuXG5cdCAgICogICAgIHNpemUge2ludD19IFRoZSBzdG9yYWdlIHNpemUgKGluIGJ5dGVzKSB0byBvcGVuIHRoZSBmaWxlc3lzdGVtIHdpdGguXG5cdCAgICogICAgICAgICBEZWZhdWx0cyB0byBERUZBVUxUX0ZTX1NJWkUuXG5cdCAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgZmlsZXN5c3RlbTogVVJMLlxuXHQgICAqL1xuXHQgIEZpbGVyLnByb3RvdHlwZS5wYXRoVG9GaWxlc3lzdGVtVVJMID0gZnVuY3Rpb24ocGF0aCkge1xuXHQgICAgcmV0dXJuIHBhdGhUb0ZzVVJMXyhwYXRoKTtcblx0ICB9XG5cblx0ICAvKipcblx0ICAgKiBJbml0aWFsaXplcyAob3BlbnMpIHRoZSBmaWxlIHN5c3RlbS5cblx0ICAgKlxuXHQgICAqIEBwYXJhbSB7b2JqZWN0PX0gb3B0X2luaXRPYmogT3B0aW9uYWwgb2JqZWN0IGxpdGVyYWwgd2l0aCB0aGUgZm9sbG93aW5nXG5cdCAgICogICAgIHByb3BlcnRpZXMuIE5vdGU6IElmIHt9IG9yIG51bGwgaXMgcGFzc2VkLCBkZWZhdWx0IHZhbHVlcyBhcmUgdXNlZC5cblx0ICAgKiAgICAgcGVyc2lzdGVudCB7Qm9vbGVhbj19IFdoZXRoZXIgdGhlIGJyb3dzZXIgc2hvdWxkIHVzZSBwZXJzaXN0ZW50IHF1b3RhLlxuXHQgICAqICAgICAgICAgRGVmYXVsdCBpcyBmYWxzZS5cblx0ICAgKiAgICAgc2l6ZSB7aW50PX0gVGhlIHN0b3JhZ2Ugc2l6ZSAoaW4gYnl0ZXMpIHRvIG9wZW4gdGhlIGZpbGVzeXN0ZW0gd2l0aC5cblx0ICAgKiAgICAgICAgIERlZmF1bHRzIHRvIERFRkFVTFRfRlNfU0laRS5cblx0ICAgKiBAcGFyYW0ge0Z1bmN0aW9uPX0gb3B0X3N1Y2Nlc3NDYWxsYmFjayBPcHRpb25hbCBzdWNjZXNzIGhhbmRsZXIgcGFzc2VkIGFcblx0ICAgKiAgICAgIERPTUZpbGVTeXN0ZW0gb2JqZWN0LlxuXHQgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfZXJyb3JIYW5kbGVyIE9wdGlvbmFsIGVycm9yIGNhbGxiYWNrLlxuXHQgICAqL1xuXHQgIEZpbGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24ob3B0X2luaXRPYmosIG9wdF9zdWNjZXNzQ2FsbGJhY2ssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRfZXJyb3JIYW5kbGVyKSB7XG5cdCAgICBpZiAoIXNlbGYucmVxdWVzdEZpbGVTeXN0ZW0pIHtcblx0ICAgICAgdGhyb3cgbmV3IE15RmlsZUVycm9yKHtcblx0ICAgICAgICBjb2RlOiBGaWxlRXJyb3IuQlJPV1NFUl9OT1RfU1VQUE9SVEVELFxuXHQgICAgICAgIG5hbWU6ICdCUk9XU0VSX05PVF9TVVBQT1JURUQnXG5cdCAgICAgIH0pO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoZnNfKSB7XG5cdCAgICAgIGlmIChvcHRfc3VjY2Vzc0NhbGxiYWNrKSBvcHRfc3VjY2Vzc0NhbGxiYWNrKGZzXyk7XG5cdCAgICAgIHJldHVybjtcblx0ICAgIH1cblxuXHQgICAgdmFyIGluaXRPYmogPSBvcHRfaW5pdE9iaiA/IG9wdF9pbml0T2JqIDoge307IC8vIFVzZSBkZWZhdWx0cyBpZiBvYmogaXMgbnVsbC5cblxuXHQgICAgdmFyIHNpemUgPSBpbml0T2JqLnNpemUgfHwgREVGQVVMVF9GU19TSVpFO1xuXHQgICAgdGhpcy50eXBlID0gc2VsZi5URU1QT1JBUlk7XG5cdCAgICBpZiAoJ3BlcnNpc3RlbnQnIGluIGluaXRPYmogJiYgaW5pdE9iai5wZXJzaXN0ZW50KSB7XG5cdCAgICAgIHRoaXMudHlwZSA9IHNlbGYuUEVSU0lTVEVOVDtcblx0ICAgIH1cblxuXHQgICAgdmFyIGluaXQgPSBmdW5jdGlvbihmcykge1xuXHQgICAgICB0aGlzLnNpemUgPSBzaXplO1xuXHQgICAgICBmc18gPSBmcztcblx0ICAgICAgY3dkXyA9IGZzXy5yb290O1xuXHQgICAgICBpc09wZW5fID0gdHJ1ZTtcblxuXHQgICAgICBvcHRfc3VjY2Vzc0NhbGxiYWNrICYmIG9wdF9zdWNjZXNzQ2FsbGJhY2soZnMpO1xuXHQgICAgfTtcblxuXHQgICAgaWYgKHRoaXMudHlwZSA9PSBzZWxmLlBFUlNJU1RFTlQgJiYgISFuYXZpZ2F0b3IucGVyc2lzdGVudFN0b3JhZ2UpIHtcblx0ICAgICAgbmF2aWdhdG9yLnBlcnNpc3RlbnRTdG9yYWdlLnJlcXVlc3RRdW90YShzaXplLCBmdW5jdGlvbihncmFudGVkQnl0ZXMpIHtcblx0ICAgICAgICBzZWxmLnJlcXVlc3RGaWxlU3lzdGVtKFxuXHQgICAgICAgICAgICB0aGlzLnR5cGUsIGdyYW50ZWRCeXRlcywgaW5pdC5iaW5kKHRoaXMpLCBvcHRfZXJyb3JIYW5kbGVyKTtcblx0ICAgICAgfS5iaW5kKHRoaXMpLCBvcHRfZXJyb3JIYW5kbGVyKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIHNlbGYucmVxdWVzdEZpbGVTeXN0ZW0oXG5cdCAgICAgICAgICB0aGlzLnR5cGUsIHNpemUsIGluaXQuYmluZCh0aGlzKSwgb3B0X2Vycm9ySGFuZGxlcik7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIC8qKlxuXHQgICAqIFJlYWRzIHRoZSBjb250ZW50cyBvZiBhIGRpcmVjdG9yeS5cblx0ICAgKlxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfERpcmVjdG9yeUVudHJ5fSBkaXJFbnRyeU9yUGF0aCBBIHBhdGggcmVsYXRpdmUgdG8gdGhlXG5cdCAgICogICAgIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIEluIG1vc3QgY2FzZXMgdGhhdCBpcyB0aGUgcm9vdCBlbnRyeSwgdW5sZXNzXG5cdCAgICogICAgIGNkKCkgaGFzIGJlZW4gY2FsbGVkLiBBIERpcmVjdG9yeUVudHJ5IG9yIGZpbGVzeXN0ZW0gVVJMIGNhbiBhbHNvIGJlXG5cdCAgICogICAgIHBhc3NlZCwgaW4gd2hpY2ggY2FzZSwgdGhlIGZvbGRlcidzIGNvbnRlbnRzIHdpbGwgYmUgcmV0dXJuZWQuXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3VjY2Vzc0NhbGxiYWNrIFN1Y2Nlc3MgaGFuZGxlciBwYXNzZWQgYW4gQXJyYXk8RW50cnk+LlxuXHQgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfZXJyb3JIYW5kbGVyIE9wdGlvbmFsIGVycm9yIGNhbGxiYWNrLlxuXHQgICAqL1xuXHQgIEZpbGVyLnByb3RvdHlwZS5scyA9IGZ1bmN0aW9uKGRpckVudHJ5T3JQYXRoLCBzdWNjZXNzQ2FsbGJhY2ssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlcikge1xuXHQgICAgaWYgKCFmc18pIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKEZTX0lOSVRfRVJST1JfTVNHKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24oZGlyRW50cnkpIHtcblxuXHQgICAgICAvLyBSZWFkIGNvbnRlbnRzIG9mIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIEFjY29yZGluZyB0byBzcGVjLCBuZWVkIHRvXG5cdCAgICAgIC8vIGtlZXAgY2FsbGluZyByZWFkRW50cmllcygpIHVudGlsIGxlbmd0aCBvZiByZXN1bHQgYXJyYXkgaXMgMC4gV2UncmVcblx0ICAgICAgLy8gZ3VhcmVudGVlZCB0aGUgc2FtZSBlbnRyeSB3b24ndCBiZSByZXR1cm5lZCBhZ2Fpbi5cblx0ICAgICAgdmFyIGVudHJpZXNfID0gW107XG5cdCAgICAgIHZhciByZWFkZXIgPSBkaXJFbnRyeS5jcmVhdGVSZWFkZXIoKTtcblxuXHQgICAgICB2YXIgcmVhZEVudHJpZXMgPSBmdW5jdGlvbigpIHtcblx0ICAgICAgICByZWFkZXIucmVhZEVudHJpZXMoZnVuY3Rpb24ocmVzdWx0cykge1xuXHQgICAgICAgICAgaWYgKCFyZXN1bHRzLmxlbmd0aCkge1xuXHQgICAgICAgICAgICAvLyBCeSBkZWZhdWx0LCBzb3J0IHRoZSBsaXN0IGJ5IG5hbWUuXG5cdCAgICAgICAgICAgIGVudHJpZXNfLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHQgICAgICAgICAgICAgIHJldHVybiBhLm5hbWUgPCBiLm5hbWUgPyAtMSA6IGIubmFtZSA8IGEubmFtZSA/IDEgOiAwO1xuXHQgICAgICAgICAgICB9KTtcblx0ICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrKGVudHJpZXNfKTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIGVudHJpZXNfID0gZW50cmllc18uY29uY2F0KFV0aWwudG9BcnJheShyZXN1bHRzKSk7XG5cdCAgICAgICAgICAgIHJlYWRFbnRyaWVzKCk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSwgb3B0X2Vycm9ySGFuZGxlcik7XG5cdCAgICAgIH07XG5cblx0ICAgICAgcmVhZEVudHJpZXMoKTtcblx0ICAgIH07XG5cblx0ICAgIGlmIChkaXJFbnRyeU9yUGF0aC5pc0RpcmVjdG9yeSkgeyAvLyBwYXNzZWQgYSBEaXJlY3RvcnlFbnRyeS5cblx0ICAgICAgY2FsbGJhY2soZGlyRW50cnlPclBhdGgpO1xuXHQgICAgfSBlbHNlIGlmIChpc0ZzVVJMXyhkaXJFbnRyeU9yUGF0aCkpIHsgLy8gcGFzc2VkIGEgZmlsZXN5c3RlbSBVUkwuXG5cdCAgICAgIGdldEVudHJ5XyhjYWxsYmFjaywgb3B0X2Vycm9ySGFuZGxlciwgZGlyRW50cnlPclBhdGgpO1xuXHQgICAgfSBlbHNlIHsgLy8gUGFzc2VkIGEgcGF0aC4gTG9vayB1cCBEaXJlY3RvcnlFbnRyeSBhbmQgcHJvY2VlZWQuXG5cdCAgICAgIC8vIFRPRE86IEZpbmQgd2F5IHRvIHVzZSBnZXRFbnRyeV8oY2FsbGJhY2ssIGRpckVudHJ5T3JQYXRoKTsgd2l0aCBjd2RfLlxuXHQgICAgICBjd2RfLmdldERpcmVjdG9yeShkaXJFbnRyeU9yUGF0aCwge30sIGNhbGxiYWNrLCBvcHRfZXJyb3JIYW5kbGVyKTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgLyoqXG5cdCAgICogQ3JlYXRlcyBhIG5ldyBkaXJlY3RvcnkuXG5cdCAgICpcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgbmFtZSBvZiB0aGUgZGlyZWN0b3J5IHRvIGNyZWF0ZS4gSWYgYSBwYXRoIGlzXG5cdCAgICogICAgIGdpdmVuLCBlYWNoIGludGVybWVkaWF0ZSBkaXIgaXMgY3JlYXRlZCAoZS5nLiBzaW1pbGFyIHRvIG1rZGlyIC1wKS5cblx0ICAgKiBAcGFyYW0ge2Jvb2w9fSBvcHRfZXhjbHVzaXZlIFRydWUgaWYgYW4gZXJyb3Igc2hvdWxkIGJlIHRocm93biBpZlxuXHQgICAqICAgICBvbmUgb3IgbW9yZSBvZiB0aGUgZGlyZWN0b3JpZXMgYWxyZWFkeSBleGlzdHMuIEZhbHNlIGJ5IGRlZmF1bHQuXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0X3N1Y2Nlc3NDYWxsYmFjayBTdWNjZXNzIGhhbmRsZXIgcGFzc2VkIHRoZVxuXHQgICAqICAgICBEaXJlY3RvcnlFbnRyeSB0aGF0IHdhcyBjcmVhdGVkLiBJZiB3ZSB3ZXJlIHBhc3NlZCBhIHBhdGgsIHRoZSBsYXN0XG5cdCAgICogICAgIGRpcmVjdG9yeSB0aGF0IHdhcyBjcmVhdGVkIGlzIHBhc3NlZCBiYWNrLlxuXHQgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfZXJyb3JIYW5kbGVyIE9wdGlvbmFsIGVycm9yIGNhbGxiYWNrLlxuXHQgICAqL1xuXHQgIEZpbGVyLnByb3RvdHlwZS5ta2RpciA9IGZ1bmN0aW9uKHBhdGgsIG9wdF9leGNsdXNpdmUsIG9wdF9zdWNjZXNzQ2FsbGJhY2ssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlcikge1xuXHQgICAgaWYgKCFmc18pIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKEZTX0lOSVRfRVJST1JfTVNHKTtcblx0ICAgIH1cblxuXHQgICAgLy8ganVnZ2xlIGV4Y2x1c2l2ZSBhcmdcblx0ICAgIGlmICh0eXBlb2Ygb3B0X2V4Y2x1c2l2ZSA9PT0gJ2Z1bmN0aW9uJyl7XG5cdCAgICAgIG9wdF9lcnJvckhhbmRsZXIgPSBvcHRfc3VjY2Vzc0NhbGxiYWNrO1xuXHQgICAgICBvcHRfc3VjY2Vzc0NhbGxiYWNrID0gb3B0X2V4Y2x1c2l2ZTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGV4Y2x1c2l2ZSA9IHR5cGVvZiBvcHRfZXhjbHVzaXZlID09PSAnYm9vbGVhbicgPyBvcHRfZXhjbHVzaXZlIDogZmFsc2U7XG5cblx0ICAgIHZhciBpc0Fic29sdXRlID0gcGF0aFswXSA9PT0gJy8nO1xuXHQgICAgdmFyIGZvbGRlclBhcnRzID0gcGF0aC5zcGxpdCgnLycpO1xuXG5cdCAgICB2YXIgY3JlYXRlRGlyID0gZnVuY3Rpb24ocm9vdERpciwgZm9sZGVycykge1xuXHQgICAgICAvLyBUaHJvdyBvdXQgJy4vJyBvciAnLycgYW5kIG1vdmUgb24uIFByZXZlbnRzOiAnL2Zvby8uLy9iYXInLlxuXHQgICAgICBmb2xkZXJzID0gZm9sZGVycy5maWx0ZXIoZnVuY3Rpb24oY2h1bmspe1xuXHQgICAgICAgIHJldHVybiBjaHVuayAhPT0gJy4nICYmIGNodW5rICE9PSAnJztcblx0ICAgICAgfSk7XG5cblx0ICAgICAgaWYgKCFmb2xkZXJzLmxlbmd0aCkge1xuXHQgICAgICAgIGlmIChvcHRfc3VjY2Vzc0NhbGxiYWNrKSBvcHRfc3VjY2Vzc0NhbGxiYWNrKHJvb3REaXIpO1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJvb3REaXIuZ2V0RGlyZWN0b3J5KGZvbGRlcnNbMF0sIHtjcmVhdGU6IHRydWUsIGV4Y2x1c2l2ZTogZXhjbHVzaXZlfSxcblx0ICAgICAgICBmdW5jdGlvbiAoZGlyRW50cnkpIHtcblx0ICAgICAgICAgIGlmIChkaXJFbnRyeS5pc0RpcmVjdG9yeSkgeyAvLyBUT0RPOiBjaGVjayBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5LlxuXHQgICAgICAgICAgICAvLyBSZWN1cnNpdmVseSBhZGQgdGhlIG5ldyBzdWJmb2xkZXIgaWYgd2UgaGF2ZSBtb3JlIHRvIGNyZWF0ZSBhbmRcblx0ICAgICAgICAgICAgLy8gVGhlcmUgd2FzIG1vcmUgdGhhbiBvbmUgZm9sZGVyIHRvIGNyZWF0ZS5cblx0ICAgICAgICAgICAgaWYgKGZvbGRlcnMubGVuZ3RoICYmIGZvbGRlclBhcnRzLmxlbmd0aCAhPSAxKSB7XG5cdCAgICAgICAgICAgICAgY3JlYXRlRGlyKGRpckVudHJ5LCBmb2xkZXJzLnNsaWNlKDEpKTtcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAvLyBSZXR1cm4gdGhlIGxhc3QgZGlyZWN0b3J5IHRoYXQgd2FzIGNyZWF0ZWQuXG5cdCAgICAgICAgICAgICAgaWYgKG9wdF9zdWNjZXNzQ2FsbGJhY2spIG9wdF9zdWNjZXNzQ2FsbGJhY2soZGlyRW50cnkpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcihwYXRoICsgJyBpcyBub3QgYSBkaXJlY3RvcnknKTtcblx0ICAgICAgICAgICAgaWYgKG9wdF9lcnJvckhhbmRsZXIpIHtcblx0ICAgICAgICAgICAgICBvcHRfZXJyb3JIYW5kbGVyKGUpO1xuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgIHRocm93IGU7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9LFxuXHQgICAgICAgIGZ1bmN0aW9uKGUpIHtcblx0ICAgICAgICAgIGlmIChlLmNvZGUgPT0gRmlsZUVycm9yLklOVkFMSURfTU9ESUZJQ0FUSU9OX0VSUikge1xuXHQgICAgICAgICAgICBlLm1lc3NhZ2UgPSBcIidcIiArIHBhdGggKyBcIicgYWxyZWFkeSBleGlzdHNcIjtcblx0ICAgICAgICAgIH1cblxuXHQgICAgICAgICAgaWYgKG9wdF9lcnJvckhhbmRsZXIpIHtcblx0ICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlcihlKTtcblx0ICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgIHRocm93IGU7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXHQgICAgICApO1xuXHQgICAgfTtcblxuXHQgICAgaWYgKGlzQWJzb2x1dGUpIHtcblx0ICAgICAgY3JlYXRlRGlyKGZzXy5yb290LCBmb2xkZXJQYXJ0cyk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBjcmVhdGVEaXIoY3dkXywgZm9sZGVyUGFydHMpO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICAvKipcblx0ICAgKiBMb29rcyB1cCBhbmQgcmV0dXJuIGEgRmlsZSBmb3IgYSBnaXZlbiBmaWxlIGVudHJ5LlxuXHQgICAqXG5cdCAgICogQHBhcmFtIHtzdHJpbmd8RmlsZUVudHJ5fSBlbnRyeU9yUGF0aCBBIHBhdGgsIGZpbGVzeXN0ZW0gVVJMLCBvciBGaWxlRW50cnlcblx0ICAgKiAgICAgb2YgdGhlIGZpbGUgdG8gbG9va3VwLlxuXHQgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1Y2Nlc3NDYWxsYmFjayBTdWNjZXNzIGNhbGxiYWNrIHBhc3NlZCB0aGUgRmlsZSBvYmplY3QuXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9lcnJvckhhbmRsZXIgT3B0aW9uYWwgZXJyb3IgY2FsbGJhY2suXG5cdCAgICovXG5cdCAgRmlsZXIucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbihlbnRyeU9yUGF0aCwgc3VjY2Vzc0NhbGxiYWNrLCBvcHRfZXJyb3JIYW5kbGVyKSB7XG5cdCAgICBpZiAoIWZzXykge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoRlNfSU5JVF9FUlJPUl9NU0cpO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoZW50cnlPclBhdGguaXNGaWxlKSB7XG5cdCAgICAgIGVudHJ5T3JQYXRoLmZpbGUoc3VjY2Vzc0NhbGxiYWNrLCBvcHRfZXJyb3JIYW5kbGVyKTtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICAgIGdldEVudHJ5XyhmdW5jdGlvbihmaWxlRW50cnkpIHtcblx0ICAgICAgICBmaWxlRW50cnkuZmlsZShzdWNjZXNzQ2FsbGJhY2ssIG9wdF9lcnJvckhhbmRsZXIpO1xuXHQgICAgICB9LCBvcHRfZXJyb3JIYW5kbGVyLCBwYXRoVG9Gc1VSTF8oZW50cnlPclBhdGgpKTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgLyoqXG5cdCAgICogQ3JlYXRlcyBhbiBlbXB0eSBmaWxlLlxuXHQgICAqXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIHJlbGF0aXZlIHBhdGggb2YgdGhlIGZpbGUgdG8gY3JlYXRlLCBmcm9tIHRoZVxuXHQgICAqICAgICBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxuXHQgICAqIEBwYXJhbSB7Ym9vbD19IG9wdF9leGNsdXNpdmUgVHJ1ZSAoZGVmYXVsdCkgaWYgYW4gZXJyb3Igc2hvdWxkIGJlIHRocm93biBpZlxuXHQgICAqICAgICB0aGUgZmlsZSBhbHJlYWR5IGV4aXN0cy5cblx0ICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWNjZXNzQ2FsbGJhY2sgQSBzdWNjZXNzIGNhbGxiYWNrLCB3aGljaCBpcyBwYXNzZWRcblx0ICAgKiAgICAgdGhlIG5ldyBGaWxlRW50cnkuXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9lcnJvckhhbmRsZXIgT3B0aW9uYWwgZXJyb3IgY2FsbGJhY2suXG5cdCAgICovXG5cdCAgRmlsZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKHBhdGgsIG9wdF9leGNsdXNpdmUsIHN1Y2Nlc3NDYWxsYmFjayxcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlcikge1xuXHQgICAgaWYgKCFmc18pIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKEZTX0lOSVRfRVJST1JfTVNHKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIGV4Y2x1c2l2ZSA9IG9wdF9leGNsdXNpdmUgIT0gbnVsbCA/IG9wdF9leGNsdXNpdmUgOiB0cnVlO1xuXG5cdCAgICBjd2RfLmdldEZpbGUocGF0aCwge2NyZWF0ZTogdHJ1ZSwgIGV4Y2x1c2l2ZTogZXhjbHVzaXZlfSwgc3VjY2Vzc0NhbGxiYWNrLFxuXHQgICAgICBmdW5jdGlvbihlKSB7XG5cdCAgICAgICAgaWYgKGUuY29kZSA9PSBGaWxlRXJyb3IuSU5WQUxJRF9NT0RJRklDQVRJT05fRVJSKSB7XG5cdCAgICAgICAgICBlLm1lc3NhZ2UgPSBcIidcIiArIHBhdGggKyBcIicgYWxyZWFkeSBleGlzdHNcIjtcblx0ICAgICAgICB9XG5cdCAgICAgICAgaWYgKG9wdF9lcnJvckhhbmRsZXIpIHtcblx0ICAgICAgICAgIG9wdF9lcnJvckhhbmRsZXIoZSk7XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIHRocm93IGU7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cdCAgICApO1xuXHQgIH07XG5cblx0ICAvKipcblx0ICAgICogTW92ZXMgYSBmaWxlIG9yIGRpcmVjdG9yeS5cblx0ICAgICpcblx0ICAgICogQHBhcmFtIHtzdHJpbmd8RmlsZUVudHJ5fERpcmVjdG9yeUVudHJ5fSBzcmMgVGhlIGZpbGUvZGlyZWN0b3J5XG5cdCAgICAqICAgICB0byBtb3ZlLiBJZiBzcmMgaXMgYSBzdHJpbmcsIGEgcGF0aCBvciBmaWxlc3lzdGVtOiBVUkwgaXMgYWNjZXB0ZWQuXG5cdCAgICAqIEBwYXJhbSB7c3RyaW5nfERpcmVjdG9yeUVudHJ5fSBkZXN0IFRoZSBkaXJlY3RvcnkgdG8gbW92ZSB0aGUgc3JjIGludG8uXG5cdCAgICAqICAgICBJZiBkZXN0IGlzIGEgc3RyaW5nLCBhIHBhdGggb3IgZmlsZXN5c3RlbTogVVJMIGlzIGFjY2VwdGVkLlxuXHQgICAgKiAgICAgTm90ZTogZGVzdCBuZWVkcyB0byBiZSB0aGUgc2FtZSB0eXBlIGFzIHNyYy5cblx0ICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfbmV3TmFtZSBBbiBvcHRpb25hbCBuZXcgbmFtZSBmb3IgdGhlIG1vdmVkIGVudHJ5LlxuXHQgICAgKiBAcGFyYW0ge0Z1bmN0aW9uPX0gb3B0X3N1Y2Nlc3NDYWxsYmFjayBPcHRpb25hbCBjYWxsYmFjayBwYXNzZWQgdGhlIG1vdmVkXG5cdCAgICAqICAgICBlbnRyeSBvbiBhIHN1Y2Nlc3NmdWwgbW92ZS5cblx0ICAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9lcnJvckhhbmRsZXIgT3B0aW9uYWwgZXJyb3IgY2FsbGJhY2suXG5cdCAgICAqL1xuXHQgIEZpbGVyLnByb3RvdHlwZS5tdiA9IGZ1bmN0aW9uKHNyYywgZGVzdCwgb3B0X25ld05hbWUsIG9wdF9zdWNjZXNzQ2FsbGJhY2ssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlcikge1xuXHQgICAgY29weU9yTW92ZV8uYmluZCh0aGlzLCBzcmMsIGRlc3QsIG9wdF9uZXdOYW1lLCBvcHRfc3VjY2Vzc0NhbGxiYWNrLFxuXHQgICAgICAgICAgICAgICAgICAgICBvcHRfZXJyb3JIYW5kbGVyLCB0cnVlKSgpO1xuXHQgIH07XG5cblx0ICAvKipcblx0ICAgKiBEZWxldGVzIGEgZmlsZSBvciBkaXJlY3RvcnkgZW50cnkuXG5cdCAgICpcblx0ICAgKiBAcGFyYW0ge3N0cmluZ3xGaWxlRW50cnl8RGlyZWN0b3J5RW50cnl9IGVudHJ5T3JQYXRoIFRoZSBmaWxlIG9yIGRpcmVjdG9yeVxuXHQgICAqICAgICB0byByZW1vdmUuIElmIGVudHJ5IGlzIGEgRGlyZWN0b3J5RW50cnksIGl0cyBjb250ZW50cyBhcmUgcmVtb3ZlZFxuXHQgICAqICAgICByZWN1cnNpdmVseS4gSWYgZW50cnlPclBhdGggaXMgYSBzdHJpbmcsIGEgcGF0aCBvciBmaWxlc3lzdGVtOiBVUkwgaXNcblx0ICAgKiAgICAgYWNjZXB0ZWQuXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3VjY2Vzc0NhbGxiYWNrIFplcm8gYXJnIGNhbGxiYWNrIGludm9rZWQgb25cblx0ICAgKiAgICAgc3VjY2Vzc2Z1bCByZW1vdmFsLlxuXHQgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfZXJyb3JIYW5kbGVyIE9wdGlvbmFsIGVycm9yIGNhbGxiYWNrLlxuXHQgICAqL1xuXHQgIEZpbGVyLnByb3RvdHlwZS5ybSA9IGZ1bmN0aW9uKGVudHJ5T3JQYXRoLCBzdWNjZXNzQ2FsbGJhY2ssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlcikge1xuXHQgICAgaWYgKCFmc18pIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKEZTX0lOSVRfRVJST1JfTVNHKTtcblx0ICAgIH1cblxuXHQgICAgdmFyIHJlbW92ZUl0ID0gZnVuY3Rpb24oZW50cnkpIHtcblx0ICAgICAgaWYgKGVudHJ5LmlzRmlsZSkge1xuXHQgICAgICAgIGVudHJ5LnJlbW92ZShzdWNjZXNzQ2FsbGJhY2ssIG9wdF9lcnJvckhhbmRsZXIpO1xuXHQgICAgICB9IGVsc2UgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KSB7XG5cdCAgICAgICAgZW50cnkucmVtb3ZlUmVjdXJzaXZlbHkoc3VjY2Vzc0NhbGxiYWNrLCBvcHRfZXJyb3JIYW5kbGVyKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgaWYgKGVudHJ5T3JQYXRoLmlzRmlsZSB8fCBlbnRyeU9yUGF0aC5pc0RpcmVjdG9yeSkge1xuXHQgICAgICByZW1vdmVJdChlbnRyeU9yUGF0aCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBnZXRFbnRyeV8ocmVtb3ZlSXQsIG9wdF9lcnJvckhhbmRsZXIsIGVudHJ5T3JQYXRoKTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgLyoqXG5cdCAgICogQ2hhbmdlcyB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cblx0ICAgKlxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfERpcmVjdG9yeUVudHJ5fSBkaXJFbnRyeU9yUGF0aCBBIERpcmVjdG9yeUVudHJ5IHRvIG1vdmUgaW50b1xuXHQgICAqICAgICBvciBhIHBhdGggcmVsYXRpdmUgdG8gdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuIEEgZmlsZXN5c3RlbTogVVJMXG5cdCAgICogICAgIGlzIGFsc28gYWNjZXB0ZWRcblx0ICAgKiBAcGFyYW0ge0Z1bmN0aW9uPX0gb3B0X3N1Y2Nlc3NDYWxsYmFjayBPcHRpb25hbCBzdWNjZXNzIGNhbGxiYWNrLCB3aGljaCBpc1xuXHQgICAqICAgICBwYXNzZWQgdGhlIERpcmVjdG9yeUVudHJ5IG9mIHRoZSBuZXcgY3VycmVudCBkaXJlY3RvcnkuXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9lcnJvckhhbmRsZXIgT3B0aW9uYWwgZXJyb3IgY2FsbGJhY2suXG5cdCAgICovXG5cdCAgRmlsZXIucHJvdG90eXBlLmNkID0gZnVuY3Rpb24oZGlyRW50cnlPclBhdGgsIG9wdF9zdWNjZXNzQ2FsbGJhY2ssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlcikge1xuXHQgICAgaWYgKCFmc18pIHtcblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKEZTX0lOSVRfRVJST1JfTVNHKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKGRpckVudHJ5T3JQYXRoLmlzRGlyZWN0b3J5KSB7XG5cdCAgICAgIGN3ZF8gPSBkaXJFbnRyeU9yUGF0aDtcblx0ICAgICAgb3B0X3N1Y2Nlc3NDYWxsYmFjayAmJiBvcHRfc3VjY2Vzc0NhbGxiYWNrKGN3ZF8pO1xuXHQgICAgfSBlbHNlIHtcblx0ICAgICAgLy8gQnVpbGQgYSBmaWxlc3lzdGVtOiBVUkwgbWFudWFsbHkgaWYgd2UgbmVlZCB0by5cblx0ICAgICAgdmFyIGRpckVudHJ5T3JQYXRoID0gcGF0aFRvRnNVUkxfKGRpckVudHJ5T3JQYXRoKTtcblxuXHQgICAgICBnZXRFbnRyeV8oZnVuY3Rpb24oZGlyRW50cnkpIHtcblx0ICAgICAgICBpZiAoZGlyRW50cnkuaXNEaXJlY3RvcnkpIHtcblx0ICAgICAgICAgIGN3ZF8gPSBkaXJFbnRyeTtcblx0ICAgICAgICAgIG9wdF9zdWNjZXNzQ2FsbGJhY2sgJiYgb3B0X3N1Y2Nlc3NDYWxsYmFjayhjd2RfKTtcblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoTk9UX0FfRElSRUNUT1JZKTtcblx0ICAgICAgICAgIGlmIChvcHRfZXJyb3JIYW5kbGVyKSB7XG5cdCAgICAgICAgICAgIG9wdF9lcnJvckhhbmRsZXIoZSk7XG5cdCAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICB0aHJvdyBlO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfSwgb3B0X2Vycm9ySGFuZGxlciwgZGlyRW50cnlPclBhdGgpO1xuXHQgICAgfVxuXHQgIH07XG5cblx0ICAvKipcblx0ICAgICogQ29waWVzIGEgZmlsZSBvciBkaXJlY3RvcnkgdG8gYSBkZXN0aW5hdGlvbi5cblx0ICAgICpcblx0ICAgICogQHBhcmFtIHtzdHJpbmd8RmlsZUVudHJ5fERpcmVjdG9yeUVudHJ5fSBzcmMgVGhlIGZpbGUvZGlyZWN0b3J5XG5cdCAgICAqICAgICB0byBjb3B5LiBJZiBzcmMgaXMgYSBzdHJpbmcsIGEgcGF0aCBvciBmaWxlc3lzdGVtOiBVUkwgaXMgYWNjZXB0ZWQuXG5cdCAgICAqIEBwYXJhbSB7c3RyaW5nfERpcmVjdG9yeUVudHJ5fSBkZXN0IFRoZSBkaXJlY3RvcnkgdG8gY29weSB0aGUgc3JjIGludG8uXG5cdCAgICAqICAgICBJZiBkZXN0IGlzIGEgc3RyaW5nLCBhIHBhdGggb3IgZmlsZXN5c3RlbTogVVJMIGlzIGFjY2VwdGVkLlxuXHQgICAgKiAgICAgTm90ZTogZGVzdCBuZWVkcyB0byBiZSB0aGUgc2FtZSB0eXBlIGFzIHNyYy5cblx0ICAgICogQHBhcmFtIHtzdHJpbmc9fSBvcHRfbmV3TmFtZSBBbiBvcHRpb25hbCBuYW1lIGZvciB0aGUgY29waWVkIGVudHJ5LlxuXHQgICAgKiBAcGFyYW0ge0Z1bmN0aW9uPX0gb3B0X3N1Y2Nlc3NDYWxsYmFjayBPcHRpb25hbCBjYWxsYmFjayBwYXNzZWQgdGhlIG1vdmVkXG5cdCAgICAqICAgICBlbnRyeSBvbiBhIHN1Y2Nlc3NmdWwgY29weS5cblx0ICAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9lcnJvckhhbmRsZXIgT3B0aW9uYWwgZXJyb3IgY2FsbGJhY2suXG5cdCAgICAqL1xuXHQgIEZpbGVyLnByb3RvdHlwZS5jcCA9IGZ1bmN0aW9uKHNyYywgZGVzdCwgb3B0X25ld05hbWUsIG9wdF9zdWNjZXNzQ2FsbGJhY2ssXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlcikge1xuXHQgICAgY29weU9yTW92ZV8uYmluZCh0aGlzLCBzcmMsIGRlc3QsIG9wdF9uZXdOYW1lLCBvcHRfc3VjY2Vzc0NhbGxiYWNrLFxuXHQgICAgICAgICAgICAgICAgICAgICBvcHRfZXJyb3JIYW5kbGVyKSgpO1xuXHQgIH07XG5cblx0ICAvKipcblx0ICAgKiBXcml0ZXMgZGF0YSB0byBhIGZpbGUuXG5cdCAgICpcblx0ICAgKiBJZiB0aGUgZmlsZSBhbHJlYWR5IGV4aXN0cywgaXRzIGNvbnRlbnRzIGFyZSBvdmVyd3JpdHRlbi5cblx0ICAgKlxuXHQgICAqIEBwYXJhbSB7c3RyaW5nfEZpbGVFbnRyeX0gZW50cnlPclBhdGggQSBwYXRoLCBmaWxlc3lzdGVtIFVSTCwgb3IgRmlsZUVudHJ5XG5cdCAgICAqICAgICBvZiB0aGUgZmlsZSB0byBsb29rdXAuXG5cdCAgICogQHBhcmFtIHtvYmplY3R9IGRhdGFPYmogVGhlIGRhdGEgdG8gd3JpdGUuIEV4YW1wbGU6XG5cdCAgICogICAgIHtkYXRhOiBzdHJpbmd8QmxvYnxGaWxlfEFycmF5QnVmZmVyLCB0eXBlOiBtaW1ldHlwZSwgYXBwZW5kOiB0cnVlfVxuXHQgICAqICAgICBJZiBhcHBlbmQgaXMgc3BlY2lmaWVkLCBkYXRhIGlzIGFwcGVuZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGZpbGUuXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0X3N1Y2Nlc3NDYWxsYmFjayBTdWNjZXNzIGNhbGxiYWNrLCB3aGljaCBpcyBwYXNzZWRcblx0ICAgKiAgICAgdGhlIGNyZWF0ZWQgRmlsZUVudHJ5IGFuZCBGaWxlV3JpdGVyIG9iamVjdCB1c2VkIHRvIHdyaXRlIHRoZSBkYXRhLlxuXHQgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBvcHRfZXJyb3JIYW5kbGVyIE9wdGlvbmFsIGVycm9yIGNhbGxiYWNrLlxuXHQgICAqL1xuXHQgIEZpbGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKGVudHJ5T3JQYXRoLCBkYXRhT2JqLCBvcHRfc3VjY2Vzc0NhbGxiYWNrLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdF9lcnJvckhhbmRsZXIpIHtcblx0ICAgIGlmICghZnNfKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcihGU19JTklUX0VSUk9SX01TRyk7XG5cdCAgICB9XG5cblx0ICAgIHZhciB3cml0ZUZpbGVfID0gZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG5cdCAgICAgIGZpbGVFbnRyeS5jcmVhdGVXcml0ZXIoZnVuY3Rpb24oZmlsZVdyaXRlcikge1xuXG5cdCAgICAgICAgZmlsZVdyaXRlci5vbmVycm9yID0gb3B0X2Vycm9ySGFuZGxlcjtcblxuXHQgICAgICAgIGlmIChkYXRhT2JqLmFwcGVuZCkge1xuXHQgICAgICAgICAgZmlsZVdyaXRlci5vbndyaXRlZW5kID0gZnVuY3Rpb24oZSkge1xuXHQgICAgICAgICAgICBpZiAob3B0X3N1Y2Nlc3NDYWxsYmFjaykgb3B0X3N1Y2Nlc3NDYWxsYmFjayhmaWxlRW50cnksIHRoaXMpO1xuXHQgICAgICAgICAgfTtcblxuXHQgICAgICAgICAgZmlsZVdyaXRlci5zZWVrKGZpbGVXcml0ZXIubGVuZ3RoKTsgLy8gU3RhcnQgd3JpdGUgcG9zaXRpb24gYXQgRU9GLlxuXHQgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICB2YXIgdHJ1bmNhdGVkID0gZmFsc2U7XG5cdCAgICAgICAgICBmaWxlV3JpdGVyLm9ud3JpdGVlbmQgPSBmdW5jdGlvbihlKSB7XG5cdCAgICAgICAgICAgIC8vIFRydW5jYXRlIGZpbGUgdG8gbmV3bHkgd3JpdHRlbiBmaWxlIHNpemUuXG5cdCAgICAgICAgICAgIGlmICghdHJ1bmNhdGVkKSB7XG5cdCAgICAgICAgICAgICAgdHJ1bmNhdGVkID0gdHJ1ZTtcblx0ICAgICAgICAgICAgICB0aGlzLnRydW5jYXRlKHRoaXMucG9zaXRpb24pO1xuXHQgICAgICAgICAgICAgIHJldHVybjtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBpZiAob3B0X3N1Y2Nlc3NDYWxsYmFjaykgb3B0X3N1Y2Nlc3NDYWxsYmFjayhmaWxlRW50cnksIHRoaXMpO1xuXHQgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICAvLyBCbG9iKCkgdGFrZXMgQXJyYXlCdWZmZXJWaWV3LCBub3QgQXJyYXlCdWZmZXIuXG5cdCAgICAgICAgaWYgKGRhdGFPYmouZGF0YS5fX3Byb3RvX18gPT0gQXJyYXlCdWZmZXIucHJvdG90eXBlKSB7XG5cdCAgICAgICAgICBkYXRhT2JqLmRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhT2JqLmRhdGEpO1xuXHQgICAgICAgIH1cblx0ICAgICAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtkYXRhT2JqLmRhdGFdLFxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YU9iai50eXBlID8ge3R5cGU6IGRhdGFPYmoudHlwZX0gOiB7fSk7XG5cblx0ICAgICAgICBmaWxlV3JpdGVyLndyaXRlKGJsb2IpO1xuXG5cdCAgICAgIH0sIG9wdF9lcnJvckhhbmRsZXIpO1xuXHQgICAgfTtcblxuXHQgICAgaWYgKGVudHJ5T3JQYXRoLmlzRmlsZSkge1xuXHQgICAgICB3cml0ZUZpbGVfKGVudHJ5T3JQYXRoKTtcblx0ICAgIH0gZWxzZSBpZiAoaXNGc1VSTF8oZW50cnlPclBhdGgpKSB7XG5cdCAgICAgIGdldEVudHJ5Xyh3cml0ZUZpbGVfLCBvcHRfZXJyb3JIYW5kbGVyLCBlbnRyeU9yUGF0aCk7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgICBjd2RfLmdldEZpbGUoZW50cnlPclBhdGgsIHtjcmVhdGU6IHRydWUsIGV4Y2x1c2l2ZTogZmFsc2V9LCB3cml0ZUZpbGVfLFxuXHQgICAgICAgICAgICAgICAgICAgb3B0X2Vycm9ySGFuZGxlcik7XG5cdCAgICB9XG5cdCAgfTtcblxuXHQgIC8qKlxuXHQgICAqIERpc3BsYXlzIGRpc2sgc3BhY2UgdXNhZ2UuXG5cdCAgICpcblx0ICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWNjZXNzQ2FsbGJhY2sgU3VjY2VzcyBjYWxsYmFjaywgd2hpY2ggaXMgcGFzc2VkXG5cdCAgICogICAgIFVzZWQgc3BhY2UsIEZyZWUgc3BhY2UgYW5kIEN1cnJlbnRseSBhbGxvY2F0ZWQgdG90YWwgc3BhY2UgaW4gYnl0ZXMuXG5cdCAgICogQHBhcmFtIHtGdW5jdGlvbj19IG9wdF9lcnJvckhhbmRsZXIgT3B0aW9uYWwgZXJyb3IgY2FsbGJhY2suXG5cdCAgICovXG5cdCAgRmlsZXIucHJvdG90eXBlLmRmID0gZnVuY3Rpb24oc3VjY2Vzc0NhbGxiYWNrLCBvcHRfZXJyb3JIYW5kbGVyKSB7XG5cdCAgICB2YXIgcXVlcnlDYWxsYmFjayA9IGZ1bmN0aW9uKGJ5dGVVc2VkLCBieXRlQ2FwKSB7XG5cdCAgICAgIHN1Y2Nlc3NDYWxsYmFjayhieXRlVXNlZCwgYnl0ZUNhcCAtIGJ5dGVVc2VkLCBieXRlQ2FwKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKCEobmF2aWdhdG9yLnRlbXBvcmFyeVN0b3JhZ2UucXVlcnlVc2FnZUFuZFF1b3RhICYmIG5hdmlnYXRvci5wZXJzaXN0ZW50U3RvcmFnZS5xdWVyeVVzYWdlQW5kUXVvdGEpKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcihOT1RfSU1QTEVNRU5URURfTVNHKTtcblx0ICAgIH1cblxuXHQgICAgaWYgKHNlbGYuVEVNUE9SQVJZID09IHRoaXMudHlwZSkge1xuXHQgICAgICBuYXZpZ2F0b3IudGVtcG9yYXJ5U3RvcmFnZS5xdWVyeVVzYWdlQW5kUXVvdGEocXVlcnlDYWxsYmFjaywgb3B0X2Vycm9ySGFuZGxlcik7XG5cdCAgICB9IGVsc2UgaWYgKHNlbGYuUEVSU0lTVEVOVCA9PSB0aGlzLnR5cGUpIHtcblx0ICAgICAgbmF2aWdhdG9yLnBlcnNpc3RlbnRTdG9yYWdlLnF1ZXJ5VXNhZ2VBbmRRdW90YShxdWVyeUNhbGxiYWNrLCBvcHRfZXJyb3JIYW5kbGVyKTtcblx0ICAgIH1cblx0ICB9O1xuXG5cdCAgcmV0dXJuIEZpbGVyO1xuXHR9O1xuXG5cdEZpbGVyLlV0aWwgPSBVdGlsO1xuXG5cblx0LyoqKiBFWFBPUlRTIEZST00gZXhwb3J0cy1sb2FkZXIgKioqL1xuXHRtb2R1bGUuZXhwb3J0cyA9IEZpbGVyfS5jYWxsKGdsb2JhbCkpO1xuXHQvKiBXRUJQQUNLIFZBUiBJTkpFQ1RJT04gKi99LmNhbGwoZXhwb3J0cywgKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSgpKSkpXG5cbi8qKiovIH1cbi8qKioqKiovIF0pXG59KTtcbjsiLCIvLyAgICAgdXVpZC5qc1xuLy9cbi8vICAgICBDb3B5cmlnaHQgKGMpIDIwMTAtMjAxMiBSb2JlcnQgS2llZmZlclxuLy8gICAgIE1JVCBMaWNlbnNlIC0gaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBfZ2xvYmFsID0gdGhpcztcblxuICAvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgV2UgZmVhdHVyZVxuICAvLyBkZXRlY3QgdG8gZGV0ZXJtaW5lIHRoZSBiZXN0IFJORyBzb3VyY2UsIG5vcm1hbGl6aW5nIHRvIGEgZnVuY3Rpb24gdGhhdFxuICAvLyByZXR1cm5zIDEyOC1iaXRzIG9mIHJhbmRvbW5lc3MsIHNpbmNlIHRoYXQncyB3aGF0J3MgdXN1YWxseSByZXF1aXJlZFxuICB2YXIgX3JuZztcblxuICAvLyBOb2RlLmpzIGNyeXB0by1iYXNlZCBSTkcgLSBodHRwOi8vbm9kZWpzLm9yZy9kb2NzL3YwLjYuMi9hcGkvY3J5cHRvLmh0bWxcbiAgLy9cbiAgLy8gTW9kZXJhdGVseSBmYXN0LCBoaWdoIHF1YWxpdHlcbiAgaWYgKHR5cGVvZihfZ2xvYmFsLnJlcXVpcmUpID09ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIF9yYiA9IF9nbG9iYWwucmVxdWlyZSgnY3J5cHRvJykucmFuZG9tQnl0ZXM7XG4gICAgICBfcm5nID0gX3JiICYmIGZ1bmN0aW9uKCkge3JldHVybiBfcmIoMTYpO307XG4gICAgfSBjYXRjaChlKSB7fVxuICB9XG5cbiAgaWYgKCFfcm5nICYmIF9nbG9iYWwuY3J5cHRvICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBXSEFUV0cgY3J5cHRvLWJhc2VkIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgICAvL1xuICAgIC8vIE1vZGVyYXRlbHkgZmFzdCwgaGlnaCBxdWFsaXR5XG4gICAgdmFyIF9ybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICBfcm5nID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgICAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhfcm5kczgpO1xuICAgICAgcmV0dXJuIF9ybmRzODtcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFfcm5nKSB7XG4gICAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAgIC8vXG4gICAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgICAvLyBxdWFsaXR5LlxuICAgIHZhciAgX3JuZHMgPSBuZXcgQXJyYXkoMTYpO1xuICAgIF9ybmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgICBpZiAoKGkgJiAweDAzKSA9PT0gMCkgciA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMDtcbiAgICAgICAgX3JuZHNbaV0gPSByID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfcm5kcztcbiAgICB9O1xuICB9XG5cbiAgLy8gQnVmZmVyIGNsYXNzIHRvIHVzZVxuICB2YXIgQnVmZmVyQ2xhc3MgPSB0eXBlb2YoX2dsb2JhbC5CdWZmZXIpID09ICdmdW5jdGlvbicgPyBfZ2xvYmFsLkJ1ZmZlciA6IEFycmF5O1xuXG4gIC8vIE1hcHMgZm9yIG51bWJlciA8LT4gaGV4IHN0cmluZyBjb252ZXJzaW9uXG4gIHZhciBfYnl0ZVRvSGV4ID0gW107XG4gIHZhciBfaGV4VG9CeXRlID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcbiAgICBfYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbiAgICBfaGV4VG9CeXRlW19ieXRlVG9IZXhbaV1dID0gaTtcbiAgfVxuXG4gIC8vICoqYHBhcnNlKClgIC0gUGFyc2UgYSBVVUlEIGludG8gaXQncyBjb21wb25lbnQgYnl0ZXMqKlxuICBmdW5jdGlvbiBwYXJzZShzLCBidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gKGJ1ZiAmJiBvZmZzZXQpIHx8IDAsIGlpID0gMDtcblxuICAgIGJ1ZiA9IGJ1ZiB8fCBbXTtcbiAgICBzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWzAtOWEtZl17Mn0vZywgZnVuY3Rpb24ob2N0KSB7XG4gICAgICBpZiAoaWkgPCAxNikgeyAvLyBEb24ndCBvdmVyZmxvdyFcbiAgICAgICAgYnVmW2kgKyBpaSsrXSA9IF9oZXhUb0J5dGVbb2N0XTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFplcm8gb3V0IHJlbWFpbmluZyBieXRlcyBpZiBzdHJpbmcgd2FzIHNob3J0XG4gICAgd2hpbGUgKGlpIDwgMTYpIHtcbiAgICAgIGJ1ZltpICsgaWkrK10gPSAwO1xuICAgIH1cblxuICAgIHJldHVybiBidWY7XG4gIH1cblxuICAvLyAqKmB1bnBhcnNlKClgIC0gQ29udmVydCBVVUlEIGJ5dGUgYXJyYXkgKGFsYSBwYXJzZSgpKSBpbnRvIGEgc3RyaW5nKipcbiAgZnVuY3Rpb24gdW5wYXJzZShidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gb2Zmc2V0IHx8IDAsIGJ0aCA9IF9ieXRlVG9IZXg7XG4gICAgcmV0dXJuICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArICctJyArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXSArXG4gICAgICAgICAgICBidGhbYnVmW2krK11dICsgYnRoW2J1ZltpKytdXTtcbiAgfVxuXG4gIC8vICoqYHYxKClgIC0gR2VuZXJhdGUgdGltZS1iYXNlZCBVVUlEKipcbiAgLy9cbiAgLy8gSW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL0xpb3NLL1VVSUQuanNcbiAgLy8gYW5kIGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS91dWlkLmh0bWxcblxuICAvLyByYW5kb20gIydzIHdlIG5lZWQgdG8gaW5pdCBub2RlIGFuZCBjbG9ja3NlcVxuICB2YXIgX3NlZWRCeXRlcyA9IF9ybmcoKTtcblxuICAvLyBQZXIgNC41LCBjcmVhdGUgYW5kIDQ4LWJpdCBub2RlIGlkLCAoNDcgcmFuZG9tIGJpdHMgKyBtdWx0aWNhc3QgYml0ID0gMSlcbiAgdmFyIF9ub2RlSWQgPSBbXG4gICAgX3NlZWRCeXRlc1swXSB8IDB4MDEsXG4gICAgX3NlZWRCeXRlc1sxXSwgX3NlZWRCeXRlc1syXSwgX3NlZWRCeXRlc1szXSwgX3NlZWRCeXRlc1s0XSwgX3NlZWRCeXRlc1s1XVxuICBdO1xuXG4gIC8vIFBlciA0LjIuMiwgcmFuZG9taXplICgxNCBiaXQpIGNsb2Nrc2VxXG4gIHZhciBfY2xvY2tzZXEgPSAoX3NlZWRCeXRlc1s2XSA8PCA4IHwgX3NlZWRCeXRlc1s3XSkgJiAweDNmZmY7XG5cbiAgLy8gUHJldmlvdXMgdXVpZCBjcmVhdGlvbiB0aW1lXG4gIHZhciBfbGFzdE1TZWNzID0gMCwgX2xhc3ROU2VjcyA9IDA7XG5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9icm9vZmEvbm9kZS11dWlkIGZvciBBUEkgZGV0YWlsc1xuICBmdW5jdGlvbiB2MShvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICAgIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuICAgIHZhciBiID0gYnVmIHx8IFtdO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgY2xvY2tzZXEgPSBvcHRpb25zLmNsb2Nrc2VxICE9IG51bGwgPyBvcHRpb25zLmNsb2Nrc2VxIDogX2Nsb2Nrc2VxO1xuXG4gICAgLy8gVVVJRCB0aW1lc3RhbXBzIGFyZSAxMDAgbmFuby1zZWNvbmQgdW5pdHMgc2luY2UgdGhlIEdyZWdvcmlhbiBlcG9jaCxcbiAgICAvLyAoMTU4Mi0xMC0xNSAwMDowMCkuICBKU051bWJlcnMgYXJlbid0IHByZWNpc2UgZW5vdWdoIGZvciB0aGlzLCBzb1xuICAgIC8vIHRpbWUgaXMgaGFuZGxlZCBpbnRlcm5hbGx5IGFzICdtc2VjcycgKGludGVnZXIgbWlsbGlzZWNvbmRzKSBhbmQgJ25zZWNzJ1xuICAgIC8vICgxMDAtbmFub3NlY29uZHMgb2Zmc2V0IGZyb20gbXNlY3MpIHNpbmNlIHVuaXggZXBvY2gsIDE5NzAtMDEtMDEgMDA6MDAuXG4gICAgdmFyIG1zZWNzID0gb3B0aW9ucy5tc2VjcyAhPSBudWxsID8gb3B0aW9ucy5tc2VjcyA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgLy8gUGVyIDQuMi4xLjIsIHVzZSBjb3VudCBvZiB1dWlkJ3MgZ2VuZXJhdGVkIGR1cmluZyB0aGUgY3VycmVudCBjbG9ja1xuICAgIC8vIGN5Y2xlIHRvIHNpbXVsYXRlIGhpZ2hlciByZXNvbHV0aW9uIGNsb2NrXG4gICAgdmFyIG5zZWNzID0gb3B0aW9ucy5uc2VjcyAhPSBudWxsID8gb3B0aW9ucy5uc2VjcyA6IF9sYXN0TlNlY3MgKyAxO1xuXG4gICAgLy8gVGltZSBzaW5jZSBsYXN0IHV1aWQgY3JlYXRpb24gKGluIG1zZWNzKVxuICAgIHZhciBkdCA9IChtc2VjcyAtIF9sYXN0TVNlY3MpICsgKG5zZWNzIC0gX2xhc3ROU2VjcykvMTAwMDA7XG5cbiAgICAvLyBQZXIgNC4yLjEuMiwgQnVtcCBjbG9ja3NlcSBvbiBjbG9jayByZWdyZXNzaW9uXG4gICAgaWYgKGR0IDwgMCAmJiBvcHRpb25zLmNsb2Nrc2VxID09IG51bGwpIHtcbiAgICAgIGNsb2Nrc2VxID0gY2xvY2tzZXEgKyAxICYgMHgzZmZmO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IG5zZWNzIGlmIGNsb2NrIHJlZ3Jlc3NlcyAobmV3IGNsb2Nrc2VxKSBvciB3ZSd2ZSBtb3ZlZCBvbnRvIGEgbmV3XG4gICAgLy8gdGltZSBpbnRlcnZhbFxuICAgIGlmICgoZHQgPCAwIHx8IG1zZWNzID4gX2xhc3RNU2VjcykgJiYgb3B0aW9ucy5uc2VjcyA9PSBudWxsKSB7XG4gICAgICBuc2VjcyA9IDA7XG4gICAgfVxuXG4gICAgLy8gUGVyIDQuMi4xLjIgVGhyb3cgZXJyb3IgaWYgdG9vIG1hbnkgdXVpZHMgYXJlIHJlcXVlc3RlZFxuICAgIGlmIChuc2VjcyA+PSAxMDAwMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1dWlkLnYxKCk6IENhblxcJ3QgY3JlYXRlIG1vcmUgdGhhbiAxME0gdXVpZHMvc2VjJyk7XG4gICAgfVxuXG4gICAgX2xhc3RNU2VjcyA9IG1zZWNzO1xuICAgIF9sYXN0TlNlY3MgPSBuc2VjcztcbiAgICBfY2xvY2tzZXEgPSBjbG9ja3NlcTtcblxuICAgIC8vIFBlciA0LjEuNCAtIENvbnZlcnQgZnJvbSB1bml4IGVwb2NoIHRvIEdyZWdvcmlhbiBlcG9jaFxuICAgIG1zZWNzICs9IDEyMjE5MjkyODAwMDAwO1xuXG4gICAgLy8gYHRpbWVfbG93YFxuICAgIHZhciB0bCA9ICgobXNlY3MgJiAweGZmZmZmZmYpICogMTAwMDAgKyBuc2VjcykgJSAweDEwMDAwMDAwMDtcbiAgICBiW2krK10gPSB0bCA+Pj4gMjQgJiAweGZmO1xuICAgIGJbaSsrXSA9IHRsID4+PiAxNiAmIDB4ZmY7XG4gICAgYltpKytdID0gdGwgPj4+IDggJiAweGZmO1xuICAgIGJbaSsrXSA9IHRsICYgMHhmZjtcblxuICAgIC8vIGB0aW1lX21pZGBcbiAgICB2YXIgdG1oID0gKG1zZWNzIC8gMHgxMDAwMDAwMDAgKiAxMDAwMCkgJiAweGZmZmZmZmY7XG4gICAgYltpKytdID0gdG1oID4+PiA4ICYgMHhmZjtcbiAgICBiW2krK10gPSB0bWggJiAweGZmO1xuXG4gICAgLy8gYHRpbWVfaGlnaF9hbmRfdmVyc2lvbmBcbiAgICBiW2krK10gPSB0bWggPj4+IDI0ICYgMHhmIHwgMHgxMDsgLy8gaW5jbHVkZSB2ZXJzaW9uXG4gICAgYltpKytdID0gdG1oID4+PiAxNiAmIDB4ZmY7XG5cbiAgICAvLyBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGAgKFBlciA0LjIuMiAtIGluY2x1ZGUgdmFyaWFudClcbiAgICBiW2krK10gPSBjbG9ja3NlcSA+Pj4gOCB8IDB4ODA7XG5cbiAgICAvLyBgY2xvY2tfc2VxX2xvd2BcbiAgICBiW2krK10gPSBjbG9ja3NlcSAmIDB4ZmY7XG5cbiAgICAvLyBgbm9kZWBcbiAgICB2YXIgbm9kZSA9IG9wdGlvbnMubm9kZSB8fCBfbm9kZUlkO1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgNjsgbisrKSB7XG4gICAgICBiW2kgKyBuXSA9IG5vZGVbbl07XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZiA/IGJ1ZiA6IHVucGFyc2UoYik7XG4gIH1cblxuICAvLyAqKmB2NCgpYCAtIEdlbmVyYXRlIHJhbmRvbSBVVUlEKipcblxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2Jyb29mYS9ub2RlLXV1aWQgZm9yIEFQSSBkZXRhaWxzXG4gIGZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gICAgLy8gRGVwcmVjYXRlZCAtICdmb3JtYXQnIGFyZ3VtZW50LCBhcyBzdXBwb3J0ZWQgaW4gdjEuMlxuICAgIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gICAgaWYgKHR5cGVvZihvcHRpb25zKSA9PSAnc3RyaW5nJykge1xuICAgICAgYnVmID0gb3B0aW9ucyA9PSAnYmluYXJ5JyA/IG5ldyBCdWZmZXJDbGFzcygxNikgOiBudWxsO1xuICAgICAgb3B0aW9ucyA9IG51bGw7XG4gICAgfVxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgX3JuZykoKTtcblxuICAgIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gICAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gICAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gICAgaWYgKGJ1Zikge1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyBpaSsrKSB7XG4gICAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJ1ZiB8fCB1bnBhcnNlKHJuZHMpO1xuICB9XG5cbiAgLy8gRXhwb3J0IHB1YmxpYyBBUElcbiAgdmFyIHV1aWQgPSB2NDtcbiAgdXVpZC52MSA9IHYxO1xuICB1dWlkLnY0ID0gdjQ7XG4gIHV1aWQucGFyc2UgPSBwYXJzZTtcbiAgdXVpZC51bnBhcnNlID0gdW5wYXJzZTtcbiAgdXVpZC5CdWZmZXJDbGFzcyA9IEJ1ZmZlckNsYXNzO1xuXG4gIGlmICh0eXBlb2YobW9kdWxlKSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIC8vIFB1Ymxpc2ggYXMgbm9kZS5qcyBtb2R1bGVcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHV1aWQ7XG4gIH0gZWxzZSAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIFB1Ymxpc2ggYXMgQU1EIG1vZHVsZVxuICAgIGRlZmluZShmdW5jdGlvbigpIHtyZXR1cm4gdXVpZDt9KTtcbiBcblxuICB9IGVsc2Uge1xuICAgIC8vIFB1Ymxpc2ggYXMgZ2xvYmFsIChpbiBicm93c2VycylcbiAgICB2YXIgX3ByZXZpb3VzUm9vdCA9IF9nbG9iYWwudXVpZDtcblxuICAgIC8vICoqYG5vQ29uZmxpY3QoKWAgLSAoYnJvd3NlciBvbmx5KSB0byByZXNldCBnbG9iYWwgJ3V1aWQnIHZhcioqXG4gICAgdXVpZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBfZ2xvYmFsLnV1aWQgPSBfcHJldmlvdXNSb290O1xuICAgICAgcmV0dXJuIHV1aWQ7XG4gICAgfTtcblxuICAgIF9nbG9iYWwudXVpZCA9IHV1aWQ7XG4gIH1cbn0pLmNhbGwodGhpcyk7XG4iLCJ1dWlkID0gcmVxdWlyZSAnbm9kZS11dWlkJ1xuRmlsZXIgPSByZXF1aXJlICdAcGhhdGVkL2ZpbGVyJ1xuZGVmYXVsdFNpemUgPSAyMCAqIDEwMjQgKiAxMDI0XG5cbmNsYXNzIEZpbGVTeXN0ZW1cbiAgICBjb25zdHJ1Y3RvcjogKEBzaXplPWRlZmF1bHRTaXplLCBAaXNQZXJzaXN0ZW50PXRydWUpLT5cbiAgICAgICAgQGZpbGVyID0gbmV3IEZpbGVyKClcblxuICAgIGluaXQ6IC0+XG4gICAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpPT5cbiAgICAgICAgICAgIEBmaWxlci5pbml0IHBlcnNpc3RlbnQ6IEBpc1BlcnNpc3RlbnQsIHNpemU6IEBzaXplLCByZXNvbHZlLCByZWplY3RcblxuICAgIHVwbG9hZEZpbGU6IChibG9iKS0+XG4gICAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpPT5cbiAgICAgICAgICAgIEBmaWxlci53cml0ZSB1dWlkLnY0KCksIGRhdGE6IGJsb2IsIC0+XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICAsIHJlamVjdFxuXG4gICAgZ2V0QWxsRmlsZXM6IC0+XG4gICAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpPT5cbiAgICAgICAgICAgIEBmaWxlci5scyAnLycsIChlbnRyaWVzKS0+XG4gICAgICAgICAgICAgICAgZmlsZVVSTHMgPSBlbnRyaWVzLm1hcCAoZW50cnkpLT4gZW50cnkudG9VUkwoKVxuICAgICAgICAgICAgICAgIHJlc29sdmUgZmlsZVVSTHNcbiAgICAgICAgICAgICwgcmVqZWN0XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsZVN5c3RlbVxuIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblxuUGljdHVyZSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gICAgcmVuZGVyOiAtPlxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHtcInNyY1wiOiAodGhpcy5wcm9wcy51cmwpfSlcblxubW9kdWxlLmV4cG9ydHMgPSBQaWN0dXJlIiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblBpY3R1cmUgPSByZXF1aXJlICcuL1BpY3R1cmUuY29mZmVlJ1xuXG5QaWN0dXJlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gICAgcmVuZGVyOiAtPlxuICAgICAgICBwaWN0dXJlcyA9IHRoaXMucHJvcHMucGljdHVyZVVybHMubWFwICh1cmwpLT5cbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUGljdHVyZSwge1wia2V5XCI6ICh1cmwpLCBcInVybFwiOiAodXJsKX0pXG5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCAocGljdHVyZXMpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBpY3R1cmVMaXN0IiwiUmVhY3QgPSByZXF1aXJlICdSZWFjdCdcblxuVXBsb2FkRm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzXG4gICAgaGFuZGxlU3VibWl0OiAoZXZlbnQpLT5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgICAgIGZpbGVFbGVtID0gUmVhY3QuZmluZERPTU5vZGUgQHJlZnMuZmlsZVVSSVxuICAgICAgICBmaWxlVVJJID0gZmlsZUVsZW0udmFsdWVcblxuICAgICAgICB0aGlzLnByb3BzLm9uQ2hvb3NlRmlsZXMgZmlsZVVSSVxuXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IC0+XG4gICAgICAgIGZpbGVFbGVtID0gUmVhY3QuZmluZERPTU5vZGUgQHJlZnMuZmlsZVVSSVxuICAgICAgICBmaWxlRWxlbS52YWx1ZSA9ICdodHRwczovL3MzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYjJiLXRlc3QtdmlkZW8vY2l0aWVzL2hrLmpwZydcblxuICAgIHJlbmRlcjogLT5cbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImZvcm1cIiwge1wib25TdWJtaXRcIjogKEBoYW5kbGVTdWJtaXQpfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtcImNsYXNzTmFtZVwiOiBcImZvcm0tZ3JvdXBcIn0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7XCJ0eXBlXCI6IFwidGV4dFwiLCBcImNsYXNzTmFtZVwiOiBcImZvcm0tY29udHJvbFwiLCBcInBsYWNlaG9sZGVyXCI6IFwiZmlsZSBVUklcIiwgXCJyZWZcIjogXCJmaWxlVVJJXCJ9KVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7XCJ0eXBlXCI6IFwic3VibWl0XCIsIFwiY2xhc3NOYW1lXCI6IFwiYnRuIGJ0bi1kZWZhdWx0XCJ9LCBcIlVwbG9hZFwiKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG5cbm1vZHVsZS5leHBvcnRzID0gVXBsb2FkRm9ybSIsIlJlYWN0ID0gcmVxdWlyZSAnUmVhY3QnXG5VcGxvYWRGb3JtID0gcmVxdWlyZSAnLi9VcGxvYWRGb3JtLmNvZmZlZSdcblBpY3R1cmVMaXN0ID0gcmVxdWlyZSAnLi9QaWN0dXJlTGlzdC5jb2ZmZWUnXG5kb3dubG9hZGVyID0gcmVxdWlyZSAnLi9kb3dubG9hZGVyLmNvZmZlZSdcbkZpbGVTeXN0ZW0gPSByZXF1aXJlICcuL0ZpbGVTeXN0ZW0uY29mZmVlJ1xuZnMgPSBuZXcgRmlsZVN5c3RlbSgpXG5cblZpZXcgPSBSZWFjdC5jcmVhdGVDbGFzc1xuICAgIGdldEluaXRpYWxTdGF0ZTogLT5cbiAgICAgICAgcGljdHVyZVVybHM6IFtdXG5cbiAgICBjb21wb25lbnREaWRNb3VudDogLT5cbiAgICAgICAgZnMuaW5pdCgpXG4gICAgICAgIC50aGVuID0+XG4gICAgICAgICAgICBmcy5nZXRBbGxGaWxlcygpLnRoZW4gKGZpbGVVcmxzKT0+XG4gICAgICAgICAgICAgICAgQHNldFN0YXRlXG4gICAgICAgICAgICAgICAgICAgIHBpY3R1cmVVcmxzOiBmaWxlVXJsc1xuXG4gICAgdXBsb2FkRmlsZTogKHVybCktPlxuICAgICAgICBkb3dubG9hZGVyLmZldGNoIHVybFxuICAgICAgICAudGhlbiAoYmxvYiktPlxuICAgICAgICAgICAgZnMudXBsb2FkRmlsZSBibG9iXG5cbiAgICByZW5kZXI6IC0+XG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVXBsb2FkRm9ybSwge1wib25DaG9vc2VGaWxlc1wiOiAodGhpcy51cGxvYWRGaWxlKX0pLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQaWN0dXJlTGlzdCwge1wicGljdHVyZVVybHNcIjogKHRoaXMuc3RhdGUucGljdHVyZVVybHMpfSlcbiAgICAgICAgKVxuXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyIsInhociA9IHJlcXVpcmUgJ3hocidcblxuZXhwb3J0cy5mZXRjaCA9ICh1cmwpLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KS0+XG4gICAgICAgIHhoclxuICAgICAgICAgICAgdXJpOiB1cmxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCdcbiAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ2Jsb2InXG4gICAgICAgICwgKGVyciwgcmVzcCwgYm9keSktPlxuICAgICAgICAgICAgaWYgZXJyIHx8IHJlc3Auc3RhdHVzQ29kZSAhPSAyMDBcbiAgICAgICAgICAgICAgICByZWplY3QgJ0Nhbm5vdCBmZXRjaCB0aGUgcmVzb3VyY2UnXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSBib2R5XG4iLCJSZWFjdCA9IHJlcXVpcmUgJ1JlYWN0J1xuVmlldyA9IHJlcXVpcmUgJy4vVmlldy5jb2ZmZWUnXG5cblJlYWN0LnJlbmRlciBSZWFjdC5jcmVhdGVFbGVtZW50KFZpZXcsIG51bGwpLCBkb2N1bWVudC5ib2R5XG4iXX0=
