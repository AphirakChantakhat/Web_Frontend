import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import "../../layout/Form/form.css"

const FormEditGroup = () => {
    const [line_token, setLineToken] = useState("");
    const [group_line, setGroupLine] = useState("");
    const [group_lineId, setGroup_lineId] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const {id} = useParams();

    const getGroupById = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/groups/detail/${id}`);
            setLineToken(response.data.line_token);
            setGroupLine(response.data.group_line);
            setGroup_lineId(response.data.group_lineId);
        } catch (error) {
            if(error.response){
              setMsg(error.response.data.msg);
            }
        }
    }, [id]);

    useEffect(() => {
        getGroupById();
    }, [getGroupById]);

    const updateGroup = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:5000/groups/edit/${id}`, {
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

    console.log(id);

    return (
        <div className='containerAdd'>
            <h1 className='title'>Group</h1>
            <h2 className='subtitle'>Update Group</h2>
            <div className="card is-shadowless">
                <div className='card-content'>
                    <div className="content">
                        <form onSubmit={updateGroup}>
                            <p className='has-text-centered'>{msg}</p>
                            <div className="field">
                                <label className='label'>Group Name</label>
                                <div className="control">
                                    <input 
                                        type="text" 
                                        className="input" 
                                        name="group_line"
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
                                        name="line_token"
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
                                        name="line_token"
                                        value={group_lineId}
                                        onChange={(e) => setGroup_lineId(e.target.value)}
                                        placeholder='Group ID' 
                                    />
                                </div>
                            </div>
                            
                            <div className="field">
                                <div className="control">
                                    <button type='submit' className="btn">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormEditGroup