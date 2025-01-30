let timeSettings = {};

let currentDay = getToday();


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById(`${currentDay}-container`).classList.add('selected-day');
    loadSettings(currentDay);
});


function getToday() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
}


function loadSettings(day) {
    fetch(`/get_settings?day=${day}`)
        .then(response => response.json())
        .then(data => {
            timeSettings[day] = data.timeSettings;
            updateDisplay(day);
        })
        .catch(error => console.error("設定の取得中にエラーが発生しました:", error));
}


function showDaySettings(day) {
    currentDay = day;

    
    document.querySelectorAll('.radio-container').forEach((el) => {
        el.classList.remove('selected-day');
    });

    
    document.getElementById(day + '-container').classList.add('selected-day');

    
    loadSettings(day);
}

function updateDisplay(day) {
    const settings = timeSettings[day] || {};
    ["morning", "noon", "evening", "night"].forEach(period => {
        const hourInput = document.getElementById(`${period}-hour`);
        const minuteInput = document.getElementById(`${period}-minute`);
        const medicineCheckbox = document.getElementById(`${period}-medicine`);

        if (settings[period]) {
            hourInput.value = settings[period].hour;
            minuteInput.value = settings[period].minute;
            medicineCheckbox.checked = settings[period].medicine;
            toggleTimeInput(period, settings[period].medicine);
        } else {
            
            hourInput.value = "";
            minuteInput.value = "";
            medicineCheckbox.checked = false;
            toggleTimeInput(period, false);
        }
    });
}

function toggleTimeInput(period, isEnabled) {
    document.getElementById(`${period}-hour`).disabled = !isEnabled;
    document.getElementById(`${period}-minute`).disabled = !isEnabled;
}

function saveSettings() {
    const updatedSettings = {
        morning: {
            hour: parseInt(document.getElementById("morning-hour").value),
            minute: parseInt(document.getElementById("morning-minute").value),
            medicine: document.getElementById("morning-medicine").checked
        },
        noon: {
            hour: parseInt(document.getElementById("noon-hour").value),
            minute: parseInt(document.getElementById("noon-minute").value),
            medicine: document.getElementById("noon-medicine").checked
        },
        evening: {
            hour: parseInt(document.getElementById("evening-hour").value),
            minute: parseInt(document.getElementById("evening-minute").value),
            medicine: document.getElementById("evening-medicine").checked
        },
        night: {
            hour: parseInt(document.getElementById("night-hour").value),
            minute: parseInt(document.getElementById("night-minute").value),
            medicine: document.getElementById("night-medicine").checked
        }
    };

    timeSettings[currentDay] = updatedSettings;

    fetch('/save_settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ day: currentDay, timeSettings: updatedSettings })
    }).then(response => {
        if (response.ok) {
            alert("設定が保存されました");
        } else {
            alert("設定の保存に失敗しました");
        }
    }).catch(error => {
        console.error("保存中にエラーが発生しました:", error);
    });
}

