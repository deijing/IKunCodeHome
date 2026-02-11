import axios from 'axios'

// 创建 newapi 客户端
const newApiClient = axios.create({
  baseURL: 'https://api.ikuncode.cc',
  withCredentials: true, // 携带 Cookie（Session）
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
})

// 用户信息接口
interface UserInfo {
  id: number
  username: string
  display_name?: string
  role?: number
  status?: number
  group?: string
}

// 从 localStorage 获取当前用户 ID（new-api 的用户信息）
function getUserId(): number {
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) return -1
    const user = JSON.parse(userStr)
    return user.id || -1
  } catch {
    return -1
  }
}

/**
 * 从 API 获取当前登录用户信息
 * 使用 Session Cookie 进行认证，不需要额外参数
 */
async function fetchCurrentUser(): Promise<UserInfo | null> {
  try {
    const response = await newApiClient.get<{ success: boolean; data: UserInfo }>('/api/user/self')
    if (response.data.success && response.data.data) {
      const user = response.data.data
      // 保存到 localStorage，以便后续使用
      localStorage.setItem('user', JSON.stringify(user))
      return user
    }
    return null
  } catch (error) {
    console.error('获取当前用户信息失败:', error)
    return null
  }
}

/**
 * 获取当前用户 ID
 * 优先从 localStorage 读取，如果没有则从 API 获取
 */
async function ensureUserId(): Promise<number> {
  // 先尝试从 localStorage 读取
  let userId = getUserId()

  if (userId === -1) {
    // localStorage 没有，尝试从 API 获取（依赖 Session Cookie）
    const user = await fetchCurrentUser()
    userId = user?.id || -1
  }

  return userId
}

// 令牌配置接口
export interface TokenConfig {
  name: string
  group: string
}

// 创建令牌的响应类型
export interface CreateTokenResponse {
  success: boolean
  message: string
  data?: {
    key: string
    id: number
    name: string
    group: string
  }
}

/**
 * 创建新令牌
 * @param config 令牌配置（名称和分组）
 * @returns 创建结果
 * @throws 'NOT_LOGGED_IN' 如果用户未登录
 */
export async function createToken(config: TokenConfig): Promise<CreateTokenResponse> {
  // 智能获取用户 ID（优先 localStorage，降级到 API）
  const userId = await ensureUserId()

  if (userId === -1) {
    throw new Error('NOT_LOGGED_IN')
  }

  const response = await newApiClient.post<CreateTokenResponse>(
    '/api/token/',
    {
      remain_quota: 0,
      expired_time: -1,
      unlimited_quota: true,
      model_limits_enabled: false,
      model_limits: '',
      cross_group_retry: false,
      name: config.name,
      group: config.group,
      allow_ips: '',
    },
    {
      headers: {
        'New-API-User': String(userId),
      },
    }
  )

  return response.data
}

/**
 * 检查用户是否已登录
 * @returns true 表示已登录
 */
export async function checkLoginStatus(): Promise<boolean> {
  try {
    // 智能获取用户 ID（优先 localStorage，降级到 API）
    const userId = await ensureUserId()

    if (userId === -1) return false

    // 调用一个轻量级接口验证 Session 是否有效
    await newApiClient.get('/api/user/self', {
      headers: {
        'New-API-User': String(userId),
      },
    })
    return true
  } catch {
    return false
  }
}
