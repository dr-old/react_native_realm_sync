import React, { useCallback, useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Realm, BSON } from "realm";
import { useRealm } from "@realm/react";
import { showToast } from "../../utils";
import { Task } from "../../../models/Task";
import NavigationService from "../../helper/NavigationService";

function TaskUpdateScreen({ route }: any): JSX.Element {
  const { itemId } = route.params;
  const objectId = new BSON.ObjectId(itemId);
  const realm = useRealm();
  const [isMounted, setMounted] = useState(true);
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
  });

  const handleChangeText = (key: string, value: string) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

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
          NavigationService.pop();
        } catch (error: any) {
          showToast("Failed to updated task: " + error?.message);
        }
      });
    },
    [realm]
  );

  useEffect(() => {
    if (isMounted) {
      realm.write(() => {
        const taskToItem = realm
          .objects<Task>("Task")
          .find((task) => task._id.equals(objectId));
        if (taskToItem) {
          setFormData({
            title: taskToItem?.title,
            description: taskToItem?.description,
          });
        }
      });
    }

    return () => {
      setMounted(false);
    };
  }, [realm, objectId, isMounted, setMounted]);

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
          Task Update
        </Text>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <TextInput
          style={{
            height: 40,
            borderColor: "#eee",
            borderBottomWidth: 1,
            marginBottom: 10,
            color: "#000",
          }}
          placeholder="Title"
          value={formData.title}
          onChangeText={(text) => handleChangeText("title", text)}
        />
        <TextInput
          style={{
            height: 40,
            borderColor: "#eee",
            borderBottomWidth: 1,
            marginBottom: 10,
            color: "#000",
          }}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) => handleChangeText("description", text)}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#a39193",
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 10,
          marginVertical: 20,
          marginHorizontal: 20,
        }}
        onPress={() => updateTask(itemId, formData)}>
        <Text
          style={{
            color: "#fff",
            fontWeight: "700",
            textAlign: "center",
            fontSize: 20,
          }}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default TaskUpdateScreen;
