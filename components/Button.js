import React from "react";
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";

function Button(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style, props.disabled ? styles.disabled : null]} disabled={props.isLoading || props.disabled} onPress={props.onPress}>
      {props.isLoading ? <ActivityIndicator size="small" color={props.style.loadingColor ? props.style.loadingColor : "#fff"} animating/> : <Text style={{color: props.style.color || "#EEEBDD", fontSize: props.style.fontSize || 28, fontWeight: 900, marginLeft: 20, marginRight: 20}}>{props.title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabled: {
    backgroundColor: "rgba(120,120,120,0.7)",
  },
});

export default Button;