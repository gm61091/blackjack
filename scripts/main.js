
var suits = ['hearts', 'diamonds', 'clubs', 'spades'];

var ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13' ];

var deck = [];

// for (var suitCounter = 0; suitCounter < 4; suitCounter++){

// for (var rankCounter = 0; rankCounter < 13; rankCounter++){
//     deck.push(ranks[rankCounter] + suits[suitCounter]);
// }
// }
// console.log(deck);


function shuffleDeck(deck) {
    for(var i = deck.length - 1; i < 0; i--) {
        var tempCard = deck[i];
        var randomIndex = Math.floor(Math.random() * (i + 1));
        deck[i] = deck[randomIndex]; 
        deck[randomIndex] = tempCard;
    }
}


//what do I want to do?
//1 create empty arrays for playerHand, dealerHand, deck, we will asign values later through functions
//2 create the rank and the suit

//grab page elements and create variables
let playerH = [];
let dealerH = [];

let mainDeck; //this will be for all cards
let card; //this will have a rank, suit and image {rank:"", suit:"", img:"", points:""}//array of objects
let rank = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let suit = ["clubs", "diamonds", "hearts", "spades"];
let dealerHand = document.getElementById("dealer-hand"); //triger dealer's container
let playerHand = document.getElementById("player-hand"); //triger player's container
let buttons = document.querySelector(".buttons"); //triger deal/hit/stand/replay
console.log(buttons + "buttons")

var testDeck = buildDeck();
shuffleDeck(testDeck);
console.log(testDeck);

//build deck of cards function
// use `images/${rank[i]}_of_${suit[j]}.png` for the image
//this will create the 52 cards
//use if statement to asign the points

function buildDeck() {
    for (i = 0; i < rank.length; i++) { //go through [2, 3, 4, 5, 6, 7, 8, 9, 10, "ace", "jack", "king", "queen"];
        for (j = 0; j < suit.length; j++) { //loop through ["clubs", "diamonds", "hearts", "spades"];
            card = { rank: rank[i], suit: suit[j], img: `images/${rank[i]}_of_${suit[j]}.png` }; //append to card = {rank:"", suit:"", img:""}
            if (card.rank >= 2 && card.rank <= 10) { //give points for the card with numbers 2, 3, 4, 5, 6, 7, 8, 9, 10,
                card.points = card.rank; //will add points to card array
            }
            else if (card.rank === 11 || card.rank === 12 || card.rank === 13){ // in case "jack", "king", "queen"
                card.points = 10; //give 10 points for jack,king and queen
            } else {
                card.points = 1; //if Ace
                card.altPoints = 11; //if Ace
            }
            deck.push(card); //push the card to the deck []
        }
    }
    return deck;
}


//shuffles deck, returns shuffled deck
//rank = [2, 3, 4, 5, 6, 7, 8, 9, 10, "ace", "jack", "king", "queen"];
//suit = ["clubs", "diamonds", "hearts", "spades"];

