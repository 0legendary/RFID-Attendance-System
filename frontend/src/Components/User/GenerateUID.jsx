import React, { useState } from "react";
import UIDCreationForm from "../Admin/CardCreation/UIDCreationForm";
import { Link,useNavigate} from "react-router-dom";

function GenerateUID() {
  const [uid, setUid] = useState("");
  const [uidNotFound, setUIDNotFound] = useState(false); // State to track if UID not found
  const navigate = useNavigate();

  const generateCodeAndSendToBackend = async () => {
    const newUid = Math.floor(Math.random() * 90000) + 10000; // Generate a 5-digit number
    setUid(newUid);

      // Send the code to the backend API
      try {
        const response = await fetch("http://localhost:4000/submit-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: newUid }),
        });

        if (response.ok) {
          const uidExists = true;
          if (uidExists) {
            navigate.push("/admin/new-user"); // Navigate to the UserCardCreation page
          }

          console.log("Code sent to backend successfully");
        } else {
          console.error("Failed to send code to backend");
        }

        if (response.status === 404) {
          setUIDNotFound(true); // Set the state if UID is not found
        }
      } catch (error) {
        console.error("An error occurred while sending the code:", error);
      }

  };

  return (
    <div>
      {uidNotFound ? (
        <UIDCreationForm uid={uid} /> // Render the UIDCreationForm if UID not found
      ) : (
        <div>
          <h1>5-Digit Code Generator</h1>
          <p>Generated Code: {uid}</p>
          
            <button onClick={generateCodeAndSendToBackend}>Generate Code</button>
          

        </div>
      )}
    </div>
  );
}

export default GenerateUID;
