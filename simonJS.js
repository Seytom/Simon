
$(document).ready(function(){

  //Variables used by more than one function
  var playerInput = [];  //arrays for patterns
  var computerPattern = [];
  var colors = ["green", "red", "yellow", "blue"]; 
  var playerTurn = false;
  var counter = 0;
  var playerCounter = 0;
  var strict = false;
  var victory =20;  //set the number of steps to match for victory
  var brightTime = 1000;
  var dimTime = 700;

  $('#new_game').click(newGame);
  $('#strict_mode').click(strictMode);

  /*----HELPER FUNCTION TO DISPLAY THE COMPUTER PATTERN----*/
  function showPattern() {    
    var thisTime; //variable for naming the setInterval function at the heart of the function
    counter=0; //reset relevant variables
    playerCounter=0;
    playerInput=[];

    /* This subfunction displays the computer pattern at a set interval, brightening and dimming (in another subfunction) the colors appropriately */
    thisTime = setInterval(function() {
      $("#compCount").html("Steps: " + computerPattern.length);//displays the number of steps in the pattern

      //these two lines brighten the appropriate color of the computer pattern
      var tempName = "#" + computerPattern[counter];        
      $(tempName).addClass("brighten");

      //The following switch block quickens the display of the computer pattern as the game proceeds
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

        //call to function which plays the tone associated with the selected color--the ids are the color names with "Sound" appended.
        var tempTone = computerPattern[counter]+"Sound";       
        playSound(tempTone); 

        //This subfunction dims the color that was just brightened
        setTimeout(function() {          
         $(tempName).removeClass("brighten");    
        }, dimTime);  //End of subfunction setTimeout

        //check to see if end of pattern has been reached. If so, set playerTurn flag to true, stop the "thisTime" interval and reset the variables
        if (counter === computerPattern.length) {            
            clearInterval(thisTime);                    
            playerTurn=true;
            $("#message").html("Try to match the pattern");
            return;
        }
        if(playerTurn===true) {
          console.log("back in setTimeout, going back to setInterval");
            return;
        }
        //after each interval of thisTime, increase the counter
        counter++;
        
      }, brightTime); // End of subfunction thisTime 

  }  // End of function showPattern

  /*---COMPUTER PATTERN FUNCTION---*/  
  function compPatFun() {    
    
    if(playerTurn===true){      
      return;
    }
    playerInput = [];//Clear player input from earlier pattern matches
    //Select new color for the computer color sequence and add to the array
    var number =  Math.floor(Math.random() * 4);      
    var newColor = colors[number];
    computerPattern.push(newColor);
    
    //Display the sequence for the player to match       
    showPattern();       
    
  } //End of compPatFun    

/*---PLAYER INPUT FUNCTION---*/
  $('.shape').click( function() {
    
    if (playerTurn===false) {
      $("#message").html("please wait your turn...");        
      return;
    }
    
    var color = $(this).attr("id"); //store color clicked on by user
    var tone = color+"Sound"; 
    playSound(tone); //play the tone associated with the selected color.         
    playerInput.push(color); //add to the player's array
    
    var colorID = "#" + color; 
    $(colorID).addClass('brighten'); //brighten the selected color


    //the following conditional block handles any failure by the user to match the computer pattern   
    if (playerInput[playerCounter] !== computerPattern[playerCounter]) {        
      playSound("oops"); //plays the error tone
      $(".shape").addClass("brighten"); //brightens all four colors simultaneously        
     
      setTimeout(function() {
        //This setTimeout removes brightening and directs the program depending on whether strict mode is in effect
        $('.shape').removeClass('brighten');
        playerTurn=false;          

        (strict) ? newGame() : showPattern(); //if strict mode is chosen, start a new game upon an error. Otherwise, show the pattern again
        }, 2500); //End of setTimeout function               
      playerTurn=true;
      return; //exit from player input function
    }      
    
    setTimeout(function() { 
    //this function dims the color and determines if the pattern has been matched      
      $(colorID).removeClass('brighten');
      if (playerCounter === counter) {
        //pattern has been matched          
        playerTurn = false;          
        if (playerCounter === victory) { 
          //if playerCounter equals the number of steps set in the victory variable, notify of victory, start a new game two seconds later (to give time to read the notice)
          $("#message").html("You won! Great job!!");
          setTimeout(function(){ newGame();}, 2000);
        }
        else{
          compPatFun();
        }             
      };  
    }, 400);
    playerCounter++;
    
  });  // end of player input function   
    

  /*---NEW GAME FUNCTION---*/
  function newGame() {
    $("#message").html("New Game!");
    //initialize variables
    playerTurn = false;
    playerInput = [];      
    computerPattern = [];
    counter = 0;
    playerCounter = 0;
    brightTime = 1000;
    dimTime = 700;
    $("#compCount").html("Steps: " + counter);      
    
    compPatFun();//starts actual game play
  }

 /*---STRICT MODE FUNCTION---*/
  function strictMode() {    
    (strict) ? strict=false:strict=true; //this line toggles the value of strict between true and false
    if(strict){        
      $("#strict_mode").html("Turn Strict Mode Off");
    }
    else {        
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
});  //End of document.ready function