class PlayBoard {
    constructor() {


        this.element = $('<div class="playBoard"></div>');
        this.title = $('<div class="title">Rock Paper Scissors</div>'); 
        this.instructions = $('<div class="instructions">Choose to start</div>');  

        this.buttons = $('<div class="buttons"></div>');
        this.status = $('<div class="status">Status</div>');

        this.choices = $('<div class="choices"></div>');



        

        
        this.choices.append($('<div class="choice">Player</div>'));
        this.choices.append($('<div class="choice" id="playerChoice"></div>'));
        this.choices.append($('<div id="botChoice"></div>'));
        this.choices.append($('<div class="choice" class="choice">Bot</div>'));

        this.element.append(this.instructions);
        this.element.append(this.buttons);
        this.element.append(this.status);
        this.element.append(this.choices);

        // this.element.append(this.reset)




        $('body').append(this.title);
        $('body').append(this.element);

        this.hideStatus();
        
    }

    hideStatus(){
        this.status.hide(); 
        this.choices.hide();
    }

    showStatus(){
        this.status.show();
        this.choices.show();
    }
}



class ScoreBoard {
    constructor(playBoard) {
        this.playBoard = playBoard;

    
        this.element = $('<table class="scoreBoard"></table>');


        this.title = $('<tr><td colspan="2">Score Board</td></tr>')
        
       
        this.wins = $('<tr><td>Wins</td><td class="winsValue">0</td></tr>');
        this.losses = $('<tr><td>Losses</td><td class="lossesValue">0</td></tr>');
        this.ties = $('<tr><td>Ties</td><td class="tiesValue">0</td></tr>');

        this.element.append(this.title);
        this.element.append(this.wins);
        this.element.append(this.losses);
        this.element.append(this.ties);

      
        this.element.insertAfter(this.playBoard.choices);

        this.initBoard();
    }

    initBoard(){
        $(".status").text("Status");

        var wins = localStorage.getItem('wins') || 0;
        $(".winsValue").text(wins);

        var losses = localStorage.getItem('losses') || 0;
        $(".lossesValue").text(losses);

        var ties = localStorage.getItem('ties') || 0;
        $(".tiesValue").text(ties);
    }
}


class OptionButton {
    constructor(emoji, playBoard) {
        this.element = $(`<div class="optionButton">${emoji}</div>`);
        this.playBoard = playBoard;

        this.emoji = emoji;
        this.playBoard.buttons.append(this.element);

        this.onHover();
        this.onClick();
    }

    onHover() {
        this.element.mouseenter(() => {
            this.element.addClass("optionButtonHover");
        });
        this.element.mouseleave(() => {
            this.element.removeClass("optionButtonHover");
        });
    }

    onClick() {
        this.element.click(() => {

            
            this.playBoard.showStatus();
            let rand = Math.floor(Math.random() * 3);
            let botEmoji = ['🪨', '📄', '✂️'][rand];
            let botButton = this.playBoard.buttons.children().eq(rand);
    
            let playerDone = false;
            let botDone = false;
    
            // Function to check if both animations are done
            const checkBothDone = () => {
                if (playerDone && botDone) {
                    this.checkResult(this.emoji, botEmoji);
                }
            };
    
            // Animate player's choice
            this.animateChoice(this.emoji, $("#playerChoice"), this.element, () => {
                playerDone = true;
                checkBothDone();
            });
    
            // Animate bot's choice
            this.animateChoice(botEmoji, $("#botChoice"), botButton, () => {
                botDone = true;
                checkBothDone();
            });
        });
    }
    

    animateChoice(emoji, targetElement, originElement, callback) {
        let clonedElement = originElement.clone().appendTo(this.playBoard.element);
        clonedElement.addClass('animatedOption');
    
        let targetPos = targetElement.offset();
        let originalPos = originElement.offset();
        let playBoardOffset = this.playBoard.element.offset();
    
        // Get dimensions for centering
        let targetWidth = targetElement.outerWidth();
        let targetHeight = targetElement.outerHeight();
        let cloneWidth = clonedElement.outerWidth();
        let cloneHeight = clonedElement.outerHeight();
    
        // Calculate the exact center positions
        let centerLeft = targetPos.left - playBoardOffset.left + (targetWidth / 2) - (cloneWidth / 2);
        let centerTop = targetPos.top - playBoardOffset.top + (targetHeight / 2) - (cloneHeight / 2);
    
        clonedElement.css({
            left: originalPos.left - playBoardOffset.left,
            top: originalPos.top - playBoardOffset.top,
            transform: 'scale(1)'
        });
    
        setTimeout(() => {
            clonedElement.css({
                left: centerLeft,
                top: centerTop,
                transform: 'scale(0.2)'  // Ensure the cloned element noticeably shrinks
            });
        }, 10);
    
        setTimeout(() => {
            targetElement.text(emoji);  // Set text before removing the clone for smooth transition
            clonedElement.fadeOut(100, function() {
                clonedElement.remove();
                if (callback) {
                    callback();
                }
            });
        }, 500);
    }
    
    

    checkResult(pChoice, botChoice) {
        if (pChoice === botChoice) {
            this.increaseTies();
        } else if ((pChoice === '🪨' && botChoice === '✂️') ||
                   (pChoice === '📄' && botChoice === '🪨') ||
                   (pChoice === '✂️' && botChoice === '📄')) {
            this.increaseWins();
        } else {
            this.increaseLosses();
        }
    }

    increaseTies() {
        var ties = parseInt($(".tiesValue").text()) + 1;
        $(".tiesValue").text(ties);
        localStorage.setItem('ties', ties);
        $(".status").text("It's A TIE !");
    }

    increaseWins() {
        var wins = parseInt($(".winsValue").text()) + 1;
        $(".winsValue").text(wins);
        localStorage.setItem('wins', wins);
        $(".status").text("Player WON!");
    }

    increaseLosses() {
        var losses = parseInt($(".lossesValue").text()) + 1;
        $(".lossesValue").text(losses);
        localStorage.setItem('losses', losses);
        $(".status").text("Player LOST!");

    }
}




class ResetButton{
        constructor(playBoard){
            this.element = $('<div class="reset">Reset</div>');
            this.playBoard = playBoard;

            this.playBoard.element.append(this.element);

            this.onHover();

            this.onClick();

        }

        onHover(){
            this.element.mouseenter(() => {
                this.element.addClass("resetHover");
            });
            this.element.mouseleave(() => {
                this.element.removeClass("resetHover");
            });
        }

        onClick(){

            this.element.click(()=>{
                $(".tiesValue").text(0);
                $(".winsValue").text(0);
                $(".lossesValue").text(0);
                $(".status").text("Status");
                $("#playerChoice").text("");
                $("#botChoice").text("");
                this.playBoard.hideStatus();
                localStorage.clear();
            });
        }
}



let pb = new PlayBoard();

let scoreBoard = new ScoreBoard(pb);

let resetButton = new ResetButton(pb);

let rock = new OptionButton('🪨', pb);
let paper = new OptionButton('📄', pb);
let scissors = new OptionButton('✂️', pb);
