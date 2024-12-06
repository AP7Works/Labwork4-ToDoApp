import React from 'react';
import { useLocation } from 'react-router-dom';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/react';
import './Header.css'; // Correct import path

interface HeaderProps {
  title?: string; // Optional title prop, defaults to "Home"
  showMenuButton?: boolean; // Whether to show the menu button
}

const Header: React.FC<HeaderProps> = ({ title = '', showMenuButton = true }) => {
  const location = useLocation();

  const getHeaderContent = () => {
    if (location.pathname === '/home') {
      const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return (
        <div className="header-content">
          <div className="header-title">Welcome to your tasks</div>
          <div className="header-date">
            <span className="header-today">TODAY</span> is {today}
          </div>
        </div>
      );
    } else if (location.pathname === '/about-contact') {
      return 'About & Contact';
    } else if (location.pathname === '/add-edit-tasks') {
      return 'Add new task';
    }
    return title || 'Home';
  };

  return (
    <IonHeader
      className={`custom-header ${location.pathname === '/about-contact' ? 'custom-header-aboutContact' : ''} ${
        location.pathname === '/add-edit-tasks' ? 'custom-header-add-tasks' : ''
      }`}
    >
      <IonToolbar>
        {showMenuButton && (
          <IonButtons slot="start">
            <IonMenuButton className="ion-menu-button" />
          </IonButtons>
        )}
<IonTitle
  className={`header-ion-title ${location.pathname === '/about-contact' ? 'ion-title-aboutContact' : ''} ${
    location.pathname === '/home' ? 'ion-title-home' : ''
  } ${location.pathname === '/add-edit-tasks' ? 'ion-title-add-tasks' : ''}`}
>
  {getHeaderContent()}
</IonTitle>

      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
