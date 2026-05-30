import api from '../utils/api'

export const askHelpAiAPI = (message, page = '/help') =>
  api.post('ai/help', { message, page })
