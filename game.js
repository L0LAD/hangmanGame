//Initialisation des paramètres du jeu
var guessForm = $(".guessForm");
var guessLetter = $(".guessLetter");
var guessWord = $(".guessWord");
var words = ["africa","snake","canyon","truck","hangman","website","clock","wagon","palmtree","headphone","donkey","pancake","amazing","wonderful","handkerchief","thief","banana"];
var word = words[Math.floor(Math.random() * words.length)];
var remainingLetters = word.length;
var wrongLetters = $(".wrongLetters");
var wrongArray = [];
console.log(word);
this.setup();

//Affichage de la progression
var answerArray = [];
for (var i = 0; i < word.length; i++) {
	answerArray[i] = "_";
}
this.guessWord.text(answerArray.join(" "));

function setup () {
	this.guessForm.on("submit", $.proxy(this.checkLetter, this));
}

function checkLetter (form) {
	form.preventDefault();
	var letter = this.guessLetter.val();
	if (letter.length == 1) {
		if (word.includes(letter)) {
			for (var i = 0; i < word.length; i++) {
				if (word[i] == letter) {
					answerArray[i] = letter;
					this.guessWord.text(answerArray.join(" "));
					remainingLetters--;
				}
			};
			console.log(remainingLetters);
			if (remainingLetters == 0) {
				alert("CONGRATS! You've won!");
			}
		} else {
			wrongArray.push(letter);
			this.wrongLetters.text(wrongArray.join(" "));
		}
	}
	this.guessLetter.val("").focus();
}

