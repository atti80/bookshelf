import React from "react";

const Aricle = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  return <div>{`Article ${id}`}</div>;
};

export default Aricle;
