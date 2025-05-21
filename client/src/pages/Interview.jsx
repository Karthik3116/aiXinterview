// import React, { useState, useEffect } from "react";
// import Vapi from "@vapi-ai/web"; // Changed to default import

// const Interview = () => {
//   const [call, setCall] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const [error, setError] = useState(null);
//   const [vapiInstance, setVapiInstance] = useState(null);

//   useEffect(() => {
//     // Initialize Vapi instance only once
//     if (!vapiInstance) {
//       const publicKey = "ce5ccc60-fb4b-483f-bd5b-cf5b184b41c6"; // Replace with your actual public key
//       try {
//         const newVapiInstance = new Vapi(publicKey);
//         setVapiInstance(newVapiInstance);
//       } catch (e) {
//         setError(new Error("Failed to initialize Vapi: " + e.message));
//         console.error("Failed to initialize Vapi:", e);
//       }
//     }

//     // Cleanup function for event listeners
//     return () => {
//       if (vapiInstance) {
//         vapiInstance.off("speech-start", handleSpeechStart);
//         vapiInstance.off("speech-end", handleSpeechEnd);
//         vapiInstance.off("call-start", handleCallStart);
//         vapiInstance.off("call-end", handleCallEnd);

//         vapiInstance.off("message", handleMessage);
//         vapiInstance.off("error", handleError);
//       }
//     };
//   }, [vapiInstance]); // Depend on vapiInstance to ensure listeners are attached/detached correctly

//   // Attach event listeners when vapiInstance is available
//   useEffect(() => {
//     if (vapiInstance) {
//       vapiInstance.on("speech-start", handleSpeechStart);
//       vapiInstance.on("speech-end", handleSpeechEnd);
//       vapiInstance.on("call-start", handleCallStart);
//       vapiInstance.on("call-end", handleCallEnd);

//       vapiInstance.on("message", handleMessage);
//       vapiInstance.on("error", handleError);
//     }
//   }, [vapiInstance]); // Re-run when vapiInstance changes

//   const handleSpeechStart = () => {
//     setIsSpeaking(true);
//     console.log("Assistant speech has started.");
//   };

//   const handleSpeechEnd = () => {
//     setIsSpeaking(false);
//     console.log("Assistant speech has ended.");
//   };

//   const handleCallStart = () => {
//     console.log("Call has started.");
//   };

//   const handleCallEnd = () => {
//     console.log("Call has ended.");
//     setCall(null); // Reset call state when call ends
//   };

//   const handleVolumeLevel = (volume) => {
//     setVolumeLevel(volume);
//     console.log(`Assistant volume level: ${volume}`);
//   };

//   const handleMessage = (message) => {
//     setMessages((prevMessages) => [...prevMessages, message]);
//     console.log(message);
//   };

//   const handleError = (e) => {
//     setError(e);
//     console.error(e);
//   };

//   const startCall = async () => {
//     if (vapiInstance) {
//       try {
//         const newCall = await vapiInstance.start("35f159fc-e922-4bf9-b21a-57391b90b7de"); // Replace with your assistant ID
//         setCall(newCall);
//       } catch (e) {
//         setError(e);
//         console.error(e);
//       }
//     }
//   };

//   const stopCall = () => {
//     if (vapiInstance) {
//       vapiInstance.stop();
//     }
//   };

//   const sendMessage = () => {
//     if (vapiInstance) {
//       vapiInstance.send({
//         type: "add-message",
//         message: {
//           role: "system",
//           content: "The user has pressed the button, say peanuts",
//         },
//       });
//     }
//   };

//   const muteToggle = () => {
//     if (vapiInstance) {
//       vapiInstance.setMuted(!vapiInstance.isMuted());
//     }
//   };

//   const sayGoodbye = () => {
//     if (vapiInstance) {
//       vapiInstance.say("Our time's up, goodbye!", true);
//     }
//   };

//   return (
//     <div>
//       <h1>Vapi Web SDK Test</h1>
//       <button onClick={startCall} disabled={!!call}>Start Call</button>
//       <button onClick={stopCall} disabled={!call}>Stop Call</button>
//       <button onClick={sendMessage} disabled={!call}>Send Message</button>
//       <button onClick={muteToggle} disabled={!call}>Mute/Unmute</button>
//       <button onClick={sayGoodbye} disabled={!call}>Say Goodbye</button>

