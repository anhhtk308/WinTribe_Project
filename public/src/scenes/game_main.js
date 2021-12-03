class game_main extends Phaser.Scene {
    constructor() {
        super("game_main");
    }
    init(data){
        //this.socket_init=io();
        this.socket=data.socket;
    }

    preload() {
        this.load.image("ship", "assets/Ship.png");
        this.load.image("tiles", "assets/tiles.png");
        this.load.tilemapTiledJSON("seaMap", "assets/seaMap3011.json");
        this.load.image("bullet", "assets/bullet.png");
        this.load.spritesheet("explo_anims", "assets/explo_anims.png", { frameWidth: 269 / 4, frameHeight: 64.5 });
        this.load.image("health","assets/health_bar.png");
        this.load.image('island1',"assets/island1.png");
        this.load.image('island2',"assets/island2.png");
        this.load.image('island3',"assets/island3.png");
        this.load.image('island4',"assets/island4.png");
        this.load.image('island5',"assets/island5.png");
        this.load.image('island6',"assets/island6.png");
        this.load.image('island7',"assets/island7.png");
        this.load.image('island8',"assets/island8.png");
        this.load.image('island9',"assets/island9.png");
        this.load.image('island10',"assets/island10.png");
        this.load.image('stone','assets/stone1.png');
        this.load.image('sea_tiles','assets/sea_tiles.png');
        this.load.image('treasure','assets/treasure.png');
        this.load.image('ground','assets/ground.png');
    }
    create() {

        var self = this;
        this.otherPlayers = this.physics.add.group();
        this.bullets = this.physics.add.group();
        
        this.texts=this.add.group();
        this.health_ships= this.add.group();
        //this.utext
        //this.socket=io();
        this.socket.emit("play");

        this.socket.on('currentPlayers', function (player) {
            Object.keys(player).forEach(function (id) {
                if (player[id].playersID === self.socket.id) { 
                    addPlayer(self, player[id]);
                } else {
                    addOtherPlayer(self, player[id]);
                }

            });
        });
        this.socket.on('newPlayer', function (playerInfo) {
            
            addOtherPlayer(self, playerInfo);
        })
       
        function addPlayer(self, playerInfo) {
            self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setScale(0.2);
            self.ship.setDrag(100);
            self.ship.setAngularDrag(100);
            self.physics.add.collider(self.ship, self.IslandLayer);
            self.physics.add.collider(self.ship,self.bullets,self.attack_ship
            ,null,self);
            self.text_ship=self.add.text(playerInfo.x+30,playerInfo.y-50,self.name,{fontSize:10, color:"#FFFFFF"});
            self.health_ship=self.add.image(playerInfo.x+30,playerInfo.y-50,"health").setScale(playerInfo.health/100,1/2);
            self.cameras.main.startFollow(self.ship);
            
        }
       
        function addOtherPlayer(self, playerInfo) {
            const other = self.otherPlayers.create(playerInfo.x,playerInfo.y,"ship").setImmovable().setScale(0.2);
            other.playersID = playerInfo.playersID;
           
            const text_ship = self.add.text(playerInfo.x+30,playerInfo.y-70,self.name,{fontSize:10, color:"#FFFFFF"});
            text_ship.playersID = playerInfo.playersID;
            self.texts.add(text_ship);
            const health_ship = self.add.image(playerInfo.x+30,playerInfo.y-50,"health").setScale(playerInfo.health/100,1/2);
            health_ship.playersID = playerInfo.playersID;
            self.health_ships.add(health_ship);

        }
        this.socket.on('damed',function(data){
            self.health_ships.getChildren().forEach(function (other) {
                if (data.playersID == other.playersID) {
                    other.setScale(data.health/100,1/2);
                }
            });
        });
        this.socket.on("disconnected", function (id) {
            self.otherPlayers.getChildren().forEach(function (other) {
                if (id == other.playersID) {
                    other.destroy();
                }
            });
            self.texts.getChildren().forEach(function (other) {
                if (id == other.playersID) {
                    other.destroy();
                }
            });
            self.health_ships.getChildren().forEach(function (other) {
                if (id == other.playersID) {
                    other.destroy();
                }
            });
        });
        this.socket.on('moved', function (playerInfo) {
            self.otherPlayers.getChildren().forEach(function (other) {
                if (playerInfo.playersID == other.playersID) {
                    other.setPosition(playerInfo.x, playerInfo.y);
                    other.setRotation(playerInfo.rotation);
                }
            });
            self.texts.getChildren().forEach(function (other) {
                if (playerInfo.playersID == other.playersID) {
                    other.setPosition(playerInfo.x-50, playerInfo.y-70);
                    
                }
            });
            self.health_ships.getChildren().forEach(function (other) {
                if (playerInfo.playersID == other.playersID) {
                    other.setPosition(playerInfo.x-50, playerInfo.y-80);
                    
                }
            });
            
        });

        this.socket.on('fired',function(data){
            const bullet = self.bullets.create(data.x,data.y,'bullet').setScale(0.03);
            bullet.bulletID=data.bulletID;
           
            self.physics.velocityFromRotation(data.rotation+1.5,200,bullet.body.velocity);
            self.physics.add.collider(self.bullets,self.IslandLayer,self.collision,null,self);
        })
        
        this.socket.on('bullet_moved',function(data){
            self.bullets.getChildren().forEach(function (other) {
                if (data.bulletID == other.bulletID) {
                    other.setPosition(data.x, data.y);
                    other.setRotation(data.rotation);
                }
            });
        });
        
        this.socket.on('destroy_ship',function(data){
            self.otherPlayers.getChildren().forEach(function (other) {
                if (data.playersID == other.playersID) {
                    other.destroy();
                }
            });

            self.texts.getChildren().forEach(function (other) {
                if (data.playersID == other.playersID) {
                    other.destroy();
                }
            });

            self.health_ships.getChildren().forEach(function (other) {
                if (data.playersID == other.playersID) {
                    other.destroy();
                }
            });
            
        });
        

        
        //this.physics.add.collider(this.otherPlayers,this.bullets);
        const map = this.add.tilemap("seaMap");
        const natural_tile = map.addTilesetImage("sea_tiles");
        const island1=map.addTilesetImage("island1")
        const island2=map.addTilesetImage("island2")
        const island3=map.addTilesetImage("island3")
        const island4=map.addTilesetImage("island4")
        const island5=map.addTilesetImage("island5")
        const island6=map.addTilesetImage("island6")
        const island7=map.addTilesetImage("island7")
        const island8=map.addTilesetImage("island8")
        const island9=map.addTilesetImage("island9")
        const island10=map.addTilesetImage("island10")
        const stone=map.addTilesetImage("stone")
        const ground=map.addTilesetImage('ground');
        this.SeaLayer = map.createLayer("sea_background", [natural_tile]);
        this.IslandLayer = map.createLayer("island", [natural_tile,island1,island2,island3,island4,island5,island6,island7,island8,island9,island10,stone,ground]);
        this.IslandLayer.setCollisionBetween(0, 20000);
       
        this.fireButtton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.status = 1;
        this.status1 = 1;
        this.anims.create({
            key: "explo",
            frames: this.anims.generateFrameNumbers("explo_anims", { start: 0, end: 34 }),
            frameRate: 50,
            repeat: -1
        })
       
        this.health=1;
        
       
        this.physics.add.collider(this.otherPlayers,this.IslandLayer);
        this.physics.add.collider(this.otherPlayers,this.bullets,this.attackship,null,self);
        this.minimap=this.cameras.add(50,10,200,100).setZoom(0.2).setName("mini");
        this.minimap.scrollX = 1600;
        this.minimap.scrollY = 300;
        this.r3 = this.add.rectangle(100,200, 200, 100);
        this.r3.setStrokeStyle(2, 0x1a65ac);
    }

    update() {
        
        this.cursors = this.input.keyboard.createCursorKeys();
        this.otherPlayers.children.iterate(function(child){
            this.minimap.ignore(child);
        },this)
        this.texts.children.iterate(function(child){
            this.minimap.ignore(child);
        },this)
        this.health_ships.children.iterate(function(child){
            this.minimap.ignore(child);
        },this)
        if (this.ship&&this.text_ship&&this.health_ship) {


            if(this.health<=0){
                this.destroyShip(this.ship);
            }
            
            if (this.cursors.left.isDown) {
                this.ship.setAngularVelocity(-100);
                
            } else if (this.cursors.right.isDown) {
                this.ship.setAngularVelocity(100);

            } else {
                this.ship.setAngularVelocity(0);
            }
            if (this.cursors.up.isDown) {
                this.physics.velocityFromRotation(this.ship.rotation + 1.5, 500, this.ship.body.velocity);
            
            } else {
                this.ship.setVelocityX(0);
                this.ship.setVelocityY(0);
            }
            
            this.text_ship.x=this.ship.x-20;
            this.text_ship.y=this.ship.y-70;
            this.health_ship.x=this.ship.x-50;
            this.health_ship.y=this.ship.y-80;
            this.minimap.scrollX=Phaser.Math.Clamp(this.ship.x,0,10000);
            this.r3.x=this.minimap.scrollX-250;
            this.minimap.scrollY=Phaser.Math.Clamp(this.ship.y,0,10000);
            this.r3.y=this.minimap.scrollY-240;
             
            if (Phaser.Input.Keyboard.JustDown(this.fireButtton)&&this.status==1) {
                console.log("enter");
                this.socket.emit("fire",{x: this.ship.x, y: this.ship.y, z: this.ship.rotation});
                this.status=0;

                this.time.addEvent({

                    callback: function () {
                        this.status = 1;
                    },
                    callbackScope: this,
                    delay: 1000,
                    repeat: 0
                });

            }

            var x = this.ship.x;
            var y = this.ship.y;
            var z = this.ship.rotation;
            if (this.ship.oldposition && (x !== this.ship.oldposition.x || y !== this.ship.oldposition.y || z !== this.ship.oldposition.z)) {
                this.socket.emit("movement", { x: this.ship.x, y: this.ship.y, z: this.ship.rotation });
            }
            this.ship.oldposition = {
                x: this.ship.x,
                y: this.ship.y,
                z: this.ship.rotation
            }
            if(this.bullet){
                var x_bullet = this.bullet.x;
                var y_bullet = this.bullet.y;
                var z_bullet = this.bullet.rotation;
                if (this.bullet.oldposition && (x_bullet !== this.bullet.oldposition.x || y_bullet !== this.bullet.oldposition.y || z_bullet !== this.bullet.oldposition.z)) {
                    this.socket.emit("movement_bullet", { x: this.bullet.x, y: this.bullet.y, z: this.bullet.rotation });
                }
                this.bullet.oldposition = {
                    x: this.ship.x,
                    y: this.ship.y,
                    z: this.ship.rotation
                }

            }

        }

    }
    collision(bullet, map) {
        bullet.disableBody(true, true);
        bullet.destroy();
        var explo = this.physics.add.sprite(bullet.x, bullet.y, "explo_anims").setScale(0.4);
        explo.anims.play("explo", true);
        this.time.addEvent({

            callback: function () {
                explo.anims.stop("explo");
                explo.disableBody(true, true);
            },
            callbackScope: this,
            delay: 1000,
            repeat: 0
        });

    }

    attack_ship(ship,bullet){
    
        bullet.disableBody(true, true);
        bullet.destroy();
        var explo = this.physics.add.sprite(bullet.x, bullet.y, "explo_anims").setScale(0.4);
        explo.anims.play("explo", true);
        this.time.addEvent({

            callback: function () {
                explo.anims.stop("explo");
                explo.disableBody(true, true);
            },
            callbackScope: this,
            delay: 1000,
            repeat: 0
        });
        if (this.ship&&this.text_ship&&this.health_ship){
            this.health-=1/10;
            if(this.health>0){
                this.health_ship.setScale(this.health,1/2);
            } else {
                this.socket.emit('destroy');
            }
            
        }
        this.socket.emit('dame');
    }

    attackship(ship,bullet){
        //ship.blocked(true)
        //ship.disableBody(true, true);;
        bullet.disableBody(true, true);
        bullet.destroy();
        var explo = this.physics.add.sprite(bullet.x, bullet.y, "explo_anims").setScale(0.4);
        explo.anims.play("explo", true);
        this.time.addEvent({

            callback: function () {
                explo.anims.stop("explo");
                explo.disableBody(true, true);
            },
            callbackScope: this,
            delay: 1000,
            repeat: 0
        });

        
        //ship.destroy();
        
        //this.socket.emit('dame');
    }
    destroyShip(ship){

        
        var explo = this.physics.add.sprite(ship.x, ship.y, "explo_anims").setScale(0.4);
        explo.anims.play("explo", true);
        this.time.addEvent({

            callback: function () {
                explo.anims.stop("explo");
                explo.disableBody(true, true);
            },
            callbackScope: this,
            delay: 1000,
            repeat: 0
        });
        //this.socket.emit('dame');
        //ship.disableBody(true,true);
        // this.socket.emit('destroy');
         this.socket.emit('forceDisconnect');
         this.scene.start("Preload");
        
    }
    destroy_ship(ship,bullet){
        bullet.disableBody(true, true);
        bullet.destroy();
        var explo = this.physics.add.sprite(bullet.x, bullet.y, "explo_anims").setScale(0.4);
        explo.anims.play("explo", true);
        this.time.addEvent({

            callback: function () {
                explo.anims.stop("explo");
                explo.disableBody(true, true);
            },
            callbackScope: this,
            delay: 1000,
            repeat: 0
        });
        ship.destroy();
        
    }
}