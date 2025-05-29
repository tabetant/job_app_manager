import { pgTable, serial, text, date, pgEnum, varchar } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('status', ['applied', 'interview', 'offer', 'rejected']);

export const applications = pgTable('applications', {
    id: serial('id').primaryKey(),
    jobTitle: varchar('job_title', { length: 255 }).notNull(),
    company: varchar('company', { length: 255 }).notNull(),
    dateApplied: date('date_applied').defaultNow(),
    status: statusEnum('status').notNull(),
    notes: text('notes'),
});
