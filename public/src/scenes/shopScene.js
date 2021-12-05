class shopScene extends Phaser.Scene {
    constructor() {
        super("shopScene");
    }
    init(data) {
        this.name = data.name;
    }

    preload() {
        this.load.image("background", "assets/shop/shop_background.jpg");
        this.load.image("closeIcon", "assets/shop/closeIcon.png");
        this.load.image("speedImg", "assets/shop/speed.png");
        this.load.image("tripleBullets", "assets/shop/tripleBullets.png");
        this.load.image("hp", "assets/shop/hp.png");
        this.load.image("iceBom", "assets/shop/iceBom.png");
        this.load.image("dame", "assets/shop/dame.png");
        this.load.image("strong", "assets/shop/strong.png");
        this.load.image("doubleBullets", "assets/shop/doubleBullets.png");
        this.load.image("shipRotationSpeed", "assets/shop/shipRotationSpeed.png");
        this.load.image("fireBom", "assets/shop/fireBom.png");
        this.load.image("speedBullet", "assets/shop/speedBullet.png");
    }

    create() {
        //background
        this.background = this.add.image(400, 300, "background").setScale(1);
        //close icon
        this.closeIcon = this.add.image(765, 32, "closeIcon");
        //item skill's image
        this.speedImg = "speedImg";
        this.tripleBullets = "tripleBullets";
        this.hp = "hp";
        this.iceBom = "iceBom";
        this.dame = "dame";
        this.strong = "strong";
        this.doubleBullets = "doubleBullets";
        this.shipRotationSpeed = "shipRotationSpeed";
        this.fireBom = "fireBom";
        this.speedBullet = "speedBullet";
        //golds
        this.numberOfGolds = 2000;
        this.textOfGolds = this.add.text(150, 103, this.numberOfGolds, { fontSize: 30, color: '#fff' });
        //number of item at begin
        this.speedNum = 0;
        this.tripleBulletsNum = 0;
        this.hpNum = 0;
        this.iceBomNum = 0;
        this.dameNum = 0;
        this.strongNum = 0;
        this.doubleBulletsNum = 0;
        this.shipRotationSpeedNum = 0;
        this.fireBomNum = 0;
        this.speedBulletNum = 0;
        //define location of item 
        this.background.setInteractive();
        this.po_x = 0;
        this.po_y = 0;
        this.chooseItem(this.speedImg, this.speedNum, 120, 210, 200, 320);
        this.chooseItem(this.tripleBullets, this.tripleBulletsNum, 220, 210, 340, 333);
        this.chooseItem(this.hp, this.hpNum, 360, 200, 460, 326);
        this.chooseItem(this.iceBom, this.iceBomNum, 480, 190, 580, 330);
        this.chooseItem(this.dame, this.dameNum, 590, 190, 704, 320);
        this.chooseItem(this.strong, this.strongNum, 100, 350, 222, 480);
        this.chooseItem(this.doubleBullets, this.doubleBulletsNum, 233, 350, 340, 488);
        this.chooseItem(this.shipRotationSpeed, this.shipRotationSpeedNum, 350, 350, 464, 506);
        this.chooseItem(this.fireBom, this.fireBomNum, 470, 350, 586, 501);
        this.chooseItem(this.speedBullet, this.speedBulletNum, 601, 360, 696, 496);
    }
    
    update() {
        

    }
    
    chooseItem(item, itemNum, X_min, Y_min, X_max, Y_max) {
        this.background.on("pointerdown", () => {
            this.po_x = this.game.input.mousePointer.x;
            this.po_y = this.game.input.mousePointer.y;
            if (this.po_x >= X_min &&
                this.po_x <= X_max &&
                this.po_y >= Y_min &&
                this.po_y <= Y_max
            ) {
                this.animationAddItem(item);
                this.updateGolds();
                this.updateNumberOfItem(itemNum)
            }
        })
    }

    animationAddItem(item) {
        var randX = Phaser.Math.Between(200, 600);
        var randY = Phaser.Math.Between(200, 400);
        var pointsAdded = this.add.image(randX, randY, item);
        // var pointsAdded = this.add.text(randX, randY, '+' + item, { font: '30px ', fill: color, stroke: '#fff', strokeThickness: 10 });
        pointsAdded.setOrigin(0.3, 0.3);
        this.tweens.add({ targets: pointsAdded, alpha: 0, y: randY - 50, duration: 1000, ease: 'Linear' });
    }

    updateGolds() {
        this.numberOfGolds -= 10;
        this.textOfGolds.setText(this.numberOfGolds);
    }
    
    updateNumberOfItem(item) {
        item += 1;
        console.log(item);
    }

}