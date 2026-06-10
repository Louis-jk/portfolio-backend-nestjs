import { IsString } from 'class-validator';

// 문자열 다국어 구조 (예: 프로젝트 이름, 설명 등)
class I18nStringDto {
  @IsString()
  ko: string;

  @IsString()
  ja: string;

  @IsString()
  en: string;
}

// 문자열 배열 다국어 구조 (예: 주요 성과, 핵심 기능 리스트 등)
class I18nStringArrayDto {
  @IsString({ each: true })
  ko: string[];

  @IsString({ each: true })
  ja: string[];

  @IsString({ each: true })
  en: string[];
}

export { I18nStringDto, I18nStringArrayDto };
