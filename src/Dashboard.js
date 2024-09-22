import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Circles } from 'react-loader-spinner'; // Import the loader

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
    const { title, description, industryIdentifiers, previewLink, publisher, publishedDate, authors, pageCount, categories, language } = book.volumeInfo;
    const { retailPrice } = book.saleInfo;

    const bookDetails = {
      title,
      description: description || 'No description available',
      isbn: industryIdentifiers ? industryIdentifiers[0].identifier : 'Unknown ISBN',
      previewLink: previewLink || '',
      publisher: publisher || 'Unknown Publisher',
      publishedDate: publishedDate || 'Unknown Publisher',
      authors: authors || ['Unknown Author'],
      page_count: pageCount || 0,
      language: language || 'Unknown Language',
      status: listType === 'library' ? 'Library' : 'Wishlist',
      tags: ['Fiction', 'Adventure'],
      due_date: '2024-09-25',
      price: retailPrice ? retailPrice.amount : 0,
      genre: categories || ['Unknown genre'],
    };

    const queryString = new URLSearchParams({
      database_id: '108f0618cfa580239d8dc6fcaff7f347',
      title: bookDetails.title,
      isbn: bookDetails.isbn,
      previewLink: bookDetails.previewLink,
      publisher: bookDetails.publisher,
      publishedDate: bookDetails.publishedDate,
      authors: bookDetails.authors.join(', '),
      page_count: bookDetails.page_count.toString(),
      language: bookDetails.language,
      status: bookDetails.status,
      due_date: bookDetails.due_date,
      tags: bookDetails.tags.join(', '),
      price: bookDetails.price,
      genre: bookDetails.genre.join(', '),
    }).toString();

    const apiUrl = `http://localhost:5000/add-book?${queryString}`;
    
    setLoading(true); // Start loader
    try {
      await axios.get(apiUrl);
      toast.success(`Book added to ${listType === 'library' ? 'Library' : 'Wish List'} successfully!`);
    } catch (err) {
      toast.error(`Failed to add book: ${err.message}`);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="book-track">
      <ToastContainer />
      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-box">
            <img src="search-svgrepo-com 1.png" alt="Search Icon" className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>

      <h2 className="border">Bestsellers</h2>

      {loading && <Circles color="#3498db" height={50} width={50} /> } {/* Show loader when loading */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="book-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', maxWidth: '453px', width: '100%', padding: '20px' }}>
          {books.map((book) => {
            const { id, volumeInfo } = book;
            const { title, authors, imageLinks } = volumeInfo;

            return (
              <div className="book-parent" key={id} style={{ display: 'flex', padding: '20px', width: '100%' }}>
                {imageLinks && imageLinks.thumbnail ? (
                  <img src={imageLinks.thumbnail} alt={title} style={{ width: '100px', height: '150px', marginRight: '20px' }} />
                ) : (
                  <div style={{ width: '100px', height: '150px', backgroundColor: '#f0f0f0', marginRight: '10px' }} />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 className="book-title">{title}</h4>
                    <p className="book-para">{authors ? authors.join(', ') : 'Unknown Author'}</p>
                  </div>
                  <div>
                    <button className="library" onClick={() => addToNotion(book, 'library')} style={{ marginRight: '10px' }}>
                      Library
                    </button>
                    <button className="wishlist" onClick={() => addToNotion(book, 'wish_list')}>
                      WishList
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
