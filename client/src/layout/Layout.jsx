import { useSelector } from "react-redux";
import { NavBar, Footer } from "../App/components";
import { AppRouter } from "../router/AppRouter";
import "./Layout.css";
export const Layout = () => {
  
  const user = useSelector((state) => state.auth.user);
  
  return (
    <div className="Layout">
        {/* Solo mostrar el NavBar si el usuario está autenticado */}
        { user && ( 
          <header>
            <NavBar />
          </header>
        )}

        <main>
          <AppRouter />
        </main>

        { user && ( 
          <footer>
            <Footer />
          </footer>
        )}

    </div>
  )
}
