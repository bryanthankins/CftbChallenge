var CftbChallenge = {};

CftbChallenge.loaderState = function (game) {};

CftbChallenge.loaderState.prototype = {

	init: function() {
        this.input.maxPointers = 1;
        this.scale.pageAlignHorizontally = true;
        this.physics.startSystem(Phaser.Physics.P2JS);
	},

	preload: function() {
	  this.load.path = 'assets/';
	  this.load.bitmapFont('fat-and-tiny');
	},

	create: function() {
		this.stage.backgroundColor = 0x100438;
        this.state.start('menu');
	},


};



CftbChallenge.menuState = function (game) {};

CftbChallenge.menuState.prototype = {

	create: function() {
        var cftbText = this.add.bitmapText(this.world.centerX, 20, 'fat-and-tiny', 'CROSSFIT THUNDERBOLT', 64);
        cftbText.anchor.x = 0.5;

        var challengeText = this.add.bitmapText(this.world.centerX, 75, 'fat-and-tiny', 'Challenge!', 64);
        challengeText.anchor.x = 0.5;

        var startText = this.add.bitmapText(this.world.centerX, 230, 'fat-and-tiny', 'Click to Play', 64);
        startText.anchor.x = 0.5;

		this.input.onDown.addOnce(this.start, this);
	},

    start: function () {

        this.state.start('intro');

    }

};

CftbChallenge.introState = function (game) {
	this.mollySprite;
};

CftbChallenge.introState.prototype = {


	preload: function() {
		 this.load.spritesheet('mollytalking', 'MollyFace2.png', 128, 128);
		 this.load.spritesheet('playersquating', 'Squat.png', 164, 164);

	},

	create: function() {
		// draw a rectangle
		var graphics = helper.drawRectangle();
		this.mollySprite = helper.createMollySprite();

		helper.writeTextWithPromise(null, "Welcome to CrossFit Thunderbolt! I'm coach Molly! Are you ready for the CFTB Challenge? [Click]", this.mollySprite).bind(this)
		  .then(function(prevResults){
			        this.state.start('level1Training');
			  	});
	},
};

var helper = {
	drawRectangle: function() {
		var graphics = game.add.graphics(10, 10);
	    graphics.lineStyle(6, 0x0000FF, 1);
	    graphics.drawRect(10, 20, 600, 175);
	    return graphics;

	},

	createMollySprite: function() {
		var mollySprite = game.add.sprite(50, 50, 'mollytalking');
	    mollySprite.animations.add('talk',[0,1,2,3,4,5,6], 5, true);
	    mollySprite.animations.play('talk');
	    return mollySprite;
	},

	createPlayerSquatSprite: function(x, y) {
		var squatSprite = game.add.sprite(x, y, 'playersquating');
	    squatSprite.animations.add('squat',[0,1], 5, false);
        squatSprite.animations.frame = 1;
        squatSprite.inputEnabled = true;
	    return squatSprite;
	},


	writeTextWithPromise: function(prevTypewriter, textToWrite, mollySprite) {
		return new Promise(function(fulfill, reject) {
			if(prevTypewriter) {
				prevTypewriter.destroy();
			}
		    mollySprite.animations.play('talk');

		    var typewriter = new Typewriter();
		    typewriter.init(game, {
			    x: 190,
			    y: 40,
			    time: 80,
			    fontFamily: "fat-and-tiny",
			    fontSize: 36,
			    maxWidth: 400,
			    endFn: function() {
			        mollySprite.animations.stop();
			        mollySprite.animations.frame = game.rnd.integerInRange(0, 6);
					game.input.onDown.addOnce(clicked, this);
					function clicked() {
					    fulfill(typewriter);
					}
			    },
			    text: textToWrite 
			  });
			  typewriter.start();
		});
	},

	createCursors: function() {
		 var cursors = game.input.keyboard.createCursorKeys();
		 return cursors;
	},

};

CftbChallenge.level1TrainingState = function (game) {};

CftbChallenge.level1TrainingState.prototype = {


	preload: function() {
		 this.load.spritesheet('mollytalking', 'mollyface2.png', 128, 128);
		 this.load.spritesheet('playersquating', 'squat.png', 164, 164);
	},

	create: function() {
		var graphics = helper.drawRectangle();
		this.mollySprite = helper.createMollySprite();
		this.playerSquating = helper.createPlayerSquatSprite(250, 250);
	 	helper.writeTextWithPromise(null, "Let's learn air squats [Click] to try one!", this.mollySprite).bind(this)
	 		.then(function(prevResults){
			    this.playerSquating.animations.play('squat');
			 	helper.writeTextWithPromise(prevResults, "Great job! Be sure to squat below parallel each time! [click]", this.mollySprite).bind(this)
			    .then(function(prevResults){
				        this.state.start('level1');
				  	});
	 		});

	 	_cursors = helper.createCursors();



	},


};

CftbChallenge.level1State = function (game) {
	this.mollySprite;
	this.playersquating;
	this.youCanDoItText;
};

CftbChallenge.level1State.prototype = {

	preload: function() {
		 this.load.spritesheet('mollytalking', 'MollyFace2.png', 128, 128);
		 this.load.spritesheet('playersquating', 'Squat.png', 164, 164);
	},

	create: function() {
		var graphics = helper.drawRectangle();
		this.mollySprite = helper.createMollySprite();
		this.playerSquating = helper.createPlayerSquatSprite(75, 250);

		_alreadyRun = false;
	 	helper.writeTextWithPromise(null, "Now that you know air squats let's try them in a workout! [click]", this.mollySprite).bind(this)
		  .then(function(prevResults){
				 	return helper.writeTextWithPromise(prevResults, "Can you beat Andrea in 30 air squats? 3 2 1 GO! [click to start]", this.mollySprite).bind(this)
			  	})
		  .then(function(prevResults){
		  			prevResults.destroy();
					this.playerSquating.events.onInputDown.add(CftbChallenge.level1State.prototype.squat, this);
					this.playerSquating.count = 30;
			        scoreText = game.add.bitmapText(16, 205, 'fat-and-tiny', 'Player Squats: 30', 32);
			        scoreText.smoothed = false;
				 	this.youCanDoItText = helper.writeTextWithPromise(prevResults, "You can do it!", this.mollySprite).bind(this)
			  	});


	},
	squat: function() {
	    this.playerSquating.animations.play('squat');
	    this.playerSquating.count--; 
	    scoreText.text = "Player Squats: " + this.playerSquating.count;
	},

	update: function() {
		if(this.playerSquating.count <= 0 && !_alreadyRun){
			_alreadyRun = true;
			this.playerSquating.events.onInputDown.removeAll();
		 	helper.writeTextWithPromise(_youCanDoItText._result, "You won!", this.mollySprite).bind(this)
		}
	}

};

var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'gameDiv');
game.state.add('loader', CftbChallenge.loaderState);
game.state.add('menu', CftbChallenge.menuState);
game.state.add('intro', CftbChallenge.introState);
game.state.add('level1Training', CftbChallenge.level1TrainingState);
game.state.add('level1', CftbChallenge.level1State);
game.state.start('loader');
