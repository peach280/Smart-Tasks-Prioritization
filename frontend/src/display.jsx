import React from "react";
import ReactDOM from "react-dom/client";
import axios from 'axios';
import './style1.css'

function TaskList() {
    const [tasks, setTasks] = React.useState([]);

  
    const token = localStorage.getItem('authToken');
    const fetchTasks = async () => {
         
        try {
            const response = await axios.get('http://localhost:5000/addtasks', {
                headers: { Authorization: `Bearer ${token}` } 
            });
            setTasks(response.data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
    };


    const markAsDone = async (id, completed) => {
     
        const updatedTasks = tasks.map(task => 
            task._id === id ? { ...task, completed: !completed } : task
        );
        setTasks(updatedTasks);

        try {
            
             
            const response = await axios.put('http://localhost:5000/markAsDone',{ id, completed: !completed }, {
                headers: { Authorization: `Bearer ${token}` } 
            });
        } catch (err) {
            console.error("Error updating task status:", err);
            
            fetchTasks(); 
        }
    };

    React.useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div>
            <h2>Task List</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        <span>{task.task} (Priority: {task.priority})</span>
                        <button onClick={() => markAsDone(task._id, task.completed)}>
                            Mark as {task.completed ? 'Not Done' : 'Done'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<TaskList />);
