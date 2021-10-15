import { createStore } from 'redux'
import rootReducer from './redux/rootReducer'

let preloadedState
const persistedUser = JSON.parse(localStorage.getItem('user'))

if (persistedUser) {
    preloadedState = {
        user: persistedUser
    }
}

const store = createStore(rootReducer, preloadedState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store