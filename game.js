(function($, window, undefined){

  Hangman = {
    init: function(words){
      this.guessForm = $(".guessForm"),
      this.letterButton = $("#letterButton"),
      this.letterInput = $("#letterInput"),
      this.countdown = $("#countdown");
      this.guess = $("#guess"),
      this.wrong = $("#wrong"),
      this.rightGuesses = [],
      this.wrongGuesses = [],
      this.words = words,
      this.wordData = this.randomWord(),
      this.score = 0,
      this.setup();
    },

    setup: function(){
      this.guessForm.on("submit", $.proxy(this.checkLetter, this));
      this.timer(0,5);
    },

    timer: function(min,sec){
      //Minuteur limitant le temps de jeu de chaque partie
      var countdown = this.countdown;
      var letterInput = this.letterInput;
      var letterButton = this.letterButton;
      var word = this.wordData.word;
      var guess = this.guess;
      var rightGuesses = this.rightGuesses;
      var duration = 1000*(min*60+sec);
      var countDownDate = new Date().getTime() + duration;
      var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdown.text(minutes + ":" + seconds);
        if (distance < 0) {
          clearInterval(x);
          countdown.text("00:00");
          letterInput.attr("disabled","disabled");
          letterButton.attr("disabled","disabled");
          for (var i = 0; i < word.length; i++) {
            rightGuesses[i] = word[i];
          };
          guess.text(rightGuesses.join(" "));
          alert("Time's up!");
        }
      }, 1000);
    },

    randomWord: function(){
      var wordData = this._wordData(this.words[Math.floor(Math.random() * this.words.length)]);
      this._wordLine(wordData.word);
      return wordData;
    },

    _wordData: function(word){
      return {
        letters: this._letters(word),
        word: word.toLowerCase(),
        totalLetters: word.length
      };
    },

    _letters: function(word){
      var letters = [];
      for(var i=0; i<word.length; i++){
        letters.push({
          letter: word[i],
          pos: i
        });
      }
      return letters;
    },

    _wordLine: function(word) {
      for (var i = 0; i < word.length; i++) {
        this.rightGuesses[i] = "_";
      }
      this.guess.text(this.rightGuesses.join(" "));
    }
  
  };

  var words = ["chrome", "firefox", "codepen", "javascript", "jquery", "twitter", "github", "wordpress", "opera", "sass", "layout", "standards", "semantic", "designer", "developer", "module", "component", "website", "creative", "banner", "browser", "screen", "mobile", "footer", "header", "typography", "responsive", "programmer", "css", "border", "compass", "grunt", "pixel", "document", "object", "ruby", "modernizr", "bootstrap", "python", "php", "pattern", "ajax", "node", "element", "android", "application", "adobe", "apple", "google", "microsoft", "bookmark", "internet", "icon", "svg", "background", "property", "syntax", "flash", "html", "font", "blog", "network", "server", "content", "database", "socket", "function", "variable", "link", "apache", "query", "proxy", "backbone", "angular", "email", "underscore", "cloud"];

  Hangman.init(words);
  
})(jQuery, window);