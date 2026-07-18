/* ==========================================
   Modern Tic Tac Toe
   script.js - Part 1
========================================== */

/* ---------- Elements ---------- */

const menu = document.querySelector(".menu");
const difficulty = document.querySelector(".difficulty");
const game = document.querySelector(".game");

const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");

const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");

const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

const resetScoreBtn = document.getElementById("resetScore");

const statusText = document.getElementById("status");
const turnText = document.getElementById("turnText");

const scoreXText = document.getElementById("scoreX");
const scoreOText = document.getElementById("scoreO");
const drawText = document.getElementById("drawScore");

/* ---------- Variables ---------- */

let boardState = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let currentPlayer = "X";

let gameRunning = false;

let vsAI = false;

let aiLevel = "easy";

/* ---------- Scores ---------- */

let scoreX = Number(localStorage.getItem("scoreX")) || 0;
let scoreO = Number(localStorage.getItem("scoreO")) || 0;
let scoreDraw = Number(localStorage.getItem("scoreDraw")) || 0;

updateScoreUI();

/* ---------- Buttons ---------- */

pvpBtn.onclick = () => {

    vsAI = false;

    menu.classList.add("hidden");

    difficulty.classList.add("hidden");

    startGame();

};

aiBtn.onclick = () => {

    vsAI = true;

    menu.classList.add("hidden");

    difficulty.classList.remove("hidden");

};

/* ---------- Difficulty ---------- */

document.querySelectorAll(".difficulty button")
.forEach(button=>{

    button.onclick=()=>{

        aiLevel = button.dataset.level;

        difficulty.classList.add("hidden");

        startGame();

    }

});

/* ---------- Start Game ---------- */

function startGame(){

    boardState = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    currentPlayer = "X";

    gameRunning = true;

    cells.forEach(cell=>{

        cell.textContent="";

        cell.classList.remove("x");
        cell.classList.remove("o");
        cell.classList.remove("win");

    });

    game.classList.remove("hidden");

    updateTurn();

}

/* ---------- Update Turn ---------- */

function updateTurn(){

    turnText.textContent=currentPlayer;

    statusText.textContent=
    "Player " + currentPlayer + " Turn";

}

/* ---------- Cell Click ---------- */

cells.forEach(cell=>{

    cell.addEventListener("click",cellClicked);

});

function cellClicked(){

    if(!gameRunning) return;

    const index =
    this.dataset.index;

    if(boardState[index]!="")
        return;

    placeMove(index,currentPlayer);

}

/* ---------- Place Move ---------- */

function placeMove(index,player){

    boardState[index]=player;

    cells[index].textContent=player;

    cells[index].classList.add(
        player.toLowerCase()
    );

    if(checkWinner()) return;

    if(isDraw()) return;

    switchPlayer();

}

/* ---------- Switch Player ---------- */

function switchPlayer(){

    currentPlayer =
    currentPlayer=="X" ? "O" : "X";

    updateTurn();

    if(vsAI &&
       currentPlayer=="O"){

        setTimeout(()=>{

            aiMove();

        },350);

    }

}

/* ---------- Restart ---------- */

restartBtn.onclick=()=>{

    startGame();

};

/* ---------- Menu ---------- */

menuBtn.onclick=()=>{

    game.classList.add("hidden");

    difficulty.classList.add("hidden");

    menu.classList.remove("hidden");

};

/* ---------- Reset Scores ---------- */

resetScoreBtn.onclick=()=>{

    scoreX=0;
    scoreO=0;
    scoreDraw=0;

    saveScores();

    updateScoreUI();

};

/* ---------- Score UI ---------- */

function updateScoreUI(){

    scoreXText.textContent=scoreX;

    scoreOText.textContent=scoreO;

    drawText.textContent=scoreDraw;

}

/* ---------- Save Scores ---------- */

function saveScores(){

    localStorage.setItem(
        "scoreX",
        scoreX
    );

    localStorage.setItem(
        "scoreO",
        scoreO
    );

    localStorage.setItem(
        "scoreDraw",
        scoreDraw
    );

}
/* ==========================================
   script.js - Part 2
========================================== */

/* ---------- Win Patterns ---------- */

const winPatterns = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]

];

/* ---------- Check Winner ---------- */

function checkWinner(){

    for(const pattern of winPatterns){

        const a = pattern[0];
        const b = pattern[1];
        const c = pattern[2];

        if(
            boardState[a] !== "" &&
            boardState[a] === boardState[b] &&
            boardState[b] === boardState[c]
        ){

            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");

            finishGame(boardState[a]);

            return true;

        }

    }

    return false;

}

/* ---------- Check Draw ---------- */

function isDraw(){

    if(boardState.includes(""))
        return false;

    finishGame("draw");

    return true;

}

/* ---------- Finish Game ---------- */

function finishGame(result){

    gameRunning = false;

    if(result === "draw"){

        statusText.textContent =
        "🤝 Draw";

        scoreDraw++;

    }

    else{

        statusText.textContent =
        "🏆 Player " + result + " Wins!";

        if(result === "X"){

            scoreX++;

        }else{

            scoreO++;

        }

    }

    saveScores();

    updateScoreUI();

}

/* ---------- Reset Board ---------- */

