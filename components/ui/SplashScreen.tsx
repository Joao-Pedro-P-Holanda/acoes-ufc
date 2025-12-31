import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1000),
    ]).start(() => {
      onFinish()
    })
  }, [])

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/icon.jpg')}
        style={[
          styles.logo,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
})