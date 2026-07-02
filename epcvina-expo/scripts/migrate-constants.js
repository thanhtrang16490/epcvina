#!/usr/bin/env node

/**
 * Script để migrate hardcoded values sang constants
 * 
 * Usage:
 *   node scripts/migrate-constants.js
 * 
 * Tìm và replace:
 * - Hardcoded colors
 * - Hardcoded spacing values
 * - Hardcoded sizes
 * - Hardcoded radius values
 */

const fs = require('fs')
const path = require('path')

// Patterns to find and replace
const patterns = [
  // Colors
  { pattern: /#175ead/g, replacement: "COLORS.primary", import: "COLORS" },
  { pattern: /#10b981/g, replacement: "COLORS.success", import: "COLORS" },
  { pattern: /#f59e0b/g, replacement: "COLORS.warning", import: "COLORS" },
  { pattern: /#ef4444/g, replacement: "COLORS.error", import: "COLORS" },
  { pattern: /#3b82f6/g, replacement: "COLORS.info", import: "COLORS" },
  
  // Spacing (common values)
  { pattern: /padding:\s*4(?![0-9])/g, replacement: "padding: SPACING.xs", import: "SPACING" },
  { pattern: /padding:\s*8(?![0-9])/g, replacement: "padding: SPACING.sm", import: "SPACING" },
  { pattern: /padding:\s*16(?![0-9])/g, replacement: "padding: SPACING.md", import: "SPACING" },
  { pattern: /padding:\s*24(?![0-9])/g, replacement: "padding: SPACING.lg", import: "SPACING" },
  { pattern: /padding:\s*32(?![0-9])/g, replacement: "padding: SPACING.xl", import: "SPACING" },
  
  { pattern: /margin:\s*4(?![0-9])/g, replacement: "margin: SPACING.xs", import: "SPACING" },
  { pattern: /margin:\s*8(?![0-9])/g, replacement: "margin: SPACING.sm", import: "SPACING" },
  { pattern: /margin:\s*16(?![0-9])/g, replacement: "margin: SPACING.md", import: "SPACING" },
  { pattern: /margin:\s*24(?![0-9])/g, replacement: "margin: SPACING.lg", import: "SPACING" },
  { pattern: /margin:\s*32(?![0-9])/g, replacement: "margin: SPACING.xl", import: "SPACING" },
  
  // Border radius
  { pattern: /borderRadius:\s*4(?![0-9])/g, replacement: "borderRadius: RADIUS.sm", import: "RADIUS" },
  { pattern: /borderRadius:\s*8(?![0-9])/g, replacement: "borderRadius: RADIUS.md", import: "RADIUS" },
  { pattern: /borderRadius:\s*12(?![0-9])/g, replacement: "borderRadius: RADIUS.lg", import: "RADIUS" },
  { pattern: /borderRadius:\s*16(?![0-9])/g, replacement: "borderRadius: RADIUS.xl", import: "RADIUS" },
  { pattern: /borderRadius:\s*9999/g, replacement: "borderRadius: RADIUS.full", import: "RADIUS" },
]

// Directories to scan
const dirsToScan = [
  'app',
  'src/components',
  'src/screens',
]

// Files to skip
const skipFiles = [
  'node_modules',
  '.expo',
  'dist',
  'build',
  '__tests__',
  '.test.',
  '.spec.',
]

/**
 * Check if file should be skipped
 */
function shouldSkipFile(filePath) {
  return skipFiles.some(skip => filePath.includes(skip))
}

/**
 * Get all TypeScript/TSX files in directory
 */
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      if (!shouldSkipFile(filePath)) {
        getFiles(filePath, fileList)
      }
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !shouldSkipFile(filePath)) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

/**
 * Migrate file
 */
function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false
  const importsNeeded = new Set()
  
  // Apply patterns
  patterns.forEach(({ pattern, replacement, import: importName }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement)
      importsNeeded.add(importName)
      modified = true
    }
  })
  
  // Add imports if needed
  if (importsNeeded.size > 0) {
    const imports = Array.from(importsNeeded).join(', ')
    const importStatement = `import { ${imports} } from '@/constants'\n`
    
    // Check if import already exists
    if (!content.includes(importStatement)) {
      // Add after other imports
      const importRegex = /^import .+ from .+$/gm
      const matches = content.match(importRegex)
      
      if (matches && matches.length > 0) {
        const lastImport = matches[matches.length - 1]
        const lastImportIndex = content.indexOf(lastImport) + lastImport.length
        content = content.slice(0, lastImportIndex) + '\n' + importStatement + content.slice(lastImportIndex)
      } else {
        // No imports found, add at top
        content = importStatement + '\n' + content
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ Migrated: ${filePath}`)
    return true
  }
  
  return false
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting constants migration...\n')
  
  let totalFiles = 0
  let migratedFiles = 0
  
  dirsToScan.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir)
    
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory not found: ${dir}`)
      return
    }
    
    console.log(`📁 Scanning: ${dir}`)
    const files = getFiles(dirPath)
    totalFiles += files.length
    
    files.forEach(file => {
      if (migrateFile(file)) {
        migratedFiles++
      }
    })
  })
  
  console.log(`\n✨ Migration complete!`)
  console.log(`📊 Files scanned: ${totalFiles}`)
  console.log(`✅ Files migrated: ${migratedFiles}`)
  console.log(`\n💡 Tip: Run 'npm run lint:fix' to format the changes`)
}

// Run
main()
