const DEFAULT_GUILD_ID = "618712310185197588";
const API_BASE_URL = "https://duckbotdiscorduku6efjff3bps.azurewebsites.net/guild";

const leaderboardBody = document.querySelector("#leaderboard-body");
const leaderboardStatus = document.querySelector("#leaderboard-status");
const leaderboardTable = document.querySelector("#leaderboard-table");
const searchInput = document.querySelector("#leaderboard-search");
const resultCount = document.querySelector("#result-count");
const guildIdDisplay = document.querySelector("#guild-id");

const numberFormatter = new Intl.NumberFormat("en-US");
let leaderboardItems = [];

function getGuildId() {
  const parameters = new URLSearchParams(window.location.search);
  return parameters.get("guild") ||
    parameters.get("guid") ||
    parameters.get("Guid") ||
    DEFAULT_GUILD_ID;
}

function normalizeItems(data) {
  if (!Array.isArray(data)) {
    throw new Error("Leaderboard data was not an array.");
  }

  return data
    .filter((entry) =>
      entry &&
      typeof entry.item === "string" &&
      entry.item.trim() &&
      typeof entry.points === "number" &&
      Number.isFinite(entry.points)
    )
    .map((entry) => ({
      item: entry.item.trim(),
      points: entry.points,
      isUser: entry.isUser === true,
    }))
    .sort((left, right) =>
      right.points - left.points ||
      left.item.localeCompare(right.item, undefined, { sensitivity: "base" })
    );
}

function renderLeaderboard(items) {
  const rows = document.createDocumentFragment();

  items.forEach((entry, index) => {
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.className = "rank";
    rankCell.textContent = numberFormatter.format(index + 1);

    const itemCell = document.createElement("td");
    const itemName = document.createElement("span");
    itemName.className = "item-name";
    itemName.textContent = entry.item;

    const itemType = document.createElement("span");
    itemType.className = "item-type";
    itemType.textContent = entry.isUser ? "User" : "Thing";

    itemCell.append(itemName, itemType);

    const pointsCell = document.createElement("td");
    pointsCell.className = "points";
    pointsCell.textContent = numberFormatter.format(entry.points);

    row.append(rankCell, itemCell, pointsCell);
    rows.append(row);
  });

  leaderboardBody.replaceChildren(rows);
  resultCount.textContent = `${numberFormatter.format(items.length)} ${items.length === 1 ? "entry" : "entries"}`;

  if (items.length === 0) {
    leaderboardStatus.textContent = "No entries match that search.";
    leaderboardStatus.hidden = false;
    leaderboardTable.hidden = true;
  } else {
    leaderboardStatus.hidden = true;
    leaderboardTable.hidden = false;
  }
}

function filterLeaderboard() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filteredItems = query
    ? leaderboardItems.filter((entry) => entry.item.toLocaleLowerCase().includes(query))
    : leaderboardItems;

  renderLeaderboard(filteredItems);
}

async function loadLeaderboard() {
  const guildId = getGuildId();
  guildIdDisplay.textContent = guildId;

  if (!/^\d{17,20}$/.test(guildId)) {
    leaderboardStatus.textContent = "The guild ID in the URL is invalid.";
    resultCount.textContent = "Unable to load";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${guildId}/things`, { cache: "no-cache" });
    if (!response.ok) {
      throw new Error(`Leaderboard request failed with status ${response.status}.`);
    }

    leaderboardItems = normalizeItems(await response.json());
    renderLeaderboard(leaderboardItems);
    searchInput.disabled = false;
  } catch (error) {
    console.error("Unable to load leaderboard:", error);
    leaderboardStatus.textContent = "The leaderboard is temporarily unavailable. Please try again later.";
  }
}

searchInput.addEventListener("input", filterLeaderboard);
loadLeaderboard();
