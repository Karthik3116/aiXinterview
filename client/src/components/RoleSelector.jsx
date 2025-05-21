import React, { useState } from 'react';

const RoleSelector = ({ onSelect }) => {
  const [role, setRole] = useState('');
  return (
    <div className="role-selector">
      <h2>Select Interview Role</h2>
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="e.g. Frontend Developer"
      />
      <button onClick={() => onSelect(role)}>Start Interview</button>
    </div>
  );
};

export default RoleSelector;
