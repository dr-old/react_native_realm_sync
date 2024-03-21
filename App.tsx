import React, { useCallback, useEffect } from "react";
import {
  FlatList,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { Task } from "./models/Task";
import { Realm, BSON } from "realm";
import { useQuery, useRealm } from "@realm/react";

const showToast = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};

function App(): JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);

  const addTask = useCallback(() => {
    realm.write(() => {
      realm.create("Task", {
        _id: new BSON.ObjectId(),
        title: "Walk the dog",
        description: "Bring an umbrella",
      });
    });
  }, [realm]);

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

  const updateTask = useCallback(
    (taskId: BSON.ObjectId, updatedTask: Partial<Task>) => {
      realm.write(() => {
        try {
          const taskToUpdate = realm
            .objects<Task>("Task")
            .find((task) => task._id.equals(taskId));

          realm.create(
            "Task",
            { ...taskToUpdate, ...updatedTask },
            Realm.UpdateMode.Modified
          );
          showToast("Task updated successfully");
        } catch (error: any) {
          showToast("Failed to updated task: " + error?.message);
        }
      });
    },
    [realm]
  );

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
                onPress={() => deleteTask(item._id)}>
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
                  updateTask(item._id, {
                    title: "Updated",
                    description:
                      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
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
        onPress={addTask}>
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

export default App;
