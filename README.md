# agnes-images
Agnes-2.0-Flash
Agnes-2.0-Flash 是由 Sapiens AI 开发的一款快速、高效的语言模型，面向智能体工作流、工具调用、编程任务、推理、多轮对话以及高频生产环境应用场景设计。
Agnes-2.0-Flash 在 Claw-Eval 基准测试中取得了强劲表现，在 General Leaderboard 中排名第 9，Pass^3 分数为 60.9%，展现出在主流语言模型中较强的自主智能体能力。
模型概述
Agnes-2.0-Flash 针对快速、可靠、低成本的语言生成与智能体任务执行进行了优化。
该模型支持以下能力：
能力
说明
Chat Completion
为对话和应用生成高质量回复
多轮对话
在多轮交互中保持上下文连续性
工具调用
调用外部工具和函数，支持智能体工作流
智能体工作流
支持规划、执行和多步骤任务完成
编程任务
辅助代码生成、调试、解释和重构
推理
处理结构化推理、任务拆解和决策
流式输出
实时返回响应，提升用户体验
OpenAI 兼容 API
使用兼容 OpenAI Chat Completions API 的结构
适用场景
Agnes-2.0-Flash 适用于以下场景：
场景
示例用例
AI 助手
通用问答、日常助手、效率支持
自主智能体
多步骤任务执行、规划和工具使用
编程助手
代码生成、调试、重构和解释
工作流自动化
任务拆解、流程自动化和执行规划
客户支持
FAQ 问答、客服聊天机器人、服务自动化
搜索与问答
基于搜索的回答、摘要生成、信息提取
内容生成
营销文案、文章、产品描述、脚本
开发者工具
API 助手、文档助手、编程 Copilot
AI 原生应用
消费级应用、效率工具、智能体应用
API 信息
Endpoint
项目
说明
API Endpoint
https://apihub.agnes-ai.com/v1/chat/completions
Request Method
POST
Content-Type
application/json
Authentication
Bearer Token
Authentication Header
Authorization: Bearer YOUR_API_KEY
请求参数
参数
类型
是否必填
说明
model
string
是
模型名称，固定为 agnes-2.0-flash
messages
array
是
对话消息数组，包括 system、user 和 assistant 消息
temperature
number
否
控制输出随机性。较低值会生成更确定性的结果
top_p
number
否
控制核采样。较低值会使输出更加聚焦
max_tokens
number
否
响应中最多生成的 token 数
stream
boolean
否
是否启用流式响应输出
tools
array
否
用于工具调用工作流的工具定义
tool_choice
string / object
否
控制模型是否以及如何使用工具
调用示例
1. 基础 Chat Completion 请求
用于生成普通的聊天补全响应。
curl https://apihub.agnes-ai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-2.0-flash",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful AI assistant."
      },
      {
        "role": "user",
        "content": "Explain how autonomous agents use tools to complete tasks."
      }
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }'
2. 流式输出请求
用于启用流式输出。
curl https://apihub.agnes-ai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-2.0-flash",
    "messages": [
      {
        "role": "user",
        "content": "Write a short product introduction for an AI assistant app."
      }
    ],
    "stream": true
  }'
3. 工具调用请求
用于需要外部工具调用的智能体工作流。
curl https://apihub.agnes-ai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-2.0-flash",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like in Singapore today?"
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get the current weather for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and country"
              }
            },
            "required": ["location"]
          }
        }
      }
    ]
  }'
