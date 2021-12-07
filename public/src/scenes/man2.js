var cannon;
var net;
var pirateship;
var mouse;
var input;
var control = false;
var worldBounds;
var fish;
var coin;
var coin_value = 0;
var bomb;
var target = new Phaser.Math.Vector2();
var pos_stop = 0;
class man2 extends Phaser.Scene {
    constructor() {
        super("man2");
        this.container;
        this.center = { x: 400, y: 300 }
        this.rotateSpeed = 0.02
    }

    preload() {
        this.load.image("background", "assets/background_sea.jpg");
        this.load.image("ship", "assets/ship.png");
        this.load.image("fish_1", "assets/fish_1.png");
        this.load.image("fish_2", "assets/fish_2.png");
        this.load.image("fish_3", "assets/fish_3.png");
        this.load.image("fish_4", "assets/fish_4.png");
        this.load.image("cannon", "assets/cannon.png");
        this.load.image("net", "assets/net.png");
        this.load.image("bomb", "assets/bomb.png");
        this.load.image("bomb_bum", "assets/bomBum.png");
        this.load.spritesheet("bomb_animation", "assets/bomb_animation.png", {
            frameWidth: 687 / 4,
            frameHeight: 191 / 4,
        });
    }
    create() {
        this.add.image(400, 300, "background");

        // create ship
        this.ship = this.physics.add.sprite(400, 100, "ship").setScale(0.8);
        // this.ship.body.velocity.x = 10;
        // create time
        this.isTimeOver = false;
        this.textTime = this.add.text(80, 550, 'Time: 45s', { fontSize: 25, color: '#fff' }).setVisible(true);
        this.timeStart(this.handleTimeFinished.bind(this), 60000 / 20);
        // Random fish and bomb
        this.timedEvent_fish = this.time.addEvent({ delay: 800, callback: this.createFish, callbackScope: this, repeat: 1000 });
        this.timedEvent_bomb = this.time.addEvent({ delay: 3500, callback: this.createBomb, callbackScope: this, repeat: 1000 });

        // create cannon
        cannon = this.physics.add.sprite(400, 130, 'cannon').setScale(0.21);
        // create coin 
        coin = this.add.text(270, 550, ('Coin: ' + coin_value), { fontSize: 25, color: '#fff' }).setVisible(true);
        // create net
        net = this.physics.add.sprite(400, 130, "net").setScale(0.03).setVisible(false);
        // mouse click event
        mouse = this.input.mousePointer;
        // mouse position
        input = this.input;
        //set game bounds
        worldBounds = this.physics.world.bounds;
        this.anims.create({
            key: "boom",
            frames: this.anims.generateFrameNumbers("bomb_animation", { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1,
        });
    }
    update() {
        //angle between mouse and ball
        let angle = Phaser.Math.Angle.Between(cannon.x, cannon.y, input.x, input.y);
        //rotation cannon with PI/2
        cannon.setRotation(angle + Math.PI / 2);
        //mouse clicked
        if (mouse.isDown && control == false) {
            //for fire again
            net = this.physics.add.sprite(400, 100, 'net');
            //move to mouse position 
            this.physics.moveTo(net, input.x, input.y, 500);
            control = true;
        }

        //check world bounds
        if (net.x > worldBounds.width || net.y > worldBounds.height || net.x < 0 || net.y < 0) {
            control = false;
        }

        //for collision

        this.physics.add.collider(net, fish, this.destroy, null, this);
        this.physics.add.overlap(net, bomb, this.shootBomb, null, this);

        // time
        if (!this.timeEvent || this.duration <= 0) {
            return

        }
        const elapsed = this.timeEvent.getElapsed();
        const remaining = this.duration - elapsed;
        const minutes = remaining / 60000;
        this.textTime.text = "Time: " + minutes.toFixed(2) + "m";
        if (remaining <= 0) {
            this.scene.start('pregame');
        }
    }
    shootBomb(net, bomb) {
        bomb.anims.play('boom', true);
        bomb.disableBody(true, true);
        net.disableBody(true, true);
        control = false;
        coin_value--;
        if (coin_value < 0) {
            this.scene.start('pregame');
        }
        coin.text = "Coin: " + coin_value;

    }
    stopBomb() {
        if (bomb.y <= 300) {
            console.log(1);
        }
    }
    createFish() {

        //     this.button_sound.play();

        var y = Phaser.Math.Between(240, 560);
        var fish_number = Math.floor(Math.random() * 4) + 1;
        if (fish_number == 1 || fish_number == 4) {
            fish = this.physics.add.sprite(0, y, "fish_" + fish_number).setScale(0.2);
            fish.body.velocity.x = Phaser.Math.Between(150, 400);
        }
        else {
            fish = this.physics.add.sprite(800, y, "fish_" + fish_number).setScale(0.2);
            fish.body.velocity.x = Phaser.Math.Between(-400, -150);
        }


    }
    createBomb() {
        bomb = this.physics.add.image(300, 670, "bomb").setScale(0.1);
        var x = Phaser.Math.Between(50, 750);
        // bomb = this.physics.add.image(x, 610, "bomb").setScale(0.1);
        bomb.x = x;
        this.tweens.add({ targets: bomb, y: (Phaser.Math.Between(350, 450)), duration: 1000, ease: 'Back' });
        this.time.delayedCall(1500, function () {

            this.tweens.add({ targets: bomb, y: 650, duration: 1000, ease: 'Back' });
        }, [], this);

    }
    render() {
        this.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32);
        this.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 64);
    }
    timeStart(callback, duration = 60000 * 5) {
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
        }
    }
    handleTimeFinished() {
        // this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        // this.showHideResult(true);
        // this.showHideQuestion(false);
        // this.open_gift.setVisible(false);
        // this.questionDisplay.setVisible(false);
        // this.textEnterAnswer.setVisible(false);
        // this.logo.setVisible(false);
        // this.scoreText.setVisible(false);
        // this.ele.setVisible(false);
        // this.tweens.add({ targets: this.iconReplay, x: 550, duration: 500, ease: 'Back' });
        // this.tweens.add({ targets: this.iconHome, x: 250, duration: 500, ease: 'Back' });
        // this.close_gift.setInteractive();
        // this.textGameOver.setVisible(true);
        // //fade
        // this.cameras.main.fadeIn(250);
        // this.time.delayedCall(250, function() {
        //     this.button_sound.play();
        // }, [], this);
    }
    ropeGrow() {
        var newPart = this.rope.create(this.tail.x, this.tail.y, 'rope');
        newPart.setOrigin(0);
    }
    //collide cannonbal and pirateShip
    destroy(net, pirateship) {
        pirateship.disableBody(true, true);
        net.disableBody(true, true);
        this.animationAddItem(pirateship.x, pirateship.y);
        control = false;
        coin_value++;
        coin.text = "Coin: " + coin_value;
    }
    animationAddItem(randX, randY) {
        var pointsAdded = this.add.text(randX, randY, "+1 Coin", { font: '30px ', fill: "#FF9900", stroke: '#fff', strokeThickness: 10 });
        pointsAdded.setOrigin(0.5, 0.5);
        this.tweens.add({ targets: pointsAdded, alpha: 0, y: randY - 50, duration: 1000, ease: 'Linear' });
        // this.cameras.main.shake(100, 0.01, true);
    }
}