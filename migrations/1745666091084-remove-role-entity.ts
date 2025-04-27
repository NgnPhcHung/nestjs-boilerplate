import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRoleEntity1745666091084 implements MigrationInterface {
    name = 'RemoveRoleEntity1745666091084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_a7a17a5de646d47a5e2c42833b2"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "note" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."user_entity_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "role" "public"."user_entity_role_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "role_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "role_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_entity_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_a7a17a5de646d47a5e2c42833b2" FOREIGN KEY ("role_id") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
