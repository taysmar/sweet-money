import React from "react";
import { Text, TextProps } from "react-native";

const AppText = ({ style, ...props }: TextProps) => {
    return <Text style={[{ fontFamily: "Onest-Regular", fontSize: 18, color: "#333" }, style]} {...props} />;
};

export default AppText;
