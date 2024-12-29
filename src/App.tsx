import React, { useEffect, useState } from "react";
import closeIcon from "./assets/close.svg";
import downloadIcon from "./assets/download.svg";
import uploadIcon from "./assets/upload.svg";
import manifestIcon from "/icon.svg";
import "./App.css";

//quick explanation if i have to look at this again
//upload file -> read file -> parse json -> add to manifest list -> convert to patch.json
//check boxes are based on manifest list
//checkboxes are based on an array of the fileDataID of each manifest.json file, check if its it there unchecked if not
//if checkbox changes via the onCheckChange function the first useEffect will get called and update the manifest textarea
//if the manifest textarea gets updated (its the singular manifest useState) the second useEffect will get called
//this will check which manifests are checked and then create a patch.json file based on the checked ones

function App() {
  const [manifest, setManifest] = useState(
    "Paste or upload manifest.json here"
  );
  const [patch, setPatch] = useState("The patch.json will appear here");
  const [manifests, setManifests] = useState<Array<manifestListItem>>([]);
  const [checks, setChecks] = useState<Array<number>>([]);

  interface manifestListItem {
    fileDataID: number;
    fileName: string;
    manifest: ManifestJSON;
  }

  interface ManifestJSON {
    [key: string]:
      | Array<{
          fileDataID: number;
          file: string;
        }>
      | number;
  }

  interface patchJSONItem {
    file: string;
    id: number;
  }

  interface PatchJSON {
    name: string | null;
    version: string;
    url: string | null;
    files: Array<patchJSONItem>;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) {
      const reader = new FileReader();

      reader.readAsText(file);

      reader.onload = function () {
        const fileName: string = file.name.replace(".manifest.json", ".m2");
        const manifestJSON = JSON.parse(reader.result as string);

        const fileDataId = manifestJSON["fileDataID"] as number;
        manifestJSON["filename"] = [{ fileDataID: fileDataId, file: fileName }];

        //no duplicates
        if (!manifests.find((manifest) => manifest.fileDataID === fileDataId)) {
          setChecks([...checks, fileDataId]);

          setManifests([
            ...manifests,
            {
              fileDataID: fileDataId,
              fileName: fileName,
              manifest: manifestJSON,
            },
          ]);
        }
      };
    }
  };

  const downloadPatch = () => {
    const file = new Blob([patch as BlobPart], { type: "json" });

    // Others
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "patch.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const onCheckChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileDataID: number
  ) => {
    const newChecks = [...checks];
    if (event.target.checked) {
      newChecks.push(fileDataID);
    } else {
      const index = newChecks.indexOf(fileDataID);
      if (index > -1) {
        newChecks.splice(index, 1);
      }
    }
    setChecks(newChecks);
  };

  const deleteManifest = (fileDataID: number) => {
    const newManifests = manifests.filter((manifest) => {
      if (manifest.fileDataID !== fileDataID) {
        return manifest;
      }
    });
    setManifests(newManifests);

    const newChecks = checks.filter((check) => {
      if (check !== fileDataID) {
        return check;
      }
    });
    setChecks(newChecks);
  };

  useEffect(() => {
    const checkedManifests = manifests.filter((manifest) => {
      if (checks.includes(manifest.fileDataID)) {
        return manifest;
      }
    });
    setManifest(JSON.stringify(checkedManifests, null, 2));
  }, [checks, manifests]);

  useEffect(() => {
    const patchFiles: Array<patchJSONItem> = [];

    manifests.forEach((manifest) => {
      if (!checks.includes(manifest.fileDataID)) {
        return;
      }

      //no duplicates
      if (
        !patchFiles.find((patchFile) => patchFile.id === manifest.fileDataID)
      ) {
        patchFiles.push({
          file: manifest.fileName,
          id: manifest.fileDataID,
        });
      }

      const manifestJSON = manifest.manifest;
      const manifestKeys = Object.keys(manifestJSON);

      manifestKeys.forEach((key) => {
        const type: string = typeof manifestJSON[key];
        if (type === "object" && Array.isArray(manifestJSON[key])) {
          manifestJSON[key].forEach(
            (file: { fileDataID: number; file: string }) => {
              if (
                !patchFiles.find(
                  (patchFile) => patchFile.id === file.fileDataID
                )
              ) {
                patchFiles.push({
                  file: file.file.toString().split("\\").slice(-1)[0],
                  id: file.fileDataID,
                });
              }
            }
          );
        }
      });
    });

    const patchJSON: PatchJSON = {
      name: null,
      version: "1",
      url: null,
      files: [...new Set(patchFiles)],
    };
    setPatch(JSON.stringify(patchJSON, null, 2));
  }, [manifest, manifests, checks]);

  return (
    <>
      <h1>
        Manifest Converter
        <img src={manifestIcon} className="logo" alt="Convert icon" />
      </h1>
      <p>
        Upload manifest.json files from wow.export on the left, copy or save the
        combined patch.json from the right.
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
          <div className="file-list">
            Files uploaded:
            {manifests.map((manifest, key) => {
              return (
                <span key={key}>
                  <input
                    type="checkbox"
                    checked={checks.includes(manifest.fileDataID)}
                    onChange={(e) => onCheckChange(e, manifest.fileDataID)}
                    key={key}
                  />
                  {manifest.fileName}
                  <button onClick={() => deleteManifest(manifest.fileDataID)}>
                    <img
                      src={closeIcon}
                      className="delete-icon"
                      alt="Close icon"
                    />
                  </button>
                </span>
              );
            })}
          </div>
          <textarea
            value={manifest}
            id="manifest-textarea"
            name="manifest.json"
            readOnly
          />
        </div>
        <div className="output-container container">
          <div className="output-download">
            <button className="button" onClick={downloadPatch}>
              Download patch.json
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
