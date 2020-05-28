(function($, window, undefined){

  Hangman = {
    init: function(words){
      this.guessForm = $("#guessForm"),
      this.letterButton = $("#letterButton"),
      this.letterInput = $("#letterInput"),
      this.countdown = $("#countdown");
      this.score = $("#score");
      this.guess = $("#guess"),
      this.wrong = $("#wrong"),
      this.rightGuesses = [],
      this.wrongGuesses = [],
      this.words = words,
      this.word = this.randomWord(),
      this.remainingLetters = this.word.length;
      this.remainingTime = 0;
      this.tryNumber = 0;
      this.setup();
    },

    setup: function(){
      this.guessForm.on("submit", $.proxy(this.checkLetter, this));
      this.setTimer(0,10);
    },

    setTimer: function(min,sec){
      var duration = 1000*(min*60+sec);
      var countDownDate = new Date().getTime() + duration;
      x = setInterval(() => this.runTimer(countDownDate), 1000);
    },

    runTimer: function(countDownDate) {
      var countdown = this.countdown;
      var word = this.word;
      var guess = this.guess;
      var rightGuesses = this.rightGuesses;
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.remainingTime = seconds;
      countdown.text(minutes + ":" + seconds);
      if (distance < 0) {
        this.gameOver();
        alert("Time's up!");
      }
    },

    randomWord: function(){
      var word = (this.words[Math.floor(Math.random() * this.words.length)]).toLowerCase();
      console.log(word);
      this._wordLine(word);
      return word;
    },

    _wordLine: function(word) {
      for (var i = 0; i < word.length; i++) {
        this.rightGuesses[i] = "_";
      }
      this.guess.text(this.rightGuesses.join(" "));
    },

    checkLetter: function (form) {
      form.preventDefault();    //Empêche le rechargement de la page lorsque le formulaire est soumis
      var letter = this.letterInput.val();
      var word = this.word;
      var rightGuesses = this.rightGuesses;
      var wrongGuesses = this.wrongGuesses;
      if (letter.length == 1) {
        if ($.inArray(letter,rightGuesses)<0 && $.inArray(letter,wrongGuesses)<0) {     //Lettre pas encore proposée
          this.tryNumber++;
          if (word.includes(letter)) {   //Lettre correcte
            this.rightGuess(letter);
          } else {    //Mauvaise lettre
            this.wrongGuess(letter);
          }
        }        
      }
      this.letterInput.val("").focus();
    },

    rightGuess: function(letter) {
      var word = this.word;
      var rightGuesses = this.rightGuesses;
      for (var i = 0; i < word.length; i++) {
        if (word[i] == letter) {
          rightGuesses[i] = letter;
          this.guess.text(rightGuesses.join(" "));
          this.remainingLetters--;
        }
      };
      if (this.remainingLetters == 0) {     //Mot entier deviné
        this.gameWon();
      }
    },

    wrongGuess: function(letter) {
      var wrongGuesses = this.wrongGuesses;
      wrongGuesses.push(letter);
      this.wrong.text(wrongGuesses.join(" "));
      if (wrongGuesses.length==11) {      //Pendu dessiné en entier
        alert("YOU LOST!");
        this.gameOver();
      }
    },

    gameWon: function() {
      clearInterval(x);   //Stop du chrono
      alert("CONGRATS! You've won!");
      this.scoreCount();
    },

    gameOver: function() {
      this.letterInput.attr("disabled","disabled");
      this.letterButton.attr("disabled","disabled");
      var word = this.word;
      var rightGuesses = this.rightGuesses;
      var guess = this.guess;
      for (var i = 0; i < word.length; i++) {   //Affichage du mot
        rightGuesses[i] = word[i];
      };
      guess.text(rightGuesses.join(" "));
      this.scoreCount();
    },

    scoreCount: function() {
      var tryNumber = this.tryNumber;
      var wrong = this.wrongGuesses.length;
      var right = tryNumber - wrong;
      var time = this.remainingTime;
      var result = time*5 + right*5 - wrong*5;
      this.score.text(result + " pts");
    }
  
  };

  var words = ["chrome", "firefox", "codepen", "javascript", "jquery", "twitter", "github", "wordpress", "opera", "sass", "layout", "standards", "semantic", "designer", "developer", "module", "component", "website", "creative", "banner", "browser", "screen", "mobile", "footer", "header", "typography", "responsive", "programmer", "css", "border", "compass", "grunt", "pixel", "document", "object", "ruby", "modernizr", "bootstrap", "python", "php", "pattern", "ajax", "node", "element", "android", "application", "adobe", "apple", "google", "microsoft", "bookmark", "internet", "icon", "svg", "background", "property", "syntax", "flash", "html", "font", "blog", "network", "server", "content", "database", "socket", "function", "variable", "link", "apache", "query", "proxy", "backbone", "angular", "email", "underscore", "cloud"];

  Hangman.init(words);
  
})(jQuery, window);