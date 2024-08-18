// src/components/Card.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";

interface CardProps {
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  containerStyle,
  titleStyle,
  children,
}) => {
  return (
    <View style={[styles.card, containerStyle]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <View>
        <Text style={styles.content}>{children}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFFFF" /* white */,
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
    // iOS Shadow
    shadowColor: "#171a1f",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 2, // Combining both shadows

    // Android Shadow (elevation)
    elevation: 3,
  },
  title: {
    fontFamily: "Mulish" /* Body */,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: 700,
    color: "#171A1FFF" /* neutral-900 */,
  },
  content: {
    fontFamily: "Mulish" /* Body */,
    fontSize: 12,
    lineHeight: 20,
    fontWeight: 400,
    color: "#9095A1FF" /* neutral-900 */,
  },
});

export default Card;
