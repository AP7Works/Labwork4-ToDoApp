import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonInput, IonButton, IonText, IonItem, IonImg } from '@ionic/react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';
import '/src/components/Signup.css'; 

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
                
            </IonHeader>
            <IonContent className="signup-ion-padding">
                <IonImg src="/signup.png" alt="Signup Illustration" className="signup-image"/>
                <h2><b>Welcome! Join ToDo to start organising your life.</b></h2>
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

                {/* Success message display */}
                {successMessage && <IonText color="success">{successMessage}</IonText>}

                <IonButton expand="block" onClick={handleSignup} className="signup-button-custom">Sign Up</IonButton>

                {/* Add Login Link */}
                <IonText className="ion-text-center">
                    <p>Already have an account?</p>
                </IonText>
                <IonButton expand="full" fill="outline" onClick={redirectToLogin} className="login-button">Login</IonButton>

            </IonContent>
        </IonPage>
    );
};

export default Signup;
