// import man1 from './man1';
class man2 extends Phaser.Scene {
    constructor() {
        super("man2");
    }

    preload() {
        this.load.image("bg", "assets/bg_question_1.jpg");
        this.load.image("popup", "assets/popup.png");
        this.load.image("frame_question", "assets/game_frame.png");
        this.load.audio("true_sound", "assets/true_sound.mp3");
        this.load.audio("false_sound", "assets/false_sound.mp3");

    }
    create() {
        // this.socket = io();
        // console.log(this.socket);
        this.background = this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(0.38);
        //sound
        this.true_sound = this.sound.add("true_sound", { loop: false });
        this.false_sound = this.sound.add("false_sound", { loop: false });
        //data
        var questions = [{
                id: 1,
                question: "c/ư/b/ậ/t/v/ợ",
                answer: "Vuot bac"
            },
            {
                id: 2,
                question: "a/c/c/o/u/n",
                answer: "Con cua"
            }, {
                id: 3,
                question: "c/í/ố/t/v",
                answer: "Oc vit"
            }, {
                id: 4,
                question: "ề/h/c/h/a/ú",
                answer: "Chua he"
            }, {
                id: 5,
                question: "o/ã/h/ò/n/h/a",
                answer: "Hoa hoan"
            }, {
                id: 6,
                question: "b/y/l/a/i",
                answer: "Ly bia"
            }, {
                id: 7,
                question: "s/ú/c/c/ố",
                answer: "Cu soc"
            }, {
                id: 8,
                question: "c/Đ/c/á/ố",
                answer: "Da coc"
            }, {
                id: 9,
                question: "t/u/y/ệ/h/ế/n/ị",
                answer: "Nhiet huyet"
            }, {
                id: 10,
                question: "c/C/y/a/a/h/u",
                answer: "Chua cay"
            }
        ];

        //popup and text
        this.popup = this.add.image(540, 200, 'popup').setScale(1.2);
        this.frame_question = this.add.image(395, 270, 'frame_question').setScale(1.4).setVisible(false);
        this.textPopup = this.add.text(400, 130, '').setWordWrapWidth(300);
        this.textTime = this.add.text(230, 120, 'Time: 45s', { fontSize: 20, color: '#000' }).setVisible(false);
        this.score = 0;
        this.scoreText = this.add.text(460, 120, 'Score: 0', { fontSize: 20, color: '#000' }).setVisible(false);
        this.textTitle = this.add.text(460, 76, "Trò chơi ghép chữ");
        this.typewriteTextWrapped('Hello, Chào mừng bạn đã đến với trò chơi ghép chữ, phí là 5 đồng, bạn có thời gian là 5ph để trả lời các câu hỏi, mỗi câu đúng sẽ được 4 đồng, bấm nút start để bắt đầu chơi nào!');

        //btn start shadow
        this.start = this.add.text(425, 450, " Start ", { fontSize: 70, fontWeight: "bold", fontFamily: "Arial Black", color: "red" });
        this.start.fill = '#ec008c';
        this.start.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);

        //
        this.textEnterAnswer = this.add.text(210, 190, '\nEnter your answer:', { font: '20px Courier', fill: '#000' }).setVisible(false);
        var textEntry = this.add.text(210, 230, '', { font: '32px Courier', fill: '#000' }).setVisible(false);
        this.btn_next = this.add.text(460, 400, 'Skip', { font: '32px Courier', fill: '#000' }).setVisible(false);
        this.btn_check = this.add.text(210, 400, 'Check', { font: '32px Courier', fill: '#000' }).setVisible(false);
        ///
        //clone list
        this.lstQuestion = questions.slice();

        this.start.setInteractive();
        this.btn_next.setInteractive();
        this.btn_check.setInteractive();

        var currentQuestion = this.randomQuestion(this.lstQuestion);
        this.input.keyboard.on('keydown', function(event) {
            if (event.keyCode === 8 && textEntry.text.length > 0) {
                textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
            } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
                textEntry.text += event.key;
            }
        });
        this.start.on("pointerdown", () => {
            // this.socket.on('startGame2', function(questions) {
            //     console.log("start");
            // });
            this.start.setVisible(false);
            this.textTitle.setVisible(false);
            this.textPopup.setVisible(false);
            this.popup.setVisible(false);
            this.btn_next.setVisible(true);
            this.btn_check.setVisible(true);
            this.scoreText.setVisible(true);

            //time
            this.textTime.setVisible(true);
            this.timeStart(this.handleTimeFinished.bind(this), 60000 * 5);

            //question
            this.frame_question.setVisible(true);
            this.questionDisplay = this.add.text(330, 170, currentQuestion.question, { fontSize: 20, color: "#000" })

            //enter answer
            this.textEnterAnswer.setVisible(true);
            textEntry.setVisible(true);
        });

        //next
        this.btn_next.on("pointerdown", () => {
            this.lstQuestion.splice(this.lstQuestion.indexOf(currentQuestion), 1);
            this.questionDisplay.setVisible(false);
            //handle
            if (this.lstQuestion.length === 0) {
                this.lstQuestion = questions.slice();
            }
            currentQuestion = this.randomQuestion(this.lstQuestion);
            this.questionDisplay = this.add.text(330, 170, currentQuestion.question, { fontSize: 20, color: "#000" }).setVisible(true);
            textEntry.text = "";
            if (this.score >= 2) {
                this.score -= 2;
                this.scoreText.setText("Score: " + this.score);
            }
        });

        //check
        this.btn_check.on("pointerdown", () => {
            if (this.checkAnswer(textEntry.text, currentQuestion.answer)) {
                //alert("oki");
                this.true_sound.play();
                this.lstQuestion.splice(this.lstQuestion.indexOf(currentQuestion), 1);
                this.questionDisplay.setVisible(false);
                //handle
                if (this.lstQuestion.length === 0) {
                    this.lstQuestion = questions.slice();
                }
                currentQuestion = this.randomQuestion(this.lstQuestion);
                this.questionDisplay = this.add.text(330, 170, currentQuestion.question, { fontSize: 20, color: "#000" }).setVisible(true);
                textEntry.text = "";
                this.score += 4;
                this.scoreText.setText("Score: " + this.score);
            } else {
                this.false_sound.play();
                //alert("Try again " + textEntry.text + " " + currentQuestion.answer);
            }
        });

    }

    update() {
        //btn start shadow
        var offset = this.moveToXY(this.input.activePointer, this.start.x, this.start.y, 8);
        this.start.setShadow(offset.x, offset.y, 'rgba(0, 0, 0, 0.5)', this.distanceToPointer(this.start, this.input.activePointer) / 30);

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
        this.add.text(320, 250, 'Hết giờ\nScore: ' + this.score, { fontSize: 35, color: 'red' });
        //this.frame_question.setVisible(false);
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

    // renderNewQuestion(currentQuestion, textEntry, questions) {
    //     //xóa question đã random để k trùng
    //     this.lstQuestion.splice(this.lstQuestion.indexOf(currentQuestion), 1);
    //     this.questionDisplay.setVisible(false);
    //     //handle
    //     if (this.lstQuestion.length === 0) {
    //         this.lstQuestion = questions.slice();
    //     }
    //     currentQuestion = this.randomQuestion(this.lstQuestion);
    //     this.questionDisplay = this.add.text(330, 170, currentQuestion.question, { fontSize: 20, color: "#000" }).setVisible(true);
    //     textEntry.text = "";
    // }

}