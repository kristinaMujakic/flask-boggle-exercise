from flask import Flask, request, render_template, jsonify, session
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'key55'
boggle_game = Boggle()


@app.route('/')
def display_game():

    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    times_played = session.get('times_played', 0)

    return render_template('index.html', board=board, highscore=highscore, times_played=times_played)


@app.route('/check-word')
def handle_guess():

    word = request.args['word']
    board = session['board']
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})


@app.route('/post-score', methods=['POST'])
def post_score():

    score = request.json['score']
    highscore = session.get('highscore', 0)
    times_played = session.get('times_played', 0)

    session['times_played'] = times_played+1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)
