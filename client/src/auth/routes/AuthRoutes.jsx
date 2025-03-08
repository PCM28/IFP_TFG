import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage, RegisterPage } from "../pages"
export const AuthRoutes = () => {

  return (
    <>
        <Routes>
            
            <Route path="/login" element={ <LoginPage /> }/>
            <Route path="/register" element={ <RegisterPage /> }/>

            {/* Redirigir cualquier ruta no válida dentro de AuthRoutes */}
            <Route path="/*" element={ <Navigate to="/not-found"/> }/>
        </Routes>
    </>
  )
}
