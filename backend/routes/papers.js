const express = require('express');
const router = express.Router();
const db = require('../database');

// POST endpoint to create a new paper request
router.post('/', async (req, res) => {
  try {
    const {
      paperTopic,
      academicDiscipline,
      paperType,
      creativityLevel,
      qualityControl,
      email,
      paperFocus,
      additionalSuggestions
    } = req.body;
    
    // Validate required fields
    if (!paperTopic || !academicDiscipline || !paperType || !creativityLevel || !qualityControl || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert the paper request into the database
    const result = await db.query(
      `INSERT INTO paper_requests 
       (paper_topic, academic_discipline, paper_type, creativity_level, quality_control, email, paper_focus, additional_suggestions) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id`,
      [paperTopic, academicDiscipline, paperType, creativityLevel, qualityControl, email, paperFocus, additionalSuggestions]
    );
    
    // Send back the ID of the created request
    return res.status(201).json({ 
      message: 'Paper request created successfully', 
      requestId: result.rows[0].id 
    });
    
  } catch (error) {
    console.error('Error creating paper request:', error);
    return res.status(500).json({ error: 'An error occurred while creating the paper request' });
  }
});

module.exports = router;