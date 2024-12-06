import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import TaskList from './components/TaskList'; 
import Login from './components/Login';
import Signup from './components/Signup';
import AddEditTasks from './pages/AddEditTasks';
import NavMenu from './components/NavMenu'; 
import Logout from './components/Logout';
import Header from './components/Header';
import AboutContact from './components/AboutContact';  // Import the AboutContact page
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Task } from './types'; 

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);


  const fetchTasks = () => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text || '',
          completed: data.completed || false,
          priority: data.priority || 'low', // Add default value if not provided
          dueDate: data.dueDate ? new Date(data.dueDate.seconds * 1000) : new Date(), // Ensure dueDate is correctly parsed from Firestore
        };
      });
      setTasks(fetchedTasks);
    });
  
    return () => unsubscribe();
  };
  

  const addTask = async (taskText: string) => {
    const newTask: Task = { 
      id: new Date().getTime().toString(), 
      text: taskText, 
      completed: false,
      priority: 'low',  // Add default priority
      dueDate: new Date(),  // Create a Date object here instead of toISOString()
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  

  return (
    <IonApp>
      <IonReactRouter>
        <NavMenu onClose={() => setMenuOpen(false)} setMenuOpen={setMenuOpen} />

        {/* Handle dynamic header titles per route */}
        <IonRouterOutlet id="main">
          {/* Home route with header */}
          <Route exact path="/home">
            <Header title= "Welcome to your tasks TODAY is " />
            <TaskList tasks={tasks} setTasks={setTasks} addTask={addTask} />
          </Route>

          {/* Login route without header */}
          <Route exact path="/login">
            <Login fetchTasks={fetchTasks} />
          </Route>

          {/* Signup route without header */}
          <Route exact path="/signup">
            <Signup />
          </Route>

          {/* Add/Edit Task route with header */}
          <Route exact path="/add-edit-tasks">
            <Header title="Add new task" />
            <AddEditTasks tasks={tasks} setTasks={setTasks} />
          </Route>

          {/* About & Contact route with header */}
          <Route exact path="/about-contact">
            <Header title="About & Contact" />
            <AboutContact />
          </Route>

          {/* Default route redirecting to /home */}
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>

          {/* Logout route without header */}
          <Route exact path="/logout">
            <Logout />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
