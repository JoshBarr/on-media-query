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

var MQ = (function(mq) {
    var mq = mq || {};
    
    mq.init = function(query_array) {

         // Container for all callbacks registered with the plugin
        this.callbacks = [];
        this.context = ''; //current active query

        if (typeof(query_array) !== 'undefined' ) {
            for (i = 0; i < query_array.length; i++) {
                var r = this.addQuery(query_array[i]);
            }
        }

        // Add a listener to the window.resize event, pass mq/self as the scope.
        this.addEvent(window, 'resize', mq.listenForChange, mq);

        // Figure out which query is active on load.
        this.listenForChange();
    }

    mq.listenForChange = function() {
        var body_after;

        // Get the value of body:after from the element style.
        if (!window.getComputedStyle) return;

        body_after = window.getComputedStyle(document.body,':after').getPropertyValue('content');
     
        // No support for css :after? return and avoid errors;
        if (body_after == null) return;

        body_after = body_after.replace(/['"]/g, '');
        if (body_after !== this.context) {
            this.triggerCallbacks(body_after);
        }
        this.context = body_after;
    }

    // Attach a new query to test.
    // [query_object] = {
    //                      context 'some_media_query',
    //                      callback: function() {
    //                          //something awesome
    //                      }
    //                  }
    //
    // Returns a reference to the query_object

    mq.addQuery = function(query_object) {
        if (query_object == null || query_object == undefined) return;

        this.callbacks.push(query_object);
        return this.callbacks[ this.callbacks.length - 1];
    };

    // Remove a query_object by reference.
    mq.removeQuery = function(query_object) {
        if (query_object == null || query_object == undefined) return;

        var match = -1;

        while ((match = this.callbacks.indexOf(query_object)) > -1) {
            this.callbacks.splice(match, 1);
        }
    }

    // Loop through the stored callbacks and execute
    // the ones that are bound to the current context.
    mq.triggerCallbacks = function(size) {
        var i, callback_function;

        for (i = 0; i < this.callbacks.length; i++) {
            callback_function = this.callbacks[i].callback;
            if (this.callbacks[i].context === size && callback_function !== undefined) {
                callback_function();
            }
        }
    }

    // Swiss Army Knife event binding, in lieu of jQuery.
    mq.addEvent = function(elem, type, eventHandle, eventContext) {
        if (elem == null || elem == undefined) return;
        // If the browser supports event listeners, use them.
        if (elem.addEventListener) {
            elem.addEventListener(type, function() { eventHandle.call(eventContext) }, false);
        } else if (elem.attachEven ) {
            elem.attachEvent("on" + type, function() {  eventHandle.call(eventContext) });
            
        // Otherwise, replace the current thing bound to on[whatever]! Consider refactoring.
        } else {
            elem["on" + type] = function() { eventHandle.call(eventContext) };
        }
    }

    // Expose the functions.
    return mq;

}(MQ || {}));