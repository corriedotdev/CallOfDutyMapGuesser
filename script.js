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

        // Update dropdown
        let select = document.getElementById('mapGuess');
        select.innerHTML = '';
        mapImages.forEach(imgPath => {
            let mapName = imgPath.split('/').pop().split('.')[0];
            let option = document.createElement('option');
            option.value = mapName;
            option.textContent = mapName;
            select.appendChild(option);
        });

        document.getElementById('result').textContent = '';
        updateScore();
    }

    function updateScore() {
        document.getElementById('score').textContent = `${currentImageIndex + 1}/${mapImages.length}`;
    }

    function displayResult(message, className) {
        let resultDiv = document.getElementById('result');
        resultDiv.innerHTML = message; // Use innerHTML instead of textContent
        resultDiv.className = className;

        // Countdown before loading new image
        let countdown = 3;
        const countdownInterval = setInterval(function() {
            resultDiv.innerHTML = message + '<br>New map in ' + countdown; // Adding a line break
            countdown--;
            if (countdown < 0) {
                clearInterval(countdownInterval);
                currentImageIndex++;
                loadNewImage();
            }
        }, 1000);
    }

    document.getElementById('submitGuess').addEventListener('click', function() {
        let selectedMap = document.getElementById('mapGuess').value;
        let correctMap = mapImages[currentImageIndex].split('/').pop().split('.')[0];

        if (selectedMap === correctMap) {
            displayResult('Correct, the map was ' + correctMap + '!', 'correct');
            score++;
        } else {
            displayResult('Wrong! The correct map was ' + correctMap, 'wrong');
        }
    });

    loadNewImage();
});
