// WORLD.JS
define(['functions', 'three', 'physijs', 'orbitcontrols'], function(Functions, THREE) {

	var module = {
		scene: {},
		renderer: {},
		camera: {},
		cameraRotation: false,
		controls: {},
		light: {},
		monsters: [],
		balls: [],
		world: ''
	};

	module.init = function() {

		log("World module init");

		Physijs.scripts.worker = 'js/vendor/physijs_worker.js';
		Physijs.scripts.ammo = 'ammo.js';

		module.setScene();
		module.setRenderer();
		module.setCamera();
		module.setLight();

		module.setControls();

		var hash = location.hash.replace('#', ''); // which world? petri, hill, pool, target

		module.world = hash;
		module.initWorld(module.world);

		module.initInformation();

		requestAnimationFrame(module.render);

	}

	module.render = function() {

		module.scene.simulate();
		module.renderer.render(module.scene, module.camera);
		module.controls.update();

		if (module.cameraRotation) {
			var timer = Date.now() * 0.0001;
			var cameraXdistance = 10;
			var cameraZdistance = 10;
			if (module.world == 'hill') {
				cameraXdistance = 12;
				cameraZdistance = 12;
			}
			module.camera.position.x = Math.cos(timer) * cameraXdistance;
			module.camera.position.z = Math.sin(timer) * cameraZdistance;
			module.camera.lookAt(module.scene.position);
		}

		requestAnimationFrame(module.render);

	}

	module.setScene = function() {

		module.scene = new Physijs.Scene;
		module.scene.setGravity(new THREE.Vector3(0, -30, 0));

	}

	module.setRenderer = function() {

		var renderer = new THREE.WebGLRenderer({
			antialias: false
		});

		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.BasicShadowMap;
		renderer.shadowMapAutoUpdate = true;

		renderer.setSize(window.innerWidth, window.innerHeight);

		module.renderer = renderer;

		$('#page').append(module.renderer.domElement);

		window.addEventListener('resize', function () {
			module.renderer.setSize(window.innerWidth, window.innerHeight);
		});

	}

	module.setCamera = function() {

		module.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        module.camera.position.set(2, 4, 10);
        module.camera.lookAt(module.scene.position);

        module.scene.add(module.camera);

		window.addEventListener('resize', function () {
			module.camera.aspect = window.innerWidth / window.innerHeight;
			module.camera.updateProjectionMatrix();
		});

	}

	module.setLight = function() {

		var light = new THREE.DirectionalLight(0xffffff);

		light.position.set(0, 100, 60);
		light.castShadow = true;
		light.shadowCameraLeft = -60;
		light.shadowCameraTop = -60;
		light.shadowCameraRight = 60;
		light.shadowCameraBottom = 60;
		light.shadowCameraNear = 1;
		light.shadowCameraFar = 1000;
		light.shadowBias = -.0001
		light.shadowMapWidth = light.shadowMapHeight = 1024;
		light.shadowDarkness = .7;

		module.scene.add(light);

	}

	module.initWorld = function(worldName) {

		switch(worldName) {

			case 'petri':
				require(['petri'], function(Petri) {
					Petri.init({
						world: module
					});
				});
			break;

			case 'hill':
				require(['hill'], function(Hill) {
					Hill.init({
						world: module
					});
				});
			break;

			case 'pool':
				require(['pool'], function(Pool) {
					Pool.init({
						world: module
					});
				});
			break;

			case 'target':
				require(['target'], function(Target) {
					Target.init({
						world: module
					});
				});
			break;

		}

	}

	module.setControls = function() {

		module.controls = new THREE.OrbitControls(module.camera, module.renderer.domElement);

		$('#camera-rotation-button').click(function(event) {
			if (module.cameraRotation) {
				module.cameraRotation = false;
				$(this).removeClass('active');
			} else {
				module.cameraRotation = true;
				$(this).addClass('active');
			}
		});

		$(document).keypress(function(event) {
			if (event.which == 100) {
				$('#controls').toggle();
			}
		});

	}

	module.initInformation = function() {

	    function checkTime(i) {
	        return (i < 10) ? '0' + i : i;
	    }

	    function startTime() {
	        var today = new Date(),
	            h = checkTime(today.getHours()),
	            m = checkTime(today.getMinutes()),
	            s = checkTime(today.getSeconds());
	        $('#information .time').html(h + ':' + m + ':' + s);
	        t = setTimeout(function() {
	            startTime()
	        }, 500);
	    }

	    startTime();

	    var rndGen = Math.floor(Math.random() * (592331 - 234322 + 1)) + 234322;

	    $('#information .generation .number').html(rndGen);

	}

	return module;

});