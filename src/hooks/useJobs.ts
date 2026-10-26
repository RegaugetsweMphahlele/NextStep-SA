import { useCallback, useEffect, useState } from 'react'
import { getCurrentJobs, getCurrentSavedJobIds, toggleSavedJob } from '../lib/localStore'
import type { JobPosting } from '../types'

export function useJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    try {
      setJobs(getCurrentJobs())
      setSavedIds(getCurrentSavedJobIds())
      setError('')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load your locally saved vacancies.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    window.addEventListener('storage', load)
    window.addEventListener('nextstep-data-changed', load)
    return () => {
      window.removeEventListener('storage', load)
      window.removeEventListener('nextstep-data-changed', load)
    }
  }, [load])

  const toggleSaved = useCallback((jobId: string) => {
    try {
      setSavedIds(toggleSavedJob(jobId))
      setError('')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to update saved jobs.')
    }
  }, [])

  return { jobs, savedIds, loading, error, reload: load, toggleSaved }
}
