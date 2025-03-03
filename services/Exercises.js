// TODO: Improve complexity of each exercise to take into account multiple angles.
// TODO: At the same time, ensure that there is some leniency if some angles are not found.

// TODO: Implement "FLAGS" functionality to call out user mistakes, such as incorrect
// TODO: posture based on angles (overextending, incorrect form in other parts, etc)

// Function to detect if a pull-up has been completed and return the updated stage
function pullup(landmarks_dict, angles_dict, flags_dict, currentStage, currentRep) {
    'worklet';
    // Define required angles and thresholds
    const leftElbowAngle = angles_dict['LeftElbow'];
    const rightElbowAngle = angles_dict['RightElbow'];

    if (landmarks_dict["LeftElbow"]['confidence'] < .5 && landmarks_dict["RightElbow"]['confidence'] < .5 )
        return;

    // Elbow thresholds
    const E_LOW = 90;
    const E_HIGH = 130

    // 90 degrees is the current threshold to see if someone went down
    // 130 degrees is the current threshold to see if someone comes back up
    if (leftElbowAngle < E_LOW && rightElbowAngle < E_LOW) {
        if (currentStage.value !== 'down') {
            currentStage.value = 'down';
        }
    }
    else if (leftElbowAngle > E_HIGH && rightElbowAngle > E_HIGH) {
        if (currentStage.value === 'down') {
            currentStage.value = 'up';
            currentRep.value += 1;
        }
    }
}

// Function to detect if a push-up has been completed and return the updated stage
function pushup(landmarks_dict, angles_dict, flags_dict, currentStage, currentRep) {
    'worklet';
    // Define required angles and thresholds
    const leftElbowAngle = angles_dict['LeftElbow'];
    const rightElbowAngle = angles_dict['RightElbow'];

    // Elbow thresholds
    const E_LOW = 90;
    const E_HIGH = 130

    if (landmarks_dict["LeftElbow"]['confidence'] < .5 && landmarks_dict["RightElbow"]['confidence'] < .5 )
        return;


    // 90 degrees is the current threshold to see if someone went down
    // 130 degrees is the current threshold to see if someone comes back up
    if (leftElbowAngle < E_LOW && rightElbowAngle < E_LOW) {
        if (currentStage.value !== 'down') {
            currentStage.value = 'down';
        }
    }
    else if (leftElbowAngle > E_HIGH && rightElbowAngle > E_HIGH) {
        if (currentStage.value === 'down') {
            currentStage.value = 'up';
            currentRep.value += 1;
        }
    }

    // Analyze exercise flags based on user's posture
    // Hip Angle Flag
    if (angles_dict["LeftHip"] < 165 || angles_dict["RightHip"] < 165) {
        if (!Object.keys(flags_dict.value).includes("HipsFlag")) {
            flags_dict.value["HipsFlag"] = {"count": 0, "message": "Make sure to keep your hips straight"};
        }
        flags_dict.value["HipsFlag"]["count"] += 1;
    }

    // Shoulder Position Flag
    // TODO: ...

    // Knee Angle Flag
    if (angles_dict["LeftKnee"] < 150 || angles_dict["RightKnee"] < 150) {
        if (!Object.keys(flags_dict.value).includes("KneesFlag")) {
            flags_dict.value["KneesFlag"] = {"count": 0, "message": "Make sure to keep your knees straight"};
        }
        flags_dict.value["KneesFlag"]["count"] += 1;
    }
}

// Function to detect if a squat has been completed and return the updated stage
function squat(landmarks_dict, angles_dict, flags_dict, currentStage, currentRep) {
    'worklet';
    // Define required angles and thresholds
    const leftKneeAngle = angles_dict['LeftKnee'];
    const rightKneeAngle = angles_dict['RightKnee'];

    if (landmarks_dict["LeftKnee"]['confidence'] < .5 && landmarks_dict["RightKnee"]['confidence'] < .5 )
        return;

    // Knee thresholds
    const K_LOW = 100
    const K_HIGH = 130

    // 90 degrees is the current threshold to see if someone went down
    // 120 degrees is the current threshold to see if someone comes back up
    if (leftKneeAngle < K_LOW && rightKneeAngle < K_LOW) {
        if (currentStage.value !== 'down') {
            currentStage.value = 'down';
        }
    }
    else if (leftKneeAngle > K_HIGH && rightKneeAngle > K_HIGH) {
        if (currentStage.value === 'down') {
            currentStage.value = 'up';
            currentRep.value += 1;
        }
    }
}

export function exerciseAnalysis(exercise, landmarks_dict, angles_dict, flags_dict, repStage, repCount) {
    'worklet'
    if (Object.keys(landmarks_dict).length === 0) return;

    // Call exercise function and increment the repCount based on angles and repStage value
    if (exercise === "Pull Ups") {
        pullup(landmarks_dict, angles_dict, flags_dict, repStage, repCount);
    } else if (exercise === "Push Ups") {
        pushup(landmarks_dict, angles_dict, flags_dict, repStage, repCount);
    } else if (exercise === "Squats") {
        squat(landmarks_dict, angles_dict, flags_dict, repStage, repCount);
    }
}
