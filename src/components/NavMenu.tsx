import React, { useEffect } from 'react';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonMenuToggle,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { close } from 'ionicons/icons'; // Import close icon
import { useHistory } from 'react-router-dom';
import { menuController } from '@ionic/core';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

// Define prop types for NavMenu
interface NavMenuProps {
  onClose: () => void;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavMenu: React.FC<NavMenuProps> = ({ onClose, setMenuOpen }) => {
  const history = useHistory();

  const handleMenuOptionClick = async (option: string) => {
    await menuController.close(); // Close the menu after selection

    if (option === 'Add Tasks') {
      history.push('/add-edit-tasks');
    } else if (option === 'Home') {
      history.push('/home');
    } else if (option === 'About & Contact') {
      history.push('/about-contact'); // Navigate to AboutContact page
    } else if (option === 'Logout') {
      try {
        await signOut(auth);
        history.push('/logout');
      } catch (error) {
        console.error('Logout Error:', error);
      }
    }
  };

  const closeMenu = async () => {
    try {
      await menuController.close('start'); // Ensure this function is called to close the menu
      onClose(); // Call the onClose function passed as a prop
    } catch (error) {
      console.error('Error closing menu:', error);
    }
  };

  useEffect(() => {
    const initMenu = async () => {
      await menuController.enable(true);
      console.log('Menu enabled');
    };
    initMenu();
  }, []);

  const checkMenu = async () => {
    const isEnabled = await menuController.isEnabled();
    console.log('Menu enabled:', isEnabled);
  };

  useEffect(() => {
    checkMenu();
  }, []);

  return (
    <IonMenu
      side="start"
      contentId="main" // Ensure this matches the main content ID
      style={{
        '--width': '65vw',
        '--height': '90vw', // Make the menu narrower
        '--background': '#E3E4E8',
        'marginBottom': '0',
        'paddingBottom': '0',
        // Grey background for the entire sidebar
      }}
    >
      {/* Header with white background and X button */}
      <IonHeader>
        <IonToolbar
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Align "X" and "Menu"
          }}
        >
          {/* X button on the left */}
          <IonMenuToggle>
            <IonButton
              fill="clear"
              onClick={closeMenu}
              style={{
                '--color': 'black',
                marginRight: '8px',
              }}
            >
              <IonIcon icon={close} />
              <span style={{ marginLeft: '8px', fontSize: '1.5rem', textTransform: 'none' }}>Menu</span>
            </IonButton>
          </IonMenuToggle>
        </IonToolbar>
      </IonHeader>

      {/* Menu content */}
      <IonContent style={{ '--background': '#E3E4E8', height: '100%', '--padding': '0' }}>
        <IonList style={{ padding: '0', margin: '0' }}>
          <IonMenuToggle auto-hide="false">
            {/* Menu Items */}
            <IonItem
              button
              detail={false} // Disable the arrows
              onClick={() => handleMenuOptionClick('Home')}
              style={{
                '--background': '#E3E4E8', // Background for menu items
                '--border-color': '#E3E4E8', // Remove separators
              }}
            >
              <IonLabel>Home</IonLabel>
            </IonItem>
            <IonItem
              button
              detail={false} // Disable the arrows
              onClick={() => handleMenuOptionClick('Add Tasks')}
              style={{
                '--background': '#E3E4E8',
                '--border-color': 'transparent',
              }}
            >
              <IonLabel>Add Task</IonLabel>
            </IonItem>
            <IonItem
              button
              detail={false} // Disable the arrows
              onClick={() => handleMenuOptionClick('About & Contact')}
              style={{
                '--background': '#E3E4E8',
                '--border-color': 'transparent',
              }}
            >
              <IonLabel>About & Contact</IonLabel>
            </IonItem>
            <IonItem
              button
              detail={false} // Disable the arrows
              onClick={() => handleMenuOptionClick('Logout')}
              style={{
                '--background': '#E3E4E8',
                '--border-color': 'transparent',
                'marginBottom': '0',
                'paddingBottom': '0',
              }}
            >
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default NavMenu;
