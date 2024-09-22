import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('quilting'); // Default search term
  const navigate = useNavigate();

  const fetchBooks = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();
      setBooks(data.items || []);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(searchTerm);
  }, [searchTerm]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  const addToNotion = async (book, listType) => {
    const { title, description, industryIdentifiers, imageLinks, publisher, authors, pageCount, language } = book.volumeInfo;

    const bookDetails = {
      title: title,
      description: description || 'No description available',
      isbn: industryIdentifiers ? industryIdentifiers[0].identifier : 'Unknown ISBN',
      image_url: imageLinks ? imageLinks.thumbnail : '',
      publisher: publisher || 'Unknown Publisher',
      authors: authors || ['Unknown Author'],
      page_count: pageCount || 0,
      language: language || 'Unknown Language',
      status: listType === 'library' ? 'Library' : 'Wish List',
      tags: ['Fiction', 'Adventure'], // Example tags
      due_date: '2024-09-25', // Example due date
    };

    const queryString = new URLSearchParams({
      database_id: '108f0618cfa580239d8dc6fcaff7f347',
      title: bookDetails.title, 
      description: bookDetails.description,
      isbn: bookDetails.isbn,
      image_url: bookDetails.image_url,
      publisher: bookDetails.publisher,
      authors: bookDetails.authors.join(', '),
      page_count: bookDetails.page_count.toString(),
      language: bookDetails.language,
      status: bookDetails.status,
      due_date: bookDetails.due_date,
      tags: bookDetails.tags.join(', '),
    }).toString();

    const apiUrl = `http://localhost:5000/add-book?${queryString}`;

    try {
      await axios.get(apiUrl); // Using GET to send data in the query parameters
      alert(`Book added to ${listType === 'library' ? 'Library' : 'Wish List'} successfully!`);
    } catch (err) {
      alert(`Failed to add book: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      <form onSubmit={handleSearch} style={{ margin: '20px 0' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for books..."
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Search</button>
      </form>

      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h3>Book List:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {books.map((book) => {
            const { id, volumeInfo } = book;
            const { title, authors, imageLinks } = volumeInfo;

            return (
              <div key={id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
                {imageLinks && imageLinks.thumbnail ? (
                  <img src={imageLinks.thumbnail} alt={title} style={{ width: '100%' }} />
                ) : (
                  <div style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0' }} />
                )}

                <h4>{title}</h4>
                <p>{authors ? authors.join(', ') : 'Unknown Author'}</p>

                <button onClick={() => addToNotion(book, 'library')}>Add to Library</button>
                <button onClick={() => addToNotion(book, 'wish_list')}>Add to Wish List</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
