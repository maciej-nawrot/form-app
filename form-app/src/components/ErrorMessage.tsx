import React from "react";

function ErrorMessage({ message }: any) {
  return (
    <div className="error-message">
      <ul>
        {message.map((error: any, index: any) => {
          console.error(`Error: ${error}`);
          return <li key={index}>{error}</li>;
        })}
      </ul>
    </div>
  );
}

export default ErrorMessage;
