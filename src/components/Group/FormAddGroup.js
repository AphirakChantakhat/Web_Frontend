import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "../../layout/Form/form.css"

const FromAddGroup = () => {
  
  const [group_line, setGroupLine] = useState("");
  const [line_token, setLineToken] = useState("");
  const [group_lineId, setGroup_lineId] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const saveGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/groups/add', {
        group_line: group_line,
        line_token: line_token,
        group_lineId: group_lineId
      });
      navigate("/dashboard/groups/list");
    } catch (error) {
      if(error.response){
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div className='containerAdd'>
        <h1 className='title'>
        Group
      </h1>
      <h2 className='subtitle'>
        Add New Group
      </h2>
      <div className="card">
        <div className='card-content'>
            <div className="content">
                <form onSubmit={saveGroup}>
                  <p className='ShowMessage'>{msg}</p>
                    <div className="field">
                        <label className='label'>Group Name</label>
                        <div className="control">
                            <input 
                              type="text" 
                              className="input" 
                              value={group_line}
                              onChange={(e) => setGroupLine(e.target.value)}
                              placeholder='Group Name' 
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Line Token</label>
                        <div className="control">
                            <input 
                              type="text" 
                              className="input" 
                              value={line_token}
                              onChange={(e) => setLineToken(e.target.value)}
                              placeholder='Line Token' 
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className='label'>Group ID</label>
                        <div className="control">
                            <input 
                              type="text" 
                              className="input" 
                              value={group_lineId}
                              onChange={(e) => setGroup_lineId(e.target.value)}
                              placeholder='Group ID' 
                            />
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

export default FromAddGroup;