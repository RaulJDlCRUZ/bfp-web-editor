import React, { useState } from "react";
import fetchDocument from "../../services/fetchDocument";
import "./CompileButton.css";

interface CompileButtonProps {
  setDocumentData: (data: string) => void;
}

const CompileButton: React.FC<CompileButtonProps> = ({ setDocumentData }) => {
  const [buttonText, setButtonText] = useState("Get Document");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    setButtonText("Obtaining...");
    try {
      const response = await fetchDocument();
      if (!response) {
        setButtonText("Error");
        return;
      }
      setDocumentData(response);
      setButtonText("Document Obtained");
    } catch (error) {
      setButtonText("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="compile-button"
      onClick={handleClick}
      disabled={isLoading}
    >
      {buttonText}
    </button>
  );
};

export default CompileButton;
