let timerInterval;
let QuestionObj;
let NumQuestion;
let CurrentQuestion = 0;
let score = 0;
let seconds = 10 - 1;
let Time = document.querySelector(".Timer");
let NextButton = document.querySelector(".next");
let PrevButton = document.querySelector(".prev");

function CountDown() {
    Time.innerHTML = `<i class="fa-solid fa-hourglass-start fa-spin fa-flip-horizontal"></i> ${seconds}`;
    seconds--;
    if (seconds < 0) {
        clearInterval(timerInterval);
        Time.innerHTML = "Time's up!";
        let AllAnswers = document.querySelectorAll(".Answers span");
        AllAnswers.forEach(answer => {
            answer.style.pointerEvents = "none";
        });
        GameOverHandle();
    }
}

timerInterval = setInterval(CountDown, 1000);

function NextPrev(dir) {
    clearInterval(timerInterval);
    seconds = 10 - 1;
    timerInterval = setInterval(CountDown, 1000);

    if (dir === 'next' && CurrentQuestion < NumQuestion - 1) {
        CurrentQuestion++;
    } else if (dir === 'prev' && CurrentQuestion > 0) {
        CurrentQuestion--;
    }

    // Disable next button if we are at the last question
    if (CurrentQuestion === NumQuestion - 1) {
        NextButton.style.pointerEvents = "none";
    } else {
        NextButton.style.pointerEvents = "auto";
    }

    // Disable previous button if we are at the first question
    if (CurrentQuestion === 0) {
        PrevButton.style.pointerEvents = "none";
    } else {
        PrevButton.style.pointerEvents = "auto";
    }

    Question();
}



function Question() {
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            QuestionObj = JSON.parse(this.responseText);
            NumQuestion = QuestionObj.length; 
            QuestionCounter(NumQuestion);
            AddQuestions(QuestionObj[CurrentQuestion], NumQuestion);


            NextButton.onclick = function () {
                NextPrev('next', NumQuestion); 
                AddQuestions(QuestionObj[CurrentQuestion], NumQuestion);
            };

            PrevButton.onclick = function () {
                NextPrev('prev', NumQuestion);
                AddQuestions(QuestionObj[CurrentQuestion], NumQuestion);
            };
        }
    };

    req.open("GET", "ApiQuestion.json", true);
    req.send();
}


function QuestionCounter(Num) {
    let NumberingQ = document.querySelector(".QuestionNumber")
    NumberingQ.innerHTML = `Question ${CurrentQuestion + 1} out of ${Num}`;
}

function AddQuestions(obj, count) {
    let QTitle = document.querySelector(".Question .title");
    let RightCol = document.querySelector(".Answers .right-column");
    let leftCol = document.querySelector(".Answers .left-column");
    QTitle.innerText = obj.title;
    RightCol.innerHTML = '';
    leftCol.innerHTML = '';

    for (let i = 0; i <= 1; i++) {
        let RightAnswerSpan = document.createElement("span");
        RightAnswerSpan.innerText = obj[`answer_${i + 1}`];
        RightCol.appendChild(RightAnswerSpan)
    }

    for (let i = 2; i <= 3; i++) {
        let LeftAnswerSpan = document.createElement("span");
        LeftAnswerSpan.innerText = obj[`answer_${i + 1}`];
        leftCol.appendChild(LeftAnswerSpan)
        CheckAnswer(obj.right_answer, count);
    }
}

function CheckAnswer(correctAnswer, Num) {
    let AllAnswers = document.querySelectorAll(".Answers span");
    AllAnswers.forEach(Choose => {
        Choose.onclick = function () {
            if (Choose.innerText === correctAnswer) {
                this.classList.add("TrueAnswer");
                AllAnswers.forEach(answer => {
                    answer.style.pointerEvents = "none";
                });
                score += 10;
            } else {
                this.classList.add("WrongAnswer");
                GameOverHandle();
            }
            clearInterval(timerInterval);
            if (CurrentQuestion === Num - 1) {
                GameWin();
            }
        }
    });
}

function GameOverHandle() {
    let Hearts = document.querySelectorAll(".Hearts i");
    let GameOverLayer = document.querySelector(".GameOver");
    if (Hearts.length > 1) {
        Hearts[0].remove();
    } else if (Hearts.length === 1) {
        GameOverLayer.style.display = "block";
        let failSound = document.getElementById("failSound");
        failSound.play();
    }
    GameOverLayer.onclick = function () {
        window.location.reload();
    }
}

function GameWin() {
    if (score >= 70) {
        let GameWinLayer = document.querySelector(".GameWin");
        GameWinLayer.style.display = "block";
        let winSound = document.getElementById("winSound");
        winSound.play();
    }
}

Question();