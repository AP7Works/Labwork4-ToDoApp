import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonItem, IonText } from '@ionic/react';
import { auth } from '../firebaseConfig';  // Import the auth instance from the config
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

const Login: React.FC<{ fetchTasks: () => void }> = ({ fetchTasks }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [tasks, setTasks] = useState<any[]>([]); 
    const history = useHistory();

    const handleLogin = async () => {
        setError('');  
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }
    
        try {
            await signInWithEmailAndPassword(auth, email, password);
            await fetchTasks(); // Ensure this returns a promise
            console.log("Tasks after login:", tasks); // Log fetched tasks
            history.push('/home'); // Navigate after fetching tasks
        } catch (err: any) {
            setError(err.message);
        }
    };
    

    const redirectToSignup = () => {
        history.push('/signup');  // Redirect to sign-up page
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Welcome to your To-Do App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput 
                        type="email" 
                        value={email} 
                        onIonChange={(e) => setEmail(e.detail.value!)} 
                        required 
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput 
                        type="password" 
                        value={password} 
                        onIonChange={(e) => setPassword(e.detail.value!)} 
                        required 
                    />
                </IonItem>

                {/* Error message display */}
                {error && <IonText color="danger">{error}</IonText>}

                <IonButton expand="full" onClick={handleLogin}>Login</IonButton>

                {/* Add Sign-Up Link */}
                <IonText className="ion-text-center">
                    <p>Don't have an account?</p>
                </IonText>
                <IonButton expand="full" fill="outline" onClick={redirectToSignup}>Sign Up</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Login;
