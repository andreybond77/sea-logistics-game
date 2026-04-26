// ========== НАВИГАЦИОННЫЕ ФУНКЦИИ ==========

// Генерация игрового поля
function gen_arr(size1, size2, ary) {
    for (let k = 0; k < size1; k++) {
        for (let n = 0; n < size2; n++) {
            ary[k][n] = 0;
        }
    }
    
    // Стены по периметру
    for (let k = 0; k < size1; k++) {
        ary[k][0] = 7;
        ary[k][size2-1] = 7;
    }
    for (let n = 0; n < size2; n++) {
        ary[0][n] = 7;
        ary[size1-1][n] = 7;
    }
    
    // Порты (пустые места для стеллажей)
    ary[1][1] = 0;
    ary[1][size2-2] = 0;
    ary[size1-2][1] = 0;
    ary[size1-2][size2-2] = 0;
    
    // Свободные клетки
    const freeCells = [];
    for (let k = 1; k < size1-1; k++) {
        for (let n = 1; n < size2-1; n++) {
            if ((k === 1 && n === 1) || (k === 1 && n === size2-2) ||
                (k === size1-2 && n === 1) || (k === size1-2 && n === size2-2)) {
                continue;
            }
            freeCells.push({ row: k, col: n });
        }
    }
    
    shuffleArray(freeCells);
    
    // Объекты на поле: 1-4 контейнеры, 5 скалы, 0 пусто, 6 корабль
    const objects = [];
    for (let i = 0; i < 5; i++) objects.push(1);
    for (let i = 0; i < 5; i++) objects.push(2);
    for (let i = 0; i < 5; i++) objects.push(3);
    for (let i = 0; i < 5; i++) objects.push(4);
    for (let i = 0; i < 5; i++) objects.push(5);
    for (let i = 0; i < 5; i++) objects.push(0);
    objects.push(6);
    
    shuffleArray(objects);
    
    for (let i = 0; i < freeCells.length; i++) {
        const cell = freeCells[i];
        ary[cell.row][cell.col] = objects[i];
    }
}

// Движение вверх (код 8)
function sort_8(size1, size2, ary) {
    for (let k = 1; k < size1-1; k++) {
        for (let n = 1; n < size2-1; n++) {
            if (ary[k][n] === 6) {
                // Столкновение с портом Тортуга
                if (k-1 === 1 && n === 1) {
                    updateInfoMessage("⚠️ Осторожно! Столкновение с портом Тортуга! -10", "error");
                    cash -= 10;
                    addPenalty(1);
                    break;
                } 
                // Доставка в порт Тортуга
                else if (k-2 === 1 && n === 1) {
                    if (ary[k-1][n] === 1) {
                        ary[k-1][n] = ary[k][n];
                        ary[k][n] = 0;
                        red_box++;
                        cash += 30;
                        blue_crystals++; // даёт синие кристаллы
                        addBonus(1);
                        
                        if (Math.random() < 0.3) {
                            let found = Math.floor(Math.random() * 2) + 1;
                            blue_crystals += found;
                            updateInfoMessage(`📦 Нашли синие кристаллы: +${found} шт.!`, "info");
                        }
                        
                        updateInfoMessage("✅ Контейнер доставлен в Тортугу! +30 монет", "success");
                        break;
                    } else if (ary[k-1][n] === 0) {
                        let x = ary[k-1][n];
                        ary[k-1][n] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    } else {
                        let x = ary[k-1][n];
                        ary[k-1][n] = ary[k][n];
                        ary[k][n] = x;
                        updateInfoMessage("❌ Вход закрыт! Только для красных контейнеров.", "error");
                        break;
                    }
                }
                // Столкновение с портом Бриджтаун
                if (k-1 === 1 && n === size2-2) {
                    updateInfoMessage("⚠️ Осторожно! Столкновение с портом Бриджтаун! -10", "error");
                    cash -= 10;
                    addPenalty(1);
                    break;
                }
                // Доставка в порт Бриджтаун
                else if (k-2 === 1 && n === size2-2) {
                    if (ary[k-1][n] === 2) {
                        ary[k-1][n] = ary[k][n];
                        ary[k][n] = 0;
                        green_box++;
                        cash += 30;
                        red_crystals++; // даёт красные кристаллы
                        addBonus(1);
                        
                        if (Math.random() < 0.3) {
                            let found = Math.floor(Math.random() * 2) + 1;
                            red_crystals += found;
                            updateInfoMessage(`📦 Нашли красные кристаллы: +${found} шт.!`, "info");
                        }
                        
                        updateInfoMessage("✅ Контейнер доставлен в Бриджтаун! +30 монет", "success");
                        break;
                    } else if (ary[k-1][n] === 0) {
                        let x = ary[k-1][n];
                        ary[k-1][n] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    } else {
                        let x = ary[k-1][n];
                        ary[k-1][n] = ary[k][n];
                        ary[k][n] = x;
                        updateInfoMessage("❌ Вход закрыт! Только для зелёных контейнеров.", "error");
                        break;
                    }
                } 
                // Стена
                else if (k === 1) {
                    updateInfoMessage("🧱 Столкновение с бортом корабля! -5", "error");
                    cash -= 5;
                    addPenalty(1);
                    break;
                } 
                // Скала
                else if (ary[k-1][n] === 5) {
                    updateInfoMessage("🚧 На пути айсберг! -5", "error");
                    cash -= 5;
                    addPenalty(1);
                    break;
                } 
                else if (ary[k-1][n] !== 0 && ary[k-2][n] !== 0) {
                    let x = ary[k-1][n];
                    ary[k-1][n] = ary[k][n];
                    ary[k][n] = x;
                    break;
                } else if (ary[k-1][n] !== 0 && ary[k-2][n] === 0) {
                    if (k-1 !== 1) {
                        let x = ary[k-2][n];
                        ary[k-2][n] = ary[k-1][n];
                        ary[k-1][n] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    } else {
                        let x = ary[k-1][n];
                        ary[k-1][n] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    }
                } else if (ary[k-1][n] === 0) {
                    let x = ary[k-1][n];
                    ary[k-1][n] = ary[k][n];
                    ary[k][n] = x;
                    break;
                }
            }
        }
    }
}

