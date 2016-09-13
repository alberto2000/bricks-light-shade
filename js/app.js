requirejs.config({
	paths: {
		'jquery': 'vendor/jquery-1.12.0.min',
		'imagesloaded': 'vendor/imagesloaded.pkgd.min',
		'globals': 'globals',
		'functions': 'app/functions',
		'main': 'app/main',
		'events': 'app/events',
		'physijs': 'vendor/physi',
		'world': 'app/world',
		'petrimonster': 'app/petrimonster',
		'hillmonster': 'app/hillmonster',
		'poolmonster': 'app/poolmonster',
		'targetmonster': 'app/targetmonster',
		'ball': 'app/ball',
		'petri': 'app/petri',
		'hill': 'app/hill',
		'target': 'app/target',
		'orbitcontrols': 'plugins/OrbitControls'
	},
	shim: {

	},
	urlArgs: 'bust=' + (new Date()).getTime() // CACHE BUSTING - REMOVE ON PRODUCTION
});

require(['globals', 'jquery'], function() {

	require(['main', 'imagesloaded'], function(Main, imagesLoaded) {

		imagesLoaded.makeJQueryPlugin($);
		
		$(document).ready(function() {
			Main.init();
		});

	});

});