var words = ["africa","snake","canyon","truck","hangman","website","clock","wagon","palmtree","headphone","donkey","pancake","amazing","wonderful","handkerchief","thief","banana"];
var word = words[Math.floor(Math.random() * words.length)];
var answerArray = [];
for (var i = 0; i < word.length; i++) {
	answerArray[i] = "_";
}
var remainingLetters = word.length;
console.log(word);
console.log(answerArray);

$(".guessWord").text(answerArray.join(" "));