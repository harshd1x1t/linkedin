const request = require('supertest');
const chai = require('chai');
const fs = require('fs');
const path = require('path');
const sinon = require('sinon');

const expect = chai.expect;
const app = require('../server');

const DATA_FILE = path.join(__dirname, '../storage/profile.json');

describe('Profile API Endpoints', () => {
  let readFileSyncStub;
  let writeFileSyncStub;
  let existsSyncStub;

  beforeEach(() => {
    // Stub filesystem methods
    existsSyncStub = sinon.stub(fs, 'existsSync');
    readFileSyncStub = sinon.stub(fs, 'readFileSync');
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');
  });

  afterEach(() => {
    sinon.restore();
  });

  // describe('POST /api/profile/save', () => {
  //   it('should save profile data successfully', async () => {
  //     const profile = { name: 'John Doe', experience: '5 years' };

  //     existsSyncStub.returns(true);
  //     readFileSyncStub.returns(JSON.stringify([]));
  //     writeFileSyncStub.returns();

  //     const res = await request(app)
  //       .post('/api/profile/save')
  //       .send(profile); // no charset specified

  //     expect(res.status).to.equal(200);
  //     expect(res.text).to.equal('Profile saved successfully');
  //     expect(writeFileSyncStub.calledOnce).to.be.true;
  //   });

  //   it('should return 400 if profile data is incomplete', async () => {
  //     const res = await request(app)
  //       .post('/api/profile/save')
  //       .send({ name: 'John Doe' }); // missing 'experience'

  //     expect(res.status).to.equal(400);
  //     expect(res.text).to.equal('Incomplete profile data');
  //   });
  // });

  describe('GET /api/profile/all', () => {
    it('should return all saved profiles', async () => {
      const fakeProfiles = [
        { name: 'Alice', experience: '3 years' },
        { name: 'Bob', experience: '2 years' }
      ];

      existsSyncStub.returns(true);
      readFileSyncStub.returns(JSON.stringify(fakeProfiles));

      const res = await request(app).get('/api/profile/all');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
      expect(res.body[0].name).to.equal('Alice');
    });

    it('should return empty array if no file exists', async () => {
      existsSyncStub.returns(false);

      const res = await request(app).get('/api/profile/all');

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });
  });
});
