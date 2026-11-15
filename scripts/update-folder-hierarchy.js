const fs = require('fs');
const path = require('path');

const weddingPath = path.join(__dirname, '../src/lib/wedding-album.json');
const processedPath = path.join(__dirname, '../src/lib/processed-albums.json');

console.log('--- Updating wedding-album.json ---');
const weddingData = JSON.parse(fs.readFileSync(weddingPath, 'utf8'));

const weddingParentFolders = [
  {
    id: 'mom-dad',
    name: 'MOM-DAD (माता-पिता विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\MOM-DAD',
    description: 'Golden wedding video memories of Mom and Dad (CD 1 & CD 2)',
    coverImage: 'https://img.youtube.com/vi/z-fJ1QA93CE/hqdefault.jpg',
    itemCount: 6,
    subfolderIds: ['cd1', 'cd2']
  },
  {
    id: 'shaadi-shekhar',
    name: 'ShaadiShekhar (शेखर विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\ShaadiShekhar',
    description: 'Shekhar wedding video recordings (part 1 & Part 2)',
    coverImage: 'https://img.youtube.com/vi/v5tMaRB-6gA/hqdefault.jpg',
    itemCount: 6,
    subfolderIds: ['shekhar-p1', 'shekhar-p2']
  },
  {
    id: 'shaadi-monu',
    name: 'ShaadiMonu (मोनू विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\ShaadiMonu',
    description: 'Sacred wedding ceremony photo collection of Monu (HALDI, TILAK, VIVAH)',
    coverImage: '/albums/shubh-vivah/vivah/thumb-DSC_0038.webp',
    itemCount: 908,
    subfolderIds: ['haldi', 'tilak', 'vivah']
  }
];

const weddingSubfolders = [
  {
    id: 'cd1',
    name: 'CD1',
    parentId: 'mom-dad',
    parentName: 'MOM-DAD (माता-पिता विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\MOM-DAD\\CD1',
    description: 'माता-पिता पावन विवाह — CD 1 (4 videos: VTS_01_1 to VTS_01_4)',
    coverImage: 'https://img.youtube.com/vi/z-fJ1QA93CE/hqdefault.jpg',
    itemCount: 4
  },
  {
    id: 'cd2',
    name: 'CD2',
    parentId: 'mom-dad',
    parentName: 'MOM-DAD (माता-पिता विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\MOM-DAD\\CD2',
    description: 'माता-पिता पावन विवाह — CD 2 (2 videos: VTS_01_1 & VTS_01_2)',
    coverImage: 'https://img.youtube.com/vi/xrNT2_CKUUE/hqdefault.jpg',
    itemCount: 2
  },
  {
    id: 'shekhar-p1',
    name: 'part 1',
    parentId: 'shaadi-shekhar',
    parentName: 'ShaadiShekhar (शेखर विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\ShaadiShekhar\\part 1',
    description: 'शेखर शुभ विवाह — part 1 (3 videos)',
    coverImage: 'https://img.youtube.com/vi/v5tMaRB-6gA/hqdefault.jpg',
    itemCount: 3
  },
  {
    id: 'shekhar-p2',
    name: 'Part 2',
    parentId: 'shaadi-shekhar',
    parentName: 'ShaadiShekhar (शेखर विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\ShaadiShekhar\\Part 2',
    description: 'शेखर शुभ विवाह — Part 2 (3 videos)',
    coverImage: 'https://img.youtube.com/vi/91vSSPOCAeA/hqdefault.jpg',
    itemCount: 3
  },
  {
    id: 'haldi',
    name: 'HALDI (हल्दी समारोह)',
    parentId: 'shaadi-monu',
    parentName: 'ShaadiMonu (मोनू विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\ShaadiMonu\\HALDI',
    description: 'Haldi ceremony rituals, auspicious turmeric application, and joy',
    coverImage: '/albums/shubh-vivah/haldi/thumb-DSC_9222.webp',
    itemCount: 46
  },
  {
    id: 'tilak',
    name: 'TILAK (तिलक समारोह)',
    parentId: 'shaadi-monu',
    parentName: 'ShaadiMonu (मोनू विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\ShaadiMonu\\TILAK',
    description: 'Traditional Tilak ceremony, welcoming, blessings and shagun',
    coverImage: '/albums/shubh-vivah/tilak/thumb-DSC_8894.webp',
    itemCount: 165
  },
  {
    id: 'vivah',
    name: 'VIVAH (शुभ विवाह एवं फेरे)',
    parentId: 'shaadi-monu',
    parentName: 'ShaadiMonu (मोनू विवाह)',
    localPath: 'D:\\Videos And Movies\\SHAADI\\ShaadiMonu\\VIVAH',
    description: 'The sacred wedding ceremony, saat phere, varmala and kanyadaan',
    coverImage: '/albums/shubh-vivah/vivah/thumb-DSC_0038.webp',
    itemCount: 697
  }
];

weddingData.occasion.parentFolders = weddingParentFolders;
weddingData.occasion.subfolders = weddingSubfolders;

