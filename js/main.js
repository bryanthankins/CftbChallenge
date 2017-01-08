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
      this.load.audio('notmyship', 'not_my_ship.mp3');
	},

	create: function() {
		this.stage.backgroundColor = 0x100438;
		//this.stage.backgroundColor = 0xffffff;
        this.state.start('menu');
	},


};

CftbChallenge.choosePlayerState = function (game) {
};

CftbChallenge.choosePlayerState.prototype = {

	init: function() {
	},

	preload: function() {
		this.load.image('player1','PLAYER1.png');
		this.load.image('player2','PLAYER2.png');
		this.load.image('player3','PLAYER3.png');
	},

	create: function() {
        var chooseText = this.add.bitmapText(this.world.centerX, 75, 'fat-and-tiny', 'Choose a Player!', 64);
        chooseText.anchor.x = 0.5;

        var playerFace1 = this.add.sprite(this.world.centerX - 210, this.world.centerY - 20, 'player1');
        playerFace1.anchor.x = 0.5;
        playerFace1.inputEnabled = true;
        playerFace1.events.onInputDown.add(this.pickPlayer1, this);
        var playerFace2 = this.add.sprite(this.world.centerX, this.world.centerY - 20, 'player2');
        playerFace2.anchor.x = 0.5;
        playerFace2.inputEnabled = true;
        playerFace2.events.onInputDown.add(this.pickPlayer2, this);
        var playerFace3 = this.add.sprite(this.world.centerX + 190, this.world.centerY - 20, 'player3');
        playerFace3.anchor.x = 0.5;
        playerFace3.inputEnabled = true;
        playerFace3.events.onInputDown.add(this.pickPlayer3, this);
	},
	pickPlayer1: function() {
		this.state.start('level1',true, false, 'PLAYER1');

	},
	pickPlayer2: function() {
		this.state.start('level1',true, false, 'PLAYER2');

	},
	pickPlayer3: function() {
		this.state.start('level1',true, false, 'PLAYER3');

	},


};



CftbChallenge.menuState = function (game) {
	this.music;
};

CftbChallenge.menuState.prototype = {


	preload: function(){
		this.load.image('cftbLogo','CFTBPixelLogo.png');
	},


	create: function() {


        var cftbText = this.add.bitmapText(this.world.centerX, 20, 'fat-and-tiny', 'CROSSFIT THUNDERBOLT', 64);
        cftbText.anchor.x = 0.5;

        var challengeText = this.add.bitmapText(this.world.centerX, 75, 'fat-and-tiny', 'Challenge!', 64);
        challengeText.anchor.x = 0.5;

        var startText = this.add.bitmapText(this.world.centerX, 230, 'fat-and-tiny', 'Play', 64);
        startText.anchor.x = 0.5;
    	this.add.tween(startText).to({y: 285},1000).easing(Phaser.Easing.Bounce.Out).start();
		this.add.tween(startText).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();

        var tutText = this.add.bitmapText(this.world.centerX, 230 + 50, 'fat-and-tiny', 'Tutorial', 64);
        tutText.anchor.x = 0.5;
    	this.add.tween(tutText).to({y: 340},1000).easing(Phaser.Easing.Bounce.Out).start();
		this.add.tween(tutText).to({angle: 2}, 500).to({angle: -2}, 1000).to({angle: 0}, 500).loop().start();

		var cftbLogo = game.add.sprite(300, 220, 'cftbLogo');
		cftbLogo.anchor.setTo(0.5);
		cftbLogo.smoothed = false;
		cftbLogo.scale.setTo(1.5, 1.5);


		if (!localStorage.getItem('bestLift')) {
		    localStorage.setItem('bestLift', 0);
		}

        var bestText = this.add.bitmapText(this.world.centerX, 400, 'fat-and-tiny', 'Best Lift: ' + localStorage.getItem('bestLift')  + ' lbs', 64);
        bestText.anchor.x = 0.5;


		startText.inputEnabled = true;
		startText.events.onInputDown.add(this.startGame, this);
		startText.events.onInputOver.add(function(){
			this.game.canvas.style.cursor = "pointer";
		}, this);
		startText.events.onInputOut.add(function(){
			this.game.canvas.style.cursor = "default";
		}, this);

		tutText.inputEnabled = true;
		tutText.events.onInputDown.add(this.startTut, this);
		if(!this.music || !this.music.isPlaying) {
	        this.music = this.add.audio('notmyship');
	        this.music.play(); 
	    }
	},

    startGame: function () { 
        this.state.start('choosePlayer');

    },
    startTut: function () { 
        this.state.start('intro');

    }

};

CftbChallenge.introState = function (game) {
	this.mollySprite;
	this.mollyText;
	this.talkingAudio;
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
		//this.talkingAudio = this.add.audio('talking1');

		helper.writeMollyText("Welcome to CrossFit Thunderbolt! I'm coach Molly! Are you ready for the CFTB Challenge? [Click]",this).bind(this)
		  .then(function(prevResults){
			        this.state.start('level1Training');
			  	});
	},
};

