/* This script dynamically generates a quiz form based on a set of questions. 
 * It handles the quiz timer, grading, and displaying results and answer review. */

/* The questions array stores each question's text, answer, and type. Choice answers
 * use the option's position in the choices array, starting at 0. */

const questions = [
    {
        question: "Fill in the blank: A browser uses a ____ to locate a specific webpage. Hint: 3 Letters",
        answer: "URL",
        type: "text"
    },
    {
        question: "Fill in the blank: ____ adds interactive behavior to a webpage.",
        answer: "JavaScript",
        type: "text"
    },
    {
        question: "Which was one of the first widely used graphical web browsers?",
        choices: ["Mosaic", "Chrome", "Safari"],
        answer: 0,
        type: "choice"
    },
    {
        question: "Who created the first web browser?",
    choices: ["Bill Gates", "Marc Andreeson", "Tim Berners-Lee"],
        answer: 2,
        type: "choice"
    },
    {
        question: "What does CSS control on a web page?",
        choices: ["The web address", "The page's style and layout", "The server connection"],
        answer: 1,
        type: "choice"
    },
    {
        question: "What is HTTP used for?",
        choices: ["Styling web pages", "Transferring data on the web", "Storing browser bookmarks"],
        answer: 1,
        type: "choice"
    },
    {
        question: "What does a browser request when you visit a website?",
        choices: ["A new operating system", "Web page resources from a server", "A physical network cable"],
        answer: 1,
        type: "choice"
    },
    {
        question: "In what year was Google Chrome first released?",
        choices: ["1995", "2015", "2008"],
        answer: 2,
        type: "choice"
    },
    {
        question: "Which browser was developed by Apple?",
        choices: ["Firefox", "Safari", "Edge"],
        answer: 1,
        type: "choice"
    },
    {
        question: "Which web technologies does a browser interpret to render a page? Select all that apply.",
        choices: ["HTML", "CSS", "JavaScript", "HTTP"],
        answer: [0, 1, 2],
        type: "multi"
    }
];

/* Use the form already in quiz.html to hold the generated questions and controls. */
const form = document.getElementById("quiz");
form.noValidate = true; /** Let users submit even if they leave questions unanswered. */

const timer = document.getElementById("quiz-timer"); /* Find the timer element already in the HTML. */
const result = document.createElement("p"); /* Create a paragraph element where the score will appear. */

/* Create the answer-review section. It stays hidden until the quiz is graded. 
* creates heading element for answer key title and the answer list to show the results */
const review = document.createElement("section");
review.hidden = true;
const reviewHeading = document.createElement("h3");
reviewHeading.textContent = "Answer key and your results";
const answerList = document.createElement("ol");
answerList.className = "answer-review"; /** CSS uses this class to style the review list. */
review.append(reviewHeading, answerList); /** adds these elements to the review section */

/* Build a fieldset for each question, with a legend for its text and inputs for its answer. 
* forEach lets us iterate through the questions array 
* legend const contains the question number and text from the array*/
questions.forEach(function (item, questionIndex) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = `${questionIndex + 1}. ${item.question}`;
    fieldset.appendChild(legend); /* adds the legend to each question */

    /** if the question type is fill in the blank (text), then a label with a blank input text box element are 
     * created and added to the fieldset. */
    if (item.type === "text") {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "text";
        input.name = `question${questionIndex}`; /** this is what the grading script uses to identify the input */
        label.append("Your answer: ", input);
        fieldset.appendChild(label); /* adds the label and input to the fieldset */
    } else {
        /* all other questions are choices */
        item.choices.forEach(function (choice, choiceIndex) {
            const label = document.createElement("label");
            const input = document.createElement("input");
            /** if the question type is multi-select, create a checkbox; otherwise, create single choice radio buttons */
            if (item.type === "multi") {
                input.type = "checkbox";
            } else {
                input.type = "radio";
            }
            /** We save the question index and value for grading */
            input.name = `question${questionIndex}`;
            input.value = choiceIndex;
            label.append(input, ` ${choice}`);
            fieldset.appendChild(label);
            fieldset.appendChild(document.createElement("br"));
        });
    }
    /* Add the fieldset for each question to the form after every loop */
    form.appendChild(fieldset); 
});

/* Add the submit and reset buttons */
const submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Submit quiz";
form.appendChild(submitButton);

const resetButton = document.createElement("button");
resetButton.type = "reset";
resetButton.textContent = "Start over";
form.appendChild(resetButton);

/* We create a const for the timer that sets the time limit to 10 minutes. We start the timer as soon as the page loads */
const TIME_LIMIT_SECONDS = 600;
let startedAt = Date.now();
let timerInterval;

/* This function takes the seconds as a parameter and makes the minute and second display on the page with a "00:00" format.  */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

/* Created function that update the countdown on the page every second */
function updateTimer() {
    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const remainingSeconds = Math.max(0, TIME_LIMIT_SECONDS - elapsedSeconds);
    timer.textContent = `Time remaining: ${formatTime(remainingSeconds)}`;

    /* If the timer reaches zero, we clear the interval and submit the form automatically. */
    if (remainingSeconds === 0) {
        clearInterval(timerInterval);
        form.requestSubmit();
    }
}

/* Reset the start time, store the current time and call the updateTimer function */
function startTimer() {
    clearInterval(timerInterval);
    startedAt = Date.now();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}
