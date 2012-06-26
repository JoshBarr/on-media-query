/*
 * onMediaQuery
 * http://springload.co.nz/love-the-web/
 *
 * Copyright 2012, Springload
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Fri 18 May, 2012
 */

var MQ = (function(mq) {
    var mq = mq || {};
    
    /**
     * Initialises the MQ object and sets the initial media query callbacks
     * @returns Void(0)
     */
    mq.init = function(query_array) {

         // Container for all callbacks registered with the plugin
        this.callbacks = [];
        this.context = ''; //current active query
        this.new_context = ''; //current active query to be read inside callbacks, as this.context won't be set when they're called!

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

    /**
     * Binds to the window.onResize and checks for media query changes
     * @returns Void(0)
     */
    mq.listenForChange = function() {
        var body_after;

        // Get the value of html { font-family } from the element style.
        if (document.documentElement.currentStyle) {
            query_string = document.documentElement.currentStyle["fontFamily"];
        }

        if (window.getComputedStyle) {
            query_string = window.getComputedStyle(document.documentElement).getPropertyValue('font-family');
        }

        // No support for CSS enumeration? Return and avoid errors.
        if (query_string == null) return;

        // Android browsers place a "," after an item in the font family list.
        // Most browsers either single or double quote the string.
        query_string = query_string.replace(/['",]/g, '');

        if (query_string !== this.context) {
            this.new_context = query_string;
            this.triggerCallbacks(this.new_context);
        }

        this.context = this.new_context;
    }

    /**
     * Attach a new query to test.
     * @param query_object {
     *     context: ['some_media_query','some_other_media_query'],
     *     call_for_each_context: true,
     *     callback: function() {
     *         //something awesome
     *     }
     * }
     * @returns A reference to the query_object that was added
     */
    mq.addQuery = function(query_object) {
        if (query_object == null || query_object == undefined) return;

        this.callbacks.push(query_object);
        
        // If the context is passed as a string, turn it into an array (for unified approach elsewhere in the code)
        if (typeof(query_object.context) == "string") {
            query_object.context = [query_object.context];
        }
        
        // See if "call_for_each_context" is set, if not, set a default (for unified approach elsewhere in the code)
        if (typeof(query_object.call_for_each_context) !== "boolean") {
            query_object.call_for_each_context = true; // Default
        }
        
        // Fire the added callback if it matches the current context
        if (this.context != '' && this._inArray(this.context, query_object.context)) {
            query_object.callback();
        }
        
        return this.callbacks[ this.callbacks.length - 1];
    };

    /**
     * Remove a query_object by reference.
     * @returns Void(0)
     */
    mq.removeQuery = function(query_object) {
        if (query_object == null || query_object == undefined) return;

        var match = -1;

        while ((match = this.callbacks.indexOf(query_object)) > -1) {
            this.callbacks.splice(match, 1);
        }
    }

    /**
     * Loop through the stored callbacks and execute 
     * the ones that are bound to the current context.
     * @returns Void(0)
     */
    mq.triggerCallbacks = function(size) {
        var i, callback_function, call_for_each_context;

        for (i = 0; i < this.callbacks.length; i++) {

            // Don't call for each context?
            if (this.callbacks[i].call_for_each_context == false && this._inArray(this.context, this.callbacks[i].context)) {
                // Was previously called, and we don't want to call it for each context
                continue;
            }

            callback_function = this.callbacks[i].callback;
            if (this._inArray(size, this.callbacks[i].context) && callback_function !== undefined) {
                callback_function();
            }

        }
    }

    /**
     * Swiss Army Knife event binding, in lieu of jQuery.
     * @returns Void(0)
     */
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
    
    /**
     * Internal helper function that checks wether "needle" occurs in "haystack"
     * @param needle Mixed Value to look for in haystack array
     * @param haystack Array Haystack array to search in
     * @returns Boolan True if the needle occurs, false otherwise
     */
    mq._inArray = function(needle, haystack)
    {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) return true;
        }
        return false;
    }

    // Expose the functions.
    return mq;

}(MQ || {}));