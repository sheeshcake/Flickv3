import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import GoogleCast, { useDevices, useCastDevice } from 'react-native-google-cast'

const CastButton = () => {
  const castDevice = useCastDevice()
  const devices = useDevices()
  const sessionManager = GoogleCast?.getSessionManager()

  return devices.map((device) => {
    const active = device.deviceId === castDevice?.deviceId

    return (
      <TouchableOpacity
        key={device.deviceId}
        onPress={() =>
          active
            ? sessionManager?.endCurrentSession()
            : sessionManager?.startSession(device.deviceId)
        }
        title={device.friendlyName}
      />
    )
  })
}

export default CastButton