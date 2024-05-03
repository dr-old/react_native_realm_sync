import { RealmProvider, useApp } from "@realm/react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import Realm, { ClientResetMode, SyncError } from "realm";
import App from "./App";
import { useEffect } from "react";
import { Task } from "../models/Task";
import constant from "./utils/Constant";
import "react-native-get-random-values";
import { logger } from "./utils/Logger";

Realm.flags.THROW_ON_GLOBAL_REALM = true;
Realm.setLogLevel("error");
Realm.setLogger((logLevel, message) => {
  const formattedMessage = `Log level: ${logLevel} - Log message: ${message}`;
  if (logLevel === "error" || logLevel === "fatal") {
    logger.error(formattedMessage);
  } else {
    logger.info(formattedMessage);
  }
});

function RealmWrapper(): JSX.Element {
  const app = useApp();
  const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
    type: Realm.OpenRealmBehaviorType.OpenImmediately,
  };

  useEffect(() => {
    const login = async () => {
      const credetials = Realm.Credentials.apiKey(constant.REALM_API_KEY);
      await app.logIn(credetials);
    };
    login();
  }, [app]);

  function handleSyncError(session: any, error: SyncError): void {
    logger.error(error);
  }

  function handlePreClientReset(localRealm: Realm): void {
    logger.info("Initiating client reset...");
  }

  /**
   * The post-client reset listener - Will be invoked after a client reset.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  function handlePostClientReset(localRealm: Realm, remoteRealm: Realm): void {
    logger.info("Client has been reset.");
  }

  const LoadingIndicator = () => {
    return (
      <View style={styles.activityContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RealmProvider
        schema={[Task]}
        sync={{
          flexible: true,
          initialSubscriptions: {
            update: (mutableSubs, realm) =>
              mutableSubs.add(realm.objects(Task), { name: "myTasks" }),
            rerunOnOpen: true,
          },
          clientReset: {
            mode: ClientResetMode.RecoverOrDiscardUnsyncedChanges,
            onBefore: handlePreClientReset,
            onAfter: handlePostClientReset,
          },
          onError: handleSyncError,
          newRealmFileBehavior: realmAccessBehavior,
          existingRealmFileBehavior: realmAccessBehavior,
          // newRealmFileBehavior: {
          //   type: OpenRealmBehaviorType.DownloadBeforeOpen,
          // },
          // existingRealmFileBehavior: {
          //   type: OpenRealmBehaviorType.OpenImmediately,
          // },
        }}
        fallback={LoadingIndicator}>
        <App />
      </RealmProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default RealmWrapper;
