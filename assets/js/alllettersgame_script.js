/* jshint esversion: 11 */

/* Hard Coded Questions: https://www.youtube.com/watch?v=zZdQGs62cR8&list=PLDlWc9AfQBfZIkdVaOQXi1tizJeNJipEx&index=4 */

const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

const CORRECT_BONUS = 10;
let MAX_QUESTIONS = 5;

const urlParams = new URLSearchParams(window.location.search);
const quizParam = urlParams.get("quiz");

let selectedQuiz;

switch(quizParam) {
    case "all":
        selectedQuiz = allLettersShuffled;
        break;
    case "s":
        selectedQuiz = allSeionShuffled;
        break;
    case "d":
        selectedQuiz = allDakuonShuffled;
        break;
    default:
        selectedQuiz = allLettersShuffled;

}

startGame = () => {
    MAX_QUESTIONS = selectedQuiz.length;
    questionCounter = 0;
    score = 0;
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        return window.location.assign('quizend.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    availableQuestions.splice(questionIndex, 1);

    let answerPool = [...selectedQuiz].sort(() => Math.random() - 0.5).slice(0, 4);

    if (!answerPool.includes(currentQuestion)) {
        answerPool[Math.floor(Math.random() * 4)] = currentQuestion;
    }

    question.innerText = `What character is this? ${currentQuestion.jp}`;
    
    choices.forEach((choice, i) => {
        const letter = answerPool[i];
        choice.dataset.i = letter.jp;
    
        switch(selectedLanguage) {
            case 'en':
                choice.innerText = letter.en;
                break;
            case 'ru':
                choice.innerText = letter.ru;
                break;
            case 'zh':
                choice.innerText = letter.zh;
                break;
            default:
                choice.innerText = letter.en;
        }
    });
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset.i;

        /* Display Feedback: https://www.youtube.com/watch?v=_LYxkClHnV0&list=PLDlWc9AfQBfZIkdVaOQXi1tizJeNJipEx&index=5 */
        const classToApply = selectedAnswer == selectedQuiz[0].jp ? "correct" : "incorrect";
    
        if (classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.classList.add(classToApply);
        
        setTimeout(() => {
            selectedQuiz.push(selectedQuiz.splice(0, 1)[0]);
            selectedChoice.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

// /* Score Increment: https://www.youtube.com/watch?v=BOQLbu_Crc0&list=PLDlWc9AfQBfZIkdVaOQXi1tizJeNJipEx&index=6 */
incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

startGame();