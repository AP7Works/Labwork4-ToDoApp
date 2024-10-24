import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonItem, IonText } from '@ionic/react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

const Signup: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const history = useHistory();

    const handleSignup = async () => {
        setError('');
        setSuccessMessage('');
        try {
            // Sign up the user
            await createUserWithEmailAndPassword(auth, email, password);
            setSuccessMessage('Thank you for signing up! You will be redirected to the login page.');
            setTimeout(() => {
                history.push('/login'); // Redirect to login after successful signup
            }, 2000); // Delay for 2 seconds before redirecting
        } catch (err: any) {
            // Handle any error and display it
            setError(err.message);
        }
    };

    const redirectToLogin = () => {
        history.push('/login');  // Redirect to login page
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sign Up to Manage Your Tasks</IonTitle>
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

                {/* Success message display */}
                {successMessage && <IonText color="success">{successMessage}</IonText>}

                <IonButton expand="full" onClick={handleSignup}>Sign Up</IonButton>

                {/* Add Login Link */}
                <IonText className="ion-text-center">
                    <p>Already have an account?</p>
                </IonText>
                <IonButton expand="full" fill="outline" onClick={redirectToLogin}>Login</IonButton>

            </IonContent>
        </IonPage>
    );
};

export default Signup;
