const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ZUK_SOURCE = 'D:\\Zuk';
const DEST_BASE = path.join(__dirname, '../public/albums/zuk');
const JSON_OUTPUT = path.join(__dirname, '../src/lib/zuk-album.json');

// Ensure destination directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Format duration if known, else 'Video'
function formatDuration(fileName, sizeBytes) {
  const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
  return `${mb} MB`;
}

// Clean title from filename
function cleanTitle(fileName) {
  return fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim();
}

async function processAll() {
  console.log('=== Starting ZUK Media Processing ===');
  console.log(`Source: ${ZUK_SOURCE}`);
  console.log(`Destination: ${DEST_BASE}`);

  ensureDir(DEST_BASE);

  // Folder configurations
  const parentFolders = [
    {
      id: 'iv2018',
      name: 'iv2018 (इंडस्ट्रियल विजिट • Industrial Visit)',
      localPath: 'D:\\Zuk\\iv2018',
      description: 'Memories and photos from the 2018 college educational tour and industrial visit',
      coverImage: '/albums/zuk/iv2018/thumb-00000IMG_00000_BURST20180104173550375_COVER.webp',
      itemCount: 0,
      subfolderIds: ['iv2018-all']
    },
    {
      id: 'nsscamp',
      name: 'nsscamp (एनएसएस कैम्प • NSS Camp)',
      localPath: 'D:\\Zuk\\nsscamp',
      description: 'National Service Scheme social camp activities, social initiatives, village interactions & cultural fun',
      coverImage: '/albums/zuk/nsscamp/thumb-IMG-20180104-WA0001.webp',
      itemCount: 0,
      subfolderIds: ['nsscamp-main', 'nsscamp-yaadkaregi']
    },
    {
      id: 'neha',
      name: 'neha (नेहा • Neha)',
      localPath: 'D:\\Zuk\\neha',
      description: 'Cherished portraits, celebrations, group photographs and videos',
      coverImage: '/albums/zuk/neha/thumb-IMG-20180114-WA0000.webp',
      itemCount: 0,
      subfolderIds: ['neha-all']
    },
    {
      id: 'Folder',
      name: 'Folder (वीडियो संग्रह • Video Archive)',
      localPath: 'D:\\Zuk\\Folder',
      description: 'Archive of video clips, youth memories, funny moments, and screencasts',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['folder-videos']
    },
    {
      id: 'resort',
      name: 'resort (रिसॉर्ट भ्रमण • Resort Outing)',
      localPath: 'D:\\Zuk\\resort',
      description: 'Outdoor portraits, poolside leisure, and scenic resort moments',
      coverImage: '/albums/zuk/resort/thumb-IMG20170103141656.webp',
      itemCount: 0,
      subfolderIds: ['resort-all']
    }
  ];

  const subfolders = [
    {
      id: 'iv2018-all',
      name: 'iv2018 (Photos)',
      parentId: 'iv2018',
      parentName: 'iv2018 (इंडस्ट्रियल विजिट • Industrial Visit)',
      localPath: 'D:\\Zuk\\iv2018',
      description: '222 photographs from the 2018 college industrial tour',
      coverImage: '/albums/zuk/iv2018/thumb-00000IMG_00000_BURST20180104173550375_COVER.webp',
      itemCount: 0
    },
    {
      id: 'nsscamp-main',
      name: 'NSS Camp (कैम्प स्मृतियाँ)',
      parentId: 'nsscamp',
      parentName: 'nsscamp (एनएसएस कैम्प • NSS Camp)',
      localPath: 'D:\\Zuk\\nsscamp',
      description: 'NSS Camp daily events, team bonding, volunteer activities & sports',
      coverImage: '/albums/zuk/nsscamp/thumb-IMG-20180104-WA0001.webp',
      itemCount: 0
    },
    {
      id: 'nsscamp-yaadkaregi',
      name: 'yaadkaregiduniuya (याद करेगी दुनिया)',
      parentId: 'nsscamp',
      parentName: 'nsscamp (एनएसएस कैम्प • NSS Camp)',
      localPath: 'D:\\Zuk\\nsscamp\\yaadkaregiduniuya',
      description: 'Special memories and video clips from yaadkaregiduniuya',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'neha-all',
      name: 'Neha Moments (तस्वीरें व वीडियो)',
      parentId: 'neha',
      parentName: 'neha (नेहा • Neha)',
      localPath: 'D:\\Zuk\\neha',
      description: 'Photos and celebration video clips with Neha',
      coverImage: '/albums/zuk/neha/thumb-IMG-20180114-WA0000.webp',
      itemCount: 0
    },
    {
      id: 'folder-videos',
      name: 'Videos (वीडियो संग्रह)',
      parentId: 'Folder',
      parentName: 'Folder (वीडियो संग्रह • Video Archive)',
      localPath: 'D:\\Zuk\\Folder',
      description: '25 high-definition video clips and screencasts from 2016-2018',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'resort-all',
      name: 'Resort Outing (रिसॉर्ट)',
      parentId: 'resort',
      parentName: 'resort (रिसॉर्ट भ्रमण • Resort Outing)',
      localPath: 'D:\\Zuk\\resort',
      description: 'Scenic holiday memories at the resort',
      coverImage: '/albums/zuk/resort/thumb-IMG20170103141656.webp',
      itemCount: 0
    }
  ];

  const items = [];

  // Helper to process directory
  async function processDir(dirPath, parentFolderId, parentFolderName, subfolderId, subfolderName, relativeTargetDir) {
    const targetDir = path.join(DEST_BASE, relativeTargetDir);
    ensureDir(targetDir);

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) continue;
      const fileName = entry.name;
      if (fileName.startsWith('.') || fileName.startsWith('._')) continue;

      const ext = path.extname(fileName).toLowerCase();
      const filePath = path.join(dirPath, fileName);
      const stat = fs.statSync(filePath);
      const baseName = path.basename(fileName, ext);

      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        const thumbName = `thumb-${baseName}.webp`;
        const mobileName = `mobile-${baseName}.webp`;
        const hdName = `hd-${baseName}.webp`;

        const thumbPath = path.join(targetDir, thumbName);
        const mobilePath = path.join(targetDir, mobileName);
        const hdPath = path.join(targetDir, hdName);

        // Process with sharp if not already processed
        if (!fs.existsSync(thumbPath)) {
          try {
            await sharp(filePath)
              .rotate()
              .resize(480, 480, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 70 })
              .toFile(thumbPath);
          } catch (e) {
            console.error(`Error processing thumb for ${fileName}:`, e.message);
          }
        }

        if (!fs.existsSync(mobilePath)) {
          try {
            await sharp(filePath)
              .rotate()
              .resize(1440, 1440, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 75 })
              .toFile(mobilePath);
          } catch (e) {
            console.error(`Error processing mobile for ${fileName}:`, e.message);
          }
        }

        if (!fs.existsSync(hdPath)) {
          try {
            await sharp(filePath)
              .rotate()
              .resize(3000, 3000, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 85 })
              .toFile(hdPath);
          } catch (e) {
            console.error(`Error processing hd for ${fileName}:`, e.message);
          }
        }

        const publicRelativePath = `/albums/zuk/${relativeTargetDir.replace(/\\/g, '/')}`;

        items.push({
          id: `zuk-${subfolderId}-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          title: cleanTitle(fileName),
          type: 'image',
          url: `${publicRelativePath}/${hdName}`,
          hdUrl: `${publicRelativePath}/${hdName}`,
          mobileUrl: `${publicRelativePath}/${mobileName}`,
          thumbnailUrl: `${publicRelativePath}/${thumbName}`,
          occasionId: 'zuk-memories',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: '2016–2018',
          fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`
        });
      } else if (ext === '.mp4') {
        // Copy MP4 file (never move or cut)
        const targetVideoPath = path.join(targetDir, fileName);
        if (!fs.existsSync(targetVideoPath)) {
          console.log(`Copying video: ${fileName} (${(stat.size / (1024 * 1024)).toFixed(1)} MB)...`);
          fs.copyFileSync(filePath, targetVideoPath);
        }

        const publicRelativePath = `/albums/zuk/${relativeTargetDir.replace(/\\/g, '/')}`;

        items.push({
          id: `zuk-${subfolderId}-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          title: cleanTitle(fileName),
          type: 'video',
          url: `${publicRelativePath}/${fileName}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'zuk-memories',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: '2016–2018',
          duration: formatDuration(fileName, stat.size),
          fileSize: `${(stat.size / (1024 * 1024)).toFixed(1)} MB`
        });
      }
    }
  }

  // 1. Process iv2018
  console.log('Processing iv2018...');
  await processDir(
    path.join(ZUK_SOURCE, 'iv2018'),
    'iv2018',
    'iv2018 (इंडस्ट्रियल विजिट • Industrial Visit)',
    'iv2018-all',
    'iv2018 (Photos)',
    'iv2018'
  );

  // 2. Process nsscamp root
  console.log('Processing nsscamp root...');
  await processDir(
    path.join(ZUK_SOURCE, 'nsscamp'),
    'nsscamp',
    'nsscamp (एनएसएस कैम्प • NSS Camp)',
    'nsscamp-main',
    'NSS Camp (कैम्प स्मृतियाँ)',
    'nsscamp'
  );

  // 3. Process nsscamp / yaadkaregiduniuya
  console.log('Processing nsscamp / yaadkaregiduniuya...');
  const yaadDir = path.join(ZUK_SOURCE, 'nsscamp', 'yaadkaregiduniuya');
  if (fs.existsSync(yaadDir)) {
    await processDir(
      yaadDir,
      'nsscamp',
      'nsscamp (एनएसएस कैम्प • NSS Camp)',
      'nsscamp-yaadkaregi',
      'yaadkaregiduniuya (याद करेगी दुनिया)',
      path.join('nsscamp', 'yaadkaregiduniuya')
    );
  }

  // 4. Process neha
  console.log('Processing neha...');
  await processDir(
    path.join(ZUK_SOURCE, 'neha'),
    'neha',
    'neha (नेहा • Neha)',
    'neha-all',
    'Neha Moments (तस्वीरें व वीडियो)',
    'neha'
  );

  // 5. Process Folder (videos)
  console.log('Processing Folder...');
  await processDir(
    path.join(ZUK_SOURCE, 'Folder'),
    'Folder',
    'Folder (वीडियो संग्रह • Video Archive)',
    'folder-videos',
    'Videos (वीडियो संग्रह)',
    'Folder'
  );

  // 6. Process resort
  console.log('Processing resort...');
  await processDir(
    path.join(ZUK_SOURCE, 'resort'),
    'resort',
    'resort (रिसॉर्ट भ्रमण • Resort Outing)',
    'resort-all',
    'Resort Outing (रिसॉर्ट)',
    'resort'
  );

  // Compute live counts
  for (const p of parentFolders) {
    p.itemCount = items.filter((i) => i.parentFolderId === p.id).length;
  }
  for (const s of subfolders) {
    s.itemCount = items.filter((i) => i.subfolderId === s.id).length;
  }

  // Determine cover image
  const firstPhoto = items.find((i) => i.type === 'image');
  const coverImage = firstPhoto ? firstPhoto.thumbnailUrl : '/video-poster.webp';

  const occasionData = {
    occasion: {
      id: 'zuk-memories',
      title: 'जीवन के सुनहरे पल • Zuk यादें (Zuk Memories)',
      subtitle: 'कॉलेज के पावन दिन, NSS कैम्प, टूर और युवावस्था के अनमोल क्षण • College Days, NSS Camp, Youth Memories & Tours (2016–2018)',
      date: '2016 – 2018 • Zuk Collection',
      coverImage: coverImage,
      parentFolders,
      subfolders,
      items
    }
  };

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(occasionData, null, 2), 'utf8');
  console.log(`Saved ${items.length} items to ${JSON_OUTPUT} successfully.`);
  console.log(`Parent folders: ${parentFolders.map(p => `${p.name}: ${p.itemCount}`).join(', ')}`);
}

processAll().catch((err) => {
  console.error('Fatal error during processing:', err);
  process.exit(1);
});
