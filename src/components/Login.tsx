import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonLabel, IonItem, IonText, IonImg } from '@ionic/react';
import { auth } from '../firebaseConfig';  // Import the auth instance from the config
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import '/src/components/Login.css'; 

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
            <IonContent className="login-ion-padding">
                <IonImg src="/Login.png" alt="Login Illustration" className="login-image"/>
                <h2><b>Hello! Log in to get started with ToDo.</b></h2>
                <IonItem>
                    <IonInput 
                        type="email" 
                        value={email} 
                        placeholder="Email" // Use placeholder instead of floating label
                        onIonChange={(e) => setEmail(e.detail.value!)} 
                        required 
                    />
                </IonItem>
                <IonItem>
                    <IonInput 
                        type="password" 
                        value={password} 
                        placeholder="Password" // Use placeholder instead of floating label
                        onIonChange={(e) => setPassword(e.detail.value!)} 
                        required 
                    />
                </IonItem>

                {/* Error message display */}
                {error && <IonText color="danger">{error}</IonText>}

                <IonButton expand="block" onClick={handleLogin} className="login-button-custom">Login</IonButton>

                {/* Add Sign-Up Link */}
                <IonText className="ion-text-center">
                    <p>Don't have an account?</p>
                </IonText>
                <IonButton expand="full" fill="outline" onClick={redirectToSignup} className="signup-button">Sign Up</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Login;
