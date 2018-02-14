document.addEventListener("DOMContentLoaded", function() {
  //declare variables
  const gameWrapper = document.getElementById("wrapper");
  let timer = document.getElementById("timer");
  let scoreboard = document.getElementById("scoreboard");
  let highScore = document.getElementById("high-score");
  const imageArray = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
  let intervalID;

  //create shuffled array
  function shuffle(imageArray) {
    var currentIndex = imageArray.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = imageArray[currentIndex];
      imageArray[currentIndex] = imageArray[randomIndex];
      imageArray[randomIndex] = temporaryValue;
    }

    return imageArray;
  }

  //create timer
  // let timerInterval = setInterval(function() {
  //   incrementTimer();
  // }, 1000);

  function incrementTimer() {
    timer.innerText = parseInt(timer.innerHTML) + 1;
  }

  //create scoreboard
  //set new high score on win
  function setHighScore() {
    let currentHighScore = parseInt(highScore.innerText);
    let currentTimerVal = parseInt(timer.innerHTML);
    if (currentHighScore == 0 || currentTimerVal < currentHighScore) {
      highScore.innerText = currentTimerVal;
    }
    return currentHighScore
  }

  function renderCards(shuffledArray) {
    //render cards on page
    idx = 1;
    for (let y = 1; y < 5; y++) {
      for (let x = 1; x < 5; x++) {
        //create flip container
        let flipContainer = document.createElement("div");
        flipContainer.classList.add(
          `flip-container`,
          `card`,
          `row${x}`, //fix rows & cols
          `column${y}` //fix rows & cols
        );
        // flipContainer.setAttribute("onclick", "this.classList.toggle('flip')");
        flipContainer.id = `tile${idx}`;
        //create flipper
        let flipper = document.createElement("div");
        flipper.classList.add("flipper");
        //create front of card
        let flipFront = document.createElement("div");
        flipFront.classList.add("front");
        flipFront.innerHTML = `<p>${shuffledArray[idx - 1]}</p>`;
        // let flipFrontImage = document.createElement("img");
        // flipFrontImage.src = ""; //SET IMAGE FOR FRONT HERE
        //create back of card
        let flipBack = document.createElement("div");
        flipBack.classList.add("back");
        let flipBackImage = document.createElement("img");
        flipBackImage.src = `./images/tile${shuffledArray[idx - 1]}.png`;
        //append things
        // flipFront.append(flipFrontImage);
        flipBack.append(flipBackImage);
        flipper.append(flipFront);
        flipper.append(flipBack);
        flipContainer.append(flipper);
        gameWrapper.append(flipContainer);
        idx += 1;
      }
    }
  }

  function previewCards() {
    let cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("flip");
        setTimeout(() => {
          card.classList.remove("flip");
        }, 500 + index * 100);
      }, 500 + index * 100);
    });
  }

  function addCardListeners() {
    //initialize vars for tiles
    let tiles = document.querySelectorAll(".card");
    //set event listeners on tiles
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener("click", matching);
    }
  }

  let firstClickedTile;
  let secondClickedTile;

  //grab onto most recent 2 tiles here
  function matching(event) {
    if (!firstClickedTile) {
      firstClickedTile = event.target.parentNode.parentNode;
      firstClickedTile.classList.add("flip");
    } else if (event.target.parentNode.parentNode !== firstClickedTile) {
      secondClickedTile = event.target.parentNode.parentNode;
      secondClickedTile.classList.add("flip");
      //check for match after second tile clicked
      if (firstClickedTile.innerHTML == secondClickedTile.innerHTML) {
        tilesClickDelay();
        setTimeout(() => {
          firstClickedTile.classList.add("matched");
          secondClickedTile.classList.add("matched");
          firstClickedTile = undefined;
          secondClickedTile = undefined;
          winCheck();
        }, 100);
      } else {
        tilesClickDelay();
        setTimeout(() => {
          firstClickedTile.classList.remove("flip");
          secondClickedTile.classList.remove("flip");
          firstClickedTile = undefined;
          secondClickedTile = undefined;
          winCheck();
        }, 700);
      }
    }
  }

  function tilesClickDelay() {
    const tiles = document.querySelectorAll(".card");
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].removeEventListener("click", matching);
    }
  }

  function winCheck() {
    let notMatchedTiles = 0;
    const tiles = document.querySelectorAll(".card");
    for (let i = 0; i < tiles.length; i++) {
      if (!tiles[i].classList.contains("matched")) {
        notMatchedTiles++;
      }
    }

    if (notMatchedTiles === 0) {
      setHighScore();
      winMenu();
      return;
    } else {
      // setTimeout(() => {
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener("click", matching);
      }
      // }, 700);
    }
  }

  

  function winMenu() {
    clearInterval(intervalID)
    const menuModal = document.getElementById('menu-modal')
    menuModal.innerHTML = ''
    const winMenuDiv = document.createElement('div')
    const winMenuText = 'Congratulations! You Won!'
    winMenuDiv.innerHTML = `<p>${winMenuText}</p>`
    menuModal.appendChild(winMenuDiv)
    menuModal.addEventListener('click', loadStartMenu)
    menuModal.style.display = "block"
  }

  function loadStartMenu() {
    const menuModal = document.getElementById('menu-modal')
    menuModal.removeEventListener('click', loadStartMenu)
    menuModal.innerHTML = ''
    let wrapper = document.getElementById('wrapper')
    wrapper.innerHTML = ''
    timer.innerHTML = '0'
    const startButton = document.createElement('button')
    startButton.innerHTML = '<p>Start Game</p>'
    startButton.addEventListener('click', startGame)
    const menuText = "Welcome to Match Game"
    const modalContent = document.createElement('span')
    modalContent.innerHTML = `<p>${menuText}</p><br>`
    modalContent.classList.add('modal-content')
    modalContent.appendChild(startButton)
    menuModal.appendChild(modalContent)
    menuModal.style.display = "block"
  }

  function startGame() {
    const menuModal = document.getElementById("menu-modal");
    menuModal.style.display = "none";
    let shuffledImageArray = shuffle(imageArray);
    renderCards(shuffledImageArray);

    previewCards();

    setTimeout(function() {
      addCardListeners();

      let timerInterval = setInterval(function() {
        incrementTimer();
      }, 1000);
      intervalID = timerInterval
    }, 3500);
  }

  loadStartMenu();
  // startGame()
});
