const signup = document.querySelector(".signup");
const login = document.querySelector(".login");
const slider = document.querySelector(".slider");
const formSection = document.querySelector(".form-section");

// Toggle from login to signup form
signup.addEventListener("click", () => {
    slider.classList.add("moveslider");
    formSection.classList.add("form-section-move");
});

// Toggle from signup to login form
login.addEventListener("click", () => {
    slider.classList.remove("moveslider");
    formSection.classList.remove("form-section-move");
});

const loginButton = document.getElementById('loginButton');
const loginErrorPromptContainer = document.getElementById('loginErrorPromptContainer');
const loginErrorPrompt = document.getElementById('loginErrorPrompt');

loginErrorPromptContainer.style.visibility = 'hidden';

// function to login after clicking on the button
loginButton.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const requestBody = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('https://iot-light-tracker.onrender.com/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const data = await response.json();
            // Handle successful login (e.g., store token, redirect)
            console.log('Login successful:', data);

            loginErrorPromptContainer.style.visibility = 'hidden';

            window.location.href = "user.html";     
        } else {
            // Handle errors (e.g., show message to user)
            const errorData = await response.json();
            console.error('Login failed:', errorData.message);

            loginErrorPrompt.innerHTML = errorData.message;
            loginErrorPromptContainer.style.visibility = 'visible';
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});

const signupButton = document.getElementById('signupButton');
const signupErrorPromptContainer = document.getElementById('signupErrorPromptContainer');
const signupErrorPrompt = document.getElementById('signupErrorPrompt');

signupErrorPromptContainer.style.visibility = 'hidden';

// function to signup after clicking on the button
signupButton.addEventListener('click', async () => {
    const email = document.getElementById('signupEmail').value;
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    const requestBody = {
        email: email,
        name: username,
        password: password
    };

    try {
        const response = await fetch('https://iot-light-tracker.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const data = await response.json();
            // Handle successful login (e.g., store token, redirect)
            console.log('Signup successful:', data);

            signupErrorPromptContainer.style.visibility = 'hidden';

            window.location.href = "user.html";     
        } else {
            // Handle errors (e.g., show message to user)
            const errorData = await response.json();
            console.error('Signup failed:', errorData.message);

            signupErrorPrompt.innerHTML = errorData.message;
            signupErrorPromptContainer.style.visibility = 'visible';
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});