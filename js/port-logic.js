// ========== ФУНКЦИИ ПОРТА ==========

// Проверка захода в порт
function checkPortEntry() {
    console.log("checkPortEntry вызвана");
    
    // Находим позицию корабля (значение 6)
    let shipRow = -1, shipCol = -1;
    for (let k = 0; k < heigh; k++) {
        for (let n = 0; n < width; n++) {
            if (matr[k][n] === 6) {
                shipRow = k;
                shipCol = n;
                break;
            }
        }
        if (shipRow !== -1) break;
    }
    
    console.log("Корабль на позиции:", shipRow, shipCol);
    
    if (shipRow === -1) {
        console.log("Корабль не найден!");
        return false;
    }
    
    // Тортуга (1,1) - вход через (2,1) и (1,2)
    if ((shipRow === 2 && shipCol === 1) || (shipRow === 1 && shipCol === 2)) {
        console.log("Вход в порт Тортуга!");
        currentPort = "Тортуга";
        checkContrabandAroundShip(shipRow, shipCol, "Тортуга");
        updateInfoMessage("🔴 Добро пожаловать в порт Тортуга!", "success");
        showPortPage();
        return true;
    }
    
    // Бриджтаун (1,7) - вход через (2,7) и (1,6)
    if ((shipRow === 2 && shipCol === 7) || (shipRow === 1 && shipCol === 6)) {
        console.log("Вход в порт Бриджтаун!");
        currentPort = "Бриджтаун";
        checkContrabandAroundShip(shipRow, shipCol, "Бриджтаун");
        updateInfoMessage("🟢 Добро пожаловать в порт Бриджтаун!", "success");
        showPortPage();
        return true;
    }
    
    // Кингстон (5,1) - вход через (5,2) и (4,1)
    if ((shipRow === 5 && shipCol === 2) || (shipRow === 4 && shipCol === 1)) {
        console.log("Вход в порт Кингстон!");
        currentPort = "Кингстон";
        contrabandCrystals = [];
        contrabandPositions = [];
        updateInfoMessage("🟡 Добро пожаловать в законопослушный порт Кингстон!", "success");
        showPortPage();
        return true;
    }
    
    // Кастри (5,7) - вход через (5,6) и (4,7)
    if ((shipRow === 5 && shipCol === 6) || (shipRow === 4 && shipCol === 7)) {
        console.log("Вход в порт Кастри!");
        currentPort = "Кастри";
        checkContrabandAroundShip(shipRow, shipCol, "Кастри");
        updateInfoMessage("🔵 Добро пожаловать в порт Кастри!", "success");
        showPortPage();
        return true;
    }
    
    console.log("Не в порту. Координаты корабля:", shipRow, shipCol);
    return false;
}

// Проверка контрабанды вокруг корабля
function checkContrabandAroundShip(shipRow, shipCol, portName) {
    contrabandCrystals = [];
    contrabandPositions = [];
    
    const neighbors = [
        { row: shipRow - 1, col: shipCol, dir: "сверху" },
        { row: shipRow + 1, col: shipCol, dir: "снизу" },
        { row: shipRow, col: shipCol - 1, dir: "слева" },
        { row: shipRow, col: shipCol + 1, dir: "справа" }
    ];
    
    for (let neighbor of neighbors) {
        const row = neighbor.row;
        const col = neighbor.col;
        
        if (row >= 0 && row < heigh && col >= 0 && col < width) {
            const val = matr[row][col];
            let isContraband = false;
            let crystalColor = "";
            let crystalName = "";
            
            // Определяем контрабанду по порту
            if (portName === "Тортуга" && val === 3) {
                isContraband = true;
                crystalColor = "🔵";
                crystalName = "синий";
            } else if (portName === "Бриджтаун" && val === 1) {
                isContraband = true;
                crystalColor = "🔴";
                crystalName = "красный";
            } else if (portName === "Кастри" && val === 2) {
                isContraband = true;
                crystalColor = "🟢";
                crystalName = "зелёный";
            }
            
            if (isContraband) {
                contrabandCrystals.push({
                    color: crystalName,
                    colorEmoji: crystalColor,
                    value: val,
                    position: { row: row, col: col },
                    direction: neighbor.dir
                });
                contrabandPositions.push({ row: row, col: col });
                updateInfoMessage(`📦 Обнаружена контрабанда! ${crystalColor} ${crystalName} кристалл ${neighbor.dir} от корабля.`, "info");
            }
        }
    }
    
    if (contrabandCrystals.length > 0) {
        updateInfoMessage(`💰 В порту ${portName} можно продать ${contrabandCrystals.length} ед. контрабанды по 60 монет! (50% риск штрафа 30 монет)`, "success");
    } else {
        updateInfoMessage(`📦 В порту ${portName} нет контрабанды рядом с кораблём.`, "info");
    }
}

