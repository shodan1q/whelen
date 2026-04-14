-- CreateTable
CREATE TABLE "ConversationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "agentId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "agentsUsed" TEXT[],
    "executionTime" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'success',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ConversationLog_agentId_createdAt_idx" ON "ConversationLog"("agentId", "createdAt");

-- CreateIndex
CREATE INDEX "ConversationLog_userId_createdAt_idx" ON "ConversationLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ConversationLog_createdAt_idx" ON "ConversationLog"("createdAt");
