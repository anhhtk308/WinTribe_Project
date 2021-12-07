class matchingGame extends Phaser.Scene {
    constructor() {
        super("matchingGame");
    }

    init(data) {
        this.socket = data.socket;
    }

    preload() {
        //preload
        // var progress = this.add.graphics();
        // this.load.on('progress', function(value) {
        //     progress.clear();
        //     progress.fillStyle(0xffde00, 1);
        //     //progress.fillRect(0, 270, 800 * value, 60);
        //     progress.fillRect(0, 270, 800 * value, 25);

        // });
        // this.load.on('complete', function() {
        //     progress.destroy();
        // });

        //load form input
        this.load.html('answerform', 'assets/matchingGame/answerForm/answerForm.html');
        this.load.css('answerCss', 'assets/matchingGame/answerForm/answerForm.css');

        //image
        this.load.image("background", "assets/matchingGame/background_start_quiz.jpg");
        this.load.image("frame_question", "assets/matchingGame/1.png");
        this.load.image("check_btn", "assets/matchingGame/check_btn.png");
        this.load.image("skip_btn", "assets/matchingGame/skip_btn.png");
        this.load.image("start_button", "assets/matchingGame/start_btn.png");
        this.load.image("quit_btn", "assets/matchingGame/quit_btn.png");
        this.load.image("message", "assets/matchingGame/frame2.png");
        this.load.image("logo", "assets/matchingGame/logo_quiz.png");
        this.load.image("icon_close", "assets/matchingGame/icon_close_1.png");
        this.load.image("frame_result", "assets/matchingGame/background.png");
        this.load.image("close_gift", "assets/matchingGame/close_gift.png");
        this.load.image("open_gift", "assets/matchingGame/open_gift.png");
        this.load.image("particle", "assets/matchingGame/particle.png");
        this.load.image("icon_replay", "assets/matchingGame/icon_replay.png");
        this.load.image("icon_home", "assets/matchingGame/icon_home.png");

        //audio
        this.load.audio("true_sound", "assets/matchingGame/true_sound.mp3");
        this.load.audio("false_sound", "assets/matchingGame/false_sound.mp3");
        this.load.audio("button_sound", "assets/matchingGame/audio-button.mp3");

    }
    create() {
        //alert(this.socket.id);
        var self = this;
        this.score = 0;
        this.socket.emit('startMatchingGame', this.socket.id);
        this.socket.on('getPlayer', function(data) {
            self.score = data.gold;
        });

        //--------------------------------------------------------------
        var element = this.add.dom(400, 340).createFromCache('answerform').setVisible(false);
        this.ele = element;
        element.addListener('keydown');
        element.on('keydown', () => {
            element.getChildByName('nameField').style.border = '1px solid black';
        });
        // this.socket = io();
        // console.log(this.socket);
        this.background = this.add.image(0, 0, "background").setOrigin(0, 0).setScale(1);
        //sound
        this.true_sound = this.sound.add("true_sound", { loop: false });
        this.false_sound = this.sound.add("false_sound", { loop: false });
        this.button_sound = this.sound.add("button_sound", { loop: false });
        //data
        var questions = [{
                id: 1,
                question: "c/ư/b/ậ/t/v/ợ",
                answer: "Vượt bậc"
            },
            {
                id: 2,
                question: "a/c/c/o/u/n",
                answer: "Con cua"
            }, {
                id: 3,
                question: "c/í/ố/t/v",
                answer: "Ốc vít"
            }, {
                id: 4,
                question: "ề/h/c/h/a/ú",
                answer: "Chúa hề"
            }, {
                id: 5,
                question: "o/ã/h/ò/n/h/a",
                answer: "Hòa hoãn"
            }, {
                id: 6,
                question: "b/y/l/a/i",
                answer: "Ly bia"
            }, {
                id: 7,
                question: "s/ú/c/c/ố",
                answer: "Cú sốc"
            }, {
                id: 8,
                question: "c/đ/c/á/ố",
                answer: "Đá cốc"
            }, {
                id: 9,
                question: "t/u/y/ệ/h/ế/n/ị",
                answer: "Nhiệt huyết"
            }, {
                id: 10,
                question: "c/C/y/a/a/h/u",
                answer: "Chua cay"
            }, {
                id: 11,
                question: "g/ò/v/ồ/n/r/i",
                answer: "Vòi rồng"
            }, {
                id: 12,
                question: "ư/i/b/ớ/m/b/ơ",
                answer: "Bơi bướm"
            }, {
                id: 13,
                question: "n/ệ/đ/i/t/ộ/c",
                answer: "Cột điện"
            }, {
                id: 14,
                question: "t/h/à/b/ờ/n",
                answer: "Bàn thờ"
            }, {
                id: 15,
                question: "x/ồ/g/à",
                answer: "Xà gồ"
            }, {
                id: 16,
                question: "g/a/n/n/o",
                answer: "Ngoan"
            }, {
                id: 17,
                question: "c/i/a/n/t/o/r",
                answer: "Con trai"
            }, {
                id: 18,
                question: "c/ù/b/ọ/đ/m",
                answer: "Đùm bọc"
            }, {
                id: 19,
                question: "g/ạ/đ/i/i/a",
                answer: "Đại gia"
            }, {
                id: 20,
                question: "m/ó/n/g/à/h/x",
                answer: "Hàng xóm"
            }, {
                id: 21,
                question: "n/g/a/ự/ô",
                answer: "Ngựa ô"
            }
        ];

        //time and score
        this.frame_question = this.add.image(400, 300, 'frame_question').setVisible(false);
        this.textTime = this.add.text(100, 73, 'Time: 45s', { fontSize: 25, color: '#fff' }).setVisible(false);
        ///

        this.scoreText = this.add.text(540, 73, 'Gold: ' + this.score, { fontSize: 25, color: '#fff' }).setVisible(false);

        //frameresult, gift
        this.frame_result = this.add.image(400, 300, 'frame_result').setVisible(false);
        this.open_gift = this.add.image(400, 300, 'open_gift').setScale(0.3).setVisible(false);
        this.close_gift = this.add.image(400, -100, 'close_gift').setScale(0.24).setVisible(false);
        this.iconReplay = this.add.image(800, 500, 'icon_replay').setScale(0.76).setVisible(false);
        this.iconHome = this.add.image(0, 506, 'icon_home').setScale(0.8).setVisible(false);
        this.textGameOver = this.add.text(280, 70, 'Game Over', { fontSize: 40, fill: "#000", stroke: 'yellow', strokeThickness: 5 }).setVisible(false);
        this.result = this.add.text(280, 150, 'Gold: ', { fontSize: 40, fill: "#000", stroke: 'yellow', strokeThickness: 5 }).setVisible(false);
        this.iconHome.setInteractive();
        this.iconReplay.setInteractive();

        //text in game
        this.textEnterAnswer = this.add.text(210, 250, '\nEnter your answer:', { font: '20px Courier', fill: '#fff' }).setVisible(false);
        this.iconClose = this.add.image(720, 150, 'icon_close').setScale(0.4).setVisible(false);
        this.iconClose.setInteractive();
        this.skipBtn = this.add.sprite(800, 418, 'skip_btn').setScale(0.5).setVisible(false);
        this.checkBtn = this.add.sprite(0, 418, 'check_btn').setScale(0.5).setVisible(false);
        //quit,start
        this.startBtn = this.add.sprite(675, 600, 'start_button').setScale(0.8);
        this.tweens.add({ targets: this.startBtn, y: 500, duration: 500, ease: 'Back' });
        this.quitBtn = this.add.sprite(485, 600, 'quit_btn').setScale(0.8);
        this.tweens.add({ targets: this.quitBtn, y: 500, duration: 500, ease: 'Back' });

        this.checkBtn.setInteractive();
        this.skipBtn.setInteractive();
        this.startBtn.setInteractive();
        this.quitBtn.setInteractive();

        //guide
        this.textPopup = this.add.text(415, 220, '').setWordWrapWidth(350).setVisible(false);
        this.typewriteTextWrapped('Hello, Chào mừng bạn đã đến với trò chơi ghép chữ, phí là 5$, bạn có thời gian là 60s để trả lời các câu hỏi, mỗi câu đúng sẽ được 4$, phí skip là 2$, bấm nút start để bắt đầu chơi nào!');
        this.textPopup.setVisible(true);

        //clone list
        this.lstQuestion = questions.slice();
        var currentQuestion = {};

        this.startBtn.on("pointerdown", () => {
            // this.socket.on('startGame2', function(questions) {
            //     console.log("start");
            // });

            currentQuestion = this.startGame(this.randomQuestion(this.lstQuestion));
            this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
            this.keyEnter.on('down', function(key, event) {
                currentQuestion = this.checkBtnHandle(currentQuestion);
            }, this);
        });

        //message
        this.message = this.add.image(400, -150, 'message').setScale(0.7);

        //skip
        this.skipBtn.on("pointerdown", () => {
            this.button_sound.play();
            if (this.score >= 2) {
                this.lstQuestion.splice(this.lstQuestion.indexOf(currentQuestion), 1);
                this.questionDisplay.setVisible(false);
                //handle
                if (this.lstQuestion.length === 0) {
                    this.lstQuestion = questions.slice();
                }
                currentQuestion = this.randomQuestion(this.lstQuestion);
                this.questionDisplay = this.add.text(330, 200, currentQuestion.question, { font: '30px Helvetica', color: "#fff" }).setVisible(true);
                element.getChildByName('nameField').value = "";
                this.score -= 2;
                this.scoreText.setText("Gold: " + this.score);
                this.animationAddSubScore('-2', '#3ff235');
            } else {
                //alert("k đủ xiền");
                this.tweens.add({ targets: this.message, y: 105, duration: 500, ease: 'Back' });
                this.time.delayedCall(2000, function() {
                    this.tweens.add({ targets: this.message, y: -150, duration: 500, ease: 'Back' });
                    //this.message.setVisible(false);
                }, [], this);

            }
        });

        //check
        this.checkBtn.on("pointerdown", () => {
            currentQuestion = this.checkBtnHandle(currentQuestion);
        });

        //iconClose
        this.iconClose.on("pointerdown", () => {
            this.handleTimeFinished();
        });

        //quitBtn
        this.quitBtn.on("pointerdown", () => {
            this.fadeOutScene();
        });

        //home
        this.iconHome.on("pointerdown", () => {
            this.fadeOutScene();
        });

        //replay
        this.iconReplay.on("pointerdown", () => {
            currentQuestion = this.startGame(this.randomQuestion(this.lstQuestion));
            this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
            this.keyEnter.on('down', function(key, event) {
                currentQuestion = this.checkBtnHandle(currentQuestion);
            }, this);
        });

    }

    update() {
        //this.scoreText.setText('Gold: ' + this.score);
        //time
        if (!this.timeEvent || this.duration <= 0) {
            return
        }
        const elapsed = this.timeEvent.getElapsed();
        const remaining = this.duration - elapsed;
        const minutes = remaining / 1000;
        this.textTime.text = "Time: " + minutes.toFixed(2) + "s";
    }
    typewriteText(text) {
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.textPopup.text += text[i]
                    ++i
            },
            repeat: length - 1,
            delay: 50
        })
    }
    typewriteTextWrapped(text) {
        const lines = this.textPopup.getWrappedText(text)
        const wrappedText = lines.join('\n\n')
        this.typewriteText(wrappedText)
    }
    timeStart(callback, duration = 60000 * 5) {
        this.timeStop();
        this.duration = duration;
        this.finishedCallback = callback;
        this.timeEvent = this.time.addEvent({
            delay: duration,
            callback: () => {
                this.timeStop();
                if (callback) callback();
            }
        })
    }
    timeStop() {
        if (this.timeEvent) {
            this.timeEvent.destroy();
            this.timeEvent = undefined;
        }
    }
    handleTimeFinished() {
        this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.showHideResult(true);
        this.showHideQuestion(false);
        this.open_gift.setVisible(false);
        this.questionDisplay.setVisible(false);
        this.textEnterAnswer.setVisible(false);
        this.logo.setVisible(false);
        this.scoreText.setVisible(false);
        this.ele.setVisible(false);
        this.tweens.add({ targets: this.iconReplay, x: 550, duration: 500, ease: 'Back' });
        this.tweens.add({ targets: this.iconHome, x: 250, duration: 500, ease: 'Back' });
        this.close_gift.setInteractive();
        this.textGameOver.setVisible(true);
        //fade
        this.cameras.main.fadeIn(250);
        this.time.delayedCall(250, function() {
            this.button_sound.play();
        }, [], this);

        if (this.score > 0) {
            this.tweens.add({ targets: this.close_gift, y: 300, duration: 500, delay: 250, ease: 'Back' });
            this.close_gift.setVisible(true);
            this.tweens.add({ targets: this.close_gift, angle: this.close_gift.angle - 2, duration: 1000, ease: 'Sine.easeInOut' });
            this.tweens.add({ targets: this.close_gift, angle: this.close_gift.angle + 4, duration: 2000, ease: 'Sine.easeInOut', yoyo: 1, loop: -1, delay: 1000 });
            this.close_gift.on("pointerdown", () => {
                this.close_gift.setVisible(false);
                this.open_gift.setVisible(true);
                this.gameOverScoreTween();
            });
        } else {
            this.result.setText('Gold: 0');
            this.close_gift.y = 300;
            this.close_gift.setVisible(true);
        }
    }
    randomQuestion(lstQuestion) {
        let randomQes = Math.floor(Math.random() * lstQuestion.length);
        return lstQuestion[randomQes];
    }
    checkAnswer(input, answer) {
        if (input.toLowerCase() === answer.toLowerCase()) {
            return true;
        } else {
            return false;
        }
    }

    animationAddSubScore(text, color) {
        var randX = Phaser.Math.Between(200, 600);
        var randY = Phaser.Math.Between(200, 400);
        var pointsAdded = this.add.text(randX, randY, text, { font: '30px ', fill: color, stroke: '#fff', strokeThickness: 10 });
        pointsAdded.setOrigin(0.5, 0.5);
        this.tweens.add({ targets: pointsAdded, alpha: 0, y: randY - 50, duration: 1000, ease: 'Linear' });
        this.cameras.main.shake(100, 0.01, true);
    }

    gameOverScoreTween() {
        if (this.score) {
            this.pointsTween = this.tweens.addCounter({
                from: 0,
                to: this.score,
                duration: 800,
                delay: 250,
                onUpdateScope: this,
                onCompleteScope: this,
                onUpdate: function() {
                    this.result.setText('Gold: ' + Math.floor(this.pointsTween.getValue()));
                },
                onComplete: function() {
                    var emitter = this.add.particles('particle').setScale(1).createEmitter({
                        x: this.result.x + 30,
                        y: this.result.y,
                        speed: { min: -600, max: 600 },
                        angle: { min: 0, max: 360 },
                        scale: { start: 0.5, end: 3 },
                        blendMode: 'ADD',
                        active: true,
                        lifespan: 2000,
                        gravityY: 1000,
                        quantity: 250
                    });
                    emitter.explode();
                }
            });
        }
    }

    fadeOutScene() {
        this.cameras.main.fade(250);
        this.time.delayedCall(250, function() {
            this.button_sound.play();
            this.scene.start('mainHall');
        }, [], this);
    }

    checkBtnHandle(currentQuestion) {
        if (this.checkAnswer(this.ele.getChildByName('nameField').value, currentQuestion.answer)) {
            this.true_sound.play();
            this.lstQuestion.splice(this.lstQuestion.indexOf(currentQuestion), 1);
            this.questionDisplay.setVisible(false);
            //handle
            if (this.lstQuestion.length === 0) {
                this.lstQuestion = questions.slice();
            }
            currentQuestion = this.randomQuestion(this.lstQuestion);
            this.questionDisplay = this.add.text(330, 200, currentQuestion.question, { font: '30px Helvetica', color: "#fff" }).setVisible(true);
            this.ele.getChildByName('nameField').value = "";
            this.score += 4;
            this.scoreText.setText("Gold: " + this.score);
            this.animationAddSubScore('+4', '#ffde00');
            return currentQuestion;
        } else {
            this.false_sound.play();
            //alert('fail: ' + currentQuestion.answer + " " + this.ele.getChildByName('nameField').value)
            this.ele.getChildByName('nameField').style.border = '2px solid red';
        }
        return currentQuestion;
    }

    startGame(currentQuestion) {
        if (this.score >= 5) {
            //result
            this.ele.getChildByName('nameField').style.border = '1px solid black';
            this.showHideResult(false);
            this.showHideQuestion(true);

            this.startBtn.setVisible(false);
            this.quitBtn.setVisible(false);
            this.textPopup.setVisible(false);
            this.score -= 5;
            // this.scoreText = this.add.text(540, 73, 'Gold: ' + this.score, { fontSize: 25, color: '#fff' }).setVisible(true);
            this.scoreText.setVisible(true);
            this.scoreText.setText('Gold: ' + this.score);
            this.quitBtn.setVisible(false);
            this.tweens.add({ targets: this.skipBtn, x: 540, duration: 500, ease: 'Back' });
            this.tweens.add({ targets: this.checkBtn, x: 260, duration: 500, ease: 'Back' });
            this.ele.setVisible(true);

            //logo
            this.logo = this.add.sprite(395, 550, 'logo').setScale(0.3).setVisible(true);
            this.logo.setOrigin(0.5);
            this.tweens.add({ targets: this.logo, angle: this.logo.angle - 2, duration: 1000, ease: 'Sine.easeInOut' });
            this.tweens.add({ targets: this.logo, angle: this.logo.angle + 4, duration: 2000, ease: 'Sine.easeInOut', yoyo: 1, loop: -1, delay: 1000 });

            //time
            this.timeStart(this.handleTimeFinished.bind(this), 60000);

            //question
            this.questionDisplay = this.add.text(330, 200, currentQuestion.question, { font: '30px Helvetica', color: "#fff" });
            //this.questionDisplay.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
            //this.setGradientText(this.questionDisplay);

            //enter answer
            this.textEnterAnswer.setVisible(true);
            //fade
            this.cameras.main.fadeIn(250);
            this.time.delayedCall(250, function() {
                this.button_sound.play();
            }, [], this);

            return currentQuestion;
        } else {
            this.tweens.add({ targets: this.message, y: 105, duration: 500, ease: 'Back' });
            this.time.delayedCall(2000, function() {
                this.tweens.add({ targets: this.message, y: -150, duration: 500, ease: 'Back' });
            }, [], this);
        }
        return currentQuestion;
    }

    setGradientText(text) {
        //  Apply the gradient fill.
        const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
        gradient.addColorStop(1, '#2F195A');
        gradient.addColorStop(0.5, '#A72A7B');
        gradient.addColorStop(0, '#F5BBE7');
        text.setFill(gradient);
    }

    showHideResult(show) {
        this.frame_result.setVisible(show);
        this.iconReplay.setVisible(show);
        this.iconHome.setVisible(show);
        this.close_gift.setVisible(show);
        this.open_gift.setVisible(show);
        this.result.setVisible(show);
        this.textGameOver.setVisible(show);
    }

    showHideQuestion(show) {
        this.frame_question.setVisible(show);
        this.iconClose.setVisible(show);
        this.skipBtn.setVisible(show);
        this.checkBtn.setVisible(show);
        this.textTime.setVisible(show);
    }

}