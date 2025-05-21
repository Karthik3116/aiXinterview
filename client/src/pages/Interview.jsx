

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Vapi from '@vapi-ai/web';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';

const vapi = new Vapi('f631dbe4-c868-4f6f-a3ae-65da94fbefe4');

const Interview = ({ user }) => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentInterviewRecordId, setCurrentInterviewRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callStatus, setCallStatus] = useState("IDLE");
  const [localUserName, setLocalUserName] = useState("Candidate");
  const [conversation, setConversation] = useState([]);

  const currentAssistantMessage = useRef(null);
  const currentUserMessage = useRef(null);
  const conversationRef = useRef([]);

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

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
          const res = await axios.get(`http://localhost:5000/api/interview/${interviewId}`, {
            headers: { 'x-auth-token': token },
          });
          const data = res.data;
          setSubject(data.subject);
          setNumQuestions(data.numQuestions);
          setQuestions(data.questions);
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
      await axios.post(
        `http://localhost:5000/api/interview/${currentInterviewRecordId}/complete`,
        { conversation: finalConversation },
        { headers: { 'x-auth-token': token } }
      );

      await axios.post(
        `http://localhost:5000/api/interview/${currentInterviewRecordId}/feedback`,
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
    }
  }, [currentInterviewRecordId, subject, localUserName, navigate]);

  useEffect(() => {
    const addMessage = (role, content) => {
      if (content && content.trim() !== '') {
        setConversation(prev => [...prev, { role, content }]);
      }
    };

    vapi.on("speech-start", () => {
      if (currentUserMessage.current) {
        addMessage('user', currentUserMessage.current);
        currentUserMessage.current = null;
      }
      currentAssistantMessage.current = "";
    });

    vapi.on("speech-end", () => {
      if (currentAssistantMessage.current) {
        addMessage('assistant', currentAssistantMessage.current);
        currentAssistantMessage.current = null;
      }
    });

    vapi.on("user-speech-start", () => {
      if (currentAssistantMessage.current) {
        addMessage('assistant', currentAssistantMessage.current);
        currentAssistantMessage.current = null;
      }
      currentUserMessage.current = "";
    });

    vapi.on("user-speech-end", () => {
      if (currentUserMessage.current) {
        addMessage('user', currentUserMessage.current);
        currentUserMessage.current = null;
      }
    });

    vapi.on("call-start", () => {
      setCallStatus("ACTIVE");
      alert("Call connected.");
      if (!currentInterviewRecordId || interviewId === 'new') {
        setConversation([]);
      }
      currentAssistantMessage.current = null;
      currentUserMessage.current = null;
    });

    vapi.on("call-end", () => {
      setCallStatus("ENDED");
      const final = [...conversationRef.current];
      if (currentAssistantMessage.current) final.push({ role: 'assistant', content: currentAssistantMessage.current });
      if (currentUserMessage.current) final.push({ role: 'user', content: currentUserMessage.current });

      setConversation(final);
      saveInterviewDataAndGenerateFeedback(final);
      vapi.stop();
      currentAssistantMessage.current = null;
      currentUserMessage.current = null;
    });

    vapi.on("message", (msg) => {
      const turn = msg?.conversation?.[msg.conversation.length - 1];
      if (turn?.role === 'assistant') currentAssistantMessage.current = turn.content;
      if (turn?.role === 'user') currentUserMessage.current = turn.content;
    });

    vapi.on("error", (err) => {
      console.error("Vapi error:", err);
      alert(`Vapi Error: ${err.message}`);
      setCallStatus("IDLE");
      vapi.stop();
    });

    return () => {
      ["speech-start", "speech-end", "user-speech-start", "user-speech-end", "call-start", "call-end", "message", "error"]
        .forEach(e => vapi.removeAllListeners(e));
    };
  }, [saveInterviewDataAndGenerateFeedback]);

  const startVapiCall = async (questionsArray, initialConversation = []) => {
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
      await vapi.start(assistantOptions);
      setCallStatus("ACTIVE");
    } catch (err) {
      console.error("Vapi start error:", err);
      alert("Could not start interview.");
      setCallStatus("IDLE");
    }
  };

  const handleCreateNewInterview = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!subject || numQuestions < 1) {
      alert("Enter subject and valid number of questions.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/interview/generate',
        { subject, numQuestions },
        { headers: { 'x-auth-token': token } }
      );

      const { questions: newQs, interviewId: newId } = res.data;

      if (!newId) {
        throw new Error("Invalid response: interviewId missing");
      }

      setQuestions(newQs);
      setCurrentInterviewRecordId(newId);
      setConversation([]);
      navigate(`/interview/${newId}`, { replace: true });

      await startVapiCall(newQs);
    } catch (err) {
      console.error("Create interview error:", err);
      alert("Failed to create or start interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueInterview = async () => {
    if (!currentInterviewRecordId || questions.length === 0) {
      alert("No interview to continue.");
      return;
    }

    await startVapiCall(questions, conversation);
  };

  const handleEndInterview = () => {
    vapi.stop();
    setCallStatus("ENDED");
  };

  return (
    <div className="container mt-5">
      <h2>AI Interview</h2>
      {loading ? (
        <p>Loading interview...</p>
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
              <h6>Questions:</h6>
              <ul>
                {questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
              {callStatus !== "ACTIVE" && (
                <button onClick={handleContinueInterview} className="btn btn-success mt-3 me-2">Continue Interview</button>
              )}
              {callStatus === "ACTIVE" && (
                <button onClick={handleEndInterview} className="btn btn-danger mt-3">End Interview</button>
              )}
              <div className="mt-4">
                <h5>Conversation:</h5>
                <ul className="list-group">
                  {conversation.map((msg, i) => (
                    <li key={i} className={`list-group-item ${msg.role === 'assistant' ? 'list-group-item-info' : 'list-group-item-light'}`}>
                      <strong>{msg.role}:</strong> {msg.content}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Interview;
