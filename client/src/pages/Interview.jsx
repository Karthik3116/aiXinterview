import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Vapi from '@vapi-ai/web';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';

// const vapi = new Vapi('3ea5e347-dd02-4187-847f-7356c10bed58');
const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);


const Interview = ({ user }) => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentInterviewRecordId, setCurrentInterviewRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preparingInterview, setPreparingInterview] = useState(false);
  const [callStatus, setCallStatus] = useState("IDLE");
  const [localUserName, setLocalUserName] = useState("Candidate");
  const [conversation, setConversation] = useState([]);
  const [currentSpeakingRole, setCurrentSpeakingRole] = useState(null);

  const [assistantCaption, setAssistantCaption] = useState("");
  const [userCaption, setUserCaption] = useState("");

  const conversationRef = useRef([]);
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // Load interview details
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert("Session expired. Redirecting to login.");
      vapi.stop();
      navigate('/login');
      return;
    }

    const loadInterview = async () => {
      setLoading(true);
      if (interviewId && interviewId !== 'new') {
        try {
          const res = await axios.get(`https://aixinterview.onrender.com/api/interview/${interviewId}`, {
            headers: { 'x-auth-token': token },
          });
          const data = res.data;
          setSubject(data.subject);
          setNumQuestions(data.numQuestions);
          setQuestions(data.questions || []);
          setConversation(data.conversation || []);
          setCurrentInterviewRecordId(data._id);
        } catch (err) {
          console.error('Interview fetch error:', err);
          alert('Interview not found or access denied.');
          navigate('/');
        }
      } else {
        setSubject('');
        setNumQuestions(5);
        setQuestions([]);
        setConversation([]);
        setCurrentInterviewRecordId(null);
      }
      setLoading(false);
    };

    loadInterview();

    const handleStorageChange = (event) => {
      if (event.key === 'token' && event.newValue === null) {
        alert("Session expired. Redirecting to login.");
        vapi.stop();
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, interviewId]);

  const saveInterviewDataAndGenerateFeedback = useCallback(async (finalConversation) => {
    const token = localStorage.getItem('token');
    if (!token || !currentInterviewRecordId) return;

    try {
      setPreparingInterview(true); // Set loading for feedback generation
      await axios.post(
        `https://aixinterview.onrender.com/api/interview/${currentInterviewRecordId}/complete`,
        { conversation: finalConversation },
        { headers: { 'x-auth-token': token } }
      );

      await axios.post(
        `https://aixinterview.onrender.com/api/interview/${currentInterviewRecordId}/feedback`,
        {
          conversation: finalConversation,
          jobRole: subject,
          candidateName: localUserName,
        },
        { headers: { 'x-auth-token': token } }
      );

      alert("Interview ended. Feedback generated!");
      navigate(`/interview/${currentInterviewRecordId}/feedback`);
    } catch (error) {
      console.error("Save/Feedback error:", error);
      alert("Failed to save interview or generate feedback.");
    } finally {
      setPreparingInterview(false); // Unset loading after feedback generation
    }
  }, [currentInterviewRecordId, subject, localUserName, navigate]);

  useEffect(() => {
    const addMessage = (role, content) => {
      if (content && content.trim() !== '') {
        setConversation(prev => [...prev, { role, content }]);
      }
    };

    vapi.on("speech-start", () => {
      setCurrentSpeakingRole("assistant");
      if (userCaption) {
        addMessage('user', userCaption);
        setUserCaption('');
      }
    });

    vapi.on("speech-end", () => {
      setCurrentSpeakingRole(null);
      if (assistantCaption) {
        addMessage('assistant', assistantCaption);
        setAssistantCaption('');
      }
    });

    vapi.on("user-speech-start", () => {
      setCurrentSpeakingRole("user");
      if (assistantCaption) {
        addMessage('assistant', assistantCaption);
        setAssistantCaption('');
      }
    });

    vapi.on("user-speech-end", () => {
      setCurrentSpeakingRole(null);
      if (userCaption) {
        addMessage('user', userCaption);
        setUserCaption('');
      }
    });

    vapi.on("call-start", () => {
      setCallStatus("ACTIVE");
      if (!currentInterviewRecordId || interviewId === 'new') {
        setConversation([]);
      }
      setAssistantCaption('');
      setUserCaption('');
    });

    vapi.on("call-end", () => {
      setCallStatus("ENDED");
      const final = [...conversationRef.current];
      if (assistantCaption) final.push({ role: 'assistant', content: assistantCaption });
      if (userCaption) final.push({ role: 'user', content: userCaption });

      setConversation(final);
      saveInterviewDataAndGenerateFeedback(final);
      vapi.stop();
      setAssistantCaption('');
      setUserCaption('');
      setCurrentSpeakingRole(null);
    });

    vapi.on("message", (msg) => {
      const turn = msg?.conversation?.[msg.conversation.length - 1];
      if (turn?.role === 'assistant') setAssistantCaption(turn.content);
      if (turn?.role === 'user') setUserCaption(turn.content);
    });

    vapi.on("error", (err) => {
      console.error("Vapi error:", err);
      alert(`Vapi Error: ${err.message}`);
      setCallStatus("IDLE");
      vapi.stop();
      setCurrentSpeakingRole(null);
      setPreparingInterview(false); // Ensure loading is off on error
    });

    return () => {
      [
        "speech-start", "speech-end",
        "user-speech-start", "user-speech-end",
        "call-start", "call-end", "message", "error"
      ].forEach(e => vapi.removeAllListeners(e));
    };
  }, [saveInterviewDataAndGenerateFeedback, assistantCaption, userCaption, interviewId, currentInterviewRecordId]);

  const startVapiCall = async (questionsArray, initialConversation = []) => {
    if (!subject || !questionsArray?.length) {
      alert("Cannot start interview: Invalid subject or questions.");
      return;
    }

    const questionList = questionsArray.map((q, i) => `${i + 1}. ${q}`).join("\n");

    let initialMessages = [
      {
        role: "system",
        content: `
          You are an AI voice assistant conducting interviews for the role of ${subject}.
          Only ask the following questions, one by one:
          ${questionList}
          Provide friendly feedback after answers, then wrap up when done.
        `.trim(),
      },
    ];

    if (initialConversation.length > 0) {
      initialMessages = [...initialMessages, ...initialConversation];
    }

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: initialConversation.length === 0
        ? `Hi ${localUserName}, ready for your ${subject} interview?`
        : "Welcome back! Let's continue.",
      transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
      voice: { provider: "playht", voiceId: "jennifer" },
      model: { provider: "openai", model: "gpt-4", messages: initialMessages },
    };

    try {
      setPreparingInterview(true); // Set loading when Vapi call starts
      await vapi.start(assistantOptions);
      setCallStatus("ACTIVE");
    } catch (err) {
      console.error("Vapi start error:", err);
      alert("Could not start interview.");
      setCallStatus("IDLE");
    } finally {
      setPreparingInterview(false); // Unset loading when Vapi call attempt is done
    }
  };

  const handleCreateNewInterview = async (e) => {
    e.preventDefault();
    setPreparingInterview(true);

    if (!subject || numQuestions < 1) {
      alert("Enter subject and valid number of questions.");
      setPreparingInterview(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'https://aixinterview.onrender.com/api/interview/generate',
        { subject, numQuestions },
        { headers: { 'x-auth-token': token } }
      );

      const { questions: newQs, interviewId: newId } = res.data;

      if (!newId) throw new Error("Invalid response: interviewId missing");

      setQuestions(newQs);
      setCurrentInterviewRecordId(newId);
      setConversation([]);
      navigate(`/interview/${newId}`, { replace: true });

      await startVapiCall(newQs);
    } catch (err) {
      console.error("Create interview error:", err);
      alert("Failed to create or start interview.");
    } finally {
      setPreparingInterview(false);
    }
  };

  const handleContinueInterview = async () => {
    if (!currentInterviewRecordId || !questions.length) {
      alert("No interview to continue.");
      return;
    }
    setPreparingInterview(true); // Set loading for continue
    try {
      await startVapiCall(questions, conversation);
    } catch (error) {
      console.error("Continue interview error:", error);
      alert("Failed to continue interview.");
    } finally {
      setPreparingInterview(false); // Unset loading
    }
  };

  // Fixed retake function - reuses existing interview instead of creating new one
  const handleRetakeInterview = async () => {
    if (!currentInterviewRecordId || !subject || numQuestions < 1) {
      alert("Cannot retake: Invalid interview data.");
      return;
    }
    
    setPreparingInterview(true);
    

    
    try {
      const token = localStorage.getItem('token');
      
      // Generate new questions for the existing interview
      const res = await axios.post(
        `https://aixinterview.onrender.com/api/interview/${currentInterviewRecordId}/regenerate`,
        { subject, numQuestions },
        { headers: { 'x-auth-token': token } }
      );
      
      const { questions: newQs } = res.data;
      
      // Update local state with new questions and reset conversation
      setQuestions(newQs);
      setConversation([]);
      
      // Start the interview with new questions
      await startVapiCall(newQs);
      
    } catch (err) {
      console.error("Retake error:", err);
      
      // Fallback: If the regenerate endpoint doesn't exist, 
      // reset conversation and start with existing questions
      console.log("Regenerate endpoint not available, using existing questions");
      try {
        setConversation([]);
        await startVapiCall(questions);
      } catch (fallbackErr) {
        console.error("Fallback retake error:", fallbackErr);
        alert("Failed to retake interview.");
      }
    } finally {
      setPreparingInterview(false);
    }
  };

  const handleEndInterview = () => {
    setPreparingInterview(true); // Set loading for ending and feedback generation
    vapi.stop();
    // The call-end event listener will handle setting status to ENDED and calling saveInterviewDataAndGenerateFeedback,
    // which then handles `setPreparingInterview(false)`
  };

  return (
    <div className="container mt-5">
      <h2>AI Interview</h2>
      {loading ? (
        <p>Loading interview...</p>
      ) : preparingInterview ? (
        <p>🔄 Preparing interview / Generating Feedback...</p>
      ) : (
        <>
          {!currentInterviewRecordId ? (
            <form onSubmit={handleCreateNewInterview}>
              <div className="form-group">
                <label>Subject:</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="form-control" required />
              </div>
              <div className="form-group mt-2">
                <label>Number of Questions:</label>
                <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))} className="form-control" min={1} required />
              </div>
              <button type="submit" className="btn btn-primary mt-3">Start New Interview</button>
            </form>
          ) : (
            <>
              <h5 className="mt-3">Subject: {subject}</h5>

              <div className="row mt-4">
                <div className="col-md-6">
                  <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <strong>AI Interviewer</strong>
                      {callStatus === "ACTIVE" && currentSpeakingRole === "assistant" && (
                        <span className="text-danger fw-bold">🎤</span>
                      )}
                    </div>
                    <div className="card-body">
                      <p>{assistantCaption || "..."}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card shadow-sm">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <strong>{localUserName}</strong>
                      {callStatus === "ACTIVE" && currentSpeakingRole === "user" && (
                        <span className="text-success fw-bold">🎤</span>
                      )}
                    </div>
                    <div className="card-body">
                      <p>{userCaption || "..."}</p>
                    </div>
                  </div>
                </div>
              </div>

              {callStatus !== "ACTIVE" && (
                <>
                  <button onClick={handleContinueInterview} className="btn btn-success mt-4 me-2" disabled={preparingInterview}>Continue Interview</button>
                  <button onClick={handleRetakeInterview} className="btn btn-warning mt-4" disabled={preparingInterview}>Retake Interview</button>
                  {currentInterviewRecordId && (
                     <button onClick={() => navigate(`/interview/${currentInterviewRecordId}/feedback`)} className="btn btn-info mt-4 ms-2">View Feedback</button>
                   )}
                </>
              )}
              {callStatus === "ACTIVE" && (
                <button onClick={handleEndInterview} className="btn btn-danger mt-4" disabled={preparingInterview}>End Interview</button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Interview;