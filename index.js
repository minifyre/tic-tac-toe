import truth from '../../node_modules_src/truth/src/index.js'
import v from '../../node_modules_src/v/src/index.js'

const allEqual=(a,b,...more)=>a===b&&(!more.length||allEqual(b,...more))
const getCol=(width,height,arr,x)=>[...Array(height)].map((_,i)=>arr[i*width+x])
const getRow=(width,height,arr,y)=>[...Array(width)].map((_,i)=>arr[y*width+i])

const STATE={x:0,o:0}

const resetState=state=>Object.assign(state,JSON.parse(JSON.stringify(STATE)))
const makeMove=(state,i)=>()=>
{
	//game is not over AND empty cell
	if(!whoWins(state)&&!state2grid(state)[i]) state[whoseTurn(state)]+=2**i
}
const doesPlayerWin=(state,player)=>
{
	const grid=state2grid(state)
	const col=x=>getCol(3,3,grid,x)
	const row=y=>getRow(3,3,grid,y)
	const equal=line=>allEqual(player,...line)

	// todo: these could be identified by flag sums... (e.g. 7,73,273)
	return (
		(equal(row(0)))||(equal(row(1)))||(equal(row(2)))||//rows
		(equal(col(0)))||(equal(col(1)))||(equal(col(2)))||//cols
		(equal([grid[0],grid[4],grid[8]]))||(equal([grid[2],grid[4],grid[6]]))//diagonals
	)
}
const state2grid=state=>[...Array(9)].map((_,i)=>
	state.x&(2**i)?'x':
	state.o&(2**i)?'o':
	null
)
const whoseTurn=state=>
	state2grid(state).filter(cell=>cell==='o').length<state2grid(state).filter(cell=>cell==='x').length
	?'o'
	:'x'
const whoWins=state=>
	doesPlayerWin(state,'x')?'x':
	doesPlayerWin(state,'o')?'o':
	null;

const output=state=>
{
	const winner=whoWins(state)
	const player=whoseTurn(state)
	const [turnLabel,resetLabel]=winner
		?[`${winner} wins!`,'play again?']
		:[`${player}'s turn`,'restart']
	const header=v.header({},
		turnLabel,
		v.button({on:{click:()=>resetState(state)}},resetLabel)
	)
	const board=v.div({class:'board'},
		...state2grid(state).map(
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