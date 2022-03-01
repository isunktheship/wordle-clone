import React, { Component } from "react";
import { render } from "react-dom";
import Keyboard from "react-simple-keyboard";
import eventBus from "./EventBus";

import "react-simple-keyboard/build/css/index.css";
import "./styles.css";

import { VALID_WORDS, VALID_GUESSES } from "./word_list.js";

const RANDOM_NUMBER = Math.floor(Math.random() * VALID_WORDS.length);
const WORD_OF_THE_DAY = VALID_WORDS[RANDOM_NUMBER];

console.log(RANDOM_NUMBER);
console.log(WORD_OF_THE_DAY);

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guesses: ["", "", "", "", "", ""],
      colors: ["xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx", "xxxxx"],
      turn: 0,
      win: null
    };
    this.attempt = 0;
    this.current_input = "";
  }

  componentDidMount() {
    eventBus.on("userSubmit", (data) => {
      this.handleSubmit(data);
    });
    eventBus.on("userInput", (data) => {
      this.handleUserInput(data);
    });
  }

  handleSubmit(data) {
    if (this.state.win === false) {
      console.log("Sorry, looks like you lost already!");
      return;
    }

    if (this.state.win === true) {
      console.log("Sorry, looks like you won already!");
      return;
    }

    console.log("Should we have exited..?");

    let word = data.input.toLowerCase();

    if (this.isWordValid(word)) {
      var currentTurn = this.state.turn;

      this.buildGuessColors(data, currentTurn);
      this.buildGuess(data, currentTurn);

      // Without a setTimeout, rendering is interrupted
      setTimeout(this.checkForWin, 0, word, currentTurn, this);

      currentTurn += 1;
      this.setState({ turn: currentTurn });

      if (currentTurn > 5) {
        this.setState({ win: false });
      }
    } else {
      console.log("INVALID GUESS: '" + word + "'");
    }
  }

  checkForWin(word, turn, board) {
    if (word === WORD_OF_THE_DAY) {
      board.setState({ win: true });
      alert("YOU WIN! (ROUND " + (turn + 1) + ")");
      return;
    }
  }

  handleUserInput(data) {
    if (this.state.win === null) {
      let currentGuesses = [...this.state.guesses];
      let currentGuess = (data.input + "     ").substring(0, 5);

      currentGuesses[this.state.turn] = currentGuess;

      this.setState({ guesses: currentGuesses });
    }
  }

  isWordValid(word) {
    if (["cunt"].indexOf(word) !== -1) {
      alert("INVALID WORD: '" + word + "' is a potty-word, David.");
      return false;
    }

    if (word.length !== 5) {
      alert("INVALID WORD: '" + word + "' is not 5 characters long.");
      return false;
    }

    if (VALID_GUESSES.indexOf(word) === -1) {
      alert("INVALID WORD: '" + word + "' is not in list of valid words.");
      return false;
    }
    return true;
  }

  buildGuessColors(data, currentTurn) {
    let chars = data.input.toLowerCase().split("");
    let wotd_chars = WORD_OF_THE_DAY.split("");
    let remainingLetters = WORD_OF_THE_DAY.split("");

    // Initialize to default color "b"
    let guessColors = new Array(5).fill("b");
    let currentColors = [...this.state.colors];

    console.log(chars);
    console.log(wotd_chars);
    console.log(remainingLetters);
    console.log(guessColors);
    console.log(currentColors);

    //Look for matched colors
    for (let i = 0; i < 5; ++i) {
      if (chars[i] === wotd_chars[i]) {
        console.log("Exact Match!");
        guessColors[i] = "g";

        let indexToRemove = remainingLetters.indexOf(chars[i]);
        remainingLetters.splice(indexToRemove, 1);
      }
    }

    //Look for characters that are contained..
    for (let i = 0; i < 5; ++i) {
      if (guessColors[i] === "g") {
        continue;
      }

      if (remainingLetters.indexOf(chars[i]) >= 0) {
        guessColors[i] = "y";

        let indexToRemove = remainingLetters.indexOf(chars[i]);
        remainingLetters.splice(indexToRemove, 1);
      }
    }

    currentColors[currentTurn] = guessColors.join("");
    this.setState({ colors: currentColors });
  }

  buildGuess(data, currentTurn) {
    var currentGuesses = [...this.state.guesses];
    currentGuesses[currentTurn] = data.input;
    this.setState({ guesses: currentGuesses });
  }

  render() {
    return (
      <div className="Board">
        <div className={"Row " + (this.state.turn === 0 ? "active" : "")}>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[0].split("")[0])
            }
          >
            {this.state.guesses[0].split("")[0]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[0].split("")[1])
            }
          >
            {this.state.guesses[0].split("")[1]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[0].split("")[2])
            }
          >
            {this.state.guesses[0].split("")[2]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[0].split("")[3])
            }
          >
            {this.state.guesses[0].split("")[3]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[0].split("")[4])
            }
          >
            {this.state.guesses[0].split("")[4]}
          </div>
        </div>
        <div className={"Row " + (this.state.turn === 1 ? "active" : "")}>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[1].split("")[0])
            }
          >
            {this.state.guesses[1].split("")[0]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[1].split("")[1])
            }
          >
            {this.state.guesses[1].split("")[1]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[1].split("")[2])
            }
          >
            {this.state.guesses[1].split("")[2]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[1].split("")[3])
            }
          >
            {this.state.guesses[1].split("")[3]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[1].split("")[4])
            }
          >
            {this.state.guesses[1].split("")[4]}
          </div>
        </div>
        <div className={"Row " + (this.state.turn === 2 ? "active" : "")}>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[2].split("")[0])
            }
          >
            {this.state.guesses[2].split("")[0]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[2].split("")[1])
            }
          >
            {this.state.guesses[2].split("")[1]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[2].split("")[2])
            }
          >
            {this.state.guesses[2].split("")[2]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[2].split("")[3])
            }
          >
            {this.state.guesses[2].split("")[3]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[2].split("")[4])
            }
          >
            {this.state.guesses[2].split("")[4]}
          </div>
        </div>
        <div className={"Row " + (this.state.turn === 3 ? "active" : "")}>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[3].split("")[0])
            }
          >
            {this.state.guesses[3].split("")[0]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[3].split("")[1])
            }
          >
            {this.state.guesses[3].split("")[1]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[3].split("")[2])
            }
          >
            {this.state.guesses[3].split("")[2]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[3].split("")[3])
            }
          >
            {this.state.guesses[3].split("")[3]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[3].split("")[4])
            }
          >
            {this.state.guesses[3].split("")[4]}
          </div>
        </div>
        <div className={"Row " + (this.state.turn === 4 ? "active" : "")}>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[4].split("")[0])
            }
          >
            {this.state.guesses[4].split("")[0]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[4].split("")[1])
            }
          >
            {this.state.guesses[4].split("")[1]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[4].split("")[2])
            }
          >
            {this.state.guesses[4].split("")[2]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[4].split("")[3])
            }
          >
            {this.state.guesses[4].split("")[3]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[4].split("")[4])
            }
          >
            {this.state.guesses[4].split("")[4]}
          </div>
        </div>
        <div className={"Row " + (this.state.turn === 5 ? "active" : "")}>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[5].split("")[0])
            }
          >
            {this.state.guesses[5].split("")[0]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[5].split("")[1])
            }
          >
            {this.state.guesses[5].split("")[1]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[5].split("")[2])
            }
          >
            {this.state.guesses[5].split("")[2]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[5].split("")[3])
            }
          >
            {this.state.guesses[5].split("")[3]}
          </div>
          <div
            className={
              "Cell " + ("cell_color_" + this.state.colors[5].split("")[4])
            }
          >
            {this.state.guesses[5].split("")[4]}
          </div>
        </div>
      </div>
    );
  }
}

