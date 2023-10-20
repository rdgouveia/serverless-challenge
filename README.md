# Serverless-Challenge

## _A simple project challenge_

On this project i built a serverless application to register, update, delete and consult a database of employees.

# Requirements

- NodeJS
- AWS Account
- Atlas Cluster
- Serverless

# Running project

- Clone the repo
- Run **npm install -g serverless** to install serverless
- Create the **.env** file using the **.env.example** as guide
- Set your **AWS** credentials on project (if you dont know how to do that, go to the end of the documentation)
- Run **yarn** or **npm i** to install the deps

Now the project should be ready to run.

# Using _Serverless Offline_

Serverless Offline is a plugin to Serverless that allow you to run the project emulating AWS enviroment, with that you can test and see if your application is ready to be deployed.

To use Serverless Offline you just need to:

- Go to project folder
- Make sure you have everything installed on the project and configured
- Run **sls offline --stage dev** on your terminal

This should build the application and log the availables routes to be used. Now you can test the application.

# Using tests

If you want to use the tests, its pretty simple:

- Go to project folder
- Make sure you have everything installed on the project and configured
- Run **yarn test** or **npm test**

Now the tests should running and, if everything is correct, that should pass all the tests.

# Deploying to AWS

If you want to deploy the application to AWS, you **need** your AWS credentials, without that you cannot deploy your application. If you did'nt configured you AWS credentials yet, see how to do that on the end of the documentation.

- Go to project folder
- Make sure you have everything installed on the project and configured
- Run **sls deploy --stage dev** (if you want to deploy to another stage, just change _dev_ to another one, eg. _prod_)

This should deploy your application and log your endpoint on AWS.

# Routes

This project has just 5 routes available to be used.

### Crate a new employee on database (POST - /employee/newEmployee)

Its a route to create a new employee on database. You need to to send on the body of request something like this:

```json
{
  "name": "Rafael A.",
  "age": 22,
  "role": "Boss"
}
```

### Update a employee info on database (PATCH - /employee/updateEmployee/:id)

This route update a employee info on database, this is what you need to send on request:

On path parameter you need to send the \_id of the employee, like this
`/employee/updateEmployee/6531b07d759e919d089942f2`

On body, you can send on or more of those infos. Its not required to send all:

```json
{
  "name": "Rafael A.",
  "age": 22,
  "role": "Boss"
}
```

### Delete a employee from database (DELETE - /employee/deleteEmployee/:id)

This route delete a employee from database based on \_id that you pass on path parameter:

On path parameter you need to send the \_id of the employee, like this
`/employee/deleteEmployee/6531b07d759e919d089942f2`

### Return information about a specific employee (GET - /employee/getEmployee/:id)

This route return informations about a specific employee from database based on \_id that you pass on path parameter:

On path parameter you need to send the \_id of the employee, like this
`/employee/getEmployee/6531b07d759e919d089942f2`

### Return information of all employees (GET - /employee/getAllEmployees)

This route return information about all employees registed on database. This route has pagination, so you need to pass the page on query string parameters to navigate on the infos. Send something like this:
`/employee/getAllEmployees?page=1` (the pagination init with 1)

# Setting up your AWS credentials on project

To set your AWS credentials to the project:

- Go to project folder
- Run **sls config credentials --provider aws --key _YOUR_KEY_ --secret _YOUR_SECRET_**

You can see a tutorial to get your AWS credentials [here](https://docs.aws.amazon.com/keyspaces/latest/devguide/access.credentials.html)
