import React from "react";

import { NotesProvider } from "./context/NotesContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <AppRoutes />
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;