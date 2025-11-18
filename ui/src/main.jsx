import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = document.querySelector('#root')
if (!root) throw new Error('Failed to find the root element')
createRoot(root).render(<App />)
