import closeIcon from "../../assets/close.svg";
import { useStateContext } from "../../state/stateContext";

function FileList() {
  const context = useStateContext();

  const deletePatches = (patchIndex: number) => {
    if (!context) return;
    const newPatches = context.state.patches.filter((patch, index) => {
      if (index !== patchIndex) {
        return patch;
      }
    });
    context.dispatch({ type: "SET_PATCHES", payload: newPatches });
  };

  return (
    <div className="file-list">
      Files uploaded:
      {context &&
        context.state.patches.map((patch, key) => {
          return (
            <span key={key}>
              patch.json name: {patch.name} version: {patch.version} first item:{" "}
              {patch.files[0].file}
              <button onClick={() => deletePatches(key)}>
                <img src={closeIcon} className="delete-icon" alt="Close icon" />
              </button>
            </span>
          );
        })}
    </div>
  );
}

export default FileList;
