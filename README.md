Javascript onMediaQuery
===============================

A neat way to trigger JS when media queries change.

Jeremy Keith recently posted a fantastic way of getting
CSS and Javascript to talk media queries with the CSS :after pseudo-property.

UPDATE: It turns out that Android JS support for CSS :after is pretty patchy.
We've decided to set the font-family property on the HTML element instead, as
it's better supported (despite being a bit of a hack).

This has a number of advantages over using window.matchMedia(), namely that
you only have to maintain your breakpoints in one place, and it fails more
gracefully.


How to use it
===============================

1. CSS
-------------------------------
Define a set of html font-family strings in your stylesheet
that correspond to the media queries you wish to test for:
```css
<style>

	html {
		font-family: 'mobile';
	}

	* html { /* IE6 */
		font-family: 'desktop'
	}
	
	*+html { /* IE7 */
		font-family: 'desktop'
	}
	
	@media \0screen {
		html {  /* IE8 */
			font-family: 'desktop'
		}
	}

	/* Reset your font families here!       
	 ----------------------------------- */
	body {
		font-family: Arial, Helvetica, sans-serif;
	}

	/* Queries for supported browsers.       
	 ----------------------------------- */
	body:after {
		display: none;
	}
	
	@media screen and (min-width: 35em) {
		html {
			font-family: "skinny";
		}
		body:after {
			content: "skinny";
		}
	}

	@media screen and (min-width: 56em) {
		html {
			font-family: "desktop";
		}
		body:after {
			content: "desktop";
		}
	}

</style>
```

2. JS
-------------------------------
Define the queries you want to test for.. and what to do if they match.

You can also decide what to do when a query unmatches, for example un-binding that pesky mobile nav event listener

```javascript
<script type="text/javascript" src="js/onmediaquery.min.js"></script>
<script>

var queries = [
	{
		context: 'mobile',
		match: function() {
			console.log('Mobile callback. Maybe hook up some tel: numbers?');
			// Your mobile specific logic can go here. 
		},
		unmatch: function() {
			// We're leaving mobile.	
		}
	},
	{
		context: 'skinny',
		match: function() {
			console.log('skinny callback! Swap the class on the body element.');
			// Your tablet specific logic can go here.
		},
		unmatch: function() {
			console.log('leaving skinny context!');
		}
		
	},
	{
		context: 'wide-screen',
		match: function() {
			console.log('wide-screen callback woohoo! Load some heavy desktop JS badddness.');
			// your desktop specific logic can go here.
		}
	}
];
// Go!
MQ.init(queries);

</script>
```

3. Adding queries
-------------------------------
As well as passing an array of objects when you initialise the
plugin, you can add extra callbacks at any time. This is especially
handy if you've got multiple JS files across the site that need to
test whether a query is true.

```Javascript
<script>

var my_query = MQ.addQuery({
	context: 'skinny', 
	match: function() { 
		console.log( 'second skinny callback!' )
	}
});

</script>
```

In the latest release, you can now have a function execute once across a range of contexts.
Helpful if you want to initialise the code once for desktops and tablets, but leverage a
custom controller on mobiles, for instance: 

```Javascrpt
<script>
var my_query = MQ.addQuery({
	context: ['skinny','desktop'],
	call_for_each_context: false, 
	match: function() { 
		console.log( 'second skinny callback!' )
	}
});
</script>
```

4. Removing queries
-------------------------------
Remove a query by passing in a reference to it:
```Javascript
MQ.removeQuery( my_query );
```


5. Marvel at your 1337-ness.
-------------------------------
Enjoy responsive javascript with a friend today.


Josh Barr | Designer | Springload
www.springload.co.nz


