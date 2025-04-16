# CSCI-4250 Scrump Project - Pepper's Pop Quiz by Cavity Crushers

Pepper's Pop Quiz is trivia game developed by Cavity Crushers, inspired by popular trivia games but with an ETSU twist. Our game features ETSU's therapy dog Pepper, which the game is named after. This project was created in CSCI 4250-001/Software Engineering 1 in Spring 2025 using the Scrum methodology with most of the group having little to no experience with JavaScript.

Our team members and their respective roles are as following:  
  - Landen Rogers     - Product Owner
  * Nathanael Baird   - Scrum Master
  + Nicholas Crump    - Developer
  * Luke Weist        - Developer
  - JL Graham         - Developer

Our product backlog along with all of our sprint backlogs are included under the "Projects" section of this repository (https://github.com/Cavity-Crushers/Peppers-Pop-Quiz/projects?query=is%3Aopen).

Overview of our Sprints
Sprint 1 -
- Goal: Create basic game structure, basic UI, and core gameplay loop
  - Set up the file structure
  - Ensured that our game runs in a 400x400 or 800x400 canvas
  - Implemented a game screen where a single trivia question with four answers
  - Implemented answer selection via the arrow keys and the "Enter" key
  - Set up a basic start screen that displays the title and a start button
  - Set up two JSON files, one for questions and one for answers

Sprint 2 -
- Goal: Add game scoring logic
  - Added a page results page after each question
  - Implemented a scoring system that gives +50 points for each question answered correctly
  - Implemented a lives system with the ability to gain extra lives up to a cap
  - Added a game over screen
  - Implemented sound effects for getting questions right and wrong, as well as game over
 
# Testing our Project Process
If you already have Node.js installed, skip to step 3.
1. Go to https://nodejs.org in your browser and download the Long Term Support version if you do not already have Node.js installed.
2. Install Node.js via the file just downloaded
3. Open up VS and navigate to the project folder
4. Right click on the TriviaGame folder and click "Open in terminal"
5. Run "npm install --global http-server" (without the quotation marks) in the terminal
6. Then run "http-server -p 8000" in the terminal
  a. If it says that this port is in use then choose a different port, typically increment by 1 to 8001
8. Navigate to http://localhost:8000/index.html (change 8000 to whatever number you chose in the previous step) and you can play the game
