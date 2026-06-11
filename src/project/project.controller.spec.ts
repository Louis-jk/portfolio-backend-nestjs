jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class MockPrismaService {
    project = {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  },
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

describe('ProjectController', () => {
  let controller: ProjectController;
  let createMock: jest.SpiedFunction<
    (args: { data: unknown }) => Promise<unknown>
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectService, PrismaService],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    const prismaService = module.get(PrismaService);
    createMock = jest.spyOn(prismaService.project, 'create');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const createProjectDto: CreateProjectDto = {
        sortOrder: 1,
        imageUrl: 'https://test.com',
        startDate: '2026-01-01',
        endDate: '2026-01-01',
        isPublic: true,
        technologies: ['테스트 기술'],
        platformCategories: ['테스트 플랫폼'],
        domainTags: ['테스트 도메인'],
        title: {
          ko: '테스트 프로젝트',
          ja: 'テストプロジェクト',
          en: 'Test Project',
        },
        company: { ko: '테스트 회사', ja: 'テスト会社', en: 'Test Company' },
        region: { ko: '대한민국', ja: '韓国', en: 'South Korea' },
        role: { ko: '테스트 역할', ja: 'テスト役割', en: 'Test Role' },
        overview: { ko: '테스트 소개', ja: 'テスト紹介', en: 'Test Overview' },
        description: {
          ko: ['테스트 설명', '테스트 성과'],
          ja: ['テスト説明', 'テスト成果'],
          en: ['Test Description', 'Test Achievements'],
        },
        challenges: {
          ko: ['테스트 도전', '테스트 도전 성과'],
          ja: ['テスト挑戦', 'テスト挑戦成果'],
          en: ['Test Challenges', 'Test Challenges Achievements'],
        },
        achievements: {
          ko: ['테스트 성과', '테스트 성과 성과'],
          ja: ['テスト成果', 'テスト成果成果'],
          en: ['Test Achievements', 'Test Achievements Achievements'],
        },
        platforms: {
          webLink: 'https://test.com',
          iosLink: 'https://test.com',
          androidLink: 'https://test.com',
          desktopLink: 'https://test.com',
        },
        tools: {
          development: ['테스트 개발', '테스트 개발 도구'],
          communication: ['테스트 커뮤니케이션', '테스트 커뮤니케이션 도구'],
          design: ['테스트 디자인', '테스트 디자인 도구'],
          debugging: ['테스트 디버깅', '테스트 디버깅 도구'],
        },
      };
      const createdProject = { id: 1, ...createProjectDto };
      createMock.mockResolvedValue(createdProject);

      const result = await controller.create(createProjectDto);

      expect(result).toEqual(createdProject);
      expect(createMock).toHaveBeenCalled();
    });
  });
});
