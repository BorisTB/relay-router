import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import { db } from '../db'
import { UserType } from './User'
import { PostType } from './Post'

export const { nodeInterface, nodeField, nodesField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === 'User') return db.getUser(id)
    if (type === 'Post') return db.getPost(id)
    return null
  },
  (obj) => {
    if (obj.email) {
      return UserType.name
    }
    if (obj.body) {
      return PostType.name
    }
    return null
  }
)
