import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { OPENWEATHER_API_KEY } from "../../constants/api";

const screenWidth = Dimensions.get("window").width;

// Habilitar animaciones en Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SearchScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Animar la aparición o desaparición del resultado/error
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [weather, error]);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Por favor, ingresa una ciudad para buscar.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);
    Keyboard.dismiss();

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=es`
      );
      setWeather(response.data);
    } catch (err) {
      setError("Ciudad no encontrada ❌");
    } finally {
      setLoading(false);
    }
  };

  const iconUrl = weather
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
    : "";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient colors={["#3a7bd5", "#00d2ff"]} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.content}
        >
          <Text style={styles.title}>Buscar clima por ciudad</Text>

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Ejemplo: Ciudad de México"
              placeholderTextColor="#ccc"
              value={city}
              onChangeText={(text) => {
                setCity(text);
                if (error) setError("");
              }}
              style={styles.input}
              returnKeyType="search"
              onSubmitEditing={fetchWeather}
              accessibilityLabel="Campo para ingresar ciudad"
              autoCorrect={false}
              autoCapitalize="words"
              clearButtonMode="while-editing"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={fetchWeather}
              accessibilityRole="button"
              accessibilityLabel="Buscar clima"
            >
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{ marginTop: 20 }}
              accessibilityLabel="Cargando clima"
            />
          )}

          {!!error && !loading && (
            <Text
              style={styles.error}
              accessibilityLiveRegion="polite"
              accessibilityRole="alert"
            >
              {error}
            </Text>
          )}

          {weather && !loading && (
            <View style={styles.card}>
              <Text
                style={styles.city}
                accessibilityLabel={`Ciudad: ${weather.name}`}
              >
                {weather.name}, {weather.sys.country}
              </Text>
              <Image source={{ uri: iconUrl }} style={styles.icon} />
              <Text
                style={styles.temp}
                accessibilityLabel={`Temperatura actual: ${weather.main.temp.toFixed(
                  1
                )} grados Celsius`}
              >
                {weather.main.temp.toFixed(1)}°C
              </Text>
              <Text
                style={styles.desc}
                accessibilityLabel={`Condición: ${weather.weather[0].description}`}
              >
                {weather.weather[0].description}
              </Text>

              <View style={styles.detailsPanel}>
                <Text style={styles.detail}>
                  🌡️ Mín: {weather.main.temp_min}°C / Máx:{" "}
                  {weather.main.temp_max}°C
                </Text>
                <Text style={styles.detail}>
                  💧 Humedad: {weather.main.humidity}%
                </Text>
                <Text style={styles.detail}>
                  💨 Viento: {weather.wind.speed} m/s
                </Text>
                <Text style={styles.detail}>
                  🥵 Sensación: {weather.main.feels_like}°C
                </Text>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingTop: 80,
    alignItems: "center",
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    width: "100%",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: "#ffffff33",
    borderRadius: 15,
    padding: 12,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2980b9",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  error: {
    color: "#ffdddd",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 25,
    borderRadius: 30,
    alignItems: "center",
    width: screenWidth * 0.85,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  city: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  temp: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  desc: {
    fontSize: 18,
    color: "#f1f1f1",
    textTransform: "capitalize",
    marginVertical: 8,
  },
  icon: {
    width: 100,
    height: 100,
  },
  detailsPanel: {
    marginTop: 15,
    width: "100%",
  },
  detail: {
    fontSize: 16,
    color: "#f0f0f0",
    marginBottom: 6,
  },
});
