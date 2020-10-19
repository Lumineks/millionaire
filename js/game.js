'use strict'
const _startBtn = Symbol('start');
const _reloadBtn = Symbol('reload');
const _skiptBtn = Symbol('skip');
const _gameWrapper = Symbol('game');
const _field = Symbol('field');
const _htmlQuestion = Symbol('questions');
const _htmlOptionsWrapper = Symbol('optionsWrapper');
const _htmlOptions = Symbol('htmlOptions');
const _htmlTotalPrize = Symbol('htmlTotalPrize');
const _htmlRoundPrize = Symbol('htmlRoundPrize');
const _gameOverElement = Symbol('gameOver');
const _totalPrize = Symbol('totalPrize');
const _roundPrice = Symbol('roundPrize');
const _questions = Symbol('questions');
const _rightAnswers = Symbol('right');
const _options = Symbol('options');
const _update = Symbol('update');
const _setRound = Symbol('setRound');
const _getRandomQuestion = Symbol('randomQ');
const _randomInteger = Symbol('randomInt');
const _isCorrect = Symbol('correct');
const _skipQuestion = Symbol('skipQ');
const _endGame = Symbol('endGame');
const _init = Symbol('init');

class Game {
    constructor() {
        this[_startBtn] = document.querySelector('.btn-start')
        this[_skiptBtn] = document.querySelector('.btn-skip');
        this[_reloadBtn] = document.querySelector('.btn-reload');
        this[_gameWrapper] = document.querySelector('.game-wrapper');
        this[_field] = document.querySelector('.field');
        this[_htmlQuestion] = document.querySelector('.question');
        this[_htmlOptionsWrapper] = document.querySelector('.answers');
        this[_htmlOptions] = document.querySelectorAll('.option');
        this[_htmlTotalPrize] = document.querySelector('.total-money');
        this[_htmlRoundPrize] = document.querySelector('.round-money');
        this[_gameOverElement] = document.createElement('div');
        this[_totalPrize] = 0;
        this[_roundPrice] = 100;

        this[_questions] = [
            'Как правильно закончить пословицу: «Не откладывай на завтра то, что можно…»?',
            'Что говорит человек, когда замечает нечто необычное?',
            'Что помогает туристу ориентироваться в незнакомом городе?',
            'Какой наряд прославил баснописец Крылов?',
            'Как звали старшую сестру императора Петра Первого?'
        ];
        this[_rightAnswers] = [
            'сделать сегодня',
            'бросилось в глаза',
            'путеводитель',
            'тришкин кафтан',
            'Софья',
        ];
        this[_options] = [
            ['сделать сегодня', 'сделать послезавтра', 'сделать через месяц', 'никогда не делать'],
            ['попало в лоб', 'залетело в рот', 'накапало в уши', 'бросилось в глаза'],
            ['путепровод', 'путеукладчик', 'путеводитель', 'путеводная звезда'],
            ['тришкин кафтан', 'ивашкин армяк', 'прошкин зипун', 'машкин сарафан'],
            ['Вера', 'Надежда', 'Любовь', 'Софья'],
        ];

        this[_init] = () => {
            this[_gameOverElement].classList.add('game-over');
            this[_startBtn].remove();
            this[_gameWrapper].classList.add('started');
            this[_field].classList.add('started');
            setTimeout(() => {
                this[_gameWrapper].classList.add('animated');
                this[_setRound]();
                this[_skiptBtn].addEventListener('click', this[_skipQuestion]);

                this[_htmlOptions].forEach(option => option.addEventListener('click', this[_update]))
            }, 1000);
        }

        this[_startBtn].addEventListener('click', this[_init]);
    }

    [_update] = (event) => {
        if (this[_questions].length !== 0) {
            if (this[_isCorrect](event.target)) {
                this[_totalPrize] += this[_roundPrice];
                this[_roundPrice] *= 2;

                this[_htmlOptionsWrapper].classList.add('animated');
                this[_htmlQuestion].classList.add('animated');
                setTimeout(() => {
                    this[_htmlOptionsWrapper].classList.remove('animated');
                    this[_htmlQuestion].classList.remove('animated');
                }, 500);

                this[_setRound]();
            } else {
                this[_endGame]('It was wrong option!');
            }
        } else {
            this[_totalPrize] += this[_roundPrice];
            this[_roundPrice] *= 2;
            this[_endGame]('Congratulations, You are the winner!');
        }
    }

    [_setRound] = () => {
        // * Set question        
        const randomQuestion = this[_getRandomQuestion]();
        const questionsIndex = this[_questions].indexOf(randomQuestion);
        this[_questions].splice(questionsIndex, 1);
        this[_htmlQuestion].innerText = randomQuestion;

        // * Set options
        this[_htmlOptions].forEach((item, i) => {
            item.innerText = this[_options][questionsIndex][i];
        });

        this[_options].splice(questionsIndex, 1);

        this[_htmlTotalPrize].innerText = this[_totalPrize];
        this[_htmlRoundPrize].innerText = this[_roundPrice];
    }

    [_getRandomQuestion] = () => {
        return this[_questions][this[_randomInteger](0, this[_questions].length - 1)];
    }

    [_randomInteger] = (min, max) => {
        const rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    [_isCorrect] = (option) => {

        return this[_rightAnswers].includes(option.innerText) ? true : false;
    }

    [_skipQuestion] = () => {
        this[_setRound]();
        this[_skiptBtn].classList.add('hidden');
    }

    [_endGame] = (text) => {
        this[_field].remove();
        this[_gameWrapper].classList.remove('started');
        this[_gameWrapper].classList.remove('animated');
        this[_gameWrapper].append(this[_gameOverElement]);
        this[_gameOverElement].innerHTML = `<p>${text} <span>Your prize - ${this[_totalPrize]}</span></p>`;
        this[_reloadBtn].classList.add('visible');
        this[_reloadBtn].addEventListener('click', () => {
            document.location.reload();
        });
    }
}