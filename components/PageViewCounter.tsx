import React from "react";

const PageViewCounter = ({ text, count }: { text: string; count: number }) => {
  return (
    <div className="w-[90%] xl:w-[80%] border-none bg-background p-4 rounded-md flex justify-between">
      <span>{text}:</span>
      <span>{count}</span>
    </div>
  );
};

export default PageViewCounter;
