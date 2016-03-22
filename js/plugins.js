/**
 * JS Library v3
 */

var UTILS = (function () {

	return {
		qs: function (selector) {
			return document.querySelector(selector);
		},

		qsa: function (selector) {
			return document.querySelectorAll(selector);
		},

		/**
		 * Cross browser even handler
		 *
		 * @param {Object}   element     Element on which the event will be bound
		 * @param {string}   class    class name
		 * @param {Function} toggle class if he in classList remove and if not add
		 */
		classToggle: function (element, classTo) {
			var currentClassValue = element.className;
			if (currentClassValue.indexOf(classTo) == -1) {
                if ((currentClassValue == null) || (currentClassValue === "")) {
                    element.className = classTo;
                } else {
                    element.className += " " + classTo;
                }
            }else{
            	// removing a class value when there is more than one class value present
	            // and the class you want to remove is not the first one
	            if (currentClassValue.indexOf(" " + classTo) != -1) {
	                element.className = element.className.replace(" " + classTo, "");
	                return;
	            }

	            // removing the first class value when there is more than one class
	            // value present
	            if (currentClassValue.indexOf(classTo + " ") != -1) {
	                element.className = element.className.replace(classTo + " ", "");
	                return;
	            }

	            // removing the first class value when there is only one class value
	            // present
	            if (currentClassValue.indexOf(classTo) != -1) {
	                element.className = element.className.replace(classTo, "");
	                return;
	            }
            }

		},

		/**
		 * Cross browser even handler
		 *
		 * @param {Object}   elm     Element on which the event will be bound
		 * @param {string}   type    Event type or types (e.g. 'click', 'click input')
		 * @param {Function} handler Callback function to run when event is fired
		 */
		addEvent: function (elm, type, handler) {
			var types = type.split(' '),
				ieHandler;

			// Recurse if multiple event types were given
			if (types.length > 1) {
				// On each iteration, remove the first value in the array
				while (types.length) {
					UTILS.addEvent(elm, types.shift(), handler);
				}

				return;
			}

			if (window.addEventListener) {
				// Modern browsers
				elm.addEventListener(type, handler, false);
			} else if (window.attachEvent) {
				// IE8 and below
				// Required for normalizing the "event" object
				ieHandler = function (e) {
					e.target = e.target || e.srcElement;
					e.currentTarget = e.currentTarget || elm;

					e.stopPropagation = e.stopPropagation || function () {
						e.cancelBubble = true;
					};

					e.preventDefault = e.preventDefault || function () {
						e.returnValue = false;
					};

					return handler.call(elm, e);
				};

				// Save a reference to the handler as a unique key
				elm[type + handler] = ieHandler;
				elm.attachEvent('on' + type, ieHandler);
			}
		},

		/**
		 * Cross browser event removal
		 *
		 * @param {Object}   elm     Element on which the event should be unbound
		 * @param {string}   type    Event type to unbind
		 * @param {Function} handler Reference to the original callback function
		 */
		removeEvent: function (elm, type, handler) {
			var handlerRef;

			if (window.removeEventListener) {
				// Modern browsers
				elm.removeEventListener(type, handler, false);
			} else if (window.detachEvent) {
				// IE8 and below
				handlerRef = elm[type + handler];

				// Make sure the handler key exists
				if (handlerRef) {
					elm.detachEvent('on' + type, handlerRef);
					// Remove the key from the object, prevent memory leaks
					delete elm[type + handler];
				}
			}
		},

		/**
		 * Check if a given value is a plain Object
		 *
		 * @param  {*}       o Any value to be checked
		 * @return {Boolean}   true if it's an Object
		 */
		isObject: function (o) {
			var toString = Object.prototype.toString;
			return (toString.call(o) === toString.call({}));
		},

		/**
		 * Check if url valid
		 *
		 * @param  {url}       url string
		 * @return {Boolean}   true if it's an Object
		 */
		urlValid: function (url) {
			var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
			if (!re.test(url)) { 
			    return false;
			}
			return true;
		},
		/**
		 * AJAX helper function (similar to jQuery, but far from it!)
		 *
		 * @param {string} url     URL for the ajax request
		 * @param {Object} options AJAX settings
		 */
		ajax: function (url, options) {
			var xhr = new XMLHttpRequest(),
				method = 'GET',
				options = UTILS.isObject(options) ? options : {};

			// Check if "method" was supplied
			if (options.method) {
				method = options.method;
			}

			// Setup the request
			xhr.open(method.toUpperCase(), url);

			xhr.onreadystatechange = function () {
				var status;

				// If request finished
				if (xhr.readyState === 4) {
					status = xhr.status;

					// If response is OK or fetched from cache
					if ((status >= 200 && status < 300) || status === 304) {
						var res = xhr.responseText,
							contentType = xhr.getResponseHeader('Content-Type');

						// If server sent a content type header, handle formats
						if (contentType) {
							// Handle JSON format
							if (contentType === 'text/json' ||
								contentType === 'application/json') {

								// JSON throws an exception on invalid JSON
								try {
									res = JSON.parse(res);
								} catch (err) {
									// Trigger "fail" callback if set
									if (options.fail) {
										options.fail.call(xhr, err);
										return;
									}
								}
							// Handle XML format
							} else if (contentType === 'text/xml' ||
								contentType === 'application/xml') {
								// responseXML returns a document object
								res = xhr.responseXML;

								// if XML was invalid, trigger fail callback
								if (res === null && options.fail) {
									options.fail.call(xhr, 'Bad XML file');
									return;
								}
							}
						}

						// Trigger done callback with the proper response
						if (options.done) {
							options.done.call(xhr, res);
						}
					}

				}
			};

			// Fire the request
			xhr.send(null);
		}
	};
}());