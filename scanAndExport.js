import fs from 'fs';
import path from 'path';


function extractBoxId(folderName) {
  const match = folderName.match(/^Box(\d+)\./);
  return match ? match[1] : null;
}


export async function scanAndCollectCases(rootFolderPath) {
  const results = [];

  const boxFolders = fs.readdirSync(rootFolderPath).filter(name =>
    fs.statSync(path.join(rootFolderPath, name)).isDirectory() &&
    name.startsWith('Box')
  );

  for (const boxFolderName of boxFolders) {
    const boxId = extractBoxId(boxFolderName);
    if (!boxId) continue;

    const finalizedPath = path.join(rootFolderPath, boxFolderName, '2 Finalized');

    if (!fs.existsSync(finalizedPath)) continue;

    const caseFolders = fs.readdirSync(finalizedPath).filter(name =>
      fs.statSync(path.join(finalizedPath, name)).isDirectory()
    );

    for (let caseName of caseFolders) {
      if (caseName.includes('-C')) continue;
      caseName = caseName.replace(/-2$/, '');
      results.push({ boxId, caseNumber: caseName });
    }
  }
  

  return results;
}

export function exportToCSV(data, outputDir, caseTypeId) {
    const csvHeader = 'BoxID,CaseNumber,CaseTypeID,Uploaded,Converted\n';
    const csvRows = data.map(item =>
        `${item.boxId},"'${item.caseNumber}",${caseTypeId},0,0`
      ).join('\n');
    const csvContent = csvHeader + csvRows;
  
    const folderName = path.basename(outputDir).replace(/[^a-zA-Z0-9_-]/g, '_');
    const outputFileName = `_FinilizedCasesList_${folderName}.csv`;
    const outputPath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputPath, csvContent, 'utf-8');
  
    return outputPath;
  }
