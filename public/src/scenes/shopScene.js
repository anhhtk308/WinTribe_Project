class shopScene extends Phaser.Scene {
    constructor() {
        super("shopScene");
    }
    init(data) {
        this.name = data.name;
        this.socket = data.socket;
    }

    preload() {
        this.load.image("backgroundShop", "assets/shop/shop_background.jpg");
        this.load.image("closeIcon", "assets/shop/closeIcon.png");
        this.load.image("notifyMoneyFrame", "assets/shop/notifyMoneyFrame.png");
        this.load.image("blurBg", "assets/shop/blurBg.png");
        this.load.image("okIcon", "assets/shop/okIcon.png");
        
        //small icon skill
        this.load.image("speed", "assets/shop/iconSmall/speed.png");
        this.load.image("hp", "assets/shop/iconSmall/hp.png");
        this.load.image("iceBom", "assets/shop/iconSmall/iceBom.png");
        this.load.image("strong", "assets/shop/iconSmall/strong.png");
        this.load.image("shipRotationSpeed", "assets/shop/iconSmall/shipRotationSpeed.png");
        this.load.image("speedBullet", "assets/shop/iconSmall/speedBullet.png");

        //big icon skill
        this.load.image("speedItem", "assets/shop/iconBig/speedItem.png");
        this.load.image("hpItem", "assets/shop/iconBig/hpItem.png");
        this.load.image("iceBomItem", "assets/shop/iconBig/iceBomItem.png");
        this.load.image("strongItem", "assets/shop/iconBig/strongItem.png");
        this.load.image("shipRotationSpeedItem", "assets/shop/iconBig/shipRotationSpeedItem.png");
        this.load.image("speedBulletItem", "assets/shop/iconBig/speedBulletItem.png");

        //description frame
        this.load.image("speedDes", "assets/shop/descriptionFrame/speedDes.png");
        this.load.image("hpDes", "assets/shop/descriptionFrame/hpDes.png");
        this.load.image("tripleBomDes", "assets/shop/descriptionFrame/tripleBomDes.png");
        this.load.image("speedBulletDes", "assets/shop/descriptionFrame/speedBulletDes.png");
        this.load.image("strongDes", "assets/shop/descriptionFrame/strongDes.png");
        this.load.image("shipRotationSpeedDes", "assets/shop/descriptionFrame/shipRotationSpeedDes.png");
    }

    create() {
        var self = this;

        //background
        this.backgroundShop = this.add.image(400, 300, "backgroundShop");

        //image skill's item
        this.speed = this.add.image(285, 265, 'speedItem');
        this.hp = this.add.image(410, 265, 'hpItem');
        this.iceBom = this.add.image(540, 265, 'iceBomItem');
        this.speedBullet = this.add.image(280, 440, 'speedBulletItem');
        this.strong = this.add.image(410, 440, 'strongItem');
        this.shipRotationSpeed = this.add.image(540, 440, 'shipRotationSpeedItem');

        this.textOfGolds = self.add.text(150, 116, self.numberOfGolds, { fontSize: 30, color: '#fff' });

        //export object
        this.socket.emit('startShop', this.socket.id);
        this.socket.on('getPlayerShop', function(data) {
            self.numberOfGolds = data.gold;
            self.textOfGolds.setText(data.gold);
            // alert('gold: ' + data.gold)
            self.exportObj = data.skills;
            if((self.exportObj).speed === true){
                self.speed.alpha = 0.5;
                self.speedSmall.alpha = 1;
            }
    
            if(self.exportObj.hp === true){
                self.hp.alpha = 0.5;
                self.hpSmall.alpha = 1;
            }
    
            if(self.exportObj.iceBom === true){
                self.iceBom.alpha = 0.5;
                self.iceBomSmall.alpha = 1;
            }
    
            if(self.exportObj.speedBullet === true){
                self.speedBullet.alpha = 0.5;
                self.speedBulletSmall.alpha = 1;
            }
    
            if(self.exportObj.strong === true){
                self.strong.alpha = 0.5;
                self.strongSmall.alpha = 1;
            }
    
            if(self.exportObj.shipRotationSpeed === true){
                self.shipRotationSpeed.alpha = 0.5;
                self.shipRotationSpeedSmall.alpha = 1;
            }
            // alert('skills: ' + self.exportObj.speed)
        });


        //icon bag's item
        this.speedSmall = this.add.image(435, 127, 'speed').setScale(0.4);
        this.hpSmall = this.add.image(475, 127, 'hp').setScale(0.5);
        this.iceBomSmall = this.add.image(525, 125, 'iceBom').setScale(0.45);
        this.speedBulletSmall = this.add.image(565, 127, 'speedBullet').setScale(0.5);
        this.strongSmall = this.add.image(615, 127, 'strong').setScale(0.4);
        this.shipRotationSpeedSmall = this.add.image(660, 127, 'shipRotationSpeed').setScale(0.4);
        
        //notify out of money
        this.blurBg = this.add.image(400, 300, "blurBg").setVisible(false);
        this.notifyMoneyFrame = this.add.image(415, 300, 'notifyMoneyFrame').setVisible(false);
        this.okIcon = this.add.image(425, 420, "okIcon").setVisible(false);
        this.okIcon.setInteractive();

        //close icon
        this.closeIcon = this.add.image(765, 32, "closeIcon");
        this.closeIcon.setInteractive();

        //description frame
        this.speedDes = this.add.image(400, 150, "speedDes").setVisible(false);
        this.hpDes = this.add.image(530, 150, "hpDes").setVisible(false);
        this.tripleBomDes = this.add.image(660, 150, "tripleBomDes").setVisible(false);
        this.speedBulletDes = this.add.image(410, 310, "speedBulletDes").setVisible(false);
        this.strongDes = this.add.image(530, 310, "strongDes").setVisible(false);
        this.shipRotationSpeedDes = this.add.image(660, 310, "shipRotationSpeedDes").setVisible(false);
    
        this.skillSmall = this.physics.add.group();

        (this.speedSmall).name = 'speed';
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

        this.skillSmall.getChildren().forEach(function (other) {
            other.alpha = 0.3;
        });

        //skill object
        this.skills = this.physics.add.group();

        (this.speed).name = 'speed';
        (this.speed).golds = 50;
        this.skills.add(this.speed);

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

        this.skills.getChildren().forEach(function (other) {
            other.setInteractive();
        });

        this.skills.getChildren().forEach(function (other) {
            other.on("pointerdown", () => {
                if (self.numberOfGolds >= other.golds) {
                    other.alpha = 0.5;
                    self.animationAddItem(other.name);
                    self.updateGolds(other.golds);
                    var option = other.name;
                    switch (option) {
                        case 'speed':
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
                    self.skillSmall.getChildren().forEach(function (itemSmall) {
                        if (itemSmall.name === other.name) {
                            itemSmall.alpha = 1;
                        }
                    });
                    other.removeListener("pointerdown");
                } else {
                    self.blurBg.setVisible(true);
                    self.okIcon.setVisible(true);
                    self.notifyMoneyFrame.setVisible(true);
                }
            })

        });
    
        //hover
        this.hoverItemSkill(self);
        this.closeNotifyMoney();
        this.changeScene();

    }

    update() {


    }

    hoverItemSkill(self) {
        this.skills.getChildren().forEach(function (other) {
            other.on('pointerover', function (event) {
                var option = other.name;
                    switch (option) {
                        case 'speed':
                            {
                                self.speedDes.setVisible(true);
                                break;
                            };
                        case 'hp':
                            {
                                self.hpDes.setVisible(true);
                                break;
                            };
                        case 'iceBom':
                            {
                                self.tripleBomDes.setVisible(true);
                                break;
                            };
                        case 'speedBullet':
                            {
                                self.speedBulletDes.setVisible(true);
                                break;
                            };
                        case 'strong':
                            {
                                self.strongDes.setVisible(true);
                                break;
                            };
                        case 'shipRotationSpeed':
                            {
                                self.shipRotationSpeedDes.setVisible(true);
                                break;
                            };
                    }
            });

            other.on('pointerout', function (event) {
                var option = other.name;
                    switch (option) {
                        case 'speed':
                            {
                                self.speedDes.setVisible(false);
                                break;
                            };
                        case 'hp':
                            {
                                self.hpDes.setVisible(false);
                                break;
                            };
                        case 'iceBom':
                            {
                                self.tripleBomDes.setVisible(false);
                                break;
                            };
                        case 'speedBullet':
                            {
                                self.speedBulletDes.setVisible(false);
                                break;
                            };
                        case 'strong':
                            {
                                self.strongDes.setVisible(false);
                                break;
                            };
                        case 'shipRotationSpeed':
                            {
                                self.shipRotationSpeedDes.setVisible(false);
                                break;
                            };
                    }
            });
        })
    
    }

    changeScene() {
        this.closeIcon.on("pointerdown", () => {
            this.socket.emit('updateShop', { gold: this.numberOfGolds, skills: this.exportObj });
            this.scene.start('mainHall', { socket: this.socket, name: this.name });
        })
    }

    closeNotifyMoney() {
        this.okIcon.on("pointerdown", () => {
            this.blurBg.setVisible(false);
            this.notifyMoneyFrame.setVisible(false);
            this.okIcon.setVisible(false);
        })
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