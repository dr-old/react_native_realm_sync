import React, { useCallback, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { BSON } from "realm";
import { useRealm } from "@realm/react";
import NavigationService from "../../helper/NavigationService";
import { showToast } from "../../utils";

function TaskCreateScreen(): JSX.Element {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const realm = useRealm();

  const handleChangeText = (key: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  const addTask = useCallback(
    (data: any) => {
      try {
        realm.write(() => {
          realm.create("Task", {
            _id: new BSON.ObjectId(),
            title: data.title,
            description: data.description,
            isComplete: false,
            createdAt: new Date(),
            userId: "danni",
          });
        });
        showToast("Task created successfully");
        NavigationService.pop();
      } catch (error: any) {
        showToast("Failed to created task: " + error?.message);
      }
    },
    [realm]
  );

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
          Task Create
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
        onPress={() => addTask(formData)}>
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

export default TaskCreateScreen;
