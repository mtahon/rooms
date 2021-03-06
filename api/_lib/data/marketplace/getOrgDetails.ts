import { GraphQLClient, gql } from 'graphql-request'

import { IOrgDetails } from '../../../_lib/types'
import { CError } from '../../../_lib/tools'
import { AppConfig } from '../../../_lib/infra/config'
import { CONSTANTS } from '../../../_lib/infra/constants'

const { INTERNAL_SERVER_ERROR } = CONSTANTS.HTTP_STATUS

function makeGraphqlRequest(apiUrl: string, orgId: string): Promise<IOrgDetails> {
  let resolutionFunc: (data: IOrgDetails) => void
  let rejectionFunc: (err: unknown) => void

  const resultsPromise = new Promise<IOrgDetails>((_resolutionFunc, _rejectionFunc) => {
    resolutionFunc = _resolutionFunc
    rejectionFunc = _rejectionFunc
  })

  const graphQLClient = new GraphQLClient(apiUrl, { headers: {} })

  const query = gql`
    {
      organization(id: "${orgId}") {
        id
        did
        publicKey {
          id
          did
          publicKeyPem
          type
        }
        owner
        isActive
      }
    }
  `

  graphQLClient.request(query)
    .then((data: IOrgDetails) => {
      if (!data || !data.organization) {
        throw 'Could not retrieve organization data.'
      }

      resolutionFunc(data)
    })
    .catch((err: unknown) => {
      rejectionFunc(err)
    })

  return resultsPromise
}

async function getOrgDetails(orgId: string): Promise<IOrgDetails> {
  const appConfig = await AppConfig.getInstance().getConfig()

  let orgDetails
  try {
    orgDetails = await makeGraphqlRequest(appConfig.WT_THEGRAPH_API_URL, orgId)
  } catch (err) {
    throw new CError(INTERNAL_SERVER_ERROR, `Could not resolve org details for orgId '${orgId}'.`)
  }

  return orgDetails
}

export {
  getOrgDetails,
}
