import React, { useState } from 'react';
import axios from 'axios';
import '../style/login.css';
import '../style/app.css';
import image from '../assets/carLogin.jpg'; // import assets
import logo from '../assets/Logo.png'; // import assets
import { useNavigate, Link } from 'react-router-dom'; // import Link

// import iconLog
import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const Auth = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/login', {
                email: email,
                password: password
            });
            navigate("/dashboard"); // ใช้ navigate แทน history.push
        } catch (error) {
            if (error.response && error.response.data) {
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <div className='loginPage flex'>
            <div className="container flex">

                <div className="videoDiv">
                    <img src={image} alt="Car" />

                    <div className="textDiv">
                        <h2 className='title'>Accident BOT</h2>
                        <p>service and config</p>
                    </div>

                    <div className="footerDiv flex">
                        <span className='text'>Don't have an account?</span>
                        <Link to="/register">
                            <button className='btn'>Sign Up</button>
                        </Link>
                    </div>
                </div>

                <div className="formDiv flex">
                    <div className="headerDiv">
                        <img src={logo} alt="Logo" />
                        <h3>Login</h3>
                    </div>

                    <form className='form grid' onSubmit={Auth}>
                        {msg && <span className="showMessage">{msg}</span>}

                        <div className="inputDiv">
                            <label htmlFor="email">Email</label>
                            <div className="input flex">
                                <FaUserShield className='iconLog' />
                                <input
                                    type='email'
                                    id='email'
                                    placeholder='Enter Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="password">Password</label>
                            <div className="input flex">
                                <BsFillShieldLockFill className='iconLog' />
                                <input
                                    type='password'
                                    id='password'
                                    placeholder='Enter Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type='submit' className='btn flex'>
                            <span>Login</span>
                            <AiOutlineSwapRight className='iconLog' />
                        </button>

                        <span className='forgotPassword'>
                            Forgot your password? <a href="!#">Click Here</a>
                        </span>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Login;
