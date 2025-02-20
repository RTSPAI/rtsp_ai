// Push-up movement thresholds below
// TODO: Add hip/shoulder angles
// TODO: Add squat logic

// Function to detect if a push-up has been completed and return the updated stage
export function pushup(angles_dict, currentStage, currentRep) {
    'worklet';
    const leftElbowAngle = angles_dict['LeftElbow'];
    const rightElbowAngle = angles_dict['RightElbow'];

    // 90 degrees is the current threshold to see if someone went down
    // 130 degrees is the current threshold to see if someone comes back up
    if (leftElbowAngle < 90 && rightElbowAngle < 90) {
        if (currentStage.value !== 'down') {
            currentStage.value = 'down';
        }
    } 
    else if (leftElbowAngle > 130 && rightElbowAngle > 130) {
        if (currentStage.value === 'down') {
            currentStage.value = 'up';
            currentRep.value += 1;
        }
  }
}

export function squat(angles_dict, currentStage, currentRep) {
  // Implement similar logic for squat tracking
}
