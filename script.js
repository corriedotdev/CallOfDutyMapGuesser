document.addEventListener('DOMContentLoaded', function() {
    let currentImageIndex = 0;
    let score = 0;

    function loadNewImage() {
        if (currentImageIndex >= mapImages.length) {
            alert('Game over! Your score: ' + score);
            currentImageIndex = 0;
            score = 0;
            return;
        }

        let imagePath = mapImages[currentImageIndex];
        document.getElementById('gameImage').src = imagePath;
        document.getElementById('result').textContent = '';
        updateScore();
    }

    function updateScore() {
        document.getElementById('score').textContent = `${currentImageIndex + 1}/${mapImages.length}`;
    }

    function displayResult(message, className) {
        let resultDiv = document.getElementById('result');
        resultDiv.innerHTML = message;
        resultDiv.className = className;

        let countdown = 3;
        const countdownInterval = setInterval(function() {
            resultDiv.innerHTML = message + '<br>New map in ' + countdown;
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                currentImageIndex++;
                loadNewImage();
            }
        }, 1000);
    }

    document.getElementById('submitGuess').addEventListener('click', function() {
        let inputMapName = document.getElementById('mapGuess').value;

        if (!/^[a-zA-Z\s]+$/.test(inputMapName)) {
            alert("Please enter a valid map name (letters and spaces only).");
            return;
        }

        inputMapName = inputMapName.toLowerCase().replace(/\s+/g, '');
        let correctMap = mapImages[currentImageIndex].split('/').pop().split('.')[0].toLowerCase().replace(/\s+/g, '');

        if (inputMapName === correctMap) {
            displayResult('Correct, the map was ' + correctMap + '!', 'correct');
            score++;
        } else {
            displayResult('Wrong! The correct map was ' + correctMap, 'wrong');
        }
    });

        // Get the input and button elements
        const input = document.getElementById('mapGuess');
        const submitButton = document.getElementById('submitGuess');
    
        // Event listener for keypress on the input field
        input.addEventListener('keypress', function(event) {
            // Check if the key pressed is the Enter key
            if (event.key === 'Enter') {
                // Trigger the click event on the submit button
                submitButton.click();
            }
        });

    // Automatically focus on the mapGuess input
    document.getElementById('mapGuess').focus();

    loadNewImage();
});