//       {isSpeaking && <p>Assistant is speaking...</p>}
//       <p>Volume Level: {volumeLevel.toFixed(2)}</p> 

//       {messages.length > 0 && (
//         <div>
//           <h2>Messages:</h2>
//           <ul>
//             {messages.map((message, index) => (
//               <li key={index}>{JSON.stringify(message, null, 2)}</li> 
//             ))}
//           </ul>
//         </div>
//       )}

//       {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
//     </div>
//   );
// };

// export default Interview;


// import React, { useState, useEffect } from "react";
// import Vapi from "@vapi-ai/web";

// const Interview = () => {
//   const [call, setCall] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [error, setError] = useState(null);
//   const [vapiInstance, setVapiInstance] = useState(null);
//   const [micPermission, setMicPermission] = useState(false);

//   useEffect(() => {
//     // Initialize Vapi instance only once
//     if (!vapiInstance) {
//       const publicKey = "ce5ccc60-fb4b-483f-bd5b-cf5b184b41c6"; // Replace with your actual public key
//       try {
//         const newVapiInstance = new Vapi(publicKey);
//         setVapiInstance(newVapiInstance);
//       } catch (e) {
//         setError(new Error("Failed to initialize Vapi: " + e.message));
//         console.error("Failed to initialize Vapi:", e);
//       }
//     }

//     // Cleanup event listeners on unmount or vapiInstance change
//     return () => {
//       if (vapiInstance) {
//         vapiInstance.off("speech-start", handleSpeechStart);
//         vapiInstance.off("speech-end", handleSpeechEnd);
//         vapiInstance.off("call-start", handleCallStart);
//         vapiInstance.off("call-end", handleCallEnd);
//         vapiInstance.off("message", handleMessage);
//         vapiInstance.off("error", handleError);
//         vapiInstance.off("speech-to-text", handleSpeechToText);
//       }
//     };
//   }, [vapiInstance]);

//   useEffect(() => {
//     if (vapiInstance) {
//       vapiInstance.on("speech-start", handleSpeechStart);
//       vapiInstance.on("speech-end", handleSpeechEnd);
//       vapiInstance.on("call-start", handleCallStart);
//       vapiInstance.on("call-end", handleCallEnd);
//       vapiInstance.on("message", handleMessage);
//       vapiInstance.on("error", handleError);
//       // This event gives partial & final transcriptions from voice input
//       vapiInstance.on("speech-to-text", handleSpeechToText);
//     }
//   }, [vapiInstance]);

//   const requestMicPermission = async () => {
//     try {
//       await navigator.mediaDevices.getUserMedia({ audio: true });
//       setMicPermission(true);
//     } catch (e) {
//       setError(new Error("Microphone permission denied."));
//       setMicPermission(false);
//     }
//   };

//   const startCall = async () => {
//     if (!micPermission) {
//       await requestMicPermission();
//       if (!micPermission) return; // Permission denied, stop here
//     }
//     if (vapiInstance) {
//       try {
//         const newCall = await vapiInstance.start("35f159fc-e922-4bf9-b21a-57391b90b7de"); // Replace with your assistant ID
//         setCall(newCall);
//       } catch (e) {
//         setError(e);
//         console.error(e);
//       }
//     }
//   };

//   const stopCall = () => {
//     if (vapiInstance) {
//       vapiInstance.stop();
//       setCall(null);
//     }
//   };

//   // When Vapi recognizes speech, it triggers this event with text
//   const handleSpeechToText = (textObj) => {
//     if (!textObj) return;
//     const { text, isFinal } = textObj;

//     // Only add final recognized speech as a user message and send it to assistant
//     if (isFinal && text.trim()) {
//       // Add user message to state
//       setMessages((prev) => [...prev, { role: "user", content: text.trim() }]);
//       // Send message to Vapi
//       vapiInstance.send({
//         type: "add-message",
//         message: {
//           role: "user",
//           content: text.trim(),
//         },
//       });
//     }
//   };

//   const handleSpeechStart = () => {
//     setIsSpeaking(true);
//     console.log("Assistant speech started");
//   };

