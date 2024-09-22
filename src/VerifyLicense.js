import React, { useState } from 'react';
import axios from 'axios';

const VerifyLicense = () => {
  const [productId, setProductId] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notionResult, setNotionResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const url = 'https://api.gumroad.com/v2/licenses/verify';

    const params = new URLSearchParams();
    params.append('product_id', productId);
    params.append('license_key', licenseKey);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: params,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'License verification failed');
      }
    } catch (err) {
      setError('An error occurred while verifying the license.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotionConnect = () => {
    const notionAuthUrl = 'https://api.notion.com/v1/oauth/authorize?client_id=105d872b-594c-80ea-831c-00372f102a90&response_type=code&owner=user&redirect_uri=http%3A%2F%2F127.0.0.1:3000/dashboard%2Fauth%2Fnotion%2Fcallback';
    window.location.href = notionAuthUrl;
  };

  return (
    <div>
    <div className='verify-contain'>
   <div className='verify-license'>
    <h2>step 1</h2>
    <p>Duplicate the template to your workspace.<br></br> Here are the instructions.</p>
     <h2>step 2</h2>
    <p>Submit your license key here. You can find <br></br> your instruction key from your contents page <br></br> in Gumroad</p>
      <form onSubmit={handleVerify}>
        {/* <div>
          <label>Product ID:</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          />
        </div> */}
        <div className='margin-space'>
          <label>License Key:</label><br></br>
          <input
            type="text"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            required
          />
        </div>
        <button   class="full-width-button" type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify License'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <h2>step 3</h2>
          <p>Once you have duplicated the template. Click on the below button to connect the duplicated page of the template with the book tracker widget</p>
          <h3>Verification Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <button className="full-width-button" onClick={handleNotionConnect}>Connect with Notion</button>
        </div>
      {notionResult && <p>{notionResult}</p>}
    </div>
    </div>
    </div>

 
  );
};

export default VerifyLicense;
