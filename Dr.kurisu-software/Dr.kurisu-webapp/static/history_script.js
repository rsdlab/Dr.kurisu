document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoadedイベントが発火しました。ページがロードされました。");
    fetchAllData();  

    const searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", fetchData);

    const resetBtn = document.getElementById("reset-btn");
    resetBtn.addEventListener("click", resetSearch);
});

function fetchAllData() {
    console.log("全履歴を取得中...");
    fetch(`/get_history`)  
        .then(response => {
            if (!response.ok) {
                throw new Error('データの取得に失敗しました');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                console.log("取得したデータが空です");
            } else {
                console.log("取得したデータ: ", data);  
            }
            displayResults(data);  
        })
        .catch(error => console.error("Error fetching data:", error));
}

function fetchData() {
    const dateInput = document.getElementById("date").value;  
    if (dateInput) {
        console.log(`指定された日付 (${dateInput}) でデータを取得中...`);
        fetch(`/get_history?date=${dateInput}`)  
            .then(response => {
                if (!response.ok) {
                    throw new Error('データの取得に失敗しました');
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    console.log(`指定された日付 (${dateInput}) に一致するデータがありません`);
                } else {
                    console.log("取得したデータ: ", data);  
                }
                displayResults(data);  
            })
            .catch(error => console.error("Error fetching data:", error));
    } else {
        alert("日付を入力してください");
    }
}


function resetSearch() {
    console.log("検索解除ボタンが押されました。全履歴を再表示します。");
    document.getElementById("date").value = '';  
    fetchAllData();  
}

function displayResults(data) {
    const resultsBody = document.getElementById("results-body");
    resultsBody.innerHTML = "";  

    if (!data || data.length === 0) {
        console.log("表示するデータがありません");
        const noDataRow = document.createElement("tr");
        const noDataCell = document.createElement("td");
        noDataCell.colSpan = 4;
        noDataCell.textContent = "データがありません";
        noDataRow.appendChild(noDataCell);
        resultsBody.appendChild(noDataRow);
        return;
    }

    data.forEach(row => {
        const newRow = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = row.date;
        newRow.appendChild(dateCell);

        const timeCell = document.createElement("td");
        timeCell.textContent = row.time;
        newRow.appendChild(timeCell);

        const periodCell = document.createElement("td");
        periodCell.textContent = row.period;
        newRow.appendChild(periodCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = row.status;
        newRow.appendChild(statusCell);

        resultsBody.appendChild(newRow);
    });
}
