import { GraphQLObjectType, GraphQLString } from 'graphql'
import {
  connectionArgs,
  connectionFromArray,
  globalIdField
} from 'graphql-relay'
import { db } from '../../db'
import { postConnection } from '../Post'
import { nodeInterface } from '../Node'

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User of a blog',
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    username: { type: GraphQLString, description: 'The name of the user' },
    country: { type: GraphQLString },
    email: { type: GraphQLString },
    company: { type: GraphQLString },
    city: { type: GraphQLString },
    posts: {
      type: postConnection,
      description: `This user's posts`,
      args: connectionArgs,
      resolve: async (user, args) => {
        const userPosts = await db.getUserPosts(user.id)
        return connectionFromArray([...userPosts], args)
      }
    }
  })
})