// Движение вниз (код 2)
function sort_2(size1, size2, ary) {
    for (let k = size1-2; k >= 1; k--) {
        for (let n = 1; n < size2-1; n++) {
            if (ary[k][n] === 6) {
                // Столкновение с портом Кингстон
                if (k+1 === size1-2 && n === 1) {
                    updateInfoMessage("⚠️ Осторожно! Столкновение с портом Кингстон! -10", "error");
                    cash -= 10;
                    addPenalty(1);
                    break;
                }
                // Доставка в порт Кингстон
                else if (k+2 === size1-2 && n === 1) {
                    if (ary[k+1][n] === 4) {
                        ary[k+1][n] = ary[k][n];
                        ary[k][n] = 0;
                        yellow_box++;
                        cash += 30;
                        yellow_crystals++; // даёт жёлтые кристаллы
                        addBonus(1);
                        
                        updateInfoMessage("✅ Контейнер доставлен в Кингстон! +30 монет", "success");
                        break;
                    } else if (ary[k+1][n] === 0) {
                        let x = ary[k+1][n];
                        ary[k+1][n] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    } else {
                        let x = ary[k+1][n];
                        ary[k+1][n] = ary[k][n];
                        ary[k][n] = x;
                        updateInfoMessage("❌ Вход закрыт! Только для жёлтых контейнеров.", "error");
                        break;
                    }
                }
                // Столкновение с портом Кастри
                if (k+1 === size1-2 && n === size2-2) {
                    updateInfoMessage("⚠️ Осторожно! Столкновение с портом Кастри! -10", "error");
                    cash -= 10;
                    addPenalty(1);
                    break;
                }
                // Доставка в порт Кастри
                else if (k+2 === size1-2 && n === size2-2) {
                    if (ary[k+1][n] === 3) {
                        ary[k+1][n] = ary[k][n];
                        ary[k][n] = 0;
                        blue_box++;
                        cash += 30;
                        green_crystals++; // даёт зелёные кристаллы
                        addBonus(1);
                        
                        if (Math.random() < 0.3) {
                            let found = Math.floor(Math.random() * 2) + 1;
                            green_crystals += found;
                            updateInfoMessage(`📦 Нашли зелёные кристаллы: +${found} шт.!`, "info");
                        }
                        
                        updateInfoMessage("✅ Контейнер доставлен в Кастри! +30 монет", "success");
                        break;
                    } else if (ary[k+1][n] === 0) {
                        let x = ary[k+1][n];
                        ary[k+1][n] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    } else {
                        let x = ary[k+1][n];
                        ary[k+1][n] = ary[k][n];
                        ary[k][n] = x;
                        updateInfoMessage("❌ Вход закрыт! Только для синих контейнеров.", "error");
                        break;
                    }
                } 
                // Стена
                else if (k === size1-2) {
                    updateInfoMessage("🧱 Столкновение с бортом корабля! -5", "error");
                    cash -= 5;
                    addPenalty(1);
                    break;
                } 
                // Скала
                else if (ary[k+1][n] === 5) {
                    updateInfoMessage("🚧 На пути айсберг! -5", "error");
                    cash -= 5;
                    addPenalty(1);
                    break;
                } 
                else if (ary[k+1][n] !== 0 && ary[k+2][n] !== 0) {
                    let x = ary[k+1][n];
                    ary[k+1][n] = ary[k][n];
                    ary[k][n] = x;
                } else if (ary[k+1][n] !== 0 && ary[k+2][n] === 0) {
                    if (k+1 !== size1-2) {
                        let x = ary[k+2][n];
                        ary[k+2][n] = ary[k+1][n];
                        ary[k+1][n] = ary[k][n];
                        ary[k][n] = x;
                    } else {
                        let x = ary[k+1][n];
                        ary[k+1][n] = ary[k][n];
                        ary[k][n] = x;
                    }
                } else if (ary[k+1][n] === 0) {
                    let x = ary[k+1][n];
                    ary[k+1][n] = ary[k][n];
                    ary[k][n] = x;
                }
            }
        }
    }
}

