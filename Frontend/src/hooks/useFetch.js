import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'

const useFetch = (key, endpoint, options = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [key],
    queryFn: () => api.get(endpoint), 
    ...options,
  })

  return {
    data,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  }
}

export default useFetch