import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
  const [detect, setDetect] = useState('red');
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      console.log('izin verildi');
    })();
  }, []);

  const handleFacesDetected = ({ faces }) => {
    if (faces.length === 1 && (faces[0].yawAngle > 350 || faces[0].yawAngle < 5) && (faces[0].rollAngle > 350 || faces[0].rollAngle < 5)) {
      console.log(faces[0]);
      setDetect('green');
    } else {
      setDetect('red');
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: detect }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.front}
        ratio="1:1"
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.accurate,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.none,
          tracking: true,
        }}
      />
      <View style={{ flex: 1 }} />
    </View>
  );
}
