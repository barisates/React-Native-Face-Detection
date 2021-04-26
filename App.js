import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as FaceDetector from 'expo-face-detector';

const colorArray = ['green', 'red', 'blue', 'purple', 'orange', 'yellow', 'brown', 'black', 'white', 'gray'];

const conditions = [
  { message: 'Kafanızı sağa çeviriniz.', rule: face => face && (face.yawAngle < 65 && face.yawAngle > 20) && (face.rollAngle > 350 || face.rollAngle < 20) },
  { message: 'Sol gözünüzü kapayınız.', rule: face => face && (face.yawAngle < 20 || face.yawAngle > 350) && (face.rollAngle > 330 || face.rollAngle < 20) && face.rightEyeOpenProbability < 0.2 && face.leftEyeOpenProbability > 0.8 },
  { message: 'Gülümseyiniz.', rule: face => face && face.smilingProbability > 0.95 },
  { message: 'Canlısınız.' },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [detetPosition, setDetectPosition] = useState([{
    height: 0,
    width: 0,
    left: 0,
    top: 0,
  }]);

  const handleFacesDetected = face => {
    if (face) {
      setDetectPosition(face.map(item => ({
        height: item.bounds.size.height,
        width: item.bounds.size.width,
        left: item.bounds.origin.x,
        top: item.bounds.origin.y,
      })));

      if (step < 3 && conditions[step].rule(face[0])) {
        setStep(step + 1);
      }
    }
  };
  useEffect(() => {
    (async () => {
      await Camera.requestPermissionsAsync();
    })();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.9, zIndex: 1 }}>
        <Camera
          style={{ flex: 1, zIndex: -1 }}
          type={Camera.Constants.Type.front}
          ratio="16:9"
          onFacesDetected={e => handleFacesDetected(e.faces)}
          faceDetectorSettings={{
            mode: FaceDetector.Constants.Mode.accurate,
            detectLandmarks: FaceDetector.Constants.Landmarks.none,
            runClassifications: FaceDetector.Constants.Classifications.all,
            tracking: true,
          }}

        />
      </View>
      {detetPosition.map((item, index) => <View style={{ position: 'absolute', borderWidth: 2, borderColor: colorArray[index], height: item.height, width: item.width, left: item.left, top: item.top, zIndex: 99, borderRadius: 25 }} />)}
      <View style={{ flex: 0.1, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: 20 }}>{conditions[step].message}</Text>
      </View>
    </View>
  );
}
