class shopScene extends Phaser.Scene {
    constructor() {
        super("shopScene");
    }

    preload() {
        this.load.image("background", "assets/shop/shop_background1.jpg");
        this.load.image("closeIcon", "assets/shop/closeIcon.png");
        this.load.image("speedImg", "assets/shop/speed.png");
        this.load.image("hp", "assets/shop/hp.png");
        this.load.image("iceBom", "assets/shop/iceBom.png");
        this.load.image("strong", "assets/shop/strong.png");
        this.load.image("shipRotationSpeed", "assets/shop/shipRotationSpeed.png");
        this.load.image("speedBullet", "assets/shop/speedBullet.png");
    }

    create() {
        //background
        this.background = this.add.image(400, 300, "background");

        //golds
        this.numberOfGolds = 50;
        this.textOfGolds = this.add.text(150, 116, this.numberOfGolds, { fontSize: 30, color: '#fff' });
        //item skill's image
        this.speedImg = this.add.image(285, 255, 'speedImg');
        this.hp = this.add.image(410, 255, 'hp');
        this.iceBom = this.add.image(540, 255, 'iceBom');
        this.speedBullet = this.add.image(280, 430, 'speedBullet');
        this.strong = this.add.image(415, 420, 'strong');
        this.shipRotationSpeed = this.add.image(540, 420, 'shipRotationSpeed');

        //bag's item
        this.speedSmall = this.add.image(435, 127, 'speedImg').setScale(0.4);
        this.hpSmall = this.add.image(475, 127, 'hp').setScale(0.5);
        this.iceBomSmall = this.add.image(525, 125, 'iceBom').setScale(0.45);
        this.speedBulletSmall = this.add.image(565, 127, 'speedBullet').setScale(0.5);
        this.strongSmall = this.add.image(615, 127, 'strong').setScale(0.4);
        this.shipRotationSpeedSmall = this.add.image(660, 127, 'shipRotationSpeed').setScale(0.4);

        this.skillSmall = this.physics.add.group();

        (this.speedSmall).name = 'speedImg';
        this.skillSmall.add(this.speedSmall);
        (this.hpSmall).name = 'hp';
        this.skillSmall.add(this.hpSmall);
        (this.iceBomSmall).name = 'iceBom';
        this.skillSmall.add(this.iceBomSmall);
        (this.speedBulletSmall).name = 'speedBullet';
        this.skillSmall.add(this.speedBulletSmall);
        (this.strongSmall).name = 'strong';
        this.skillSmall.add(this.strongSmall);
        (this.shipRotationSpeedSmall).name = 'shipRotationSpeed';
        this.skillSmall.add(this.shipRotationSpeedSmall);

        this.skillSmall.getChildren().forEach(function(other) {
            other.alpha = 0.3;
        });

        //skill object
        this.skills = this.physics.add.group();

        (this.speedImg).name = 'speedImg';
        (this.speedImg).golds = 50;
        this.skills.add(this.speedImg);

        (this.hp).name = 'hp';
        (this.hp).golds = 50;
        this.skills.add(this.hp);

        (this.iceBom).name = 'iceBom';
        (this.iceBom).golds = 150;
        this.skills.add(this.iceBom);

        (this.speedBullet).name = 'speedBullet';
        (this.speedBullet).golds = 150;
        this.skills.add(this.speedBullet);

        (this.strong).name = 'strong';
        (this.strong).golds = 100;
        this.skills.add(this.strong);

        (this.shipRotationSpeed).name = 'shipRotationSpeed';
        (this.shipRotationSpeed).golds = 70;
        this.skills.add(this.shipRotationSpeed);

        this.skills.getChildren().forEach(function(other) {
            other.setInteractive();
        });

        //export object
        this.exportObj = {
            speed: false,
            hp: false,
            iceBom: false,
            speedBullet: false,
            strong: false,
            shipRotationSpeed: false,
        }

        var self = this;

        this.skills.getChildren().forEach(function(other) {
            other.on("pointerdown", () => {
                if (self.numberOfGolds >= other.golds) {
                    other.alpha = 0.5;
                    self.animationAddItem(other.name);
                    self.updateGolds(other.golds);
                    var option = other.name;
                    switch (option) {
                        case 'speedImg':
                            {
                                self.exportObj.speed = true;
                                break;
                            };
                        case 'hp':
                            {
                                self.exportObj.hp = true;
                                break;
                            };
                        case 'iceBom':
                            {
                                self.exportObj.iceBom = true;
                                break;
                            };
                        case 'speedBullet':
                            {
                                self.exportObj.speedBullet = true;
                                break;
                            };
                        case 'strong':
                            {
                                self.exportObj.strong = true;
                                break;
                            };
                        case 'shipRotationSpeed':
                            {
                                self.exportObj.shipRotationSpeed = true;
                                break;
                            };
                    }
                    self.skillSmall.getChildren().forEach(function(itemSmall) {
                        if (itemSmall.name === other.name) {
                            itemSmall.alpha = 1;
                        }
                    });
                    other.removeListener("pointerdown");
                } else {
                    alert("khum đủ tiền");
                }
            })
        });

        //close icon
        this.closeIcon = this.add.image(765, 32, "closeIcon");
        this.closeIcon.setInteractive();
        this.closeIcon.on("pointerdown", () => {
            this.scene.start('mainHall', this.exportObj);
        })

    }

    update() {


    }

    animationAddItem(item) {
        var randX = Phaser.Math.Between(300, 400);
        var randY = Phaser.Math.Between(200, 400);
        var pointsAdded = this.add.image(randX, randY, item).setScale(0.7);
        pointsAdded.setOrigin(0.3, 0.3);
        this.tweens.add({ targets: pointsAdded, alpha: 0, y: randY - 50, duration: 1000, ease: 'Linear' });
    }

    updateGolds(golds) {
        this.numberOfGolds -= golds;
        this.textOfGolds.setText(this.numberOfGolds);
    }

}