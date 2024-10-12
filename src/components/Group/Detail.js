import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import "../../layout/body/body.css";
import Swal from 'sweetalert2';

import { MdDeleteOutline, MdEdit } from "react-icons/md";

import { FaLine } from "react-icons/fa";

const Detail = () => {
    const [groupName, setGroupName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [token, setToken] = useState('');
    const [group_lineId, setGroup_lineId] = useState('');
    const [expire, setExpire] = useState('');
    const [groups, seGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getGroups();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setGroupName(decoded.group_line);
            setExpire(decoded.exp);
            setUserRole(decoded.role);
            setGroup_lineId(decoded.group_lineId);
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
            setGroupName(decoded.group_line);
            setExpire(decoded.exp);
            setUserRole(decoded.role);
            setGroup_lineId(decoded.group_lineId);
        }
        return config;
    }, (error) =>{
        return Promise.reject(error);
    })

    
    const getGroups = async(id) => {     
        console.log("If user");
        const response = await axiosJWT.get(`http://localhost:5000/groups/list/${id}`);
        seGroups(response.data);
    }

    const deleteGroups = async (id) => {
        console.log(`Attempting to delete Group with ID: ${id}`);
    
        // แสดงป็อปอัพ SweetAlert2 เพื่อยืนยันการลบ
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "กลุ่มนี้จะถูกลบและไม่สามารถกู้คืนได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // เริ่มกระบวนการลบ
                    await axios.delete(`http://localhost:5000/groups/delete/${id}`);
                    console.log(`Group with ID: ${id} has been deleted`);
                    
                    // แจ้งเตือนเมื่อการลบสำเร็จ
                    Swal.fire(
                        'ลบสำเร็จ!',
                        'กลุ่มได้ถูกลบเรียบร้อยแล้ว.',
                        'success'
                    );
    
                    // หลังจากลบสำเร็จ ดึงข้อมูลกลุ่มใหม่เพื่ออัปเดตรายการ
                    getGroups();
                } catch (error) {
                    console.error('Error deleting group:', error);
                    
                    // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
                    Swal.fire(
                        'เกิดข้อผิดพลาด!',
                        'ไม่สามารถลบกลุ่มได้ กรุณาลองใหม่อีกครั้ง.',
                        'error'
                    );
                }
            } else {
                // แจ้งเตือนเมื่อผู้ใช้ยกเลิกการลบ
                Swal.fire(
                    'การลบถูกยกเลิก',
                    'กลุ่มของคุณยังคงปลอดภัย :)',
                    'info'
                );
                console.log("Delete operation cancelled by user");
            }
        });
    };

    return (
        <div className='container'>
            <h1><FaLine className='icon'/>ตั้งค่ากลุ่มไลน์</h1>
            <Link to="/dashboard/groups/add" className='btn'>Add New Group</Link>
            <div className='bottom flex'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Group Name</th>
                        <th>createdAt</th>
                        {/* <th>updatedAt</th> */}
                        <th>Line Token</th>
                        <th>group ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <thead>
                    { groups.map((data, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{data.group_line}</td>
                            <td>{format(data.createdAt, 'yyyy-MM-dd HH:mm:ss')}</td>
                            {/* <td>{format(data.updatedAt, 'yyyy-MM-dd HH:mm:ss')}</td> */}
                            <td>{data.line_token}</td>
                            <td>{data.group_lineId}</td>
                            <td>
                                <Link to={`/dashboard/groups/edit/${data.id}` } className="btnEdit" style={{ marginRight: '10px' }}>
                                    <MdEdit className='icon-body' />
                                    Edit
                                </Link>
                                <button onClick={() => deleteGroups(data.id)} className="btnDelete">
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
};

export default Detail;
