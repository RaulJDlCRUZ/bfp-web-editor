import { useState } from "react";
import CompileButton from "../components/CompileButton/CompileButton";

const BasicCompilePage: React.FC = () => {
  const [documentData, setDocumentData] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-start h-full pt-10">
      <h1 className="text-6xl text-gray-700 font-bold">TFG Web Editor</h1>
      <p className="text-gray-500 text-lg mt-4">
        A simple web compiler for TFG documents
      </p>
      <div className="mt-10 text-center">
        <CompileButton setDocumentData={setDocumentData} />
        {documentData && (
          <div className="mt-8 flex justify-center">
            <object
              data={`data:application/pdf;base64,${documentData}`}
              type="application/pdf"
              width="100%"
              height="600px"
            >
              <p>
                Your browser does not support PDFs.{" "}
                <a href={`data:application/pdf;base64,${documentData}`}>
                  <u>Download the PDF</u>
                </a>
                .
              </p>
            </object>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicCompilePage;
