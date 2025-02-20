import { Skia, PaintStyle, matchFont } from '@shopify/react-native-skia';

// Function to calculate angles between three points
// TODO: Utilize 3D angles
export function calculateAngle(a, b, c) {
	'worklet';
	if (a == undefined || b == undefined || c == undefined)
		return -1;

	// Define angles as arrays and calculate using atan2 for 2D
	a = [a['x'], a['y']];
	b = [b['x'], b['y']];
	c = [c['x'], c['y']];
	let radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);

	// Convert radians to degrees
	let angle = Math.abs(radians * 180.0 / Math.PI);

	// Ensure angle is between 0 and 180 degrees
	if (angle > 180.0)
		angle = 360 - angle;

	return angle;
}

// Function to compute primary angles (exercises include: pushups, pullups, squats)
// TODO: Investigate camera inverting with front-camera
export function computeAngles(landmarks) {
	'worklet';
	if (landmarks.length == 0) return {};
	let angles = {};

	angles["LeftElbow"] = calculateAngle(landmarks["LeftWrist"], landmarks["LeftElbow"], landmarks["LeftShoulder"]);
	angles["RightElbow"] = calculateAngle(landmarks["RightWrist"], landmarks["RightElbow"], landmarks["RightShoulder"]);
	angles["LeftKnee"] = calculateAngle(landmarks["LeftHip"], landmarks["LeftKnee"], landmarks["LeftAnkle"]);
	angles["RightKnee"] = calculateAngle(landmarks["RightHip"], landmarks["RightKnee"], landmarks["RightAnkle"]);
	angles["LeftHip"] = calculateAngle(landmarks["LeftShoulder"], landmarks["LeftHip"], landmarks["LeftKnee"]);
	angles["RightHip"] = calculateAngle(landmarks["RightShoulder"], landmarks["RightHip"], landmarks["RightKnee"]);

	return angles;
}

// Remove unnecessary landmarks from our data
export function computeLandmarks(data) {
    'worklet'
    let landmarks = data;
    delete landmarks['LeftEar'];
    delete landmarks['LeftEye'];
    delete landmarks['LeftEyeInner'];
    delete landmarks['LeftEyeOuter'];
    delete landmarks['LeftHeel'];
    delete landmarks['LeftIndexFinger'];
    delete landmarks['LeftPinkyFinger'];
    delete landmarks['LeftThumb'];
    delete landmarks['LeftToe'];
    delete landmarks['MouthLeft'];
    delete landmarks['MouthRight'];
    delete landmarks['Nose'];
    delete landmarks['RightEar'];
    delete landmarks['RightEar'];
    delete landmarks['RightEye'];
    delete landmarks['RightEyeInner'];
    delete landmarks['RightEyeOuter'];
    delete landmarks['RightHeel'];
    delete landmarks['RightIndexFinger'];
    delete landmarks['RightPinkyFinger'];
    delete landmarks['RightThumb'];
    delete landmarks['RightToe'];
    return landmarks;
}

function drawLandmarkLine(frame, landmarks_dict, l0, l1) {
	'worklet';
	if (Object.keys(landmarks_dict).length === 0) return;

	// Frame Dimensions
	let frameWidth = frame.width;
	let frameHeight = frame.height;
	// console.log(`Frame ${frameWidth} x ${frameHeight}`)

	// Landmark Coordinates
	let x0 = landmarks_dict[l0]['x']// * Number(frameWidth);
	let y0 = landmarks_dict[l0]['y']// * Number(frameHeight);
	let x1 = landmarks_dict[l1]['x']// * Number(frameWidth);
	let y1 = landmarks_dict[l1]['y']// * Number(frameHeight);

	// Line Style
	let paint = Skia.Paint();
	paint.setStyle(PaintStyle.Fill);
	paint.setStrokeWidth(2);
	paint.setColor(Skia.Color('pink'));

	// Draw
	frame.drawLine(x0, y0, x1, y1, paint);
	// console.log(`Drawing line at (${x0}, ${y0}) | (${x1}, ${y1})`)
}

export function drawSkeleton(frame, landmarks_dict) {
	'worklet';
	drawLandmarkLine(frame, landmarks_dict, "LeftWrist", "LeftElbow");
	drawLandmarkLine(frame, landmarks_dict, "LeftElbow", "LeftShoulder");
	drawLandmarkLine(frame, landmarks_dict, "LeftShoulder", "LeftHip");
	drawLandmarkLine(frame, landmarks_dict, "LeftHip", "LeftKnee");
	drawLandmarkLine(frame, landmarks_dict, "LeftKnee", "LeftAnkle");
	drawLandmarkLine(frame, landmarks_dict, "LeftShoulder", "RightShoulder");
	drawLandmarkLine(frame, landmarks_dict, "LeftHip", "RightHip");
	drawLandmarkLine(frame, landmarks_dict, "RightShoulder", "RightHip");
	drawLandmarkLine(frame, landmarks_dict, "RightShoulder", "RightElbow");
	drawLandmarkLine(frame, landmarks_dict, "RightElbow", "RightWrist");
	drawLandmarkLine(frame, landmarks_dict, "RightHip", "RightKnee");
	drawLandmarkLine(frame, landmarks_dict, "RightKnee", "RightAnkle");
}
