import Manifest from "./manifest/manifest";
import Patch from "./patch/patch";

function MainContainer() {
  return (
    <div className="main-container">
      <Manifest />
      <Patch />
    </div>
  );
}

export default MainContainer;
