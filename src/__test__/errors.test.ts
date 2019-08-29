import sinon from 'sinon';
import * as errors from '../errors';

describe('CodedError', () => {

  class TestCodedError extends errors.CodedError { }

  it('should set property code and call toJSON on use JSON.stringify', () => {
    const error = new TestCodedError('TEST', 'Error test');
    const fakeToJSON = sinon.fake.returns(error.toJSON());
    error.toJSON = fakeToJSON;
    JSON.stringify(error);
    expect(error.code).toEqual('TEST');
    expect(error.message).toEqual('Error test');
  });
});

describe('DetailedCodedError', () => {

  class TestDetailedCodedError extends errors.DetailedCodedError { }

  it('should set property code and call toJSON on use JSON.stringify', () => {
    const error = new TestDetailedCodedError('TEST', 'Error test', { message: 'Ola mundo' });
    const fakeToJSON = sinon.fake.returns(error.toJSON());
    error.toJSON = fakeToJSON;
    JSON.stringify(error);
    expect(error.code).toEqual('TEST');
    expect(error.message).toEqual('Error test');
    expect(error.details).toEqual({ message: 'Ola mundo' });
  });
});
