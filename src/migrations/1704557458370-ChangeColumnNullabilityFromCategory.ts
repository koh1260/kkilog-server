import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnNullabilityFromCategory1704557458370
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE categorie MODIFY category_name VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE categorie MODIFY category_name VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
    );
  }
}
