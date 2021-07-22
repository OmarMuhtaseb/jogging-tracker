
# Jogging Tracker Challenge
This is a simple service to track users jogging.

## Quick Start

 - `git clone git@git.toptal.com:screening/Omar-Muhtaseb.git`
 - `npm ci`
 - `npm start`
 - `http://localhost:7000/health-check`

## Overview

 - NestJS (Typescript).
 - MongoDB
 - Three roles
	 - user
	 - manager: Have control over the users
	 - admin: Have control over everything
 - The APIs take into consideration the current role of the logged in users. So, each API behaves accordingly. 
	 - For example, when a regular user requests the jogs report, the report will be generated for the user's jogs only. However, when the admin requests the API, the report will be generated for all the users.
 - All list APIs provide pagination along with filters.
 - APIs doc http://localhost:7000/api
 - e2e test to cover all the APIs in the system.
 - To use the system please login as admin with 
	 - email: admin@gmail.com
	 - password: Abcd@1234
 - Listing filters
	 - Since I'm using MongoDB as the database, the filter pattern was really off of the query syntax.
	 - In order to parse the filters, I had to change it into something like **postfix format** before I can parse it.
	 - Then I solve the postfix pattern into a final query that can be used in MongoDB
 - Swagger for documentation, http://localhost:7000/api
 - Jest for e2e tests
 - JWT for authentication
 - `api.weatherstack.com` for weather

## APIs
- GET /health-check
- POST /users
- GET /users
- GET /users/me
- PUT /users/me
- GET /users/{id}
- PUT /users/{id}
- DELETE /users/{id}
- POST /users/sign-up
- POST /users/login
- POST /jogs
- GET /jogs
- GET /jogs/{id}
- PUT /jogs/{id}
- DELETE /jogs/{id}
- GET /jogs/report
