(function() {

const tests = [
{
    title: 'Test sample 1',
    rules: [
	    'AvB=>E',
	    'A^B=>D',
	    'D^E=>F',
	    'B^E=>F',
	    'A',
	    'B',
	    'C'
    ],
    inputOutput: [
        {i: 'F', o: 'yes'},
        {i: 'E', o: 'yes'},
        {i: 'D', o: 'yes'},
        {i: 'P', o: 'no'}
    ]
},
{
    title: 'Test sample 2',
    rules: [
	    'A^B^C^D=>F',
	    'BvEvG=>F',
	    'H^I=>A',
	    'J^K=>B',
	    'UvTvW=>J',
	    'I^J^T=>P',
	    'I^J^F=>Q',
	    'H',
	    'I',
	    'K',
	    'D',
	    'W',
	    'C'
    ],
    inputOutput: [
        {i: 'F', o: 'yes'},
        {i: 'A', o: 'yes'},
        {i: 'B', o: 'yes'},
        {i: 'J', o: 'yes'},
        {i: 'P', o: 'no'},
        {i: 'Q', o: 'yes'}
    ]
},
{
    title: 'Test sample 3',
    rules: [
        'a^b=>c',
        'cvd=>f',
        'fvgvhvp=>x',
        'x^y=>z',
        'a',
        'b',
        'y'
    ],
    inputOutput: [
        {i: 'z', o: 'yes'}
    ]
},
]

class node {
	constructor(rule, previousRule = null) {
		this.rule = rule
		this.previousRule = previousRule
	}

	getPath() {
		let clone = Object.assign( Object.create( Object.getPrototypeOf(this)), this)
		let path = [clone.rule]
		while(clone.previousRule){
			path.push(clone.previousRule.rule)
			clone = clone.previousRule
		}
		return path
	}
}

// Checks whether a rule/axion can be directly inferred from the rule list
let solve = (rules, rule) => {
    let lhs = rule.split('=>')[0]
    // Solve AND
    if(lhs.includes('^')){
        return lhs.split('^').every(a => rules.includes(a))
    }
    // Solve OR
    else {
        return lhs.split('v').some(a => rules.includes(a))
    }
}

// Get related rules
const getRules = (P, Q) => {
	if(P.some(p => p.includes(`=>${Q}`))){
		return P.filter(p => p.includes(`=>${Q}`))
	}
	else if (Q.includes('=>')) {
		let children = Q.split('=>')[0].split('').filter(c => !['v','^'].includes(c)).map(q => getRules(P,q)).flat()
		if(Q.includes('v'))
		    return children
		else
		    return [Q, ...children]
	}
	else {
		return [`${Q}`]
	}
}

// Traverse from child node to root and attempt to solve each rule, if a rule is solvable add it to the knowledge base
const backtrackSolve = (rules, n) => n.getPath().reduce((a,v) => {
	if(solve(a,v)){
        if(v.includes('=>') && !a.includes(v.split('=>')[1]))
            return a.concat(v.split('=>')[1])
		else if(!a.includes(v))
			return a.concat(v)
	}
	return a
},rules)

const DFS = (G, s) => {
	let stack = []
	let visited = []

	let goal = new node(s)
	stack.push(goal)
	while(stack.length > 0) {
		v = stack.pop()
		visited.push(v)
		// Loop over rules from current state
		for (let n of getRules(G,v.rule)) {
			let child = new node(n,v)
            // Traverse back up the tree attempting to solve the rules, If a rule is solved add it to the rule list
			 G = backtrackSolve(G,child)
		    // Check if the updated rules contains the goal solution
		    if(G.includes(s))
		        return 'yes'
			// Add to stack if it hasnt been visited prior
			if(!visited.some(a => a.rule == n) && !stack.some(a => a.rule == n))
				stack.push(new node(n,v))
		}
	}
	return 'no'
}

//Run all the tests
tests.forEach(test => console.log(`${test.title}\n${test.rules.join('\n')}\n\nI\tO\tE: \n${test.inputOutput.map(t => `${t.i}\t${DFS(test.rules,t.i)}\t${t.o}`).join('\n')}`))

})();

