export const validateYouTubeUrl = (url) =>  {
  if (url !== undefined || url !== '') {
    const regExp = /^(http:\/\/|https:\/\/)?(www\.)?(youtube\.com\/watch\?v=)([^"&?/ ]{11})$/;
    return url.match(regExp);
  }
};