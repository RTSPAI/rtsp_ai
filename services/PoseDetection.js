import { Platform } from 'react-native';
import { Skia, PaintStyle, matchFont } from '@shopify/react-native-skia';

// Export style variables for drawing on screen
const SKIA_FONT = createSkiaFont()
const SKIA_PAINT = createSkiaLandmarkPaint();

// Function to calculate angles between three points
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
	angles["LeftShoulder"] = calculateAngle(landmarks["LeftElbow"], landmarks["LeftShoulder"], landmarks["LeftHip"]);
	angles["RightShoulder"] = calculateAngle(landmarks["RightElbow"], landmarks["RightShoulder"], landmarks["RightHip"]);

	return angles;
}

// Function to remove unnecessary landmarks from our data
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

// Function to create the font for angle text on screen
function createSkiaFont() {
	const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
	const fontStyle = {
		fontFamily,
		fontSize: 54,
		fontStyle: "normal",
		fontWeight: "bold",
	};
	return matchFont(fontStyle);
}

// Function to create the paint color and style for landmarks and skeleton
function createSkiaLandmarkPaint() {
	const paint = Skia.Paint();
	paint.setStyle(PaintStyle.Fill);
	paint.setStrokeWidth(2);
	paint.setColor(Skia.Color('pink'));
	return paint;
}

// Function to draw the joint angles on screen
export function drawAngles(frame, angles_dict, landmarks_dict) {
	'worklet'
	for (const [landmark, angle] of Object.entries(angles_dict)) {
		// Ignore erroneous angles
		if (angle == undefined || angle < 0 || angle > 360)
			continue;

		// Define basic variables
		let x = landmarks_dict[landmark]['x'];
		let y = landmarks_dict[landmark]['y'];
		let text = parseInt(angle) + "°";
		let textPaint = Skia.Paint();
		textPaint.setColor(Skia.Color('white'));

		// Rotate frame for up-straight view
		frame.save();
		frame.rotate(270, x, y);

		// Draw and restore the original frame
		frame.drawText(text, x, y, textPaint, SKIA_FONT);
		frame.restore();
	}
}

// Function to draw a circle for every landmark/joint on screen
export function drawLandmarkPoints(frame, landmarks_dict) {
	'worklet'
	for (const landmark in landmarks_dict) {
		let l = landmarks_dict[landmark];
		frame.drawCircle(l['x'], l['y'], 6, SKIA_PAINT);
	}
}

// Function to draw a line between two landmarks
function drawLandmarkLine(frame, landmarks_dict, l0, l1) {
	'worklet';
	if (Object.keys(landmarks_dict).length === 0) return;
	// Landmark Coordinates
	let x0 = landmarks_dict[l0]['x'];
	let y0 = landmarks_dict[l0]['y'];
	let x1 = landmarks_dict[l1]['x'];
	let y1 = landmarks_dict[l1]['y'];

	// Draw
	frame.drawLine(x0, y0, x1, y1, SKIA_PAINT);
}

// Function to draw the user's skeleton/pose based on the landmarks
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
