import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserRemoveRoleId1745729296088 implements MigrationInterface {
    name = 'AlterUserRemoveRoleId1745729296088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "role_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "role_id" integer NOT NULL`);
    }

}
