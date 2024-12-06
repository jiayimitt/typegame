'use strict';

import { listen, select } from './data/utility.js';
import { wordBank, shuffleWords } from './data/word.js';
 
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
const clearScoresBtn = select('.clear-scores-btn');
const hideScoresBtn = select('.hide-scores-btn');
let shuffledWords, currentWord, hits, timeLeft, interval;
let scoreArray = []; 

// Save scores to localStorage with sorting and limiting to top 9
function saveScoresToLocalStorage() {

    scoreArray.sort((a, b) => b.hits - a.hits);

    if (scoreArray.length > 9) {
        scoreArray = scoreArray.slice(0, 9);
    }

    const scoreData = [];
    for (let i = 0; i < scoreArray.length; i++) {
        const score = scoreArray[i];
        scoreData.push({
            date: score.date.toISOString(),
            hits: score.hits,
            percentage: score.percentage
        });
    }
    localStorage.setItem('scoreArray', JSON.stringify(scoreData));
}

// Load scores from localStorage with sorting and limiting to top 9
function loadScoresFromLocalStorage() {
    const storedScores = localStorage.getItem('scoreArray');
    if (storedScores) {
        const parsed = JSON.parse(storedScores);
        scoreArray = parsed.map(obj => ({
            date: new Date(obj.date),
            hits: obj.hits,
            percentage: obj.percentage
        }));

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
    wordDisplay.classList.add('fade');

    setTimeout(() => {
        wordDisplay.textContent = newWord;
        wordDisplay.classList.remove('fade');
    }, 300); 
};

// Check if the typed word matches the displayed word
function checkWord() {
    if (wordInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
        hits++;
        scoreDisplay.textContent = `Score: ${hits}`;

        wordDisplay.classList.add('correct');

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
            scoreElement.textContent = `${index + 1}. Date: ${score.date.toLocaleDateString()}, Hits: ${score.hits}, Percentage: ${score.percentage}%`;
            if (highlightTimestamp && score.date.getTime() === highlightTimestamp) {
                scoreElement.classList.add('new-score');
                setTimeout(() => {
                    scoreElement.classList.remove('new-score');
                }, 10000); 
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
function endGame() {
    clearInterval(interval);
    wordInput.disabled = true;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    timerDisplay.classList.remove('blink');
    gameOverSound.play();

    const accuracy = wordBank.length > 0 ? ((hits / wordBank.length) * 100).toFixed(2) : 0;

    // Use regular objects to store score
    const newScore = {
        date: new Date(),
        hits: hits,
        percentage: accuracy
    };

    scoreArray.push(newScore);
    scoreArray.sort((a, b) => b.hits - a.hits); 

    if (scoreArray.length > 9) {
        scoreArray = scoreArray.slice(0, 9);
    }

    saveScoresToLocalStorage();

    const newScoreTimestamp = newScore.date.getTime();
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
listen(hideScoresBtn, 'click', hideScoreboard);

listen(clearScoresBtn, 'click', () => {
  scoreArray = [];
  localStorage.removeItem('scoreArray');
  updateResultsDisplay();
});

loadScoresFromLocalStorage(); 
updateResultsDisplay(); 
resultArea.style.display = 'block'; 
