import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class PutHashMapDto {
  @ApiProperty({
    name: 'key',
    type: String,
    example: 'test',
    description: 'Key',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Key is too short',
  })
  @MaxLength(255, {
    message: 'Key is too long',
  })
  key: string;

  @ApiProperty({
    name: 'value',
    type: Object,
    example: '{ "foo": "bar" }',
    description: 'Value',
  })
  @IsObject()
  @IsNotEmpty()
  value: any;

  @ApiPropertyOptional({
    name: 'ttl',
    type: Number,
    example: 60,
    description: 'Expiration time in second',
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(31536000) //year
  ttl?: number | undefined;

  constructor(partial: Partial<PutHashMapDto>) {
    Object.assign(this, partial);
  }
}
