import { useState, useEffect } from 'react';
import Axios from 'axios';
import EditStudentModal from './EditStudentModel';

const StudentRegistration = () => {
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const [verifiedStudents, setVerifiedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    Axios.get('http://localhost:5000/students/unverified').then((response) => {
      setUnverifiedStudents(response.data);
    });

    Axios.get('http://localhost:5000/students/').then((response) => {
      setVerifiedStudents(response.data);
    });
  }, []);

  useEffect(() => {
    const sortedStudents = verifiedStudents;
    sortedStudents.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'progress') {
        return b.progress - a.progress;
      }
    });
    setVerifiedStudents(sortedStudents);
  }, [sortBy, verifiedStudents]);

  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const saveEditedStudent = (editedStudent) => {
    console.log('Saving edited student:', editedStudent);
    closeEditModal();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Unverified Students</h2>
        <ul className="list-disc pl-4">
          {unverifiedStudents.map((student) => (
            <li key={student.id} className="mb-2">
              {student.phoneNumber}{' '}
              <button
                onClick={() => openEditModal(student)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Verify
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <EditStudentModal
          student={editingStudent}
          onClose={closeEditModal}
          onSave={saveEditedStudent}
        />
      )}

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Verified Students</h2>
        <div className="mb-4">
          <label htmlFor="sortBy">Sort By:</label>
          <select
            id="sortBy"
            className="ml-2 p-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="progress">Progress</option>
          </select>
        </div>
        <ul className="space-y-4">
          {verifiedStudents.map((student) => (
            <li key={student.id} className="border p-4 rounded-lg shadow-md">
              <div className="mb-2">
                <span className="text-lg font-semibold">{student.name}</span>
              </div>
              <div className="mb-2">
                <span className="text-gray-700">Phone Number:</span>{' '}
                {student.phoneNumber}
              </div>
              <div className="mb-2">
                <span className="text-gray-700">Language:</span>{' '}
                {student.language}
              </div>
              <div className="mb-2">
                <span className="text-gray-700">Level:</span> {student.level}
              </div>
              <div className="mb-2">
                <span className="text-gray-700">Progress:</span>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        {student.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="flex mb-2 items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full">
                      <div
                        className="w-full bg-blue-500 text-xs leading-none py-1 text-center rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentRegistration;
