import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonModal,
  IonDatetime,
  IonToast,
} from '@ionic/react';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useHistory } from 'react-router-dom';
import { Task } from '../types'; // Import Task interface

const AddEditTasks: React.FC<{
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}> = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [reminderDate, setReminderDate] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const scheduleDailyReminder = async () => {
    const now = new Date();
    const notificationTime = new Date(now.getTime() + 1 * 60 * 1000); // 1 minute later

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Daily Task Reminder',
          body: 'You have tasks to complete! Check your list!',
          id: 1,
          schedule: {
            every: 'minute',
            at: notificationTime,
          },
          actionTypeId: '',
          extra: null,
        },
      ],
    });
  };

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const newTaskData = { text: newTask, completed: false, reminderSet: false };

      try {
        const docRef = await addDoc(collection(db, 'tasks'), newTaskData);
        setTasks([...tasks, { id: docRef.id, ...newTaskData }]);
        setNewTask(''); // Clear the input field
        await scheduleDailyReminder();
      } catch (error) {
        console.error('Error adding task: ', error);
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, { completed: !currentStatus });
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const openReminderModal = (task: Task) => {
    setSelectedTask(task);
  };

  const closeReminderModal = () => {
    setSelectedTask(null);
    setReminderDate('');
  };

  const saveReminder = async (date: string) => {
    if (selectedTask) {
      const taskRef = doc(db, 'tasks', selectedTask.id);
      await updateDoc(taskRef, { reminderSet: true }); // Update reminderSet to true
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Task Reminder',
            body: `Don't forget: ${selectedTask.text}`,
            id: new Date().getTime(),
            schedule: { at: new Date(date) },
            actionTypeId: '',
            extra: null,
          },
        ],
      });
      closeReminderModal();
      setShowToast(true); // Show confirmation message
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text || '',
        completed: doc.data().completed || false,
        reminderSet: doc.data().reminderSet || false,
      }));
      setTasks(fetchedTasks);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [setTasks]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add or Edit your Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          value={newTask}
          placeholder="Add new task"
          onIonChange={(e) => setNewTask(e.detail.value!)}
        />
        <IonButton onClick={handleAddTask}>Add Task</IonButton>
        <IonList>
          {tasks.map((task) => (
            <IonItem key={task.id}>
              <IonCheckbox
                slot="start"
                checked={task.completed}
                onIonChange={() => handleToggleComplete(task.id, task.completed)}
              />
              <IonLabel>{task.text}</IonLabel>
              <IonButton color="danger" onClick={() => handleDeleteTask(task.id)}>
                Delete
              </IonButton>
              {task.reminderSet ? (
                <IonButton disabled>Reminder Set</IonButton>
              ) : (
                <IonButton onClick={() => openReminderModal(task)}>Add Reminder</IonButton>
              )}
            </IonItem>
          ))}
        </IonList>
        {selectedTask && (
          <IonModal isOpen={true} onDidDismiss={closeReminderModal}>
            <IonDatetime
              value={reminderDate}
              onIonChange={(e) => {
                const value = e.detail.value;
                if (typeof value === 'string') {
                  setReminderDate(value);
                } else if (Array.isArray(value)) {
                  setReminderDate(value[0]); // Or handle it as needed
                }
              }}
            />
            <IonButton onClick={() => saveReminder(reminderDate)}>Save Reminder</IonButton>
            <IonButton onClick={closeReminderModal}>Cancel</IonButton>
          </IonModal>
        )}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Reminder added successfully!"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddEditTasks;
