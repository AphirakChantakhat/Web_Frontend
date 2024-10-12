import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import "../../layout/body/body.css";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import Swal from 'sweetalert2';

const Detail = () => {
    const [deviceId, setDeviceId] = useState([]);
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [devices, setDevices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    useEffect(() => {
        if (userId && userRole) {
            getDevices(userId);
        }
    }, [userId, userRole]);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setDeviceId(decoded.device_id);
            setName(decoded.name);
            setExpire(decoded.exp);
            setUserRole(decoded.role);
            setUserId(decoded.userId);
        } catch (error) {
            if (error.response) {
                navigate('/');
            }
        }
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setDeviceId(decoded.device_id);
            setName(decoded.name);
            setExpire(decoded.exp);
            setUserRole(decoded.role);
            setUserId(decoded.userId);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getDevices = async (id) => {
        const response = await axiosJWT.get(`http://localhost:5000/devices/list/${id}`);
        setDevices(response.data);
    };

    const deleteDevice = async (id) => {
        console.log(`Attempting to delete device with ID: ${id}`);
    
        // แสดงป็อปอัพ SweetAlert2 เพื่อยืนยันการลบ
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "อุปกรณ์นี้จะถูกลบและไม่สามารถกู้คืนได้!",
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
                    await axios.delete(`http://localhost:5000/devices/delete/${id}`);
                    getDevices(userId); // เรียกใช้งาน getDevices ด้วย userId
                    console.log(`Device with ID: ${id} has been deleted`);
                    
                    // แจ้งเตือนเมื่อการลบสำเร็จ
                    Swal.fire(
                        'ลบสำเร็จ!',
                        'อุปกรณ์ได้ถูกลบเรียบร้อยแล้ว.',
                        'success'
                    );
    
                    // หลังจากลบสำเร็จ ดึงข้อมูลอุปกรณ์ใหม่เพื่ออัปเดตรายการ
                    getDevices(userId);
                } catch (error) {
                    console.error('Error deleting device:', error);
                    
                    // แจ้งเตือนเมื่อเกิดข้อผิดพลาด
                    Swal.fire(
                        'เกิดข้อผิดพลาด!',
                        'ไม่สามารถลบอุปกรณ์ได้ กรุณาลองใหม่อีกครั้ง.',
                        'error'
                    );
                }
            } else {
                // แจ้งเตือนเมื่อผู้ใช้ยกเลิกการลบ
                Swal.fire(
                    'การลบถูกยกเลิก',
                    'อุปกรณ์ของคุณยังคงปลอดภัย :)',
                    'info'
                );
                console.log("Delete operation cancelled by user");
            }
        });
    };

    if(userRole == '1'){
        return (

            <div className='container'>
                <h1><IoSettingsOutline className='icon' />ตั้งค่าอุปกรณ์</h1>
                <Link to="/dashboard/devices/add" className='btn'>Add New Device</Link>
                <div className='bottom flex'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Device Name</th>
                                <th>Device id</th>
                                <th>Active status</th>
                                <th>Created At</th>
                                <th>User Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((data, index) => (
                                <tr key={data.device_id}> {/* ใช้ data.device_id แทน devices.id */}
                                    <td>{index + 1}</td>
                                    <td>{data.device_name}</td>
                                    <td>{data.device_id}</td>
                                    <td>{data.active_status === 1 ? "ใช้งาน" : "ไม่ใช้งาน"}</td>
                                    <td>{format(new Date(data.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
                                    {/* ตรวจสอบว่ามี user ก่อนที่จะเข้าถึง name */}
                                    <td>{data.user?.name || "ไม่ทราบชื่อผู้ใช้"}</td>
                                    <td>
                                        <Link to={`/dashboard/devices/edit/${data.id}`} className="btnEdit" style={{ marginRight: '10px' }}>
                                            <MdEdit className='icon-body' />
                                            Edit
                                        </Link>
                                        <button onClick={() => deleteDevice(data.id)} className="btnDelete">
                                            <MdDeleteOutline className='icon-body' />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }else{
        return (
            <div className='container'>
                <h1><IoSettingsOutline className='icon' />อุปกรณ์</h1>
                <div className='bottom flex'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Device Name</th>
                                <th>Device id</th>
                                <th>Active status</th>
                                <th>Created At</th>
                                <th>User Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((data, index) => (
                                <tr key={data.device_id}> {/* ใช้ data.device_id แทน devices.id */}
                                    <td>{index + 1}</td>
                                    <td>{data.device_name}</td>
                                    <td>{data.device_id}</td>
                                    <td>{data.active_status === 1 ? "ใช้งาน" : "ไม่ใช้งาน"}</td>
                                    <td>{format(new Date(data.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
                                    <td>{data.user.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};

export default Detail;
