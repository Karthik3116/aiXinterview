// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import axios from 'axios';
// // import Vapi from '@vapi-ai/web';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import { useNavigate, useParams } from 'react-router-dom';

// // // const vapi = new Vapi('3ea5e347-dd02-4187-847f-7356c10bed58');
// // const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);


// // const Interview = ({ user }) => {
// //   const { interviewId } = useParams();
// //   const navigate = useNavigate();

// //   const [subject, setSubject] = useState('');
// //   const [numQuestions, setNumQuestions] = useState(5);
// //   const [questions, setQuestions] = useState([]);
// //   const [currentInterviewRecordId, setCurrentInterviewRecordId] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [preparingInterview, setPreparingInterview] = useState(false);
// //   const [callStatus, setCallStatus] = useState("IDLE");
// //   const [localUserName, setLocalUserName] = useState("Candidate");
// //   const [conversation, setConversation] = useState([]);
// //   const [currentSpeakingRole, setCurrentSpeakingRole] = useState(null);

// //   const [assistantCaption, setAssistantCaption] = useState("");
// //   const [userCaption, setUserCaption] = useState("");

// //   const conversationRef = useRef([]);
// //   useEffect(() => {
// //     conversationRef.current = conversation;
// //   }, [conversation]);

// //   // Load interview details
// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     const userId = localStorage.getItem('userId');

// //     if (!token || !userId) {
// //       alert("Session expired. Redirecting to login.");
// //       vapi.stop();
// //       navigate('/login');
// //       return;
// //     }

// //     const loadInterview = async () => {
// //       setLoading(true);
// //       if (interviewId && interviewId !== 'new') {
// //         try {
// //           const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/interview/${interviewId}`, {
// //             headers: { 'x-auth-token': token },
// //           });
// //           const data = res.data;
// //           setSubject(data.subject);
// //           setNumQuestions(data.numQuestions);
// //           setQuestions(data.questions || []);
// //           setConversation(data.conversation || []);
// //           setCurrentInterviewRecordId(data._id);
// //         } catch (err) {
// //           console.error('Interview fetch error:', err);
// //           alert('Interview not found or access denied.');
// //           navigate('/');
// //         }
// //       } else {
// //         setSubject('');
// //         setNumQuestions(5);
// //         setQuestions([]);
// //         setConversation([]);
// //         setCurrentInterviewRecordId(null);
// //       }
// //       setLoading(false);
// //     };

// //     loadInterview();

// //     const handleStorageChange = (event) => {
// //       if (event.key === 'token' && event.newValue === null) {
// //         alert("Session expired. Redirecting to login.");
// //         vapi.stop();
// //         navigate('/login');
// //       }
// //     };

// //     window.addEventListener('storage', handleStorageChange);
// //     return () => window.removeEventListener('storage', handleStorageChange);
// //   }, [navigate, interviewId]);

// //   const saveInterviewDataAndGenerateFeedback = useCallback(async (finalConversation) => {
// //     const token = localStorage.getItem('token');
// //     if (!token || !currentInterviewRecordId) return;

// //     try {
// //       setPreparingInterview(true); // Set loading for feedback generation
// //       await axios.post(
// //         `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/complete`,
// //         { conversation: finalConversation },
// //         { headers: { 'x-auth-token': token } }
// //       );

// //       await axios.post(
// //         `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/feedback`,
// //         {
// //           conversation: finalConversation,
// //           jobRole: subject,
// //           candidateName: localUserName,
// //         },
// //         { headers: { 'x-auth-token': token } }
// //       );

// //       alert("Interview ended. Feedback generated!");
// //       navigate(`/interview/${currentInterviewRecordId}/feedback`);
// //     } catch (error) {
// //       console.error("Save/Feedback error:", error);
// //       alert("Failed to save interview or generate feedback.");
// //     } finally {
// //       setPreparingInterview(false); // Unset loading after feedback generation
// //     }
// //   }, [currentInterviewRecordId, subject, localUserName, navigate]);

// //   useEffect(() => {
// //     const addMessage = (role, content) => {
// //       if (content && content.trim() !== '') {
// //         setConversation(prev => [...prev, { role, content }]);
// //       }
// //     };

// //     vapi.on("speech-start", () => {
// //       setCurrentSpeakingRole("assistant");
// //       if (userCaption) {
// //         addMessage('user', userCaption);
// //         setUserCaption('');
// //       }
// //     });

// //     vapi.on("speech-end", () => {
// //       setCurrentSpeakingRole(null);
// //       if (assistantCaption) {
// //         addMessage('assistant', assistantCaption);
// //         setAssistantCaption('');
// //       }
// //     });

// //     vapi.on("user-speech-start", () => {
// //       setCurrentSpeakingRole("user");
// //       if (assistantCaption) {
// //         addMessage('assistant', assistantCaption);
// //         setAssistantCaption('');
// //       }
// //     });

// //     vapi.on("user-speech-end", () => {
// //       setCurrentSpeakingRole(null);
// //       if (userCaption) {
// //         addMessage('user', userCaption);
// //         setUserCaption('');
// //       }
// //     });

// //     vapi.on("call-start", () => {
// //       setCallStatus("ACTIVE");
// //       if (!currentInterviewRecordId || interviewId === 'new') {
// //         setConversation([]);
// //       }
// //       setAssistantCaption('');
// //       setUserCaption('');
// //     });

// //     vapi.on("call-end", () => {
// //       setCallStatus("ENDED");
// //       const final = [...conversationRef.current];
// //       if (assistantCaption) final.push({ role: 'assistant', content: assistantCaption });
// //       if (userCaption) final.push({ role: 'user', content: userCaption });

// //       setConversation(final);
// //       saveInterviewDataAndGenerateFeedback(final);
// //       vapi.stop();
// //       setAssistantCaption('');
// //       setUserCaption('');
// //       setCurrentSpeakingRole(null);
// //     });

// //     vapi.on("message", (msg) => {
// //       const turn = msg?.conversation?.[msg.conversation.length - 1];
// //       if (turn?.role === 'assistant') setAssistantCaption(turn.content);
// //       if (turn?.role === 'user') setUserCaption(turn.content);
// //     });

// //     vapi.on("error", (err) => {
// //       console.error("Vapi error:", err);
// //       alert(`Vapi Error: ${err.message}`);
// //       setCallStatus("IDLE");
// //       vapi.stop();
// //       setCurrentSpeakingRole(null);
// //       setPreparingInterview(false); // Ensure loading is off on error
// //     });

// //     return () => {
// //       [
// //         "speech-start", "speech-end",
// //         "user-speech-start", "user-speech-end",
// //         "call-start", "call-end", "message", "error"
// //       ].forEach(e => vapi.removeAllListeners(e));
// //     };
// //   }, [saveInterviewDataAndGenerateFeedback, assistantCaption, userCaption, interviewId, currentInterviewRecordId]);

// //   const startVapiCall = async (questionsArray, initialConversation = []) => {
// //     if (!subject || !questionsArray?.length) {
// //       alert("Cannot start interview: Invalid subject or questions.");
// //       return;
// //     }

// //     const questionList = questionsArray.map((q, i) => `${i + 1}. ${q}`).join("\n");

// //     let initialMessages = [
// //       {
// //         role: "system",
// //         content: `
// //           You are an AI voice assistant conducting interviews for the role of ${subject}.
// //           Only ask the following questions, one by one:
// //           ${questionList}
// //           Provide friendly feedback after answers, then wrap up when done.
// //         `.trim(),
// //       },
// //     ];

