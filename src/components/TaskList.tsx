import React, { useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonFooter,
  IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import Header from './Header';
import './TaskList.css';
import { Task } from '../types';
import { trashOutline } from 'ionicons/icons'; // Correct import

// Define the types for the props that TaskList will receive
interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addTask: (taskText: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, addTask }) => {
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const fetchedTasks: Task[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log('Fetched data:', data); // Log fetched data

        const task: Task = {
          id: doc.id,
          text: data.text || '',
          dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : null,
          priority: ['high', 'medium', 'low'].includes(data.priority) ? data.priority : 'low',
          completed: data.completed || false,
        };

        console.log('Processed task:', task); // Log processed task

        return task;
      });

      console.log('Fetched tasks:', fetchedTasks); // Log all fetched tasks
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, [setTasks]);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  return (
    <IonPage>
      <Header />
      <IonContent
        className="task-list-content"
        scrollEvents={true}
        style={{
          background: '#E3E4E8',
        }}
      >
        <IonList>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <IonItem key={task.id} lines="none" className="task-item">
                <div className="task-box">
                  <div className="task-details">
                    <div
                      className="priority-bullet"
                      style={{
                        backgroundColor:
                          task.priority === 'high'
                            ? '#FF9393'
                            : task.priority === 'medium'
                            ? '#FEB34A'
                            : '#7ACDB6',
                      }}
                    />
                    <IonLabel className="task-text">{task.text}</IonLabel>
                  </div>

                  <IonLabel className="task-date">
  Due{' '}
  {task.dueDate ? (
    task.dueDate instanceof Date ? (
      task.dueDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    ) : (
      <span>No valid due date</span>
    )
  ) : (
    <span>No due date set</span>
  )}
</IonLabel>


                  <div className="task-completed" onClick={() => handleDeleteTask(task.id)}>
                    <IonIcon
                      icon={trashOutline} // Use the imported icon
                      style={{ color: 'grey', fontSize: '20px', marginRight: '8px' }}
                    />
                    <IonLabel style={{ color: 'grey' }}>Task completed!</IonLabel>
                  </div>
                </div>
              </IonItem>
            ))
          ) : (
            <IonLabel>No tasks available.</IonLabel>
          )}
        </IonList>
      </IonContent>

      <IonFooter>
        <div
          className="add-task-ellipse"
          onClick={() => history.push('/add-edit-tasks')}
        >
          <span className="add-task-plus">+</span>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default TaskList;

