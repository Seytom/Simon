
$(document).ready(function(){

  //Variables used by more than one function
  var playerInput = [];  //arrays for patterns
  var computerPattern = [];
  var colors = ["green", "red", "yellow", "blue"]; 
  var playerTurn = false;
  var counter = 0;
  var playerCounter = 0;
  var strict = false;
  var brightTime = 1000;
  var dimTime = 700;

  $('#new_game').click(newGame);
  $('#strict_mode').click(strictMode);

  /*----HELPER FUNCTION TO DISPLAY THE COMPUTER PATTERN----*/
  function showPattern() {
    console.log("Entering showPattern");

    console.log("starting setInterval");
    var thisTime;

    thisTime = setInterval(function() {
      var tempName = "#" + computerPattern[counter];
      $("#compCount").html("Steps: " + computerPattern.length);
        console.log("brightening");
        $(tempName).addClass("brighten");
        //The following block quickens the pace of the computer pattern as the game moves further along
        switch(counter){
          case 5:
            brightTime=800;
            dimTime=500;
          case 9:
            brightTime=600;
            dimTime=300;
          case 13:
            brightTime=500;
            dimTime=200;
        } 


        var tempTone = computerPattern[counter]+"Sound";
        console.log("playing tone for comp color, "+tempTone); 
        playSound(tempTone); //play the tone associated with the selected color--the ids of the elements with the tones are the color names with "Sound" appended.

        console.log("calling setTimeout for dimming");
        setTimeout(function() {
          console.log("dimming");
         $(tempName).removeClass("brighten");
          //stop setInterval function once sequence has been displayed
         
          
        }, dimTime);
        if (counter === computerPattern.length) {
            clearInterval(thisTime);                    
            playerTurn=true;
            $("#message").html("Try to match the pattern");
            console.log("finished with display, returning to setInterval");
            return;
        }
        if(playerTurn===true) {
          console.log("back in setTimeout, going back to setInterval");
            return;
        }
        console.log("increasing counter");
        counter++;
        
      }, brightTime);

    console.log("End of showPattern. Returning to compPatFun.");
  }

  /*---COMPUTER PATTERN FUNCTION---*/
  function compPatFun() {
    console.log("compPatFun launched!!!");
      //Select new color for the computer color sequence and add to the array
    if(playerTurn===true){
      $("#message").html("Try to match the pattern");
      console.log("It's player's turn, going back from where we came");
      return;
    }
    playerInput = [];//Clear player input from earlier pattern matches
    console.log("playerInput cleared");
    var number =  Math.floor(Math.random() * 4);
    console.log("number: "+number);  
    var newColor = colors[number];
    
    console.log("computer chose " + newColor);

    computerPattern.push(newColor);
    console.log(newColor+ " added to computerPattern");
    

    //Display the sequence for the player to match      
    console.log("calling showPattern from compPatFun");
    showPattern();
    console.log("back in compPatFun from showPattern call");
    
    console.log("compPatFun finished. After display is finished, player should match this pattern: " + computerPattern);
    }
    

  /*---PLAYER INPUT FUNCTION---*/

    $('.shape').click( function() {
      console.log("playerInput function started");
      if (playerTurn===false) {
        $("#message").html("please wait your turn...");
        console.log("not player's turn, should return...to event loop, I think");
        return;
      }
      $("#message").html("");
      var color = $(this).attr("id");
      var tone = color+"Sound"; 
      playSound(tone); //play the tone associated with the selected color.
      console.log("player chose "+color);   
      playerInput.push(color);
      console.log("computer pattern: " +computerPattern);
      console.log("player pattern: "+playerInput);
      var colorID = "#" + color;    
      if (playerInput[playerCounter] !== computerPattern[playerCounter]) {
        
        playSound("oops");
        $(".shape").addClass("brighten");
        
        console.log("no match. calling timeout function for failure function");
          setTimeout(function() {
            $('.shape').removeClass('brighten');
            
            console.log("finished with failure timeout");
            counter=0;
            playerCounter=0;
            playerTurn=false;
            playerInput=[];

            (strict) ? newGame() : showPattern();

          }, 1500);
        $("#message").html("Watch the pattern and try again");
        console.log("finished with playerInput, now leaving");
        playerTurn=true;
        return;
      }
      console.log("brightening " +colorID);
      $(colorID).addClass('brighten');
      
      setTimeout(function() {
        console.log("setTimeout called for removing brightening");
        $(colorID).removeClass('brighten');
        if (playerCounter === counter) {
          counter = 0;  //Reset the counters and the player turn flag, because the pattern has been successfully matched
          
          playerCounter = 0;
          
          playerTurn = false;
          console.log("calling compPatFun");
          compPatFun();
          console.log('back in playerInput, returning from compPatFun');
          console.log("leaving setTimeout");
          return;
        };  
      }, 400);
      playerCounter++;
      console.log("playerCounter increased to "+playerCounter);
      
    console.log("all done with playerInput function");  
    });
    
    
    
    

    /*---NEW GAME FUNCTION---*/
    function newGame() {
      
      console.log("new game");
      //$("#message").html("New Game!");
      playerInput = [];
      playerTurn = false;
      computerPattern = [];
      counter = 0;
      brightTime = 1000;
      dimTime = 700;
      $("#compCount").html("Steps: " + counter);
      playerCounter = 0;
      
      compPatFun();
    }

   /*---STRICT MODE FUNCTION---*/
    function strictMode() {
      
      console.log("strictMode");
      (strict) ? strict=false:strict=true;
      if(strict){
        $("#message").html("Strict Mode On!");
        $("#strict_mode").html("Turn Strict Mode Off");
      }
      else {
        $("#message").html("Strict Mode Off");
        $("#strict_mode").html("Turn Strict Mode On");
      }     
      newGame();
    } 

   /*---PLAY TONE FUNCTION---*/
    function playSound(soundobj) {
      
      var thisSound=document.getElementById(soundobj);
      if(thisSound){
        thisSound.play();
      }
    }

});