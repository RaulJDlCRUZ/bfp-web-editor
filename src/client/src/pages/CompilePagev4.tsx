import React, { useState, Suspense, JSX } from "react";
import { FileExplorerProvider } from "@/context/FileExplorerContext";
import CompileButton from "@/components/CompileButton/CompileButton";
import ContentElector from "@/components/ContentManagement/ContentElector";
import DocViewer from "@/components/ContentManagement/DocViewer";
import ResizableSplit from "@/components/Splitter";

const FileTree = React.lazy(() => import("@/components/TreeFilePool/TreeFilePool"));

function NewCompilePage(): JSX.Element {
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
      </div>

      <div className="text-right px-14">
        <div className="mt-6 justify-end">
          {/* TODO: Add a tooltip? */}
          <CompileButton setDocumentData={setDocumentData} />
        </div>
        {/* Dummy space to avoid the compile button crashing into footer */}
        <div className="mt-10"></div>
      </div>

      {documentData && <DocViewer documentData={documentData} />}
    </FileExplorerProvider>
  );
}

export default NewCompilePage;
