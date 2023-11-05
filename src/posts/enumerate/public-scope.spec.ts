import { PublicScope } from './public-scope';

describe('PublicScope ENUM 테스트', () => {
  it('ENUM 데이터 검증', () => {
    expect(PublicScope.values()).toEqual([
      PublicScope.PUBLIC,
      PublicScope.PRIVATE,
    ]);

    expect(PublicScope.PRIVATE.visible).toEqual('PRIVATE');
    expect(PublicScope.PUBLIC.visible).toEqual('PUBLIC');
  });
});
