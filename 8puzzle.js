class state {
	g = 0;
  	h = 0;
  	f = 0;

    constructor(board, finalBoard, parent = null) { 
        this.board = board;
        this.finalBoard = finalBoard;
        this.parent = parent;

        if (this.parent != null)
			this.g = this.parent.g+1;

		this.h = this.getH();

		this.f = this.g + this.h;
    }

	manhattan(a, b) {
		return Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1])
	}

	findPosition(board, n) {
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++)
				if (board[i][j] == n)
					return [i, j]
	}

	// Using the supplied heuristic function, Total manhattan distance reguired to move from current state to final
 	getH() {
 		return [ ...Array(8).keys() ].map( i => i+1)
 				.reduce((a,n) => a + this.manhattan(
 					this.findPosition(this.board, n), 
 					this.findPosition(this.finalBoard, n)
 				), 0)
 	}

 	// If there is no distance required to move from current to final this is a winning state
	get isWinningStage() {
		return this.h==0;
	}

	display(fgh=true) {
		let str = fgh ? '\n' : `\nf: ${this.f}, g: ${this.g}, h: ${this.h}\n`;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				str += this.board[i][j] != 0 ? this.board[i][j] : ' ';
				if (j != 2)
					str += ' | '
			}
			if (i != 2)
				str += `\n${'-'.repeat(9)}\n`
		}
		console.log(str)
	}

	getMoves() {
		let i,j;
		// Find position of blank
		[i,j] = this.findPosition(this.board, 0);

		// Get all valid neighbouring spots
		return [{i:i-1, j:j},{i:i+1, j:j},{i:i, j:j-1},{i:i, j:j+1}]
				.filter(a => a.i>=0 && a.i<=2 && a.j>=0 && a.j<=2)
				.map(n => {
					// Get a copy of the board
					let new_board = JSON.parse(JSON.stringify(this.board))

					// Swap blank position with a neighbour
					new_board[i][j] = new_board[n.i][n.j]
					new_board[n.i][n.j] = 0

					// Create new move with the current move set as its parent
					return (new state(new_board, this.finalBoard, this));
		})
	}

	getPath() {
		let clone = Object.assign( Object.create( Object.getPrototypeOf(this)), this)
		let path = []
		while(clone.parent != null){
			path.push(clone)
			clone = clone.parent
		}
		return path.reverse()
	}
}

class queue {
	arr = [];

	constructor() {}

	push(s) {
		this.arr.push(s);
	}

	pop() {
		// Find the element with the smallest f value
		this.arr = this.arr.sort((a,b) => b.f-a.f)
		return this.arr.pop();
	}

	get isEmpty() {
		return this.arr.length==0
	}

	isEqual(b1, b2) {
		return JSON.stringify(b1) == JSON.stringify(b2)
	}

	contains(s) {
		return this.arr.some(a => (this.isEqual(a.board,s.board) && a.f < s.f) ? true : false)
	}

	display() {
		this.arr.map(s => {
			s.display()
			console.log('\n')
		})
	}
}

const Astar = (initial, final) => {
	// Possible states
	let open = new queue();
	// Visitied states
	let closed = new queue();

	let initial_state = new state(initial, final, null);
	open.push(initial_state)

	// Loop until there is no more states
	while(!open.isEmpty) {
		let s = open.pop()

		// Loop over the possible moves in the current state
		for (let move of s.getMoves()) {
 			if (move.isWinningStage)
				return move.getPath()
			// If the move doesnt result in a winning state and hasnt been visited before then add it as a possible move
			if(!open.contains(move) && !closed.contains(move))
				open.push(move)
		}
		// After visiting a state mark it as visisted
		closed.push(s)
	}
}

//Set the Initial and Final state
let initial = [[2,0,4],[1,3,5],[7,8,6]]
let final = [[1,2,3],[8,0,4],[7,6,5]]

// Find the optimal path from initial to final state and display it
Astar(initial, final).forEach(m => m.display())
