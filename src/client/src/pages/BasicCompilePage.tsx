import { useState } from "react";
import CompileButton from "../components/CompileButton/CompileButton";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const BasicCompilePage: React.FC = () => {
  const [documentData, setDocumentData] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-start pt-10">
      <div className="text-center">
        <h1 className="text-6xl text-gray-700 font-bold">TFG Web Editor</h1>
        <p className="text-gray-500 text-2xl mt-4">
          A simple web compiler for TFG documents
        </p>
        <p className="text-gray-400 text-lg mt-4">
          Click the button below to compile the document
        </p>
        <div className="mt-6">
          <CompileButton setDocumentData={setDocumentData} />
        </div>
      </div>
      {documentData && (
        <div className="mt-8 flex justify-center w-5/6">
          <object
            data={`${BACKEND_URI}/servedoc`}
            type="application/pdf"
            width="100%"
            height="600px"
          >
            <p>
              Your browser does not support PDFs.{" "}
              <a href={`${BACKEND_URI}/servedoc`}>
                <u>Download the PDF</u>
              </a>
              .
            </p>
          </object>
        </div>
      )}
    </div>
  );
};

export default BasicCompilePage;
