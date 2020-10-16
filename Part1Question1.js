(function() {

const S1 = ['A ∨ B', 'A ∧ C', 'C ⇒ D']
const S2 = ['A ∨ ¬B', 'C ∨ D']

const replaceAll = (str, from, to) => str.split(from).join(to)

const getInputs = set => set.map(s => s.split('').filter(c => c.match(/[a-z]/i))).flat().reduce((a,v) => a.includes(v) ? a : a.concat(v), [])

const convert = (input, labels) => input.reduce((a, c, i) => {
	a[labels[i]] = c
	return a
}, {})

const solve = (expr, inputs) => {
	expr = expr.replaceAll(/∨/gi,'||').replaceAll(/∧/gi,'&&').replaceAll(/¬/gi,'!')
	if (expr.includes('⇒')) {
		let sides = expr.split('⇒')
		expr = `!${sides[0]} || ${sides[1]}`
	}
	expr = Object.keys(inputs).reduce((a,v) => replaceAll(a,v,inputs[v]), expr)
	return Boolean(eval(expr))
}

const truthtable = n => {
	if(n==0) {return [[]];}
	let prev = truthtable(n-1);
	return prev.map(x => [true].concat(x)).concat(prev.map(x => [false].concat(x)));
}

const getModels = (set) => {
	let inputs = getInputs(set)
	let table = truthtable(inputs.length)
	return [inputs.concat(set)].concat(table.map(row => convert(row, inputs)).map(i => Object.values(i).concat(set.map(s => solve(s,i)))))
}

console.table(getModels(S1))
console.table(getModels(S2))

})();