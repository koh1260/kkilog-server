import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropNicknamePasswordColumnFromComment1703912932519
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE comment DROP COLUMN nickname, DROP COLUMN password',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE comment ADD COLUMN nickname varchar(10), ADD COLUMN password varchar(6)',
    );
  }
}
