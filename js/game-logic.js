// ========== ОСНОВНАЯ ИГРОВАЯ ЛОГИКА ==========

// Визуализация поля
function renderWarehouse() {
    if (!warehouseEl) return;
    warehouseEl.innerHTML = '';
    for (let i = 0; i < heigh; i++) {
        for (let j = 0; j < width; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const val = matr[i][j];
            
            if (val === 0) {
                // Проверка на порты
                if ((i === 1 && j === 1) || (i === 1 && j === width-2) || 
                    (i === heigh-2 && j === 1) || (i === heigh-2 && j === width-2)) {
                    
                    let count = 0;
                    let shelfColor = '';
                    
                    if (i === 1 && j === 1) {
                        count = red_box;
                        shelfColor = 'shelf-red';
                    } else if (i === 1 && j === width-2) {
                        count = green_box;
                        shelfColor = 'shelf-green';
                    } else if (i === heigh-2 && j === 1) {
                        count = yellow_box;
                        shelfColor = 'shelf-yellow';
                    } else if (i === heigh-2 && j === width-2) {
                        count = blue_box;
                        shelfColor = 'shelf-blue';
                    }
                    
                    cell.classList.add('shelf');
                    cell.classList.add(shelfColor);
                    
                    if (count > 0) {
                        cell.textContent = `${count} 📦`;
                        cell.style.fontSize = '0.7rem';
                        cell.style.fontWeight = 'bold';
                    }
                } else {
                    cell.classList.add('empty');
                }
            } else if (val === 7) {
                cell.classList.add('wall');
            } else if (val === 5) {
                cell.classList.add('column');
            } else if (val === 1) {
                cell.classList.add('red');
            } else if (val === 2) {
                cell.classList.add('green');
            } else if (val === 3) {
                cell.classList.add('blue');
            } else if (val === 4) {
                cell.classList.add('yellow');
            } else if (val === 6) {
                cell.classList.add('pallet');
            }
            warehouseEl.appendChild(cell);
        }
    }
}

// Обработка движения
function processMove(direction) {
    if (!gameRunning) {
        updateInfoMessage("🚢 Рейс не начат. Нажмите «Начать плавание»", "warning");
        return;
    }
    
    if (fuel <= 0) {
        updateInfoMessage("⛽ ТОПЛИВО ЗАКОНЧИЛОСЬ! Корабль дрейфует!", "error");
        gameRunning = false;
        return;
    }
    
    if (cash <= 0) {
        updateInfoMessage("💀 Казна пуста! Рейс завершён.", "error");
        gameRunning = false;
        return;
    }
    
    show_victoria(heigh, width, matr);
    step++;
    cash--;
    fuel--;
    updateStepDisplay();
    updateCashDisplay();
    
    if (fuel <= 20 && fuel > 0) {
        updateInfoMessage(`⚠️ ТОПЛИВО: ${fuel}/100! Найдите порт для заправки!`, "warning");
    }
    
    switch(direction) {
        case 8: sort_8(heigh, width, matr); break;
        case 2: sort_2(heigh, width, matr); break;
        case 4: sort_4(heigh, width, matr); break;
        case 6: sort_6(heigh, width, matr); break;
        case 5:
            updateInfoMessage("🔄 Перемещение в другой сектор карты", "info");
            zeroing_out();
            show_victoria(heigh, width, matr);
            gen_arr(heigh, width, matr);
            break;
        case 7:
            if (!checkPortEntry()) {
                updateInfoMessage("🌊 Вы находитесь в открытом море. Заход в порт невозможен!", "warning");
            }
            break;
        default: return;
    }
    
    updateCashDisplay();
    renderWarehouse();
}

// Новая игра
function startNewGame() {
    let deposit = parseInt(prompt("Введите начальный депозит:"));
    if (isNaN(deposit)) deposit = 0;
    cash = deposit;
    initialCash = deposit;
    totalDeposits += deposit;
    
    red_box = 0; green_box = 0; yellow_box = 0; blue_box = 0;
    red_col = 0; green_col = 0; blue_col = 0; yellow_coll = 0;
    step = 0;
    penaltyCount = 0;
    bonusCount = 0;
    fuel = 100;
    
    red_crystals = 0;
    green_crystals = 0;
    blue_crystals = 0;
    yellow_crystals = 0;
    
    gameRunning = true;
    gen_arr(heigh, width, matr);
    renderWarehouse();
    updateCashDisplay();
    updateStepDisplay();
    updatePenaltyDisplay();
    updateBonusDisplay();
    updateInfoMessage("🚢 Рейс начат! Попутного ветра!", "success");
}