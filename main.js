// Select Elements
let countQuestions = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let mainBulletsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");

// Start Options
let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;

// Stablish Connection to JSON File
function getQuestions(link) {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsArray = JSON.parse(this.responseText);

      // Shuffle the questions array to randomize questions
      questionsArray = shuffleArray(questionsArray);

      // Get first 10 questions
      let randomQuestions = questionsArray.slice(0, 10);

      let questionsNum = randomQuestions.length;

      // Create Bullets and Set Questions Count
      createBullets(questionsNum);

      // Add Question Data
      addQuestionData(randomQuestions[currentIndex], questionsNum);

      // Start Count Down Timer
      countDownTimer(10, questionsNum);

      // Click Submit Button
      submitBtn.addEventListener("click", () => {
        // Get The Right Answer
        let theRightAnswer = randomQuestions[currentIndex].right_answer;

        // Increase Current Index
        currentIndex++;

        //Check The Answer
        checkAnswer(theRightAnswer, questionsNum);

        // remove Previous Question
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        // Get The Next Question
        // Add Question Data
        addQuestionData(randomQuestions[currentIndex], questionsNum);

        // Handle Bullets
        handleBullets();

        // Start Count Down Timer
        clearInterval(countDownInterval);
        countDownTimer(10, questionsNum);

        // Show Result Function
        showResult(questionsNum);
      });
    }
  };
  myRequest.open("GET", link);
  myRequest.send();
}

// Function to shuffle array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Create Bullets
function createBullets(num) {
  countQuestions.innerHTML = num;
  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");
    // Check if the Bullet is the first one
    if (i === 0) {
      theBullet.className = "active";
    }
    // Append the Bullet to the Main Bullets Container
    mainBulletsContainer.appendChild(theBullet);
  }
}
// Add Question Data
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj.title);

    // Append Question Text To H2
    questionTitle.appendChild(questionText);

    // Append H2 To Quiz Area
    quizArea.appendChild(questionTitle);

    // Shuffle the answers array
    let answersArray = [
      { id: 1, text: obj.answer_1 },
      { id: 2, text: obj.answer_2 },
      { id: 3, text: obj.answer_3 },
      { id: 4, text: obj.answer_4 },
    ];
    answersArray = shuffleArray(answersArray);

    // Create The Answers
    answersArray.forEach((answerObj, index) => {
      // Create The Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Id + Name + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${answerObj.id}`;
      radioInput.dataset.answer = answerObj.text;

      // Make First Answer Checked
      if (index === 0) {
        radioInput.checked = true;
      }

      // Create label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${answerObj.id}`;

      // Create The Label Text
      let labelText = document.createTextNode(answerObj.text);

      // Append the Label Text To label
      theLabel.appendChild(labelText);

      // Append the label and input to Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append Main Div To the Quiz Answers
      answerArea.appendChild(mainDiv);
    });
  }
}

// Check The Answer
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === choosenAnswer) {
    rightAnswer++;
  }
}

// Handle Bullets
function handleBullets() {
  let arrayBullets = Array.from(
    document.querySelectorAll(".bullets .spans span")
  );
  arrayBullets.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "active";
    }
  });
}

// Show Result
function showResult(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitBtn.remove();
    bullets.remove();

    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResults = `<span class="good">Good: </span>You Have Answered <span class="good">${rightAnswer}</span> From ${count}`;
    } else if (rightAnswer === count) {
      theResults = `<span class="perfect">Perfect: </span>You Have Answered All Questions`;
    } else {
      theResults = `<span class="bad">Bad: </span> You Have Answered <span class="bad">${rightAnswer}</span> From ${count}`;
    }
    results.innerHTML = theResults;
  }
}

// Count Down Timer
function countDownTimer(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}

// Call function Which Stablish connection to JSON File
if (document.body.dataset.title === "HTML Quiz") {
  getQuestions("./JSON/html_questions.json");
} else if (document.body.dataset.title === "CSS Quiz") {
  getQuestions("./JSON/css_questions.json");
} else {
  getQuestions("./JSON/js_questions.json");
}
