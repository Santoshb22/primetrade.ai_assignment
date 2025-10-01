import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [allTask, setAllTask] = React.useState([])
  const token = useSelector((state) => state.user.token);
  console.log(allTask);

  useEffect(() => {
    const fetchTasks = async () => {
      try {   
        const response = await fetch(`${import.meta.env.VITE_BASE_API}/tasks/get_all_tasks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setAllTask(data); 
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } 
    };

    fetchTasks();
  }, []);
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard