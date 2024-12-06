import React from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { mailOutline, logoFacebook, logoInstagram } from 'ionicons/icons';
import Header from './Header';
import './AboutContact.css';

const AboutContact: React.FC = () => {
  return (
    <IonPage>
      <Header title="About & Contact" />
      <IonContent
        style={{
          '--background': '#E3E4E8',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          alignItems: 'center', // Center the content horizontally
          textAlign: 'center', // Center the text
          paddingBottom: '50px', // Add padding at the bottom for spacing
        }}
      >
        <div className="about-contact-content">
          {/* Mission statement text */}
          <h1>
            Our mission is to provide a simple, intuitive platform to help you manage your tasks effectively, so you can focus on what matters most.
          </h1>
          
          {/* Image with smaller size and border radius */}
          <img
            src="/about.png"
            alt="About Us"
            style={{
              borderRadius: '5px',
              maxWidth: '80%', // Reduce the size of the image
              margin: '20px 0', // Add some space around the image
            }}
          />

          {/* Contact text */}
          <h2 className="contact-heading">Questions or feedback?</h2>
          <p className="reach-out-text" style={{ marginTop: '0px' }}>
            Reach out to us!
          </p>

          {/* Social Media Icons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '50px',
              marginTop: '20px', // Push the icons further down the page
            }}
          >
            {/* Email Icon */}
            <a href="mailto:support@yourdomain.com">
              <IonIcon icon={mailOutline} color="dark" style={{ fontSize: '30px' }} />
            </a>

            {/* Facebook Icon */}
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoFacebook} color="dark" style={{ fontSize: '30px' }} />
            </a>

            {/* Instagram Icon */}
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <IonIcon icon={logoInstagram} color="dark" style={{ fontSize: '30px' }} />
            </a>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AboutContact;

