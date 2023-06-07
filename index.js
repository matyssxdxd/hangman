let wordToGuess;
let wordDefinition;
let wordHidden = [];
let tries = 7;

const getWord = async () => {
  const res = await fetch("https://api.api-ninjas.com/v1/randomword", {
    method: "GET",
    headers: { "X-Api-Key": "jWa3Oq4Wqr8fngICEmyKFQ==02Fl5Ag1Lh6m9wNd" },
    type: "noun",
    contentType: "application/json",
  });

  return await res.json();
};

const getExplanation = async (word) => {
  const res = await fetch(
    "https://api.dictionaryapi.dev/api/v2/entries/en/" + word,
    {
      method: "GET",
      contentType: "application/json",
    }
  );

  return await res.json();
};

const initializeGame = async () => {
  try {
    document.getElementById("loading-div").style.display = "block";
    document.getElementById("game-div").style.display = "none";
    document.querySelector(".header").style.display = "none";
    document.querySelector(".result").style.display = "none";
    document.querySelector(".answer").style.display = "none";
    document.getElementById("explanation").style.display = "none";
    document.getElementById("play-again-btn").hidden = true;

    const wordData = await getWord();
    wordToGuess = wordData["word"].toLowerCase().split("");
    const wordExplanation = await getExplanation(wordToGuess.join(""));

    if (wordExplanation.title != "No Definitions Found") {
      wordDefinition = wordExplanation[0].meanings[0].definitions[0].definition;
    } else {
      wordDefinition = "No definition found :(";
    }

    for (let i = 0; i < wordToGuess.length; i++) {
      wordHidden.push("_");
    }

    let buttons = document.querySelectorAll(".btn");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
    }
  } catch (error) {
    console.error("Error occurred while fetching the word: ", error);
  }

  document.getElementById("loading-div").style.display = "none";
  document.getElementById("game-div").style.display = "block";
  document.querySelector(".header").style.display = "flex";
  document.querySelector(".tries").style.display = "block";
  document.querySelector(".word").style.display = "block";
  document.getElementById("explanation").innerHTML =
    "Definition: " + wordDefinition;
  document.querySelector(".tries").innerHTML = "Tries left: " + tries;
  document.querySelector(".word").innerHTML = wordHidden.join(" ");
};

const verifyInput = (word) => {
  document.getElementById(word).disabled = true;

  if (wordToGuess.includes(word)) {
    for (let i = 0; i < wordToGuess.length; i++) {
      if (wordToGuess[i] === word) {
        wordHidden[i] = word;
      }
    }

    if (wordToGuess.join("") === wordHidden.join("")) {
      document.querySelector(".tries").style.display = "none";
      document.querySelector(".word").style.display = "none";
      document.querySelector(".result").style.display = "block";
      document.querySelector(".answer").style.display = "block";
      document.getElementById("explanation").style.display = "block";
      document.querySelector(".result").innerHTML = "You won!";
      document.querySelector(".answer").innerHTML =
        "The word was " + wordToGuess.join("");
      document.getElementById("play-again-btn").hidden = false;

      let buttons = document.querySelectorAll(".btn");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    }
  } else {
    tries--;
    if (tries === 0) {
      document.querySelector(".result").style.display = "block";
      document.querySelector(".answer").style.display = "block";
      document.querySelector(".word").style.display = "none";
      document.querySelector(".tries").style.display = "none";
      document.querySelector(".result").innerHTML = "You lost!";
      document.getElementById("explanation").style.display = "block";
      document.querySelector(".answer").innerHTML =
        "The word was " + wordToGuess.join("");
      document.getElementById("play-again-btn").hidden = false;

      let buttons = document.querySelectorAll(".btn");
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    }
  }

  document.querySelector(".tries").innerHTML = "Tries left: " + tries;
  document.querySelector(".word").innerHTML = wordHidden.join(" ");
};

document.addEventListener("keydown", (event) => {
  if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
    if (!document.getElementById(event.key).disabled) {
      verifyInput(event.key);
    }
  }
});

const handleClick = (event) => {
  verifyInput(event.target.id);
};

const restartGame = () => {
  wordToGuess = "";
  wordDefinition = "";
  wordHidden = [];
  tries = 7;
  initializeGame();
};

document.getElementById("play-again-btn").addEventListener("click", () => {
  restartGame();
});

initializeGame();
