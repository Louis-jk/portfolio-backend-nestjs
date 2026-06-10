import { IsNotEmpty, IsString } from 'class-validator';

// 문자열 다국어 구조 (예: 프로젝트 이름, 설명 등)
export class I18nStringDto {
  @IsString()
  @IsNotEmpty()
  ko: string;

  @IsString()
  @IsNotEmpty()
  ja: string;

  @IsString()
  @IsNotEmpty()
  en: string;
}

// 문자열 배열 다국어 구조 (예: 주요 성과, 핵심 기능 리스트 등)
export class I18nStringArrayDto {
  @IsString({ each: true })
  @IsNotEmpty()
  ko: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  ja: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  en: string[];
}
