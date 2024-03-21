import { RealmProvider, useApp } from "@realm/react";
import { ActivityIndicator, SafeAreaView } from "react-native";
import { OpenRealmBehaviorType } from "realm";
import App from "./App";
import { useEffect, useState } from "react";
import { Task } from "./models/Task";

function RealmWrapper(): JSX.Element {
  const app = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const login = async () => {
      const credetials = Realm.Credentials.anonymous();
      await app.logIn(credetials);
      setIsLoggedIn(true);
    };
    login();
  }, [app]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoggedIn ? (
        <RealmProvider
          schema={[Task]}
          sync={{
            flexible: true,
            newRealmFileBehavior: {
              type: OpenRealmBehaviorType.DownloadBeforeOpen,
            },
            existingRealmFileBehavior: {
              type: OpenRealmBehaviorType.OpenImmediately,
            },
            onError: (session, error) => {
              // Replace this with a preferred logger in production.
              console.error(error.message);
            },
          }}>
          <App />
        </RealmProvider>
      ) : (
        <ActivityIndicator size={"large"} />
      )}
    </SafeAreaView>
  );
}

export default RealmWrapper;
