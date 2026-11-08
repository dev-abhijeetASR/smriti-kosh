const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_ROOT = 'C:\\Users\\abhij\\Desktop\\23.8.2025\\23.8.2025_Photos';
const DEST_ROOT = path.join(__dirname, '..', 'public', 'albums', 'father-retirement');

const FOLDER_MAPPINGS = [
  { folderName: 'Family', id: 'family', displayName: 'Family (परिवार)', desc: 'Cherished moments with family and relatives' },
  { folderName: 'Pitaji', id: 'pitaji', displayName: 'Pitaji (पिताजी)', desc: 'Honorable portraits and blessings with Pitaji' },
  { folderName: 'BadePapa', id: 'badepapa', displayName: 'Bade Papa (बड़े पापा)', desc: 'Warm memories and honors with Bade Papa' },
  { folderName: 'Mataji', id: 'mataji', displayName: 'Mataji (माताजी)', desc: 'Divine blessings and loving moments with Mataji' },
  { folderName: 'Seth', id: 'seth', displayName: 'Seth (सेठ)', desc: 'Celebratory moments and portraits' },
  { folderName: 'SharadUncle', id: 'sharaduncle', displayName: 'Sharad Uncle (शरद अंकल)', desc: 'Special memories with Sharad Uncle' },
  { folderName: 'Shivam', id: 'shivam', displayName: 'Shivam (शिवम)', desc: 'Joyful family celebrations with Shivam' },
];

