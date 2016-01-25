// MAIN.JS
define(['functions', 'events', 'world'], function(Functions, Events, World) {

	var module = {};

	module.init = function() {

		log("Main module init");

		// set lt-ie9 flag
		if ($('html').hasClass('lt-ie9')) {
			globals.ltie9 = true;
		}

		// check for touch
		if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
			$('html').addClass('touch');
		} else {
			$('html').addClass('no-touch');
		}

		// set current breakpoint
		globals.breakpoints.currentBreakpoint = Functions.getBreakpoint($(window).width());

		// init other main modules
		Events.init();

		// create world
		World.init();

	}

	return module;

});