const warriors = [
  { name: "Stephen Curry", rating: "S" },
  { name: "Klay Thompson", rating: "B+" },
  { name: "Draymond Green", rating: "B" },
  { name: "Andrew Wiggins", rating: "B+" },
  { name: "Jonathan Kuminga", rating: "B" },
  { name: "Moses Moody", rating: "C+" }
];

function showTeam() {
  const ul = document.getElementById("roster");
  ul.innerHTML = '';
  warriors.forEach(player => {
    const li = document.createElement("li");
    li.textContent = `${player.name}（評價：${player.rating}）`;
    ul.appendChild(li);
  });
}
