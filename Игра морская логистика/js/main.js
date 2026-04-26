// ========== ГЛАВНЫЙ ФАЙЛ, ИНИЦИАЛИЗАЦИЯ ==========

// Обновление отображения
function updateCashDisplay() { if (cashValueEl) cashValueEl.textContent = cash; }
function updateStepDisplay() { if (stepValueEl) stepValueEl.textContent = step; }
function updatePenaltyDisplay() { if (penaltyCountEl) penaltyCountEl.textContent = penaltyCount; }
function updateBonusDisplay() { if (bonusCountEl) bonusCountEl.textContent = bonusCount; }

function addPenalty(amount) {
    penaltyCount += amount;
    totalMoneyPenalties += Math.abs(amount);
    updatePenaltyDisplay();
}

function addBonus(amount) {
    bonusCount += amount;
    totalProfit += Math.abs(amount);
    updateBonusDisplay();
}

function updateInfoMessage(msg, type = 'success') {
    if (infoMessageEl) {
        infoMessageEl.textContent = msg;
        infoMessageEl.className = `info-message ${type}`;
    }
}

// Управление страницами
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function startGame() {
    showPage('gamePage');
    startNewGame();
}

function exitToMainMenu() {
    gameRunning = false;
    showPage('startPage');
}

function showStats() {
    updateStatsPage();
    showPage('statsPage');
}

function continueGame() {
    showPage('gamePage');
}

