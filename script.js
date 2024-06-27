// Глобальные переменные
let score = 0;
let pointsPerSecond = 0;

// Получаем ссылки на элементы DOM
const clickButton = document.getElementById('clickable-image');
const scoreDisplay = document.getElementById('total-points');
const pointsPerSecondDisplay = document.getElementById('points-per-second');
const upgradesContainer = document.getElementById('upgrades');
const eventsContainer = document.getElementById('events');

// Массив апгрейдов
const upgrades = [
    { id: 1, name: "выпустить ролик", description: "Increases points per click by 1", baseCost: 10, cost: 10, level: 0, increment: 1 },
    { id: 2, name: "Upgrade 3", description: "Increases points per click by 2", baseCost: 20, cost: 20, level: 0, increment: 2 },
    { id: 3, name: "Upgrade 4", description: "Increases points per click by 2", baseCost: 20, cost: 20, level: 0, increment: 2 },
    { id: 4, name: "Upgrade 5", description: "Increases points per click by 2", baseCost: 20, cost: 20, level: 0, increment: 2 },
    { id: 5, name: "Upgrade 2", description: "Increases points per click by 2", baseCost: 20, cost: 20, level: 0, increment: 2 },
    { id: 6, name: "Upgrade 2", description: "Increases points per click by 2", baseCost: 20, cost: 20, level: 0, increment: 2 },
    { id: 7, name: "Upgrade 2", description: "Increases points per click by 2", baseCost: 20, cost: 20, level: 0, increment: 2 },
];

// Массив событий
const events = [
    { id: 1, name: "Event 1", description: "Doubles the effect of Upgrade 1", targetUpgradeId: 1, multiplier: 2, baseCost: 50, cost: 50, level: 0 },
    { id: 2, name: "Event 2", description: "Doubles the effect of Upgrade 2", targetUpgradeId: 2, multiplier: 2, baseCost: 100, cost: 100, level: 0 },
    // Добавьте больше событий по необходимости
];

// Функция загрузки прогресса
function loadProgress() {
    const savedScore = localStorage.getItem('score');
    const savedUpgrades = localStorage.getItem('upgrades');
    const savedEvents = localStorage.getItem('events');
    if (savedScore) score = parseInt(savedScore);
    if (savedUpgrades) upgrades = JSON.parse(savedUpgrades);
    if (savedEvents) events = JSON.parse(savedEvents);
    updateDisplay();
}

// Функция сохранения прогресса
function saveProgress() {
    localStorage.setItem('score', score);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
    localStorage.setItem('events', JSON.stringify(events));
}

// Функция обновления отображения
function updateDisplay() {
    scoreDisplay.textContent = score;
    pointsPerSecondDisplay.textContent = pointsPerSecond;
    renderUpgrades();
    renderEvents();
}

// Функция увеличения счета
function incrementScore(amount = 1) {
    score += amount;
    updateDisplay();
    saveProgress();
}

// Функция анимации клика
function animateClick() {
    clickButton.classList.add('clicked');
    setTimeout(() => clickButton.classList.remove('clicked'), 100);
}

// Функция покупки апгрейда
function buyUpgrade(upgrade) {
    if (score >= upgrade.cost) {
        score -= upgrade.cost;
        upgrade.level++;
        // Увеличиваем стоимость на 10% после покупки
        upgrade.cost = Math.ceil(upgrade.cost * 1.3);
        pointsPerSecond += upgrade.increment;
        updateDisplay();
        saveProgress();
        // Добавляем анимацию покупки
        animatePurchase(upgrade.id);
    }
}

// Функция покупки события
function buyEvent(event) {
    if (score >= event.cost) {
        score -= event.cost;
        event.level++;
        // Увеличиваем стоимость на 10% после покупки
        event.cost = Math.ceil(event.cost * 1.1);
        const targetUpgrade = upgrades.find(upg => upg.id === event.targetUpgradeId);
        if (targetUpgrade) {
            targetUpgrade.increment *= event.multiplier;
            pointsPerSecond += targetUpgrade.increment * (event.multiplier - 1);
        }
        updateDisplay();
        saveProgress();
        // Добавляем анимацию покупки
        animatePurchase(event.id);
    }
}

// Функция рендеринга апгрейдов
function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    upgrades.forEach(upgrade => {
        const upgradeCard = document.createElement('div');
        upgradeCard.className = 'card';
        upgradeCard.id = `upgrade-${upgrade.id}`;
        if (score < upgrade.cost) upgradeCard.classList.add('disabled');
        upgradeCard.innerHTML = `
            <div class="card-image">IMG</div>
            <div class="card-content">
                <div class="card-title">${upgrade.name}</div>
                <div class="card-description">${upgrade.description}</div>
                <div class="card-cost">Cost: ${upgrade.cost}</div>
                <div class="card-level">Level: ${upgrade.level}</div>
            </div>
        `;
        upgradeCard.addEventListener('click', () => buyUpgrade(upgrade));
        upgradesContainer.appendChild(upgradeCard);
    });
}

// Функция рендеринга событий
function renderEvents() {
    eventsContainer.innerHTML = '';
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'card';
        eventCard.id = `event-${event.id}`;
        if (score < event.cost) eventCard.classList.add('disabled');
        eventCard.innerHTML = `
            <div class="card-image">IMG</div>
            <div class="card-content">
                <div class="card-title">${event.name}</div>
                <div class="card-description">${event.description}</div>
                <div class="card-cost">Cost: ${event.cost}</div>
                <div class="card-level">Level: ${event.level}</div>
            </div>
        `;
        eventCard.addEventListener('click', () => buyEvent(event));
        eventsContainer.appendChild(eventCard);
    });
}

// Функция анимации покупки
function animatePurchase(id) {
    const element = document.getElementById(`upgrade-${id}`) || document.getElementById(`event-${id}`);
    element.classList.add('purchased');
    setTimeout(() => element.classList.remove('purchased'), 200);
}

// Авто-клики
setInterval(() => {
    incrementScore(pointsPerSecond);
}, 1000);

// Обработчики событий
clickButton.addEventListener('click', () => {
    incrementScore();
    animateClick();
});

// Загрузка прогресса при старте
loadProgress();

// Начальный рендеринг
updateDisplay();