import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnNullabilityFromCategory1704557458370
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE category MODIFY category_name varchar(20) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE category MODIFY category_name varchar(20)',
    );
  }
}
