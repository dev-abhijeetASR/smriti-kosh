const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const GATE_SOURCE = 'D:\\GATE';
const DEST_BASE = path.join(__dirname, '../public/albums/gate');
const JSON_OUTPUT = path.join(__dirname, '../src/lib/gate-album.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanTitle(fileName) {
  return fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatFileSize(sizeBytes) {
  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }
  const mb = sizeBytes / (1024 * 1024);
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`;
  }
  return `${mb.toFixed(1)} MB`;
}

function detectMediaType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
    return { type: 'image', ext: ext.replace('.', '').toUpperCase() };
  }
  if (['.mp4', '.mkv', '.mov', '.flv', '.webm'].includes(ext)) {
    return { type: 'video', ext: ext.replace('.', '').toUpperCase() };
  }
  if (['.pdf', '.txt', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'].includes(ext)) {
    return { type: 'document', ext: ext.replace('.', '').toUpperCase() };
  }

  // Fallback magic byte check for truncated names (.MP, .m, or missing extensions)
  try {
    const fd = fs.openSync(filePath, 'r');
    const b = Buffer.alloc(16);
    fs.readSync(fd, b, 0, 16, 0);
    fs.closeSync(fd);

    if (b.toString('utf8').includes('ftyp') || (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70)) {
      return { type: 'video', ext: 'MP4' };
    }
    if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) {
      return { type: 'video', ext: 'MKV' };
    }
    if (b.toString('utf8', 0, 4) === '%PDF') {
      return { type: 'document', ext: 'PDF' };
    }
  } catch {}

  return { type: 'document', ext: ext ? ext.replace('.', '').toUpperCase() : 'DOC' };
}

// Hindi & English display metadata for all top-level directories
const PARENT_CONFIG = {
  '09Digital Logic and Design(DLDA)': {
    name: 'डिजिटल लॉजिक एवं डिजाइन • Digital Logic (DLDA)',
    description: 'लॉजिक गेट्स, बूलियन मिनिमाइजेशन, K-मैप, कॉम्बिनेशनल व सीक्वेंशियल सर्किट्स एवं नंबर सिस्टम्स'
  },
  '11.Discrete Mathematics': {
    name: 'विविक्त गणित • Discrete Mathematics',
    description: 'समुच्चय सिद्धांत (Sets), संबंध (Relations), लैटिस, ग्रुप थ्योरी, ग्राफ थ्योरी एवं जनक फलन'
  },
  'Algorithms': {
    name: 'एल्गोरिदम विश्लेषण एवं डिज़ाइन • Algorithms',
    description: 'समय एवं स्थान जटिलता (Asymptotic Analysis), सॉर्टिंग, सर्चिंग, डायनेमिक प्रोग्रामिंग एवं NP-पूर्णता'
  },
  'cn notes': {
    name: 'कंप्यूटर नेटवर्क्स हस्तलिखित नोट्स • CN Notes',
    description: 'कंप्यूटर नेटवर्क थ्योरी, प्रोटोकॉल स्टैक एवं सबनेटिंग के विस्तृत हस्तलिखित नोट्स'
  },
  'Compiler Design': {
    name: 'कंपाइलर डिज़ाइन • Compiler Design',
    description: 'लेक्सिकल एनालिसिस, पार्सिंग (LL/LR), सिंटैक्स निर्देशित अनुवाद (SDT), कोड जनरेशन एवं ऑप्टिमाइज़ेशन'
  },
  'Computer Networks': {
    name: 'कंप्यूटर नेटवर्क व्याख्यान • Computer Networks',
    description: 'IP एड्रेसिंग, फ्लो कंट्रोल, एरर डिटेक्शन, LAN, राउटिंग एल्गोरिदम, TCP/UDP एवं नेटवर्क सुरक्षा'
  },
  'Computer Organization': {
    name: 'कंप्यूटर संगठन एवं आर्किटेक्चर • COA',
    description: 'मशीन निर्देश, एड्रेसिंग मोड्स, ALU डेटापाथ, पाइपलाइनिंग, कैश मेमोरी एवं मेमोरी पदानुक्रम'
  },
  'Database Design(DBMS)': {
    name: 'डेटाबेस प्रबंधन प्रणाली • DBMS',
    description: 'ER मॉडल, रिलेशनल अलजेब्रा, SQL क्वेरीज़, नॉर्मलाइजेशन (BCNF), ट्रांजैक्शन एवं इंडेक्सिंग'
  },
  'GATE notes': {
    name: 'GATE संपूर्ण नोट्स एवं टेस्ट सीरीज़ • GATE Notes',
    description: 'मेड ईजी (Made Easy) हस्तलिखित नोट्स, गेट फोरम टेस्ट सीरीज़, कनोडिया वर्कबुक्स व मानक पुस्तकें'
  },
  'GateMaterial': {
    name: 'GATE अध्ययन सामग्री व प्रश्न पत्र • GateMaterial',
    description: 'स्कैन की गई पुस्तकें, पिछले वर्षों के प्रश्न पत्र (GATE 2019-2020) एवं आधिकारिक उत्तर कुंजी'
  },
  'maths': {
    name: 'इंजीनियरिंग गणित • Engineering Mathematics',
    description: 'रैखिक बीजगणित (Linear Algebra), कलन (Calculus), प्रायिकता (Probability) एवं संख्यात्मक विधियां'
  },
  'Operating Systems': {
    name: 'ऑपरेटिंग सिस्टम्स • Operating Systems',
    description: 'प्रोसेस शेड्यूलिंग, सिंक्रोनाइज़ेशन (Semaphores), डेडलॉक्स, वर्चुअल मेमोरी, पेजिंग एवं फाइल सिस्टम्स'
  },
  'Programming and Data Structures': {
    name: 'प्रोग्रामिंग एवं डेटा संरचनाएं • C & Data Structures',
    description: 'C भाषा (Pointers, Arrays, Strings), रिकर्सन, लिंक्ड लिस्ट, स्टैक, क्यू, ट्रीज़, ग्राफ्स एवं हैशिंग'
  },
  'Theory Of Computations': {
    name: 'गणना सिद्धांत • Theory of Computation (TOC)',
    description: 'परिमित ऑटोमेटा (DFA/NFA), रेगुलर एक्सप्रेशन्स, संदर्भ-मुक्त व्याकरण (CFG), ट्यूरिंग मशीन एवं अनिर्धारणीयता'
  },
  'Zform': {
    name: 'संक्षिप्त सूत्र पत्रक • Formula Sheets (Zform)',
    description: 'परीक्षा पूर्व त्वरित दोहराव हेतु संपूर्ण फॉर्मूला चार्ट्स, टेबल्स एवं सारांश'
  },
  'gate-root': {
    name: 'GATE स्कोरकार्ड, प्रवेश पत्र एवं कंपेंडियम • Scorecards & Identity',
    description: 'अभिजीत GATE स्कोरकार्ड 2020, क्लास आईडी कार्ड, GATE Compendium एवं परीक्षा प्रश्न पत्र'
  }
};

async function processGate() {
  console.log('=== Starting GATE Media & Educational Vault Processing ===');
  console.log(`Source: ${GATE_SOURCE}`);
  console.log(`Destination: ${DEST_BASE}`);

  ensureDir(DEST_BASE);

  const parentFolders = [];
  const subfolders = [];
  const items = [];

  let coverPhotoThumb = '/video-poster.webp';

  // 1. Process Root Files First
  const rootFiles = fs.readdirSync(GATE_SOURCE, { withFileTypes: true })
    .filter(f => !f.isDirectory());

  const rootParentId = 'gate-root';
  const rootSubId = 'gate-root-scorecards';

  parentFolders.push({
    id: rootParentId,
    name: PARENT_CONFIG['gate-root'].name,
    localPath: GATE_SOURCE,
    description: PARENT_CONFIG['gate-root'].description,
    coverImage: '/video-poster.webp',
    itemCount: 0,
    subfolderIds: [rootSubId]
  });

  subfolders.push({
    id: rootSubId,
    name: 'स्कोरकार्ड, आईडी एवं कंपेंडियम • Scorecards & ID',
    parentId: rootParentId,
    parentName: PARENT_CONFIG['gate-root'].name,
    localPath: GATE_SOURCE,
    description: 'अभिजीत GATE 2020 आधिकारिक स्कोरकार्ड, क्लास आईडी कार्ड एवं GATE Compendium',
    coverImage: '/video-poster.webp',
    itemCount: 0
  });

  for (const file of rootFiles) {
    const fullPath = path.join(GATE_SOURCE, file.name);
    const stat = fs.statSync(fullPath);
    const { type, ext } = detectMediaType(fullPath);
    const baseName = path.basename(file.name, path.extname(file.name));
    const cleanId = `gate-root-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 100);

    if (type === 'image') {
      // Process Abhijeet_Class_ID.jpeg with Sharp
      const rawName = `raw-${file.name}`;
      const hdName = `hd-${baseName}.webp`;
      const mobileName = `mobile-${baseName}.webp`;
      const thumbName = `thumb-${baseName}.webp`;

      const rawPath = path.join(DEST_BASE, rawName);
      const hdPath = path.join(DEST_BASE, hdName);
      const mobilePath = path.join(DEST_BASE, mobileName);
      const thumbPath = path.join(DEST_BASE, thumbName);

      if (!fs.existsSync(rawPath)) {
        fs.copyFileSync(fullPath, rawPath);
      }

      if (!fs.existsSync(hdPath)) {
        await sharp(fullPath, { failOn: 'none' })
          .rotate()
          .webp({ quality: 95, effort: 4 })
          .toFile(hdPath);
      }

      if (!fs.existsSync(mobilePath)) {
        await sharp(fullPath, { failOn: 'none' })
          .rotate()
          .resize(2560, 2560, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 90, effort: 4 })
          .toFile(mobilePath);
      }

      if (!fs.existsSync(thumbPath)) {
        await sharp(fullPath, { failOn: 'none' })
          .rotate()
          .resize(480, 480, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85, effort: 4 })
          .toFile(thumbPath);
      }

      coverPhotoThumb = `/albums/gate/${thumbName}`;

      items.push({
        id: cleanId,
        title: cleanTitle(file.name),
        type: 'image',
        url: `/albums/gate/${hdName}`,
        hdUrl: `/albums/gate/${rawName}`,
        mobileUrl: `/albums/gate/${mobileName}`,
        thumbnailUrl: `/albums/gate/${thumbName}`,
        occasionId: 'gate-archive',
        parentFolderId: rootParentId,
        parentFolderName: PARENT_CONFIG['gate-root'].name,
        subfolderId: rootSubId,
        subfolderName: 'स्कोरकार्ड, आईडी एवं कंपेंडियम • Scorecards & ID',
        date: '2020-2021',
        fileSize: formatFileSize(stat.size),
        fileExtension: ext
      });
    } else {
      // Document (Scorecards, Compendium)
      items.push({
        id: cleanId,
        title: cleanTitle(file.name),
        type,
        url: `/api/media?path=${encodeURIComponent(fullPath)}`,
        hdUrl: `/api/media?path=${encodeURIComponent(fullPath)}`,
        mobileUrl: `/api/media?path=${encodeURIComponent(fullPath)}`,
        thumbnailUrl: '/video-poster.webp',
        occasionId: 'gate-archive',
        parentFolderId: rootParentId,
        parentFolderName: PARENT_CONFIG['gate-root'].name,
        subfolderId: rootSubId,
        subfolderName: 'स्कोरकार्ड, आईडी एवं कंपेंडियम • Scorecards & ID',
        date: '2020-2021',
        fileSize: formatFileSize(stat.size),
        fileExtension: ext
      });
    }
  }

  // Set cover images
  parentFolders[0].coverImage = coverPhotoThumb;
  subfolders[0].coverImage = coverPhotoThumb;

  // 2. Process All 15 Subject Directories
  const topDirs = fs.readdirSync(GATE_SOURCE, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'PaxHeader')
    .map(d => d.name);

  for (const dirName of topDirs) {
    const parentId = `gate-${dirName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 80);
    const parentMeta = PARENT_CONFIG[dirName] || {
      name: `${dirName} (विषय व्याख्यान व नोट्स)`,
      description: `${dirName} व्याख्यान एवं संदर्भ सामग्री`
    };

    const dirPath = path.join(GATE_SOURCE, dirName);
    const subEntries = fs.readdirSync(dirPath, { withFileTypes: true });

    const childDirs = subEntries.filter(e => e.isDirectory() && e.name !== 'PaxHeader');
    const directFiles = subEntries.filter(e => !e.isDirectory() && e.name !== 'desktop.ini');

    const subfolderIds = [];

    // If there are direct files in this subject folder (e.g. cn notes, Zform, maths, GateMaterial)
    if (directFiles.length > 0) {
      const directSubId = `${parentId}-main`;
      subfolderIds.push(directSubId);

      subfolders.push({
        id: directSubId,
        name: `${dirName} (मुख्य व्याख्यान व नोट्स)`,
        parentId,
        parentName: parentMeta.name,
        localPath: dirPath,
        description: `${dirName} मुख्य अध्ययन सामग्री (${directFiles.length} फ़ाइलें)`,
        coverImage: '/video-poster.webp',
        itemCount: directFiles.length
      });

      for (const file of directFiles) {
        const fullPath = path.join(dirPath, file.name);
        const stat = fs.statSync(fullPath);
        const { type, ext } = detectMediaType(fullPath);
        const baseName = path.basename(file.name, path.extname(file.name));
        const cleanId = `${directSubId}-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 100);

        items.push({
          id: cleanId,
          title: cleanTitle(file.name),
          type,
          url: `/api/media?path=${encodeURIComponent(fullPath)}`,
          hdUrl: `/api/media?path=${encodeURIComponent(fullPath)}`,
          mobileUrl: `/api/media?path=${encodeURIComponent(fullPath)}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'gate-archive',
          parentFolderId: parentId,
          parentFolderName: parentMeta.name,
          subfolderId: directSubId,
          subfolderName: `${dirName} (मुख्य व्याख्यान व नोट्स)`,
          date: '2019-2021',
          fileSize: formatFileSize(stat.size),
          fileExtension: ext
        });
      }
    }

    // Process all subdirectories inside this subject folder
    for (const subDir of childDirs) {
      const subDirPath = path.join(dirPath, subDir.name);
      const subId = `${parentId}-${subDir.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 90);
      subfolderIds.push(subId);

      // Recursively collect all files under this subfolder (excluding PaxHeader)
      function getFilesRecursive(dir) {
        let results = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name === 'PaxHeader') continue;
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            results = results.concat(getFilesRecursive(full));
          } else {
            results.push(full);
          }
        }
        return results;
      }

      const subFiles = getFilesRecursive(subDirPath);

      subfolders.push({
        id: subId,
        name: subDir.name,
        parentId,
        parentName: parentMeta.name,
        localPath: subDirPath,
        description: `${subDir.name} व्याख्यान व अध्ययन सामग्री (${subFiles.length} फ़ाइलें)`,
        coverImage: '/video-poster.webp',
        itemCount: subFiles.length
      });

      for (const fullPath of subFiles) {
        const fileName = path.basename(fullPath);
        if (fileName === 'desktop.ini' || fileName.startsWith('~$')) continue;
        const stat = fs.statSync(fullPath);
        const { type, ext } = detectMediaType(fullPath);
        const baseName = path.basename(fileName, path.extname(fileName));
        const cleanId = `${subId}-${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 100);

        items.push({
          id: cleanId,
          title: cleanTitle(fileName),
          type,
          url: `/api/media?path=${encodeURIComponent(fullPath)}`,
          hdUrl: `/api/media?path=${encodeURIComponent(fullPath)}`,
          mobileUrl: `/api/media?path=${encodeURIComponent(fullPath)}`,
          thumbnailUrl: '/video-poster.webp',
          occasionId: 'gate-archive',
          parentFolderId: parentId,
          parentFolderName: parentMeta.name,
          subfolderId: subId,
          subfolderName: subDir.name,
          date: '2019-2021',
          fileSize: formatFileSize(stat.size),
          fileExtension: ext
        });
      }
    }

    parentFolders.push({
      id: parentId,
      name: parentMeta.name,
      localPath: dirPath,
      description: parentMeta.description,
      coverImage: '/video-poster.webp',
      itemCount: 0,
      subfolderIds
    });
  }

  // Update counts
  for (const parent of parentFolders) {
    const pItems = items.filter(it => it.parentFolderId === parent.id);
    parent.itemCount = pItems.length;
  }
  for (const sub of subfolders) {
    const sItems = items.filter(it => it.subfolderId === sub.id);
    sub.itemCount = sItems.length;
  }

  const albumData = {
    occasion: {
      id: 'gate-archive',
      title: 'ज्ञान कल्पतरु • GATE संगणक विज्ञान (GATE CS & IT Treasury)',
      subtitle: 'गेट कंप्यूटर साइंस एवं सूचना प्रौद्योगिकी संपूर्ण व्याख्यान, हस्तलिखित नोट्स, स्कोरकार्ड एवं टेस्ट सीरीज • GATE CS/IT Master Video Lectures, Made Easy Notes, Books & Scorecards',
      date: '2019 – 2021 • Academic Milestone & GATE Archive',
      coverImage: coverPhotoThumb,
      parentFolders,
      subfolders,
      items
    }
  };

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(albumData, null, 2), 'utf-8');
  console.log(`\n=== Successfully processed ${items.length} total GATE items! ===`);
  console.log(`Parent Folders: ${parentFolders.length}`);
  console.log(`Subfolders: ${subfolders.length}`);
  console.log(`JSON metadata saved to: ${JSON_OUTPUT}`);
}

processGate().catch(err => {
  console.error('GATE processing failed:', err);
  process.exit(1);
});