//Math.random() returns a random number between 0(inclusive), and 1(exclusive)
//The Math.floor() function returns the largest integer less than or equal to a given number. 
function shuffle(array) { //will invoke this function for deck1, deck2, deck3, deck4
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//mix them all //create decks, shuffle and push into mainDeck. concat() method used to merge two or more arrays
let deck1 = buildDeck();
shuffle(deck1);
let deck2 = buildDeck();
shuffle(deck2);
let deck3 = buildDeck();
shuffle(deck3);
let deck4 = buildDeck();
shuffle(deck4);
mainDeck = deck1.concat(deck2, deck3, deck4);
console.log(mainDeck)

//calculates non ace points. callback for totalPoints, returns points
//The reduce() method returns a single value: the function's accumulated result, will not change the original array.
let initialPoints = function initialPoints(hand) {
    let points = hand.reduce((accumlator, current) => {
        if (current.rank != "1") {
            accumlator += current.points;
            return accumlator;
        } else {
            accumlator += 0;
            return accumlator;
        }
    }, 0);
    return points;
}

//takes initialPoints as an argument and calculates total points (with aces),returns points with aces added high or low
// The some() method tests whether at least one element in the array passes the test implemented by the provided function. 
let totalPoints = function totalPoints(baseFn, hand) {
    let points = baseFn(hand);
    if (hand.some(card => card.rank === 1) && points <= 10) {
        points += 11;
        //console.log("ace = 11",points)
        return points;

    } else if (hand.some(card => card.rank === 1) && points > 10) {
        points += 1;
        //console.log("ace = 1",points)
        return points;
    } else {
        //console.log("there is no ace",points)
        return points;
    }
}

//create event listeners
buttons.addEventListener("click", (e) => { //listen for the click
    console.log("listener")
    if (e.target.innerText === "Deal") { 
        console.log("buttonclicked") ///when deal is pressed
        deal(2, mainDeck); //call deal function, give 2 card from mainDeck
        let dealerPoints = totalPoints(initialPoints, dealerH);
        let playerPoints = totalPoints(initialPoints, playerH);
        displayPoints(playerPoints);
        playerBust(playerPoints, dealerPoints);
    }
    else if (e.target.innerText === "Hit") { //when hit is pressed
        hit(mainDeck);
        let dealerPoints = totalPoints(initialPoints, dealerH);
        let playerPoints = totalPoints(initialPoints, playerH);
        displayPoints(playerPoints);
        playerBust(playerPoints, dealerPoints);
    }
    else if (e.target.innerText === "Stand") {
        let dealerPoints = totalPoints(initialPoints, dealerH);
        let playerPoints = totalPoints(initialPoints, playerH);
        let y = stand(mainDeck, dealerPoints);
        displayPoints(playerPoints, y);
        isWinner(playerPoints, y);
    }
    else if (e.target.innerText === "Replay") {
        location.reload(); ///The location reload() method in HTML DOM is used to reload the current document.
    }
})

//create functions


//deals the cards,renders images// num will be 2// deckName = mainDeck
function deal(num, deckName) {
    if (dealerH.length < num) {
        for (let i = 0; i < num; i++) {
            //player
            let card = deckName.pop(); //take last from mainDeck
            playerH.push(card); //push card to player hand
            let cardImg = document.createElement("img"); //create img element
            cardImg.setAttribute("src", card.img); //set scr atribute, will auto put ""/insert img scr: card.img
            playerHand.append(cardImg); //will add the img to the array playerHand
            //dealer
            let card2 = deckName.pop(); //take last from mainDeck
            dealerH.push(card2); //push card to player hand
            let cardImg2 = document.createElement("img"); //create img element
            if (dealerH.length === 1) { //for the first card
                cardImg2.setAttribute("src", "images/playersCardBack.png") //create src atribute with scr="images/playersCardBack.png"
                cardImg2.setAttribute("id", "firstDealerCard") //set img atribute id = "firstDealerCard"
            } else {
                cardImg2.setAttribute("src", card2.img); //if it is not the first card, set img scr="card2.img"
            }
            dealerHand.append(cardImg2); //append the img to the array
        }
    }


}

//adds card to players hand calls totalPoints, takes cards from mainDeck, pushes to player, attaches img
function hit(deckName) {
    if (dealerH.length > 0) { //id dealer has no cards
        let card = deckName.pop(); //from mainDeck will take the last card
        playerH.push(card); //will add the last card to the player's Hand
        let cardImg = document.createElement("img"); //will create an img element
        cardImg.setAttribute("src", card.img); // the img element will have the src = "card.imd"
        playerHand.append(cardImg); // will append to the array to player's hand
        totalPoints(initialPoints, playerH); //call function totalpoints that will add points to player's hand
    } else {
        //alert("You must deal first.");
        alert("You must deal first dude."); //if something else is pressed
    }
}

//"turns" dealers first card, adds cards to dealers hand up to 17 points, calls total points, returns updated total points
function stand(deckName, dealerPoints) { //
    if (dealerH.length > 0) { //if dealer has cards
        let y = dealerPoints; //y = the sum of the points
        let firstCard = document.querySelector("#firstDealerCard"); //select the element  with class of firstDealerCard
        firstCard.setAttribute("src", dealerH[0].img); //set atribute to not show the card
        while (y < 17) { //while dealer has less than 17 points
            let card2 = deckName.pop(); //take the last card from mainDeck
            dealerH.push(card2); // push the card to dealer's hand
            let cardImg2 = document.createElement("img"); //create img element
            cardImg2.setAttribute("src", card2.img); // give it src ="card2"
            dealerHand.append(cardImg2); //append the img to the array 
            y = totalPoints(initialPoints, dealerH); //calculate total points owned
        }
        return y; //return the points
    } else {
        alert("You must deal first dude."); //if something else is pressed
    }
}



//displays points in #dealer-points 
function displayPoints(playerPoints, dealerPoints = "") { //initially empty
    let dealerPointsDisp = document.getElementById("dealer-points"); //get the element from html
    dealerPointsDisp.innerText = dealerPoints; //insert text to element with id of dealer-points
    //console.log(dealerPointsDisp)
    let playerPointsDisp = document.getElementById("player-points"); //get the element from html
    playerPointsDisp.innerText = playerPoints; //insert text to element with id of player-points
    //console.log(playerPointsDisp)
}

// will see if anyone has won the game, displays winner.
//disables play buttons after a winner has been decided
function disableB() {
    document.getElementById("deal-button").disabled = true; //.disabled is a boolean value
    document.getElementById("hit-button").disabled = true; // will disable button when function called
    document.getElementById("stand-button").disabled = true;
}

//function to pop messages with results of the game//will later create function with specific message
let message = function messageTag(messageText) { //function to display message
    let messageDiv = document.getElementById("messages"); //get element from html with id= "message"
    messageDiv.innerText = messageText; //insert inner text
}

//see if the player has busted after each hit, will later create function that calls message 
function playerBust(playerPoints, dealerPoints) { //function comparing points
    if (playerPoints > 21) {
        message("Player Bust. Dealer Wins."); //display this is player has more than 21 points
        let dealerPointsDisp = document.getElementById("dealer-points"); //select element id ="dealer-points" 
        dealerPointsDisp.innerText = dealerPoints; //display the points
        disableB(); //disable the buttons
    }
    else if (playerPoints === 21) { //in case points = 21
        message("Exactly 21! You cheated somehow!"); //pop the message
        let dealerPointsDisp = document.getElementById("dealer-points"); //get element
        dealerPointsDisp.innerText = dealerPoints; //to display points
        disableB(); //disable the buttons
    }

}

//display messages acording to the final num of points. checks to see if dealer has busted or who has the higher hand at end of game, calls message
function isWinner(playerPoints, dealerPoints) { //function to take the points as arguments

    if (dealerPoints > 21) { //if dealer has more
        message("Dealer Busted. loser... Player Wins!"); //display this
        disableB(); //disable the buttons
    }
    else if (playerPoints > dealerPoints) { //if player has more points than dealer
        message("I won!"); //display
        disableB(); //disable the buttons
    }
    else if (dealerPoints > playerPoints) {
        message("you are bad at this game!");
        disableB(); //disable the buttons
    } else if (dealerPoints === playerPoints && dealerPoints > 0) { //in case tie
        message("Its a standoff");
        disableB(); //disable the buttons
    }

}