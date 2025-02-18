import VisionCamera
import MediaPipeTasksVision

// Class that conforms to the `PoseLandmarkerLiveStreamDelegate` protocol
class PoseLandmarkerResultProcessor: NSObject, PoseLandmarkerLiveStreamDelegate {
    var landmarks: [[String: Any]] = []

    // Delegate method called when pose landmarker finishes detection
    func poseLandmarker(
        _ poseLandmarker: PoseLandmarker,
        didFinishDetection result: PoseLandmarkerResult?,
        timestampInMilliseconds: Int,
        error: Error?
    ) {
        if let error = error {
            print("Error in pose landmarker: \(error.localizedDescription)")
            return
        }

        guard let result = result else {
            print("No result from pose landmarker")
            return
        }

        // Process the result and update landmarks
        landmarks.removeAll()
        for pose in result.landmarks {
            for landmark in pose {
                landmarks.append([
                    "x": landmark.x,
                    "y": landmark.y,
                    "z": landmark.z,
                    "visibility": landmark.visibility as Any,
                    "presence": landmark.presence as Any,
                ])
            }
        }
    }
}

@objc(PoseFrameProcessorPlugin)
public class PoseFrameProcessorPlugin: FrameProcessorPlugin {
    private var poseLandmarker: PoseLandmarker?
    private var resultProcessor: PoseLandmarkerResultProcessor?

    public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
        super.init(proxy: proxy, options: options)

        // Initialize the pose landmarker in livestream mode
        let modelPath = Bundle.main.path(forResource: "pose_landmarker_full", ofType: "task")
        let options = PoseLandmarkerOptions()
        options.baseOptions.modelAssetPath = modelPath!
        options.runningMode = .liveStream
        options.minPoseDetectionConfidence = 0.5
        options.minPosePresenceConfidence = 0.5
        options.minTrackingConfidence = 0.5
        options.numPoses = 1

        // Set up the result processor
        resultProcessor = PoseLandmarkerResultProcessor()
        options.poseLandmarkerLiveStreamDelegate = resultProcessor

        do {
            poseLandmarker = try PoseLandmarker(options: options)
        } catch {
            print("Failed to initialize pose landmarker: \(error.localizedDescription)")
        }
    }

    public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
        guard let poseLandmarker = poseLandmarker else {
            return ["error": "Pose landmarker not initialized"]
        }

        let buffer = frame.buffer
        let orientation = frame.orientation

        do {
          let image = try MPImage(sampleBuffer: buffer)
            let timestampInMilliseconds = Int(frame.timestamp * 1000) // Convert to milliseconds

            // Detect poses in the current frame
          try poseLandmarker.detectAsync(image: image, timestampInMilliseconds: timestampInMilliseconds)

            // Return the latest landmarks from the result processor
            return resultProcessor?.landmarks ?? []
        } catch {
            return ["error": error.localizedDescription]
        }
    }
}
