// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Settings = ({ currentVapiApiKey, onSetVapiApiKey }) => {
//   const [apiKey, setApiKey] = useState(currentVapiApiKey);

//   useEffect(() => {
//     setApiKey(currentVapiApiKey);
//   }, [currentVapiApiKey]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (apiKey.trim() === '') {
//       toast.error('Vapi API Key cannot be empty.');
//       return;
//     }
//     onSetVapiApiKey(apiKey.trim());
//   };



//   return (
//     <div className="container mt-5 pt-32">
//       <h2 className="mb-4">Settings</h2>
//       <div className="card p-4 shadow-sm">
//         <h4 className="mb-3">Vapi API Key</h4>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="vapiApiKeyInput" className="form-label">
//               Enter your Vapi Public API Key:
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="vapiApiKeyInput"
//               value={apiKey}
//               onChange={(e) => setApiKey(e.target.value)}
//               placeholder="e.g., pk_xxxxxxxxxxxxxxxxxxxxxxxx"
//               aria-describedby="apiKeyHelp"
//             />
//             <div id="apiKeyHelp" className="form-text">
//               You can find your Vapi Public API Key in your Vapi dashboard under "API Keys".
//               This key is used to connect to the Vapi AI service for interviews.
//             </div>
//           </div>
//           <button type="submit" className="btn btn-primary">
//             Save Vapi API Key
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Settings;

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap Modal and Button components

const Settings = ({ currentVapiApiKey, onSetVapiApiKey }) => {
  const [apiKeyInput, setApiKeyInput] = useState(currentVapiApiKey);
  const [isSaving, setIsSaving] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false); // New state for custom confirmation modal

  useEffect(() => {
    setApiKeyInput(currentVapiApiKey);
  }, [currentVapiApiKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    const trimmedKey = apiKeyInput.trim();

    if (trimmedKey === '') {
      toast.error('Your Vapi API Key cannot be empty. Please enter a valid key or clear it.');
      setIsSaving(false);
      return;
    }

    

    try {
      onSetVapiApiKey(trimmedKey);
      // Success toast is now handled by App.jsx's onSetVapiApiKey callback
      // You could add a success toast here if onSetVapiApiKey doesn't already provide one.
      // toast.success('Vapi API Key saved successfully!');
    } catch (error) {
      console.error("Error saving Vapi API Key:", error);
      toast.error("Failed to save your Vapi API Key. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to show the custom confirmation modal
  const handleShowClearConfirm = () => setShowClearConfirm(true);

  // Function to hide the custom confirmation modal
  const handleCloseClearConfirm = () => setShowClearConfirm(false);

  // Function to confirm clearing the key (called from the custom modal)
  const handleConfirmClearKey = () => {
    handleCloseClearConfirm(); // Close the modal first
    try {
      onSetVapiApiKey(''); // Clear the key in App.jsx and localStorage
      toast.info('Your Vapi API Key has been removed.');
    } catch (error) {
      console.error("Error clearing Vapi API Key:", error);
      toast.error("Failed to clear your Vapi API Key. Please try again.");
    }
  };

  return (
    <div className="container mt-5 pt-32">
      <h2 className="mb-4">Settings</h2>
      <div className="card p-4 shadow-sm">
        <h4 className="mb-3">Vapi API Key Configuration</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="vapiApiKeyInput" className="form-label">
              Enter your Vapi Public API Key:
            </label>
            <input
              type="password"
              className="form-control"
              id="vapiApiKeyInput"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="e.g., a5se0685-aaef-4f8p-ae12-15d42b9a"
              aria-describedby="apiKeyHelp"
              disabled={isSaving}
            />
            <div id="apiKeyHelp" className="form-text">
              To get your Vapi Public API Key:
              <ol className="mt-2">
                <li><a href="https://dashboard.vapi.ai/" target="_blank" rel="noopener noreferrer">Log in to your Vapi Dashboard</a>.</li>
                <li>
                  <a
                    href="https://dashboard.vapi.ai/org/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium transition duration-200"
                  >
                    Navigate to the "API Keys" section.
                  </a>
                </li>
                <li>Copy your **Public** API Key (Example :- a5se0685-aaef-4f8p-ae12-15d42b9a).</li>
                <li>Paste it here and click "Save".</li>
              </ol>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                'Save Vapi API Key'
              )}
            </button>
            {currentVapiApiKey && (
              <button type="button" className="btn btn-outline-danger" onClick={handleShowClearConfirm} disabled={isSaving}>
                Clear Vapi API Key
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Custom Confirmation Modal */}
      <Modal show={showClearConfirm} onHide={handleCloseClearConfirm}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Key Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove your Vapi API Key?
          You'll need to re-enter it to use Vapi features.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseClearConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmClearKey}>
            Remove Key
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Settings;