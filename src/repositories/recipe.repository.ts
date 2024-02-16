import sql from 'mssql'
import { FastifyBaseLogger } from 'fastify'

export default class Recipe {
  schema: string = 'recipe.'
  _logger: FastifyBaseLogger
  _pool: sql.ConnectionPool

  constructor(logger: FastifyBaseLogger, pool: sql.ConnectionPool) {
    this._logger = logger
    this._pool = pool
  }

  async list({ page, product_id, count, culture, query, filters, collection }: IListParameters): Promise<any | undefined> {
    const r = new sql.Request(this._pool)
    r.input('page', sql.Int, page)
    r.input('product_id', sql.Int, product_id)
    r.input('count', sql.Int, count)
    r.input('culture', sql.VarChar, culture)
    r.input('query', sql.VarChar, query)
    r.input('filters', sql.VarChar, filters)
    r.input('collection', sql.Int, collection)
    const result = await r.execute(this.schema + 'p_list')

    if (result.recordset[0])
      return {
        recipes: result.recordsets[1][0] || [],
        count: result.recordsets[2][0].count,
        f_types: result.recordsets[3],
        f_tags: result.recordsets[4]
      }
    return undefined
  }
}

export interface IListParameters {
  page?: number,
  product_id?: number,
  count?: number,
  culture: string,
  query?: string,
  filters?: string,
  collection?: number
}