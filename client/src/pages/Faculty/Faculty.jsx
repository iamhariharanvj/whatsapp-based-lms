import { useState, useEffect } from 'react';
import Axios from 'axios';

const FacultyPage = () => {
  const [contentList, setContentList] = useState([]);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    // Fetch existing content from the server when the page loads
    Axios.get('http://localhost:5000/faculty/content')
      .then((response) => {
        setContentList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching content:', error);
      });
  }, []);

  const handleContentChange = (event) => {
    // Update the new content state as the user types
    setNewContent(event.target.value);
  };

  const handlePostContent = () => {
    // Send the new content to the server and update the content list
    Axios.post('http://localhost:5000/faculty/content', { text: newContent })
      .then((response) => {
        // Add the newly posted content to the list
        setContentList([...contentList, response.data]);
        setNewContent(''); // Clear the input field
      })
      .catch((error) => {
        console.error('Error posting content:', error);
      });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">Faculty Page</h1>

      {/* Content Input */}
      <div className="mb-4">
        <textarea
          rows="4"
          placeholder="Write your content here..."
          value={newContent}
          onChange={handleContentChange}
          className="border border-gray-400 rounded w-full p-2"
        />
      </div>

      {/* Post Button */}
      <div className="mb-4">
        <button
          onClick={handlePostContent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post Content
        </button>
      </div>

      {/* Content List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Posted Content</h2>
        <ul className="space-y-4">
          {contentList.map((content) => (
            <li key={content.id} className="border p-4 rounded-lg shadow-md">
              {content.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FacultyPage;
