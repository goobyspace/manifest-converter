import React from "react";

export interface ManifestListItem {
  fileDataID: number;
  fileName: string;
  manifest: ManifestJSON;
  included: boolean;
}

export interface ManifestJSON {
  [key: string]:
    | Array<{
        fileDataID: number;
        file: string;
      }>
    | number;
}

export interface DuplicateItem {
  file: string;
  parent: string;
}

export interface PatchJSONItem {
  file: string;
  id: number;
}

export interface PatchJSON {
  name: string | null;
  version: string;
  url: string | null;
  duplicateFiles?: Array<DuplicateItem>;
  files: Array<PatchJSONItem>;
}

export interface State {
  error: string;
  manifests: Array<ManifestListItem>;
  patches: Array<PatchJSON>;
}

export interface Action {
  type: "SET_ERROR" | "SET_MANIFESTS" | "SET_PATCHES";
  payload: string | Array<ManifestListItem> | Array<PatchJSON>;
}

export interface ContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}
