const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_BASE = 'D:\\pictures';
const DEST_BASE = path.join(__dirname, '../public/albums/pictures');
const JSON_OUTPUT = path.join(__dirname, '../src/lib/pictures-album.json');

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

function parseDateFromFileName(fileName, mtime) {
  // Try pattern YYYYMMDD
  const m1 = fileName.match(/(20\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/);
  if (m1) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(m1[3], 10)} ${months[parseInt(m1[2], 10) - 1]} ${m1[1]}`;
  }
  // Try pattern YYYY-MM-DD
  const m2 = fileName.match(/(20\d\d)[-_](0[1-9]|1[0-2])[-_](0[1-9]|[12]\d|3[01])/);
  if (m2) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${parseInt(m2[3], 10)} ${months[parseInt(m2[2], 10) - 1]} ${m2[1]}`;
  }
  // Fallback to mtime
  if (mtime) {
    const d = new Date(mtime);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  return '2021';
}

async function processPictures() {
  console.log('=== Starting Pictures Media Processing ===');
  console.log(`Source: ${SOURCE_BASE}`);
  console.log(`Destination: ${DEST_BASE}`);

  ensureDir(DEST_BASE);

  const parentFolders = [
    {
      id: 'beach-canon',
      name: 'beach_CANON (समुद्र तट छायाचित्र • Canon DSLR Beach Photography)',
      localPath: 'D:\\pictures\\beach_CANON',
      description: 'High-resolution Canon DSLR photography captured at the beach (18 Megapixels)',
      coverImage: '/albums/pictures/beach_CANON/thumb-IMG_0093.webp',
      itemCount: 0,
      subfolderIds: ['beach-canon-all']
    },
    {
      id: 'pawna-camping',
      name: 'Pawna_Camping (पवना डैम कैम्पिंग • Pawna Lake Camping & Dam)',
      localPath: 'D:\\pictures\\Pawna_Camping',
      description: 'Scenic campsite, tent stays, evening bonfire, lake views & excursion videos',
      coverImage: '/albums/pictures/Pawna_Camping/thumb-IMG_20211109_123227.webp',
      itemCount: 0,
      subfolderIds: ['pawna-camping-root', 'pawna-dam-whatsapp', 'pawna-dam-videos']
    },
    {
      id: 'tcet',
      name: 'TCET (इंजीनियरिंग कॉलेज स्मृतियाँ • TCET College Days & Festivals)',
      localPath: 'D:\\pictures\\TCET',
      description: 'Thakur College of Engineering & Technology - Tie & Saree Days, Holi 2020, Traditional Days & celebrations',
      coverImage: '/albums/pictures/TCET/BE/TienSaree2k19/thumb-IMG_20190306_115049.webp',
      itemCount: 0,
      subfolderIds: [
        'tcet-be-clgholi2k20',
        'tcet-be-tiensaree2k19',
        'tcet-tie-sareeday-se',
        'tcet-tieday2018',
        'tcet-traditional2k19',
        'tcet-tie-saree-heart'
      ]
    },
    {
      id: 'shareit',
      name: 'Shareit (शेयरइट मीडिया • SHAREit Shared Files)',
      localPath: 'D:\\pictures\\Shareit',
      description: 'Photographs and videos shared via SHAREit transfer',
      coverImage: '/albums/pictures/Shareit/pictures/thumb-IMG_20170420_175051.webp',
      itemCount: 0,
      subfolderIds: ['shareit-pictures', 'shareit-videos']
    },
    {
      id: 'suryansh-birthday',
      name: "Suryansh's_1st_Birthday (सूर्यांश का प्रथम जन्मोत्सव • 1st Birthday Celebration)",
      localPath: "D:\\pictures\\Suryansh's_1st_Birthday",
      description: "Celebration memories, Canon DSLR high-resolution photography & party videos for Suryansh's 1st Birthday",
      coverImage: "/albums/pictures/Suryansh's_1st_Birthday/thumb-9N2A7606.webp",
      itemCount: 0,
      subfolderIds: ['suryansh-birthday-all']
    },
    {
      id: 'lalla',
      name: 'Lalla_310123 (लल्ला संस्मरण • Lalla Memories Jan 2023)',
      localPath: 'D:\\pictures\\Lalla_310123',
      description: 'Candid moments, baby portraits & WhatsApp memories of Lalla (Jan 2023)',
      coverImage: '/albums/pictures/Lalla_310123/thumb-IMG-20230131-WA0000.webp',
      itemCount: 0,
      subfolderIds: ['lalla-main', 'lalla-whatsapp']
    },
    {
      id: 'dcim',
      name: 'DCIM (कैमरा तस्वीरें • Camera Roll)',
      localPath: 'D:\\pictures\\DCIM',
      description: 'Camera photographs and mobile snapshots',
      coverImage: '/albums/pictures/DCIM/thumb-IMG_20180210_134015.webp',
      itemCount: 0,
      subfolderIds: ['dcim-all']
    },
    {
      id: 'nokia',
      name: "nokia's photos (नोकिया फोन तस्वीरें • Nokia Phone Captures)",
      localPath: "D:\\pictures\\nokia's photos",
      description: 'Classic nostalgic mobile photographs captured on Nokia phone',
      coverImage: "/albums/pictures/nokia's photos/thumb-Photo0001.webp",
      itemCount: 0,
      subfolderIds: ['nokia-photos-all']
    },
    {
      id: 'kanheri',
      name: 'kanheri (कान्हेरी गुफाएं • Kanheri Caves Exploration)',
      localPath: 'D:\\pictures\\kanheri',
      description: 'Excursion photos from Kanheri Caves, Sanjay Gandhi National Park',
      coverImage: '/albums/pictures/kanheri/thumb-IMG_20170420_174950.webp',
      itemCount: 0,
      subfolderIds: ['kanheri-all']
    },
    {
      id: 'bluetooth',
      name: 'bluetooth (ब्लूटूथ संग्रह • Bluetooth Received Media)',
      localPath: 'D:\\pictures\\bluetooth',
      description: 'Photos and media received via Bluetooth transfer',
      coverImage: '/albums/pictures/bluetooth/thumb-2016-03-22-13-32-11-677.webp',
      itemCount: 0,
      subfolderIds: ['bluetooth-all']
    },
    {
      id: 'mridul-wedding',
      name: 'MridulBhaiyaShaadiPics (मृदुल भैया विवाह • Mridul Bhaiya Wedding Memories)',
      localPath: 'D:\\pictures\\MridulBhaiyaShaadiPics',
      description: "Wedding ceremonies and family memories of Mridul Bhaiya's marriage",
      coverImage: '/albums/pictures/MridulBhaiyaShaadiPics/thumb-IMG-20180226-WA0001.webp',
      itemCount: 0,
      subfolderIds: ['mridul-wedding-all']
    },
    {
      id: 'xperia-pics',
      name: 'xperia pics (सोनी एक्सपेरिया तस्वीरें • Sony Xperia Photos)',
      localPath: 'D:\\pictures\\xperia pics',
      description: 'Photographs captured on Sony Xperia device',
      coverImage: '/albums/pictures/xperia pics/thumb-DSC_0001.webp',
      itemCount: 0,
      subfolderIds: ['xperia-pics-all']
    },
    {
      id: 'root-photos',
      name: 'Pictures Root (मुख्य चित्रावली • Portrait & Family Frames)',
      localPath: 'D:\\pictures',
      description: 'Framed portraits and memorable standalone pictures from root directory',
      coverImage: '/albums/pictures/root/thumb-AbhijeetSingh.webp',
      itemCount: 0,
      subfolderIds: ['pictures-root-all']
    }
  ];

  const subfolders = [
    // beach-canon
    {
      id: 'beach-canon-all',
      name: 'Beach Photography (समुद्र तट छायाचित्र • Canon 18MP)',
      parentId: 'beach-canon',
      parentName: 'beach_CANON (समुद्र तट छायाचित्र • Canon DSLR Beach Photography)',
      localPath: 'D:\\pictures\\beach_CANON',
      description: '23 High-resolution Canon DSLR beach photographs (5184x3456)',
      coverImage: '/albums/pictures/beach_CANON/thumb-IMG_0093.webp',
      itemCount: 0
    },
    // pawna-camping
    {
      id: 'pawna-camping-root',
      name: 'Pawna Camping (कैम्पिंग मुख्य तस्वीरें व वीडियो)',
      parentId: 'pawna-camping',
      parentName: 'Pawna_Camping (पवना डैम कैम्पिंग • Pawna Lake Camping & Dam)',
      localPath: 'D:\\pictures\\Pawna_Camping',
      description: '62 Lake campsite photographs, sunset scenes & direct video clips',
      coverImage: '/albums/pictures/Pawna_Camping/thumb-IMG_20211109_123227.webp',
      itemCount: 0
    },
    {
      id: 'pawna-dam-whatsapp',
      name: 'Pawna Dam WhatsApp (पवना डैम व्हाट्सएप तस्वीरें)',
      parentId: 'pawna-camping',
      parentName: 'Pawna_Camping (पवना डैम कैम्पिंग • Pawna Lake Camping & Dam)',
      localPath: 'D:\\pictures\\Pawna_Camping\\PawnaDam_Whatsapp\\PawnaDam',
      description: '124 WhatsApp photos of friends and campsite moments at Pawna Dam',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'pawna-dam-videos',
      name: 'Pawna Dam Videos (पवना डैम वीडियो रिकॉर्डिंग्स)',
      parentId: 'pawna-camping',
      parentName: 'Pawna_Camping (पवna डैम कैम्पिंग • Pawna Lake Camping & Dam)',
      localPath: 'D:\\pictures\\Pawna_Camping\\PawnaDam_Whatsapp\\PawnaDamVideos',
      description: '44 Excursion videos, music & campfire moments at Pawna Dam',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // TCET
    {
      id: 'tcet-be-clgholi2k20',
      name: 'ClgHoli2k20 (होली उत्सव 2020)',
      parentId: 'tcet',
      parentName: 'TCET (इंजीनियरिंग कॉलेज स्मृतियाँ • TCET College Days & Festivals)',
      localPath: 'D:\\pictures\\TCET\\BE\\ClgHoli2k20',
      description: '20 College Holi festival celebrations in BE year (March 2020)',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'tcet-be-tiensaree2k19',
      name: 'TienSaree2k19 (टाई व साड़ी दिवस 2019)',
      parentId: 'tcet',
      parentName: 'TCET (इंजीनियरिंग कॉलेज स्मृतियाँ • TCET College Days & Festivals)',
      localPath: 'D:\\pictures\\TCET\\BE\\TienSaree2k19',
      description: '63 Formal tie & saree day celebrations in TE/BE year (2019)',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'tcet-tie-sareeday-se',
      name: 'TIE&SAREEDAY-SE (टाई एवं साड़ी डे - द्वितीय वर्ष)',
      parentId: 'tcet',
      parentName: 'TCET (इंजीनियरिंग कॉलेज स्मृतियाँ • TCET College Days & Festivals)',
      localPath: 'D:\\pictures\\TCET\\TIE&SAREEDAY-SE',
      description: '59 Second-year Tie & Saree Day college memories',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'tcet-tieday2018',
      name: 'tieday2018 (टाई दिवस 2018)',
      parentId: 'tcet',
      parentName: 'TCET (इंजीनियरिंग कॉलेज स्मृतियाँ • TCET College Days & Festivals)',
      localPath: 'D:\\pictures\\TCET\\tieday2018',
      description: '6 Classic Tie Day celebrations from 2018',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'tcet-traditional2k19',
      name: 'TRaditional2k19 (पारंपरिक परिधान दिवस 2019)',
      parentId: 'tcet',
      parentName: 'TCET (इंजीनियरिंग कॉलेज स्मृतियाँ • TCET College Days & Festivals)',
      localPath: 'D:\\pictures\\TCET\\TRaditional2k19',
      description: '32 Traditional Indian attire day celebrations at TCET (2019)',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'tcet-tie-saree-heart',
      name: '💓Tie_SareeDay2k19💓 (टाई व साड़ी दिवस 2019 स्मृति)',
      parentId: 'tcet',
      parentName: 'TCET (इंजीनियरिंग कॉलेज स्मृतियाँ • TCET College Days & Festivals)',
      localPath: 'D:\\pictures\\TCET\\💓Tie_SareeDay2k19💓',
      description: '7 Special portrait moments from Tie & Saree Day 2019',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Shareit
    {
      id: 'shareit-pictures',
      name: 'Pictures (शेयरइट तस्वीरें)',
      parentId: 'shareit',
      parentName: 'Shareit (शेयरइट मीडिया • SHAREit Shared Files)',
      localPath: 'D:\\pictures\\Shareit\\pictures',
      description: '112 Shared photographs received via SHAREit',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'shareit-videos',
      name: 'Videos (शेयरइट वीडियो रिकॉर्डिंग्स)',
      parentId: 'shareit',
      parentName: 'Shareit (शेयरइट मीडिया • SHAREit Shared Files)',
      localPath: 'D:\\pictures\\Shareit\\videos',
      description: '2 High-definition video recordings shared via SHAREit',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Suryansh 1st Birthday
    {
      id: 'suryansh-birthday-all',
      name: 'Birthday Celebrations (जन्मोत्सव समारोह • Canon DSLR)',
      parentId: 'suryansh-birthday',
      parentName: "Suryansh's_1st_Birthday (सूर्यांश का प्रथम जन्मोत्सव • 1st Birthday Celebration)",
      localPath: "D:\\pictures\\Suryansh's_1st_Birthday",
      description: "100 Photos and high-definition video memories of Suryansh's 1st Birthday",
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Lalla
    {
      id: 'lalla-main',
      name: 'Lalla Memories (लल्ला मुख्य संस्मरण)',
      parentId: 'lalla',
      parentName: 'Lalla_310123 (लल्ला संस्मरण • Lalla Memories Jan 2023)',
      localPath: 'D:\\pictures\\Lalla_310123',
      description: '21 Photos and memory package of Lalla (Jan 2023)',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'lalla-whatsapp',
      name: 'WhatsApp Media (व्हाट्सएप मीडिया संग्रह)',
      parentId: 'lalla',
      parentName: 'Lalla_310123 (लल्ला संस्मरण • Lalla Memories Jan 2023)',
      localPath: 'D:\\pictures\\Lalla_310123\\WhatsApp Unknown 2023-04-15 at 7.16.49 PM',
      description: '15 High-quality WhatsApp candid photos of Lalla',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // DCIM
    {
      id: 'dcim-all',
      name: 'Camera Photos (कैमरा तस्वीरें)',
      parentId: 'dcim',
      parentName: 'DCIM (कैमरा तस्वीरें • Camera Roll)',
      localPath: 'D:\\pictures\\DCIM',
      description: '79 Camera photographs and mobile snapshots',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Nokia
    {
      id: 'nokia-photos-all',
      name: 'Nokia Photos (नोकिया तस्वीरें)',
      parentId: 'nokia',
      parentName: "nokia's photos (नोकिया फोन तस्वीरें • Nokia Phone Captures)",
      localPath: "D:\\pictures\\nokia's photos",
      description: '66 Classic nostalgic mobile photos from Nokia device',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Kanheri
    {
      id: 'kanheri-all',
      name: 'Kanheri Caves (कान्हेरी गुफाएं)',
      parentId: 'kanheri',
      parentName: 'kanheri (कान्हेरी गुफाएं • Kanheri Caves Exploration)',
      localPath: 'D:\\pictures\\kanheri',
      description: '15 Excursion and nature photographs from Kanheri Caves',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Bluetooth
    {
      id: 'bluetooth-all',
      name: 'Bluetooth Media (ब्लूटूथ मीडिया)',
      parentId: 'bluetooth',
      parentName: 'bluetooth (ब्लूटूथ संग्रह • Bluetooth Received Media)',
      localPath: 'D:\\pictures\\bluetooth',
      description: '10 Photos received via Bluetooth file transfer',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Mridul Bhaiya Shaadi
    {
      id: 'mridul-wedding-all',
      name: 'Wedding Photographs (विवाह तस्वीरें)',
      parentId: 'mridul-wedding',
      parentName: 'MridulBhaiyaShaadiPics (मृदुल भैया विवाह • Mridul Bhaiya Wedding Memories)',
      localPath: 'D:\\pictures\\MridulBhaiyaShaadiPics',
      description: "5 Special wedding ceremony photos of Mridul Bhaiya's marriage",
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Xperia Pics
    {
      id: 'xperia-pics-all',
      name: 'Xperia Photos (एक्सपेरिया तस्वीरें)',
      parentId: 'xperia-pics',
      parentName: 'xperia pics (सोनी एक्सपेरिया तस्वीरें • Sony Xperia Photos)',
      localPath: 'D:\\pictures\\xperia pics',
      description: '2 Photographs captured on Sony Xperia mobile',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // Root Photos
    {
      id: 'pictures-root-all',
      name: 'Root Portraits (मुख्य तस्वीरें)',
      parentId: 'root-photos',
      parentName: 'Pictures Root (मुख्य चित्रावली • Portrait & Family Frames)',
      localPath: 'D:\\pictures',
      description: '4 Framed family portraits and standalone memorable pictures',
      coverImage: '/video-poster.webp',
      itemCount: 0
    }
  ];

  const items = [];

  // Helper to process directory files (non-recursive for that specific subfolder)
  async function processSubfolderFiles(dirPath, parentFolderId, parentFolderName, subfolderId, subfolderName, relativeTargetDir, isRootOnly = false) {
    if (!fs.existsSync(dirPath)) {
      console.warn(`Directory not found: ${dirPath}`);
      return;
    }

    const targetDir = path.join(DEST_BASE, relativeTargetDir);
    ensureDir(targetDir);

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    let firstCoverThumb = null;

    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Skip subdirectories here since each subfolder is explicitly mapped
        continue;
      }

      const fileName = entry.name;
      if (fileName.startsWith('.') || fileName.startsWith('._') || fileName === 'desktop.ini' || fileName.startsWith('~$')) {
        continue;
      }

      const fullPath = path.join(dirPath, fileName);
      const ext = path.extname(fileName).toLowerCase();
      const baseName = path.basename(fileName, ext);
      const stat = fs.statSync(fullPath);
      const cleanBaseId = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const uniqueId = `pic-${subfolderId}-${cleanBaseId}`.slice(0, 100);
      const publicRelativePath = `/albums/pictures/${relativeTargetDir.replace(/\\/g, '/')}`;

      const itemDate = parseDateFromFileName(fileName, stat.mtime);

      if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        // Photo processing
        const rawName = `raw-${fileName}`;
        const hdName = `hd-${baseName}.webp`;
        const mobileName = `mobile-${baseName}.webp`;
        const thumbName = `thumb-${baseName}.webp`;

        const rawPath = path.join(targetDir, rawName);
        const hdPath = path.join(targetDir, hdName);
        const mobilePath = path.join(targetDir, mobileName);
        const thumbPath = path.join(targetDir, thumbName);

        // 1. Copy original 100% untouched file for Ultra HD mode & full quality download
        if (!fs.existsSync(rawPath)) {
          try {
            fs.copyFileSync(fullPath, rawPath);
          } catch (e) {
            console.error(`Failed to copy raw file for ${fileName}:`, e.message);
          }
        }

        // 2. Generate Pristine Full-Resolution WebP (Quality 95, NO RESIZING)
        let processSuccess = true;
        let imgWidth = undefined;
        let imgHeight = undefined;

        if (!fs.existsSync(hdPath)) {
          try {
            const pipeline = sharp(fullPath, { failOn: 'none' }).rotate();
            const meta = await pipeline.metadata();
            imgWidth = meta.width;
            imgHeight = meta.height;
            await pipeline
              .webp({ quality: 95, effort: 4 })
              .toFile(hdPath);
          } catch (e) {
            console.error(`Failed to generate HD WebP for ${fileName}:`, e.message);
            processSuccess = false;
          }
        }

        // 3. Generate Mobile WebP (Quality 90, Max 2560px for high-res mobile)
        if (processSuccess && !fs.existsSync(mobilePath)) {
          try {
            await sharp(fullPath, { failOn: 'none' })
              .rotate()
              .resize(2560, 2560, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 90, effort: 4 })
              .toFile(mobilePath);
          } catch (e) {
            console.error(`Failed to generate mobile WebP for ${fileName}:`, e.message);
          }
        }

        // 4. Generate Thumbnail WebP (Quality 85, Max 480px for instant grid load)
        if (processSuccess && !fs.existsSync(thumbPath)) {
          try {
            await sharp(fullPath, { failOn: 'none' })
              .rotate()
              .resize(480, 480, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 85, effort: 4 })
              .toFile(thumbPath);
          } catch (e) {
            console.error(`Failed to generate thumb WebP for ${fileName}:`, e.message);
          }
        }

        const thumbUrl = `${publicRelativePath}/${thumbName}`;
        if (!firstCoverThumb && processSuccess) {
          firstCoverThumb = thumbUrl;
        }

        items.push({
          id: uniqueId,
          title: cleanTitle(fileName),
          type: 'image',
          url: `${publicRelativePath}/${hdName}`,
          hdUrl: `${publicRelativePath}/${rawName}`, // Exact untouched original file
          mobileUrl: `${publicRelativePath}/${mobileName}`,
          thumbnailUrl: thumbUrl,
          occasionId: 'life-pictures',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: itemDate,
          width: imgWidth,
          height: imgHeight,
          fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
          fileExtension: ext.replace('.', '').toUpperCase()
        });

      } else if (['.mp4', '.mov'].includes(ext)) {
        // Video processing
        const destVideoPath = path.join(targetDir, fileName);
        if (!fs.existsSync(destVideoPath)) {
          try {
            console.log(`Copying video: ${fileName} (${(stat.size / (1024 * 1024)).toFixed(1)} MB)...`);
            fs.copyFileSync(fullPath, destVideoPath);
          } catch (e) {
            console.error(`Failed to copy video ${fileName}:`, e.message);
          }
        }

        items.push({
          id: uniqueId,
          title: cleanTitle(fileName),
          type: 'video',
          url: `${publicRelativePath}/${fileName}`,
          hdUrl: `${publicRelativePath}/${fileName}`,
          mobileUrl: `${publicRelativePath}/${fileName}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'life-pictures',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: itemDate,
          fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
          fileExtension: ext.replace('.', '').toUpperCase()
        });

      } else if (['.zip'].includes(ext)) {
        // Zip archive document
        const destZipPath = path.join(targetDir, fileName);
        if (!fs.existsSync(destZipPath)) {
          try {
            fs.copyFileSync(fullPath, destZipPath);
          } catch (e) {
            console.error(`Failed to copy zip ${fileName}:`, e.message);
          }
        }

        items.push({
          id: uniqueId,
          title: cleanTitle(fileName),
          type: 'document',
          url: `${publicRelativePath}/${fileName}`,
          hdUrl: `${publicRelativePath}/${fileName}`,
          mobileUrl: `${publicRelativePath}/${fileName}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'life-pictures',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: itemDate,
          fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
          fileExtension: 'ZIP'
        });
      }
    }

    return firstCoverThumb;
  }

  // Execution mapping for each subfolder
  const mapping = [
    { subId: 'beach-canon-all', parentId: 'beach-canon', dir: 'D:\\pictures\\beach_CANON', rel: 'beach_CANON' },
    { subId: 'pawna-camping-root', parentId: 'pawna-camping', dir: 'D:\\pictures\\Pawna_Camping', rel: 'Pawna_Camping' },
    { subId: 'pawna-dam-whatsapp', parentId: 'pawna-camping', dir: 'D:\\pictures\\Pawna_Camping\\PawnaDam_Whatsapp\\PawnaDam', rel: 'Pawna_Camping/PawnaDam_Whatsapp/PawnaDam' },
    { subId: 'pawna-dam-videos', parentId: 'pawna-camping', dir: 'D:\\pictures\\Pawna_Camping\\PawnaDam_Whatsapp\\PawnaDamVideos', rel: 'Pawna_Camping/PawnaDam_Whatsapp/PawnaDamVideos' },
    { subId: 'tcet-be-clgholi2k20', parentId: 'tcet', dir: 'D:\\pictures\\TCET\\BE\\ClgHoli2k20', rel: 'TCET/BE/ClgHoli2k20' },
    { subId: 'tcet-be-tiensaree2k19', parentId: 'tcet', dir: 'D:\\pictures\\TCET\\BE\\TienSaree2k19', rel: 'TCET/BE/TienSaree2k19' },
    { subId: 'tcet-tie-sareeday-se', parentId: 'tcet', dir: 'D:\\pictures\\TCET\\TIE&SAREEDAY-SE', rel: 'TCET/TIE_SAREEDAY-SE' },
    { subId: 'tcet-tieday2018', parentId: 'tcet', dir: 'D:\\pictures\\TCET\\tieday2018', rel: 'TCET/tieday2018' },
    { subId: 'tcet-traditional2k19', parentId: 'tcet', dir: 'D:\\pictures\\TCET\\TRaditional2k19', rel: 'TCET/TRaditional2k19' },
    { subId: 'tcet-tie-saree-heart', parentId: 'tcet', dir: 'D:\\pictures\\TCET\\💓Tie_SareeDay2k19💓', rel: 'TCET/Tie_SareeDay2k19_Heart' },
    { subId: 'shareit-pictures', parentId: 'shareit', dir: 'D:\\pictures\\Shareit\\pictures', rel: 'Shareit/pictures' },
    { subId: 'shareit-videos', parentId: 'shareit', dir: 'D:\\pictures\\Shareit\\videos', rel: 'Shareit/videos' },
    { subId: 'suryansh-birthday-all', parentId: 'suryansh-birthday', dir: "D:\\pictures\\Suryansh's_1st_Birthday", rel: 'Suryansh_1st_Birthday' },
    { subId: 'lalla-main', parentId: 'lalla', dir: 'D:\\pictures\\Lalla_310123', rel: 'Lalla_310123' },
    { subId: 'lalla-whatsapp', parentId: 'lalla', dir: 'D:\\pictures\\Lalla_310123\\WhatsApp Unknown 2023-04-15 at 7.16.49 PM', rel: 'Lalla_310123/WhatsApp_Unknown' },
    { subId: 'dcim-all', parentId: 'dcim', dir: 'D:\\pictures\\DCIM', rel: 'DCIM' },
    { subId: 'nokia-photos-all', parentId: 'nokia', dir: "D:\\pictures\\nokia's photos", rel: 'nokia_photos' },
    { subId: 'kanheri-all', parentId: 'kanheri', dir: 'D:\\pictures\\kanheri', rel: 'kanheri' },
    { subId: 'bluetooth-all', parentId: 'bluetooth', dir: 'D:\\pictures\\bluetooth', rel: 'bluetooth' },
    { subId: 'mridul-wedding-all', parentId: 'mridul-wedding', dir: 'D:\\pictures\\MridulBhaiyaShaadiPics', rel: 'MridulBhaiyaShaadiPics' },
    { subId: 'xperia-pics-all', parentId: 'xperia-pics', dir: 'D:\\pictures\\xperia pics', rel: 'xperia_pics' },
    { subId: 'pictures-root-all', parentId: 'root-photos', dir: 'D:\\pictures', rel: 'root', isRootOnly: true }
  ];

  for (let i = 0; i < mapping.length; i++) {
    const map = mapping[i];
    const sub = subfolders.find(s => s.id === map.subId);
    const parent = parentFolders.find(p => p.id === map.parentId);

    console.log(`[${i + 1}/${mapping.length}] Processing subfolder: ${sub.name}...`);
    const coverThumb = await processSubfolderFiles(
      map.dir,
      parent.id,
      parent.name,
      sub.id,
      sub.name,
      map.rel,
      map.isRootOnly || false
    );

    if (coverThumb) {
      sub.coverImage = coverThumb;
      if (!parent.coverImage || parent.coverImage === '/video-poster.webp') {
        parent.coverImage = coverThumb;
      }
    }
  }

  // Update counts
  for (const parent of parentFolders) {
    const parentItems = items.filter(item => item.parentFolderId === parent.id);
    parent.itemCount = parentItems.length;
    if (parentItems.length > 0) {
      const firstImg = parentItems.find(it => it.type === 'image');
      if (firstImg) {
        parent.coverImage = firstImg.thumbnailUrl;
      }
    }
  }

  for (const sub of subfolders) {
    const subItems = items.filter(item => item.subfolderId === sub.id);
    sub.itemCount = subItems.length;
    if (subItems.length > 0) {
      const firstImg = subItems.find(it => it.type === 'image');
      if (firstImg) {
        sub.coverImage = firstImg.thumbnailUrl;
      }
    }
  }

  const albumData = {
    occasion: {
      id: 'life-pictures',
      title: 'चित्रावली • संजोई स्मृतियाँ (Cherished Pictures Archive)',
      subtitle: 'जीवन के अविस्मरणीय पड़ाव, महाविद्यालयीन उत्सव, पारिवारिक प्रसंग एवं पावन यात्राएं • TCET College Days, Pawna Camping, Family Milestones & Canon DSLR Photography',
      date: '2016 – 2023 • Life Milestones & Memories',
      coverImage: parentFolders[0].coverImage || '/video-poster.webp',
      parentFolders,
      subfolders,
      items
    }
  };

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(albumData, null, 2), 'utf-8');
  console.log(`\n=== Successfully processed ${items.length} total items! ===`);
  console.log(`JSON metadata saved to: ${JSON_OUTPUT}`);
}

processPictures().catch(err => {
  console.error('Processing failed with error:', err);
  process.exit(1);
});
