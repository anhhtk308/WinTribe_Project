// import man1 from './man1';
class man2 extends Phaser.Scene {
    constructor() {
        super("man2");
    }

    preload() {}
    create() {
        this.socket = io();
        this.next_text = this.add.text(600, 50, "Màn 2", {
            fontSize: 54,
            color: "#FFFFFF",
        });

        this.next_text = this.add.text(100, 50, "Back", {
            fontSize: 54,
            color: "#FFFFFF",
        });
        this.next_text.setInteractive();
        this.next_text.on("pointerdown", () => {
            this.scene.start("man1");
        });
        //console.log(man1.socket.id);
    }
    update() {}
}