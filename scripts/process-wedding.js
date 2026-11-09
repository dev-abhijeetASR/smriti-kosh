const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_ROOT = 'D:\\Videos And Movies\\SHAADI\\ShaadiMonu';
const DEST_ROOT = path.join(__dirname, '..', 'public', 'albums', 'shubh-vivah');

const PHOTO_FOLDERS = [
  { folder: 'HALDI', id: 'haldi', displayName: 'हल्दी समारोह (Haldi)', desc: 'Haldi ceremony rituals, auspicious turmeric application, and joy' },
  { folder: 'TILAK', id: 'tilak', displayName: 'तिलक समारोह (Tilak)', desc: 'Traditional Tilak ceremony, welcoming, blessings and shagun' },
  { folder: 'VIVAH', id: 'vivah', displayName: 'शुभ विवाह एवं फेरे (Vivah)', desc: 'The sacred wedding ceremony, saat phere, varmala and kanyadaan' },
];

const YOUTUBE_VIDEOS = [
  // Mom-Dad CD 1
  {
    id: 'mom-dad-cd1-1',
    title: 'माता-पिता पावन विवाह — CD 1 (Part 01)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=z-fJ1QA93CE',
    youtubeId: 'z-fJ1QA93CE',
    thumbnailUrl: 'https://img.youtube.com/vi/z-fJ1QA93CE/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'mom-dad',
    subfolderName: 'माता-पिता विवाह (Mom-Dad)',
    date: 'Mom-Dad Wedding',
    duration: 'Full Video',
    description: 'Cherished memories of Mom and Dad wedding recording — CD 1, Part 01.',
  },
  {
    id: 'mom-dad-cd1-2',
    title: 'माता-पिता पावन विवाह — CD 1 (Part 02)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=78iSzQpdGcE',
    youtubeId: '78iSzQpdGcE',
    thumbnailUrl: 'https://img.youtube.com/vi/78iSzQpdGcE/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'mom-dad',
    subfolderName: 'माता-पिता विवाह (Mom-Dad)',
    date: 'Mom-Dad Wedding',
    duration: 'Full Video',
    description: 'Cherished memories of Mom and Dad wedding recording — CD 1, Part 02.',
  },
  {
    id: 'mom-dad-cd1-3',
    title: 'माता-पिता पावन विवाह — CD 1 (Part 03)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=TL1d6DOEcYs',
    youtubeId: 'TL1d6DOEcYs',
    thumbnailUrl: 'https://img.youtube.com/vi/TL1d6DOEcYs/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'mom-dad',
    subfolderName: 'माता-पिता विवाह (Mom-Dad)',
    date: 'Mom-Dad Wedding',
    duration: 'Full Video',
    description: 'Cherished memories of Mom and Dad wedding recording — CD 1, Part 03.',
  },
  {
    id: 'mom-dad-cd1-4',
    title: 'माता-पिता पावन विवाह — CD 1 (Part 04)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=YTkRoOeivqo',
    youtubeId: 'YTkRoOeivqo',
    thumbnailUrl: 'https://img.youtube.com/vi/YTkRoOeivqo/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'mom-dad',
    subfolderName: 'माता-पिता विवाह (Mom-Dad)',
    date: 'Mom-Dad Wedding',
    duration: 'Full Video',
    description: 'Cherished memories of Mom and Dad wedding recording — CD 1, Part 04.',
  },
  // Mom-Dad CD 2
  {
    id: 'mom-dad-cd2-1',
    title: 'माता-पिता पावन विवाह — CD 2 (Part 01)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=xrNT2_CKUUE',
    youtubeId: 'xrNT2_CKUUE',
    thumbnailUrl: 'https://img.youtube.com/vi/xrNT2_CKUUE/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'mom-dad',
    subfolderName: 'माता-पिता विवाह (Mom-Dad)',
    date: 'Mom-Dad Wedding',
    duration: 'Full Video',
    description: 'Cherished memories of Mom and Dad wedding recording — CD 2, Part 01.',
  },
  {
    id: 'mom-dad-cd2-2',
    title: 'माता-पिता पावन विवाह — CD 2 (Part 02)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=FTaCaI5FXzM',
    youtubeId: 'FTaCaI5FXzM',
    thumbnailUrl: 'https://img.youtube.com/vi/FTaCaI5FXzM/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'mom-dad',
    subfolderName: 'माता-पिता विवाह (Mom-Dad)',
    date: 'Mom-Dad Wedding',
    duration: 'Full Video',
    description: 'Cherished memories of Mom and Dad wedding recording — CD 2, Part 02.',
  },
  // Shekhar Part 1
  {
    id: 'shekhar-p1-1',
    title: 'शेखर शुभ विवाह — Part 1 (Episode 01)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=v5tMaRB-6gA',
    youtubeId: 'v5tMaRB-6gA',
    thumbnailUrl: 'https://img.youtube.com/vi/v5tMaRB-6gA/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'shaadi-shekhar',
    subfolderName: 'शेखर विवाह (Shekhar)',
    date: 'Shekhar Vivah',
    duration: 'Full Video',
    description: 'Shekhar wedding recording — Part 1, Episode 01.',
  },
  {
    id: 'shekhar-p1-2',
    title: 'शेखर शुभ विवाह — Part 1 (Episode 02)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=6BKTiixag8I',
    youtubeId: '6BKTiixag8I',
    thumbnailUrl: 'https://img.youtube.com/vi/6BKTiixag8I/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'shaadi-shekhar',
    subfolderName: 'शेखर विवाह (Shekhar)',
    date: 'Shekhar Vivah',
    duration: 'Full Video',
    description: 'Shekhar wedding recording — Part 1, Episode 02.',
  },
  {
    id: 'shekhar-p1-3',
    title: 'शेखर शुभ विवाह — Part 1 (Episode 03)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=Kf5dUrrTD2M',
    youtubeId: 'Kf5dUrrTD2M',
    thumbnailUrl: 'https://img.youtube.com/vi/Kf5dUrrTD2M/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'shaadi-shekhar',
    subfolderName: 'शेखर विवाह (Shekhar)',
    date: 'Shekhar Vivah',
    duration: 'Full Video',
    description: 'Shekhar wedding recording — Part 1, Episode 03.',
  },
  // Shekhar Part 2
  {
    id: 'shekhar-p2-1',
    title: 'शेखर शुभ विवाह — Part 2 (Episode 01)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=91vSSPOCAeA',
    youtubeId: '91vSSPOCAeA',
    thumbnailUrl: 'https://img.youtube.com/vi/91vSSPOCAeA/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'shaadi-shekhar',
    subfolderName: 'शेखर विवाह (Shekhar)',
    date: 'Shekhar Vivah',
    duration: 'Full Video',
    description: 'Shekhar wedding recording — Part 2, Episode 01.',
  },
  {
    id: 'shekhar-p2-2',
    title: 'शेखर शुभ विवाह — Part 2 (Episode 02)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=_wKbwQ6CeQk',
    youtubeId: '_wKbwQ6CeQk',
    thumbnailUrl: 'https://img.youtube.com/vi/_wKbwQ6CeQk/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'shaadi-shekhar',
    subfolderName: 'शेखर विवाह (Shekhar)',
    date: 'Shekhar Vivah',
    duration: 'Full Video',
    description: 'Shekhar wedding recording — Part 2, Episode 02.',
  },
  {
    id: 'shekhar-p2-3',
    title: 'शेखर शुभ विवाह — Part 2 (Episode 03)',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=QXkWZb67wvg',
    youtubeId: 'QXkWZb67wvg',
    thumbnailUrl: 'https://img.youtube.com/vi/QXkWZb67wvg/hqdefault.jpg',
    occasionId: 'shubh-vivah',
    subfolderId: 'shaadi-shekhar',
    subfolderName: 'शेखर विवाह (Shekhar)',
    date: 'Shekhar Vivah',
    duration: 'Full Video',
    description: 'Shekhar wedding recording — Part 2, Episode 03.',
  },
];

