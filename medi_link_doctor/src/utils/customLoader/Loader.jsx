import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({ loading, size, color }) => {
  return (
    loading && (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ClipLoader size={size} color={color} />
      </div>
    )
  );
};

export default Loader;
