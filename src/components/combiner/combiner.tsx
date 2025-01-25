import UploadButton from "./uploadbutton";
import DownloadButton from "./downloadbutton";
import { useEffect, useState } from "react";
import FileList from "./filelist";
import { useStateContext } from "../../state/stateContext";
import { DuplicateItem, PatchJSONItem } from "../../types";
import { getAlphabetIndex } from "../../utility/alphabetindex";

function Combiner() {
  const [patch, setPatch] = useState("The patch.json will appear here");
  const context = useStateContext();

  useEffect(() => {
    if (!context) return;

    const patchFiles: PatchJSONItem[] = [];
    const duplicateFiles: Array<DuplicateItem> = [];

    context.state.patches.forEach((patch) => {
      patch.files.forEach((file) => {
        if (!patchFiles.find((patchFile) => patchFile.id === file.id)) {
          let fileName = file.file;
          //duplicate filenames with different IDs need to get renamed
          if (patchFiles.find((patchFile) => patchFile.file === fileName)) {
            const fileLetter = getAlphabetIndex(duplicateFiles.length);

            fileName = fileName.replace(".", `_${fileLetter}.`);
            duplicateFiles.push({
              file: fileName,
              parent: patch.name + " " + patch.files[0].file,
            });
          }
          patchFiles.push({
            file: fileName,
            id: file.id,
          });
        }
      });
    });

    const patchJSON = {
      name: null,
      version: "1",
      url: null,
      duplicateFiles: [...duplicateFiles],
      files: patchFiles,
    };

    setPatch(JSON.stringify(patchJSON, null, 2));
  }, [context]);

  return (
    <div className="combine-container">
      <div className="button-header">
        <UploadButton />
        <DownloadButton patch={patch} />
      </div>
      <FileList />
      <textarea
        value={patch}
        id="combine-textarea"
        name="patch.json"
        readOnly
      />
    </div>
  );
}

export default Combiner;
