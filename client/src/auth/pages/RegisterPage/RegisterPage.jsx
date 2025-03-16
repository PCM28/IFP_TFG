import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./RegisterPage.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { registerUser } from "../../../store/auth/authActions";

import { useDispatch, useSelector } from "react-redux";

const INITIAL_STATE = {
  name: "",
  age: "",
  country: "",
  email: "",
  password: "",
};


export const RegisterPage = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);
  const [form, setForm] = useState(INITIAL_STATE);

  const submit = (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("age", form.age);
    formData.append("country", form.country);
    formData.append("email", form.email);
    formData.append("password", form.password);

    dispatch(registerUser(formData, navigate));
  };

  const changeInput = (ev) => {
    const { name, value } = ev.target;

    if (value) ev.target.setCustomValidity("");

    setForm({
      ...form,
      [name]: value,
    });
    
  };

  const setCustomMessage = (ev) => {
    ev.target.setCustomValidity("Debes completar este campo, no seas tramposo!");
  };


  return (
    <>
      <div className="Register">
        <div className='Form'>
          <Form onSubmit={ submit }>
            <h5>Formulario Registro</h5>
            
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Control
                name="name"
                type="text" 
                placeholder="Nombre completo" 
                value={ form.name }
                onChange={ changeInput }
                onInvalid={ (ev) => setCustomMessage(ev) }
                required  
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicAge">
              <Form.Control
                name="age"
                type="text" 
                placeholder="Edad" 
                value={ form.age }
                onChange={ changeInput }
                pattern="^(1[3-9]|[2-7][0-9]|80)$"
                title='Edad mínima 13'
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Control
                name="country"
                type="text" 
                placeholder="País" 
                value={ form.country }
                onChange={ changeInput }
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                name="email"
                type="email" 
                placeholder="Correo" 
                value={ form.email }
                onChange={ changeInput }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control 
                name="password"
                type="password" 
                placeholder="Contraseña" 
                value={ form.password }
                onChange={ changeInput }
                pattern="(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}"
                title="La contraseña no cumple las reglas. 8 carácteres, 1 mayúscula y 1 número"
                required
              />
            </Form.Group>

            <div className='ButtonGroup'>
              <Button
                variant="success" 
                type="submit" 
                className='Button'>
                Crear Cuenta
              </Button>

              <Link to="/auth/login" className='Button'>
                <Button 
                  variant="success" 
                  type="button" 
                  className='Button'>
                  ¿Ya tienes cuenta?
                </Button>
              </Link>
            </div>
            { error && <h2 className="error">{ error }</h2> }{" "}
          </Form>
        </div>
      </div>
    </>
  )
}
