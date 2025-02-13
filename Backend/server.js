import app from './app.js';
import connectDB from './config/db.js';

connectDB();

app.listen(3000, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});