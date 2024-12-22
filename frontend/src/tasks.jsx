import React from "react";
import ReactDOM from "react-dom/client"
import axios from 'axios'
import './style.css'
function Add()
{
    const [task, setTask] = React.useState('');
  const [priority, setPriority] = React.useState(1);
  const [tasks, setTasks] = React.useState([]);

  const token = localStorage.getItem('authToken'); 
  const fetchTasks = async () => {

    
    console.log("Token:", token);
    try {
        const response = await axios.get('http://localhost:5000/addtasks', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data);
    } catch (err) {
        console.error("Error fetching tasks:", err);
    }
};
  function change()
{
  setTimeout(()=>{
    window.location.href="display.html"
  },10)
}
const addTask = async () => {
    if (!task || priority < 1 || priority > 10) return;

    try {
      const response  = await axios.post('http://localhost:5000/addtasks', { task, priority },{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }})
      setTask('');
      setPriority(1);
      fetchTasks(); 
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };
  return (
    <div className="App">
      <h1>Priority-based Task List</h1>

      <div>
        <input 
          type="text" 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          placeholder="Enter task" 
        />
        <input 
          type="number" 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)} 
          min="1" max="10" 
          placeholder="Priority (1-10)" 
        />
        <button onClick={addTask}>Add Task</button>
        <button onClick={change}>Display Tasks</button>
      </div>
      </div>
      )
    }
    ReactDOM.createRoot(document.getElementById("root")).render(<Add/>)