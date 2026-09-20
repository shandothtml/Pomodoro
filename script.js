const durations = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
};

const tabNames = {
    pomodoro: "Pomodoro",
    short: "Short Break",
    long: "Long Break"
};

let currentMode = "pomodoro";
let timeLeft = durations[currentMode];
let timerInterval = null;
let isRunning = false;

// Count completed Pomodoro sessions.
let pomodoroCount = 0;

const timerDisplay = document.getElementById("timer");
const startPauseButton = document.getElementById("startPause");
const resetButton = document.getElementById("reset");
const sessionText = document.getElementById("sessionText");
const modeButtons = document.querySelectorAll(".mode-btn");

// Play the original timer sound.
function playTimerSound() {
    const audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
    )();

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
        800,
        audioContext.currentTime
    );

    oscillator.frequency.setValueAtTime(
        600,
        audioContext.currentTime + 0.25
    );

    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 1
    );
}

// Update the timer display.
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timerDisplay.textContent =
        minutes +
        ":" +
        String(seconds).padStart(2, "0");

    if (isRunning) {
        document.title = timerDisplay.textContent;
    }
}

// Update the tab name.
function updateTabName() {
    document.title = tabNames[currentMode];
}

// Update the background based on the running mode.
function updateBackground() {
    document.body.classList.remove(
        "pomodoro-running",
        "short-running",
        "long-running"
    );

    if (!isRunning) {
        return;
    }

    if (currentMode === "pomodoro") {
        document.body.classList.add("pomodoro-running");
    }

    else if (currentMode === "short") {
        document.body.classList.add("short-running");
    }

    else if (currentMode === "long") {
        document.body.classList.add("long-running");
    }
}

// Update the session text.
function updateSessionText() {
    if (currentMode === "pomodoro") {
        sessionText.textContent = "Pomodoro";
    }

    else if (currentMode === "short") {
        sessionText.textContent = "Short Break";
    }

    else if (currentMode === "long") {
        sessionText.textContent = "Long Break";
    }
}

// Start the timer.
function startTimer() {
    if (isRunning) {
        return;
    }

    isRunning = true;

    startPauseButton.textContent = "Pause";

    updateDisplay();
    updateBackground();

    timerInterval = setInterval(function () {

        timeLeft--;

        updateDisplay();

        if (timeLeft <= 0) {
            timerFinished();
        }

    }, 1000);
}

// Pause the timer.
function pauseTimer() {
    isRunning = false;

    clearInterval(timerInterval);

    timerInterval = null;

    startPauseButton.textContent = "Start";

    updateBackground();

    updateTabName();
}

// Handle the start and pause button.
startPauseButton.addEventListener("click", function () {

    if (isRunning) {
        pauseTimer();
    }

    else {
        startTimer();
    }

});

// Reset the timer.
resetButton.addEventListener("click", function () {

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;

    currentMode = "pomodoro";

    timeLeft = durations[currentMode];

    pomodoroCount = 0;

    modeButtons.forEach(function (button) {

        if (button.dataset.mode === "pomodoro") {
            button.classList.add("active");
        }

        else {
            button.classList.remove("active");
        }

    });

    startPauseButton.textContent = "Start";

    updateDisplay();
    updateSessionText();
    updateBackground();
    updateTabName();

});

// Change the timer mode manually.
modeButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        pauseTimer();

        currentMode = button.dataset.mode;

        timeLeft = durations[currentMode];

        modeButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        updateDisplay();
        updateSessionText();
        updateTabName();
        updateBackground();

    });

});

// Start the next timer automatically.
function timerFinished() {

    clearInterval(timerInterval);

    timerInterval = null;

    // Play the original timer sound.
    playTimerSound();

    // Count completed Pomodoro sessions.
    if (currentMode === "pomodoro") {

        pomodoroCount++;

        // Start a Long Break after the fourth Pomodoro.
        if (pomodoroCount === 4) {

            currentMode = "long";

            pomodoroCount = 0;

        }

        else {

            currentMode = "short";

        }
    }

    // Start Pomodoro after a Short Break.
    else if (currentMode === "short") {

        currentMode = "pomodoro";

    }

    // Start Pomodoro after a Long Break.
    else if (currentMode === "long") {

        currentMode = "pomodoro";

    }

    timeLeft = durations[currentMode];

    modeButtons.forEach(function (button) {

        if (button.dataset.mode === currentMode) {
            button.classList.add("active");
        }

        else {
            button.classList.remove("active");
        }

    });

    updateSessionText();

    isRunning = false;

    startTimer();
}

updateDisplay();
updateSessionText();
updateTabName();