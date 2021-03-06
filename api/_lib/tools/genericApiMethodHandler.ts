import { NowRequest, NowResponse } from '@vercel/node'

import { errorHandler, CError, checkRequiredAppConfigProps } from '../../_lib/tools'
import { CONSTANTS } from '../../_lib/infra/constants'
import { IMethodHandlerHash } from '../../_lib/types'

const { HTTP_STATUS_CODES } = CONSTANTS
const { BAD_REQUEST, FORBIDDEN, NOT_IMPLEMENTED, INTERNAL_SERVER_ERROR, OK }  = CONSTANTS.HTTP_STATUS

async function genericApiMethodHandler(
  request: NowRequest, response: NowResponse,
  availMethodHandlers: IMethodHandlerHash
): Promise<void> {
  if (!request || typeof request.method !== 'string') {
    return errorHandler(response, new CError(BAD_REQUEST, 'Must provide request method.'))
  }

  const method: string = request.method.toUpperCase()

  const ALLOWED_METHODS: Array<keyof IMethodHandlerHash> = [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'DELETE',
    'CONNECT',
    'OPTIONS',
    'TRACE',
    'PATCH',
  ]

  if (!ALLOWED_METHODS.includes(method as keyof IMethodHandlerHash)) {
    return errorHandler(response, new CError(FORBIDDEN, `Method '${method}' is not allowed.`))
  }

  const methodHandler: keyof IMethodHandlerHash = method as keyof IMethodHandlerHash
  if (typeof availMethodHandlers[methodHandler] !== 'function') {
    return errorHandler(response, new CError(NOT_IMPLEMENTED, `Method '${method}' is not implemented.`))
  }

  const methodFunc = availMethodHandlers[methodHandler]
  if (typeof methodFunc === 'undefined') {
    return errorHandler(response, new CError(INTERNAL_SERVER_ERROR, `Method handler for '${method}' is not defined.`))
  }

  let result
  try {
    await checkRequiredAppConfigProps()
    result = await methodFunc(request, response)
  } catch (err) {
    return errorHandler(response, err)
  }

  if (typeof result === 'string') {
    response.status(HTTP_STATUS_CODES[OK]).send(result)
  } else {
    response.status(HTTP_STATUS_CODES[OK]).json(result)
  }
}

export {
  genericApiMethodHandler,
}
