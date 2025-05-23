
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import axios from 'axios';
// import Vapi from '@vapi-ai/web';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// // Import the new components (assuming these paths are correct relative to Interview.jsx)
// import NewInterviewForm from '../components/NewInterviewForm';
// import ActiveInterviewDisplay from '../components/ActiveInterviewDisplay';

// // Simple LoadingBar component
// const LoadingBar = ({ progress }) => {
//     return (
//         <div className="loading-bar-container" style={{ width: '100%', backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
//             <div
//                 className="loading-bar-progress"
//                 style={{
//                     width: `${progress}%`,
//                     backgroundColor: '#007bff', // Bootstrap primary blue
//                     height: '100%',
//                     transition: 'width 0.3s ease-in-out',
//                     borderRadius: '4px',
//                 }}
//             ></div>
//         </div>
//     );
// };

// // Initialize Vapi SDK with your public API key from environment variables
// const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);

// const Interview = ({ user }) => {
//     // React Router hooks for navigation and URL parameters
//     const { interviewId } = useParams(); // Gets the interview ID from the URL (e.g., /interview/:interviewId)
//     const navigate = useNavigate(); // For programmatic navigation

//     // State variables for interview data and UI management
//     const [subject, setSubject] = useState(''); // The subject/job role of the interview
//     const [numQuestions, setNumQuestions] = useState(5); // Number of questions for the interview
//     const [questions, setQuestions] = useState([]); // Array of generated interview questions
//     const [currentInterviewRecordId, setCurrentInterviewRecordId] = useState(null); // MongoDB _id of the current interview record
//     const [isInterviewCompleted, setIsInterviewCompleted] = useState(false); // Flag if the interview is completed
//     const [vapiRecordingUrl, setVapiRecordingUrl] = useState(null); // Added for Vapi recording URL
//     const [fullTranscript, setFullTranscript] = useState(null); // Added for full transcript

//     // UI loading and call status states
//     const [loading, setLoading] = useState(true); // Overall loading state for fetching interview data
//     const [preparingInterview, setPreparingInterview] = useState(false); // State for API calls related to interview prep/start/end
//     const [callStatus, setCallStatus] = useState('IDLE'); // Vapi call status: IDLE, ACTIVE, ENDED

//     // Conversation and captions states
//     const [localUserName, setLocalUserName] = useState('Candidate'); // Name of the user (candidate)
//     const [conversation, setConversation] = useState([]); // Array of {role, content} for the conversation log
//     const [currentSpeakingRole, setCurrentSpeakingRole] = useState(null); // 'user' or 'assistant' indicating who is currently speaking

//     const [assistantCaption, setAssistantCaption] = useState(''); // Real-time caption for assistant's speech
//     const [userCaption, setUserCaption] = useState(''); // Real-time caption for user's speech

//     const [loadingProgress, setLoadingProgress] = useState(0); // For the loading bar

//     // Ref to keep track of conversation state inside useCallback/useEffect without re-creating functions
//     const conversationRef = useRef([]);

//     // Update conversationRef whenever conversation state changes
//     useEffect(() => {
//         conversationRef.current = conversation;
//     }, [conversation]);

//     // Set localUserName based on the authenticated user's name
//     useEffect(() => {
//         if (user && user.name) {
//             setLocalUserName(user.name);
//         } else {
//             setLocalUserName('Candidate'); // Default if user name is not available
//         }
//     }, [user]);

//     // Effect to load interview details when component mounts or interviewId changes
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         const userId = localStorage.getItem('userId');

//         // Check for authentication token and user ID
//         if (!token || !userId) {
//             toast.error('Session expired. Redirecting to login.');
//             vapi.stop(); // Stop any active Vapi call
//             navigate('/login');
//             return;
//         }

//         const loadInterview = async () => {
//             setLoading(true); // Start loading
//             setLoadingProgress(30); // Initial progress
//             if (interviewId && interviewId !== 'new') {
//                 // If interviewId exists and is not 'new', fetch existing interview data
//                 try {
//                     const res = await axios.get(
//                         `${import.meta.env.VITE_API_BASE_URL}/api/interview/${interviewId}`,
//                         {
//                             headers: { 'x-auth-token': token },
//                         }
//                     );
//                     const data = res.data;
//                     setSubject(data.subject);
//                     setNumQuestions(data.numQuestions);
//                     setQuestions(data.questions || []);
//                     setConversation(data.conversation || []);
//                     setCurrentInterviewRecordId(data._id);
//                     setIsInterviewCompleted(data.completed || false);
//                     setVapiRecordingUrl(data.vapiRecordingUrl || null); // Load recording URL
//                     setFullTranscript(data.fullTranscript || null);      // Load full transcript
//                     setLoadingProgress(100); // Complete progress
//                 } catch (err) {
//                     console.error('Interview fetch error:', err);
//                     toast.error('Interview not found or access denied.');
//                     navigate('/'); // Redirect to dashboard or home on error
//                     setLoadingProgress(0); // Reset progress on error
//                 }
//             } else {
//                 // If interviewId is 'new' or not provided, reset to a new interview form state
//                 setSubject('');
//                 setNumQuestions(5);
//                 setQuestions([]);
//                 setConversation([]);
//                 setCurrentInterviewRecordId(null);
//                 setIsInterviewCompleted(false);
//                 setVapiRecordingUrl(null);
//                 setFullTranscript(null);
//                 setLoadingProgress(100); // Complete progress
//             }
//             setLoading(false); // End loading
//         };

