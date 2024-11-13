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

interface ChunkOptions {
  maxKeys?: number;        // 每块最大键值对数量
  maxSize?: number;        // 每块最大字节数
  preserveStructure?: boolean; // 是否保持对象结构完整
}

export function chunkJsonObject(
  obj: Record<string, any>, 
  options: ChunkOptions = {}
) {
  const {
    maxKeys = 50,
    maxSize = 4000, // 约4KB
    preserveStructure = true
  } = options;
  
  const chunks: Array<Record<string, any>> = [];
  let currentChunk: Record<string, any> = {};
  let currentSize = 0;
  let currentKeys = 0;
  
  // 递归处理嵌套对象
  function processObject(obj: Record<string, any>, path: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = [...path, key];
      
      if (typeof value === 'object' && value !== null && preserveStructure) {
        // 如果是对象且需要保持结构，递归处理
        processObject(value, currentPath);
        continue;
      }
      
      // 计算当前键值对的大小
      const entrySize = new Blob([JSON.stringify({ [key]: value })]).size;
      
      // 如果当前块已满，创建新块
      if (currentKeys >= maxKeys || currentSize + entrySize > maxSize) {
        if (Object.keys(currentChunk).length > 0) {
          chunks.push(currentChunk);
          currentChunk = {};
          currentSize = 0;
          currentKeys = 0;
        }
      }
      
      // 将键值对添加到当前块
      if (path.length === 0) {
        currentChunk[key] = value;
      } else {
        // 处理嵌套路径
        let target = currentChunk;
        for (let i = 0; i < path.length; i++) {
          const pathKey = path[i];
          if (i === path.length - 1) {
            target[pathKey] = target[pathKey] || {};
            target[pathKey][key] = value;
          } else {
            target[pathKey] = target[pathKey] || {};
            target = target[pathKey];
          }
        }
      }
      
      currentSize += entrySize;
      currentKeys++;
    }
  }
  
  processObject(obj);
  
  // 添加最后一个块
  if (Object.keys(currentChunk).length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}

// 合并翻译结果时保持对象结构
export function mergeTranslatedChunks(chunks: Record<string, any>[]) {
  return chunks.reduce((acc, chunk) => {
    function deepMerge(target: any, source: any) {
      for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
          target[key] = target[key] || {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    }
    return deepMerge(acc, chunk);
  }, {});
} 