function checkResult(arr){ 
    // check rows
    let ckHorLength, startFromHor, wonCharHor;
    for(let row = 0; row < arr.length; row++){
        ckHorLength = 1;
        for(let col = 0; col < arr[row].length - 1; col++){
            if(arr[row][col] != ""){
                if(arr[row][col] == arr[row][col+1]){
                    ckHorLength++;
                }
            }else{
                break;
            }

            if(ckHorLength == 3) {
                startFromHor = [row, 'h'];
                wonCharHor = arr[row][col];
            }
        }
        if(ckHorLength == 3) break;
    }

    // check cols
    let ckVerLength, startFromVer, wonCharVer;
    for(let col = 0; col < arr.length; col++){
        ckVerLength = 1;
        for(let row = 0; row < arr.length - 1; row++){
            if(arr[row][col] != ""){
                if(arr[row][col] == arr[row + 1][col]){
                    ckVerLength++;
                }
            }else{
                break;
            }

            if(ckVerLength == 3) {
                startFromVer = [col, "v"];
                wonCharVer = arr[row][col];
            }
        }
        if(ckVerLength == 3) break;
    }

    // diagonal(left to right)
    let ckLeftDiaLength = 1, startFromLeftDia, wonCharLeftDia;
    let leftDiagonalCondition1 = arr[0][0] != "" && arr[1][1] != "" && arr[2][2] != "", 
        leftDiagonalCondition2 = (arr[0][0] == arr[1][1]) && (arr[1][1] == arr[2][2]);

    if(leftDiagonalCondition1 && leftDiagonalCondition2){
        ckLeftDiaLength = 3;
        startFromLeftDia = [0, "ld"];
        wonCharLeftDia = arr[0][0];
    }

    // diagonal (right to left)
    let ckRightDiaLength = 1, startFromRightDia, wonCharRightDia;
    let rightDiagonalCondition1 = arr[2][0] != "" && arr[1][1] != "" && arr[0][2] != "", 
        rightDiagonalCondition2 = (arr[2][0] == arr[1][1]) && (arr[1][1] == arr[0][2]);

    if(rightDiagonalCondition1 && rightDiagonalCondition2){
        ckRightDiaLength = 3;
        startFromRightDia = [2, "rd"];
        wonCharRightDia = arr[0][2];
    }

    let successful = {
        done: false
    };

    if (ckHorLength == 3){
        successful = { 
            done: true,
            wonChar: wonCharHor,
            position: startFromHor
        }
    }else if(ckVerLength == 3){
        successful = { 
            done: true,
            wonChar: wonCharVer,
            position: startFromVer
        }
    }else if(ckLeftDiaLength == 3){
        successful = { 
            done: true,
            wonChar: wonCharLeftDia,
            position: startFromLeftDia
        }
    }else if(ckRightDiaLength == 3){
        successful = { 
            done: true,
            wonChar: wonCharRightDia,
            position: startFromRightDia
        }
    }

    return successful;
}

function animateNone(ele, duration){
    let animation = setInterval( () => {
        ele.classList.add("none");
        clearInterval(animation);
    },duration )
}

//start with choices
let styleGame = document.getElementsByName("PS"),
    styleGameValue,
    char,
    charValue,
    startBtn = document.querySelector(".choices .box-choices button"),
    boxes = document.querySelectorAll(".box-container .box .col"),
    emptyBoxes,
    randomBox,
    counter = 0,
    XOGame = {},
    result = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ],
    p1Name,
    p2Name,
    p1NameSpan = document.querySelector(".box-container .names #player1 .name"),
    p2NameSpan = document.querySelector(".box-container .names #player2 .name"),
    p1ScoreSpan = document.querySelector(".box-container .names #player1 .score"),
    p2ScoreSpan = document.querySelector(".box-container .names #player2 .score"),
    activeChar = document.querySelector(".box-container .activeChar"),
    finalResult = checkResult(result),
    resultPopup = document.querySelector(".result-popup"),
    reloadBtn = document.querySelector(".box-container .top .options #reload"),
    clearBtn = document.querySelector(".box-container .top .options #clear"),
    autoClick = false;

function showFinalResult(ele){
    ele.style.display = "flex";
    let showResult = setInterval( () => {
        ele.classList.add("show");
        clearInterval(showResult);
    }, 1);
}

function hideFinalResult(ele){
    ele.classList.remove("show");
    let hideResult = setInterval( () => {
        ele.style.display = "";
        clearInterval(hideResult);
    }, 750);
}

reloadBtn.onclick = function(){
    window.location.reload();
}

clearBtn.onclick = function(){
    counter = 0;
    result = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    hideFinalResult(resultPopup);

    boxes.forEach(box => {
        box.innerHTML = "";
        box.classList.remove("done", "full-box", "done-h", "done-v", "done-ld", "done-rd");
        box.classList.add("empty-box");
    })
}

boxes.forEach(ele => {
    ele.classList.add("empty-box");
})

styleGame.forEach(ele => {
    ele.onchange = function(){
        if(ele.value == "single"){
            document.querySelector('.choices .p2Name').classList.add("none")
        }else{
            document.querySelector('.choices .p2Name').classList.remove("none");
        }
    }
})

