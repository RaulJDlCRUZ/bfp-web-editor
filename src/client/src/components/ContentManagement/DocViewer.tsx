import React, { useEffect, useState } from "react";
import apiInstance from "@/services/axios/apiInstance";

interface DocViewerProps {
  documentData: string | null;
}

const DocViewer: React.FC<DocViewerProps> = ({ documentData }) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (documentData) {
      const fetchPdf = async () => {
        try {
          const response = await apiInstance.get("/doc/result", {
            responseType: "blob", // Ensures the response is treated as a binary file
          });
          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setPdfBlobUrl(url);
        } catch (error) {
          console.error("Error fetching PDF:", error);
        }
      };

      fetchPdf();
    }
  }, [documentData]);

  return (
    <>
      {pdfBlobUrl && (
        <div className="mt-8 flex justify-center h-screen w-full">
          <object
            data={pdfBlobUrl}
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <p>
              Your browser does not support PDFs.{" "}
              <a href={pdfBlobUrl} download="document.pdf">
                <u>Download the PDF</u>
              </a>
              .
            </p>
          </object>
        </div>
      )}
    </>
  );
};

export default DocViewer;