//   const handleSpeechEnd = () => {
//     setIsSpeaking(false);
//     console.log("Assistant speech ended");
//   };

//   const handleCallStart = () => {
//     console.log("Call started");
//   };

//   const handleCallEnd = () => {
//     console.log("Call ended");
//     setCall(null);
//   };

//   const handleMessage = (message) => {
//     setMessages((prev) => [...prev, message]);
//     console.log("Assistant message:", message);
//   };

//   const handleError = (e) => {
//     setError(e);
//     console.error("Error:", e);
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>Voice-Only Vapi AI Interview</h1>
//       <button onClick={startCall} disabled={!!call} style={{ marginRight: 10 }}>
//         Start Voice Call
//       </button>
//       <button onClick={stopCall} disabled={!call} style={{ marginRight: 10 }}>
//         Stop Call
//       </button>

//       {isSpeaking && <p><b>Assistant is speaking...</b></p>}
//       {micPermission ? <p>Microphone permission granted ✅</p> : <p>Microphone permission needed</p>}
//       {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

//       {messages.length > 0 && (
//         <div style={{ marginTop: 20 }}>
//           <h2>Conversation:</h2>
//           <ul>
//             {messages.map((msg, idx) => (
//               <li key={idx} style={{ marginBottom: 10 }}>
//                 <b>{msg.role === "user" ? "You:" : "Assistant:"}</b>{" "}
//                 <span>{msg.content}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Interview;


// import React, { useState, useEffect, useRef } from "react";
// import Vapi from "@vapi-ai/web";

// const Interview = () => {
//   const [call, setCall] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [error, setError] = useState(null);
//   const [vapiInstance, setVapiInstance] = useState(null);
//   const [micPermission, setMicPermission] = useState(false);
//   const [volumeLevel, setVolumeLevel] = useState(0);
//   const messagesEndRef = useRef(null);

//   // Effect for initializing Vapi instance
//   useEffect(() => {
//     if (!vapiInstance) {
//       const publicKey = "ce5ccc60-fb4b-483f-bd5b-cf5b184b41c6";
//       try {
//         console.log("Attempting to initialize Vapi with public key:", publicKey);
//         const newVapiInstance = new Vapi(publicKey);
//         setVapiInstance(newVapiInstance);
//       } catch (e) {
//         setError(new Error("Failed to initialize Vapi: " + e.message));
//         console.error("Vapi initialization error:", e);
//       }
//     }

//     // Cleanup event listeners on unmount or vapiInstance change
//     return () => {
//       if (vapiInstance) {
//         console.log("Cleaning up Vapi event listeners.");
//         vapiInstance.off("speech-start", handleSpeechStart);
//         vapiInstance.off("speech-end", handleSpeechEnd);
//         vapiInstance.off("call-start", handleCallStart);
//         vapiInstance.off("call-end", handleCallEnd);
//         vapiInstance.off("message", handleMessage);
//         vapiInstance.off("error", handleError);
//         vapiInstance.off("speech-to-text", handleSpeechToText);
//         vapiInstance.off("volume-level", handleVolumeLevel);
//       }
//     };
//   }, [vapiInstance]);

//   // Effect for attaching Vapi event listeners
//   useEffect(() => {
//     if (vapiInstance) {
//       console.log("Attaching Vapi event listeners.");
//       vapiInstance.on("speech-start", handleSpeechStart);
//       vapiInstance.on("speech-end", handleSpeechEnd);
//       vapiInstance.on("call-start", handleCallStart);
//       vapiInstance.on("call-end", handleCallEnd);
//       vapiInstance.on("message", handleMessage);
//       vapiInstance.on("error", handleError);
//       vapiInstance.on("speech-to-text", handleSpeechToText);
//       vapiInstance.on("volume-level", handleVolumeLevel);
//     }
//   }, [vapiInstance]);

//   // Effect for auto-scrolling messages
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   const requestMicPermission = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setMicPermission(true);
//       stream.getTracks().forEach(track => track.stop());
//       setError(null);
//     } catch (e) {
//       const errorMessage = "Microphone permission denied. Please enable it in your browser settings.";
//       setError(new Error(errorMessage));
//       setMicPermission(false);
//       console.error("Microphone permission error:", e);
//       alert(errorMessage);
//     }
//   };

