import { set } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const WebviewScrapper = ({ movieId, season, episode, movieType, onScraped }) => {
    const [movieUrl, setMovieUrl] = React.useState(null);
    const [isScraped, setIsScraped] = React.useState(false);
    const INJECTED_JAVASCRIPT = `
         (function() {
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener('load', function() {
                    try {
                        const responseURL = this.responseURL;
                        if (!responseURL) return;
                        const isVideo = /\\.(m3u8|mp4|webm|mkv)($|\\?)/i.test(responseURL);
                        window.ReactNativeWebView?.postMessage(JSON.stringify({
                            video: responseURL
                        }));
                    } catch (error) {
                        console.error('Error in XMLHttpRequest listener:', error);
                    }
                });
                originalOpen.apply(this, arguments);
            };
        })();
    `;

    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.video && !isScraped) {
                onScraped(data.video);
                setIsScraped(true);
                setMovieUrl(null);
            }
        } catch (error) {
            console.error('Error parsing message from WebView:', error);
        }
    };

    useEffect(() => {
        if(movieId) {
            if(movieType === 'tv' && season && episode) {
                console.log('WebviewScrapper URL:', `https://vidking.net/embed/${movieType}/${movieId}/${season}/${episode}?color=e50914&autoPlay=true`);
                setMovieUrl(`https://vidking.net/embed/${movieType}/${movieId}/${season}/${episode}?color=e50914&autoPlay=true`);
            } else {
                console.log('WebviewScrapper URL:', `https://vidking.net/embed/${movieType}/${movieId}?color=e50914&autoPlay=true`);
                setMovieUrl(`https://vidking.net/embed/${movieType}/${movieId}?color=e50914&autoPlay=true`);
            }
        }
    }, [movieId]);


    return (
        <View style={styles.hiddenContainer}>
            {movieUrl && (
                <WebView
                    source={{ uri: movieUrl }}
                    onMessage={onMessage}
                    injectedJavaScript={INJECTED_JAVASCRIPT}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                />
            )}
        </View>
    );
};


const styles = {
    hiddenContainer: {
        position: 'absolute',
        top: -1000,
        left: -1000,
        width: 1,
        height: 1,
        opacity: 0,
    },
};
export default WebviewScrapper;
