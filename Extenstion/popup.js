document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('convertButton').addEventListener('click', generateEmbedLink);
  
    // Auto-fill URL if on YouTube video page
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;
      if (isYouTubeVideoUrl(url)) {
        document.getElementById('youtubeUrl').value = url;
      }
    });
  });
  
  function generateEmbedLink() {
    const youtubeUrl = document.getElementById('youtubeUrl').value.trim();
    const startHours = parseInt(document.getElementById('startHours').value, 10) || 0;
    const startMinutes = parseInt(document.getElementById('startMinutes').value, 10) || 0;
    const startSeconds = parseInt(document.getElementById('startSeconds').value, 10) || 0;
    const endHours = parseInt(document.getElementById('endHours').value, 10) || 0;
    const endMinutes = parseInt(document.getElementById('endMinutes').value, 10) || 0;
    const endSeconds = parseInt(document.getElementById('endSeconds').value, 10) || 0;
  
    const startTimeInSeconds = convertToSeconds(startHours, startMinutes, startSeconds);
    const endTimeInSeconds = convertToSeconds(endHours, endMinutes, endSeconds);
  
    const embedUrl = getEmbedUrl(youtubeUrl, startTimeInSeconds, endTimeInSeconds);
  
    if (embedUrl) {
      chrome.tabs.create({ url: embedUrl });
    } else {
      document.getElementById('embedLink').innerHTML = '<strong>Error:</strong> Invalid YouTube URL';
    }
  }
  
  function convertToSeconds(hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  function getEmbedUrl(url, start, end) {
    const videoId = getVideoIdFromUrl(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?start=${start}&end=${end}` : '';
  }
  
  function getVideoIdFromUrl(url) {
    const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = url.match(videoIdRegex);
    return match ? match[1] : null;
  }
  
  function isYouTubeVideoUrl(url) {
    const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    return videoIdRegex.test(url);
  }