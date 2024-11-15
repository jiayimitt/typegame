'use strict';

// Word bank
const wordBank = [
  'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
  'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
  'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
  'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
  'philosophy', 'database', 'periodic', 'capitalism', 'abominable', 'phone',
  'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
  'velvet', 'potion', 'treasure', 'beacon', 'labyrinth', 'whisper', 'breeze',
  'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology',
  'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
  'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
  'butterfly', 'discovery', 'ambition', 'music', 'eagle', 'crown',
  'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'door', 'bird',
  'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
  'beach', 'economy', 'interview', 'awesome', 'challenge', 'science',
  'mystery', 'famous', 'league', 'memory', 'leather', 'planet', 'software',
  'update', 'yellow', 'keyboard', 'window', 'beans', 'truck', 'sheep',
  'blossom', 'secret', 'wonder', 'enchantment', 'destiny', 'quest', 'sanctuary',
  'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil',
  'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
  'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort',
  'mask', 'escape', 'promise', 'band', 'level', 'hope', 'moonlight', 'media',
  'orchestra', 'volcano', 'guitar', 'raindrop', 'inspiration', 'diamond',
  'illusion', 'firefly', 'ocean', 'cascade', 'journey', 'laughter', 'horizon',
  'exploration', 'serendipity', 'infinity', 'silhouette', 'wanderlust',
  'marvel', 'nostalgia', 'serenity', 'reflection', 'twilight', 'harmony',
  'symphony', 'solitude', 'essence', 'melancholy', 'melody', 'vision',
  'silence', 'whimsical', 'eternity', 'cathedral', 'embrace', 'poet', 'ricochet',
  'mountain', 'dance', 'sunrise', 'dragon', 'adventure', 'galaxy', 'echo',
  'fantasy', 'radiant', 'serene', 'legend', 'starlight', 'light', 'pressure',
  'bread', 'cake', 'caramel', 'juice', 'mouse', 'charger', 'pillow', 'candle',
  'film', 'jupiter'
 ];
 
const video = document.querySelector('video');
const startBtn = document.querySelector('.start-btn');
const restartBtn = document.querySelector('.restart-btn');
const wordDisplay = document.querySelector('.word-display');
const wordInput = document.querySelector('.word-input');
const timerDisplay = document.querySelector('.timer');
const scoreDisplay = document.querySelector('.score');
const resultDisplaygameover = document.querySelector('.result-display-gameover');
const resultDisplay = document.querySelector('.result-display');
const backgroundMusic = document.querySelector('.background-music'); 
const gameOverSound = document.querySelector('.gameover-sound'); 
const resultArea = document.querySelector('.result-area');
let shuffledWords, currentWord, score, timer, timeLeft, interval;
const scoreArray = []; 

// Score class to track individual game results
class Score {
    constructor(hits, percentage) {
        this.date = new Date();
        this.hits = hits;
        this.percentage = percentage;
    }

    get dateFormatted() {
        return this.date.toLocaleDateString();
    }

    get scoreSummary() {
        return `Date: ${this.dateFormatted}, Hits: ${this.hits}, Percentage: ${this.percentage}%`;
    }
}

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Initialize game
const initializeGame = () => {
    shuffledWords = shuffleArray([...wordBank]);
    score = 0;
    timeLeft = 15;
    currentWord = shuffledWords.pop();
    timerDisplay.textContent = `${timeLeft}`;
    scoreDisplay.textContent = `Score: ${score}`;
    wordDisplay.textContent = currentWord;
    updateWordDisplay(currentWord);
    wordInput.value = '';
    wordInput.disabled = false;
    wordInput.focus();
    resultDisplaygameover.style.display = 'none';
    resultDisplaygameover.textContent = '';

    timerDisplay.classList.remove('blink');
};

// Update timer every second
const updateTimer = () => {
    timeLeft--;
    timerDisplay.textContent = `${timeLeft}`;

    if (timeLeft <= 5) {
      timerDisplay.classList.add('blink');
    }

    if (timeLeft <= 0) endGame();
};

const updateWordDisplay = (newWord) => {
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
const checkWord = () => {
    if (wordInput.value.trim() === currentWord) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        wordInput.value = '';
        if (shuffledWords.length === 0) {
            endGame();
        } else {
            currentWord = shuffledWords.pop();
            wordDisplay.textContent = currentWord;
        }
    }
};

const showScoreboard = () => {
    resultArea.style.display = 'block';
};

const hideScoreboard = () => {
    resultArea.style.display = 'none';
};

// Function to display all results
const updateResultsDisplay = () => {
  resultDisplay.innerHTML = ''; 
  scoreArray.forEach((score, index) => {
      const scoreElement = document.createElement('p');
      scoreElement.textContent = `${index + 1}. ${score.scoreSummary}`;
      resultDisplay.appendChild(scoreElement);
  });
  resultDisplay.style.display = 'block';
};

// Start game function
const startGame = () => {
    initializeGame();
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline';
    hideScoreboard();
    interval = setInterval(updateTimer, 1000);
    backgroundMusic.play(); 
};

// End game function
const endGame = () => {
    clearInterval(interval);
    wordInput.disabled = true;
    backgroundMusic.pause(); 
    backgroundMusic.currentTime = 0; 

    timerDisplay.classList.remove('blink');

    gameOverSound.play();

    const accuracy = ((score / wordBank.length) * 100).toFixed(2);
    const newScore = new Score(score, accuracy);
    scoreArray.push(newScore);

    updateResultsDisplay();
    showScoreboard();

    // Display Game Over message and update results display
    resultDisplaygameover.textContent = `Game Over!`;
    resultDisplaygameover.style.display = 'block';
    updateResultsDisplay(); // Update result display with all scores

    wordDisplay.textContent = "Press Restart to begin!";
    
};

// Restart game function
const restartGame = () => {
    initializeGame();
    clearInterval(interval);
    hideScoreboard(); 
    startGame();
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
};

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
wordInput.addEventListener('input', checkWord);

