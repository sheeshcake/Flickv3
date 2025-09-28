// extractors.js
// JavaScript versions of all extractors

import axios from 'axios';
import * as cheerio from 'cheerio';
import { headers } from './headers.js';

// Helper function for decoding
const decode = function (value) {
  if (value === undefined) {
    return '';
  }
  return atob(value.toString());
};

// GDFlix Extractor
export async function gdFlixExtracter(link, signal) {
  try {
    const streamLinks = [];
    const res = await axios(link, {headers, signal});
    console.log('gdFlixExtracter', link);
    const data = res.data;
    let $drive = cheerio.load(data);

    // Handle redirect
    if ($drive('body').attr('onload')?.includes('location.replace')) {
      const newLink = $drive('body')
        .attr('onload')
        ?.split("location.replace('")?.[1]
        .split("'")?.[0];

      if (newLink) {
        const newRes = await axios.get(newLink, {headers, signal});
        $drive = cheerio.load(newRes.data);
      }
    }

    // R2 link
    try {
      const r2Link =
        $drive('.btn.btn-outline-success').attr('href') ||
        $drive('a:contains("CLOUD DOWNLOAD")').attr('href') ||
        '';
      if (r2Link) {
        streamLinks.push({
          server: 'R2',
          link: r2Link,
          type: 'mkv',
        });
      }
    } catch (err) {
      console.log('R2 link not found', err);
    }

    // PixelDrain link
    try {
      const pixelDrainLink = $drive('.btn.btn-success').attr('href') || '';
      if (pixelDrainLink) {
        streamLinks.push({
          server: 'PixelDrain',
          link: pixelDrainLink,
          type: 'mkv',
        });
      }
    } catch (err) {
      console.log('PixelDrain link not found', err);
    }

    // Instant link
    try {
      const seed = $drive('.btn-danger').attr('href') || '';
      if (seed && !seed.includes('?url=')) {
        const newLinkRes = await axios.head(seed, {headers, signal});
        const newLink = newLinkRes.request?.responseURL?.split('?url=')?.[1] || seed;
        streamLinks.push({server: 'G-Drive', link: newLink, type: 'mkv'});
      }
    } catch (err) {
      console.log('Instant link not found', err);
    }

    return streamLinks;
  } catch (error) {
    console.log('gdflix error: ', error);
    return [];
  }
}

// GoFile Extractor
export async function gofileExtracter(id) {
  try {
    const gofileRes = await axios.get('https://gofile.io/d/' + id);
    const genAccountres = await axios.post('https://api.gofile.io/accounts');
    const token = genAccountres.data.data.token;

    const wtRes = await axios.get('https://gofile.io/dist/js/global.js');
    const wt = wtRes.data.match(/appdata\.wt\s*=\s*["']([^"']+)["']/)[1];

    const res = await axios.get(
      `https://api.gofile.io/contents/${id}?wt=${wt}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const oId = Object.keys(res.data.data.children)[0];
    const link = res.data.data.children[oId].link;
    return { link, token };
  } catch (e) {
    console.log('gofile extracter err', e);
    return { link: '', token: '' };
  }
}

// HubCloud Extractor
export async function hubcloudExtracter(link, signal) {
  try {
    const baseUrl = link.split('/').slice(0, 3).join('/');
    const streamLinks = [];
    const vLinkRes = await axios(link, {headers, signal});
    const vLinkText = vLinkRes.data;
    const $vLink = cheerio.load(vLinkText);
    const vLinkRedirect = vLinkText.match(/var\s+url\s*=\s*'([^']+)';/) || [];
    let vcloudLink =
      decode(vLinkRedirect[1]?.split('r=')?.[1]) ||
      vLinkRedirect[1] ||
      $vLink('.fa-file-download.fa-lg').parent().attr('href') ||
      link;

    if (vcloudLink?.startsWith('/')) {
      vcloudLink = `${baseUrl}${vcloudLink}`;
    }

    const vcloudRes = await fetch(vcloudLink, {
      headers,
      signal,
      redirect: 'follow',
    });
    const $ = cheerio.load(await vcloudRes.text());

    const linkClass = $('.btn-success.btn-lg.h6,.btn-danger,.btn-secondary');
    for (const element of linkClass) {
      const itm = $(element);
      let link = itm.attr('href') || '';
      
      if (link?.includes('.dev') && !link?.includes('/?id=')) {
        streamLinks.push({server: 'Cf Worker', link: link, type: 'mkv'});
      }
      if (link?.includes('pixeld')) {
        streamLinks.push({server: 'Pixeldrain', link: link, type: 'mkv'});
      }
      if (link?.includes('hubcloud') || link?.includes('/?id=')) {
        try {
          const newLinkRes = await axios.head(link, {headers, signal});
          const newLink = newLinkRes.request?.responseURL?.split('link=')?.[1] || link;
          streamLinks.push({server: 'hubcloud', link: newLink, type: 'mkv'});
        } catch (error) {
          console.log('hubcloudExtracter error in hubcloud link: ', error);
        }
      }
    }
    return streamLinks;
  } catch (error) {
    console.log('hubcloudExtracter error: ', error);
    return [];
  }
}

// SuperVideo Extractor
export async function superVideoExtractor(data) {
  try {
    var functionRegex = /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
    var match = functionRegex.exec(data);
    let p = '';
    
    if (match) {
      var encodedString = match[2];
      p = encodedString.split("',36,")?.[0].trim();
      let a = 36;
      let c = encodedString.split("',36,")[1].slice(2).split('|').length;
      let k = encodedString.split("',36,")[1].slice(2).split('|');

      while (c--) {
        if (k[c]) {
          var regex = new RegExp('\\b' + c.toString(a) + '\\b', 'g');
          p = p.replace(regex, k[c]);
        }
      }
    }

    const streamUrl = p?.match(/file:\s*"([^"]+\.m3u8[^"]*)"/)?.[1];
    return streamUrl || '';
  } catch (err) {
    console.error('SuperVideoExtractor Error:', err);
    return '';
  }
}