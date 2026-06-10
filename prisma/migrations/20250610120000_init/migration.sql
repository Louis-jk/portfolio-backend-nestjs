-- CreateExtension
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop legacy PascalCase table (empty dev data)
DROP TABLE IF EXISTS "Project";

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "technologies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "platform_categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "domain_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "title" JSONB NOT NULL,
    "company" JSONB NOT NULL,
    "role" JSONB NOT NULL,
    "overview" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "challenges" JSONB NOT NULL,
    "achievements" JSONB NOT NULL,
    "platforms" JSONB NOT NULL,
    "tools" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "portfolio_documents" (
    "id" BIGSERIAL NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" INTEGER NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "portfolio_documents_source_idx" ON "portfolio_documents"("source_type", "source_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "portfolio_documents_source_unique" ON "portfolio_documents"("source_type", "source_id", "locale");
