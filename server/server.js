import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 4000;
const app = express();

// Initialize Middleware
app.use(express.json());
app.use(cors());

// API routes
app.get('/', (req, res) => res.send("Success"));

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));