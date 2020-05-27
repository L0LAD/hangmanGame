//Initialisation des paramètres du jeu
var guessForm = $("#guessForm");
var guessLetter = $("#guessLetter");
var guessButton = $("#guessButton");
var guessWord = $("#guessWord");
var countdown = $("#countdown");
var words = ["africa","snake","canyon","truck","hangman","website","clock","wagon","palmtree","headphone","donkey","pancake","amazing","wonderful","handkerchief","thief","banana"];
var word = words[Math.floor(Math.random() * words.length)];
var remainingLetters = word.length;
var wrongLetters = $("#wrongLetters");
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
	

	//Minuteur limitant le temps de jeu de chaque partie
	/*var duration = 2*60*1000;*/
	var duration = 5000;
	var countDownDate = new Date().getTime() + duration;
	var x = setInterval(function() {
		var now = new Date().getTime();
		var distance = countDownDate - now;
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		this.countdown.text(minutes + ":" + seconds);
		if (distance < 0) {
			timeUp();
		}
	}, 1000);

	function timeUp () {
		clearInterval(x);
		this.countdown.text("00:00");
		this.guessLetter.attr("disabled","disabled");
		this.guessButton.attr("disabled","disabled");
		for (var i = 0; i < word.length; i++) {
			answerArray[i] = word[i];
		};
		this.guessWord.text(answerArray.join(" "));
		alert("Time's up!");
	}

}

function checkLetter (form) {
	form.preventDefault();
	var letter = this.guessLetter.val();
	if (letter.length == 1) {
		if (word.includes(letter) && $.inArray(letter,answerArray)) {		//Lettre correcte pas encore proposée
			for (var i = 0; i < word.length; i++) {
				if (word[i] == letter) {
					answerArray[i] = letter;
					this.guessWord.text(answerArray.join(" "));
					remainingLetters--;
				}
			};
			if (remainingLetters == 0) {
				alert("CONGRATS! You've won!");
			}
		} else if ($.inArray(letter,wrongArray) < 0) {		//Mauvaise lettre pas encore proposée
			wrongArray.push(letter);
			this.wrongLetters.text(wrongArray.join(" "));
		}
	}
	this.guessLetter.val("").focus();
}