//   const startCall = async () => {
//     console.log("done..................")
//     if (!micPermission) {
//       await requestMicPermission();
//       if (!micPermission) {
//         console.warn("Call not started because microphone permission was not granted.");
//         return;
//       }
//     }

//     if (vapiInstance) {
//       try {
//         console.log("Attempting to start Vapi call with Assistant ID: 35f159fc-e922-4bf9-b21a-57391b90b7de");
//         const newCall = await vapiInstance.start("35f159fc-e922-4bf9-b21a-57391b90b7de");
//         setCall(newCall);
//         setError(null);
//         setMessages([]);
//         console.log("Vapi call started successfully.");
//       } catch (e) {
//         setError(e);
//         console.error("Error starting Vapi call:", e);
//         alert(`Error starting call: ${e.message}. Please check your Vapi Assistant ID and network connection.`);
//       }
//     } else {
//       setError(new Error("Vapi instance not initialized. Cannot start call."));
//       console.error("Vapi instance is null when trying to start call.");
//     }
//   };

//   const stopCall = () => {
//     if (vapiInstance) {
//       vapiInstance.stop();
//       console.log("Vapi call stopped.");
//     }
//   };

//   // Event handlers
//   const handleSpeechToText = (textObj) => {
//     if (!textObj) return;
//     const { text, isFinal } = textObj;
//     console.log("Speech-to-Text event:", textObj);

//     setMessages((prev) => {
//       const lastMessage = prev[prev.length - 1];
//       if (lastMessage && lastMessage.role === "user" && lastMessage.type === "partial-stt") {
//         return prev.map((msg, idx) =>
//           idx === prev.length - 1 ? { ...msg, content: text, isFinal: isFinal, type: isFinal ? "user-message" : "partial-stt" } : msg
//         );
//       } else {
//         return [...prev, { role: "user", content: text, isFinal: isFinal, type: isFinal ? "user-message" : "partial-stt" }];
//       }
//     });

//     // --- ADDITION FOR SPEAKING THE FINAL TEXT ---
//     if (isFinal && text.trim() && vapiInstance) {
//       console.log(`User finished speaking: "${text.trim()}". Making assistant say it.`);
//       // The `true` parameter makes the assistant interrupt its current speech
//       vapiInstance.say(`You said: ${text.trim()}`, true);
//     }
//     // --- END OF ADDITION ---
//   };

//   const handleSpeechStart = () => {
//     setIsSpeaking(true);
//     console.log("Assistant speech started");
//   };

//   const handleSpeechEnd = () => {
//     setIsSpeaking(false);
//     console.log("Assistant speech ended");
//   };

//   const handleCallStart = () => {
//     console.log("Call started");
//     setError(null);
//     setMessages([]);
//   };

//   const handleCallEnd = () => {
//     console.log("Call ended");
//     setCall(null);
//     setIsSpeaking(false);
//     setVolumeLevel(0);
//   };

//   const handleMessage = (message) => {
//     console.log("Received message:", message);
//     if (message.type === "assistant-message" && message.content) {
//       setMessages((prev) => [...prev, { role: "assistant", content: message.content }]);
//     }
//   };

//   const handleError = (e) => {
//     setError(e);
//     console.error("Vapi Error:", e);
//     alert(`Vapi Error: ${e}. Check console for details.`);
//   };

//   const handleVolumeLevel = (volume) => {
//     setVolumeLevel(volume);
//   };

//   return (
//     <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
//       <h1 style={{ textAlign: 'center', color: '#333' }}>Vapi AI Voice Interview</h1>

//       <div style={{ marginBottom: 20, display: 'flex', gap: '10px', justifyContent: 'center' }}>
//         <button
//           onClick={startCall}
//           disabled={!!call || !micPermission}
//           style={{ padding: '12px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', opacity: (!!call || !micPermission) ? 0.6 : 1 }}
//         >
//           Start Voice Call
//         </button>
//         <button
//           onClick={stopCall}
//           disabled={!call}
//           style={{ padding: '12px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', opacity: !call ? 0.6 : 1 }}
//         >
//           Stop Call
//         </button>
//         <button
//           onClick={requestMicPermission}
//           disabled={micPermission}
//           style={{ padding: '12px 20px', fontSize: '18px', cursor: 'pointer', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', opacity: micPermission ? 0.6 : 1 }}
//         >
//           Request Mic
//         </button>
//       </div>

