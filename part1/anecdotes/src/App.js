import { useState } from 'react'

const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [winner, setWinner] = useState(0)

  const newSelected = () => {
    let r = getRandom(0, anecdotes.length)
    if (r === selected) {
      r = getRandom(0, anecdotes.length)
      // not trying more than twice
    }
    setSelected(r)
  }

  const voteSelected = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)

    console.log("winner is ", winner, " points ", copy[winner])
    console.log("selected is is ", selected, " points ", copy[selected])
    if(copy[selected] > copy[winner]){
      setWinner(selected)
    }
  }


  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      <br />
      <p>Number of votes for this anecdote: {points[selected]}</p>
      <br />
      <Button handleClick={voteSelected} text="vote for this anecdote" />
      <br />
      <Button handleClick={newSelected} text="next anecdote" />
      <h1>Anecdote with most votes:</h1>
      {anecdotes[winner]}
    </div>
  )
}

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}


export default App