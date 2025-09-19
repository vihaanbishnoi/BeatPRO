// Signup component for user registration
// Handles user input, form submission, and feedback
import { useState } from 'react';

export default function Signup() {
  // State variables for form fields and UI feedback
  const [email, setEmail] = useState(''); // Stores email input
  const [password, setPassword] = useState(''); // Stores password input
  const [message, setMessage] = useState(''); // Stores feedback message
  const [isLoading, setIsLoading] = useState(false); // Indicates loading state

  // Handles form submission and communicates with backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setIsLoading(true);
    setMessage('');
    try {
      // Send signup request to backend API
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        // Show success message and redirect to home page
        setMessage('Account created! Redirecting...');
        setTimeout(() => {
          window.location.href = '/home';
        }, 1500);
      } else {
        // Show error message from backend
        setMessage(data.message || 'Signup failed');
      }
    } catch {
      // Show network error
      setMessage('Network error');
    }
    setIsLoading(false);
  };

  return (
    // Minimal signup form UI
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '40px auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Sign Up</h2>
      {/* Email input field */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={isLoading}
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      {/* Password input field */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        disabled={isLoading}
        style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
      />
      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !email || !password}
        style={{ width: '100%', padding: 10, borderRadius: 4, border: 'none', background: '#333', color: '#fff', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer' }}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </button>
      {/* Show message if present */}
      {message && <div style={{ marginTop: 16, textAlign: 'center', color: '#d00' }}>{message}</div>}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        {/* Link to login page */}
        <a href="/login" style={{ color: '#333', textDecoration: 'underline' }}>
          Already have an account? Login
        </a>
      </div>
    </form>
  );
}