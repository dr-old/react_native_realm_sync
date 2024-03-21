/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import "react-native-get-random-values";
import { Task } from "./models/Task";
import { BSON } from "realm";
import { useQuery, useRealm } from "@realm/react";

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

  useEffect(() => {
    realm.subscriptions.update((mutableSubs) => {
      mutableSubs.add(realm.objects(Task));
    });
  }, [realm]);

  console.log("render", JSON.stringify(tasks));

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              paddingBottom: 10,
              paddingHorizontal: 15,
              borderRadius: 10,
              marginBottom: 10,
              borderBottomWidth: 1,
              borderColor: "#ddd",
            }}>
            <Text style={{ fontSize: 15, fontWeight: 700 }}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "yellow",
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 10,
          marginVertical: 20,
        }}
        onPress={addTask}>
        <Text>{"New Task"}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;
