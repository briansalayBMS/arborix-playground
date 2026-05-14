import { createClient } from '@/lib/supabase/client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getAuthToken(): Promise<string> {
  const supabase = createClient()
  let { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const { data: refreshed } = await supabase.auth.refreshSession()
    session = refreshed.session
  }

  if (!session?.access_token) {
    throw new Error('Not authenticated')
  }

  return session.access_token
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

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  })

  if (!response.ok) {
    try {
      const error = await response.json()
      const message = error?.detail || error?.message || JSON.stringify(error)
      throw new Error(message)
    } catch (parseError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }

  return response.json()
}

async function requestFormData(path: string, formData: FormData): Promise<unknown> {
  const token = await getAuthToken()

  const headers = {
    Authorization: `Bearer ${token}`,
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!response.ok) {
    try {
      const error = await response.json()
      const message = error?.detail || error?.message || JSON.stringify(error)
      throw new Error(message)
    } catch (parseError) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }

  return response.json()
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

export async function getLedgerYou() {
  return request('/ledger/you', { method: 'GET' })
}
