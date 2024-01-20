document.addEventListener('DOMContentLoaded', function() {
    let currentImageIndex = 0;
    let score = 0;
    let guessCountdown;
    let isResultDisplayed = false;
    let waitingForNextImage = false;

    const mapGuessInput = document.getElementById('mapGuess');

    function keepFocusOnInput() {
        if (document.activeElement !== mapGuessInput) {
            mapGuessInput.focus();
        }
    }
    
    document.addEventListener('contextmenu', event => event.preventDefault());

    setInterval(keepFocusOnInput, 100);

function startGuessCountdown() {
    clearInterval(guessCountdown); // Clear any existing interval

    let timeLeft = 10;
    document.getElementById('countdown').textContent = `${timeLeft}`;
    guessCountdown = setInterval(function() {
        timeLeft--;
        document.getElementById('countdown').textContent = `${timeLeft}`;

        if (timeLeft <= 0) {
            clearInterval(guessCountdown);
            displayResult('Time is up! Moving to the next map..', 'wrong');
           // commenting this as it was being called twice moveToNextImage();
        }
    }, 1000);
}


    function createConfetti() {
        const numberOfParticles = 30;
        const confettiContainer = document.getElementById('confetti-container');

        for (let i = 0; i < numberOfParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * confettiContainer.offsetWidth}px`;
            particle.style.top = `${Math.random() * confettiContainer.offsetHeight}px`;
            particle.style.animationDuration = `${Math.random() * 2 + 1}s`;
            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

            confettiContainer.appendChild(particle);

            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }

    function endGame() {
        // Hide game elements
        document.getElementById('gameImage').style.display = 'none';
        document.getElementById('mapGuess').style.display = 'none';
        document.getElementById('submitGuess').style.display = 'none';
        document.getElementById('countdown').style.display = 'none';
        document.getElementById('result').style.display = 'none';
    
        // Display the final score
        let finalScoreDiv = document.getElementById('gamescore');
        finalScoreDiv.style.display = 'block';
        finalScoreDiv.textContent = `You scored ${score}/${mapImages.length}`;
    }
    
    

    
    function moveToNextImage() {
        if (waitingForNextImage || isResultDisplayed) return;
    
        waitingForNextImage = true;
        clearInterval(guessCountdown);
    
        if (currentImageIndex + 1 < mapImages.length) {
            setTimeout(() => {
                currentImageIndex++;
                loadNewImage();
                waitingForNextImage = false;
            }, 4000);
        } else {
            setTimeout(() => {
                endGame();
            }, 3000);
        }
    }
    
    function loadNewImage() {
        if (currentImageIndex >= mapImages.length) {
            endGame();
            return;
        }
    
        let gameImage = document.getElementById('gameImage');
        // Reset for new image
        gameImage.style.opacity = '0';
        gameImage.style.transform = 'translateX(100%)'; // Start off-screen to the right
        gameImage.style.animationName = '';
        
        setTimeout(() => {
            gameImage.src = mapImages[currentImageIndex];
            gameImage.onload = () => {
                gameImage.style.opacity = '1';
                gameImage.style.transform = 'translateX(0)'; // Move to visible area
                gameImage.style.animationName = 'swipeInFromRight'; // Start swipe-in
            };
        }, 1100); // Synchronize with the end of the swipe-out animation
        
        isResultDisplayed = false;
        let imagePath = mapImages[currentImageIndex];
        document.getElementById('gameImage').src = imagePath;
        document.getElementById('result').textContent = '';
        document.getElementById('countdown').textContent = '';
        
        // Clear the input box for the next guess
        document.getElementById('mapGuess').value = '';
    
        updateScore();
        startGuessCountdown();
    }
    
    function updateScore() {
        document.getElementById('score').textContent = `${currentImageIndex + 1}/${mapImages.length}`;
    }
    
    function startResultCountdown(baseMessage) {
        let countdown = 3;
        let resultDiv = document.getElementById('result');
        resultDiv.innerHTML = baseMessage + countdown;
    
        const countdownInterval = setInterval(() => {
            countdown--;
            resultDiv.innerHTML = baseMessage + countdown;
    
            if (countdown === 2) {
                document.getElementById('gameImage').style.animationName = 'swipeOutToLeft';
            }
    
            if (countdown <= 1) {
                clearInterval(countdownInterval);
                if (currentImageIndex + 1 < mapImages.length) {
                    setTimeout(() => {
                        currentImageIndex++;
                        loadNewImage();
                    }, 1000); // Delay to allow for swipe animation
                } else {
                    endGame();
                }
            }
        }, 1000);
    }
    
    
    function displayResult(message, className) {
        let resultDiv = document.getElementById('result');
        let gameImageContainer = document.getElementById('gameImage');
    
        resultDiv.className = className;
    
        if (className === 'correct') {
            createConfetti();
            // No change needed here
        } else if (className === 'wrong') {
            // Delay the start of the countdown to allow the shake animation to play
            setTimeout(() => {
                shakeScreen(); // Add shake effect
                startResultCountdown(`${message}, starting next map in `);
            }, 100); // Delay should be equal to or slightly more than the shake animation duration
    
            return; // Early return
        }
    
        // For correct guesses or other scenarios
        startResultCountdown(`${message}, starting next map in `);
        isResultDisplayed = true;
    }
    
    function shakeScreen() {
        const gameContainer = document.getElementById('image-container');
        //document.body; // or target a specific element
        gameContainer.classList.add('shake');
        setTimeout(() => {
            gameContainer.classList.remove('shake');
        }, 1820); // Match this with the CSS animation duration
    }
    
    
    
    

    document.getElementById('submitGuess').addEventListener('click', function() {
        if (isResultDisplayed || waitingForNextImage) return;
    
        clearInterval(guessCountdown);
        let inputMapName = document.getElementById('mapGuess').value.toLowerCase().replace(/\s+/g, '');
        let correctMap = mapImages[currentImageIndex].split('/').pop().split('.')[0].toLowerCase().replace(/\s+/g, '');
    
        if (inputMapName === correctMap) {
            displayResult('Correct', 'correct');
            score++;
        } else {
            displayResult(`Wrong, the map was ${correctMap}`, 'wrong');
        }
        isResultDisplayed = true;
        moveToNextImage();
    });
    

    document.getElementById('mapGuess').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            document.getElementById('submitGuess').click();
        }
    });

    document.getElementById('mapGuess').focus();
    loadNewImage();
});
