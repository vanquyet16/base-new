import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONFIG_PATH = path.join(__dirname, 'feature-config.json')
const FEATURES_DIR = path.join(__dirname, '../src/features')

const featureName = process.argv[2]

if (!featureName) {
  console.error(
    '❌ Vui lòng nhập tên feature! Ví dụ: node scripts/generate-feature.mjs user-profile',
  )
  process.exit(1)
}

// Helper to convert names
const toPascalCase = (str) =>
  str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
const toUpperSnakeCase = (str) => str.replace(/-/g, '_').toUpperCase()

const vars = {
  name: featureName,
  PascalName: toPascalCase(featureName),
  UpperName: toUpperSnakeCase(featureName),
}

const replaceVars = (content, variables) => {
  let result = content
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value)
  }
  return result
}

async function generate() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
    const targetDir = path.join(FEATURES_DIR, featureName)

    if (fs.existsSync(targetDir)) {
      console.error(`❌ Feature "${featureName}" đã tồn tại!`)
      process.exit(1)
    }

    // Create base directory
    fs.mkdirSync(targetDir, { recursive: true })

    // Create sub-directories
    for (const dir of config.directories) {
      fs.mkdirSync(path.join(targetDir, dir), { recursive: true })
    }

    // Create files
    for (const file of config.files) {
      const filePath = replaceVars(file.path, vars)
      const fileContent = replaceVars(file.template, vars)
      const fullPath = path.join(targetDir, filePath)

      // Ensure parent directory exists for files like components/SomeFile.tsx
      fs.mkdirSync(path.dirname(fullPath), { recursive: true })
      fs.writeFileSync(fullPath, fileContent)
      console.log(`✅ Created: ${fullPath}`)
    }

    console.log(
      `\n🚀 Feature "${featureName}" đã được tạo thành công tại src/features/${featureName}`,
    )
  } catch (error) {
    console.error('❌ Có lỗi xảy ra:', error.message)
  }
}

generate()