// //     if (initialConversation.length > 0) {
// //       initialMessages = [...initialMessages, ...initialConversation];
// //     }

// //     const assistantOptions = {
// //       name: "AI Recruiter",
// //       firstMessage: initialConversation.length === 0
// //         ? `Hi ${localUserName}, ready for your ${subject} interview?`
// //         : "Welcome back! Let's continue.",
// //       transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
// //       voice: { provider: "playht", voiceId: "jennifer" },
// //       model: { provider: "openai", model: "gpt-4", messages: initialMessages },
// //     };

// //     try {
// //       setPreparingInterview(true); // Set loading when Vapi call starts
// //       await vapi.start(assistantOptions);
// //       setCallStatus("ACTIVE");
// //     } catch (err) {
// //       console.error("Vapi start error:", err);
// //       alert("Could not start interview.");
// //       setCallStatus("IDLE");
// //     } finally {
// //       setPreparingInterview(false); // Unset loading when Vapi call attempt is done
// //     }
// //   };

// //   const handleCreateNewInterview = async (e) => {
// //     e.preventDefault();
// //     setPreparingInterview(true);

// //     if (!subject || numQuestions < 1) {
// //       alert("Enter subject and valid number of questions.");
// //       setPreparingInterview(false);
// //       return;
// //     }

// //     try {
// //       const token = localStorage.getItem('token');
// //       const res = await axios.post(
// //         `${import.meta.env.VITE_API_BASE_URL}/api/interview/generate`,
// //         { subject, numQuestions },
// //         { headers: { 'x-auth-token': token } }
// //       );

// //       const { questions: newQs, interviewId: newId } = res.data;

// //       if (!newId) throw new Error("Invalid response: interviewId missing");

// //       setQuestions(newQs);
// //       setCurrentInterviewRecordId(newId);
// //       setConversation([]);
// //       navigate(`/interview/${newId}`, { replace: true });

// //       await startVapiCall(newQs);
// //     } catch (err) {
// //       console.error("Create interview error:", err);
// //       alert("Failed to create or start interview.");
// //     } finally {
// //       setPreparingInterview(false);
// //     }
// //   };

// //   const handleContinueInterview = async () => {
// //     if (!currentInterviewRecordId || !questions.length) {
// //       alert("No interview to continue.");
// //       return;
// //     }
// //     setPreparingInterview(true); // Set loading for continue
// //     try {
// //       await startVapiCall(questions, conversation);
// //     } catch (error) {
// //       console.error("Continue interview error:", error);
// //       alert("Failed to continue interview.");
// //     } finally {
// //       setPreparingInterview(false); // Unset loading
// //     }
// //   };

// //   // Fixed retake function - reuses existing interview instead of creating new one
// //   const handleRetakeInterview = async () => {
// //     if (!currentInterviewRecordId || !subject || numQuestions < 1) {
// //       alert("Cannot retake: Invalid interview data.");
// //       return;
// //     }
    
// //     setPreparingInterview(true);
    


// //     try {
// //       const token = localStorage.getItem('token');
      
// //       // Generate new questions for the existing interview
// //       const res = await axios.post(
// //         `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/regenerate`,
// //         { subject, numQuestions },
// //         { headers: { 'x-auth-token': token } }
// //       );
      
// //       const { questions: newQs } = res.data;
      
// //       // Update local state with new questions and reset conversation
// //       setQuestions(newQs);
// //       setConversation([]);
      
// //       // Start the interview with new questions
// //       await startVapiCall(newQs);
      
// //     } catch (err) {
// //       console.error("Retake error:", err);
      
// //       // Fallback: If the regenerate endpoint doesn't exist, 
// //       // reset conversation and start with existing questions
// //       console.log("Regenerate endpoint not available, using existing questions");
// //       try {
// //         setConversation([]);
// //         await startVapiCall(questions);
// //       } catch (fallbackErr) {
// //         console.error("Fallback retake error:", fallbackErr);
// //         alert("Failed to retake interview.");
// //       }
// //     } finally {
// //       setPreparingInterview(false);
// //     }
// //   };

// //   const handleEndInterview = () => {
// //     setPreparingInterview(true); // Set loading for ending and feedback generation
// //     vapi.stop();
// //     // The call-end event listener will handle setting status to ENDED and calling saveInterviewDataAndGenerateFeedback,
// //     // which then handles `setPreparingInterview(false)`
// //   };

// //   return (
// //     <div className="container mt-5">
// //       <h2>AI Interview</h2>
// //       {loading ? (
// //         <p>Loading interview...</p>
// //       ) : preparingInterview ? (
// //         <p>🔄 Preparing interview / Generating Feedback...</p>
// //       ) : (
// //         <>
// //           {!currentInterviewRecordId ? (
// //             <form onSubmit={handleCreateNewInterview}>
// //               <div className="form-group">
// //                 <label>Subject:</label>
// //                 <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="form-control" required />
// //               </div>
// //               <div className="form-group mt-2">
// //                 <label>Number of Questions:</label>
// //                 <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))} className="form-control" min={1} required />
// //               </div>
// //               <button type="submit" className="btn btn-primary mt-3">Start New Interview</button>
// //             </form>
// //           ) : (
// //             <>
// //               <h5 className="mt-3">Subject: {subject}</h5>

// //               <div className="row mt-4">
// //                 <div className="col-md-6">
// //                   <div className="card shadow-sm">
// //                     <div className="card-header d-flex justify-content-between align-items-center">
// //                       <strong>AI Interviewer</strong>
// //                       {callStatus === "ACTIVE" && currentSpeakingRole === "assistant" && (
// //                         <span className="text-danger fw-bold">🎤</span>
// //                       )}
// //                     </div>
// //                     <div className="card-body">
// //                       <p>{assistantCaption || "..."}</p>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="col-md-6">
// //                   <div className="card shadow-sm">
// //                     <div className="card-header d-flex justify-content-between align-items-center">
// //                       <strong>{localUserName}</strong>
// //                       {callStatus === "ACTIVE" && currentSpeakingRole === "user" && (
// //                         <span className="text-success fw-bold">🎤</span>
// //                       )}
// //                     </div>
// //                     <div className="card-body">
// //                       <p>{userCaption || "..."}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {callStatus !== "ACTIVE" && (
// //                 <>
// //                   <button onClick={handleContinueInterview} className="btn btn-success mt-4 me-2" disabled={preparingInterview}>Continue Interview</button>
// //                   <button onClick={handleRetakeInterview} className="btn btn-warning mt-4" disabled={preparingInterview}>Retake Interview</button>
// //                   {currentInterviewRecordId && (
// //                      <button onClick={() => navigate(`/interview/${currentInterviewRecordId}/feedback`)} className="btn btn-info mt-4 ms-2">View Feedback</button>
// //                    )}
// //                 </>
// //               )}
// //               {callStatus === "ACTIVE" && (
// //                 <button onClick={handleEndInterview} className="btn btn-danger mt-4" disabled={preparingInterview}>End Interview</button>
// //               )}
// //             </>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default Interview;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
// import Vapi from '@vapi-ai/web';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate, useParams } from 'react-router-dom';

// // const vapi = new Vapi('YOUR_VAPI_PUBLIC_KEY'); // Replace with your actual key if not using .env
// const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);

// const Interview = ({ user }) => {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();

//   const [subject, setSubject] = useState('');
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [questions, setQuestions] = useState([]);
//   const [currentInterviewRecordId, setCurrentInterviewRecordId] = useState(null);
//   const [isInterviewCompleted, setIsInterviewCompleted] = useState(false); // For conditional "Continue" button

