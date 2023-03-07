import { HashMap } from './entities/hash-map.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PutHashMapDto } from './dto/put-hash-map.dto';
import { Repository } from 'typeorm';

@Injectable()
export class HashMapService {
  constructor(
    @InjectRepository(HashMap)
    private dbRepository: Repository<HashMap>,
  ) {}

  async putEntry(putHashMapDto: PutHashMapDto) {
    const { key, value, ttl } = putHashMapDto;

    const hash = this.getHash(key);
    const expiredAt = ttl ? this.getExpiredAtTimeByTTL(ttl) : null;

    const candidate = new HashMap({ hash, key, value, expiredAt });

    const existRecord = await this.findRecordByKeyAndHash(key, hash);
    if (existRecord) candidate.id = existRecord.id;

    return await this.dbRepository.save(candidate);
  }

  async getEntry(key: string): Promise<HashMap | null> {
    const hash = this.getHash(key);
    const record = await this.findRecordByKeyAndHash(key, hash);
    if (record && record.isExpired) {
      await this.dbRepository.delete(record.id);
      return null;
    }
    return record;
  }

  private async findRecordByKeyAndHash(
    key: string,
    hash: string,
  ): Promise<HashMap | null> {
    return await this.dbRepository.findOneBy({
      hash,
      key,
    });
  }

  private getHash(key: string): string {
    let hashValue = 0;

    for (let index = 0; index < key.length; index++) {
      const charCode = key.charCodeAt(index);
      hashValue += charCode;
      // hashValue += charCode << (index * 8);
    }

    return `${hashValue}`;
  }

  private getExpiredAtTimeByTTL(ttl: number): Date | null {
    if (typeof ttl !== 'number' || ttl <= 0) return null;
    const timestamp = new Date().valueOf() + ttl * 1000;
    return new Date(timestamp);
  }
}
