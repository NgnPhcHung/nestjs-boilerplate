import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserNullableSynctimeColumn1745920440281 implements MigrationInterface {
    name = 'AlterUserNullableSynctimeColumn1745920440281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "last_sync_time" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "last_sync_time" SET NOT NULL`);
    }

}
