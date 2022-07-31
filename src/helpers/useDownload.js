import { PermissionsAndroid } from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import { useDispatch } from 'react-redux'
import {
    addToDownloads,
    updateDownloads
} from "~/redux/profileSlice"



export const startDownload = async (movie, video) => {
    // const dispatch = useDispatch()
    try {
        console.log("startDownload", movie, video)
        // useDispatch(addToDownloads({
        //     id: movie.id,
        //     title: movie.title,
        //     progress: 0,
        //     total: 0,
        //     received: 0
        // }))
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        const folder = await RNFetchBlob.fs.exists(RNFetchBlob.fs.dirs.DownloadDir); //check Download directory check
        if (folder) {
            console.log('download')
            await RNFetchBlob.config({
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    description: movie.title,
                    path: RNFetchBlob.fs.dirs.DownloadDir + "/" + movie.title.replace(/-$/g, "") + ".mp4"
                },
            })
                .fetch("GET", video, {
                    "Content-Type": "application/octet-stream",
                })
                .progress({ interval: 250 }, (recieved, total) => {
                    // useDispatch(updateDownloads({
                    //     id: movie.id,
                    //     title: movie.title,
                    //     progress: received / total,
                    //     total: total,
                    //     recieved: recieved,
                    // }))
                    console.log(`${recieved / total}`)
                })
                .then((resp) => {
                    // console.log(resp)
                }).catch((err) => {
                    console.log(err)
                });
        }
    } catch (error) {
        console.log(error);
    }
}

export default {
    startDownload
}