import { BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminRoutes from './adminRoutes';
import FacultyRoutes from './facultyRoutes';
import AuthRoutes from './authRoutes';
const RootRouter = () => {
  return (
    <>
      <Router>
        <AdminRoutes />
        <AuthRoutes />
        <FacultyRoutes />
      </Router>
    </>
  );
};

export default RootRouter;
