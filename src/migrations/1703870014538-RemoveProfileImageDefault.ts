import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveProfileImageDefault1703870014538
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user MODIFY COLUMN profile_image text NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user MODIFY COLUMN profile_image text NOT NULL',
    );
  }
}
