import { applyDecorators } from '@nestjs/common';
import { Field, FieldOptions } from '@nestjs/graphql';
import { Column, ColumnOptions } from 'typeorm';

interface EntityPropertyOpts {
  field?: FieldOptions;
  column?: ColumnOptions;
}

export function EntityProperty({ field, column }: EntityPropertyOpts) {
  return applyDecorators(Field({ ...field }), Column({ ...column }));
}
