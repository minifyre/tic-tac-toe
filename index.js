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
	check4win(state)
	state.turn=
		state.winner?null:
		state.turn==='x'?'o':
		'x'
}
const check4win=state=>
{
	const {grid}=state
	const col=x=>getCol(3,3,grid,x)
	const row=y=>getRow(3,3,grid,y)

	if(
		//rows
		(grid[0]!==null&&allEqual(...row(0)))||
		(grid[3]!==null&&allEqual(...row(1)))||
		(grid[6]!==null&&allEqual(...row(2)))||
		//cols
		(grid[0]!==null&&allEqual(...col(0)))||
		(grid[1]!==null&&allEqual(...col(1)))||
		(grid[2]!==null&&allEqual(...col(2)))||
		//diagonals
		(grid[0]!==null&&allEqual(grid[0],grid[4],grid[8]))||
		(grid[2]!==null&&allEqual(grid[2],grid[4],grid[6]))
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