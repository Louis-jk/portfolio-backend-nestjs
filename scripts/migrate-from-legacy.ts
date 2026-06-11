import 'dotenv/config';
import { Client } from 'pg';

interface LegacyProject {
  id: number;
  sortOrder: number;
  imageUrl: string;
  startDate: Date;
  endDate: Date | null;
  isPublic: boolean;
  technologies: string[];
  platformCategories: string[];
  domainTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface LegacyTranslation {
  projectId: number;
  locale: string;
  title: string;
  company: string;
  region: string;
  role: string;
  overview: string;
  description: string[];
  challenges: string[];
  achievements: string[];
}

interface LegacyPlatform {
  projectId: number;
  webLink: string | null;
  iosLink: string | null;
  androidLink: string | null;
  desktopLink: string | null;
}

interface LegacyTools {
  projectId: number;
  development: string[];
  communication: string[];
  design: string[];
  debugging: string[];
}

interface LegacyDocument {
  id: string;
  source_type: string;
  source_id: number;
  locale: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding: string;
  created_at: Date;
  updated_at: Date;
}

interface CountRow {
  c: number;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function pivotStringField(
  translations: LegacyTranslation[],
  field: keyof Pick<
    LegacyTranslation,
    'title' | 'company' | 'region' | 'role' | 'overview'
  >,
): Record<string, string> {
  return Object.fromEntries(
    translations.map((row) => [row.locale, row[field] ?? '']),
  );
}

function pivotArrayField(
  translations: LegacyTranslation[],
  field: keyof Pick<
    LegacyTranslation,
    'description' | 'challenges' | 'achievements'
  >,
): Record<string, string[]> {
  return Object.fromEntries(
    translations.map((row) => [row.locale, row[field] ?? []]),
  );
}

function toPlatforms(
  platform: LegacyPlatform | undefined,
): Record<string, string> {
  if (!platform) {
    return {};
  }

  const links: Record<string, string> = {};
  if (platform.webLink) links.webLink = platform.webLink;
  if (platform.iosLink) links.iosLink = platform.iosLink;
  if (platform.androidLink) links.androidLink = platform.androidLink;
  if (platform.desktopLink) links.desktopLink = platform.desktopLink;
  return links;
}

function toTools(tools: LegacyTools | undefined): Record<string, string[]> {
  if (!tools) {
    return {};
  }

  return {
    development: tools.development ?? [],
    communication: tools.communication ?? [],
    design: tools.design ?? [],
    debugging: tools.debugging ?? [],
  };
}

async function main() {
  if (process.env.MIGRATE_CONFIRM !== 'yes') {
    console.error(
      'Refusing to run without MIGRATE_CONFIRM=yes (this deletes all target data).',
    );
    process.exit(1);
  }

  const legacyUrl = requireEnv('LEGACY_DIRECT_URL');
  const targetUrl = requireEnv('DIRECT_URL');

  const legacy = new Client({ connectionString: legacyUrl });
  const target = new Client({ connectionString: targetUrl });

  await legacy.connect();
  await target.connect();

  try {
    console.log('Reading legacy data...');

    const projectsResult = await legacy.query<LegacyProject>(
      'SELECT id, "sortOrder", "imageUrl", "startDate", "endDate", "isPublic", technologies, "platformCategories", "domainTags", "createdAt", "updatedAt" FROM "Project" ORDER BY id',
    );
    const translationsResult = await legacy.query<LegacyTranslation>(
      'SELECT "projectId", locale, title, company, region, role, overview, description, challenges, achievements FROM "ProjectTranslation" ORDER BY "projectId", locale',
    );
    const platformsResult = await legacy.query<LegacyPlatform>(
      'SELECT "projectId", "webLink", "iosLink", "androidLink", "desktopLink" FROM "ProjectPlatform"',
    );
    const toolsResult = await legacy.query<LegacyTools>(
      'SELECT "projectId", development, communication, design, debugging FROM "ProjectTools"',
    );
    const documentsResult = await legacy.query<LegacyDocument>(
      'SELECT id, source_type, source_id, locale, title, content, metadata, embedding::text AS embedding, created_at, updated_at FROM portfolio_documents ORDER BY id',
    );

    const translationsByProject = new Map<number, LegacyTranslation[]>();
    for (const row of translationsResult.rows) {
      const list = translationsByProject.get(row.projectId) ?? [];
      list.push(row);
      translationsByProject.set(row.projectId, list);
    }

    const platformsByProject = new Map(
      platformsResult.rows.map((row) => [row.projectId, row]),
    );
    const toolsByProject = new Map(
      toolsResult.rows.map((row) => [row.projectId, row]),
    );

    console.log(
      `Legacy: ${projectsResult.rowCount} projects, ${translationsResult.rowCount} translations, ${documentsResult.rowCount} documents`,
    );

    await target.query('BEGIN');

    console.log('Clearing target tables...');
    await target.query('DELETE FROM portfolio_documents');
    await target.query('DELETE FROM projects');

    console.log('Inserting projects...');
    for (const project of projectsResult.rows) {
      const translations = translationsByProject.get(project.id) ?? [];
      if (translations.length === 0) {
        throw new Error(`Project ${project.id} has no translations`);
      }

      const i18n = {
        title: pivotStringField(translations, 'title'),
        company: pivotStringField(translations, 'company'),
        region: pivotStringField(translations, 'region'),
        role: pivotStringField(translations, 'role'),
        overview: pivotStringField(translations, 'overview'),
        description: pivotArrayField(translations, 'description'),
        challenges: pivotArrayField(translations, 'challenges'),
        achievements: pivotArrayField(translations, 'achievements'),
      };

      await target.query(
        `INSERT INTO projects (
          id, sort_order, image_url, start_date, end_date, is_public,
          technologies, platform_categories, domain_tags,
          title, company, region, role, overview,
          description, challenges, achievements,
          platforms, tools, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9,
          $10, $11, $12, $13, $14,
          $15, $16, $17,
          $18, $19, $20, $21
        )`,
        [
          project.id,
          project.sortOrder,
          project.imageUrl,
          project.startDate,
          project.endDate,
          project.isPublic,
          project.technologies,
          project.platformCategories ?? [],
          project.domainTags ?? [],
          JSON.stringify(i18n.title),
          JSON.stringify(i18n.company),
          JSON.stringify(i18n.region),
          JSON.stringify(i18n.role),
          JSON.stringify(i18n.overview),
          JSON.stringify(i18n.description),
          JSON.stringify(i18n.challenges),
          JSON.stringify(i18n.achievements),
          JSON.stringify(toPlatforms(platformsByProject.get(project.id))),
          JSON.stringify(toTools(toolsByProject.get(project.id))),
          project.createdAt,
          project.updatedAt,
        ],
      );
    }

    console.log('Inserting portfolio_documents...');
    for (const doc of documentsResult.rows) {
      await target.query(
        `INSERT INTO portfolio_documents (
          id, source_type, source_id, locale, title, content, metadata, embedding, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::vector, $9, $10)`,
        [
          doc.id,
          doc.source_type,
          doc.source_id,
          doc.locale,
          doc.title,
          doc.content,
          JSON.stringify(doc.metadata),
          doc.embedding,
          doc.created_at,
          doc.updated_at,
        ],
      );
    }

    await target.query(
      "SELECT setval(pg_get_serial_sequence('projects', 'id'), COALESCE((SELECT MAX(id) FROM projects), 1))",
    );
    await target.query(
      "SELECT setval(pg_get_serial_sequence('portfolio_documents', 'id'), COALESCE((SELECT MAX(id) FROM portfolio_documents), 1))",
    );

    await target.query('COMMIT');

    const projectCount = await target.query<CountRow>(
      'SELECT COUNT(*)::int AS c FROM projects',
    );
    const docCount = await target.query<CountRow>(
      'SELECT COUNT(*)::int AS c FROM portfolio_documents',
    );

    console.log(
      `Migration complete: ${projectCount.rows[0]?.c ?? 0} projects, ${docCount.rows[0]?.c ?? 0} documents`,
    );
  } catch (error) {
    await target.query('ROLLBACK');
    throw error;
  } finally {
    await legacy.end();
    await target.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
