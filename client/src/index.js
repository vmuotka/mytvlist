import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './assets/main.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux'
import store from './store'

ReactDOM.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <Router >
                <App />
            </Router>
        </ReduxProvider>
    </React.StrictMode>,
    document.getElementById('root')
)