import axiosInstance from '@/api/axios';
import React, { useEffect } from 'react'

const Settings = () => {
  useEffect(() => {
    getUserInfo();
  }, [])

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>Settings</div>
  )
}

export default Settings