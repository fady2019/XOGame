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

//start with choices
let styleGame,
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
    finalResult = checkResult(result),
    autoClick = true;

boxes.forEach(ele => {
    ele.classList.add("empty-box")
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

    // hiding choices page
    document.querySelector(".choices").classList.add('hidden');

    // storage data
    XOGame = {
        playerName1: "Player1",
        playerName2: "player2",
        playerChar1: charValue == "x"? "X" : "O",
        playerChar2: charValue == "x"? "O" : "X",
        single: styleGameValue == 'single'? true : false,
    }

    // filling boxes
    boxes.forEach(ele => {
        ele.onclick = function(){
            if(!ele.classList.value.includes("full-box")){
                counter ++;
                ele.classList.add("full-box");
                ele.classList.remove("empty-box");

                if(counter % 2 == 0){
                    ele.innerHTML = XOGame.playerChar2;
                }else{
                    ele.innerHTML = XOGame.playerChar1;
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
            if(finalResult.done){
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
            emptyBoxes = document.querySelectorAll('.box .empty-box');
            if(XOGame.single && !finalResult.done && autoClick){
                autoClick = false;
                randomBox = Math.floor( Math.random() * emptyBoxes.length );
                emptyBoxes[randomBox].click();
            }

            if(emptyBoxes.length == 0 && finalResult.done == false){
                alert("Done, but there's no a winner !")
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