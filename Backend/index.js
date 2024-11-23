const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json()); // For parsing application/json

// Import the route files
const userRoutes = require('./routes/user');
const characterRoutes = require('./routes/character');
const storyRoutes = require('./routes/story');
const topicRoutes = require('./routes/topic');
const timelapseRoutes = require('./routes/timelapse');
const postRoutes = require('./routes/post');
const dailyRoutes = require('./routes/daily');
const followsRoutes = require('./routes/follows');
const contentRoutes = require('./routes/content');
const locationRoutes = require('./routes/location');
// Set up route handling
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/timelapse', timelapseRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/follows', followsRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/locations', locationRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});