//   const [loading, setLoading] = useState(true);
//   const [preparingInterview, setPreparingInterview] = useState(false);
//   const [callStatus, setCallStatus] = useState("IDLE"); // IDLE, ACTIVE, ENDED
//   const [localUserName, setLocalUserName] = useState("Candidate");
//   const [conversation, setConversation] = useState([]);
//   const [currentSpeakingRole, setCurrentSpeakingRole] = useState(null); // 'user' or 'assistant'

//   const [assistantCaption, setAssistantCaption] = useState("");
//   const [userCaption, setUserCaption] = useState("");

//   const conversationRef = useRef([]);
//   const assistantCaptionRef = useRef("");
//   const userCaptionRef = useRef("");

//   useEffect(() => {
//     conversationRef.current = conversation;
//   }, [conversation]);

//   useEffect(() => {
//     assistantCaptionRef.current = assistantCaption;
//   }, [assistantCaption]);

//   useEffect(() => {
//     userCaptionRef.current = userCaption;
//   }, [userCaption]);

//   useEffect(() => {
//     // Set local user name if user prop is available
//     if (user && user.name) {
//       setLocalUserName(user.name);
//     } else {
//       setLocalUserName("Candidate");
//     }
//   }, [user]);

//   // Load interview details
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');

//     if (!token || !userId) {
//       alert("Session expired. Redirecting to login.");
//       vapi.stop();
//       navigate('/login');
//       return;
//     }

//     const loadInterview = async () => {
//       setLoading(true);
//       if (interviewId && interviewId !== 'new') {
//         try {
//           const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/interview/${interviewId}`, {
//             headers: { 'x-auth-token': token },
//           });
//           const data = res.data;
//           setSubject(data.subject);
//           setNumQuestions(data.numQuestions);
//           setQuestions(data.questions || []);
//           setConversation(data.conversation || []);
//           setCurrentInterviewRecordId(data._id);
//           setIsInterviewCompleted(data.completed || false); // Set completion status
//         } catch (err) {
//           console.error('Interview fetch error:', err);
//           alert('Interview not found or access denied.');
//           navigate('/');
//         }
//       } else {
//         setSubject('');
//         setNumQuestions(5);
//         setQuestions([]);
//         setConversation([]);
//         setCurrentInterviewRecordId(null);
//         setIsInterviewCompleted(false); // New interview is not completed
//       }
//       setLoading(false);
//     };

//     loadInterview();

//     const handleStorageChange = (event) => {
//       if (event.key === 'token' && event.newValue === null) {
//         alert("Session expired. Redirecting to login.");
//         vapi.stop();
//         navigate('/login');
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [navigate, interviewId]);

//   const saveInterviewDataAndGenerateFeedback = useCallback(async (finalConversation) => {
//     const token = localStorage.getItem('token');
//     if (!token || !currentInterviewRecordId) return;

//     try {
//       setPreparingInterview(true); // Set loading for feedback generation
//       await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/complete`,
//         { conversation: finalConversation },
//         { headers: { 'x-auth-token': token } }
//       );
//       // After completion, the interview is marked as completed
//       setIsInterviewCompleted(true);

//       await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/feedback`,
//         {
//           conversation: finalConversation,
//           jobRole: subject,
//           candidateName: localUserName,
//         },
//         { headers: { 'x-auth-token': token } }
//       );

//       alert("Interview ended. Feedback generated!");
//       navigate(`/interview/${currentInterviewRecordId}/feedback`);
//     } catch (error) {
//       console.error("Save/Feedback error:", error);
//       alert("Failed to save interview or generate feedback.");
//     } finally {
//       setPreparingInterview(false);
//     }
//   }, [currentInterviewRecordId, subject, localUserName, navigate]);

//   const addMessage = useCallback((role, content) => {
//     if (content && content.trim() !== '') {
//       setConversation(prev => {
//         const lastMessage = prev[prev.length - 1];
//         if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
//           return prev; // Avoid duplicate consecutive messages
//         }
//         return [...prev, { role, content }];
//       });
//     }
//   }, []); // setConversation is stable

//   useEffect(() => {
//     vapi.on("speech-start", () => { // Assistant starts speaking
//       setCurrentSpeakingRole("assistant");
//       if (userCaptionRef.current) { // User was speaking, finalize their last caption
//         addMessage('user', userCaptionRef.current);
//       }
//       // User's caption remains on screen until assistant's new message updates assistantCaption
//     });

//     vapi.on("speech-end", () => { // Assistant finishes speaking
//       setCurrentSpeakingRole(null);
//       if (assistantCaptionRef.current) { // Finalize assistant's last caption
//         addMessage('assistant', assistantCaptionRef.current);
//       }
//       // Assistant's caption remains on screen
//     });

//     vapi.on("user-speech-start", () => { // User starts speaking
//       setCurrentSpeakingRole("user");
//       if (assistantCaptionRef.current) { // Assistant was speaking, finalize their last caption
//         addMessage('assistant', assistantCaptionRef.current);
//       }
//       // Assistant's caption remains on screen until user's new message updates userCaption
//     });

//     vapi.on("user-speech-end", () => { // User finishes speaking
//       setCurrentSpeakingRole(null);
//       if (userCaptionRef.current) { // Finalize user's last caption
//         addMessage('user', userCaptionRef.current);
//       }
//       // User's caption remains on screen
//     });

//     vapi.on("call-start", () => {
//       setCallStatus("ACTIVE");
//       if (!currentInterviewRecordId || interviewId === 'new') {
//         setConversation([]); // Clear conversation for a brand new interview start
//       }
//       // Always clear live captions at the start of any call (new or continued)
//       setAssistantCaption('');
//       setUserCaption('');
//     });

//     vapi.on("call-end", () => {
//       setCallStatus("ENDED");
//       const finalTranscript = [...conversationRef.current];
//       // Add any lingering captions not yet added by speech-end events
//       if (assistantCaptionRef.current && (finalTranscript.length === 0 || finalTranscript[finalTranscript.length -1]?.content !== assistantCaptionRef.current)) {
//          finalTranscript.push({ role: 'assistant', content: assistantCaptionRef.current });
//       }
//       if (userCaptionRef.current && (finalTranscript.length === 0 || finalTranscript[finalTranscript.length -1]?.content !== userCaptionRef.current)) {
//          finalTranscript.push({ role: 'user', content: userCaptionRef.current });
//       }
      
//       setConversation(finalTranscript); // Update state with the truly final conversation
//       saveInterviewDataAndGenerateFeedback(finalTranscript); // Pass the up-to-date final transcript
      
//       vapi.stop(); // Ensure Vapi is stopped.
      
//       // Clear live captions post-call
//       setAssistantCaption('');
//       setUserCaption('');
//       setCurrentSpeakingRole(null);
//     });

//     vapi.on("message", (msg) => {
//       const turn = msg?.conversation?.[msg.conversation.length - 1];
//       if (turn?.role === 'assistant') setAssistantCaption(turn.content);
//       if (turn?.role === 'user') setUserCaption(turn.content);
//     });

//     vapi.on("error", (err) => {
//       console.error("Vapi error:", err);
//       alert(`Vapi Error: ${err.message || String(err)}`);
//       setCallStatus("IDLE");
//       vapi.stop();
//       setCurrentSpeakingRole(null);
//       setPreparingInterview(false);
//     });

