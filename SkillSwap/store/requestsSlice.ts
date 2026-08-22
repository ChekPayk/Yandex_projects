import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { SwapRequest, RequestStatus } from '@/shared/types'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './index'

interface RequestsState {
  requests: SwapRequest[]
}

const initialState: RequestsState = {
  requests: loadRequestsFromStorage(),
}

function loadRequestsFromStorage(): SwapRequest[] {
  const str = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS)
  if (!str) {
    return []
  }
  try {
    return JSON.parse(str)
  } catch {
    return []
  }
}

function saveRequestsToStorage(requests: SwapRequest[]): void {
  try {
    const result = JSON.stringify(requests)
    localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, result)
  } catch (e) {
    console.error(e)
  }
}

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    createRequest: {
      reducer(state, action: PayloadAction<SwapRequest>) {
        state.requests.push(action.payload)
        saveRequestsToStorage(state.requests)
      },
      prepare(data: { skillId: string; fromUserId: string; toUserId: string }) {
        const now = new Date().toISOString()
        return {
          payload: {
            id: crypto.randomUUID(),
            skillId: data.skillId,
            fromUserId: data.fromUserId,
            toUserId: data.toUserId,
            status: 'pending' as const,
            createdAt: now,
            updatedAt: now,
          },
        }
      },
    },
    updateRequestStatus(state, action: PayloadAction<{ id: string; status: RequestStatus }>) {
      const now = new Date().toISOString()
      const request = state.requests.find((r) => r.id === action.payload.id)
      if (!request) return
      request.status = action.payload.status
      request.updatedAt = now
      saveRequestsToStorage(state.requests)
    },
    removeRequest(state, action: PayloadAction<string>) {
      state.requests = state.requests.filter((el) => el.id !== action.payload)
      saveRequestsToStorage(state.requests)
    },
  },
})

export const { createRequest, updateRequestStatus, removeRequest } = requestSlice.actions
export default requestSlice.reducer
export const selectRequests = (state: RootState) => state.requests.requests
