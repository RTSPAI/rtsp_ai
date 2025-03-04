import { Image } from "react-native";
import React, { useState } from "react";
import { 
    View, Text, StyleSheet, FlatList, Pressable, TextInput, Dimensions
} from "react-native";

const EXERCISES = [
    { "id": "0", "title": "Pull Ups", icon: require("../assets/icons/pull-up-bar.png") },
    { "id": "1", "title": "Push Ups", icon: require("../assets/icons/push-up.png") },
    { "id": "2", "title": "Squats", icon: require("../assets/icons/squat.png") },
    { "id": "3", "title": "Auto Detect", icon: require("../assets/icons/dual-camera.png")}
];

const Item = ({ title, icon, onPress }) => (
    <Pressable 
        style={({ pressed }) => [
            styles.item,
            pressed && styles.itemPressed
        ]} 
        onPress={onPress}
    >
        <View style={styles.itemContent}>
            <View style={styles.iconContainer}>
                <Image source={icon} style={styles.imageIcon} />
            </View>
            <Text style={styles.itemText}>{title}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
    </Pressable>
);
const ExerciseList = ({ navigation }) => {
    const [searchText, setSearchText] = useState("");
    const [filteredExercises, setFilteredExercises] = useState(EXERCISES);

    const handleSearch = (text) => {
        setSearchText(text);
        setFilteredExercises(
            EXERCISES.filter((exercise) =>
                exercise.title.toLowerCase().includes(text.toLowerCase())
            )
        );
    };

    const navigateTo = (exercise) => {
        if (exercise === "Auto Detect") {
            navigation.navigate("Warmup");
        } else {
            navigation.navigate("Camera", { exercise });
        }
    };

    const renderItem = ({ item }) => (
        <Item title={item.title} icon={item.icon} onPress={() => navigateTo(item.title)} />
    );

    return (
        <View> 
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search exercises..."
                        placeholderTextColor="#A1AEB0"
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                </View>
                <FlatList
                    data={filteredExercises}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={<Text style={styles.emptyText}>No exercises found</Text>}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: width * 0.9,
        height: height * 0.5,
        backgroundColor: "#FDFDFC",
        padding: 16,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height:6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    searchContainer: {
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    searchBar: {
        backgroundColor: "#E4E4E4",
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        color: "#203B41",
    },
    listContainer: {
        paddingBottom: 16,
    },
    item: {
        backgroundColor: "#DEDEDE",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemPressed: {
        backgroundColor: "#67948A",
        transform: [{ scale: 0.98 }],
    },
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        overflow: "hidden",
    },
    icon: {
        fontSize: 20,
    },
    itemText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#203B41",
    },
    chevron: {
        fontSize: 24,
        color: "#A1AEB0",
    },
    emptyText: {
        color: "#6D8E93",
        textAlign: "center",
        marginTop: 24,
        fontSize: 16,
    },
    imageIcon: {
        width: 32,  // Adjust as needed
        height: 32,
        resizeMode: "contain",
    },
    
});

export default ExerciseList;