//         loadInterview(); // Call the async function to load interview data

//         // Event listener for localStorage changes (e.g., token removed by logout)
//         const handleStorageChange = (event) => {
//             if (event.key === 'token' && event.newValue === null) {
//                 toast.error('Session expired. Redirecting to login.');
//                 vapi.stop();
//                 navigate('/login');
//             }
//         };

//         window.addEventListener('storage', handleStorageChange);
//         // Cleanup listener on component unmount
//         return () => window.removeEventListener('storage', handleStorageChange);
//     }, [navigate, interviewId]); // Dependencies for useEffect

//     // Callback to save interview conversation and trigger feedback generation
//     const saveInterviewDataAndGenerateFeedback = useCallback(
//         async (finalConversation) => {
//             const token = localStorage.getItem('token');
//             // Ensure token and currentInterviewRecordId exist before proceeding
//             if (!token || !currentInterviewRecordId) return;

//             try {
//                 setPreparingInterview(true); // Indicate processing
//                 setLoadingProgress(30); // Start progress for saving/feedback
//                 // 1. Save the final conversation to the interview record and mark as complete
//                 // Note: The Vapi recording URL and full transcript are updated by the webhook
//                 // so we only need to update the conversation and completion status here.
//                 await axios.post(
//                     `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/complete`,
//                     { conversation: finalConversation },
//                     { headers: { 'x-auth-token': token } }
//                 );
//                 setIsInterviewCompleted(true); // Mark interview as completed
//                 setLoadingProgress(60); // Progress for saving

//                 // 2. Generate and save feedback for the completed interview
//                 await axios.post(
//                     `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/feedback`,
//                     {
//                         conversation: finalConversation,
//                         jobRole: subject,
//                         candidateName: localUserName,
//                     },
//                     { headers: { 'x-auth-token': token } }
//                 );
//                 setLoadingProgress(80); // Progress for feedback generation

//                 // 3. Re-fetch the updated interview record to get the vapiRecordingUrl and fullTranscript
//                 // These would have been updated by the Vapi webhook in the backend.
//                 const updatedRes = await axios.get(
//                     `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}`,
//                     { headers: { 'x-auth-token': token } }
//                 );
//                 setVapiRecordingUrl(updatedRes.data.vapiRecordingUrl || null);
//                 setFullTranscript(updatedRes.data.fullTranscript || null);
//                 setLoadingProgress(100); // Complete progress

//                 toast.success('Interview ended. Feedback generated!');
//                 // Navigate to the feedback page for this interview
//                 navigate(`/interview/${currentInterviewRecordId}/feedback`);
//             } catch (error) {
//                 console.error('Save/Feedback error:', error);
//                 toast.error('Failed to save interview or generate feedback.');
//                 setLoadingProgress(0); // Reset progress on error
//             } finally {
//                 setPreparingInterview(false); // End processing indication
//             }
//         },
//         [currentInterviewRecordId, subject, localUserName, navigate] // Dependencies for useCallback
//     );

//     // Callback to add a message to the conversation log
//     const addMessage = useCallback((role, content) => {
//         if (content && content.trim() !== '') {
//             setConversation((prev) => {
//                 // Prevent adding duplicate messages, especially for captions that get finalized
//                 const lastMessage = prev[prev.length - 1];
//                 if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
//                     return prev;
//                 }
//                 return [...prev, { role, content, timestamp: new Date() }]; // Add timestamp for consistency
//             });
//         }
//     }, []);

//     // Effect to handle Vapi SDK events (speech, call status, messages, errors)
//     useEffect(() => {
//         // Event listeners for Vapi SDK
//         vapi.on('speech-start', () => {
//             // When assistant starts speaking, finalize any ongoing user caption
//             if (userCaption) {
//                 addMessage('user', userCaption);
//             }
//             setUserCaption(''); // Clear user caption as assistant is speaking
//             setCurrentSpeakingRole('assistant');
//         });

//         vapi.on('speech-end', () => {
//             // When assistant finishes speaking, finalize the assistant caption
//             if (assistantCaption) {
//                 addMessage('assistant', assistantCaption);
//             }
//             // DO NOT CLEAR assistantCaption here. It should persist until the user speaks,
//             // or until the call ends to capture the last utterance.
//             setCurrentSpeakingRole(null); // No one is actively speaking
//         });

//         vapi.on('user-speech-start', () => {
//             // When user starts speaking, finalize any ongoing assistant caption
//             if (assistantCaption) {
//                 addMessage('assistant', assistantCaption);
//             }
//             setAssistantCaption(''); // Clear assistant caption as user is speaking
//             setCurrentSpeakingRole('user');
//         });

