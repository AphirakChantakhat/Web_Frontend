import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../layout/Sidebar';
import FromAddGroup from './FormAddGroup';
import MostBeautifulMinimalLoading from '../../layout/Loading';

// สมมติว่านี่คือฟังก์ชันจำลองการตรวจสอบผู้ใช้
const checkUserAuth = () => {
  // จำลองการเรียก API หรือตรวจสอบ local storage
  return new Promise((resolve) => {
    setTimeout(() => {
      // สมมติว่าเราได้ข้อมูลผู้ใช้จาก backend หรือ local storage
      resolve({ isAuthenticated: true, role: 'admin' });
    }, 1000);
  });
};

const AddGroup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userData = await checkUserAuth();
        setUser(userData);
        setIsLoading(false);

        if (!userData.isAuthenticated) {
          navigate('/');
        } else if (userData.role !== 'admin') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/');
      }
    };

    verifyUser();
  }, [navigate]);

  if (isLoading) {
    return <div><MostBeautifulMinimalLoading /></div>;
  }

  return (
    <div className='user flex'>
        <div className="userContainer flex">
          <SideBar/>
          <FromAddGroup />
        </div>
    </div>
  )
};

export default AddGroup;