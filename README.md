# L17 - Real-Time Sports Analysis Performance Using AI-Driven Posture and Movement Monitoring
By Max Bagatini Alves, Gabriela L. P. Barbosa, Caleb Freckmann, Matthew Pryce, Lukas Schoenfeld, and John Trucillo.
**Sponsor**: Dr. Chen Chen

## Instructions to run app on your device (Current Version iOS only)
1. Clone the repository: `git clone https://github.com/RTSPAI/rtsp_ai`
2. Install the necessary packages: 
      -cd into project folder: run 'npm install'
      -cd into ios folder: cd ios, run 'pod install'
4. If utilizing Development Build in iOS, open the Xcode Workspace file, open the Signing & Capabilities tab, and change the team to your Apple account.
      - in ios folder, run `open rtsp.xcworkspace`
      - that will open xcode, where you need to change the team to a personal account, and change the bundle identifier
6. To run (on iOS) `npx expo run:ios --device` and select your device. If running/compiling through Xcode, make sure to run `npx expo start` through the terminal as well to ensure that the Metro server is running. \
**_Note:_** If the app installs but does not download/bundle (or crashes before opening), attempt to connect your device to your phone through a hotspot and try again (This issue happens in the UCF wifi, for example).

## Future Improvements & Roadblocks
### Additional exercise support
Currently, the app supports three exercises: squats, push-ups, and pull-ups. Adding more exercises is possible adn recommended, but each one will require custom logic to track reps and provide feedback accurately. For future expansion, developers will need to define key joint angles that determine successful repetitions, as well as thresholds for incorrect form to trigger instructional feedback. These parameters will vary per exercise and must be tailored accordingly.
### Exercise detection model inaccuracy
While a custom TFLite model for exercise classification was trained, it produced inconsistent results that could not be resolved before the final deadline. As a result, exercise detection is currently handled through manually coded logic. The original model file remains in the repository and can be revisited by future teams. We recommend retraining a new model using publicly available datasets (e.g., from Kaggle) or fine-tuning the current model using custom-labeled exercise images to improve accuracy.
### TFLite library & Injury Prev. model conflicts
The injury prevention model was developed and tested successfully on desktop environments, but integration within the mobile app using react-native-fast-tflite encountered compatibility issues. Specifically, certain dependency versions interfered with dynamic model loading. At the time of final submission, a newer version of react-native-fast-tflite had been released, which may resolve the conflict. The TFLite model file is included in the repository and is ready for reintegration once the loading issue is resolved.
### Android implementation
The current version of the app runs only on iOS. However, porting to Android is highly feasible since 95% of the codebase is written in JavaScript utilizing the React Native framework. The only native code integration involves Google’s ML Kit Pose Detection, which was necessary for real-time efficiency. Instructions for Android implementation using ML Kit can be found here: https://developers.google.com/ml-kit/vision/pose-detection. Future teams can follow similar steps to those used for the iOS integration.
### Firebase Services
All backend services for the app are managed through Firebase. This includes Firebase Authentication, Cloud Functions, and the Realtime Database. Analytics and usage statistics are viewable in the Firebase Console, which is registered under the team email: realtime.sportperformanceai@gmail.com. For access or further information, contact the project sponsor Dr. Chen Chen, who oversees the Firebase developer account.
### Unit testing
Unit testing was not implemented during the development of this version of the app. We strongly recommend future teams prioritize writing unit tests to improve maintainability, ensure feature reliability, and support safer code modifications moving forward.
