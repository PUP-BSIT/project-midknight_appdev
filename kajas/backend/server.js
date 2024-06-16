const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const emailRoute = require('./routes/emailRoute');
const userRoutes = require('./routes/userRoutes');
const resetRoute = require('./routes/resetRoute');
const profileRoute = require('./routes/profileRoute');
const searchRoute = require('./routes/searchRoute');
const artworkRouter = require('./routes/artwork');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json()); 
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api', authRoutes);
app.use(emailRoute);
app.use('/api/users', userRoutes);
app.use(resetRoute);
app.use('/api', profileRoute);
app.use('/api', searchRoute);
app.use('/api', artworkRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
