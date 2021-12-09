class game_main extends Phaser.Scene {
    constructor() {
        super("game_main");
    }
    init(data){
        
        this.type=data.type;
        this.name=data.name;
        this.socket=data.socket;
        this.ship = undefined;
        this.isDie=data.isDie;
    }

    preload() {
        //this.load.image("ship", "assets/GameMain/Ship.png");
        this.load.image("tiles", "assets/GameMain/tiles.png");
        this.load.tilemapTiledJSON("seaMap", "assets/GameMain/SeaMapDemo0512.json");
        this.load.image("bullet", "assets/GameMain/bullet.png");
        this.load.spritesheet("explo_anims", "assets/GameMain/explo_anims.png", { frameWidth: 269 / 4, frameHeight: 64.5 });
        this.load.image("health","assets/GameMain/health_bar.png");
        this.load.image('island1',"assets/GameMain/island1.png");
        this.load.image('island2',"assets/GameMain/island2.png");
        this.load.image('island3',"assets/GameMain/island3.png");
        this.load.image('island4',"assets/GameMain/island4.png");
        this.load.image('island5',"assets/GameMain/island5.png");
        this.load.image('island6',"assets/GameMain/island6.png");
        this.load.image('island7',"assets/GameMain/island7.png");
        this.load.image('island8',"assets/GameMain/island8.png");
        this.load.image('island9',"assets/GameMain/island9.png");
        this.load.image('island10',"assets/GameMain/island10.png");
        this.load.image('stone','assets/GameMain/stone1.png');
        this.load.image('sea_tiles','assets/GameMain/sea_tiles.png');
        this.load.image('treasure','assets/GameMain/treasure.png');
        this.load.image('ground','assets/GameMain/ground.png');
        this.load.image("Ship","assets/GameMain/Ship.png");
        this.load.image("ship1","assets/GameMain/ship1.png");
        this.load.image("ship2","assets/GameMain/ship2.png");
        this.load.image("ship3","assets/GameMain/ship3.png");
        this.load.image("ship4","assets/GameMain/ship4.png");
        this.load.image("ship5","assets/GameMain/ship5.png");
        this.load.image("ship6","assets/GameMain/ship6.png");
        this.load.image("ship7","assets/GameMain/ship7.png");
        this.load.image("stone2",'assets/GameMain/stone2.png');

        //add chat
        this.load.html('chatForm', 'assets/chatForm/chatForm.html');


    }
    create() {

        var self = this;
        //this.socket=io();
        this.otherPlayers = this.physics.add.group();
        this.bullets = this.physics.add.group();
        this.texts=this.add.group();
        this.health_ships= this.add.group();
        this.score=0;
        this.list_player=[];
        this.text_rank=[];
        // solve chat event
        this.elementChat = this.add.dom(-470, 2210).createFromCache('chatForm').setScrollFactor(0).setScale(5);
        this.socket.on('addToChat_gameMain', function (data) {
            self.elementChat.getChildByID("chat-text").innerHTML += '<div>' + data + '</div>';
        });

        this.elementChat.getChildByID("chat-form").onsubmit = function (e) {
            e.preventDefault();
            if ((self.elementChat.getChildByID("chat-input").value).trim() !== '') {
                self.socket.emit('sendMsgToServer_gameMain', { name: self.name, text: self.elementChat.getChildByID("chat-input").value });
                self.elementChat.getChildByID("chat-input").value = '';
            }
        }

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyEnter.on('down', function(key, event) {
            if ((self.elementChat.getChildByID("chat-input").value).trim() !== '') {
                self.socket.emit('sendMsgToServer_gameMain', { name: self.name, text: self.elementChat.getChildByID("chat-input").value });
                self.elementChat.getChildByID("chat-input").value = '';
            }
        }, this);

        //end chat

        //start game main
        this.socket.emit("startGameMain",{name:this.name,type:this.type});
        
        this.play = {};
        
          if(this.isDie==false){
        
            this.socket.on('currentPlayersGameMain', function (player) {
                Object.keys(player).forEach(function (id) {
                    if (player[id].playersID === self.socket.id) { 
                        if(player[id].check==1){
                            self.list_player.push(player[id]);
    
                            addPlayer(self, player[id]);
                        }
                     
                        
                    } else {
                        if(player[id].check==1){
                            self.list_player.push(player[id]);
                            addOtherPlayer(self, player[id]);
                        }
                       
                    }
    
                });
            });

         }
        
        this.socket.on('newPlayerGameMain', function (playerInfo) {

            if(playerInfo.check==1){
                self.list_player.push(playerInfo);
                addOtherPlayer(self, playerInfo);
            }
            
        })
       
       
        function addPlayer(self, playerInfo) {
            self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, self.type).setScale(0.2);
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
            const other = self.otherPlayers.create(playerInfo.x,playerInfo.y,playerInfo.type).setImmovable().setScale(0.2);
            other.playersID = playerInfo.playersID;
            const text_ship = self.add.text(playerInfo.x+30,playerInfo.y-70,playerInfo.name,{fontSize:10, color:"#FFFFFF"});
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
        this.socket.on("disconnected_gameMain", function (id) {
            var check=0;
            //alert("disconnect");
            for(var i=0;i<self.list_player.length;i++){
                if(self.list_player[i].playersID==id&&self.list_player[i].check==1){
                    self.list_player.splice(i,1);
                }
            }
            
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
            self.socket.emit("need_load");
            
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
            
            const bullet1 = self.bullets.create(data.x,data.y,'bullet').setScale(0.03);
            bullet1.bulletID=data.bulletID;
            self.physics.velocityFromRotation(data.rotation+1.5,500,bullet1.body.velocity);
            //self.physics.add.collider(self.bullets,self.IslandLayer,self.collision,null,self);
            
            const bullet2 = self.bullets.create(data.x,data.y,'bullet').setScale(0.03);
            bullet2.bulletID=data.bulletID;
            self.physics.velocityFromRotation(data.rotation+800,500,bullet2.body.velocity);
            //self.physics.add.collider(self.bullets,self.IslandLayer,self.collision,null,self);

            const bullet3 = self.bullets.create(data.x,data.y,'bullet').setScale(0.03);
            bullet3.bulletID=data.bulletID;
            self.physics.velocityFromRotation(data.rotation-200,500,bullet3.body.velocity);
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
        this.player_left=0;
        // this.text_number = this.add.text(-470, 2210,data.num,{fontSize:32,color:"#FFFFFFF"});
        // this.text_number.setStyle()
        
        this.socket.on("current_on",function(data){
            self.player_left=data.num
         })

         this.socket.on("add_player",function(data){
             //alert("num")
            self.player_left=data.num;
            self.socket.emit("need_load");
         })

         this.socket.on("up_score",function(data){
             if(self.socket.id==data.id){
                 self.score+=100;
                 self.socket.emit("scored",{score:self.score});
             }
         })
        this.socket.on("print_score",function(data){
            self.score=data.score;
            for(var i=0;i<self.list_player.length;i++){
                if(self.list_player[i].playersID==data.playersID){
                    self.list_player[i].score=data.score;
                }
            }

        })
        this.socket.on("add_score",function(data){
            for(var i=0;i<self.list_player.length;i++){
                if(self.list_player[i].playersID==data.playersID){
                    self.list_player[i].score=data.score;
                }
            }
        })
        
       
        
        // add map

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
        const stone2=map.addTilesetImage("stone2");
        const ground=map.addTilesetImage('ground');
        this.SeaLayer = map.createLayer("sea_background", [natural_tile]);
        this.IslandLayer = map.createLayer("island", [natural_tile,island1,island2,island3,island4,island5,island6,island7,island8,island9,island10,stone,ground,stone2]);
        this.IslandLayer.setCollisionBetween(0, 20000);
       
        this.fireButtton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
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
        this.status = 1;
        this.status1 = 1;
         this.r3 = this.add.rectangle(100,200, 200, 100);
         this.r3.setStrokeStyle(5, 0x1a65ac);
         this.score_text=this.add.text(200,200,"SCORE: "+this.score,{font:48,color:"#FFFFFF"});
         this.text_number = this.add.text(300, 300,"PLayer left: "+this.player_left,{color:"#FFFFFFF"});
         this.lenght_text = 0;
         this.socket.on("load_rank",function(data){
            
            for(var i=0;i<self.text_rank.length;i++){
                self.text_rank[i].destroy();
            }
            var lenght =0;
            if(self.list_player.length>5){
                lenght=5;
            } else {
                lenght=self.list_player.length;
            }
            self.text_rank.splice(0,self.text_rank.length);
            for(var i=0;i<self.list_player.length;i++){
               self.text_rank[i]=self.add.text(data.x+150,data.y+i*20,self.list_player[i].name+"  "+self.list_player[i].score);
            }
            
       })
        
        
    }

    update() {
        this.cursors = this.input.keyboard.addKeys({
            up: 'up',
            down: 'down',
            left: 'left',
            right: 'right'
        }); // keys.up, keys.down, keys.left, keys.right
        this.text_number.setText("PLayer left: "+this.player_left);
        this.score_text.setText("SCORE: "+this.score);
        this.text_number.setStyle({color:"#FFFFFF"});
        this.list_player.sort((a,b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0));
        
        try {
            for(var i=0;i<this.text_rank.length;i++){
                this.text_rank[i].setText((i+1)+" "+this.list_player[i].name+"  "+this.list_player[i].score)
            }
        } catch (error) {
            
        }
        
        
        //this.cursors = this.input.keyboard.createCursorKeys();
        this.otherPlayers.children.iterate(function(child){
            this.minimap.ignore(child);
        },this)
        this.texts.children.iterate(function(child){
            this.minimap.ignore(child);
        },this)
        this.health_ships.children.iterate(function(child){
            this.minimap.ignore(child);
        },this)
        this.bullets.children.iterate(function(child){
           this.minimap.ignore(child);
        },this)
        
        //solve event ship
        if (this.ship&&this.text_ship&&this.health_ship&&this.text_rank) {
            
            
            if(this.health<=0){
                this.destroyShip(this.ship);
            }
            if(this.score>=100&&this.player_left==1){
                this.socket.emit('forceDisconnect');
                //window.location.reload();
                this.scene.start("mainHall",{name:this.name,socket:this.socket});
            }
            if (this.cursors.left.isDown&&this.status1==1) {
                this.ship.setAngularVelocity(-100);
                
            } else if (this.cursors.right.isDown&&this.status1==1) {
                this.ship.setAngularVelocity(100);

            } else {
                this.ship.setAngularVelocity(0);
            }
            if (this.cursors.up.isDown&&this.status1==1) {
                this.physics.velocityFromRotation(this.ship.rotation + 1.5, 200, this.ship.body.velocity);
            
            } else {
                this.ship.setVelocityX(0);
                this.ship.setVelocityY(0);
            }

            //alert(this.list_player.length);
            
            // make name and health follow ship
            this.text_ship.x=this.ship.x-20;
            this.text_ship.y=this.ship.y-70;
            this.health_ship.x=this.ship.x-50;
            this.health_ship.y=this.ship.y-80;
            this.minimap.scrollX=Phaser.Math.Clamp(this.ship.x,0,10000);
            this.r3.x=this.minimap.scrollX-250;
            this.minimap.scrollY=Phaser.Math.Clamp(this.ship.y,0,10000);
            this.r3.y=this.minimap.scrollY-240;
            this.text_number.x=this.ship.x+200;
            this.text_number.y=this.ship.y-250;
            this.score_text.x=this.ship.x-50;
            this.score_text.y=this.ship.y-250;
            for(var i=0;i<this.list_player.length;i++){
                if(this.text_rank[i]){
                    this.text_rank[i].x=this.ship.x+200;
                    this.text_rank[i].y=this.ship.y-220+i*25;
                }
                
            }
             //fire button
            if (Phaser.Input.Keyboard.JustDown(this.fireButtton)&&this.status==1) {
                console.log("enter");
                this.socket.emit("fire",{x: this.ship.x, y: this.ship.y, z: this.ship.rotation});
                this.status=0;
                this.status1=0;
                this.time.addEvent({

                    callback: function () {
                        this.status = 1;
                    },
                    callbackScope: this,
                    delay: 1000,
                    repeat: 0
                });

                this.time.addEvent({

                    callback: function () {
                        this.status1 = 1;
                    },
                    callbackScope: this,
                    delay: 300,
                    repeat: 0
                });


            }
            
            //check movement of player
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

            // solve event of bullet
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

    //collision  with bullet and map
    collision(bullet, map) {
        //bullet.disableBody(true, true);
        bullet.destroy();
        var explo = this.physics.add.sprite(bullet.x, bullet.y, "explo_anims").setScale(0.4);
        explo.anims.play("explo", true);
        try {
            this.time.addEvent({

                callback: function () {
                    explo.anims.stop("explo");
                    explo.disableBody(true, true);
                },
                callbackScope: this,
                delay: 1000,
                repeat: 0
            });
        } catch (error) {
            
        }
        

    }
    
    //event attack ship between main ship and bullet
    attack_ship(ship,bullet){
    
        //bullet.disableBody(true, true);
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
                this.socket.emit('destroy',{id:bullet.bulletID});
            }
            
        }
        this.socket.emit('dame');
    }


    // event attack between other ship and bullet
    attackship(ship,bullet){
        
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

    // destroy main ship
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
       
         this.socket.emit('forceDisconnect');
         //window.location.reload();
         this.scene.start("mainHall",{name:this.name,socket:this.socket});
        
    }

    //destroy other ship
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