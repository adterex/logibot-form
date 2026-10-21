// timepicker.js — переиспользуемое колесо-прокрутка для выбора времени.
// Каждый вызов createTimePicker создаёт: кликабельную надпись-поле +
// скрытый по умолчанию блок с двумя прокручиваемыми колёсами (часы/минуты).
// Колёса раскрываются по клику на надпись и скрываются повторным кликом.

const ITEM_HEIGHT = 36;

function buildWheelItems(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push(String(i).padStart(2, '0'));
  }
  return items;
}

function createWheelColumn(container, items, onScrollSelect) {
  container.classList.add('wheel');
  container.style.paddingTop = `${ITEM_HEIGHT * 2}px`;
  container.style.paddingBottom = `${ITEM_HEIGHT * 2}px`;

  items.forEach((value) => {
    const el = document.createElement('div');
    el.className = 'wheel-item';
    el.textContent = value;
    el.style.height = `${ITEM_HEIGHT}px`;
    container.appendChild(el);
  });

  let debounceTimer = null;

  container.addEventListener('scroll', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const index = Math.round(container.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(items.length - 1, index));
      container.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' });
      onScrollSelect(items[clamped]);
    }, 100);
  });
}

// fieldId  — id кликабельной надписи ("Выбрать время" → "14:30")
// wheelId  — id блока, куда вставятся колёса (изначально скрыт)
// onChange — вызывается только когда пользователь реально прокрутил и выбрал время
function createTimePicker(fieldId, wheelId, onChange) {
  const field = document.getElementById(fieldId);
  const wheelContainer = document.getElementById(wheelId);
  wheelContainer.classList.add('time-picker');

  const hoursWheel = document.createElement('div');
  const separator = document.createElement('div');
  separator.className = 'wheel-separator';
  separator.textContent = ':';
  const minutesWheel = document.createElement('div');

  wheelContainer.appendChild(hoursWheel);
  wheelContainer.appendChild(separator);
  wheelContainer.appendChild(minutesWheel);

  const highlight = document.createElement('div');
  highlight.className = 'wheel-highlight';
  wheelContainer.appendChild(highlight);

  let selectedHour = '00';
  let selectedMinute = '00';

  function updateField() {
    field.textContent = `${selectedHour}:${selectedMinute}`;
    field.classList.remove('placeholder');
    onChange(`${selectedHour}:${selectedMinute}`);
  }

  createWheelColumn(hoursWheel, buildWheelItems(24), (value) => {
    selectedHour = value;
    updateField();
  });

  createWheelColumn(minutesWheel, buildWheelItems(60), (value) => {
    selectedMinute = value;
    updateField();
  });

  field.addEventListener('click', () => {
    wheelContainer.classList.toggle('open');
  });
}