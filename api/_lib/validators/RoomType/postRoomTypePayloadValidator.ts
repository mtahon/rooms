import { NowRequest } from '@vercel/node'

import { validateRequiredString, validateOptionalString, validateOptionalNumber } from '../_helpers'
import { CError } from '../../../_lib/tools'
import { CONSTANTS } from '../../../_lib/infra/constants'
import { IPostRoomTypePayload } from '../../../_lib/types'

const { BAD_REQUEST } = CONSTANTS.HTTP_STATUS

async function postRoomTypePayloadValidator(request: NowRequest): Promise<IPostRoomTypePayload> {
  if (!request.body) {
    throw new CError(BAD_REQUEST, 'Must provide a valid body with request.')
  }

  const payload: IPostRoomTypePayload = {
    hotelId: '',
    type: '',
  }

  const ALLOWED_PROPS: Array<keyof IPostRoomTypePayload> = [
    'hotelId',
    'type',
    'quantity',
    'price',
    'amenities',
    'imageUrl',
  ]

  for (const [key] of Object.entries(request.body)) {
    if (!ALLOWED_PROPS.includes(key as keyof IPostRoomTypePayload)) {
      throw new CError(BAD_REQUEST, `Property '${key}' on 'roomType' is not settable.`)
    }
  }

  const hotelId = request.body.hotelId
  await validateRequiredString('hotelId', hotelId)
  payload.hotelId = hotelId

  const type = request.body.type
  await validateRequiredString('type', type)
  payload.type = type

  const quantity = request.body.quantity
  await validateOptionalNumber('quantity', quantity)
  payload.quantity = quantity

  const price = request.body.price
  await validateOptionalNumber('price', price)
  payload.price = price

  const amenities = request.body.amenities
  await validateOptionalString('amenities', amenities)
  payload.amenities = amenities

  const imageUrl = request.body.imageUrl
  await validateOptionalString('imageUrl', imageUrl)
  payload.imageUrl = imageUrl

  return payload
}

export {
  postRoomTypePayloadValidator,
}
