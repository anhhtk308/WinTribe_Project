// import man1 from './man1';
class man2 extends Phaser.Scene {
    constructor() {
        super("man2");
    }

    preload() {
        this.load.image("bg", "assets/bg_question_1.jpg");
        this.load.image("popup", "assets/popup.png");
        this.load.image("frame_question", "assets/game_frame.png");


    }
    create() {
        // this.socket = io();
        // console.log(this.socket);
        this.background = this.add.image(0, 0, "bg").setOrigin(0, 0).setScale(0.38);
        var questions = [{
                id: 1,
                question: "1abc",
                answer: "1abc"
            },
            {
                id: 2,
                question: "2abc",
                answer: "2abc"
            }, {
                id: 3,
                question: "3abc",
                answer: "3abc"
            }, {
                id: 4,
                question: "4abc",
                answer: "4abc"
            }, {
                id: 5,
                question: "5abc",
                answer: "5abc"
            }
        ];

        //popup and text
        this.popup = this.add.image(540, 200, 'popup').setScale(1.2);
        this.frame_question = this.add.image(395, 270, 'frame_question').setScale(1.4).setVisible(false);
        this.textPopup = this.add.text(400, 130, '').setWordWrapWidth(300);
        this.textTime = this.add.text(230, 120, 'Time: 45s', { fontSize: 20, color: '#000' }).setVisible(false);
        this.score = this.add.text(460, 120, 'Score: 0', { fontSize: 20, color: '#000' }).setVisible(false);
        this.textTitle = this.add.text(460, 76, "Trò chơi ghép chữ");
        this.typewriteTextWrapped('Hello, Chào mừng bạn đã đến với trò chơi ghép chữ, phí là 5 đồng, bạn có thời gian là 5ph để trả lời các câu hỏi, mỗi câu đúng sẽ được 4 đồng, bấm nút start để bắt đầu chơi nào!');

        //btn start shadow
        this.start = this.add.text(425, 450, " Start ", { fontSize: 70, fontWeight: "bold", fontFamily: "Arial Black", color: "red" });
        this.start.fill = '#ec008c';
        this.start.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 0);

        //
        this.textEnterAnswer = this.add.text(210, 190, '\nEnter your answer:', { font: '20px Courier', fill: '#000' }).setVisible(false);
        var textEntry = this.add.text(210, 230, '', { font: '32px Courier', fill: '#000' }).setVisible(false);
        this.btn_next = this.add.text(460, 400, 'Next', { font: '32px Courier', fill: '#000' }).setVisible(false);
        ///

        this.start.setInteractive();
        this.btn_next.setInteractive();
        var currentQuestion = this.randomQuestion(questions);
        this.start.on("pointerdown", () => {
            // this.socket.on('startGame2', function(questions) {
            //     console.log("start");
            // });
            this.start.setVisible(false);
            this.textTitle.setVisible(false);
            this.textPopup.setVisible(false);
            this.popup.setVisible(false);
            this.btn_next.setVisible(true);
            this.score.setVisible(true);
            //time
            this.textTime.setVisible(true);
            this.timeStart(this.handleTimeFinished.bind(this), 5000);

            //question
            this.frame_question.setVisible(true);
            this.questionDisplay = this.add.text(210, 170, currentQuestion.question, { fontSize: 20, color: "#000" })

            //enter answer
            this.textEnterAnswer.setVisible(true);
            textEntry.setVisible(true);
            this.input.keyboard.on('keydown', function(event) {
                if (event.keyCode === 8 && textEntry.text.length > 0) {
                    textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
                } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
                    textEntry.text += event.key;
                }
            });
        });

        //next
        this.btn_next.on("pointerdown", () => {
            if (this.checkAnswer(textEntry.text, currentQuestion.answer)) {
                alert("oki");
                //handle
                //currentQuestion = this.randomQuestion(questions);
                //this.questionDisplay = this.add.text(210, 170, currentQuestion.question, { fontSize: 20, color: "#000" })
            } else {
                alert("Try again " + currentQuestion.question + " " + textEntry.text);
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
        const seconds = remaining / 1000;
        this.textTime.text = "Time: " + seconds.toFixed(2) + "s";
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
    timeStart(callback, duration = 60000) {
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
        this.add.text(350, 300, 'Hết giờ', { fontSize: 20, color: '#000' });
    }

    randomQuestion(lstQuestion) {
        let randomQes = Math.floor(Math.random() * lstQuestion.length) + 1;
        return lstQuestion[randomQes];
    }

    checkAnswer(input, answer) {
        if (input === answer) {
            return true;
        } else {
            return false;
        }
    }

    showQuestion() {

    }

}