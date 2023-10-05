import { Routes, Route } from 'react-router-dom';
import * as Faculty from '../pages/Faculty';
const FacultyRoutes = () => {
  return (
    <Routes>
      <Route path="/faculty/dashboard" element={<Faculty.Faculty />} />
    </Routes>
  );
};

export default FacultyRoutes;