响应格式
{
  "id": "chatcmpl_xxx",
  "object": "chat.completion",
  "created": 1774432125,
  "model": "agnes-2.0-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Autonomous agents use tools by understanding the user's goal, breaking it into steps, selecting the right tools, executing actions, and using the results to complete the task."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 35,
    "completion_tokens": 58,
    "total_tokens": 93
  }
}
响应字段说明
字段
类型
说明
id
string
本次补全请求的唯一 ID
object
string
对象类型，通常为 chat.completion
created
integer
请求时间戳
model
string
本次请求使用的模型
choices
array
生成的响应结果列表
choices[].index
integer
响应结果的索引
choices[].message
object
Assistant 消息对象
choices[].message.role
string
消息发送者角色
choices[].message.content
string
模型生成的响应内容
choices[].finish_reason
string
生成停止原因
usage
object
Token 使用信息
usage.prompt_tokens
integer
输入 token 数量
usage.completion_tokens
integer
输出 token 数量
usage.total_tokens
integer
使用的 token 总数
为编码任务启用 Thinking
对于代码编写、调试、推理和 Agent 工作流，建议开启 Thinking 模式，以提升代码质量、任务拆解能力和问题解决效果。
OpenAI 兼容请求
使用 OpenAI 兼容 API 格式时，在请求体中添加 chat_template_kwargs.enable_thinking：
{
  "model": "agnes-2.0-flash",
  "messages": [
    {
      "role": "user",
      "content": "Help me write a Python script to process a CSV file."
    }
  ],
  "chat_template_kwargs": {
    "enable_thinking": true
  }
}
Anthropic 兼容请求
使用 Anthropic 兼容 API 格式时，在请求体中添加 thinking 字段：
{
  "model": "agnes-2.0-flash",
  "messages": [
    {
      "role": "user",
      "content": "Help me refactor this TypeScript function and explain the changes."
    }
  ],
  "thinking": {
    "type": "enabled",
    "budget_tokens": 2048
  }
}
budget_tokens 用于控制最大 Thinking token 预算。对于常见编码任务，建议从 2048 开始设置。对于更复杂的调试、重构或多步骤 Agent 任务，可以根据需要适当提高该值。
 
功能与兼容性
Agnes-2.0-Flash 支持以下能力：
Chat Completion
多轮对话
System Prompt
流式输出
工具调用
智能体工作流
编程任务
推理任务
JSON 风格输出
兼容 OpenAI Chat Completions API 的请求结构
最佳实践
Prompt 编写建议
为了获得更好的结果，建议提供清晰的指令、上下文和期望的输出格式。
示例：产品文案生成
You are a product marketing expert. Write a concise App Store description for an AI assistant app. The tone should be clear, professional, and user-friendly.
示例：编程任务
对于编程任务，建议提供编程语言、框架、错误信息和期望行为。
Help me debug this React component. The issue is that the button state does not update after clicking. Explain the cause and provide the corrected code.
示例：智能体工作流
对于智能体工作流，建议清晰描述目标、可用工具和任务约束。
You are an autonomous research agent. Search for relevant information, summarize the key findings, and return the result in a structured format with source links.
推荐 Prompt 结构
建议使用以下结构组织 Prompt：
[Role] + [Task] + [Context] + [Requirements] + [Output Format]
示例
You are a senior product manager. Analyze this feature idea for an AI assistant app. Consider user value, implementation complexity, risks, and return the result in a structured table.
模型限制
项目
数值
Context
256K
Max Output
65.5K
价格
类型
价格
现价
Input Tokens
$0.1 / 1M tokens
$0/ 1M tokens
Output Tokens
$0.2 / 1M tokens
$0 / 1M tokens
说明
使用 agnes-2.0-flash 作为模型名称
基础 Chat Completion 请求必须包含 model 和 messages
如需启用流式响应，请将 stream 设置为 true
对于工具调用工作流，请提供 tools，并可按需提供 tool_choice
temperature 用于控制随机性。较低值更适合确定性任务，较高值更适合创意生成
Agnes-2.0-Flash 适合需要快速响应、强任务完成能力和可靠智能体表现的生产


