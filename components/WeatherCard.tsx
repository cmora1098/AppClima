// components/WeatherCard.tsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function WeatherCard({ data }: { data: any }) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

  return (
    <View style={styles.card}>
      <Text style={styles.city}>{data.name}</Text>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <Text style={styles.temp}>{data.main.temp.toFixed(1)}°C</Text>
      <Text style={styles.desc}>{data.weather[0].description}</Text>

      <View style={styles.details}>
        <Text style={styles.detail}>
          🌡️ Mín: {data.main.temp_min}° / Máx: {data.main.temp_max}°
        </Text>
        <Text style={styles.detail}>💧 Humedad: {data.main.humidity}%</Text>
        <Text style={styles.detail}>💨 Viento: {data.wind.speed} m/s</Text>
        <Text style={styles.detail}>
          🥵 Sensación: {data.main.feels_like}°C
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffffdd",
    padding: 20,
    borderRadius: 24,
    alignItems: "center",
    width: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  city: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  temp: {
    fontSize: 48,
    fontWeight: "600",
    color: "#222",
  },
  desc: {
    fontSize: 20,
    textTransform: "capitalize",
    color: "#555",
  },
  icon: {
    width: 100,
    height: 100,
  },
  details: {
    marginTop: 10,
    alignItems: "flex-start",
    width: "100%",
  },
  detail: {
    fontSize: 16,
    color: "#444",
    marginTop: 4,
  },
});
