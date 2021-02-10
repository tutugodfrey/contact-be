const chai = require('chai');
const chaiHttp = require('chai-http');
import { clearDatabase } from '../helper';

const app = require('../server.js');
const { expect } = chai;
chai.use(chaiHttp);
const userObj = {
    name: 'godfrey',
    email: 'johndoe@email.com',
    username: 'johndoe',
    password: 'Aa!11234',
}
const userLoginObj = {
  username: 'johndoe',
  password: 'Aa!11234',
}
const createdUser = {};

describe('Testing Auth user', () => {
  before(async () => {
    await clearDatabase()
  });

  describe('Sign Up method', () => {
    it('User not signup with username', () => {
      const user = { ...userObj };
      delete user.username;
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('username is required');
        });
    });

    it('User not signup if username is empty', () => {
      const user = { ...userObj };
      user.username = ' ';
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('username cannot be empty');
        });
    });

    it('User not signup with username is null', () => {
      const user = { ...userObj };
      user.username = null;
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('username is required');
        });
    });

    it('User not signup with password', () => {
      const user = { ...userObj };
      delete user.password;
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('password is required');
        })
    });

    it('User not signup if password empty', () => {
      const user = { ...userObj };
      user.password = ' ';
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('password cannot be empty');
        })
    });

    it('User not signup if password is null', () => {
      const user = { ...userObj };
      user.password = null;
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('password is required');
        })
    });

    it('User not signup if password is does not match required pattern', () => {
      const user = { ...userObj };
      user.password = 'Aa112';
      const message =
        'password must be at least 6 character long, contain alphanumeric and specail characters';
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          console.log('Revisit to correct password requirement for alphanumeric')
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal(message);
        })
    });

    it('User not signup with name', () => {
      const user = { ...userObj };
      delete user.name;
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('name is required');
        })
    });

    it('User not signup if name is empty', () => {
      const user = { ...userObj };
      user.name = ' ';
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('name cannot be empty');
        })
    });

    it('User not signup if name is null', () => {
      const user = { ...userObj };
      user.name = null;
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('name is required');
        })
    });

    it('User not signup with email', () => {
      const user = { ...userObj };
      delete user.email;
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('email is required');
        })
    });

    it('User not signup if email is empty', () => {
      const user = { ...userObj };
      user.email = ' ';
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('email cannot be empty');
        })
    });

    it('User not signup if email is null', () => {
      const user = { ...userObj };
      user.email = null;
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('email is required');
        })
    });

    it('User sign up with all field passed', () => {
      const user = { ...userObj };
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          Object.assign(createdUser, res.body);
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('username').to.equal(userObj.username);
          expect(res.body).to.have.property('name').to.equal(userObj.name);
          expect(res.body).to.have.property('email').to.equal(userObj.email);
        })
    });

    it('Should not create user with duplicate identity', () => {
      const user = { ...userObj };
      return chai.request(app)
        .post('/auth/signup')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(409);
          expect(res.body)
            .to.have.property('message')
            .to.equal('User already exists');
        })
        .catch(err => console.log(err));
    });
  });

  describe('Login method', () => {
    it('User not login with username', () => {
      const user = { ...userLoginObj };
      delete user.username;
      return chai.request(app)
        .post('/auth/login')
        .send(user)
        .then(res =>    {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('username is required');
        })
    });

    it('User not login with password', () => {
      const user = { ...userLoginObj };
      delete user.password;
      return chai.request(app)
        .post('/auth/login')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('password is required');
        })
    });

    it('Not login with an empty username', () => {
      const user = { ...userLoginObj };
      user.username = ' ';
      return chai.request(app)
        .post('/auth/login')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('username cannot be empty');
        })
    });

    it('Not login with an empty email', () => {
      const user = { ...userLoginObj };
      user.password = ' ';
      return chai.request(app)
        .post('/auth/login')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('password cannot be empty');
        })
    });

    // it('Not log user in without a valid username', () => {
    //   const user = { ...userLoginObj };
    //   user.username = 'invalidUsername'
    //   return chai.request(app)
    //     .post('/auth/login')
    //     .send(user)
    //     .then(res => {
    //       expect(res.status).to.equal(401);
    //       expect(res.body)
    //       .to.have.property('message')
    //       .to.equal('Auth failed! Please check your username and password');
    //     })
    // });  

    it('User not login without a valid password', () => {
      const user = { ...userLoginObj };
      user.password = 'invalidpassword'
      return chai.request(app)
        .post('/auth/login')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(401)
          expect(res.body)
          .to.have.property('message')
          .to.equal('Auth failed! Please check your username and password');
        })
    });

    it('User login with all field passed and receive a token', () => {
      const user = { ...userLoginObj };
      return chai.request(app)
        .post('/auth/login')
        .send(user)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('username').to.equal(userObj.username);
          expect(res.body).to.have.property('name').to.equal(userObj.name);
          expect(res.body).to.have.property('email').to.equal(userObj.email);
        });
    });
  });

  describe('Forget password', () => {
    it('should not reset password without an email', () => {
      return chai.request(app)
        .post('/auth/forgotPassword')
        .send({
          password: 'newpassword',
        })
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(400);
          expect(result)
            .to.have.property('message')
            .to.equal('email is required');
        });
    });

    it('should not reset password without an empty email', () => {
      return chai.request(app)
        .post('/auth/forgotPassword')
        .send({
          password: 'newpassword',
          email: ' ',
        })
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(400);
          expect(result)
            .to.have.property('message')
            .to.equal('email cannot be empty');
        });
    });

    it('should  not reset passwrod without a new password', () => {
      return chai.request(app)
        .post('/auth/forgotPassword')
        .send({
          email: createdUser.email,
        })
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(400);
          expect(result)
            .to.have.property('message')
            .to.equal('password is required');
        });
    });

    it('should  not reset passwrod without a new password', () => {
      return chai.request(app)
        .post('/auth/forgotPassword')
        .send({
          email: createdUser.email,
          password: ' ',
        })
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(400);
          expect(result)
            .to.have.property('message')
            .to.equal('password cannot be empty');
        });
    });

    it('should not delete contact that does not exist', () => {
      return chai.request(app)
        .post('/auth/forgotPassword')
        .send({
          email: createdUser.email,
          password: 'john-newpasswd',
        })
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(200);
          expect(result)
            .to.have.property('message')
            .to.equal('Successfully reset password');
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name').to.equal(createdUser.name);
          expect(res.body).to.have.property('username').to.equal(createdUser.username);
          expect(res.body).to.have.property('email').to.equal(createdUser.email);
          expect(res.body).to.have.property('createdAt');
          expect(res.body).to.have.property('updatedAt');
        });
    });
  });
});
