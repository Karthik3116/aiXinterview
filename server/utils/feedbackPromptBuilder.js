exports.generateFeedbackPrompt = (conversation, jobRole, candidateName) => {
  const formattedConversation = JSON.stringify(conversation, null, 2);

  return `
${formattedConversation}

Based on the Interview Conversation between the assistant and the user, provide a comprehensive feedback analysis.

For each question asked by the assistant:
1. Briefly state the question asked.
2. Summarize the user's response.
3. Analyze the relevance of the user's response to the question. Indicate if the answer **directly addresses the question ("relevant")**, is **partially relevant ("partially relevant")**, or is **irrelevant ("irrelevant")**. Explain your reasoning briefly. **Ensure the relevance value is enclosed in double quotes.**

Overall Feedback:
1. Provide a rating out of 10 for the following skills demonstrated by the user throughout the interview:
   - Technical Skills: <give rating out of 10>
   - Communication: <give rating out of 10>
   - Problem Solving: <give rating out of 10>
   - Experience: <give rating out of 10>

2. Give a detailed summary (in approximately 5-7 lines) of the overall interview. This summary should include:
   - The key topics discussed.
   - The user's strengths and weaknesses as evident from their responses.
   - An assessment of the depth and clarity of their answers.
   - Observations on their engagement and communication style. **Ensure this summary is enclosed in double quotes.**

3. Provide a clear recommendation for hire (**"Yes"**, **"No"**, or **"Maybe"** - **ensure the recommendation is enclosed in double quotes**).

4. Provide a brief recommendation message (1-2 lines) explaining the reasoning behind the hire recommendation. **Ensure this message is enclosed in double quotes.**

**You MUST respond with a valid JSON object in the following format. Ensure all string values are enclosed in double quotes:**

{
  "feedback": {
    "questionAnalysis": [
      {
        "question": "<Question 1>",
        "userResponseSummary": "<Summary of user's answer>",
        "relevanceAnalysis": {
          "relevant": "true"/"false"/"partially relevant",
          "reasoning": "<Brief explanation of relevance>"
        }
      }
      // ...
    ],
    "overallRating": {
      "technicalSkills": <rating out of 10>,
      "communication": <rating out of 10>,
      "problemSolving": <rating out of 10>,
      "experience": <rating out of 10>
    },
    "overallSummary": "<Detailed summary of the interview in 5-7 lines>",
    "recommendation": "Yes"/"No"/"Maybe",
    "recommendationMessage": "<1-2 line message explaining the recommendation>"
  }
}
`;
};

exports.parseStructuredFeedback = (rawText) => {
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};
