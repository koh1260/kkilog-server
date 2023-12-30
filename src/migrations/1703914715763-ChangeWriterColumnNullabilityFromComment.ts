import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeWriterColumnNullabilityFromComment1703914715763
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE comment MODIFY COLUMN writer_id int(11) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE comment MODIFY COLUMN writer_id int(11)',
    );
  }
}
