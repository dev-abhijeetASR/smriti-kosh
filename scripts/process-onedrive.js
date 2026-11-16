const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const convert = require('heic-convert');

const ONEDRIVE_SOURCE = 'C:\\Users\\abhij\\OneDrive';
const DEST_BASE = path.join(__dirname, '../public/albums/onedrive');
const JSON_OUTPUT = path.join(__dirname, '../src/lib/onedrive-album.json');

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

function safeLinkOrCopy(src, dest) {
  if (fs.existsSync(dest)) return;
  try {
    fs.linkSync(src, dest);
  } catch (err) {
    fs.copyFileSync(src, dest);
  }
}

async function processOneDrive() {
  console.log('=== Starting OneDrive Processing ===');
  console.log(`Source: ${ONEDRIVE_SOURCE}`);
  console.log(`Destination: ${DEST_BASE}`);

  ensureDir(DEST_BASE);

  const parentFolders = [
    {
      id: 'trimbakeshwar',
      name: '🕉️ Trimbakeshwar (त्र्यंबकेश्वर ज्योतिर्लिंग दर्शन)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Trimbakeshwar',
      description: 'पवित्र त्र्यंबकेश्वर ज्योतिर्लिंग दर्शन, नासिक यात्रा के पावन क्षण एवं स्मृतियाँ',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['trimbakeshwar-root', 'trimbakeshwar-abhijeet']
    },
    {
      id: 'pictures',
      name: '📷 Pictures (सैमसंग गैलरी कैमरा • Samsung Gallery)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Pictures',
      description: 'Samsung Galaxy कैमरा से ली गई हाई-रेसोल्यूशन तस्वीरें',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['pictures-samsung']
    },
    {
      id: 'study',
      name: '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Study',
      description: 'ट्रेडिंग सेशंस, वीडियो रिकॉर्डिंग्स, चार्ट्स एवं तकनीकी विश्लेषण संग्रह',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['study-telegram-desktop', 'study-chatexport', 'study-wd-gann', 'study-root', 'study-telegram']
    },
    {
      id: 'financial-planning',
      name: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning',
      description: 'वित्तीय स्वतंत्रता (FIRE), रिटायरमेंट कैलक्यूलेटर, इंडेक्स स्ट्रैटेजी एवं होम लोन योजना',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['fin-root', 'fin-interior', 'fin-momentum-value', 'fin-nifty500', 'fin-nifty-midcap', 'fin-warikoo', 'fin-retire-rohit', 'fin-homeloan', 'fin-notes']
    },
    {
      id: 'documents',
      name: '📁 Documents (दस्तावेज़ एवं संदर्भ पुस्तकें)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Documents',
      description: 'महत्वपूर्ण नोटबुक, डीमैट विवरण एवं अनुशंसित पुस्तकें',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['docs-root', 'docs-berlin']
    },
    {
      id: 'ai',
      name: '🤖 AI (कृत्रिम बुद्धिमत्ता • AI Knowledge)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\AI',
      description: 'Oracle C2M Expert निर्देश एवं एआई प्रॉमप्ट्स',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['ai-root']
    },
    {
      id: 'root-vault',
      name: '📄 OneDrive Root (रूट फ़ाइलें)',
      localPath: 'C:\\Users\\abhij\\OneDrive',
      description: 'OneDrive के मुख्य रूट में स्थित फ़ाइलें',
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds: ['root-files']
    }
  ];

  const subfolders = [
    // 1. Trimbakeshwar
    {
      id: 'trimbakeshwar-root',
      name: 'Trimbakeshwar (त्र्यंबकेश्वर दर्शन मीडिया)',
      parentId: 'trimbakeshwar',
      parentName: '🕉️ Trimbakeshwar (त्र्यंबकेश्वर ज्योतिर्लिंग दर्शन)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Trimbakeshwar',
      description: 'WhatsApp से प्राप्त त्र्यंबकेश्वर यात्रा की तस्वीरें एवं वीडियो',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'trimbakeshwar-abhijeet',
      name: 'Abhijeet iPhone Capture (अभिजीत आईफोन फोटो एवं वीडियो)',
      parentId: 'trimbakeshwar',
      parentName: '🕉️ Trimbakeshwar (त्र्यंबकेश्वर ज्योतिर्लिंग दर्शन)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Trimbakeshwar\\Abhijeet',
      description: 'आईफोन कैमरे से कैप्चर की गई मूल हाई-रेसोल्यूशन HEIC तस्वीरें एवं MOV वीडियो',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // 2. Pictures
    {
      id: 'pictures-samsung',
      name: 'Samsung Gallery Camera (सैमसंग कैमरा तस्वीरें)',
      parentId: 'pictures',
      parentName: '📷 Pictures (सैमसंग गैलरी कैमरा • Samsung Gallery)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Pictures\\Samsung Gallery Camera',
      description: 'Samsung Gallery Camera से ली गई 4K तस्वीरें',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // 3. Study
    {
      id: 'study-telegram-desktop',
      name: 'Telegram Desktop (वीडियो लेक्चर्स एवं सेशंस)',
      parentId: 'study',
      parentName: '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Study\\Telegram Desktop',
      description: 'ट्रेडिंग क्लास लेक्चर्स, लाइव मार्केट रिकॉर्डिंग्स एवं वीडियो सेशंस',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'study-chatexport',
      name: 'ChatExport Charts & Audio (ट्रेडिंग चार्ट्स एवं वॉइस नोट्स)',
      parentId: 'study',
      parentName: '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Study\\Telegram Desktop\\ChatExport_D-2 (Temprory Group)',
      description: 'ट्रेडिंग ग्रुप चैट एक्सपोर्ट: चार्ट स्क्रीनशॉट्स, तस्वीरें एवं वॉइस नोट्स',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'study-wd-gann',
      name: 'WD Gann Knowledge (डब्ल्यू डी गैन ज्ञानकोष एवं दुर्लभ पुस्तकें)',
      parentId: 'study',
      parentName: '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Study\\WD Gann Knowledge',
      description: 'W.D. Gann मास्टर कोर्सेज, फोरकास्टिंग बुक्स एवं दुर्लभ अध्ययन सामग्री',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'study-root',
      name: 'Trading Notes & Analysis (ट्रेडिंग नोट्स एवं विश्लेषण)',
      parentId: 'study',
      parentName: '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Study',
      description: 'ट्रेडिंग नोट्स, पैटर्न डीप डाइव, निफ्टी 50 एनालिसिस एवं ट्रेडबुक्स',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'study-telegram',
      name: 'Telegram Files (टेलीग्राम दस्तावेज़)',
      parentId: 'study',
      parentName: '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Study\\Telegram',
      description: 'टेलीग्राम से डाउनलोड की गई अध्ययन फ़ाइलें',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // 4. Financial Planning
    {
      id: 'fin-root',
      name: 'Planning & Calculators (वित्तीय योजना एवं कैलक्यूलेटर)',
      parentId: 'financial-planning',
      parentName: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning',
      description: 'FIRE कैलक्यूलेटर, SWP वर्किंग, पर्सनल बजट एवं 3x3 मैट्रिक्स',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'fin-interior',
      name: 'Interior & Architecture (इंटीरियर एवं वास्तु)',
      parentId: 'financial-planning',
      parentName: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning\\Interior',
      description: 'ह्यूमन डायमेंशन इंटीरियर गाइड, बीओक्यू एवं इलेक्ट्रिकल चेकलिस्ट',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'fin-momentum-value',
      name: 'Momentum & Value Indices (मोमेंटम एवं वैल्यू ऐतिहासिक डेटा)',
      parentId: 'financial-planning',
      parentName: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning\\Momentum&Value',
      description: 'निफ्टी 50, 200, 500 मोमेंटम एवं वैल्यू ऐतिहासिक इंडेक्स डेटा (2006-2025)',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'fin-nifty500',
      name: 'Nifty 500 Momentum 50 (निफ्टी 500 मोमेंटम 50)',
      parentId: 'financial-planning',
      parentName: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning\\Nifty500Momentum50',
      description: 'निफ्टी 500 मोमेंटम 50 फैक्टशीट, स्टॉक लिस्ट एवं डेटा',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'fin-nifty-midcap',
      name: 'Nifty Midcap 150 Momentum 50 (निफ्टी मिडकैप 150 मोमेंटम 50)',
      parentId: 'financial-planning',
      parentName: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning\\NiftyMidcap150Momentum50',
      description: 'निफ्टी मिडकैप 150 मोमेंटम 50 फैक्टशीट एवं ऐतिहासिक डेटा',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'fin-warikoo',
      name: 'Ankur Warikoo Retirement (अंकुर वारिकू रिटायरमेंट प्लानर)',
      parentId: 'financial-planning',
      parentName: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning\\Ankur Warikoo',
      description: 'रिटायरमेंट फिगर गाइड एवं प्लानर टेम्पलेट',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'fin-retire-rohit',
      name: 'RetireWithRohit SWP (रिटायर विद रोहित SWP मॉडल्स)',
      parentId: 'financial-planning',
      parentName: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning\\RetireWithRohit',
      description: 'सिस्टमैटिक विद्ड्रॉल प्लान (SWP) एवं एक्सपेंस कैलक्यूलेटर',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'fin-homeloan',
      name: 'Home Loan ODHL (होम लोन एवं ईएमआई योजना)',
      parentId: 'financial-planning',
      parentName: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning\\HOMELOAN',
      description: 'ओवरड्राफ्ट होम लोन एवं ईएमआई वर्किंग शीट',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'fin-notes',
      name: 'Financial Notes (क्रेडिट कार्ड एवं वित्तीय नोट्स)',
      parentId: 'financial-planning',
      parentName: '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\FinanacialPlanning\\Notes',
      description: 'क्रेडिट कार्ड रणनीतियां एवं वित्तीय नोट्स',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // 5. Documents
    {
      id: 'docs-root',
      name: 'Personal Documents (व्यक्तिगत दस्तावेज़ एवं नोट्स)',
      parentId: 'documents',
      parentName: '📁 Documents (दस्तावेज़ एवं संदर्भ पुस्तकें)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Documents',
      description: 'अभिजीत नोटबुक, डीमैट डिटेल्स, ऑर्डरफ्लो नोट्स एवं म्यूचुअल फंड्स',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    {
      id: 'docs-berlin',
      name: 'Berlin Recommended Books (बर्लिन अनुशंसित ट्रेडिंग पुस्तकें)',
      parentId: 'documents',
      parentName: '📁 Documents (दस्तावेज़ एवं संदर्भ पुस्तकें)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\Documents\\BerlinRecommendedBooks',
      description: 'मार्केट विजार्ड्स, डब्ल्यू डी गैन एवं स्ट्रीट स्मार्ट्स क्लासिक बुक्स',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // 6. AI
    {
      id: 'ai-root',
      name: 'Oracle C2M Expert (ओरेकल C2M एक्सपर्ट नोट्स)',
      parentId: 'ai',
      parentName: '🤖 AI (कृत्रिम बुद्धिमत्ता • AI Knowledge)',
      localPath: 'C:\\Users\\abhij\\OneDrive\\AI',
      description: 'ओरेकल कस्टमर टू मीटर (C2M) एक्सपर्ट सिस्टम प्रॉमप्ट एवं आर्किटेक्चर',
      coverImage: '/video-poster.webp',
      itemCount: 0
    },
    // 7. Root Files
    {
      id: 'root-files',
      name: 'Root Files (रूट फ़ाइलें)',
      parentId: 'root-vault',
      parentName: '📄 OneDrive Root (रूट फ़ाइलें)',
      localPath: 'C:\\Users\\abhij\\OneDrive',
      description: 'मुख्य OneDrive फोल्डर में स्थित दस्तावेज़ (FlyAshBricks)',
      coverImage: '/video-poster.webp',
      itemCount: 0
    }
  ];

  const items = [];

  async function processFiles(fileList, parentFolderId, parentFolderName, subfolderId, subfolderName, relativeTargetDir, dateStr = '2023-2026') {
    const targetDir = path.join(DEST_BASE, relativeTargetDir);
    ensureDir(targetDir);

    for (const fullPath of fileList) {
      if (!fs.existsSync(fullPath)) continue;
      const fileName = path.basename(fullPath);
      if (fileName.startsWith('.') || fileName.startsWith('~$') || fileName === 'desktop.ini' || fileName.endsWith('.lnk')) {
        continue;
      }

      const ext = path.extname(fileName).toLowerCase();
      const baseName = path.basename(fileName, ext);
      const stat = fs.statSync(fullPath);
      const cleanBaseId = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const uniqueId = `onedrive-${subfolderId}-${cleanBaseId}`.slice(0, 100);

      const publicRelativePath = `/albums/onedrive/${relativeTargetDir.replace(/\\/g, '/')}`;

      if (['.jpg', '.jpeg', '.png', '.heic', '.webp'].includes(ext)) {
        const thumbName = `thumb-${baseName}.webp`;
        const mobileName = `mobile-${baseName}.webp`;
        const hdName = `hd-${baseName}.webp`;

        const thumbPath = path.join(targetDir, thumbName);
        const mobilePath = path.join(targetDir, mobileName);
        const hdPath = path.join(targetDir, hdName);

        let processSuccess = true;

        if (ext === '.heic') {
          try {
            const inputBuffer = fs.readFileSync(fullPath);
            const jpegBuffer = await convert({
              buffer: inputBuffer,
              format: 'JPEG',
              quality: 0.9
            });

            if (!fs.existsSync(thumbPath)) {
              await sharp(jpegBuffer)
                .rotate()
                .resize(480, 480, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 70 })
                .toFile(thumbPath);
            }
            if (!fs.existsSync(mobilePath)) {
              await sharp(jpegBuffer)
                .rotate()
                .resize(1440, 1440, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 75 })
                .toFile(mobilePath);
            }
            if (!fs.existsSync(hdPath)) {
              await sharp(jpegBuffer)
                .rotate()
                .resize(3000, 3000, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 85 })
                .toFile(hdPath);
            }
            processSuccess = true;
          } catch (e) {
            console.error(`HEIC conversion failed for ${fileName}:`, e.message);
            processSuccess = false;
          }
        } else {
          if (!fs.existsSync(thumbPath)) {
            try {
              await sharp(fullPath)
                .rotate()
                .resize(480, 480, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 70 })
                .toFile(thumbPath);
            } catch (e) {
              console.error(`Thumb conversion failed for ${fileName}:`, e.message);
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
              console.error(`Mobile conversion failed for ${fileName}:`, e.message);
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
              console.error(`HD conversion failed for ${fileName}:`, e.message);
              processSuccess = false;
            }
          }
        }

        if (processSuccess) {
          items.push({
            id: uniqueId,
            title: cleanTitle(fileName),
            type: 'image',
            url: `${publicRelativePath}/${hdName}`,
            hdUrl: `${publicRelativePath}/${hdName}`,
            mobileUrl: `${publicRelativePath}/${mobileName}`,
            thumbnailUrl: `${publicRelativePath}/${thumbName}`,
            occasionId: 'onedrive-archive',
            parentFolderId,
            parentFolderName,
            subfolderId,
            subfolderName,
            date: dateStr,
            fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
            fileExtension: ext
          });
        } else {
          // Fallback: Link/Copy raw image
          const fallbackDest = path.join(targetDir, fileName);
          safeLinkOrCopy(fullPath, fallbackDest);
          items.push({
            id: uniqueId,
            title: cleanTitle(fileName),
            type: 'image',
            url: `${publicRelativePath}/${fileName}`,
            hdUrl: `${publicRelativePath}/${fileName}`,
            mobileUrl: `${publicRelativePath}/${fileName}`,
            thumbnailUrl: `${publicRelativePath}/${fileName}`,
            occasionId: 'onedrive-archive',
            parentFolderId,
            parentFolderName,
            subfolderId,
            subfolderName,
            date: dateStr,
            fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
            fileExtension: ext
          });
        }
      } else if (['.mp4', '.mov', '.mkv'].includes(ext)) {
        const destVideoPath = path.join(targetDir, fileName);
        safeLinkOrCopy(fullPath, destVideoPath);

        items.push({
          id: uniqueId,
          title: cleanTitle(fileName),
          type: 'video',
          url: `${publicRelativePath}/${fileName}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'onedrive-archive',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: dateStr,
          duration: formatDuration(stat.size),
          fileSize: `${(stat.size / (1024 * 1024)).toFixed(1)} MB`,
          fileExtension: ext
        });
      } else if (['.ogg', '.mp3', '.m4a', '.aac', '.opus', '.amr'].includes(ext)) {
        const destAudioPath = path.join(targetDir, fileName);
        safeLinkOrCopy(fullPath, destAudioPath);

        items.push({
          id: uniqueId,
          title: cleanTitle(fileName),
          type: 'video', // Playable via HTML5 video/audio player
          url: `${publicRelativePath}/${fileName}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'onedrive-archive',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: dateStr,
          duration: formatDuration(stat.size),
          fileSize: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
          fileExtension: ext
        });
      } else {
        // Documents: pdf, docx, xlsx, pptx, csv, md, txt, etc.
        const destDocPath = path.join(targetDir, fileName);
        safeLinkOrCopy(fullPath, destDocPath);

        items.push({
          id: uniqueId,
          title: cleanTitle(fileName),
          type: 'document',
          url: `${publicRelativePath}/${fileName}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'onedrive-archive',
          parentFolderId,
          parentFolderName,
          subfolderId,
          subfolderName,
          date: dateStr,
          fileSize: stat.size > 1024 * 1024 
            ? `${(stat.size / (1024 * 1024)).toFixed(2)} MB` 
            : `${(stat.size / 1024).toFixed(1)} KB`,
          fileExtension: ext
        });
      }
    }
  }

  function getDirectFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(e => e.isFile())
      .map(e => path.join(dir, e.name));
  }

  function getAllFilesRecursive(dir) {
    if (!fs.existsSync(dir)) return [];
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        results.push(...getAllFilesRecursive(full));
      } else if (e.isFile()) {
        results.push(full);
      }
    }
    return results;
  }

  // 1. Trimbakeshwar Root
  console.log('1. Processing Trimbakeshwar Root...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'Trimbakeshwar')),
    'trimbakeshwar',
    '🕉️ Trimbakeshwar (त्र्यंबकेश्वर ज्योतिर्लिंग दर्शन)',
    'trimbakeshwar-root',
    'Trimbakeshwar (त्र्यंबकेश्वर दर्शन मीडिया)',
    'trimbakeshwar/root',
    'Dec 2023'
  );

  // 2. Trimbakeshwar Abhijeet (iPhone HEIC + MOV)
  console.log('2. Processing Trimbakeshwar Abhijeet iPhone HEIC...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'Trimbakeshwar', 'Abhijeet')),
    'trimbakeshwar',
    '🕉️ Trimbakeshwar (त्र्यंबकेश्वर ज्योतिर्लिंग दर्शन)',
    'trimbakeshwar-abhijeet',
    'Abhijeet iPhone Capture (अभिजीत आईफोन फोटो एवं वीडियो)',
    'trimbakeshwar/abhijeet',
    'Dec 2023'
  );

  // 3. Pictures / Samsung Gallery Camera
  console.log('3. Processing Pictures / Samsung Gallery Camera...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'Pictures', 'Samsung Gallery Camera')),
    'pictures',
    '📷 Pictures (सैमसंग गैलरी कैमरा • Samsung Gallery)',
    'pictures-samsung',
    'Samsung Gallery Camera (सैमसंग कैमरा तस्वीरें)',
    'pictures/samsung',
    'Aug-Oct 2025'
  );

  // 4. Study / Telegram Desktop (Direct files: videos and docs)
  console.log('4. Processing Study / Telegram Desktop...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'Study', 'Telegram Desktop')),
    'study',
    '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
    'study-telegram-desktop',
    'Telegram Desktop (वीडियो लेक्चर्स एवं सेशंस)',
    'study/telegram-desktop',
    '2023-2026'
  );

  // 5. Study / ChatExport
  console.log('5. Processing Study / ChatExport (Charts & Audio)...');
  await processFiles(
    getAllFilesRecursive(path.join(ONEDRIVE_SOURCE, 'Study', 'Telegram Desktop', 'ChatExport_D-2 (Temprory Group)')),
    'study',
    '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
    'study-chatexport',
    'ChatExport Charts & Audio (ट्रेडिंग चार्ट्स एवं वॉइस नोट्स)',
    'study/chatexport',
    '2023-2026'
  );

  // 6. Study / WD Gann Knowledge
  console.log('6. Processing Study / WD Gann Knowledge...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'Study', 'WD Gann Knowledge')),
    'study',
    '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
    'study-wd-gann',
    'WD Gann Knowledge (डब्ल्यू डी गैन ज्ञानकोष एवं दुर्लभ पुस्तकें)',
    'study/wd-gann',
    '2023-2026'
  );

  // 7. Study / Root Files
  console.log('7. Processing Study / Root Files...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'Study')),
    'study',
    '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
    'study-root',
    'Trading Notes & Analysis (ट्रेडिंग नोट्स एवं विश्लेषण)',
    'study/root',
    '2023-2026'
  );

  // 8. Study / Telegram
  console.log('8. Processing Study / Telegram...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'Study', 'Telegram')),
    'study',
    '📚 Study (अध्ययन, ट्रेडिंग एवं वीडियो लेक्चर्स)',
    'study-telegram',
    'Telegram Files (टेलीग्राम दस्तावेज़)',
    'study/telegram',
    '2023-2026'
  );

  // 9. Financial Planning Root
  console.log('9. Processing Financial Planning Root...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'FinanacialPlanning')),
    'financial-planning',
    '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
    'fin-root',
    'Planning & Calculators (वित्तीय योजना एवं कैलक्यूलेटर)',
    'financial-planning/root',
    '2023-2026'
  );

  // 10. Financial Planning / Interior
  console.log('10. Processing Financial Planning / Interior...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'FinanacialPlanning', 'Interior')),
    'financial-planning',
    '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
    'fin-interior',
    'Interior & Architecture (इंटीरियर एवं वास्तु)',
    'financial-planning/interior',
    '2023-2026'
  );

  // 11. Financial Planning / Momentum&Value
  console.log('11. Processing Financial Planning / Momentum&Value...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'FinanacialPlanning', 'Momentum&Value')),
    'financial-planning',
    '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
    'fin-momentum-value',
    'Momentum & Value Indices (मोमेंटम एवं वैल्यू ऐतिहासिक डेटा)',
    'financial-planning/momentum-value',
    '2006-2025'
  );

  // 12. Financial Planning / Nifty500Momentum50
  console.log('12. Processing Financial Planning / Nifty500Momentum50...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'FinanacialPlanning', 'Nifty500Momentum50')),
    'financial-planning',
    '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
    'fin-nifty500',
    'Nifty 500 Momentum 50 (निफ्टी 500 मोमेंटम 50)',
    'financial-planning/nifty500',
    '2023-2026'
  );

  // 13. Financial Planning / NiftyMidcap150Momentum50
  console.log('13. Processing Financial Planning / NiftyMidcap150Momentum50...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'FinanacialPlanning', 'NiftyMidcap150Momentum50')),
    'financial-planning',
    '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
    'fin-nifty-midcap',
    'Nifty Midcap 150 Momentum 50 (निफ्टी मिडकैप 150 मोमेंटम 50)',
    'financial-planning/nifty-midcap',
    '2023-2026'
  );

  // 14. Financial Planning / Ankur Warikoo
  console.log('14. Processing Financial Planning / Ankur Warikoo...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'FinanacialPlanning', 'Ankur Warikoo')),
    'financial-planning',
    '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
    'fin-warikoo',
    'Ankur Warikoo Retirement (अंकुर वारिकू रिटायरमेंट प्लानर)',
    'financial-planning/warikoo',
    '2023-2026'
  );

  // 15. Financial Planning / RetireWithRohit
  console.log('15. Processing Financial Planning / RetireWithRohit...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'FinanacialPlanning', 'RetireWithRohit')),
    'financial-planning',
    '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
    'fin-retire-rohit',
    'RetireWithRohit SWP (रिटायर विद रोहित SWP मॉडल्स)',
    'financial-planning/retire-rohit',
    '2023-2026'
  );

  // 16. Financial Planning / HOMELOAN
  console.log('16. Processing Financial Planning / HOMELOAN...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'FinanacialPlanning', 'HOMELOAN')),
    'financial-planning',
    '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
    'fin-homeloan',
    'Home Loan ODHL (होम लोन एवं ईएमआई योजना)',
    'financial-planning/homeloan',
    '2023-2026'
  );

  // 17. Financial Planning / Notes
  console.log('17. Processing Financial Planning / Notes...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'FinanacialPlanning', 'Notes')),
    'financial-planning',
    '📊 FinanacialPlanning (वित्तीय योजना एवं निवेश मॉडल्स)',
    'fin-notes',
    'Financial Notes (क्रेडिट कार्ड एवं वित्तीय नोट्स)',
    'financial-planning/notes',
    '2023-2026'
  );

  // 18. Documents Root
  console.log('18. Processing Documents Root...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'Documents')),
    'documents',
    '📁 Documents (दस्तावेज़ एवं संदर्भ पुस्तकें)',
    'docs-root',
    'Personal Documents (व्यक्तिगत दस्तावेज़ एवं नोट्स)',
    'documents/root',
    '2023-2026'
  );

  // 19. Documents / BerlinRecommendedBooks
  console.log('19. Processing Documents / BerlinRecommendedBooks...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'Documents', 'BerlinRecommendedBooks')),
    'documents',
    '📁 Documents (दस्तावेज़ एवं संदर्भ पुस्तकें)',
    'docs-berlin',
    'Berlin Recommended Books (बर्लिन अनुशंसित ट्रेडिंग पुस्तकें)',
    'documents/berlin',
    '2023-2026'
  );

  // 20. AI Root
  console.log('20. Processing AI Root...');
  await processFiles(
    getDirectFiles(path.join(ONEDRIVE_SOURCE, 'AI')),
    'ai',
    '🤖 AI (कृत्रिम बुद्धिमत्ता • AI Knowledge)',
    'ai-root',
    'Oracle C2M Expert (ओरेकल C2M एक्सपर्ट नोट्स)',
    'ai/root',
    '2026'
  );

  // 21. OneDrive Root Files
  console.log('21. Processing OneDrive Root Files...');
  await processFiles(
    getDirectFiles(ONEDRIVE_SOURCE),
    'root-vault',
    '📄 OneDrive Root (रूट फ़ाइलें)',
    'root-files',
    'Root Files (रूट फ़ाइलें)',
    'root/files',
    '2022-2026'
  );

  // Update Item Counts & Cover Images
  for (const sub of subfolders) {
    const subItems = items.filter(it => it.subfolderId === sub.id);
    sub.itemCount = subItems.length;

    const firstImage = subItems.find(it => it.type === 'image' && it.thumbnailUrl);
    if (firstImage) {
      sub.coverImage = firstImage.thumbnailUrl;
    }
  }

  for (const parent of parentFolders) {
    const parentItems = items.filter(it => it.parentFolderId === parent.id);
    parent.itemCount = parentItems.length;

    const firstImage = parentItems.find(it => it.type === 'image' && it.thumbnailUrl);
    if (firstImage) {
      parent.coverImage = firstImage.thumbnailUrl;
    }
  }

  // Find overall occasion cover image
  const firstOccasionImage = items.find(it => it.type === 'image' && it.thumbnailUrl);
  const coverImage = firstOccasionImage ? firstOccasionImage.thumbnailUrl : '/video-poster.webp';

  const occasionAlbum = {
    id: 'onedrive-archive',
    title: '☁️ क्लाउड संचयन • OneDrive (OneDrive Archive & Vault)',
    subtitle: 'त्र्यंबकेश्वर ज्योतिर्लिंग दर्शन, सैमसंग गैलरी कैमरा, ट्रेडिंग लेक्चर्स एवं अध्ययन ज्ञानकोष (2023–2026)',
    date: '2023–2026',
    coverImage,
    parentFolders,
    subfolders,
    items
  };

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify({ occasion: occasionAlbum }, null, 2), 'utf8');
  console.log(`\n🎉 Successfully processed OneDrive archive!`);
  console.log(`Total Media & Document Items: ${items.length}`);
  console.log(`Parent Folders: ${parentFolders.length}`);
  console.log(`Subfolders: ${subfolders.length}`);
  console.log(`Output saved to: ${JSON_OUTPUT}`);
}

processOneDrive().catch(err => {
  console.error('Fatal error during OneDrive processing:', err);
  process.exit(1);
});
