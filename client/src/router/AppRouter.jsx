// AppRouter.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { useSelector } from "react-redux";
import { BookRoutes } from "../App/routes/BookRoutes";
import { CheckingAuth } from "../ui";
import { NotFoundPage } from "../App/pages/";

export const AppRouter = () => {
  const user = useSelector((state) => state.auth.user);

  // Mostrar pantalla de carga mientras se verifica el estado de autenticación
  if (user === null) return <CheckingAuth />;

  return (
    <Routes>
      {/* Rutas para usuarios no autenticados */}
      {user === false ? (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      ) : (
        <>
          {/* Rutas para usuarios autenticados */}
          <Route path="/*" element={<BookRoutes />} />
          <Route path="/auth/*" element={<Navigate to="/" />} />
        </>
      )}

      {/* Ruta de página no encontrada */}
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  );
};
