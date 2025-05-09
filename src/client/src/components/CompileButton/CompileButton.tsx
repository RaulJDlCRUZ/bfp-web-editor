import React, { useState } from "react";
import { CompileButtonProps } from "@/common/types";
import { fetchDocument, printDocument } from "@/services/documentOperations";
import styles from "./CompileButton.module.css";

const CompileButton: React.FC<CompileButtonProps> = ({ setDocumentData }) => {
  const [buttonText, setButtonText] = useState("Get Document");
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    setDocumentData(null);
    setButtonText("Compiling...");
    try {
      const response = await fetchDocument();
      if (!response) {
        setButtonText("No Response. Try again later.");
        return;
      }
      const documentUrl = await printDocument();
      if (documentUrl) {
        setDocumentData(documentUrl);
      } else {
        console.error("Failed to generate document URL.");
      }
      setButtonText("Re-compile");
    } catch (error) {
      console.error("Error fetching document:", error);
      setButtonText("Error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      className={styles.compileButton}
      onClick={handleClick}
      disabled={isLoading}
    >
      {buttonText}
      {isLoading && <span className={styles.loadingSpinner}></span>}
    </button>
  );
};

export default CompileButton;
