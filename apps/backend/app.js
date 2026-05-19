import "dotenv/config";
import express from 'express';
import cors from 'cors';
import router from './routes/router.js';
import path from 'path'
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Register API route
app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export default app;