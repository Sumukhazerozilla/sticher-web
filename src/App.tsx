import UploadView from "./components/UploadView";
import SticherView from "./components/SticherView";
import useSticherStore from "./store/sticherStore";

const App = () => {
  const activeScreen = useSticherStore((state) => state.activeScreen);

  return activeScreen === "upload" ? <UploadView /> : <SticherView />;
};

export default App;