//       <div style={{ textAlign: 'center', marginBottom: 20 }}>
//         {isSpeaking && <p style={{ color: 'blue', fontWeight: 'bold' }}>Assistant is speaking...</p>}
//         <p>Microphone permission: <span style={{ color: micPermission ? 'green' : 'red' }}>{micPermission ? "Granted ✅" : "Needed 🔴"}</span></p>
//         <p>Assistant Volume: {volumeLevel.toFixed(2)}</p>
//       </div>

//       {error && <p style={{ color: "red", fontWeight: 'bold', border: '1px dashed red', padding: '10px', borderRadius: '5px' }}>Error: {error.message}</p>}

//       {messages.length > 0 && (
//         <div style={{ marginTop: 20, border: '1px solid #ccc', padding: 15, borderRadius: 5, maxHeight: '400px', overflowY: 'auto', background: '#f9f9f9' }}>
//           <h2 style={{ marginBottom: 15, color: '#555' }}>Conversation Log:</h2>
//           <ul style={{ listStyle: 'none', padding: 0 }}>
//             {messages.map((msg, idx) => (
//               <li key={idx} style={{
//                 marginBottom: 10,
//                 padding: '10px 15px',
//                 borderRadius: '8px',
//                 background: msg.role === "user" ? '#dcf8c6' : '#e0e0e0',
//                 textAlign: msg.role === "user" ? 'right' : 'left',
//                 marginLeft: msg.role === "user" ? 'auto' : '0',
//                 marginRight: msg.role === "assistant" ? 'auto' : '0',
//                 maxWidth: '80%',
//                 wordWrap: 'break-word'
//               }}>
//                 <b style={{ color: msg.role === "user" ? '#075e54' : '#333' }}>{msg.role === "user" ? "You:" : "Assistant:"}</b>{" "}
//                 <span style={{ color: msg.role === "user" ? '#333' : '#333' }}>
//                   {msg.content || (msg.type === "partial-stt" ? `(Listening... ${msg.text || ''})` : "(No content received for this message)")}
//                 </span>
//               </li>
//             ))}
//             <div ref={messagesEndRef} />
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Interview;



// import React, { useEffect, useRef, useState } from 'react';
// import Vapi from '@vapi-ai/web';

// const SpeechRepeater = () => {
//   const [finalTranscript, setFinalTranscript] = useState('');
//   const [liveTranscript, setLiveTranscript] = useState('');
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const vapiRef = useRef(null);

//   useEffect(() => {
//     const vapi = new Vapi('f631dbe4-c868-4f6f-a3ae-65da94fbefe4'); // Replace with your Vapi web token
//     vapiRef.current = vapi;

//     vapi.on('speech-start', () => {
//       setIsSpeaking(true);
//     });

//     vapi.on('speech-end', () => {
//       setIsSpeaking(false);
//     });

//     vapi.on('message', (msg) => {
//       if (msg.type === 'transcript') {
//         if (msg.transcriptType === 'partial') {
//           setLiveTranscript(msg.transcript);
//         } else if (msg.transcriptType === 'final') {
//           setFinalTranscript(msg.transcript);
//           setLiveTranscript('');

//           // Echo what was said
//           setTimeout(() => {
//             vapi.send({
//               type: 'text',
//               text: msg.transcript,
//             });
//           }, 300);
//         }
//       }
//     });

//     return () => {
//       vapi.removeAllListeners();
//     };
//   }, []);

//   const startCall = async () => {
//     await vapiRef.current.start('27c7353e-0f51-4007-bcb0-642b9b6efbee'); // Replace with your assistant ID
//   };

//   const stopCall = async () => {
//     await vapiRef.current.stop();
//   };

