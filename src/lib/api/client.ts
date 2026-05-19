import { createClient } from '@/lib/supabase/client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class ApiAuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiAuthError'
  }
}

export class ApiClientError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'ApiClientError'
  }
}

export class ApiServerError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'ApiServerError'
  }
}

export class ApiNetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiNetworkError'
  }
}

async function getAuthToken(): Promise<string> {
  const supabase = createClient()
  let { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const { data: refreshed } = await supabase.auth.refreshSession()
    session = refreshed.session
  }

  if (!session?.access_token) {
    throw new ApiAuthError('Not authenticated')
  }

  return session.access_token
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json()
    return body?.detail || body?.message || JSON.stringify(body)
  } catch {
    return `HTTP ${response.status}: ${response.statusText}`
  }
}

function throwForStatus(status: number, message: string): never {
  if (status === 401) throw new ApiAuthError(message)
  if (status >= 400 && status < 500) throw new ApiClientError(message, status)
  if (status >= 500) throw new ApiServerError(message, status)
  throw new ApiClientError(message, status)
}

async function request(path: string, options?: RequestInit): Promise<unknown> {
  const token = await getAuthToken()

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...options?.headers,
  }

  const fullUrl = `${BASE_URL}${path}`
  console.log('[API]', options?.method || 'GET', fullUrl)

  let response: Response
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network request failed'
    throw new ApiNetworkError(message)
  }

  if (!response.ok) {
    const message = await extractErrorMessage(response)
    throwForStatus(response.status, message)
  }

  return response.json()
}

async function requestFormData(path: string, formData: FormData): Promise<unknown> {
  const token = await getAuthToken()

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network request failed'
    throw new ApiNetworkError(message)
  }

  if (!response.ok) {
    const message = await extractErrorMessage(response)
    throwForStatus(response.status, message)
  }

  return response.json()
}

// Health
export async function getHealth() {
  return request('/health', { method: 'GET' })
}

// Users
export async function getMe() {
  return request('/users/me', { method: 'GET' })
}

export async function updateMe(data: unknown) {
  return request('/users/me', { method: 'PUT', body: JSON.stringify(data) })
}

// Onboarding
export async function uploadResume(
  file: File,
  linkedinText?: string,
  targetRole?: string
) {
  const formData = new FormData()
  formData.append('file', file)
  if (linkedinText) formData.append('linkedin_text', linkedinText)
  if (targetRole) formData.append('target_role', targetRole)
  return requestFormData('/onboarding/onboarding-resume', formData)
}

// One-pager
export async function getOnePager() {
  return request('/one-pager/', { method: 'GET' })
}

export async function generateOnePager() {
  return request('/one-pager/generate', { method: 'POST', body: JSON.stringify({}) })
}

// Chat
export async function initChat() {
  return request('/chat/init', { method: 'GET' })
}

export async function sendChatMessage(message: string) {
  return request('/chat/', { method: 'POST', body: JSON.stringify({ message }) })
}

export async function getChatHistory() {
  return request('/chat/history', { method: 'GET' })
}

export async function resetChat() {
  return request('/chat/reset', { method: 'POST', body: JSON.stringify({}) })
}

// Profile
export async function profileChat(message: string) {
  return request('/profile/chat', { method: 'POST', body: JSON.stringify({ message }) })
}

export async function profileRegenerate() {
  return request('/profile/regenerate', { method: 'POST', body: JSON.stringify({}) })
}

// Ledger
export async function getLedger() {
  return request('/ledger/', { method: 'GET' })
}
