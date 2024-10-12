import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../../layout/Form/form.css"
import { jwtDecode } from 'jwt-decode';

const FromAddDevice = () => {
  const [device_name, setDeviceName] = useState("");
  const [device_id, setDeviceId] = useState("");
  const [user, setUsers] = useState("");
  const [user_id, setSelectedOptionUser] = useState("");
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
        const response = await axios.get('http://localhost:5000/token');
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
    } catch (error) {
        if(error.response){
            navigate('/');
        }
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async(config) =>{
    const currentDate = new Date();
    if(expire * 1000 < currentDate.getTime()){
        const response = await axios.get('http://localhost:5000/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
    }
    return config;
  }, (error) =>{
    return Promise.reject(error);
  })

  const saveDevice = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/devices/add', {
        device_name: device_name,
        device_id: device_id,
        userId: user_id
      });
      navigate("/dashboard/devices/list");
    } catch (error) {
      if(error.response){
        setMsg(error.response.data.msg);
      }
    }
  };

  //ดึงข้อมูลผู้ใช้
  const getUsers = async() => {
    const response = await axiosJWT.get('http://localhost:5000/users/list',{
      headers:{
          Authorization: `Bearer ${token}`
      }
  });
    setUsers(response.data);
  }

  const handleSelectChangeUser = (e) => {
    setSelectedOptionUser(e.target.value);
  };
  console.log(user_id);

  return (
    <div className='containerAdd'>
      <h1 className='title'>
        Device
      </h1>
      <h2 className='subtitle'>
        Add New Devcie
      </h2>
      <div className="card">
        <div className='card-content'>
            <div className="content">
                <form onSubmit={saveDevice}>
                    <p className='ShowMessage'>{msg}</p>
                    <div className="field">
                        <label className='label'>Device Name</label>
                        <div className="control">
                            <input 
                                type="text" 
                                className="input" 
                                value={device_name}
                                onChange={(e) => setDeviceName(e.target.value)}
                                placeholder='Device Name' 
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Device ID</label>
                        <div className="control">
                            <input 
                                type="text" 
                                className="input"
                                value={device_id}
                                onChange={(e) => setDeviceId(e.target.value)}
                                placeholder='Devcie ID' 
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className='label'>User</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                {user.length > 0 ? (
                                    <select id="data-select" value={user_id} onChange={handleSelectChangeUser}>
                                    <option value="">-- Select an User --</option>
                                        {user.map((user) => (
                                            <option key={user.id} value={user.id}>
                                            {user.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : ( 
                                    <select id="data-select" value={user_id} onChange={handleSelectChangeUser}>
                                    <option value="">-- Select an User --</option>
                                    
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

export default FromAddDevice