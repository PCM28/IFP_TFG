import "./CardMyProfile.css";
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

export const CardMyProfile = ({
  userImage = null,
  name,
  email,
  age,
  country
}) =>  {

  return (
    <Card style={{ width: '25rem', margin: '0 auto' }}>
       {userImage ? <Card.Img variant="top" src={userImage} /> : null}
      <Card.Body>
        <Card.Title>Mi Perfil</Card.Title>
      </Card.Body>
      
      <ListGroup 
        className="list-group-flush"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '10px 15px',
          padding: '0 20px'
        }}
      > 
        <div><strong>Nombre:</strong></div>
        <div>{name}</div>
        <div><strong>Email:</strong></div>
        <div>{email}</div>
        <div><strong>Edad:</strong></div>
        <div>{age}</div>
        <div><strong>País:</strong></div>
        <div>{country}</div>
        
      </ListGroup>
      
    </Card>
  );
}

CardMyProfile.propTypes = {
    userImage: PropTypes.string,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired
  };

export default CardMyProfile;