//         vapi.on('user-speech-end', () => {
//             // When user finishes speaking, finalize the user caption
//             if (userCaption) {
//                 addMessage('user', userCaption);
//             }
//             // DO NOT CLEAR userCaption here. It should persist until the assistant speaks.
//             setCurrentSpeakingRole(null); // No one is actively speaking
//         });

//         vapi.on('call-start', () => {
//             setCallStatus('ACTIVE'); // Set call status to active
//             toast.info('Vapi call started.');
//             // If it's a new interview, or starting fresh, clear conversation
//             if (!currentInterviewRecordId || interviewId === 'new') {
//                 setConversation([]);
//             }
//             // Clear captions and speaking role at call start
//             setAssistantCaption('');
//             setUserCaption('');
//             setCurrentSpeakingRole(null);
//         });

//         vapi.on('call-end', () => {
//             setCallStatus('ENDED'); // Set call status to ended
//             toast.info('Vapi call ended. Generating feedback...');
//             const finalTranscript = [...conversationRef.current]; // Get the current state of conversation

//             // Ensure any pending captions are added to the final transcript
//             // This is crucial to capture the very last spoken words.
//             if (assistantCaption && assistantCaption.trim() !== '') {
//                 const lastConvMessage = finalTranscript[finalTranscript.length - 1];
//                 if (!lastConvMessage || !(lastConvMessage.role === 'assistant' && lastConvMessage.content === assistantCaption)) {
//                     finalTranscript.push({ role: 'assistant', content: assistantCaption, timestamp: new Date() });
//                 }
//             }
//             if (userCaption && userCaption.trim() !== '') {
//                 const lastConvMessage = finalTranscript[finalTranscript.length - 1];
//                 if (!lastConvMessage || !(lastConvMessage.role === 'user' && lastConvMessage.content === userCaption)) {
//                     finalTranscript.push({ role: 'user', content: userCaption, timestamp: new Date() });
//                 }
//             }

//             setConversation(finalTranscript); // Update state with the finalized conversation
//             saveInterviewDataAndGenerateFeedback(finalTranscript); // Trigger save and feedback generation

//             vapi.stop(); // Ensure Vapi call is fully stopped

//             // Clear captions and speaking role on call end
//             setAssistantCaption('');
//             setUserCaption('');
//             setCurrentSpeakingRole(null);
//         });

//         vapi.on('message', (msg) => {
//             // Real-time captioning based on Vapi's message events
//             const turn = msg?.conversation?.[msg.conversation.length - 1];
//             if (turn?.role === 'assistant') {
//                 setAssistantCaption(turn.content);
//             } else if (turn?.role === 'user') {
//                 setUserCaption(turn.content);
//             }
//         });

//         vapi.on('error', (err) => {
//             console.error('Vapi error:', err);
//             toast.error(`Vapi Error: ${err.message || String(err)}`);
//             setCallStatus('IDLE'); // Reset call status on error
//             vapi.stop();
//             setCurrentSpeakingRole(null);
//             setPreparingInterview(false);
//         });

//         // Cleanup function for useEffect: remove all Vapi listeners on component unmount
//         return () => {
//             [
//                 'speech-start',
//                 'speech-end',
//                 'user-speech-start',
//                 'user-speech-end',
//                 'call-start',
//                 'call-end',
//                 'message',
//                 'error',
//             ].forEach((e) => vapi.removeAllListeners(e));
//         };
//     }, [saveInterviewDataAndGenerateFeedback, addMessage, interviewId, currentInterviewRecordId, assistantCaption, userCaption]); // Dependencies for Vapi event handlers

//     // Function to start the Vapi call
//     // Added 'currentSubject' parameter to ensure the correct subject is used immediately
//     const startVapiCall = async (questionsArray, currentSubject, initialConversation = []) => {
//         if (!currentSubject || !questionsArray?.length) { // Use currentSubject here
//             toast.error('Cannot start interview: Invalid subject or questions provided.');
//             setPreparingInterview(false);
//             return;
//         }

//         // Format questions for the AI system prompt
//         const questionList = questionsArray.map((q, i) => `${i + 1}. ${q}`).join('\n');

//         // Initial messages for the AI model, including system instructions
//         let initialMessages = [
//             {
//                 role: 'system',
//                 content: `
//                     You are an AI voice assistant conducting interviews for the role of ${currentSubject}.
//                     Your name is Jennifer. Introduce yourself briefly.
//                     Only ask the following questions, one by one:
//                     ${questionList}
//                     After the candidate answers a question, provide brief, encouraging, and friendly feedback or a transition (e.g., "Great answer!", "Thanks for sharing.", "Alright, next question:"). Do not critique the answer's content during the interview.
//                     When all questions have been asked and answered, say something like "That was the last question. Thank you for your time!" and then end the call. Do not ask "Is there anything else?".
//                 `.trim(),
//             },
//         ];

//         // If continuing an interview, append previous conversation turns to the AI's context
//         if (initialConversation.length > 0) {
//             const filteredInitialConversation = initialConversation.filter(
//                 (msg) => msg.role !== 'system' // Exclude any old system messages
//             );
//             initialMessages = [...initialMessages, ...filteredInitialConversation];
//         }

