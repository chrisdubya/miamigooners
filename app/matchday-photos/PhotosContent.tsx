'use client'
import {useState, useMemo} from 'react'
import {PhotosHero} from '../../src/PhotosHero'
import {PhotosFilterBar} from '../../src/PhotosFilterBar'
import {PhotoGrid} from '../../src/PhotoGrid'
import {PhotoLightbox} from '../../src/PhotoLightbox'
import {Footer} from '../../src/Footer'
import type {PhotosData, PhotoItem} from '../../src/types/photos'

interface PhotosContentProps {
  data: PhotosData
}

export default function PhotosContent({data}: PhotosContentProps) {
  const nonEmptyMatches = useMemo(
    () => data.matches.filter((m) => m.files.length > 0),
    [data.matches]
  )

  const [filter, setFilter] = useState('all')
  const [openPhoto, setOpenPhoto] = useState<PhotoItem | null>(null)

  const photoItems: PhotoItem[] = useMemo(() => {
    return nonEmptyMatches.flatMap((match) =>
      match.files.map((file) => ({
        ...file,
        matchId: match.id,
        matchLabel: match.label,
        matchDate: match.date,
        teamColor: match.teamColor,
        competition: match.competition,
        aspect: file.imageMediaMetadata
          ? file.imageMediaMetadata.width / file.imageMediaMetadata.height
          : file.videoMediaMetadata
            ? file.videoMediaMetadata.width / file.videoMediaMetadata.height
            : 1.5,
      }))
    )
  }, [nonEmptyMatches])

  const totals: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const match of nonEmptyMatches) {
      counts[match.id] = match.files.length
    }
    return counts
  }, [nonEmptyMatches])

  const visible: PhotoItem[] = useMemo(() => {
    const items =
      filter === 'all'
        ? photoItems
        : photoItems.filter((p) => p.matchId === filter)
    return [...items].sort(
      (a, b) =>
        new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
    )
  }, [photoItems, filter])

  return (
    <>
      <PhotosHero stats={data.stats} sharedFolderLink={data.sharedFolderLink} />
      <PhotosFilterBar
        matches={nonEmptyMatches}
        activeFilter={filter}
        onFilterChange={setFilter}
        totals={totals}
      />
      <PhotoGrid photos={visible} onOpen={setOpenPhoto} />
      <PhotoLightbox
        photo={openPhoto}
        photos={visible}
        matches={nonEmptyMatches}
        onClose={() => setOpenPhoto(null)}
        onNavigate={setOpenPhoto}
      />
      <Footer />
    </>
  )
}
