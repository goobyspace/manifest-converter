import { useEffect, useState } from "react";
import { useStateContext } from "../../../state/stateContext";
import { PatchJSON, PatchJSONItem, DuplicateItem } from "../../../types";
import DownloadButton from "./downloadbutton";
import { getAlphabetIndex } from "../../../utility/alphabetindex";

function Patch() {
  const [patch, setPatch] = useState("The patch.json will appear here");
  const context = useStateContext();

  //this useEffect will update the patch string whenever the context changes aka the manifest files have any changes
  useEffect(() => {
    if (!context) return;
    const patchFiles: Array<PatchJSONItem> = [];
    const duplicateFiles: Array<DuplicateItem> = [];

    context.state.manifests.forEach((manifest) => {
      if (!manifest.included) {
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
                let fileName = file.file.toString().split("\\").slice(-1)[0];
                //duplicate filenames with different IDs need to get renamed
                if (
                  patchFiles.find((patchFile) => patchFile.file === fileName)
                ) {
                  const fileLetter = getAlphabetIndex(duplicateFiles.length);

                  fileName = fileName.replace(".", `_${fileLetter}.`);
                  duplicateFiles.push({
                    file: fileName,
                    parent: manifest.fileName,
                  });
                }
                patchFiles.push({
                  file: fileName,
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
      duplicateFiles: [...duplicateFiles], //duplicateFiles isnt in the patch.json specification, but we insert it so its easier to find which files need to be edited
      files: [...new Set(patchFiles)],
    };
    setPatch(JSON.stringify(patchJSON, null, 2));
  }, [context]);

  return (
    <div className="output-container container">
      <DownloadButton patch={patch} />
      <textarea value={patch} id="patch-textarea" name="patch.json" readOnly />
    </div>
  );
}

export default Patch;
