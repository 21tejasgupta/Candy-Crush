//The addEventListener() is an inbuilt function in JavaScript which takes the event to listen for, and a second argument to be called whenever the described event gets fired.



document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid")//querySelector -> we pass particular selector inside this 
    const width = 8;
    let score = 0;

    const candies = []; //to store the value too
    const candyImages = [
        'url(images/blue-candy.png)',
        'url(images/green-candy.png)',
        'url(images/purple-candy.png)',
        'url(images/red-candy.png)',
        'url(images/yellow-candy.png)',
        'url(images/orange-candy.png)'
    ];

    function createBoard() {
        //preparing 8*8 grid
        for (let i = 0; i < width * width; i++) {
            let candy = document.createElement("div"); //creating a div element and storing in variable 'square'

            candy.setAttribute("draggable", true);
            candy.setAttribute("id", i);

            let randomImageIndex = Math.floor(Math.random() * candyImages.length);
            candy.style.backgroundImage = candyImages[randomImageIndex];//using inline css -->from sqaure, we go to it's style, and there bg image

            grid.appendChild(candy); //inside grid, we are appending child-'square'
            candies.push(candy);
        }
    }
    createBoard();

    let imageBeingDragged;
    let candyBeingDragged;

    let imageBeingReplaced;
    let candyBeingReplaced;

    //e-preventDefault means we don't want that fnct now, will skip the pre-efined code and continue

    candies.forEach(candy => candy.addEventListener("dragstart", dragStart));
    candies.forEach(candy => candy.addEventListener("dragend", dragEnd));
    candies.forEach(candy => candy.addEventListener("dragover", function (e) { //e-->event object
        e.preventDefault();
    }));
    candies.forEach(candy => candy.addEventListener("dragleave", dragLeave)); //dragleave-->leaving the 560*560 box
    candies.forEach(candy => candy.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }));
    candies.forEach(candy => candy.addEventListener("drop", dragDrop));


    /**
     * start ->leave ->drop ->end
     */
    function dragStart() {
        imageBeingDragged = this.style.backgroundImage;
        candyBeingDragged = parseInt(this.id);
    }

    function dragLeave() {
        console.log(this.id, "dragleave");
    }
    function dragDrop() { //drop=>where the candy drag is ending and left

        imageBeingReplaced = this.style.backgroundImage;
        candyBeingReplaced = parseInt(this.id);

        this.style.backgroundImage = imageBeingDragged;
        candies[candyBeingDragged].style.backgroundImage = imageBeingReplaced;
    }
    function dragEnd() {
        /**valid moves--> can swipe only adjacent candies */

        let validmoves = [candyBeingDragged + 1,
        candyBeingDragged - 1,
        candyBeingDragged + width,
        candyBeingDragged - width];

        console.log(candyBeingReplaced, 'in drag end');

        const inValidMove = ((candyBeingDragged + candyBeingReplaced) % width == (width - 1) &&
            (candyBeingDragged % width == 0 || candyBeingReplaced % width == 0)); //last candy of one row and frst candy of second row should not swap
        const isValidMove = validmoves.includes(candyBeingReplaced) && !inValidMove; //this will return us a boolean, if it include->true


        //candyBeingReplaced in below 'if' means that it should not be null,0 or undefined(meant for corner candies)
        if (candyBeingReplaced && isValidMove) {
            candyBeingReplaced = null;
            candyBeingDragged = null;
            imageBeingReplaced = null;
            imageBeingDragged = null;
            //if we swap outside the grid, we will get null value
        }
        else if (candyBeingReplaced && !isValidMove) {
            //don't swap them, keep it as it is
            candies[candyBeingDragged].style.backgroundImage = imageBeingDragged;
            candies[candyBeingReplaced].style.backgroundImage = imageBeingReplaced;
        }
    }

    function generateRandomCandies() {
        for (let i = 0; i < width * (width - 1); i++) {
            if (candies[i + width].style.backgroundImage === "") {
                candies[i + width].style.backgroundImage = candies[i].style.backgroundImage;
                candies[i].style.backgroundImage = "";

            }
            //candy in frst row having no bachgroundImage
            if (i < width && candies[i].style.backgroundImage === "") {
                candies[i].style.backgroundImage = candyImages[Math.floor(Math.random() * candyImages.length)];
            }
        }
    }
   
    /**  function checkRowforThree() {
         let invalidIndex = [];
         for (let i = width - 2; i < width * width - 2; i += width) {
             invalidIndex.push(i, i + 1);
         }
     
     
         for (let i = 0; i < width * width - 3; i++) { //last i->61 ->threeCandies->61,62,62->can't go beyond that
             let threeCandies = [i, i + 1, i + 2];
             let desiredImage = candies[i].style.backgroundImage;
     
             //if i is present in last 2 columns
             if (invalidIndex.includes(i)) {
                 continue;
             }
     
     
             let match = threeCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
             if (match) {
                 score += 3;
                 threeCandies.forEach(index => candies[index].style.backgroundImage = "");
             }
     
         }
     }*/
     

     function checkRow(number) {
        let invalidIndex = [];
        for (let i = width - (number - 1); i <= width * width - number; i += width) {
            invalidIndex.push(i, i + 1);
            if (number >= 4) {
                invalidIndex.push(i + 2);
            }
            if (number == 5) {
                invalidIndex.push(i + 3);
            }
        }
        for (let i = 0; i <= width * width - number; i++) {
            let mycandies = [];
            mycandies.push(i, i + 1, i + 2);
            if (number >= 4) {
                mycandies.push(i + 3);
            }
            if (number == 5) {
                mycandies.push(i + 4);
            }
            let desiredImage = candies[i].style.backgroundImage;

            //if i is present in last 2 columns
            if (invalidIndex.includes(i)) continue;


            let match = mycandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if (match) {
                score += number;
                mycandies.forEach(index => candies[index].style.backgroundImage = "");
            }
        }

    }

    function checkColforThree() {

        for (let i = 0; i <= width * (width - 2) - 1; i++) { 
            let threeCandies = [i, i + width, i + (width * 2)];
            let desiredImage = candies[i].style.backgroundImage;


            let match = threeCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if (match) {
                score += 3;
                threeCandies.forEach(index => candies[index].style.backgroundImage = "");
            }

        }
    }

    function checkColforFour() {

        for (let i = 0; i < width * (width - 3); i++) {
            let fourCandies = [i, i + width, i + (width * 2), i + (width * 3)];
            let desiredImage = candies[i].style.backgroundImage;


            let match = fourCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if (match) {
                score += 3;
                fourCandies.forEach(index => candies[index].style.backgroundImage = "");
            }

        }
    }

    function checkColforFive() {

        for (let i = 0; i < width * (width - 4); i++) {
            let fiveCandies = [i, i + width, i + (width * 2), i + (width * 3), i + (width * 4)];
            let desiredImage = candies[i].style.backgroundImage;


            let match = fiveCandies.every(index => desiredImage != "" && candies[index].style.backgroundImage == desiredImage);
            if (match) {
                score += 3;
                fiveCandies.forEach(index => candies[index].style.backgroundImage = "");
            }

        }
    }

    document.getElementById("save_button").addEventListener('click',saveGame);
    function saveGame(){
        let candiesInfo=[];

        candies.forEach(candy=>{
            candiesInfo.push({
                id:candy.getAttribute("id"),
                backgroundImage:candy.style.backgroundImage
            })
        });
        //we are creating an object-key,value pairs-and pushing it in candiesInfo

        console.log(candiesInfo);

        window.localStorage.setItem("board",JSON.stringify(candiesInfo)); //in local storage, data wll always be saved as a string
        //json.stringify-->converts objects into strings
    }
   
    document.getElementById("load_game").addEventListener('click',loadGame);
    function loadGame(){
        let oldBoard=JSON.parse(localStorage.getItem("board"));
        //on clicking the button, we should get the board which was before making
        //any changes

        /**
         * create the board again
         * use-->foreach, getattribute
         */
    }
    function init() {

        checkRow(5);
        checkColforFive();
        checkRow(4);
        checkColforFour();
        checkRow(3);
        checkColforThree();
        generateRandomCandies();

    }
    init();

    window.setInterval(function () {
        init() 
    }, 500);

});