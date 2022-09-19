import { useState } from 'react'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import { Snackbar, Alert } from '@mui/material'
import Details from './pages/Details'
import AddStory from "./pages/AddStory";
import UpdateStory from './pages/UpdateStory'
import './App.css'

const App = () => {
  const [snackbar, setsnackbar] = useState(false)
  const [message, setmessage] = useState({
    message : null, 
    severity : null
  })
  const handleSnackOpen = (message, severity) => {
    setmessage((prev) => (
      {
        message : message, 
        severity : severity
      }
    ))
    setsnackbar(true)
  }
  const handleClose = () => {
    setsnackbar(false);
  }
  return (
    <div className='font-display text-secondary'>
      <Snackbar open={snackbar} anchorOrigin={{ vertical : 'top', horizontal: 'center' }} autoHideDuration={6000}>
        <Alert onClose={handleClose} severity={message.severity} sx={{ width: '100%' }}>
          {message.message}
        </Alert>
      </Snackbar>
      <Routes>
        <Route path='/' element={<Home handleSnackOpen = {handleSnackOpen}/>} />
        <Route path='/detail/:newsSlug' element={<Details handleSnackOpen = {handleSnackOpen}/>} />
        <Route path='/add-story' element={<AddStory handleSnackOpen = {handleSnackOpen}/>} />
        <Route path='/update-story/:storySlug' element={<UpdateStory handleSnackOpen = {handleSnackOpen}/>} />
      </Routes>
    </div>
  )
}

export default App