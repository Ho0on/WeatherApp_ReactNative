import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "3d21a9759f9e5dd9eea9b47b5739eb4a";

const icons = {
	Clouds: "cloudy",
	Clear: "day-sunny",
	Snow: "snow",
	Rain: "rains",
	Drizzle: "rain",
	Thunderstorm: "lightning",
};

export default function App() {
	const [city, setCity] = useState("Loading...");
	const [days, setDays] = useState([]);
	const [ok, setOk] = useState(true);

	const ask = async () => {
		const { granted } = await Location.requestForegroundPermissionsAsync();
		if (!granted) {
			setOk(false);
		}
		const {
			coords: { latitude, longitude },
		} = await Location.getCurrentPositionAsync({ accuracy: 5 });
		const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
		setCity(location[0].city);

		const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);

		const json = await response.json();
		setDays(json.daily);
	};

	useEffect(() => {
		ask();
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.city}>
				<Text style={styles.cityName}>{city}</Text>
			</View>
			<ScrollView pagingEnabled showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.weather}>
				{days.length === 0 ? (
					<View style={{ ...styles.day, alignItems: "center" }}>
						<ActivityIndicator color="white" size="large" style={{ marginTop: 10 }} />
					</View>
				) : (
					days.map((day, index) => {
						return (
							<View key={index} style={styles.day}>
								<View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
									<Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
									<Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
								</View>
								<Text style={styles.description}>{day.weather[0].main}</Text>
								<Text style={styles.tinyText}>{day.weather[0].description}</Text>
							</View>
						);
					})
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "tomato",
	},
	city: {
		flex: 1.2,
		justifyContent: "center",
		alignItems: "center",
	},
	cityName: {
		fontSize: 48,
		fontWeight: "500",
		color: "white",
	},
	weather: {},
	day: {
		width: SCREEN_WIDTH,
		// alignItems: "center",
		paddingHorizontal: 20,
	},
	temp: {
		marginTop: 50,
		fontWeight: "600",
		fontSize: 100,
		color: "white",
	},
	description: {
		marginTop: -10,
		fontSize: 30,
		color: "white",
	},
	tinyText: {
		fontSize: 30,
		color: "white",
	},
});
