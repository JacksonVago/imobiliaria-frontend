import { AppProvider } from "./providers/app-provider"
import { RoutesComponent } from "./routes"
import './fonts/Poppins-Black.ttf';
import './fonts/Poppins-BlackItalic.ttf';
import './fonts/Poppins-Bold.ttf';
import './fonts/Poppins-BoldItalic.ttf';
import './fonts/Poppins-ExtraBold.ttf';
import './fonts/Poppins-ExtraBoldItalic.ttf';
import './fonts/Poppins-ExtraLight.ttf';
import './fonts/Poppins-ExtraLightItalic.ttf';
import './fonts/Poppins-Italic.ttf';

function App() {
  return (
    <>
      <AppProvider>
        <RoutesComponent />
      </AppProvider>
    </>
  )
}

export default App
