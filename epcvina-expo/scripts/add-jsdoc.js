#!/usr/bin/env node

/**
 * Script để thêm JSDoc comments cho functions và components chưa có documentation
 * 
 * Usage:
 *   node scripts/add-jsdoc.js
 * 
 * Tìm:
 * - Functions không có JSDoc
 * - Components không có JSDoc
 * - Exported functions/components
 */

const fs = require('fs')
const path = require('path')

// Directories to scan
const dirsToScan = [
  'src/components',
  'src/hooks',
  'src/lib',
  'src/utils',
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
  'index.ts',
  'index.tsx',
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
 * Check if function/component has JSDoc
 */
function hasJSDoc(content, functionStart) {
  // Look backwards from function start for JSDoc comment
  const beforeFunction = content.substring(0, functionStart)
  const lines = beforeFunction.split('\n')
  
  // Check last few lines for JSDoc
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 5); i--) {
    const line = lines[i].trim()
    if (line.includes('/**') || line.includes('*/')) {
      return true
    }
  }
  
  return false
}

/**
 * Generate JSDoc template
 */
function generateJSDoc(name, type = 'function') {
  if (type === 'component') {
    return `/**
 * ${name} component
 * TODO: Add description
 * 
 * @param props - Component props
 * @returns React component
 */`
  } else {
    return `/**
 * ${name}
 * TODO: Add description
 * 
 * @param params - Function parameters
 * @returns Return value
 */`
  }
}

/**
 * Analyze file and suggest JSDoc additions
 */
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const suggestions = []
  
  // Find exported functions
  const exportedFunctionRegex = /export\s+(function|const)\s+(\w+)/g
  let match
  
  while ((match = exportedFunctionRegex.exec(content)) !== null) {
    const [fullMatch, type, name] = match
    const functionStart = match.index
    
    if (!hasJSDoc(content, functionStart)) {
      suggestions.push({
        name,
        type: type === 'function' ? 'function' : 'const',
        line: content.substring(0, functionStart).split('\n').length,
      })
    }
  }
  
  // Find React components
  const componentRegex = /function\s+(\w+)\s*\([^)]*\)\s*{/g
  
  while ((match = componentRegex.exec(content)) !== null) {
    const [fullMatch, name] = match
    const functionStart = match.index
    
    // Check if it's a component (starts with capital letter)
    if (name[0] === name[0].toUpperCase() && !hasJSDoc(content, functionStart)) {
      suggestions.push({
        name,
        type: 'component',
        line: content.substring(0, functionStart).split('\n').length,
      })
    }
  }
  
  return suggestions
}

/**
 * Main function
 */
function main() {
  console.log('📝 Analyzing files for missing JSDoc...\n')
  
  let totalFiles = 0
  let filesNeedingDocs = 0
  let totalSuggestions = 0
  
  dirsToScan.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir)
    
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory not found: ${dir}`)
      return
    }
    
    const files = getFiles(dirPath)
    totalFiles += files.length
    
    files.forEach(file => {
      const suggestions = analyzeFile(file)
      
      if (suggestions.length > 0) {
        filesNeedingDocs++
        totalSuggestions += suggestions.length
        
        console.log(`\n📄 ${path.relative(process.cwd(), file)}`)
        suggestions.forEach(({ name, type, line }) => {
          console.log(`   Line ${line}: ${type} ${name} - Missing JSDoc`)
        })
      }
    })
  })
  
  console.log(`\n📊 Summary:`)
  console.log(`   Files scanned: ${totalFiles}`)
  console.log(`   Files needing docs: ${filesNeedingDocs}`)
  console.log(`   Total missing JSDoc: ${totalSuggestions}`)
  
  if (totalSuggestions > 0) {
    console.log(`\n💡 Tip: Add JSDoc comments to improve code documentation`)
    console.log(`   Example:`)
    console.log(`   /**`)
    console.log(`    * Function description`)
    console.log(`    * @param param1 - Parameter description`)
    console.log(`    * @returns Return value description`)
    console.log(`    */`)
  } else {
    console.log(`\n✨ All exported functions and components have JSDoc!`)
  }
}

// Run
main()
