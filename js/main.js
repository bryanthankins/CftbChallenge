/*
TODO
----
-Art for players - draw still of coaches, Art for lift - snatch
-Art - Sad face for molly?
*/


var CftbChallenge = {};

CftbChallenge.bootState = function (game) {};

CftbChallenge.bootState.prototype = {

	init: function() {
        this.input.maxPointers = 1;
        this.scale.pageAlignHorizontally = true;
	},

	preload: function() {
	  this.load.path = 'assets/';

	  this.load.image('cftbLogo','CFTBPixelLogo.png');
	},

	create: function() {

		this.stage.backgroundColor = 0x100438;

		if (!game.device.desktop) {
			game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		    game.scale.setMinMax(game.width/2, game.height/2, game.width*2, game.height*2);
			game.scale.pageAlignHorizontally = true; 
			game.scale.pageAlignVertically = true;
		    document.body.style.backgroundColor = '#100438';
		}
        this.state.start('loader');
	},


};

CftbChallenge.loaderState = function (game) {};

CftbChallenge.loaderState.prototype = {


	preload: function() {

		this.cftbLogo = game.add.sprite(300, 220, 'cftbLogo');
		this.cftbLogo.anchor.setTo(0.5);
		this.cftbLogo.smoothed = false;
		this.cftbLogo.scale.setTo(1.5, 1.5);
		this.load.setPreloadSprite(this.cftbLogo);

		this.load.bitmapFont('fat-and-tiny');
		this.load.audio('notmyship', 'not_my_ship.mp3');
		this.load.audio('coin', 'coin.mp3');
		this.load.audio('dead', 'dead.mp3');
		this.load.audio('jump', 'jump.mp3');
		this.load.image('pixel', 'pixel.png');
	},

	create: function() {

        this.state.start('menu');
	},


};

CftbChallenge.menuState = function (game) {
	this.music;
};

CftbChallenge.menuState.prototype = {


	preload: function(){
	},


	create: function() {
		this.coinSound = game.add.audio('coin'); 


        var cftbText = this.add.bitmapText(this.world.centerX, 20, 'fat-and-tiny', 'CROSSFIT THUNDERBOLT', 64);
        cftbText.anchor.x = 0.5;

        var challengeText = this.add.bitmapText(this.world.centerX, 75, 'fat-and-tiny', 'Challenge!', 64);
        challengeText.anchor.x = 0.5;

        var startText = this.add.bitmapText(this.world.centerX, 230, 'fat-and-tiny', 'Play', 64);
        startText.anchor.x = 0.5;
    	this.add.tween(startText).to({y: 310},1000).easing(Phaser.Easing.Bounce.Out).start();
		this.add.tween(startText).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();


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
		this.input.onDown.addOnce(this.startGame, this);

		if(!this.music || !this.music.isPlaying) {
	        this.music = this.add.audio('notmyship');
	        this.music.play(); 
	    }
	},

    startGame: function () { 
    	this.coinSound.play();
        this.state.start('choosePlayer');

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
		this.coinSound = game.add.audio('coin'); 

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
    	this.coinSound.play();
		this.state.start('level1',true, false, 'PLAYER1');

	},
	pickPlayer2: function() {
    	this.coinSound.play();
		this.state.start('level1',true, false, 'PLAYER2');

	},
	pickPlayer3: function() {
    	this.coinSound.play();
		this.state.start('level1',true, false, 'PLAYER3');

	},


};




