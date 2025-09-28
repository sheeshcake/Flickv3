// stream.js
// Fetches streaming links for a given item

import { providerContext } from './providerContext';

export const getStream = async function ({ link, type, signal, providerContext: ctx }) {
  try {
    const { axios, cheerio, getBaseUrl, commonHeaders, extractors } = ctx || providerContext;
    const baseUrl = await getBaseUrl('vega'); // or get from context
    
    if (!baseUrl) {
      console.error('Base URL not found');
      return [];
    }

    const url = `${baseUrl}${link}`;
    const response = await axios.get(url, { headers: commonHeaders, signal });
    const $ = cheerio.load(response.data);
    
    const streamLinks = [];
    
    // Get server links
    $('.server-item').each(async (i, el) => {
      const $server = $(el);
      const serverId = $server.attr('data-id');
      const serverName = $server.text().trim();
      
      if (serverId) {
        try {
          // Get the actual streaming URL from server
          const serverResponse = await axios.get(`${baseUrl}/ajax/get_link/${serverId}`, {
            headers: commonHeaders,
            signal
          });
          
          const serverData = serverResponse.data;
          let streamUrl = serverData.link || serverData.url;
          
          if (streamUrl) {
            // Check if we need to use extractors
            if (streamUrl.includes('gdflix')) {
              const extracted = await extractors.gdFlixExtracter(streamUrl, signal);
              streamLinks.push(...extracted);
            } else if (streamUrl.includes('hubcloud')) {
              const extracted = await extractors.hubcloudExtracter(streamUrl, signal);
              streamLinks.push(...extracted);
            } else if (streamUrl.includes('gofile')) {
              const gofileId = streamUrl.split('/').pop();
              const extracted = await extractors.gofileExtracter(gofileId);
              if (extracted.link) {
                streamLinks.push({
                  server: 'Gofile',
                  link: extracted.link,
                  type: 'mkv',
                  quality: '1080p'
                });
              }
            } else if (streamUrl.includes('supervideo')) {
              // For supervideo, we need to extract from the page content
              const videoResponse = await axios.get(streamUrl, { headers: commonHeaders, signal });
              const extractedUrl = await extractors.superVideoExtractor(videoResponse.data);
              if (extractedUrl) {
                streamLinks.push({
                  server: 'SuperVideo',
                  link: extractedUrl,
                  type: 'm3u8',
                  quality: '1080p'
                });
              }
            } else {
              // Direct link
              streamLinks.push({
                server: serverName || 'Unknown',
                link: streamUrl,
                type: streamUrl.includes('.m3u8') ? 'm3u8' : 'mp4',
                quality: '1080p'
              });
            }
          }
        } catch (serverError) {
          console.error(`Error processing server ${serverName}:`, serverError);
        }
      }
    });

    // If no server links found, try direct iframe sources
    if (streamLinks.length === 0) {
      $('iframe').each((i, el) => {
        const src = $(el).attr('src');
        if (src && (src.includes('http') || src.startsWith('//'))) {
          const fullUrl = src.startsWith('//') ? `https:${src}` : src;
          streamLinks.push({
            server: 'Iframe',
            link: fullUrl,
            type: 'iframe',
            quality: '1080p'
          });
        }
      });
    }

    return streamLinks;
  } catch (error) {
    console.error('Error in getStream:', error);
    return [];
  }
};