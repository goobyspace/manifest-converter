import StateContext from "./state/stateContext";
import { reducer } from "./state/reducers";
import Header from "./components/header/header";
import { useReducer, useState } from "react";
import MainContainer from "./components/converter/maincontainer";
import Combiner from "./components/combiner/combiner";
import TabsContainer from "./components/tabs/tabscontainer";
import TabWindow from "./components/tabs/tabwindow";
import "./App.css";

function App() {
  const tabs = ["Manifest Converter", "Patch Combiner"];
  const descriptions = [
    "Upload (multiple) manifest.json files from wow.export on the left, copy or save the combined patch.json from the right.",
    "Upload multiple patch.json files with the upload button on the left, download a combined version with the download button on the right.",
  ];

  const [selectedTab, setSelectedTab] = useState(0);

  const onChange = (tab: number) => {
    setSelectedTab(tab);
  };

  const initialState = {
    error: "",
    manifests: [],
    patches: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <StateContext.Provider value={{ state, dispatch }}>
        <Header
          title={tabs[selectedTab]}
          description={descriptions[selectedTab]}
        />
        <TabsContainer
          tabs={["Manifest Converter", "Patch Combiner"]}
          selected={selectedTab}
          onChange={onChange}
        />
        <TabWindow selected={selectedTab} tab={0}>
          <MainContainer />
        </TabWindow>
        <TabWindow selected={selectedTab} tab={1}>
          <Combiner />
        </TabWindow>
      </StateContext.Provider>
    </>
  );
}

export default App;
