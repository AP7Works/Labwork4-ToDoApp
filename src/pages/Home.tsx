import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonFooter, IonItem, IonLabel, IonList } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { menuController } from '@ionic/core';
import { db } from '../firebaseConfig'; // Import Firestore instance
import { collection, onSnapshot } from 'firebase/firestore';
import './Home.css';
import { Task } from '../types'; // Import Task interface

const Home: React.FC<{
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (taskText: string) => Promise<void>; // Accept addTask as a prop
}> = ({ tasks, setTasks, addTask }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const history = useHistory();

  const toggleMenu = async () => {
    await menuController.toggle(); // Opens or closes the side menu
  };

  const handleMenuOptionClick = (option: string) => {
    setMenuOpen(false); // Close the menu
    switch (option) {
      case 'Add/Edit Tasks':
        history.push('/add-edit-tasks');
        break;
      case 'Home':
        history.push('/home');
        break;
      case 'Logout':
        history.push('/logout');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text || '',
          completed: data.completed || false,
          reminderSet: data.reminderSet || false, // Include reminderSet property
        };
      });
      setTasks(fetchedTasks);
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, [setTasks]);

  // Function to add a new task and schedule a notification
  const handleAddTask = async () => {
    const taskText = prompt('Enter a new task:'); // Prompt user for task text
    if (taskText) {
      await addTask(taskText); // Use the addTask function from props
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontWeight: 'bold' }}>My Task List</IonTitle>
          <IonButton slot="end" onClick={toggleMenu}>
            Menu
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Task List</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Task List */}
        <IonList>
          {tasks.map((task, index) => (
            <IonItem key={index}>
              <IonLabel>{task.text}</IonLabel>
              {task.reminderSet && <IonLabel slot="end">Reminder Set</IonLabel>}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonButton expand="full" onClick={() => history.push('/add-edit-tasks')}>
            Modify My Tasks
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
