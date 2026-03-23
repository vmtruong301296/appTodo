import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: { display: "none" },
			}}
		>
			<Tabs.Screen name="newitems" />
			<Tabs.Screen name="products" options={{ href: null }} />
			<Tabs.Screen name="orders" options={{ href: null }} />
			<Tabs.Screen name="profile" options={{ href: null }} />
		</Tabs>
	);
}
