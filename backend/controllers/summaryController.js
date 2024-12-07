const axios = require('axios');
const { JSDOM } = require('jsdom'); 
const Summary = require('../models/Summary');
require('dotenv').config();

// GROQ Cloud API endpoint and key
const GROQ_API_URL = process.env.GROQ_API_URL;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

/**
 * @desc Fetch and parse website content, cleaning unnecessary elements.
 * @param {string} url - The URL to fetch and parse.
 * @returns {string} Cleaned text content.
 */
const fetchAndParseURL = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 10000 }); // Handle timeout errors gracefully
    const dom = new JSDOM(response.data);

    // Remove scripts, styles, and other unnecessary tags
    const document = dom.window.document;
    const elementsToRemove = document.querySelectorAll('script, style, header, footer, nav, aside');
    elementsToRemove.forEach(el => el.remove());

    // Extract and clean text content
    let parsedContent = document.body.textContent || '';
    parsedContent = parsedContent.replace(/\s+/g, ' ').trim(); // Collapse spaces and trim

    if (parsedContent.length < 100) { // Handle edge cases where content is too short
      throw new Error('Insufficient content to summarize.');
    }

    return parsedContent;
  } catch (error) {
    throw new Error(`Error fetching or parsing URL: ${error.message}`);
  }
};

/**
 * @desc Summarize content using GROQ Cloud API.
 * @param {string} content - The text content to summarize.
 * @returns {string} The summarized content.
 */

const summarizeContent = async (content) => {
  try {
    const payload = {
      model: "llama3-8b-8192", // Adjust the model based on your needs
      messages: [
        {
          role: "system",
          content: "You are a summarization assistant.",
        },
        {
          role: "user",
          content: `Please summarize the following content: ${content}`,
        },
      ],
      temperature: 0.7, // Tune based on desired creativity
      max_tokens: 1024,
      top_p: 1,
      stream: false, // For synchronous responses
    };

    const response = await axios.post(
      GROQ_API_URL,
      payload,
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response.data);

    if (response.status !== 200 || !response.data.choices) {
      throw new Error('Summarization failed or incomplete response.');
    }

    // Extract the summary text from the choices array
    const summary = response.data.choices[0].message.content;

    return summary;
  } catch (error) {
    console.log("Error details:", error.response?.data);
    throw new Error(`Error summarizing content: ${error.response?.data?.message || error.message}`);
  }
};


/**
 * @desc Process a website URL, summarize content, and save the summary.
 * @route POST /api/summary/url
 */
const summarizeFromURL = async (req, res) => {
  const { url, summaryName } = req.body;

  if (!url || !summaryName) {
    return res.status(400).json({ message: 'URL and summary name are required' });
  }

  try {
    const parsedContent = await fetchAndParseURL(url);

    const summary = await summarizeContent(parsedContent);

    const newSummary = new Summary({
      url,
      summaryName,
      websiteContent: parsedContent,
      summary,
    });

    await newSummary.save();

    return res.status(200).json({
      message: 'Summary created successfully',
      data: {
        _id: newSummary._id,
        summaryName: newSummary.summaryName,
        url: newSummary.url,
        websiteContent: newSummary.websiteContent,
        summary: newSummary.summary,
        createdAt: newSummary.createdAt,
        updatedAt: newSummary.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error in summarizeFromURL:', error.message);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



/**
 * @desc Fetch all summaries.
 * @route GET /api/summary
 */
const getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'Summaries fetched successfully', data: summaries });
  } catch (error) {
    console.error('Error fetching summaries:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc Update a summary by ID.
 * @route PUT /api/summary/:id
 */
const updateSummary = async (req, res) => {
  const { id } = req.params;
  const { summary } = req.body;

  try {
    const updatedSummary = await Summary.findByIdAndUpdate(id, { summary }, { new: true });

    if (!updatedSummary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    res.status(200).json({ message: 'Summary updated successfully', data: updatedSummary });
  } catch (error) {
    console.error('Error updating summary:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc Delete a summary by ID.
 * @route DELETE /api/summary/:id
 */
const deleteSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const summary = await Summary.findById(id);

    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    await Summary.findByIdAndDelete(id);

    res.status(200).json({ message: 'Summary deleted successfully' });
  } catch (error) {
    console.error('Error deleting summary:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  summarizeFromURL,
  getAllSummaries,
  updateSummary,
  deleteSummary,
};


