import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Project } from '../../generated/prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  private toCreateInput(dto: CreateProjectDto): Prisma.ProjectCreateInput {
    return {
      sortOrder: dto.sortOrder,
      imageUrl: dto.imageUrl,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      isPublic: dto.isPublic,
      technologies: dto.technologies,
      platformCategories: dto.platformCategories ?? [],
      domainTags: dto.domainTags ?? [],
      title: dto.title,
      company: dto.company,
      region: dto.region,
      role: dto.role,
      overview: dto.overview,
      description: dto.description,
      challenges: dto.challenges,
      achievements: dto.achievements,
      platforms: dto.platforms,
      tools: dto.tools,
    };
  }

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: this.toCreateInput(createProjectDto),
    });
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new Error('Project not found');
    }
    return await this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
    });
  }

  async remove(id: number): Promise<void> {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new Error('Project not found');
    }
    await this.prisma.project.delete({ where: { id } });
  }
}