// Движение влево (код 4)
function sort_4(size1, size2, ary) {
    for (let k = 1; k < size1-1; k++) {
        for (let n = 1; n < size2-1; n++) {
            if (ary[k][n] === 6) {
                // Доставка в порт Тортуга
                if (k === 1 && n-2 === 1) {
                    if (ary[k][n-1] === 1) {
                        ary[k][n-1] = ary[k][n];
                        ary[k][n] = 0;
                        red_box++;
                        cash += 30;
                        blue_crystals++;
                        addBonus(1);
                        
                        if (Math.random() < 0.3) {
                            let found = Math.floor(Math.random() * 2) + 1;
                            blue_crystals += found;
                            updateInfoMessage(`📦 Нашли синие кристаллы: +${found} шт.!`, "info");
                        }
                        
                        updateInfoMessage("✅ Контейнер доставлен в Тортугу! +30 монет", "success");
                        break;
                    } else if (ary[k][n-1] === 0) {
                        let x = ary[k][n-1];
                        ary[k][n-1] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    } else {
                        let x = ary[k][n-1];
                        ary[k][n-1] = ary[k][n];
                        ary[k][n] = x;
                        updateInfoMessage("❌ Вход закрыт! Только для красных контейнеров.", "error");
                        break;
                    }
                }
                // Столкновение с портом Тортуга
                if (k === 1 && n-1 === 1) {
                    updateInfoMessage("⚠️ Осторожно! Столкновение с портом Тортуга! -10", "error");
                    cash -= 10;
                    addPenalty(1);
                    break;
                }
                // Доставка в порт Кингстон
                if (k === size1-2 && n-2 === 1) {
                    if (ary[k][n-1] === 4) {
                        ary[k][n-1] = ary[k][n];
                        ary[k][n] = 0;
                        yellow_box++;
                        cash += 30;
                        yellow_crystals++;
                        addBonus(1);
                        
                        updateInfoMessage("✅ Контейнер доставлен в Кингстон! +30 монет", "success");
                        break;
                    } else if (ary[k][n-1] === 0) {
                        let x = ary[k][n-1];
                        ary[k][n-1] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    } else {
                        let x = ary[k][n-1];
                        ary[k][n-1] = ary[k][n];
                        ary[k][n] = x;
                        updateInfoMessage("❌ Вход закрыт! Только для жёлтых контейнеров.", "error");
                        break;
                    }
                }
                // Столкновение с портом Кингстон
                if (k === size1-2 && n-1 === 1) {
                    updateInfoMessage("⚠️ Осторожно! Столкновение с портом Кингстон! -10", "error");
                    cash -= 10;
                    addPenalty(1);
                    break;
                }
                // Стена
                else if (n === 1) {
                    updateInfoMessage("🧱 Столкновение с бортом корабля! -5", "error");
                    cash -= 5;
                    addPenalty(1);
                    break;
                }
                // Скала
                else if (ary[k][n-1] === 5) {
                    updateInfoMessage("🚧 На пути айсберг! -5", "error");
                    cash -= 5;
                    addPenalty(1);
                    break;
                } 
                else if (ary[k][n-1] !== 0 && ary[k][n-2] !== 0) {
                    let x = ary[k][n-1];
                    ary[k][n-1] = ary[k][n];
                    ary[k][n] = x;
                } else if (ary[k][n-1] !== 0 && ary[k][n-2] === 0) {
                    if (n-1 !== 1) {
                        let x = ary[k][n-2];
                        ary[k][n-2] = ary[k][n-1];
                        ary[k][n-1] = ary[k][n];
                        ary[k][n] = x;
                    } else {
                        let x = ary[k][n-1];
                        ary[k][n-1] = ary[k][n];
                        ary[k][n] = x;
                    }
                } else if (ary[k][n-1] === 0) {
                    let x = ary[k][n-1];
                    ary[k][n-1] = ary[k][n];
                    ary[k][n] = x;
                }
            }
        }
    }
}

