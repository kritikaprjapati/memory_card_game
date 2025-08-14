const board = document.getElementById('game-board');
const moveCounter = document.getElementById('move-count');
const timerDisplay = document.getElementById('timer');
const newGameBtn = document.getElementById('new-game');
const congratsMessage = document.getElementById('congrats-message');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer;
let seconds = 0;
let gameStarted = false; // Flag to check if the game has truly started

// Image paths for your cards.
const cardImages = [
    'panda.jpg', 'cute_deer.jpg', 'mouse.jpg', 'dinosaur.jpg',
    'turtle.jpg', 'shark.jpg', 'frog.jpg', 'squirrel.jpg'
];

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startGame() {
    board.innerHTML = ''; // Clear previous cards
    congratsMessage.classList.add('hidden'); // Hide congrats message
    moves = 0;
    seconds = 0;
    matchedPairs = 0;
    flippedCards = [];
    moveCounter.textContent = moves;
    timerDisplay.textContent = '0s';
    clearInterval(timer); // Clear any existing timer
    gameStarted = false; // Reset game started flag

    const doubledImages = [...cardImages, ...cardImages]; // Duplicate images for pairs
    const shuffled = shuffle(doubledImages); // Shuffle them

    shuffled.forEach((imagePath) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.imagePath = imagePath; // Store the image path as a data attribute

        // Front face (the image)
        const frontFace = document.createElement('div'); // Using a div to hold the img for consistent sizing
        frontFace.classList.add('front-face');
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'card-image';
        frontFace.appendChild(img);
        card.appendChild(frontFace);

        // Back face (the blue background)
        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        card.appendChild(backFace);

        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
        cards.push(card); // Keep track of all cards
    });
}

function startTimer() {
    if (!gameStarted) {
        timer = setInterval(() => {
            seconds++;
            timerDisplay.textContent = `${seconds}s`;
        }, 1000);
        gameStarted = true; // Set flag to true once timer starts
    }
}


function flipCard(card) {
    // Start the timer on the first click
    startTimer();

    // Prevent flipping more than two cards, or clicking on already flipped/matched cards
    if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped'); // Add 'flipped' class to rotate the card
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        moveCounter.textContent = moves;

        const [firstCard, secondCard] = flippedCards;
        // Compare based on the data-imagePath attribute
        if (firstCard.dataset.imagePath === secondCard.dataset.imagePath) {
            // It's a match!
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            // Do NOT remove 'flipped' class here for matched cards.
            // The CSS for .card.matched will keep them rotated to show the image.

            matchedPairs++;
            flippedCards = []; // Reset for the next pair

            if (matchedPairs === cardImages.length) {
                // All pairs matched!
                clearInterval(timer);
                congratsMessage.classList.remove('hidden');
            }
        } else {
            // No match, flip them back after a short delay
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                flippedCards = []; // Reset for the next pair
            }, 1000);
        }
    }
}

// Event listener for the "New Game" button
newGameBtn.addEventListener('click', () => {
    cards = []; // Reset the cards array before starting a new game
    startGame();
});

// Start the game when the window loads
window.onload = startGame;