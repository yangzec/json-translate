import OpenAI from 'openai'

export async function translate(
  text: string, 
  targetLang: string, 
  apiKey: string,
  signal?: AbortSignal
) {
  if (!apiKey.startsWith('sk-')) {
    throw new Error('无效的 API Key 格式')
  }

  const openai = new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true
  })

  try {
    console.log('开始翻译，目标语言:', targetLang)
    
    const prompt = `请将以下JSON内容翻译成${targetLang}，保持JSON结构不变，只翻译值部分。
    注意：
    1. 保持所有的key不变
    2. 只翻译value部分
    3. 保持JSON格式有效
    4. 保留所有特殊字符和格式
    
    JSON内容：
    ${text}`

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "你是一个专业的JSON翻译助手。请直接返回翻译后的JSON内容，不要添加任何markdown标记或其他格式。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    }, {
      signal
    })

    let translatedText = response.choices[0].message.content
    if (!translatedText) {
      throw new Error('翻译结果为空')
    }

    // 清理可能的markdown标记
    translatedText = translatedText.replace(/^```json\s*/, '') // 移除开头的 ```json
                                 .replace(/^```\s*/, '')       // 移除开头的 ```
                                 .replace(/\s*```$/, '')       // 移除结尾的 ```
                                 .trim()

    // 验证JSON格式
    try {
      const parsedJson = JSON.parse(translatedText)
      // 重新格式化以确保格式一致性
      translatedText = JSON.stringify(parsedJson, null, 2)
    } catch (e: unknown) {
      console.error('JSON解析错误:', translatedText)
      throw new Error(`翻译结果格式无效: ${(e as Error).message}`)
    }

    return translatedText

  } catch (error: unknown) {
    console.error('翻译错误详情:', error)
    
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new Error('API Key 无效或已过期')
      }
      
      if (error.status === 429) {
        throw new Error('API 调用次数已达上限')
      }
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('翻译已取消')
    }
    
    throw new Error((error as Error).message || '翻译服务出错，请稍后重试')
  }
} 