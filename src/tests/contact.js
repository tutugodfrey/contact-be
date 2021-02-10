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
  password: 'mypasswd',
}

const createdUser = {};
const createdContact1 = {};
const createdContact2 = {}

const contactObj1 = {
  phone: '07011223344',
  group: 'family',
  ownerId: '1'
}

const contactObj2 = {
  phone: '08011223344',
  ownerId: '1'
}


describe('Testing contacts', () => {
  before(async () => {
    await clearDatabase()
  });

  before(async () => {
    const user = { ...userObj };
    return chai.request(app)
      .post('/auth/signup')
      .send(user)
      .then(res => Object.assign(createdUser, res.body));
  });

  describe('Create method', () => {
    it('should not allow to route without a token', () => {
      const contact = { ...contactObj1 };
      delete contact.phone;
      return chai.request(app)
        .post('/contact')
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(401);
          expect(res.body)
            .to.have.property('message')
            .to.equal('Authentication failed! Please send a token');
        });
    });

    it('should not allow to route without a valid token', () => {
      const contact = { ...contactObj1 };
      delete contact.phone;
      return chai.request(app)
        .post('/contact')
        .set('token', 'sometoken')
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(401);
          expect(res.body)
            .to.have.property('message')
            .to.equal('Authentication failed! Invalid token');
        });
    });
  
    it('should not create contact without phone', () => {
      const contact = { ...contactObj1 };
      delete contact.phone;
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('phone is required');
        });
    });

    it('Should not create if phone is empty string', () => {
      const contact = { ...contactObj1 };
      contact.phone = ' ';
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('phone cannot be empty');
        });
    });

    it('Should not create if phone is null', () => {
      const contact = { ...contactObj1 };
      contact.phone = null;
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('phone is required');
        });
    });

    it('should not create contact without ownerId', () => {
      const contact = { ...contactObj1 };
      delete contact.ownerId;
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('ownerId is required');
        });
    });

    it('Should not create if ownerId is empty', () => {
      const contact = { ...contactObj1 };
      contact.ownerId = ' ';
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('ownerId cannot be empty');
        });
    });

    it('Should not create if ownerId is null', () => {
      const contact = { ...contactObj1 };
      contact.ownerId = null;
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('ownerId is required');
        });
    });

    it('Should not create if ownerId does not exist 1', () => {
      const contact = { ...contactObj1 };
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('Please provide a valid user id for ownerId');
        })
    });

    it('Should not create if ownerId does not exist 1', () => {
      const contact = { ...contactObj1 };
      contact.ownerId = '6021ff033b103d9f28da54fe';
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          expect(res.status).to.equal(400);
          expect(res.body)
            .to.have.property('message')
            .to.equal('Contact not saved! User does not exist');
        })
    });

    it('Should create if owner exist', () => {
      const contact = { ...contactObj1 };
      contact.ownerId = createdUser.id;
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          Object.assign(createdContact1, res.body);
          expect(res.status).to.equal(201);
          expect(res.body)
            .to.have.property('phone')
            .to.equal(contactObj1.phone);
          expect(res.body)
            .to.have.property('group')
            .to.equal(contactObj1.group);
          expect(res.body)
            .to.have.property('ownerId')
            .to.equal(createdUser.id);
          expect(res.body).to.have.property('createdAt')
          expect(res.body).to.have.property('updatedAt')
        })
    });

    it('Should create if owner exist', () => {
      const contact = { ...contactObj2 };
      contact.ownerId = createdUser.id;
      return chai.request(app)
        .post('/contact')
        .set('token', createdUser.token)
        .send(contact)
        .then(res => {
          Object.assign(createdContact2, res.body);
          expect(res.status).to.equal(201);
          expect(res.body)
            .to.have.property('phone')
            .to.equal(contactObj2.phone);
          expect(res.body)
            .to.not.have.property('group')
          expect(res.body)
            .to.have.property('ownerId')
            .to.equal(createdUser.id);
          expect(res.body).to.have.property('createdAt');
          expect(res.body).to.have.property('updatedAt');
        })
    });
  });

  describe('Get all method', () => {
        it('should return all contact', () => {
      return chai.request(app)
        .get(`/contact`)
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(401);
          expect(result)
            .to.have.property('message')
            .to.equal('Authentication failed! Please send a token');
        });
    });

    it('should return all contact', () => {
      return chai.request(app)
        .get(`/contact`)
        .set('token', 'invalidtoken')
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(401);
          expect(result)
            .to.have.property('message')
            .to.equal('Authentication failed! Invalid token');
        });
    });
    it('should return all contact', () => {
      return chai.request(app)
        .get('/contact')
        .set('token', createdUser.token)
        .then(res => {
          const [result1, ...rest ]= res.body
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length.greaterThan(1);
          expect(result1).to.have.property('id');
          expect(result1).to.have.property('userId');
          expect(result1).to.have.property('ownerId');
          expect(result1).to.have.property('phone');
        })
    });
  });

  describe('Get By Id method', () => {
        it('should return all contact', () => {
      return chai.request(app)
        .get(`/contact`)
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(401);
          expect(result)
            .to.have.property('message')
            .to.equal('Authentication failed! Please send a token');
        });
    });

    it('should return all contact', () => {
      return chai.request(app)
        .get(`/contact`)
        .set('token', 'invalidtoken')
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(401);
          expect(result)
            .to.have.property('message')
            .to.equal('Authentication failed! Invalid token');
        });
    });
    it('should return all contact', () => {
      return chai.request(app)
        .get(`/contact/${createdContact1.id}`)
        .set('token', createdUser.token)
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(200);
          expect(result).to.have.property('id');
          expect(result).to.have.property('userId');
          expect(result).to.have.property('ownerId');
          expect(result).to.have.property('phone');
        });
    });
  });

  describe('Update method', () => {
    it('should return all contact', () => {
      return chai.request(app)
        .put(`/contact`)
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(401);
          expect(result)
            .to.have.property('message')
            .to.equal('Authentication failed! Please send a token');
        });
    });

    it('should return all contact', () => {
      return chai.request(app)
        .put(`/contact`)
        .set('token', 'invalidtoken')
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(401);
          expect(result)
            .to.have.property('message')
            .to.equal('Authentication failed! Invalid token');
        });
    });

    it('should not update without ownerId', () => {
      return chai.request(app)
        .put(`/contact`)
        .set('token', createdUser.token)
        .send({
          phone: '06040302010'
        })
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(400);
          expect(result)
            .to.have.property('message')
            .to.equal('ownerId is required');
        });
    });

    it('should update with all required fields passed', () => {
      return chai.request(app)
        .put(`/contact`)
        .set('token', createdUser.token)
        .send({
          group: 'friends',
          ownerId: createdUser.id,
        })
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(200);
          expect(result).to.have.property('group').to.equal('friends');
        });
    });
  });

  describe('Remove all method', () => {
    it('should delete without providing a token', () => {
      return chai.request(app)
        .delete(`/contact/${createdContact1.id}`)
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(401);
          expect(result)
            .to.have.property('message')
            .to.equal('Authentication failed! Please send a token');
        });
    });

    it('should delete if token is invalid', () => {
      return chai.request(app)
        .delete(`/contact/${createdContact1.id}`)
        .set('token', 'invalidtoken')
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(401);
          expect(result)
            .to.have.property('message')
            .to.equal('Authentication failed! Invalid token');
        });
    });

    it('should delete contact', () => {
      return chai.request(app)
        .delete(`/contact/${createdContact1.id}`)
        .set('token', createdUser.token)
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(200);
          expect(result)
            .to.have.property('message')
            .to.equal('Contact successfully deleted');
        });
    });

    it('should not delete contact that does not exist', () => {
      return chai.request(app)
        .delete(`/contact/${createdContact1.id}`)
        .set('token', createdUser.token)
        .then(res => {
          const result = { ...res.body };
          expect(res.status).to.equal(404);
          expect(result)
            .to.have.property('message')
            .to.equal('Contact not found! No action taken');
        });
    });
  });
});
