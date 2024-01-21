document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('copyButton');
    const shareText = document.getElementById('shareText').innerText;
    const copiedText = document.getElementById('copiedText');

    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(shareText).then(() => {
            // Hide the share text and button
            document.querySelector('.link-copy').style.display = 'none';

            // Show and animate the copied text
            copiedText.style.display = 'block';
            copiedText.style.animation = 'swipeDown 0.3s ease forwards';

            // Optionally reset after a few seconds
            setTimeout(() => {
                document.querySelector('.link-copy').style.display = 'flex';
                copiedText.style.display = 'none';
            }, 2000);
        }).catch(err => {
            console.error('Error copying text: ', err);
        });
    });
});

// ... Your existing JavaScript ...

// After showing "Copied!", reset to original state
setTimeout(() => {
    document.querySelector('.link-copy').style.display = 'flex';
    copiedText.style.display = 'none';
}, 2000);

// ...
