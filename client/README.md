# Endless Trivia Frontend

This contains some basic instructions:

## How to clone this repository to your machine

1. Make sure you have installed "git" on your machine
2. Open the terminal window
3. Change current directory to where you want to store this repository at
4. Type `git clone https://github.com/a916057886/endless-trivia-fe.git`

## When you clone this repository for the first time

type `npm install` to install all the packages necessary

## How to start the frontend

type `npm start` to start a local webserver that hosts the website, a webpage should be automatically opened by the browser, if not, type http://localhost:3000/ in your browser to open it manually

## Few more notes
- If you are making any changes, please create another branch and put changes in that branch, you can create a new branch by typing `git checkout -b branch_name` (By the way you can type `git checkout branch_name` to switch to other existing branch)
- To push new changes to git, you can do the following:
  1. Type `git add .` to tell git that all files will be updated
  2. Type `git commit -m "Message"` to commit the new changes with the provided `Message`
  3. You can repeat step 1 and 2 as many times as you want, but all the change(s) will remain on your machine
  4. Type `git push origin branch_name` to push the commit(s) to the git
- After the new changes are finalized, you can create a pull request (you can do so directly on the GitHub), and merge the changes to the `master` branch. (Feel free to add other team member to review your changes before merging if you want to)
- It is suggested that everytime you start to work on your branch, switch to `master` branch, type `git pull origin master` to get all new changes made by other team member(s) if there is any, then switch to your branch, and type `git merge master` to migrate the new changes to your branch
