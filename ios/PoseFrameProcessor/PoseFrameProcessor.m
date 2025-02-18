#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("rtspai/rtspai-Swift.h")
#import "rtspai/rtspai-Swift.h"
#else
#import "rtspai-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(PoseFrameProcessorPlugin, detectPose)