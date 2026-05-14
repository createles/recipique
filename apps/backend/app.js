import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies eg. forms

// Root Route Checker Helper
app.get('/', (req, res) => {
  res.json({ 
    message: "Readying your site ingredients...",
    status: "healthy"
  });
});

// --- ROUTE REGISTRATION ---
// eg. app.use('/api/auth', authRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong in the kitchen!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export default app;