import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

beforeEach(() => global.env = sinon.sandbox.create());

afterEach(() => global.env.restore());