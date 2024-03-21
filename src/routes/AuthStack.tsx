import React = require("react");
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TaskScreen from "../screens/Task";
import TaskCreateScreen from "../screens/Task/Create";
import TaskUpdateScreen from "../screens/Task/Update";
const Stack = createNativeStackNavigator();

function AuthStack() {
  const page = [
    { name: "TaskScreen", comp: TaskScreen },
    { name: "TaskCreateScreen", comp: TaskCreateScreen },
    { name: "TaskUpdateScreen", comp: TaskUpdateScreen },
  ];

  return (
    <Stack.Navigator
      initialRouteName="TaskScreen"
      screenOptions={{
        animation: "slide_from_right",
        headerShown: false,
        gestureEnabled: true,
      }}>
      {page.map((item, index) => (
        <Stack.Screen key={index} name={item.name} component={item.comp} />
      ))}
    </Stack.Navigator>
  );
}

export default AuthStack;
