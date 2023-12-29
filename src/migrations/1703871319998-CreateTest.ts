import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTest1703871319998 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE test (id varchar(255), email varchar(255))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE test');
  }
}
