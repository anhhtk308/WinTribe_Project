class test extends Phaser.Scene {
    constructor() {
        super("test");
    }
    init(data) {
        this.socket = data.socket;
        this.name = data.name;
    }
    preload() {}
    create() {
        alert(this.socket.id);
        this.socket.emit('startTest', this.socket.id);
        var self = this;
        this.socket.on('getPlayer', function(data) {
            self.btn_test = self.add.text(210, 400, data.gold, { font: '32px Courier', fill: '#000' }).setVisible(true);
        });
        this.back = self.add.text(510, 400, "Màn 1", { font: '32px Courier', fill: '#000' }).setVisible(true);
        this.back.setInteractive();
        this.back.on('pointerdown', function() {
            this.fadeOutScene();
        }, this);
    }
    update() {}
    fadeOutScene() {
        this.cameras.main.fade(250);
        this.time.delayedCall(250, function() {
            this.scene.start('man1', { socket: this.socket, name: this.name });
        }, [], this);
    }
}