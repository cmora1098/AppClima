// app/tabs/index.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { OPENWEATHER_API_KEY } from "../../constants/api";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getWeather = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Activa los permisos de ubicación.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
      );

      setWeather(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo obtener el clima.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={["#3a7bd5", "#00d2ff"]} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Cargando clima...</Text>
      </LinearGradient>
    );
  }

  if (!weather) {
    return (
      <LinearGradient colors={["#3a7bd5", "#00d2ff"]} style={styles.container}>
        <Text style={styles.errorText}>No se pudo cargar el clima.</Text>
      </LinearGradient>
    );
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;

  return (
    <LinearGradient colors={["#3a7bd5", "#00d2ff"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.city}>{weather.name}</Text>
          <Image source={{ uri: iconUrl }} style={styles.icon} />
          <Text style={styles.temp}>{weather.main.temp.toFixed(1)}°C</Text>
          <Text style={styles.desc}>{weather.weather[0].description}</Text>
        </View>

        <View style={styles.detailsPanel}>
          <Text style={styles.detail}>
            🌡️ Mín: {weather.main.temp_min}°C / Máx: {weather.main.temp_max}°C
          </Text>
          <Text style={styles.detail}>
            💧 Humedad: {weather.main.humidity}%
          </Text>
          <Text style={styles.detail}>💨 Viento: {weather.wind.speed} m/s</Text>
          <Text style={styles.detail}>
            🥵 Sensación: {weather.main.feels_like}°C
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 30,
    borderRadius: 30,
    alignItems: "center",
    width: screenWidth * 0.85,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  city: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  temp: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 8,
  },
  desc: {
    fontSize: 20,
    textTransform: "capitalize",
    color: "#f1f1f1",
  },
  icon: {
    width: 120,
    height: 120,
  },
  detailsPanel: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 20,
    width: screenWidth * 0.85,
  },
  detail: {
    fontSize: 16,
    color: "#f0f0f0",
    marginBottom: 8,
  },
});