// Update items
weddingData.occasion.items = weddingData.occasion.items.map((item) => {
  if (item.id.startsWith('mom-dad-cd1')) {
    return {
      ...item,
      parentFolderId: 'mom-dad',
      parentFolderName: 'MOM-DAD (माता-पिता विवाह)',
      subfolderId: 'cd1',
      subfolderName: 'CD1'
    };
  } else if (item.id.startsWith('mom-dad-cd2')) {
    return {
      ...item,
      parentFolderId: 'mom-dad',
      parentFolderName: 'MOM-DAD (माता-पिता विवाह)',
      subfolderId: 'cd2',
      subfolderName: 'CD2'
    };
  } else if (item.id.startsWith('shekhar-p1')) {
    return {
      ...item,
      parentFolderId: 'shaadi-shekhar',
      parentFolderName: 'ShaadiShekhar (शेखर विवाह)',
      subfolderId: 'shekhar-p1',
      subfolderName: 'part 1'
    };
  } else if (item.id.startsWith('shekhar-p2')) {
    return {
      ...item,
      parentFolderId: 'shaadi-shekhar',
      parentFolderName: 'ShaadiShekhar (शेखर विवाह)',
      subfolderId: 'shekhar-p2',
      subfolderName: 'Part 2'
    };
  } else if (item.subfolderId === 'haldi') {
    return {
      ...item,
      parentFolderId: 'shaadi-monu',
      parentFolderName: 'ShaadiMonu (मोनू विवाह)',
      subfolderId: 'haldi',
      subfolderName: 'HALDI (हल्दी समारोह)'
    };
  } else if (item.subfolderId === 'tilak') {
    return {
      ...item,
      parentFolderId: 'shaadi-monu',
      parentFolderName: 'ShaadiMonu (मोनू विवाह)',
      subfolderId: 'tilak',
      subfolderName: 'TILAK (तिलक समारोह)'
    };
  } else if (item.subfolderId === 'vivah') {
    return {
      ...item,
      parentFolderId: 'shaadi-monu',
      parentFolderName: 'ShaadiMonu (मोनू विवाह)',
      subfolderId: 'vivah',
      subfolderName: 'VIVAH (शुभ विवाह एवं फेरे)'
    };
  }
  return item;
});

fs.writeFileSync(weddingPath, JSON.stringify(weddingData, null, 2), 'utf8');
console.log('Saved wedding-album.json successfully.');

console.log('--- Updating processed-albums.json ---');
const processedData = JSON.parse(fs.readFileSync(processedPath, 'utf8'));

const processedParentFolders = [
  {
    id: 'photos-23-8',
    name: '23.8.2025_Photos (तस्वीरें)',
    localPath: 'C:\\Users\\abhij\\Desktop\\23.8.2025\\23.8.2025_Photos',
    description: 'Ceremony photographs across Family, Pitaji, Bade Papa, Mataji, etc.',
    coverImage: '/albums/father-retirement/family/thumb-DSC_2331.webp',
    itemCount: 410,
    subfolderIds: ['ceremony', 'family', 'pitaji', 'badepapa', 'mataji', 'seth', 'sharaduncle', 'shivam']
  },
  {
    id: 'videos-23-8',
    name: '23.8.2025_Video (वीडियो रिकॉर्डिंग)',
    localPath: 'C:\\Users\\abhij\\Desktop\\23.8.2025\\23.8.2025_Video',
    description: 'Full-length HD ceremony recordings streamed online via unlisted links',
    coverImage: 'https://img.youtube.com/vi/ZyUcN4Ud-RM/hqdefault.jpg',
    itemCount: 2,
    subfolderIds: ['videos']
  }
];

const processedSubfolders = processedData.occasion.subfolders.map((f) => {
  const isVideo = f.id === 'videos';
  return {
    ...f,
    parentId: isVideo ? 'videos-23-8' : 'photos-23-8',
    parentName: isVideo ? '23.8.2025_Video (वीडियो रिकॉर्डिंग)' : '23.8.2025_Photos (तस्वीरें)',
    localPath: isVideo
      ? 'C:\\Users\\abhij\\Desktop\\23.8.2025\\23.8.2025_Video'
      : `C:\\Users\\abhij\\Desktop\\23.8.2025\\23.8.2025_Photos\\${f.name.split(' ')[0]}`
  };
});

processedData.occasion.parentFolders = processedParentFolders;
processedData.occasion.subfolders = processedSubfolders;

processedData.occasion.items = processedData.occasion.items.map((item) => {
  const isVideo = item.type === 'video' || item.subfolderId === 'videos';
  return {
    ...item,
    parentFolderId: isVideo ? 'videos-23-8' : 'photos-23-8',
    parentFolderName: isVideo ? '23.8.2025_Video (वीडियो रिकॉर्डिंग)' : '23.8.2025_Photos (तस्वीरें)'
  };
});

fs.writeFileSync(processedPath, JSON.stringify(processedData, null, 2), 'utf8');
console.log('Saved processed-albums.json successfully.');
