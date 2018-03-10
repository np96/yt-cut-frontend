const validateRegex = (string, pattern) => {
  if (string !== undefined && string !== '') {
    return string.match(pattern);
  }
};

const youtube_regex = /^(http:\/\/|https:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([^"&?/ ]{11})$/;

const time_regex = /^([0-9]{2})(h|:)([0-9]{2})(m|:)([0-9]{2})s?$/;

export const validateYouTubeUrl = (url) => validateRegex(url, youtube_regex);

export const validateTime = (time) => validateRegex(time, time_regex);