//   // 👉 Speak predefined quote
//   const speakQuote = () => {
//     const quote = "Love is the essence of human life. God has gifted humans with different kinds of emotions that they can feel to experience the various aspects of life. Love is one such kind of emotion that all human beings have. Everybody has felt it, be it for a person, pet, or even a non-living object.";
//     console.log(quote);
//     vapiRef.current.send({
//       type: 'text',
//       text: quote,
//     });
//   };

//   return (
//     <div className="p-4 max-w-xl mx-auto text-center">
//       <h1 className="text-2xl font-bold mb-4">🗣️ Voice Echo Assistant</h1>

//       <div className="space-x-4 mb-4">
//         <button onClick={startCall} className="bg-green-500 text-white px-4 py-2 rounded">Start Listening</button>
//         <button onClick={stopCall} className="bg-red-500 text-white px-4 py-2 rounded">Stop</button>
//         <button onClick={speakQuote} className="bg-blue-500 text-white px-4 py-2 rounded">Speak Quote</button>
//       </div>

//       <div className="mb-2">
//         <strong>Status:</strong> {isSpeaking ? 'Speaking...' : 'Idle'}
//       </div>

//       <div className="mb-2 text-gray-600">
//         <strong>Live:</strong> {liveTranscript}
//       </div>

//       <div className="text-lg font-semibold mt-4">
//         <strong>Final:</strong> {finalTranscript}
//       </div>

//       {finalTranscript && (
//         <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
//           You said: <span className="font-bold">{finalTranscript}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SpeechRepeater;

import React, { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

const SpeechRepeater = () => {
  const [finalTranscript, setFinalTranscript] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState('');
  const vapiRef = useRef(null);

  useEffect(() => {
    const vapi = new Vapi('f631dbe4-c868-4f6f-a3ae-65da94fbefe4'); // Replace with your Vapi web token
    vapiRef.current = vapi;

    vapi.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapi.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapi.on('message', (msg) => {
      if (msg.type === 'transcript') {
        if (msg.transcriptType === 'partial') {
          setLiveTranscript(msg.transcript);
        } else if (msg.transcriptType === 'final') {
          setFinalTranscript(msg.transcript);
          setLiveTranscript('');

          // Echo what was said
          setTimeout(() => {
            vapi.send({
              type: 'text',
              text: msg.transcript,
            });
          }, 300);
        }
      }
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, []);

  const startCall = async () => {
    await vapiRef.current.start('27c7353e-0f51-4007-bcb0-642b9b6efbee'); // Replace with your assistant ID
  };

  const stopCall = async () => {
    await vapiRef.current.stop();
  };

  const speakQuote = () => {
    const quote = "Love is the essence of human life...";
    vapiRef.current.send({
      type: 'text',
      text: quote,
    });
  };

  const handleUserInputSend = async () => {
    if (userInput.trim()) {
      if (!vapiRef.current.isConnected()) {
        await vapiRef.current.start('27c7353e-0f51-4007-bcb0-642b9b6efbee'); // Start session if not already
      }

      vapiRef.current.send({
        type: 'text',
        text: userInput.trim(),
      });

      setFinalTranscript(userInput.trim());
      setUserInput('');
    }
  };


  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">🗣️ Voice Echo Assistant</h1>

      <div className="space-x-4 mb-4">
        <button onClick={startCall} className="bg-green-500 text-white px-4 py-2 rounded">Start Listening</button>
        <button onClick={stopCall} className="bg-red-500 text-white px-4 py-2 rounded">Stop</button>
        <button onClick={speakQuote} className="bg-blue-500 text-white px-4 py-2 rounded">Speak Quote</button>
      </div>

      <div className="mb-4 flex justify-center items-center space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type something..."
          className="border px-3 py-2 rounded w-2/3"
        />
        <button
          onClick={handleUserInputSend}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>

      <div className="mb-2">
        <strong>Status:</strong> {isSpeaking ? 'Speaking...' : 'Idle'}
      </div>

      <div className="mb-2 text-gray-600">
        <strong>Live:</strong> {liveTranscript}
      </div>

      <div className="text-lg font-semibold mt-4">
        <strong>Final:</strong> {finalTranscript}
      </div>

      {finalTranscript && (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
          You said: <span className="font-bold">{finalTranscript}</span>
        </div>
      )}
    </div>
  );
};

export default SpeechRepeater;
