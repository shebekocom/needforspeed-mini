const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div'),
  music = document.createElement('audio');
let timer,
  topScore = localStorage.getItem('topScore');

music.classList.add('music');
car.classList.add('car');

//gameArea.classList.add('hide');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
  startSpeed: 3
}

function getQuantityElements(heightElement) {
  return Math.ceil(gameArea.offsetHeight / heightElement);
}

function startGame() {
  start.classList.add('hide');
  score.style.display = 'block';
  gameArea.style.display = 'block';
  gameArea.innerHTML = '';

  playMusic();

  for (let i = 0; i < getQuantityElements(20); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    let enemyImg = Math.floor(Math.random() * (3 - 1) + 1);
    console.log(enemyImg);
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url(image/enemy${enemyImg}.png) center / cover no-repeat`;
    gameArea.appendChild(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = '125px';
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);

  timer = setInterval(() => {
    setting.speed += 2;
  }, 18000);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.textContent = 'Score: ' + setting.score;

    moveRoad();
    moveEnemy();


    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed;
    }
    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }
    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';
    requestAnimationFrame(playGame);
  } else {
    music.remove();
  }
}


function startRun(event) {
  event.preventDefault();
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
  }
  console.log(keys);
}

function stopRun(event) {
  event.preventDefault();
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y >= gameArea.offsetHeight) {
      line.y = -100;
    }

  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');

  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    if (carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top) {
      setting.start = false;
      start.classList.remove('hide');
      start.style.top = '50%';
      clearInterval(timer);
      setting.speed = setting.startSpeed;
      console.log('ДТП');
      if (topScore < setting.score) {
        localStorage.setItem('topScore', setting.score);
      }

    }
    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if (item.y >= gameArea.offsetHeight) {
      item.y = -100 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}

const playMusic = () => {
  music.setAttribute('autoplay', true);
  music.setAttribute('loop', true);
  music.setAttribute('controls', true);
  music.setAttribute('src', 'audio.mp3');
  gameArea.appendChild(music);
}