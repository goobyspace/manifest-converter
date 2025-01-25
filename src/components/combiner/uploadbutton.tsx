import uploadIcon from "../../assets/upload.svg";
import { useStateContext } from "../../state/stateContext";
import { PatchJSON } from "../../types";

function UploadButton() {
  const context = useStateContext();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!context) return;
    const length = event.target.files?.length || 0;
    const newPatches = [...context.state.patches];

    for (let i = 0; i < length; i++) {
      const file = event.target.files?.item(i);
      if (file) {
        const reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
          let patchJSON: PatchJSON | undefined;
          try {
            patchJSON = JSON.parse(reader.result as string);
            if (patchJSON && patchJSON.name === undefined) {
              throw new SyntaxError(
                "files field is missing, did you upload a patch.json file?"
              );
            }
            if (patchJSON) {
              newPatches.push({
                name: patchJSON.name,
                version: patchJSON.version,
                url: patchJSON.url,
                duplicateFiles: patchJSON.duplicateFiles || [],
                files: patchJSON.files,
              });

              context.dispatch({
                type: "SET_PATCHES",
                payload: newPatches,
              });
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
          Upload patch.json
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
