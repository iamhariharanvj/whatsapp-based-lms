import { useState } from 'react';
import Axios from 'axios';

// eslint-disable-next-line react/prop-types
const EditStudentModal = ({ student, onClose, onSave }) => {
  const [editedStudent, setEditedStudent] = useState({ ...student });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedStudent({
      ...editedStudent,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    editedStudent.verified = true;

    console.log('JFWIOEJEOWJF');
    console.log(editedStudent);

    Axios.post(`http://localhost:5000/students/${editedStudent.id}/update`, {
      language: editedStudent.language,
      level: editedStudent.level,
      name: editedStudent.name,
      phoneNumber: editedStudent.phoneNumber,
      progress: editedStudent.progress,
      verified: true,
    })
      .then(() => {
        onSave(editedStudent);
        onClose();
      })
      .catch((error) => {
        console.error('Error updating student data:', error);
      });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Edit Student</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={editedStudent.name}
            onChange={handleInputChange}
            className="border border-gray-400 rounded w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={editedStudent.phoneNumber}
            onChange={handleInputChange}
            className="border border-gray-400 rounded w-full p-2"
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Language</label>
          <select
            name="language"
            value={editedStudent.language}
            onChange={handleInputChange}
            className="border border-gray-400 rounded w-full p-2"
          >
            <option value="Hindi">Hindi</option>
            <option value="Kashmiri">Kashmiri</option>
            <option value="Tamil">Tamil</option>
            <option value="English">English</option>
            {/* Add more language options as needed */}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Level</label>
          <select
            name="level"
            value={editedStudent.level}
            onChange={handleInputChange}
            className="border border-gray-400 rounded w-full p-2"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
