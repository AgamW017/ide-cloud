import { useState } from "react";
import "./ModalForm.css"; // Import CSS file

export default function ModalForm({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter Your Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
