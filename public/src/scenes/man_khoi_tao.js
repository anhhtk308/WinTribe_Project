// import man1 from './man1';
class man_khoi_tao extends Phaser.Scene {
    constructor() {
        super("man_khoi_tao");
    }
    preload() {
        this.load.html('nameForm', 'assets/nameForm/nameForm.html');
        this.load.css('answerCss', 'assets/nameForm/nameForm.css');
        this.load.image("ship", "assets/GameMain/Ship.png");
        this.load.image("tiles", "assets/GameMain/tiles.png");
        this.load.tilemapTiledJSON("SeaMapDemo23114", "assets/GameMain/SeaMapDemo23114.json");
        this.load.image("back_ground","assets/GameMain/back_gound_gamemain.jpg")
        this.load.image("start","assets/GameMain/start.png");
        this.load.image("Ship","assets/GameMain/Ship.png");
        this.load.image("ship1","assets/GameMain/ship1.png");
        this.load.image("ship2","assets/GameMain/ship2.png");
        this.load.image("ship3","assets/GameMain/ship3.png");
        this.load.image("ship4","assets/GameMain/ship4.png");
        this.load.image("ship5","assets/GameMain/ship5.png");
        this.load.image("ship6","assets/GameMain/ship6.png");
        this.load.image("ship7","assets/GameMain/ship7.png");

    }
    create() {


        
        this.add.image(400,300,"back_ground").setScale(0.42,0.5);
        this.text = this.add.image(600,300,"start").setScale(0.8);
        this.ships= this.add.group();
        this.type_ship=["Ship","ship1","ship2","ship3","ship4","ship5","ship6","ship7"];
        this.ship= [];
        var ship_x=200;
        var ship_y=200;
        var count=0;
        this.check=0;
        this.type="";
        this.i=0;
        while(this.i<8){
            if(this.i>=4){
                ship_y=400;
            }
            if(count==4){
                count=0;
            }
            
            this.ship[this.i]=this.ships.create(ship_x+count*150,ship_y,this.type_ship[this.i]).setScale(0.3);
            this.ship[this.i].alpha=0.5;
            count++;
            this.i++;
        }

        
        this.ship[0].setInteractive();
            this.ship[0].on("pointerdown",()=>{
                this.type=this.type_ship[0];
                this.ship[0].alpha=1;
                for(var j=0;j<8;j++){
                    if(j!=0){
                        this.ship[j].alpha=0.5;
                    }
                }
            })
        this.ship[1].setInteractive();
            this.ship[1].on("pointerdown",()=>{
               
                this.type=this.type_ship[1]
                this.ship[1].alpha=1;
                for(var j=0;j<8;j++){
                    if(j!=1){
                        this.ship[j].alpha=0.5;
                    }
                }
            })
        this.ship[2].setInteractive();
            this.ship[2].on("pointerdown",()=>{
               
                this.type=this.type_ship[2]
                this.ship[2].alpha=1;
                for(var j=0;j<8;j++){
                    if(j!=2){
                        this.ship[j].alpha=0.5;
                    }
                }
            })
        this.ship[3].setInteractive();
            this.ship[3].on("pointerdown",()=>{
               
                this.type=this.type_ship[3]
                this.ship[3].alpha=1;
                for(var j=0;j<8;j++){
                    if(j!=3){
                        this.ship[j].alpha=0.5
                    }
                }
            })
        this.ship[4].setInteractive();
            this.ship[4].on("pointerdown",()=>{
               
                this.type=this.type_ship[4]
                this.ship[4].alpha=1;
                for(var j=0;j<8;j++){
                    if(j!=4){
                        this.ship[j].alpha=0.5;
                    }
                }
            })
        this.ship[5].setInteractive();
            this.ship[5].on("pointerdown",()=>{
               
                this.type=this.type_ship[5]
                this.ship[5].alpha=1;
                for(var j=0;j<8;j++){
                    if(j!=5){
                        this.ship[j].alpha=0.5;
                    }
                }
            })
        this.ship[6].setInteractive();
            this.ship[6].on("pointerdown",()=>{
               
                this.type=this.type_ship[6]
                this.ship[6].alpha=1;
                for(var j=0;j<8;j++){
                    if(j!=6){
                        this.ship[j].alpha=0.5;
                    }
                }
            })
        this.ship[7].setInteractive();
            this.ship[7].on("pointerdown",()=>{
               
                this.type=this.type_ship[7]
                this.ship[7].alpha=1;
                for(var j=0;j<8;j++){
                    if(j!=7){
                        this.ship[j].alpha=0.5;
                    }
                }
            })
        this.text.setInteractive();
        this.elementName = this.add.dom(400, 300).createFromCache('nameForm');
        this.text.on("pointerdown", () => {
            if ((this.elementName.getChildByName('nameField').value).trim().length > 0&&this.type!="") {
                this.cameras.main.fade(250);
                this.time.delayedCall(250, function() {
                    this.scene.start('game_main', { name: this.elementName.getChildByName('nameField').value,type:this.type });
                }, [], this);
            }
        });
    }

    update() {

    }

}