import uploadIcon from "../../../assets/upload.svg";
import { ManifestJSON } from "../../../types";
import { useStateContext } from "../../../state/stateContext";

function UploadButton() {
  const context = useStateContext();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!context) return;
    const length = event.target.files?.length || 0;
    const newManifests = [...context.state.manifests];

    for (let i = 0; i < length; i++) {
      const file = event.target.files?.item(i);
      if (file) {
        const reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
          const fileName: string = file.name.replace(".manifest.json", ".m2");
          let manifestJSON: ManifestJSON | undefined;
          try {
            manifestJSON = JSON.parse(reader.result as string);
            if (manifestJSON && manifestJSON.fileDataID === undefined) {
              throw new SyntaxError(
                "fileDataID is missing, did you upload a manifest.json file?"
              );
            }
            if (manifestJSON) {
              const fileDataId = manifestJSON["fileDataID"] as number;
              manifestJSON["filename"] = [
                { fileDataID: fileDataId, file: fileName },
              ];

              //no duplicates
              if (
                !newManifests.find(
                  (manifest) => manifest.fileDataID === fileDataId
                )
              ) {
                newManifests.push({
                  fileDataID: fileDataId,
                  fileName: fileName,
                  manifest: manifestJSON,
                  included: true,
                });

                context.dispatch({
                  type: "SET_MANIFESTS",
                  payload: newManifests,
                });
              } else {
                if (!context) return;
                context.dispatch({
                  type: "SET_ERROR",
                  payload:
                    "duplicate fileDataID found, did you upload the same file twice?",
                });
              }
            }
          } catch (error) {
            if (!context) return;
            if (error instanceof SyntaxError) {
              context.dispatch({
                type: "SET_ERROR",
                payload: "There was an error. Error message: " + error.message,
              });
            } else {
              context.dispatch({
                type: "SET_ERROR",
                payload: "Enter a valid json input",
              });
            }
          }
        };
      }
    }
  };

  return (
    <div className="input-upload">
      <form>
        <label htmlFor="upload" className="button">
          Upload manifest.json
          <img src={uploadIcon} className="icon" alt="Upload icon" />
        </label>
        <input
          id="upload"
          type="file"
          multiple
          accept=".json"
          onChange={handleFileUpload}
        />
      </form>
    </div>
  );
}

export default UploadButton;
