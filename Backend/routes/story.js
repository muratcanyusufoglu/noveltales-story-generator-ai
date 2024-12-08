'use strict';
const express = require('express');
const router = express.Router();
const { Story, Character, Topic, Timelapse, Content } = require('../models');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create a new story
router.post('/create', async (req, res) => {
  try {
    const { userId, characterIds, characterNames, topicId, topicName, timeLapse, timeLapseTime, content,contentText, locationId, location, header, isContinues } = req.body;

    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    const topicImages = topic.images;
    let storyImage = ""

    const imagesLength = topicImages.length
    const randomImageIndex = Math.floor(Math.random() * imagesLength)
    storyImage = topicImages[randomImageIndex]
    
    //Call OpenAI API to generate story content,

    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a creative assistant that generates interesting stories based on user inputs.' },
        {
          role: 'user',
          content: `Create a story with the following parameters:\nCharacters: ${characterNames.join(', ')}\nTopic: ${topicName}\nTime Lapse: ${timeLapseTime}\nContent: ${contentText}\nHeader: ${header}\nIs Story Continues: ${isContinues}. Please not use * or any other symbols`,
        },
      ],
    });

    const generatedContent = await gptResponse.choices[0].message.content;

    //Delay for 5 seconds
    // await new Promise(resolve => setTimeout(resolve, 10000));
    // const generatedContent = "Generated Content";

    const story = await Story.create({
      userId : userId,
      characterIds : characterIds,
      characterNames : characterNames,
      topicId: topicId,
      topicName: topicName,
      timeLapse:  timeLapse,
      timeLapseTime: timeLapseTime,
      content: content,
      contentText: contentText,
      locationId: locationId,
      location: location,
      generatedContent: generatedContent,
      header: header,
      storyImage: storyImage,
      isContinues: isContinues,
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
    const stories = await Story.findAll({
      include: [
        { model: Character, through: 'StoryCharacters' },
        { model: Topic },
        { model: Timelapse },
        { model: Content },
      ],
    });
    res.status(200).json(stories);
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

  try {
    const stories = await Story.findAll({
      where: {userId: userIdNumb},

    });

    if (stories.length > 0) {
      res.status(200).json(stories);
    } else {
      res.status(404).json({ error: 'No stories found for the user' });
    }
  } catch (error) {
    console.error('Failed to retrieve stories', error);
    res.status(500).json({ error: 'Failed to retrieve stories' });
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

    const {contentText} = req.body;

    const totalPartCount = await Story.findByPk(req.params.id).then(story => {return story.totalPartCount});

    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a creative assistant that generates interesting stories. Keep the same style and tone of the story.' },
        {
          role: 'user',
          content: `Continue the story with the following content: ${contentText}. Part Number: ${totalPartCount +1}`,
        },
      ],
    });

    const generatedContent = await gptResponse.choices[0].message.content;

    console.log('generatedContent', generatedContent)
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
  }
  catch(error){
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
