export default {
  parameters: {
    SizeParam: {
      name: 'size',
      in: 'query',
      description: 'Pagination size items',
      schema: {
        type: 'integer',
        default: 50,
      },
    },
    PageParam: {
      name: 'page',
      in: 'query',
      description: 'Pagination page number',
      schema: {
        type: 'integer',
        default: 1,
      },
    },
    SearchParam: {
      name: 'search',
      in: 'query',
      description: 'Search criteria',
      schema: {
        type: 'string',
      },
    },
    UserSortParam: {
      name: 'sort',
      in: 'query',
      description: 'Sort by',
      schema: {
        type: 'string',
        enum: [
          'id',
          '-id',
          'first_name',
          '-first_name',
          'last_name',
          '-last_name',
          'email',
          '-email',
        ],
      },
    },
    UserStatusParam: {
      name: 'status',
      in: 'query',
      description: 'User status',
      schema: {
        type: 'string',
        enum: ['active', 'inactive'],
      },
    },
    resetPasswordTokenParam: {
      name: 'token',
      in: 'query',
      required: true,
      schema: {
        type: 'string',
      },
    },
    ProductSortParam: {
      name: 'sort',
      in: 'query',
      description: 'Sort by',
      schema: {
        type: 'string',
        enum: ['id', '-id', 'title', '-title'],
      },
    },
    CategorySortParam: {
      name: 'sort',
      in: 'query',
      description: 'Sort by',
      schema: {
        type: 'string',
        enum: ['id', '-id', 'title', '-title'],
      },
    },
    AttributeSortParam: {
      name: 'sort',
      in: 'query',
      description: 'Sort by',
      schema: {
        type: 'string',
        enum: ['id', '-id', 'title', '-title'],
      },
    },
    PropertySortParam: {
      name: 'sort',
      in: 'query',
      description: 'Sort by',
      schema: {
        type: 'string',
        enum: ['id', '-id', 'title', '-title'],
      },
    },
  },
};