class App extends Component {
  state = {
    layoutName: "default",
    input: ""
  };

  onChange = (input) => {
    input = input.substring(0, 5);

    this.setState({ input });

    eventBus.dispatch("userInput", this.state);
  };

  onKeyPress = (button) => {
    //console.log("Button pressed", button);

    if (button === "{shift}" || button === "{lock}") this.handleShift();
    if (button === "{enter}") this.handleEnter();
  };

  handleShift = () => {
    const layoutName = this.state.layoutName;

    this.setState({
      layoutName: layoutName === "default" ? "shift" : "default"
    });
  };

  handleEnter = () => {
    eventBus.dispatch("userSubmit", this.state);
    this.setState({ input: "" });
    this.keyboard.setInput("");
  };

  onChangeInput = (event) => {
    var input = event.target.value.substring(0, 5);

    this.setState({ input });
    this.keyboard.setInput(input);

    eventBus.dispatch("userInput", { input: input });
  };

  onKeyUp = (event) => {
    if (event.key === "Enter") {
      this.handleEnter();
    }
  };

  render() {
    return (
      <div class="app-container">
        <h1>DERPLE</h1>
        <h5>Brought to you by AJCVISUAL</h5>
        <input
          value={this.state.input}
          placeholder={""}
          onChange={this.onChangeInput}
          onKeyUp={this.onKeyUp}
        />
        <Board />
        <Keyboard
          keyboardRef={(r) => (this.keyboard = r)}
          theme={"hg-theme-default hg-layout-default myTheme"}
          layoutName={this.state.layoutName}
          layout={{
            default: [
              "Q W E R T Y U I O P",
              "A S D F G H J K L {enter}",
              "Z X C V B N M {backspace}"
            ]
          }}
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
