import React from "react";
import { View } from "react-native";
import Routes from "./routes";

function App(): JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      {/* <ModalProvider> */}
      <Routes />
      {/* <GlobalModal />
      <Toast />
      {!!progress ? <ModalNewUpdate progress={progress} /> : null}
    </ModalProvider> */}
    </View>
  );
}

export default App;
