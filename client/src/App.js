import ChatWindow from "./components/chat-window/chat-window";

import { CssBaseline } from "@material-ui/core";

function App() {
  return (
    <>
      <CssBaseline />
      <div className="App">
        <ChatWindow />
      </div>
    </>
  );
}

export default App;