//     return () => {
//       [
//         "speech-start", "speech-end",
//         "user-speech-start", "user-speech-end",
//         "call-start", "call-end", "message", "error"
//       ].forEach(e => vapi.removeAllListeners(e));
//     };
//   }, [saveInterviewDataAndGenerateFeedback, addMessage, interviewId, currentInterviewRecordId]); // Optimized dependencies

//   const startVapiCall = async (questionsArray, initialConversation = []) => {
//     if (!subject || !questionsArray?.length) {
//       alert("Cannot start interview: Invalid subject or questions.");
//       setPreparingInterview(false);
//       return;
//     }

//     const questionList = questionsArray.map((q, i) => `${i + 1}. ${q}`).join("\n");

//     let initialMessages = [
//       {
//         role: "system",
//         content: `
//           You are an AI voice assistant conducting interviews for the role of ${subject}.
//           Your name is Jennifer. Introduce yourself briefly.
//           Only ask the following questions, one by one:
//           ${questionList}
//           After the candidate answers a question, provide brief, encouraging, and friendly feedback or a transition (e.g., "Great answer!", "Thanks for sharing.", "Alright, next question:"). Do not critique the answer's content during the interview.
//           When all questions have been asked and answered, say something like "That was the last question. Thank you for your time!" and then end the call. Do not ask "Is there anything else?".
//         `.trim(),
//       },
//     ];

//     if (initialConversation.length > 0) {
//       // Filter out any potential system messages from stored conversation if assistant is to use a new one.
//       const filteredInitialConversation = initialConversation.filter(msg => msg.role !== 'system');
//       initialMessages = [...initialMessages, ...filteredInitialConversation];
//     }
//      // Determine the first message based on whether it's a new or continued interview
//     const firstMessage = initialConversation.length === 0 || !initialConversation.some(m => m.role === 'assistant')
//         ? `Hi ${localUserName}, I'm Jennifer, your AI interviewer for the ${subject} role. Ready to begin?`
//         : "Welcome back! Let's continue where we left off.";


//     const assistantOptions = {
//       name: "AI Recruiter - Jennifer",
//       firstMessage: firstMessage,
//       transcriber: { provider: "deepgram", model: "nova-2", language: "en-US" },
//       voice: { provider: "playht", voiceId: "jennifer" }, // Example voice
//       model: { provider: "openai", model: "gpt-4", messages: initialMessages },
//     };

//     try {
//       // setPreparingInterview(true) is typically set by the calling function
//       await vapi.start(assistantOptions);
//       setCallStatus("ACTIVE");
//     } catch (err) {
//       console.error("Vapi start error:", err);
//       alert("Could not start interview.");
//       setCallStatus("IDLE");
//     } finally {
//       // setPreparingInterview(false) is typically reset by the calling function
//     }
//   };

//   const handleCreateNewInterview = async (e) => {
//     e.preventDefault();
//     setPreparingInterview(true);

//     if (!subject || numQuestions < 1) {
//       alert("Enter subject and valid number of questions.");
//       setPreparingInterview(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/interview/generate`,
//         { subject, numQuestions },
//         { headers: { 'x-auth-token': token } }
//       );

//       const { questions: newQs, interviewId: newId } = res.data;
//       if (!newId) throw new Error("Invalid response: interviewId missing");

//       setQuestions(newQs);
//       setCurrentInterviewRecordId(newId);
//       setConversation([]); // Fresh conversation
//       setIsInterviewCompleted(false); // New interview is not completed
//       navigate(`/interview/${newId}`, { replace: true });

//       await startVapiCall(newQs, []); // Start with empty conversation history for Vapi
//     } catch (err) {
//       console.error("Create interview error:", err);
//       alert("Failed to create or start interview.");
//       setCallStatus("IDLE"); // Ensure call status is reset on error
//     } finally {
//       setPreparingInterview(false);
//     }
//   };

//   const handleContinueInterview = async () => {
//     if (!currentInterviewRecordId || !questions.length || isInterviewCompleted) {
//       alert("No active interview to continue or interview already completed.");
//       return;
//     }
//     setPreparingInterview(true);
//     try {
//       // Pass existing conversation to Vapi to provide context
//       await startVapiCall(questions, conversation);
//     } catch (error) {
//       console.error("Continue interview error:", error);
//       alert("Failed to continue interview.");
//       setCallStatus("IDLE");
//     } finally {
//       setPreparingInterview(false);
//     }
//   };

//   const handleRetakeInterview = async () => {
//     if (!currentInterviewRecordId || !subject || numQuestions < 1) {
//       alert("Cannot retake: Invalid interview data.");
//       return;
//     }
//     setPreparingInterview(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/regenerate`,
//         { subject, numQuestions }, // Send current subject and numQuestions for regeneration
//         { headers: { 'x-auth-token': token } }
//       );
      
//       const { questions: newQs } = res.data;
//       setQuestions(newQs);
//       setConversation([]); // Reset conversation for retake
//       setIsInterviewCompleted(false); // Retake means it's no longer completed
//       await startVapiCall(newQs, []); // Start with new questions and empty conversation history
//     } catch (err) {
//       console.warn("Retake with regeneration error (or endpoint not available):", err);
//       // Fallback: If regenerate fails, or to simply restart with existing questions
//       console.log("Falling back to retake with existing questions.");
//       setConversation([]); // Reset conversation
//       setIsInterviewCompleted(false); // Retake means it's no longer completed
//       try {
//         await startVapiCall(questions, []); // Use existing questions, clear conversation history
//       } catch (fallbackErr) {
//         console.error("Fallback retake error:", fallbackErr);
//         alert("Failed to retake interview.");
//         setCallStatus("IDLE");
//       }
//     } finally {
//       setPreparingInterview(false);
//     }
//   };

//   const handleEndInterview = () => {
//     // Set loading, Vapi's 'call-end' will handle the rest (saving, feedback, unsetting loading)
//     // No need to set preparingInterview(true) here if call-end handles it via saveInterviewDataAndGenerateFeedback
//     // However, if user clicks End before Vapi naturally ends, we might want UI feedback.
//     // Let's ensure preparingInterview is true to show spinner while vapi.stop() processes.
//     setPreparingInterview(true); 
//     vapi.stop(); 
//     // The 'call-end' event listener is expected to fire, which calls saveInterviewDataAndGenerateFeedback.
//     // saveInterviewDataAndGenerateFeedback sets preparingInterview to true initially and false in its finally block.
//   };

//   return (
//     <div className="container mt-5">
//       <h2>AI Interview Practice</h2>
//       {loading ? (
//         <div className="text-center my-5">
//           <div className="spinner-border text-secondary" role="status" style={{ width: '2rem', height: '2rem' }}>
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading interview details...</p>
//         </div>
//       ) : preparingInterview ? (
//         <div className="text-center my-5">
//           <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Processing, please wait...</p>
//         </div>
//       ) : (
//         <>
//           {!currentInterviewRecordId ? (
//             <form onSubmit={handleCreateNewInterview}>
//               <div className="form-group mb-3">
//                 <label htmlFor="subject" className="form-label"><strong>Subject / Job Role:</strong></label>
//                 <input id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="form-control" placeholder="e.g., Software Engineer" required />
//               </div>
//               <div className="form-group mb-3">
//                 <label htmlFor="numQuestions" className="form-label"><strong>Number of Questions:</strong></label>
//                 <input id="numQuestions" type="number" value={numQuestions} onChange={(e) => setNumQuestions(parseInt(e.target.value))} className="form-control" min={1} max={10} required />
//               </div>
//               <button type="submit" className="btn btn-primary mt-3">Start New Interview</button>
//             </form>
//           ) : (
//             <>
//               <h5 className="mt-3"><strong>Role:</strong> {subject}</h5>
//               <p><strong>Status:</strong> <span className={`badge bg-${callStatus === "ACTIVE" ? "success" : callStatus === "ENDED" ? "secondary" : "warning"}`}>{callStatus}</span></p>

