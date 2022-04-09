import { GraphQLID, GraphQLList, GraphQLObjectType } from 'graphql'
import { UserType } from '../User'
import { fromGlobalId } from 'graphql-relay'
import { db } from '../../db'
import { PostType } from '../Post'
import { nodeField, nodesField } from '../Node'

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve: (_, args) => {
        const { id } = fromGlobalId(args.id)
        return db.getUser(id)
      }
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve: (_, args) => {
        const { id } = fromGlobalId(args.id)
        return db.getPost(id)
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: (_, args) => {
        return db.getUsers()
      }
    },
    node: nodeField,
    nodes: nodesField
  })
})