function clearBoard(){

    boardState = [

        "","","",
        "","","",
        "","",""

    ];

    cells.forEach(cell=>{

        cell.textContent="";

        cell.classList.remove("x");
        cell.classList.remove("o");
        cell.classList.remove("win");

    });

    currentPlayer="X";

    gameRunning=true;

    updateTurn();

}

/* ---------- Keyboard Restart ---------- */

document.addEventListener("keydown",e=>{

    if(e.key==="r"){

        startGame();

    }

});

/* ---------- Small Animation ---------- */

function flashStatus(){

    statusText.animate(

        [

            {
                transform:"scale(1)"
            },

            {
                transform:"scale(1.08)"
            },

            {
                transform:"scale(1)"
            }

        ],

        {

            duration:300

        }

    );

}
/* ==========================================
   script.js - Part 3
========================================== */

/* ---------- AI Move ---------- */

function aiMove(){

    if(!gameRunning) return;

    switch(aiLevel){

        case "easy":
            easyAI();
            break;

        case "medium":
            mediumAI();
            break;

        case "hard":
            hardAI();
            break;

    }

}

/* ---------- Easy AI ---------- */

function easyAI(){

    let empty = [];

    boardState.forEach((value,index)=>{

        if(value==="")
            empty.push(index);

    });

    if(empty.length===0)
        return;

    const randomIndex =
        empty[
            Math.floor(
                Math.random()*empty.length
            )
        ];

    placeMove(randomIndex,"O");

}

/* ---------- Medium AI ---------- */

function mediumAI(){

    /* 50 درصد مواقع هوشمند */

    if(Math.random()<0.5){

        const best =
            findWinningMove("O");

        if(best!=-1){

            placeMove(best,"O");

            return;

        }

        const block =
            findWinningMove("X");

        if(block!=-1){

            placeMove(block,"O");

            return;

        }

    }

    easyAI();

}

/* ---------- Find Winning Move ---------- */

function findWinningMove(player){

    for(let pattern of winPatterns){

        const [a,b,c]=pattern;

        const line=[
            boardState[a],
            boardState[b],
            boardState[c]
        ];

        const countPlayer=
            line.filter(v=>v===player).length;

        const countEmpty=
            line.filter(v=>v==="").length;

        if(countPlayer===2 &&
           countEmpty===1){

            if(boardState[a]==="")
                return a;

            if(boardState[b]==="")
                return b;

            if(boardState[c]==="")
                return c;

        }

    }

    return -1;

}

/* ---------- Hard AI ---------- */

function hardAI(){

    /*

    در بخش چهارم
    الگوریتم Minimax
    این تابع را کامل می‌کند.

    */

}
/* ==========================================
   script.js - Part 4
   Hard AI + Final Effects
========================================== */


/* ---------- Hard AI (Minimax) ---------- */

function hardAI(){

    let bestScore = -Infinity;

    let move;


    for(let i=0;i<boardState.length;i++){

        if(boardState[i]===""){

            boardState[i]="O";

            let score =
            minimax(boardState,0,false);

            boardState[i]="";


            if(score > bestScore){

                bestScore=score;

                move=i;

            }

        }

    }


    placeMove(move,"O");

}



/* ---------- Minimax Algorithm ---------- */


function minimax(board,depth,isMaximizing){


    let result =
    checkMinimaxWinner(board);


    if(result!==null){

        if(result==="O")
            return 10-depth;

        if(result==="X")
            return depth-10;

        if(result==="draw")
            return 0;

    }



    if(isMaximizing){

        let bestScore=-Infinity;


        for(let i=0;i<board.length;i++){

            if(board[i]===""){

                board[i]="O";


                let score =
                minimax(
                    board,
                    depth+1,
                    false
                );


                board[i]="";


                bestScore =
                Math.max(
                    score,
                    bestScore
                );

            }

        }


        return bestScore;


    }

    else{


        let bestScore=Infinity;


        for(let i=0;i<board.length;i++){


            if(board[i]===""){

                board[i]="X";


                let score =
                minimax(
                    board,
                    depth+1,
                    true
                );


                board[i]="";


                bestScore =
                Math.min(
                    score,
                    bestScore
                );

            }

        }


        return bestScore;

    }


}



/* ---------- Minimax Winner ---------- */


function checkMinimaxWinner(board){


    for(let pattern of winPatterns){


        let a=pattern[0];
        let b=pattern[1];
        let c=pattern[2];


        if(
            board[a]!=="" &&
            board[a]===board[b] &&
            board[b]===board[c]
        ){

            return board[a];

        }

    }



    if(!board.includes("")){

        return "draw";

    }


    return null;

}



/* ---------- Sound System ---------- */


const sounds={

    click:new Audio(),

    win:new Audio(),

    draw:new Audio()

};



function playSound(type){

    if(sounds[type]){

        sounds[type].currentTime=0;

        sounds[type].play()
        .catch(()=>{});

    }

}



/* ---------- Final Message Animation ---------- */


function showResultAnimation(){


    statusText.animate(

        [

            {
                transform:"scale(1)"
            },

            {

                transform:"scale(1.15)"

            },

            {

                transform:"scale(1)"

            }

        ],

        {

            duration:500

        }

    );

}