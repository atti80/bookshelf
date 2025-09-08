import React from "react";

const PageViewCounter = ({ text, count }: { text: string; count: number }) => {
  return (
    <div className="w-[90%] xl:w-[80%] max-w-76 border-none bg-background p-4 rounded-md flex justify-between md:max-lg:flex-col md:max-lg:text-sm">
      <span>{text}:</span>
      <span>{count}</span>
    </div>
  );
};

export default PageViewCounter;
