import React, { useState } from 'react'

// project components
import InputField from '../components/InputField'
import Form from '../components/Form'
import Button from '../components/Button'

const SignUp = () => {
  // handle form field changes
  const [form, setForm] = useState({ username: '', password: '', email: '' })
  const handleChange = event => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }
  // handle form submit
  const handleSubmit = e => {
    e.preventDefault()
    console.log('submitted')
  }

  // form fields
  const fields = [
    {
      name: 'username',
      type: 'text'
    },
    {
      name: 'password',
      type: 'password'
    },
    {
      name: 'email',
      type: 'email'
    }
  ]
  return (
    <>
      <Form className='max-w-xs' onSubmit={handleSubmit} >
        {
          fields.map((field, index) =>
            <div className='mb-4' key={index}>
              <label className='block text-sm font-bold mb-2 text-gray-600 capitalize' htmlFor={field.name}>{field.name}</label>
              <InputField className='w-full' type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} />
            </div>
          )
        }
        <div className='text-center'>
          <Button type='submit' value='Sign Up' />
        </div>
      </Form>
    </>
  )
}

export default SignUp