import { BrowserRouter } from "react-router-dom";
import { MobileShell } from "@/components/layout/MobileShell";
import { ToastHost } from "@/components/ToastHost";
import { AppRouter } from "@/routes/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <MobileShell>
        <AppRouter />
        <ToastHost />
      </MobileShell>
    </BrowserRouter>
  );
}

export default App;