async function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function processWedding() {
  console.log('--- Processing Wedding Photos & Videos ---');
  await ensureDir(DEST_ROOT);

  const subfoldersManifest = [
    {
      id: 'haldi',
      name: 'हल्दी समारोह (Haldi)',
      description: 'Haldi ceremony rituals, auspicious turmeric application, and joy',
      coverImage: '',
      itemCount: 0,
    },
    {
      id: 'tilak',
      name: 'तिलक समारोह (Tilak)',
      description: 'Traditional Tilak ceremony, welcoming, blessings and shagun',
      coverImage: '',
      itemCount: 0,
    },
    {
      id: 'vivah',
      name: 'शुभ विवाह एवं फेरे (Vivah)',
      description: 'The sacred wedding ceremony, saat phere, varmala and kanyadaan',
      coverImage: '',
      itemCount: 0,
    },
    {
      id: 'mom-dad',
      name: 'माता-पिता विवाह (Mom-Dad)',
      description: 'Golden wedding video memories of Mom and Dad (CD 1 & CD 2)',
      coverImage: 'https://img.youtube.com/vi/z-fJ1QA93CE/hqdefault.jpg',
      itemCount: 6,
    },
    {
      id: 'shaadi-shekhar',
      name: 'शेखर विवाह (Shekhar)',
      description: 'Shekhar wedding video recordings (Part 1 & Part 2)',
      coverImage: 'https://img.youtube.com/vi/v5tMaRB-6gA/hqdefault.jpg',
      itemCount: 6,
    },
  ];

  const allItems = [...YOUTUBE_VIDEOS];

  // Process photos from HALDI, TILAK, VIVAH
  for (const cfg of PHOTO_FOLDERS) {
    const srcDir = path.join(SOURCE_ROOT, cfg.folder);
    const destDir = path.join(DEST_ROOT, cfg.id);
    await ensureDir(destDir);

    if (!fs.existsSync(srcDir)) continue;

    const files = fs.readdirSync(srcDir).filter(f => !f.startsWith('.') && !f.startsWith('._') && /\.(jpe?g|png|webp)$/i.test(f));
    console.log(`Processing [${cfg.folder}]: ${files.length} photos...`);

    const manifestEntry = subfoldersManifest.find(s => s.id === cfg.id);
    if (manifestEntry) manifestEntry.itemCount = files.length;

    let firstThumb = '';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const srcFile = path.join(srcDir, file);
      const safeName = path.parse(file).name.replace(/[^a-zA-Z0-9_-]/g, '_');

      const thumbFile = `thumb-${safeName}.webp`;
      const mobileFile = `mobile-${safeName}.webp`;
      const hdFile = `hd-${safeName}.webp`;

      const thumbDest = path.join(destDir, thumbFile);
      const mobileDest = path.join(destDir, mobileFile);
      const hdDest = path.join(destDir, hdFile);

      try {
        if (!fs.existsSync(thumbDest)) {
          await sharp(srcFile)
            .resize({ width: 450, withoutEnlargement: true })
            .webp({ quality: 75 })
            .toFile(thumbDest);
        }

        if (!fs.existsSync(mobileDest)) {
          await sharp(srcFile)
            .resize({ width: 1400, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(mobileDest);
        }

        if (!fs.existsSync(hdDest)) {
          await sharp(srcFile)
            .resize({ width: 3000, withoutEnlargement: true })
            .webp({ quality: 90 })
            .toFile(hdDest);
        }

        const thumbUrl = `/albums/shubh-vivah/${cfg.id}/${thumbFile}`;
        const mobileUrl = `/albums/shubh-vivah/${cfg.id}/${mobileFile}`;
        const hdUrl = `/albums/shubh-vivah/${cfg.id}/${hdFile}`;

        if (!firstThumb) firstThumb = thumbUrl;

        const stats = fs.statSync(srcFile);
        const origSizeMB = (stats.size / (1024 * 1024)).toFixed(1) + ' MB';

        allItems.push({
          id: `vivah-${cfg.id}-${i + 1}`,
          title: `${cfg.displayName} #${i + 1}`,
          type: 'image',
          url: mobileUrl,
          mobileUrl: mobileUrl,
          hdUrl: hdUrl,
          thumbnailUrl: thumbUrl,
          occasionId: 'shubh-vivah',
          subfolderId: cfg.id,
          subfolderName: cfg.displayName,
          date: 'Nov 2021',
          fileSize: origSizeMB,
        });

        if ((i + 1) % 50 === 0 || i === files.length - 1) {
          console.log(`[${cfg.folder}] Processed ${i + 1}/${files.length} photos`);
        }
      } catch (err) {
        console.error(`Error processing ${srcFile}:`, err.message);
      }
    }

    if (manifestEntry) manifestEntry.coverImage = firstThumb;
  }

  const outputData = {
    occasion: {
      id: 'shubh-vivah',
      title: 'पाणिग्रहण संस्कार • शुभ विवाह (Shubh Vivah)',
      subtitle: 'पवित्र अग्नि के साक्ष्य में सात फेरे और अटूट वचनों का पावन उत्सव • Sacred Vedic Wedding Celebrations',
      date: 'नवम्बर 2021 • शुभ विवाह',
      coverImage: subfoldersManifest.find(s => s.id === 'vivah')?.coverImage || subfoldersManifest[0]?.coverImage,
      subfolders: subfoldersManifest,
      items: allItems,
    }
  };

  const outPath = path.join(__dirname, '..', 'src', 'lib', 'wedding-album.json');
  fs.writeFileSync(outPath, JSON.stringify(outputData, null, 2));
  console.log(`Saved wedding album manifest to ${outPath} with ${allItems.length} total items (${allItems.length - 12} photos, 12 videos)!`);
}

processWedding().catch(err => {
  console.error('Fatal error processing wedding:', err);
  process.exit(1);
});
