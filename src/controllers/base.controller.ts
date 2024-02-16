import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Recipe from '../repositories/recipe.repository'
import sql from 'mssql'

import getSchema from '../schema/get'

declare module 'fastify' {
  export interface FastifyInstance {
    getSqlPool: (name?: string) => Promise<sql.ConnectionPool>
  }

  export interface FastifyReply {
    success: (data?: any, code?: number, executionTime?: number) => FastifyReply
    fail: (data?: any, code?: number, executionTime?: number) => FastifyReply
    error: (message?: string, code?: number, executionTime?: number) => FastifyReply
  }
}

export default async function (fastify: FastifyInstance) {
  /**
   * Get analytics dashboard from DB
   * @route GET /api/{APP_VERSION}/recipes/search
   */
  fastify.get('', getSchema, async function (request: FastifyRequest<{
    Querystring: {
      page?: number
      count?: number,
      culture?: string
      query?: string
      collection?: number
      types?: string
      tags?: string
    }
  }>, reply: FastifyReply) {
    const start = performance.now()

    try {
      const page: number = request.query?.page ?? 0
      const count: number = request.query.count ?? 20
      const culture = request.query.culture ?? 'nl'
      const query = request.query.query
      const collection = request.query.collection

      let filters = ''

      if (request.query.types?.length ?? 0 > 0) {
        filters += `${request.query.types};`
      } else {
        filters += ';'
      }

      if (request.query.tags?.length ?? 0 > 0) {
        filters += request.query.tags
      }

      const pool = await fastify.getSqlPool()
      const repo = new Recipe(request.log, pool)
      const response = await repo.list({ page, count, culture, query, collection })

      if (response) return reply.success(response, 200, performance.now() - start)
      return reply.fail({ query: 'no results!' }, 404, performance.now() - start)
    } catch (err) {
      request.log.error({ err }, 'failed to get recipe list!')
      return reply.error('failed to get recipe list!', 500, performance.now() - start)
    }
  })
  /**
   * Get analytics dashboard from DB
   * @route GET /api/{APP_VERSION}/recipes/search
   */
  fastify.get('/product/:product_id', getSchema, async function (request: FastifyRequest<{
    Params: {
      product_id: number
    },
    Querystring: {
      culture?: string
    }
  }>, reply: FastifyReply) {
    const start = performance.now()

    try {
      const product_id = request.params.product_id
      const culture = request.query.culture ?? 'nl'

      const pool = await fastify.getSqlPool()
      const repo = new Recipe(request.log, pool)
      const response = await repo.list({ product_id, culture })

      if (response) return reply.success(response, 200, performance.now() - start)
      return reply.fail({ query: 'no results!' }, 404, performance.now() - start)
    } catch (err) {
      request.log.error({ err }, 'failed to get recipes list for product!')
      return reply.error('failed to get recipes list for product!', 500, performance.now() - start)
    }
  })
}