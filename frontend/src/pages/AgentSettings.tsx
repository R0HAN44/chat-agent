import axiosInstance from '@/api/axios';
import { useAgentStore } from '@/store/useAgentStore';
import { useEffect } from 'react'

const AgentSettings = () => {

  const { selectedAgent, clearSelectedAgent } = useAgentStore();


  useEffect(() => {
    getAgentSettings();
  }, []);

  const getAgentSettings = async () => {
    try {
      const response = await axiosInstance.get(`/agent-settings/${selectedAgent?._id}`);
      console.log(response);
    } catch (error) {
      console.error('Error fetching agent settings:', error);
    }
  }

  return (
    <div>AgentSettings</div>
  )
}

export default AgentSettings