import { Route, Routes } from 'react-router-dom';
import * as Admin from '../pages/Admin';
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/register" element={<Admin.StudentRegistration />} />
    </Routes>
  );
};

export default AdminRoutes;
