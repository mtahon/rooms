import { getObjectIdString } from '../../../_lib/tools'
import { IProfileDbRecord, IProfile, IProfileDbRecordCollection, IProfileCollection } from '../../../_lib/types'

function profileMapper(profileDbRecord: IProfileDbRecord): IProfile {
  const profile: IProfile = {
    id: getObjectIdString(profileDbRecord._id),
    email: profileDbRecord.email,
    name: profileDbRecord.name,
    phone: profileDbRecord.phone,
    oneTimePassword: profileDbRecord.oneTimePassword,
    sessionToken: profileDbRecord.sessionToken,
    role: profileDbRecord.role,
    hotelId: getObjectIdString(profileDbRecord.hotelId),
  }

  return profile
}

function profileCollectionMapper(profileDbRecordCollection: IProfileDbRecordCollection): IProfileCollection {
  const profiles: IProfileCollection = []
  profileDbRecordCollection.forEach((profileDbRecord) => {
    profiles.push(profileMapper(profileDbRecord))
  })

  return profiles
}

export {
  profileMapper,
  profileCollectionMapper,
}
