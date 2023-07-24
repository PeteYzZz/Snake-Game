const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY =  0;
let setIntervalId;
let score = 0;
 
// get high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Highest Score: ${highScore}`;

const changeFoodPosition = () => {
    // random food postion from 0 - 30
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // clear stat and reload web page
    clearInterval(setIntervalId);
    alert("Game Over! Click OK to restart...");
    location.reload();
}

const changeDirection = (e) => {
    if(e.key === "ArrowUp" || e.key === "w" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" || e.key === "s" && velocityY != -1)  {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" || e.key === "a" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" || e.key === "d" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class ="food" style="grid-area: ${foodY} / ${foodX}" ></div>`;
    
    // food position change if snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // push food postion to snake body array
        score++; // score plus 1 after eat food

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Current Score: ${score}`;
        highScoreElement.innerText = `Highest Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // add body value to snake body after eating food
        snakeBody[i] = snakeBody[i - 1];
        
    }

    snakeBody[0] = [snakeX,snakeY];
    
    // snake's head positon update based on current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    //check if snake hit the wall if yes return game over!
    if (snakeX <= 0 || snakeX > 30 || snakeY <=0 || snakeY > 30) {
        gameOver = true;
    }


    for (let i = 0; i < snakeBody.length; i++) {
        // add div to snake body 
        htmlMarkup += `<div class ="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}" ></div>`;
        // game over if snake hit it's own body
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);