// Показать страницу порта
function showPortPage() {
    console.log("showPortPage вызвана, порт:", currentPort);
    updatePortDisplay();
    showPage('portPage');
}

// Обновить отображение порта
function updatePortDisplay() {
    const portNameEl = document.getElementById('portName');
    const fuelAmountEl = document.getElementById('fuelAmount');
    const portCashEl = document.getElementById('portCash');
    const contrabandAmountEl = document.getElementById('contrabandAmount');
    const contrabandInfoEl = document.getElementById('contrabandInfo');
    const crystalsAmountEl = document.getElementById('crystalsAmount');
    const crystalsLabelEl = document.getElementById('crystalsLabel');
    
    if (portNameEl) portNameEl.textContent = `Добро пожаловать в порт ${currentPort}!`;
    if (fuelAmountEl) fuelAmountEl.textContent = fuel;
    if (portCashEl) portCashEl.textContent = cash;
    
    let contrabandCount = contrabandCrystals ? contrabandCrystals.length : 0;
    if (contrabandAmountEl) contrabandAmountEl.textContent = contrabandCount;
    
    let contrabandInfo = "";
    let crystalCount = 0;
    let crystalsLabel = "";
    
    switch(currentPort) {
        case "Тортуга":
            contrabandInfo = "🔵 Синие кристаллы рядом с кораблём = контрабанда (60 монет, риск 50%)";
            crystalCount = blue_crystals;
            crystalsLabel = "💎 СИНИЕ КРИСТАЛЛЫ (легальные):";
            break;
        case "Бриджтаун":
            contrabandInfo = "🔴 Красные кристаллы рядом с кораблём = контрабанда (60 монет, риск 50%)";
            crystalCount = red_crystals;
            crystalsLabel = "💎 КРАСНЫЕ КРИСТАЛЛЫ (легальные):";
            break;
        case "Кингстон":
            contrabandInfo = "🟡 В Кингстоне только законная торговля жёлтыми кристаллами (30 монет)";
            crystalCount = yellow_crystals;
            crystalsLabel = "💎 ЖЁЛТЫЕ КРИСТАЛЛЫ:";
            break;
        case "Кастри":
            contrabandInfo = "🟢 Зелёные кристаллы рядом с кораблём = контрабанда (60 монет, риск 50%)";
            crystalCount = green_crystals;
            crystalsLabel = "💎 ЗЕЛЁНЫЕ КРИСТАЛЛЫ (легальные):";
            break;
        default:
            contrabandInfo = "Портал не определён";
            crystalCount = 0;
            crystalsLabel = "💎 КРИСТАЛЛЫ:";
    }
    
    if (contrabandInfoEl) contrabandInfoEl.textContent = contrabandInfo;
    if (crystalsLabelEl) crystalsLabelEl.textContent = crystalsLabel;
    if (crystalsAmountEl) crystalsAmountEl.textContent = crystalCount;
}