/* This function grades the quiz by comparing the submitted answers with the correct answers */
function gradeQuiz() {
    clearInterval(timerInterval);

    const answers = new FormData(form); /* Collect the values entered or selected in the form. */
    /** maps each question to its submitted answer. 3 variables are declared that will store the grading information for each question. */
    const questionResults = questions.map(function (item, questionIndex) {
        const submitted = answers.getAll(`question${questionIndex}`);
        let isCorrect;
        let submittedText;
        let correctText;

        /* grades fill in the blank section */
        if (item.type === "text") {
            submittedText = submitted[0] ? submitted[0].trim() : "No answer"; /* Ignore capitalization and spaces when checking typed answers. if there is no answer submitted, display "No answer" */
            isCorrect = submittedText.toLowerCase() === item.answer.toLowerCase(); /* Compare the submitted answer with the correct answer, ignoring case. */
            correctText = item.answer; /* Store the correct answer for display in the review section. */
        } else {
            /* Compare selected option numbers with the correct option numbers. */
            const selectedChoices = submitted.map(Number).sort(function (left, right) {
                 return left - right; /* Sort function makes it possible to compare correct answer array with submitted answer array. if user chooses the same options in a different order
                  they will still be marked correct. */
            });
            /* this block verifies that the correct asnwers are all selected and only the correct answers are selected. the length function 
             * is used to compare the number of selected answers with the number of correct answers. if they are not equal, the answer is marked incorrect. */
            const correctChoices = item.type === "multi" ? item.answer : [item.answer];
            isCorrect = selectedChoices.length === correctChoices.length &&
                selectedChoices.every(function (choice, index) {
                    return choice === correctChoices[index];
                });
            submittedText = selectedChoices.length /* identifies the selected text for display in the review section. if no answer is selected, it will display "No answer" */
                ? selectedChoices.map(function (choice) { return item.choices[choice]; }).join(", ")
                : "No answer";
            correctText = correctChoices.map(function (choice) { /* identifies the correct text for display in the review section. */
                return item.choices[choice]; }).join(", ");
        }
        /*after every loop, the grading information for each question is returned as an object and stored in the questionResults array. */
        return { item: item, isCorrect: isCorrect, submittedText: submittedText, correctText: correctText }; 
    });

    /* Calculate the score and display the percentage, pass/fail status, and time taken. */
    /*score is equal to the number of correct answers, which is determined by filtering the questionResults array for objects where isCorrect is true and counting them. */
    const score = questionResults.filter(function (questionResult) {
        return questionResult.isCorrect; }).length; 
    const percentage = (score / questions.length) * 100;
    const passFail = percentage >= 70 ? "PASS" : "FAIL"; /*if score is 70% or higher, the result is a pass, else anything lower is a fail. */
    const elapsedSeconds = Math.min(
        TIME_LIMIT_SECONDS,
        Math.floor((Date.now() - startedAt) / 1000) /*calculates how much time has passed once the quiz is submitted */
    );

    /* depending on pass/fail status, the display of the result will be styled with a green or red color using CSS classes. 
    *  The result paragraph will show the score, pass/fail status, number of correct answers, and time taken. */
    result.className = passFail === "PASS" ? "grade-pass" : "grade-fail"; 
    result.textContent = `Score: ${percentage}% - ${passFail} (${score} out of ${questions.length}). Time taken: ${formatTime(elapsedSeconds)}.`;

    /* creates a few HTML elements for each question in the review so we can have a uniform structure to display each question with results and correct answers */
    questionResults.forEach(function (questionResult) {
        const reviewItem = document.createElement("li");
        const questionText = document.createElement("p");
        const statusMarker = document.createElement("span");

         /* if isCorrect is true, display a green check mark, else display a red X using CSS classes */
        statusMarker.className = questionResult.isCorrect
            ? "answer-marker answer-correct" /* CSS makes correct answers green and incorrect answers red */
            : "answer-marker answer-incorrect";
        statusMarker.textContent = questionResult.isCorrect ? "✓" : "X";
        questionText.append(statusMarker, ` ${questionResult.item.question}`); /* appends the check mark or X and the question text to the questionText paragraph element */
        const correctAnswer = document.createElement("p");
        correctAnswer.className = "answer-correct";
        correctAnswer.textContent = `Correct answer: ${questionResult.correctText}`;
        const submittedAnswer = document.createElement("p");
        submittedAnswer.className = "answer-submitted";
        submittedAnswer.textContent = `Your answer: ${questionResult.submittedText}`;
        /* for each question, the question text, correct answer, and submitted answer are appended to the reviewItem list item element, which is then added to the answerList ordered list. */
        reviewItem.append(questionText, correctAnswer, submittedAnswer);
        answerList.appendChild(reviewItem);
    });

    /* Lock the answers after grading and reveal the review section. */
    form.querySelectorAll("input").forEach(function (input) {
        input.disabled = true;
    });
    submitButton.disabled = true; /* disables submit button that could cause the quiz to be graded multiple times */
    review.hidden = false;
}

/* Keep submission on this page and grade the quiz instead of navigating away. */
form.addEventListener("submit", function (event) {
    event.preventDefault();
    gradeQuiz();
});

/* Clears previous results, re-enables the form, and restarts the timer on reset. complete reset */
form.addEventListener("reset", function () {
    result.className = "";
    result.textContent = "";
    answerList.replaceChildren();
    review.hidden = true;
    form.querySelectorAll("input").forEach(function (input) {
        input.disabled = false;
    });
    submitButton.disabled = false;
    startTimer();
});

/* Add the score and review to the existing form, then start the timer. */
form.append(result, review);
startTimer();
