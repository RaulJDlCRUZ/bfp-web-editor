import React, { useState, Suspense } from "react";
import CompileButton from "@/components/CompileButton/CompileButton";
import TextArea from "@/components/TextArea";
import { FileExplorerProvider } from "@/context/FileExplorerContext";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const FileTree = React.lazy(() => import("@/components/TreeFilePool"));

const NextCompilePage: React.FC = () => {
  const [documentData, setDocumentData] = useState<string | null>(null);

  return (
    <FileExplorerProvider>
      <div className="flex flex-col items-center justify-start">
        <div className="flex w-full">
          <div className="text-left w-2/5">
            <div className="mt-8 h-2/8">
              <Suspense
                fallback={
                  <div>
                    <p className="text-gray-500 text-xl text-center mt-4">
                      Loading...
                    </p>
                  </div>
                }
              >
                <FileTree />
              </Suspense>
            </div>
          </div>
          <div className="text-right w-3/5">
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
              data={`${BACKEND_URI}/api/doc/result`}
              type="application/pdf"
              width="100%"
              height="600px"
            >
              <p>
                Your browser does not support PDFs.{" "}
                <a href={`${BACKEND_URI}/api/doc/result`}>
                  <u>Download the PDF</u>
                </a>
                .
              </p>
            </object>
          </div>
        )}
      </div>
    </FileExplorerProvider>
  );
};

export default NextCompilePage;
