import  'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button'; 
import styles from './styles.module.css';


const content = {
  title: '404',
  subtitle: 'WE ARE SORRY, PAGE NOT FOUND!',
  description: 'THE PAGE YOU ARE LOOKING FOR MIGHT HAVE BEEN REMOVED, HAD ITS NAME CHANGED OR IS TEMPORARILY UNAVAILABLE.'
};

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleBackToHomepage = () => {
    navigate('/');
  };

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorCode}>{content.title}</h1>
        <h2>{content.subtitle}</h2>
        <p>{content.description}</p>
        <Button
          name="BACK"
          className={styles.homeButton}
          onClick={handleBackToHomepage}
        />
      </div>
    </div>
  );
};

export default ErrorPage;
