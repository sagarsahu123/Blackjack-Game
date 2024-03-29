let Blackjackgame = {
    'you': { 'scorespan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scorespan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsmap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = Blackjackgame['you']
const DEALER = Blackjackgame['dealer']


const hitsound = new Audio('sounds/swish.m4a');
const winsound = new Audio('sounds/cash.mp3');
const losssound = new Audio('sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackhit);

document.querySelector('#blackjack-stand-button').addEventListener('click', botlogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackdeal);

function blackjackhit() {
    if (Blackjackgame['isStand'] === false) {
        let card = randomcard();
        showcard(card, YOU);
        updatescore(card, YOU);
        showscore(YOU);
    }
}

function randomcard() {
    let randomindex = Math.floor(Math.random() * 13);
    return Blackjackgame['cards'][randomindex];
}


function showcard(card, activeplayer) {
    if (activeplayer['score'] <= 21) {
        let cardimage = document.createElement('img');
        cardimage.src = `images/${card}.png`;
        document.querySelector(activeplayer['div']).appendChild(cardimage);
        hitsound.play();
    }
}

function blackjackdeal() {
    // showresult(computewinner());
    if (Blackjackgame['turnsOver'] === true) {
        Blackjackgame['isStand'] = false;

        let yourimages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerimages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (i = 0; i < yourimages.length; i++) {
            yourimages[i].remove();
        }
        for (i = 0; i < dealerimages.length; i++) {
            dealerimages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#blackjack-result').textContent = "Let's Play";

        document.querySelector('#your-blackjack-result').style.color = '#ffffff';
        document.querySelector('#dealer-blackjack-result').style.color = '#ffffff';
        document.querySelector('#blackjack-result').style.color = 'black';

        Blackjackgame['turnsOver'] = true;

    }
}

function updatescore(card, activeplayer) {
    if (card === 'A') {
        //if adding 11 keeps me below 21,add 11. otherwise,add 1
        if (activeplayer['score'] + Blackjackgame['cardsmap'][card][1] <= 21) {
            activeplayer['score'] += Blackjackgame['cardsmap'][card][1];
        }
        else {
            activeplayer['score'] += Blackjackgame['cardsmap'][card][0];
        }
    }
    else {
        activeplayer['score'] += Blackjackgame['cardsmap'][card];
    }
}

function showscore(activeplayer) {
    if (activeplayer['score'] > 21) {
        document.querySelector(activeplayer['scorespan']).textContent = 'BUST!!';
        document.querySelector(activeplayer['scorespan']).style.color = 'red';
    }
    else {
        document.querySelector(activeplayer['scorespan']).textContent = activeplayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function botlogic() {
    Blackjackgame['isStand'] = true;

    while (DEALER['score'] < 16 && Blackjackgame['isStand'] === true) {
        let card = randomcard();
        showcard(card, DEALER);
        updatescore(card, DEALER);
        showscore(DEALER);
        await sleep(1000);
    }

    Blackjackgame['turnsOver'] = true;
    showresult(computewinner());
}
//computer winner and return who just won
//update the wins,draws and losses
function computewinner() {
    let winner;

    if (YOU['score'] <= 21) {
        //condition: higher score than dealer or when dealer busts but you are 21 or under
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            Blackjackgame['wins']++;
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            Blackjackgame['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']) {
            Blackjackgame['draws']++;

        }
    }
    //condition: when user busts but dealer does not
    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        Blackjackgame['losses']++;
        winner = DEALER;
    }
    //condition: when you and dealer both are busts
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        Blackjackgame['draws']++;
    }

    return winner;
}

function showresult(winner) {
    let message, messagecolor;

    if (Blackjackgame['turnsOver'] === true) {
        if (winner === YOU) {
            document.querySelector('#wins').textContent = Blackjackgame['wins'];
            message = 'You Won!';
            messagecolor = 'green';
            winsound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#losses').textContent = Blackjackgame['losses'];
            message = 'You Lost!';
            messagecolor = 'red';
            losssound.play();
        }
        else {
            document.querySelector('#draws').textContent = Blackjackgame['draws'];
            message = 'Drew!!';
            messagecolor = 'black';
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messagecolor;
    }
}