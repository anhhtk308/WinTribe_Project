window.addEventListener('load', function() {

    var game = new Phaser.Game({
        width: 800,
        height: 600,
        type: Phaser.AUTO,
        backgroundColor: "#242424",
        parent: 'tribe',
        dom: {
            createContainer: true
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {},
                debug: false
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
        // ,
        // scene: [
        //     man2, man1
        // ]
    });

    game.scene.add("Preload", Preload);
    game.scene.add("Level", Level);
    game.scene.add("Boot", Boot);
    game.scene.add("game_main", game_main);
    game.scene.add("man_khoi_tao", man_khoi_tao, true);
    game.scene.add("startScene", startScene);
    game.scene.add("mainHall", mainHall);
    game.scene.add("shopScene", shopScene);
    game.scene.add("matchingGame", matchingGame);
    game.scene.add("test", test);

});

class Boot extends Phaser.Scene {

    preload() {

        this.load.pack("pack", "assets/preload-asset-pack.json");

        this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Preload"));
    }
}