// Движение вправо (код 6)
function sort_6(size1, size2, ary) {
    for (let k = 1; k < size1-1; k++) {
        for (let n = size2-2; n >= 1; n--) {
            if (ary[k][n] === 6) {
                // Доставка в порт Бриджтаун
                if (k === 1 && n+2 === size2-2) {
                    if (ary[k][n+1] === 2) {
                        ary[k][n+1] = ary[k][n];
                        ary[k][n] = 0;
                        green_box++;
                        cash += 30;
                        red_crystals++;
                        addBonus(1);
                        
                        if (Math.random() < 0.3) {
                            let found = Math.floor(Math.random() * 2) + 1;
                            red_crystals += found;
                            updateInfoMessage(`📦 Нашли красные кристаллы: +${found} шт.!`, "info");
                        }
                        
                        updateInfoMessage("✅ Контейнер доставлен в Бриджтаун! +30 монет", "success");
                        break;
                    } else if (ary[k][n+1] === 0) {
                        let x = ary[k][n+1];
                        ary[k][n+1] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    } else {
                        let x = ary[k][n+1];
                        ary[k][n+1] = ary[k][n];
                        ary[k][n] = x;
                        updateInfoMessage("❌ Вход закрыт! Только для зелёных контейнеров.", "error");
                        break;
                    }
                }
                // Столкновение с портом Бриджтаун
                if (k === 1 && n+1 === size2-2) {
                    updateInfoMessage("⚠️ Осторожно! Столкновение с портом Бриджтаун! -10", "error");
                    cash -= 10;
                    addPenalty(1);
                    break;
                }
                // Доставка в порт Кастри
                if (k === size1-2 && n+2 === size2-2) {
                    if (ary[k][n+1] === 3) {
                        ary[k][n+1] = ary[k][n];
                        ary[k][n] = 0;
                        blue_box++;
                        cash += 30;
                        green_crystals++;
                        addBonus(1);
                        
                        if (Math.random() < 0.3) {
                            let found = Math.floor(Math.random() * 2) + 1;
                            green_crystals += found;
                            updateInfoMessage(`📦 Нашли зелёные кристаллы: +${found} шт.!`, "info");
                        }
                        
                        updateInfoMessage("✅ Контейнер доставлен в Кастри! +30 монет", "success");
                        break;
                    } else if (ary[k][n+1] === 0) {
                        let x = ary[k][n+1];
                        ary[k][n+1] = ary[k][n];
                        ary[k][n] = x;
                        break;
                    } else {
                        let x = ary[k][n+1];
                        ary[k][n+1] = ary[k][n];
                        ary[k][n] = x;
                        updateInfoMessage("❌ Вход закрыт! Только для синих контейнеров.", "error");
                        break;
                    }
                }
                // Столкновение с портом Кастри
                if (k === size1-2 && n+1 === size2-2) {
                    updateInfoMessage("⚠️ Осторожно! Столкновение с портом Кастри! -10", "error");
                    cash -= 10;
                    addPenalty(1);
                    break;
                }
                // Стена
                else if (n === size2-2) {
                    updateInfoMessage("🧱 Столкновение с бортом корабля! -5", "error");
                    cash -= 5;
                    addPenalty(1);
                    break;
                }
                // Скала
                else if (ary[k][n+1] === 5) {
                    updateInfoMessage("🚧 На пути айсберг! -5", "error");
                    cash -= 5;
                    addPenalty(1);
                    break;
                } 
                else if (ary[k][n+1] !== 0 && ary[k][n+2] !== 0) {
                    let x = ary[k][n+1];
                    ary[k][n+1] = ary[k][n];
                    ary[k][n] = x;
                } else if (ary[k][n+1] !== 0 && ary[k][n+2] === 0) {
                    if (n+1 !== size2-2) {
                        let x = ary[k][n+2];
                        ary[k][n+2] = ary[k][n+1];
                        ary[k][n+1] = ary[k][n];
                        ary[k][n] = x;
                    } else {
                        let x = ary[k][n+1];
                        ary[k][n+1] = ary[k][n];
                        ary[k][n] = x;
                    }
                } else if (ary[k][n+1] === 0) {
                    let x = ary[k][n+1];
                    ary[k][n+1] = ary[k][n];
                    ary[k][n] = x;
                }
            }
        }
    }
}

