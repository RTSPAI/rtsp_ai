import VisionCamera
import MLKit

@objc(PoseFrameProcessorPlugin)
public class PoseFrameProcessorPlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }
  
  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    // Create an instance of PoseDetector
    let options = PoseDetectorOptions() // or AccuratePoseDetectorOptions()
    options.detectorMode = .stream
    let poseDetector = PoseDetector.poseDetector(options: options)
    
    // Prepare the input image
    let visionImage = VisionImage(buffer: frame.buffer)
    visionImage.orientation = frame.orientation
    
    do {
      let poses = try poseDetector.results(in: visionImage)
      var poseData: [[String: Any]] = []
      
      for pose in poses {
        var landmarks: [String: [String: Any]] = [:]
        for landmark in pose.landmarks {
          let position = landmark.position
          landmarks[landmark.type.rawValue] = [
            "x": position.x,
            "y": position.y,
            "z": position.z,
            "confidence": landmark.inFrameLikelihood
          ]
        }
        poseData.append(["landmarks": landmarks])
      }
      
      return poseData.isEmpty ? [] : poseData[0]["landmarks"]
    } catch {
      print("Failed to detect poses: \(error)")
      return nil
    }
  }
  
}
