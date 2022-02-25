import React, { useState } from 'react'

// project components
import Navigation from './components/Navigation'
import AppRouter from './AppRouter'
import Notification from './components/Notification'

// project context
import { AuthContext } from './context/auth'
import { NotificationContext } from './context/notification'

const App = () => {
    let existingTokens = JSON.parse(localStorage.getItem('tokens'))

    let decodedToken = existingTokens ? JSON.parse(window.atob(existingTokens.token.split('.')[1])) : null

    if (decodedToken && Date.now() >= decodedToken.exp * 1000) {
        existingTokens = null
        decodedToken = null
        localStorage.removeItem('tokens')
    }

    const [authTokens, setAuthTokens] = useState(existingTokens)

    const setTokens = (data) => {
        localStorage.setItem('tokens', JSON.stringify(data))
        setAuthTokens(data)
    }

    const [notifications, setNotifications] = useState([])

    const addNotification = (data) => {
        for (let i = 0; i < data.length; i++)
            data[i].id = Math.floor(Math.random() * 999999)
        setNotifications([
            ...data, ...notifications
        ])
    }
    const removeNotification = (id) => {
        const temp = notifications.filter(notification => notification.id !== id)
        setNotifications(temp)
    }

    return (
        <>
            <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }} >
                <NotificationContext.Provider value={{ notifications, setNotifications: addNotification, removeNotification }} >
                    <div className='fixed right-0 mt-20'>
                        {notifications.map((notification, index) =>
                            <Notification key={index} {...notification} />
                        )}
                    </div>
                    <Navigation>
                        <main className='mb-8 mx-4'>
                            <AppRouter />
                        </main>
                    </Navigation>
                </NotificationContext.Provider>
            </AuthContext.Provider>
        </>
    )
}

export default App
