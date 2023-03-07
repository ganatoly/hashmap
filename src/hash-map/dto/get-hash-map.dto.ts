import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class GetHashMapDto {
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

  constructor(partial: Partial<GetHashMapDto>) {
    Object.assign(this, partial);
  }
}
