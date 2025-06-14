// app/tabs/hourly.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import { LinearGradient } from "expo-linear-gradient";
import { OPENWEATHER_API_KEY } from "../../constants/api";

const { width } = Dimensions.get("window");

export default function HourlyScreen() {
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHourlyWeather = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Activa los permisos de ubicación.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
      );

      setHourlyData(response.data.list.slice(0, 12));
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo obtener el pronóstico por hora.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHourlyWeather();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={["#00c6fb", "#005bea"]} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loading}>Cargando...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#00c6fb", "#005bea"]} style={styles.container}>
      <Text style={styles.title}>🌤 Pronóstico por Hora</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {hourlyData.map((hour, index) => {
          const time = moment(hour.dt_txt).format("HH:mm");
          const icon = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@4x.png`;
          const temp = hour.main.temp.toFixed(1);
          const desc = hour.weather[0].description;

          return (
            <View key={index} style={styles.card}>
              <Text style={styles.hour}>{time}</Text>
              <Image source={{ uri: icon }} style={styles.icon} />
              <Text style={styles.temp}>{temp}°C</Text>
              <Text style={styles.desc}>{desc}</Text>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  loading: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
  },
  scroll: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    marginRight: 14,
    width: width * 0.28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  hour: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 8,
    fontWeight: "500",
  },
  icon: {
    width: 64,
    height: 64,
  },
  temp: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    marginTop: 8,
  },
  desc: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 6,
    textAlign: "center",
    textTransform: "capitalize",
  },
});
