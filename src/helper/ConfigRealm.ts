import Realm from "realm";

const ConfigRealm = async () => {
  const app = new Realm.App({ id: "devicesync-dehqp" });

  // Log in with the API key
  const apiKey =
    "dqR7GRrNAxsbbFeymH1zTcIdBVHMSQlyPk22o2U8s9PfecjqnM4TCBCL3Yjmggk9";
  const credentials = Realm.Credentials.apiKey(apiKey);

  try {
    const user = await app.logIn(credentials);
    console.log("Logged in successfully:", user);
    // Perform actions after successful authentication
  } catch (error) {
    console.error("Failed to log in:", error);
    // Handle authentication failure
  }
};

// const realm = ConfigRealm();

export default ConfigRealm;
