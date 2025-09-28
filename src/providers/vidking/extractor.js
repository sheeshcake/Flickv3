// extractor.js
// Extracts m3u8 URLs from Vidking embed pages or provides iframe URL as fallback

/**
 * Extract m3u8 URL from Vidking embed page
 * @param {string} embedUrl - Vidking embed URL
 * @param {AbortSignal} signal - Abort signal for cancelling requests
 * @returns {Promise<Object>} - Object containing the m3u8 URL and headers, or iframe URL as fallback
 */
export const extractM3u8 = async function (embedUrl, signal) {
  try {
    // Create a hidden iframe to load the Vidking player
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = embedUrl;
    document.body.appendChild(iframe);

    console.log(embedUrl)

    // Promise to wait for the m3u8 URL
    return new Promise((resolve, reject) => {
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Timeout waiting for Vidking player to load'));
      }, 15000);

      // Listen for messages from the iframe
      const messageHandler = (event) => {
        try {
          // Check if the message is from Vidking player
          if (event.source === iframe.contentWindow) {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            
            // Look for HLS.js events that contain the m3u8 URL
            if (data && data.type === 'PLAYER_EVENT') {
              // When the player starts playing, we can extract the m3u8 URL
              if (data.data && data.data.event === 'play') {
                // Get the video element from the iframe
                const videoElement = iframe.contentWindow.document.querySelector('video');
                if (videoElement && videoElement.src) {
                  // Extract the m3u8 URL
                  const url = videoElement.src;
                  if (url.includes('.m3u8')) {
                    cleanup();
                    resolve({
                      url,
                      quality: 'Auto',
                      headers: {
                        'Referer': 'https://www.vidking.net/',
                        'Origin': 'https://www.vidking.net'
                      }
                    });
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error processing message from Vidking player:', error);
        }
      };

      // Add event listener for messages
      window.addEventListener('message', messageHandler);

      // Cleanup function
      const cleanup = () => {
        clearTimeout(timeout);
        clearTimeout(fallbackTimeout);
        window.removeEventListener('message', messageHandler);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        if (window.fetch !== originalFetch && originalFetch) {
          window.fetch = originalFetch; // Restore original fetch
        }
      };

      // Alternative method: directly inspect network requests
      const originalFetch = window.fetch;
      if (window.fetch) {
        window.fetch = async function(input, init) {
          const response = await originalFetch(input, init);
          
          // Clone the response to inspect it
          const clone = response.clone();
          
          // Check if this is an m3u8 request
          if (typeof input === 'string' && input.includes('.m3u8')) {
            cleanup();
            window.fetch = originalFetch; // Restore original fetch
            resolve({
              url: input,
              quality: 'Auto',
              headers: {
                'Referer': 'https://www.vidking.net/',
                'Origin': 'https://www.vidking.net'
              }
            });
          }
          
          return response;
        };
      }
      
      // Set a fallback timeout to use iframe if m3u8 extraction fails
      const fallbackTimeout = setTimeout(() => {
        console.log('Using iframe fallback for Vidking player');
        // Don't remove the iframe in this case
        clearTimeout(timeout);
        window.removeEventListener('message', messageHandler);
        if (window.fetch !== originalFetch && originalFetch) {
          window.fetch = originalFetch; // Restore original fetch
        }
        
        // Return the iframe URL as fallback
        resolve({
          url: embedUrl,
          quality: 'Auto',
          isIframe: true, // Flag to indicate this is an iframe URL
          headers: {
            'Referer': 'https://www.vidking.net/',
            'Origin': 'https://www.vidking.net'
          }
        });
      }, 10000); // Try iframe fallback after 10 seconds
    });
  } catch (error) {
    console.error('Error extracting m3u8 from Vidking:', error);
    return null;
  }
};

/**
 * Alternative method using a headless browser approach
 * This requires a server-side component or a native module
 */
export const extractM3u8ServerSide = async function (embedUrl, signal) {
  // This is a placeholder for a server-side implementation
  // In a real implementation, you would use a headless browser like Puppeteer
  // or a server-side API to extract the m3u8 URL
  console.warn('Server-side extraction not implemented');
  return null;
};

export default extractM3u8;