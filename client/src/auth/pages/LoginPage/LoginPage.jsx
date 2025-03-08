import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./LoginPage.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


import { loginUser } from "../../../store/auth/authActions";
import { useDispatch, useSelector } from "react-redux";

const INITIAL_STATE = {
  email: "",
  password: "",
};

export const LoginPage = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoading } = useSelector((state) => state.auth);
  const [form, setForm] = useState(INITIAL_STATE);

  const submit = (ev) => {
    ev.preventDefault();
    dispatch(loginUser(form, navigate)); // lanzamos la función loginUser que recibimos por props y que conecta con nuestra API, tratamos de loguear al usuario
  };

  const changeInput = (ev) => {
    const { name, value } = ev.target;

    setForm({
      ...form,
      [name]: value,
    });
  };


  return (
    <>
        <div className="Login">
          <div className='Form'>
            { isLoading && <h2>Logeando usuario...</h2> }
            { !isLoading && (
              <Form onSubmit={ submit }>

                <h5>Login</h5>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Control 
                    type="email" 
                    placeholder="Correo" 
                    name='email'
                    value={ form.email }
                    onChange={ changeInput }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Control 
                    type="password" 
                    placeholder="Contraseña"
                    name='password'
                    value={ form.password }
                    onChange={ changeInput }
                    required
                    pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}"
                    title="La contraseña no cumple las reglas. 8 carácteres, 1 mayúscula y 1 número"
                  />
                </Form.Group>

                <div className='ButtonGroup'>
                  <Button
                    variant="success"
                    type="submit" 
                    className='Button'>
                    Login
                  </Button>

                  <Link to="/auth/register" className='Button'>
                    <Button 
                      variant="success"
                      type="button" 
                      className='Button'>
                      Registrarse
                    </Button>
                  </Link>
                </div>
                {error && <h2 className='error'>{ error }</h2>}{" "}
              </Form>
            )}
          </div>
        </div>
    </>
  )
}
