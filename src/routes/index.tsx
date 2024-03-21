import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import NavigationService from "../helper/NavigationService";
import AuthStack from "./AuthStack";

const Routes: React.FC = () => {
  return (
    <NavigationContainer ref={(r) => NavigationService.setInstance(r)}>
      <AuthStack />
    </NavigationContainer>
  );
};

export default Routes;
