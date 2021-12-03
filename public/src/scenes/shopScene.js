class shopScene extends Phaser.Scene {
    constructor() {
        super("shopScene");
    }
    init(data){
        this.name =data.name;
    }

    preload() {
        this.load.image("background", "assets/shop/shop_background.jpg");
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
        this.background = this.add.image(400, 300, "background").setScale(1);
        this.speedImg = this.add.image(400, 200, "speedImg").setVisible(false);
        this.tripleBullets = this.add.image(400, 200, "tripleBullets").setVisible(false);
        this.hp = this.add.image(400, 200, "hp").setVisible(false);
        this.iceBom = this.add.image(400, 200, "iceBom").setVisible(false);
        this.dame = this.add.image(400, 200, "dame").setVisible(false);
        this.strong = this.add.image(400, 200, "strong").setVisible(false);
        this.doubleBullets = this.add.image(400, 200, "doubleBullets").setVisible(false);
        this.shipRotationSpeed = this.add.image(400, 200, "shipRotationSpeed").setVisible(false);
        this.fireBom = this.add.image(400, 200, "fireBom").setVisible(false);
        this.speedBullet = this.add.image(400, 200, "speedBullet").setVisible(false);
        this.background.setInteractive();
        this.po_x = 0;
        this.po_y = 0;
        this.chooseItem(this.speedImg,120, 210, 200, 320);
        this.chooseItem(this.tripleBullets,220, 210, 340, 333);
        this.chooseItem(this.hp, 360, 200, 460, 326);
        this.chooseItem(this.iceBom, 480, 190, 580, 330);
        this.chooseItem(this.dame, 590, 190, 704, 320);
        this.chooseItem(this.strong, 100, 350, 222, 480);
        this.chooseItem(this.doubleBullets, 233, 350, 340, 488);
        this.chooseItem(this.shipRotationSpeed, 350, 350, 464, 506);
        this.chooseItem(this.fireBom, 470, 350, 586, 501);
        this.chooseItem(this.speedBullet, 601, 360, 696, 496);
    }

    update() {
        
        
    }

    chooseItem(item, X_min,  Y_min, X_max, Y_max) {
        this.background.on("pointerdown", () => {
            this.po_x = this.game.input.mousePointer.x;
            this.po_y = this.game.input.mousePointer.y;

            if (
                this.po_x >= X_min &&
                this.po_x <= X_max &&
                this.po_y >= Y_min &&
                this.po_y <= Y_max
              ) {
                item.setVisible(true);
              }
        })
    }






    
}