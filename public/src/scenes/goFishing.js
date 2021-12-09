var input;
var control = false;
var worldBounds;
// var fish;
// var coin;
var coin_value = 0;
// var bomb;
var target = new Phaser.Math.Vector2();
var pos_stop = 0;
class goFishing extends Phaser.Scene {
    constructor() {
        super("goFishing");
        this.container;
        this.center = { x: 400, y: 300 }
        this.rotateSpeed = 0.02
    }
    init(data) {
        this.name = data.name;
        this.socket = data.socket;
    }
    preload() {
        this.load.image("background_pregame", "assets/goFishingAssets/background_pregame.png");
        this.load.image("backgroundFishing", "assets/goFishingAssets/background_sea.jpg");
        this.load.image("ship", "assets/goFishingAssets/ship.png");
        this.load.image("fish_1", "assets/goFishingAssets/fish_1.png");
        this.load.image("fish_2", "assets/goFishingAssets/fish_2.png");
        this.load.image("fish_3", "assets/goFishingAssets/fish_3.png");
        this.load.image("fish_4", "assets/goFishingAssets/fish_4.png");
        this.load.image("cannon", "assets/goFishingAssets/cannon.png");
        this.load.image("back_main_hall_icon", "assets/goFishingAssets/back_main_hall_icon.png");
        this.load.image("net", "assets/goFishingAssets/net.png");
        this.load.image("bomb", "assets/goFishingAssets/bomb.png");
        this.load.image("bomb_bum", "assets/goFishingAssets/bomBum.png");
        this.load.audio("background_sound", "assets/goFishingAssets/background_sound.mp3");
        this.load.audio("catch_sound", "assets/goFishingAssets/catch_sound.mp3");
        this.load.audio("gameover_sound", "assets/goFishingAssets/gameover_sound.mp3");
        this.load.audio("bomb_sound", "assets/goFishingAssets/bomb_sound.mp3");
        this.load.image("replay_icon", "assets/goFishingAssets/replay_icon.png");
        this.load.image("gameover_frame", "assets/goFishingAssets/gameover_frame.png");
        this.load.image("gold_icon", "assets/goFishingAssets/gold_icon.png");
        this.load.spritesheet("bomb_animation", "assets/goFishingAssets/bomb_animation.png", {
            frameWidth: 687 / 4,
            frameHeight: 191,
        });
        this.load.image("time_icon", "assets/goFishingAssets/time_icon.png");
        this.load.image("sound_icon", "assets/goFishingAssets/sound_icon.png");
        this.load.image("outgame_icon", "assets/goFishingAssets/outgame_icon.png");
        this.load.image("mute_icon", "assets/goFishingAssets/mute_icon.png");
    }
    create() {
        this.socket.emit('startFishing', this.socket.id);
        var self = this;
        // create bg sound
        this.background_sound = this.sound.add("background_sound", { loop: true, volume: 0.3 });
        this.catch_sound = this.sound.add("catch_sound", { loop: false, volume: 0.3 });
        this.gameover_sound = this.sound.add("gameover_sound", { loop: false, volume: 0.3 });
        this.bomb_sound = this.sound.add("bomb_sound", { loop: false, volume: 0.3 });
        this.background_sound.play();
        this.isPlayingSound = true;
        this.isBoom = false;
        this.isGameOver = false;
        // create items
        this.background = this.add.image(400, 300, "backgroundFishing");
        this.add.image(100, 40, "time_icon").setScale(0.6);
        this.add.image(650, 40, "gold_icon").setScale(0.5);
        this.sound_icon = this.add.image(720, 40, "sound_icon").setScale(0.25);
        this.mute_icon = this.add.image(720, 40, "mute_icon").setScale(0.2).setVisible(false);
        this.mute_icon.setInteractive();
        this.outgame_icon = this.add.image(770, 40, "outgame_icon").setScale(0.25);
        this.sound_icon.setInteractive();
        this.outgame_icon.setInteractive();

        // create ship
        this.ship = this.physics.add.sprite(400, 100, "ship").setScale(0.8);
        // this.ship.body.velocity.x = 10;
        // create time
        this.isTimeOver = false;
        this.textTime = this.add.text(80, 30, 'Time: 45s', { fontSize: 15, color: '#F6F2D4', fill: "black", stroke: '#fff' }).setVisible(true);
        this.textTime.cssFont = "bold";
        this.timeStart(this.handleTimeFinished.bind(this), 30000);
        // Random fish and bomb
        this.timedEvent_fish = this.time.addEvent({ delay: 800, callback: this.createFish, callbackScope: this, repeat: 1000 });
        this.timedEvent_bomb = this.time.addEvent({ delay: 3500, callback: this.createBomb, callbackScope: this, repeat: 1000 });

        // create cannon
        this.cannon = this.physics.add.sprite(400, 130, 'cannon').setScale(0.21);
        this.bomb;
        // create coin 
        this.coin = this.add.text(645, 31, coin_value, { fontSize: 15, color: '#fff', fill: "black", stroke: '#fff' }).setVisible(true);
        this.socket.on('getPlayerFishing', function(data) {
            coin_value = data.gold;
            self.coin.setText(coin_value);
            // alert("lay duoc r " + data.gold);
        });
        // create net
        this.net = this.physics.add.sprite(400, 130, "net").setScale(0.03).setVisible(false);
        // mouse click event
        this.mouse = this.input.mousePointer;
        // mouse position
        input = this.input;
        //set game bounds
        worldBounds = this.physics.world.bounds;
        this.anims.create({
            key: "boom",
            frames: this.anims.generateFrameNumbers("bomb_animation", { start: 0, end: 4 }),
            frameRate: 10,

        });
        this.sound_icon.on('pointerdown', () => {
            this.background_sound.setVolume(0);
            this.sound_icon.setVisible(false);
            this.mute_icon.setVisible(true);
        });
        this.mute_icon.on('pointerdown', () => {
            this.background_sound.setVolume(0.3);
            this.sound_icon.setVisible(true);
            this.mute_icon.setVisible(false);
        });
        this.outgame_icon.on('pointerdown', () => {
            this.timeEvent.destroy();
            this.timeEvent = undefined;
            this.isTimeOver = true;
            this.isGameOver = true;
            this.background_sound.stop();
            this.handleTimeFinished();
        });
    }
    update() {
        if (this.isGameOver) {
            return;
        }
        //angle between mouse and net   
        let angle = Phaser.Math.Angle.Between(this.cannon.x, this.cannon.y, input.x, input.y);
        //rotation cannon with PI/2
        this.cannon.setRotation(angle + Math.PI / 2);
        //mouse clicked
        if (this.mouse.isDown && control == false) {
            //for fire again
            this.net = this.physics.add.sprite(400, 100, 'net');
            //move to mouse position 
            this.physics.moveTo(this.net, input.x, input.y, 500);
            control = true;
        }

        //check world bounds
        if (this.net.x > worldBounds.width || this.net.y > worldBounds.height || this.net.x < 0 || this.net.y < 0) {
            control = false;
        }

        //for collision

        this.physics.add.collider(this.net, this.fish, this.destroy, null, this);
        this.physics.add.overlap(this.net, this.bomb, this.shootBomb, null, this);

        // time
        if (!this.timeEvent || this.duration <= 0) {
            return

        }
        const elapsed = this.timeEvent.getElapsed();
        const remaining = this.duration - elapsed;
        const minutes = remaining / 1000;
        this.textTime.text = minutes.toFixed(2) + "s";
        if (remaining <= 0) {
            this.scene.start('pregame');
        }
    }
    shootBomb(net, bomb) {
        // bomb.anims.play('boom', true);
        bomb.disableBody(true, true);
        net.disableBody(true, true);
        var boom = this.add.sprite(bomb.x, bomb.y, 'bomb_animation').setScale(1.2);
        boom.anims.play('boom');
        this.animationReduceGold(bomb.x, bomb.y);
        control = false;
        coin_value--;
        this.bomb_sound.play();

        this.cameras.main.shake(100, 0.01, true);
        this.time.delayedCall(600, function() {
            boom.setVisible(false);
        }, [], this);
        if (coin_value < 0) {
            this.coin.text = 0;
            this.timeEvent.destroy();
            this.timeEvent = undefined;
            this.isTimeOver = true;
            this.isGameOver = true;
            coin_value = 0;
            this.background_sound.stop();
            this.handleTimeFinished();
            return;
        }
        this.coin.text = coin_value;
    }
    createFish() {
        var y = Phaser.Math.Between(240, 560);
        var fish_number = Math.floor(Math.random() * 4) + 1;
        if (fish_number == 1 || fish_number == 4) {
            this.fish = this.physics.add.sprite(0, y, "fish_" + fish_number).setScale(0.2);
            this.fish.body.velocity.x = Phaser.Math.Between(150, 400);
        } else {
            this.fish = this.physics.add.sprite(800, y, "fish_" + fish_number).setScale(0.2);
            this.fish.body.velocity.x = Phaser.Math.Between(-400, -150);
        }


    }
    createBomb() {
        this.bomb = this.physics.add.image(300, 670, "bomb").setScale(0.1);
        var x = Phaser.Math.Between(50, 750);
        // bomb = this.physics.add.image(x, 610, "bomb").setScale(0.1);
        this.bomb.x = x;
        this.tweens.add({ targets: this.bomb, y: (Phaser.Math.Between(230, 450)), duration: 1000, ease: 'Back' });
        this.time.delayedCall(1500, function() {

            this.tweens.add({ targets: this.bomb, y: 650, duration: 1000, ease: 'Back' });
        }, [], this);

    }
    render() {
        this.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
        this.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
    }
    timeStart(callback, duration = 60000) {
        this.timeStop();
        this.duration = duration;
        this.finishedCallback = callback;
        this.timeEvent = this.time.addEvent({
            delay: duration,
            callback: () => {
                this.timeStop();
                if (callback) callback();
            }
        })
    }
    timeStop() {
        if (this.timeEvent) {
            this.timeEvent.destroy();
            this.timeEvent = undefined;
            this.isTimeOver = true;
            this.isGameOver = true;
            this.background_sound.stop();
        }
    }
    handleTimeFinished() {
        this.time.delayedCall(950, function() {
            this.gameover_sound.play();
            this.sound_icon.setVisible(false);
            this.mute_icon.setVisible(false);
            this.outgame_icon.setVisible(false);

            this.timedEvent_fish.destroy();
            this.timedEvent_bomb.destroy();
            this.gameover_background = this.add.image(400, 300, "background_pregame").setScale(0.6);
            this.gameover_frame = this.physics.add.image(400, -300, "gameover_frame").setScale(0.7);
            this.back_main_hall_icon = this.physics.add.image(300, -300, "back_main_hall_icon").setScale(0.4);
            this.replay_icon = this.physics.add.image(500, -300, "replay_icon").setScale(0.4);
            this.replay_icon.setInteractive();
            this.back_main_hall_icon.setInteractive();
            this.result = this.add.text(400, -230, coin_value, { font: '50px Maven Pro Bold', color: "#D47ECF" }).setVisible(true);
            this.tweens.add({ targets: this.back_main_hall_icon, y: 410, duration: 1000, ease: 'Back' });
            this.tweens.add({ targets: this.replay_icon, y: 410, duration: 1000, ease: 'Back' });
            this.tweens.add({ targets: this.result, y: 230, duration: 1000, ease: 'Back' });
            this.tweens.add({ targets: this.gameover_frame, y: 200, duration: 1000, ease: 'Back' });
            // replay
            this.replay_icon.on('pointerup', () => {
                this.startNewGame();
            });
            // out game
            this.back_main_hall_icon.on('pointerup', () => {
                this.gameover_sound.stop();
                this.socket.emit('updateGoldFishing', { gold: coin_value });
                this.scene.start('mainHall', { socket: this.socket, name: this.name });
            });
        }, [], this);

    }
    startNewGame() {

            this.isGameOver = false;
            this.gameover_sound.stop();
            this.background_sound.play();
            this.timeStart(this.handleTimeFinished.bind(this), 30000);
            this.sound_icon.setVisible(true);
            this.mute_icon.setVisible(true);
            this.outgame_icon.setVisible(true);
            this.timedEvent_fish = this.time.addEvent({ delay: 800, callback: this.createFish, callbackScope: this, repeat: 1000 });
            this.timedEvent_bomb = this.time.addEvent({ delay: 3500, callback: this.createBomb, callbackScope: this, repeat: 1000 });
            this.background_sound.setVolume(1);
            this.gameover_background.setVisible(false);
            this.gameover_frame.setVisible(false);
            this.back_main_hall_icon.setVisible(false);
            this.replay_icon.setVisible(false);
            this.result.setVisible(false);
            this.coin.setText(coin_value);
            this.mute_icon.setVisible(false);
            this.sound_icon.setVisible(true);
        }
        //collide cannonbal and pirateShip
    destroy(net, pirateship) {
        pirateship.disableBody(true, true);
        net.disableBody(true, true);
        this.animationAddItem(pirateship.x, pirateship.y);
        control = false;
        coin_value++;
        this.coin.text = coin_value;
        this.catch_sound.play();
    }
    animationAddItem(randX, randY) {
        var pointsAdded = this.add.text(randX, randY, "+1 gold", { font: '30px ', fill: "#FF9900", stroke: '#fff', strokeThickness: 10 });
        pointsAdded.setOrigin(0.5, 0.5);
        this.tweens.add({ targets: pointsAdded, alpha: 0, y: randY - 50, duration: 1000, ease: 'Linear' });
    }
    animationReduceGold(randX, randY) {
        var pointsAdded = this.add.text(randX, randY, "-1 gold", { font: '30px ', fill: "#FF0000", stroke: '#fff', strokeThickness: 10 });
        pointsAdded.setOrigin(0.5, 0.5);
        this.tweens.add({ targets: pointsAdded, alpha: 0, y: randY - 50, duration: 1000, ease: 'Linear' });
    }

}