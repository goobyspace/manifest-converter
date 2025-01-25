import closeIcon from "../../assets/close.svg";
import { useStateContext } from "../../state/stateContext";
import { useEffect, useState } from "react";

function Error() {
  const context = useStateContext();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!context) return;
    const { state } = context;
    setError(state.error);
  }, [context]);

  const removeError = (error: string) => {
    if (!context) return;
    const { dispatch } = context;
    dispatch({ type: "SET_ERROR", payload: error });
  };

  return (
    <span className={error.length > 0 ? "error visible" : "error hidden"}>
      {error}
      <button onClick={() => removeError("")}>
        <img src={closeIcon} className="error-icon" alt="Close icon" />
      </button>
    </span>
  );
}

export default Error;