//               <div className="row mt-4">
//                 <div className="col-md-6 mb-3">
//                   <div className="card shadow-sm">
//                     <div className="card-header d-flex justify-content-between align-items-center bg-light">
//                       <strong>AI Interviewer (Jennifer)</strong>
//                       {callStatus === "ACTIVE" && currentSpeakingRole === "assistant" && (
//                         <span className="text-danger fw-bold">🎤 Listening...</span>
//                       )}
//                     </div>
//                     <div className="card-body" style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}>
//                       <p className="mb-0">{assistantCaption || (callStatus === "ACTIVE" ? "Waiting for AI..." : "...")}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <div className="card shadow-sm">
//                     <div className="card-header d-flex justify-content-between align-items-center bg-light">
//                       <strong>{localUserName}</strong>
//                       {callStatus === "ACTIVE" && currentSpeakingRole === "user" && (
//                         <span className="text-success fw-bold">🎤 Speaking...</span>
//                       )}
//                     </div>
//                     <div className="card-body" style={{ minHeight: '100px', maxHeight: '200px', overflowY: 'auto' }}>
//                       <p className="mb-0">{userCaption || (callStatus === "ACTIVE" ? "Speak when ready..." : "...")}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {callStatus !== "ACTIVE" && (
//                 <div className="mt-4">
//                   {!isInterviewCompleted && currentInterviewRecordId && questions && questions.length > 0 && (
//                     <button onClick={handleContinueInterview} className="btn btn-success me-2 mb-2" disabled={preparingInterview}>
//                       Continue Interview
//                     </button>
//                   )}
//                   {currentInterviewRecordId && (
//                      <button onClick={handleRetakeInterview} className="btn btn-warning me-2 mb-2" disabled={preparingInterview}>
//                         Retake Interview (New Questions)
//                      </button>
//                   )}
//                   {currentInterviewRecordId && (
//                     <button 
//                       onClick={() => navigate(`/interview/${currentInterviewRecordId}/feedback`)} 
//                       className="btn btn-info mb-2"
//                       disabled={preparingInterview}
//                     >
//                       View Feedback
//                     </button>
//                   )}
//                 </div>
//               )}
//               {callStatus === "ACTIVE" && (
//                 <button onClick={handleEndInterview} className="btn btn-danger mt-4" disabled={preparingInterview}>
//                   End Interview Now
//                 </button>
//               )}
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Interview;


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
// import Vapi from '@vapi-ai/web';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate, useParams } from 'react-router-dom';

// // Import the new components
import NewInterviewForm from '../components/NewInterviewForm';
import ActiveInterviewDisplay from '../components/ActiveInterviewDisplay';

// const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);

// const Interview = ({ user }) => {
//   const { interviewId } = useParams();
//   const navigate = useNavigate();

//   const [subject, setSubject] = useState('');
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [questions, setQuestions] = useState([]);
//   const [currentInterviewRecordId, setCurrentInterviewRecordId] = useState(null);
//   const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);

//   const [loading, setLoading] = useState(true);
//   const [preparingInterview, setPreparingInterview] = useState(false);
//   const [callStatus, setCallStatus] = useState('IDLE'); // IDLE, ACTIVE, ENDED
//   const [localUserName, setLocalUserName] = useState('Candidate');
//   const [conversation, setConversation] = useState([]);
//   const [currentSpeakingRole, setCurrentSpeakingRole] = useState(null); // 'user' or 'assistant'

//   const [assistantCaption, setAssistantCaption] = useState('');
//   const [userCaption, setUserCaption] = useState('');

//   const conversationRef = useRef([]);
//   const assistantCaptionRef = useRef('');
//   const userCaptionRef = useRef('');

//   useEffect(() => {
//     conversationRef.current = conversation;
//   }, [conversation]);

//   useEffect(() => {
//     assistantCaptionRef.current = assistantCaption;
//   }, [assistantCaption]);

//   useEffect(() => {
//     userCaptionRef.current = userCaption;
//   }, [userCaption]);

//   useEffect(() => {
//     if (user && user.name) {
//       setLocalUserName(user.name);
//     } else {
//       setLocalUserName('Candidate');
//     }
//   }, [user]);

//   // Load interview details
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');

//     if (!token || !userId) {
//       alert('Session expired. Redirecting to login.');
//       vapi.stop();
//       navigate('/login');
//       return;
//     }

//     const loadInterview = async () => {
//       setLoading(true);
//       if (interviewId && interviewId !== 'new') {
//         try {
//           const res = await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/api/interview/${interviewId}`,
//             {
//               headers: { 'x-auth-token': token },
//             }
//           );
//           const data = res.data;
//           setSubject(data.subject);
//           setNumQuestions(data.numQuestions);
//           setQuestions(data.questions || []);
//           setConversation(data.conversation || []);
//           setCurrentInterviewRecordId(data._id);
//           setIsInterviewCompleted(data.completed || false);
//         } catch (err) {
//           console.error('Interview fetch error:', err);
//           alert('Interview not found or access denied.');
//           navigate('/');
//         }
//       } else {
//         setSubject('');
//         setNumQuestions(5);
//         setQuestions([]);
//         setConversation([]);
//         setCurrentInterviewRecordId(null);
//         setIsInterviewCompleted(false);
//       }
//       setLoading(false);
//     };

//     loadInterview();

//     const handleStorageChange = (event) => {
//       if (event.key === 'token' && event.newValue === null) {
//         alert('Session expired. Redirecting to login.');
//         vapi.stop();
//         navigate('/login');
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [navigate, interviewId]);

//   const saveInterviewDataAndGenerateFeedback = useCallback(
//     async (finalConversation) => {
//       const token = localStorage.getItem('token');
//       if (!token || !currentInterviewRecordId) return;

//       try {
//         setPreparingInterview(true);
//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/complete`,
//           { conversation: finalConversation },
//           { headers: { 'x-auth-token': token } }
//         );
//         setIsInterviewCompleted(true);

//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/feedback`,
//           {
//             conversation: finalConversation,
//             jobRole: subject,
//             candidateName: localUserName,
//           },
//           { headers: { 'x-auth-token': token } }
//         );

//         alert('Interview ended. Feedback generated!');
//         navigate(`/interview/${currentInterviewRecordId}/feedback`);
//       } catch (error) {
//         console.error('Save/Feedback error:', error);
//         alert('Failed to save interview or generate feedback.');
//       } finally {
//         setPreparingInterview(false);
//       }
//     },
//     [currentInterviewRecordId, subject, localUserName, navigate]
//   );

//   const addMessage = useCallback((role, content) => {
//     if (content && content.trim() !== '') {
//       setConversation((prev) => {
//         const lastMessage = prev[prev.length - 1];
//         if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
//           return prev;
//         }
//         return [...prev, { role, content }];
//       });
//     }
//   }, []);

//   useEffect(() => {
//     vapi.on('speech-start', () => {
//       setCurrentSpeakingRole('assistant');
//       if (userCaptionRef.current) {
//         addMessage('user', userCaptionRef.current);
//       }
//       setUserCaption(''); // Clear user caption when assistant speaks
//     });

