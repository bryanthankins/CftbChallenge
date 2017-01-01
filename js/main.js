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
        this.state.start('intro');
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
	this.mollyText;
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

		helper.writeMollyText("Welcome to CrossFit Thunderbolt! I'm coach Molly! Are you ready for the CFTB Challenge? [Click]",this).bind(this)
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
		squatSprite.anchor.setTo(0.5);
	    squatSprite.animations.add('squat',[0,1], 5, false);
        squatSprite.animations.frame = 1;
        squatSprite.inputEnabled = true;
	    return squatSprite;
	},

	writeMollyText: function(textToWrite, gameState) {
		return new Promise(function(fulfill, reject) {
			if(gameState.mollyText) {
				gameState.mollyText.destroy();
			}
		    gameState.mollySprite.animations.play('talk');

		    gameState.mollyText = new Typewriter();
		    gameState.mollyText.init(game, {
			    x: 190,
			    y: 40,
			    time: 80,
			    fontFamily: "fat-and-tiny",
			    fontSize: 36,
			    maxWidth: 400,
			    endFn: function() {
			        gameState.mollySprite.animations.stop();
			        gameState.mollySprite.animations.frame = game.rnd.integerInRange(0, 6);
					gameState.input.onDown.addOnce(clicked, this);
					function clicked() {
					    fulfill(gameState.mollyText);
					}
			    },
			    text: textToWrite 
			  });
			  gameState.mollyText.start();
		});
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
		this.playerSquating = helper.createPlayerSquatSprite(304,340);
	 	helper.writeMollyText("Let's learn air squats [Click] to try one!", this).bind(this)
	 		.then(function(prevResults){
			    this.playerSquating.animations.play('squat');
			 	helper.writeMollyText("Great job! Be sure to squat below parallel each time! [click]", this).bind(this)
			    .then(function(prevResults){
				        this.state.start('level1');
				  	});
	 		});
	},


};

CftbChallenge.level1State = function (game) {
	this.mollySprite;
	this.playersquating;
	this.youCanDoItText;
	this.alreadyRun = false;
	this.timer;
	this.timerEvent;
	this.WODTimer;

};

CftbChallenge.level1State.prototype = {

	preload: function() {
		 this.load.spritesheet('mollytalking', 'MollyFace2.png', 128, 128);
		 this.load.spritesheet('playersquating', 'Squat.png', 164, 164);
	},

	create: function() {
		var graphics = helper.drawRectangle();
		this.mollySprite = helper.createMollySprite();
		this.playerSquating = helper.createPlayerSquatSprite(304,340);
        this.timer = this.time.create();

	 	helper.writeMollyText("Now that you know air squats let's try them in a workout! [click]", this).bind(this)
		  .then(function(prevResults){
				 	return helper.writeMollyText("Can you do 30 air squats in 30 seconds? 3 2 1 GO! [click to start]", this).bind(this)
			  	})
		  .then(function(prevResults){
		  			prevResults.destroy();
					this.playerSquating.events.onInputDown.add(CftbChallenge.level1State.prototype.squat, this);
					this.playerSquating.count = 30;
			        this.scoreText = game.add.bitmapText(16, 205, 'fat-and-tiny', 'Player Squats: 30', 32);
			        this.WODTimer = game.add.bitmapText(420, 205, 'fat-and-tiny', 'WOD Timer: 30', 32);
			        this.scoreText.smoothed = false;
				 	this.youCanDoItText = helper.writeMollyText("You can do it!", this).bind(this);

			        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 30, this.endTimer, this);
			        this.timer.start();
			  	});


	},
	squat: function() {
	    this.playerSquating.animations.play('squat');
	    this.playerSquating.count--; 
	    this.scoreText.text = "Player Squats: " + this.playerSquating.count;
	},

	update: function() {
		if(this.playerSquating.count <= 0 && !this.alreadyRun){
			this.alreadyRun = true;
			this.playerSquating.events.onInputDown.removeAll();
		 	this.youCanDoItText = helper.writeMollyText("You won!", this).bind(this)
		 	this.timer.stop();
		}
	},
    render: function () {
        if (this.timer.running) {
            this.WODTimer.text = "WOD Timer: " + this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
            var timerInSeconds = Math.round((this.timerEvent.delay - this.timer.ms) / 1000);
            if(timerInSeconds == 15) {
            	helper.writeMollyText("15 seconds left!", this);
            }

        }
    },
    endTimer: function() {
        this.timer.stop();
        if(this.playerSquating.count > 0){
		 	this.youCanDoItText = helper.writeMollyText("You lost!", this).bind(this);

        }
    },
    formatTime: function(s) {
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    }

};

var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'gameDiv');
game.state.add('loader', CftbChallenge.loaderState);
game.state.add('menu', CftbChallenge.menuState);
game.state.add('intro', CftbChallenge.introState);
game.state.add('level1Training', CftbChallenge.level1TrainingState);
game.state.add('level1', CftbChallenge.level1State);
game.state.start('loader');
