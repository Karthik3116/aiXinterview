import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Vapi from '@vapi-ai/web';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

// Initialize Vapi once
const vapi = new Vapi('f631dbe4-c868-4f6f-a3ae-65da94fbefe4');

const App = () => {
  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [callStatus, setCallStatus] = useState("IDLE");
  const [localUserName, setLocalUserName] = useState("Candidate");
  const [jobPosition, setJobPosition] = useState("");
  const [conversation, setConversation] = useState([]);

  const navigate = useNavigate();

  // Refs for current messages
  const currentAssistantMessage = useRef(null);
  const currentUserMessage = useRef(null);
  const conversationRef = useRef([]);

  // Update conversationRef when conversation state changes
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // Set initial job position from subject
  useEffect(() => {
    setJobPosition(subject);
  }, [subject]);

  // Memoized function to generate and send feedback
  const GenerateFeedback = useCallback(async (fullConversation) => {
    console.log("Sending full conversation for processing...", fullConversation);

    const conciseConversation = fullConversation.reduce((acc, turn, index, arr) => {
      if (turn.role === 'assistant' && index + 1 < arr.length && arr[index + 1].role === 'user') {
        acc.push({ question: turn.content, answer: arr[index + 1].content });
      }
      return acc;
    }, []);
    console.log("Sending question-answer-pairs for feedback...", conciseConversation);

    try {
      // IMPORTANT: Adjust this URL if your backend is not on localhost:3030
      const feedbackResponse = await axios.post(
        `http://localhost:3030/api/interview/${'someInterviewId'}/feedback`, // You'll need to pass a real interviewId
        {
          Conversation: conciseConversation,
          userId: 'someUserId', // Replace with actual userId from context/props
          jobRole: jobPosition,
          candidateName: localUserName,
        }
      );

      console.log("Feedback from backend:", feedbackResponse.data);

      if (feedbackResponse.data?.feedbackId) {
        navigate(
          `/interview/${'someInterviewId'}/feedback/${feedbackResponse.data.feedbackId}` // Use real interviewId
        );
      } else {
        alert("Error: Could not retrieve feedback ID from the backend.");
      }
    } catch (error) {
      console.error("Error generating and saving feedback:", error);
      alert("Error generating feedback. Please try again later.");
    }
  }, [jobPosition, localUserName, navigate]);

  // VAPI event listeners
  useEffect(() => {
    const addMessageToConversation = (role, content) => {
      if (content && content.trim() !== '') {
        setConversation(prevConversation => {
          const lastMessage = prevConversation[prevConversation.length - 1];
          // Prevent duplicate consecutive messages
          if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
            return prevConversation;
          }
          return [...prevConversation, { role, content }];
        });
      }
    };

    vapi.on("speech-start", () => {
      console.log("Assistant speech started.");
      if (currentUserMessage.current) {
        addMessageToConversation('user', currentUserMessage.current);
        currentUserMessage.current = null;
      }
      currentAssistantMessage.current = "";
    });

    vapi.on("speech-end", () => {
      console.log("Assistant speech ended.");
      addMessageToConversation('assistant', currentAssistantMessage.current);
      currentAssistantMessage.current = null;
    });

    vapi.on("user-speech-start", () => {
      console.log("User speech started.");
      if (currentAssistantMessage.current) {
        addMessageToConversation('assistant', currentAssistantMessage.current);
        currentAssistantMessage.current = null;
      }
      currentUserMessage.current = "";
    });

    vapi.on("user-speech-end", () => {
      console.log("User speech ended.");
      addMessageToConversation('user', currentUserMessage.current);
      currentUserMessage.current = null;
    });

    vapi.on("call-start", () => {
      console.log("Call started.");
      alert("Call connected..");
      setCallStatus("ACTIVE");
      setConversation([]);
      currentAssistantMessage.current = null;
      currentUserMessage.current = null;
    });

    vapi.on("call-end", () => {
      console.log("Call ended.");
      alert("Interview ended..");
      setCallStatus("ENDED");

      const finalConversation = [...conversationRef.current];
      if (currentAssistantMessage.current && currentAssistantMessage.current.trim() !== '') {
        finalConversation.push({ role: 'assistant', content: currentAssistantMessage.current });
      }
      if (currentUserMessage.current && currentUserMessage.current.trim() !== '') {
        finalConversation.push({ role: 'user', content: currentUserMessage.current });
      }
      setConversation(finalConversation);
      GenerateFeedback(finalConversation);

      // --- ADD THIS LINE ---
      // Automatically stop the Vapi call when the "call-end" event occurs.
      vapi.stop();
      // --- END ADDITION ---

      currentAssistantMessage.current = null;
      currentUserMessage.current = null;
    });

    vapi.on("message", (message) => {
      if (message?.conversation && message.conversation.length > 0) {
        const latestTurn = message.conversation[message.conversation.length - 1];
        if (latestTurn) {
          if (latestTurn.role === 'assistant') {
            currentAssistantMessage.current = latestTurn.content;
          } else if (latestTurn.role === 'user') {
            currentUserMessage.current = latestTurn.content;
          }
        }
      }
    });

    vapi.on("error", (err) => {
      console.error("❌ Vapi Error:", err);
      alert(`Vapi Error: ${err.message || 'An unknown error occurred.'}`);
      setCallStatus("IDLE");
    });

    return () => {
      vapi.removeAllListeners("speech-start");
      vapi.removeAllListeners("speech-end");
      vapi.removeAllListeners("user-speech-start");
      vapi.removeAllListeners("user-speech-end");
      vapi.removeAllListeners("call-start");
      vapi.removeAllListeners("call-end");
      vapi.removeAllListeners("message");
      vapi.removeAllListeners("error");
    };
  }, [GenerateFeedback]);

  // Function to start the interview call
  const startVapiCall = async (questionsArray) => {
    const questionList = questionsArray.map((q, i) => `${i + 1}. ${q}`).join("\n"); // Format for clarity in prompt
    console.log("Question List for AI:", questionList);

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${localUserName}, how are you? Ready for your interview on ${jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
              You are an AI voice assistant conducting interviews for the role of ${jobPosition}.
              Your job is to ask candidates **exactly** the provided interview questions, and then assess their responses.
              Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
              "Hey there ${localUserName}! Welcome to your ${jobPosition} interview. Let’s get started with a few questions!"
              
              Ask **one question at a time** from the list below and wait for the candidate’s response before proceeding to the next. Keep the questions clear and concise.
              
              **Interview Questions (ask in order, one by one):**
              ${questionList}
              
              If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
              "Need a hint? Think about how React tracks component updates!"
              
              Provide brief, encouraging feedback after each answer. Example:
              "Nice! That’s a solid answer."
              "Hmm, not quite! Want to try again?"
              
              Keep the conversation natural and engaging—use casual phrases like "Alright, next up…" or "Let’s tackle a tricky one!"
              
              **After all ${questionsArray.length} questions from the provided list have been asked and answered**, smoothly wrap up the interview by summarizing their performance. Example:
              "That was great! You handled some tough questions well. Keep sharpening your skills!"
              
              End on a positive note:
              "Thanks for chatting ${localUserName}! Hope to see you crushing projects soon!"
              
              **Key Guidelines:**
              ✅ Be friendly, engaging, and witty.
              ✅ Keep responses short and natural, like a real conversation.
              ✅ Adapt based on the candidate’s confidence level.
              ✅ Ensure the interview remains focused on topics relevant to a ${jobPosition} role.
              ✅ **CRITICAL:** You MUST only ask questions from the provided list. **DO NOT ask any questions that are not explicitly in the 'Interview Questions' list.**
              ✅ **CRITICAL:** The interview MUST conclude immediately after the last question in the provided list has been asked and the candidate has responded. Do NOT ask any additional questions or continue the conversation beyond this point.
            `.trim(),
          },
        ],
      },
    };

    try {
      await vapi.start(assistantOptions);
      setCallStatus("ACTIVE");
    } catch (error) {
      console.error("Failed to start Vapi call:", error);
      alert("Failed to start interview call. Please check your Vapi API key and network connection.");
      setCallStatus("IDLE");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);
    setCallStatus("IDLE");

    if (!subject || numQuestions < 1) {
      alert("Please enter a subject and a valid number of questions.");
      setLoading(false);
      return;
    }

    try {
      // IMPORTANT: Adjust this URL if your backend is not on localhost:5000
      const response = await axios.post('http://localhost:5000/api/interview', {
        subject,
        numQuestions,
      });

      const generatedQuestions = response.data.questions;
      setQuestions(generatedQuestions);
      setJobPosition(subject);
      await startVapiCall(generatedQuestions);
    } catch (error) {
      console.error('Error fetching questions or starting interview:', error);
      alert('Failed to fetch questions or start interview. Please check server and API.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    vapi.stop();
  };

  const handleRepeat = () => {
    vapi.repeat();
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="p-4 rounded" style={{ backgroundColor: '#000', borderRadius: '20px', boxShadow: '0 0 20px rgba(0,0,0,0.6)', width: '90%', maxWidth: '1200px' }}>
        <h1 className="text-2xl font-bold mb-4 text-white text-center">🎤 AI Interview Setup</h1>

        <form onSubmit={handleFormSubmit} className="space-y-4 mb-4">
          <input
            type="text"
            placeholder="Enter Subject (e.g., Python)"
            className="w-full border p-2 rounded"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            disabled={callStatus === "ACTIVE"}
          />
          <input
            type="number"
            placeholder="Number of Questions"
            className="w-full border p-2 rounded"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            min="1"
            required
            disabled={callStatus === "ACTIVE"}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded w-full"
            disabled={loading || callStatus === "ACTIVE"}
          >
            {loading ? 'Generating...' : (callStatus === "ACTIVE" ? 'Interview Active' : 'Start Interview')}
          </button>
        </form>

        {questions.length > 0 && (
          <div className="mt-6 text-white">
            <h2 className="text-xl font-semibold">🧠 Questions:</h2>
            <ul className="list-disc pl-5 mt-2">
              {questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="row w-100 d-flex justify-content-center mt-4">
          <div className="col-md-6 d-flex justify-content-center">
            {callStatus === "ACTIVE" ? (
              <>
                <button
                  className="btn btn-secondary mr-2"
                  onClick={handleRepeat}
                >
                  Repeat
                </button>
                <button className="btn btn-danger ml-2" onClick={handleStop}>
                  Leave Interview
                </button>
              </>
            ) : null}
          </div>
        </div>

        {callStatus === "ACTIVE" && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            🎙️ Interview in progress...
          </div>
        )}
      </div>
    </div>
  );
};

export default App;