// Проверка победы
function show_victoria(size1, size2, ary) {
    number_of_boxes = 0;
    red_box_counter = 0;
    green_box_counter = 0;
    blue_box_counter = 0;
    yellow_box_counter = 0;
    
    for (let k = 0; k < size1; k++) {
        for (let n = 0; n < size2; n++) {
            if ((k !== 1 && n !== 1) || (k !== size1-2 && n !== 1) ||
                (k !== 1 && n !== size2-2) || (k !== size1-2 && n !== size2-2)) {
                if (ary[k][n] === 1) red_box_counter++;
                else if (ary[k][n] === 2) green_box_counter++;
                else if (ary[k][n] === 3) blue_box_counter++;
                else if (ary[k][n] === 4) yellow_box_counter++;
            }
            if ((k === 1 && n === 1) || (k === size1-2 && n === 1) ||
                (k === 1 && n === size2-2) || (k === size1-2 && n === size2-2)) {
                ary[k][n] = 0;
            }
        }
    }

    if (red_col === 0 && red_box_counter === 0) {
        updateInfoMessage(`🏆 Тортуга полностью загружена! +100`, "success");
        cash += 100;
        red_col++;
    }
    if (green_col === 0 && green_box_counter === 0) {
        updateInfoMessage(`🏆 Бриджтаун полностью загружен! +100`, "success");
        cash += 100;
        green_col++;
    }
    if (blue_col === 0 && blue_box_counter === 0) {
        updateInfoMessage(`🏆 Кастри полностью загружен! +100`, "success");
        cash += 100;
        blue_col++;
    }
    if (yellow_coll === 0 && yellow_box_counter === 0) {
        updateInfoMessage(`🏆 Кингстон полностью загружен! +100`, "success");
        cash += 100;
        yellow_coll++;
    }
    if (red_box_counter === 0 && green_box_counter === 0 && blue_box_counter === 0 && yellow_box_counter === 0) {
        number_of_boxes = red_box + green_box + blue_box + yellow_box;
        cash += 1000;
        updateInfoMessage(`🎉 ВСЕ ПОРТЫ ЗАГРУЖЕНЫ! +1000 🎉`, "success");
    }
}

// Смена акватории
function zeroing_out() {
    red_box = 0;
    green_box = 0;
    yellow_box = 0;
    blue_box = 0;
    red_box_counter = 0;
    green_box_counter = 0;
    blue_box_counter = 0;
    yellow_box_counter = 0;
    number_of_boxes = 0;
    red_col = 0;
    green_col = 0;
    blue_col = 0;
    yellow_coll = 0;
    cash -= 30;
    updateInfoMessage("🚪 Вы перешли в другой сектор карты -30", "warning");
    addPenalty(1);
}