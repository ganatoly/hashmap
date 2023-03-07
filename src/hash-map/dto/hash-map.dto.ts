import { ApiProperty } from '@nestjs/swagger';

export class HashMapDto {
  @ApiProperty({
    name: 'key',
    type: String,
    example: 'test',
    description: 'Key',
  })
  key: string;

  @ApiProperty({
    name: 'value',
    type: Object,
    example: '{ "foo": "bar" }',
    description: 'Value',
  })
  value: any;

  constructor(partial: Partial<HashMapDto>) {
    Object.assign(this, partial);
  }
}
