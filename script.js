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

    setInterval(keepFocusOnInput, 100);

    function startGuessCountdown() {
        let timeLeft = 10;
        document.getElementById('countdown').textContent = `${timeLeft}`;
        guessCountdown = setInterval(function() {
            timeLeft--;
            document.getElementById('countdown').textContent = `${timeLeft}`;

            if (timeLeft <= 0) {
                clearInterval(guessCountdown);
                displayResult('Time is up! Moving to the next map...', 'wrong');
                moveToNextImage();
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

    function moveToNextImage() {
        if (waitingForNextImage) return;

        waitingForNextImage = true;
        clearInterval(guessCountdown);
        
        if (currentImageIndex + 1 < mapImages.length) {
            setTimeout(() => {
                currentImageIndex++;
                loadNewImage();
                waitingForNextImage = false;
            }, 3000);
        } else {
            alert('Game over! Your score: ' + score);
            currentImageIndex = 0;
            score = 0;
            loadNewImage();
            waitingForNextImage = false;
        }
        document.getElementById('mapGuess').value = '';
        isResultDisplayed = false;
    }

    function loadNewImage() {
        isResultDisplayed = false;
        let imagePath = mapImages[currentImageIndex];
        document.getElementById('gameImage').src = imagePath;
        document.getElementById('result').textContent = '';
        document.getElementById('countdown').textContent = '';
        updateScore();
        startGuessCountdown();
    }

    function updateScore() {
        document.getElementById('score').textContent = `${currentImageIndex + 1}/${mapImages.length}`;
    }

    function displayResult(message, className) {
        let resultDiv = document.getElementById('result');
        let gameImageContainer = document.getElementById('gameImage');

        resultDiv.innerHTML = message;
        resultDiv.className = className;

        if (className === 'correct') {
            createConfetti();
        }

        if (className === 'wrong') {
            gameImageContainer.classList.add('shake');
            setTimeout(() => {
                gameImageContainer.classList.remove('shake');
            }, 820);
        }
    }

    document.getElementById('submitGuess').addEventListener('click', function() {
        if (isResultDisplayed || waitingForNextImage) return;

        clearInterval(guessCountdown);
        let inputMapName = document.getElementById('mapGuess').value.toLowerCase().replace(/\s+/g, '');
        let correctMap = mapImages[currentImageIndex].split('/').pop().split('.')[0].toLowerCase().replace(/\s+/g, '');

        if (inputMapName === correctMap) {
            displayResult('Correct, the map was ' + correctMap + '!', 'correct');
            score++;
        } else {
            displayResult('Wrong! The correct map was ' + correctMap, 'wrong');
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