var helper = {
	drawRectangle: function() {
		var graphics = game.add.graphics(10, 10);
	    graphics.lineStyle(6, 0xffffff, 1);
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
			    time: 60,
			    fontFamily: "fat-and-tiny",
			    //sound: gameState.talkingAudio,
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
	this.alreadySaidMessage = false;
	this.timer;
	this.timerEvent;
	this.WODTimer;
	this.gameMusic;
	this.powerRect;
	this.playerPic;

};

CftbChallenge.level1State.prototype = {

	init: function(params) {
		this.playerPic = params;
		this.currentWeight = 95;
		this.powerBarSpeed = 1000;
	},

	preload: function() {
		 this.load.spritesheet('mollytalking', 'MollyFace2.png', 128, 128);
		 this.load.spritesheet('playersquating', 'Squat.png', 164, 164);
		 this.load.image('playerPic', this.playerPic + '.png');

	},

	tryLift: function() {
		this.movingLine.stop();
	 	this.timer.stop();
		if(this.powerLine.y > 135 && this.powerLine.y < 185) {
		    this.playerSquating.animations.play('squat');
		 	this.youCanDoItText = helper.writeMollyText("You did it!", this).bind(this)
		 		.then(function(){
		 			if(this.currentWeight > localStorage.getItem('bestLift')) {
					 	localStorage.setItem('bestLift', this.currentWeight);
					 }
				 	this.nextLevel();
		 		});
		}
		else {
		 	this.youCanDoItText = helper.writeMollyText("Try again tomorrow!", this).bind(this);
		 	  game.time.events.add(Phaser.Timer.SECOND * 3, this.gameOver, this);
		}

		console.log(this.powerLine.y);


	},


	//TODO: have character say random phrase - GetRandomPhrase()
	drawPowerBar: function() {
					this.centerRect = this.add.graphics(100, 100);
				    this.centerRect.lineStyle(0);
				    this.centerRect.beginFill(0xCD404A, 1);
				    this.centerRect.drawRect(420,210,100,50);
				    this.centerRect.endFill();

					this.powerRect = this.add.graphics(100, 100);
				    this.powerRect.lineStyle(5, 0xFFFFFF, 1);
				    this.powerRect.drawRect(420,150,100,175);
				    this.input.onDown.addOnce(this.tryLift, this)

				    this.powerLine = this.add.graphics(100,100); 
				    this.powerLine.lineStyle(2, 0xFFFFFF);
				    this.powerLine.moveTo(420,175);
				    this.powerLine.lineTo(520, 175);

					this.movingLine = this.add.tween(this.powerLine).to({y: 250}, this.powerBarSpeed).to({y: 80}, this.powerBarSpeed).loop().start();



	},

	nextLevel: function() {
		this.currentWeight += 20;
		this.powerBarSpeed -= 200;
		if (this.powerBarSpeed <=50) {
			this.powerBarSpeed = 50;
		}
	 	helper.writeMollyText("Lets try " + this.currentWeight + " pounds [click to start]", this).bind(this)
	 	  .then(function(){
	        this.scoreText.text = 'Attempt: ' + this.currentWeight;
	        this.bestText.text  = 'PR: ' + localStorage.getItem('bestLift');

	        this.drawPowerBar();


	        this.timer.destroy();
	        this.timer = this.time.create();
	        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 15, this.endTimer, this);
	        this.timer.start();
	 	  });


	},

	create: function() {
		var graphics = helper.drawRectangle();
		this.mollySprite = helper.createMollySprite();
		this.playerSquating = helper.createPlayerSquatSprite(304,340);
		this.playerSprite = this.add.image(4, 410, 'playerPic');
		this.playerSprite.scale.setTo(0.5,0.5);
        this.playerName = game.add.bitmapText(74, 430, 'fat-and-tiny', this.playerPic, 44);
        this.timer = this.time.create();

	 	helper.writeMollyText("Welcome to CrossFit Thunderbolt! I'm coach Molly [click to continue]",this).bind(this)
		  .then(function(prevResults){
				 	return helper.writeMollyText("Do you think you can lift " + this.currentWeight + " pounds?", this).bind(this)
			  	})
		  .then(function(prevResults){
				 	return helper.writeMollyText("I want to see perfect form 3 2 1 GO! [click to start]", this).bind(this)
			  	})
		  .then(function(prevResults){

		  			prevResults.destroy();

		  			this.drawPowerBar();


			        this.scoreText = game.add.bitmapText(16, 205, 'fat-and-tiny', 'Attempt: ' + this.currentWeight, 32);
			        this.bestText = game.add.bitmapText(16, 235, 'fat-and-tiny', 'PR: ' + localStorage.getItem('bestLift'), 32);
			        this.WODTimer = game.add.bitmapText(420, 205, 'fat-and-tiny', 'Lift Timer: 0', 32);
				 	this.youCanDoItText = helper.writeMollyText("Let me turn up the music! You can do it!", this).bind(this);

			        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 15, this.endTimer, this);
			        this.timer.start();
			  	});


	},

    render: function () {
        if (this.timer.running) {
            this.WODTimer.text = "Lift Timer: " + this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
            var timerInSeconds = Math.round((this.timerEvent.delay - this.timer.ms) / 1000);
            if(timerInSeconds == 15 && !this.alreadySaidMessage) {
            	this.alreadySaidMessage = true;
            	helper.writeMollyText("15 seconds left!", this);
            }

        }
    },
    endTimer: function() {
        this.timer.stop();
        if(this.playerSquating.count > 0){
		 	this.youCanDoItText = helper.writeMollyText("Try again tomorrow!", this).bind(this);
		 	  game.time.events.add(Phaser.Timer.SECOND * 3, this.gameOver, this)

        }
    },
    gameOver: function() {
        this.state.start('menu');
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
game.state.add('choosePlayer', CftbChallenge.choosePlayerState);
game.state.start('loader');
