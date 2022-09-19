import ReactDOMClient from 'react-dom/client'
import App from './App.js'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
const root = ReactDOMClient.createRoot(document.getElementById('root'))

root.render(
    <BrowserRouter >
        <App />
    </BrowserRouter>
)