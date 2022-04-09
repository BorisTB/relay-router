import { GraphQLObjectType, GraphQLString } from 'graphql'
import { connectionDefinitions, globalIdField } from 'graphql-relay'
import { db } from '../../db'
import { UserType } from '../User'
import { nodeInterface } from '../Node'

export const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    body: { type: GraphQLString, description: 'Content of the post' },
    author: {
      type: UserType,
      description: `User who made this post`,
      resolve: async (post, args) => {
        return await db.getUser(post.userId)
      }
    }
  })
})

const { connectionType: postConnection } = connectionDefinitions({
  nodeType: PostType
})

export { postConnection }
