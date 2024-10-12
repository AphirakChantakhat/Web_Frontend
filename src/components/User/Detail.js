import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import "../../layout/body/body.css";
import { PiUserListBold   } from "react-icons/pi"
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import Swal from 'sweetalert2';

const Detail = () => {
    const [name, setName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getUsers();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            setUserRole(decoded.role);
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
            setUserRole(decoded.role);
        }
        return config;
    }, (error) =>{
        return Promise.reject(error);
    })

    const getUsers = async() => {
        const response = await axiosJWT.get('http://localhost:5000/users/list',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        setUsers(response.data);
    }

    const deleteUser = async (id) => {
        // แสดงป็อปอัพเพื่อยืนยันการลบ
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "บัญชีจะถูกลบและไม่สามารถกู้คืนได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // ลบผู้ใช้
                    await axios.delete(`http://localhost:5000/users/delete/${id}`);
                    
                    // แจ้งเตือนเมื่อการลบสำเร็จ
                    Swal.fire(
                        'ลบสำเร็จ!',
                        'บัญชีได้ถูกลบเรียบร้อยแล้ว.',
                        'success'
                    );
    
                    // อัปเดตรายการผู้ใช้
                    getUsers();
                } catch (error) {
                    console.error('Error deleting user:', error);
    
                    // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
                    Swal.fire(
                        'เกิดข้อผิดพลาด!',
                        'ไม่สามารถลบผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง.',
                        'error'
                    );
                }
            } else {
                // แจ้งเตือนเมื่อผู้ใช้ยกเลิกการลบ
                Swal.fire(
                    'การลบถูกยกเลิก',
                    'บัญชียังคงอยู่ในระบบ :)',
                    'info'
                );
            }
        });
    };
    
    if(userRole == '1'){
        return (
            <div className='container'>
                <h1><PiUserListBold  className='icon'/>ตั้งค่าผู้ใช้งาน</h1>
                <Link to="/dashboard/user/add" className='btn'>
                    Add New User
                </Link>
                <div className='bottom flex'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <thead>
                        { users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role == 1 ?"Admin":"User"}</td>
                                <td>
                                    <Link to={`/dashboard/user/edit/${user.id}` } className="btnEdit" style={{ marginRight: '10px' }}>
                                        <MdEdit className='icon-body' />
                                        Edit
                                    </Link>
                                    <button onClick={() => deleteUser(user.id)} className="btnDelete">
                                        <MdDeleteOutline className='icon-body' />
                                        Delete
                                    </button>
                                </td>
                        </tr>
                        ))}
                        
                    </thead>
                </table>
                </div>
            </div>
    
        );
    }else{
        return (
            <div className='container'>
                <h1><PiUserListBold  className='icon'/>ตั้งค่าผู้ใช้งาน</h1>
                <div className='bottom flex'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <thead>
                        { users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role == 1 ?"Admin":"User"}</td>
                        </tr>
                        ))}
                        
                    </thead>
                </table>
                </div>
            </div>
    
        );
    }
    
};

export default Detail;
