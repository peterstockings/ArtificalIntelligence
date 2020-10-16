const romania = {
	'Oradea': 		  {'Zerind': 71, 'Sibiu': 151}, 
	'Zerind': 	      {'Oradea': 71, 'Arad': 75},
	'Arad':   		  {'Zerind': 75, 'Sibiu': 140, 'Timisoara': 118},
	'Timisoara': 	  {'Arad': 118, 'Lugoj': 111},
	'Sibiu': 		  {'Arad': 140, 'Oradea': 151, 'Fagaras': 99, 'Rimnicu Vilcea': 80},
	'Fagaras': 		  {'Sibiu': 99, 'Bucharest': 211},
	'Rimnicu Vilcea': {'Sibiu': 80, 'Pitesti': 97, 'Craiova': 146},
	'Lugoj':          {'Timisoara': 111, 'Mehadia': 70},
	'Mehadia':        {'Lugoj': 70, 'Dobreta': 75},
	'Dobreta':        {'Mehadia': 75, 'Craiova': 120},
	'Craiova':        {'Dobreta': 120, 'Rimnicu Vilcea': 146, 'Pitesti': 138},
	'Pitesti':        {'Craiova': 138, 'Rimnicu Vilcea': 97, 'Bucharest': 101},
	'Bucharest':      {'Pitesti': 101, 'Giurgiu': 90, 'Fagaras': 211, 'Urziceni': 85},
	'Giurgiu':        {'Bucharest': 90},
	'Urziceni':       {'Bucharest': 85, 'Hirsova': 98, 'Vaslui': 142},
	'Hirsova':        {'Urziceni': 98, 'Eforie': 86},
	'Eforie':         {'Hirsova': 86},
	'Vaslui':         {'Urziceni': 142, 'Iasi': 92},
	'Iasi':           {'Vaslui': 92, 'Neamt': 87},
	'Neamt':          {'Iasi': 87},
}

class queue {
	arr = [];

	constructor() {}

	push(s) {
		this.arr.push(s);
	}

	pop() {
		// Find the element with the smallest cost value
		this.arr = this.arr.sort((a,b) => b.cost-a.cost)
		return this.arr.pop();
	}

	get isEmpty() {
		return this.arr.length==0
	}

	contains(s) {
		return this.arr.some(a => (a.name == s.name && a.cost < s.cost) ? true : false)
	}
}

class node {
	constructor(graph, name, previous) {
		this.name = name
		this.previous = previous
		//Calculate cumulative distance from start to location with name
		if (this.previous)
			this.cost  = graph[previous.name][name] + previous.cost
		else
			this.cost = 0
	}

	// As each node has a link to its parent, traversing and reversing the resultant array gives the path from start to end
	getPath() {
		let clone = Object.assign( Object.create( Object.getPrototypeOf(this)), this)
		let distance = clone.cost
		let path = []
		while(clone.previous){
			path.push(clone.name)
			clone = clone.previous
		}
		return {path: path.reverse(), distance}
	}
}


const uniformCostSearch = (graph, start, end) => {
	if (!graph || !graph[start] || !graph[end])
		throw `Invalid input!`;

	let frontier = new queue();
	let explored = new queue();

	let start_node = new node(graph, start, null);
	frontier.push(start_node)

	while(!frontier.isEmpty) {
		// Get unexplored node with lowest cost
		let n = frontier.pop()
		explored.push(n)
		// Check if optimal path from start to end
		if (n.name == end)
			// Return path and total cost
			return n.getPath();
		else
			// Loop over possible actions from current state
			for (let child of Object.keys(graph[n.name])) {
				// child_state = Action(old_state)
				let child_node = new node(graph, child, n)
				if(!frontier.contains(child_node) && !explored.contains(child_node))
					frontier.push(child_node)
			}
	}

	throw `Unable to find path from ${start} to ${end}`;
}

// Calculate optimal path from start to end in graph
uniformCostSearch(romania, 'Oradea', 'Neamt')