import truth from '../../node_modules_src/truth/src/index.js'
import v from '../../node_modules_src/v/src/index.js'

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
	check4win(state)
	state.turn=
		state.winner?null:
		state.turn==='x'?'o':
		'x'
}
const check4win=state=>
{
	const {grid}=state
	if(
		//rows
		(grid[0]!==null&&grid[0]===grid[1]&&grid[1]===grid[2])||
		(grid[3]!==null&&grid[3]===grid[4]&&grid[4]===grid[5])||
		(grid[6]!==null&&grid[6]===grid[7]&&grid[7]===grid[8])||
		//cols
		(grid[0]!==null&&grid[0]===grid[3]&&grid[3]===grid[6])||
		(grid[1]!==null&&grid[1]===grid[4]&&grid[4]===grid[7])||
		(grid[2]!==null&&grid[2]===grid[5]&&grid[5]===grid[8])||
		//diagonals
		(grid[0]!==null&&grid[0]===grid[4]&&grid[4]===grid[8])||
		(grid[2]!==null&&grid[2]===grid[4]&&grid[4]===grid[6])
	) state.winner=state.turn
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