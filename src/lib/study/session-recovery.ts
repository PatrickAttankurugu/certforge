// ─── Session Persistence / Crash Recovery ──────────────────────

export interface SessionState {
  session_type: string
  session_id: string
  state_data: Record<string, unknown>
  updated_at?: string
}

/**
 * Save session state for crash recovery.
 * Upserts to the session_recovery table via API.
 */
export async function saveSessionState(
  userId: string,
  sessionType: string,
  sessionId: string,
  stateData: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch('/api/study/session-recovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        session_type: sessionType,
        session_id: sessionId,
        state_data: stateData,
      }),
    })
  } catch {
    // Silently fail — recovery is best-effort
    console.warn('[session-recovery] Failed to save session state')
  }
}

/**
 * Load existing session recovery state.
 * Returns null if no saved session exists.
 */
export async function loadSessionState(
  sessionType: string,
): Promise<SessionState | null> {
  try {
    const res = await fetch(`/api/study/session-recovery?session_type=${encodeURIComponent(sessionType)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (!data || !data.session_id) return null
    return data as SessionState
  } catch {
    return null
  }
}

/**
 * Clear saved session state after successful completion.
 */
export async function clearSessionState(
  sessionType: string,
): Promise<void> {
  try {
    await fetch(`/api/study/session-recovery?session_type=${encodeURIComponent(sessionType)}`, {
      method: 'DELETE',
    })
  } catch {
    console.warn('[session-recovery] Failed to clear session state')
  }
}
