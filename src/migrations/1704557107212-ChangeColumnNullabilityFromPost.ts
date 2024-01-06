import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeColumnNullabilityFromPost1704557107212
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE post MODIFY title VARCHAR(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE post MODIFY content TEXT NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE post MODIFY introduction VARCHAR(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE post MODIFY title VARCHAR(255)`);
    await queryRunner.query(`ALTER TABLE post MODIFY content TEXT`);
    await queryRunner.query(
      `ALTER TABLE post MODIFY introduction VARCHAR(255)`,
    );
  }
}
