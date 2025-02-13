import React, { useState } from "react";
import { 
    View, Text, StyleSheet, FlatList, Pressable, TextInput
} from "react-native";

const EXERCISES = [
    { "id": "0", "title": "Pull Ups" },
    { "id": "1", "title": "Push Ups" },
    { "id": "2", "title": "Squats" },
    { "id": "3", "title": "Auto Detect" }
];

const Item = ({ title, onPress }) => (
    <Pressable style={styles.item} onPress={onPress}>
        <Text style={styles.itemText}>{title}</Text>
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
        <Item title={item.title} onPress={() => navigateTo(item.title)} />
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search exercises..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={handleSearch}
            />
            <FlatList
                data={filteredExercises}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No exercises found</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 10,
        backgroundColor: "#555555",
        height: 500,
    },
    searchBar: {
        backgroundColor: "#ffffff",
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 10,
    },
    item: {
        backgroundColor: "#66ff66",
        padding: 15,
        marginVertical: 8,
        borderRadius: 5,
    },
    itemText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    emptyText: {
        color: "#fff",
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
});

export default ExerciseList;
