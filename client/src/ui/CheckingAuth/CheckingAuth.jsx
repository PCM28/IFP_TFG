import { Spinner } from "react-bootstrap";
import "./CheckingAuth.css";

export const CheckingAuth = () => {
  return (
    <>
        <div className="Checking">
            <Spinner animation="border" variant="light" />
        </div>
    </>
  )
}
