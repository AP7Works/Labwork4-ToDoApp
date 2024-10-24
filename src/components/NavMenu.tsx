import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Import your Firebase config
import { signOut } from 'firebase/auth'; // Import signOut from Firebase

interface NavMenuProps {
    onClose: () => void; // Callback to close the menu
    setMenuOpen: (open: boolean) => void; // Callback to set menu state
}

const NavMenu: React.FC<NavMenuProps> = ({ onClose, setMenuOpen }) => {
    const history = useHistory();

    const handleMenuOptionClick = async (option: string) => {
        setMenuOpen(false); // Close the menu
        if (option === 'Add/Edit Tasks') {
            history.push('/add-edit-tasks');
        } else if (option === 'Home') {
            history.push('/home');
        } else if (option === 'Logout') {
            console.log('Logging out');
            try {
                await signOut(auth); // Sign out the user
                history.push('/logout'); // Redirect to the login page after logout
            } catch (error) {
                console.error("Logout Error:", error); // Handle errors if any
            }
        }
    };

    return (
        <IonMenu side="start" contentId="main" onIonDidClose={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Menu</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem button onClick={() => handleMenuOptionClick('Add/Edit Tasks')}>
                        <IonLabel>Add/Edit Tasks</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => handleMenuOptionClick('Home')}>
                        <IonLabel>Home</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => handleMenuOptionClick('Logout')}>
                        <IonLabel>Logout</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default NavMenu;
