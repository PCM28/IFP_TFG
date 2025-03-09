import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const CardHomePage = ({
  imageSrc = null,
  title,
  text,
  name
}) => {

  return (
    <Card style={{ width: '18rem' }} className='card'>
      {imageSrc ? <Card.Img variant="top" src={imageSrc} alt={`Imagen de ${title}`} /> : null}
      <Card.Body className='card-body'>
        <Card.Title className='card-title'>{title}</Card.Title>
        <Card.Text className='card-text'>{text}</Card.Text>
        <ListGroup className="list-group-flush list-group-item">
          <ListGroup.Item>Creado por: {name}</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

// Definición de tipos y requerimientos para los props
CardHomePage.propTypes = {
  imageSrc: PropTypes.string,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default CardHomePage;