async function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function processAll() {
  console.log('--- Starting Photo Processing ---');
  console.log('Source:', SOURCE_ROOT);
  console.log('Destination:', DEST_ROOT);

  await ensureDir(DEST_ROOT);

  const subfoldersManifest = [];
  const allMediaItems = [];

  // 1. Process named subfolders
  for (const mapping of FOLDER_MAPPINGS) {
    const srcDir = path.join(SOURCE_ROOT, mapping.folderName);
    const destDir = path.join(DEST_ROOT, mapping.id);
    await ensureDir(destDir);

    if (fs.existsSync(srcDir)) {
      const files = fs.readdirSync(srcDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
      console.log(`Processing subfolder [${mapping.folderName}]: ${files.length} photos...`);

      let firstThumb = '';

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const srcFile = path.join(srcDir, file);
        const baseName = path.parse(file).name;

        const thumbFile = `thumb-${baseName}.webp`;
        const mobileFile = `mobile-${baseName}.webp`;
        const hdFile = `hd-${baseName}.webp`;

        const thumbDest = path.join(destDir, thumbFile);
        const mobileDest = path.join(destDir, mobileFile);
        const hdDest = path.join(destDir, hdFile);

        try {
          const image = sharp(srcFile);
          const meta = await image.metadata();

          // 1. Thumb (450px)
          if (!fs.existsSync(thumbDest)) {
            await sharp(srcFile)
              .resize({ width: 450, withoutEnlargement: true })
              .webp({ quality: 75 })
              .toFile(thumbDest);
          }

          // 2. Mobile (1400px)
          if (!fs.existsSync(mobileDest)) {
            await sharp(srcFile)
              .resize({ width: 1400, withoutEnlargement: true })
              .webp({ quality: 80 })
              .toFile(mobileDest);
          }

          // 3. HD (3000px)
          if (!fs.existsSync(hdDest)) {
            await sharp(srcFile)
              .resize({ width: 3000, withoutEnlargement: true })
              .webp({ quality: 90 })
              .toFile(hdDest);
          }

          const thumbUrl = `/albums/father-retirement/${mapping.id}/${thumbFile}`;
          const mobileUrl = `/albums/father-retirement/${mapping.id}/${mobileFile}`;
          const hdUrl = `/albums/father-retirement/${mapping.id}/${hdFile}`;

          if (!firstThumb) firstThumb = thumbUrl;

          const stats = fs.statSync(srcFile);
          const origSizeMB = (stats.size / (1024 * 1024)).toFixed(1) + ' MB';

          allMediaItems.push({
            id: `fr-${mapping.id}-${i + 1}`,
            title: `${mapping.displayName} #${i + 1}`,
            type: 'image',
            url: mobileUrl,
            mobileUrl: mobileUrl,
            hdUrl: hdUrl,
            thumbnailUrl: thumbUrl,
            occasionId: 'father-retirement',
            subfolderId: mapping.id,
            subfolderName: mapping.displayName,
            date: 'Aug 23, 2025',
            fileSize: origSizeMB,
            width: meta.width,
            height: meta.height,
          });
        } catch (err) {
          console.error(`Error processing ${srcFile}:`, err.message);
        }
      }

      subfoldersManifest.push({
        id: mapping.id,
        name: mapping.displayName,
        description: mapping.desc,
        coverImage: firstThumb,
        itemCount: files.length,
      });
    }
  }

  // 2. Process root Ceremony photos
  const rootFiles = fs.readdirSync(SOURCE_ROOT).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  console.log(`Processing root ceremony photos: ${rootFiles.length} photos...`);
  const ceremonyDestDir = path.join(DEST_ROOT, 'ceremony');
  await ensureDir(ceremonyDestDir);

  let firstCeremonyThumb = '';
  for (let i = 0; i < rootFiles.length; i++) {
    const file = rootFiles[i];
    const srcFile = path.join(SOURCE_ROOT, file);
    const baseName = path.parse(file).name;

    const thumbFile = `thumb-${baseName}.webp`;
    const mobileFile = `mobile-${baseName}.webp`;
    const hdFile = `hd-${baseName}.webp`;

    const thumbDest = path.join(ceremonyDestDir, thumbFile);
    const mobileDest = path.join(ceremonyDestDir, mobileFile);
    const hdDest = path.join(ceremonyDestDir, hdFile);

    try {
      const image = sharp(srcFile);
      const meta = await image.metadata();

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

      const thumbUrl = `/albums/father-retirement/ceremony/${thumbFile}`;
      const mobileUrl = `/albums/father-retirement/ceremony/${mobileFile}`;
      const hdUrl = `/albums/father-retirement/ceremony/${hdFile}`;

      if (!firstCeremonyThumb) firstCeremonyThumb = thumbUrl;

      const stats = fs.statSync(srcFile);
      const origSizeMB = (stats.size / (1024 * 1024)).toFixed(1) + ' MB';

      allMediaItems.push({
        id: `fr-ceremony-${i + 1}`,
        title: `Ceremony & Celebration Moment #${i + 1}`,
        type: 'image',
        url: mobileUrl,
        mobileUrl: mobileUrl,
        hdUrl: hdUrl,
        thumbnailUrl: thumbUrl,
        occasionId: 'father-retirement',
        subfolderId: 'ceremony',
        subfolderName: 'Ceremony & Stage (समारोह एवं मंच)',
        date: 'Aug 23, 2025',
        fileSize: origSizeMB,
        width: meta.width,
        height: meta.height,
      });
    } catch (err) {
      console.error(`Error processing ${srcFile}:`, err.message);
    }
  }

  subfoldersManifest.unshift({
    id: 'ceremony',
    name: 'Ceremony & Stage (समारोह एवं मंच)',
    description: 'Speeches, honors, retirement citations, and celebrations',
    coverImage: firstCeremonyThumb,
    itemCount: rootFiles.length,
  });

  // Write out generated JSON
  const outputData = {
    occasion: {
      id: 'father-retirement',
      title: "Father's Retirement Ceremony (पिताजी का सेवानिवृत्ति समारोह)",
      subtitle: '23 August 2025 • A blessed milestone honoring a lifetime of dedication and service',
      date: '23 August 2025',
      coverImage: subfoldersManifest[1]?.coverImage || firstCeremonyThumb,
      subfolders: subfoldersManifest,
      items: allMediaItems,
    }
  };

  const manifestPath = path.join(__dirname, '..', 'src', 'lib', 'processed-albums.json');
  fs.writeFileSync(manifestPath, JSON.stringify(outputData, null, 2));
  console.log(`Saved manifest to ${manifestPath} with ${allMediaItems.length} photos!`);
  console.log('--- Finished Processing Successfully ---');
}

processAll().catch(err => {
  console.error('Fatal error during photo processing:', err);
  process.exit(1);
});
