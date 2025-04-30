# CSCI-4250 Scrum Project - Pepper's Pop Quiz by Cavity Crushers

Pepper's Pop Quiz is trivia game developed by Cavity Crushers, inspired by popular trivia games but with an ETSU twist. Our game features ETSU's therapy dog Pepper, which the game is named after. This project was created in CSCI 4250-002/Software Engineering 1 in Spring 2025 using the Scrum methodology with most of the group having little to no experience with JavaScript.

Our team members and their respective roles are as following:  
  - Landen Rogers     - Product Owner
  * Nathanael Baird   - Scrum Master
  + Nicholas Crump    - Developer
  * Luke Weist        - Developer
  - JL Graham         - Developer

Our product backlog along with all of our sprint backlogs are included under the "Projects" section of this repository, or at this link:  
https://github.com/Cavity-Crushers/Peppers-Pop-Quiz/projects?query=is%3Aopen

# Sprint Overviews  
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

Sprint 3 -
- Goal: Polishing gameplay and implementing the core gameplay loop
  - Implemented the ability to answer different, random questions
  - Added Categories and the ability to filter the questions you're asked
  - Implemented a question timer
  - Added pictures to questions
  - Added randomized game over messages
  - Researched persistence
  - Added a pause menu overlay
 
Sprint 4 -
- Goal: Final Polishing
  - Added background music to Game screen
  - Limited all assests to 10mb max
  - Ensured all files were in single folder
  - Implemented a Selenium automated test to test the basic game loop
  - Added a Game Logo
  - Added instructions on Mobile Testing
 
# Releases
We did a release at the end of each sprint and they can be found on the right side Code page of the repository, or at this link:  
https://github.com/Cavity-Crushers/Peppers-Pop-Quiz/releases
 
# Process to Test our Project
If you already have Node.js installed, skip to step 3.
1. Go to https://nodejs.org in your browser and download the Long Term Support version if you do not already have Node.js installed.
2. Install Node.js via the file just downloaded
3. Open up VS and navigate to the project folder
4. Right click on the TriviaGame folder and click "Open in terminal"
5. Run "npm install --global http-server" (without the quotation marks) in the terminal  
   a. If you get an error saying that you can't run scripts then open Powershell as an Adminstator  
   b. Type "Set-ExecutionPolicy" and hit enter  
   c. Type "Unrestricted" and hit enter  
   d. Type "y" and hit enter  
   e. Redo Step 5  
7. Then run "http-server -p 8000" in the terminal
  a. If it says that this port is in use then choose a different port, typically increment by 1 to 8001
8. Navigate to [http://localhost:8000/index.html] (change 8000 to whatever number you chose in the previous step) and you can play the game

# Mobile Testing
We first looked into using Expo Go to test mobile compatibility with our game, but this is primarily used for React Projects which this is not made with. In order to still be able to test in a Mobile like Enviornment, most Browsers allow for us to tweak our display settings in the Devtools:
1. Launch the Project as usual and navigate to where it's hosted
2. Press "Ctrl" + "Shift" + "C" or right click and press "inspect" to open the browser Devtools
3. Click on the laptop and phone button on the top left of the devtools popup
4. You should now be in Mobile Testing Mode, the average size for phones is 360x800px
5. If you want to turn the Mobile Device, press the "Rotate" icon to the right of the Screen Dimensions Text Box

# Selenium Testing
We plan to implement Selenium testing in our final sprint to automate our testing and be able to test everything. If we make it this far this will be changed from a stub to a full section for the sake of any future groups that work on this project.

# Documentation
Coding Standard:  
https://docs.google.com/document/d/1K2XEdV4LqyqNNV5kEDSuZfxaoWGdsPhmndt-g0EaSmo/edit?usp=sharing

Designs:
- Architectural:  
https://lucid.app/lucidchart/1c5341f9-08d4-4fa4-b6ad-8dc7706524bc/edit?viewport_loc=-292%2C-11%2C1657%2C969%2C0_0&invitationId=inv_5531f77e-6190-4695-a3c4-5dfe66717f15

- High-Level:  
https://lucid.app/lucidchart/b6441c20-4f4d-4df5-a881-82cbcde06f46/edit?viewport_loc=-219%2C115%2C2344%2C1371%2C0_0&invitationId=inv_d405ab3d-20ab-4d2f-ba58-43e06a6751df

- Detailed:  
https://lucid.app/lucidchart/8c6409d7-c966-4027-9e7b-f540bc44c7ab/edit?view_items=U.v8Nv41anwU&invitationId=inv_c4e9e558-64cf-4b57-a089-5013d9bd9d39
  
Testing:  
https://docs.google.com/spreadsheets/d/1eOX0WhN107ZgUZ3vltDHH7hgIQ8ZypfBbt7pmgkgcKI/edit?usp=sharing