//     vapi.on('speech-end', () => {
//       setCurrentSpeakingRole(null);
//       if (assistantCaptionRef.current) {
//         addMessage('assistant', assistantCaptionRef.current);
//       }
//       setAssistantCaption(''); // Clear assistant caption after speech ends
//     });

//     vapi.on('user-speech-start', () => {
//       setCurrentSpeakingRole('user');
//       if (assistantCaptionRef.current) {
//         addMessage('assistant', assistantCaptionRef.current);
//       }
//       setAssistantCaption(''); // Clear assistant caption when user speaks
//     });

//     vapi.on('user-speech-end', () => {
//       setCurrentSpeakingRole(null);
//       if (userCaptionRef.current) {
//         addMessage('user', userCaptionRef.current);
//       }
//       setUserCaption(''); // Clear user caption after speech ends
//     });

//     vapi.on('call-start', () => {
//       setCallStatus('ACTIVE');
//       if (!currentInterviewRecordId || interviewId === 'new') {
//         setConversation([]);
//       }
//       setAssistantCaption('');
//       setUserCaption('');
//     });

//     vapi.on('call-end', () => {
//       setCallStatus('ENDED');
//       const finalTranscript = [...conversationRef.current];
//       if (assistantCaptionRef.current && assistantCaptionRef.current.trim() !== '') {
//         finalTranscript.push({ role: 'assistant', content: assistantCaptionRef.current });
//       }
//       if (userCaptionRef.current && userCaptionRef.current.trim() !== '') {
//         finalTranscript.push({ role: 'user', content: userCaptionRef.current });
//       }

//       setConversation(finalTranscript);
//       saveInterviewDataAndGenerateFeedback(finalTranscript);

//       vapi.stop();

//       setAssistantCaption('');
//       setUserCaption('');
//       setCurrentSpeakingRole(null);
//     });

//     vapi.on('message', (msg) => {
//       const turn = msg?.conversation?.[msg.conversation.length - 1];
//       if (turn?.role === 'assistant') setAssistantCaption(turn.content);
//       if (turn?.role === 'user') setUserCaption(turn.content);
//     });

//     vapi.on('error', (err) => {
//       console.error('Vapi error:', err);
//       alert(`Vapi Error: ${err.message || String(err)}`);
//       setCallStatus('IDLE');
//       vapi.stop();
//       setCurrentSpeakingRole(null);
//       setPreparingInterview(false);
//     });

//     return () => {
//       [
//         'speech-start',
//         'speech-end',
//         'user-speech-start',
//         'user-speech-end',
//         'call-start',
//         'call-end',
//         'message',
//         'error',
//       ].forEach((e) => vapi.removeAllListeners(e));
//     };
//   }, [saveInterviewDataAndGenerateFeedback, addMessage, interviewId, currentInterviewRecordId]);

//   const startVapiCall = async (questionsArray, initialConversation = []) => {
//     if (!subject || !questionsArray?.length) {
//       alert('Cannot start interview: Invalid subject or questions.');
//       setPreparingInterview(false);
//       return;
//     }

//     const questionList = questionsArray.map((q, i) => `${i + 1}. ${q}`).join('\n');

//     let initialMessages = [
//       {
//         role: 'system',
//         content: `
//           You are an AI voice assistant conducting interviews for the role of ${subject}.
//           Your name is Jennifer. Introduce yourself briefly.
//           Only ask the following questions, one by one:
//           ${questionList}
//           After the candidate answers a question, provide brief, encouraging, and friendly feedback or a transition (e.g., "Great answer!", "Thanks for sharing.", "Alright, next question:"). Do not critique the answer's content during the interview.
//           When all questions have been asked and answered, say something like "That was the last question. Thank you for your time!" and then end the call. Do not ask "Is there anything else?".
//         `.trim(),
//       },
//     ];

//     if (initialConversation.length > 0) {
//       const filteredInitialConversation = initialConversation.filter(
//         (msg) => msg.role !== 'system'
//       );
//       initialMessages = [...initialMessages, ...filteredInitialConversation];
//     }

//     const firstMessage =
//       initialConversation.length === 0 || !initialConversation.some((m) => m.role === 'assistant')
//         ? `Hi ${localUserName}, I'm Jennifer, your AI interviewer for the ${subject} role. Ready to begin?`
//         : 'Welcome back! Let\'s continue where we left off.';

//     const assistantOptions = {
//       name: 'AI Recruiter - Jennifer',
//       firstMessage: firstMessage,
//       transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
//       voice: { provider: 'playht', voiceId: 'jennifer' },
//       model: { provider: 'openai', model: 'gpt-4', messages: initialMessages },
//     };

//     try {
//       await vapi.start(assistantOptions);
//       setCallStatus('ACTIVE');
//     } catch (err) {
//       console.error('Vapi start error:', err);
//       alert('Could not start interview.');
//       setCallStatus('IDLE');
//     }
//   };

//   const handleCreateNewInterview = async (newSubject, newNumQuestions) => {
//     setPreparingInterview(true);

//     if (!newSubject || newNumQuestions < 1) {
//       alert('Enter subject and valid number of questions.');
//       setPreparingInterview(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/interview/generate`,
//         { subject: newSubject, numQuestions: newNumQuestions },
//         { headers: { 'x-auth-token': token } }
//       );

//       const { questions: newQs, interviewId: newId } = res.data;
//       if (!newId) throw new Error('Invalid response: interviewId missing');

//       setSubject(newSubject);
//       setNumQuestions(newNumQuestions);
//       setQuestions(newQs);
//       setCurrentInterviewRecordId(newId);
//       setConversation([]);
//       setIsInterviewCompleted(false);
//       navigate(`/interview/${newId}`, { replace: true });

//       await startVapiCall(newQs, []);
//     } catch (err) {
//       console.error('Create interview error:', err);
//       alert('Failed to create or start interview.');
//       setCallStatus('IDLE');
//     } finally {
//       setPreparingInterview(false);
//     }
//   };

//   const handleContinueInterview = async () => {
//     if (!currentInterviewRecordId || !questions.length || isInterviewCompleted) {
//       alert('No active interview to continue or interview already completed.');
//       return;
//     }
//     setPreparingInterview(true);
//     try {
//       await startVapiCall(questions, conversation);
//     } catch (error) {
//       console.error('Continue interview error:', error);
//       alert('Failed to continue interview.');
//       setCallStatus('IDLE');
//     } finally {
//       setPreparingInterview(false);
//     }
//   };

//   const handleRetakeInterview = async () => {
//     if (!currentInterviewRecordId || !subject || numQuestions < 1) {
//       alert('Cannot retake: Invalid interview data.');
//       return;
//     }
//     setPreparingInterview(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/regenerate`,
//         { subject, numQuestions },
//         { headers: { 'x-auth-token': token } }
//       );

//       const { questions: newQs } = res.data;
//       setQuestions(newQs);
//       setConversation([]);
//       setIsInterviewCompleted(false);
//       await startVapiCall(newQs, []);
//     } catch (err) {
//       console.warn('Retake with regeneration error (or endpoint not available):', err);
//       console.log('Falling back to retake with existing questions.');
//       setConversation([]);
//       setIsInterviewCompleted(false);
//       try {
//         await startVapiCall(questions, []);
//       } catch (fallbackErr) {
//         console.error('Fallback retake error:', fallbackErr);
//         alert('Failed to retake interview.');
//         setCallStatus('IDLE');
//       }
//     } finally {
//       setPreparingInterview(false);
//     }
//   };

//   const handleEndInterview = () => {
//     setPreparingInterview(true);
//     vapi.stop();
//   };

