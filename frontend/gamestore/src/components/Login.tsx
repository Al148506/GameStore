import React from 'react'
import '../styles/Login.css'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div>
        <div className='card'>
            <form>
                <div className='mb-3'>
                    <label htmlFor="exampleInputEmail" className='form-label'>Email</label>
                    <input type="email" className='form-control' id='exampleInputEmail' aria-describedby='emailHelp'/>
                    <div id = 'emailHelp' className='form-text'>We never share your email</div>
                </div>
                <div className='mb-3'>
                    <label htmlFor="exampleInputPassword" className='form-label'>Password</label>
                    <input type="password" className='form-control' id='exampleInputPassword'/>
                </div>
                <div className='mb-3 form-check'>
                    <input type="checkbox" className='form-check-input' id='exampleCheck'/>
                    <label htmlFor="exampleCheck" className='form-check-label'>Remember me</label>
                </div>
                <button type='submit' className='btn btn-primary'>Submit</button>
                <p className='text-center mt-3'>
                    Don't have an account? {''}
                    <Link to='/register' className='btn btn-link'> Register</Link>
                </p>
            </form>
        </div>
    </div>
  )
}

export default Login