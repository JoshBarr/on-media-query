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

    // Helper to iterate through an object correctly
    var each = function(items, callback) {
        for (var key in items) if (items.hasOwnProperty(key)) {
            callback(key, items[key]);
        }
    };
    
    // Helper to find the type of an object correctly
    var type = function(object) {
        return Object.prototype.toString.call(object).match(/\s(\w+)/)[1].toLowerCase();
    };

    // Helper to execute an array of callbacks
    var execute = function( callbacks ) {
        for(var i=0, len=callbacks.length; i<len; i++) {
            callbacks[i]();
        }
    };
    
    mq.init = function(queries) {

        this.queries = {};
        each((queries || {}), function(context, callback) {
            mq.addQuery( context, callback );
        });

        // Figure out which query is active on load.
        this.listenForChange();
        
        // Add a listener to the window.resize event, pass mq/self as the scope.
        this.addEvent(window, 'resize', mq.listenForChange, mq);
    };

    mq.listenForChange = function() {
        // Get the value of body:after from the element style.
        if (!window.getComputedStyle) return;

        var body_after = window.getComputedStyle(document.body,':after').getPropertyValue('content');
     
        // No support for css :after? return and avoid errors;
        if (body_after == null) return;

        body_after = body_after.replace(/['"]/g, '');
        if (body_after !== this.context) {
            this.triggerCallbacks(body_after);
        }
        this.context = body_after;
    }

    // Attach a new query to test.
    mq.addQuery = function( context, callback ) {
        var currentValue = this.queries[context];
        
        switch( type( currentValue ) ) {
            case 'array':
                break;
            case 'function':
                this.queries[context] = [currentValue];
                break;
            default:
                this.queries[context] = [];
        };
      
        var callbacks = type(callback) === 'array' ? callback : [callback];
        this.queries[context].push.apply( this.queries[context], callbacks );
        
        if ( context === this.context ) {
            execute( callbacks );
        }
        
        return callback;
    };
    
    // Remove a query_object by reference.
    mq.removeQuery = function( context, callback ) {
        var callbacks = this.queries[context] || [];
        var match = callbacks.indexOf( callback );
        if ( match > -1 ) {
            callbacks.splice( match, 1 );
            this.queries[context] = callbacks;
        }
    };

    // Loop through the stored callbacks and execute
    // the ones that are bound to the current context.
    mq.triggerCallbacks = function(size) {
        execute( this.queries[size] || [] );
    };

    // Swiss Army Knife event binding, in lieu of jQuery.
    mq.addEvent = function(elem, type, eventHandle, eventContext) {
        if (elem == null || elem == undefined) return;
        // If the browser supports event listeners, use them.
        if (elem.addEventListener) {
            elem.addEventListener(type, function() { eventHandle.call(eventContext) }, false);
        } else if (elem.attachEvent ) {
            elem.attachEvent("on" + type, function() {  eventHandle.call(eventContext) });
            
        // Otherwise, replace the current thing bound to on[whatever]! Consider refactoring.
        } else {
            elem["on" + type] = function() { eventHandle.call(eventContext) };
        }
    };

    // Expose the functions.
    return mq;

}(MQ || {}));
