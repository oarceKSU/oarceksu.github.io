# Milestone 2: Interactive Browser Quiz

The quiz is the centerpiece of this milestone. I wanted to try Dynamic HTML (DHTML) and bring together what I have learned about HTML and JavaScript. The quiz page uses the same general structure and shared stylesheet as the rest of the website, with a form in the HTML document to hold the quiz. I put the JavaScript in a separate `quiz.js` file to keep the page structure and the quiz behavior organized separately. Although the code is split across two files, the quiz is still presented and used on one webpage: JavaScript builds and updates the form in the browser without navigating to another page.

The questions are stored as objects in a JavaScript array. Each object contains the question text, answer, and question type. A loop goes through that array to create the appropriate form controls for every question. I chose this approach because the same steps—creating a fieldset, adding the question text, and making its answer inputs—need to be repeated for each question. The loop avoids writing that markup by hand over and over, keeps the questions consistent, and makes it easier to add or edit questions in one place. I used iteration again during grading and answer review so each response can be checked and displayed using the same logic.

I approached the JavaScript as I would a Python script: I stored related data in a list-like structure, used loops to process it, used conditionals to handle different question types, and used functions to break the work into steps. In the grading portion, I collect the submitted answers, compare them with the stored correct answers, record each question's result, and count the correct answers to calculate a score. This way of thinking helped me organize the quiz logic into a sequence of smaller operations.

The quiz includes fill-in-the-blank, single-choice, and multiple-select questions. It also has a countdown timer, calculates a score and pass/fail result, and displays the submitted and correct answers for review. The quiz stays on the same page when submitted, and the reset button clears the results and starts the timer again.

## Other Milestone 2 Updates

Along with building the quiz, I added CSS to style its structure and make the timer, questions, grading results, and answer review easier to read. I also corrected duplicate header markup on pages where it appeared, helping keep the shared page structure consistent.

I expanded the research and explanations on the History of the Web Browser and Key Concepts pages so they provide more detail. Across the site, I refined the layout and organization to make the pages more polished and easier to follow instead of leaving them with a plain, unfinished appearance.

I experimented with inline CSS on a few images to adjust their presentation directly in the HTML. Finally, I added a footer notice identifying the website as a school project.