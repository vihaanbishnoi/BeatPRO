import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from "pg";
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Client setup
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Connect to database with error handling
db.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Database connection error:', err));

// Create users table if it doesn't exist
const createUsersTable = async () => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table ready');
    } catch (err) {
        console.error('Error creating users table:', err);
    }
};
createUsersTable();

// Routes
app.get('/', (req, res) => {
    // Step 2.1 Test the server //
    res.send('Hello World!');
});

// Signup route
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Insert new user
        const newUser = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, hashedPassword]
        );
        // In short, it helps the frontend keep track of the authenticated user and provide a personalized experience.
        res.status(201).json({ 
            message: 'User created successfully',
            user: { id: newUser.rows[0].id, email: newUser.rows[0].email }
        });
        
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find user
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        // In short, it helps the frontend keep track of the authenticated user and provide a personalized experience.
        res.json({ 
            message: 'Login successful',
            user: { id: user.id, email: user.email }
        });
        
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});