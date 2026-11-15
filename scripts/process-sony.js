const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SONY_SOURCE = 'D:\\Sony';
const DEST_BASE = path.join(__dirname, '../public/albums/sony');
const JSON_OUTPUT = path.join(__dirname, '../src/lib/sony-album.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanTitle(fileName) {
  return fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim();
}

function formatDuration(sizeBytes) {
  const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
  return `${mb} MB`;
}

async function processSony() {
  console.log('=== Starting Sony Media Processing ===');
  console.log(`Source: ${SONY_SOURCE}`);
  console.log(`Destination: ${DEST_BASE}`);

  ensureDir(DEST_BASE);

  const parentFolders = [
    {
      id: 'dcim',
      name: 'DCIM (कैमरा तस्वीरें • Camera Roll)',
      localPath: 'D:\\Sony\\DCIM',
      description: 'Original camera photographs and recordings captured on Sony Xperia',
      coverImage: '/albums/sony/dcim/camera/thumb-IMG_20160715_223147.webp',
      itemCount: 0,
      subfolderIds: ['dcim-camera', 'dcim-youcam']
    },
    {
      id: 'whatsapp',
      name: 'whats app (व्हाट्सएप मीडिया • WhatsApp Media)',
      localPath: 'D:\\Sony\\whats app',
      description: 'WhatsApp images, video clips, profile photos, and voice notes',
      coverImage: '/albums/sony/whatsapp/images/thumb-IMG-20160715-WA0001.webp',
      itemCount: 0,
      subfolderIds: ['wa-images', 'wa-videos', 'wa-profile', 'wa-audio']
    },
    {
      id: 'bluetooth',
      name: 'bluetooth (ब्लूटूथ संग्रह • Bluetooth Transfers)',
      localPath: 'D:\\Sony\\bluetooth',
      description: 'Photos, screenshots, and media received via Bluetooth on Sony Xperia',
      coverImage: '/albums/sony/bluetooth/thumb-2016-03-22-13-32-11-677.webp',
      itemCount: 0,
      subfolderIds: ['bluetooth-all']
    },
    {
      id: 'shareit',
      name: 'SHAREit (शेयरइट मीडिया • SHAREit Files)',
      localPath: 'D:\\Sony\\SHAREit',
      description: 'Pictures, videos, and music shared via SHAREit',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['shareit-pictures', 'shareit-videos', 'shareit-audios']
    },
    {
      id: 'hike',
      name: 'hike (हाइक मैसेंजर • Hike Messenger)',
      localPath: 'D:\\Sony\\hike',
      description: 'Memories and photographs from Hike Messenger and profile photos',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['hike-images', 'hike-profile']
    },
    {
      id: 'eyeem',
      name: 'EyeEm (आईएम फोटो • EyeEm Photography)',
      localPath: 'D:\\Sony\\EyeEm',
      description: 'Artistic mobile photography with EyeEm camera',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['eyeem-all']
    }
  ];

  const subfolders = [
    // DCIM
    {
      id: 'dcim-camera',
      name: 'Camera (कैमरा तस्वीरें)',
      parentId: 'dcim',
      parentName: 'DCIM (कैमरा तस्वीरें • Camera Roll)',
      localPath: 'D:\\Sony\\DCIM\\Camera',
      description: '98 Sony Xperia camera photographs & videos',
      coverImage: '/albums/sony/dcim/camera/thumb-IMG_20160715_223147.webp',
      itemCount: 0
    },
    {
      id: 'dcim-youcam',
      name: 'YouCam Perfect (यूकैम परफेक्ट)',
      parentId: 'dcim',
      parentName: 'DCIM (कैमरा तस्वीरें • Camera Roll)',
      localPath: 'D:\\Sony\\DCIM\\YouCam Perfect',
      description: 'Edited portraits and beauty camera captures',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // WhatsApp
    {
      id: 'wa-images',
      name: 'WhatsApp Images (तस्वीरें)',
      parentId: 'whatsapp',
      parentName: 'whats app (व्हाट्सएप मीडिया • WhatsApp Media)',
      localPath: 'D:\\Sony\\whats app\\WhatsApp Images',
      description: 'Received and sent WhatsApp photographs from 2016',
      coverImage: '/albums/sony/whatsapp/images/thumb-IMG-20160715-WA0001.webp',
      itemCount: 0
    },
    {
      id: 'wa-videos',
      name: 'WhatsApp Video (वीडियो)',
      parentId: 'whatsapp',
      parentName: 'whats app (व्हाट्सएप मीडिया • WhatsApp Media)',
      localPath: 'D:\\Sony\\whats app\\WhatsApp Video',
      description: 'WhatsApp video recordings, clips, and festival wishes',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'wa-profile',
      name: 'WhatsApp Profile Photos (प्रोफाइल फोटो)',
      parentId: 'whatsapp',
      parentName: 'whats app (व्हाट्सएप मीडिया • WhatsApp Media)',
      localPath: 'D:\\Sony\\whats app\\WhatsApp Profile Photos',
      description: 'Profile portraits and display pictures',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'wa-audio',
      name: 'WhatsApp Audio (ऑडियो व वॉइस नोट्स)',
      parentId: 'whatsapp',
      parentName: 'whats app (व्हाट्सएप मीडिया • WhatsApp Media)',
      localPath: 'D:\\Sony\\whats app\\WhatsApp Audio',
      description: 'Audio recordings and voice messages',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Bluetooth
    {
      id: 'bluetooth-all',
      name: 'Bluetooth Transfers (ब्लूटूथ फाइल्स)',
      parentId: 'bluetooth',
      parentName: 'bluetooth (ब्लूटूथ संग्रह • Bluetooth Transfers)',
      localPath: 'D:\\Sony\\bluetooth',
      description: 'Photos and screenshots received via Bluetooth',
      coverImage: '/albums/sony/bluetooth/thumb-2016-03-22-13-32-11-677.webp',
      itemCount: 0
    },
    // SHAREit
    {
      id: 'shareit-pictures',
      name: 'SHAREit Pictures (तस्वीरें)',
      parentId: 'shareit',
      parentName: 'SHAREit (शेयरइट मीडिया • SHAREit Files)',
      localPath: 'D:\\Sony\\SHAREit\\pictures',
      description: 'Pictures shared via SHAREit transfer',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'shareit-videos',
      name: 'SHAREit Videos (वीडियो)',
      parentId: 'shareit',
      parentName: 'SHAREit (शेयरइट मीडिया • SHAREit Files)',
      localPath: 'D:\\Sony\\SHAREit\\videos',
      description: 'Video recordings received via SHAREit',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'shareit-audios',
      name: 'SHAREit Audios (संगीत व ऑडियो)',
      parentId: 'shareit',
      parentName: 'SHAREit (शेयरइट मीडिया • SHAREit Files)',
      localPath: 'D:\\Sony\\SHAREit\\audios',
      description: 'Music tracks and audio recordings',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Hike
    {
      id: 'hike-images',
      name: 'hike Images (हाइक तस्वीरें)',
      parentId: 'hike',
      parentName: 'hike (हाइक मैसेंजर • Hike Messenger)',
      localPath: 'D:\\Sony\\hike\\hike Images',
      description: 'Images and stickers from Hike Messenger',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'hike-profile',
      name: 'hike Profile Images (हाइक प्रोफाइल)',
      parentId: 'hike',
      parentName: 'hike (हाइक मैसेंजर • Hike Messenger)',
      localPath: 'D:\\Sony\\hike\\hike Profile Images',
      description: 'Profile pictures from Hike',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // EyeEm
    {
      id: 'eyeem-all',
      name: 'EyeEm Photography (आईएम तस्वीरें)',
      parentId: 'eyeem',
      parentName: 'EyeEm (आईएम फोटो • EyeEm Photography)',
      localPath: 'D:\\Sony\\EyeEm',
      description: 'EyeEm camera mobile photography',
      coverImage: '/video-poster.webp',
      itemCount: 0
    }
  ];

  const items = [];

  async function processDirectory(dirPath, parentFolderId, parentFolderName, subfolderId, subfolderName, relativeTargetDir) {
    if (!fs.existsSync(dirPath)) return;
    const targetDir = path.join(DEST_BASE, relativeTargetDir);
    ensureDir(targetDir);

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recurse into subdirectories like "Sent" or "NIKHITA ATTAVAR"
        await processDirectory(
          fullPath,
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          path.join(relativeTargetDir, entry.name)
        );
        continue;
      }

      const fileName = entry.name;
      if (fileName.startsWith('.') || fileName.startsWith('._')) continue;

      const ext = path.extname(fileName).toLowerCase();
      const baseName = path.basename(fileName, ext);
      const stat = fs.statSync(fullPath);

      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const thumbName = `thumb-${baseName}.webp`;
        const mobileName = `mobile-${baseName}.webp`;
        const hdName = `hd-${baseName}.webp`;

        const thumbPath = path.join(targetDir, thumbName);
        const mobilePath = path.join(targetDir, mobileName);
        const hdPath = path.join(targetDir, hdName);

        let processSuccess = true;

        if (!fs.existsSync(thumbPath)) {
          try {
            await sharp(fullPath)
              .rotate()
              .resize(480, 480, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 70 })
              .toFile(thumbPath);
          } catch (e) {
            processSuccess = false;
          }
        }

        if (processSuccess && !fs.existsSync(mobilePath)) {
          try {
            await sharp(fullPath)
              .rotate()
              .resize(1440, 1440, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 75 })
              .toFile(mobilePath);
          } catch (e) {
            processSuccess = false;
          }
        }

        if (processSuccess && !fs.existsSync(hdPath)) {
          try {
            await sharp(fullPath)
              .rotate()
              .resize(3000, 3000, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 85 })
              .toFile(hdPath);
          } catch (e) {
            processSuccess = false;
          }
        }

        const publicRelativePath = `/albums/sony/${relativeTargetDir.replace(/\\/g, '/')}`;

        if (processSuccess) {
          items.push({
            id: `sony-${subfolderId}-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            title: cleanTitle(fileName),
            type: 'image',
            url: `${publicRelativePath}/${hdName}`,
            hdUrl: `${publicRelativePath}/${hdName}`,
            mobileUrl: `${publicRelativePath}/${mobileName}`,
            thumbnailUrl: `${publicRelativePath}/${thumbName}`,
            occasionId: 'sony-memories',
            parentFolderId,
            parentFolderName,
            subfolderId,
            subfolderName,
            date: '2016',
            fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`
          });
        } else {
          // Fallback: Copy raw image
          const fallbackDest = path.join(targetDir, fileName);
          if (!fs.existsSync(fallbackDest)) {
            fs.copyFileSync(fullPath, fallbackDest);
          }
          items.push({
            id: `sony-${subfolderId}-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            title: cleanTitle(fileName),
            type: 'image',
            url: `${publicRelativePath}/${fileName}`,
            hdUrl: `${publicRelativePath}/${fileName}`,
            mobileUrl: `${publicRelativePath}/${fileName}`,
            thumbnailUrl: `${publicRelativePath}/${fileName}`,
            occasionId: 'sony-memories',
            parentFolderId,
            parentFolderName,
            subfolderId,
            subfolderName,
            date: '2016',
            fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`
          });
        }
      } else if (ext === '.mp4') {
        const destVideoPath = path.join(targetDir, fileName);
        if (!fs.existsSync(destVideoPath)) {
          console.log(`Copying video: ${fileName} (${(stat.size / (1024 * 1024)).toFixed(1)} MB)...`);
          fs.copyFileSync(fullPath, destVideoPath);
        }

        const publicRelativePath = `/albums/sony/${relativeTargetDir.replace(/\\/g, '/')}`;

        items.push({
          id: `sony-${subfolderId}-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          title: cleanTitle(fileName),
          type: 'video',
          url: `${publicRelativePath}/${fileName}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'sony-memories',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: '2016',
          duration: formatDuration(stat.size),
          fileSize: `${(stat.size / (1024 * 1024)).toFixed(1)} MB`
        });
      } else if (['.mp3', '.m4a', '.aac', '.opus', '.amr'].includes(ext)) {
        const destAudioPath = path.join(targetDir, fileName);
        if (!fs.existsSync(destAudioPath)) {
          console.log(`Copying audio: ${fileName} (${(stat.size / (1024 * 1024)).toFixed(2)} MB)...`);
          fs.copyFileSync(fullPath, destAudioPath);
        }

        const publicRelativePath = `/albums/sony/${relativeTargetDir.replace(/\\/g, '/')}`;

        items.push({
          id: `sony-${subfolderId}-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          title: cleanTitle(fileName),
          type: 'video', // Playable via HTML5 video/audio player in Lightbox
          url: `${publicRelativePath}/${fileName}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'sony-memories',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: '2016',
          duration: formatDuration(stat.size),
          fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`
        });
      }
    }
  }

  // 1. Process DCIM / Camera
  console.log('Processing DCIM / Camera...');
  await processDirectory(
    path.join(SONY_SOURCE, 'DCIM', 'Camera'),
    'dcim',
    'DCIM (कैमरा तस्वीरें • Camera Roll)',
    'dcim-camera',
    'Camera (कैमरा तस्वीरें)',
    'dcim/camera'
  );

  // 2. Process DCIM / YouCam Perfect
  console.log('Processing DCIM / YouCam Perfect...');
  await processDirectory(
    path.join(SONY_SOURCE, 'DCIM', 'YouCam Perfect'),
    'dcim',
    'DCIM (कैमरा तस्वीरें • Camera Roll)',
    'dcim-youcam',
    'YouCam Perfect (यूकैम परफेक्ट)',
    'dcim/youcam'
  );

  // 3. Process whats app / WhatsApp Images
  console.log('Processing WhatsApp Images...');
  await processDirectory(
    path.join(SONY_SOURCE, 'whats app', 'WhatsApp Images'),
    'whatsapp',
    'whats app (व्हाट्सएप मीडिया • WhatsApp Media)',
    'wa-images',
    'WhatsApp Images (तस्वीरें)',
    'whatsapp/images'
  );

  // 4. Process whats app / WhatsApp Video
  console.log('Processing WhatsApp Video...');
  await processDirectory(
    path.join(SONY_SOURCE, 'whats app', 'WhatsApp Video'),
    'whatsapp',
    'whats app (व्हाट्सएप मीडिया • WhatsApp Media)',
    'wa-videos',
    'WhatsApp Video (वीडियो)',
    'whatsapp/videos'
  );

  // 5. Process whats app / WhatsApp Profile Photos
  console.log('Processing WhatsApp Profile Photos...');
  await processDirectory(
    path.join(SONY_SOURCE, 'whats app', 'WhatsApp Profile Photos'),
    'whatsapp',
    'whats app (व्हाट्सएप मीडिया • WhatsApp Media)',
    'wa-profile',
    'WhatsApp Profile Photos (प्रोफाइल फोटो)',
    'whatsapp/profile'
  );

  // 6. Process whats app / WhatsApp Audio
  console.log('Processing WhatsApp Audio...');
  await processDirectory(
    path.join(SONY_SOURCE, 'whats app', 'WhatsApp Audio'),
    'whatsapp',
    'whats app (व्हाट्सएप मीडिया • WhatsApp Media)',
    'wa-audio',
    'WhatsApp Audio (ऑडियो व वॉइस नोट्स)',
    'whatsapp/audio'
  );

  // 7. Process bluetooth
  console.log('Processing bluetooth...');
  await processDirectory(
    path.join(SONY_SOURCE, 'bluetooth'),
    'bluetooth',
    'bluetooth (ब्लूटूथ संग्रह • Bluetooth Transfers)',
    'bluetooth-all',
    'Bluetooth Transfers (ब्लूटूथ फाइल्स)',
    'bluetooth'
  );

  // 8. Process SHAREit / pictures
  console.log('Processing SHAREit / pictures...');
  await processDirectory(
    path.join(SONY_SOURCE, 'SHAREit', 'pictures'),
    'shareit',
    'SHAREit (शेयरइट मीडिया • SHAREit Files)',
    'shareit-pictures',
    'SHAREit Pictures (तस्वीरें)',
    'shareit/pictures'
  );

  // 9. Process SHAREit / videos
  console.log('Processing SHAREit / videos...');
  await processDirectory(
    path.join(SONY_SOURCE, 'SHAREit', 'videos'),
    'shareit',
    'SHAREit (शेयरइट मीडिया • SHAREit Files)',
    'shareit-videos',
    'SHAREit Videos (वीडियो)',
    'shareit/videos'
  );

  // 10. Process SHAREit / audios
  console.log('Processing SHAREit / audios...');
  await processDirectory(
    path.join(SONY_SOURCE, 'SHAREit', 'audios'),
    'shareit',
    'SHAREit (शेयरइट मीडिया • SHAREit Files)',
    'shareit-audios',
    'SHAREit Audios (संगीत व ऑडियो)',
    'shareit/audios'
  );

  // 11. Process hike / hike Images
  console.log('Processing hike / hike Images...');
  await processDirectory(
    path.join(SONY_SOURCE, 'hike', 'hike Images'),
    'hike',
    'hike (हाइक मैसेंजर • Hike Messenger)',
    'hike-images',
    'hike Images (हाइक तस्वीरें)',
    'hike/images'
  );

  // 12. Process hike / hike Profile Images
  console.log('Processing hike / hike Profile Images...');
  await processDirectory(
    path.join(SONY_SOURCE, 'hike', 'hike Profile Images'),
    'hike',
    'hike (हाइक मैसेंजर • Hike Messenger)',
    'hike-profile',
    'hike Profile Images (हाइक प्रोफाइल)',
    'hike/profile'
  );

  // 13. Process EyeEm
  console.log('Processing EyeEm...');
  await processDirectory(
    path.join(SONY_SOURCE, 'EyeEm'),
    'eyeem',
    'EyeEm (आईएम फोटो • EyeEm Photography)',
    'eyeem-all',
    'EyeEm Photography (आईएम तस्वीरें)',
    'eyeem'
  );

  // Compute live item counts
  for (const p of parentFolders) {
    p.itemCount = items.filter((i) => i.parentFolderId === p.id).length;
  }
  for (const s of subfolders) {
    s.itemCount = items.filter((i) => i.subfolderId === s.id).length;
  }

  // Cover image: prefer a nice camera photo
  const firstCameraPhoto = items.find((i) => i.type === 'image' && i.subfolderId === 'dcim-camera');
  const coverImage = firstCameraPhoto ? firstCameraPhoto.thumbnailUrl : '/video-poster.webp';

  // Update cover images for subfolders and parent folders
  for (const p of parentFolders) {
    const itemInP = items.find((i) => i.parentFolderId === p.id && i.type === 'image');
    if (itemInP) p.coverImage = itemInP.thumbnailUrl;
  }
  for (const s of subfolders) {
    const itemInS = items.find((i) => i.subfolderId === s.id && i.type === 'image');
    if (itemInS) s.coverImage = itemInS.thumbnailUrl;
  }

  const occasionData = {
    occasion: {
      id: 'sony-memories',
      title: 'स्मृति संकलन • Sony यादें (Sony Xperia Archive)',
      subtitle: 'सोनी एक्सपेरिया के पावन संस्मरण, कैमरे की तस्वीरें व व्हाट्सएप मीडिया • Sony Xperia Photographs, Camera Memories, WhatsApp Moments & Media (2016)',
      date: '2016 • Sony Xperia Collection',
      coverImage,
      parentFolders,
      subfolders,
      items
    }
  };

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(occasionData, null, 2), 'utf8');
  console.log(`Saved ${items.length} items to ${JSON_OUTPUT} successfully.`);
  console.log(`Parent folders: ${parentFolders.map(p => `${p.name}: ${p.itemCount}`).join(', ')}`);
}

processSony().catch((err) => {
  console.error('Fatal error during Sony processing:', err);
  process.exit(1);
});
