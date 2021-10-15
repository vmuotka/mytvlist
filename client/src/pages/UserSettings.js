import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

// project components
import Form, { FormGroup } from '../components/Form'
import InputField from '../components/InputField'
import Divider from '../components/Divider'
import Button from '../components/Button'
import userService from '../services/userService'
import Spinner from '../components/Spinner'
import Dots from '../components/icons/Dots'
import { useNotification } from '../context/notification'
import Heading from '../components/Heading'


const UserSettings = ({ user }) => {
    const { setNotifications } = useNotification()
    const [loadingSettings, setLoadingSettings] = useState(true)
    const [saving, setSaving] = useState(false)
    const [newPassword, setNewPassword] = useState({
        old_password: '',
        value: '',
        confirm: '',
        error: false
    })
    const [quote, setQuote] = useState({
        value: '',
        character: '',
        source: ''
    })

    const handlePasswordChange = (e) => {
        const value = e.target.value
        const name = e.target.name

        setNewPassword({
            ...newPassword,
            [name]: value
        })
    }

    useEffect(() => {
        const getSettings = async () => {
            const res = await userService.getSettings()
            if (res.quote)
                setQuote(res.quote)

            setLoadingSettings(false)
        }
        getSettings()
    }, [user])

    useEffect(() => {
        if ((newPassword.value !== newPassword.confirm || newPassword.value.length < 5) && newPassword.value.length > 0 && newPassword.confirm.length > 0)
            setNewPassword({
                ...newPassword,
                error: true
            })
        else
            setNewPassword({
                ...newPassword,
                error: false
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newPassword.value, newPassword.confirm, setNewPassword])

    const handleQuoteChange = (e) => {
        const value = e.target.value
        const name = e.target.name

        setQuote({
            ...quote,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        const settings = {
            new_password: (!newPassword.error && newPassword.value.length >= 5) && newPassword,
            quote
        }

        try {
            const res = await userService.saveSettings(settings)
            setNotifications(res)
        } catch (e) {
            setNotifications({ title: 'There was an error.', type: 'error' })
        }
        setSaving(false)
    }

    return (
        <>
            {
                loadingSettings ?
                    <Spinner className='mx-auto mt-4' color='bg-pink-500' show={true} />
                    :
                    <div className='w-full md:w-3/5 md:max-w-3xl mx-auto mt-3'>
                        <Heading className='text-center'>Discover</Heading>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup groupName='Change Password'>
                                <InputField
                                    label='New Password'
                                    type='password'
                                    value={newPassword.value}
                                    onChange={handlePasswordChange}
                                    name='value'
                                    className={newPassword.error && 'border-red-500'}
                                    minLength={5}
                                />
                                <div className='text-gray-500 text-sm italic mx-3'>
                                    Password must be atleast 5 characters long.
                                </div>
                                <InputField
                                    label='Confirm New Password'
                                    type='password'
                                    value={newPassword.confirm}
                                    onChange={handlePasswordChange}
                                    name='confirm'
                                    className={newPassword.error && 'border-red-500'}
                                    minLength={5}
                                />
                                {
                                    newPassword.error &&
                                    <div className='text-red-500'>
                                        Passwords do not match.
                                    </div>
                                }
                                {
                                    newPassword.value.length > 0 &&
                                    <InputField
                                        label='Old Password'
                                        type='password'
                                        value={newPassword.old_password}
                                        onChange={handlePasswordChange}
                                        name='old_password'
                                    />
                                }
                            </FormGroup>
                            <Divider />
                            <FormGroup groupName='Profile'>
                                <InputField
                                    label='Favorite Quote'
                                    value={quote.value}
                                    onChange={handleQuoteChange}
                                    name='value'
                                />
                                <div className='lg:flex justify-between gap-4'>
                                    <div className='flex flex-col lg:w-2/3'>
                                        <InputField
                                            label='By character'
                                            value={quote.character}
                                            onChange={handleQuoteChange}
                                            name='character'
                                        />
                                    </div>
                                    <div className='flex flex-col lg:w-1/3'>
                                        <InputField
                                            label='Source'
                                            value={quote.source}
                                            onChange={handleQuoteChange}
                                            name='source'
                                        />
                                    </div>
                                </div>
                            </FormGroup>
                            <Button
                                className='w-full py-2 text-xl mt-6 flex justify-center'
                                type='submit'
                            >{saving ? <Dots className='h-7' /> : 'Save'}</Button>
                        </Form>
                    </div>}
        </>
    )
}

const mapProps = (state) => {
    return {
        user: state.user
    }
}

const connectedUserSettings = connect(mapProps)(UserSettings)

export default connectedUserSettings