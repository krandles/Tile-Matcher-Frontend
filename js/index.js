document.addEventListener("DOMContentLoaded", function() {
  //render cards on page

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
  i3 = 1;
  for (let i = 1; i < 5; i++) {
    for (let i2 = 1; i2 < 5; i2++) {
      //create flip container
      let flipContainer = document.createElement("div");
      flipContainer.classList.add(
        `flip-container`,
        `card`,
        `row${i2}`, //fix rows & cols
        `column${i}` //fix rows & cols
      );
      flipContainer.setAttribute("onclick", "this.classList.toggle('flip')");
      flipContainer.id = `tile${i3}`;
      //create flipper
      let flipper = document.createElement("div");
      flipper.classList.add("flipper");
      //create front of card
      let flipFront = document.createElement("div");
      flipFront.classList.add("front");
      let flipFrontImage = document.createElement("img");
      flipFrontImage.src = ""; //SET IMAGE FOR FRONT HERE
      //create back of card
      let flipBack = document.createElement("div");
      flipBack.classList.add("back");
      let flipBackImage = document.createElement("img");
      flipBackImage.src = `./images/tile${shuffledImageArray[i3 - 1]}.png`;
      //append things
      flipFront.append(flipFrontImage);
      flipBack.append(flipBackImage);
      flipper.append(flipFront);
      flipper.append(flipBack);
      flipContainer.append(flipper);
      gameWrapper.append(flipContainer);
      i3 += 1;
    }
  }
});
