// import man1 from './man1';
class man2 extends Phaser.Scene {
    constructor() {
        super("man2");
    }

    preload() {
        //load form input
        this.load.html('answerform', 'assets/matchingGame/answerForm/answerForm.html');
        this.load.css('answerCss', 'assets/matchingGame/answerForm/answerForm.css');

        //image
        this.load.image("bg", "assets/matchingGame/background_start_quiz.jpg");
        this.load.image("frame_question", "assets/matchingGame/1.png");
        this.load.image("check_btn", "assets/matchingGame/check_btn.png");
        this.load.image("skip_btn", "assets/matchingGame/skip_btn.png");
        this.load.image("start_btn", "assets/matchingGame/start_btn.png");
        this.load.image("quit_btn", "assets/matchingGame/quit_btn.png");
        this.load.image("message", "assets/matchingGame/message.png");
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
        var element = this.add.dom(400, 340).createFromCache('answerform').setVisible(false);
        this.ele = element;
        element.addListener('keydown');
        element.on('keydown', () => {
            element.getChildByName('nameField').style.border = '1px solid black';
        });
        // this.socket = io();
        // console.log(this.socket);
        this.background = this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(1);
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
            }
        ];

        //time and score
        this.frame_question = this.add.image(400, 300, 'frame_question').setVisible(false);
        this.textTime = this.add.text(100, 73, 'Time: 45s', { fontSize: 25, color: '#fff' }).setVisible(false);
        this.score = 25;

        //frameresult, gift
        this.frame_result = this.add.image(400, 300, 'frame_result').setVisible(false);
        this.open_gift = this.add.image(400, 300, 'open_gift').setScale(0.3).setVisible(false);
        this.close_gift = this.add.image(400, -100, 'close_gift').setScale(0.24).setVisible(false);
        this.iconReplay = this.add.image(800, 500, 'icon_replay').setScale(0.76).setVisible(false);
        this.iconHome = this.add.image(0, 506, 'icon_home').setScale(0.8).setVisible(false);
        this.iconHome.setInteractive();
        this.iconReplay.setInteractive();

        //text in game
        this.textEnterAnswer = this.add.text(210, 250, '\nEnter your answer:', { font: '20px Courier', fill: '#fff' }).setVisible(false);
        this.iconClose = this.add.image(720, 150, 'icon_close').setScale(0.4).setVisible(false);
        this.iconClose.setInteractive();
        this.skipBtn = this.add.sprite(800, 418, 'skip_btn').setScale(0.5).setVisible(false);
        this.checkBtn = this.add.sprite(0, 418, 'check_btn').setScale(0.5).setVisible(false);
        //quit,start
        this.startBtn = this.add.sprite(675, 600, 'start_btn').setScale(0.8);
        this.tweens.add({ targets: this.startBtn, y: 500, duration: 500, ease: 'Back' });
        this.quitBtn = this.add.sprite(485, 600, 'quit_btn').setScale(0.8);
        this.tweens.add({ targets: this.quitBtn, y: 500, duration: 500, ease: 'Back' });

        this.checkBtn.setInteractive();
        this.skipBtn.setInteractive();
        this.startBtn.setInteractive();
        this.quitBtn.setInteractive();

        //guide
        this.textPopup = this.add.text(415, 220, '').setWordWrapWidth(350).setVisible(false);
        this.typewriteTextWrapped('Hello, Chào mừng bạn đã đến với trò chơi ghép chữ, phí là 5 đồng, bạn có thời gian là 5ph để trả lời các câu hỏi, mỗi câu đúng sẽ được 4 đồng, bấm nút start để bắt đầu chơi nào!');
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
        this.message = this.add.image(400, -100, 'message').setScale(1);

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
                this.tweens.add({ targets: this.message, y: 73, duration: 500, ease: 'Back' });
                this.time.delayedCall(2000, function() {
                    this.tweens.add({ targets: this.message, y: -100, duration: 500, ease: 'Back' });
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
        });
    }

    update() {
        //time
        if (!this.timeEvent || this.duration <= 0) {
            return
        }
        const elapsed = this.timeEvent.getElapsed();
        const remaining = this.duration - elapsed;
        const seconds = remaining / 60000;
        this.textTime.text = "Time: " + seconds.toFixed(2) + "m";

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
    distanceToPointer(displayObject, pointer) {
        this._dx = displayObject.x - pointer.x;
        this._dy = displayObject.y - pointer.y;
        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);
    }
    moveToXY(displayObject, x, y, speed) {
        var _angle = Math.atan2(y - displayObject.y, x - displayObject.x);
        var x = Math.cos(_angle) * speed;
        var y = Math.sin(_angle) * speed;
        return { x: x, y: y };
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
        this.keyEnter.removeListener('down');
        this.result = this.add.text(320, 150, 'Time out\nGold: ', { fontSize: 35, color: '#fff' });
        this.textTime.setVisible(false);
        this.questionDisplay.setVisible(false);
        this.textEnterAnswer.setVisible(false);
        this.skipBtn.setVisible(false);
        this.checkBtn.setVisible(false);
        this.logo.setVisible(false);
        this.frame_question.setVisible(false);
        this.frame_result.setVisible(true);
        this.iconClose.setVisible(false);
        this.scoreText.setVisible(false);
        this.ele.setVisible(false);
        this.iconReplay.setVisible(true);
        this.tweens.add({ targets: this.iconReplay, x: 550, duration: 500, ease: 'Back' });
        this.iconHome.setVisible(true);
        this.tweens.add({ targets: this.iconHome, x: 250, duration: 500, ease: 'Back' });
        this.close_gift.setInteractive();
        //fade
        this.cameras.main.fadeIn(250);
        this.time.delayedCall(250, function() {
            this.button_sound.play();
        }, [], this);

        if (this.score > 0) {
            this.tweens.add({ targets: this.close_gift, y: 300, duration: 500, delay: 250, ease: 'Back' });
            this.close_gift.setVisible(true);
            this.close_gift.on("pointerdown", () => {
                this.close_gift.setVisible(false);
                this.open_gift.setVisible(true);
                this.gameOverScoreTween();
            });
        } else {
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
                    this.result.setText('Time out\nGold: ' + Math.floor(this.pointsTween.getValue()));
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
            this.scene.start('man1');
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
            alert('fail: ' + currentQuestion.answer + " " + this.ele.getChildByName('nameField').value)
            this.ele.getChildByName('nameField').style.border = '2px solid red';
        }
        return currentQuestion;
    }

    startGame(currentQuestion) {
        if (this.score >= 5) {
            this.startBtn.setVisible(false);
            this.quitBtn.setVisible(false);
            this.textPopup.setVisible(false);
            this.score -= 5;
            this.scoreText = this.add.text(540, 73, 'Gold: ' + this.score, { fontSize: 25, color: '#fff' }).setVisible(true);
            this.skipBtn.setVisible(true);
            this.iconClose.setVisible(true);
            this.checkBtn.setVisible(true);
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
            this.textTime.setVisible(true);
            this.timeStart(this.handleTimeFinished.bind(this), 60000 * 5);

            //question
            this.frame_question.setVisible(true);
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
            this.tweens.add({ targets: this.message, y: 73, duration: 500, ease: 'Back' });
            this.time.delayedCall(2000, function() {
                this.tweens.add({ targets: this.message, y: -100, duration: 500, ease: 'Back' });
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

}