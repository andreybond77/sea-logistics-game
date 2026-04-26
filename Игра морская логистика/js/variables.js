// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========

// Размеры поля
const width = 9;
const heigh = 7;

// Игровое поле
let matr = Array(heigh).fill().map(() => Array(width).fill(0));

// Состояние игры
let cash = 0;
let step = 0;
let gameRunning = false;
let penaltyCount = 0;
let bonusCount = 0;

// Статистика
let totalDeposits = 0;
let totalProfit = 0;
let totalMoneyPenalties = 0;
let initialCash = 0;

// Топливо
let fuel = 100;

// Кристаллы (хранятся в трюме корабля)
let red_crystals = 0;    // красные кристаллы (легальные в Тортуге и Кастри)
let green_crystals = 0;  // зелёные кристаллы (легальные в Бриджтауне и Тортуге)
let blue_crystals = 0;   // синие кристаллы (легальные в Бриджтауне и Кастри)
let yellow_crystals = 0; // жёлтые кристаллы (легальные везде, единственные в Кингстоне)

// Контрабанда (кристаллы на поле рядом с кораблём)
let contrabandCrystals = [];
let contrabandPositions = [];
let currentPort = "";

// Счётчики доставленных контейнеров в порты
let red_box = 0;    // в Тортугу (красные контейнеры)
let green_box = 0;  // в Бриджтаун (зелёные контейнеры)
let yellow_box = 0; // в Кингстон (жёлтые контейнеры)
let blue_box = 0;   // в Кастри (синие контейнеры)

// Флаги полной загрузки портов
let red_col = 0;
let green_col = 0;
let blue_col = 0;
let yellow_coll = 0;

// Счётчики для победы
let red_box_counter = 0;
let green_box_counter = 0;
let blue_box_counter = 0;
let yellow_box_counter = 0;
let number_of_boxes = 0;

// DOM элементы
let warehouseEl, cashValueEl, infoMessageEl, stepValueEl, penaltyCountEl, bonusCountEl;