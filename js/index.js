document.addEventListener("DOMContentLoaded", function() {
  //declare variables
  const gameWrapper = document.getElementById("wrapper");
  let timer = document.getElementById("timer");
  let scoreboard = document.getElementById("scoreboard");
  let highScore = document.getElementById("high-score");
  const imageArray = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
  let intervalID;
  let currentTilesetId;
  // production
  const apiRoot = "https://infinite-beach-25842.herokuapp.com/api/v1"
  //dev
  // const apiRoot = "http://localhost:3000/api/v1"

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

  function incrementTimer() {
    timer.innerText = parseInt(timer.innerHTML) + 1;
  }

  function updateHighScore(currentTimerVal) {
    fetch(`${apiRoot}/tilesets/${currentTilesetId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        high_score: currentTimerVal
      })
    });
  }

  //create scoreboard
  //set new high score on win
  function setHighScore() {
    getTileset().then(console.log);
    let currentHighScore = parseInt(highScore.innerText);
    let currentTimerVal = parseInt(timer.innerHTML);
    if (currentHighScore == 0 || currentTimerVal < currentHighScore) {
      highScore.innerText = currentTimerVal;
    }
    return currentHighScore;
  }

  function renderCards(shuffledArray, newImageFilesArray) {
    //render cards on page
    idx = 1;
    for (let y = 1; y < 5; y++) {
      for (let x = 1; x < 5; x++) {
        //create flip container
        let flipContainer = document.createElement("div");
        flipContainer.classList.add(
          `flip-container`,
          `card`,
          `row${x}`,
          `column${y}`
        );

        flipContainer.id = `tile${idx}`;
        //create flipper
        let flipper = document.createElement("div");
        flipper.classList.add("flipper");
        //create front of card
        let flipFront = document.createElement("div");
        flipFront.classList.add("front");
        //create back of card
        let flipBack = document.createElement("div");
        flipBack.classList.add("back");
        let flipBackImage = document.createElement("img");
        flipBackImage.src = `${newImageFilesArray[shuffledArray[idx - 1] - 1]}`;
        //append things
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
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener("click", matching);
      }
    }
  }

  function winMenu() {
    clearInterval(intervalID);
    const menuModal = document.getElementById("menu-modal");
    menuModal.innerHTML = "";
    const winMenuDiv = document.createElement("div");
    const winMenuText = "Congratulations! You Won!";
    winMenuDiv.classList.add("modal-content")
    winMenuDiv.innerHTML = `<p>${winMenuText}</p>`;
    menuModal.appendChild(winMenuDiv);
    menuModal.addEventListener("click", loadStartMenu);
    menuModal.style.display = "block";
  }

  function getTilesets() {
    return fetch(`${apiRoot}/tilesets`).then(res =>
      res.json()
    );
  }

  function getTileset() {
    return fetch(`${apiRoot}/tilesets/`)
      .then(res => res.json())
      .then(res => {
      let array = [...res]
        array.find(function(tileset) {
          tileset.id = currentTilesetId;
        })
      });
  }

  function getTiles(id) {
    return fetch(`${apiRoot}/tilesets/${id}`).then(res =>
      res.json()
    );
  }

  function loadStartMenu() {
    const menuModal = document.getElementById("menu-modal");
    menuModal.removeEventListener("click", loadStartMenu);
    menuModal.innerHTML = "";
    let wrapper = document.getElementById("wrapper");
    wrapper.innerHTML = "";
    timer.innerHTML = "0";
    getTilesets().then(data => {
      const tilesetSelectDiv = document.createElement("div");
      const tilesetSelect = document.createElement("select");
      tilesetSelect.id = "tileset-selector"
      tilesetSelectDiv.id = "tileset-selector-div";
      data.map(tileset => {
        let new_option = document.createElement("option");
        new_option.value = tileset.id;
        new_option.innerText = tileset.name;
        tilesetSelect.append(new_option);
        currentTilesetId = tileset.id;
      });
      const tilesetSelectHeader = document.createElement("p")
      tilesetSelectHeader.innerText = "Select Tileset: "
      tilesetSelectDiv.append(tilesetSelectHeader)
      tilesetSelectDiv.append(tilesetSelect)
      // menuModal.append(tilesetSelectDiv);
      const startButtonDiv = document.createElement("div");
      const startButton = document.createElement("button");
      startButton.innerHTML = "<p>Start Game</p>";
      startButton.addEventListener("click", loadTiles);
      startButtonDiv.appendChild(startButton)
      menuModal.appendChild(startButtonDiv);
      menuModal.style.display = "block";
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      modalContent.appendChild(tilesetSelectDiv);
      modalContent.appendChild(startButtonDiv);
      menuModal.appendChild(modalContent);
    });
    // const newTilesetButton = document.createElement("button");
    // newTilesetButton.innerHTML = "<p>Create Tileset</p>";
    // newTilesetButton.addEventListener("click", loadNewTilesetMenu);
  }

  function loadTiles() {
    let selectValue = document.querySelector("#tileset-selector");
    const newImageFilesArray = [];
    getTiles(selectValue.value)
      .then(json => {
        json.forEach(function(tile_object) {
          newImageFilesArray.push(tile_object.path);
        });
        return newImageFilesArray;
      })
      .then(res => startGame(res));
  }

  function startGame(imagesArray) {
    const menuModal = document.getElementById("menu-modal");
    menuModal.style.display = "none";
    let shuffledImageArray = shuffle(imageArray);
    renderCards(shuffledImageArray, imagesArray);

    previewCards();

    setTimeout(function() {
      addCardListeners();

      let timerInterval = setInterval(function() {
        incrementTimer();
      }, 1000);
      intervalID = timerInterval;
    }, 3500);
  }

  loadStartMenu();

  function loadNewTilesetMenu() {
    const menuModal = document.getElementById("menu-modal");
    menuModal.innerHTML = "";
    const fileInputForm = document.createElement("form");
    const tilesetNameInput = document.createElement("input");
    tilesetNameInput.setAttribute("type", "text");
    const fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("multiple", "");
    fileInput.id = "file-input";
    fileInput.addEventListener("change", handleFiles, false);
    const submitButton = document.createElement("input");
    submitButton.setAttribute("type", "submit");
    const filesList = document.createElement("ul");
    filesList.id = "files-list";
    fileInputForm.appendChild(tilesetNameInput);
    fileInputForm.appendChild(fileInput);
    fileInputForm.appendChild(submitButton);
    fileInputForm.appendChild(filesList);
    menuModal.appendChild(fileInputForm);

    fileInputForm.addEventListener("submit", saveTileset());
  }

  function handleFiles() {
    let filesList = document.getElementById("file-input").files;
    console.log(filesList);
    const filesListUl = document.getElementById("files-list");
    filesListUl.innerHTML = "";
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const fileLi = document.createElement("li");
      fileLi.innerText = file.name;
      filesListUl.appendChild(fileLi);
    }
  }

  function saveTileset(event) {
    event.preventDefault();
    const fileList = document.getElementById("file-input").files;
    const formData = new FormData();
    const tilesetName = document.querySelector("input").value;
    formData.append("name", tilesetName);
    formData.append("tile_data", fileList);
    fetch("https://localhost:3000/tilesets", {
      method: "POST",
      body: formData
    });
  }
});
