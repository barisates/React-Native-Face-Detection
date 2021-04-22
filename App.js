import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import * as FaceDetector from 'expo-face-detector';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function App() {
  const [detect, setDetect] = useState('Kafanızı sağa çeviriniz');
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      console.log('izin verildi');
    })();
  }, []);
  const handleFacesDetected = face => {
    if (detect === 'Kafanızı sağa çeviriniz'
    && face
    && (face.yawAngle < 65 && face.yawAngle > 20)
    && (face.rollAngle > 350 || face.rollAngle < 20)) {
      setDetect('Sol gözünüzü kapayınız');
    } else if (detect === 'Sol gözünüzü kapayınız'
    && face
    && (face.yawAngle < 20 || face.yawAngle > 350)
    && (face.rollAngle > 330 || face.rollAngle < 20)
    && face.rightEyeOpenProbability < 0.2
    && face.leftEyeOpenProbability > 0.8
    ) {
      setDetect('Gülümseyiniz');
    } else if (detect === 'Gülümseyiniz'
    && face
    && face.smilingProbability > 0.95
    ) { setDetect('tamam'); }
  };
  return (
    <View style={{ flex: 1, backgroundColor: detect }}>
      <Camera
        style={{ flex: 1, zIndex: 2 }}
        type={Camera.Constants.Type.front}
        ratio="16:9"
        onFacesDetected={e => handleFacesDetected(e.faces[0])}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.accurate,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.all,
          tracking: true,
        }}

      />

      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 30, justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', paddingHorizontal: 30, paddingVertical: 10 }}>
          <Text style={{ fontWeight: '900', fontSize: 15, color: 'black' }}>
            {detect}
            {' '}
          </Text>
        </View>

      </View>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'transparent', borderWidth: 1, width: windowWidth / 2, height: windowWidth / 1.8, borderRadius: 100, transform: [{ scaleY: 1.3 }] }} />

      </View>
    </View>
  );
}
