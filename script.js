(() => {
  const ratingMap = {
    "C": 1, "C+": 2, "B-": 3, "B": 4, "B+": 5,
    "A-": 6, "A": 7, "A+": 8, "S": 9, "S+": 10
  };
  const ratingStars = r => "★".repeat(Math.min(5, Math.round((ratingMap[r] || 1) / 2)));

  let warriors, freeAgents, otherTeams, money, salaryCap, lastSimDate, firstRoundPicks;

  function defaultData() {
    return {
      warriors: [
        { name: "Stephen Curry", rating: "S", salary: 35, trainedToday: false },
        { name: "Klay Thompson", rating: "B+", salary: 20, trainedToday: false },
        { name: "Draymond Green", rating: "B", salary: 18, trainedToday: false },
        { name: "Jonathan Kuminga", rating: "B", salary: 15, trainedToday: false },
        { name: "Andrew Wiggins", rating: "B+", salary: 22, trainedToday: false },
        { name: "Moses Moody", rating: "C+", salary: 10, trainedToday: false },
        { name: "Gary Payton II", rating: "C+", salary: 9, trainedToday: false },
        { name: "Brandin Podziemski", rating: "B-", salary: 11, trainedToday: false },
        { name: "Kevon Looney", rating: "C", salary: 8, trainedToday: false }
      ],
      freeAgents: [
        { name: "Malik Beasley", rating: "B", salary: 15, signChance: 60 },
        { name: "Robert Covington", rating: "B-", salary: 12, signChance: 50 },
        { name: "Dennis Smith Jr.", rating: "B-", salary: 9, signChance: 55 },
        { name: "Justise Winslow", rating: "C+", salary: 7, signChance: 45 },
        { name: "Tristan Thompson", rating: "C", salary: 6, signChance: 50 }
      ],
      otherTeams: {
        "雷霆": [
          { name: "Shai Gilgeous-Alexander", rating: "S", salary: 34 },
          { name: "Jalen Williams", rating: "A", salary: 20 },
          { name: "Chet Holmgren", rating: "A-", salary: 18 },
          { name: "Josh Giddey", rating: "B+", salary: 16 },
          { name: "Lu Dort", rating: "B", salary: 14 },
          { name: "Isaiah Joe", rating: "B-", salary: 10 }
        ]
      },
      money: 100,
      salaryCap: 120,
      lastSimDate: null,
      firstRoundPicks: 1
    };
  }

  function loadData() {
    try {
      const saved = JSON.parse(localStorage.getItem("sj_gm_data") || "null");
      if (saved && saved.warriors && saved.freeAgents && saved.otherTeams) {
        ({ warriors, freeAgents, otherTeams, money, salaryCap, lastSimDate, firstRoundPicks } = saved);
      } else throw new Error();
    } catch {
      ({ warriors, freeAgents, otherTeams, money, salaryCap, lastSimDate, firstRoundPicks } = defaultData());
      saveData();
    }
  }

  function saveData() {
    localStorage.setItem("sj_gm_data", JSON.stringify({ warriors, freeAgents, otherTeams, money, salaryCap, lastSimDate, firstRoundPicks }));
  }

  function renderDate() {
    const now = new Date().toLocaleDateString();
    const teamSalary = warriors.reduce((sum, p) => sum + (p.salary || 0), 0);
    const warning = teamSalary > salaryCap ? " ⚠️" : "";
    document.getElementById("dateDisplay").textContent = "｜今天：" + now;
    document.getElementById("moneyDisplay").textContent =
      `｜資金：$${money}M｜團隊工資：${teamSalary}M / 上限：${salaryCap}M${warning}｜首輪籤：${firstRoundPicks}`;
  }

  function resetTraining() {
    warriors.forEach(p => p.trainedToday = false);
    alert("所有球員訓練狀態已重置！");
    saveData();
    showWarriors();
  }

  function simulateGame() {
    const today = new Date().toDateString();
    if (lastSimDate === today) {
      alert("今天已模擬過比賽，請明天再來！");
      return;
    }
    const teamNames = Object.keys(otherTeams);
    const randomTeam = teamNames[Math.floor(Math.random() * teamNames.length)];
    const opponent = otherTeams[randomTeam];

    const teamScore = warriors.reduce((sum, p) => sum + ratingMap[p.rating] * (Math.random() + 0.5), 0);
    const oppScore = opponent.reduce((sum, p) => sum + ratingMap[p.rating] * (Math.random() + 0.5), 0);
    const mvp = warriors.reduce((top, p) => {
      const score = ratingMap[p.rating] * (Math.random() + 0.5);
      return score > top.score ? { name: p.name, score } : top;
    }, { name: "", score: 0 });

    document.getElementById("gameResult").innerHTML = `
      <h2>📊 模擬比賽結果</h2>
      <p>🏀 勇士 ${Math.round(teamScore)} : ${Math.round(oppScore)} ${randomTeam}</p>
      <p>🎖 MVP：${mvp.name}</p>
    `;
    lastSimDate = today;
    saveData();
    renderDate();
  }

  function showWarriors() {
    const container = document.getElementById("team");
    container.innerHTML = "<h2>🏀 勇士陣容</h2>" + warriors.map(p => `
      <div class="player">
        <div class="player-info">
          <strong>${p.name}</strong>｜${p.rating}｜${ratingStars(p.rating)}｜$${p.salary}M ${p.trainedToday ? "🧠已訓練" : ""}
        </div>
        <button ${p.trainedToday ? "disabled" : ""}>訓練</button>
      </div>
    `).join("");

    container.querySelectorAll("button").forEach((btn, i) => {
      btn.addEventListener("click", () => {
        if (warriors[i].trainedToday) return;
        warriors[i].trainedToday = true;
        alert(`${warriors[i].name} 完成訓練！`);
        saveData();
        showWarriors();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadData();
    renderDate();
    showWarriors();
    document.getElementById("showWarriorsBtn").addEventListener("click", showWarriors);
    document.getElementById("simulateGameBtn").addEventListener("click", simulateGame);
    document.getElementById("resetTrainingBtn").addEventListener("click", resetTraining);
    document.getElementById("clearBtn").addEventListener("click", () => {
      if (confirm("確定清空所有進度？")) {
        localStorage.removeItem("sj_gm_data");
        location.reload();
      }
    });
  });
})();