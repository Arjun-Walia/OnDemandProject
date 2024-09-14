const apiUrl = "http://localhost:3010";
let token = "";
let currentIndex = 0;

function showNextSlide() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    currentIndex = (currentIndex + 1) % slides.length;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

setInterval(showNextSlide, 3000);


async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch(`${apiUrl}/login`, { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        token = data.token;
        console.log("Token after login:", token); 
        localStorage.setItem('token', token); // Store token in localStorage
        window.location.href = "profiles.html";
    } else {
        alert("Login failed");
    }
}

async function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const email = document.getElementById("register-email").value;

    const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
    });

    if (response.ok) {
        showLoginForm();
    } else {
        alert("Registration failed");
    }
}

function showRegisterForm() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
}

function showLoginForm() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}
function openProfile() {
    window.location.href = "profiles.html";
}

function logout() {
    token = "";
    window.location.href = "index.html";
}

function editProfile() {
    alert("Edit Profile functionality to be implemented.");
}

function changePassword() {
    alert("Change Password functionality to be implemented.");
}

function exitProfile() {
    window.location.href = "home.html"; 
}

async function makeRequest() {
    console.log("Token before request:", token);  
    const response = await fetch(`${apiUrl}/protected-resource`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, 
        },
    });
    if (response.ok) {
        const data = await response.json();
        console.log("Data:", data);
    } else {
        const errorText = await response.text();
        console.error(`Failed to access resource: ${errorText}`);
    }
}