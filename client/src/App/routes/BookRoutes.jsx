import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import PostPage from "../pages/PostPage/PostPage";
import MyAccountPage from "../pages/MyAccountPage/MyAccountPage";


export const BookRoutes = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={ <HomePage /> }/>
            <Route path="/posts" element={ <PostPage /> }/>
            <Route path="/myaccount" element={ <MyAccountPage /> }/>

            <Route path="/*" element={ <Navigate to="/not-found" /> }/>
        </Routes>
    </>
  )
}
