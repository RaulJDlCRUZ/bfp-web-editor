import { useState } from "react";
import CompileButton from "@/components/CompileButton/CompileButton";
import TreeComponent from "@/components/TreeFilePool";
import TextArea from "@/components/TextArea";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const NextCompilePage: React.FC = () => {
  const [documentData, setDocumentData] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-start pt-10">
      <div className="flex w-full">
        <div className="text-left w-1/3">
          <div className="text-center">
            <p className="text-gray-500 text-xl mt-4">File Listing</p>
          </div>
          <div className="mt-8 h-2/8">
            <TreeComponent />
          </div>
        </div>
        <div className="text-right w-2/3">
          <div className="text-center">
            <p className="text-gray-500 text-xl mt-4">Document Editor</p>
          </div>
          <div className="mt-8 h-2/8">
            <TextArea />
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-400 text-lg mt-4">
          Click the button below to compile the document
        </p>
        <div className="mt-6">
          <CompileButton setDocumentData={setDocumentData} />
        </div>
        <div className="mt-10"></div>
      </div>

      {documentData && (
        <div className="mt-8 flex justify-center w-11/12">
          <object
            data={`${BACKEND_URI}/api/result`}
            type="application/pdf"
            width="100%"
            height="600px"
          >
            <p>
              Your browser does not support PDFs.{" "}
              <a href={`${BACKEND_URI}/api/result`}>
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

export default NextCompilePage;
