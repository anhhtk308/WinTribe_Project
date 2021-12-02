class shopScene extends Phaser.Scene {
    constructor() {
        super("shopScene");
    }
    init(data){
        this.name =data.name;
    }

    preload() {
        this.load.image("background", "assets/shop_background.jpg");
    }
    create() {
        this.background = this.add.image(400, 300, "background").setScale(1)
      
    }

    update() {

    }






    
}