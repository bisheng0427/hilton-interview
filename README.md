# my_project

## project intro
1. use koa framework
2. use lerna manage packages
3. use couchbase as NoSQL database
4. provide swagger to view and interact api
5. use graphql to interact with backend
6. use react in frontend

## QuickStart

### install dependency
```bash
$ npm install --global lerna
$ lerna bootstrap
```


### run backend service test case
```bash
$ lerna run test-backend
```

### start backend service
```bash
$ lerna run dev-backend
```

### start frontend app(not finish)
```bash
$ lerna run start-app
```

### fill test employee/user data
```
$ curl http://localhost:7001/employee/testData
$ curl http://localhost:7001/guest/testData
```

## swagger
http://127.0.0.1:7001/swagger-ui/index.html#

## graphql playground
http://127.0.0.1:7001/graphql