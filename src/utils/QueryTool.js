class QueryTool {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const removeField = ['page', 'sort', 'limit', 'fields'];
    removeField.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));

    this.query.find(JSON.parse(queryStr));

    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  
  sort() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limitNum = this.queryString.limit * 1 || 10;
    const skipNum = (page - 1) * limitNum;

    console.log(skipNum, limitNum);
    this.query = this.query.skip(skipNum).limit(limitNum);

    return this;
  }
}

module.exports = QueryTool;
