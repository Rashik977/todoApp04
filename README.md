Running it on your own machine:

1. pull the docker image using: docker pull rashik977/todo:4.0
2. run the image using your own .env file (contents of the env are in .env.example), run command : docker run --env-file .env -p 3000:3000 rashik977/todo:4.0
3. use Postman(or your choice of HTTP client) to use the API.

Executing:
1. There is a super user with email: super@super.com and password: 1234. Log in from route auth/login
2. The data has been validated using schema for users and tasks.
