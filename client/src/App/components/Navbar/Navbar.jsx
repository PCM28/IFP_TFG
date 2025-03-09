import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';

import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logoutUser } from "../../../store/auth/authActions";
import "./Navbar.css";

const INITIAL_STATE = {
    email: "",
    password: "",
};
  

export const NavBar = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [users] = useState(INITIAL_STATE);
  console.log("pathname", location.pathname);

  return (
    users && (
      <div className="Navbar">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
              
            <Navbar.Brand>
              <h1>
                <Link to="/" className='link title'>ECOTREE</Link>
              </h1>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="navbarScroll" />
            
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
                {/* Aquí se añade el código */}

                <Nav.Link as={Link} to="/" className="link">
                  Inicio
                </Nav.Link>
                
                <Nav.Link as={Link} to="/posts" className="link">
                  Crear Post
                </Nav.Link>

                <Nav.Link as={Link} to="/myaccount" className="link">
                  Mi Cuenta
                </Nav.Link>

                {/* ----------------------- */}
                {/* <NavDropdown title="Link" id="navbarScrollingDropdown">
                  <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                </NavDropdown> */}
              </Nav>
              
              { user && <h2 style={{ marginRight: '30px' }}>¡Bienvenido { user.name }!</h2> }
              
              { user &&
                <Form className="d-flex">
                  <Button 
                    variant="outline-success"
                    onClick={ ()=>dispatch( logoutUser( navigate ) ) }
                  >
                  Cerrar Sesión
                  </Button>
                </Form>
              }{" "}

            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    )
  )
}
