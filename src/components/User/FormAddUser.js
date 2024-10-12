import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../../layout/Form/form.css"

const FormAddUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [groupLine, setGroupLine] = useState("");
    const [groupId, setSelectedOptionGroupLine] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getGroups();
    }, []);

    const saveUser = async (e) => {
        e.preventDefault();
        try {
        await axios.post('http://localhost:5000/register', {
            name: name,
            email: email,
            password: password,
            confPassword: confPassword,
            group_line: groupId
        });
        navigate("/dashboard/user/list");
        } catch (error) {
        if(error.response){
            setMsg(error.response.data.msg);
        }
        }
    };

    //ดึงข้อมูลกลุ่มไลน์
    const getGroups = async() => {
        let response = await axios.get('http://localhost:5000/groups/list');
        setGroupLine(response.data);
        console.log(groupLine);
      }
    
      const handleSelectChangeGroupLine = (e) => {
        setSelectedOptionGroupLine(e.target.value);
      };

  return (
    <div className='containerAdd'>
      <h1 className='title'>
        Users
      </h1>
      <h2 className='subtitle'>
        Add New User
      </h2>
      <div className="card">
        <div className='card-content'>
            <div className="content">
                <form onSubmit={saveUser}>
                    <p className='ShowMessage'>{msg}</p>
                    <div className="field">
                        <label className='label'>Name</label>
                        <div className="control">
                            <input 
                                type="text" 
                                className="input" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Name' 
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Email</label>
                        <div className="control">
                            <input 
                                type="text" 
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email' 
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Password</label>
                        <div className="control">
                            <input 
                                type="password" 
                                className="input" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='******' 
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Confirm Password</label>
                        <div className="control">
                            <input 
                                type="password" 
                                className="input" 
                                value={confPassword}
                                onChange={(e) => setConfPassword(e.target.value)}
                                placeholder='******' 
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className='label'>Group Line</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                {groupLine.length > 0 ? (
                                    <select id="data-select" value={groupId} onChange={handleSelectChangeGroupLine}>
                                    <option value="">-- Select an Group Line --</option>
                                        {groupLine.map((group) => (
                                            <option key={group.id} value={group.id}>
                                            {group.group_line}
                                            </option>
                                        ))}
                                    </select>
                                ) : ( 
                                    <select id="data-select" value={groupId} onChange={handleSelectChangeGroupLine}>
                                    <option value="">-- Select an Group Line --</option>
                                    
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="field">
                        <div className="control">
                            <button type='submit' className="btn">Save</button>
                        </div>
                              
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}

export default FormAddUser
