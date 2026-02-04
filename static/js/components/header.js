// ? GETTING DOC ELEMENTS
const themeControl = document.getElementById("theme-control");

// * FUNCTION TO SAVE THEME PREFERENCE
function saveThemePreference(theme) {
    localStorage.setItem('theme', theme);
}

// * FUNCTION TO LOAD THEME PREFERENCE
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    document.body.classList.toggle('dark', savedTheme === 'dark');
}

// * FUNCTION TO TOGGLE THEME
function toggleTheme() {
    if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
    } else {
        document.body.classList.add('dark');
    }

    saveThemePreference(document.body.classList.contains('dark') ? 'dark' : 'light');
}

// & EVENT LISTENER FOR THEME TOGGLE
themeControl.addEventListener('click', toggleTheme);
loadThemePreference();