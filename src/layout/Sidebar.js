import React,{ useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../style/sidebar.css"
import { jwtDecode } from 'jwt-decode';

import { RiFolderHistoryLine } from 'react-icons/ri';
import { BsQuestionCircle } from 'react-icons/bs';
import { FaLine } from 'react-icons/fa';
import { CiLogout } from 'react-icons/ci';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiUserListBold  } from 'react-icons/pi';

const Sidebar = () => {
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

    const Logout = async() => {
        try {
            await axios.delete('http://localhost:5000/logout');
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='sideBar'>

      <div className="logoDiv flex">
        <img src={logo} alt="โลโก้ Planti" className='logo'/>
      </div>
      {userRole === "2" ? (
        <>
          <div className="menuDiv">
        <h3 className="divTitle">เมนูหลัก</h3>
        <ul className="menuLists">
          <li className="listItem">
            <a href="/dashboard" className='menuLink flex'>
                <RiFolderHistoryLine  className='icon'/>
                <span className="smallText">ประวัติการเกิดอุบัติเหตุ</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="settingsDiv">
        <h3 className="divTitle">การตั้งค่า</h3>
        <ul className="menuLists">

          <li className="listItem">
            <a href="/dashboard/devices/list" className='menuLink flex'>
                <IoSettingsOutline className='icon'/>
                <span className="smallText">อุปกรณ์</span>
            </a>
          </li>
          </ul>
            <a className='menuLink flex'>
                <button onClick={Logout} className="btn"><CiLogout className='icon'/>ออกจากระบบ</button>
            </a>
          </div>
        </>
      ):(
        <>
      <div className="menuDiv">
        <h3 className="divTitle">เมนูหลัก</h3>
        <ul className="menuLists">
          <li className="listItem">
            <a href="/dashboard" className='menuLink flex'>
                <RiFolderHistoryLine  className='icon'/>
                <span className="smallText">ประวัติการเกิดอุบัติเหตุ</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="settingsDiv">
        <h3 className="divTitle">การตั้งค่า</h3>
        <ul className="menuLists">

          <li className="listItem">
            <a href="/dashboard/devices/list" className='menuLink flex'>
                <IoSettingsOutline className='icon'/>
                <span className="smallText">ตั้งค่าอุปกรณ์</span>
            </a>
          </li>

          <li className="listItem">
            <a href="/dashboard/user/list" className='menuLink flex'>
                <PiUserListBold  className='icon'/>
                <span className="smallText">ตั้งค่าผู้ใช้งาน</span>
            </a>
          </li>

          <li className="listItem">
            <a href="/dashboard/groups/list" className='menuLink flex'>
                <FaLine className='icon'/>
                <span className="smallText">ตั้งค่ากลุ่มไลน์</span>
            </a>
          </li>
          </ul>
            <a className='menuLink flex'>
                <button onClick={Logout} className="btn"><CiLogout className='icon'/>ออกจากระบบ</button>
            </a>
          </div>
          </>
        )}
        

      <div className="sideBarCard">
        <BsQuestionCircle className='icon' />
        <div className="cardContent">
          <h3>ศูนย์ช่วยเหลือ</h3>
          <p>หากพบปัญหาใน Accident BOT โปรดติดต่อเราเพื่อขอข้อมูลเพิ่มเติม.</p>
          <button className='btn'>
          <a 
            href="https://liff.line.me/1645278921-kWRPP32q/?accountId=888pncli"
            target="_blank" 
            rel="noopener noreferrer"
          >
            ไปที่ศูนย์ช่วยเหลือ
          </a></button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
