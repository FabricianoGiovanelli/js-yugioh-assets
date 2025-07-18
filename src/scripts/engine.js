const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        draws: 0,
        winBox: document.getElementById("win"),  
        loseBox: document.getElementById("lose"),  
        drawBox: document.getElementById("draw"), 
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
    button: document.getElementById("next-duel"),
    },
    playerSides: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
    }
}

const pathImages = "src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue-Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
        DrawOf:[0],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
        DrawOf:[1],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
        DrawOf:[2],
    }    
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));

            });
        cardImage.addEventListener("mouseover", () => {
        drawSelectedCard(IdCard);
    })
    };
return cardImage;
}

async function setCardsField(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResult = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResult);
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.winBox.innerText = `Win: ${state.score.playerScore}`;
    state.score.loseBox.innerText = `Lose: ${state.score.computerScore}`;
    state.score.drawBox.innerText = `Draw: ${state.score.draws}`;    
}

async function checkDuelResults(playerCardId, ComputerCardId){
    let duelResults = "Empate"
    let playerCard = cardData[playerCardId]

    if(playerCard.WinOf.includes(ComputerCardId)){
        duelResults = "You Win";
        playAudio("Win")
        state.score.playerScore++;
    }
    if (playerCard.LoseOf.includes(ComputerCardId)){
        duelResults = "You Lose";
        playAudio("Lose")
        state.score.computerScore++;
    }
    if (playerCard.DrawOf.includes(ComputerCardId)){
        duelResults = "We  Draw";
        playAudio("draw")
        state.score.draws++;
    }
    return duelResults
}

async function removeAllCardsImages(){
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard,fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none"
    state.cardSprites.name.innerText = "Escolha uma nova carta";
    state.cardSprites.type.innerText = "Vamos duelar";

    init();

}

async function playAudio(status){
    const audio = new Audio(`src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
    playAudio("inicio")
    const bgm = document.getElementById("bgm");
    bgm.play();
}

init();

