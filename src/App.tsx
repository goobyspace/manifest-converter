import React, { useState } from "react";
import downloadIcon from "./assets/download.svg";
import uploadIcon from "./assets/upload.svg";
import manifestIcon from "/icon.svg";
import "./App.css";

function App() {
  const [manifest, setManifest] = useState(
    "Paste or upload manifest.json here"
  );
  const [patch, setPatch] = useState("The patch .json will appear here");
  const [fileName, setFileName] = useState("filename");

  interface ManifestJSON {
    [key: string]:
      | Array<{
          fileDataID: number;
          file: string;
        }>
      | string;
  }
  interface PatchJSON {
    name: string | null;
    version: string;
    url: string | null;
    files: Array<{ file: string; id: number }>;
  }

  const createPatch = (json: string) => {
    let manifestJSON: ManifestJSON | undefined;

    try {
      manifestJSON = JSON.parse(json);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setPatch(
          "There was a syntax error. Please correct it and try again: " +
            error.message
        );
      } else {
        setPatch("Enter a valid manifest.json input");
      }
    } finally {
      if (manifestJSON) {
        const patchJSON: PatchJSON = {
          name: null,
          version: "1",
          url: null,
          files: [],
        };
        const manifestKeys = Object.keys(manifestJSON);
        manifestKeys.forEach((key) => {
          const type: string = typeof (manifestJSON as ManifestJSON)[key];
          if (
            type === "object" &&
            Array.isArray((manifestJSON as ManifestJSON)[key])
          ) {
            const files = (
              (manifestJSON as ManifestJSON)[key] as Array<{
                fileDataID: number;
                file: string;
              }>
            ).map((file) => {
              return { file: file.file, id: file.fileDataID };
            });

            patchJSON.files.push(...files);
          }
        });
        setPatch(JSON.stringify(patchJSON, null, 2));
      }
    }
  };

  const handleManifestChange = (
    event: React.FormEvent<HTMLTextAreaElement>
  ) => {
    const manifestValue = (event.target as HTMLTextAreaElement).value;
    createPatch(manifestValue);
    setManifest(manifestValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = function () {
        createPatch(reader.result as string);
        setManifest(reader.result as string);
      };
    }
  };

  const downloadPatch = () => {
    const file = new Blob([patch as BlobPart], { type: "json" });

    // Others
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <>
      <h1>
        Manifest converter{" "}
        <img src={manifestIcon} className="logo" alt="Convert icon" />
      </h1>
      <p>
        Paste manifest.json file from wow.export on the left, copy or save the
        patch.json from the right.
      </p>
      <div className="main-container">
        <div className="input-container container">
          <div className="input-upload">
            <form>
              <label htmlFor="upload" className="button">
                Upload manifest.json
                <img src={uploadIcon} className="icon" alt="Upload icon" />
              </label>
              <input
                id="upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
              />
            </form>
          </div>
          <textarea
            value={manifest}
            onChange={(e) => handleManifestChange(e)}
            id="manifest-textarea"
            name="manifest.json"
          />
        </div>
        <div className="output-container container">
          <div className="output-download">
            <input
              value={fileName + ".json"}
              onChange={(e) => setFileName(e.target.value.replace(".json", ""))}
            />
            <button className="button" onClick={downloadPatch}>
              Download {fileName}.json
              <img src={downloadIcon} className="icon" alt="Download icon" />
            </button>
          </div>
          <textarea
            value={patch}
            id="patch-textarea"
            name="patch.json"
            readOnly
          />
        </div>
      </div>
    </>
  );
}

export default App;
