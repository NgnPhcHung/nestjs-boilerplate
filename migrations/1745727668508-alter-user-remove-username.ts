import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserRemoveUsername1745727668508 implements MigrationInterface {
    name = 'AlterUserRemoveUsername1745727668508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "note"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "note" character varying`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "username" character varying NOT NULL`);
    }

}
