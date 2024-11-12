export function parseJson(jsonString: string) {
  try {
    // 检查输入是否为空
    if (!jsonString || jsonString.trim() === '') {
      return {
        success: false,
        data: null,
        error: '文件内容为空'
      }
    }

    const cleanJson = jsonString
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')
      .trim()
    
    if (!cleanJson.startsWith('{') && !cleanJson.startsWith('[')) {
      return {
        success: false,
        data: null,
        error: '文件内容不是有效的JSON格式'
      }
    }

    const parsed = JSON.parse(cleanJson)
    return {
      success: true,
      data: parsed,
      error: null
    }
  } catch (e) {
    return {
      success: false,
      data: null,
      error: e instanceof Error ? e.message : '解析JSON时发生错误'
    }
  }
}

export function stringifyJson(json: unknown, space = 2) {
  try {
    return {
      success: true,
      data: JSON.stringify(json, null, space),
      error: null
    }
  } catch (e) {
    return {
      success: false,
      data: null,
      error: e instanceof Error ? e.message : '序列化JSON时发生错误'
    }
  }
}

// 验证JSON大小
export function validateJsonSize(json: unknown, maxSize = 10 * 1024 * 1024) {
  const size = new Blob([JSON.stringify(json)]).size
  return size <= maxSize
}

// 检查JSON编码
export function detectJsonEncoding(buffer: ArrayBuffer): string {
  const arr = new Uint8Array(buffer).subarray(0, 4)
  let encoding = 'utf-8'
  
  if (arr[0] === 0xEF && arr[1] === 0xBB && arr[2] === 0xBF) {
    encoding = 'utf-8'
  } else if (arr[0] === 0xFE && arr[1] === 0xFF) {
    encoding = 'utf-16be'
  } else if (arr[0] === 0xFF && arr[1] === 0xFE) {
    encoding = 'utf-16le'
  }

  return encoding
} 