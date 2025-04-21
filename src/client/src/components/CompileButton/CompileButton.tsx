import React, { useState } from "react";
import { CompileButtonProps } from "@/common/types";
import fetchDocument from "@/services/fetchDocument";
import styles from "./CompileButton.module.css";

const CompileButton: React.FC<CompileButtonProps> = ({ setDocumentData }) => {
  const [buttonText, setButtonText] = useState("Get Document");
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    setButtonText("Compiling...");
    try {
      const response = await fetchDocument();
      if (!response) {
        setButtonText("Error");
        return;
      }
      setDocumentData(response.data.pdf);
      setButtonText("Re-compile");
    } catch (error) {
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
