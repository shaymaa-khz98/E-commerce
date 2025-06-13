const { Op } = require("sequelize");

class apiFeatures {
 constructor(queryParams){
    this.queryParams = queryParams;
    this.queryOptions = {};
    // this.paginationResult ={}
 }

 // 1) Filtering
 filter() {
    const queryObj = { ...this.queryParams };
    const excludedFields = ['page', 'sort', 'limit', 'fields','keyword'];
    excludedFields.forEach(field => delete queryObj[field]);

    // Convert to Sequelize operators
    let where = {};
    for (const [key, value] of Object.entries(queryObj)) {
      if (typeof value === 'object' && value !== null) {
        where[key] = {};
        for (const [operator, val]of Object.entries(value)) {
          if (['gte', 'gt', 'lte', 'lt'].includes(operator)) {
            where[key][Op[operator]] =  Number(val);
          }
        }
      } else {
        // value is a normal value
        where[key] = value;
      }
    }

    this.queryOptions.where = where;
    return this;
  }
  //Sorting
  sort(){
  if(this.queryParams.sort){
    const sortFields = this.queryParams.sort.split(',').map(sortField =>{
      if(sortField.startsWith('-')){
         return [sortField.substring(1) , 'DESC']
      }
      return [sortField , 'ASC']
    })
    this.queryOptions.order = sortFields;
    
  } 
  // else{
  //   this.queryOptions.order = [['createdAt' ,'DESC']]
  // }
  return this;
}
// 3) Paginate
paginate(countDocuments){
  const page = this.queryParams.page * 1 || 1;
  const limit = this.queryParams.limit *1 || 5;
  const offset = (page -1) * limit;
  const endIndex = page * limit;

  // Pagination result metadata
  const pagination = {};
  pagination.currentPage = page;
  pagination.limit = limit;
  pagination.numberOfPages = Math.ceil(countDocuments / limit);

  if (endIndex < countDocuments) {
    pagination.next = page + 1;
  }

  if (offset > 0) {
    pagination.prev = page - 1;
  }

  this.queryOptions.limit = limit;
  this.queryOptions.offset = offset;
  this.paginationResult = pagination;
  return this;

}

// 4) Fields Limiting
limitFields(){
  if(this.queryParams.fields){
    const fields = this.queryParams.fields.split(',');
      if(fields[0].startsWith('-')){
        this.queryOptions.attributes = {
          exclude: fields.map(field => field.substring(1))
        };
      }else {
        this.queryOptions.attributes = fields;
      }
  }
  return this ;
};
// 5) Searching
search(modelName) {
  if (this.queryParams.keyword) {
    const currentWhere = this.queryOptions.where || {};
    const keyword = this.queryParams.keyword;

    if (modelName === 'Product') {
      this.queryOptions.where = {
        ...currentWhere,
        [Op.or]: [
          { title: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } }
        ]
      };
    } else if (modelName === 'Brand') {
      this.queryOptions.where = {
        ...currentWhere,
        brandName: { [Op.like]: `%${keyword}%` }
      };
    } else if (modelName === 'Category') {
      this.queryOptions.where = {
        ...currentWhere,
        categoryName: { [Op.like]: `%${keyword}%` }
      };
    } else if (modelName === 'Review') {
      this.queryOptions.where = {
        ...currentWhere,
        title: { [Op.like]: `%${keyword}%` }
      };
    } else {
      this.queryOptions.where = {
        ...currentWhere,
        name: { [Op.like]: `%${keyword}%` }
      };
    }
  }

  return this;
}


getQueryOptions() {
  return this.queryOptions;
}
}

module.exports = apiFeatures; 