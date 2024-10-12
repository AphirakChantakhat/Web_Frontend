import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import "../../layout/body/body.css";
import { RiFolderHistoryLine } from "react-icons/ri";
import '../../style/detail.css';

const Detail = () => {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [historys, setHistorys] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(12);

    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    useEffect(() => {
        if (userId && userRole) {
            getHistorys(userId, userRole);
        }
    }, [userId, userRole]);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
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
            setName(decoded.name);
            setExpire(decoded.exp);
            setUserRole(decoded.role);
            setUserId(decoded.userId);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getHistorys = async (userId, userRole) => {
        if (userRole == 1) {
            let response = await axiosJWT.get('http://localhost:5000/historys');
            setHistorys(response.data);
        } else {
            const response = await axiosJWT.get(`http://localhost:5000/historys/${userId}`);
            setHistorys(response.data);
        }
    };

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = historys.slice(indexOfFirstPost, indexOfLastPost);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <h1><RiFolderHistoryLine className='icon' />ประวัติการเกิดอุบัติเหตุ</h1>
            <div className='bottom flex'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Time</th>
                            <th>Device ID</th>
                            <th>แผนที่</th>
                            <th>Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historys.slice(startIndex, endIndex).map((data, index) => (
                            <tr key={index}>
                                {/* ปรับให้ index เริ่มตามลำดับจริง */}
                                <td>{startIndex + index + 1}</td>
                                <td>{format(new Date(data.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
                                <td>{data.fk_device_id}</td>
                                <td>
                                    <a 
                                        href={`https://www.google.com/maps?q=${data.latitude},${data.longtitude}&z=15`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        View on Map
                                    </a>
                                </td>
                                <td>{data.level}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {/* Pagination buttons */}
                <div className="pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {Math.ceil(historys.length / postsPerPage)}</span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === Math.ceil(historys.length / postsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Detail;
