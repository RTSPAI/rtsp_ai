import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';

const EXERCISES = [
    {
        "id": "0",
        "title": "Pull Ups"
    },
    {
        "id": "1",
        "title": "Push Ups"
    },
    {
        "id": "2",
        "title": "Squats"
    },
    {
        "id": "3",
        "title": "Auto Detect"
    }
]

const Item = ({ title, onPress }) => (
    <Pressable style={styles.item} onPress={onPress}>
        <Text>{title}</Text>
    </Pressable>
);

const ExerciseList = ({ navigation }) => {
    const navigateTo = (navigation, exercise) => {
        if (exercise === "Auto Detect") {
            navigation.navigate("Warmup");
        } else {
            navigation.navigate("Camera", { "exercise" : exercise });
        }
    }
    
    const renderItem = ({ item }) => <Item title={item.title} onPress={() => navigateTo(navigation, item.title)}/>;

    return (
        <View style={styles.container}>
            <FlatList
                data={EXERCISES}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 2,
        backgroundColor: "#555555",
        height: 300,
    },
    item: {
        backgroundColor: "#66ff66",
        padding: 15,
        marginVertical: 8,
        fontSize: 32
    },
});

export default ExerciseList;
