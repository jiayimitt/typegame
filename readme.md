# Piano Typist Game

## Project Overview

**Piano Typist** is a typing game where users need to type words displayed on the screen within a set time limit. The game combines background music and a timer, providing an enjoyable challenge to test the player's typing speed and accuracy.

The background music of the game uses the piano piece *"Butterfly Lovers' Concerto"* (Liang Zhu), which adds an atmospheric touch to the experience. Players must type the word that matches the one displayed on the screen. Each correct word typed increases the player's score. As time runs out, the player needs to quickly type as many words as possible to achieve a high score.

## Features

- **Real-time Timer**: Shows the remaining time, and the game ends when time is up.
- **Real-time Score**: Records the player's score, increasing with each correct word typed.
- **Word Display**: Randomly shows a word for the player to type.
- **Background Music**: *"Butterfly Lovers' Concerto"* is used as the background music to enhance the gaming experience.
- **Game Result Display**: Displays the player's score and historical results after the game ends.
- **Restart Option**: Allows the player to restart the game after it ends.

## Tech Stack

- **HTML**: Used for structuring the webpage content.
- **CSS**: Used for styling the page and adding animations.
- **JavaScript**: Implements the game logic, timer, event listeners, etc.
- **Font Awesome**: Used for displaying icons in the game.
- **Google Fonts**: Uses the "Nunito Sans" font for enhanced aesthetics.

## Directory Structure

```
/piano-typist-game
│
├── assets/
│   ├── audio/                 # Game background music files
│   │   └── liangzhu.mp3
│   ├── css/                   # Stylesheets
│   │   └── style.css
│   ├── img/                   # Icons and images
│   │   └── letter-n.png
│   └── video/                 # Background video files
│       └── northern-light.mp4
├── index.html                # The main HTML file
└── assets/js/index.js        # The JavaScript file for game logic
```

## Installation and Running

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/piano-typist-game.git
   ```

2. Open the `index.html` file in your browser to run the game.

   You can also use a local server to run the project, or just open it directly in your browser.

## How to Play

1. **Start the Game**: Click the "Start" button, and the game will begin with a countdown and a word displayed.
2. **Type the Word**: Type the word displayed on the screen. Each correct word typed will increase your score.
3. **Game Over**: When the time runs out, the game will automatically stop and display your final score.
4. **Restart**: After the game ends, you can click the "Restart" button to start a new game.

## Game Rules

- After the game starts, the player needs to type the word displayed on the screen.
- For each correct word typed, the score increases, and the word changes.
- The timer is set to 15 seconds, and the player should try to type as many words as possible within that time.
- When the time is up, the game ends, and the final score is displayed.

## Contributing

Feel free to open issues, suggest improvements, or contribute code! You can participate by:

1. Forking this repository and submitting a pull request.
2. Opening an issue to report a bug or suggest new features.


## Contact Information

- Author: Jiayi
- Email: jiayi_nie@163.com
