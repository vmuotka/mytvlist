import React, { useState } from 'react'

// project components
import Navigation from './components/Navigation'
import AppRouter from './AppRouter'
import Notification from './components/Notification'

// project context
import { NotificationContext } from './context/notification'

const App = () => {

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
        </>
    )
}

export default App