// Заправка корабля
function refuelShip() {
    if (fuel >= 100) {
        updateInfoMessage("⛽ Бак уже полный! Топливо: 100/100", "warning");
        return;
    }
    
    if (cash >= 20) {
        let fuelNeeded = 100 - fuel;
        let fuelToAdd = Math.min(20, fuelNeeded);
        let cost = fuelToAdd;
        
        cash -= cost;
        fuel += fuelToAdd;
        
        updateCashDisplay();
        updatePortDisplay();
        updateInfoMessage(`⛽ Заправка: +${fuelToAdd} топлива за ${cost} монет! Топливо: ${fuel}/100`, "success");
    } else {
        updateInfoMessage(`💰 Недостаточно монет для заправки! Нужно 20 монет. У вас: ${cash}`, "error");
    }
}

// Продажа легальных кристаллов (в трюме)
function sellCrystals() {
    let crystalAmount = 0;
    
    switch(currentPort) {
        case "Тортуга":
            crystalAmount = red_crystals + green_crystals + yellow_crystals;
            break;
        case "Бриджтаун":
            crystalAmount = green_crystals + blue_crystals + yellow_crystals;
            break;
        case "Кингстон":
            crystalAmount = yellow_crystals;
            break;
        case "Кастри":
            crystalAmount = red_crystals + blue_crystals + yellow_crystals;
            break;
        default:
            crystalAmount = 0;
    }
    
    if (crystalAmount <= 0) {
        updateInfoMessage("💎 Нет легальных кристаллов для продажи в этом порту!", "warning");
        return;
    }
    
    let earnings = crystalAmount * 30;
    cash += earnings;
    updateInfoMessage(`💎 Продажа легальных кристаллов: ${crystalAmount} шт. за ${earnings} монет!`, "success");
    addBonus(crystalAmount);
    
    // Очищаем проданные кристаллы
    switch(currentPort) {
        case "Тортуга":
            red_crystals = 0;
            green_crystals = 0;
            yellow_crystals = 0;
            break;
        case "Бриджтаун":
            green_crystals = 0;
            blue_crystals = 0;
            yellow_crystals = 0;
            break;
        case "Кингстон":
            yellow_crystals = 0;
            break;
        case "Кастри":
            red_crystals = 0;
            blue_crystals = 0;
            yellow_crystals = 0;
            break;
    }
    
    updateCashDisplay();
    updatePortDisplay();
}

