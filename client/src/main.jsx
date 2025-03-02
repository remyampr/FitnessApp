import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer, toast } from 'react-toastify';
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import 'font-awesome/css/font-awesome.min.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
    <ToastContainer/>
  </StrictMode>,
)
