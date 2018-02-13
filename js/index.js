document.addEventListener("DOMContentLoaded", function() {
  //create shuffled array
  const imageArray = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
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
  let shuffledImageArray = shuffle(imageArray);

  //grab wrapper from HTML
  const gameWrapper = document.getElementById("wrapper");
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
      flipFront.innerHTML = `<p>${shuffledImageArray[idx - 1]}</p>`;
      // let flipFrontImage = document.createElement("img");
      // flipFrontImage.src = ""; //SET IMAGE FOR FRONT HERE
      //create back of card
      let flipBack = document.createElement("div");
      flipBack.classList.add("back");
      let flipBackImage = document.createElement("img");
      flipBackImage.src = `./images/tile${shuffledImageArray[idx - 1]}.png`;
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

  //initialize vars for tiles
  let tiles = document.querySelectorAll(".card");
  let firstClickedTile;
  let secondClickedTile;
  //set event listeners on tiles
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener("click", matching);
  }

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
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].removeEventListener("click", matching);
    }
  }

  function winCheck() {
    let notMatchedTiles = 0;

    for (let i = 0; i < tiles.length; i++) {
      if (!tiles[i].classList.contains("matched")) {
        notMatchedTiles++;
      }
    }

    if (notMatchedTiles === 0) {
      console.log("You won!");
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
    alert("You Win!!!");
  }
});
