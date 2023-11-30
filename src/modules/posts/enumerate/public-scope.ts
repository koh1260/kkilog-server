import { Enum, EnumType } from 'ts-jenum';

@Enum('visible')
export class PublicScope extends EnumType<PublicScope>() {
  static readonly PUBLIC = new PublicScope(1, 'PUBLIC');
  static readonly PRIVATE = new PublicScope(2, 'PRIVATE');

  private constructor(readonly num: number, readonly visible: string) {
    super();
  }
}
