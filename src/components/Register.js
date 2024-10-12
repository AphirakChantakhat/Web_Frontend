import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import '../style/register.css';
import '../style/app.css';
import image from '../assets/carLogin.jpg'; // import assets

// import icon
import { FaUserShield } from 'react-icons/fa';
import { BsFillShieldLockFill } from 'react-icons/bs';
import { AiOutlineSwapRight } from 'react-icons/ai';
import { MdMarkEmailRead } from 'react-icons/md';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [role, setRole] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate(); // ใช้ useNavigate

    const Register = async(e) =>{
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', {
                name: name,
                email: email,
                password: password,
                confPassword: confPassword,
                role: role
            });
            navigate("/"); // ใช้ navigate แทน history.push
        } catch (error) {
            if(error.response && error.response.data){
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <div className='registerPage flex'>
        <div className="container flex">

            <div className="videoDiv">
            <img src={image} alt="Car" />

            <div className="textDiv">
                <h2 className='title'>Accident BOT</h2>
                <p>service and config</p>
            </div>

            <div className="footerDiv flex">
                <span className='text'>Have an account?</span>
                <Link to={'/'}>
                <button className='btn'>Login</button>
                </Link>
            </div>
            </div>

            <div className="formDiv flex">
            <div className="headerDiv">
                <h3>Create account</h3>
            </div>

            <form action="" className='form grid' onSubmit={ Register }>
                {msg && <span className="showMessage">{msg}</span>}
                
                <div className="inputDiv">
                    <label htmlFor="username">Username</label>
                    <div className="input flex">
                        <FaUserShield className='iconLog'/>
                        <input type='text' 
                            id='username' 
                            placeholder='Enter Username' 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="inputDiv">
                    <label htmlFor="email">Email</label>
                    <div className="input flex">
                        <MdMarkEmailRead className='iconLog'/>
                        <input type='email' 
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
                        <BsFillShieldLockFill className='iconLog'/>
                        <input type='password' 
                            id='password' 
                            placeholder='Enter Password' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="inputDiv">
                    <label htmlFor="password">Confrim Password</label>
                    <div className="input flex">
                        <BsFillShieldLockFill className='iconLog'/>
                        <input type='password' 
                            id='password' 
                            placeholder='Enter Password' 
                            value={confPassword}
                            onChange={(e) => setConfPassword(e.target.value)}
                        />
                    </div>
                </div>
                
                <button type='submit' className='btn flex'>
                    <span>Register</span>
                    <AiOutlineSwapRight className='iconLog'/>
                </button>

            </form>
            </div>

        </div>
    </div>
    )
}

export default Register;