// Обновление страницы статистики
function updateStatsPage() {
    const totalStepsEl = document.getElementById('totalSteps');
    const totalPenaltiesEl = document.getElementById('totalPenalties');
    const totalBonusesEl = document.getElementById('totalBonuses');
    const efficiencyEl = document.getElementById('efficiency');
    const totalDepositsEl = document.getElementById('totalDeposits');
    const totalProfitEl = document.getElementById('totalProfit');
    const totalMoneyPenaltiesEl = document.getElementById('totalMoneyPenalties');
    const finalBalanceEl = document.getElementById('finalBalance');
    const redBoxesEl = document.getElementById('redBoxesCollected');
    const greenBoxesEl = document.getElementById('greenBoxesCollected');
    const yellowBoxesEl = document.getElementById('yellowBoxesCollected');
    const blueBoxesEl = document.getElementById('blueBoxesCollected');
    
    if (totalStepsEl) totalStepsEl.textContent = step;
    if (totalPenaltiesEl) totalPenaltiesEl.textContent = penaltyCount;
    if (totalBonusesEl) totalBonusesEl.textContent = bonusCount;
    
    let efficiency = 0;
    if (penaltyCount > 0) {
        efficiency = Math.round((bonusCount / penaltyCount) * 100);
    } else if (bonusCount > 0) {
        efficiency = 100;
    }
    if (efficiencyEl) efficiencyEl.textContent = efficiency + '%';
    
    if (totalDepositsEl) totalDepositsEl.textContent = totalDeposits;
    if (totalProfitEl) totalProfitEl.textContent = totalProfit;
    if (totalMoneyPenaltiesEl) totalMoneyPenaltiesEl.textContent = totalMoneyPenalties;
    let finalBalance = initialCash + totalProfit - totalMoneyPenalties;
    if (finalBalanceEl) finalBalanceEl.textContent = finalBalance;
    
    if (redBoxesEl) redBoxesEl.textContent = red_box;
    if (greenBoxesEl) greenBoxesEl.textContent = green_box;
    if (yellowBoxesEl) yellowBoxesEl.textContent = yellow_box;
    if (blueBoxesEl) blueBoxesEl.textContent = blue_box;
    
    const achievePerfect = document.getElementById('achievePerfect');
    const achieveCollector = document.getElementById('achieveCollector');
    const achieveMillionaire = document.getElementById('achieveMillionaire');
    const achieveSpeed = document.getElementById('achieveSpeed');
    
    if (penaltyCount === 0 && step > 0 && achievePerfect) {
        achievePerfect.classList.add('unlocked');
        achievePerfect.classList.remove('locked');
        if (achievePerfect.querySelector('span:last-child')) {
            achievePerfect.querySelector('span:last-child').innerHTML = '⭐ Идеальное плавание (без штрафов) <span style="color:#27ae60;">✓</span>';
        }
    } else if (achievePerfect) {
        achievePerfect.classList.add('locked');
        achievePerfect.classList.remove('unlocked');
    }
    
    if (red_col === 1 && green_col === 1 && blue_col === 1 && yellow_coll === 1 && achieveCollector) {
        achieveCollector.classList.add('unlocked');
        achieveCollector.classList.remove('locked');
        if (achieveCollector.querySelector('span:last-child')) {
            achieveCollector.querySelector('span:last-child').innerHTML = '🏆 Лоцман (все порты загружены) <span style="color:#27ae60;">✓</span>';
        }
    } else if (achieveCollector) {
        achieveCollector.classList.add('locked');
        achieveCollector.classList.remove('unlocked');
    }
    
    if (finalBalance >= 1000 && achieveMillionaire) {
        achieveMillionaire.classList.add('unlocked');
        achieveMillionaire.classList.remove('locked');
        if (achieveMillionaire.querySelector('span:last-child')) {
            achieveMillionaire.querySelector('span:last-child').innerHTML = '💎 Корабельный магнат (1000+ баланс) <span style="color:#27ae60;">✓</span>';
        }
    } else if (achieveMillionaire) {
        achieveMillionaire.classList.add('locked');
        achieveMillionaire.classList.remove('unlocked');
    }
    
    let totalBoxesCollected = red_box + green_box + yellow_box + blue_box;
    if (step <= 50 && totalBoxesCollected === 20 && achieveSpeed) {
        achieveSpeed.classList.add('unlocked');
        achieveSpeed.classList.remove('locked');
        if (achieveSpeed.querySelector('span:last-child')) {
            achieveSpeed.querySelector('span:last-child').innerHTML = '⚡ Быстрый фрегат (менее 50 ходов, все контейнеры) <span style="color:#27ae60;">✓</span>';
        }
    } else if (achieveSpeed) {
        achieveSpeed.classList.add('locked');
        achieveSpeed.classList.remove('unlocked');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // DOM элементы
    warehouseEl = document.getElementById('warehouse');
    cashValueEl = document.getElementById('cashValue');
    infoMessageEl = document.getElementById('infoMessage');
    stepValueEl = document.getElementById('stepValue');
    penaltyCountEl = document.getElementById('penaltyCount');
    bonusCountEl = document.getElementById('bonusCount');
    
    // Кнопки игровой страницы
    const moveUpBtn = document.getElementById('moveUpBtn');
    const moveDownBtn = document.getElementById('moveDownBtn');
    const moveLeftBtn = document.getElementById('moveLeftBtn');
    const moveRightBtn = document.getElementById('moveRightBtn');
    const resetGameBtn = document.getElementById('resetGameBtn');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const exitBtn = document.getElementById('exitBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    
    // Кнопки статистики
    const statsBackBtn = document.getElementById('statsBackBtn');
    const statsMenuBtn = document.getElementById('statsMenuBtn');
    
    // Кнопки порта
    const refuelBtn = document.getElementById('refuelBtn');
    const sellCrystalsBtn = document.getElementById('sellCrystalsBtn');
    const sellContrabandBtn = document.getElementById('sellContrabandBtn');
    const tavernBtn = document.getElementById('tavernBtn');
    const exitPortBtn = document.getElementById('exitPortBtn');
    
    // Обработчики
    if (moveUpBtn) moveUpBtn.addEventListener('click', () => processMove(8));
    if (moveDownBtn) moveDownBtn.addEventListener('click', () => processMove(2));
    if (moveLeftBtn) moveLeftBtn.addEventListener('click', () => processMove(4));
    if (moveRightBtn) moveRightBtn.addEventListener('click', () => processMove(6));
    if (resetGameBtn) resetGameBtn.addEventListener('click', () => processMove(5));
    if (depositBtn) depositBtn.addEventListener('click', () => processMove(7));
    if (withdrawBtn) withdrawBtn.addEventListener('click', showStats);
    if (exitBtn) exitBtn.addEventListener('click', exitToMainMenu);
    if (startGameBtn) startGameBtn.addEventListener('click', startGame);
    if (statsBackBtn) statsBackBtn.addEventListener('click', continueGame);
    if (statsMenuBtn) statsMenuBtn.addEventListener('click', exitToMainMenu);
    if (refuelBtn) refuelBtn.addEventListener('click', refuelShip);
    if (sellCrystalsBtn) sellCrystalsBtn.addEventListener('click', sellCrystals);
    if (sellContrabandBtn) sellContrabandBtn.addEventListener('click', sellContraband);
    if (tavernBtn) tavernBtn.addEventListener('click', goToTavern);
    if (exitPortBtn) exitPortBtn.addEventListener('click', exitPort);
    
    showPage('startPage');
});