//         // Determine the first message the AI should say based on whether it's a new or continuing call
//         const firstMessage =
//             initialConversation.length === 0 || !initialConversation.some((m) => m.role === 'assistant')
//                 ? `Hi ${localUserName}, I'm Jennifer, your AI interviewer for the ${currentSubject} role. Ready to begin?`
//                 : 'Welcome back! Let\'s continue where we left off.';

//         // Vapi assistant configuration
//         const assistantOptions = {
//             name: 'AI Recruiter - Jennifer',
//             firstMessage: firstMessage,
//             transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
//             voice: { provider: 'playht', voiceId: 'jennifer' },
//             model: { provider: 'openai', model: 'gpt-4', messages: initialMessages },
//             // IMPORTANT: Pass the currentInterviewRecordId in metadata for the webhook
//             // This allows your backend webhook to identify which interview record to update.
//             metadata: {
//                 interviewRecordId: currentInterviewRecordId, // This will be the ID created/loaded
//             },
//         };

//         try {
//             await vapi.start(assistantOptions); // Start the Vapi call
//             setCallStatus('ACTIVE');
//             toast.success('Vapi call started successfully!');
//         } catch (err) {
//             console.error('Vapi start error:', err);
//             toast.error('Could not start interview.');
//             setCallStatus('IDLE');
//         }
//     };

//     // Handler for creating a new interview
//     const handleCreateNewInterview = async (newSubject, newNumQuestions) => {
//         setPreparingInterview(true); // Indicate processing
//         setLoadingProgress(0); // Reset progress

//         if (!newSubject || newNumQuestions < 1) {
//             toast.error('Enter subject and valid number of questions.');
//             setPreparingInterview(false);
//             return;
//         }

//         try {
//             const token = localStorage.getItem('token');
//             setLoadingProgress(20); // Progress for API call
//             // Call backend to generate questions and create a new interview record
//             const res = await axios.post(
//                 `${import.meta.env.VITE_API_BASE_URL}/api/interview/generate`,
//                 { subject: newSubject, numQuestions: newNumQuestions },
//                 { headers: { 'x-auth-token': token } }
//             );
//             setLoadingProgress(50); // Progress for response

//             const { questions: newQs, interviewId: newId } = res.data;
//             if (!newId) throw new Error('Invalid response: interviewId missing');

//             // Update state with new interview data
//             setSubject(newSubject);
//             setNumQuestions(newNumQuestions);
//             setQuestions(newQs);
//             setCurrentInterviewRecordId(newId);
//             setConversation([]); // Clear conversation for new interview
//             setIsInterviewCompleted(false); // Mark as not completed
//             setVapiRecordingUrl(null); // Clear previous recording URL
//             setFullTranscript(null);      // Clear previous full transcript

//             // Navigate to the new interview URL, replacing history entry
//             navigate(`/interview/${newId}`, { replace: true });
//             setLoadingProgress(70); // Progress for navigation

//             // Pass newSubject directly to startVapiCall to ensure it's available immediately
//             await startVapiCall(newQs, newSubject, []); // FIX: Pass newSubject
//             setLoadingProgress(100); // Complete progress
//             toast.success('Interview created and started!');
//         } catch (err) {
//             console.error('Create interview error:', err);
//             toast.error('Failed to create or start interview.');
//             setCallStatus('IDLE');
//             setLoadingProgress(0); // Reset progress on error
//         } finally {
//             setPreparingInterview(false); // End processing indication
//         }
//     };

//     // Handler for continuing an existing interview
//     const handleContinueInterview = async () => {
//         if (!currentInterviewRecordId || !questions.length || isInterviewCompleted) {
//             toast.error('No active interview to continue or interview already completed.');
//             return;
//         }
//         setPreparingInterview(true); // Indicate processing
//         setLoadingProgress(0); // Reset progress
//         try {
//             setLoadingProgress(50); // Progress for call setup
//             // Continue Vapi call with existing questions and current conversation
//             await startVapiCall(questions, subject, conversation); // FIX: Pass subject
//             setLoadingProgress(100); // Complete progress
//         } catch (error) {
//             console.error('Continue interview error:', error);
//             toast.error('Failed to continue interview.');
//             setCallStatus('IDLE');
//             setLoadingProgress(0); // Reset progress on error
//         } finally {
//             setPreparingInterview(false); // End processing indication
//         }
//     };

//     // Handler for retaking an interview (regenerates questions or uses existing ones)
//     const handleRetakeInterview = async () => {
//         if (!currentInterviewRecordId || !subject || numQuestions < 1) {
//             toast.error('Cannot retake: Invalid interview data.');
//             return;
//         }
//         setPreparingInterview(true); // Indicate processing
//         setLoadingProgress(0); // Reset progress
//         try {
//             const token = localStorage.getItem('token');
//             setLoadingProgress(20); // Progress for regeneration attempt
//             // Attempt to regenerate questions via backend endpoint
//             const res = await axios.post(
//                 `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/regenerate`,
//                 { subject, numQuestions },
//                 { headers: { 'x-auth-token': token } }
//             );
//             setLoadingProgress(50); // Progress for questions

