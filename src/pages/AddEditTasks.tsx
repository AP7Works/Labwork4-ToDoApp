import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonIcon,
} from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { Task } from '../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddEditTasks.css';
import { enGB } from 'date-fns/locale';
import { ellipse } from 'ionicons/icons';
import Header from '../components/Header';
import { useHistory } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';

const AddEditTasks: React.FC<{
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}> = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<string | undefined>(undefined);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [confirmDate, setConfirmDate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const history = useHistory();

  const handleAddTask = async () => {
    if (!newTask.trim() || !priority || !dueDate) {
      setError("All fields are required.");
      return;
    }

    setError(null);

    // Ensure priority and dueDate are included in the new task
    const newTaskData: Omit<Task, 'id'> = {
      text: newTask,
      priority: priority as "high" | "medium" | "low",
      dueDate: dueDate, // Keep dueDate as Date
      completed: false,
    };

    try {
      // Add task to Firestore
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...newTaskData,
        dueDate: Timestamp.fromDate(dueDate), // Convert to Timestamp
      });

      // Add the task to the local state
      setTasks([...tasks, { id: docRef.id, ...newTaskData }]);
      setNewTask('');
      setPriority(undefined);
      setDueDate(null);
      setConfirmDate(false);
      history.push('/home');
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
    if (!showCalendar) {
      setConfirmDate(false);
    }
  };

  const handleConfirmDate = () => {
    setConfirmDate(true);
    setShowCalendar(false);
  };

  const renderPriorityBullet = (priority: string | undefined) => {
    let color = '';
    switch (priority) {
      case 'high':
        color = '#FF9393';
        break;
      case 'medium':
        color = '#FEB34A';
        break;
      case 'low':
        color = '#7ACDB6';
        break;
      default:
        color = '';
        break;
    }

    return (
      <IonIcon
        icon={ellipse}
        style={{
          color: color,
          fontSize: '12px',
          marginLeft: '8px',
        }}
      />
    );
  };

  return (
    <IonPage>
      <Header title="Add a new task" />
      <IonContent className="task-page-content">
        <div className="task-entry-box">
          <IonItem>
            <IonLabel position="floating"></IonLabel>
            <IonInput
              value={newTask}
              placeholder="Write your task"
              onIonChange={(e) => setNewTask(e.detail.value!)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating"></IonLabel>
            <IonSelect
              value={priority}
              placeholder="Priority"
              onIonChange={(e) => setPriority(e.detail.value)}
            >
              <IonSelectOption value="high">
                High
                {renderPriorityBullet('high')}
              </IonSelectOption>
              <IonSelectOption value="medium">
                Medium
                {renderPriorityBullet('medium')}
              </IonSelectOption>
              <IonSelectOption value="low">
                Low
                {renderPriorityBullet('low')}
              </IonSelectOption>
            </IonSelect>
            {priority && renderPriorityBullet(priority)}
          </IonItem>

          <IonItem lines="none" style={{ position: 'relative' }}>
            <IonIcon
              icon={calendarOutline}
              className="task-calendar-icon"
              onClick={handleCalendarClick}
            />
            {showCalendar && (
              <div className="task-date-picker-container">
        <DatePicker
  selected={dueDate}
  onChange={(date: Date | null) => setDueDate(date)} // Add explicit type
  dateFormat="dd/MM/yyyy"
  placeholderText="Due Date"
  className="task-date-picker"
  inline
  locale={enGB}
/>

                {dueDate && !confirmDate && (
                  <IonButton onClick={handleConfirmDate} className="task-confirm-date-button">
                    OK
                  </IonButton>
                )}
              </div>
            )}
            {confirmDate && dueDate && (
              <div className="task-date-display">
                {dueDate.toLocaleDateString()}
              </div>
            )}
          </IonItem>

          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

          <IonButton className="task-submit-button" onClick={handleAddTask}>
            ADD TASK
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddEditTasks;
