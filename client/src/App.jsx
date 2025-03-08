import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { checkUser } from './store/auth/authActions';
import { Layout } from "./layout/Layout";


const App = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    //Intentar recuperar el usuario, si es que estamos logueados
    dispatch(checkUser(navigate));
  }, [dispatch]);

  return (
    <>
      {/* Solo quedaría añadir la carpeta Theme, video AppJourney -> cursos React*/}
      <div className="App">
        <Layout />
      </div>      
    </>
  )
}

export default App
