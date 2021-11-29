// import man1 from './man1';
class man2 extends Phaser.Scene {
    constructor() {
        super("man2");
    }

    preload() {}
    create() {
        //var socket=io();
        var textEntry = this.add.text(210, 230, 'aaa', { font: '32px Courier', fill: '#FFFFFF' }).setVisible(false);
        this.input.keyboard.on('keydown', function(event) {
            if (event.keyCode === 8 && textEntry.text.length > 0) {
                textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
            } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
                textEntry.text += event.key;
            }
        });
        this.next_text = this.add.text(600, 50, "NEXT", {
            fontSize: 54,
            color: "#FFFFFF",
        });
        this.next_text.setInteractive();
        this.next_text.on("pointerdown", () => {
            this.scene.start("man1",{name:"aaaaa"});
           // socket.emit('inputed',textEntry.text);
        });
        this.next_text1 = this.add.text(50, 50, "NEXT", {
            fontSize: 54,
            color: "#FFFFFF",
        });
        this.next_text1.on("pointerdown", () => {
            this.scene.start("man1",{name:"aaaaa"});
           // socket.emit('inputed',textEntry.text);
        });
        //var input= document.createElement("<input type='text'>");
    }
    update() {}
}