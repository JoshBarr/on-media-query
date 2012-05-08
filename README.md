Javascript onMediaQuery
===============================

A neat way to trigger JS when media queries change.

Jeremy Keith recently posted a fantastic way of getting
CSS and Javascript to talk media queries with the CSS :after pseudo-property.

This has a number of advantages over using window.matchMedia(), namely that
you only have to maintain your breakpoints in one place, and it fails more
gracefully.


How to use it
===============================

1. CSS
-------------------------------
Define a set of body:after content strings in your stylesheet
that correspond to the media queries you wish to test for:

<style>

body:after {
	content: 'mobile';
	display: none;
}

@media screen and (min-width: 35em) {
	body:after {
		content: 'skinny'
	}
}

@media screen and (min-width: 56em) {
	body:after {
		content: 'wide-screen'
	}
}

</style>


2. JS
-------------------------------
Define the queries you want to test for.. and what to do if they're TRUE

<script type="text/javascript" src="js/onmediaquery.min.js"></script>
<script>

var queries = [
	{
		context: 'mobile',
		callback: function() {
			console.log('Mobile callback. Maybe hook up some tel: numbers?');
			// Your mobile specific logic can go here. 
		}
	},
	{
		context: 'skinny',
		callback: function() {
			console.log('skinny callback! Swap the class on the body element.');
			// Your tablet specific logic can go here.
		}
	},
	{
		context: 'wide-screen',
		callback: function() {
			console.log('wide-screen callback woohoo! Load some heavy desktop JS badddness.');
			// your desktop specific logic can go here.
		}
	}
];
// Go!
MQ.init(queries);

</script>


3. Adding queries
-------------------------------
As well as passing an array of objects when you initialise the
plugin, you can add extra callbacks at any time. This is especially
handy if you've got multiple JS files across the site that need to
test whether a query is true.

<script>

var my_query = MQ.addQuery({
	context: 'skinny', 
	callback: function() { 
		console.log( 'second skinny callback!' )
	}
});

</script>


4. Removing queries
-------------------------------
Remove a query by passing in a reference to it:

MQ.removeQuery( my_query );



5. Marvel at your own 1337-ness.
-------------------------------
Enjoy responsive javascript with a friend today.



===============================
Josh Barr
Designer

Springload
www.springload.co.nz


