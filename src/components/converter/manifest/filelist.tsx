import closeIcon from "../../../assets/close.svg";
import { useStateContext } from "../../../state/stateContext";

function FileList() {
  const context = useStateContext();

  const onCheckChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileDataID: number
  ) => {
    if (!context) return;
    const newManifests = context.state.manifests.map((manifest) => {
      if (manifest.fileDataID !== fileDataID) {
        return manifest;
      } else {
        return {
          ...manifest,
          included: event.target.checked,
        };
      }
    });
    context.dispatch({ type: "SET_MANIFESTS", payload: newManifests });
  };

  const deleteManifest = (fileDataID: number) => {
    if (!context) return;
    const newManifests = context.state.manifests.filter((manifest) => {
      if (manifest.fileDataID !== fileDataID) {
        return manifest;
      }
    });
    context.dispatch({ type: "SET_MANIFESTS", payload: newManifests });
  };

  return (
    <div className="file-list">
      Files uploaded:
      {context &&
        context.state.manifests.map((manifest, key) => {
          return (
            <span
              key={key}
              className={`${manifest.included ? "checked" : "unchecked"} ${
                key % 2 == 0 ? "even" : "odd"
              }`}
            >
              <input
                type="checkbox"
                checked={manifest.included}
                onChange={(e) => onCheckChange(e, manifest.fileDataID)}
                key={key}
              />
              {manifest.fileName}
              <button onClick={() => deleteManifest(manifest.fileDataID)}>
                <img src={closeIcon} className="delete-icon" alt="Close icon" />
              </button>
            </span>
          );
        })}
    </div>
  );
}

export default FileList;
