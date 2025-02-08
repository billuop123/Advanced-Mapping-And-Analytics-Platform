-- CreateEnum
CREATE TYPE "ShapeType" AS ENUM ('RECTANGLE', 'POLYGON', 'CIRCLE', 'POLYLINE');

-- CreateTable
CREATE TABLE "Shape" (
    "id" SERIAL NOT NULL,
    "type" "ShapeType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rectangle" (
    "id" SERIAL NOT NULL,
    "shapeId" INTEGER NOT NULL,
    "bounds" JSONB NOT NULL,

    CONSTRAINT "Rectangle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Polygon" (
    "id" SERIAL NOT NULL,
    "shapeId" INTEGER NOT NULL,
    "coords" JSONB NOT NULL,

    CONSTRAINT "Polygon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circle" (
    "id" SERIAL NOT NULL,
    "shapeId" INTEGER NOT NULL,
    "center" JSONB NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Circle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Polyline" (
    "id" SERIAL NOT NULL,
    "shapeId" INTEGER NOT NULL,
    "coords" JSONB NOT NULL,

    CONSTRAINT "Polyline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rectangle_shapeId_key" ON "Rectangle"("shapeId");

-- CreateIndex
CREATE UNIQUE INDEX "Polygon_shapeId_key" ON "Polygon"("shapeId");

-- CreateIndex
CREATE UNIQUE INDEX "Circle_shapeId_key" ON "Circle"("shapeId");

-- CreateIndex
CREATE UNIQUE INDEX "Polyline_shapeId_key" ON "Polyline"("shapeId");

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rectangle" ADD CONSTRAINT "Rectangle_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Polygon" ADD CONSTRAINT "Polygon_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Circle" ADD CONSTRAINT "Circle_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Polyline" ADD CONSTRAINT "Polyline_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
