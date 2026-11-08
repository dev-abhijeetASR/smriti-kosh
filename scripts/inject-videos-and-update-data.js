const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'src', 'lib', 'processed-albums.json');
if (!fs.existsSync(manifestPath)) {
  console.log('processed-albums.json not ready yet');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Check if videos are already added
const hasV1 = data.occasion.items.some(i => i.youtubeId === 'ZyUcN4Ud-RM');
if (!hasV1) {
  // Add Part 01 & Part 02
  const vid1 = {
    id: 'fr-vid-01',
    title: "Father's Retirement Ceremony — Full Recording (Part 01)",
    type: 'video',
    url: 'https://www.youtube.com/watch?v=ZyUcN4Ud-RM',
    youtubeId: 'ZyUcN4Ud-RM',
    thumbnailUrl: 'https://img.youtube.com/vi/ZyUcN4Ud-RM/hqdefault.jpg',
    occasionId: 'father-retirement',
    subfolderId: 'videos',
    subfolderName: 'Videos (वीडियो रिकॉर्डिंग)',
    date: 'Aug 23, 2025',
    duration: 'Full HD Video',
    description: 'Complete ceremony recording (Part 01) streamed online in full HD via unlisted YouTube link.',
  };

  const vid2 = {
    id: 'fr-vid-02',
    title: "Father's Retirement Ceremony — Full Recording (Part 02)",
    type: 'video',
    url: 'https://www.youtube.com/watch?v=Ps298BDvwJM',
    youtubeId: 'Ps298BDvwJM',
    thumbnailUrl: 'https://img.youtube.com/vi/Ps298BDvwJM/hqdefault.jpg',
    occasionId: 'father-retirement',
    subfolderId: 'videos',
    subfolderName: 'Videos (वीडियो रिकॉर्डिंग)',
    date: 'Aug 23, 2025',
    duration: 'Full HD Video',
    description: 'Complete ceremony recording (Part 02) streamed online in full HD via unlisted YouTube link.',
  };

  data.occasion.items.unshift(vid2);
  data.occasion.items.unshift(vid1);

  data.occasion.subfolders.unshift({
    id: 'videos',
    name: 'Videos (वीडियो रिकॉर्डिंग)',
    description: 'Full-length HD ceremony recordings streamed online via unlisted links',
    coverImage: 'https://img.youtube.com/vi/ZyUcN4Ud-RM/hqdefault.jpg',
    itemCount: 2,
  });

  fs.writeFileSync(manifestPath, JSON.stringify(data, null, 2));
  console.log('Videos injected into manifest successfully!');
}