//             const { questions: newQs } = res.data;
//             setQuestions(newQs); // Update with new questions
//             setConversation([]); // Clear conversation for fresh start
//             setIsInterviewCompleted(false); // Mark as not completed
//             setVapiRecordingUrl(null); // Clear previous recording URL
//             setFullTranscript(null);      // Clear previous full transcript

//             setLoadingProgress(70); // Progress for call setup
//             await startVapiCall(newQs, subject, []); // FIX: Pass subject
//             setLoadingProgress(100); // Complete progress
//             toast.success('Interview retaken with new questions!');
//         } catch (err) {
//             // Fallback if regeneration fails (e.g., endpoint not available, API error)
//             console.warn('Retake with regeneration error (or endpoint not available):', err);
//             toast.warn('Regeneration failed, retaking with existing questions.');
//             setLoadingProgress(50); // Adjust progress for fallback
//             setConversation([]); // Clear conversation for fresh start
//             setIsInterviewCompleted(false); // Mark as not completed
//             setVapiRecordingUrl(null); // Clear previous recording URL
//             setFullTranscript(null);      // Clear previous full transcript
//             try {
//                 await startVapiCall(questions, subject, []); // FIX: Pass subject
//                 setLoadingProgress(100); // Complete progress
//                 toast.success('Interview retaken with existing questions!');
//             } catch (fallbackErr) {
//                 console.error('Fallback retake error:', fallbackErr);
//                 toast.error('Failed to retake interview.');
//                 setCallStatus('IDLE');
//                 setLoadingProgress(0); // Reset progress on error
//             }
//         } finally {
//             setPreparingInterview(false); // End processing indication
//         }
//     };

//     // Handler for manually ending the interview
//     const handleEndInterview = () => {
//         setPreparingInterview(true); // Indicate processing
//         toast.info('Ending interview...');
//         vapi.stop(); // This will trigger the 'call-end' event and subsequent save/feedback logic
//     };

//     // Main render method of the component
//     return (
//         <div className="container mt-5 pt-32">
//             <h2 className="mb-10">AI Interview Practice</h2>
//             {(loading || preparingInterview) && (
//                 <div className="my-3">
//                     <LoadingBar progress={loading ? loadingProgress : (preparingInterview ? loadingProgress : 0)} />
//                     <p className="mt-2 text-center text-muted">
//                         {loading ? 'Loading interview details...' : 'Processing, please wait...'}
//                     </p>
//                 </div>
//             )}

//             {/* Conditionally render NewInterviewForm or ActiveInterviewDisplay */}
//             {!currentInterviewRecordId || interviewId === 'new' ? (
//                 // Render form to create a new interview if no ID or 'new' in URL
//                 !loading && !preparingInterview && (
//                     <NewInterviewForm onCreateInterview={handleCreateNewInterview} loading={preparingInterview} />
//                 )
//             ) : (
//                 // Render active interview display if an interview record exists
//                 !loading && (
//                     <ActiveInterviewDisplay
//                         subject={subject}
//                         callStatus={callStatus}
//                         assistantCaption={assistantCaption}
//                         userCaption={userCaption}
//                         currentSpeakingRole={currentSpeakingRole}
//                         localUserName={localUserName}
//                         isInterviewCompleted={isInterviewCompleted}
//                         currentInterviewRecordId={currentInterviewRecordId}
//                         vapiRecordingUrl={vapiRecordingUrl} // Pass to display component
//                         fullTranscript={fullTranscript}      // Pass to display component
//                         onContinueInterview={handleContinueInterview}
//                         onRetakeInterview={handleRetakeInterview}
//                         onEndInterview={handleEndInterview}
//                         loading={preparingInterview}
//                     />
//                 )
//             )}
//             <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//         </div>
//     );
// };

// export default Interview;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
// Vapi is now imported and passed from App.jsx, no need to import it here.
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NewInterviewForm from '../components/NewInterviewForm';
import ActiveInterviewDisplay from '../components/ActiveInterviewDisplay';

