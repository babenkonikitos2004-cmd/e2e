import fs from 'fs';

const emptyStorage = {
  "cookies": [],
  "origins": []
};

fs.writeFileSync('storageState.test.json', JSON.stringify(emptyStorage, null, 2));
fs.writeFileSync('storageState.dev.json', JSON.stringify(emptyStorage, null, 2));

console.log('✅ Созданы пустые файлы:');
console.log('  - storageState.test.json');
console.log('  - storageState.dev.json');