import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  IsBoolean,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  I18nStringDto,
  I18nStringArrayDto,
  type I18nString,
  type I18nStringArray,
} from './i18n-string.dto';

export interface Platforms {
  webLink?: string;
  iosLink?: string;
  androidLink?: string;
  desktopLink?: string;
  [key: string]: string | undefined;
}

export interface Tools {
  development?: string[];
  communication?: string[];
  design?: string[];
  debugging?: string[];
  [key: string]: string[] | undefined;
}

class PlatformsDto {
  @IsUrl() @IsOptional() webLink?: string;
  @IsUrl() @IsOptional() iosLink?: string;
  @IsUrl() @IsOptional() androidLink?: string;
  @IsUrl() @IsOptional() desktopLink?: string;
}

class ToolsDto {
  @IsString({ each: true }) @IsOptional() development?: string[];
  @IsString({ each: true }) @IsOptional() communication?: string[];
  @IsString({ each: true }) @IsOptional() design?: string[];
  @IsString({ each: true }) @IsOptional() debugging?: string[];
}

export class CreateProjectDto {
  @IsInt()
  @IsOptional()
  sortOrder?: number; // 정렬 순서

  @IsUrl()
  imageUrl: string;

  @IsString()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean; // 공개 여부

  @IsArray()
  @IsString({ each: true })
  technologies: string[]; // 기술 스택 (예: ['react', 'next.js', 'nest.js'] 등)

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  platformCategories?: string[]; // 플랫폼 카테고리 (예: ['web', 'mobile', 'desktop'] 등)

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  domainTags?: string[]; // 도메인 태그 (예: ['ai', 'blockchain'] 등)

  @IsObject()
  @ValidateNested()
  @Type(() => I18nStringDto)
  title: I18nString;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nStringDto)
  company: I18nString;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nStringDto)
  region: I18nString;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nStringDto)
  role: I18nString;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nStringDto)
  overview: I18nString;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nStringArrayDto)
  description: I18nStringArray;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nStringArrayDto)
  challenges: I18nStringArray;

  @IsObject()
  @ValidateNested()
  @Type(() => I18nStringArrayDto)
  achievements: I18nStringArray;

  @IsObject()
  @ValidateNested()
  @Type(() => PlatformsDto)
  platforms: Platforms;

  @IsObject()
  @ValidateNested()
  @Type(() => ToolsDto)
  tools: Tools;
}
