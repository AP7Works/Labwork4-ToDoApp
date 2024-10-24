import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Logout: React.FC = () => {
    const history = useHistory();

    const handleLoginClick = () => {
        history.push('/login'); // Navigate back to the login page
    };

    return (
        <IonPage>
            <IonHeader>
                </IonHeader>
            <IonContent className="ion-padding">
                <h2>Thank you for using the To-do App</h2>
                <p>Want to go back in?</p>
                <IonButton onClick={handleLoginClick}>Login</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Logout;
