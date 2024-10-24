import React from 'react';
import { useLocation } from 'react-router-dom';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/react';

const Header = () => {
  const location = useLocation();

  const renderHeaderContent = () => {
    switch (location.pathname) {
      case '/home':
        return <IonTitle>My Task List</IonTitle>;
      case '/add-edit-tasks':
        return <IonTitle>Add or Edit your Tasks</IonTitle>;
      default:
        return null;
    }
  };

  const shouldShowHeader = () => {
    return location.pathname === '/home' || location.pathname === '/add-edit-tasks';
  };

  return (
    shouldShowHeader() && (
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton style={{ color: 'black' }} />
          </IonButtons>
          {renderHeaderContent()}
        </IonToolbar>
      </IonHeader>
    )
  );
};

export default Header;
