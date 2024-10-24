import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AddEditTasks from './pages/AddEditTasks';
import NavMenu from './components/NavMenu';
import Logout from './components/Logout';
import Header from './components/Header';
import { LocalNotifications } from '@capacitor/local-notifications';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Task } from './types'; // Import Task interface

// Import styles
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

  const requestLocalNotificationPermissions = async () => {
    const { display } = await LocalNotifications.requestPermissions();
    if (display !== 'granted') {
      console.log('Permission not granted for local notifications');
    }
  };

  const scheduleNotification = async (task: Task) => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Task Reminder',
          body: `Don't forget: ${task.text}`,
          id: new Date().getTime(),
          schedule: { at: new Date(Date.now() + 10000) }, // Schedule for 10 seconds later
          actionTypeId: '',
          extra: null,
        },
      ],
    });
  };

  // Fetch tasks from Firestore
  const fetchTasks = () => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text || '',
        completed: doc.data().completed || false,
        reminderSet: doc.data().reminderSet || false, // Add this line to include reminderSet
      }));
      setTasks(fetchedTasks);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  };

  useEffect(() => {
    requestLocalNotificationPermissions();
    fetchTasks(); // Fetch tasks on component mount
  }, []);

  const addTask = async (taskText: string) => {
    const newTask: Task = { 
      id: new Date().getTime().toString(), 
      text: taskText, 
      completed: false,
      reminderSet: false // Set default value for reminderSet
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    await scheduleNotification(newTask);
  };

  return (
    <IonApp>
      <IonReactRouter>
        <NavMenu onClose={() => setMenuOpen(false)} setMenuOpen={setMenuOpen} />
        <Header />
        <IonRouterOutlet id="main">
          <Route exact path="/home">
            <Home tasks={tasks} setTasks={setTasks} addTask={addTask} />
          </Route>
          <Route exact path="/login">
            <Login fetchTasks={fetchTasks} />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/add-edit-tasks">
            <AddEditTasks tasks={tasks} setTasks={setTasks} />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
