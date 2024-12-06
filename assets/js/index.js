'use strict';

import { listen, select } from './data/utility.js';
import { wordBank, shuffleWords } from './data/word.js';

 
//const video = select('video');
const startBtn = select('.start-btn');
const restartBtn = select('.restart-btn');
const wordDisplay = select('.word-display');
const wordInput = select('.word-input');
const timerDisplay = select('.timer');
const scoreDisplay = select('.score');
const resultDisplaygameover = select('.result-display-gameover');
const resultDisplay = select('.result-display');
const backgroundMusic = select('.background-music'); 
const gameOverSound = select('.gameover-sound'); 
const resultArea = select('.result-area');
let shuffledWords, currentWord, score, hits, timer, timeLeft, interval;
let scoreArray = []; 



// Save scores to localStorage with sorting and limiting to top 9
function saveScoresToLocalStorage() {
    // Sort the scoreArray by hits in descending order
    scoreArray.sort((a, b) => b.hits - a.hits);
    
    // Limit the array to top 9 scores
    if (scoreArray.length > 9) {
        scoreArray = scoreArray.slice(0, 9);
    }

    // Prepare data for storage
    const scoreData = scoreArray.map(s => ({
        date: s.date.toISOString(),
        hits: s.hits, // 使用 getter
        percentage: s.percentage // 使用 getter
    }));
    localStorage.setItem('scoreArray', JSON.stringify(scoreData));
}

// Load scores from localStorage with sorting and limiting to top 9
function loadScoresFromLocalStorage() {
    const storedScores = localStorage.getItem('scoreArray');
    if (storedScores) {
        const parsed = JSON.parse(storedScores);
        scoreArray = parsed.map(obj => {
            const sc = new Score(obj.hits, obj.percentage);
            sc.date = new Date(obj.date); // 使用 setter
            return sc;
        });

        // Sort and limit the array
        scoreArray.sort((a, b) => b.hits - a.hits);
        if (scoreArray.length > 9) {
            scoreArray = scoreArray.slice(0, 9);
        }

        updateResultsDisplay();
    }
}



// Initialize game
function initializeGame() {
    shuffledWords = shuffleWords();
    hits = 0;
    timeLeft = 15;
    currentWord = shuffledWords.pop();
    timerDisplay.textContent = `${timeLeft}`;
    scoreDisplay.textContent = `Score: ${hits}`;
    wordDisplay.textContent = currentWord;
    updateWordDisplay(currentWord);
    wordInput.value = '';
    wordInput.disabled = false;
    wordInput.focus();
    resultDisplaygameover.style.display = 'none';
    resultDisplaygameover.textContent = '';

    timerDisplay.classList.remove('blink');
    loadScoresFromLocalStorage();
};


// Update timer every second
function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = `${timeLeft}`;

    if (timeLeft <= 5) {
      timerDisplay.classList.add('blink');
    }

    if (timeLeft <= 0) endGame();
};

function updateWordDisplay(newWord) {
    // Add fade-out effect
    wordDisplay.classList.add('fade');

    // Wait for animation to end, then update content
    setTimeout(() => {
        wordDisplay.textContent = newWord;

        // Add fade-in effect
        wordDisplay.classList.remove('fade');
    }, 300); // Match the transition duration in CSS
};


// Check if the typed word matches the displayed word
// Check if the typed word matches the displayed word
function checkWord() {
    if (wordInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
        hits++;
        scoreDisplay.textContent = `Score: ${hits}`;

        // 添加动画类
        wordDisplay.classList.add('correct');
        // 当动画结束后移除类
        listen(wordDisplay, 'animationend', () => {
            wordDisplay.classList.remove('correct');
        }, { once: true });

        wordInput.value = '';
        if (shuffledWords.length === 0) {
            endGame();
        } else {
            currentWord = shuffledWords.pop();
            wordDisplay.innerHTML = `<span>${currentWord}</span>`;
        }
    }
};


function showScoreboard() {
    resultArea.style.display = 'block';
};

function hideScoreboard() {
    resultArea.style.display = 'none';
};

// Function to display all results
function updateResultsDisplay(highlightTimestamp = null) {
    resultDisplay.innerHTML = ''; 
    if (scoreArray.length === 0) {
        const noScoreElement = document.createElement('p');
        noScoreElement.textContent = "No scores available.";
        resultDisplay.appendChild(noScoreElement);
    } else {
        scoreArray.forEach((score, index) => {
            const scoreElement = document.createElement('p');
            scoreElement.textContent = `${index + 1}. ${score.getScoreSummary()}`;
            if (highlightTimestamp && score.date.getTime() === highlightTimestamp) {
                scoreElement.classList.add('new-score');
                // Optionally, remove the class after a delay (e.g., 10 seconds)
                setTimeout(() => {
                    scoreElement.classList.remove('new-score');
                }, 10000); // 10000 milliseconds = 10 seconds
            }
            resultDisplay.appendChild(scoreElement);
        });
    }
    resultDisplay.style.display = 'block';
}
  

// Start game function
function startGame() {
    initializeGame();
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline';
    hideScoreboard();
    interval = setInterval(updateTimer, 1000);
    backgroundMusic.play(); 
};

// End game function
// End game function
function endGame() {
    clearInterval(interval);
    wordInput.disabled = true;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    timerDisplay.classList.remove('blink');

    gameOverSound.play();

    // Calculate accuracy based on hits and total words in wordBank
    const accuracy = wordBank.length > 0 ? ((hits / wordBank.length) * 100).toFixed(2) : 0;
    const newScore = new Score(hits, accuracy);

    // Insert the new score into the scoreArray in the correct position
    scoreArray.push(newScore);
    scoreArray.sort((a, b) => b.hits - a.hits); // Sort descending

    // Check if the new score qualifies for top 9
    if (scoreArray.length > 9) {
        scoreArray = scoreArray.slice(0, 9);
    }

    // Save the updated scores
    saveScoresToLocalStorage();

    // Find the timestamp of the new score for highlighting
    const newScoreTimestamp = newScore.date.getTime();

    // Update the display and pass the new score's timestamp
    updateResultsDisplay(newScoreTimestamp);
    showScoreboard();

    resultDisplaygameover.textContent = `Game Over!`;
    resultDisplaygameover.style.display = 'block';

    wordDisplay.textContent = "Press Restart to begin!";
}



// Restart game function
function restartGame() {
    initializeGame();
    clearInterval(interval);
    hideScoreboard(); 
    startGame();
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
};

// Event listeners
listen(startBtn, 'click', startGame);
listen(restartBtn, 'click', restartGame);
listen(wordInput, 'input', checkWord);

const clearScoresBtn = select('.clear-scores-btn');

listen(clearScoresBtn, 'click', () => {
  // 清空数组
  scoreArray = [];
  // 清空localStorage中的记录
  localStorage.removeItem('scoreArray');
  // 更新显示
  updateResultsDisplay();
});

