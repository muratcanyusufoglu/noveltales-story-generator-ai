'use strict';
const express = require('express');
const router = express.Router();
const { Story, Character, Topic, Timelapse, Content } = require('../models');
const OpenAI = require('openai');

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

// Create a new story
router.post('/create', async (req, res) => {
  try {
    const { userId, characterIds, characterNames, topicId, topicName, timeLapse, timeLapseTime, content, contentText, locationId, location, isContinues } = req.body;

    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    // Generate header first
    const headerResponse = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a creative assistant that generates catchy and interesting story titles.' },
        {
          role: 'user',
          content: `Create a short, engaging title for a story with the following elements:
Characters: ${characterNames.join(', ')}
Topic: ${topicName}
Time Period: ${timeLapseTime}
Story Premise: ${contentText}

The title should be brief (maximum 6-8 words) and captivating. Return only the title, nothing else.`,
        },
      ],
    });

    const generatedHeader = headerResponse.choices[0].message.content;

    // Rest of the story generation
    const gptResponse = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a creative assistant that generates interesting stories based on user inputs. Do not use asterisks (*) or any special symbols for formatting.' },
        {
          role: 'user',
          content: `Create a story with the following parameters:
Chapter 1
Characters: ${characterNames.join(', ')}
Topic: ${topicName}
Time Lapse: ${timeLapseTime}
Content: ${contentText}
Header: ${generatedHeader}
Is Story Continues: ${isContinues}. 
Important: Do not use asterisks or any special symbols in the story.`,
        },
      ],
    });

    const topicImages = topic.images;
    let storyImage = ""

    const imagesLength = topicImages.length
    const randomImageIndex = Math.floor(Math.random() * imagesLength)
    storyImage = topicImages[randomImageIndex]
    
    const generatedContent = gptResponse.choices[0].message.content;

    const story = await Story.create({
      userId,
      characterIds,
      characterNames,
      topicId,
      topicName,
      timeLapse,
      timeLapseTime,
      content,
      contentText,
      locationId,
      location,
      generatedContent,
      header: generatedHeader,
      storyImage,
      isContinues,
      totalPartCount: 1,
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Story creation failed', error);
    res.status(500).json({ error: 'Story creation failed' });
  }
});

// Get all stories
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: stories } = await Story.findAndCountAll({
      include: [
        { model: Character, through: 'StoryCharacters' },
        { model: Topic },
        { model: Timelapse },
        { model: Content },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    

    res.status(200).json({
      items: stories,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    console.error('Failed to retrieve stories', error);
    res.status(500).json({ error: 'Failed to retrieve stories' });
  }
});

// Get a story by ID
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findByPk(req.params.id, {
      include: [
        { model: Character, through: 'StoryCharacters' },
        { model: Topic },
        { model: Timelapse },
        { model: Content },
      ],
    });
    if (story) {
      res.status(200).json(story);
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (error) {
    console.error('Failed to retrieve story', error);
    res.status(500).json({ error: 'Failed to retrieve story' });
  }
});

// Get all stories for a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const userIdNumb = parseInt(userId);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: stories } = await Story.findAndCountAll({
      where: { userId: userIdNumb },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    if (stories.length > 0) {
      res.status(200).json({
        stories,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      });
    } else {
      res.status(404).json({ error: 'No stories found for the user' });
    }
  } catch (error) {
    console.error('Failed to retrieve stories', error);
    res.status(500).json({ error: 'Failed to retrieve stories' });
  }
});

// Get stories by category
router.get('/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const categoryIdNumb = parseInt(categoryId);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: stories } = await Story.findAndCountAll({
      where: { topicId: categoryIdNumb },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    if (stories.length > 0) {
      res.status(200).json({
        stories,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      });
    } else {
      res.status(404).json({ error: 'No stories found for this category' });
    }
  } catch (error) {
    console.error('Failed to retrieve stories by category', error);
    res.status(500).json({ error: 'Failed to retrieve stories by category' });
  }
});

// Update a story
router.put('/:id', async (req, res) => {
  try {
    const {generatedContent, header } = req.body;

    const [updated] = await Story.update({
      generatedContent: generatedContent,
      header: header,
    }, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedStory = await Story.findByPk(req.params.id);
      res.status(200).json(updatedStory);
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (error) {
    console.error('Failed to update story', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

router.put('/:id/continue', async (req, res) => {
  try {
    const { contentText } = req.body;
    const totalPartCount = await Story.findByPk(req.params.id).then(story => story.totalPartCount);

    const gptResponse = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a creative assistant that generates interesting stories. Keep the same style and tone of the story. Do not use asterisks (*) or any special symbols for formatting.' },
        {
          role: 'user',
          content: `Chapter ${totalPartCount + 1}\n\nContinue the story with the following content: ${contentText}`,
        },
      ],
    });

    const generatedContent = gptResponse.choices[0].message.content;

    const [updated] = await Story.update({
      generatedContent: contentText + '\n\n' + generatedContent,
      totalPartCount: totalPartCount + 1,
    }, {
      where: { id: req.params.id },
    });

    if (updated) {
      const updatedStory = await Story.findByPk(req.params.id);
      res.status(200).json(updatedStory);
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (error) {
    console.error('Failed to continue story', error);
    res.status(500).json({ error: 'Failed to continue story' });
  }
});

// Delete a story
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Story.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (error) {
    console.error('Failed to delete story', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

module.exports = router;