startBtn.onclick = function(){
    // get value of style game
    styleGame = document.getElementsByName("PS");
    styleGame.forEach( ele => {
        if(ele.checked){
            styleGameValue = ele.value;
        }
    })

    // get value of main char
    char = document.getElementsByName("startChar");
    char.forEach( ele => {
        if(ele.checked){
            charValue = ele.value;
        }
    })

    // get names
    p1Name = document.querySelector(".choices .p1Name input").value;
    p2Name = document.querySelector(".choices .p2Name input").value;
    p1Name = p1Name.trim(); 
    p2Name = p2Name.trim();

    // hiding choices page
    let choicesBox = document.querySelector(".choices");
    choicesBox.classList.add('hidden');
    animateNone(choicesBox, 500);

    // storage data
    XOGame = {
        single: styleGameValue == 'single'? true : false,
        playerName1: p1Name == ""? "Player1": p1Name,
        playerName2: styleGameValue == 'single'? "Computer": p2Name == ""? "Player2": p2Name,
        playerChar1: charValue == "x"? "X" : "O",
        playerChar2: charValue == "x"? "O" : "X",
        playerScore1: 0,
        playerScore2: 0
    };

    activeChar.innerHTML = XOGame.playerChar1;

    // put names and scores in their span
    p1NameSpan.innerHTML = XOGame.playerName1;
    p2NameSpan.innerHTML = XOGame.playerName2;
    function updateScroe(obj){
        p1ScoreSpan.innerHTML = obj.playerScore1;
        p2ScoreSpan.innerHTML = obj.playerScore2;
    }
    updateScroe(XOGame);

    // filling boxes
    boxes.forEach(ele => {
        ele.onclick = function(){
            if(!ele.classList.value.includes("full-box")){
                counter ++;
                ele.classList.add("full-box");
                ele.classList.remove("empty-box");

                if(counter % 2 == 0){
                    ele.innerHTML = XOGame.playerChar2;
                    activeChar.innerHTML = XOGame.playerChar1;
                }else{
                    ele.innerHTML = XOGame.playerChar1;
                    activeChar.innerHTML = XOGame.playerChar2;
                    autoClick = true;
                }
            }

            let fullBoxes = document.querySelectorAll(".full-box"),
                fullBoxDataIndex;
            fullBoxes.forEach(ele => {
                fullBoxDataIndex = ele.getAttribute('data-index').split("-");
                result[fullBoxDataIndex[0]][fullBoxDataIndex[1]] = ele.textContent;
            })

            finalResult = checkResult(result);
            // finished
            if(finalResult.done){
                resultPopup.querySelector(".result").innerHTML = `Player of (${finalResult.wonChar}) is winner!`;

                showFinalResult(resultPopup);

                activeChar.innerHTML = "";

                // update score of players
                if(finalResult.wonChar === XOGame.playerChar1){
                    XOGame.playerScore1 += 1;
                    updateScroe(XOGame);
                }else if(finalResult.wonChar === XOGame.playerChar2){
                    XOGame.playerScore2 += 1;
                    updateScroe(XOGame);
                }

                boxes.forEach(ele => {
                    ele.classList.add('done');
                })

                if(finalResult.position[1] == 'h'){
                    let startRow = finalResult.position[0];

                    for(let i = 0; i < 3; i++){
                        document.querySelector(`[data-index = '${startRow}-${i}']`).classList.add("done-h");
                    }
                }

                if(finalResult.position[1] == 'v'){
                    let start = finalResult.position[0];

                    for(let i = 0; i < 3; i++){
                        document.querySelector(`[data-index = '${i}-${start}']`).classList.add("done-v");
                    }
                }

                if(finalResult.position[1] == 'ld'){
                    let start = finalResult.position[0];

                    for(let i = start; i < 3; i++){
                        document.querySelector(`[data-index = '${i}-${i}']`).classList.add("done-ld");
                    }
                }

                if(finalResult.position[1] == 'rd'){
                    let start = finalResult.position[0];
                    
                    for(let i = 0; i < 3; i++){
                        document.querySelector(`[data-index = '${start}-${i}']`).classList.add("done-rd");
                        start--;
                    }
                }
            }
            
            // auto click when playing with computer
            let comTurnInterval;
            emptyBoxes = document.querySelectorAll('.box .empty-box');
            if(XOGame.single && !finalResult.done && autoClick){
                autoClick = false;
                comTurnInterval = setInterval( () => {
                    randomBox = Math.floor( Math.random() * emptyBoxes.length );
                    emptyBoxes[randomBox].click();
                    clearInterval(comTurnInterval);
                }, 500);
                
            }

            if(emptyBoxes.length == 0 && finalResult.done == false){
                activeChar.innerHTML = "";
                
                if(XOGame.single) clearInterval(comTurnInterval);

                resultPopup.querySelector(".result").innerHTML = "Nobody is winner!";

                showFinalResult(resultPopup);
            }
        }
    })
}

// start with switching
let switchingBtn = document.querySelector('.switch-mode span');

switchingBtn.onclick = function (e) {
    e.target.classList.toggle("dark");
    e.target.classList.toggle("light");

    if (e.target.classList.value.includes("light"))
        document.getElementsByTagName('html')[0].classList.add('light-mode');
    else
        document.getElementsByTagName('html')[0].classList.remove('light-mode');

}