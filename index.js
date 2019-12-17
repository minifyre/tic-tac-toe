import truth from '../../node_modules_src/truth/src/index.js'
import v from '../../node_modules_src/v/src/index.js'

const allEqual=(a,b,...more)=>a===b&&(!more.length||allEqual(b,...more))
const getCol=(width,height,arr,x)=>[...Array(height)].map((_,i)=>arr[i*width+x])
const getRow=(width,height,arr,y)=>[...Array(width)].map((_,i)=>arr[y*width+i])

const STATE=
{
	grid:
	[
		null,null,null,
		null,null,null,
		null,null,null
	],
	turn:'x',
	winner:null
}
const resetState=state=>Object.assign(state,JSON.parse(JSON.stringify(STATE)))
const makeMove=(state,i)=>()=>
{
	if(state.winner||state.grid[i]) return//game is over OR non-empty cell

	state.grid[i]=state.turn
	if(doesPlayerWin(state,state.turn)) state.winner=state.turn
	state.turn=
		state.winner?null:
		state.turn==='x'?'o':
		'x'
}
const doesPlayerWin=(state,player)=>
{
	const {grid}=state
	const col=x=>getCol(3,3,grid,x)
	const row=y=>getRow(3,3,grid,y)
	const equal=line=>allEqual(player,...line)

	return (
		(equal(row(0)))||(equal(row(1)))||(equal(row(2)))||//rows
		(equal(col(0)))||(equal(col(1)))||(equal(col(2)))||//cols
		(equal([grid[0],grid[4],grid[8]]))||(equal([grid[2],grid[4],grid[6]]))//diagonals
	)
}
const output=state=>
{
	const [turnLabel,resetLabel]=state.winner
		?[`${state.winner} wins!`,'play again?']
		:[`${state.turn}'s turn`,'restart']
	const header=v.header({},
		turnLabel,
		v.button({on:{click:()=>resetState(state)}},resetLabel)
	)
	const board=v.div({class:'board'},
		...state.grid.map(
			(cell,i)=>v.div({class:'cell',on:{click:makeMove(state,i)}},cell||'')
		)
	)
	return [header,board]
}

const updateView=state=>v.render
(
	document.body,
	output,
	state,
)
const [state]=truth(resetState({}),truth.compile(updateView))