export const socialLinks = {
  youtube: 'https://www.youtube.com/@AvinashGuptaOfficial',
  instagram: 'https://www.instagram.com/just.avinashgupta/',
  spotify: 'https://open.spotify.com/artist/3uhuJ2D7s3DFpvhmNSo8G7',
  apple: 'https://music.apple.com/in/artist/avinash-gupta/1549118440',
};
export const eventTypes = [
  'Concert',
  'Corporate event',
  'Private celebration',
  'Wedding',
  'Collaboration',
  'Other',
];
export function videoId(url) {
  try {
    const parsed = new URL(url);
    if (!['www.youtube.com', 'youtube.com', 'youtu.be'].includes(parsed.hostname)) return null;
    const id =
      parsed.hostname === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
    return /^[\w-]{11}$/.test(id || '') ? id : null;
  } catch {
    return null;
  }
}
export function todayInIndia() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
export const dateParts = (date) => ({
  day: new Intl.DateTimeFormat('en', { day: '2-digit', timeZone: 'Asia/Kolkata' }).format(
    new Date(date),
  ),
  month: new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'Asia/Kolkata' }).format(
    new Date(date),
  ),
  year: new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Kolkata' }).format(
    new Date(date),
  ),
});