//   return (
//     <div className="container mt-5">
//       <h2>AI Interview Practice</h2>
//       {loading ? (
//         <div className="text-center my-5">
//           <div
//             className="spinner-border text-secondary"
//             role="status"
//             style={{ width: '2rem', height: '2rem' }}
//           >
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading interview details...</p>
//         </div>
//       ) : preparingInterview ? (
//         <div className="text-center my-5">
//           <div
//             className="spinner-border text-primary"
//             role="status"
//             style={{ width: '3rem', height: '3rem' }}
//           >
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Processing, please wait...</p>
//         </div>
//       ) : (
//         <>
//           {!currentInterviewRecordId || interviewId === 'new' ? (
//             <NewInterviewForm onCreateInterview={handleCreateNewInterview} loading={preparingInterview} />
//           ) : (
//             <ActiveInterviewDisplay
//               subject={subject}
//               callStatus={callStatus}
//               assistantCaption={assistantCaption}
//               userCaption={userCaption}
//               currentSpeakingRole={currentSpeakingRole}
//               localUserName={localUserName}
//               isInterviewCompleted={isInterviewCompleted}
//               currentInterviewRecordId={currentInterviewRecordId}
//               onContinueInterview={handleContinueInterview}
//               onRetakeInterview={handleRetakeInterview}
//               onEndInterview={handleEndInterview}
//               loading={preparingInterview}
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Interview;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Vapi from '@vapi-ai/web';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';

// Import the new components

const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);

