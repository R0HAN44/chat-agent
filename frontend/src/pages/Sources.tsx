import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const Sources = () => {
    const location = useLocation();
    const [isCreate, setIsCreate] = useState<boolean>(false);
    
    useEffect(()=>{
        if(location.pathname.includes("create-new-agent")){
            setIsCreate(true);
        }else{
            setIsCreate(false);
        }
    },[])
  return (
    <>
    <div>Sources</div>
    {isCreate && <div>create new agent</div>}
    </>
  )
}

export default Sources