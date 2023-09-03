Note: Please make sure that docker is installed before running this application.

Tech stack
NestJS (Node.js framework) with Typescript
PostgreSQL

Installation:
1. Run below command to setup the database:
  docker compose up -d db
2. Run below command to build the docker image:
  docker compose build  
3. Run below command to run the docker container:
  docker compose up

Service is up and running now.

Now open postman or thunder client and import the thunder-collection_Mini Loan API.json and run all the API endpoints to get the results.



