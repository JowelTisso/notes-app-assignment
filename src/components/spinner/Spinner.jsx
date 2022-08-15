import "./Spinner.css";
import React from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { COLOR } from "../../utils/Constant";

function Spinner() {
  return (
    <div className="spinner-wrapper flex-center">
      <SyncLoader color={COLOR.cyan} size={20} />
    </div>
  );
}

export default Spinner;
