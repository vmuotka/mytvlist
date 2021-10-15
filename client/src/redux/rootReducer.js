import { combineReducers } from 'redux'

import userReducer from './userReducer'
import profileReducer from './profileReducer'

const rootReducer = combineReducers({
    user: userReducer,
    profile: profileReducer
})

export default rootReducer