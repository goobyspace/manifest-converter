import { State, Action, PatchJSON } from "../types";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_ERROR":
      if (typeof action.payload === "string") {
        return { ...state, error: action.payload };
      }
      return state;
    case "SET_MANIFESTS":
      if (
        Array.isArray(action.payload) &&
        action.payload.every(
          (item) =>
            "fileDataID" in item &&
            "fileName" in item &&
            "manifest" in item &&
            "included" in item
        )
      ) {
        return { ...state, manifests: action.payload };
      }
      return state;
    case "SET_PATCHES":
      if (
        Array.isArray(action.payload) &&
        action.payload.every(
          (item) =>
            "name" in item &&
            "version" in item &&
            "url" in item &&
            "duplicateFiles" in item &&
            "files" in item
        )
      ) {
        return { ...state, patches: action.payload as PatchJSON[] };
      }
      return state;
    default:
      return state;
  }
};