// ========== ПРОДАЖА КОНТРАБАНДЫ (С УДАЛЕНИЕМ КРИСТАЛЛОВ С ПОЛЯ) ==========
function sellContraband() {
    // 1. ПРОВЕРКА: есть ли контрабанда
    if (!contrabandCrystals || contrabandCrystals.length === 0) {
        updateInfoMessage(`📦 Нет контрабанды рядом с кораблём! Найдите кристалл нужного цвета рядом с портом.`, "warning");
        return;
    }
    
    let contrabandAmount = contrabandCrystals.length;
    let baseEarnings = contrabandAmount * 60;
    let maxPenalty = contrabandAmount * 30;
    
    // 2. ПРОВЕРКА: достаточно ли монет для штрафа
    if (cash < maxPenalty && cash > 0) {
        updateInfoMessage(`⚠️ У вас недостаточно монет для покрытия возможного штрафа (${maxPenalty} монет)!`, "warning");
        // Можно разрешить или запретить - решать вам
        // return; // раскомментируйте, чтобы запретить
    }
    
    // 3. РЕЗУЛЬТАТ (50% успех, 50% провал)
    let isSuccess = Math.random() < 0.5;
    
    if (isSuccess) {
        // УСПЕХ
        cash += baseEarnings;
        updateInfoMessage(`🎉 КОНТРАБАНДА ПРОДАНА! +${baseEarnings} монет! (${contrabandAmount} кристаллов × 60)`, "success");
        addBonus(contrabandAmount * 2);
        
        // Показываем какие именно кристаллы проданы
        let colors = contrabandCrystals.map(c => c.colorEmoji + c.color).join(", ");
        updateInfoMessage(`📦 Проданы кристаллы: ${colors}`, "info");
        
    } else {
        // ПРОВАЛ
        let penalty = maxPenalty;
        cash -= penalty;
        addPenalty(contrabandAmount);
        updateInfoMessage(`😨 КОНТРАБАНДА РАСКРЫТА! Штраф: -${penalty} монет!`, "error");
        
        if (cash < 0) cash = 0;  // Защита от отрицательного баланса
    }
    
    // ========== 4. УДАЛЕНИЕ КРИСТАЛЛОВ С ПОЛЯ ==========
    let deletedCount = 0;
    for (let crystal of contrabandCrystals) {
        let pos = crystal.position;
        
        // Проверяем, что кристалл всё ещё на поле
        if (pos.row >= 0 && pos.row < heigh && pos.col >= 0 && pos.col < width) {
            if (matr[pos.row][pos.col] === crystal.value) {
                matr[pos.row][pos.col] = 0;
                deletedCount++;
                updateInfoMessage(`🗑️ ${crystal.colorEmoji} ${crystal.color} кристалл удалён с позиции (${pos.row}, ${pos.col})`, "info");
            }
        }
    }
    
    // 5. ОЧИСТКА МАССИВОВ
    contrabandCrystals = [];
    contrabandPositions = [];
    
    // 6. ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ
    updateCashDisplay();
    updatePortDisplay();
    
    // 7. ПЕРЕРИСОВКА ПОЛЯ (чтобы убрать удалённые кристаллы визуально)
    renderWarehouse();
    
    // 8. ИТОГОВОЕ СООБЩЕНИЕ
    if (deletedCount > 0) {
        if (isSuccess) {
            updateInfoMessage(`✅ Контрабанда успешно продана! ${deletedCount} кристаллов удалено с поля.`, "success");
        } else {
            updateInfoMessage(`⚠️ Контрабанда конфискована! ${deletedCount} кристаллов уничтожено.`, "error");
        }
    }
}

// Кабак
function goToTavern() {
    if (cash >= 10) {
        cash -= 10;
        
        let randomBonus = Math.floor(Math.random() * 11) + 5;
        let randomContraband = Math.floor(Math.random() * 4) + 1;
        
        bonusCount += randomBonus;
        
        // Добавляем контрабанду в зависимости от порта (в трюм, не на поле)
        switch(currentPort) {
            case "Тортуга":
                blue_crystals += randomContraband;
                updateInfoMessage(`🍺 Нашли контрабанду: +${randomContraband} 🔵 синих кристаллов!`, "info");
                break;
            case "Бриджтаун":
                red_crystals += randomContraband;
                updateInfoMessage(`🍺 Нашли контрабанду: +${randomContraband} 🔴 красных кристаллов!`, "info");
                break;
            case "Кингстон":
                yellow_crystals += randomContraband;
                updateInfoMessage(`🍺 Нашли кристаллы: +${randomContraband} 🟡 жёлтых кристаллов!`, "info");
                break;
            case "Кастри":
                green_crystals += randomContraband;
                updateInfoMessage(`🍺 Нашли контрабанду: +${randomContraband} 🟢 зелёных кристаллов!`, "info");
                break;
        }
        
        updateBonusDisplay();
        updateCashDisplay();
        updatePortDisplay();
        
        updateInfoMessage(`🍺 В кабаке подняли настроение! +${randomBonus} бонусов!`, "success");
    } else {
        updateInfoMessage(`💰 Недостаточно монет для кабака! Нужно 10 монет. У вас: ${cash}`, "error");
    }
}

// Выйти из порта
function exitPort() {
    contrabandCrystals = [];
    contrabandPositions = [];
    showPage('gamePage');
    updateInfoMessage(`⚓ Отчаливаем из порта ${currentPort}! Попутного ветра! Топливо: ${fuel}/100`, "success");
    renderWarehouse();
}