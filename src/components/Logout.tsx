import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonImg, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Logout.css'; // Importing specific CSS file for the Logout page

const Logout: React.FC = () => {
    const history = useHistory();

    const handleLoginClick = () => {
        history.push('/login'); // Navigate back to the login page
    };

    return (
        <IonPage>
        
            <IonContent className="ion-padding">
                <IonImg src="/Logout.png" alt="Logout Illustration" className="logout-image"/>
                <h2><b>Thank you for using ToDo. See you soon!</b></h2>
                <IonText className="ion-text-center">
                    <p>Want to go back in?</p>
                </IonText>
                <IonButton expand="block" onClick={handleLoginClick} className="logout-login-button">LOGIN</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Logout;


