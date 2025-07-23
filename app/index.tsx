import { ImageBackground, StyleSheet, Text } from "react-native";

export default function Index() {

  return (
    <>
    <ImageBackground
      source={{ uri: 'https://pbs.twimg.com/media/GwfalhYWAAAKgqv?format=jpg&name=large' }}
      style={styles.container}
      resizeMode="cover"
    >
      <Text style={styles.logintext}>LOGIN</Text>
      
    </ImageBackground>
    </>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    //! 边框
    borderWidth: 1,
    borderColor: "black",
    //! 圆角
    borderRadius: 10,
  },
  logintext: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    
  },
});
