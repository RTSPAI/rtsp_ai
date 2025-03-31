// TODO: Improve complexity of each exercise to take into account multiple angles.
// TODO: At the same time, ensure that there is some leniency if some angles are not found.

const FLAGS_THRESHOLD = 50;

// Function to return flag messages that exceed the determined threshold
export function getTriggeredFlags(flags_dict) {
    'worklet';
    let valid_flags = [];
    Object.keys(flags_dict).forEach(flag => {
        let f = flags_dict[flag];
        if (f["count"] > FLAGS_THRESHOLD) {
            valid_flags.push(f["message"]);
        }
    });
    return valid_flags;
}

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

    // Analyze exercise flags based on user's posture
    // Elbow Angle Flag
    if (!Object.keys(flags_dict.value).includes("ElbowsFlag")) {
        flags_dict.value["ElbowsFlag"] = {"count": 100000, "message": "Make sure to fully extend your arms at the end of the repetition", "max_angle": 0};
    }
    if (currentStage.value === "up") {
        const currMax = flags_dict.value["ElbowsFlag"]["max_angle"];
        const highestElbowAngle = Math.max(angles_dict["LeftElbow"], angles_dict["RightElbow"]);
        flags_dict.value["ElbowsFlag"]["max_angle"] = Math.max(currMax, highestElbowAngle);

        if (flags_dict.value["ElbowsFlag"]["max_angle"] > 160) { 
            flags_dict.value["ElbowsFlag"]["count"] = 0;
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

    if (!Object.keys(flags_dict.value).includes("KneesFlag")) {
        flags_dict.value["KneesFlag"] = {"count": 100000, "message": "Make sure to do your best to break 90 degrees with your knees", "min_angle": 180};
    }
    if (currentStage.value === "down") {
        const currMin = flags_dict.value["KneesFlag"]["min_angle"];
        const lowestKneeAngle = Math.min(angles_dict["LeftKnee"], angles_dict["RightKnee"]);
        flags_dict.value["KneesFlag"]["min_angle"] = Math.min(currMin, lowestKneeAngle);

        if (flags_dict.value["KneesFlag"]["min_angle"] < 70) { 
            flags_dict.value["KneesFlag"]["count"] = 0;
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
