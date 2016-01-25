// PETRIMONSTER.JS
define(['functions', 'three', 'physijs'], function(Functions, THREE) {

	function PetriMonster(options) {

		var self = this;

		self.world = options.world;
		self.size = options.size;
		self.position = options.position;
		self.parent = options.parent;

		self.meshes = {
			body: {},
			leftLeg: {},
			rightLeg: {}
		};

		self.constraints = {
			leftLegConstraint: {},
			rightLegConstraint: {}
		};

		self.moveLoopTimer = {};

		self.makeBody = function() {

			var bodyWeight = 0.5;
			var width = 1, height = 1, depth = 1;

			var geometry = new THREE.BoxGeometry(width * self.size, height * self.size, depth * self.size);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var body = new Physijs.BoxMesh(geometry, material, bodyWeight);

			body.userData.id = 'body';

			body.geometry.dynamic = true;
			body.receiveShadow = true;
			body.castShadow = true;

			body.position.x = self.position.x;
			body.position.y = self.position.y;
			body.position.z = self.position.z;

			self.meshes.body = body;

			self.world.scene.add(self.meshes.body);

		}

		self.makeLeftLeg = function() {

			var legWeight = 0.25;
			var width = 3, height = 1, depth = 0.2;

			var geometry = new THREE.BoxGeometry(width * self.size, height * self.size, depth * self.size);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var leg = new Physijs.BoxMesh(geometry, material, legWeight);

			leg.userData.id = 'leg';

			leg.geometry.dynamic = true;
			leg.receiveShadow = true;
			leg.castShadow = true;

			leg.position.x = self.position.x + -self.size * 2;
			leg.position.y = self.position.y;
			leg.position.z = self.position.z;

			self.meshes.leftLeg = leg;

			self.world.scene.add(self.meshes.leftLeg);

		}

		self.makeRightLeg = function() {

			var legWeight = 0.25;
			var width = 3, height = 1, depth = 0.2;

			var geometry = new THREE.BoxGeometry(width * self.size, height * self.size, depth * self.size);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 0.4, 0.8);
			var leg = new Physijs.BoxMesh(geometry, material, legWeight);

			leg.userData.id = 'leg';

			leg.geometry.dynamic = true;
			leg.receiveShadow = true;
			leg.castShadow = true;

			leg.position.x = self.position.x + self.size * 2;
			leg.position.y = self.position.y;
			leg.position.z = self.position.z;

			self.meshes.rightLeg = leg;

			self.world.scene.add(self.meshes.rightLeg);

		}

		self.addLeftLegConstraint = function() {

			var leftLegConstraint = new Physijs.HingeConstraint(
				self.meshes.body,
				self.meshes.leftLeg,
				new THREE.Vector3(self.position.x, self.position.y, self.position.z),
				new THREE.Vector3(0, 1, 0)
			);

			self.constraints.leftLegConstraint = leftLegConstraint;

			self.world.scene.addConstraint(self.constraints.leftLegConstraint);

			self.constraints.leftLegConstraint.setLimits(-45, 45, 0.5, 1);

		}

		self.addRightLegConstraint = function() {

			var rightLegConstraint = new Physijs.HingeConstraint(
				self.meshes.body,
				self.meshes.rightLeg,
				new THREE.Vector3(self.position.x, self.position.y, self.position.z),
				new THREE.Vector3(0, 1, 0)
			);

			self.constraints.rightLegConstraint = rightLegConstraint;

			self.world.scene.addConstraint(self.constraints.rightLegConstraint);

			self.constraints.rightLegConstraint.setLimits(-45, 45, 0.5, 1);

		}

		self.move = function() {

			var flap = 'down';

			var speed = 5;
			var acceleration = 10;

			var leftLegConstraint = self.constraints.leftLegConstraint;
			var rightLegConstraint = self.constraints.rightLegConstraint;

			leftLegConstraint.enableAngularMotor(-speed, acceleration);
			rightLegConstraint.enableAngularMotor(speed, acceleration);

			self.moveLoopTimer = setInterval(function() {

				if (flap == 'up') {
					flap = 'down';
					leftLegConstraint.enableAngularMotor(-speed, acceleration);
					rightLegConstraint.enableAngularMotor(speed, acceleration);
				} else {
					flap = 'up';
					leftLegConstraint.enableAngularMotor(speed, acceleration);
					rightLegConstraint.enableAngularMotor(-speed, acceleration);
				}

			}, 500);

		}

		self.dieCheck = function() {

	        self.dieCheckInterval = setInterval(function() {

	        	var currentMonsterY = self.meshes.body.position.y;

	        	if (currentMonsterY < -150) {
	        		clearInterval(self.dieCheckInterval);
	        		clearInterval(self.moveLoopTimer);
	        		self.world.scene.remove(self.meshes.body);
	        		self.world.scene.remove(self.meshes.leftLeg);
	        		self.world.scene.remove(self.meshes.rightLeg);
	        		self.world.scene.removeConstraint(self.constraints.leftLegConstraint);
	        		self.world.scene.removeConstraint(self.constraints.rightLegConstraint);
	        		self.parent.monsterDied();
	        	}

	        }, 1000);

		}

		self.makeBody();
		self.makeLeftLeg();
		self.makeRightLeg();

		self.addLeftLegConstraint();
		self.addRightLegConstraint();

		var moveDelay = Math.floor(Math.random() * (5000 - 750 + 1)) + 750;

		setTimeout(function() {
			self.move();
			self.dieCheck();
		}, moveDelay);

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

	return PetriMonster;

});