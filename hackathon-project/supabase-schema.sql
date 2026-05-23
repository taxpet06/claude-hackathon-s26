CREATE TABLE IF NOT EXISTS community_songs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  creator_name TEXT NOT NULL DEFAULT 'Anonymous',
  audio_url    TEXT NOT NULL,
  stems_used   JSONB NOT NULL DEFAULT '[]',
  play_count   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_songs_created_at
  ON community_songs(created_at DESC);
