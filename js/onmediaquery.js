/*
 * onMediaQuery
 * http://springload.co.nz/love-the-web/
 *
 * Copyright 2012, Springload
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Tue 1 May, 2012
 */

var MQ = (function(mq){
	var mq = mq || {};
	
	mq.init = function ( query_array ) {

		this.callbacks = new Array();
		this.context = '';

		if(typeof(query_array) !== 'undefined' ) {
			for (i = 0; i < query_array.length; i++) {
				var r = this.addQuery(query_array[i]);
			}
		}

		this.addEvent(window, 'resize', 'listenForChange', mq);
		this.listenForChange();
	}

	mq.listenForChange = function() {
		var size;
		
		size = window.getComputedStyle(document.body,':after').getPropertyValue('content');
		size = size.replace(/[^A-Za-z\s\-]+/g, '');
		if(size !== this.context) {
			this.triggerCallbacks(size);
		}
		this.context = size;
	}

	mq.addQuery = function( query_object ) {
		if (query_object == null || query_object == undefined) return;

		this.callbacks.push(query_object);
		return this.callbacks[ this.callbacks.length - 1];
	};

	mq.removeQuery = function( query_object ) {
		if (query_object == null || query_object == undefined) return;

		var match = -1;

	    while( (match = this.callbacks.indexOf(query_object)) > -1 ) {
	        this.callbacks.splice(match, 1);
	    }
	}

	mq.triggerCallbacks = function(size) {
		var i, callback_function;

		for (i = 0; i < this.callbacks.length; i++) {
			callback_function = this.callbacks[i].callback;
			if( this.callbacks[i].context === size && callback_function !== undefined) {
				callback_function();
			}
		}
	}

	mq.addEvent = function(elem, type, eventHandle, eventContext) {
	    if (elem == null || elem == undefined) return;
	    if ( elem.addEventListener ) {
	        elem.addEventListener( type, function() { eventContext[eventHandle]() }, false );
	    } else if ( elem.attachEvent ) {
	        elem.attachEvent( "on" + type, function() {  eventContext[eventHandle]() } );
	    } else {
	        elem["on"+type]=function() {  eventContext[eventHandle]() };
	    }
	}

	return mq;

}(MQ || {}));