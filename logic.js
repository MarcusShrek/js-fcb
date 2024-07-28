// variables are storage of values 
// reusable words with values - reusable names that represnt
let board;
let score = 0;
let rows = 4;
let columns = 4;

// This variable will be usd to assure that the player, will be ongratulated, only one time after reaching 2048, 4096, or 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

let startX = 0;
let startY = 0;


//functions -  reusable tasks
function setGame(){

	board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
	// ]; Goal, we will use this backend board to create our frontend board.

	// loops are code to repeat the tasks inside it, until it fulfill /  completed the whole task (in our context, until our board will have a tile with there proper colors)

	for(let r=0; r < rows; r++){

		for(let c=0; c < columns; c++){
			// create and design a tile

			// create tile
			let tile = document.createElement("div");


			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c];

			updateTile(tile, num);

			// bunso(walis);

			document.getElementById("board").append(tile)
		}
		
	}
		setTwo();
		setTwo();
}

// updateTile() - updates the appearance of the tile (that it should have tile number and background color)
function updateTile(tile, num){

	tile.innerText = "";
	tile.classList.value = "";

	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num.toString();

		if(num <= 4096){
			tile.classList.add("x" + num.toString());
		}
		else{
			tile.classList.add("x8192")
		}
	}

}	


window.onload = function(){
	setGame();
}

function handleSlide(event){
	console.log(event.code);  // event.code - is the pressed key in our keyboard

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code));{



		event.preventDefault();
	}

	if(event.code == "ArrowLeft"){
		slideLeft();
		setTwo();
	}
	else if(event.code == "ArrowRight"){
		slideRight();
		setTwo();
	}
	else if(event.code == "ArrowUp"){
		slideUp();
		setTwo();
	}
	else if(event.code == "ArrowDown"){
		slideDown();
		setTwo();
	}
	checkWin();

	if(hasLost() == true){
		alert("Game Over! You have lost the game. Game will restart")
		restartGame();
		alert("Click any arro key to restart")
	}

document.getElementById("score").innerText = score
	
}


document.addEventListener("keydown", handleSlide);



function filterZero(row){
	return row.filter(num => num != 0);
}


function slideLeft(){

	for(let r=0; r<rows; r++){

		let row = board[r];

		let originalRow = row.slice();

		row = slide(row);

		board[r] = row;
		

		for(let c = 0; c<columns; c++){
			// this code is the retriebe our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalRow[c] !== num && num!==0){
				
				tile.style.animation = "slide-from-right 0.3s"
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}
			// updates the appearance of the tile
			updateTile(tile, num);


		}
	}
}

function slideRight(){

	for(let r=0; r<rows; r++){

		let row = board[r]; // slideRight() function uses slide() function to merge tiles with the same 

		let originalRow = row.slice();
		row.reverse();
		row = slide(row);
		row.reverse();

		board[r] = row;

		for(let c = 0; c<columns; c++){
			// this code is the retriebe our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalRow[c] !== num && num!==0){
				
				tile.style.animation = "slide-from-left 0.3s"
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}

			// updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}


function slideUp(){

	for(let c=0; c<columns; c++){

		let col = [ board[0][c], board[1][c], board[2][c], board[3][c] ];

		let originalCol = col.slice();
		col = slide(col); // slideUp() function uses slide() function to merge tiles with the same values.

		let changeIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}
		
		for(let r = 0; r<rows; r++){

			board[r][c] = col[r];

			// this code is the retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

			if(changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

			// Updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

function slideDown(){

	for(let c=0; c<columns; c++){

		let col = [ board[0][c], board[1][c], board[2][c], board[3][c] ];

		let originalCol = col.slice();

		col.reverse();
		col = slide(col);
		col.reverse(); // slideDown() function uses slide() function to merge tiles with the same values.

		let changeIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}

		for(let r = 0; r<rows; r++){

			board[r][c] = col[r];

			// this code is the retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());

			let num = board[r][c];

			// Animation Code:
			if(changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}
			
			// Updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

// slide function
// ore function for sliding and merging tiles
function slide(row){
	// 0 2 2 0
	row = filterZero(row);
	// 2 2
	for(let i = 0; i<row.length - 1; i++){
		if(row[i] == row[i+1]){
			row[i] *= 2; // 4 2
			row[i+1] = 0; // 4 0
			score += row[i];
		}
	}

	while(row.length < columns){
		row.push(0);
	}

	return row;

}
// hasEmptyTile checks the game board if it contains an empty (zero) tiles.
function hasEmptyTile(){

	// loop
	for(let r=0; r<rows; r++){
		for(let c=0; c<rows; c++){
			if(board[r][c]==0){
				return true;
			}
		}
	}

	return false;
}

function setTwo(){

	if(hasEmptyTile() == false){
		return; //"I will do nothing, I don't need to generate a new tile"
	}

	// the codes below are the codes to be executed once the condition above is not satisfied.

	let found = false;

	while(!found){
		// This is to generate a random row and column position to generate a random tile, and generate a random 2 tile.
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		// if the random tile is an empty tile, the program will make it a tile with number 2.
		if(board[r][c]==0){

			// the radlm vacant becomes 2
			board[r][c] = 2;

			let tile = document.getElementById(r.toString() + "-" + c.toString());

			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}

	}
}
function checkWin(){
	for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){

			if(board[r][c] == 2048 && is2048Exist == false){
				alert("Congratulations! You got 2048")
				is2048Exist = true;
			}
			if(board[r][c] == 4096 && is4096Exist == false){
				alert("Amazing! You reached 4096")
				is4096Exist = true;
			}
			if(board[r][c] == 8192 && is8192Exist == false){
				alert("Incredible! You reached 8192")
				is8192Exist = true;
			}
		}
	}	
}

function hasLost(){
	for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){

			if(board[r][c]==0){
				return false;
			}

			const currentTile = board[r][c];

			if(
				// Check the current tile if it has a possible megre in its upper tile
				r > 0 && board[r-1][c] === currentTile ||
				// check the current tile if it has a possible  merge in the lower tile
				r < rows - 1 && board[r+1][c] === currentTile ||
				c > 0 && board[r][c-1] === currentTile ||
				c < columns - 1 && board[r][c+1] === currentTile
			){
				return false;
			}
		}
	}

	return true;
}

// RestartGame by replacing all values into zero.
function restartGame(){
	// this loop is responsible to change each tile values to zero
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }

    score = 0;

    setTwo()    // new tile   
}

document.addEventListener('touchstart', (event) =>{
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
})

document.addEventListener('touchend', (event) =>{

	if(!event.target.className.includes("tile")){
		return; // "I will do nothing, since you haven't touched a tile"
	}

	// touchstart - touchend
	let diffX = startX - event.changedTouches[0].clientX;
	let diffY = startY - event.changedTouches[0].clientY;

	if(Math.abs(diffX) > Math.abs(diffY)){
		if(diffX > 0 ){
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	else{

		if(diffY > 0){
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	checkWin();

	if(hasLost() == true){
		alert("Game Over! You have lost the game. Game will restart");
		restartGame();
		alert("Click any arrow key to restart");
	}
		


});

document.addEventListener('touchmove', (event)=>{
	if(!event.target.className.includes("tile")){
		return;
	}

	event.preventDefault();

}, {passive: false}); // Use passive: false, to make 