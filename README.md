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
<>
### Exercise detection model inaccuracy
<>
### TFLite library & Injury Prev. model conflicts
<>
### Android implementation
<>
### Firebase rules
<>
### Unit testing
<>
