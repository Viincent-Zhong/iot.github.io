const loginButton = document.getElementById('loginButton');
const errorPromptContainer = document.getElementById('errorPromptContainer');
const errorPrompt = document.getElementById('errorPrompt');

errorPromptContainer.style.visibility = 'hidden';

loginButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const requestBody = {
        email: username,
        password: password
    };

    try {
        const response = await fetch('https://iot-light-tracker.onrender.com/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const data = await response.json();
            // Handle successful login (e.g., store token, redirect)
            console.log('Login successful:', data);

            errorPromptContainer.style.visibility = 'hidden';

            window.location.href = "user.html";     
        } else {
            // Handle errors (e.g., show message to user)
            const errorData = await response.json();
            console.error('Login failed:', errorData.message);

            errorPrompt.innerHTML = errorData.message;
            errorPromptContainer.style.visibility = 'visible';
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});