const Interview = ({ user }) => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [currentInterviewRecordId, setCurrentInterviewRecordId] = useState(null);
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [preparingInterview, setPreparingInterview] = useState(false);
  const [callStatus, setCallStatus] = useState('IDLE'); // IDLE, ACTIVE, ENDED
  const [localUserName, setLocalUserName] = useState('Candidate');
  const [conversation, setConversation] = useState([]);
  const [currentSpeakingRole, setCurrentSpeakingRole] = useState(null); // 'user' or 'assistant'

  const [assistantCaption, setAssistantCaption] = useState('');
  const [userCaption, setUserCaption] = useState('');

  const conversationRef = useRef([]);
  const assistantCaptionRef = useRef(''); // Use ref for latest caption
  const userCaptionRef = useRef('');     // Use ref for latest caption

  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // Update refs when state changes for access in event listeners
  useEffect(() => {
    assistantCaptionRef.current = assistantCaption;
  }, [assistantCaption]);

  useEffect(() => {
    userCaptionRef.current = userCaption;
  }, [userCaption]);

  useEffect(() => {
    if (user && user.name) {
      setLocalUserName(user.name);
    } else {
      setLocalUserName('Candidate');
    }
  }, [user]);

  // Load interview details
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      alert('Session expired. Redirecting to login.');
      vapi.stop();
      navigate('/login');
      return;
    }

    const loadInterview = async () => {
      setLoading(true);
      if (interviewId && interviewId !== 'new') {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/interview/${interviewId}`,
            {
              headers: { 'x-auth-token': token },
            }
          );
          const data = res.data;
          setSubject(data.subject);
          setNumQuestions(data.numQuestions);
          setQuestions(data.questions || []);
          setConversation(data.conversation || []);
          setCurrentInterviewRecordId(data._id);
          setIsInterviewCompleted(data.completed || false);
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
        setIsInterviewCompleted(false);
      }
      setLoading(false);
    };

    loadInterview();

    const handleStorageChange = (event) => {
      if (event.key === 'token' && event.newValue === null) {
        alert('Session expired. Redirecting to login.');
        vapi.stop();
        navigate('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, interviewId]);

  const saveInterviewDataAndGenerateFeedback = useCallback(
    async (finalConversation) => {
      const token = localStorage.getItem('token');
      if (!token || !currentInterviewRecordId) return;

      try {
        setPreparingInterview(true);
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/complete`,
          { conversation: finalConversation },
          { headers: { 'x-auth-token': token } }
        );
        setIsInterviewCompleted(true);

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/feedback`,
          {
            conversation: finalConversation,
            jobRole: subject,
            candidateName: localUserName,
          },
          { headers: { 'x-auth-token': token } }
        );

        alert('Interview ended. Feedback generated!');
        navigate(`/interview/${currentInterviewRecordId}/feedback`);
      } catch (error) {
        console.error('Save/Feedback error:', error);
        alert('Failed to save interview or generate feedback.');
      } finally {
        setPreparingInterview(false);
      }
    },
    [currentInterviewRecordId, subject, localUserName, navigate]
  );

  const addMessage = useCallback((role, content) => {
    if (content && content.trim() !== '') {
      setConversation((prev) => {
        const lastMessage = prev[prev.length - 1];
        // Only add if it's not a duplicate of the *exact* last message from the same role
        if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
          return prev;
        }
        return [...prev, { role, content }];
      });
    }
  }, []); // setConversation is stable, so no need for it as a dependency

  useEffect(() => {
    vapi.on('speech-start', () => { // Assistant starts speaking
      setCurrentSpeakingRole('assistant');
      // When assistant starts speaking, finalize user's last complete thought and clear user caption
      if (userCaptionRef.current) {
        addMessage('user', userCaptionRef.current);
        setUserCaption(''); // Clear user's caption as AI starts
      }
      setAssistantCaption(''); // Clear AI caption when new AI speech starts
    });

    vapi.on('speech-end', () => { // Assistant finishes speaking
      setCurrentSpeakingRole(null);
      // Keep assistantCaption on screen until user speaks or call ends
      // The caption will be added to conversation log by the 'message' event or call-end
      // addMessage('assistant', assistantCaptionRef.current); // No longer add here, let message event handle it, or call-end as final
    });

    vapi.on('user-speech-start', () => { // User starts speaking
      setCurrentSpeakingRole('user');
      // When user starts speaking, finalize assistant's last complete thought and clear assistant caption
      if (assistantCaptionRef.current) {
        addMessage('assistant', assistantCaptionRef.current);
        setAssistantCaption(''); // Clear AI's caption as user starts
      }
      setUserCaption(''); // Clear user caption when new user speech starts
    });

    vapi.on('user-speech-end', () => { // User finishes speaking
      setCurrentSpeakingRole(null);
      // Keep userCaption on screen until assistant speaks or call ends
      // The caption will be added to conversation log by the 'message' event or call-end
      // addMessage('user', userCaptionRef.current); // No longer add here, let message event handle it, or call-end as final
    });

    vapi.on('call-start', () => {
      setCallStatus('ACTIVE');
      if (!currentInterviewRecordId || interviewId === 'new') {
        setConversation([]);
      }
      // Always clear live captions at the start of any call (new or continued)
      setAssistantCaption('');
      setUserCaption('');
    });

    vapi.on('call-end', () => {
      setCallStatus('ENDED');
      const finalTranscript = [...conversationRef.current];
      // Add any lingering captions not yet added by speech-end events
      if (assistantCaptionRef.current && assistantCaptionRef.current.trim() !== '') {
          // Check if it's already the last message to prevent duplicates
          if (finalTranscript.length === 0 || finalTranscript[finalTranscript.length - 1]?.content !== assistantCaptionRef.current || finalTranscript[finalTranscript.length - 1]?.role !== 'assistant') {
            finalTranscript.push({ role: 'assistant', content: assistantCaptionRef.current });
          }
      }
      if (userCaptionRef.current && userCaptionRef.current.trim() !== '') {
          // Check if it's already the last message to prevent duplicates
          if (finalTranscript.length === 0 || finalTranscript[finalTranscript.length - 1]?.content !== userCaptionRef.current || finalTranscript[finalTranscript.length - 1]?.role !== 'user') {
            finalTranscript.push({ role: 'user', content: userCaptionRef.current });
          }
      }

      setConversation(finalTranscript); // Update state with the truly final conversation
      saveInterviewDataAndGenerateFeedback(finalTranscript); // Pass the up-to-date final transcript

      vapi.stop(); // Ensure Vapi is stopped.

      // Clear live captions post-call
      setAssistantCaption('');
      setUserCaption('');
      setCurrentSpeakingRole(null);
    });

    vapi.on('message', (msg) => {
      const turn = msg?.conversation?.[msg.conversation.length - 1];
      if (turn?.role === 'assistant') {
        setAssistantCaption(turn.content);
        // Only add to conversation log when a *complete* message is received, not just partial captions.
        // For partials, it's covered by speech-start/end logic and call-end.
      }
      if (turn?.role === 'user') {
        setUserCaption(turn.content);
        // Same for user: only add to conversation log when a *complete* message is received.
      }
    });


    vapi.on('error', (err) => {
      console.error('Vapi error:', err);
      alert(`Vapi Error: ${err.message || String(err)}`);
      setCallStatus('IDLE');
      vapi.stop();
      setCurrentSpeakingRole(null);
      setPreparingInterview(false);
    });

    return () => {
      [
        'speech-start',
        'speech-end',
        'user-speech-start',
        'user-speech-end',
        'call-start',
        'call-end',
        'message',
        'error',
      ].forEach((e) => vapi.removeAllListeners(e));
    };
  }, [saveInterviewDataAndGenerateFeedback, addMessage, interviewId, currentInterviewRecordId]); // Optimized dependencies

  const startVapiCall = async (questionsArray, initialConversation = []) => {
    if (!subject || !questionsArray?.length) {
      alert('Cannot start interview: Invalid subject or questions.');
      setPreparingInterview(false);
      return;
    }

    const questionList = questionsArray.map((q, i) => `${i + 1}. ${q}`).join('\n');

    let initialMessages = [
      {
        role: 'system',
        content: `
          You are an AI voice assistant conducting interviews for the role of ${subject}.
          Your name is Jennifer. Introduce yourself briefly.
          Only ask the following questions, one by one:
          ${questionList}
          After the candidate answers a question, provide brief, encouraging, and friendly feedback or a transition (e.g., "Great answer!", "Thanks for sharing.", "Alright, next question:"). Do not critique the answer's content during the interview.
          When all questions have been asked and answered, say something like "That was the last question. Thank you for your time!" and then end the call. Do not ask "Is there anything else?".
        `.trim(),
      },
    ];

    if (initialConversation.length > 0) {
      const filteredInitialConversation = initialConversation.filter(
        (msg) => msg.role !== 'system'
      );
      initialMessages = [...initialMessages, ...filteredInitialConversation];
    }

    const firstMessage =
      initialConversation.length === 0 || !initialConversation.some((m) => m.role === 'assistant')
        ? `Hi ${localUserName}, I'm Jennifer, your AI interviewer for the ${subject} role. Ready to begin?`
        : 'Welcome back! Let\'s continue where we left off.';

    const assistantOptions = {
      name: 'AI Recruiter - Jennifer',
      firstMessage: firstMessage,
      transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
      voice: { provider: 'playht', voiceId: 'jennifer' },
      model: { provider: 'openai', model: 'gpt-4', messages: initialMessages },
    };

    try {
      await vapi.start(assistantOptions);
      setCallStatus('ACTIVE');
    } catch (err) {
      console.error('Vapi start error:', err);
      alert('Could not start interview.');
      setCallStatus('IDLE');
    }
  };

  const handleCreateNewInterview = async (newSubject, newNumQuestions) => {
    setPreparingInterview(true);

    if (!newSubject || newNumQuestions < 1) {
      alert('Enter subject and valid number of questions.');
      setPreparingInterview(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/interview/generate`,
        { subject: newSubject, numQuestions: newNumQuestions },
        { headers: { 'x-auth-token': token } }
      );

      const { questions: newQs, interviewId: newId } = res.data;
      if (!newId) throw new Error('Invalid response: interviewId missing');

      setSubject(newSubject);
      setNumQuestions(newNumQuestions);
      setQuestions(newQs);
      setCurrentInterviewRecordId(newId);
      setConversation([]);
      setIsInterviewCompleted(false);
      navigate(`/interview/${newId}`, { replace: true });

      await startVapiCall(newQs, []);
    } catch (err) {
      console.error('Create interview error:', err);
      alert('Failed to create or start interview.');
      setCallStatus('IDLE');
    } finally {
      setPreparingInterview(false);
    }
  };

  const handleContinueInterview = async () => {
    if (!currentInterviewRecordId || !questions.length || isInterviewCompleted) {
      alert('No active interview to continue or interview already completed.');
      return;
    }
    setPreparingInterview(true);
    try {
      await startVapiCall(questions, conversation);
    } catch (error) {
      console.error('Continue interview error:', error);
      alert('Failed to continue interview.');
      setCallStatus('IDLE');
    } finally {
      setPreparingInterview(false);
    }
  };

  const handleRetakeInterview = async () => {
    if (!currentInterviewRecordId || !subject || numQuestions < 1) {
      alert('Cannot retake: Invalid interview data.');
      return;
    }
    setPreparingInterview(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/interview/generate`,
        { subject, numQuestions },
        { headers: { 'x-auth-token': token } }
      );

      const { questions: newQs } = res.data;
      setQuestions(newQs);
      setConversation([]);
      setIsInterviewCompleted(false);
      await startVapiCall(newQs, []);
    } catch (err) {
      console.warn('Retake with regeneration error (or endpoint not available):', err);
      console.log('Falling back to retake with existing questions.');
      setConversation([]);
      setIsInterviewCompleted(false);
      try {
        await startVapiCall(questions, []);
      } catch (fallbackErr) {
        console.error('Fallback retake error:', fallbackErr);
        alert('Failed to retake interview.');
        setCallStatus('IDLE');
      }
    } finally {
      setPreparingInterview(false);
    }
  };

  const handleEndInterview = () => {
    setPreparingInterview(true);
    vapi.stop();
  };

  return (
    <div className="container mt-5">
      <h2>AI Interview Practice</h2>
      {loading ? (
        <div className="text-center my-5">
          <div
            className="spinner-border text-secondary"
            role="status"
            style={{ width: '2rem', height: '2rem' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading interview details...</p>
        </div>
      ) : preparingInterview ? (
        <div className="text-center my-5">
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: '3rem', height: '3rem' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Processing, please wait...</p>
        </div>
      ) : (
        <>
          {!currentInterviewRecordId || interviewId === 'new' ? (
            <NewInterviewForm onCreateInterview={handleCreateNewInterview} loading={preparingInterview} />
          ) : (
            <ActiveInterviewDisplay
              subject={subject}
              callStatus={callStatus}
              assistantCaption={assistantCaption}
              userCaption={userCaption}
              currentSpeakingRole={currentSpeakingRole}
              localUserName={localUserName}
              isInterviewCompleted={isInterviewCompleted}
              currentInterviewRecordId={currentInterviewRecordId}
              onContinueInterview={handleContinueInterview}
              onRetakeInterview={handleRetakeInterview}
              onEndInterview={handleEndInterview}
              loading={preparingInterview}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Interview;