
import React from 'react';

const HeadlineGenerationSection = () => {
  return (
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Generation Settings:</strong>
        <ul className="list-disc pl-6 mt-2">
          <li>Model Selection: Choose between different AI models for generation</li>
          <li>Focus Words: Prioritize specific keywords in headlines</li>
          <li>Word Omissions: Exclude specific words from generated headlines</li>
          <li>Tone Selection: Control emotional impact (provocative, neutral, professional, etc.)</li>
          <li>Word Count: Set maximum length for headlines (short, medium, long)</li>
          <li>Randomness: Adjust variation in generated headlines</li>
          <li>Emoji Usage: Control emoji inclusion and placement</li>
          <li>Style Selection: Choose format type (email subject, news headline, social media, etc.)</li>
          <li>Custom Prompts: Create and save your own generation prompts</li>
        </ul>
      </li>
      <li><strong>Headline Generation:</strong>
        <ul className="list-disc pl-6 mt-2">
          <li>Batch generation of multiple unique headlines</li>
          <li>Real-time generation with progress tracking</li>
          <li>Smart duplicate detection and filtering</li>
          <li>Automatic content relevance scoring</li>
        </ul>
      </li>
      <li><strong>Template Support:</strong> Save and reuse successful headline patterns as templates.</li>
      <li><strong>Generation History:</strong> Track and analyze past headline generation results.</li>
    </ul>
  );
};

export default HeadlineGenerationSection;