var helper = {
	getDuringLiftPhrase() {
		var duringLiftPhrase = [
	    "Stay tight!",
	    "Squeeze your glutes!",
	    "Deep breath!",
	    "Lift that shit up!",
	    "I will crank the music!",
	    "Light weight!",
	    "Do not put that bar down!"
		];

		var randomNum = game.rnd.integerInRange(0,6);
		return duringLiftPhrase[randomNum];
	},

	getFailureLiftPhrase() {
		var failureLiftPhrase = [
	    "Try again tomorrow!",
	    "Better get some rest!",
	    "Have you been eating poorly?",
	    "That lift made me sad",
	    "Did you drink too much last night?",
	    "At least you tried!",
	    "You were so close!"
		];

		var randomNum = game.rnd.integerInRange(0,6);
		return failureLiftPhrase[randomNum];
	},

	getNewLiftPhrase() {
		var newLiftPhrase = [
	    "How do you feel about ",
	    "You are ready for ",
	    "Stay tight for ",
	    "I think you can do ",
	    "Time for the big boy weight of ",
	    "I believe you can lift ",
	    "Lets try for "
		];

		var randomNum = game.rnd.integerInRange(0,6);
		return newLiftPhrase[randomNum];
	},
	getPostivePhrase() {
		var positivePhrase = [
	    "You did it!",
	    "Best lift ever! ",
	    "Oh Yeah!",
	    "Rock on!",
	    "Woah! Nice!",
	    "I knew you could!",
	    "Beast Mode!"
		];

		var randomNum = game.rnd.integerInRange(0,6);
		return positivePhrase[randomNum];

	},

    formatTime: function(s) {
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    },
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
			    time: 50,
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

			  /* -- click to continue text
			  gameState.input.onDown.addOnce(endText, this);
			  function endText() {
			        gameState.mollySprite.animations.stop();
			        gameState.mollySprite.animations.frame = game.rnd.integerInRange(0, 6);
			        gameState.mollyText.destroy();
			        gameState.mollyText = gameState.add.bitmapText(190, 40, 'fat-and-tiny', textToWrite, 36);
					gameState.input.onDown.addOnce(clicked, this);
					function clicked() {
					    fulfill(gameState.mollyText);
					}
			  }
			  */
		});
	},

	createCursors: function() {
		 var cursors = game.input.keyboard.createCursorKeys();
		 return cursors;
	},

};

CftbChallenge.level1State = function (game) {};

