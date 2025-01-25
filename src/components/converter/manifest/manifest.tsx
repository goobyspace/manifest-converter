import { useEffect, useState } from "react";
import { useStateContext } from "../../../state/stateContext";
import UploadButton from "./uploadbutton";
import FileList from "./filelist";
import { ManifestListItem } from "../../../types";

function Manifest() {
  const [manifest, setManifest] = useState(
    "Paste or upload manifest.json here"
  );

  const context = useStateContext();

  type ManifestListItemClean = Omit<ManifestListItem, "included">;

  useEffect(() => {
    if (!context) return;
    const checkedManifests = context.state.manifests.reduce<
      ManifestListItemClean[]
    >((filtered, manifest) => {
      if (manifest.included) {
        filtered.push({
          fileDataID: manifest.fileDataID,
          fileName: manifest.fileName,
          manifest: manifest.manifest,
        });
      }
      return filtered;
    }, []);

    setManifest(JSON.stringify(checkedManifests, null, 2));
  }, [context]);

  return (
    <div className="input-container container">
      <UploadButton />
      <FileList />
      <textarea
        value={manifest}
        id="manifest-textarea"
        name="manifest.json"
        readOnly
      />
    </div>
  );
}

export default Manifest;