Agnes-Image-2.0-Flash
Agnes-Image-2.0-Flash 是由 Sapiens AI 开发的一款高性能图像编辑与图像生成模型。
该模型支持 图生图 和 多图合成 工作流，适用于快速创意生产、图像优化、营销视觉设计以及专业内容生成等场景。
Agnes-Image-2.0-Flash 已登上 Artificial Analysis Image Editing Leaderboard，取得 ELO 1,184 【动态调整】的成绩，并进入 Top 20 区间，展现出在主流图像模型中较强的图像编辑能力。
模型概述
Agnes-Image-2.0-Flash 针对快速、高质量的图像生成与图像编辑任务进行了优化。
该模型支持以下能力：
能力
说明
Image-to-Image
编辑、转换或增强现有图像
Multi-Image Input
将多张参考图合成为一张新图像
Image Editing
修改构图、风格、对象、场景和视觉细节
Style Control
调整艺术风格、光照、布局和视觉方向
Fast Generation
针对快速、低成本的生产工作流进行优化
OpenAI-Compatible API
使用兼容 OpenAI Images API 的结构
适用场景
Agnes-Image-2.0-Flash 适用于以下场景：
场景
示例用例
创意设计
海报、概念艺术、社交媒体视觉图
营销内容
产品广告、活动创意、Banner
图像编辑
对象替换、背景更换、风格转换
角色合成
将多个角色或参考图组合到同一场景中
视觉生产
为 App、网站、游戏和视频生成素材
电商
产品图优化和场景化生成
社交内容
Meme、头像、缩略图、生活方式视觉图
API 信息
Endpoint
项目
说明
API Endpoint
https://apihub.agnes-ai.com/v1/images/generations
Request Method
POST
Content-Type
application/json
Authentication
Bearer Token
Authentication Header
Authorization: Bearer YOUR_API_KEY
请求参数
参数
类型
是否必填
说明
model
string
是
模型名称，固定为 agnes-image-2.0-flash
prompt
string
是
描述目标图像或编辑需求的文本提示词
size
string
否
输出图像尺寸，例如 1024x768、1024x1024、768x1024
seed
number
否
随机种子，用于保证结果可复现
tags
array
否
任务类型，例如 ["img2img"]
extra_body.image
array
否
图生图或多图工作流中的输入图像 URL
extra_body.response_format
string
否
输出格式，目前支持 url
调用示例
1. 图生图请求
用于编辑或转换现有图像。
curl https://apihub.agnes-ai.com/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-image-2.0-flash",
    "tags": ["img2img"],
    "prompt": "Transform this image into a cinematic cyberpunk style while preserving the main subject and composition",
    "size": "1024x768",
    "extra_body": {
      "image": [
        "https://example.com/input-image.png"
      ],
      "response_format": "url"
    }
  }'
2. 多图合成请求
用于将多张输入图像组合成一个新场景。
curl https://apihub.agnes-ai.com/v1/images/generations \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-image-2.0-flash",
    "tags": ["img2img"],
    "prompt": "Combine the two characters into an intense fantasy battle scene, dynamic lighting, detailed background, cinematic composition",
    "size": "1024x768",
    "extra_body": {
      "image": [
        "https://example.com/character-1.png",
        "https://example.com/character-2.png"
      ],
      "response_format": "url"
    }
  }'
响应格式
{
  "created": 1774432125,
  "data": [
    {
      "url": "https://..."
    }
  ],
  "usage": {
    "generated_images": 1
  }
}
响应字段说明
字段
类型
说明
created
integer
请求时间戳
data
array
生成的图像结果列表
data[].url
string
生成图像的 URL
usage
object
使用量信息
usage.generated_images
integer
生成图像数量
价格
类型
价格
现价
Generated Images
$0.003 / image
$0 / image
功能与兼容性
Agnes-Image-2.0-Flash 支持以下能力：
图生图编辑
多图输入与合成
基于 Prompt 的图像转换
稳定的风格与构图控制
基于 Seed 的结果复现
面向生产工作流的快速生成
兼容 OpenAI Images API 的请求结构
最佳实践
Prompt 编写建议
为了获得更好的生成效果，建议在 Prompt 中提供清晰的视觉指令。
示例：产品图生成
A professional product photo of a wireless headphone on a clean white background, soft studio lighting, sharp details, commercial photography style
示例：图像编辑
对于编辑任务，建议明确描述需要改变的内容，以及需要保持不变的内容。
Change the background to a futuristic city at night while keeping the person’s face, outfit, and pose unchanged
示例：多图合成
对于多图合成任务，建议描述不同输入图像之间的关系。
Place the person from the first image beside the robot from the second image in a cinematic sci-fi battle scene
推荐 Prompt 结构
建议使用以下结构组织 Prompt：
[Main subject] + [Scene / background] + [Style] + [Lighting] + [Composition] + [Quality requirements]
示例
A young explorer standing in an ancient temple, cinematic fantasy style, warm dramatic lighting, wide-angle composition, ultra detailed, high quality
说明
使用 agnes-image-2.0-flash 作为模型名称
对于图生图任务，需要添加 tags: ["img2img"]
对于图生图任务，需要在 extra_body.image 中提供输入图像 URL
对于多图编辑任务，可在 extra_body.image 中提供多个图像 URL
response_format 目前支持 URL 输出