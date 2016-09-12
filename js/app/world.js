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
		world: '',
		petriCenter: {},
		hillCenter: {},
		targetCenter: {}
	};

	module.init = function() {

		log("World module init");

		Physijs.scripts.worker = 'js/vendor/physijs_worker.js';
		Physijs.scripts.ammo = 'ammo.js';

		var hash = location.hash.replace('#', ''); // which world? petri, hill, target, all
		module.world = hash;

		module.setScene();
		module.setRenderer();
		module.setCamera();
		module.setLight();

		module.setControls();

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

		renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		renderer.setSize(window.innerWidth, window.innerHeight);

		module.renderer = renderer;

		$('#page').append(module.renderer.domElement);

		window.addEventListener('resize', function () {
			module.renderer.setSize(window.innerWidth, window.innerHeight);
		});

	}

	module.setCamera = function() {

		module.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -500, 1000);

		module.camera.position.set(4, 6, 10);
		module.camera.lookAt(module.scene.position);
		module.camera.zoom = 40;

		module.camera.updateProjectionMatrix();

		if (module.world == 'all') {
			var cameraIndex = 2;
			var cameraInterval = setInterval(function() {
				switch (cameraIndex) {
					case 1:
						module.camera.position.set(4, 6, 10);
						module.controls.target = module.petriCenter;
					break;

					case 2:
						module.camera.position.set(54, 6, 10);
						module.controls.target = module.hillCenter;
					break;

					case 3:
						module.camera.position.set(104, 6, 10);
						module.controls.target = module.targetCenter;
					break;
				}
				cameraIndex++;
				if (cameraIndex == 4) cameraIndex = 1;
			}, 20000);
		}

		module.scene.add(module.camera);

		window.addEventListener('resize', function () {
			module.camera.aspect = window.innerWidth / window.innerHeight;
			module.camera.updateProjectionMatrix();
		});

	}

	module.setLight = function() {

		var light = new THREE.DirectionalLight(0xffffff);

		light.position.set(0, 100, 60);
		light.castShadow = false;
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

			case 'target':
				require(['target'], function(Target) {
					Target.init({
						world: module
					});
				});
			break;

			case 'all':
				require(['petri', 'hill', 'target'], function(Petri, Hill, Target) {
					Petri.init({
						world: module,
						all: true
					});
					Hill.init({
						world: module,
						all: true
					});
					Target.init({
						world: module,
						all: true
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

			if (event.which == 105) {
				$('#information').toggle();
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