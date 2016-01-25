// HILLMONSTER.JS
define(['functions', 'three', 'physijs'], function(Functions, THREE) {

	function HillMonster(options) {

		var self = this;

		self.world = options.world;
		self.size = options.size;
		self.position = options.position;
		self.parent = options.parent;

		self.dieCheckInterval = {};

		self.meshes = {
			body: {},
			leftLeg: {},
			rightLeg: {}
		};

		self.constraints = {
			leftLegConstraint: {},
			rightLegConstraint: {}
		};

		self.makeBody = function() {

			var bodyWeight = 50;

			var geometry = new THREE.BoxGeometry(self.size, self.size, self.size);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 1, 0);
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

			var geometry = new THREE.BoxGeometry(self.size * 2, self.size * 0.25, self.size * 0.25);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 1, 0);
			var leftLeg = new Physijs.BoxMesh(geometry, material, 5);

			leftLeg.userData.id = 'leftLeg';

			leftLeg.geometry.dynamic = true;
			leftLeg.receiveShadow = true;
			leftLeg.castShadow = true;

			leftLeg.position.x = self.position.x + self.size;
			leftLeg.position.y = self.position.y;
			leftLeg.position.z = self.position.z - self.size / 2 - self.size * 0.25 / 2;

			self.meshes.leftLeg = leftLeg;

			self.world.scene.add(self.meshes.leftLeg);

		}

		self.makeRightLeg = function() {

			var geometry = new THREE.BoxGeometry(self.size * 2, self.size * 0.25, self.size * 0.25);
			var material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
				color: 0xff0000,
				reflectivity: 0
			}), 1, 0);
			var rightLeg = new Physijs.BoxMesh(geometry, material, 5);

			rightLeg.userData.id = 'rightLeg';

			rightLeg.geometry.dynamic = true;
			rightLeg.receiveShadow = true;
			rightLeg.castShadow = true;

			rightLeg.position.x = self.position.x + self.size;
			rightLeg.position.y = self.position.y;
			rightLeg.position.z = self.position.z + self.size / 2 + self.size * 0.25 / 2;

			self.meshes.rightLeg = rightLeg;

			self.world.scene.add(self.meshes.rightLeg);

		}

		self.addLeftLegConstraint = function() {

			var constraint = new Physijs.DOFConstraint(
				self.meshes.body,
				self.meshes.leftLeg,
				new THREE.Vector3(self.position.x, self.position.y, self.position.z - self.size / 2 - self.size * 0.25 / 2)
			);

			self.world.scene.addConstraint(constraint);

			constraint.setAngularLowerLimit({x: 0, y: 0, z: 0.1});
			constraint.setAngularUpperLimit({x: 0, y: 0, z: 0});

			constraint.configureAngularMotor(2, 0.1, 0, -20, 1000);

			constraint.enableAngularMotor(2);

			self.constraints.leftLegConstraint = constraint;

		}

		self.addRightLegConstraint = function() {

			var constraint = new Physijs.DOFConstraint(
				self.meshes.body,
				self.meshes.rightLeg,
				new THREE.Vector3(self.position.x, self.position.y, self.position.z + self.size / 2 + self.size * 0.25 / 2)
			);

			self.world.scene.addConstraint(constraint);

			constraint.setAngularLowerLimit({x: 0, y: 0, z: 0.1});
			constraint.setAngularUpperLimit({x: 0, y: 0, z: 0});

			constraint.configureAngularMotor(2, 0.1, 0, -20, 1000);

			constraint.enableAngularMotor(2);

			self.constraints.rightLegConstraint = constraint;

		}

		self.dieCheck = function() {

	        self.dieCheckInterval = setInterval(function() {

	        	var currentMonsterY = self.meshes.body.position.y;

	        	if (currentMonsterY < -150) {
	        		clearInterval(self.dieCheckInterval);
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

		self.dieCheck();

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

	return HillMonster;

});