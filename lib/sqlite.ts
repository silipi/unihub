import { mkdir } from "node:fs/promises";
import path from "node:path";
import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite";
import { deadlines, events, resources, student, subjects } from "@/lib/mock-data";

type SQLiteDb = Database<sqlite3.Database, sqlite3.Statement>;

let dbPromise: Promise<SQLiteDb> | null = null;

function toSqliteBoolean(value: boolean): number {
  return value ? 1 : 0;
}

function fromSqliteBoolean(value: number): boolean {
  return value === 1;
}

async function seedDatabase(db: SQLiteDb) {
  const row = await db.get<{ total: number }>("SELECT COUNT(*) AS total FROM students");
  if ((row?.total ?? 0) > 0) {
    return;
  }

  await db.run(
    `INSERT INTO students (
      id, name, initials, course, semester, matricula, university, campus, cr, ira, hours_completed, hours_required, avatar_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    "1",
    student.name,
    student.initials,
    student.course,
    student.semester,
    student.matricula,
    student.university,
    student.campus,
    student.cr,
    student.ira,
    student.hoursCompleted,
    student.hoursRequired,
    student.avatarUrl,
  );

  for (const subject of subjects) {
    await db.run(
      `INSERT INTO subjects (
        id, code, name, professor, grade, grade_partial, frequency, frequency_required, credits, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      subject.id,
      subject.code,
      subject.name,
      subject.professor,
      subject.grade,
      subject.gradePartial,
      subject.frequency,
      subject.frequencyRequired,
      subject.credits,
      subject.status,
    );
  }

  for (const event of events) {
    await db.run(
      `INSERT INTO events (
        id, title, type, date, time, location, description, tags, is_recommended, is_registered, organizer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      event.id,
      event.title,
      event.type,
      event.date,
      event.time,
      event.location,
      event.description,
      JSON.stringify(event.tags),
      toSqliteBoolean(event.isRecommended),
      toSqliteBoolean(event.isRegistered),
      event.organizer,
    );
  }

  for (const resource of resources) {
    await db.run(
      `INSERT INTO resources (
        id, title, type, subject, subject_code, professor, year, semester, size, downloads, uploaded_by, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      resource.id,
      resource.title,
      resource.type,
      resource.subject,
      resource.subjectCode,
      resource.professor,
      resource.year ?? null,
      resource.semester ?? null,
      resource.size,
      resource.downloads,
      resource.uploadedBy,
      JSON.stringify(resource.tags),
    );
  }

  for (const deadline of deadlines) {
    await db.run(
      `INSERT INTO deadlines (id, title, date, subject, urgent) VALUES (?, ?, ?, ?, ?)`,
      deadline.id,
      deadline.title,
      deadline.date,
      deadline.subject,
      toSqliteBoolean(deadline.urgent),
    );
  }
}

async function initializeDatabase(db: SQLiteDb) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      initials TEXT NOT NULL,
      course TEXT NOT NULL,
      semester INTEGER NOT NULL,
      matricula TEXT NOT NULL,
      university TEXT NOT NULL,
      campus TEXT NOT NULL,
      cr REAL NOT NULL,
      ira REAL NOT NULL,
      hours_completed INTEGER NOT NULL,
      hours_required INTEGER NOT NULL,
      avatar_url TEXT
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      professor TEXT NOT NULL,
      grade REAL,
      grade_partial REAL,
      frequency INTEGER NOT NULL,
      frequency_required INTEGER NOT NULL,
      credits INTEGER NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      tags TEXT NOT NULL,
      is_recommended INTEGER NOT NULL,
      is_registered INTEGER NOT NULL,
      organizer TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      subject TEXT NOT NULL,
      subject_code TEXT NOT NULL,
      professor TEXT NOT NULL,
      year INTEGER,
      semester TEXT,
      size TEXT NOT NULL,
      downloads INTEGER NOT NULL,
      uploaded_by TEXT NOT NULL,
      tags TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS deadlines (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      subject TEXT NOT NULL,
      urgent INTEGER NOT NULL
    );
  `);
}

async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const dbDir = path.join(process.cwd(), "data");
      await mkdir(dbDir, { recursive: true });

      const db = await open({
        filename: path.join(dbDir, "unihub.db"),
        driver: sqlite3.Database,
      });

      await initializeDatabase(db);
      await seedDatabase(db);
      return db;
    })();
  }

  return dbPromise;
}

export async function getStudent() {
  const db = await getDb();
  const row = await db.get<{
    id: string;
    name: string;
    initials: string;
    course: string;
    semester: number;
    matricula: string;
    university: string;
    campus: string;
    cr: number;
    ira: number;
    hours_completed: number;
    hours_required: number;
    avatar_url: string | null;
  }>("SELECT * FROM students LIMIT 1");

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    course: row.course,
    semester: row.semester,
    matricula: row.matricula,
    university: row.university,
    campus: row.campus,
    cr: row.cr,
    ira: row.ira,
    hoursCompleted: row.hours_completed,
    hoursRequired: row.hours_required,
    avatarUrl: row.avatar_url,
  };
}

export async function getSubjects() {
  const db = await getDb();
  const rows = await db.all<
    Array<{
      id: string;
      code: string;
      name: string;
      professor: string;
      grade: number | null;
      grade_partial: number | null;
      frequency: number;
      frequency_required: number;
      credits: number;
      status: "ok" | "alert" | "danger";
    }>
  >("SELECT * FROM subjects ORDER BY code ASC");

  return rows.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    professor: row.professor,
    grade: row.grade,
    gradePartial: row.grade_partial,
    frequency: row.frequency,
    frequencyRequired: row.frequency_required,
    credits: row.credits,
    status: row.status,
  }));
}

export async function getEvents() {
  const db = await getDb();
  const rows = await db.all<
    Array<{
      id: string;
      title: string;
      type: "semana-academica" | "workshop" | "palestra" | "monitoria" | "congresso";
      date: string;
      time: string;
      location: string;
      description: string;
      tags: string;
      is_recommended: number;
      is_registered: number;
      organizer: string;
    }>
  >("SELECT * FROM events ORDER BY date ASC, time ASC");

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    date: row.date,
    time: row.time,
    location: row.location,
    description: row.description,
    tags: JSON.parse(row.tags) as string[],
    isRecommended: fromSqliteBoolean(row.is_recommended),
    isRegistered: fromSqliteBoolean(row.is_registered),
    organizer: row.organizer,
  }));
}

export async function getResources() {
  const db = await getDb();
  const rows = await db.all<
    Array<{
      id: string;
      title: string;
      type: "prova" | "resumo" | "videoaula" | "material" | "slide";
      subject: string;
      subject_code: string;
      professor: string;
      year: number | null;
      semester: string | null;
      size: string;
      downloads: number;
      uploaded_by: string;
      tags: string;
    }>
  >("SELECT * FROM resources ORDER BY downloads DESC");

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    subject: row.subject,
    subjectCode: row.subject_code,
    professor: row.professor,
    year: row.year ?? undefined,
    semester: row.semester ?? undefined,
    size: row.size,
    downloads: row.downloads,
    uploadedBy: row.uploaded_by,
    tags: JSON.parse(row.tags) as string[],
  }));
}

export async function getDeadlines() {
  const db = await getDb();
  const rows = await db.all<
    Array<{
      id: string;
      title: string;
      date: string;
      subject: string;
      urgent: number;
    }>
  >("SELECT * FROM deadlines ORDER BY date ASC");

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    date: row.date,
    subject: row.subject,
    urgent: fromSqliteBoolean(row.urgent),
  }));
}
