import React, { useCallback, useEffect } from "react";
import {
  Alert,
  FlatList,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import { BSON } from "realm";
import { useQuery, useRealm } from "@realm/react";
import { Task } from "../../../models/Task";
import NavigationService from "../../helper/NavigationService";

const showToast = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};

function TaskScreen(): JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);

  const deleteTask = useCallback(
    (taskId: BSON.ObjectId) => {
      try {
        realm.write(() => {
          const taskToDelete = realm
            .objects<Task>("Task")
            .find((task) => task._id.equals(taskId));

          realm.delete(taskToDelete);
        });
        showToast("Task deleted successfully");
      } catch (error: any) {
        showToast("Failed to delete task: " + error?.message);
      }
    },
    [realm]
  );

  const deleteAlert = (taskId: BSON.ObjectId) =>
    Alert.alert("Attention", "Are you sure you want to delete this data?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Delete", onPress: () => deleteTask(taskId) },
    ]);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(realm.objects(Task));
    });
  }, [realm]);

  return (
    <View style={{ flex: 1, paddingTop: 20, backgroundColor: "#fff" }}>
      <View
        style={{
          marginHorizontal: 20,
          paddingBottom: 10,
          marginBottom: 20,
          borderBottomWidth: 1,
          borderColor: "#f6e0b5",
        }}>
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#aa6f73" }}>
          Task List
        </Text>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginBottom: 10,
              borderRadius: 10,
              backgroundColor: "#f6e0b5",
              flexDirection: "row",
              marginHorizontal: 20,
              height: 80,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                marginRight: 10,
              }}>
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                {item.title}
              </Text>
              <Text
                style={{ fontSize: 12, fontWeight: "400" }}
                numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#aa6f73",
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  borderRadius: 4,
                  marginBottom: 5,
                  alignItems: "center",
                }}
                onPress={() => deleteAlert(item._id)}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#eea990",
                  paddingHorizontal: 5,
                  paddingVertical: 3,
                  borderRadius: 4,
                  alignItems: "center",
                }}
                onPress={() =>
                  NavigationService.push("TaskUpdateScreen", {
                    itemId: item._id?.toHexString(),
                  })
                }>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#a39193",
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 10,
          marginVertical: 20,
          marginHorizontal: 20,
        }}
        onPress={() => NavigationService.push("TaskCreateScreen")}>
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            textAlign: "center",
            fontSize: 20,
          }}>
          New Task
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default TaskScreen;
