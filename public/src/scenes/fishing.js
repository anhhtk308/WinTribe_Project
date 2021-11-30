class fishing extends Phaser.Scene {
    constructor() {
        super("fishing");
    }

    preload() {
        this.load.image("background", "assets/background.png");
        this.load.image("sea", "assets/sea.png");
        this.load.image("popup", "assets/popup.jpg");
        this.load.image("process", "assets/process.png");
        this.load.image("ca_chep", "assets/ca_chep.png");
        this.load.image("ca_ro_phi", "assets/ca_ro_phi.png");
        this.load.image("ca_ba_sa", "assets/ca_ba_sa.png");
        this.load.image("ung", "assets/ung.png");
        this.load.image("point", "assets/point.png");
        this.load.image("boat", "assets/boat.png");
        this.load.image("house", "assets/house.png");
        this.load.image("ground", "assets/ground.png");
        this.load.image("bag", "assets/bag.png");
        this.load.image("guilde", "assets/guilde.png");
        this.load.tilemapTiledJSON("fishing", "assets/fishing.json");
        this.load.spritesheet("player", "assets/character.png", {
            frameWidth: 50,
            frameHeight: 48,
        });
    }
    create() {
        const map = this.add.tilemap("fishing");
        const boat_tileset = map.addTilesetImage("boat");
        const ground_tileset = map.addTilesetImage("ground");
        const house_tileset = map.addTilesetImage("house");
        const background_tileset = map.addTilesetImage("background");
        const sea_tileset = map.addTilesetImage("sea");
        const background_layer = map.createLayer("background", [background_tileset]);
        const ground = map.createLayer("ground", [ground_tileset]);
        const sea_layer = map.createLayer("sea", [sea_tileset]);
        const boat_layer = map.createLayer("boat", [boat_tileset]);
        const house_layer = map.createLayer("house", [house_tileset]);
        this.add.image(700, 250, "process");
        // Create object point
        this.point = this.physics.add.sprite(510, 228, "point");
        this.point.body.velocity.x = 150;
        this.isSpaceDown = false;
        this.isGoFishing = false;
        this.turn_right = true;
        // Create animation of acter
        this.player = this.physics.add.sprite(790, 478, "player").setScale(3.5);
        this.anims.create({
            key: "1",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 350 }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "turn",
            frames: [{ key: "player", frame: 0 }],
            frameRate: 5,
        });
        this.anims.create({
            key: "2",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1,
        });
        this.isShowPopup = false;
        this.count = 0;
        // Create item bag, guilde
        this.bag = this.add.image(1350, 100, "bag").setScale(0.19).setVisible(true);
        this.guilde = this.add.image(1350, 190, "guilde").setScale(0.19).setVisible(true);
        this.bag.setInteractive();
        this.guilde.setInteractive();
        // Create popup
        this.popup = this.add.image(500, 100, "popup").setOrigin(0, 0).setScale(0.35, 0.5).setVisible(false);
        // Create notice
        this.message = this.add.text(630, 170, "Bạn đã câu được:", { fontSize: 20, color: "#000000" }).setVisible(false);

        // create image of items
        this.ca_chep = this.add.image(625, 190, "ca_chep").setOrigin(0, 0).setScale(0.5).setVisible(false);
        this.ca_ba_sa = this.add.image(625, 190, "ca_ba_sa").setOrigin(0, 0).setScale(0.5).setVisible(false);
        this.ca_ro_phi = this.add.image(625, 190, "ca_ro_phi").setOrigin(0, 0).setScale(0.5).setVisible(false);
        this.ung = this.add.image(625, 190, "ung").setOrigin(0, 0).setScale(0.5).setVisible(false);
    }
    update() {
        var keyboard = this.input.keyboard.createCursorKeys();
        if (this.isSpaceDown == false && this.turn_right) {
            this.point.body.velocity.x = 150;
            if (this.point.x == 905) {
                this.turn_right = false;
            }
        }
        else if (this.isSpaceDown == false && this.turn_right == false) {
            this.point.body.velocity.x = -150;
            if (this.point.x == 510) {
                this.turn_right = true;
            }
        }
        if (keyboard.space.isDown && this.isGoFishing == false) {
            this.player.anims.play("1", true);
            this.isSpaceDown = true;
            this.point.body.velocity.x = 0;
            this.isGoFishing = true;
            this.popup.setVisible(true);
            this.message.setVisible(true);
            this.getItem(this.point.x);

        }
        else {
            this.player.anims.play("2", true);
        }
        if (this.isShowPopup == false) {
            this.showBagAndGuilde();
            this.isShowPopup = true;
        }
        console.log(this.isShowPopup);
    }
    getItem(point_x) {
        var index_item_show;
        if (point_x >= 610 && point_x <= 810) {
            index_item_show = Math.floor(Math.random() * 3) + 1;
        }
        else {
            index_item_show = 0;
        }
        switch (index_item_show) {
            case 0:
                this.ung.setVisible(true);
                this.item_name = this.add.text(630, 400, "1 chiếc ủng", { fontSize: 20, color: "#000000" }).setVisible(true);
                break;
            case 1:
                this.ca_chep.setVisible(true);
                this.item_name = this.add.text(630, 400, "1 con cá Chép", { fontSize: 20, color: "#000000" }).setVisible(true);
                break;
            case 2:
                this.ca_ro_phi.setVisible(true);
                this.item_name = this.add.text(630, 400, "1 con cá Rô phi", { fontSize: 20, color: "#000000" }).setVisible(true);
                break;
            case 3:
                this.ca_ba_sa.setVisible(true);
                this.item_name = this.add.text(630, 400, "1 con cá Ba sa", { fontSize: 20, color: "#000000" }).setVisible(true);
                break;
        }
    }
    showBagAndGuilde() {
        this.bag.on("pointerdown", () => {
            this.popup.setVisible(true);

        });
        this.guilde.on("pointerdown", () => {
            this.popup.setVisible(true);
            this.guilde_title = this.add.text(600, 320, "GUILDE");
            this.guilde_content = this.add.text(550, 350, "Nhập vai vào một người ngư dân đánh bắt cá.\nBạn nãy sử dụng phím SPACE trên bàn phím\n sao cho mũi tên dừng lại ở khu vực màu xanh trên thanh lực\nđể có thể có cơ hội cao câu được những chú cá cho mình nhé!");
        });

    }

}