// Simple LoadingBar component (remains unchanged)
const LoadingBar = ({ progress }) => {
    return (
        <div className="loading-bar-container" style={{ width: '100%', backgroundColor: '#e0e0e0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div
                className="loading-bar-progress"
                style={{
                    width: `${progress}%`,
                    backgroundColor: '#007bff', // Bootstrap primary blue
                    height: '100%',
                    transition: 'width 0.3s ease-in-out',
                    borderRadius: '4px',
                }}
            ></div>
        </div>
    );
};

// Receive vapi and vapiApiKey as props
const Interview = ({ user, vapi, vapiApiKey }) => {
    const { interviewId } = useParams();
    const navigate = useNavigate();

    const [subject, setSubject] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [questions, setQuestions] = useState([]);
    const [currentInterviewRecordId, setCurrentInterviewRecordId] = useState(null);
    const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);
    const [vapiRecordingUrl, setVapiRecordingUrl] = useState(null);
    const [fullTranscript, setFullTranscript] = useState(null);

    const [loading, setLoading] = useState(true);
    const [preparingInterview, setPreparingInterview] = useState(false);
    const [callStatus, setCallStatus] = useState('IDLE');

    const [localUserName, setLocalUserName] = useState('Candidate');
    const [conversation, setConversation] = useState([]);
    const [currentSpeakingRole, setCurrentSpeakingRole] = useState(null);

    const [assistantCaption, setAssistantCaption] = useState('');
    const [userCaption, setUserCaption] = useState('');

    const [loadingProgress, setLoadingProgress] = useState(0);

    const conversationRef = useRef([]);

    useEffect(() => {
        conversationRef.current = conversation;
    }, [conversation]);

    useEffect(() => {
        if (user && user.name) {
            setLocalUserName(user.name);
        } else {
            setLocalUserName('Candidate');
        }
    }, [user]);

    // Effect to load interview details and check Vapi key
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            toast.error('Session expired. Redirecting to login.');
            if (vapi) vapi.stop(); // Stop any active Vapi call before navigating
            navigate('/login');
            return;
        }

        // Check if Vapi API key is available
        if (!vapiApiKey) {
            toast.warn('Vapi API Key is missing. Please add it in settings to start an interview.', {
                autoClose: false, // Keep open until user dismisses or navigates
                closeOnClick: false,
                draggable: false,
                pauseOnHover: true,
            });
            setLoading(false); // Stop loading, as user action is required
            setPreparingInterview(false);
            return;
        }

        const loadInterview = async () => {
            setLoading(true);
            setLoadingProgress(30);
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
                    setVapiRecordingUrl(data.vapiRecordingUrl || null);
                    setFullTranscript(data.fullTranscript || null);
                    setLoadingProgress(100);
                } catch (err) {
                    console.error('Interview fetch error:', err);
                    toast.error('Interview not found or access denied.');
                    navigate('/');
                    setLoadingProgress(0);
                }
            } else {
                setSubject('');
                setNumQuestions(5);
                setQuestions([]);
                setConversation([]);
                setCurrentInterviewRecordId(null);
                setIsInterviewCompleted(false);
                setVapiRecordingUrl(null);
                setFullTranscript(null);
                setLoadingProgress(100);
            }
            setLoading(false);
        };

        loadInterview();

        const handleStorageChange = (event) => {
            if (event.key === 'token' && event.newValue === null) {
                toast.error('Session expired. Redirecting to login.');
                if (vapi) vapi.stop();
                navigate('/login');
            }
            if (event.key === 'vapiApiKey' && event.newValue === null) {
                // If Vapi key is removed from localStorage, trigger a warning
                toast.warn('Vapi API Key removed. Please add it in settings to start an interview.');
                if (vapi) vapi.stop();
                setVapiApiKey(''); // This will update the prop and re-trigger the check
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate, interviewId, vapi, vapiApiKey]); // Add vapiApiKey to dependencies

    const saveInterviewDataAndGenerateFeedback = useCallback(
        async (finalConversation) => {
            const token = localStorage.getItem('token');
            if (!token || !currentInterviewRecordId) return;

            try {
                setPreparingInterview(true);
                setLoadingProgress(30);
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/complete`,
                    { conversation: finalConversation },
                    { headers: { 'x-auth-token': token } }
                );
                setIsInterviewCompleted(true);
                setLoadingProgress(60);

                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/feedback`,
                    {
                        conversation: finalConversation,
                        jobRole: subject,
                        candidateName: localUserName,
                    },
                    { headers: { 'x-auth-token': token } }
                );
                setLoadingProgress(80);

                const updatedRes = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}`,
                    { headers: { 'x-auth-token': token } }
                );
                setVapiRecordingUrl(updatedRes.data.vapiRecordingUrl || null);
                setFullTranscript(updatedRes.data.fullTranscript || null);
                setLoadingProgress(100);

                toast.success('Interview ended. Feedback generated!');
                navigate(`/interview/${currentInterviewRecordId}/feedback`);
            } catch (error) {
                console.error('Save/Feedback error:', error);
                toast.error('Failed to save interview or generate feedback.');
                setLoadingProgress(0);
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
                if (lastMessage && lastMessage.role === role && lastMessage.content === content) {
                    return prev;
                }
                return [...prev, { role, content, timestamp: new Date() }];
            });
        }
    }, []);

    // Effect to handle Vapi SDK events
    useEffect(() => {
        // Only set up listeners if vapi instance is available
        if (!vapi) {
            console.warn("Vapi instance not available. Skipping Vapi event listeners setup.");
            return;
        }

        vapi.on('speech-start', () => {
            if (userCaption) {
                addMessage('user', userCaption);
            }
            setUserCaption('');
            setCurrentSpeakingRole('assistant');
        });

        vapi.on('speech-end', () => {
            if (assistantCaption) {
                addMessage('assistant', assistantCaption);
            }
            setCurrentSpeakingRole(null);
        });

        vapi.on('user-speech-start', () => {
            if (assistantCaption) {
                addMessage('assistant', assistantCaption);
            }
            setAssistantCaption('');
            setCurrentSpeakingRole('user');
        });

        vapi.on('user-speech-end', () => {
            if (userCaption) {
                addMessage('user', userCaption);
            }
            setCurrentSpeakingRole(null);
        });

        vapi.on('call-start', () => {
            setCallStatus('ACTIVE');
            toast.info('Vapi call started.');
            if (!currentInterviewRecordId || interviewId === 'new') {
                setConversation([]);
            }
            setAssistantCaption('');
            setUserCaption('');
            setCurrentSpeakingRole(null);
        });

        vapi.on('call-end', () => {
            setCallStatus('ENDED');
            toast.info('Vapi call ended. Generating feedback...');
            const finalTranscript = [...conversationRef.current];

            if (assistantCaption && assistantCaption.trim() !== '') {
                const lastConvMessage = finalTranscript[finalTranscript.length - 1];
                if (!lastConvMessage || !(lastConvMessage.role === 'assistant' && lastConvMessage.content === assistantCaption)) {
                    finalTranscript.push({ role: 'assistant', content: assistantCaption, timestamp: new Date() });
                }
            }
            if (userCaption && userCaption.trim() !== '') {
                const lastConvMessage = finalTranscript[finalTranscript.length - 1];
                if (!lastConvMessage || !(lastConvMessage.role === 'user' && lastConvMessage.content === userCaption)) {
                    finalTranscript.push({ role: 'user', content: userCaption, timestamp: new Date() });
                }
            }

            setConversation(finalTranscript);
            saveInterviewDataAndGenerateFeedback(finalTranscript);

            vapi.stop(); // Ensure Vapi call is fully stopped

            setAssistantCaption('');
            setUserCaption('');
            setCurrentSpeakingRole(null);
        });

        vapi.on('message', (msg) => {
            const turn = msg?.conversation?.[msg.conversation.length - 1];
            if (turn?.role === 'assistant') {
                setAssistantCaption(turn.content);
            } else if (turn?.role === 'user') {
                setUserCaption(turn.content);
            }
        });

        vapi.on('error', (err) => {
            console.error('Vapi error:', err);
            toast.error(`Vapi Error: ${err.message || String(err)}`);
            setCallStatus('IDLE');
            vapi.stop();
            setCurrentSpeakingRole(null);
            setPreparingInterview(false);
        });

        return () => {
            // Only remove listeners if vapi instance exists
            if (vapi) {
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
            }
        };
    }, [saveInterviewDataAndGenerateFeedback, addMessage, interviewId, currentInterviewRecordId, assistantCaption, userCaption, vapi]); // Add vapi to dependencies

    const startVapiCall = async (questionsArray, currentSubject, initialConversation = []) => {
        // Ensure Vapi instance is available before attempting to start a call
        if (!vapi) {
            toast.error('Vapi SDK not initialized. Please set your API key in settings.');
            setPreparingInterview(false);
            return;
        }

        if (!currentSubject || !questionsArray?.length) {
            toast.error('Cannot start interview: Invalid subject or questions provided.');
            setPreparingInterview(false);
            return;
        }

        const questionList = questionsArray.map((q, i) => `${i + 1}. ${q}`).join('\n');

        let initialMessages = [
            {
                role: 'system',
                content: `
                    You are an AI voice assistant conducting interviews for the role of ${currentSubject}.
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
                ? `Hi ${localUserName}, I'm Jennifer, your AI interviewer for the ${currentSubject} role. Ready to begin?`
                : 'Welcome back! Let\'s continue where we left off.';

        const assistantOptions = {
            name: 'AI Recruiter - Jennifer',
            firstMessage: firstMessage,
            transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
            voice: { provider: 'playht', voiceId: 'jennifer' },
            model: { provider: 'openai', model: 'gpt-4', messages: initialMessages },
            metadata: {
                interviewRecordId: currentInterviewRecordId,
            },
        };

        try {
            await vapi.start(assistantOptions);
            setCallStatus('ACTIVE');
            toast.success('Vapi call started successfully!');
        } catch (err) {
            console.error('Vapi start error:', err);
            toast.error('Could not start interview.');
            setCallStatus('IDLE');
        }
    };

    const handleCreateNewInterview = async (newSubject, newNumQuestions) => {
        if (!vapiApiKey) {
            toast.error('Vapi API Key is required to create an interview. Please add it in settings.');
            return;
        }
        setPreparingInterview(true);
        setLoadingProgress(0);

        if (!newSubject || newNumQuestions < 1) {
            toast.error('Enter subject and valid number of questions.');
            setPreparingInterview(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            setLoadingProgress(20);
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/interview/generate`,
                { subject: newSubject, numQuestions: newNumQuestions },
                { headers: { 'x-auth-token': token } }
            );
            setLoadingProgress(50);

            const { questions: newQs, interviewId: newId } = res.data;
            if (!newId) throw new Error('Invalid response: interviewId missing');

            setSubject(newSubject);
            setNumQuestions(newNumQuestions);
            setQuestions(newQs);
            setCurrentInterviewRecordId(newId);
            setConversation([]);
            setIsInterviewCompleted(false);
            setVapiRecordingUrl(null);
            setFullTranscript(null);

            navigate(`/interview/${newId}`, { replace: true });
            setLoadingProgress(70);

            await startVapiCall(newQs, newSubject, []);
            setLoadingProgress(100);
            toast.success('Interview created and started!');
        } catch (err) {
            console.error('Create interview error:', err);
            toast.error('Failed to create or start interview.');
            setCallStatus('IDLE');
            setLoadingProgress(0);
        } finally {
            setPreparingInterview(false);
        }
    };

    const handleContinueInterview = async () => {
        if (!vapiApiKey) {
            toast.error('Vapi API Key is required to continue an interview. Please add it in settings.');
            return;
        }
        if (!currentInterviewRecordId || !questions.length || isInterviewCompleted) {
            toast.error('No active interview to continue or interview already completed.');
            return;
        }
        setPreparingInterview(true);
        setLoadingProgress(0);
        try {
            setLoadingProgress(50);
            await startVapiCall(questions, subject, conversation);
            setLoadingProgress(100);
        } catch (error) {
            console.error('Continue interview error:', error);
            toast.error('Failed to continue interview.');
            setCallStatus('IDLE');
            setLoadingProgress(0);
        } finally {
            setPreparingInterview(false);
        }
    };

    const handleRetakeInterview = async () => {
        if (!vapiApiKey) {
            toast.error('Vapi API Key is required to retake an interview. Please add it in settings.');
            return;
        }
        if (!currentInterviewRecordId || !subject || numQuestions < 1) {
            toast.error('Cannot retake: Invalid interview data.');
            return;
        }
        setPreparingInterview(true);
        setLoadingProgress(0);
        try {
            const token = localStorage.getItem('token');
            setLoadingProgress(20);
            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/interview/${currentInterviewRecordId}/regenerate`,
                { subject, numQuestions },
                { headers: { 'x-auth-token': token } }
            );
            setLoadingProgress(50);

            const { questions: newQs } = res.data;
            setQuestions(newQs);
            setConversation([]);
            setIsInterviewCompleted(false);
            setVapiRecordingUrl(null);
            setFullTranscript(null);

            setLoadingProgress(70);
            await startVapiCall(newQs, subject, []);
            setLoadingProgress(100);
            toast.success('Interview retaken with new questions!');
        } catch (err) {
            console.warn('Retake with regeneration error (or endpoint not available):', err);
            toast.warn('Regeneration failed, retaking with existing questions.');
            setLoadingProgress(50);
            setConversation([]);
            setIsInterviewCompleted(false);
            setVapiRecordingUrl(null);
            setFullTranscript(null);
            try {
                await startVapiCall(questions, subject, []);
                setLoadingProgress(100);
                toast.success('Interview retaken with existing questions!');
            } catch (fallbackErr) {
                console.error('Fallback retake error:', fallbackErr);
                toast.error('Failed to retake interview.');
                setCallStatus('IDLE');
                setLoadingProgress(0);
            }
        } finally {
            setPreparingInterview(false);
        }
    };

    const handleEndInterview = () => {
        if (vapi) { // Only attempt to stop if Vapi instance exists
            setPreparingInterview(true);
            toast.info('Ending interview...');
            vapi.stop();
        } else {
            toast.warn('Vapi not active to stop.');
            setPreparingInterview(false);
        }
    };

    return (
        <div className="container mt-5 pt-32">
            <h2 className="mb-10">AI Interview Practice</h2>
            {(loading || preparingInterview) && (
                <div className="my-3">
                    <LoadingBar progress={loading ? loadingProgress : (preparingInterview ? loadingProgress : 0)} />
                    <p className="mt-2 text-center text-muted">
                        {loading ? 'Loading interview details...' : 'Processing, please wait...'}
                    </p>
                </div>
            )}

            {/* Conditionally render NewInterviewForm or ActiveInterviewDisplay */}
            {!currentInterviewRecordId || interviewId === 'new' ? (
                !loading && !preparingInterview && (
                    <NewInterviewForm onCreateInterview={handleCreateNewInterview} loading={preparingInterview} />
                )
            ) : (
                !loading && (
                    <ActiveInterviewDisplay
                        subject={subject}
                        callStatus={callStatus}
                        assistantCaption={assistantCaption}
                        userCaption={userCaption}
                        currentSpeakingRole={currentSpeakingRole}
                        localUserName={localUserName}
                        isInterviewCompleted={isInterviewCompleted}
                        currentInterviewRecordId={currentInterviewRecordId}
                        vapiRecordingUrl={vapiRecordingUrl}
                        fullTranscript={fullTranscript}
                        onContinueInterview={handleContinueInterview}
                        onRetakeInterview={handleRetakeInterview}
                        onEndInterview={handleEndInterview}
                        loading={preparingInterview}
                    />
                )
            )}
            <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default Interview;