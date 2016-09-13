// POOLMONSTER.JS
define(['functions', 'physijs'], function(Functions) {

	function PoolMonster(options) {

		var self = this;

		self.size = options.size;
		self.position = options.position;
		self.parent = options.parent;

		self.dieCheckInterval = {};

		self.meshes = {
			body: {},
			leg: {}
		};

		self.constraints = {
			legConstraint: {}
		};

		self.makeBody = function() {

			var geometry = new THREE.BoxGeometry(self.size, self.size, self.size);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var body = new Physijs.BoxMesh(geometry, material, 1);

			body.userData.id = 'body';

			body.geometry.dynamic = true;
			body.receiveShadow = true;
			body.castShadow = true;

			body.position.x = self.position.x;
			body.position.y = self.position.y + 0.5;
			body.position.z = self.position.z;

			self.meshes.body = body;

			THREEworld.scene.add(self.meshes.body);

		}

		self.makeLeg = function() {

			var geometry = new THREE.BoxGeometry(self.size * 3, self.size * 0.25, self.size);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var leg = new Physijs.BoxMesh(geometry, material, 1);

			leg.userData.id = 'leg';

			leg.geometry.dynamic = true;
			leg.receiveShadow = true;
			leg.castShadow = true;

			leg.position.x = self.position.x + self.size;
			leg.position.y = self.position.y;
			leg.position.z = self.position.z;

			self.meshes.leg = leg;

			THREEworld.scene.add(self.meshes.leg);

		}

		self.addLegConstraint = function() {

			var legConstraint = new Physijs.SliderConstraint(
				self.meshes.body,
				self.meshes.leg,
				new THREE.Vector3(self.position.x - self.size / 2, self.position.y, self.position.z),
				new THREE.Vector3(0, 1, 0)
			);

			self.constraints.legConstraint = legConstraint;

			THREEworld.scene.addConstraint(self.constraints.legConstraint);

			self.constraints.legConstraint.setLimits(-3, 0, 0, 0);
			self.constraints.legConstraint.setRestitution(0, 0);

		}

		self.dieCheck = function() {

	        self.dieCheckInterval = setInterval(function() {

	        	var currentMonsterY = self.meshes.body.position.y;

	        	if (currentMonsterY < -150) {
	        		clearInterval(self.dieCheckInterval);
	        		THREEworld.scene.remove(self.meshes.body);
	        		THREEworld.scene.remove(self.meshes.leg);
	        		THREEworld.scene.removeConstraint(self.constraints.legConstraint);
	        		self.parent.monsterDied();
	        	}

	        }, 1000);

		}

		self.makeBody();
		self.makeLeg();

		self.addLegConstraint();

		setTimeout(function() {
			self.constraints.legConstraint.enableLinearMotor(-35, 500);
			self.dieCheck();
		}, 2000);

		// ---

		function makeid() {
		    var text = "";
		    var possible = "ABCDE012345678901234567890123456789";

		    for( var i=0; i < 5; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));

		    return text;
		}

	    $('#information .testid').html('#'+makeid());

	    var gen = $('#information .generation .number').text();

	    $('#information .generation .number').html(parseInt(gen) + 1);

	}

	return PoolMonster;

});