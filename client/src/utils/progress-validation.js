export const validateProgress = (progress, show) => {
  progress.season = Math.max(progress.season, 0)

  const season_index = Math.min(show.seasons.length - 1, Math.max(progress.season, 0))
  const season_count = show.seasons.length

  if (progress.episode >= show.seasons[season_index].episode_count) {
    progress.episode = 0
    progress.season = Math.min(show.seasons.length, progress.season + 1)
  }


  if (progress.episode < 0 && progress.season > 0) {
    progress.season = Math.max(progress.season - 1, 0)
    progress.episode = show.seasons[Math.max(progress.season, 0)].episode_count - 1
  }

  progress.season = Math.min(progress.season, season_count)
  progress.episode = Math.min(progress.episode, show.seasons[Math.max(Math.min(progress.season, season_count - 1), 0)].episode_count)
  progress.episode = Math.max(progress.episode, 0)

  if (progress.season === season_count)
    progress.episode = 0

  return progress
}