import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import {colors } from '~/constants/theme'
import Video from 'react-native-video'


const Test = () => {
    const axios = require("axios")
    const cheerio = require('cheerio/lib/slim');
    const link = "https://api.asiaflix.app/api/v2/drama?id=5fde6cd960075b0017da9832";
    const video = "";


    const getVideo = async () => {
        const data = await fetch(link,{
            method: "GET",
            headers: {
                "Referer":"https://asiaflix.app/",
                "Origin": "https://asiaflix.app",
                "Host": "api.asiaflix.app"
	
            }
        }).then(res => res.data)

        console.log(data)

    }

    useEffect(() => {
        getVideo();
    } , [])


  return (
    <View
        style={{
            //testing in amoled screen 
            backgroundColor: colors.black,
            flex: 1,
        }}
    >
        <Video
            source={{
                uri: video
            }}
            style={{
                height: "100%"
            }}
            controls={true}
        />
    </View>
  )
}

export default Test