CftbChallenge.level1State.prototype = {

	init: function(params) {
		this.playerPic = params;
		this.currentWeight = 95;
		this.powerBarSpeed = 1000;
		this.alreadyRun = false;
		this.alreadySaidMessage = false;
	},

	preload: function() {
		 this.load.spritesheet('mollytalking', 'MollyFace2.png', 128, 128);
		 this.load.spritesheet('playersquating', 'Squat.png', 164, 164);
		 this.load.image('playerPic', this.playerPic + '.png');

	},

	tryLift: function() {
		this.jumpSound.play();
		this.movingLine.stop();
	 	this.timer.stop();
		if(this.powerLine.y > 135 && this.powerLine.y < 185) {
			this.camera.flash(0xffffff, 300);
			this.cftbLogo.alpha = 1;
	    	this.add.tween(this.cftbLogo.scale).to({x: 8.3, y: 8.3}, 500).start();
	    	this.add.tween(this.cftbLogo).to( { alpha: 0 }, 1000).start();// Phaser.Easing.Linear.None, true, 0, 1000, true);
		    this.playerSquating.animations.play('squat');
		 	this.youCanDoItText = helper.writeMollyText(helper.getPostivePhrase(), this).bind(this)
		 		.then(function(){
		 			if(this.currentWeight > localStorage.getItem('bestLift')) {
					 	localStorage.setItem('bestLift', this.currentWeight);
					 }
				 	this.nextLevel();
		 		});
		}
		else {

			this.emitter.x = this.playerSquating.x;
			this.emitter.y = this.playerSquating.y;
			this.emitter.start(true, 800, null, 15);


			this.deadSound.play();
			this.playerSquating.destroy();
			this.camera.shake(0.02, 300);
		 	this.youCanDoItText = helper.writeMollyText(helper.getFailureLiftPhrase(), this).bind(this)
		 		.then(function(){
		 			this.gameOver();

		 		});
		}

	},


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
		this.cftbLogo.scale.setTo(0.3, 0.3);
		this.currentWeight += 20;
		if (this.powerBarSpeed <= 200) {
		 	helper.writeMollyText("You won the Thunderbolt Challenge!!!", this).bind(this)
		 	  .then(function(){
			 	  this.gameOver();
		 	  });
		}
		else {
			if (this.powerBarSpeed <=600) {
				this.powerBarSpeed -= 50;
			}
			else {
				this.powerBarSpeed -= 200;
			}
		 	helper.writeMollyText(helper.getNewLiftPhrase() + this.currentWeight + " pounds!", this).bind(this)
		 	  .then(function(){
		        this.scoreText.text = 'Attempt: ' + this.currentWeight;
		        this.bestText.text  = 'PR: ' + localStorage.getItem('bestLift');

		        this.drawPowerBar();

	        	this.youCanDoItText = helper.writeMollyText(helper.getDuringLiftPhrase(), this).bind(this);

		        this.timer.destroy();
		        this.timer = this.time.create();
		        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 15, this.endTimer, this);
		        this.timer.start();
		        console.log(this.powerBarSpeed);
		 	  });
	 	}


	},

	create: function() {

		this.emitter = game.add.emitter(0, 0, 35);
		this.emitter.makeParticles('pixel');
		this.emitter.setXSpeed(-250, 250);
		this.emitter.setYSpeed(-250, 250);
		this.emitter.gravity = 0;


		this.cftbLogo = game.add.sprite(300, 220, 'cftbLogo');
		this.cftbLogo.anchor.setTo(0.5);
		this.cftbLogo.smoothed = false;
		this.cftbLogo.scale.setTo(0.3, 0.3);
		this.cftbLogo.alpha = 0;

		this.jumpSound = game.add.audio('jump'); 
		this.coinSound = game.add.audio('coin'); 
		this.deadSound = game.add.audio('dead');
		
		var graphics = helper.drawRectangle();
		this.mollySprite = helper.createMollySprite();
		this.playerSquating = helper.createPlayerSquatSprite(304,340);

		this.playerSprite = this.add.image(4, 410, 'playerPic');
		this.playerSprite.scale.setTo(0.5,0.5);
    	this.add.tween(this.playerSquating.scale).to({x: 1.3, y: 1.3}, 500).yoyo(true).start();
        this.playerName = game.add.bitmapText(74, 430, 'fat-and-tiny', this.playerPic, 44);
        this.timer = this.time.create();

	 	helper.writeMollyText("Welcome to CrossFit Thunderbolt! I'm coach Molly!",this).bind(this)
		  .then(function(prevResults){
				 	return helper.writeMollyText("The Thunderbolt Challenge will start with a " + this.currentWeight + " pound snatch and go up!", this).bind(this)
			  	})
		  .then(function(prevResults){
				 	return helper.writeMollyText("There will be a power bar on the right - click when it is red! Got it?", this).bind(this)
			  	})
		  .then(function(prevResults){
				 	return helper.writeMollyText("Great! You will have 15 seconds! I want to see perfect form - 3 2 1 GO!", this).bind(this)
			  	})
		  .then(function(prevResults){

		  			prevResults.destroy();
		  			this.drawPowerBar();

			        this.scoreText = game.add.bitmapText(16, 205, 'fat-and-tiny', 'Attempt: ' + this.currentWeight, 32);
			        this.bestText = game.add.bitmapText(16, 235, 'fat-and-tiny', 'PR: ' + localStorage.getItem('bestLift'), 32);
			        this.WODTimer = game.add.bitmapText(420, 205, 'fat-and-tiny', 'Lift Timer: 0', 32);
	            	this.youCanDoItText = helper.writeMollyText(helper.getDuringLiftPhrase(), this).bind(this);
			        this.timerEvent = this.timer.add(Phaser.Timer.SECOND * 15, this.endTimer, this);
			        this.timer.start();
			  	});
	},

    render: function () {
        if (this.timer.running) {
            this.WODTimer.text = "Lift Timer: " + helper.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
            var timerInSeconds = Math.round((this.timerEvent.delay - this.timer.ms) / 1000);
            if(timerInSeconds == 5 && !this.alreadySaidMessage) {
            	this.alreadySaidMessage = true;
            	helper.writeMollyText("5 seconds left!", this);
            }

        }
    },
    endTimer: function() {
        this.timer.stop();
        if(this.playerSquating.count > 0){
		 	this.youCanDoItText = helper.writeMollyText(helper.getFailureLiftPhrase(), this).bind(this);
		 	  game.time.events.add(Phaser.Timer.SECOND * 3, this.gameOver, this)

        }
    },
    gameOver: function() {
        this.state.start('menu');
    },


};

var game = new Phaser.Game(640, 480, Phaser.CANVAS, '');
game.state.add('boot', CftbChallenge.bootState);
game.state.add('loader', CftbChallenge.loaderState);
game.state.add('menu', CftbChallenge.menuState);
game.state.add('level1', CftbChallenge.level1State);
game.state.add('choosePlayer', CftbChallenge.choosePlayerState);
game.state.start('boot');
