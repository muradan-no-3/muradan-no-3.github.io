export async function fetchSongLinks(url) {
  const res = await fetch(
    `https://api.song.link/v1-alpha.1/links?url=${url}&userCountry=JP`
  );

  return res.json();
}

export async function getAppleMusicData(url) {
  const data = await fetchSongLinks(url);
  const entityUniqueId = data.linksByPlatform.appleMusic.entityUniqueId;
  return data.entitiesByUniqueId[entityUniqueId];
}
