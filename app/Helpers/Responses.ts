import { ResponseContract } from '@ioc:Adonis/Core/Response'

interface RDMM {
  response: ResponseContract
  message: string
  data?: any
  meta?: any
}

interface RDM {
  response: ResponseContract
  message: string
  data?: any
}

interface RDME {
  response: ResponseContract
  message: string
  data?: any
  error?: any
}

interface RMF {
  response: ResponseContract
  message: string
  field: string
}

export const successfulResponse = ({ response, data, message, meta }: RDMM) => {
  return response.status(200).json({
    status: true,
    message,
    meta,
    data,
  })
}

export const createdResponse = ({ response, data, message }: RDM) => {
  return response.status(201).json({
    status: true,
    message,
    data,
  })
}

export const deletedResponse = ({ response, data, message }: RDM) => {
  return response.status(204).json({
    status: true,
    message,
    data,
  })
}

export const conflictResponse = ({ response, data, message }: RDM) => {
  return response.status(409).json({
    status: false,
    message,
    data,
  })
}

export const badRequestResponse = ({ response, data, message, error }: RDME) => {
  if (error) {
    if (
      error.message.includes('E_USER_NOT_FOUND') ||
      error.message.includes('E_PASSWORD_MISMATCH')
    ) {
      return unauthorizedResponse({
        response,
        message: 'Invalid email or password',
      })
    }

    if (error.message.includes('E_INVALID_JWT_REFRESH_TOKEN')) {
      return unauthorizedResponse({
        response,
        message: 'Invalid refresh token',
      })
    }

    if (
      (error.messages && error.messages.errors) ||
      error.message.includes('E_VALIDATION_FAILURE')
    ) {
      return response.status(500).json({
        status: false,
        message: 'validation error',
        data: error.messages.errors,
      })
    }
    if (error.response && error.response.data) {
      return response.status(400).json({
        status: false,
        message: getAxiosErrorMessage(error.response.data),
        data,
      })
    }
  }
  return response.status(400).json({
    status: false,
    message,
    data,
  })
}

const getAxiosErrorMessage = (data) => {
  if (data && data.message && data.message === 'Unverified') {
    return 'Tag taken, please provide another abeg tag.'
  }
  return 'Something went wrong.'
}

export const unauthorizedResponse = ({ response, data, message }: RDM) => {
  return response.status(401).json({
    status: false,
    message,
    data,
  })
}

export const forbiddenResponse = ({ response, data, message }: RDM) => {
  return response.status(403).json({
    status: false,
    message,
    data,
  })
}

export const notFoundResponse = ({ response, data, message }: RDM) => {
  return response.status(404).json({
    status: false,
    message,
    data,
  })
}

export const serverErrorResponse = ({ response, data, message }: RDM) => {
  return response.status(500).json({
    status: false,
    message,
    data,
  })
}

export const validationErrorResponse = ({ response, message, field }: RMF) => {
  return response.status(500).json({
    status: false,
    message: 'validation error',
    data: [
      {
        message,
        field,
        validation: 'valid',
      },
    ],
  })
}