Contact/Address Book (Rest Backend) Concept - Assessment
===

![](https://github.com/tutugodfrey/contact-be/workflows/Test%20Pipeline/badge.svg)
---

You will be tasked with creating a nodejs based REST application which will serve as a data source for an existing Contact/Address book web and mobile application.
The application will expose two rest resources

* Auth Resource – This will handle endpoints for authentication which will include, login, signup etc
* Contact Resource – This will handle CRUD endpoints for managing a user’s contact list. All endpoints in this resource should only be accessed by an authenticated and authorized user.

The project will persist data to a mongodb database. A local database can be used but do provide instructions for reproducing the database.

What we are testing
--

* Express Project Structure Comprehension
* Rest API Authentication
* Rest API Endpoint Nomenclature
* JavaScript ECMA standards 
* Data Persistence (MongoDB)
* Unit Testing

What you will be given
--

You will be provided with an initial project which will need to be completed. The project contains annotations which will serve as hints which should point you in the right direction when implementing missing endpoints and logic.
The project structure is shown below.

Go through the code to understand the structure before you start.
Note:
The assessment project uses babel to transpile ES6/ES7 to ES5

Get Ready to Run
---

* Pull the assessment repo
    - > `git clone https://gitea.udux.com/backend-assessments/contact.git`
* Pull up your favorite console and change to this directory
* Install the projects dependencies 
    - > `npm install`

Setup the environment
---

You can enable database connection by providing the connection information in the .env file. The sample of what is required is present in .env.example. In the .env file you can either provide individual connection detail `DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME` or specify the `DATABASE_URL` as a single string value.

You also need to provide / change the value of the `SECRET_KEY` which will be used to sign our authentication token

* To copy the content of .env.example to .env

   - > 'cp .env.example .env

Then fill in the appropriate values.

Start Development 
---

* To build the project
    - > `npm run build`
* To continuously watch for changes 
    - > `npm run watch`
* To run your app server 
    - > `npm run start`

Submitting
---
Push the repo to your favourite repo platform and share the url.

NOTES
---

In the start script in `package.json`, I've included command to copy the `.env` file to the `dist` directory when starting the server. Except you want to manually export the environment variables, please ensure `.env` file is present before starting the server.

Making API request
---

The samples below shows how to make http request to the server

**POST /auth/signup**

```
{
    "name": "John Doe",
    "username": "johndoe",
    "email": "johndoe@emai.com",
    "password": "Aa@11234"
}
```
**OUTPUT**

```
{
    "id": "602501885f4fad3da9562d21",
    "name": "John Doe",
    "username": "johndoe",
    "email": "johndoe@emai.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMjUwMTg4NWY0ZmFkM2RhOTU2MmQyMSIsIm5hbWUiOiJKb2huIERvZSIsInVzZXJuYW1lIjoiam9obmRvZSIsImVtYWlsIjoiam9obmRvZUBlbWFpLmNvbSIsImlhdCI6MTYxMzAzNzk2MCwiZXhwIjoxNjEzMTI0MzYwfQ.kXVJCWho9N0qQAZ63vXTzeThngj5yccc_6Hozy_y5-4"
}
```


**POST /auth/login**

```
{
    "username": "johndoe",
    "password": "Aa@11234"
}
```
**OUTPUT**

```
{
    "id": "602501885f4fad3da9562d21",
    "name": "John Doe",
    "username": "johndoe",
    "email": "johndoe@emai.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMjUwMTg4NWY0ZmFkM2RhOTU2MmQyMSIsIm5hbWUiOiJKb2huIERvZSIsInVzZXJuYW1lIjoiam9obmRvZSIsImVtYWlsIjoiam9obmRvZUBlbWFpLmNvbSIsImlhdCI6MTYxMzAzODA0NiwiZXhwIjoxNjEzMTI0NDQ2fQ.pPWnySAawEJx1W-JQC1VABYVj3BdtdNd8DPD7p6l97A"
}
```

**PORT /auth/forgotPassword**

```
{
    "email": "johndoe@emai.com",
    "password": "Aa@11234-new"
}
```
**OUTPUT**

```
{
    "id": "602501885f4fad3da9562d21",
    "name": "John Doe",
    "username": "johndoe",
    "email": "johndoe@emai.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMjUwMTg4NWY0ZmFkM2RhOTU2MmQyMSIsIm5hbWUiOiJKb2huIERvZSIsInVzZXJuYW1lIjoiam9obmRvZSIsImVtYWlsIjoiam9obmRvZUBlbWFpLmNvbSIsImlhdCI6MTYxMzAzODE4NywiZXhwIjoxNjEzMTI0NTg3fQ.6x5efsOz1iHyarfk6cHp_RopuLGeQ0fmdCCbwuU8Les",
    "createdAt": "2021-02-11T10:06:00.521Z",
    "updatedAt": "2021-02-11T10:09:47.974Z",
    "message": "Successfully reset password"
}
```


**POST /contact**

```
{
    "phone": "07060403020",
    "ownerId": "602501885f4fad3da9562d21",  # must be an id of user in DB to succeed
    "group": "family" # optional
}
```
**OUTPUT**

```
{
    "id": "6025037c5f4fad3da9562d22",
    "userId": "602501885f4fad3da9562d21",
    "ownerId": "602501885f4fad3da9562d21",
    "phone": "07060403020",
    "group": "family",
    "createdAt": "2021-02-11T10:14:20.491Z",
    "updatedAt": "2021-02-11T10:14:20.491Z"
}
```


**GET /contact** get all contacts

**OUTPUT**

```
[
    {
        "id": "6025037c5f4fad3da9562d22",
        "userId": "602501885f4fad3da9562d21",
        "ownerId": "602501885f4fad3da9562d21",
        "phone": "07060403020",
        "group": "family",
        "createdAt": "2021-02-11T10:14:20.491Z",
        "updatedAt": "2021-02-11T10:14:20.491Z"
    },
    {
        "id": "602503d65f4fad3da9562d23",
        "userId": "602501885f4fad3da9562d21",
        "ownerId": "602501885f4fad3da9562d21",
        "phone": "07060403033",
        "group": "family",
        "createdAt": "2021-02-11T10:15:50.148Z",
        "updatedAt": "2021-02-11T10:15:50.148Z"
    }
]
```

**GET /contact/6025037c5f4fad3da9562d22** get a single contact

**OUTPUT**

```
{
    "id": "6025037c5f4fad3da9562d22",
    "userId": "602501885f4fad3da9562d21",
    "ownerId": "602501885f4fad3da9562d21",
    "phone": "07060403020",
    "group": "family",
    "createdAt": "2021-02-11T10:14:20.491Z",
    "updatedAt": "2021-02-11T10:14:20.491Z"
}
```


**PUT /contact** Update contact phone or group

```
{
    "id": "602529bf89d3d759c34373bd", # required
    "ownerId": "602528ed89d3d759c34373bc",  # optional
    "group": "friends", # optional
    "phone": "07060441932" # optional
}
```
**OUTPUT**

```
{
    "id": "602503d65f4fad3da9562d23",
    "userId": "602501885f4fad3da9562d21",
    "ownerId": "602501885f4fad3da9562d21",
    "phone": "07060403033",
    "group": "friends",
    "createdAt": "2021-02-11T10:15:50.148Z",
    "updatedAt": "2021-02-11T10:30:28.073Z"
}
```

**DELETE /contact/6025037c5f4fad3da9562d22** DELETE contact

**OUTPUT**

```
{
    "message": "Contact successfully deleted"
}
```


