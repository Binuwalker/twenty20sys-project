import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, login } from '../actions/userAction';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector(state => state.authState);

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(login({ email, password }));
        dispatch(loadUser)
    };

    useEffect(() => {
        if(isAuthenticated) {
            navigate('/')
        }
    },[isAuthenticated, navigate])

    return (
        <>
            {loading ? (
                <div className='loader'>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                <div className='formContainer'>
                    <div className='formWrapper'>
                        <span className='logo'><img src='./img/icon.jpg' alt='icon'/></span>
                        <span className='title'>Signin</span>
                        <form onSubmit={handleSubmit}>
                            <div className='inputContainer'>
                                <input
                                    type='email'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>
                            <div className='inputContainer'>
                                <input
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </div>
                            <button type='submit' className='button'>
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;
