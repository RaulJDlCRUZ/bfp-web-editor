import React, { useState, Suspense } from "react";
import CompileButton from "@/components/CompileButton/CompileButton";
import ContentElector from "@/components/ContentManagement/ContentElector";
import ResizableSplit from "@/components/Splitter";
import { FileExplorerProvider } from "@/context/FileExplorerContext";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const FileTree = React.lazy(() => import("@/components/TreeFilePool/TreeFilePool"));

const NewCompilePage: React.FC = () => {
  const [documentData, setDocumentData] = useState<string | null>(null);

  return (
    <FileExplorerProvider>
      <div className="flex flex-col items-center justify-start">
        <div className="flex w-full">
          <ResizableSplit
            leftChild={
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
            }
            rightChild={<ContentElector />}
          />
        </div>

        <div className="text-right w-11/12">
          <div className="mt-6 justify-end">
            {/* TODO: Add a tooltip? */}
            <CompileButton setDocumentData={setDocumentData} />
          </div>
          {/* Dummy space to avoid the compile button crashing into footer */}
          <div className="mt-10"></div>
        </div>

        {documentData && (
          <div className="mt-8 flex justify-center w-11/12">
            <object
            // TODO: When document is ready, "fell" towards the document
              data={`${BACKEND_URI}/doc/result`}
              type="application/pdf"
              width="100%"
              height="600px"
            >
              <p>
                Your browser does not support PDFs.{" "}
                <a href={`${BACKEND_URI}/doc/result`}>
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

export default NewCompilePage;
