const numberType = { type: 'number' }
const stringType = { type: 'string' }
const booleanType = { type: 'boolean' }

const getSchema = {
  type: 'object',
  properties: {
    statusCode: numberType,
    status: stringType,
    error: stringType,
    verified: booleanType,
    result: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: numberType,
          title: stringType,
          description: stringType,
          duration: numberType,
          unit: stringType,
          amount: numberType,
          date: stringType,
          logo: stringType,
          image: stringType,
          types: {
            anyOf: [
              {
                type: 'null'
              },
              {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: stringType
                  }
                }
              }
            ]
          },
          isNew: booleanType
        }
      }
    },
    count: numberType,
    types: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: numberType,
          text: stringType
        }
      }
    },
    tags: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: numberType,
          text: stringType
        }
      }
    }
  }
}

const options = {
  schema: {
    description: 'Get a list of recipes based on query parameter based filters',
    response: {
      200: getSchema
    }
  }
}

export default options