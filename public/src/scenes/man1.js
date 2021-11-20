// export default man1;

class man1 extends Phaser.Scene {
    constructor() {
        super("man1");
    }

    preload() {
        this.load.image('ship', 'assets/spaceShips_001.png');
        this.load.image('otherPlayer', 'assets/enemyBlack5.png');
    }
    create() {
        // var self = this;
        this.socket = io();
        this.next_text = this.add.text(600, 50, "NEXT", {
            fontSize: 54,
            color: "#FFFFFF",
        });
        this.next_text.setInteractive();
        this.next_text.on("pointerdown", () => {
            //this.socket.disconnect();
            console.log("destroy " + this.socket.id);
            this.scene.start("man2");
        });

        // this.otherPlayers = this.physics.add.group();
        // this.socket.on('currentPlayers', function(players) {
        //     Object.keys(players).forEach(function(id) {
        //         if (players[id].playerId === self.socket.id) {
        //             addPlayer(self, players[id]);
        //         } else {
        //             addOtherPlayers(self, players[id]);
        //         }
        //     });
        // });
        // this.socket.on('newPlayer', function(playerInfo) {
        //     addOtherPlayers(self, playerInfo);
        // });
        // this.socket.on('disconnect', function(playerId) {
        //     self.otherPlayers.getChildren().forEach(function(otherPlayer) {
        //         if (playerId === otherPlayer.playerId) {
        //             otherPlayer.destroy();
        //         }
        //     });
        // });
    }

    // addPlayer(self, playerInfo) {
    //     self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    //     if (playerInfo.team === 'blue') {
    //         self.ship.setTint(0x0000ff);
    //     } else {
    //         self.ship.setTint(0xff0000);
    //     }
    //     self.ship.setDrag(100);
    //     self.ship.setAngularDrag(100);
    //     self.ship.setMaxVelocity(200);
    // }

    // addOtherPlayers(self, playerInfo) {
    //     const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    //     if (playerInfo.team === 'blue') {
    //         otherPlayer.setTint(0x0000ff);
    //     } else {
    //         otherPlayer.setTint(0xff0000);
    //     }
    //     otherPlayer.playerId = playerInfo.playerId;
    //     self.otherPlayers.add(otherPlayer);
    // }

    update() {}
}