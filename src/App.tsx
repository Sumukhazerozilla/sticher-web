import { useState } from "react";
import { ActiveScreenType } from "./types/common";
import UploadView from "./components/UploadView";
import SticherView from "./components/SticherView";

const App = () => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreenType>("upload");

  return activeScreen === "upload" ? <UploadView /> : <SticherView />;
};

export default App;
