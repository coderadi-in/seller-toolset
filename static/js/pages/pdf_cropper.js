const statusTexts = [
    "Parsing PDF file",
    "Reading PDF",
    "Extracting Text",
    "Detecting Label",
    "Cropping Label",
    "Added Label to new PDF",
    "Checking for next page"
]

// ? GET DOC ELEMENTS
const form = document.querySelector('.form');
const submitBtn = document.getElementById('startCrop');
const submitBtnSymbol = document.querySelector("#startCrop .symbol");
const submitBtnText = document.querySelector("#startCrop .text");

const infoSection = document.querySelector('.info');
const statusIcon = document.querySelector('.info .status .symbol');
const statusText = document.querySelector('.info .status .text');
const currentState = document.getElementById("currentState");
let statusIntervalId = null;

// & FORM SUBMISSION RESPONSE FUNCTIONALITY
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ===== UI START STATE =====
    submitBtn.disabled = true;
    submitBtnSymbol.innerHTML = "progress_activity";
    submitBtnSymbol.classList.add('rotate');
    submitBtnText.innerHTML = "Cropping...";

    infoSection.style.display = "flex";
    statusIcon.classList.add('rotate');

    let statusIndex = 0;
    currentState.textContent = statusTexts[statusIndex];

    statusIntervalId = setInterval(() => {
        statusIndex = (statusIndex + 1) % statusTexts.length;
        currentState.textContent = statusTexts[statusIndex];
    }, 500);

    try {
        const formData = new FormData(form);

        const res = await fetch(form.action, {
            method: "POST",
            body: formData
        });

        const blob = await res.blob();

        // TRIGGER DOWNLOAD
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "cropped_label.pdf";
        a.click();

        window.URL.revokeObjectURL(url);

    } catch (err) {
        alert("Something went wrong");
    }

    // UI RESET STATE
    clearInterval(statusIntervalId);

    submitBtn.disabled = false;
    submitBtnSymbol.classList.remove('rotate');
    submitBtnSymbol.innerHTML = "crop";
    submitBtnText.innerHTML = "Crop";

    infoSection.style.display = "none";
});