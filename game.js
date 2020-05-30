(function($, window, undefined){

  Hangman = {
    init: function(words){
      this.guessForm = $("#guessForm"),
      this.letterButton = $("#letterButton"),
      this.letterInput = $("#letterInput"),
      this.countdown = $("#countdown"),
      this.categoryTitle = $("#category"),
      this.scoreTitle = $("#score"),
      this.restartButton = $("#restartButton"),
      this.message = $("#message"),
      this.guess = $("#guess"),
      this.wrong = $("#wrong"),
      this.rightGuesses = [],
      this.wrongGuesses = [],
      this.words = words,
      this.category = "",
      this.score = 0,
      this.remainingLetters = 0,
      this.word = "",
      this.remainingTime = 0,
      this.tryNumber = 0,
      this.goodSound = new Audio("http://freesoundeffect.net/sites/default/files/correct-answer-12-sound-effect-74618531.mp3");
      this.chalkSound = new Audio("http://freesoundeffect.net/sites/default/files/chalk-swipe-sound-effect-58413697.mp3"),
      this.clapSound = new Audio("http://freesoundeffect.net/sites/default/files/applause-and-low-calls-small-interior-crowd-6-sound-effect-48806763.mp3");
      this.setup();
    },

    setup: function(){
      this.category = this.randomCategory();
      this.word = this.randomWord();
      this.message.text("");
      this.guessForm.on("submit", $.proxy(this.checkLetter, this));
      this.restartButton.on("click", $.proxy(this.restart, this));
      this.setTimer(1,0);
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
      this.remainingTime = seconds + minutes*60;
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      countdown.text(minutes + ":" + seconds);
      if (distance < 0) {
        countdown.text("00:00");
        this.gameOver();
      }
    },

    randomCategory: function() {
      var categoryList = Object.keys(this.words);
      var rank = Math.floor(Math.random() * categoryList.length);
      var category = (categoryList[rank]);
      this.categoryTitle.text(category);
      return category;
    },

    randomWord: function(){
      var category = this.category;
      var categoryWords = this.words[category];
      var word = (categoryWords[Math.floor(Math.random() * categoryWords.length)]).toLowerCase();
      this.remainingLetters = word.length;
      this._wordLine(word);
      return word;
    },

    _wordLine: function(word) {
      for (var i = 0; i < word.length; i++) {
        if (word[i]==" " || word[i]=="-") {
          this.rightGuesses[i] = "-";
          this.remainingLetters -= 1;
        } else {
          this.rightGuesses[i] = "_";
        }
      }
      this.guess.text(this.rightGuesses.join(" "));
    },

    checkLetter: function (form) {
      form.preventDefault();    //Empêche le rechargement de la page lorsque le formulaire est soumis
      var letter = this.letterInput.val().toLowerCase();
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
      this["goodSound"].play();
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
      this["chalkSound"].play();
      var imageID = "#hangman_" + wrongGuesses.length;
      $(imageID).css('visibility', 'visible');
      $(imageID).addClass('animation');
      if (wrongGuesses.length==11) {      //Pendu dessiné en entier
        this.gameOver();
      }
    },

    gameWon: function() {
      this.message.text("You won!");
      this["clapSound"].play();
      this.scoreCount();
      this.gameEnd();
    },

    gameOver: function() {
      var word = this.word;
      var rightGuesses = this.rightGuesses;
      var guess = this.guess;
      for (var i = 0; i < word.length; i++) {   //Affichage du mot
        rightGuesses[i] = word[i];
      };
      this.message.text("You lost...");
      guess.text(rightGuesses.join(" "));
      this.score = 0;
      this.gameEnd();
    },

    gameEnd: function() {
      clearInterval(x);   //Stop du chrono
      this.letterInput.css('visibility', 'hidden');
      this.letterButton.css('visibility', 'hidden');
      this.restartButton.css('visibility', 'visible');  
      this.restartButton.prop('disabled', false);    
    },

    scoreCount: function() {
      var tryNumber = this.tryNumber;
      var wrong = this.wrongGuesses.length;
      var right = tryNumber - wrong;
      var time = this.remainingTime;
      var score = time*5 + right*5 - wrong*5;
      console.log(time);
      console.log(right);
      console.log(wrong);
      if (score < 0) {
        score = 0;
      }
      var total = this.score + score;
      this.scoreTitle.text(total + " pts");
      this.score = total;
    },

    restart: function(e) {
      this.letterInput.css('visibility', 'visible');
      this.letterInput.focus();
      this.letterButton.css('visibility', 'visible');
      this.restartButton.css('visibility', 'hidden');
      this.restartButton.prop('disabled', true);
      this.wrong.text("");
    }
  
  };

  var capital = ['Dublin', 'Tokyo', 'Pretoria', 'Mbabane", "Lisbon', 'Washington DC', 'Edinburgh', 'Paris', 'Madrid', 'Reykjavik', 'Athens', 'Moscow', 'Seoul', 'Beijing', 'London', 'Islamabad', 'Istanbul', 'New Delhi', 'Mexico city', 'Brazilia', 'Nouakchott', 'Bogota', 'Abu Dhabi', 'Oslo', 'Stockholm', 'Helsinki', 'Amsterdam', 'Niamey', 'Suva', 'Yerevan', 'Riyadh', 'Skopje', 'Vienna', 'Victoria', 'Dunkirk', 'Brussels', 'Minsk', 'Kyiv', 'Buenos Aires', 'Canberra', 'Wellington', 'Kingston', 'Ottawa', 'Nassau', 'Pyongyang', 'Hanoi', 'Kuala Lumpur', 'Bangkok', 'Kathmandu', 'Brazzaville', 'Lusaka', 'Tehran', 'Doha', 'Conakry', 'Georgetown', 'La Paz', 'Freetown', 'Kinshasa', 'Antananarivo', 'Vientiane', 'Palikir', 'Yamoussoukro', 'Yaounde', 'Bangui', 'Dodoma', 'Addis Ababa', 'Mogadishu', 'Quito', 'Lima', 'Manama', 'San Salvador', 'Budapest', 'Praha', 'Bucharest', 'Lilongwe'];
  var sport = ['tennis', 'fencing', 'badminton', 'dance', 'gymnastics', 'football', 'baseball', 'basketball', 'handball', 'rugby', 'ice hockey', 'golf', 'curling', 'judo', 'karate', 'taekwondo', 'kung fu', 'yoga', 'archery', 'cycling', 'rafting', 'polo', 'lacross', 'hurling', 'parkour', 'volleyball', 'cricket', 'snowboarding', 'surfin', 'ski', 'bobsleigh', 'climbing', 'jujutsu', 'wrestling', 'sumo', 'cross country', 'horse racing', 'equitation', 'rodeo', 'frisbee', 'ultimate', 'trapeze', 'trampoline', 'ice skating', 'kitesurk', 'endurance', 'sailing', 'marathon', 'hiking', 'shooting', 'canoeing', 'kayaking', 'crossfit', 'weightlifting'];
  var internet = ["chrome", "firefox", "codepen", "javascript", "jquery", "twitter", "github", "wordpress", "opera", "sass", "layout", "standards", "semantic", "designer", "developer", "module", "component", "website", "creative", "banner", "browser", "screen", "mobile", "footer", "header", "typography", "responsive", "programmer", "css", "border", "compass", "grunt", "pixel", "document", "object", "ruby", "modernizr", "bootstrap", "python", "php", "pattern", "ajax", "node", "element", "android", "application", "adobe", "apple", "google", "microsoft", "bookmark", "internet", "icon", "svg", "background", "property", "syntax", "flash", "html", "font", "blog", "network", "server", "content", "database", "socket", "function", "variable", "link", "apache", "query", "proxy", "backbone", "angular", "email", "underscore", "cloud"];
  var food = ["banana", "apple", "pear", "cherry", "steak", "mango", "pineapple", "chips", "sugar", "coke", "water", "cucumber", "zucchini", "pumpkin", "chocolate cake", "tea", "coffee", "milk", "capuccino", "salt", "pepper", "honey", "chicken", "turkey", "crumble", "apple pie", "beans", "lettuce", "corn", "garlic", "celery", "peanut", "artichoke", "aspargus", "leef", "chili pepper", "lemon", "mushroom", "turnip", "green bean", "croissant", "bread", "salmon", "tuna fish", "hamburger", "hot dog", "pancake", "cheeseburger", "french fries", "bagel", "muffin", "cookie", "blackberry", "pizza", "tiramisu", "gnocchi", "oil", "butter", "mozzarella", "pickle", "yogurt", "ice cream", "cornflakes", "snadwich", "egg", "biscuit", "sausage", "raspberry", "jam", "ham", "cheese", "sour cream", "kebab", "mussle", "sushi", "burrito", "baguette", "bacon", "noodle", "bretzel", "pudding", "whisky"];
  var animal = ["horse", "cat", "turtle", "bird", "rabbit", "dog", "monkey", "donkey", "calf", "rooster", "turkey", "sheep", "shark", "chick", "hen", "bull", "lemur", "mountain goat", "camel", "caribou", "hedgehog", "dragonfly", "seahorse", "butterfly", "elephant", "snail", "tortoise", "fox", "bat", "frog", "wild rabbit", "duck", "spider", "goose", "kangaroo", "koala", "fly", "mosquito", "wolf", "elk", "squirell", "chimpanzee", "coyote", "blue whale", "raccoon", "dolphin", "panda", "ostrich", "zebra", "crow", "magpie", "octopus", "owl", "mole", "deer", "ox", "walrus", "mouse", "eel", "sturgeon", "anchovy", "clownfish", "carp", "barracuda", "squid", "jellyfish", "hammer fish", "lizard", "cheetah", "hyena", "bison", "falcon", "beaver", "mockingbird", "hummingbird", "oyster", "okapi", "woodpecker", "lynx", "marten", "orangutan"];
  var country = ["france", "united kingdom", "spain", "yemen", "uruguay", "qatar", "finland", "sweden", "switzerland", "germany", "japan", "jamaica", "brazil", "togo", "bangladesh", "new zealand", "fiji", "suva", "norway", "cyprus", "turkey", "uzbekistan", "afghanistan", "guatemala", "ecuador", "russia", "mexico", "italy", "poland", "belarus", "latvia", "lithuania", "estonia", "mali", "botswana", "rwanda", "south africa", "namibia", "kenya", "australia", "papua new guinea", "samoa", "senegal", "czech republic", "portugal", "nicaragua", "belize", "taiwan", "south korea", "thailand", "vietnam", "greece", "sierra leone", "benin", "uganda", "colombia", "peru", "chile", "austria", "luxembourg", "liechtenstein", "india", "sri lanka", "nepal", "malaysia", "oman", "saudi arabia", "ukraine", "bhutan", "laos", "chad", "djibouti", "venezuela", "niger", "croatia"];
  var words = {capital:capital, sport:sport, internet:internet, food:food, animal:animal, country:country};

  Hangman.init(words);
  
})(jQuery, window);