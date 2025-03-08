import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import "./CardMyAccount.css";

const CardMyAccount = ({
  imageSrc = null,
  title,
  text,
  name,
  editPost,
  deletePost,
}) => {

  return (
    <Card style={{ width: '18rem' }}>
      {imageSrc ? <Card.Img variant="top" src={imageSrc} /> : null}
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{text}</Card.Text>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Created by: {name}</ListGroup.Item>
        </ListGroup>
        <Button variant="warning" onClick={editPost}>Edit</Button>
        <Button variant="danger" onClick={deletePost}>Delete</Button>
      </Card.Body>
    </Card>
  );
};

// Definición de tipos y requerimientos para los props
CardMyAccount.propTypes = {
  imageSrc: PropTypes.string,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  editPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

export default CardMyAccount;
