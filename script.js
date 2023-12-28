document.addEventListener('DOMContentLoaded', () => {
    const phrase = "You can stop asking when we're having a baby".toUpperCase();
    const gameBoard = document.getElementById('gameBoard');
    const keyboard = document.getElementById('keyboard');
    let guessedLetters = new Set();
    let guesses = 0;
    let lettersRevealed = 0;

    // Initialize game board with words and spaces
    const words = phrase.split(' ');
    words.forEach((word, index) => {
        let wordDiv = document.createElement('div');
        wordDiv.classList.add('word');
        word.split('').forEach(char => {
            let cell = document.createElement('div');
            cell.classList.add('letter');
            // If the character is an apostrophe or other special character, display it immediately
            if (char === "'") {
                cell.textContent = char;
                cell.style.color = 'black'; // Show the apostrophe
            }
            wordDiv.appendChild(cell);
        });
        gameBoard.appendChild(wordDiv);
        // No longer need to add a div for spaces between words since gap in CSS handles it
    });

    // This function simulates a button click
    const simulateButtonClick = (letter) => {
        let button = document.querySelector(`button[data-letter="${letter}"]`);
        if (button) {
            button.click();
        }
    };

    // Listen for keydown events to capture keyboard input
    document.addEventListener('keydown', (event) => {
        let letter = event.key.toUpperCase();
        // Check if the key pressed is a letter and not already guessed
        if (letter.length === 1 && letter >= 'A' && letter <= 'Z' && !guessedLetters.has(letter)) {
            simulateButtonClick(letter);
        }
    });

    // Initialize keyboard
    for (let i = 65; i <= 90; i++) {
        let button = document.createElement('button');
        let letter = String.fromCharCode(i);
        button.textContent = letter;
        button.setAttribute('data-letter', letter); // Add a data attribute to map the button to a letter
        button.addEventListener('click', () => {
            if (!guessedLetters.has(letter)) {
                guessedLetters.add(letter);
                if (confirm(`Do you want to select the letter "${letter}"?`)) {
                    let isMatch = revealLetter(letter);
                    button.classList.add(isMatch ? 'button-match' : 'button-mismatch');
                    updateScoreboard();
                } else {
                    // If they cancel, remove the letter from guessedLetters
                    guessedLetters.delete(letter);
                }
            }
        });
        keyboard.appendChild(button);
    }

    // Update scoreboard
    const updateScoreboard = () => {
        const scoreboard = document.getElementById('scoreboard');
        scoreboard.textContent = `Letters Used: ${guessedLetters.size}, Guesses: ${guesses}`;
    };

    // Reveal letter 
    const revealLetter = (letter) => {
        let cells = document.querySelectorAll('#gameBoard .word .letter');
        let letterIndex = 0;
        let foundMatch = false;
        for (let i = 0; i < phrase.length; i++) {
            // Check if the cell should show a letter or special character
            if (phrase[i].toUpperCase() === letter || ".,'!?-".includes(phrase[i])) {
                // Only update the textContent if the cell is empty or contains a special character
                if (cells[letterIndex].textContent === "" || ".,'!?-".includes(cells[letterIndex].textContent)) {
                    cells[letterIndex].textContent = phrase[i];
                }
                // If the guessed letter matches, reveal it
                if (phrase[i].toUpperCase() === letter) {
                    cells[letterIndex].style.color = 'black'; // Reveal the letter
                    lettersRevealed++;
                    foundMatch = true;
                }
            } else if (cells[letterIndex].textContent === "") {
                cells[letterIndex].textContent = "";
            }
            if (phrase[i] !== ' ') letterIndex++; // Only increment if not a space
        }
        checkWin();
        return foundMatch; // Return whether a match was found
    };

    // Check if the user has won
    const checkWin = () => {
        if (lettersRevealed === phrase.replace(/ /g, '').length) {
            alert(`Congratulations! You've guessed the phrase with ${guessedLetters.size} letters and ${guesses} guesses!`);
        }
    };

    // Add container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';
    document.body.appendChild(buttonContainer);

    // Add a button to guess the entire phrase
    const guessButton = document.createElement('button');
    guessButton.id = 'guessButton';
    guessButton.textContent = "Guess Phrase";
    guessButton.addEventListener('click', () => {
        let userGuess = prompt("Please enter your guess for the phrase:");
        if (userGuess.toUpperCase() === phrase) {
            alert(`Congratulations! You've guessed the phrase correctly!`);
        } else {
            alert(`That's not correct. Keep trying!`);
            guesses++;
            updateScoreboard();
        }
    });
    buttonContainer.appendChild(guessButton); // Append to the button container instead of directly to body

    // Add a button to refresh the game
    const refreshButton = document.createElement('button');
    refreshButton.classList.add('refreshButton');
    refreshButton.textContent = "Refresh Game";
    refreshButton.addEventListener('click', () => {
        window.location.reload(); // Refreshes the page
    });
    buttonContainer.appendChild(refreshButton); // Append to the button container

    updateScoreboard(); // Initial scoreboard update
});
