const fetcher = async (url: string) => {
  const response = await fetch(url)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Network error')
  }

  return response.json()
}

export default fetcher
