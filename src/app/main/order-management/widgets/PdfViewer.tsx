import React from "react";

const FileViewer = ({ fileUrl }) => {
  // Extract file extension
  const fileExtension = fileUrl.split(".").pop().toLowerCase();

  // Function to determine the content type
  const getContentType = (fileExtension) => {
    if (["pdf", "jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      return "inline";
    }
    return "attachment";
  };

  // Render the appropriate content based on the file type
  const renderContent = () => {
    const contentType = getContentType(fileExtension);
    if (contentType === "inline") {
      return (
        <iframe src={fileUrl} title="File Viewer" width="100%" height="750px" />
      );
    } else {
      return (
        <a href={fileUrl} download>
          Download File
        </a>
      );
    }
  };

  return (
    <div
      style={{
        height: "750px",
        border: "1px solid rgba(0, 0, 0, 0.3)",
      }}
    >
      {renderContent()}
    </div>
  );
};

export default FileViewer;
