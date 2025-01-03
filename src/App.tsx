import RoutesContainer from "./routes/RoutesContainer";
import "./App.css";
import "leaflet/dist/leaflet.css";
function App() {
    return <RoutesContainer isLoadingData={false} />;
}

export default App;
