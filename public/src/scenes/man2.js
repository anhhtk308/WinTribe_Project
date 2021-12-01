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

        //audio
        this.load.audio("true_sound", "assets/matchingGame/true_sound.mp3");
        this.load.audio("false_sound", "assets/matchingGame/false_sound.mp3");
        this.load.audio("button_sound", "assets/matchingGame/audio-button.mp3");

    }
    create() {
        var element = this.add.dom(400, 340).createFromCache('answerform').setVisible(false);
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
        this.score = 10;
        //text in game
        this.textEnterAnswer = this.add.text(210, 250, '\nEnter your answer:', { font: '20px Courier', fill: '#fff' }).setVisible(false);
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

        //clone list
        this.lstQuestion = questions.slice();

        //this.btn_test.setInteractive();
        var currentQuestion = this.randomQuestion(this.lstQuestion);

        this.startBtn.on("pointerdown", () => {
            // this.socket.on('startGame2', function(questions) {
            //     console.log("start");
            // });
            if (this.score >= 5) {
                this.startBtn.setVisible(false);
                this.quitBtn.setVisible(false);
                this.textPopup.setVisible(false);
                this.score -= 5;
                this.scoreText = this.add.text(540, 73, 'Gold: ' + this.score, { fontSize: 25, color: '#fff' }).setVisible(true);
                this.skipBtn.setVisible(true);
                this.checkBtn.setVisible(true);
                this.quitBtn.setVisible(false);
                this.tweens.add({ targets: this.skipBtn, x: 540, duration: 500, ease: 'Back' });
                this.tweens.add({ targets: this.checkBtn, x: 260, duration: 500, ease: 'Back' });
                element.setVisible(true);

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
            } else {
                this.tweens.add({ targets: this.message, y: 73, duration: 500, ease: 'Back' });
                this.time.delayedCall(2000, function() {
                    this.tweens.add({ targets: this.message, y: -100, duration: 500, ease: 'Back' });
                }, [], this);
            }
        });

        //message
        this.message = this.add.image(400, -100, 'message').setScale(1);

        //next
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
            if (this.checkAnswer(element.getChildByName('nameField').value, currentQuestion.answer)) {
                this.true_sound.play();
                this.lstQuestion.splice(this.lstQuestion.indexOf(currentQuestion), 1);
                this.questionDisplay.setVisible(false);
                //handle
                if (this.lstQuestion.length === 0) {
                    this.lstQuestion = questions.slice();
                }
                currentQuestion = this.randomQuestion(this.lstQuestion);
                this.questionDisplay = this.add.text(330, 200, currentQuestion.question, { font: '30px Helvetica', color: "#fff" }).setVisible(true);
                element.getChildByName('nameField').value = "";
                this.score += 4;
                this.scoreText.setText("Gold: " + this.score);
            } else {
                this.false_sound.play();
                element.getChildByName('nameField').style.border = '2px solid red';
            }
        });
        // this.btn_test.on('pointerdown', function() {
        //     this.cameras.main.fade(250);
        //     this.time.delayedCall(250, function() {
        //         this.button_sound.play();
        //         this.scene.start('man1');
        //     }, [], this);
        // }, this);
        //enter
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.keyEnter.on('down', function(key, event) {
            if (this.checkAnswer(element.getChildByName('nameField').value, currentQuestion.answer)) {
                this.true_sound.play();
                this.lstQuestion.splice(this.lstQuestion.indexOf(currentQuestion), 1);
                this.questionDisplay.setVisible(false);
                //handle
                if (this.lstQuestion.length === 0) {
                    this.lstQuestion = questions.slice();
                }
                currentQuestion = this.randomQuestion(this.lstQuestion);
                this.questionDisplay = this.add.text(330, 200, currentQuestion.question, { font: '30px Helvetica', color: "#fff" }).setVisible(true);
                element.getChildByName('nameField').value = "";
                this.score += 4;
                this.scoreText.setText("Gold: " + this.score);
            } else {
                this.false_sound.play();
                element.getChildByName('nameField').style.border = '2px solid red';
            }
        }, this);

        //guide
        this.textPopup = this.add.text(415, 220, '').setWordWrapWidth(350).setVisible(false);
        this.typewriteTextWrapped('Hello, Chào mừng bạn đã đến với trò chơi ghép chữ, phí là 5 đồng, bạn có thời gian là 5ph để trả lời các câu hỏi, mỗi câu đúng sẽ được 4 đồng, bấm nút start để bắt đầu chơi nào!');
        this.textPopup.setVisible(true);

        //quitBtn
        this.quitBtn.on("pointerdown", () => {
            this.cameras.main.fade(250);
            this.time.delayedCall(250, function() {
                this.button_sound.play();
                this.scene.start('man1');
            }, [], this);
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
        this.add.text(320, 250, 'Hết giờ\nGold: ' + this.score, { fontSize: 35, color: 'red' });
        this.textTime.setVisible(false);
        this.questionDisplay.setVisible(false);
        this.textEnterAnswer.setVisible(false);
        this.btn_next.setVisible(false);
        this.btn_check.setVisible(false);
        this.scoreText.setVisible(false);
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

    setGradientText(text) {
        //  Apply the gradient fill.
        const gradient = text.context.createLinearGradient(0, 0, 0, text.height);
        gradient.addColorStop(1, '#2F195A');
        gradient.addColorStop(0.5, '#A72A7B');
        gradient.addColorStop(0, '#F5BBE7');
        text.setFill(gradient);
    }

}