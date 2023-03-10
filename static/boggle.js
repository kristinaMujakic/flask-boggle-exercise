class BoggleGame {
    constructor(boardId, secs) {
        this.secs = secs;
        this.showTimer();

        this.score = 0;
        this.words = new Set(); //handling duplicate words
        this.board = $('#' + boardId); //guess input


        this.timer = setInterval(this.tick.bind(this), 1000);

        $('.add-word', this.board).on('submit', this.enterGuess.bind(this));
    }

    showWord(word) {
        $('.words', this.board).append($('<li>', { text: word }));
    }

    showScore() {
        $('.score', this.board).text(this.score);
    }

    showMessage(msg, cls) {
        $('.msg', this.board).text(msg).removeClass().addClass(`msg ${cls}`);
    }

    async enterGuess(e) {
        e.preventDefault();
        const $word = $('.word', this.board);

        let word = $word.val();
        if (!word) return;

        if (this.words.has(word)) {
            this.showMessage(`Already guessed the ${word} word!`, 'err');
            return;
        }
        const response = await axios.get('/check-word', { params: { word: word } });

        if (response.data.result === 'not-word') {
            this.showMessage(`${word} is not a valid English word`, 'err');
        } else if (response.data.result === 'not-on-board') {
            this.showMessage(`The ${word} is not a valid word on this board`, 'err');
        } else {
            this.showWord(word);
            this.score += word.length;
            this.showScore();
            this.words.add(word);
            this.showMessage(`${word} added!`, 'ok');
        }
        $word.val('').focus();
    }

    showTimer() {
        $(".timer", this.board).text(this.secs);
    }

    async tick() {
        this.secs -= 1;
        this.showTimer();

        if (this.secs === 0) {
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    async scoreGame() {
        $('.add-word', this.board).hide();
        const response = await axios.post('/post-score', { score: this.score });
        if (response.data.brokeRecord) {
            this.showMessage(`New record: ${this.score}`, 'ok');
        } else {
            this.showMessage(`Final score: ${this.score}`, 'ok');
        }
    }
}

// $(document).ready(function () {
//     let game = new BoggleGame("boggle", 60);
// });