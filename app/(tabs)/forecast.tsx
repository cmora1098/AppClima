// app/tabs/forecast.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import "moment/locale/es";
import { OPENWEATHER_API_KEY } from "../../constants/api";

moment.locale("es");

export default function ForecastScreen() {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getForecast = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Activa los permisos de ubicación.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
      );

      const dailyForecast = response.data.list.filter((item: any) =>
        item.dt_txt.includes("12:00:00")
      );

      setForecast(dailyForecast);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo cargar el pronóstico.");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getForecast();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await getForecast();
      setLoading(false);
    };
    load();
  }, []);

  const getCardBackground = (main: string) => {
    switch (main) {
      case "Rain":
        return "rgba(0,0,50,0.25)";
      case "Clear":
        return "rgba(255,215,0,0.25)";
      case "Clouds":
        return "rgba(150,150,150,0.25)";
      default:
        return "rgba(255,255,255,0.15)";
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={["#3a7bd5", "#00d2ff"]} style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Cargando pronóstico...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#3a7bd5", "#00d2ff"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#fff"]}
            tintColor="#fff"
          />
        }
      >
        {forecast.map((item, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: getCardBackground(item.weather[0].main) },
            ]}
          >
            <View style={styles.row}>
              <Text style={styles.date}>
                {moment(item.dt_txt).format("dddd D [de] MMMM")}
              </Text>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                }}
                style={styles.icon}
              />
            </View>
            <Text style={styles.desc}>{item.weather[0].description}</Text>
            <Text style={styles.temp}>
              🌡️ {item.main.temp_max.toFixed(0)}° /{" "}
              {item.main.temp_min.toFixed(0)}°
            </Text>
            <Text style={styles.info}>
              💧 {item.main.humidity}% 💨 {item.wind.speed} m/s
            </Text>
          </View>
        ))}
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
  card: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
  },
  icon: {
    width: 50,
    height: 50,
  },
  desc: {
    color: "#f0f0f0",
    fontSize: 16,
    marginTop: 4,
    textTransform: "capitalize",
  },
  temp: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 6,
  },
  info: {
    color: "#e0e0e0",
    fontSize: 14,
    marginTop: 4,
  },
});
